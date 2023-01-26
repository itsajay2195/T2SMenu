import { all, call, fork, put, putResolve, select, takeLeading } from 'redux-saga/effects';
import { APP_ACTION_TYPE, TYPES_CONFIG, TYPES_SIDE_MENU } from '../Redux/Actions/Types';
import { appBase } from '../Network/AppBaseNetwork';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import {
    getDefaultLanguageName,
    getTakeawayCountryId,
    isArrayNonEmpty,
    isCustomerApp,
    isFoodHubApp,
    isFranchiseApp,
    isNonCustomerApp,
    isValidElement
} from 't2sbasemodule/Utils/helpers';
import {
    isCollectionAvailableForStore,
    isDeliveryAvailableForStore,
    selectCountryBaseFeatureGateSelector,
    selectCountryList,
    selectFcmRegistrationResponse,
    selectHost,
    selectLanguage,
    selectS3Response,
    selectEnvConfig,
    selectHasUserLoggedIn,
    selectUserResponse,
    selectStoreConfigResponse
} from 't2sbasemodule/Utils/AppSelectors';
import { AppConstants } from '../Utils/AppContants';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { setLanguage } from 'appmodules/LocalizationModule/Utils/Localization';
import { FeatureVisible, menu } from '../View/SideMenu/SideMenuConfig';
import { getGraphQlQuery, showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { selectCountryBaseFeatureGateResponse } from 'appmodules/BasketModule/Redux/BasketSelectors';
import * as NavigationService from '../Navigation/NavigationService';
import { SCREEN_OPTIONS } from '../Navigation/ScreenOptions';
import { ORDER_TYPE, ORDER_TYPE_STATUS } from 'appmodules/BaseModule/BaseConstants';
import {
    getAvailableOrderType,
    isPreOrderAvailableForCollection,
    isPreOrderAvailableForDelivery
} from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import { ADDRESS_TYPE } from 'appmodules/AddressModule/Redux/AddressType';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { handleNavigation } from '../Navigation/Helper';
import { AVAILABLE_ORDER_TYPES } from 'appmodules/OrderManagementModule/Utils/OrderManagementConstants';
import { updatePrimaryAddress } from 'appmodules/BasketModule/Redux/BasketSaga';
import { getFeatureGateDataByCountry } from 'appmodules/BaseModule/Helper';
import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import * as Braze from 'appmodules/AnalyticsModule/Braze';
import { makeCountryListCall } from '../../FoodHubApp/LandingPage/Redux/LandingSaga';
import { LANDING_TYPE } from '../../FoodHubApp/LandingPage/Redux/LandingType';
import { COUNTRY_DATA } from '../../FoodHubApp/LandingPage/Utils/Helper';
import { VERSION_UPDATE_API } from 't2sbasemodule/Managers/UpdateManager/Redux/VersionUpdateTypes';
import { getOrderTypeToggleDefaultValue, isBasketOrderTypeChanged } from 'appmodules/AddressModule/Utils/AddressHelpers';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { selectOrderType } from 'appmodules/OrderManagementModule/Redux/OrderManagementSelectors';
import { AppConfig } from '../Utils/AppConfig';
import { getBaseURL, getFranchiseHost, getLocalFeatureConfigData } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorHelper';
import { isPostCodeSearch, logStoreConfigObject } from 'appmodules/BaseModule/GlobalAppHelper';
import { Platform } from 'react-native';
import Bugsee from 'react-native-bugsee';
import { LocalizationNetwork } from 'appmodules/LocalizationModule/Network/LocalizationNetwork';
import { syncProfileForReferral } from 'appmodules/ProfileModule/Redux/ProfileSaga';
import { DEFAULT_FEATURE_GATE_ID } from 'appmodules/BaseModule/Utils/FeatureGateConfig';
import { makeGetOrderListAction } from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import { makeGetProfileCall } from 'appmodules/ProfileModule/Redux/ProfileSaga';
import VersionNumber from 'react-native-version-number';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { UPDATE_CONNECTION_STATUS } from 't2sbasemodule/Managers/OfflineNoticeManager/Redux/OfflineNoticeManagerTypes';
import { FH_LOG_ERROR_CODE, FH_LOG_TYPE } from 'appmodules/FHLogsModule/Utils/FhLogsConstants';
import { makeFHLogApiCall } from 'appmodules/FHLogsModule/Redux/FhLogsSaga';
import { getStoreStatusCollection, getStoreStatusDelivery } from '../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { getLogCloseTakeawayEnabled } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import { makeOurRecommendation } from 'appmodules/HomeModule/Redux/HomeSaga';
import { selectFilteredRecommendation } from 'appmodules/HomeModule/Utils/HomeSelector';

export function* refreshSideMenuPropertiesForTakeaway() {
    yield put({
        type: TYPES_SIDE_MENU.SET_SIDE_MENU,
        payload: {
            visibleSideMenuItems: menu().filter((value) => {
                return !value.is_more && isFeatureVisible(value);
            }),
            hiddenSideMenuItems: menu().filter((value) => {
                return value.is_more && isFeatureVisible(value);
            })
        }
    });
}

export function* getAppVersionCall() {
    yield put({
        type: VERSION_UPDATE_API.GET_UPDATE
    });
}

export const isFeatureVisible = (value) => {
    return (
        value.featureVisible === FeatureVisible.ALL ||
        (isNonCustomerApp() && value.featureVisible === FeatureVisible.IS_NOT_CUSTOMER_APP) ||
        (isFoodHubApp() && value.featureVisible === FeatureVisible.FOODHUB) ||
        (isFranchiseApp() && value.featureVisible === FeatureVisible.FRANCHISE) ||
        (isCustomerApp() && value.featureVisible === FeatureVisible.CUSTOMER_APP)
    );
};

function* makeInitialAppCall() {
    try {
        try {
            const lastAppVersion = yield select((state) => state.appState.appVersion);
            if (Braze.logInstallOrUpdateAnalytics(lastAppVersion, VersionNumber.appVersion)) {
                yield put({ type: TYPES_CONFIG.SET_APP_VERSION, version: VersionNumber.appVersion });
            }
            Braze.logAppOpenAnalytics();
            const moengageUserMigrated = yield select((state) => state.appState.moengageUserMigrated);
            if (!isValidElement(moengageUserMigrated)) {
                yield call(logMoengageUserMigratedAnalytics);
                yield put({ type: TYPES_CONFIG.SET_MOENGAGE_UPDATED_SUCCESS, payload: true });
            }
        } catch (e) {
            // Safe guard against Analytics event if crashed
        }
        const configurationData = yield select(getConfiguration);
        const userSelectedLanguage = yield select((state) => state.appState.language);
        if (isValidElement(userSelectedLanguage?.code)) {
            setLanguage(userSelectedLanguage.code);
            const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
            Braze.setUserLanguage(userSelectedLanguage?.code, featureGateResponse);
        }
        yield fork(getAppVersionCall);
        yield fork(initialCountryConfig, configurationData);

        // if user is logged in, refresh
        const isUserLoggedIn = yield select(selectHasUserLoggedIn);
        if (isUserLoggedIn) {
            yield fork(makeGetOrderListAction);
            yield fork(makeGetProfileCall, { errorMessageDisplay: false });
        }
        if (isCustomerApp()) {
            const s3Response = yield select(selectS3Response);
            if (isValidElement(s3Response)) {
                yield fork(makeStoreConfigCall, s3Response);
            }
        }
    } catch (e) {
        //Nothing to Handle
    }
}

/**
 * If user is coming from non-moengage app to moengage app, this one is called
 * @returns {Generator<*, void, *>}
 */
function* logMoengageUserMigratedAnalytics() {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    const userResponse = yield select(selectUserResponse);
    if (isValidElement(userResponse?.id)) {
        const s3ConfigResponse = yield select(selectS3Response);
        Braze.logLoginAnalytics(featureGateResponse, userResponse, s3ConfigResponse?.country?.iso, SEGMENT_EVENTS.EXISTING_USER_MIGRATION, {
            method: SEGMENT_CONSTANTS.EXISTING_USER
        });
    }
}

function* chooseCountryScreen() {
    yield putResolve({ type: TYPES_CONFIG.CHOOSE_COUNTRY_CONFIG_SCREEN_SUCCESS, payload: '' });
    NavigationService.navigate(SCREEN_OPTIONS.LOCATION_PICKER.route_name, { showHeader: true });
}

function* landingPageCall() {
    yield* makePolicyLookupCall();
}

function isValidS3Response(response, countryList) {
    return (
        !isValidElement(response.error) &&
        isValidElement(response.country) &&
        isValidElement(response.country.id) &&
        isValidElement(response.country.iso) &&
        isValidElement(response.country.name) &&
        (isFoodHubApp() ? isSupportedCountry(response.country.id, countryList) : true)
    );
}

function* setDefaultFeatureGateIfNotAvailable() {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    if (!featureGateResponse) {
        // if we dont have feature gate response, we put from local. This let us ensure we have some valid feature gate
        // This happens first time app opens up
        yield updateLocalFeatureGate(DEFAULT_FEATURE_GATE_ID);
    }
}

function* initialCountryConfig(configurationData) {
    const result = yield all([
        call(makeCountryListInitialConfigApiCall), // task1
        call(makeLocationInitialConfigApiCall, configurationData), // task2,
        call(setDefaultFeatureGateIfNotAvailable)
    ]);
    const countryList = result[0];
    const locationConfigResponse = result[1];
    if (isValidElement(locationConfigResponse) && isValidElement(countryList)) {
        if (isValidElement(locationConfigResponse?.country?.iso)) {
            const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
            Braze.setUserCountry(locationConfigResponse?.country?.iso, featureGateResponse);
        }
        if (
            isValidElement(locationConfigResponse.fallback) &&
            isValidElement(locationConfigResponse.fallback.web_view) &&
            locationConfigResponse.fallback.web_view &&
            isValidElement(locationConfigResponse.fallback.web_view_url)
        ) {
            // Fallback Webview support
            yield putResolve({
                type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
                payload: AppConstants.AppInitializationStatus.FALLBACK_SCREEN,
                fallbackUrl: locationConfigResponse.fallback.web_view_url
            });
        } else if (isValidS3Response(locationConfigResponse, countryList)) {
            const oldS3Response = yield select(selectS3Response);
            yield fork(makeCountryBasedFeatureGateCall, {
                baseUrl: getBaseURL(configurationData),
                countryID: getTakeawayCountryId(locationConfigResponse?.country?.id)
            });
            yield putResolve({ type: TYPES_CONFIG.S3_CONFIG_SUCCESS, payload: locationConfigResponse });
            if (isCustomerApp()) {
                yield makeStoreConfigCall(locationConfigResponse);
            }
            yield fork(setAppLanguage, locationConfigResponse, oldS3Response);
            yield fork(makePolicyLookupCall);
            yield fork(syncProfileForReferral);
        } else {
            yield* showCountryPickerScreen();
        }
    } else {
        yield* showCountryPickerScreen(locationConfigResponse == null);
    }
}
function* makeCountryListInitialConfigApiCall() {
    // TODO: CG-REVERT - country list request will be sent based on app config toggle
    if (AppConfig.COUNTRY_LIST_CG_ENABLE) {
        try {
            yield* makeCountryListApiCall();
        } catch (e) {
            //Nothing do here
        }
    } else {
        yield put({ type: LANDING_TYPE.GET_COUNTRY_LIST_SUCCESS, payload: COUNTRY_DATA });
    }
    const countryList = yield select(selectCountryList);
    return countryList;
}

function* makeLocationInitialConfigApiCall(configurationData) {
    try {
        const response = yield apiCall(appBase.makeLocationInitialConfig, {
            isManualSwitch: false,
            host: isFranchiseApp() ? getFranchiseHost(configurationData) : undefined
        });
        return response;
    } catch (e) {
        const s3selectS3Response = yield select(selectS3Response);
        return s3selectS3Response;
    }
}
function* makeCountryListApiCall() {
    try {
        yield call(makeCountryListCall);
        const countryList = yield select(selectCountryList);
        if (isArrayNonEmpty(countryList?.data)) {
            yield put({ type: LANDING_TYPE.GET_COUNTRY_LIST_SUCCESS, payload: countryList });
        }
    } catch (e) {
        if (isNonCustomerApp()) {
            yield put({ type: LANDING_TYPE.GET_COUNTRY_LIST_SUCCESS, payload: COUNTRY_DATA });
        }
    }
}

function isSupportedCountry(countryId, countryList) {
    if (isValidElement(countryList) && isValidElement(countryList.data)) {
        let country = countryList.data.find((data) => {
            return data.id === countryId;
        });
        return isValidElement(country);
    }
    return false;
}

function* showCountryPickerScreen(isFromCatch = false) {
    if (isFoodHubApp()) {
        yield putResolve({
            type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
            payload: AppConstants.AppInitializationStatus.SHOW_COUNTRY_PICK
        });
        handleNavigation(SCREEN_OPTIONS.LOCATION_PICKER.route_name);
    } else {
        if (isCustomerApp()) {
            if (isFromCatch) {
                const s3Response = yield select(selectS3Response);
                if (isValidElement(s3Response)) {
                    yield makeStoreConfigCall(s3Response);
                }
            }
            yield put({
                type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
                payload: AppConstants.AppInitializationStatus.FAILED
            });
        }
        yield put({
            type: TYPES_SIDE_MENU.REFRESH_SIDE_MENU
        });
    }
}

export function* changeCountry(action) {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    const oldS3Response = yield select(selectS3Response);
    const configurationData = yield select(getConfiguration);
    yield putResolve({ type: TYPES_CONFIG.MANUAL_COUNTRY_SWITCH, payload: action.countryName });
    yield fork(updatePrimaryAddress);
    try {
        const response = yield apiCall(appBase.makeLocationInitialConfig, { isManualSwitch: true });
        const countryList = yield select(selectCountryList);
        if (isValidElement(response) && isValidS3Response(response, countryList)) {
            yield call(setAppLanguage, response, oldS3Response);
            Braze.setUserCountry(response.country.iso, featureGateResponse);
            showInfoMessage(LOCALIZATION_STRINGS.COUNTRY_SELECTION + action.countryName);
            yield putResolve({ type: TYPES_CONFIG.S3_CONFIG_SUCCESS, payload: response });
        }
        yield fork(makeCountryBasedFeatureGateCall, {
            baseUrl: getBaseURL(configurationData),
            countryID: getTakeawayCountryId(response?.country?.id)
        });
    } catch (e) {
        //No need to update here
    }

    yield fork(makePolicyLookupCall);
}

function* makeCountryBasedFeatureGateCall(action) {
    try {
        const configEnvType = yield select(selectEnvConfig);
        yield updateLocalFeatureGate(action.countryID);
        if (isValidElement(action.baseUrl)) {
            const response = yield apiCall(appBase.featureGateAPICall, {
                portal: BASE_API_CONFIG.applicationName.toLowerCase(),
                baseUrl: action.baseUrl,
                configType: configEnvType
            });
            if (isValidElement(response) && isValidElement(response.data)) {
                const data = getFeatureGateDataByCountry(action.countryID, response.data);
                yield put({ type: TYPES_CONFIG.COUNTRY_BASE_FEATURE_GATE_SUCCESS, payload: data });
                yield put({ type: ADDRESS_TYPE.UPDATE_DEFAULT_ORDER_TYPE, defaultOrderType: getOrderTypeToggleDefaultValue(data) });
            } else {
                const countryBaseFeatureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
                if (isValidElement(countryBaseFeatureGateResponse)) {
                    yield put({
                        type: TYPES_CONFIG.COUNTRY_BASE_FEATURE_GATE_SUCCESS,
                        payload: countryBaseFeatureGateResponse
                    });
                    yield put({
                        type: ADDRESS_TYPE.UPDATE_DEFAULT_ORDER_TYPE,
                        defaultOrderType: getOrderTypeToggleDefaultValue(countryBaseFeatureGateResponse)
                    });
                } else {
                    yield updateLocalFeatureGate(action.countryID);
                }
            }
        } else {
            yield updateLocalFeatureGate(action.countryID);
        }
    } catch (e) {
        yield updateLocalFeatureGate(action.countryID);
    }
}

function* updateLocalFeatureGate(countryId) {
    const config = getLocalFeatureConfigData()[countryId];
    yield put({ type: TYPES_CONFIG.COUNTRY_BASE_FEATURE_GATE_SUCCESS, payload: config });
}

/*
    TODO
   Currently we are moved to Country base from S3Bucket
*/

// eslint-disable-next-line no-unused-vars
function* makeFeatureGateCall() {
    try {
        const response = yield apiCall(appBase.makeFeatureGateAPICall);
        if (isValidElement(response) && isValidElement(response.data)) {
            yield put({ type: TYPES_CONFIG.FEATURE_GATE_SUCCESS, payload: response.data });
        } else {
            yield put({
                type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
                payload: AppConstants.appInitialization.FAILED
            });
        }
    } catch (e) {
        yield put({
            type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
            payload: AppConstants.appInitialization.FAILED
        });
    }
}

export function* makeStoreConfigCall(s3Response) {
    try {
        const response = yield apiCall(appBase.makeStoreConfigCall);
        if (isValidElement(response)) {
            yield put({ type: TYPES_CONFIG.STORE_CONFIG_SUCCESS, payload: response });
            if (isCustomerApp()) {
                yield fork(logStoreConfigResponse, response);
                yield put({
                    type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
                    payload: AppConstants.AppInitializationStatus.COMPLETED
                });
                let selectedOrderType = yield select(selectOrderType);
                const deliveryAvailable =
                    isDeliveryAvailableForStore(response?.show_delivery, response?.store_status?.delivery) ||
                    isPreOrderAvailableForDelivery(response?.preorder_hours?.delivery?.pre_order);
                const collectionAvailable =
                    isCollectionAvailableForStore(response?.show_collection, response?.store_status?.collection) ||
                    isPreOrderAvailableForCollection(response?.preorder_hours?.collection?.pre_order);
                const isSearchType = isPostCodeSearch(s3Response?.search?.type, s3Response?.country?.flag);
                const orderType = getAvailableOrderType(
                    response?.show_delivery,
                    response?.show_collection,
                    response?.ask_postcode_first,
                    true
                );
                const isAskForPostcode = !isSearchType
                    ? false
                    : orderType === AVAILABLE_ORDER_TYPES.ASK_POST_CODE_COLLECTION_DELIVERY ||
                      orderType === AVAILABLE_ORDER_TYPES.ASK_POST_CODE_DELIVERY;
                yield put({
                    type: ADDRESS_TYPE.UPDATE_SELECTED_ORDER_TYPE,
                    payload: {
                        selectedOrderType: isValidElement(selectedOrderType)
                            ? selectedOrderType
                            : isAskForPostcode
                            ? null
                            : !deliveryAvailable && collectionAvailable
                            ? ORDER_TYPE.COLLECTION
                            : ORDER_TYPE.DELIVERY,
                        isBasketChanged: isBasketOrderTypeChanged(),
                        selectedPostcode: null,
                        selectedAddressId: null
                    }
                });
                let ourRecommendationsData = yield select(selectFilteredRecommendation);
                if (!isValidElement(ourRecommendationsData)) yield* makeOurRecommendation(response);
            }
        }
    } catch (e) {
        if (isCustomerApp()) {
            yield put({
                type: APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS,
                payload: AppConstants.AppInitializationStatus.FAILED
            });
        }
    }
}

function* makePolicyLookupCall() {
    try {
        const response = yield apiCall(appBase.makePolicyLookupCall);
        const fcmRegistrationResponse = yield select(selectFcmRegistrationResponse);
        if (isValidElement(response)) {
            yield put({ type: TYPES_CONFIG.POLICY_LOOKUP_SUCCESS, payload: response });
            if (!isValidElement(fcmRegistrationResponse) && !isFoodHubApp()) {
                yield* makePostFcmRegistrationCall();
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* updateAppLanguage(action) {
    try {
        let language = action.language;
        let selectedLanguage = yield select(selectLanguage);
        if (isValidElement(action.ignoreIfAlready) && action.ignoreIfAlready) {
            if (isValidElement(selectedLanguage)) {
                language = selectedLanguage;
            }
        }

        const configurationData = yield select(getConfiguration);
        const configEnvType = yield select(selectEnvConfig);
        const response = yield apiCall(LocalizationNetwork.makeGetLocalizationStrings, {
            baseUrl: getBaseURL(configurationData),
            configEnvType: configEnvType,
            code: language?.code
        });

        let languageObj = {};
        let oldValue = LOCALIZATION_STRINGS.getContent()[language?.code] ?? {};
        languageObj[language?.code] = { ...oldValue, ...response };
        LOCALIZATION_STRINGS.setContent(Object.assign({}, LOCALIZATION_STRINGS.getContent(), languageObj));

        setLanguage(language?.code);
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        Braze.setUserLanguage(language?.code, featureGateResponse);

        yield put({ type: TYPES_CONFIG.UPDATE_LANGUAGE_SUCCESS, language: language });

        if (action.notification) {
            showInfoMessage(LOCALIZATION_STRINGS.UPDATE_LANGUAGE_SUCCESS);
        }
        yield fork(refreshSideMenuPropertiesForTakeaway);
    } catch (e) {
        //NOTHING TO HANDLE
        if (action.notification) {
            showErrorMessage(e);
        }
    }
}

function* launchBugsee() {
    try {
        yield Bugsee.initialize();
        if (Platform.OS === 'ios') {
            const bugseeOptions = new Bugsee.IOSLaunchOptions();
            bugseeOptions.shakeToReport = true;
            bugseeOptions.reportPrioritySelector = true;
            yield Bugsee.launch(AppConfig.BUGSEE.IOS, bugseeOptions);
        } else {
            const bugseeOptions = new Bugsee.AndroidLaunchOptions();
            bugseeOptions.shakeToTrigger = true;
            bugseeOptions.notificationBarTrigger = true;
            yield Bugsee.launch(AppConfig.BUGSEE.ANDROID, bugseeOptions);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makePostFcmRegistrationCall() {
    let host = yield select(selectHost);
    if (isFranchiseApp()) {
        const configData = yield select(getConfiguration);
        host = getFranchiseHost(configData);
    }
    try {
        const response = yield apiCall(appBase.makePostFcmRegistrationCall, { host: host });
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: TYPES_CONFIG.FCM_REGISTRATION_SUCCESS, payload: true });
        }
    } catch (e) {
        yield put({ type: TYPES_CONFIG.FCM_REGISTRATION_SUCCESS, payload: false });
    }
}

function* setAppLanguage(response, oldS3Response) {
    const userSelectedLanguage = yield select(selectLanguage);
    let currentCountryID = getTakeawayCountryId(response?.country?.id);
    const countryList = yield select(selectCountryList);
    let oldCountryID = null;
    if (isValidElement(oldS3Response) && isValidS3Response(oldS3Response, countryList)) {
        oldCountryID = getTakeawayCountryId(oldS3Response?.country?.id);
    }
    if (isValidElement(userSelectedLanguage) && isValidElement(userSelectedLanguage.code) && currentCountryID === oldCountryID) {
        yield putResolve({
            type: TYPES_CONFIG.UPDATE_LANGUAGE,
            language: userSelectedLanguage,
            notification: false
        });
    } else {
        yield putResolve({
            type: TYPES_CONFIG.UPDATE_LANGUAGE,
            language: getDefaultLanguageName(response?.language?.default),
            notification: false
        });
    }
}

export function* updateStoreConfigResponse(action) {
    try {
        yield putResolve({
            type: TYPES_CONFIG.UPDATE_STORE_CONFIG_RESPONSE_FOR_VIEW_SUCCESS,
            payload: action.payload
        });
    } catch (e) {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
}

// function* listenForInternetChange() {
//     const action = yield take(UPDATE_CONNECTION_STATUS);
//     if (connectionStatus) {
//         return true
//     }
// }

function* onNetworkChangeCallback(action) {
    const { connectionStatus, oldConnectionStatus } = action;

    if (connectionStatus && oldConnectionStatus !== connectionStatus) {
        if (isCustomerApp()) {
            const s3Response = yield select(selectS3Response);
            if (isValidElement(s3Response)) {
                yield fork(makeStoreConfigCall, s3Response);
            }
        }
    }
}

export function* logStoreConfigResponse() {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    if (getLogCloseTakeawayEnabled(featureGateResponse)) {
        let storeConfig = yield select(selectStoreConfigResponse);
        if (isCustomerApp() && isValidElement(storeConfig)) {
            let storeConfigShowDelivery = storeConfig?.show_delivery;
            let storeStatusDelivery = getStoreStatusDelivery(storeConfig);
            let storeConfigShowCollection = storeConfig?.show_collection;
            let storeStatusCollection = getStoreStatusCollection(storeConfig);
            if (
                (storeConfigShowDelivery === 1 && storeStatusDelivery === ORDER_TYPE_STATUS.CLOSED) ||
                (storeConfigShowCollection === 1 && storeStatusCollection === ORDER_TYPE_STATUS.CLOSED)
            ) {
                let logObject = logStoreConfigObject(storeConfig);
                if (isValidElement(logObject)) {
                    const graphqlQuery = getGraphQlQuery(
                        FH_LOG_TYPE.STORE_CONFIG_RESPONSE,
                        logObject,
                        FH_LOG_ERROR_CODE.CLOSED_STORE_CONFIG_ERROR_CODE
                    );
                    yield fork(makeFHLogApiCall, { graphqlQuery: graphqlQuery });
                }
            }
        }
    }
}

function* appSaga() {
    yield all([
        takeLeading(TYPES_SIDE_MENU.REFRESH_SIDE_MENU, refreshSideMenuPropertiesForTakeaway),
        takeLeading(TYPES_CONFIG.GET_POLICY_LOOKUP, makePolicyLookupCall),
        takeLeading(APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION, makeInitialAppCall),
        takeLeading(TYPES_CONFIG.UPDATE_LANGUAGE, updateAppLanguage),
        takeLeading(TYPES_CONFIG.CHOOSE_COUNTRY_CONFIG, changeCountry),
        takeLeading(TYPES_CONFIG.CHOOSE_COUNTRY_CONFIG_SCREEN, chooseCountryScreen),
        takeLeading(TYPES_CONFIG.LANDING_PAGE_CALL, landingPageCall),
        takeLeading(TYPES_CONFIG.UPDATE_STORE_CONFIG_RESPONSE_FOR_VIEW, updateStoreConfigResponse),
        takeLeading(TYPES_CONFIG.INITIATE_BUGSEE, launchBugsee),
        takeLeading(TYPES_CONFIG.GET_STORE_CONFIG, makeStoreConfigCall),
        takeLeading(UPDATE_CONNECTION_STATUS, onNetworkChangeCallback),
        takeLeading(FH_LOG_TYPE.CAPTURE_ERROR_LOG, logStoreConfigResponse)
    ]);
}

export default appSaga;
