import { all, call, delay, fork, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { ProfileNetwork } from '../Network/ProfileNetwork';
import { getPaymentProvider, isCustomerApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { PROFILE_TYPE } from './ProfileType';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { TYPES_CONFIG, TYPES_SIDE_MENU } from '../../../CustomerApp/Redux/Actions/Types';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { AUTH_TYPE } from '../../AuthModule/Redux/AuthType';
import { isExistingUser, isVerifyOtp } from 't2sbasemodule/UI/CustomUI/OTPModal/Utils/OTPHelper';
import { ERROR_CODE } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerConstants';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { AuthNetwork } from '../../AuthModule/Network/AuthNetwork';
import {
    getUserLoggedIn,
    selectAccessToken,
    selectCountryBaseFeatureGateSelector,
    selectS3Response,
    selectStoreConfigResponse,
    selectUserPhoneNumber
} from 't2sbasemodule/Utils/AppSelectors';
import { makeUpdateBasketCall, updatePaymentMode } from '../../BasketModule/Redux/BasketSaga';
import { selectUserSelectedCardId } from '../../BasketModule/Redux/BasketSelectors';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS } from '../../AnalyticsModule/AnalyticsConstants';
import { logEvent, logNonFatalEvent } from '../../AnalyticsModule/Analytics';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { checkNetworkInterruptionError } from '../Utils/ProfileHelper';
import { SEGMENT_EVENTS, SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import * as Braze from '../../AnalyticsModule/Braze';
import { BASKET_UPDATE_TYPE } from '../../BasketModule/Utils/BasketConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { selectIsPBLProfileUpdate, selectIsUpdateProfile, selectRecentPBLAction, selectReferralCode } from './ProfileSelectors';
import { getReferralCampaignStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { convertProfileResponseToAnalytics } from '../../AnalyticsModule/Braze';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { getStoreId } from '../../ConfiguratorModule/Utils/ConfiguratorHelper';
import { SAVED_CARD_FROM_SCREEN } from '../Utils/ProfileConstants';

export function* makeGetProfileCall(action) {
    try {
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        const response = yield apiCall(AuthNetwork.makeGetProfileCall);
        if (isValidElement(response)) {
            yield put({ type: PROFILE_TYPE.GET_PROFILE_SUCCESS, payload: response });
            const s3Response = yield select(selectS3Response);
            Braze.setUserProfileInfo(response, s3Response?.country?.iso, featureGateResponse);
        } else {
            if (action?.errorMessageDisplay !== false) {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
            yield put({ type: PROFILE_TYPE.UPDATE_PROFILE_API_STATUS, payload: true });
        }
    } catch (e) {
        if (action?.errorMessageDisplay !== false) {
            showErrorMessage(e);
        }
        yield put({ type: PROFILE_TYPE.UPDATE_PROFILE_API_STATUS, payload: true });
    }
}

function* makeUpdateProfileCall(action) {
    try {
        // Profile:: prop for showing progress
        // We show progress once profile is getting updated
        yield putResolve({ type: PROFILE_TYPE.PROFILE_SHOW_PROGRESS, status: true });
        const accessToken = yield select(selectAccessToken);
        const account_verified = yield apiCall(ProfileNetwork.makeUpdateProfileCall, { action, accessToken });
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        if (
            isValidElement(account_verified) &&
            isValidElement(account_verified.outcome) &&
            account_verified.outcome === T2SBaseConstants.SUCCESS
        ) {
            //TODO this is for verifying the phone number after registered the new user
            yield put({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: action.phone });
            yield put({ type: AUTH_TYPE.ACCOUNT_VERIFIED, payload: account_verified, isUpdateProfile: action.isUpdateProfile });
            if (!isExistingUser(account_verified) && isVerifyOtp(account_verified) && isValidString(action.phone)) {
                const sendOtpAction = {
                    phone: action.phone,
                    otpType: account_verified.type,
                    isUpdateProfile: action.isUpdateProfile,
                    isFromPayByLink: action.isFromPayByLink
                };
                yield* makePostSendOTPCall(sendOtpAction);
            }
            yield* refreshSavedCardDetails(action.phone);
            if (isValidElement(account_verified) && !isVerifyOtp(account_verified)) {
                yield* makeGetProfileCall();
                showInfoMessage(LOCALIZATION_STRINGS.PROFILE_UPDATE_SUCCESS);
            }
            const s3Response = yield select(selectS3Response);
            Segment.trackEvent(
                featureGateResponse,
                SEGMENT_EVENTS.UPDATED_PROFILE_DETAILS,
                convertProfileResponseToAnalytics(action, s3Response?.country?.iso)
            );
            Braze.setUserProfileInfo(action, s3Response?.country?.iso, featureGateResponse);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        if (e.code === ERROR_CODE.DUPLICATE) {
            yield put({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: action.phone });
            yield put({
                type: PROFILE_TYPE.DUPLICATE_PHONE_NUMBER,
                isDuplicatePhone: true,
                showOTPConfirmModel: true,
                isUpdateProfile: action.isUpdateProfile
            });
        } else {
            showErrorMessage(e.message);
        }
    }
    // Profile:: prop for hiding progress
    // Something went wrong, so hiding the progress
    yield putResolve({ type: PROFILE_TYPE.PROFILE_SHOW_PROGRESS, status: false });
}

/**
 * Whenever the phone number changed we should update the saved card info
 */
function* refreshSavedCardDetails(newPhoneNumber) {
    const oldPhoneNumber = yield select(selectUserPhoneNumber);
    if (oldPhoneNumber !== newPhoneNumber) {
        const storeConfigResponse = isCustomerApp() ? yield select(selectStoreConfigResponse) : null;
        let provider = getPaymentProvider(storeConfigResponse?.payment_provider);
        yield* makeGetCardDetailsCall({ provider, fromScreen: SAVED_CARD_FROM_SCREEN.PROFILE });
    }
}

export function* makePostSendOTPCall(action) {
    try {
        yield putResolve({ type: PROFILE_TYPE.PROFILE_SHOW_PROGRESS, status: true });
        let isUpdateProfile = isValidElement(action.isUpdateProfile) ? action.isUpdateProfile : yield select(selectIsUpdateProfile);
        let isFromPayByLink = isValidElement(action.isFromPayByLink) ? action.isFromPayByLink : yield select(selectIsPBLProfileUpdate);
        const response = yield apiCall(ProfileNetwork.makePostSendOTPCall, action);
        logEvent(null, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS.PHONE_NO_VALIDATION_CALL);
        if (isValidElement(response) && isValidElement(response.message) && response.message === T2SBaseConstants.SUCCESS) {
            yield put({
                type: PROFILE_TYPE.OTP_LENGTH,
                payload: isValidElement(response.length) ? response.length : 4
            });
            yield put({ type: PROFILE_TYPE.SHOW_HIDE_VERIFY_OTP, payload: true, isUpdateProfile, isFromPayByLink });
        }
    } catch (e) {
        yield* handleErrorMessages(action, e);
    }
    yield putResolve({ type: PROFILE_TYPE.PROFILE_SHOW_PROGRESS, status: false });
}

function* handleErrorMessages(action, e) {
    if (action.isResend) {
        yield put({ type: PROFILE_TYPE.VERIFY_OTP_ERROR_MSG, payload: e?.message });
        if (e?.code === ERROR_CODE.OTP_ATTEMPTS_FAILURE) {
            logEvent(null, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS.PHONE_NO_VALIDATION_EXPIRED);
            yield put({ type: PROFILE_TYPE.OTP_LIMIT_EXCEEDED, payload: true });
        } else checkNetworkInterruptionError(e);
    } else {
        checkNetworkInterruptionError(e);
    }
}

function* makeVerifyOTPCall(action) {
    try {
        const response = yield apiCall(ProfileNetwork.makeVerifyOTPCall, action);
        let isFromPayByLink = yield select(selectIsPBLProfileUpdate);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: PROFILE_TYPE.DUPLICATE_PHONE_NUMBER, isDuplicatePhone: false });
            yield call(resetVerifyOtpValues);
            yield put({ type: AUTH_TYPE.ACCOUNT_VERIFIED, payload: response });
            yield call(makeGetProfileCall);
            showInfoMessage(LOCALIZATION_STRINGS.PROFILE_UPDATE_SUCCESS);
            if (action.isUpdateProfile) {
                yield fork(makeUpdateBasketCall, { updateType: BASKET_UPDATE_TYPE.VIEW, allergyInfo: '' });
                let pbl = yield select(selectRecentPBLAction);
                if (isFromPayByLink && isValidString(pbl?.host) && pbl?.orderId > 0) {
                    yield put({
                        type: TYPES_CONFIG.PBL_TO_PAY,
                        host: pbl?.host,
                        orderId: pbl?.orderId,
                        cutomerID: pbl?.cutomerID,
                        store: pbl?.store,
                        url: `https://${pbl?.host}/paybylink/${pbl?.orderId}?source=qr&product=MY-TAKEAWAY`
                    });
                } else {
                    handleNavigation(SCREEN_OPTIONS.BASKET.route_name, { isProfileUpdated: new Date() });
                }
            }
        }
    } catch (e) {
        if (e.code === ERROR_CODE.OTP_ATTEMPTS_FAILURE) {
            logNonFatalEvent(null, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS.PHONE_NO_VALIDATION_EXPIRED);
            yield put({ type: PROFILE_TYPE.OTP_LIMIT_EXCEEDED, payload: true });
        }
        yield put({ type: PROFILE_TYPE.VERIFY_OTP_ERROR_MSG, payload: e.message });
    }
}

function* makeExportDataCall(action) {
    try {
        const response = yield apiCall(ProfileNetwork.makeExportDataCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            showInfoMessage(LOCALIZATION_STRINGS.EXPORT_DATA_SUCCESS_MSG);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.EXPORT_DATA_FAILURE_MSG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeDeleteAccountCall(action) {
    //TODO it's same like ExportData but we should keep in separated because, from API the might change this one as delete request instead of post
    try {
        const response = yield apiCall(ProfileNetwork.makeDeleteAccountCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield putResolve({ type: AUTH_TYPE.SET_LOGOUT_ACTION });
            const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
            Braze.logLogoutAnalytics(featureGateResponse, SEGMENT_STRINGS.DELETE);
            yield delay(1300);
            yield putResolve({ type: TYPES_SIDE_MENU.SET_ACTIVE_SIDE_MENU, activeMenu: SCREEN_OPTIONS.HOME.route_name });
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
            showInfoMessage(LOCALIZATION_STRINGS.DELETE_MESSAGE);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makeGetCardDetailsCall(action) {
    try {
        let storeID;
        const config = yield select(getConfiguration);
        if (isValidElement(config)) {
            storeID = getStoreId(config);
        }
        if (isValidString(storeID)) action.store_id = storeID;

        const response = yield apiCall(ProfileNetwork.makeGetCardDetailsCall, action);
        if (isValidElement(response) && isValidElement(response.data)) {
            yield put({ type: PROFILE_TYPE.GET_CARD_DETAILS_SUCCESS, payload: response.data });
            const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
            Braze.setSavedCardUserProperty(response.data, featureGateResponse);
        }
    } catch (e) {
        // do nothing
    }
}

function* makeDeleteCardDetailsCall(action) {
    try {
        const response = yield apiCall(ProfileNetwork.makeDeleteCardDetailCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            showInfoMessage(LOCALIZATION_STRINGS.CARD_DELETE_MESSAGE);
            action.fromScreen = SAVED_CARD_FROM_SCREEN.PROFILE;
            yield makeGetCardDetailsCall(action);
            const userSelectedCardId = yield select(selectUserSelectedCardId);
            if (userSelectedCardId === action.id) {
                yield put({
                    type: BASKET_TYPE.UPDATE_USER_SELECTED_CARD_ID,
                    user_selected_card_id: null
                });
            }
            yield fork(updatePaymentMode);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makePostReferralCall(action) {
    const screenName =
        isValidElement(action.isFromSignUp) && action.isFromSignUp ? ANALYTICS_SCREENS.SIGN_UP_SCREEN : ANALYTICS_SCREENS.BASKET_SCREEN;
    try {
        const response = yield apiCall(ProfileNetwork.makePostReferralCall, action);
        if (isValidElement(response?.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            Analytics.logEvent(screenName, ANALYTICS_EVENTS.REFERRAL_SUCCESS, { code: action.referralCode });
        }
    } catch (e) {
        Analytics.logEvent(screenName, ANALYTICS_EVENTS.REFERRAL_FAILURE, { code: action.referralCode });
    }
}

export function* syncProfileForReferral() {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    const isLoggedIn = yield select(getUserLoggedIn);
    const referralCode = yield select(selectReferralCode);
    const referralEnabled = getReferralCampaignStatus(featureGateResponse);
    if (isLoggedIn && referralEnabled && !isValidElement(referralCode)) {
        yield fork(makeGetProfileCall);
    }
}

function* resetVerifyOtpValues() {
    yield put({ type: PROFILE_TYPE.SHOW_HIDE_VERIFY_OTP, payload: false });
    yield put({ type: PROFILE_TYPE.OTP_LIMIT_EXCEEDED, payload: false });
    yield put({ type: PROFILE_TYPE.VERIFY_OTP_ERROR_MSG, payload: null });
    yield put({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: null });
    yield put({ type: AUTH_TYPE.ACCOUNT_VERIFIED, payload: null });
}

function* ProfileSaga() {
    yield all([
        takeLatest(PROFILE_TYPE.GET_PROFILE, makeGetProfileCall),
        takeLatest(PROFILE_TYPE.UPDATE_PROFILE, makeUpdateProfileCall),
        takeLatest(PROFILE_TYPE.POST_SEND_OTP, makePostSendOTPCall),
        takeLatest(PROFILE_TYPE.VERIFY_OTP, makeVerifyOTPCall),
        takeLatest(PROFILE_TYPE.EXPORT_DATA, makeExportDataCall),
        takeLatest(PROFILE_TYPE.DELETE_ACCOUNT, makeDeleteAccountCall),
        takeLatest(PROFILE_TYPE.GET_CARD_DETAILS, makeGetCardDetailsCall),
        takeLatest(PROFILE_TYPE.DELETE_CARD_DETAILS, makeDeleteCardDetailsCall),
        takeLatest(PROFILE_TYPE.RESET_VERIFY_OTP_VALUES, resetVerifyOtpValues),
        takeLatest(PROFILE_TYPE.POST_REFERRAL_CODE, makePostReferralCall)
    ]);
}

export default ProfileSaga;
