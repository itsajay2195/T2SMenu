import { all, put, takeLatest, select, fork } from 'redux-saga/effects';
import { isArrayNonEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { HomeNetwork } from '../Network/HomeNetwork';
import { HOME_TYPE } from './HomeType';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { selectHasUserLoggedIn, selectStoreId } from 't2sbasemodule/Utils/AppSelectors';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { ORDER_MANAGEMENT_TYPE } from 'appmodules/OrderManagementModule/Redux/OrderManagementType';
import { TOTAL_SAVING_TYPE } from 'appmodules/TotalSavingsModule/Redux/TotalSavingsType';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { showReview } from 'appmodules/ReviewModule/Utils/ReviewHelper';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';

export function* makeGetRecentTakeawayCall(action) {
    try {
        const isUserLoggedIn = yield select(selectHasUserLoggedIn);
        if (isUserLoggedIn) {
            const response = yield apiCall(HomeNetwork.getRecentTakeawayCall, action);
            if (isValidElement(response)) {
                yield put({ type: HOME_TYPE.GET_RECENT_TAKEAWAYS_SUCCESS, payload: response });
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        }
    } catch (e) {
        showErrorMessage(e);
    }
}
export function* makeGetFoodhubTotalSavingsCall(action) {
    try {
        const response = yield apiCall(HomeNetwork.getFoodHubTotalSavingsCall, action);
        if (isValidElement(response)) {
            yield put({ type: HOME_TYPE.GET_FOODHUB_TOTALSAVINGS_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makeGetRecentOrdersCall() {
    try {
        const storeID = yield select(selectStoreId);
        const isUserLogin = yield select(selectHasUserLoggedIn);
        let currentRoute = NavigationService?.navigationRef?.current?.getCurrentRoute();

        if (isUserLogin) {
            const response = yield apiCall(HomeNetwork.getRecentOrders, {
                storeID: isValidString(storeID) ? storeID : undefined
            });
            if (isValidElement(response)) {
                if (isArrayNonEmpty(response.data) && showReview(response.data[0])) {
                    if (isValidElement(currentRoute) && currentRoute.name !== SCREEN_OPTIONS.PBL_PAGE_PAYMENT.route_name) {
                        handleNavigation(SCREEN_OPTIONS.QUICK_FEEDBACK.route_name);
                    }
                }
                yield put({ type: HOME_TYPE.GET_RECENT_ORDERS_SUCCESS, payload: response });
                yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: false });
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makeGetAutocompletePlacesCall(action) {
    try {
        const isFuzzySearch = isValidElement(action) && isValidElement(action.isFuzzySearch) && action.isFuzzySearch;
        let response;
        response = yield apiCall(HomeNetwork.fuzzySearchAutoComplete, action);
        if (isValidElement(response)) {
            yield put({
                type: HOME_TYPE.GET_AUTOCOMPLETE_PLACES_SUCCESS,
                payload: isFuzzySearch || isValidElement(response.result) ? response.result : response.data
            });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeGetRecentOrdersAndTakeAways() {
    try {
        yield fork(makeGetRecentOrdersCall);
        yield fork(makeGetRecentTakeawayCall);
    } catch (e) {
        showErrorMessage(e);
    }
}

function* FoodHubHomeSaga() {
    yield all([
        takeLatest(HOME_TYPE.GET_RECENT_TAKEAWAYS, makeGetRecentTakeawayCall),
        takeLatest(HOME_TYPE.GET_RECENT_ORDERS, makeGetRecentOrdersCall),
        takeLatest(HOME_TYPE.GET_AUTOCOMPLETE_PLACES, makeGetAutocompletePlacesCall),
        takeLatest(HOME_TYPE.GET_FOODHUB_TOTALSAVINGS, makeGetFoodhubTotalSavingsCall),
        takeLatest(TOTAL_SAVING_TYPE.REFRESH_FH_HOME_SCREEN_USER_DATA, makeGetRecentOrdersAndTakeAways)
    ]);
}

export default FoodHubHomeSaga;
