import { APP_ACTION_TYPE, TYPES_CONFIG, TYPES_SIDE_MENU } from '../Actions/Types';
import { SCREEN_OPTIONS } from '../../Navigation/ScreenOptions';
import { AppConstants } from '../../Utils/AppContants';
import { SESSION_MANAGER_TYPES } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerTypes';
import {
    getDefaultHiddenSideMenuItems,
    getDefaultVisibleSideMenuItems,
    isCustomerApp,
    isValidElement,
    isValidString
} from 't2sbasemodule/Utils/helpers';
import { TAKEAWAY_SEARCH_LIST_TYPE } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListType';

const defaultVisibleSideMenuItems = getDefaultVisibleSideMenuItems?.();
const defaultHiddenSideMenuItems = getDefaultHiddenSideMenuItems?.();

const INITIAL_STATE = {
    sessionMigratedVersion: 0,
    visibleSideMenuItems: defaultVisibleSideMenuItems,
    hiddenSideMenuItems: defaultHiddenSideMenuItems,
    activeMenu: SCREEN_OPTIONS.HOME.route_name,
    redirectRoute: SCREEN_OPTIONS.HOME.route_name,
    redirectParams: null,
    s3ConfigResponse: null,
    storeConfigResponse: null,
    policyLookupResponse: null,
    fcmRegistrationResponse: null,
    initAPIStatus: AppConstants.AppInitializationStatus.NOT_STARTED,
    orderType: null,
    appStoreRatingByUser: null,
    language: null,
    featureGateResponse: null,
    countryBaseFeatureGateResponse: null,
    forceUpdateResponse: null,
    unsupportedCountryResponse: null,
    storeFromListResponse: null,
    fallbackUrl: null,
    takeawayFallbackUrl: null,
    prevStoreConfigResponse: null,
    manualSwitchedCountry: null,
    selectedPostcode: null,
    appVersion: null,
    // For migration case, this will be undefined.
    // This need to be called only once for user updating app with moengage in it
    moengageUserMigrated: true,
    googleSessionToken: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TYPES_SIDE_MENU.SET_SIDE_MENU:
            return {
                ...state,
                visibleSideMenuItems: action.payload.visibleSideMenuItems,
                hiddenSideMenuItems: action.payload.hiddenSideMenuItems
            };
        case TYPES_SIDE_MENU.SET_ACTIVE_SIDE_MENU:
            return {
                ...state,
                activeMenu: action.activeMenu
            };
        case SESSION_MANAGER_TYPES.SET_SESSION_MIGRATED:
            return {
                ...state,
                sessionMigratedVersion: 1
            };
        case TYPES_CONFIG.CHOOSE_COUNTRY_CONFIG_SCREEN_SUCCESS:
            return {
                ...state,
                initAPIStatus: AppConstants.AppInitializationStatus.SHOW_COUNTRY_PICK
            };

        case TYPES_SIDE_MENU.REDIRECT_ROUTE:
            return {
                ...state,
                redirectRoute: action.route,
                redirectParams: action.params
            };

        case TYPES_CONFIG.S3_CONFIG_SUCCESS:
            return {
                ...state,
                s3ConfigResponse: action.payload
            };
        case TYPES_CONFIG.STORE_CONFIG_SUCCESS:
            return {
                ...state,
                storeConfigResponse: action.payload
            };
        case TYPES_CONFIG.PREV_STORE_CONFIG_SUCCESS:
            return {
                ...state,
                prevStoreConfigResponse: action.payload
            };
        case TYPES_CONFIG.RESET_STORE_AND_BASKET_CONFIG:
            return {
                ...state,
                prevStoreConfigResponse: null,
                storeConfigResponse: null
            };
        case TYPES_CONFIG.POLICY_LOOKUP_SUCCESS:
            return {
                ...state,
                policyLookupResponse: action.payload
            };
        case TYPES_CONFIG.FCM_REGISTRATION_SUCCESS:
            return {
                ...state,
                fcmRegistrationResponse: action.payload
            };
        case APP_ACTION_TYPE.APP_LAUNCH_API_ACTIONS: {
            return {
                ...state,
                initAPIStatus: action.payload,
                fallbackUrl: isValidString(action.fallbackUrl) ? action.fallbackUrl : null
            };
        }
        case TYPES_CONFIG.UNSUPPORTED_COUNTRY_RESPONSE: {
            return {
                ...state,
                unsupportedCountryResponse: action.payload,
                initAPIStatus: AppConstants.AppInitializationStatus.SHOW_COUNTRY_PICK
            };
        }
        case TYPES_CONFIG.RESET_UNSUPPORTED_COUNTRY_RESPONSE: {
            return {
                ...state,
                unsupportedCountryResponse: null
            };
        }
        case TYPES_CONFIG.COUNTRY_BASE_FEATURE_GATE_SUCCESS: {
            return {
                ...state,
                countryBaseFeatureGateResponse: action.payload,
                initAPIStatus: AppConstants.AppInitializationStatus.COMPLETED
            };
        }
        case TYPES_CONFIG.APP_STORE_RATING_BY_USER: {
            return {
                ...state,
                appStoreRatingByUser: {
                    ratingStatus: action.ratingStatus,
                    appVersion: action.appVersion
                }
            };
        }

        case TYPES_CONFIG.UPDATE_LANGUAGE_SUCCESS:
            return {
                ...state,
                language: action.language
            };
        case TYPES_CONFIG.GDPR_FORCE_UPDATE_SUCCESS: {
            return {
                ...state,
                forceUpdateResponse: action.payload
            };
        }
        case TYPES_CONFIG.FEATURE_GATE_SUCCESS: {
            return {
                ...state,
                featureGateResponse: action.payload
            };
        }
        case TYPES_CONFIG.UPDATE_STORE_CONFIG_RESPONSE_FOR_VIEW_SUCCESS:
            return {
                ...state,
                storeFromListResponse: action.payload,
                storeConfigResponse: action.payload
            };
        case TYPES_CONFIG.TAKEAWAY_FALL_BACK: {
            return {
                ...state,
                takeawayFallbackUrl: isValidString(action.takeawayFallbackUrl) ? action.takeawayFallbackUrl : null
            };
        }
        case TYPES_CONFIG.RESET_EXPIRED_BASKET: {
            return {
                ...state,
                storeConfigResponse: isCustomerApp() ? state.storeConfigResponse : null,
                storeFromListResponse: null,
                prevStoreConfigResponse: null,
                selectedPostcode: null
            };
        }
        case TYPES_CONFIG.MANUAL_COUNTRY_SWITCH: {
            return {
                ...state,
                manualSwitchedCountry: action.payload
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_SUCCESS:
            return {
                ...state,
                selectedPostcode: isValidElement(action.selectedPostcode) ? action.selectedPostcode.toUpperCase() : state.selectedPostcode
            };
        case TYPES_CONFIG.SET_APP_VERSION:
            return {
                ...state,
                appVersion: action.version
            };
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION:
            return {
                ...state,
                storeConfigResponse: isCustomerApp() ? null : state.storeConfigResponse
            };
        case TYPES_CONFIG.UPDATE_GOOGLE_SESSION_TOKEN:
            return {
                ...state,
                googleSessionToken: action.googleSessionToken
            };
        default:
            return state;
    }
};
