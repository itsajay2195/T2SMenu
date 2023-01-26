import { APP_ACTION_TYPE, TYPES_CONFIG, TYPES_SIDE_MENU } from './Types';
import { AUTH_TYPE } from 'appmodules/AuthModule/Redux/AuthType';

export const refreshSideMenuAction = () => {
    return {
        type: TYPES_SIDE_MENU.REFRESH_SIDE_MENU
    };
};

export const setSideMenuActiveAction = (activeMenu) => {
    return {
        type: TYPES_SIDE_MENU.SET_ACTIVE_SIDE_MENU,
        activeMenu
    };
};
export const appInitialSetupAction = () => {
    return {
        type: APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION
    };
};
export const setAppLaunchAPIAction = (value) => {
    return {
        type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
        payload: value
    };
};
export const redirectRouteAction = (route, params) => {
    return {
        type: TYPES_SIDE_MENU.REDIRECT_ROUTE,
        route,
        params
    };
};

export const deviceRegistrationAction = (token, host) => {
    return {
        type: AUTH_TYPE.POST_FCM_REGISTRATION,
        token: token,
        host: host
    };
};

export const updateAppStoreRatingByUser = (ratingStatus, appVersion) => {
    return {
        type: TYPES_CONFIG.APP_STORE_RATING_BY_USER,
        ratingStatus: ratingStatus,
        appVersion: appVersion
    };
};

export const restartAppAction = () => {
    return {
        type: APP_ACTION_TYPE.APP_RESET_ACTION
    };
};

export const updateDefaultLanguage = (language, notification = true, ignoreIfAlready = false) => {
    return {
        type: TYPES_CONFIG.UPDATE_LANGUAGE,
        language: language,
        notification: notification,
        ignoreIfAlready: ignoreIfAlready
    };
};

export const chooseCountryList = (screenName) => {
    return {
        type: TYPES_CONFIG.CHOOSE_COUNTRY_CONFIG_SCREEN,
        screenName: screenName
    };
};

export const changeCountryConfig = (countryKey, countryName) => {
    return { type: TYPES_CONFIG.CHOOSE_COUNTRY_CONFIG, countryKey, countryName };
};

export const resetUnsupportedCountryResponseAction = () => {
    return { type: TYPES_CONFIG.RESET_UNSUPPORTED_COUNTRY_RESPONSE };
};

export const landingPageCall = () => {
    return { type: TYPES_CONFIG.LANDING_PAGE_CALL };
};

export const policyLookupAction = () => {
    return {
        type: TYPES_CONFIG.GET_POLICY_LOOKUP
    };
};
export const updateFallbackUrl = (url) => {
    return {
        type: TYPES_CONFIG.TAKEAWAY_FALL_BACK,
        takeawayFallbackUrl: url
    };
};
export const resetExpiredBasketAction = () => {
    return {
        type: TYPES_CONFIG.RESET_EXPIRED_BASKET
    };
};

export const storeConfigResponseAction = (storeConfigResponse) => {
    return {
        type: TYPES_CONFIG.STORE_CONFIG_SUCCESS,
        payload: storeConfigResponse
    };
};

export const deepLinkToPage = (url) => {
    return {
        type: TYPES_CONFIG.DEEPLINK_TO_PAGE,
        payload: url
    };
};

export const prevStoreConfigResponseAction = (storeConfigResponse) => {
    return {
        type: TYPES_CONFIG.PREV_STORE_CONFIG_SUCCESS,
        payload: storeConfigResponse
    };
};
export const updateConfigurationAction = (configuration) => {
    return {
        type: TYPES_CONFIG.SET_CONFIG_FILE_NAME,
        payload: configuration
    };
};

export const updateBugSeeFirstLaunchAction = (value) => {
    return {
        type: TYPES_CONFIG.SET_BUGSEE_LAUNCH,
        payload: value
    };
};

export const launchBugsee = () => {
    return {
        type: TYPES_CONFIG.INITIATE_BUGSEE
    };
};

export const payViaPBLFlow = (host, orderId, cutomerID, headerArray) => {
    return {
        type: TYPES_CONFIG.PBL_TO_PAY,
        host,
        orderId,
        cutomerID,
        headerArray,
        appLink: `https://${host}/paybylink/${orderId}?source=sms`
    };
};

export const updateGoogleSessionToken = (googleSessionToken) => {
    return {
        type: TYPES_CONFIG.UPDATE_GOOGLE_SESSION_TOKEN,
        googleSessionToken
    };
};

export const getStoreConfig = (s3Response) => {
    return {
        type: TYPES_CONFIG.GET_STORE_CONFIG
    };
};
