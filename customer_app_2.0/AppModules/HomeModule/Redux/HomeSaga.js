import { HomeNetWork } from '../Network/HomeNetwork';
import { all, fork, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { HOME_TYPE } from './HomeType';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { makeGetOrderListCall } from '../../OrderManagementModule/Redux/OrderManagementSaga';
import { makeGetAddressCall } from '../../AddressModule/Redux/AddressSaga';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { selectCountryBaseFeatureGateResponse, selectIsBasketRecommendationEnabled } from '../../BasketModule/Redux/BasketSelectors';
import { getShowRecommendationStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { addOnsForReorder, filterArray, formReOrderItemListData } from '../../MenuModule/Utils/MenuHelpers';
import { selectMenuAddOnGroupResponse, selectMenuResponse } from '../../MenuModule/Redux/MenuSelector';
import {
    selectEnvConfig,
    selectStoreId,
    selectHasUserLoggedIn,
    selectS3Response,
    selectStoreConfigResponse,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import { getCurrentBusinessDay } from 't2sbasemodule/Utils/DateUtil';
import { getCurrentBusinessMoment } from 't2sbasemodule/Utils/DateUtil';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { handleBestSellingAsBasketRecommendations } from '../../BasketModule/Redux/BasketSaga';
import { makeGetRecentOrdersCall } from '../../../FoodHubApp/HomeModule/Redux/HomeSaga';
import { makeStoreConfigCall } from '../../../CustomerApp/Saga/AppSaga';
import { isOurRecommendationsEnable } from '../Utils/HomeHelper';
import { selectUserID } from '../../ProfileModule/Redux/ProfileSelectors';

export function* makeGetPreviousOrders() {
    try {
        yield put({ type: HOME_TYPE.SET_PREVIOUS_ORDER_LOADER, value: true });
        const previousOrderResponse = yield apiCall(HomeNetWork.makeGetPreviousOrdersCall);
        if (isValidElement(previousOrderResponse)) {
            const menu = yield select(selectMenuResponse);
            const menuGroupResponse = yield select(selectMenuAddOnGroupResponse);
            let menuAddOn = [];
            if (isValidElement(menuGroupResponse)) {
                menuAddOn = addOnsForReorder(menuGroupResponse);
            }
            if (isValidElement(menu) && isValidElement(menuAddOn)) {
                let output = formReOrderItemListData({ menuResponse: menu, addOn: menuAddOn }, previousOrderResponse);
                yield put({ type: HOME_TYPE.GET_PREVIOUS_ORDER_SUCCESS, payload: output });
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
        yield put({ type: HOME_TYPE.SET_PREVIOUS_ORDER_LOADER, value: false });
    } catch (e) {
        showErrorMessage(e);
        yield put({ type: HOME_TYPE.SET_PREVIOUS_ORDER_LOADER, value: false });
    }
}

export function* makeGetOurRecommendations() {
    try {
        const countryBaseFeatureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        if (getShowRecommendationStatus(countryBaseFeatureGateResponse)) {
            let obj = {},
                takeawayId,
                customerId;
            takeawayId = yield select(selectStoreId);
            customerId = yield select(selectUserID);
            const configType = yield select(selectEnvConfig);
            obj = {
                takeawayId: takeawayId,
                customerId: customerId,
                configType
            };
            let response = yield apiCall(HomeNetWork.makeGetOurRecommendationsCall, obj);
            if (!isArrayNonEmpty(response?.recommendations)) {
                response = yield apiCall(HomeNetWork.makeGetOurRecommendationsCall, { configType });
                yield putResolve({
                    type: HOME_TYPE.GET_OUR_RECOMMENDATIONS_SUCCESS,
                    payload: response.data
                });
                yield fork(filterOurRecommendations, response.data);
            } else if (isArrayNonEmpty(response?.recommendations)) {
                let ref_id = response.recommendation_id;
                yield putResolve({
                    type: BASKET_TYPE.SET_RECOMENDATION_REF_ID,
                    payload: ref_id.slice(0, 3) + '_basket' + ref_id.slice(3)
                });
                yield putResolve({
                    type: HOME_TYPE.GET_OUR_RECOMMENDATIONS_SUCCESS,
                    payload: response?.recommendations
                });
                yield fork(filterOurRecommendations, response?.recommendations);
            } else {
                yield put({ type: HOME_TYPE.NO_RECOMMENDATIONS, payload: null });
            }
        } else {
            yield put({ type: HOME_TYPE.NO_RECOMMENDATIONS, payload: null });
        }
    } catch (e) {
        yield put({ type: HOME_TYPE.NO_RECOMMENDATIONS, payload: null });
    }
}
export function* makeOurRecommendation(storeConfigResponse) {
    const { our_recommendations } = isValidElement(storeConfigResponse) && storeConfigResponse;
    if (isOurRecommendationsEnable(our_recommendations)) {
        yield fork(makeGetOurRecommendations);
    } else {
        yield put({ type: HOME_TYPE.NO_RECOMMENDATIONS, payload: null });
    }
}

function* dashboardSync() {
    let s3ConfigResponse = yield select(selectS3Response);
    yield* makeStoreConfigCall(s3ConfigResponse);
    let storeConfigResponse = yield select(selectStoreConfigResponse);
    const isUserLoggedIn = yield select(selectHasUserLoggedIn);

    //in case if the storeConfigResponse got failed for any reason we have to call back again
    if (!isValidElement(storeConfigResponse)) {
        yield* makeStoreConfigCall(s3ConfigResponse);
    } else {
        yield* makeOurRecommendation(storeConfigResponse);
    }
    //todo: not getting called the first time. Need to fix this
    yield fork(makeGetCurrentOffersCall);
    if (isUserLoggedIn) {
        yield fork(makeGetOrderListCall);
        yield fork(makeGetPreviousOrders);
        yield fork(makeGetAddressCall);
        yield fork(makeGetRecentOrdersCall);
    }
}

function* hideRating(action) {
    try {
        yield put({ type: HOME_TYPE.CLOSE_RATING_STATUS_SUCCESS, payload: action.payload });
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeGetCurrentOffersCall() {
    //TODO In QA env current offer banners endpoint not yet pushed so we will get the not found/empty error message in dashboard
    try {
        const response = yield apiCall(HomeNetWork.makeGetCurrentOffersCall);
        if (isValidElement(response) && isValidElement(response.data)) {
            yield put({ type: HOME_TYPE.CURRENT_OFFERS_SUCCESS, payload: response.data });
        } else {
            yield put({ type: HOME_TYPE.CURRENT_OFFERS_SUCCESS, payload: [] });
            // showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        yield put({ type: HOME_TYPE.CURRENT_OFFERS_SUCCESS, payload: [] });
        // showErrorMessage(e);
    }
}

export function* filterOurRecommendations(ourRecommendations) {
    const timezone = yield select(selectTimeZone);
    const currentBusinessDay = getCurrentBusinessDay(timezone);
    const currentBusinessMoment = getCurrentBusinessMoment(timezone);
    const orderType = yield select(selectOrderType);
    if (isValidElement(ourRecommendations) && Array.isArray(ourRecommendations) && ourRecommendations.length > 0) {
        const output = filterArray(ourRecommendations, orderType, currentBusinessDay, currentBusinessMoment);
        yield put({ type: HOME_TYPE.FILTER_OUR_RECOMMENDATIONS, payload: output.slice(0, 5) });
    } else {
        yield put({ type: HOME_TYPE.FILTER_OUR_RECOMMENDATIONS, payload: null });
    }
    const isBREnabled = yield select(selectIsBasketRecommendationEnabled);
    if (isBREnabled && isValidElement(ourRecommendations) && ourRecommendations.length > 0) {
        yield fork(handleBestSellingAsBasketRecommendations);
    }
}

function* refreshRecommendation(action) {
    if (isValidElement(action?.ourRecommendations)) {
        yield filterOurRecommendations(action.ourRecommendations);
    }
}

function* HomeSaga() {
    yield all([
        takeLatest(HOME_TYPE.DASHBOARD_SYNC, dashboardSync),
        takeLatest(HOME_TYPE.CLOSE_RATING_STATUS, hideRating),
        takeLatest(HOME_TYPE.GET_MENU_RECOMMENDATION, makeGetOurRecommendations),
        takeLatest(HOME_TYPE.GET_FILTER_MENU_RECOMMENDATION, refreshRecommendation)
    ]);
}

export default HomeSaga;
