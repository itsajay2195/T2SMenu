import { selectStoreConfigResponse } from 't2sbasemodule/Utils/AppSelectors';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';

export const selectOrderDetailsResponse = (state) => state.orderManagementState.orderDetailsResponse;

export const selectStoreIdFromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.store?.id;
};
export const selectMerchantIdFromPBLOrder = (state) => {
    const orderDetailsResponse = selectStoreConfigResponse(state);
    return orderDetailsResponse?.merchant_id;
};
export const selectTakeawayNameFromPBLOrder = (state) => {
    const orderDetailsResponse = selectStoreConfigResponse(state);
    return orderDetailsResponse?.name;
};

export const selectCurrencyFromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.currency;
};
export const selectPlacedTimeFromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.order_placed_on;
};
export const selectPaymentFromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.payment;
};
export const selectTotalFromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.total;
};
export const selectHousenoFromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.houseno;
};
export const selectAddress1FromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.address1;
};
export const selectAddress2FromPBLOrder = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.address2;
};

export const selectSendingType = (state) => {
    const orderDetailsResponse = selectOrderDetailsResponse(state);
    return orderDetailsResponse?.data?.sending === ORDER_TYPE.DELIVERY || orderDetailsResponse?.data?.sending === 'to'
        ? ORDER_TYPE.DELIVERY
        : orderDetailsResponse?.data?.sending === ORDER_TYPE.COLLECTION
        ? ORDER_TYPE.COLLECTION
        : '';
};
