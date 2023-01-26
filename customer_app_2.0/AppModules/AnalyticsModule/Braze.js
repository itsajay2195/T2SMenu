import {
    boolValue,
    convertFloat,
    getPhoneNumberNormalized,
    isArrayNonEmpty,
    isDebugBuildType,
    isFoodHubApp,
    isValidElement,
    isValidString,
    safeStringValue
} from 't2sbasemodule/Utils/helpers';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS } from './SegmentConstants';
import { isTPAnalyticsEnabled } from './Utils/AnalyticsHelper';
import ReactMoE, { MoEAppStatus, MoEGeoLocation, MoEProperties } from 'react-native-moengage';
import { isAndroid } from '../BaseModule/Helper';
import moment from 'moment-timezone';
import { BOOL_CONSTANT } from '../AddressModule/Utils/AddressConstants';
import { deliveryOrderSortByOrderPlacedTime } from '../../FoodHubApp/HomeModule/Utils/Helper';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { ProfileConstants } from 'appmodules/ProfileModule/Utils/ProfileConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS } from './AnalyticsConstants';

export const analyticsInitialize = () => {
    try {
        if (isFoodHubApp()) {
            ReactMoE.initialize();
            if (isDebugBuildType()) {
                ReactMoE.enableSDKLogs();
            }
        } else {
            ReactMoE.disableSdk();
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'analyticsInitialize'
        });
    }
};

export const logInstallOrUpdateAnalytics = (lastInstallVersion, currentVersion) => {
    try {
        if (lastInstallVersion === null) {
            ReactMoE.setAppStatus(MoEAppStatus.Install);
            return true;
        } else if (lastInstallVersion !== currentVersion) {
            ReactMoE.setAppStatus(MoEAppStatus.Update);
            return true;
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'logInstallOrUpdateAnalytics'
        });
    }
    return false;
};

export const logAppOpenAnalytics = () => {
    try {
        Analytics.logEventWithName(SEGMENT_EVENTS.APP_OPEN);
        ReactMoE.trackEvent(SEGMENT_EVENTS.APP_OPEN);
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'logAppOpenAnalytics'
        });
    }
};

export const logLoginAnalytics = (featureGateResponse, userResponse, countryIso, eventName, object) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            ReactMoE.setUserUniqueID(userResponse.id);
        }
        let obj = {
            ...convertProfileResponseToAnalytics(userResponse, countryIso),
            ...object
        };
        trackEvent(featureGateResponse, eventName, obj);
        if (eventName === SEGMENT_EVENTS.SIGN_UP_SUCCESS) {
            trackEvent(featureGateResponse, SEGMENT_EVENTS.LOGIN_SUCCESS, obj);
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'logLoginAnalytics'
        });
    }
};

export function convertProfileResponseToAnalytics(userResponse, countryIso) {
    if (isValidElement(userResponse)) {
        return {
            email: userResponse.email,
            first_name: userResponse.first_name,
            last_name: userResponse.last_name,
            phone: getPhoneNumberNormalized(userResponse.phone, countryIso),
            user_id: userResponse.id,
            country_code: countryIso
        };
    } else {
        return {};
    }
}

export const logLogoutAnalytics = (featureGateResponse, method) => {
    try {
        trackEvent(featureGateResponse, SEGMENT_EVENTS.SIGN_OUT, {
            method: method
        });
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            ReactMoE.logout();
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'logLogoutAnalytics'
        });
    }
};

export const setAnalyticsPushNotification = (fcmToken) => {
    try {
        if (isAndroid()) {
            ReactMoE.passFcmPushToken(fcmToken);
        } else {
            ReactMoE.registerForPush();
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setAnalyticsPushNotification'
        });
    }
};

export const setUserId = (profile, countryIso, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            if (isValidElement(profile) && isValidElement(profile.id)) {
                ReactMoE.setAlias(safeStringValue(profile.id));
                setUserProfileInfo(profile, countryIso, featureGateResponse);
            }
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserId'
        });
    }
};

export const trackEvent = (featureGateResponse, event, object = {}, interactive = true) => {
    Analytics.logEventWithName(event, object);
    try {
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            const properties = convertToMoeProperties(object);
            if (interactive === false) {
                properties.setNonInteractiveEvent();
            }
            ReactMoE.trackEvent(event, properties);
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'trackEvent',
            event
        });
    }
};

export const setUserProfileInfo = (profile, countryIso, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse) && isValidElement(profile)) {
            const {
                first_name,
                last_name,
                email,
                phone,
                is_subscribed_email,
                is_subscribed_notification,
                is_subscribed_sms,
                created_at
            } = profile;
            ReactMoE.setUserFirstName(first_name === ProfileConstants.NONAME ? '' : first_name ?? '');
            ReactMoE.setUserLastName(last_name === ProfileConstants.NONAME ? '' : last_name ?? '');
            ReactMoE.setUserEmailID(isValidElement(email) ? email : '');
            ReactMoE.setUserContactNumber(getPhoneNumberNormalized(phone, countryIso));
            setUserEmailSubscription(is_subscribed_email, featureGateResponse);
            setUserPushSubscription(is_subscribed_notification, featureGateResponse);
            setUserSMSSubscription(is_subscribed_sms, featureGateResponse);
            let created_at_obj = convertToMoeDate(created_at);
            if (isValidElement(created_at_obj)) {
                ReactMoE.setUserAttributeISODateString(SEGMENT_CONSTANTS.CREATED_TIME, created_at_obj);
            }
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserProfileInfo'
        });
    }
};

export const setUserEmailSubscription = (isEmailSubscribed, featureGateResponse) => {
    ///todo: can change later. MoEngage android and ios values differ. Hence sending bool as string
    //check this file and change all occurrence of such condition in future
    try {
        let isSubscribed = boolValue(isEmailSubscribed);
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.EMAIL_UNSUBSCRIBE, !isSubscribed);
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.EMAIL_OPT, isSubscribed ? 'true' : 'false');
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserEmailSubscription'
        });
    }
};

export const setUserPushSubscription = (isPushSubscribed, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.PUSH_NOTIFICATION_SUBSCRIBE, boolValue(isPushSubscribed) ? 'true' : 'false');
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserPushSubscription'
        });
    }
};

export const setUserSMSSubscription = (is_subscribed_sms, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.SMS_OPT, boolValue(is_subscribed_sms) ? 'true' : 'false');
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserSMSSubscription'
        });
    }
};

export const setUserHomeCity = (homeCity, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse) && isValidElement(homeCity)) {
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.HOME_CITY, homeCity);
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserHomeCity'
        });
    }
};

export const setUserCountry = (country, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse) && isValidElement(country)) {
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.COUNTRY, country);
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserCountry'
        });
    }
};

export const setUserLanguage = (language, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse) && isValidElement(language)) {
            ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.LANGUAGE, language);
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserLanguage'
        });
    }
};

export const setSavedCardUserProperty = (savedCards, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse) && isValidElement(savedCards?.length)) {
            ReactMoE.setUserAttribute(SEGMENT_EVENTS.SAVED_CARDS, boolValue(savedCards.length > 0) ? 'true' : 'false');
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setSavedCardUserProperty'
        });
    }
};

export const setLastOrderUserAttributes = (order, featureGateResponse) => {
    try {
        if (isTPAnalyticsEnabled(featureGateResponse) && isValidElement(order) && isValidElement(order.length)) {
            ReactMoE.setUserAttribute(SEGMENT_EVENTS.PREVIOUS_ORDER, boolValue(order.length > 0) ? 'true' : 'false');
            if (order.length > 0) {
                const latestOrder = deliveryOrderSortByOrderPlacedTime(order);
                const latestOrder_obj = convertToMoeDate(latestOrder[0]?.order_placed_on);
                ReactMoE.setUserAttributeISODateString(SEGMENT_EVENTS.LAST_ORDER_DATE, latestOrder_obj);
            }
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setLastOrderUserAttributes'
        });
    }
};

export const setUserLocationUserAttributes = (addressResponse, featureGateResponse, isAddressList = true) => {
    //pass isAddressList as false to directly pass only one address
    try {
        if (isTPAnalyticsEnabled(featureGateResponse)) {
            let primaryAddress = !isAddressList
                ? addressResponse
                : addressResponse?.data?.find((item) => item?.is_primary === BOOL_CONSTANT.YES);
            if (!isValidElement(primaryAddress)) {
                primaryAddress = isArrayNonEmpty(addressResponse?.data) ? addressResponse.data[0] : {};
            }

            if (isValidElement(primaryAddress)) {
                ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.AREA, primaryAddress.area ?? 'NA');
                ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.POSTCODE, primaryAddress.postcode ?? 'NA');
                let lat = convertFloat(primaryAddress.latitude);
                let lng = convertFloat(primaryAddress.longitude);
                if (lat && lng) {
                    ReactMoE.setUserAttributeLocation(SEGMENT_CONSTANTS.LOCATION, new MoEGeoLocation(lat, lng)); //todo: need to change this value if address is removed
                }
                ReactMoE.setUserAttribute(SEGMENT_CONSTANTS.HOME_CITY, primaryAddress.address_line2 ?? 'NA');
            }
        }
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString(),
            type: 'setUserLocationUserAttributes'
        });
    }
};

export function convertToMoeDate(dateString, date_format = DATE_FORMAT.YYYY_MM_DD_HH_MM_SS) {
    if (isValidString(dateString)) {
        try {
            return moment(dateString, date_format).toISOString();
        } catch (e) {
            return null;
        }
    }
    return null;
}

export const convertToMoeProperties = (object) => {
    try {
        let moeProperties = new MoEProperties();
        if (isValidElement(object)) {
            for (let key in object) {
                if (isValidElement(object[key])) {
                    if (object[key].toISOString) {
                        moeProperties.addDateAttribute(key, object[key].toISOString());
                    } else {
                        moeProperties.addAttribute(key, object[key]);
                    }
                }
            }
        }
        return moeProperties;
    } catch (e) {
        Analytics.logEventWithName(ANALYTICS_EVENTS.FAILED_MOENGAGE_EVENT, {
            error: e?.toString()
        });
        return null;
    }
};
