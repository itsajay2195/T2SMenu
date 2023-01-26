import { ORDER_MANAGEMENT_TYPE } from './OrderManagementType';
import { ORDER_STATUS } from '../../BaseModule/BaseConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { APP_ACTION_TYPE } from '../../../CustomerApp/Redux/Actions/Types';
import { updatedDeliveryTime, updateReview } from '../Utils/OrderManagementHelper';

const INITIAL_STATE = {
    viewAllOrdersResponse: null,
    viewOrderResponse: null,
    reOrderResponse: null,
    orderDetailsResponse: null,
    pendingOrder: null,
    previousOrder: null,
    pendingAndCompletedOrder: null,
    orderTrackingDetailsResponse: null,
    showHideOrderType: false,
    showHideTAOrderType: false,
    orderID: null,
    reOrderButtonStatus: false,
    showTakeawayClosedModal: false,
    showSwitchOrderTypeModal: false,
    showReplaceBasketModal: false,
    storeID: null,
    refundOptions: null,
    reOrderStoreConfiguration: null,
    cancelReasons: null,
    deliverTimeRequestedOrderData: [],
    fromTakeawayListScreen: null //to enable order type selection when user is not logged in
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ORDER_MANAGEMENT_TYPE.VIEW_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                viewAllOrdersResponse: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.VIEW_ORDER_SUCCESS:
            return {
                ...state,
                viewOrderResponse: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.RE_ORDER_SUCCESS:
            return {
                ...state,
                reOrderResponse: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                orderDetailsResponse: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.ORDER_LIST_SUCCESS:
            return {
                ...state,
                pendingOrder: action.payload.filter((item) => item.status <= ORDER_STATUS.DELIVERED),
                previousOrder: action.payload.filter((item) => item.status > ORDER_STATUS.DELIVERED),
                pendingAndCompletedOrder: action.payload.filter((item) => item.status < ORDER_STATUS.HIDDEN)
            };
        case ORDER_MANAGEMENT_TYPE.ORDER_TRACKING_DETAILS_SUCCESS:
            return {
                ...state,
                orderTrackingDetailsResponse: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.ORDER_DETAILS_CLEAR:
            return {
                ...state,
                orderDetailsResponse: null
            };
        case ORDER_MANAGEMENT_TYPE.ORDER_TRACKING_DETAILS_CLEAR:
            return {
                ...state,
                orderTrackingDetailsResponse: null
            };
        case ORDER_MANAGEMENT_TYPE.UPDATE_ORDER_DETAILS_DATA:
            return {
                ...state,
                orderDetailsResponse: { data: action.payload },
                storeID:
                    isValidElement(action.payload.store) && isValidElement(action.payload.store.id)
                        ? action.payload.store.id
                        : isValidElement(action.payload.host)
                        ? action.payload.host
                        : null
            };
        case ORDER_MANAGEMENT_TYPE.SHOW_HIDE_ORDER_TYPE:
            return {
                ...state,
                showHideOrderType: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.SHOW_HIDE_TA_ORDER_TYPE:
            return {
                ...state,
                showHideTAOrderType: action.payload
            };
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION:
            return {
                ...state,
                showHideOrderType: false,
                showTakeawayClosedModal: false,
                showSwitchOrderTypeModal: false,
                showReplaceBasketModal: false,
                reOrderButtonStatus: false
            };
        case ORDER_MANAGEMENT_TYPE.VIEW_ORDER:
            return {
                ...state,
                orderID: action.orderId
            };
        case ORDER_MANAGEMENT_TYPE.RESET_RECEIPT:
            return {
                ...state,
                viewOrderResponse: null
            };
        case ORDER_MANAGEMENT_TYPE.SET_ORDER_ID:
            return {
                ...state,
                orderID: action.orderId
            };
        case ORDER_MANAGEMENT_TYPE.DISABLE_RE_ORDER_BUTTON_ACTION:
            return {
                ...state,
                reOrderButtonStatus: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.RESET_REORDER_RESPONSE:
            return {
                ...state,
                reOrderResponse: null
            };
        case ORDER_MANAGEMENT_TYPE.SHOW_TAKEAWAY_CLOSE_MODEL:
            return {
                ...state,
                showTakeawayClosedModal: action.showTakeawayClosedModal
            };
        case ORDER_MANAGEMENT_TYPE.SHOW_SWITCH_ORDER_TYPE_MODEL:
            return {
                ...state,
                showSwitchOrderTypeModal: action.showSwitchOrderTypeModal
            };
        case ORDER_MANAGEMENT_TYPE.BASKET_CLEAR_MODEL:
            return {
                ...state,
                showReplaceBasketModal: action.showReplaceBasketModal
            };
        case ORDER_MANAGEMENT_TYPE.RESET_REORDER_FLAGS:
            return {
                ...state,
                showTakeawayClosedModal: false,
                showSwitchOrderTypeModal: false,
                showReplaceBasketModal: false,
                reOrderButtonStatus: false
            };
        case ORDER_MANAGEMENT_TYPE.GET_REFUND_OPTIONS_SUCCESS:
            return {
                ...state,
                refundOptions: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.RESET_REFUND_OPTIONS:
            return {
                ...state,
                refundOptions: null
            };
        case ORDER_MANAGEMENT_TYPE.UPDATE_ORDER_LIST:
            return {
                ...state,
                pendingAndCompletedOrder:
                    isValidElement(state.pendingAndCompletedOrder) && updateOrderList([...state.pendingAndCompletedOrder], action.payload)
            };
        case ORDER_MANAGEMENT_TYPE.UPDATE_REORDER_STORE_CONFIG:
            return {
                ...state,
                reOrderStoreConfiguration: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.UPDATE_REVIEW_LOCALLY:
            return {
                ...state,
                previousOrder: updateReview(state.previousOrder, action.payload)
            };
        case ORDER_MANAGEMENT_TYPE.GET_CANCEL_ORDER_REASONS_SUCCESS:
            return {
                ...state,
                cancelReasons: action.payload
            };
        case ORDER_MANAGEMENT_TYPE.GET_UPDATED_DELIVERY_TIME_SUCCESS:
            return {
                ...state,
                deliverTimeRequestedOrderData: updatedDeliveryTime(state.deliverTimeRequestedOrderData, action.payload)
            };
        case ORDER_MANAGEMENT_TYPE.DELIVERY_TIME_UPDATE_ORDER_DATA:
            return {
                ...state,
                deliverTimeRequestedOrderData: [...state.deliverTimeRequestedOrderData, action.payload]
            };
        default:
            return state;
    }
};

const updateOrderList = (orderList, updatedOrder) => {
    let updatedList =
        isValidElement(orderList) &&
        orderList.map((item) => {
            if (item.id === updatedOrder.id) {
                return { ...item, status: updatedOrder.status, delivery_time: updatedOrder.delivery_time };
            } else {
                return item;
            }
        });
    return updatedList;
};
