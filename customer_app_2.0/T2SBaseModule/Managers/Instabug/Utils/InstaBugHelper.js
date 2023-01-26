import Instabug, { BugReporting } from 'instabug-reactnative';
import { isCustomerApp, isValidElement, isValidString } from '../../../Utils/helpers';
import crashlytics from '@react-native-firebase/crashlytics';
import Config from 'react-native-config';

export const setInstaBugEventType = (isUserLoggedIn, profileResponse) => {
    if (isUserLoggedIn) {
        BugReporting.setInvocationEvents([Instabug.invocationEvent.floatingButton]);
    } else {
        BugReporting.setInvocationEvents([Instabug.invocationEvent.none]);
    }
};

export const isNeedToShowInstaBug = (profileResponse) => {
    return (
        isValidElement(profileResponse) &&
        isValidString(profileResponse.email) &&
        (profileResponse.email.endsWith('@touch2success.com') || profileResponse.email.endsWith('@foodhub.com'))
    );
};

export const setUpInstaBugAttributes = (storeConfigResponse, profileResponse) => {
    let storeInfo = {};
    if (isCustomerApp()) {
        if (isValidElement(storeConfigResponse)) {
            storeInfo = JSON.stringify({
                storeId: isValidString(storeConfigResponse.id) ? storeConfigResponse.id : '',
                name: isValidString(storeConfigResponse.name) ? storeConfigResponse.name : '',
                store_status: isValidString(storeConfigResponse.store_status) ? storeConfigResponse.store_status : '',
                store_location:
                    isValidElement(storeConfigResponse.country) &&
                    storeConfigResponse.country.length > 0 &&
                    isValidElement(storeConfigResponse.country[0]) &&
                    isValidString(storeConfigResponse.country[0].name)
                        ? storeConfigResponse.country[0].name
                        : ''
            });
        }
    }
    let profileDetails = {};
    if (isValidElement(profileResponse) && isValidElement(profileResponse.id)) {
        profileDetails = {
            id: profileResponse.id
        };
    }
    try {
        Instabug.setUserAttribute('store_info', storeInfo);
        Instabug.setUserAttribute('profile_details', profileDetails);

        crashlytics()
            .setAttribute('store_info', storeInfo)
            .setAttribute('profile_details', profileDetails)
            .setAttribute('app_type', Config.APP_TYPE)
            .then();
    } catch (_) {
        //Nothing to Handle
    }
};
