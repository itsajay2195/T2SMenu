import { ORDER_MANAGEMENT_TYPE } from './OrderManagementType';
import { OrderManagementNetwork } from '../Network/OrderManagementNetwork';
import {
    getPaymentProvider,
    isBoolean,
    isCustomerApp,
    isNonCustomerApp,
    isValidElement,
    isValidString,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { all, delay, fork, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import {
    checkIfOrderIsApplicableForLiveTrackingCheck,
    checkOrderTypeAvailabilityFromReOrderStoreConfig,
    checkPreOrderAvailabilityFromReOrderStoreConfig,
    getOrderStoreId,
    isDeliverOrder,
    manipulateReceiptResponse
} from '../Utils/OrderManagementHelper';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { selectDeliveryTimeUpdatedOrderData, selectOrderDetailResponse, selectOrderedStoreID } from './OrderManagementSelectors';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { getOrderDetailsAction, getOrderTrackingDetailsAction, makeGetOrderListAction } from './OrderManagementAction';
import {
    isReOrderStoreOpenSelector,
    reOrderStorePreOrderAvailable,
    selectAccountVerified,
    selectHasUserLoggedIn,
    selectLanguageKey,
    selectReOrderStoreConfigResponse,
    selectStoreConfigResponse,
    selectStoreId,
    selectTakeawayListReducer,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import { appBase } from '../../../CustomerApp/Network/AppBaseNetwork';
import {
    getAssociateTakeawayList,
    getFavouriteTakeaway,
    updateStoreID
} from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSaga';
import { makeGetCardDetailsCall, makeGetProfileCall } from '../../ProfileModule/Redux/ProfileSaga';
import { selectUserProfile } from '../../ProfileModule/Redux/ProfileSelectors';
import {
    makeLookupAccountVerifyAction,
    makeLookupLoyaltyPointsCall,
    makeUpdateBasketCall,
    updatePaymentMode
} from '../../BasketModule/Redux/BasketSaga';
import { selectBasketID, selectCartItems, selectCountryBaseFeatureGateResponse } from '../../BasketModule/Redux/BasketSelectors';
import { PUSH_NOTIFICATION_TYPE } from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotificationTypes';
import { isTakeawayBlocked, takeawayBlockedMessage } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { showInformationAlert } from '../../BaseModule/Helper';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { BASKET_UPDATE_TYPE } from '../../BasketModule/Utils/BasketConstants';
import { handleGoBack } from '../../../CustomerApp/Navigation/Helper';
import { makeGetAddressCall } from '../../AddressModule/Redux/AddressSaga';
import {
    deliverTimeRequestOrder,
    getOrderDeliveryTime,
    getOrderDeliveryTimeReqID,
    getOrderTimeZone,
    isRequestedUpdatedDeliveryTime
} from '../../SupportModule/Utils/SupportHelpers';
import { getCurrentMoment } from 't2sbasemodule/Utils/DateUtil';
import { DEFAULT_CHAT_BOT_DURATION } from '../../SupportModule/Utils/SupportConstants';
import { ORDER_STATUS } from '../../BaseModule/BaseConstants';
import { TOTAL_SAVING_TYPE } from '../../TotalSavingsModule/Redux/TotalSavingsType';
import { setLastOrderUserAttributes } from '../../AnalyticsModule/Braze';
import { SAVED_CARD_FROM_SCREEN } from '../../ProfileModule/Utils/ProfileConstants';
import { logStoreConfigResponse } from '../../../CustomerApp/Saga/AppSaga';

export function* makeGetOrderListCall() {
    try {
        const isUserLoggedIn = yield select(selectHasUserLoggedIn);
        if (isUserLoggedIn) {
            const orderListResponse = yield apiCall(OrderManagementNetwork.makeGetOrderListCall);
            if (isValidElement(orderListResponse) && isValidElement(orderListResponse.data)) {
                yield put({ type: ORDER_MANAGEMENT_TYPE.ORDER_LIST_SUCCESS, payload: orderListResponse.data });
                const countryBaseFeatureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
                setLastOrderUserAttributes(orderListResponse.data, countryBaseFeatureGateResponse);
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

//TODO based on the order status we should split the list of response like previous orders and pending orders
function* makeViewAllOrdersCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeViewAllOrdersCall, action);
        if (isValidElement(response)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.VIEW_ALL_ORDERS_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeViewOrderCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeViewOrderCall, action);
        if (isValidElement(response) && isValidElement(response.data)) {
            const data = manipulateReceiptResponse(response.data);
            yield put({ type: ORDER_MANAGEMENT_TYPE.VIEW_ORDER_SUCCESS, payload: data });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}
export function* initiateReOrder(action) {
    try {
        const takeawayListReducer = yield select(selectTakeawayListReducer);
        const languageKey = yield select(selectLanguageKey);
        if (isTakeawayBlocked(action.storeID, takeawayListReducer.associateTakeawayResponse)) {
            NavigationService.goBack(); // Page got struck in Basket screen, so navigating back to previous stack
            NavigationService.dispatch(
                showInformationAlert('', takeawayBlockedMessage(action.storeID, takeawayListReducer.associateTakeawayResponse, languageKey))
            );
            return;
        }
        if (isNonCustomerApp() && isValidElement(action.storeID)) {
            yield updateStoreID(action);
        }
        yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: true });
        const storeConfig = yield apiCall(appBase.makeStoreConfigCall);
        yield fork(logStoreConfigResponse, storeConfig);
        yield putResolve({ type: ORDER_MANAGEMENT_TYPE.UPDATE_REORDER_STORE_CONFIG, payload: storeConfig });
        yield put({ type: TYPES_CONFIG.PREV_STORE_CONFIG_SUCCESS, payload: storeConfig });
        let isTakeawayOpen = yield select(isReOrderStoreOpenSelector);
        let isPreOrderAvailable = yield select(reOrderStorePreOrderAvailable);
        if (!isTakeawayOpen && !isPreOrderAvailable) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.SHOW_TAKEAWAY_CLOSE_MODEL, showTakeawayClosedModal: true });
            return;
        }
        if (
            !checkOrderTypeAvailabilityFromReOrderStoreConfig(action.sending) &&
            !checkPreOrderAvailabilityFromReOrderStoreConfig(action.sending)
        ) {
            //TODO need to check the order type issue while do re order. This is happened very rarely need to track in separate ticket
            yield put({ type: ORDER_MANAGEMENT_TYPE.SHOW_SWITCH_ORDER_TYPE_MODEL, showSwitchOrderTypeModal: true });
            return;
        }
        yield prePareForReOrder(action);
    } catch (e) {
        yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
        yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: false });
        showErrorMessage(e);
    }
}
export function* prePareForReOrder(action) {
    try {
        const basketID = yield select(selectBasketID);
        const cartItems = yield select(selectCartItems);
        if (isValidElement(basketID) && isValidElement(cartItems) && cartItems.length > 0) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.BASKET_CLEAR_MODEL, showReplaceBasketModal: true });
            return;
        }
        yield makeReOrderCall(action);
    } catch (e) {
        yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: false });
        showErrorMessage(e);
        yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
    }
}
//TODO we should pass Order ID
// In response we will get the the resource_id - that is the new cart id.
// If all the business logic's handled, we should call the view basket API with this id
export function* makeReOrderCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeReOrderCall, action);
        if (isValidElement(response) && isValidElement(response.outcome === T2SBaseConstants.SUCCESS)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.RE_ORDER_SUCCESS, payload: response });
            if (response.missing_items.length === 0 && response.added_items.length > 0) {
                const reOrderStoreCOnfig = yield select(selectReOrderStoreConfigResponse);
                yield put({ type: TYPES_CONFIG.STORE_CONFIG_SUCCESS, payload: reOrderStoreCOnfig });
                yield put({ type: ORDER_MANAGEMENT_TYPE.UPDATE_REORDER_STORE_CONFIG, payload: null });
                yield put({ type: BASKET_TYPE.FROM_RE_ORDER_ACTION, payload: true });
                yield fork(makeUpdateBasketCall, { updateType: BASKET_UPDATE_TYPE.VIEW, allergyInfo: '' });
                const accountVerified = yield select(selectAccountVerified);
                const profileResponse = yield select(selectUserProfile);
                if (
                    !(
                        isValidElement(accountVerified) &&
                        isValidString(accountVerified.outcome) &&
                        accountVerified.outcome.toLowerCase() === T2SBaseConstants.SUCCESS.toLowerCase()
                    )
                ) {
                    const responseObj = yield* makeLookupAccountVerifyAction({ phone: profileResponse.phone, isFromReOrder: true });
                    if (!isValidElement(responseObj)) {
                        yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
                        return;
                    }
                }
                yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
                yield put({ type: BASKET_TYPE.QC_AUTO_PRESENT, autoPresentQC: true });
                const storeResponse = yield select(selectStoreConfigResponse);
                yield put({ type: BASKET_TYPE.UPDATE_STORE_ID_INTO_BASKET, payload: storeResponse.id });
                if (isValidElement(profileResponse)) {
                    //Refreshing Profile Data
                    yield* makeGetProfileCall();
                    let provider = getPaymentProvider(storeResponse?.payment_provider);
                    yield* makeGetCardDetailsCall({ provider, fromScreen: SAVED_CARD_FROM_SCREEN.CART });
                    yield fork(updatePaymentMode);
                }
            }
            if (isCustomerApp()) {
                yield fork(makeLookupLoyaltyPointsCall);
            }
        } else {
            handleGoBack();
            yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
        yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: false });
    } catch (e) {
        handleGoBack();
        yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: false });
        showErrorMessage(e);
        yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
    }
}
function* reOrderBasketNavigation(action) {
    try {
        if (isValidElement(action.navigation)) {
            action.navigation.navigate(SCREEN_OPTIONS.BASKET.route_name, { isFromReOrder: true, reOrderActionParams: action });
        }
    } catch (e) {
        yield put({ type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION, payload: false });
        showErrorMessage(e);
    }
}

export function* makeGetOrderDetailsCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeGetOrderDetailsCall, action);
        if (isValidElement(response)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_SUCCESS, payload: response });
            if (isValidElement(response.data)) yield put({ type: ORDER_MANAGEMENT_TYPE.UPDATE_ORDER_LIST, payload: response.data });
            const countryBaseFeatureGate = yield select(selectCountryBaseFeatureGateResponse);
            if (
                isValidElement(action.refreshDriver) &&
                isValidElement(action.orderId) &&
                action.refreshDriver &&
                checkIfOrderIsApplicableForLiveTrackingCheck(response, countryBaseFeatureGate)
            ) {
                yield put(getOrderTrackingDetailsAction(action.orderId));
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeGetOrderTrackingDetailsCall(action) {
    try {
        let storeID;
        if (isNonCustomerApp()) {
            storeID = yield select(selectOrderedStoreID);
        }
        const response = yield apiCall(OrderManagementNetwork.makeGetOrderTrackingDetailsCall, { action, storeID });
        if (isValidElement(response)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.ORDER_TRACKING_DETAILS_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        // showErrorMessage(e); // We should not show error message for order trcking
    }
}

function* makeGetRefundOptionsCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeGetRefundOptionsCall, action);
        if (isValidElement(response)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.GET_REFUND_OPTIONS_SUCCESS, payload: response });
        }
    } catch (e) {
        //Nothing to handle
    }
}

function* makeUpdateRefundMethodCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeUpdateRefundMethodCall, action);
        if (isValidElement(response)) {
            yield makeGetRefundOptionsCall(action);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makeSyncFirstTimerUserOpensAppOrLogin() {
    yield makeGetOrderListCall();
    yield makeGetAddressCall();
    yield getFavouriteTakeaway();
    yield getAssociateTakeawayList();
}

function* makeOrderRefreshONPushNotification(action) {
    const order = yield select(selectOrderDetailResponse);
    if (
        isValidElement(order) &&
        isValidElement(order.data) &&
        isValidElement(action) &&
        isValidElement(action.payload) &&
        isValidElement(action.payload.order_info_id) &&
        order.data === action.payload.order_info_id
    ) {
        yield put(getOrderDetailsAction(action.payload.order_info_id));
    } else {
        yield put(makeGetOrderListAction);
    }
}
function* resetConfigStoreID() {
    const storeID = yield select(selectStoreId);
    yield updateStoreID({ storeID });
}

function* makeGetOrderDetailWithDriverInfoCall(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.makeGetOrderDetailWithDriverInfoCall, action);
        if (isValidElement(response)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_SUCCESS, payload: response });
            if (isValidElement(response.data) && action?.isFromWhereMyOrder) {
                const orderDetails = response;
                const timezone = yield select(selectTimeZone);
                const timeZone = getOrderTimeZone(orderDetails, timezone);
                const deliveryTimeUpdatedOrderData = yield select(selectDeliveryTimeUpdatedOrderData);
                const duration = DEFAULT_CHAT_BOT_DURATION;
                //Todo this chatbot config now working based on API duration only if once updated API end we can use below lines
                //  const countryBaseFeatureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
                //  const duration = getChatBotDeliveryDuration(countryBaseFeatureGateResponse);
                const storeID = getOrderStoreId(orderDetails);
                let orderStatus = safeIntValue(orderDetails?.data?.status);
                let getDeliveryTimeRequestOrder = deliverTimeRequestOrder(deliveryTimeUpdatedOrderData, orderDetails);
                if (
                    orderStatus === safeIntValue(ORDER_STATUS.ACCEPTED) &&
                    isDeliverOrder(orderDetails?.data) &&
                    isRequestedUpdatedDeliveryTime(getOrderDeliveryTime(orderDetails), timeZone, duration)
                ) {
                    let reqId = getOrderDeliveryTimeReqID(getDeliveryTimeRequestOrder);
                    yield makeGetUpdateDeliveryTime({ orderId: response?.data?.id, storeID: storeID, req_id: reqId });
                }
                yield put({ type: ORDER_MANAGEMENT_TYPE.UPDATE_ORDER_LIST, payload: response.data });
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}
function* makeCancelOrderByUser(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.cancelOrderCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield fork(makeGetOrderDetailsCall, action);
            showInfoMessage(LOCALIZATION_STRINGS.ORDER_CANCEL_SUCCESS_MSG);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}
function* makeGetCancelOrderReasons(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.getCancelOrderReasons, action);
        if (isValidElement(response)) {
            yield put({ type: ORDER_MANAGEMENT_TYPE.GET_CANCEL_ORDER_REASONS_SUCCESS, payload: response });
        }
    } catch (e) {
        showErrorMessage(e);
    }
}
function* makeGetUpdateDeliveryTime(action) {
    try {
        const response = yield apiCall(OrderManagementNetwork.callGetUpdatedDeliveryTime, action);
        let { getDeliveryTimeRequested } = action;
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            let reqId = !isBoolean(response?.req_id) ? response?.req_id : null;
            if (!isValidElement(getDeliveryTimeRequested) || (isValidElement(getDeliveryTimeRequested) && getDeliveryTimeRequested)) {
                const timezone = yield select(selectTimeZone);
                let deliveryTimeRequestTime = getCurrentMoment(timezone);
                let deliveryTimeRequestData = {
                    ...action,
                    requestedTime: deliveryTimeRequestTime,
                    isDeliveryTimeUpdated: false,
                    req_id: reqId
                };
                yield put({ type: ORDER_MANAGEMENT_TYPE.DELIVERY_TIME_UPDATE_ORDER_DATA, payload: deliveryTimeRequestData });
            }
            if (!isValidString(response?.updated_delivery_time)) {
                action.req_id = reqId;
                action.getDeliveryTimeRequested = false;
                yield delay(6000);
                yield makeGetUpdateDeliveryTime(action);
            } else if (isValidString(response?.updated_delivery_time)) {
                let updatedDeliveryTimeOrderData = {
                    ...action,
                    updated_delivery_time: response?.updated_delivery_time,
                    req_id: reqId
                };
                yield put({ type: ORDER_MANAGEMENT_TYPE.GET_UPDATED_DELIVERY_TIME_SUCCESS, payload: updatedDeliveryTimeOrderData });
                yield fork(makeGetOrderDetailWithDriverInfoCall(action));
            }
        } else {
            yield put({
                type: ORDER_MANAGEMENT_TYPE.DELIVERY_TIME_UPDATE_ORDER_DATA,
                payload: { ...action, isUpdatedDeliverTimeDisable: true }
            });
        }
    } catch (e) {
        //Nothing to handle
    }
}
function* makeRefundRequest(action) {
    try {
        yield apiCall(OrderManagementNetwork.refundRequestCall, action);
    } catch (e) {
        //nothing to handle
    }
}
function* OrderManagementSaga() {
    yield all([
        takeLatest(ORDER_MANAGEMENT_TYPE.VIEW_ALL_ORDERS, makeViewAllOrdersCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.VIEW_ORDER, makeViewOrderCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.RE_ORDER, initiateReOrder),
        takeLatest(ORDER_MANAGEMENT_TYPE.ORDER_DETAILS, makeGetOrderDetailsCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.ORDER_LIST, makeGetOrderListCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.ORDER_TRACKING_DETAILS, makeGetOrderTrackingDetailsCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.GET_REFUND_OPTIONS, makeGetRefundOptionsCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.UPDATE_REFUND_METHOD, makeUpdateRefundMethodCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.SYNC_FIRST_TIME_USER_LOGIN, makeSyncFirstTimerUserOpensAppOrLogin),
        takeLatest(ORDER_MANAGEMENT_TYPE.TRIGGER_RE_ORDER, makeReOrderCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.PREPARE_REORDER, prePareForReOrder),
        takeLatest(ORDER_MANAGEMENT_TYPE.REORDER_BASKET_NAVIGATION, reOrderBasketNavigation),
        takeLatest(PUSH_NOTIFICATION_TYPE.REFRESH_ON_PUSH_NOTIFICATION_RECEIVED, makeOrderRefreshONPushNotification),
        takeLatest(ORDER_MANAGEMENT_TYPE.RESET_REORDER_STORE_CONFIG, resetConfigStoreID),
        takeLatest(ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_WITH_DRIVER_INFO, makeGetOrderDetailWithDriverInfoCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.ORDER_CANCEL_BY_USER, makeCancelOrderByUser),
        takeLatest(ORDER_MANAGEMENT_TYPE.GET_CANCEL_ORDER_REASONS, makeGetCancelOrderReasons),
        takeLatest(ORDER_MANAGEMENT_TYPE.REQUEST_DELIVERY_TIME_CALL, makeGetUpdateDeliveryTime),
        takeLatest(TOTAL_SAVING_TYPE.REFRESH_FH_HOME_SCREEN_USER_DATA, makeGetOrderListCall),
        takeLatest(ORDER_MANAGEMENT_TYPE.SUBMIT_MISSING_ITEMS, makeRefundRequest)
    ]);
}

export default OrderManagementSaga;
