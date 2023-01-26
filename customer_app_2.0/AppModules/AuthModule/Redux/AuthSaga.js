import { all, call, delay, fork, put, putResolve, select, takeLeading } from 'redux-saga/effects';
import { Constants, Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { AuthNetwork } from '../Network/AuthNetwork';
import {
    boolValue,
    getPaymentProvider,
    getPolicyId,
    isNonCustomerApp,
    isValidElement,
    isValidString,
    setUserDetailsForCrashlytics
} from 't2sbasemodule/Utils/helpers';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { AUTH_TYPE } from './AuthType';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import {
    selectAccountVerified,
    selectCountryBaseFeatureGateSelector,
    selectLanguage,
    selectMobileAuthRedirection,
    selectOtpPhoneNumber,
    selectPolicyLookupResponse,
    selectS3Response,
    selectStoreConfigResponse,
    selectUserResponseWithoutConsent
} from 't2sbasemodule/Utils/AppSelectors';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { PROFILE_TYPE } from '../../ProfileModule/Redux/ProfileType';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { NO, OPT_IN, YES } from '../../BaseModule/BaseConstants';
import { getStoreId } from '../../ConfiguratorModule/Utils/ConfiguratorHelper';
import { makeGetCardDetailsCall, makePostReferralCall, makePostSendOTPCall } from '../../ProfileModule/Redux/ProfileSaga';
import { isExistingUser, isVerifyOtp } from 't2sbasemodule/UI/CustomUI/OTPModal/Utils/OTPHelper';
import { makeGetAddressCall } from '../../AddressModule/Redux/AddressSaga';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import {
    makeGetFoodhubTotalSavingsCall,
    makeGetRecentOrdersCall,
    makeGetRecentTakeawayCall
} from '../../../FoodHubApp/HomeModule/Redux/HomeSaga';
import { makeGetOrderListCall, makeSyncFirstTimerUserOpensAppOrLogin } from '../../OrderManagementModule/Redux/OrderManagementSaga';
import { CommonActions } from '@react-navigation/native';
import { popToTop } from '../../../CustomerApp/Navigation/NavigationService';
import { MODULE } from '../../SupportModule/Utils/SupportConstants';
import { handleHelpCenterRedirection, showMyTickets } from '../../SupportModule/Utils/SupportHelpers';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS } from '../../AnalyticsModule/AnalyticsConstants';
import { ProfileConstants, SAVED_CARD_FROM_SCREEN } from '../../ProfileModule/Utils/ProfileConstants';
import { appBase } from '../../../CustomerApp/Network/AppBaseNetwork';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { SCREEN_NAME } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import { selectBasketID, selectCountryBaseFeatureGateResponse } from '../../BasketModule/Redux/BasketSelectors';
import * as Braze from '../../AnalyticsModule/Braze';
import { ZohoSupport } from '../../../CustomerApp/NativeModules/ZohoDesk';
import { getStoreIDForConsent } from 'appmodules/AuthModule/Utils/AuthHelpers';
import { startLiveChat } from 'appmodules/BaseModule/Helper';
import { LOGIN_TYPE } from '../Utils/AuthConstants';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import appleAuth from '@invertase/react-native-apple-authentication';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { BOOL_CONSTANT } from '../../AddressModule/Utils/AddressConstants';
import { selectProfileResponseState } from '../../ProfileModule/Redux/ProfileSelectors';
import { selectReferralCode } from '../../ProfileModule/Redux/ProfileSelectors';
import { getReferralCampaignStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { convertProfileResponseToAnalytics } from '../../AnalyticsModule/Braze';
import { makeFHLogApiCall } from '../../FHLogsModule/Redux/FhLogsSaga';
import { getGraphQlQuery } from '../../BasketModule/Utils/BasketHelper';
import { FH_LOG_ERROR_CODE, FH_LOG_TYPE, ERROR_SOURCE } from '../../FHLogsModule/Utils/FhLogsConstants';

function* makePostRegisterCall(action) {
    try {
        yield put({ type: AUTH_TYPE.START_SIGN_UP_LOADING });
        const configurationData = yield select(getConfiguration);
        const response = yield apiCall(AuthNetwork.makePostRegisterCall, action);
        if (isValidElement(response) && isValidElement(response.id)) {
            //TODO this is for verifying the phone number after registered the new user
            yield putResolve({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: action.phone });
            yield putResolve({ type: AUTH_TYPE.PROFILE_SUCCESS_WITHOUT_CONSENT, payload: response });
            yield makeBulkUpdateConsentCall({
                ...action,
                profileID: response.id,
                storeId: getStoreId(configurationData),
                isFromSignUp: true
            });
            action.id = response.id;
            yield analyticsLog(Constants.SUCCESS, action, SEGMENT_CONSTANTS.EMAIL);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            yield handleSignUpError(action);
        }
    } catch (e) {
        showErrorMessage(e);
        yield handleSignUpError(action);
    }
}

function* handleSignUpError(action) {
    yield put({ type: AUTH_TYPE.REGISTER_ERROR, registerError: true });
    yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
    yield analyticsLog(Constants.FAILED, action, SEGMENT_CONSTANTS.EMAIL);
}

function* analyticsLog(response, action, type) {
    const s3ConfigResponse = yield select(selectS3Response);
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);

    let analyticsObject = {
        method: type,
        sms_opt_in: action.smsChecked,
        email_opt_in: action.emailChecked,
        notification_opt_in: action.notificationChecked
    };
    if (response === Constants.SUCCESS) {
        Braze.logLoginAnalytics(
            featureGateResponse,
            action,
            s3ConfigResponse?.country?.iso,
            SEGMENT_EVENTS.SIGN_UP_SUCCESS,
            analyticsObject
        );
    } else {
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.SIGN_UP_FAIL, {
            ...convertProfileResponseToAnalytics(action, s3ConfigResponse?.country?.iso),
            ...analyticsObject
        });
    }
}

function* makePostLoginCall(action) {
    try {
        yield put({ type: AUTH_TYPE.START_LOGIN_LOADING });
        const response = yield apiCall(AuthNetwork.makePostLoginCall, action);
        if (isValidElement(response)) {
            yield putResolve({ type: AUTH_TYPE.PROFILE_SUCCESS_WITHOUT_CONSENT, payload: response });
            if (isValidElement(response.phone)) {
                yield putResolve({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: response.phone });
            }
            yield fork(makeConsentLookupCall, SEGMENT_CONSTANTS.EMAIL, false);
        } else {
            yield put({ type: AUTH_TYPE.POST_LOGIN_ERROR, payload: response });
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
        }
    } catch (e) {
        yield put({ type: AUTH_TYPE.POST_LOGIN_ERROR, payload: e });
        showErrorMessage(e);
        yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
    }
}

function* makePostSocialLoginCall(action) {
    try {
        yield put({ type: AUTH_TYPE.START_SOCIAL_LOGIN_LOADING });
        const response = yield apiCall(AuthNetwork.makePostSocialLoginCall, action);
        if (isValidElement(response)) {
            yield putResolve({ type: AUTH_TYPE.PROFILE_SUCCESS_WITHOUT_CONSENT, payload: response });
            if (isValidElement(response.phone)) {
                yield putResolve({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: response.phone });
            }
            yield fork(makeConsentLookupCall, action.loginType);
        } else {
            yield put({ type: AUTH_TYPE.POST_SOCIAL_LOGIN_ERROR, payload: response });
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
        }
    } catch (e) {
        yield put({ type: AUTH_TYPE.POST_SOCIAL_LOGIN_ERROR, payload: e });
        showErrorMessage(e);
        yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
    }
}

function* makeGetProfileCall() {
    //TODO as of now we should get the complete profile response. Once API-2715 resolved we will remove this call from this saga
    try {
        const otpPhoneNumber = yield select(selectOtpPhoneNumber);
        const accountVerified = yield select(selectAccountVerified);
        const { redirectScreen, redirectParams } = yield select(selectMobileAuthRedirection);
        const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        const language = yield select(selectLanguage);
        const response = yield apiCall(AuthNetwork.makeGetProfileCall);
        const storeResponse = yield select(selectStoreConfigResponse);
        if (isValidElement(response)) {
            const s3Response = yield select(selectS3Response);
            Braze.setUserId(response, s3Response?.country?.iso, featureGateResponse);
            yield putResolve({ type: PROFILE_TYPE.GET_PROFILE_SUCCESS, payload: response });
            if (redirectParams) {
                handleNavigation(redirectScreen, redirectParams);
                if (redirectParams.module === MODULE.HELP_CENTER) {
                    handleHelpCenterRedirection(response, language);
                } else if (redirectParams.module === MODULE.MY_TICKETS) {
                    showMyTickets(response);
                } else if (redirectParams.module === MODULE.CONTACT_US) {
                    // showContactSupport(response);
                    handleNavigation(SCREEN_OPTIONS.MY_TICKETS_SCREEN.route_name);
                } else if (redirectParams.module === MODULE.LIVE_CHAT) {
                    startLiveChat(response, redirectParams.defaultLanguage, featureGateResponse);
                }
            } else {
                const isCheck = yield select(selectGuestUserBasketRedirection);
                if (isNonCustomerApp() && isValidElement(isCheck) && isCheck) {
                    popToTop();
                    const routes = yield select(selectBasketRouteNavigationReset);
                    const navigation = yield select(selectBasketRoutePropsNavigation);
                    if (isValidElement(routes) && routes.length > 0 && isValidElement(navigation)) {
                        const resetAction = CommonActions.reset({
                            index: routes.length - 1,
                            routes: routes
                        });
                        navigation.dispatch(resetAction);
                    }
                } else {
                    handleNavigation(
                        null,
                        {
                            screen: redirectScreen,
                            params: {
                                showUpdatePhoneNumber: redirectScreen === SCREEN_OPTIONS.PROFILE.route_name,
                                loginSuccess: true
                            }
                        },
                        redirectScreen
                    );
                }
            }

            if (redirectScreen === SCREEN_OPTIONS.BASKET.route_name) {
                let provider = getPaymentProvider(storeResponse?.payment_provider);
                yield* makeGetCardDetailsCall({ provider, fromScreen: SAVED_CARD_FROM_SCREEN.CART });
                yield* makeGetAddressCall();
            }
            if (!isExistingUser(accountVerified) && isVerifyOtp(accountVerified) && isValidElement(otpPhoneNumber)) {
                const action = {
                    phone: otpPhoneNumber,
                    otpType: accountVerified.type
                };
                yield fork(makePostSendOTPCall, action);
            }
            setUserDetailsForCrashlytics(response);
            if (isNonCustomerApp()) {
                yield fork(makeGetRecentTakeawayCall);
                yield fork(makeGetRecentOrdersCall);
                yield fork(makeGetOrderListCall);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeConsentLookupCall(loginType = SEGMENT_CONSTANTS.EMAIL, isFromSignUp = false) {
    const userResponse = yield select(selectUserResponseWithoutConsent);
    try {
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        const policyLookupResponse = yield select(selectPolicyLookupResponse);
        const referralCode = yield select(selectReferralCode);
        const response = yield apiCall(AuthNetwork.makeConsentLookupCall, {
            policy_id: getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.terms_and_conditions)
        });
        if (isValidElement(response) && isValidElement(response.data)) {
            // yield put({ type: PROFILE_TYPE.GET_PROFILE_SUCCESS, payload: profileResponse });
            yield put({ type: AUTH_TYPE.CONSENT_ID, payload: response.data.id });
            yield put({ type: AUTH_TYPE.ACCOUNT_VERIFIED, payload: userResponse.account_verified });
            yield makeGetProfileCall();
            yield fork(onLoginSuccess);

            yield call(Analytics.setUserId, ANALYTICS_EVENTS.USER_ID, response.data.id);
            const s3ConfigResponse = yield select(selectS3Response);
            if (!isFromSignUp) {
                Braze.logLoginAnalytics(featureGateResponse, userResponse, s3ConfigResponse?.country?.iso, SEGMENT_EVENTS.LOGIN_SUCCESS, {
                    method: loginType
                });
            }

            const order_info_id = yield select(selectBasketID);
            if (isValidElement(referralCode) && isValidElement(order_info_id) && getReferralCampaignStatus(featureGateResponse)) {
                yield makePostReferralCall({ referralCode, order_info_id, isFromSignUp });
            }
        } else {
            yield analyticsLog(Constants.SUCCESS, userResponse, loginType);
            handleNavigation(SCREEN_OPTIONS.AGREEMENT.route_name, { isFromSignUp });
        }
        yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
    } catch (e) {
        yield analyticsLog(Constants.SUCCESS, userResponse, loginType);
        yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
        handleNavigation(SCREEN_OPTIONS.AGREEMENT.route_name, { isFromSignUp });
    }
}

function* makeBulkUpdateConsentCall(action) {
    try {
        yield put({ type: AUTH_TYPE.START_SOCIAL_LOGIN_LOADING });
        yield put({ type: AUTH_TYPE.START_LOGIN_LOADING });
        yield put({ type: AUTH_TYPE.START_SIGN_UP_LOADING });
        let policyLookupResponse = yield select(selectPolicyLookupResponse);

        if (!isValidElement(policyLookupResponse)) {
            policyLookupResponse = yield apiCall(appBase.makePolicyLookupCall);
            if (isValidElement(policyLookupResponse)) {
                yield put({ type: TYPES_CONFIG.POLICY_LOOKUP_SUCCESS, payload: policyLookupResponse });
            }
        }

        let policyIds = [];
        let data = {};
        if (isValidElement(action.profileID)) {
            if (action.gdprChecked) {
                let termsAndConditionId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.terms_and_conditions);
                let termsOfUseId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.terms_of_use);
                let privacyPolicyId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.privacy_policy);
                if (isValidString(termsAndConditionId)) policyIds.push(termsAndConditionId);
                if (isValidString(termsOfUseId)) policyIds.push(termsOfUseId);
                if (isValidString(privacyPolicyId)) policyIds.push(privacyPolicyId);
            }
            if (action.emailChecked) {
                let emailPolicyId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.email);
                if (isValidString(emailPolicyId)) policyIds.push(emailPolicyId);
            }
            if (action.smsChecked) {
                let smsId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.sms);
                if (isValidString(smsId)) policyIds.push(smsId);
            }
            if (action.notificationChecked) {
                let notificationId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.pushNotification);
                if (isValidString(notificationId)) policyIds.push(notificationId);
            }

            data = {
                customer_id: action.profileID,
                store_id: action.storeId,
                policy_id: policyIds,
                action: OPT_IN,
                user_click_sms: action.smsChecked ? BOOL_CONSTANT.YES : BOOL_CONSTANT.NO,
                user_click_email: action.emailChecked ? BOOL_CONSTANT.YES : BOOL_CONSTANT.NO
            };
            yield makeBulkUpdateConsentApiCall(data, action.isFromSignUp);
        } else {
            yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
        showErrorMessage(e);
    }
}

function* makeBulkUpdateConsentApiCall(action, isFromSignUp = false) {
    try {
        let tempAction = action;
        if (isNonCustomerApp()) {
            const s3Response = yield select(selectS3Response);
            let storeId = getStoreIDForConsent(s3Response);
            tempAction = {
                ...action,
                store_id: storeId
            };
        }
        const response = yield apiCall(AuthNetwork.makeBulkUpdateConsentCall, tempAction);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            if (isValidElement(action.from) && action.from === SCREEN_NAME.ORDER_STATUS_SCREEN) {
                yield put({
                    type: PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE,
                    payload: {
                        policyLookupResponse: yield select(selectPolicyLookupResponse),
                        key: action.policy_id,
                        value: ProfileConstants.TOGGLE_SUBSCRIPTION_YES
                    }
                });
            } else {
                yield* makeConsentLookupCall(SEGMENT_CONSTANTS.EMAIL, isFromSignUp);
            }
        } else {
            yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        yield put({ type: AUTH_TYPE.RESET_LOGIN_LOADING });
        showErrorMessage(e);
    }
}

function* makeUpdateConsentCall(action) {
    try {
        const response = yield apiCall(AuthNetwork.makeUpdateConsentCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: AUTH_TYPE.UPDATE_CONSENT_SUCCESS, payload: true });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeUpdateEmailConsentCall(action) {
    try {
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        const profileResponse = yield select(selectProfileResponseState);
        action = {
            ...action,
            user_click_email: action.action === OPT_IN ? YES : NO,
            user_click_sms: profileResponse?.is_subscribed_sms === YES ? YES : NO
        };
        const response = yield apiCall(AuthNetwork.makeUpdateConsentCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: AUTH_TYPE.UPDATE_CONSENT_SUCCESS, payload: true });
            let status = action.action === OPT_IN ? YES : NO;
            Braze.setUserEmailSubscription(status, featureGateResponse);
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.EMAIL_OPT_IN_UPDATED, {
                email_opt_in: boolValue(status)
            });
            yield put({
                type: PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE,
                payload: {
                    key: ProfileConstants.EMAIL_POLICY_KEY,
                    value: status
                }
            });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeUpdateSMSConsentCall(action) {
    try {
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        const profileResponse = yield select(selectProfileResponseState);
        action = {
            ...action,
            user_click_email: profileResponse?.is_subscribed_email === YES ? YES : NO,
            user_click_sms: action.action === OPT_IN ? YES : NO
        };
        const response = yield apiCall(AuthNetwork.makeUpdateConsentCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: AUTH_TYPE.UPDATE_CONSENT_SUCCESS, payload: true });
            let status = action.action === OPT_IN ? YES : NO;
            Braze.setUserSMSSubscription(status, featureGateResponse);
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.SMS_OPT_IN_UPDATED, {
                sms_opt_in: boolValue(status)
            });
            yield put({
                type: PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE,
                payload: {
                    key: ProfileConstants.SMS_POLICY_KEY,
                    value: status
                }
            });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeUpdateNotificationConsentCall(action) {
    try {
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        const response = yield apiCall(AuthNetwork.makeUpdateNotificationCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: AUTH_TYPE.UPDATE_CONSENT_SUCCESS, payload: true });
            let status = action.action === OPT_IN ? YES : NO;
            Braze.setUserPushSubscription(status, featureGateResponse);
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.PUSH_PREFERENCE_CHANGED, {
                push_preference: boolValue(status)
            });
            yield put({
                type: PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE,
                payload: {
                    key: ProfileConstants.NOTIFICATION_POLICY_KEY,
                    value: status
                }
            });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeGetConsumerPromotionCall(action) {
    try {
        const response = yield apiCall(AuthNetwork.makeGetConsumerPromotionCall, action);
        if (isValidElement(response)) {
            yield put({ type: AUTH_TYPE.CONSUMER_PROMOTION_SUCCESS, payload: response });
            if (isValidElement(response.data)) {
                if (isValidString(response.data.is_subscribed_sms)) {
                    yield put({
                        type: PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE,
                        payload: {
                            key: ProfileConstants.SMS_POLICY_KEY,
                            value: response.data.is_subscribed_sms
                        }
                    });
                }
                if (isValidString(response.data.is_subscribed_email)) {
                    yield put({
                        type: PROFILE_TYPE.UPDATE_CONSENT_PROFILE_RESPONSE,
                        payload: {
                            key: ProfileConstants.EMAIL_POLICY_KEY,
                            value: response.data.is_subscribed_email
                        }
                    });
                }
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makePostForgotPasswordCall(action) {
    try {
        handleNavigation(SCREEN_OPTIONS.LOGIN.route_name);
        const response = yield apiCall(AuthNetwork.makePostForgotPasswordCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            if (action.isResendEmail) {
                yield put({ type: AUTH_TYPE.RESEND_EMAIL_SUCCESS, payload: false });
                showInfoMessage(LOCALIZATION_STRINGS.FORGOT_PASSWORD_SUCCESS_MSG);
            } else {
                yield put({ type: AUTH_TYPE.RESET_EMAIL_SUCCESS, payload: true });
                showInfoMessage(LOCALIZATION_STRINGS.FORGOT_PASSWORD_SUCCESS_MSG);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makeLogoutAction() {
    //TODO Later We can implemented LOGOUT API if need
    try {
        GoogleSignin.signOut();
        ZohoSupport.logoutUser();
        yield fork(makeGetFoodhubTotalSavingsCall);
        // yield* makeSessionTokenRefresh();
        yield delay(1500);
    } catch (e) {
        showErrorMessage(e);
    }
}

function* onLoginSuccess() {
    try {
        yield makeSyncFirstTimerUserOpensAppOrLogin();
    } catch (e) {
        // No action required
    }
}

function* makeGetEmailLookUpCall(action) {
    yield put({ type: AUTH_TYPE.POST_EMAIL_LOOKUP_RESPONSE, payload: null });
    try {
        const response = yield apiCall(AuthNetwork.makeGetEmailLookUpCall, action);
        if (isValidElement(response) && isValidElement(response.outcome)) {
            yield put({ type: AUTH_TYPE.POST_EMAIL_LOOKUP_RESPONSE, payload: response.existing });
        } else {
            yield put({ type: AUTH_TYPE.POST_EMAIL_LOOKUP_RESPONSE, payload: false });
        }
    } catch (e) {
        yield put({ type: AUTH_TYPE.POST_EMAIL_LOOKUP_RESPONSE, payload: false });
    }
}
function* handleSocialLogin(action) {
    switch (action.LoginType) {
        case LOGIN_TYPE.GOOGLE:
            yield fork(handleGoogleLogin);
            break;
        case LOGIN_TYPE.FACEBOOK:
            yield fork(handleFacebookLogin);
            break;
        case LOGIN_TYPE.APPLE:
            yield fork(handleAppleLogin);
            break;
        default:
            return;
    }
}

function* updateSocialLoginFailApiCall(eventData) {
    try {
        const graphqlQuery = getGraphQlQuery(eventData.type, eventData.error, FH_LOG_ERROR_CODE.SOCIAL_LOGIN_FAILURE, ERROR_SOURCE.APP);
        yield fork(makeFHLogApiCall, { graphqlQuery });
    } catch (e) {
        //TODO nothing to handle
    }
}

function* handleGoogleLogin() {
    const hasPlayServices = yield GoogleSignin.hasPlayServices();
    if (hasPlayServices) {
        try {
            yield GoogleSignin.signIn();
            const token = yield GoogleSignin.getTokens();
            yield fork(makePostSocialLoginCall, {
                loginType: LOGIN_TYPE.GOOGLE,
                token: isValidElement(token) && isValidElement(token.accessToken) && token.accessToken
            });
        } catch (error) {
            let eventData = { type: FH_LOG_TYPE.SOCIAL_LOGIN_FAILURE, error: error };
            yield fork(updateSocialLoginFailApiCall, eventData);
            showErrorMessage(LOCALIZATION_STRINGS.LOGIN_CANCELLED);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                showErrorMessage(LOCALIZATION_STRINGS.LOGIN_CANCELLED);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                showErrorMessage(statusCodes.IN_PROGRESS);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                showErrorMessage(`${LOCALIZATION_STRINGS.LOGIN_CANCELLED}: ${statusCodes.PLAY_SERVICES_NOT_AVAILABLE}`);
            } else {
                // some other error happened
                showErrorMessage(`${LOCALIZATION_STRINGS.LOGIN_CANCELLED}: ${error.message}`);
            }
        }
    } else {
        showErrorMessage(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
    }
}

function* handleFacebookLogin() {
    try {
        const result = yield LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            showErrorMessage(LOCALIZATION_STRINGS.LOGIN_CANCELLED);
        } else {
            const data = yield AccessToken.getCurrentAccessToken();
            yield fork(makePostSocialLoginCall, { loginType: LOGIN_TYPE.FACEBOOK, token: data.accessToken });
        }
    } catch (e) {
        let eventData = { type: FH_LOG_TYPE.SOCIAL_LOGIN_FAILURE, error: e };
        yield fork(updateSocialLoginFailApiCall, eventData);
        showErrorMessage(LOCALIZATION_STRINGS.LOGIN_CANCELLED);
    }
}
function* handleAppleLogin() {
    if (!appleAuth.isSupported) {
        return;
    }
    try {
        const appleAuthRequestResponse = yield appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            nonceEnabled: false
        });
        const { user, fullName, authorizationCode } = appleAuthRequestResponse;

        let first_name = isValidElement(fullName) && isValidString(fullName.givenName) ? fullName.givenName : undefined;
        let last_name = isValidElement(fullName) && isValidString(fullName.familyName) ? fullName.familyName : undefined;
        /**
         * getCredentialStateForUser - this will not work for simulator it will work only for real time devices
         * just check the isValidElement(authorizationCode) while trying the apple sign-in in simulator
         *
         */
        const credentialState = yield appleAuth.getCredentialStateForUser(user);
        if (isValidElement(authorizationCode) && isValidElement(credentialState) && credentialState === appleAuth.State.AUTHORIZED) {
            yield fork(makePostSocialLoginCall, { loginType: LOGIN_TYPE.APPLE, token: authorizationCode, first_name, last_name });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.LOGIN_FAILED);
        }
    } catch (error) {
        let eventData = { type: FH_LOG_TYPE.SOCIAL_LOGIN_FAILURE, error: error };
        yield fork(updateSocialLoginFailApiCall, eventData);
        showErrorMessage(LOCALIZATION_STRINGS.LOGIN_CANCELLED);
        if (error.code === appleAuth.Error.CANCELED || error.code === appleAuth.Error.UNKNOWN) {
            showErrorMessage(LOCALIZATION_STRINGS.LOGIN_CANCELLED);
        } else {
            showErrorMessage(error.message);
        }
    }
}

const selectBasketRouteNavigationReset = (state) => state.takeawayListReducer.redirectBasketRoute;
const selectBasketRoutePropsNavigation = (state) => state.takeawayListReducer.redirectNavigation;
const selectGuestUserBasketRedirection = (state) => state.takeawayListReducer.fromTakeawayList;

function* AuthSaga() {
    yield all([
        takeLeading(AUTH_TYPE.POST_REGISTER, makePostRegisterCall),
        takeLeading(AUTH_TYPE.POST_LOGIN, makePostLoginCall),
        takeLeading(AUTH_TYPE.POST_SOCIAL_LOGIN, makePostSocialLoginCall),
        takeLeading(AUTH_TYPE.BULK_UPDATE_CONSENT, makeBulkUpdateConsentCall),
        takeLeading(AUTH_TYPE.UPDATE_CONSENT, makeUpdateConsentCall),
        takeLeading(AUTH_TYPE.UPDATE_SMS_CONSENT, makeUpdateSMSConsentCall),
        takeLeading(AUTH_TYPE.UPDATE_EMAIL_CONSENT, makeUpdateEmailConsentCall),
        takeLeading(AUTH_TYPE.UPDATE_NOTIFICATION_CONSENT, makeUpdateNotificationConsentCall),
        takeLeading(AUTH_TYPE.CONSUMER_PROMOTION, makeGetConsumerPromotionCall),
        takeLeading(AUTH_TYPE.POST_FORGOT_PASSWORD, makePostForgotPasswordCall),
        takeLeading(AUTH_TYPE.SET_LOGOUT_ACTION, makeLogoutAction),
        takeLeading(AUTH_TYPE.RECEIVE_OFFER_UPDATE_CONSENT, makeBulkUpdateConsentApiCall),
        takeLeading(AUTH_TYPE.POST_EMAIL_LOOKUP, makeGetEmailLookUpCall),
        takeLeading(AUTH_TYPE.HANDLE_SOCIAL_LOGIN, handleSocialLogin)
    ]);
}

export default AuthSaga;
