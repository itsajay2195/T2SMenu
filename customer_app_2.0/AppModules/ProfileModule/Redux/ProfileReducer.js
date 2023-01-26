import { PROFILE_TYPE } from './ProfileType';
import { getUpdatedProfileResponse } from '../Utils/ProfileHelper';
import { AUTH_TYPE } from '../../AuthModule/Redux/AuthType';
import { getPrimaryCardId } from '../../QuickCheckoutModule/Utils/Helper';
import { APP_ACTION_TYPE } from '../../../CustomerApp/Redux/Actions/Types';

const INITIAL_STATE = {
    profileResponse: null,
    showVerifyOTP: false,
    otpLength: 4,
    verifyOtpErrorMsg: null,
    otpLimitExceeded: false,
    savedCardDetails: [],
    isDuplicatePhone: false,
    showOTPConfirmModel: false,
    primaryCardId: null,
    isProfileAPICompleted: false,
    isUpdateProfile: false,
    referralCode: null,
    recentPayByLinkAction: {},
    isFromPayByLink: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROFILE_TYPE.GET_PROFILE_SUCCESS:
            return {
                ...state,
                profileResponse: action.payload,
                isProfileAPICompleted: true
            };
        case PROFILE_TYPE.SHOW_HIDE_VERIFY_OTP:
            return {
                ...state,
                showVerifyOTP: action.payload,
                isUpdateProfile: action.isUpdateProfile
            };
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION:
            return {
                ...state,
                showVerifyOTP: false,
                otpLimitExceeded: false,
                verifyOtpErrorMsg: null
            };

        case PROFILE_TYPE.OTP_LENGTH:
            return {
                ...state,
                otpLength: action.payload
            };
        case PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE: {
            return {
                ...state,
                profileResponse: getUpdatedProfileResponse(
                    state.profileResponse,
                    action.payload.key,
                    action.payload.value,
                    action.payload.policyLookupResponse
                )
            };
        }
        case PROFILE_TYPE.GET_CARD_DETAILS_SUCCESS:
            return {
                ...state,
                savedCardDetails: action.payload,
                primaryCardId: getPrimaryCardId(action.payload)
            };
        case PROFILE_TYPE.VERIFY_OTP_ERROR_MSG:
            return {
                ...state,
                verifyOtpErrorMsg: action.payload
            };
        case PROFILE_TYPE.OTP_LIMIT_EXCEEDED:
            return {
                ...state,
                otpLimitExceeded: action.payload
            };
        case PROFILE_TYPE.DUPLICATE_PHONE_NUMBER:
            return {
                ...state,
                isDuplicatePhone: action.isDuplicatePhone,
                showOTPConfirmModel: action.showOTPConfirmModel,
                isUpdateProfile: action.isUpdateProfile
            };
        case PROFILE_TYPE.POST_SEND_OTP:
            return {
                ...state,
                showOTPConfirmModel: false,
                verifyOtpErrorMsg: null
            };
        case AUTH_TYPE.OTP_PHONE_NUMBER:
            return {
                ...state,
                showOTPConfirmModel: false
            };
        case PROFILE_TYPE.UPDATE_PROFILE_API_STATUS: {
            return {
                ...state,
                isProfileAPICompleted: action.payload
            };
        }
        case AUTH_TYPE.ACCOUNT_VERIFIED: {
            return {
                ...state,
                isUpdateProfile: action.isUpdateProfile
            };
        }
        case PROFILE_TYPE.UPDATE_REFERRAL_CODE: {
            return {
                ...state,
                referralCode: action.referralCode
            };
        }
        case PROFILE_TYPE.UPDATE_RECENT_PBL: {
            return {
                ...state,
                recentPayByLinkAction: action.payload,
                isFromPayByLink: action.isFromPayByLink
            };
        }
        case PROFILE_TYPE.RESET_PBL: {
            return {
                ...state,
                recentPayByLinkAction: null,
                isFromPayByLink: false
            };
        }
        default:
            return state;
    }
};
