import { T2SConfig } from './T2SConfig';
import { isNonCustomerApp, isValidElement, isValidNotEmptyString, isValidString } from './helpers';
import { AppConfig } from '../../CustomerApp/Utils/AppConfig';
import { addTimeDeviceMoment, getDeviceTimeZone } from './DateUtil';
import { SESSION_EXPIRE_BEFORE_CHECK } from '../Network/SessionManager/Utils/SessionManagerConstants';
import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import { isVerifyOtp } from '../UI/CustomUI/OTPModal/Utils/OTPHelper';
import { createSelector } from 'reselect';
import { BOOL_CONSTANT } from 'appmodules/AddressModule/Utils/AddressConstants';
import { getCurrencyFromStore } from 'appmodules/BaseModule/GlobalAppHelper';
import { getISOFromStore } from 'appmodules/BaseModule/GlobalAppHelper';
import { getFeatureGateBasketRecommendation } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import {
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { getPreorderStatus, getStoreStatusCollection, getStoreStatusDelivery } from '../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import {
    isPreOrderAvailableForCollection,
    isPreOrderAvailableForDelivery
} from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import Config from 'react-native-config';
import { getCurrencyFromBasketResponse } from 'appmodules/BaseModule/GlobalAppHelper';
export const selectCountryBaseFeatureGateSelector = (state) => state.appState.countryBaseFeatureGateResponse;
export const selectUserResponse = (state) => state.profileState.profileResponse;
export const selectUserResponseWithoutConsent = (state) => state.authState.profileResponseWithoutConsent;
export const selectAccessToken = (state) => state.userSessionState.access_token;
export const selectAccountVerified = (state) => state.authState.accountVerified;
export const selectS3Response = (state) => state.appState.s3ConfigResponse;
export const selectRedirectScreen = (state) => state.appState.redirectRoute;
export const selectRedirectParams = (state) => state.appState.redirectParams;
export const selectSwitchCountryLocale = (state) => state.appState.manualSwitchedCountry;
export const selectLanguage = (state) => state.appState.language;
export const selectStoreConfigResponse = (state) => state.appState.storeConfigResponse;
export const selectReOrderStoreConfigResponse = (state) => state.orderManagementState.reOrderStoreConfiguration;
export const selectFcmRegistrationResponse = (state) => state.appState.fcmRegistrationResponse;
export const selectPolicyLookupResponse = (state) => state.appState.policyLookupResponse;
export const getNetworkStatus = (state) => state.offlineNoticeManagerState.connectionStatus;
export const selectOtpPhoneNumber = (state) => state.authState.otpPhoneNumber;
export const selectAddressResponse = (state) => state.addressState.addressResponse;
export const selectedOrderType = (state) => state.addressState.selectedOrderType;
export const selectWalletBalance = (state) => state.walletState.walletBalance;
export const selectPushNotificationToken = (state) => state.pushNotificationState.deviceToken;
export const selectTakeawayListReducer = (state) => state.takeawayListReducer;
export const selectBasketStoreConfig = (state) => state.appState.prevStoreConfigResponse;
export const selectBasketStoreID = (state) => state.basketState.storeID;
export const selectCountryList = (state) => state.landingState.countryList;
export const selectEnvConfig = (state) => state.envConfigState.envConfigData;
export const selectSearchedPostcode = (state) => state.appState.selectedPostcode;
export const selectCurrencyFromBasket = (state) => state.basketState?.viewBasketResponse?.currency_symbol ?? '';
export const selectBrazeNotificationList = (state) => state.pushNotificationState.brazeNotificationList;
export const selectLatestMoeNotificationId = (state) => state.notificationState.moeNotificationId;

export const selectRegion = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.region)) {
        return s3Response.region.id;
    } else {
        return Config.DEFAULT_REGION;
    }
};

export const selectCountry = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.country)) {
        return s3Response.country.id;
    } else {
        return Config.DEFAULT_REGION;
    }
};

export const selectLocale = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.country) && isValidString(s3Response.country.name)) {
        return s3Response.country.name.toLocaleLowerCase();
    } else {
        return Config.DEFAULT_LOCALE;
    }
};

export const selectSwitchLocale = (state) => {
    const locale = selectSwitchCountryLocale(state);
    if (isValidElement(locale)) {
        return locale;
    } else {
        return Config.DEFAULT_LOCALE;
    }
};

export const selectAPIVersion = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        return s3Response.api_version;
    } else {
        return AppConfig.API_VERSION;
    }
};

export const selectLanguageKey = (state) => {
    const language = selectLanguage(state);
    if (isValidElement(language) && isValidString(language.code)) {
        return language.code;
    } else {
        return 'en-gb';
    }
};

export const selectCurrencySymbol = (state) => {
    if (isNonCustomerApp()) {
        const s3Response = selectS3Response(state);
        if (isValidElement(s3Response) && isValidElement(s3Response.currency) && isValidString(s3Response.currency.symbol)) {
            return s3Response.currency.symbol;
        } else {
            return T2SConfig.default.currency;
        }
    } else {
        const storeConfigResponse = selectStoreConfigResponse(state);
        return getCurrencyFromBasketResponse(getCurrencyFromStore(storeConfigResponse));
    }
};

export const selectCurrencyISO = (state) => {
    if (isNonCustomerApp()) {
        const s3Response = selectS3Response(state);
        if (isValidElement(s3Response) && isValidElement(s3Response.currency) && isValidString(s3Response.currency.iso)) {
            return s3Response.currency.iso;
        } else {
            return T2SConfig.default.iso;
        }
    } else {
        const storeConfigResponse = selectStoreConfigResponse(state);
        return getISOFromStore(storeConfigResponse);
    }
};

export const selectCurrencyFromStore = (state) => {
    const storeResponse = selectStoreConfigResponse(state);
    const s3Response = selectS3Response(state);
    if (isValidString(s3Response?.currency?.symbol)) {
        return s3Response.currency.symbol;
    } else if (isValidElement(storeResponse?.currency)) {
        return getCurrencyFromStore(storeResponse);
    } else {
        return '';
    }
};

export const selectPhoneRegex = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response) && isValidElement(s3Response.phone) && isValidString(s3Response.phone.reg_ex)) {
        return s3Response.phone.reg_ex;
    } else {
        return T2SConfig.default.phoneRegex.UK;
    }
};

export const selectPhoneLength = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        return s3Response.phone.max_length;
    } else {
        return T2SConfig.default.phoneLength.UK;
    }
};

export const selectPostcodeRegex = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        if (isValidElement(s3Response.post_code)) {
            return s3Response.post_code.reg_ex;
        } else if (isValidElement(s3Response.postcode)) {
            return s3Response.postcode.reg_ex;
        }
    }
    return T2SConfig.default.postcodeRegex.UK;
};

export const selectPostcodeLength = (state) => {
    const s3Response = selectS3Response(state);
    if (isValidElement(s3Response)) {
        return s3Response.postcode.max_length;
    } else {
        return T2SConfig.default.postcodeLength.UK;
    }
};

/**
 * Only you need to use if app is Customer app. & Pre Order widget.
 * @param state
 * @param storeConfigResponse
 * @returns {string|*}
 */
export const selectTimeZone = (state, storeConfigResponse) => {
    if (isValidElement(storeConfigResponse)) {
        let timezone = getTimeZoneFromConfig(storeConfigResponse);
        if (isValidElement(timezone)) {
            return timezone;
        }
    }
    const storeResponse = selectStoreConfigResponse(state);
    let timezone = getTimeZoneFromConfig(storeResponse);
    if (isValidElement(timezone)) {
        return timezone;
    } else {
        const s3Response = selectS3Response(state);
        if (isValidElement(s3Response?.region?.time_zone)) {
            return s3Response.region.time_zone;
        } else {
            return getDeviceTimeZone();
        }
    }
};

const getTimeZoneFromConfig = (storeResponse) => {
    if (isValidElement(storeResponse) && isValidElement(storeResponse.time_zone)) {
        return storeResponse.time_zone;
    } else if (
        isValidElement(storeResponse) &&
        isValidElement(storeResponse.region) &&
        storeResponse.region.length > 0 &&
        isValidElement(storeResponse.region[0].time_zone)
    ) {
        return storeResponse.region[0].time_zone;
    } else {
        return null;
    }
};

export const selectUserToken = (state) => {
    const userResponse = selectUserResponse(state);
    const userResponseWithoutConsent = selectUserResponseWithoutConsent(state);
    if (isValidElement(userResponseWithoutConsent)) {
        return userResponseWithoutConsent.api_token;
    } else if (isValidElement(userResponse)) {
        return userResponse.api_token;
    } else {
        return '';
    }
};

export const getUserLoggedIn = (state) => {
    const userResponse = selectUserResponse(state);
    return isValidElement(userResponse);
};

export const selectHasUserLoggedIn = createSelector(getUserLoggedIn, (userLoggedIn) => userLoggedIn);

export const selectHost = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse)) {
        return storeConfigResponse.host;
    } else {
        return '';
    }
};

export const selectPhone = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse)) {
        return storeConfigResponse.phone;
    } else {
        return '';
    }
};

export const selectStoreId = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse)) {
        return storeConfigResponse.id;
    } else {
        return AppConfig.STORE_ID;
    }
};

export const isAccessTokenExpired = (state) => {
    return (
        isValidElement(state.userSessionState.access_token) &&
        state.userSessionState.access_token.length > 0 &&
        state.userSessionState.access_token_expires_in < addTimeDeviceMoment(SESSION_EXPIRE_BEFORE_CHECK)
    );
};

export const selectMobileAuthRedirection = (state) => {
    let redirection = selectRedirectScreen(state);
    let redirectionParams = selectRedirectParams(state);
    const otpPhoneNumber = selectOtpPhoneNumber(state);
    const accountVerified = selectAccountVerified(state);
    if (!isValidElement(otpPhoneNumber) && isVerifyOtp(accountVerified)) {
        redirection = SCREEN_OPTIONS.PROFILE.route_name;
    }
    return { redirectScreen: redirection, redirectParams: redirectionParams };
};

export const isTakeAwayOpenSelector = (state) => {
    return isDeliveryAvailableSelector(state) || isCollectionAvailableSelector(state);
};

export const isPreOrderAvailableForCollectionSelector = (state) => {
    const preOrderHours = selectPreorderCollectionStatus(state);
    return preOrderHours.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
};

export const isPreOrderAvailableForDeliverySelector = (state) => {
    const preOrderHours = selectPreorderDeliveryStatus(state);
    return preOrderHours.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
};

export const isPreOrderAvailableSelector = (state) => {
    return isPreOrderAvailableForCollectionSelector(state) || isPreOrderAvailableForDeliverySelector(state);
};

export const isCollectionAvailableSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    return isCollectionAvailableForStore(storeConfigResponse?.show_collection, getStoreStatusCollection(storeConfigResponse));
};
export const isCollectionAvailableForStore = (storeConfigShowCollection, storeStatusCollection) => {
    if (isValidElement(storeStatusCollection) && isValidElement(storeConfigShowCollection)) {
        return storeStatusCollection === 'open' && storeConfigShowCollection === 1;
    }
    return false;
};

export const isDeliveryAvailableSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    return isDeliveryAvailableForStore(storeConfigResponse?.show_delivery, getStoreStatusDelivery(storeConfigResponse));
};
export const isDeliveryAvailableForStore = (storeConfigShowDelivery, storeStatusDelivery) => {
    if (isValidElement(storeStatusDelivery) && isValidElement(storeConfigShowDelivery)) {
        return storeStatusDelivery === 'open' && storeConfigShowDelivery === 1;
    }
    return false;
};
export const selectPrimaryAddressSelector = (state) => {
    let addressResponse = selectAddressResponse(state);
    if (isValidElement(addressResponse) && addressResponse.data.length > 0) {
        for (let i = 0; i < addressResponse.data.length; i++) {
            if (addressResponse.data[i].is_primary === 'YES') {
                return addressResponse.data[i];
            }
        }
    }
    return null;
};
export const selectTakeawayAddressSelector = (state) => {
    let storeResponse = selectStoreConfigResponse(state);
    let takeAwayAddress = '';
    if (isValidNotEmptyString(storeResponse?.number)) {
        takeAwayAddress = `${storeResponse.number} `;
    }
    if (isValidNotEmptyString(storeResponse?.street)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.street}, `;
    }
    if (isValidNotEmptyString(storeResponse?.city)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.city}, `;
    }
    if (isValidNotEmptyString(storeResponse?.town)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.town}, `;
    }
    if (isValidNotEmptyString(storeResponse?.postcode)) {
        takeAwayAddress = `${takeAwayAddress} ${storeResponse.postcode}, `;
    }
    return takeAwayAddress;
};

export const getAskPostCode = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse) && isValidElement(storeConfigResponse.ask_postcode_first)) {
        return storeConfigResponse.ask_postcode_first;
    }
};

export const selectAskPostCode = createSelector([getAskPostCode], (getAskPostCode) => {
    return getAskPostCode;
});

export const selectTakeawayName = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse) && isValidString(storeConfigResponse.name)) {
        return storeConfigResponse.name;
    } else {
        return '';
    }
};
export const selectUserPhoneNumber = (state) => {
    const userResponse = selectUserResponse(state);
    if (isValidElement(userResponse) && isValidString(userResponse.phone)) {
        return userResponse.phone;
    } else {
        return '';
    }
};

export const isReOrderStoreOpenSelector = (state) => {
    return reOrderStoreDeliveryAvailable(state) || reOrderStoreCollectionAvailable(state);
};
export const reOrderStoreDeliveryAvailable = (state) => {
    const reOrderStore = selectReOrderStoreConfigResponse(state);
    const storeStatusDelivery = getStoreStatusDelivery(reOrderStore);
    return isValidElement(reOrderStore) && isValidElement(reOrderStore.show_delivery)
        ? storeStatusDelivery.toLowerCase() === 'open' && reOrderStore.show_delivery === 1
        : false;
};
export const reOrderStoreCollectionAvailable = (state) => {
    const reOrderStore = selectReOrderStoreConfigResponse(state);
    const storeStatusCollection = getStoreStatusCollection(reOrderStore);
    return isValidElement(reOrderStore) && isValidElement(reOrderStore.show_collection)
        ? storeStatusCollection.toLowerCase() === 'open' && reOrderStore.show_collection === 1
        : false;
};
export const reOrderStoreCollectionPreOrderAvailable = (state) => {
    const reOrderStore = selectReOrderStoreConfigResponse(state);
    let preOrderCollection = getPreorderStatus(reOrderStore, ORDER_TYPE.COLLECTION, getStoreStatusCollection(reOrderStore));
    return preOrderCollection.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
};
export const reOrderStoreDeliveryPreOrderAvaialble = (state) => {
    const reOrderStore = selectReOrderStoreConfigResponse(state);
    let preOrderDelivery = getPreorderStatus(reOrderStore, ORDER_TYPE.DELIVERY, getStoreStatusDelivery(reOrderStore));
    return preOrderDelivery.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
};
export const reOrderStorePreOrderAvailable = (state) => {
    return reOrderStoreCollectionPreOrderAvailable(state) || reOrderStoreDeliveryPreOrderAvaialble(state);
};

const getInitAPIStatus = (state) => {
    return state.appState.initAPIStatus;
};
export const selectInitAPIStatus = createSelector(getInitAPIStatus, (status) => {
    return status;
});

export const getSpanishLanguage = (state) => {
    const langObject = selectLanguage(state);
    if (isValidElement(langObject) && isValidElement(langObject.code)) {
        return langObject.code === 'es';
    }
    return false;
};

export const getLanguageCode = (state) => {
    const langObject = selectLanguage(state);
    if (isValidElement(langObject) && isValidElement(langObject.code)) {
        return langObject.code;
    }
    return 'en';
};

export const selectIsSpanishLanguage = createSelector(getSpanishLanguage, (isSpanish) => isSpanish);

export const getEnglishLanguage = (state) => {
    const langObject = selectLanguage(state);
    if (isValidElement(langObject) && isValidElement(langObject.code)) {
        return langObject.code.includes('en');
    }
    return false;
};
export const selectIsEnglishLanguage = createSelector(getEnglishLanguage, (isEnglish) => isEnglish);
export const selectNetworkStatus = createSelector(getNetworkStatus, (networkStatus) => networkStatus);

export const selectBasketRecommendationFeatureGate = (state) => {
    const featureGateResponse = selectCountryBaseFeatureGateSelector(state);
    return getFeatureGateBasketRecommendation(featureGateResponse);
};

const getIsPreOrderASAP = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    if (isValidElement(storeConfigResponse) && isValidElement(storeConfigResponse.pre_order_asap)) {
        return storeConfigResponse.pre_order_asap === 'ENABLED';
    } else {
        return false;
    }
};
export const selectPreOrderASAP = createSelector(getIsPreOrderASAP, (isPreOrderASAP) => isPreOrderASAP);

export const isBasketTakeAwayOpenSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    const basketStoreConfigResponse = selectBasketStoreConfig(state);
    const basketStoreID = selectBasketStoreID(state);
    if (isValidElement(basketStoreID) && isValidElement(storeConfigResponse) && basketStoreID === storeConfigResponse.id) {
        return (
            isDeliveryAvailableForStore(storeConfigResponse?.show_delivery, getStoreStatusDelivery(storeConfigResponse)) ||
            isCollectionAvailableForStore(storeConfigResponse?.show_collection, getStoreStatusCollection(storeConfigResponse))
        );
    } else if (isValidElement(basketStoreConfigResponse)) {
        return (
            isDeliveryAvailableForStore(basketStoreConfigResponse?.show_delivery, getStoreStatusDelivery(basketStoreConfigResponse)) ||
            isCollectionAvailableForStore(basketStoreConfigResponse?.show_collection, getStoreStatusCollection(basketStoreConfigResponse))
        );
    }
};

export const isPreOrderEnabledSelector = (state) => {
    const storeConfigResponse = selectStoreConfigResponse(state);
    const basketStoreConfigResponse = selectBasketStoreConfig(state);
    const basketStoreID = selectBasketStoreID(state);
    if (isValidElement(basketStoreID) && isValidElement(storeConfigResponse) && basketStoreID === storeConfigResponse.id) {
        return isPreOrderAvailableForCollectionSelector(state) || isPreOrderAvailableForDeliverySelector(state);
    } else if (isValidElement(basketStoreConfigResponse)) {
        let preorderDelivery = getPreorderStatus(
            basketStoreConfigResponse,
            ORDER_TYPE.DELIVERY,
            getStoreStatusDelivery(basketStoreConfigResponse)
        );
        let preorderCollection = getPreorderStatus(
            basketStoreConfigResponse,
            ORDER_TYPE.COLLECTION,
            getStoreStatusCollection(basketStoreConfigResponse)
        );
        return isPreOrderAvailableForCollection(preorderCollection) || isPreOrderAvailableForDelivery(preorderDelivery);
    }
};

export const selectCurrencyFromS3Config = (state) => {
    return state.appState.s3ConfigResponse?.currency?.symbol;
};
