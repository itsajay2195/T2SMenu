import { isValidElement, isValidNotEmptyString, isValidString } from 't2sbasemodule/Utils/helpers';
import { getLanguageCode, selectStoreConfigResponse } from 't2sbasemodule/Utils/AppSelectors';
import { CHECK_ORDER_TYPE, ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { createSelector } from 'reselect';
import { selectAddressState } from '../../AddressModule/Redux/AddressSelectors';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { translateLabels } from '../../BasketModule/Utils/BasketHelper';
import { selectBasketState } from '../../BasketModule/Redux/BasketSelectors';
import { isBasketOrder } from '../../AddressModule/Utils/AddressHelpers';

export const selectOrderManagementState = (state) => state.orderManagementState;
export const selectOrderedStoreID = (state) => state.orderManagementState.storeID;
export const selectOrderDetailResponse = (state) => state.orderManagementState.orderDetailsResponse;
export const selectReorderResponse = (state) => state.orderManagementState.reOrderResponse;
export const selectDeliveryTimeUpdatedOrderData = (state) => state.orderManagementState.deliverTimeRequestedOrderData;

export const selectOrderID = (state) => {
    const orderManagementState = selectOrderManagementState(state);
    if (isValidElement(orderManagementState.orderID)) {
        return orderManagementState.orderID;
    }
};

export const selectOrderStatus = (state) => {
    const orderManagementState = selectOrderManagementState(state);
    if (isValidElement(orderManagementState.orderDetailsResponse) && isValidElement(orderManagementState.orderDetailsResponse.data)) {
        return orderManagementState.orderDetailsResponse.data.status;
    }
};

export const selectReOrderButtonStatus = (state) => {
    const orderManagementState = selectOrderManagementState(state);
    if (isValidElement(orderManagementState.reOrderButtonStatus)) {
        return orderManagementState.reOrderButtonStatus;
    }
};

export const selectReceiptResponse = (state) => {
    const orderManagementState = selectOrderManagementState(state);
    return orderManagementState.viewOrderResponse;
};

export const selectRefundRequested = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse?.refund_request)) return receiptResponse.refund_request;
};

export const selectRefundStatus = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse?.refund_status)) return receiptResponse.refund_status;
};

export const orderReceiptStatus = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.status)) {
        return receiptResponse.status;
    }
};
export const selectOrderPlacedTime = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.time)) {
        return receiptResponse.time;
    }
};

export const selectReceiptOrderType = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.type)) {
        return receiptResponse.type;
    }
};

export const selectOrderNo = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.order_no)) {
        return receiptResponse.order_no;
    }
};

export const selectReceiptPointsRemaining = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.points_remaining)) {
        return { ...receiptResponse.points_remaining, label: LOCALIZATION_STRINGS.POINTS_REMAINING };
    }
};

export const selectReceiptPointsGain = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.points_gained)) {
        return { ...receiptResponse.points_gained, label: LOCALIZATION_STRINGS.POINTS_GAINED };
    }
};
export const selectReceiptCustomer = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.customer)) {
        return receiptResponse.customer;
    }
};

export const selectReceiptCustomerName = (state) => {
    const customerObj = selectReceiptCustomer(state);
    if (isValidElement(customerObj) && isValidString(customerObj.firstname)) {
        return customerObj.firstname;
    }
};
export const selectReceiptHouseNo = (state) => {
    const customerObj = selectReceiptCustomer(state);
    if (isValidElement(customerObj) && isValidString(customerObj.houseno)) {
        return customerObj.houseno;
    }
};
export const selectReceiptPostcode = (state) => {
    const customerObj = selectReceiptCustomer(state);
    if (isValidElement(customerObj) && isValidString(customerObj.postcode)) {
        return customerObj.postcode;
    }
};
export const selectReceiptAddress1 = (state) => {
    const customerObj = selectReceiptCustomer(state);
    if (isValidElement(customerObj) && isValidString(customerObj.address1)) {
        return customerObj.address1;
    }
};
export const selectReceiptOrderItems = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.item) && receiptResponse.item.length > 0) {
        return receiptResponse.item;
    }
};
export const selectOrderInstructions = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    return isValidElement(receiptResponse) && isValidNotEmptyString(receiptResponse.comments) ? receiptResponse.comments : '';
};

export const selectReceiptSubTotal = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.sub_total) && isValidString(receiptResponse.sub_total.label)) {
        return translateLabels(receiptResponse.sub_total, language, LOCALIZATION_STRINGS.SUB_TOTAL);
    }
};
export const selectReceiptServiceCharge = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.restaurant_service_charge)) {
        return translateLabels(receiptResponse.restaurant_service_charge, language, LOCALIZATION_STRINGS.RESTAURANT_CHARGE_LABEL);
    }
};
export const selectReceiptVAT = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.vat)) {
        return translateLabels(receiptResponse.vat, language, LOCALIZATION_STRINGS.VAT_LABEL);
    }
};

export const selectReceiptAdminFee = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.admin_fee)) {
        return { ...receiptResponse.admin_fee, label: LOCALIZATION_STRINGS.SERVICE_CHARGE };
    }
};
export const selectReceiptOnlineDiscount = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.online_discount)) {
        return translateLabels(receiptResponse.online_discount, language, LOCALIZATION_STRINGS.ONLINE_DISCOUNT_LABEL);
    }
};
export const selectReceiptCollectionDiscount = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.collection_discount)) {
        return translateLabels(receiptResponse.collection_discount, language, LOCALIZATION_STRINGS.COLLECTION_DISCOUNT_LABEL);
    }
};
export const selectReceiptCouponSummary = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.coupon)) {
        return translateLabels(receiptResponse.coupon, language, LOCALIZATION_STRINGS.COUPON_LABEL);
    }
};

export const selectReceiptCarryBag = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.carry_bag)) {
        return translateLabels(receiptResponse.carry_bag, language, LOCALIZATION_STRINGS.CARRY_BAGS_LABEL);
    }
};

export const selectReceiptRedeemAmount = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.redeem_amount)) {
        return { ...receiptResponse.redeem_amount, label: LOCALIZATION_STRINGS.REEDEM_AMOUNT };
    }
};

export const selectReceiptDeliveryCharge = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.delivery_charge)) {
        return translateLabels(receiptResponse.delivery_charge, language, LOCALIZATION_STRINGS.DELIVERY_CHARGE);
    }
};

export const selectReceiptTotal = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.total)) {
        return { ...receiptResponse.total, label: LOCALIZATION_STRINGS.TOTAL };
    }
};
export const selectPayment = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.payment)) {
        return receiptResponse.payment;
    }
};
export const getOrderType = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    const addressState = selectAddressState(state);
    const basketState = selectBasketState(state);
    if (isValidElement(storeConfigResponse)) {
        const { show_delivery, show_collection } = storeConfigResponse;
        if (show_delivery === 1 && show_collection === 1) {
            if (
                isValidElement(addressState) &&
                isValidElement(addressState.nonBasketOrderType) &&
                isValidElement(basketState) &&
                (!isBasketOrder(basketState.storeID, storeConfigResponse?.id) || !isValidElement(basketState.storeID))
            ) {
                return addressState.nonBasketOrderType;
            } else if (isValidElement(addressState) && isValidElement(addressState.selectedOrderType)) {
                return addressState.selectedOrderType;
            }
            return ORDER_TYPE.DELIVERY;
        } else if (show_delivery === 1) {
            return ORDER_TYPE.DELIVERY;
        } else if (show_collection === 1) {
            return ORDER_TYPE.COLLECTION;
        } else {
            return ORDER_TYPE.DELIVERY;
        }
    } else if (isValidElement(addressState) && isValidElement(addressState.selectedOrderType)) {
        return addressState.selectedOrderType;
    } else {
        return ORDER_TYPE.DELIVERY;
    }
};

export const selectOrderType = createSelector([getOrderType], (getOrderType) => {
    return getOrderType;
});

export const getUserSelectedOrderType = (state) => {
    const addressState = selectAddressState(state);
    if (isValidElement(addressState) && isValidElement(addressState.selectedOrderType)) {
        return addressState.selectedOrderType;
    }
};

export const selectUserSelectedOrderType = createSelector([getUserSelectedOrderType], (getUserSelectedOrderType) => {
    return getUserSelectedOrderType;
});

export const isPreOrder = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    return (
        isValidElement(receiptResponse) &&
        isValidString(receiptResponse.pre_order_time) &&
        !receiptResponse.pre_order_time.startsWith('0000')
    );
};

export const isOrderTypeAvailableSelector = (sending) => {
    if (isValidElement(sending)) {
        const { isCollectionAvailable, isDeliveryAvailable } = this.props;
        return sending === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION ? isCollectionAvailable : isDeliveryAvailable;
    }
    return false;
};

export const selectTotalPaidByCard = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.total_paid_by_card)) {
        return receiptResponse.total_paid_by_card.value;
    }
};

export const selectTotalPaidByWallet = (state) => {
    const receiptResponse = selectReceiptResponse(state);
    if (isValidElement(receiptResponse) && isValidElement(receiptResponse.total_paid_by_wallet)) {
        return receiptResponse.total_paid_by_wallet.value;
    }
};

export const getPendingOrder = (state) => state.orderManagementState.pendingOrder;
export const getPreviousOrder = (state) => state.orderManagementState.previousOrder;

export const selectPendingOrder = createSelector(getPendingOrder, (pendingOrder) => {
    if (isValidElement(pendingOrder) && pendingOrder.length > 0) {
        return {
            title: LOCALIZATION_STRINGS.PENDING_ORDERS.toUpperCase(),
            data: pendingOrder
        };
    }
});
export const selectPreviousOrder = createSelector(getPreviousOrder, (previousOrder) => {
    if (isValidElement(previousOrder) && previousOrder.length > 0) {
        return {
            title: LOCALIZATION_STRINGS.PREVIOUS_ORDERS.toUpperCase(),
            data: previousOrder
        };
    }
});
export const selectOrderHistoryList = createSelector([selectPendingOrder, selectPreviousOrder], (pendingOrder, previousOrder) => {
    let arr = [pendingOrder, previousOrder];
    return arr.filter((item) => item);
});

export const selectPendingOrderLength = createSelector(getPendingOrder, (list) => list.length);
export const selectPreviousOrderLength = createSelector(getPreviousOrder, (list) => list.length);

export const allItemsMissing = (state) => {
    const reOrderResponse = selectReorderResponse(state);
    if (isValidElement(reOrderResponse) && isValidElement(reOrderResponse.added_items) && Array.isArray(reOrderResponse.added_items)) {
        return reOrderResponse.added_items.length === 0;
    }
    return false;
};

export const oneOrMoreItemsMissing = (state) => {
    const reOrderResponse = selectReorderResponse(state);
    if (
        isValidElement(reOrderResponse) &&
        isValidElement(reOrderResponse.added_items) &&
        isValidElement(reOrderResponse.missing_items) &&
        Array.isArray(reOrderResponse.missing_items) &&
        Array.isArray(reOrderResponse.added_items)
    ) {
        return reOrderResponse.added_items.length > 0 && reOrderResponse.missing_items.length > 0;
    }
    return false;
};
