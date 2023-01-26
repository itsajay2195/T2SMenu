import { PROFILE_TYPE } from './ProfileType';
import { SAVED_CARD_FROM_SCREEN } from '../Utils/ProfileConstants';

export const getProfileAction = () => {
    return {
        type: PROFILE_TYPE.GET_PROFILE
    };
};

export const updateProfileAction = (email, phone, first_name, last_name, isUpdateProfile = false, isFromPayByLink = false) => {
    return {
        type: PROFILE_TYPE.UPDATE_PROFILE,
        email,
        phone,
        first_name,
        last_name,
        isUpdateProfile,
        isFromPayByLink
    };
};

export const sendOTPAction = (phone, otpType, isResend = false, isUpdateProfile = false) => {
    return {
        type: PROFILE_TYPE.POST_SEND_OTP,
        phone,
        otpType,
        isResend,
        isUpdateProfile
    };
};

export const verifyOTPAction = (phone, otp, isUpdateProfile = false) => {
    return {
        type: PROFILE_TYPE.VERIFY_OTP,
        phone,
        otp,
        isUpdateProfile
    };
};

export const exportDataAction = (email, user_consent_id, device, type) => {
    return {
        type: PROFILE_TYPE.EXPORT_DATA,
        email: email,
        user_consent_id: user_consent_id,
        device: device,
        actionType: type
    };
};

export const deleteAccountAction = (email, user_consent_id, device, type) => {
    return {
        type: PROFILE_TYPE.DELETE_ACCOUNT,
        email: email,
        user_consent_id: user_consent_id,
        device: device,
        actionType: type
    };
};

export const resetVerifyOTPErrorMsgAction = () => ({
    type: PROFILE_TYPE.VERIFY_OTP_ERROR_MSG,
    payload: null
});

//If not used from profile screen, pass fromScreen
export const getCardDetailsAction = (provider, fromScreen = SAVED_CARD_FROM_SCREEN.PROFILE) => {
    return {
        type: PROFILE_TYPE.GET_CARD_DETAILS,
        provider,
        fromScreen
    };
};

export const deleteCardDetailsAction = (id, provider) => {
    return {
        type: PROFILE_TYPE.DELETE_CARD_DETAILS,
        id,
        provider
    };
};

export const resetVerifyOTPValuesAction = () => ({
    type: PROFILE_TYPE.RESET_VERIFY_OTP_VALUES
});

export const updateProfileAPIStatusAction = (status) => {
    return {
        type: PROFILE_TYPE.UPDATE_PROFILE_API_STATUS,
        payload: status
    };
};

export const resetProfileProgress = () => {
    return {
        type: PROFILE_TYPE.PROFILE_SHOW_PROGRESS,
        status: false
    };
};

export const resetReferral = () => {
    return {
        type: PROFILE_TYPE.UPDATE_REFERRAL_CODE,
        referralCode: null
    };
};

export const resetPBLAction = () => {
    return {
        type: PROFILE_TYPE.RESET_PBL
    };
};
