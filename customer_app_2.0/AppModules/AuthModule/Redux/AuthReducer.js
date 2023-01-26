import { AUTH_TYPE } from './AuthType';
import { APP_ACTION_TYPE } from '../../../CustomerApp/Redux/Actions/Types';
import { PROFILE_TYPE } from '../../ProfileModule/Redux/ProfileType';

const INITIAL_STATE = {
    bulkUpdateConsentSuccess: null,
    updateConsentSuccess: null,
    consumerPromotionResponse: null,
    profileResponseWithoutConsent: null,
    consentId: null,
    registerError: false,
    otpPhoneNumber: null,
    accountVerified: null,
    resendLink: false,
    socialLoginLoading: false,
    loginLoading: false,
    signUpLoading: false,
    showProfileLoading: false,
    isExistingEmail: null,
    loader: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case AUTH_TYPE.PROFILE_SUCCESS_WITHOUT_CONSENT:
            return {
                ...state,
                profileResponseWithoutConsent: action.payload
            };
        case AUTH_TYPE.BULK_UPDATE_CONSENT_SUCCESS:
            return {
                ...state,
                bulkUpdateConsentSuccess: action.payload
            };
        case AUTH_TYPE.UPDATE_CONSENT_SUCCESS:
            return {
                ...state,
                updateConsentSuccess: action.payload
            };
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION:
            return {
                ...state,
                signUpLoading: false,
                loginLoading: false,
                socialLoginLoading: false,
                otpPhoneNumber: null,
                accountVerified: null
            };
        case AUTH_TYPE.CONSUMER_PROMOTION_SUCCESS:
            return {
                ...state,
                consumerPromotionResponse: action.payload
            };
        case AUTH_TYPE.CONSENT_ID:
            return {
                ...state,
                consentId: action.payload
            };
        case AUTH_TYPE.REGISTER_ERROR:
            return {
                ...state,
                registerError: action.registerError
            };
        case AUTH_TYPE.NOT_AGREED_GDPR_ACTION:
            return INITIAL_STATE;
        case AUTH_TYPE.OTP_PHONE_NUMBER:
            return {
                ...state,
                otpPhoneNumber: action.payload
            };
        case AUTH_TYPE.ACCOUNT_VERIFIED:
            return {
                ...state,
                accountVerified: action.payload
            };
        case AUTH_TYPE.CHANGE_ACCOUNT_VERIFIED:
            return {
                ...state,
                accountVerified: {
                    ...state.accountVerified,
                    verify: 'false'
                }
            };
        case AUTH_TYPE.INVALID_SESSION:
        case AUTH_TYPE.SET_LOGOUT_ACTION:
            return INITIAL_STATE;
        case AUTH_TYPE.START_SOCIAL_LOGIN_LOADING:
            return {
                ...state,
                socialLoginLoading: true
            };
        case AUTH_TYPE.STOP_SOCIAL_LOGIN_LOADING:
            return {
                ...state,
                socialLoginLoading: false
            };
        case AUTH_TYPE.MIGRATION_PROCESS_WITHOUT_CONSENT:
            return {
                ...state,
                profileResponseWithoutConsent: {
                    ...state.profileResponseWithoutConsent,
                    access_token: action.payload.accessToken,
                    refresh_token: action.payload.refreshToken
                }
            };
        case AUTH_TYPE.START_LOGIN_LOADING:
            return {
                ...state,
                loginLoading: true
            };
        case AUTH_TYPE.STOP_LOGIN_LOADING:
            return {
                ...state,
                loginLoading: false
            };
        case AUTH_TYPE.START_SIGN_UP_LOADING:
            return {
                ...state,
                signUpLoading: true
            };
        case AUTH_TYPE.STOP_SIGN_UP_LOADING:
            return {
                ...state,
                signUpLoading: false
            };

        case AUTH_TYPE.RESET_LOGIN_LOADING:
            return {
                ...state,
                signUpLoading: false,
                loginLoading: false,
                socialLoginLoading: false
            };
        case AUTH_TYPE.RESET_EMAIL_SUCCESS:
            return {
                ...state,
                resendLink: action.payload
            };
        case AUTH_TYPE.RESEND_EMAIL_SUCCESS:
            return {
                ...state,
                resendLink: action.payload
            };
        case PROFILE_TYPE.PROFILE_SHOW_PROGRESS:
            return {
                ...state,
                showProfileLoading: action.status
            };
        case AUTH_TYPE.POST_EMAIL_LOOKUP_RESPONSE:
            return {
                ...state,
                isExistingEmail: action.payload,
                loader: false
            };
        default:
            return state;
    }
};
