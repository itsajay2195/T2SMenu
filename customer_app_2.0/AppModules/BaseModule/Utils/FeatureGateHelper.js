import { isCustomerApp, isFoodHubApp, isFranchiseApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import VersionNumber from 'react-native-version-number';
import { Constants, HapticFrom, HapticType } from 't2sbasemodule/Utils/Constants';
import { TOGGLE_STATUS } from '../BaseConstants';
import { PAYMENT_TYPE } from '../../QuickCheckoutModule/Utils/QuickCheckoutConstants';

export const getHygieneRatingStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return true;
    } else if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.hygiene_rating) &&
        isValidString(configResponse.hygiene_rating.status)
    ) {
        return configResponse.hygiene_rating.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getTotalSavingStatus = (configResponse) => {
    if (isFoodHubApp()) {
        return false;
    } else if (isCustomerApp()) {
        return true;
    } else if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.total_savings) &&
        isValidString(configResponse.total_savings.status)
    ) {
        return configResponse.total_savings.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getDiscoveryScreenRecentOrdersStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return true;
    } else if (isValidString(configResponse?.discovery_screen_recent_orders?.status)) {
        return configResponse.discovery_screen_recent_orders.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getAdaChatBotStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return true;
    } else if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.ada_chat_bot) &&
        isValidString(configResponse.ada_chat_bot.status)
    ) {
        return configResponse.ada_chat_bot.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getWalletStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return false;
    } else if (isValidElement(configResponse?.foodhub_wallet) && isValidString(configResponse.foodhub_wallet.status)) {
        return configResponse.foodhub_wallet.status.toUpperCase() === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getApplePayStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return false;
    } else if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.payment_apple_pay) &&
        isValidString(configResponse.payment_apple_pay.status)
    ) {
        return configResponse.payment_apple_pay.status === 'ENABLED';
    } else {
        return false;
    }
};
export const getGooglePayGateway = (configResponse) => {
    if (isValidElement(configResponse.payment_google_pay?.options?.gateway)) {
        return configResponse.payment_google_pay?.options?.gateway;
    }
    return null;
};
export const getApplePayGateway = (configResponse) => {
    if (isValidElement(configResponse.payment_apple_pay?.options?.gateway)) {
        return configResponse.payment_apple_pay?.options?.gateway;
    }
    return null;
};
export const getNativePayGateway = (type, configResponse) => {
    return type === PAYMENT_TYPE.GOOGLE_PAY
        ? getGooglePayGateway(configResponse)
        : type === PAYMENT_TYPE.APPLE_PAY
        ? getApplePayGateway(configResponse)
        : null;
};
export const getGooglePayStatus = (configResponse) => {
    return configResponse?.payment_google_pay?.status === 'ENABLED';
};
export const getShowRecommendationStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return true;
    } else if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.show_recommendation) &&
        isValidString(configResponse.show_recommendation.status)
    ) {
        return configResponse.show_recommendation.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getLive_trackingStatus = (configResponse) => {
    if (isCustomerApp() || isFranchiseApp()) {
        return true;
    } else if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.live_tracking) &&
        isValidString(configResponse.live_tracking.status)
    ) {
        return configResponse.live_tracking.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getContactlessDeliveryStatus = (configResponse) => {
    if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.contactless_delivery) &&
        isValidString(configResponse.contactless_delivery.status)
    ) {
        return configResponse.contactless_delivery.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getShowPlayStoreRatingLeftMenu = (configResponse) => {
    if (
        isValidElement(configResponse) &&
        isValidElement(configResponse.show_play_store_rating_left_menu) &&
        isValidString(configResponse.show_play_store_rating_left_menu.status)
    ) {
        return configResponse.show_play_store_rating_left_menu.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getSavedCardStatus = (configResponse) => {
    if (isValidElement(configResponse) && isValidElement(configResponse.saved_cards) && isValidString(configResponse.saved_cards.status)) {
        return configResponse.saved_cards.status === TOGGLE_STATUS.ENABLED;
    } else {
        return true;
    }
};

export const getSilentCodePushStatus = (countryBaseFeatureGateResponse) => {
    let silentCodePush = true;
    if (
        isValidElement(countryBaseFeatureGateResponse) &&
        isValidElement(countryBaseFeatureGateResponse.code_push_silent) &&
        isValidElement(countryBaseFeatureGateResponse.code_push_silent.status)
    ) {
        let genericStatus = countryBaseFeatureGateResponse.code_push_silent.status;
        if (isValidElement(countryBaseFeatureGateResponse.code_push_silent.options)) {
            const versionKeys = Object.keys(countryBaseFeatureGateResponse.code_push_silent.options);
            const versionNumber = versionKeys.find((item) => '' + item === VersionNumber.appVersion);
            if (isValidElement(versionNumber)) {
                const versionStatus = countryBaseFeatureGateResponse.code_push_silent.options[versionNumber];
                silentCodePush =
                    isValidElement(versionStatus) && isValidElement(versionStatus.status) && versionStatus.status === Constants.ENABLED;
            } else {
                silentCodePush = genericStatus === Constants.ENABLED;
            }
        } else {
            silentCodePush = genericStatus === Constants.ENABLED;
        }
    }
    return silentCodePush;
};

export const getFeatureGateBasketRecommendation = (featureGateResponse) => {
    if (isValidElement(featureGateResponse?.basket_recommendation?.status)) {
        return featureGateResponse.basket_recommendation.status === TOGGLE_STATUS.ENABLED;
    }
    return false;
};

export const getDeliveryAddressLegacyVersionStatus = (configResponse) => {
    if (isFranchiseApp()) {
        return false;
    }
    if (isValidString(configResponse?.delivery_address_legacy_version?.status)) {
        return configResponse.delivery_address_legacy_version.status === TOGGLE_STATUS.ENABLED;
    } else {
        return false;
    }
};

export const getReferralCampaignStatus = (configResponse) => {
    if (isValidElement(configResponse?.referral_campaign?.status)) {
        return configResponse.referral_campaign.status === Constants.ENABLED;
    } else {
        return false;
    }
};

export const getHapticFeedbackType = (configResponse, fromWhere) => {
    if (!isFoodHubApp() && isValidElement(fromWhere)) {
        switch (fromWhere) {
            case HapticFrom.ORDER_PLACED:
                return HapticType.NOTIFICATION_SUCCESS;
            case HapticFrom.ADDON_ADDED:
                return HapticType.IMPACT_LIGHT;
            case HapticFrom.ITEM_ADDED:
                return HapticType.IMPACT_MEDIUM;
            default:
                return null;
        }
    }

    const { haptic_feedback } = isValidElement(configResponse) && configResponse;
    if (
        isValidString(haptic_feedback?.status) &&
        haptic_feedback.status === TOGGLE_STATUS.ENABLED &&
        isValidElement(fromWhere) &&
        isValidElement(haptic_feedback?.options) &&
        isValidString(haptic_feedback.options[fromWhere])
    ) {
        return haptic_feedback.options[fromWhere];
    } else {
        return null;
    }
};

export const isGlobalTipEnable = (featureGateResponse) => {
    if (isValidElement(featureGateResponse?.showTips_UI?.status)) {
        return featureGateResponse?.showTips_UI?.status === Constants.ENABLED;
    } else return false;
};

export const getFoodhubLogoStatus = (foodhub_logo) => {
    if (isValidString(foodhub_logo?.status) && foodhub_logo?.status === TOGGLE_STATUS.ENABLED && foodhub_logo?.options?.enable_black) {
        return require('../../../CustomerApp/Images/fh_logo_black.png');
    } else {
        return require('../../../CustomerApp/Images/fh_logo.png');
    }
};

export const getLogCloseTakeawayEnabled = (featureGateResponse) => {
    return featureGateResponse?.log_close_takeaway?.status === TOGGLE_STATUS.ENABLED;
};
