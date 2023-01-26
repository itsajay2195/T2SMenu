import { isValidString } from 't2sbasemodule/Utils/helpers';
import { ANALYTICS_CATEGORY, ANALYTICS_EVENTS, ANALYTICS_SCREENS } from './AnalyticsConstants';
import { LOCALIZATION_STRINGS } from '../LocalizationModule/Utils/Strings';
import * as Analytics from '../../T2SBaseModule/Utils/Analytics';
import crashlytics from '@react-native-firebase/crashlytics';

export const logScreen = (screenName) => {
    try {
        Analytics.logEvent(ANALYTICS_EVENTS.SCREEN_VIEW, {
            category: ANALYTICS_CATEGORY.SCREEN,
            screen_name: screenName,
            screen_class: screenName
        });
    } catch (e) {
        // Failed while logging}
    }
};

export const setUserId = (id) => {
    try {
        Analytics.setUserId(id);
    } catch (e) {
        // Failed while logging
    }
};

export const setUserProperty = (name, value) => {
    try {
        Analytics.setUserProperty(name, value);
    } catch (e) {
        //Failed while logging
    }
};

export const defaultLogEvent = (screenName, eventName, category, object = {}) => {
    if (!isValidString(eventName)) return;
    let event_name = eventName.replace(/\s+/g, '').replace('-', '_');
    const screen_name = isValidString(screenName) ? screenName.replace(/\s+/g, '').replace('-', '_') : undefined;
    const obj = screen_name
        ? {
              ...object,
              screen_name
          }
        : object;
    if (isValidString(category)) obj.category = category;
    if (event_name.length > 40) {
        event_name = event_name.slice(0, 40);
    }
    try {
        Analytics.logEvent(event_name, obj);
        if (category === ANALYTICS_CATEGORY.API_ERROR) {
            crashlytics().recordError(new Error(JSON.stringify(obj)), 'API ERROR');
        }
    } catch (e) {
        // Failed while logging
    }
};

export const logNonFatalEvent = (obj, key = 'COMMON FATAL') => {
    try {
        crashlytics().recordError(new Error(JSON.stringify(obj)), key);
    } catch (e) {
        // Failed while logging
    }
};

export const logEvent = (screenName, eventName, object = {}) => {
    defaultLogEvent(screenName, eventName, ANALYTICS_CATEGORY.CLICK, object);
};

export const logEventWithName = (eventName, object = {}) => {
    defaultLogEvent(undefined, eventName, undefined, object);
};

export const logAction = (screenName, eventName, object) => {
    defaultLogEvent(screenName, eventName, ANALYTICS_CATEGORY.CLICK, {
        ...object,
        action: eventName
    });
};

export const logError = (eventName, object = {}) => {
    defaultLogEvent('', eventName, ANALYTICS_CATEGORY.API_ERROR, object);
};

export const logEventQcItemClick = (options) => {
    let screenName = '';
    const { title } = options;
    switch (title) {
        case LOCALIZATION_STRINGS.DELIVERY:
            screenName = ANALYTICS_SCREENS.QC_ADDRESS;
            break;

        case LOCALIZATION_STRINGS.PAYMENT:
            screenName = ANALYTICS_SCREENS.QC_PAYMENT_TYPE;
            break;
        case LOCALIZATION_STRINGS.GET_IT_BY:
            screenName = ANALYTICS_SCREENS.QC_GET_IT_BY;
            break;
        case LOCALIZATION_STRINGS.TOTAL:
            screenName = ANALYTICS_SCREENS.QC_TOTAL;
            break;
    }
    logEvent(screenName, ANALYTICS_EVENTS.ITEM_CLICK, { name: screenName });
    // Logging screen navigation
    logScreen(screenName);
};

export const logBackPress = (screenName) => {
    logEvent(screenName, ANALYTICS_EVENTS.ICON_BACK);
};
