import { isArrayNonEmpty, isValidElement, isValidString, safeFloatRoundedValue, safeIntValue } from 't2sbasemodule/Utils/helpers';
import { isBOGOFItem, isBOGOHItem, showTipsUI, tipsEnableCountry, translateLabels, translateWarnErrors } from '../Utils/BasketHelper';
import { BasketConstants } from '../Utils/BasketConstants';
import { createSelector } from 'reselect';
import { CONSTANTS, PAYMENT_TYPE } from '../../QuickCheckoutModule/Utils/QuickCheckoutConstants';
import {
    getLanguageCode,
    selectIsEnglishLanguage,
    selectLanguageKey,
    selectStoreConfigResponse,
    selectWalletBalance
} from 't2sbasemodule/Utils/AppSelectors';
import { isCardPaymentEnabled, paymentReference } from '../../QuickCheckoutModule/Utils/Helper';

import moment from 'moment-timezone';
import VersionNumber from 'react-native-version-number';
import { getModel } from 'react-native-device-info';
import Config from 'react-native-config';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import { ORDER_TYPE_MODAL } from '../../MenuModule/Utils/MenuConstants';
import { getWebhookURL } from '../../../CustomerApp/Utils/AppConfig';
import { isGlobalTipEnable } from '../../BaseModule/Utils/FeatureGateHelper';
export const selectBasketState = (state) => state.basketState;
export const selectAddressState = (state) => state.addressState;

export const selectBasketViewResponse = (state) => state.basketState.viewBasketResponse;
export const selectCart = (state) => state.basketState.cartItems;
export const selectMissingItemArray = (state) => state.basketState.missingItemArray;

export const selectLoyaltyPointsResponse = (state) => state.basketState.lookupLoyaltyPointsResponse;
export const selectRepeatAddon = (state) => state.basketState.repeatAddOn;
export const selectUserPaymentMode = (state) => state.basketState.user_payment_mode;
export const selectSavedCardDetails = (state) => state.profileState.savedCardDetails;
export const selectPrimaryCardId = (state) => state.profileState.primaryCardId;
export const selectUserSelectedCardId = (state) => state.basketState.user_selected_card_id;
export const selectCvv = (state) => state.basketState.CVV;
export const selectDeliveryAddress = (state) => state.addressState.deliveryAddress;
export const selectCountryBaseFeatureGateResponse = (state) => state.appState.countryBaseFeatureGateResponse;
export const selectProfileState = (state) => state.profileState;
export const selectCouponApplied = (state) => state.basketState.lastCouponValue;
export const selectLiveTrackingId = (state) => state.takeawayListReducer.takeawayLiveTrackingEventID;
const selectTakeawayResponse = (state) => state.appState.storeConfigResponse;

export const selectUserProfile = (state) => {
    const profileState = selectProfileState(state);
    if (isValidElement(profileState) && isValidElement(profileState.profileResponse)) {
        return profileState.profileResponse;
    } else {
        return undefined;
    }
};
export const selectUserID = (state) => {
    const userProfile = selectUserProfile(state);
    if (isValidElement(userProfile) && isValidElement(userProfile.id)) {
        return userProfile.id;
    }
};

export const selectBasketID = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.createBasketResponse) && isValidElement(basketState.createBasketResponse.resource_id)) {
        return basketState.createBasketResponse.resource_id;
    } else {
        return null;
    }
};

export const getConsumerReference = (merchant_id, basketID) => {
    return 'O' + basketID + 'M' + merchant_id + 'D' + moment().format('X');
};

export const generateMetaDataForJudoPay = (
    cartID,
    userID,
    totalValue,
    host,
    takeawayName,
    merchant_id,
    email,
    phone,
    first_name,
    last_name,
    house_number,
    address_line1,
    address_line2
) => {
    let metaData = {};

    metaData['app-version'] = VersionNumber.appVersion;
    metaData['device-info'] = 'mobile-' + getModel();
    metaData.appName = Config.APP_TYPE;

    metaData.cartID = isValidElement(cartID) ? '' + cartID : '';
    metaData.order_id = isValidElement(cartID) ? '' + cartID : '';
    metaData.customer_id = isValidElement(userID) ? '' + userID : '';
    metaData.customerID = isValidElement(userID) ? '' + userID : '';
    metaData.provider = 'FH';
    metaData.MerchantReference = paymentReference();
    metaData.Amount = isValidElement(totalValue) ? totalValue : '';
    metaData.takeawayHost = isValidElement(host) ? host : '';
    metaData.host = isValidElement(host) ? host : '';
    metaData.takeawayName = isValidElement(takeawayName) ? takeawayName : '';
    metaData.name = isValidElement(takeawayName) ? takeawayName : '';
    metaData.merchantID = isValidElement(merchant_id) ? merchant_id : '';
    metaData.merchant_id = isValidElement(merchant_id) ? merchant_id : '';
    metaData.email = isValidElement(email) ? email : '';
    metaData.phoneNumber = isValidElement(phone) ? phone : '';
    metaData.firstname = isValidElement(first_name) ? first_name : '';
    metaData.lastname = isValidElement(last_name) ? last_name : '';
    metaData.flat = isValidElement(house_number) ? house_number : '';
    metaData.address1 = isValidElement(address_line1) ? address_line1 : '';
    metaData.address2 = isValidElement(address_line2) ? address_line2 : '';
    metaData.CancelUrl = '';
    metaData.WebhookUrl = getWebhookURL(isValidElement(cartID) ? cartID : '', isValidElement(totalValue) ? totalValue : '');
    metaData.RedirectUrl = '';
    metaData.customer_joining_date = '';
    return metaData;
};

export const getJudoPayLabel = (takeawayName) => {
    if (isValidString(takeawayName)) {
        return takeawayName + ' VIA ' + LOCALIZATION_STRINGS.FOODHUB;
    } else {
        return LOCALIZATION_STRINGS.PAY_FOODHUB_FALBACK;
    }
};

export const consumerReference = (state) => {
    const takeawayResponse = selectTakeawayResponse(state);
    return 'O' + selectBasketID(state) + 'M' + takeawayResponse.merchant_id.toString() + 'D' + moment().format('X');
};
export const selectedPostCode = (state) => {
    const addressState = selectAddressState(state);
    if (isValidElement(addressState) && isValidElement(addressState.selectedPostcode)) {
        return addressState.selectedPostcode;
    } else {
        return null;
    }
};

export const selectIsFromReOrderScreen = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.fromReOrderScreen)) {
        return basketState.fromReOrderScreen;
    }
    return false;
};
const getBasketProgress = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.basketIDProgress)) {
        return basketState.basketIDProgress;
    } else {
        return false;
    }
};
export const selectResetToHomeStatus = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.resetToHome)) {
        return basketState.resetToHome;
    } else {
        return false;
    }
};

export const selectBasketProgress = createSelector([getBasketProgress], (getBasketProgress) => {
    return getBasketProgress;
});

export const selectBasketViewItems = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.item) && isValidElement(basketResponse.item.length > 0)) {
        return basketResponse.item;
    }
};
export const selectCartItems = (state) => {
    const items = selectCart(state);
    if (isValidElement(items)) {
        return items;
    }
};

/**
 * If the quantity is from redux state, then display from redux state
 * If the quantity is from redux state, and if the item is BOGOH or BOGOF and if it's from Basket screen then the quantity should be always 1
 * else display from default props
 * @param quantityFromState
 * @param quantity
 * @param item
 * @param isFromBasketScreen
 * @returns {number | (function(*, *, *, *, *, *): (undefined)) | string|number|*}
 */
const getQty = (state, props) => {
    const { isFromBasketScreen, item } = props;
    let quantityFromState;
    if (!isFromBasketScreen) {
        let items = selectCartItems(state);
        if (isValidElement(items) && items.length > 0) {
            quantityFromState = items.find((data) => data.id === item.id);
        }
    }
    if (isFromBasketScreen && isValidElement(item)) {
        if (isBOGOFItem(item.offer) || isBOGOHItem(item.offer)) {
            return 1;
        } else {
            return item.quantity;
        }
    } else {
        return isValidElement(quantityFromState) ? quantityFromState.quantity : 0;
    }
};
export const selectQty = () => createSelector([getQty], (quantity) => quantity);
export const selectCartItemsQuantity = (state) => {
    const items = selectCart(state);
    if (isValidElement(items)) {
        return items.reduce((total, item) => total + item.quantity, 0);
    }
};

export const selectResourceID = (state, id) => {
    const basketState = selectBasketState(state);
    const resourceObject = basketState.resourceIDs.find((item) => item.id === id);
    if (isValidElement(resourceObject)) {
        return resourceObject.resourceID;
    }
};

export const selectLastRepeatAddOnResourceID = (state, id) => {
    const matchingResources = selectLastRepeatAddOnResourceIDs(state, id);
    if (isValidElement(matchingResources)) {
        const resourceObject = matchingResources[matchingResources.length - 1];
        return resourceObject.resourceID;
    }
};

export const selectLastRepeatAddOnResourceIDs = (state, id) => {
    const basketState = selectBasketState(state);
    return basketState.resourceIDs.filter((item) => item.id === id);
};
export const selectResourceIdFromResponse = (state, resourceID) => {
    const items = selectBasketViewItems(state);
    return items.find((element) => element.id === resourceID);
};
export const selectBOGOFResourceID = (state, item) => {
    const basketState = selectBasketState(state);
    let resourceObject;
    if (isBOGOFItem(item.offer)) {
        resourceObject = basketState.resourceIDs.find((element) => element.id === item.id && element.offer === BasketConstants.BOGOF);
    } else if (isBOGOHItem(item.offer)) {
        resourceObject = basketState.resourceIDs.find((element) => element.id === item.id && element.offer === BasketConstants.BOGOH);
    }
    if (isValidElement(resourceObject)) {
        return resourceObject.resourceID;
    }
};
export const getResourceId = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.resourceIDs)) {
        return basketState.resourceIDs;
    }
};

export const selectResourceIDsOfBasket = createSelector([getResourceId], (getResourceId) => {
    return getResourceId;
});

export const selectSequence = (state) => {
    const basketState = selectBasketState(state);
    return basketState.sequence;
};

export const selectTotal = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.total)) {
        return { ...basketResponse.total, label: LOCALIZATION_STRINGS.TOTAL };
    }
};
//TODO need to remove the selectTotal in future
export const selectTotalValue = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.total) && isValidElement(basketResponse.total.value)) {
        return basketResponse.total.value;
    } else {
        return '0.00';
    }
};

export const selectBasketSubTotal = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.sub_total) && isValidString(basketResponse.sub_total.label)) {
        return translateLabels(basketResponse.sub_total, language, LOCALIZATION_STRINGS.SUB_TOTAL);
    }
};

export const selectDeliveryCharge = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.delivery_charge)) {
        return translateLabels(basketResponse.delivery_charge, language, LOCALIZATION_STRINGS.DELIVERY_CHARGE);
    }
};

export const selectOnlineDiscount = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.online_discount)) {
        return translateLabels(basketResponse.online_discount, language, LOCALIZATION_STRINGS.ONLINE_DISCOUNT_LABEL);
    }
};
export const selectCollectionDiscount = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.collection_discount)) {
        return translateLabels(basketResponse.collection_discount, language, LOCALIZATION_STRINGS.COLLECTION_DISCOUNT_LABEL);
    }
};
export const selectServiceCharge = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.restaurant_service_charge)) {
        return translateLabels(basketResponse.restaurant_service_charge, language, LOCALIZATION_STRINGS.RESTAURANT_CHARGE_LABEL);
    }
};
export const selectVAT = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.vat)) {
        return translateLabels(basketResponse.vat, language, LOCALIZATION_STRINGS.VAT_LABEL);
    }
};

export const selectCarryBag = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.carry_bag)) {
        return translateLabels(basketResponse.carry_bag, language, LOCALIZATION_STRINGS.CARRY_BAGS_LABEL);
    }
};

export const selectRedeemAmount = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.redeem_amount)) {
        return translateLabels(basketResponse.redeem_amount, language, LOCALIZATION_STRINGS.REEDEM_AMOUNT);
    }
};

export const selectCouponSummary = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.coupon)) {
        return translateLabels(basketResponse.coupon, language, LOCALIZATION_STRINGS.COUPON_LABEL);
    }
};
export const selectAdminFee = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.admin_fee)) {
        return { ...basketResponse.admin_fee, label: LOCALIZATION_STRINGS.SERVICE_CHARGE };
    }
};

export const selectSurcharge = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.surcharge)) {
        return basketResponse.surcharge;
    }
};

export const selectLoyaltyPoints = (state) => {
    const loyaltyPointsResponse = selectLoyaltyPointsResponse(state);
    if (isValidElement(loyaltyPointsResponse) && isValidElement(loyaltyPointsResponse.loyalty_point_available)) {
        return loyaltyPointsResponse.loyalty_point_available;
    }
};

export const selectLoyaltyPointMessage = (state) => {
    const loyaltyPointsResponse = selectLoyaltyPointsResponse(state);
    if (isValidElement(loyaltyPointsResponse) && isValidElement(loyaltyPointsResponse.message)) {
        return loyaltyPointsResponse.message;
    }
};

export const selectBasketErrors = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const languageKey = selectLanguageKey(state);
    const isEnglishLanguage = selectIsEnglishLanguage(state);
    if (isArrayNonEmpty(basketResponse?.errors)) {
        if (isEnglishLanguage) {
            return basketResponse.errors.join('\n');
        } else if (isValidElement(basketResponse.validation) && basketResponse.validation.length > 0) {
            const validationErrors = basketResponse.validation.filter(
                (errors) => safeIntValue(errors.errorCode) >= 4000 && safeIntValue(errors.errorCode) < 4999
            );
            if (isValidElement(validationErrors) && validationErrors.length > 0) {
                return translateWarnErrors(validationErrors, isEnglishLanguage);
            } else {
                return convertMessageToAppLanguage(basketResponse.errors.join('\n'), languageKey);
            }
        } else {
            return convertMessageToAppLanguage(basketResponse.errors.join('\n'), languageKey);
        }
    }
};
export const selectBasketWarnings = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const languageKey = selectLanguageKey(state);
    const isEnglishLanguage = selectIsEnglishLanguage(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.warnings) && basketResponse.warnings.length > 0) {
        if (isEnglishLanguage) {
            return basketResponse.warnings.join('\n');
        } else {
            if (isValidElement(basketResponse.validation) && basketResponse.validation.length > 0) {
                const validationErrors = basketResponse.validation.filter(
                    (errors) => safeIntValue(errors.errorCode) >= 1000 && safeIntValue(errors.errorCode) < 1999
                );
                if (isValidElement(validationErrors) && validationErrors.length > 0) {
                    return translateWarnErrors(validationErrors, isEnglishLanguage);
                } else {
                    return convertMessageToAppLanguage(basketResponse.warnings.join('\n'), languageKey);
                }
            } else {
                return convertMessageToAppLanguage(basketResponse.warnings.join('\n'), languageKey);
            }
        }
    }
};

export const selectBasketItemsDuringNetworkError = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.networkErrorItems) && basketState.networkErrorItems.length > 0) {
        return basketState.networkErrorItems;
    }
};
export const selectContactFreeDelivery = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.contactFreeDelivery)) {
        return basketState.contactFreeDelivery;
    }
    return false;
};

export const selectOrderInstructions = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.orderInstructions)) {
        return basketState.orderInstructions;
    }
    return '';
};

export const selectBasketViewComments = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.comments) && isValidElement(basketResponse.length > 0)) {
        return basketResponse.comments;
    }
};

export const selectAddOnModalVisibility = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState)) {
        return repeatAddOnState.visibility;
    } else {
        return false;
    }
};

export const selectLastAddOnItemQuantity = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.quantity)) {
        return repeatAddOnState.quantity;
    }
};

export const selectLastAddOnItems = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.items)) {
        return repeatAddOnState.items;
    }
};

export const selectLastAddOnID = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.selectedID)) {
        return repeatAddOnState.selectedID;
    }
};
export const selectLastReOrderAddons = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.reOrderAddons)) {
        return repeatAddOnState.reOrderAddons;
    }
};
export const selectLastReOrderItemMenu = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.reOrderMenuItem)) {
        return repeatAddOnState.reOrderMenuItem;
    }
};
export const selectItemAddOnCatID = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.addOnCatID)) {
        return repeatAddOnState.addOnCatID;
    }
};

export const selectEditFromBasketPopUpVisibility = (state) => {
    const repeatAddOnState = selectRepeatAddon(state);
    if (isValidElement(repeatAddOnState) && isValidElement(repeatAddOnState.editFromBasketPopup)) {
        return repeatAddOnState.editFromBasketPopup;
    }
};
export const selectFreeItemAvailable = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.item) && isValidElement(basketResponse.free_gift)) {
        let basketItems = basketResponse.item.filter((item) => item.free === true);
        return basketResponse.free_gift && basketItems.length === 0;
    }
    return false;
};

export const selectPreOrderDatesForCollection = (state) => {
    const basketState = selectBasketState(state);
    if (
        isValidElement(basketState) &&
        isValidElement(basketState.preOrderDates) &&
        isValidElement(basketState.preOrderDates.collection) &&
        isValidElement(basketState.preOrderDates.collection.slot)
    ) {
        return basketState.preOrderDates.collection.slot;
    }
};

export const selectPreOrderDatesForDelivery = (state) => {
    const basketState = selectBasketState(state);
    if (
        isValidElement(basketState) &&
        isValidElement(basketState.preOrderDates) &&
        isValidElement(basketState.preOrderDates.delivery) &&
        isValidElement(basketState.preOrderDates.delivery.slot)
    ) {
        return basketState.preOrderDates.delivery.slot;
    }
};

export const selectPreOrderDate = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.isPreOrder)) {
        if (basketState.isPreOrder === CONSTANTS.IMMEDIATELY) {
            return '';
        }
        return basketState.isPreOrder;
    } else {
        return '';
    }
};

export const selectPaymentMode = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.payment_mode)) {
        return basketState.payment_mode;
    }
};

export const selectCoupon = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.couponApplied)) {
        return basketState.couponApplied;
    }
};

export const selectOfferItems = (state) => {
    const basketItemResponse = selectBasketViewItems(state);
    if (isValidElement(basketItemResponse)) {
        return basketItemResponse.find((item) => isBOGOFItem(item.offer) || isBOGOHItem(item.offer));
    }
};
export const selectStoreIDFromCartItems = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.storeID)) {
        return basketState.storeID;
    }
};

export const getPaymentModeForBasket = (state) => {
    const payment_mode = selectPaymentMode(state);
    if (isValidElement(payment_mode)) {
        if (payment_mode === PAYMENT_TYPE.CASH) return PAYMENT_TYPE.CASH;
        if (payment_mode === PAYMENT_TYPE.APPLE_PAY || payment_mode === PAYMENT_TYPE.GOOGLE_PAY) return PAYMENT_TYPE.CARD;
        if (payment_mode === PAYMENT_TYPE.WALLET) return PAYMENT_TYPE.WALLET;
        return PAYMENT_TYPE.CARD;
    }
    return PAYMENT_TYPE.CARD;
};

export const applePayMetaData = (state, serviceCharge = null) => {
    const takeawayResponse = selectTakeawayResponse(state);
    let metaData = {};
    const cartID = selectBasketID(state);
    const userID = selectUserID(state);
    const profileInformation = selectUserProfile(state);
    const totalValue = selectTotalValue(state);
    const deliveryAddress = selectDeliveryAddress(state);
    metaData['app-version'] = VersionNumber.appVersion;
    metaData['device-info'] = 'mobile-' + getModel();
    metaData.appName = Config.APP_TYPE;

    metaData.cartID = isValidElement(cartID) ? '' + cartID : '';
    metaData.order_id = isValidElement(cartID) ? '' + cartID : '';
    metaData.customer_id = isValidElement(userID) ? '' + userID : '';
    metaData.customerID = isValidElement(userID) ? '' + userID : '';
    metaData.provider = 'FH';
    metaData.MerchantReference = paymentReference();
    metaData.Amount = isValidElement(totalValue) ? totalValue : '';
    if (isValidElement(takeawayResponse)) {
        metaData.takeawayHost = isValidElement(takeawayResponse.host) ? takeawayResponse.host : '';
        metaData.host = isValidElement(takeawayResponse.host) ? takeawayResponse.host : '';
        metaData.takeawayName = isValidElement(takeawayResponse.name) ? takeawayResponse.name : '';
        metaData.name = isValidElement(takeawayResponse.name) ? takeawayResponse.name : '';
        metaData.merchantID = isValidElement(takeawayResponse.merchant_id) ? takeawayResponse.merchant_id : '';
        metaData.merchant_id = isValidElement(takeawayResponse.merchant_id) ? takeawayResponse.merchant_id : '';
    }
    if (isValidElement(profileInformation)) {
        metaData.email = isValidElement(profileInformation.email) ? profileInformation.email : '';
        metaData.phoneNumber = isValidElement(profileInformation.phone) ? profileInformation.phone : '';
        metaData.firstname = isValidElement(profileInformation.first_name) ? profileInformation.first_name : '';
        metaData.lastname = isValidElement(profileInformation.last_name) ? profileInformation.last_name : '';
    }
    if (isValidElement(deliveryAddress)) {
        metaData.flat = isValidElement(deliveryAddress.house_number) ? deliveryAddress.house_number : '';
        metaData.address1 = isValidElement(deliveryAddress.address_line1) ? deliveryAddress.address_line1 : '';
        metaData.address2 = isValidElement(deliveryAddress.address_line2) ? deliveryAddress.address_line2 : '';
    }
    metaData.CancelUrl = '';
    metaData.WebhookUrl = getWebhookURL(isValidElement(cartID) ? cartID : '', isValidElement(totalValue) ? totalValue : '');
    metaData.RedirectUrl = '';
    metaData.customer_joining_date = '';
    if (isValidElement(serviceCharge)) metaData.SplitFee = serviceCharge;
    return metaData;
};
export const applePayLabel = (state) => {
    const takeawayResponse = selectTakeawayResponse(state);
    if (isValidElement(takeawayResponse) && isValidString(takeawayResponse.name)) {
        return takeawayResponse.name.toString() + ' VIA ' + LOCALIZATION_STRINGS.FOODHUB;
    } else {
        return LOCALIZATION_STRINGS.PAY_FOODHUB_FALBACK;
    }
};
export const getPaymentModeForBasketLookup = (state) => {
    const storeResponse = selectStoreConfigResponse(state);
    if (!isCardPaymentEnabled(storeResponse?.card_payment)) {
        const walletBalance = selectWalletBalance(state);
        if (!isValidElement(walletBalance) || safeFloatRoundedValue(walletBalance) === 0.0) {
            return PAYMENT_TYPE.CASH;
        }
    }
};

export const selectCardAmount = (state) => {
    const totalAmount = selectTotalValue(state);
    const walletBalance = selectWalletBalance(state);

    return (safeFloatRoundedValue(totalAmount) - safeFloatRoundedValue(walletBalance)) / 10000;
};

export const selectCanClaimOffer = (state) => {
    const basketItems = selectBasketViewItems(state);
    if (isValidElement(basketItems) && basketItems.length > 0) {
        let bogofItemLength = basketItems.filter((data) => isBOGOFItem(data.offer)).length;
        let bogohItemLength = basketItems.filter((data) => isBOGOHItem(data.offer)).length;
        let bogofClaimOffer = false;
        let bogohClaimOffer = false;

        if (bogofItemLength > 0) {
            bogofClaimOffer = bogofItemLength % 2 !== 0;
        }
        if (bogohItemLength > 0) {
            bogohClaimOffer = bogohItemLength % 2 !== 0;
        }
        return bogofClaimOffer || bogohClaimOffer;
    }
    return false;
};
export const selectBanCustomer = (state) => {
    if (isValidElement(state.walletState)) {
        return state.walletState.bannedCustomer;
    }
    return false;
};

const getBasketLoader = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState.basketLoader)) {
        return basketState.basketLoader;
    } else {
        return false;
    }
};
export const selectBasketLoader = createSelector(getBasketLoader, (isLoading) => isLoading);
export const selectPaymentErrorMessage = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.paymentErrorMessage)) {
        return basketState.paymentErrorMessage;
    }
    return null;
};
export const selectIsCartFetching = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState)) {
        return basketState.isCartFetching;
    }
};
const getIsBasketItemsLoading = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState)) {
        return basketState.isBasketLoading;
    }
    return false;
};

export const selectIsBasketLoading = createSelector(getIsBasketItemsLoading, (isLoading) => isLoading);
export const hasMissingItemsOnOrderChange = (state) => {
    const response = selectNewBasketResponse(state);
    if (
        isValidElement(response) &&
        isValidElement(response.added_items) &&
        isValidElement(response.missing_items) &&
        Array.isArray(response.missing_items) &&
        Array.isArray(response.added_items)
    ) {
        return response.added_items.length > 0 && response.missing_items.length > 0;
    }
    return false;
};
export const noItemsOnOrderChange = (state) => {
    const response = selectNewBasketResponse(state);
    if (isValidElement(response) && isValidElement(response.added_items) && Array.isArray(response.added_items)) {
        return response.added_items.length === 0;
    }
    return false;
};

export const selectItemMissingModal = createSelector([hasMissingItemsOnOrderChange, noItemsOnOrderChange], (someItems, allItems) => {
    if (someItems) {
        return ORDER_TYPE_MODAL.SOME_ITEMS_MISSING;
    } else if (allItems) {
        return ORDER_TYPE_MODAL.ALL_ITEMS_MISSING;
    }
});

export const newBasketID = (state) => {
    const response = selectNewBasketResponse(state);
    if (isValidElement(response) && isValidElement(response.resource_id)) {
        return response.resource_id;
    }
};

export const selectNewBasketResponse = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.changeOrderResponse)) {
        return basketState.changeOrderResponse;
    }
};

export const selectIsBasketRecommendationEnabled = (state) => {
    const storeState = selectStoreConfigResponse(state);
    if (isValidElement(storeState) && isValidElement(storeState.basket_recommendation)) {
        return storeState.basket_recommendation === 'ENABLED';
    }
    return false;
};

export const selectBasketRecommendation = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.basketRecommendations) && basketState.basketRecommendations.length > 0) {
        return basketState.basketRecommendations;
    }
    return [];
};

export const selectBasketRecommendationLoader = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.basketRecommendationLoader)) {
        return basketState.basketRecommendationLoader;
    }
    return false;
};

export const selectRecommendationSelectedFromBasket = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.recommendationAddedFromBasket)) {
        return basketState.recommendationAddedFromBasket;
    }
    return false;
};

export const selectBasketRecommendationType = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.basketRecommendationType)) {
        return basketState.basketRecommendationType;
    }
};

export const selectComment = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.comments)) {
        return basketResponse.comments;
    }
    return '';
};

export const selectCouponCode = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    if (isValidElement(basketResponse) && isValidElement(basketResponse.coupon_code)) {
        return basketResponse.coupon_code;
    }
    return '';
};

export const selectBasketRecommendationRefId = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState)) {
        return basketState.recommendation_ref_id;
    }
    return null;
};

export const selectPreOrderASAPForAPI = (state) => {
    const basketState = selectBasketState(state);
    if (isValidElement(basketState) && isValidElement(basketState.isPreOrderASAP)) {
        return basketState.isPreOrderASAP;
    }
    return false;
};
export const selectDriverTipValue = (state) => {
    const basketResponse = selectBasketViewResponse(state);
    const language = getLanguageCode(state);
    if (isValidString(basketResponse?.driver_tip?.label)) {
        return translateLabels(basketResponse.driver_tip, language, LOCALIZATION_STRINGS.TIP);
    }
};

export const selectGlobalTipsStatusDisabled = (state, orderType) => {
    let globalTipsEnable = state.appState.s3ConfigResponse?.global_tip;
    let globalTip = state.appState.storeConfigResponse?.global_tip;
    let countryBaseFeatureGateResponse = state.appState.countryBaseFeatureGateResponse;
    let driverTipsList = state.appState.s3ConfigResponse?.driver_tip;
    let payment_mode = state.basketState.payment_mode;
    if (
        tipsEnableCountry(globalTipsEnable) &&
        isGlobalTipEnable(countryBaseFeatureGateResponse) &&
        isArrayNonEmpty(driverTipsList) &&
        payment_mode !== PAYMENT_TYPE.CASH &&
        !showTipsUI(globalTip, orderType)
    ) {
        return true;
    }
};
