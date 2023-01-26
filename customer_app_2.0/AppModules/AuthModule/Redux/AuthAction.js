import { AUTH_TYPE } from './AuthType';
import { OPT_IN, OPT_OUT } from 'appmodules/BaseModule/BaseConstants';

export const registerAction = (
    email,
    password,
    first_name,
    last_name,
    phone,
    gdprChecked,
    emailChecked,
    smsChecked,
    notificationChecked = true
) => {
    return {
        type: AUTH_TYPE.POST_REGISTER,
        email,
        password,
        first_name,
        last_name,
        phone,
        gdprChecked,
        emailChecked,
        smsChecked,
        notificationChecked
    };
};

export const loginAction = (email, password) => {
    return {
        type: AUTH_TYPE.POST_LOGIN,
        email: email,
        password: password
    };
};

export const socialLoginAction = (type, token, first_name = undefined, last_name = undefined) => {
    return {
        type: AUTH_TYPE.POST_SOCIAL_LOGIN,
        loginType: type,
        token: token,
        first_name,
        last_name
    };
};

export const forgotPasswordAction = (email, isResendEmail) => {
    return {
        type: AUTH_TYPE.POST_FORGOT_PASSWORD,
        email: email,
        isResendEmail
    };
};

export const updateBulkConsentAction = (gdprChecked = true, emailChecked, smsChecked, notificationChecked = true, profileID, storeId) => {
    return {
        type: AUTH_TYPE.BULK_UPDATE_CONSENT,
        gdprChecked,
        emailChecked,
        smsChecked,
        notificationChecked,
        profileID,
        storeId,
        isFromSignUp: true
    };
};

export const updateEmailConsentAction = (customer_id, store_id, policy_id, action, key) => {
    return {
        type: AUTH_TYPE.UPDATE_EMAIL_CONSENT,
        customer_id: customer_id,
        store_id: store_id,
        policy_id: policy_id,
        action: action,
        key: key,
        user_click_email: action === OPT_IN ? OPT_IN : OPT_OUT
    };
};

export const updateSMSConsentAction = (customer_id, store_id, policy_id, action, key) => {
    return {
        type: AUTH_TYPE.UPDATE_SMS_CONSENT,
        customer_id: customer_id,
        store_id: store_id,
        policy_id: policy_id,
        action: action,
        key: key,
        user_click_sms: action === OPT_IN ? OPT_IN : OPT_OUT
    };
};

export const updateNotificationConsentAction = (customer_id, store_id, policy_id, action, key) => {
    return {
        type: AUTH_TYPE.UPDATE_NOTIFICATION_CONSENT,
        customer_id: customer_id,
        store_id: store_id,
        policy_id: policy_id,
        action: action,
        key: key
    };
};

export const onNotAgreedGDPRAction = () => {
    return {
        type: AUTH_TYPE.NOT_AGREED_GDPR_ACTION
    };
};

export const onLogoutAction = () => {
    return {
        type: AUTH_TYPE.SET_LOGOUT_ACTION
    };
};

export const getConsumerPromotion = () => {
    return {
        type: AUTH_TYPE.CONSUMER_PROMOTION
    };
};

export const setRegisterError = (registerError) => {
    return {
        type: AUTH_TYPE.REGISTER_ERROR,
        registerError
    };
};
export const invalidSessionAction = () => {
    return {
        type: AUTH_TYPE.INVALID_SESSION
    };
};

export const resetOtpPhoneNumberAction = () => {
    return {
        type: AUTH_TYPE.OTP_PHONE_NUMBER,
        payload: null
    };
};

export const changeOtpVerifyStatusAction = () => {
    return {
        type: AUTH_TYPE.CHANGE_ACCOUNT_VERIFIED
    };
};

export const receiveOfferConsentAction = (customer_id, store_id, policy_id, from) => {
    return {
        type: AUTH_TYPE.RECEIVE_OFFER_UPDATE_CONSENT,
        customer_id,
        store_id,
        policy_id,
        action: OPT_IN,
        from
    };
};

export const getEmailExisting = (email_id) => {
    return {
        type: AUTH_TYPE.POST_EMAIL_LOOKUP,
        email_id
    };
};

export const resetEmailExistingAction = () => {
    return {
        type: AUTH_TYPE.POST_EMAIL_LOOKUP_RESPONSE,
        payload: null
    };
};
export const handleSocialLoginAction = (LoginType) => {
    return {
        type: AUTH_TYPE.HANDLE_SOCIAL_LOGIN,
        LoginType
    };
};
