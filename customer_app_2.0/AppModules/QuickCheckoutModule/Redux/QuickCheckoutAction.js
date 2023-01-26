import { QC_ACTION_TYPE } from './QuickCheckoutType';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';

export const proceedCheckoutAction = () => {
    return {
        type: QC_ACTION_TYPE.PROCEED_CHECKOUT_ACTION_TYPE
    };
};

export const restartQuickCheckout = () => {
    return {
        type: BASKET_TYPE.RESTART_AGAIN,
        payload: new Date()
    };
};

export const updateCvvAction = (cvv) => {
    return {
        type: BASKET_TYPE.CVV,
        payload: cvv
    };
};

export const resetCvvAction = () => {
    return {
        type: BASKET_TYPE.RESET_VERIFY_CVV
    };
};

export const resetMissingItemBasketAction = () => {
    return {
        type: BASKET_TYPE.RESET_MISSING_ITEM_BASKET
    };
};

export const resetMissingItemBasketProceedAction = () => {
    return {
        type: BASKET_TYPE.PROCEED_WITHOUT_MISSING_ITEM_BASKET
    };
};

export const proceedToPayment = (payload) => {
    return {
        type: BASKET_TYPE.PROCEED_TO_PAYMENT_FLOW,
        payload
    };
};

export const trackOrderPlacedEvent = (message, isFromBeginCheckout = false) => {
    return {
        type: SEGMENT_EVENTS.ORDER_PLACED,
        payload: message,
        isFromBeginCheckout: isFromBeginCheckout
    };
};
