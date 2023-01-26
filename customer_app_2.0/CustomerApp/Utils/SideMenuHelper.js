import { isNonCustomerApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { SCREEN_OPTIONS } from '../Navigation/ScreenOptions';
import { SIDE_MENU_CONSTANTS } from '../View/SideMenu/SideMenuConstants';
import { getTotalSavingStatus, getWalletStatus } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import { AppConfig } from './AppConfig';

/**
 * Takes care of the removing side menu item depending on the user logged in status
 * @param menuList
 * @param userLoggedIn
 * @param isShowLoyaltyPoints
 * @param isShowTableReservation
 * @param isShowReferFriend
 * @param featureGateResponse
 * @returns {*}
 */
export const constructSideMenu = (
    menuList,
    userLoggedIn,
    isShowLoyaltyPoints,
    isShowTableReservation,
    isShowReferFriend,
    featureGateResponse
) => {
    const totalSavingStatus = getTotalSavingStatus(featureGateResponse);
    const walletStatus = getWalletStatus(featureGateResponse);
    if (isValidElement(menuList) && isValidElement(userLoggedIn)) {
        let itemsToRemove = [];
        if (userLoggedIn) {
            itemsToRemove.push(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
        } else {
            itemsToRemove.push(SCREEN_OPTIONS.PROFILE.route_name);
        }
        if (!isShowLoyaltyPoints) {
            itemsToRemove.push(SCREEN_OPTIONS.LOYALTY_POINTS.route_name);
        }
        if (!isShowTableReservation) {
            itemsToRemove.push(SCREEN_OPTIONS.TABLE_BOOKING.route_name);
        }
        if (!totalSavingStatus) {
            itemsToRemove.push(SCREEN_OPTIONS.TOTAL_SAVINGS.route_name);
        }
        if (!walletStatus) {
            itemsToRemove.push(SCREEN_OPTIONS.WALLET.route_name);
        }
        if (!isShowReferFriend) {
            itemsToRemove.push(SCREEN_OPTIONS.REFERRAL_SCREEN.route_name);
        }

        return menuList.filter((item) => !itemsToRemove.includes(item.key));
    } else {
        return menuList;
    }
};

export const loginRequiredScreens = (routeName, isUserLoggedIn = false) => {
    return (
        (routeName === SCREEN_OPTIONS.ORDER_HISTORY.route_name ||
            routeName === SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name ||
            routeName === SCREEN_OPTIONS.WALLET.route_name ||
            routeName === SCREEN_OPTIONS.SOCIAL_LOGIN.route_name ||
            (!isNonCustomerApp() && routeName === SCREEN_OPTIONS.TOTAL_SAVINGS.route_name) ||
            routeName === SCREEN_OPTIONS.LOYALTY_POINTS.route_name) &&
        !isUserLoggedIn
    );
};
export const isLoyalityPointEnabled = (loyaltyStatus, loyaltyStatusMessage, loyalty_point_available) => {
    if (isValidString(loyaltyStatus) && loyaltyStatus === SIDE_MENU_CONSTANTS.DISABLED) {
        return false;
    } else if (isValidString(loyaltyStatusMessage) && loyalty_point_available === 0) {
        return false;
    } else {
        return true;
    }
};

export const getPoweredByMessage = () => {
    if (isValidString(AppConfig.POWERED_BY_BRANDING)) {
        return AppConfig.POWERED_BY_BRANDING + SIDE_MENU_CONSTANTS.COPYRIGHT_SYMBOL;
    }
    return isNonCustomerApp() ? SIDE_MENU_CONSTANTS.FOODHUB_VERSION : SIDE_MENU_CONSTANTS.TOUCH_2_SUCCESS_VERSION;
};

export const isBasketItemsReminder = (countryBaseFeatureGateResponse) => {
    if (
        isValidElement(countryBaseFeatureGateResponse) &&
        isValidElement(countryBaseFeatureGateResponse.basket_items_reminder) &&
        isValidElement(countryBaseFeatureGateResponse.basket_items_reminder.enable)
    ) {
        return countryBaseFeatureGateResponse.basket_items_reminder.enable;
    }
};
