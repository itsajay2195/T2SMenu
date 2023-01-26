import { call, put, putResolve, select, fork } from 'redux-saga/effects';
import { isCustomerApp, isFoodHubApp, isFranchiseApp, isValidElement, isValidString } from '../../../Utils/helpers';
import API from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from './SessionConst';
import {
    selectCountryBaseFeatureGateSelector,
    selectLanguage,
    selectLocale,
    selectRegion,
    selectS3Response,
    selectStoreId,
    selectSwitchLocale
} from '../../../Utils/AppSelectors';
import _ from 'lodash';
import {
    getAccessToken,
    getAccessTokenFromSessionData,
    getConfiguration,
    getUserSessionStatus,
    selectRefreshToken,
    selectUserAccessToken,
    selectUserAccessTokenExpires,
    selectUserRefreshTokenExpires,
    selectUserTokenFetchingStatus
} from '../Utils/SessionManagerSelectors';
import { addTimeDeviceMoment } from '../../../Utils/DateUtil';
import { ERROR_CODE, SESSION_EXPIRE_BEFORE_CHECK } from '../Utils/SessionManagerConstants';
import { getFranchiseId, getPassport, getStoreId } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorHelper';
import { SessionManagerNetwork } from './SessionManagerNetwork';
import { extractSessionInfo, getFHLanguage, getJWTDeviceDetail } from '../Utils/SessionManagerHelper';
import { Constants, NETWORK_CONSTANTS } from '../../../Utils/Constants';
import { SESSION_MANAGER_TYPES } from '../Utils/SessionManagerTypes';
import { AUTH_TYPE } from 'appmodules/AuthModule/Redux/AuthType';
import { TYPES_CONFIG, TYPES_SIDE_MENU } from '../../../../CustomerApp/Redux/Actions/Types';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { constructErrorObject, getGraphQlQuery, showErrorMessage } from '../../NetworkHelpers';
import SessionSkipError from './SessionSkipError';
import { Colors } from '../../../Themes';
import { logNonFatalEvent } from 'appmodules/AnalyticsModule/Analytics';
import { BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import moment from 'moment-timezone';
import { actionChannel, take } from '@redux-saga/core/effects';
import { SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import * as Braze from '../../../../AppModules/AnalyticsModule/Braze';
import { updateConnectionStatusAction } from '../../../Managers/OfflineNoticeManager/Redux/OfflineNoticeManagerAction';
import { selectProfileResponseState } from 'appmodules/ProfileModule/Redux/ProfileSelectors';
import { makeFHLogApiCall } from 'appmodules/FHLogsModule/Redux/FhLogsSaga';
import { FH_LOG_ERROR_CODE, FH_LOG_TYPE } from 'appmodules/FHLogsModule/Utils/FhLogsConstants';

function* clearSessionAndLogout(obj) {
    logNonFatalEvent(obj, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS.SESSION_INVAILD);
    yield putResolve({
        type: AUTH_TYPE.INVALID_SESSION
    });
    yield put({ type: TYPES_SIDE_MENU.SET_ACTIVE_SIDE_MENU, activeMenu: SCREEN_OPTIONS.HOME.route_name });
    yield put({ type: AUTH_TYPE.SET_LOGOUT_ACTION });
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    Braze.logLogoutAnalytics(featureGateResponse, SEGMENT_STRINGS.API);

    handleNavigation(SCREEN_OPTIONS.HOME.route_name);
    showErrorMessage(LOCALIZATION_STRINGS.INVALID_SESSION_MSG, undefined, Colors.warning);
}

function isSessionFailed(result) {
    return (
        isValidElement(result) &&
        isValidElement(result.response) &&
        isValidElement(result.response.data) &&
        isValidElement(result.response.data.error) &&
        isValidElement(result.response.data.error.code) &&
        (result.response.data.error.code === ERROR_CODE.UNAUTHORIZED_ACCESS ||
            result.response.data.error.code === ERROR_CODE.UNAUTHORIZED_CLIENT ||
            result.response.data.error.code === ERROR_CODE.CUSTOMER_NOT_REGISTERED ||
            result.response.data.error.code === ERROR_CODE.REQUEST_PARAM_MISSING)
    );
}
export let refreshAPIHitTime = 0;
export let isRefreshTokenUpdated = false;
export const apiCall = (apiCallFuc, ...args) => {
    return call(function*() {
        const accessToken = yield select(getAccessToken);
        const refreshToken = yield select(selectRefreshToken);
        let userTokenFetchingStatus = yield select(selectUserTokenFetchingStatus);
        const userAccessToken = yield select(selectUserAccessToken);
        const userRefreshTokenExpires = yield select(selectUserRefreshTokenExpires);
        const userAccessTokenExpires = yield select(selectUserAccessTokenExpires);
        let sessionData = null;

        try {
            let result = {};
            const isAccessTokenExpire = isAccessTokenExpired(userAccessToken, userAccessTokenExpires);
            if ((isAccessTokenExpire || !isValidString(userAccessToken)) && !userTokenFetchingStatus) {
                yield putResolve({
                    type: SESSION_MANAGER_TYPES.UPDATE_REFRESH_TOKEN_STATUS,
                    payload: true
                });
                if (isValidString(refreshToken) && isValidElement(userRefreshTokenExpires)) {
                    const isRefreshTokenExpire = isRefreshTokenExpired(refreshToken, userRefreshTokenExpires);
                    if (isRefreshTokenExpire && isValidString(refreshToken)) {
                        let addedTime = refreshAPIHitTime + 12;
                        if (refreshAPIHitTime === 0 || addedTime < moment().unix()) {
                            refreshAPIHitTime = moment().unix();
                            result = yield call(SessionManagerNetwork.resetRefreshToken, {
                                refresh_token: refreshToken,
                                userAccessToken: accessToken
                            });
                        }
                    } else {
                        yield* clearSessionAndLogout({
                            networkConfig: {
                                isRefreshTokenExpire: true,
                                refreshToken: refreshToken,
                                userAccessToken: userAccessToken
                            },
                            result
                        });
                        throw new SessionSkipError(Constants.SESSION_SKIPPED);
                    }
                } else {
                    const deviceDetails = getJWTDeviceDetail();
                    result = yield call(SessionManagerNetwork.registerPublicSession, deviceDetails);
                }
                if (isValidElement(result) && isValidElement(result.outcome) && result.outcome === Constants.SUCCESS) {
                    yield putResolve({
                        type: SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_SUCCESS,
                        payload: result.data
                    });
                    sessionData = extractSessionInfo(result.data);
                } else if (isSessionFailed(result)) {
                    // This block needs to be removed
                    yield* clearSessionAndLogout({
                        networkConfig: {
                            url: 'oauth/client'
                        },
                        result
                    });
                    throw new SessionSkipError(Constants.SESSION_SKIPPED);
                } else {
                    return Promise.reject(result);
                }
            }
        } catch (result) {
            if (isSessionFailed(result)) {
                yield* clearSessionAndLogout({
                    result
                });
                throw new SessionSkipError(Constants.SESSION_SKIPPED);
            } else {
                return Promise.reject(result);
            }
        }

        let networkConfig = yield call(apiCallFuc, ...args);
        if (!isValidElement(networkConfig) || !isValidElement(networkConfig.config)) {
            networkConfig = {
                ...networkConfig,
                config: {
                    headers: {}
                }
            };
        }
        userTokenFetchingStatus = yield select(selectUserTokenFetchingStatus);
        if (userTokenFetchingStatus) {
            //waiting for fetching refresh token to complete
            try {
                const requestChan = yield actionChannel(SESSION_MANAGER_TYPES.UPDATE_REFRESH_TOKEN_STATUS);
                while (userTokenFetchingStatus) {
                    yield take(requestChan);
                }
            } catch (e) {
                //Nothing to do here
            }
        }
        let result = yield* handleAPICall(networkConfig, sessionData);
        if (!isValidElement(result)) {
            throw new SessionSkipError(Constants.SESSION_SKIPPED);
        } else {
            let connectionStatus = yield select((state) => state.offlineNoticeManagerState.connectionStatus);
            if (!connectionStatus) {
                yield put(updateConnectionStatusAction(true, connectionStatus, 'api'));
            }
        }
        return result;
    });
};
function* handleAPICall(networkConfig, sessionData) {
    let userSessionStatus = yield select(getUserSessionStatus);
    networkConfig.config.headers = yield call(addToRequest, networkConfig, sessionData);
    try {
        const result = yield call(callNetwork, networkConfig, userSessionStatus);
        if (isSessionFailed(result)) {
            yield* clearSessionAndLogout({
                networkConfig,
                result
            });
            return null;
        } else if (!isValidElement(result)) {
            return null;
        }
        return result;
    } catch (e) {
        if (e?.type !== NETWORK_CONSTANTS.NETWORK_ERROR) {
            yield handleAPIFailureCall(e, networkConfig);
        }
        throw e;
    }
}

function* handleAPIFailureCall(error, networkConfig) {
    try {
        const profileResponse = yield select(selectProfileResponseState);
        const store_id = yield select(selectStoreId);

        let errorObj = constructErrorObject({
            error: error,
            networkConfig: networkConfig,
            profile: profileResponse,
            store_id: store_id
        });

        if (networkConfig?.ignoreLog !== true) {
            const graphqlQuery = getGraphQlQuery(FH_LOG_TYPE.API_FAILURE, errorObj, FH_LOG_ERROR_CODE.API_FAILURE_ERROR_CODE);
            yield fork(makeFHLogApiCall, { graphqlQuery: graphqlQuery });
        }
    } catch (e) {
        //
    }
}

export function callNetwork(action, userSessionStatus) {
    if (
        isValidElement(action) &&
        isValidElement(action.method) &&
        (!action.isAuthRequired || (userSessionStatus && action.isAuthRequired))
    ) {
        switch (action.method) {
            case NETWORK_METHOD.GET: {
                return API.get(action.url, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.POST: {
                return API.post(action.url, isValidElement(action.data) && action.data, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.PUT: {
                return API.put(action.url, isValidElement(action.data) && action.data, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.DELETE: {
                return API.delete(action.url, isValidElement(action.config) && action.config);
            }
            case NETWORK_METHOD.HEAD: {
                return API.head(action.url, isValidElement(action.config) && action.config);
            }
        }
    }
}

const excludeCommonStoreID = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 't2s-android.s3.amazonaws.com') &&
            !_.includes(url, 's3.eu-west-2.amazonaws.com') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 'location/initial') &&
            !_.includes(url, 'lang/')
        );
    }
    return true;
};

const excludeCommonLocale = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 't2s-android.s3.amazonaws.com') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 's3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com') &&
            !_.includes(url, 'lang/') &&
            isLocaleNeeded(networkConfig)
        );
    }
    return true;
};

const isLocaleNeeded = (networkConfig) => {
    if (networkConfig.url.includes('location/initial')) {
        return networkConfig.params.isManualSwitch === true;
    }
    return true;
};

const isLocaleNeededForManualSwitch = (networkConfig) => {
    return networkConfig.url.includes('location/initial') && networkConfig.params.isManualSwitch === true;
};

const excludeCommonAccessToken = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 't2s-android.s3.amazonaws.com') &&
            !_.includes(url, 's3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/init/config') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 'location/initial') &&
            !_.includes(url, 'oauth/client') &&
            !_.includes(url, 'lang/')
        );
    }
    return true;
};

const excludeFoodHubStoreID = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 'location/initial') &&
            !_.includes(url, 'consumer/lookup/consent') &&
            !_.includes(url, 'consumer/user/consent/bulk') &&
            !_.includes(url, 'consumer/user/lookup/coupon') &&
            !_.includes(url, 'consumer/account/otp') &&
            !_.includes(url, 'consumer/profile') &&
            !_.includes(url, 'consumer/social/login') &&
            !_.includes(url, 'consumer/stores/favourites') &&
            !_.includes(url, 'consumer/wishlist') &&
            !_.includes(url, 'consumer/menu/recent/order') &&
            !_.includes(url, 'foodhub/takeaway/list') &&
            !_.includes(url, 'consumer/customer_device_registration') &&
            !_.includes(url, 'consumer/orders/total_savings') &&
            !_.includes(url, 'consumer/recent/takeaway') &&
            !_.includes(url, '/consumer/customer_notify_log') &&
            !_.includes(url, 'consumer/lookup/promotion') &&
            !_.includes(url, 'lang/') &&
            !_.includes(url, 'location/autocomplete') &&
            !isViewOrderListCall(networkConfig) &&
            !isDeleteCartApiCall(networkConfig) &&
            excludeCommonStoreID(networkConfig)
        );
    }
    return true;
};

const isViewOrderListCall = (networkConfig) => {
    if (isValidElement(networkConfig) && isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (_.includes(url, '/consumer/orders?') || _.includes(url, '/receipt?')) && networkConfig.method === NETWORK_METHOD.GET;
    }
    return false;
};

const isDeleteCartApiCall = (networkConfig) => {
    if (isValidElement(networkConfig) && isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return _.includes(url, 'consumer/cart') && networkConfig.method === NETWORK_METHOD.DELETE;
    }
    return false;
};

const excludeCustomerAppStoreID = (networkConfig) => {
    if (isValidString(networkConfig.url)) {
        const url = networkConfig.url;
        return (
            !_.includes(url, 's3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com') &&
            !_.includes(url, 't2s-staging-nativepoc.s3-eu-west-1.amazonaws.com') &&
            !_.includes(url, 'lang/') &&
            !_.includes(url, 'api/list_takeaway_tracking')
        );
    }
    return true;
};

function* addStoreIDToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let storeID = '';
    if (isValidElement(requestHeaders)) {
        storeID = requestHeaders.store;
    } else {
        requestHeaders = {};
    }
    const config = yield select(getConfiguration);
    if (isValidElement(config) && !isValidString(storeID)) {
        storeID = getStoreId(config);
    }
    if (isCustomerApp() && isValidString(storeID) && excludeCustomerAppStoreID(networkConfig)) {
        return {
            ...requestHeaders,
            store: storeID
        };
    } else if (isFoodHubApp() && isValidString(storeID) && excludeFoodHubStoreID(networkConfig)) {
        return {
            ...requestHeaders,
            store: storeID
        };
    } else if (isFranchiseApp()) {
        const configurationData = yield select(getConfiguration);
        let franchiseID = getFranchiseId(configurationData);
        let requestHeader = { ...requestHeaders, franchise: franchiseID };
        if (isValidString(storeID) && excludeFoodHubStoreID(networkConfig)) {
            requestHeader = {
                ...requestHeaders,
                franchise: franchiseID,
                store: storeID
            };
        }
        return {
            ...requestHeader,
            franchise: franchiseID
        };
    }

    return requestHeaders;
}

function* addToRequest(networkConfig, sessionData) {
    networkConfig.config.headers = yield call(addStoreIDToRequest, networkConfig);
    networkConfig.config.headers = yield call(addLocaleToRequest, networkConfig);
    networkConfig.config.headers = yield call(addLanguageToRequest, networkConfig);

    if (isCustomerApp()) {
        networkConfig.config.headers = yield call(addRegionToRequest, networkConfig);
    }
    networkConfig.config.headers = yield call(addJWTToRequest, networkConfig, sessionData);

    return networkConfig.config.headers;
}

function* addJWTToRequest(networkConfig, sessionData) {
    let requestHeaders = networkConfig.config.headers;
    if (excludeCommonAccessToken(networkConfig)) {
        let authorization = null;
        const passport = getPassport();
        if (isValidElement(sessionData) && isValidString(sessionData.access_token)) {
            authorization = getAccessTokenFromSessionData(sessionData);
        } else {
            authorization = yield select(getAccessToken);
        }
        if (isValidElement(authorization) && isValidString(authorization.trim())) {
            return {
                ...requestHeaders,
                Authorization: authorization.trim(),
                passport: passport
            };
        }
    }
    return requestHeaders;
}

function* addRegionToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let region = '';
    region = requestHeaders.region;
    if (!isValidString(region)) {
        region = yield select(selectRegion);
    }
    if (excludeCommonLocale(networkConfig) && isValidString(region)) {
        return {
            ...requestHeaders,
            region: region
        };
    }

    return requestHeaders;
}

function* addLanguageToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let languageObject = yield select(selectLanguage);
    let s3ConfigResponse = yield select(selectS3Response);
    let language = requestHeaders.language;
    if (!isValidString(language)) {
        if (isValidElement(languageObject)) {
            language = languageObject.key;
        }

        if (!isValidString(language)) {
            language = 'en';
        }
    }

    if (excludeCommonLocale(networkConfig) && isValidString(language)) {
        if (isCustomerApp()) {
            return {
                ...requestHeaders,
                language: language
            };
        } else if (isFoodHubApp()) {
            return {
                ...requestHeaders,
                language: getFHLanguage(s3ConfigResponse)
            };
        }
    }
    return requestHeaders;
}

export function* updateConfiguration(obj) {
    try {
        yield put({ type: TYPES_CONFIG.SET_CONFIG_FILE_NAME, payload: JSON.stringify(obj) });
    } catch (e) {
        if (__DEV__) {
            console.log(e);
        }
    }
}

function* addLocaleToRequest(networkConfig) {
    let requestHeaders = networkConfig.config.headers;
    let locale = '';
    locale = requestHeaders.locale;
    if (!isValidString(locale)) {
        locale = isLocaleNeededForManualSwitch(networkConfig) ? yield select(selectSwitchLocale) : yield select(selectLocale);
    }
    if (excludeCommonLocale(networkConfig) && isValidString(locale)) {
        return {
            ...requestHeaders,
            locale: locale
        };
    }
    return requestHeaders;
}

function isAccessTokenExpired(userAccessToken, userAccessTokenExpires) {
    if (isValidString(userAccessToken)) {
        return isValidString(userAccessTokenExpires) && userAccessTokenExpires < addTimeDeviceMoment(SESSION_EXPIRE_BEFORE_CHECK);
    } else {
        return true;
    }
}

function isRefreshTokenExpired(refreshToken, userAccessTokenExpires) {
    if (isValidString(refreshToken)) {
        return isValidString(userAccessTokenExpires) && userAccessTokenExpires > addTimeDeviceMoment(SESSION_EXPIRE_BEFORE_CHECK);
    } else {
        return false;
    }
}
