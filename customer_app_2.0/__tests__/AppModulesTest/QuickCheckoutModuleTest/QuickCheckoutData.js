import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { addresses, delivery_address, preOrderDates, savedCardDetails } from '../data';
import { PAYMENT_TYPE } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';

export const props = {
    orderType: ORDER_TYPE.COLLECTION,
    takeAwayAddress: '1241  6 6',
    addressResponse: addresses,
    isCollectionAvailable: false,
    isDeliveryAvailable: false,
    selectedOrderType: ORDER_TYPE.COLLECTION,
    preOrderCollectionDates: preOrderDates,
    preOrderDeliveryDates: preOrderDates,
    selectedPaymentMode: PAYMENT_TYPE.CASH
};
export const delivery_props = {
    orderType: ORDER_TYPE.DELIVERY,
    takeAwayAddress: '16  12B,  Moorland Road,  Stoke-on-Trent,  ST6 1DT',
    deliveryAddress: delivery_address,
    addressResponse: addresses,
    currency: '£',
    walletBalance: '1.50',
    savedCardDetails: savedCardDetails,
    user_selected_card_id: 90719,
    isCollectionAvailable: true,
    isDeliveryAvailable: true,
    selectedOrderType: ORDER_TYPE.DELIVERY,
    preOrderCollectionDates: preOrderDates,
    preOrderDeliveryDates: preOrderDates,
    selectedPaymentMode: PAYMENT_TYPE.CARD
};
export const empty_props = {
    orderType: null,
    takeAwayAddress: '',
    deliveryAddress: null,
    addressResponse: null,
    isCollectionAvailable: true,
    isDeliveryAvailable: true,
    selectedOrderType: null,
    preOrderCollectionDates: '',
    preOrderDeliveryDates: ''
};
