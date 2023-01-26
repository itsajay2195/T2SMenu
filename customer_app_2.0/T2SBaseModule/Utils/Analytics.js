import analytics from '@react-native-firebase/analytics';
import Analytics from 'appcenter-analytics';
import { isValidString } from './helpers';
import AppCenter from 'appcenter';

export const logScreen = (screenName) => {
    try {
        if (isValidString(screenName)) {
            let name = screenName.replace(/\s+/g, '').replace('-', '_');
            analytics()
                .logEvent('screen_name', {
                    screen_name: name,
                    screen_class: name
                })
                .then();
            Analytics.trackEvent('screen_name', {
                screen_name: name,
                screen_class: name
            }).then();
        }
    } catch (e) {
        // No action required
    }
};

export const logUserEvent = (eventName, host, storeName, { customMessage = ' ' }) => {
    /**
     * [CodePush] An error has occurred : Error: analytics.logEvent():
     * Event name 'Code Push' is invalid. Names should contain 1 to 32 alphanumeric
     * characters or underscores.
     */
    try {
        if (isValidString(storeName)) {
            let store = storeName.replace('-', '_');
            let eventOptions = {
                host: host,
                storeName: store,
                time: new Date().toString(),
                customMessage: customMessage
            };

            analytics()
                .logEvent(eventName, eventOptions)
                .then();
            Analytics.trackEvent(eventName, eventOptions).then();
        }
    } catch (e) {
        // No action required
    }
};

export const setUserProperty = (name, value) => {
    try {
        analytics()
            .setUserProperty(name, value)
            .then();
    } catch (e) {
        // No action required
    }
};

export const setUserId = (id) => {
    try {
        analytics()
            .setUserId(id)
            .then();

        AppCenter.setUserId(id).then();
    } catch (e) {
        // No action required
    }
};

// Screen Names
export const CODE_PUSH = 'Code_Push_Status';

export const logEvent = (eventName, object = {}) => {
    try {
        analytics()
            .logEvent(eventName, object)
            .then();
        Analytics.trackEvent(eventName, object).then();
    } catch (e) {
        // Failed while logging
    }
};
