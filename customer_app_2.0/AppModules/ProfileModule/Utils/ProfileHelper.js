import {
    addPrefixZero,
    checkIsValidEmail,
    firstCharacterUpperCased,
    getPhoneFromCountryNumber,
    getPolicyId,
    isCustomerApp,
    isNonCustomerApp,
    isTakeawaySupportOptomany,
    isValidElement,
    isValidNotEmptyString,
    isValidString,
    normalizePhoneNo,
    safeIntValue,
    safeStringValue,
    separateCountryPrefix
} from 't2sbasemodule/Utils/helpers';
import { ProfileConstants } from './ProfileConstants';
import { isUKApp, isValidField } from '../../BaseModule/GlobalAppHelper';
import { CONFIG_TYPE } from '../../BaseModule/GlobalAppConstants';
import { validName } from '../../AuthModule/Utils/AuthHelpers';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { getSavedCardStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS } from '../../AnalyticsModule/AnalyticsConstants';
import { OPT_IN, OPT_OUT } from '../../BaseModule/BaseConstants';
import { NETWORK_CONSTANTS } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { setUserSMSSubscription } from '../../AnalyticsModule/Braze';

export const getUpdatedProfileResponse = (profileResponse, key, value, policyLookupResponse) => {
    if (isValidElement(profileResponse)) {
        if (isValidElement(key) && Array.isArray(key) && isValidElement(value) && key.length > 0) {
            key.map((item) => {
                if (item === getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.email)) {
                    profileResponse[ProfileConstants.EMAIL_POLICY_KEY] = value;
                } else if (item === getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.sms)) {
                    profileResponse[ProfileConstants.SMS_POLICY_KEY] = value;
                } else if (item === getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.pushNotification)) {
                    profileResponse[ProfileConstants.NOTIFICATION_POLICY_KEY] = value;
                }
            });
        } else if (isValidElement(key) && isValidElement(value)) {
            if (key === ProfileConstants.EMAIL_POLICY_KEY) {
                profileResponse[ProfileConstants.EMAIL_POLICY_KEY] = value;
            } else if (key === ProfileConstants.SMS_POLICY_KEY) {
                profileResponse[ProfileConstants.SMS_POLICY_KEY] = value;
            } else if (key === ProfileConstants.NOTIFICATION_POLICY_KEY) {
                profileResponse[ProfileConstants.NOTIFICATION_POLICY_KEY] = value;
            }
        }
    }
    return profileResponse;
};

export const getExpiryDateForCardDetails = (expiry_date) => {
    if (isValidElement(expiry_date)) {
        return safeIntValue(expiry_date / 100) + '/' + (expiry_date % 100);
    }
};
export const getActualValues = (props) => {
    if (!props || !props.countryIso) return {};
    let { first_name, last_name, phone, email } = props.profileResponse;
    let phoneWithoutPrefix = normalizePhoneNo(separateCountryPrefix(safeStringValue(phone), props.countryIso));
    return {
        showUnsavedChangedPopUp: false,
        firstName: firstCharacterUpperCased(first_name),
        lastName: firstCharacterUpperCased(last_name),
        phone: isValidString(phoneWithoutPrefix) ? phoneWithoutPrefix : phone,
        emailId: email,
        showEmptyFirstNameError: false,
        inValidFirstName: false,
        showEmptyLastNameError: false,
        inValidLastName: false,
        showValidPhoneError: false,
        showValidEmailIdError: false
    };
};

export const isFieldValuesChanged = (props, state) => {
    if (!props || !state) return false;
    if (isValidElement(props.profileResponse)) {
        let { first_name, last_name, email, phone } = props.profileResponse;
        return (
            state.firstName !== firstCharacterUpperCased(first_name) ||
            state.lastName !== firstCharacterUpperCased(last_name) ||
            state.emailId !== email ||
            normalizePhoneNo(safeStringValue(state.phone)) !==
                normalizePhoneNo(separateCountryPrefix(safeStringValue(phone), props.countryIso))
        );
    } else return false;
};

export const fetchSMSSubscriptionStatus = (response) => {
    return (
        isValidElement(response) &&
        isValidElement(response.is_subscribed_sms) &&
        response.is_subscribed_sms === ProfileConstants.TOGGLE_SUBSCRIPTION_YES
    );
};
export const fetchEmailSubscriptionStatus = (response) => {
    return (
        isValidElement(response) &&
        isValidElement(response.is_subscribed_email) &&
        response.is_subscribed_email === ProfileConstants.TOGGLE_SUBSCRIPTION_YES
    );
};

export const fetchNotificationSubscriptionStatus = (response) => {
    return (
        isValidElement(response) &&
        isValidElement(response.is_subscribed_notification) &&
        response.is_subscribed_notification === ProfileConstants.TOGGLE_SUBSCRIPTION_YES
    );
};

export const validateProfileStates = (state, props) => {
    if (!state || !props) return {};
    let { firstName, lastName, phone, emailId } = state;
    phone = getPhoneFromCountryNumber(phone, props.s3ConfigResponse?.country?.id, props.s3ConfigResponse?.country?.iso);
    return {
        showEmptyFirstNameError: !isValidNotEmptyString(firstName),
        inValidFirstName: !validName(firstName),
        showEmptyLastNameError: !isValidNotEmptyString(lastName),
        inValidLastName: !validName(lastName),
        showValidPhoneError: !isValidString(phone) || !isValidField(props.s3ConfigResponse, CONFIG_TYPE.PHONE, phone),
        showValidEmailIdError: !isValidString(emailId) || !checkIsValidEmail(emailId)
    };
};

export const validateProfileFields = (state, props) => {
    if (!state || !props) return false;
    return (
        !(
            state.showEmptyFirstNameError ||
            state.inValidFirstName ||
            state.showEmptyLastNameError ||
            state.inValidLastName ||
            state.showValidPhoneError ||
            state.showValidEmailIdError
        ) && isFieldValuesChanged(props, state)
    );
};

export const getPrefixedCountryCode = (countryId, phone) => {
    return isUKApp(countryId) ? addPrefixZero(phone) : phone;
};

export const logSMSOptSegment = (featureGateResponse, status) => {
    setUserSMSSubscription(status, featureGateResponse);
};

export const showSavedCards = (storeConfigPaymentProvider, feature) => {
    return (
        (isCustomerApp() && isTakeawaySupportOptomany(storeConfigPaymentProvider)) || (isNonCustomerApp() && getSavedCardStatus(feature))
    );
};

export const logAutoOptInOut = (screenName, sms, email) => {
    Analytics.logEvent(screenName, ANALYTICS_EVENTS.AUTO_OTP_IN_OUT, {
        sms: sms ? OPT_IN : OPT_OUT,
        email: email ? OPT_IN : OPT_OUT
    });
};

export const checkNetworkInterruptionError = (e) => {
    if (isValidElement(e?.type) && e.type === NETWORK_CONSTANTS.NETWORK_ERROR) {
        showInfoMessage(LOCALIZATION_STRINGS.API_INTERRUPT_OTP);
    } else {
        showErrorMessage(e);
    }
};
