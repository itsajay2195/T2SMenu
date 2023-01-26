import { FH_LOG_TYPE } from '../Utils/FhLogsConstants';

export const updateNewCardPaymentFhLogAction = (graphqlQuery) => {
    return {
        type: FH_LOG_TYPE.NEW_CARD_PAYMENT_LOG,
        graphqlQuery
    };
};

export const captureErrorLogAction = (graphqlQuery) => {
    return {
        type: FH_LOG_TYPE.CAPTURE_ERROR_LOG,
        graphqlQuery
    };
};
