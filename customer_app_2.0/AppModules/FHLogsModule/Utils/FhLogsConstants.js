export const FH_LOG_TYPE = {
    NEW_CARD_PAYMENT_INITIATED: 'NEW_CARD_PAYMENT_INITIATED',
    NEW_CARD_PAYMENT_SUCCESS: 'NEW_CARD_PAYMENT_SUCCESS',
    NEW_CARD_PAYMENT_FAILED: 'NEW_CARD_PAYMENT_FAILED',
    NEW_CARD_PAYMENT_CANCELLED: 'NEW_CARD_PAYMENT_CANCELLED',
    SOCIAL_LOGIN_FAILURE: 'SOCIAL_LOGIN_FAILURE',
    API_FAILURE: 'API_FAILURE',
    STORE_CONFIG_RESPONSE: 'STORE_CONFIG_RESPONSE',
    CAPTURE_ERROR_LOG: 'capture_error_log',
    NEW_CARD_PAYMENT_LOG: 'new_card_payment_log'
};

export const FH_LOG_ERROR_CODE = {
    JUDO_PAY_FAILURE_ERROR_CODE: '001',
    NEW_CARD_PAYMENT_ERROR_CODE: '002',
    API_FAILURE_ERROR_CODE: '003',
    SOCIAL_LOGIN_FAILURE: '004',
    CLOSED_STORE_CONFIG_ERROR_CODE: '005'
};

export const ERROR_SOURCE = {
    APP: 'APP'
};