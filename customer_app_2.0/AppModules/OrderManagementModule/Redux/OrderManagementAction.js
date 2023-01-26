import { ORDER_MANAGEMENT_TYPE } from './OrderManagementType';

export const viewAllOrdersAction = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.VIEW_ALL_ORDERS
    };
};
export const viewOrderAction = (orderId, storeID) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.VIEW_ORDER,
        orderId,
        storeID
    };
};

export const makeGetOrderListAction = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_LIST
    };
};

export const reOrderAction = (orderId, storeID, sending, navigation = null) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.RE_ORDER,
        orderId,
        storeID,
        sending,
        navigation
    };
};
export const prepareForReOrderAction = (orderId, storeID, navigation, sending) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.PREPARE_REORDER,
        orderId,
        storeID,
        navigation,
        sending
    };
};
export const reOrderBasketNavigation = (orderId, storeID, navigation, sending, reOrderFrom) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.REORDER_BASKET_NAVIGATION,
        orderId,
        storeID,
        navigation,
        sending,
        reOrderFrom
    };
};
export const setOrderIDAction = (orderId) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SET_ORDER_ID,
        orderId
    };
};
export const getOrderDetailsAction = (orderId, refreshDriver = false, storeID = undefined) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_DETAILS,
        orderId,
        refreshDriver,
        storeID
    };
};
export const getOrderTrackingDetailsAction = (orderId) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_TRACKING_DETAILS,
        orderId
    };
};

export const clearOrderDetailsAction = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_CLEAR
    };
};

export const clearOrderTrackingDetailsAction = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_TRACKING_DETAILS_CLEAR
    };
};
/**
 * If we pass the order data we will get the instance response in order status screen.
 * This will be called from order history and dashboard
 * @param data
 * @returns {{payload: *, type: string}}
 */
export const updateOrderDetailsData = (data) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.UPDATE_ORDER_DETAILS_DATA,
        payload: data
    };
};

export const showHideOrderTypeAction = (isShow) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SHOW_HIDE_ORDER_TYPE,
        payload: isShow
    };
};

export const showHideTAOrderTypeAction = (isShow) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SHOW_HIDE_TA_ORDER_TYPE,
        payload: isShow
    };
};

export const resetReceiptResponse = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.RESET_RECEIPT
    };
};

export const disableReorderButtonAction = (payload) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION,
        payload
    };
};

export const resetReOrderResponseAction = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.RESET_REORDER_RESPONSE
    };
};

export const syncFirstTimeAppOpenOrUserLogin = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SYNC_FIRST_TIME_USER_LOGIN
    };
};

export const showTakeawayClosedModal = (showTakeawayClosedModal) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SHOW_TAKEAWAY_CLOSE_MODEL,
        showTakeawayClosedModal
    };
};
export const showSwitchOrderTypeModalAction = (showSwitchOrderTypeModal) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SHOW_SWITCH_ORDER_TYPE_MODEL,
        showSwitchOrderTypeModal
    };
};
export const showBasketReplaceModelAction = (showReplaceBasketModal) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.BASKET_CLEAR_MODEL,
        showReplaceBasketModal
    };
};
export const resetReOrderFlags = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.RESET_REORDER_FLAGS
    };
};

export const getRefundOptionAction = (orderId) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.GET_REFUND_OPTIONS,
        orderId
    };
};

export const updateRefundMethodAction = (orderId, device, refundMethod, userName) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.UPDATE_REFUND_METHOD,
        orderId,
        device,
        refundMethod,
        userName
    };
};

export const resetRefundOptionAction = () => {
    return {
        type: ORDER_MANAGEMENT_TYPE.RESET_REFUND_OPTIONS
    };
};
export const updateCreateBasketAction = (response) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.UPDATE_CREATE_BASKET_RESPONSE,
        response
    };
};
export const resetReOrderStoreConfigAction = (reOrderStoreConfiguration) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.RESET_REORDER_STORE_CONFIG,
        payload: reOrderStoreConfiguration
    };
};
export const getOrderDetailWithDriverInfoAction = (orderId, storeID = undefined, isFromWhereMyOrder = false) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_WITH_DRIVER_INFO,
        orderId,
        storeID,
        isFromWhereMyOrder
    };
};

export const orderCancelAction = (orderId, orderUpdateType, consumer_reason_id, consumer_reason, storeID) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.ORDER_CANCEL_BY_USER,
        orderId,
        orderUpdateType,
        consumer_reason_id,
        consumer_reason,
        storeID
    };
};

export const getCancelReasonsAction = (apiToken) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.GET_CANCEL_ORDER_REASONS,
        apiToken
    };
};
export const requestDeliveryTimeUpdateAction = (orderId, storeID, req_id, getDeliveryTimeRequested = true) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.REQUEST_DELIVERY_TIME_CALL,
        orderId,
        storeID,
        req_id,
        getDeliveryTimeRequested
    };
};

export const submitMissingItemAction = (orderId, missingItems, storeID) => {
    return {
        type: ORDER_MANAGEMENT_TYPE.SUBMIT_MISSING_ITEMS,
        orderId,
        missingItems,
        storeID
    };
};
