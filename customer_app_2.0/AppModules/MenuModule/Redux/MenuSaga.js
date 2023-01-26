import { all, call, fork, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { isNonCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { MenuNetwork } from '../Network/MenuNetwork';
import { MENU_TYPE } from './MenuType';
import {
    addOnsForReorder,
    calculateMenuSyncTime,
    constructItemForBasketRecommendation,
    decompressApiResponse,
    filterCurrentMenu,
    formReOrderItemListData,
    getUIfilteredMenuData
} from '../Utils/MenuHelpers';
import { getCurrentBusinessDay, getCurrentBusinessMoment } from 't2sbasemodule/Utils/DateUtil';
import { selectHasUserLoggedIn, selectStoreConfigResponse, selectStoreId, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { TAKEAWAY_SEARCH_LIST_TYPE } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListType';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { makeGetRecentOrdersCall } from '../../../FoodHubApp/HomeModule/Redux/HomeSaga';
import {
    selectMenuAddOnGroupResponse,
    selectMenuResponse,
    selectRecentOrders,
    selectRecentOrdersOfParticularTakeaway
} from './MenuSelector';
import { HOME_TYPE as FOODHUB_HOME_TYPE } from '../../../FoodHubApp/HomeModule/Redux/HomeType';
import { resetRecommendationAction } from '../../HomeModule/Redux/HomeAction';
import { resetTakeawayRelatedOrderResponse } from '../../../FoodHubApp/HomeModule/Redux/HomeAction';
import { updatePaymentMode } from '../../BasketModule/Redux/BasketSaga';
import { ADDRESS_TYPE } from '../../AddressModule/Redux/AddressType';
import { selectFilteredRecommendation } from '../../HomeModule/Utils/HomeSelector';

export function* filterMenu(action) {
    try {
        const menuResponse = yield select(selectMenuResponse);
        if (isValidElement(menuResponse)) {
            const orderType = yield select(selectOrderType);
            let timezone;
            if (isValidElement(action) && isValidElement(action.timezone)) {
                timezone = action.timezone;
            } else {
                timezone = yield select(selectTimeZone);
            }
            let currentBusinessDay = getCurrentBusinessDay(timezone);
            let currentBusinessMoment = getCurrentBusinessMoment(timezone);
            let filteredMenu = filterCurrentMenu(menuResponse, orderType, currentBusinessDay, currentBusinessMoment);
            let uiFilteredMenu = getUIfilteredMenuData(filteredMenu);
            const menuItems = constructItemForBasketRecommendation(filteredMenu);
            yield put({
                type: MENU_TYPE.GET_FILTERED_MENU_SUCCESS,
                payload: {
                    uiFilteredMenu: uiFilteredMenu,
                    filterMenu: filteredMenu,
                    currentBusinessDay: currentBusinessDay,
                    currentOrderType: orderType,
                    menuItems: menuItems
                }
            });
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
        }
    } catch (e) {
        //Nothing to Handle
        yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
    }
}

export function* makeGetMenuApiCall(storeConfigResponse, fallback = false, isFromRecentTakeaway = false) {
    let decompressedMenuData;
    try {
        const store_id = isValidElement(storeConfigResponse?.id) ? storeConfigResponse.id : yield select(selectStoreId);
        const menuResponse = yield apiCall(fallback ? MenuNetwork.makeGetFallbackMenuCall : MenuNetwork.makeGetMenuCall, { store_id });
        // Get Menu Response
        if (isValidElement(menuResponse) && isValidElement(menuResponse.data)) {
            decompressedMenuData = yield call(decompressApiResponse, menuResponse.data);
            if (isValidElement(decompressedMenuData) && decompressedMenuData.length > 0) {
                yield put({
                    type: MENU_TYPE.GET_MENU_SUCCESS,
                    payload: { menuResponse: decompressedMenuData, syncMenu: calculateMenuSyncTime(storeConfigResponse) }
                });
            } else {
                yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
                return;
            }
        } else {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
            return;
        }
        let timezone = yield select(selectTimeZone, storeConfigResponse);
        yield fork(filterMenu, { timezone: timezone });
        yield fork(makeGetMenuAddonApiCall, {
            storeConfigResponse: storeConfigResponse,
            decompressedMenuData: decompressedMenuData
        });
        // if (isOurRecommendationsEnable(storeConfigResponse?.our_recommendations)) {
        //     yield fork(makeGetOurRecommendations);
        // } else {
        //     yield put({ type: HOME_TYPE.NO_RECOMMENDATIONS, payload: null });
        // }
        if (isFromRecentTakeaway) {
            yield fork(updatePaymentMode);
        }
    } catch (e) {
        if (!fallback) {
            yield* makeGetMenuApiCall(storeConfigResponse, true);
        } else {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
            showErrorMessage(e);
        }
    }
}
function* makeGetMenuAddonApiCall(action, fallback = false) {
    const { storeConfigResponse, decompressedMenuData } = action;
    try {
        yield put({ type: MENU_TYPE.SET_ADDONS_LOADING, payload: true });
        const store_id = yield select(selectStoreId);
        const menuAddOnResponse = yield apiCall(fallback ? MenuNetwork.makeGetFallbackMenuAddOnCall : MenuNetwork.makeGetMenuAddOnCall, {
            store_id
        });
        yield fork(handleMenuAddons, {
            storeConfigResponse: storeConfigResponse,
            decompressedMenuData: decompressedMenuData,
            menuAddOnResponse: menuAddOnResponse
        });
    } catch (e) {
        if (!fallback) {
            yield* makeGetMenuAddonApiCall(action, true);
        }
    }
}
export function* makeMenu(fallback = false) {
    try {
        const store_id = yield select(selectStoreId);
        const storeConfigResponse = yield select(selectStoreConfigResponse);
        const menuResponse = yield apiCall(fallback ? MenuNetwork.makeGetFallbackMenuAddOnCall : MenuNetwork.makeGetMenuCall, { store_id });
        if (isValidElement(menuResponse) && isValidElement(menuResponse.data)) {
            let decompressedData = yield call(decompressApiResponse, menuResponse.data);
            if (isValidElement(decompressedData) && decompressedData.length > 0) {
                yield putResolve({
                    type: MENU_TYPE.GET_MENU_SUCCESS,
                    payload: { menuResponse: decompressedData, syncMenu: calculateMenuSyncTime(storeConfigResponse) }
                });
                let timezone = yield select(selectTimeZone, storeConfigResponse);
                //Don't change this to fork because we're reading it from the state in the next line of this calling method
                yield call(filterMenu, { timezone: timezone });
            }
        }
    } catch (e) {
        if (!fallback) {
            yield* makeMenu(true);
        } else {
            showErrorMessage(e);
        }
    }
}
export function* makeMenuAddons(fallback = false) {
    try {
        //TODO we need to check whether we should update the recent orders data from here or not.
        // Note: Before that it was not handled
        const store_id = yield select(selectStoreId);
        const menuAddOnResponse = yield apiCall(fallback ? MenuNetwork.makeGetFallbackMenuAddOnCall : MenuNetwork.makeGetMenuAddOnCall, {
            store_id
        });
        yield fork(handleMenuAddons, { storeConfigResponse: null, decompressedMenuData: null, menuAddOnResponse: menuAddOnResponse });
    } catch (e) {
        if (!fallback) {
            yield* makeMenuAddons(true);
        } else {
            showErrorMessage(e);
        }
    }
}
function* handleMenuAddons(action) {
    const { storeConfigResponse, decompressedMenuData, menuAddOnResponse } = action;
    let decompressedAddonData;
    if (isValidElement(menuAddOnResponse) && isValidElement(menuAddOnResponse.data)) {
        decompressedAddonData = yield call(decompressApiResponse, menuAddOnResponse.data);
        if (isValidElement(decompressedAddonData)) {
            yield put({
                type: MENU_TYPE.GET_MENU_ADD_ON_GROUP_SUCCESS,
                payload: decompressedAddonData
            });
        } else {
            yield put({ type: MENU_TYPE.SET_ADDONS_LOADING, payload: false });
        }
    } else {
        yield put({ type: MENU_TYPE.SET_ADDONS_LOADING, payload: false });
    }
    if (isValidElement(storeConfigResponse) && isValidElement(decompressedMenuData)) {
        yield fork(handleRecentOrders, {
            storeConfigResponse: storeConfigResponse,
            decompressedMenuData: decompressedMenuData
        });
    }
}
function* handleRecentOrders(action) {
    const { storeConfigResponse, decompressedMenuData } = action;
    const isLoggedInUser = yield select(selectHasUserLoggedIn);
    if (isLoggedInUser) {
        let addonArray = [];
        const menuGroupResponse = yield select(selectMenuAddOnGroupResponse);
        if (isValidElement(menuGroupResponse)) {
            addonArray = addOnsForReorder(menuGroupResponse);
        }
        yield call(makeGetRecentOrdersCall);
        yield fork(formReOrderIndividualItem, {
            storeID: storeConfigResponse.id,
            menuResponse: decompressedMenuData,
            addOn: addonArray
        });
    }
}
function* formReOrderIndividualItem(action) {
    try {
        if (isValidElement(action) && isValidElement(action.storeID)) {
            const recentOrderResponse = yield select(selectRecentOrders);
            if (isValidElement(action) && isValidElement(action.menuResponse) && isValidElement(action.addOn)) {
                let output = formReOrderItemListData(action, recentOrderResponse);
                yield put({ type: FOODHUB_HOME_TYPE.MODIFY_RECENT_TAKEAWAY_RESPONSE, payload: output });
            }
        }
    } catch (e) {
        // ignore
    }
}
export function* resetMenuForNonCustomerApp(storeHost) {
    if (isNonCustomerApp()) {
        yield put({ type: MENU_TYPE.RESET_MENU_RESPONSE_ACTION });
        let recentOrders = yield select(selectRecentOrdersOfParticularTakeaway);
        let ourRecommendation = yield select(selectFilteredRecommendation);
        // Check if Recent orders and our Recommendation have been changed From TA to TA. If not same Ta reset the values else retain existing.
        if (
            isValidElement(storeHost) &&
            ((isValidElement(recentOrders?.[0]?.host) && storeHost !== recentOrders[0].host) ||
                (isValidElement(ourRecommendation?.[0]?.host) && storeHost !== ourRecommendation[0].host))
        ) {
            yield all([putResolve(resetRecommendationAction()), putResolve(resetTakeawayRelatedOrderResponse())]);
        }
    }
}

function* updateMenuOrderType(action) {
    if (isValidElement(action?.payload?.isFromMenuScreen) && action.payload.isFromMenuScreen) {
        yield call(filterMenu);
    }
}

function* MenuSaga() {
    yield all([
        takeLatest(ADDRESS_TYPE.UPDATE_NON_BASKET_ORDER_TYPE, updateMenuOrderType),
        takeLatest(MENU_TYPE.RESET_MENU_RELATED_DATA_NON_CUSTOMER_APPS, resetMenuForNonCustomerApp)
    ]);
}

export default MenuSaga;
