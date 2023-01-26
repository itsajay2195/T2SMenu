import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import {
    boolValue,
    ConTwoDecDigit,
    getDeviceInfo,
    isArrayNonEmpty,
    isCustomerApp,
    isFoodHubApp,
    isValidDateString,
    isValidElement,
    isValidString,
    removeAlphabets,
    safeFloatRoundedValue,
    safeFloatValue,
    safeFloatValueWithoutDecimal,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { BASKET_ERROR_MESSAGE, BASKET_UPDATE_TYPE, BasketConstants, TIME_SLOT } from './BasketConstants';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import _, { differenceBy, groupBy, replace } from 'lodash';
import { ORDER_TYPE, REPLACE_TEXT } from '../../BaseModule/BaseConstants';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import moment from 'moment-timezone';
import { DEFAULT_FLOAT_VALUE } from '../../../CustomerApp/Utils/AppContants';
import { CONSTANTS, PAYMENT_TYPE } from '../../QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { isApplePayEnabled, isCardPaymentEnabled } from '../../QuickCheckoutModule/Utils/Helper';
import { getSavedCardStatus, getWalletStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { APIErrorMessages } from '../../LocalizationModule/Utils/APIErrorMessages';
import * as Segment from '../../AnalyticsModule/Segment';
import { GRAPH_QL_QUERY } from '../../BaseModule/GlobalAppConstants';
import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { Constants } from 't2sbasemodule/Utils/Constants';
import { isNashTakeaway } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import {
    extractTimeLogicForNextOpening,
    isCollectionAvailable,
    isDeliveryAvailable
} from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { WEEKDAYS_NAME_SHORT_ARRAY } from '../../HomeModule/Utils/HomeConstants';

export const handleItemsInTheCart = (cartItemsArray, cartItem, resourceIDs) => {
    let existingCartItem;
    if (isValidElement(cartItemsArray) && isValidElement(cartItem) && isValidElement(cartItem.item)) {
        if (isValidElement(cartItem.item.bogoFree) && cartItem.item.bogoFree) {
            existingCartItem = cartItemsArray.find((item) => item.id === cartItem.item.item_id);
        } else {
            existingCartItem = cartItemsArray.find((item) => item.id === cartItem.id);
        }
    } else {
        cartItemsArray = [];
    }
    if (isValidElement(cartItem) && cartItem.quantityType === ADD_BUTTON_CONSTANT.ADD) {
        //cart add

        if (existingCartItem) {
            return cartItemsArray.map((item) => (item.id === cartItem.id ? { ...cartItem, quantity: item.quantity + 1 } : item));
        }
        return [...cartItemsArray, { ...cartItem, quantity: 1 }];
    } else if (isValidElement(cartItem) && cartItem.quantityType === ADD_BUTTON_CONSTANT.MINUS) {
        //cart remove
        if (isValidElement(existingCartItem) && isValidElement(existingCartItem.quantity) && existingCartItem.quantity === 1) {
            if (isValidElement(cartItem.item.bogoFree) && cartItem.item.bogoFree) {
                return cartItemsArray.filter((item) => item.id !== cartItem.item.item_id);
            } else {
                // Don't remove item if there is only one quantity. It will removed once there is a valid resource id.
                return cartItemsArray.filter((item) => item.id !== cartItem.id && isResourceIDMatch(cartItem, resourceIDs));
            }
        }
        if (isValidElement(cartItem.item.bogoFree) && cartItem.item.bogoFree) {
            return cartItemsArray.map((item) => (item.id === cartItem.item.item_id ? { ...item, quantity: item.quantity - 1 } : item));
        } else {
            return cartItemsArray.map((item) => (item.id === cartItem.id ? { ...item, quantity: item.quantity - 1 } : item));
        }
    } else {
        return cartItemsArray;
    }
};

export const isResourceIDMatch = (cartItem, resourceIDs) => {
    if (isValidElement(resourceIDs) && resourceIDs.length > 0 && cartItem.fromBasket) {
        let matchedResourceID = resourceIDs.filter((item) => item.resourceID === cartItem.item.id);
        return matchedResourceID.length > 0;
    } else {
        return true;
    }
};

export const handleItemsFromReorder = (data, reOderAddonResponse) => {
    if (!Array.isArray(data) || !isValidElement(reOderAddonResponse)) {
        return null;
    }

    const groupedData = groupBy(data, 'item_id');
    let cartItems = [];
    /* eslint-disable-next-line */
    for (let key in groupedData) {
        const item = groupedData[key];
        if (item.length === 1) {
            cartItems.push(item[0]);
        } else {
            const sum = item.reduce((total, item) => total + item.quantity, 0);
            cartItems.push({ ...item[0], quantity: sum });
        }
    }
    const cart = cartItems.map((element) => {
        return { id: element.item_id, quantity: element.quantity, item: element };
    });

    const resourceIDs = data.map((element) => {
        return {
            resourceID: element.id,
            id: element.item_id,
            offer: element.offer,
            addOns: element.addons.length > 0 ? formAddOnItemForReorder(element.addons, reOderAddonResponse) : [],
            item: element
        };
    });
    const addOnItems = cartItems.map((element) => {
        return {
            item: { id: element.item_id },
            addOns: element.addons.length > 0 ? formAddOnItemForReorder(element.addons, reOderAddonResponse) : []
        };
    });
    const sequence = Math.max(...data.map((o) => o.sequence), 0);
    return { cart, resourceIDs, sequence, addOnItems };
};
const formAddOnItemForReorder = (addOns, reOderAddonResponse) => {
    return addOns.map((element) => {
        return {
            id: element.item_addon_id,
            name: element.name,
            price: element.price,
            second_language_name: element.second_language_name,
            modifier: getModifier(reOderAddonResponse, element.item_addon_id)
        };
    });
};
const getModifier = (reOderAddonResponse, id) => {
    const addons = reOderAddonResponse.find((item) => item.item_addon_id === id);
    if (isValidElement(addons)) {
        return addons.modifier;
    }
    return 'NONE';
};

export const isBOGOFItem = (offer) => {
    return offer?.toUpperCase() === BasketConstants.BOGOF;
};
export const isBOGOHItem = (offer) => {
    return offer?.toUpperCase() === BasketConstants.BOGOH;
};

export const getOfferText = (offer) => {
    if (isBOGOFItem(offer)) {
        return LOCALIZATION_STRINGS.BOGOF;
    } else if (isBOGOHItem(offer)) {
        return LOCALIZATION_STRINGS.BOGOH;
    }
    return null;
};

export const isNoOfferItem = (offer) => {
    return offer?.toUpperCase() === BasketConstants.NONE;
};

export const removeResourceID = (resourceIDs, action) => {
    if (!isValidElement(resourceIDs) || !isValidElement(action)) {
        return null;
    }
    if (isValidElement(action.payload.resourceID)) {
        return resourceIDs.filter((item) => item.resourceID !== action.payload.resourceID);
    } else {
        return resourceIDs.filter((item) => item.id !== action.payload.id);
    }
};
export const getPriceSummary = (props) => {
    const {
        subTotal,
        serviceCharge,
        vat,
        adminFee,
        onlineDiscount,
        collectionDiscount,
        couponSummary,
        carryBag,
        redeemAmount,
        deliveryCharge,
        surcharge,
        driverTips
    } = props;
    let array = [];
    if (isValidElement(subTotal)) {
        array.push(subTotal);
    }
    if (isValidElement(vat) && isValidElement(vat.value) && safeFloatValueWithoutDecimal(vat.value) > DEFAULT_FLOAT_VALUE) {
        array.push(vat);
    }
    if (
        isValidElement(deliveryCharge) &&
        isValidElement(deliveryCharge.value) &&
        safeFloatValueWithoutDecimal(deliveryCharge.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push(deliveryCharge);
    }
    if (isValidElement(carryBag) && isValidElement(carryBag.value) && safeFloatValueWithoutDecimal(carryBag.value) > DEFAULT_FLOAT_VALUE) {
        array.push(carryBag);
    }
    if (
        isValidElement(serviceCharge) &&
        isValidElement(serviceCharge.value) &&
        safeFloatValueWithoutDecimal(serviceCharge.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push(serviceCharge);
    }
    if (isValidElement(adminFee) && isValidElement(adminFee.value) && safeFloatValueWithoutDecimal(adminFee.value) > DEFAULT_FLOAT_VALUE) {
        array.push(adminFee);
    }

    if (
        isValidElement(surcharge) &&
        isValidElement(surcharge.value) &&
        safeFloatValueWithoutDecimal(surcharge.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push(surcharge);
    }

    if (
        isValidElement(onlineDiscount) &&
        isValidElement(onlineDiscount.value) &&
        safeFloatValueWithoutDecimal(onlineDiscount.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push({ ...onlineDiscount, type: BasketConstants.DISCOUNT });
    }
    if (
        isValidElement(collectionDiscount) &&
        isValidElement(collectionDiscount.value) &&
        safeFloatValueWithoutDecimal(collectionDiscount.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push({ ...collectionDiscount, type: BasketConstants.DISCOUNT });
    }
    if (
        isValidElement(couponSummary) &&
        isValidElement(couponSummary.value) &&
        safeFloatValueWithoutDecimal(couponSummary.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push({ ...couponSummary, type: BasketConstants.DISCOUNT });
    }
    if (
        isValidElement(redeemAmount) &&
        isValidElement(redeemAmount.value) &&
        safeFloatValueWithoutDecimal(redeemAmount.value) > DEFAULT_FLOAT_VALUE
    ) {
        array.push({ ...redeemAmount, type: BasketConstants.DISCOUNT });
    }
    if (safeFloatValueWithoutDecimal(driverTips?.value) > DEFAULT_FLOAT_VALUE) {
        array.push(driverTips);
    }
    return array;
};

export const formAPIData = (data) => {
    const { action, object, getBasket, isPblOrder } = data;
    let apiData = {
        ...getBasket
    };
    // Appending `customers_id` to update cart
    if (isValidElement(object.userID)) apiData.customers_id = object.userID;
    if (
        action.updateType === BASKET_UPDATE_TYPE.VIEW ||
        action.updateType === BASKET_UPDATE_TYPE.SWIPE_CHECKOUT ||
        action.updateType === BASKET_UPDATE_TYPE.NEW_BASKET
    ) {
        apiData = {
            ...apiData,
            email: object.profileResponse.email,
            device: isValidElement(object.deviceName) ? object.deviceName.slice(0, 40) : 'unknown',
            firstname: object.profileResponse.first_name,
            lastname: object.profileResponse.last_name,
            os: Platform.OS,
            browser: DeviceInfo.getVersion(),
            pre_order_time: isValidString(object.preOrderDate) ? moment(object.preOrderDate).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS) : null,
            preorder_time: object.preOrderASAP ? 'ASAP' : null,
            phone: isValidElement(object?.profileResponse?.phone) ? object.profileResponse.phone : undefined,
            check_validation: true,
            notify_token: isValidElement(object.pushNotificationToken) ? object.pushNotificationToken : undefined,
            contactless: getContactLessValue(object),
            driver_tip: object?.paymentMode !== PAYMENT_TYPE.CASH && isValidString(object.driver_tip) ? object.driver_tip : undefined
        };
        if (isValidElement(object.orderType)) {
            let orderType = object.orderType;
            if (!isPblOrder) {
                if (orderType === ORDER_TYPE.COLLECTION) {
                    apiData = {
                        ...apiData,
                        sending: 'collection'
                    };
                } else if (orderType === ORDER_TYPE.DELIVERY) {
                    if (isValidElement(object?.deliveryAddress)) {
                        const deliveryAddress = object.deliveryAddress;
                        const { house_number, flat, address_line1, address_line2, postcode, area, latitude, longitude } = deliveryAddress;
                        apiData = {
                            ...apiData,
                            sending: 'to',
                            houseno: isValidString(house_number) ? house_number : undefined,
                            flat: isValidString(flat) ? flat : undefined,
                            address1: isValidString(address_line1) ? address_line1 : undefined,
                            address2: isValidString(address_line2) ? address_line2 : undefined,
                            postcode: isValidString(postcode) ? postcode : undefined,
                            area: isValidString(area) ? area : undefined,
                            latitude: isValidString(latitude) ? latitude : undefined,
                            longitude: isValidString(longitude) ? longitude : undefined,
                            comments: isValidString(object?.orderComments) ? object.orderComments : undefined
                        };
                    } else if (isValidElement(object?.postCode)) {
                        apiData = {
                            ...apiData,
                            sending: 'to',
                            postcode: object.postCode,
                            comments: isValidString(object.orderComments) ? object.orderComments : undefined
                        };
                    }
                } else if (orderType === ORDER_TYPE.WAITING) {
                    apiData = {
                        ...apiData,
                        sending: 'waiting'
                    };
                }
            }
        }
    } else if (action.updateType === BASKET_UPDATE_TYPE.COUPON) {
        apiData = {
            ...apiData,
            coupon_code: action.coupon,
            platform: BasketConstants.COUPON_PLATFORM
        };
    } else if (action.updateType === BASKET_UPDATE_TYPE.ALLERGY_INFO) {
        apiData = {
            ...apiData,
            comments: action.allergyInfo
        };
    }
    if (action.updateType === BASKET_UPDATE_TYPE.NEW_BASKET) {
        if (isValidString(action.coupon)) {
            apiData = {
                ...apiData,
                coupon_code: action.coupon
            };
        }
        if (isValidString(action.allergyInfo)) {
            apiData = {
                ...apiData,
                comments: action.allergyInfo
            };
        }
    }
    return apiData;
};

export const manipulateBasketResponse = (response) => {
    if (response?.basket?.item?.length > 0) {
        const { basket } = response;
        basket.item = basket.item.map((data) => {
            return {
                ...data,
                totalPrice: (data.quantity * safeFloatValue(data.price)).toFixed(2)
            };
        });
        return basket;
    }
};

export const handleNetworkErrorItems = (array, cartItem) => {
    let existingCartItem;
    existingCartItem = array.find((element) => element.id === cartItem.id);
    if (isNoOfferItem(cartItem.action.item.offer)) {
        if (existingCartItem) {
            return array.map((element) =>
                element.id === cartItem.id
                    ? {
                          ...cartItem,
                          action: {
                              ...cartItem.action,
                              quantity: cartItem.action.quantity
                          }
                      }
                    : element
            );
        }
    }
    return [...array, { ...cartItem }];
};

export const handleSwipeToDeleteItem = (array, payloadData) => {
    if (isValidElement(payloadData) && isValidElement(payloadData.offer) && isNoOfferItem(payloadData.offer)) {
        if (isValidElement(payloadData.addons) && payloadData.addons.length > 0) {
            return array.map((item) =>
                item.id === payloadData.item_id ? { ...item, quantity: item.quantity - payloadData.quantity } : item
            );
        } else {
            return array.filter((item) => item.id !== payloadData.item_id);
        }
    } else {
        return array.map((item) => (item.id === payloadData.item_id ? { ...item, quantity: item.quantity - 1 } : item));
    }
};

export const getDefaultPaymentMode = (action) => {
    const {
        storeResponse,
        walletBalance,
        totalAmount,
        userPaymentMode,
        countryBaseFeatureGateResponse,
        savedCardDetails,
        selectedOrderType
    } = action;
    const walletAmount = safeFloatRoundedValue(walletBalance);
    const basketAmount = safeFloatRoundedValue(totalAmount);
    let savedCardAction = { storeConfigCardPayment: storeResponse?.card_payment, savedCardDetails, selectedOrderType };
    if (isValidElement(userPaymentMode) && userPaymentMode !== PAYMENT_TYPE.WALLET && userPaymentMode !== PAYMENT_TYPE.PARTIAL_PAYMENT) {
        return userPaymentMode;
    } else if (isWalletPaymentAvailable(action) && walletAmount < basketAmount && isSavedCardAvailable(savedCardAction)) {
        return PAYMENT_TYPE.PARTIAL_PAYMENT;
    } else if (isWalletPaymentAvailable(action) && walletAmount >= basketAmount) {
        return PAYMENT_TYPE.WALLET;
    } else if (getSavedCardStatus(countryBaseFeatureGateResponse) && isSavedCardAvailable(savedCardAction)) {
        return PAYMENT_TYPE.CARD_FROM_LIST;
    } else if (isCardPaymentEnabled(storeResponse?.card_payment)) {
        return PAYMENT_TYPE.CARD;
    } else if (isApplePayEnabled(storeResponse?.setting?.apple_pay, storeResponse?.apple_pay, countryBaseFeatureGateResponse)) {
        return PAYMENT_TYPE.APPLE_PAY;
    } else {
        return PAYMENT_TYPE.CASH;
    }
};

export const handleAddOnItem = (array, payload) => {
    let existingAddOnItem = array.find((element) => element.item.id === payload.item.id);
    if (isValidElement(existingAddOnItem)) {
        return array.map((element) => (element.item.id === payload.item.id ? { ...payload, addOns: payload.addOns } : element));
    }
    return [...array, payload];
};
export const filterFreeItem = (host, menuResponse) => {
    let freeItemList = [];
    if (isValidElement(host) && isValidElement(menuResponse)) {
        menuResponse.map((catItem) => {
            if (catItem.host === host && catItem.name.toLowerCase() === 'free') {
                catItem.subcat.map((subCat) => {
                    freeItemList = [...freeItemList, ...subCat.item];
                });
            }
        });
    }
    return freeItemList;
};

export const getDataForRepeatAddOn = (resIDs, ID) => {
    let data = resIDs.filter((element) => element.id === ID);
    if (data.length > 0) {
        data = data[data.length - 1];
    } else {
        data = data[0];
    }
    return isValidElement(data) ? data : null;
};

export const containsItemWithCouponNotApplied = (cartItems) => {
    if (isValidElement(cartItems) && cartItems.length > 0) {
        return isValidElement(cartItems.find((item) => !boolValue(item.coupon_allowed)));
    }
    return false;
};
export const extractPreOrderInfofromStoreResponse = (storeResponse) => {
    if (isValidElement(storeResponse?.preorder_hours)) {
        return storeResponse.preorder_hours;
    }
    return null;
};

export const isWalletPaymentApplicableForBasket = (basketData) => {
    // if universal_coupon is true wallet is not available, if server return universal_coupon_wallet as true ignore the previous condition
    return !(
        isValidElement(basketData) &&
        !(isValidElement(basketData.universal_coupon_wallet) && boolValue(basketData.universal_coupon_wallet)) &&
        isValidElement(basketData.universal_coupon) &&
        boolValue(basketData.universal_coupon)
    );
};

export const isWalletPaymentAvailable = (action) => {
    const { walletBalance, totalAmount, countryBaseFeatureGateResponse, basketData } = action;
    return (
        isFoodHubApp() &&
        getWalletStatus(countryBaseFeatureGateResponse) &&
        isValidElement(walletBalance) &&
        isValidElement(totalAmount) &&
        safeFloatRoundedValue(totalAmount) > 0 &&
        walletBalance !== '0.00' &&
        isWalletPaymentApplicableForBasket(basketData)
    );
};

export const isSavedCardAvailable = (action) => {
    const { storeConfigCardPayment, savedCardDetails, selectedOrderType } = action;
    return (
        isCardPaymentEnabled(storeConfigCardPayment) &&
        isValidElement(savedCardDetails) &&
        savedCardDetails.length > 0 &&
        isValidElement(selectedOrderType) &&
        selectedOrderType === ORDER_TYPE.DELIVERY
    );
};
const getContactLessValue = (object) => {
    const { contactFreeDelivery, orderType, paymentMode } = object;
    if (isValidElement(orderType) && isValidElement(contactFreeDelivery)) {
        if (orderType === ORDER_TYPE.DELIVERY && paymentMode !== PAYMENT_TYPE.CASH) {
            return contactFreeDelivery ? '1' : '0';
        }
        return '0';
    }
    return '0';
};

export const formatReceiptDetails = (originalMessage, object) => {
    const { message_value, placeholder, errorValue } = object;
    let stringOutput = originalMessage;
    if (isValidElement(message_value)) {
        stringOutput = replace(stringOutput, '<message_value>', message_value);
    }
    if (isValidElement(errorValue)) {
        stringOutput = replace(stringOutput, '<errorValue>', errorValue);
    }
    if (isValidElement(placeholder)) {
        stringOutput = replace(stringOutput, '<placeholder>', placeholder);
    }
    if (isValidElement(stringOutput)) {
        stringOutput = replace(stringOutput, REPLACE_TEXT.DISCOUNT, getReplaceTextForOtherLanguages(REPLACE_TEXT.DISCOUNT));
    }
    if (isValidElement(stringOutput)) {
        stringOutput = replace(stringOutput, REPLACE_TEXT.SALES_TAX, getReplaceTextForOtherLanguages(REPLACE_TEXT.SALES_TAX));
    }

    return stringOutput;
};

export const formatOtherLanguagesReceiptDetails = (originalMessage, object, language) => {
    const { message_value, placeholder, errorValue } = object;
    let stringOutput = originalMessage;
    if (isValidElement(message_value)) {
        stringOutput = replace(stringOutput, '<message_value>', message_value);
    }
    if (isValidElement(errorValue)) {
        stringOutput = replace(stringOutput, '<errorValue>', errorValue);
    }
    if (isValidElement(placeholder)) {
        stringOutput = replace(stringOutput, '<placeholder>', placeholder);
    }
    if (isValidElement(stringOutput)) {
        stringOutput = replace(stringOutput, REPLACE_TEXT.DISCOUNT, getReplaceTextForOtherLanguages(REPLACE_TEXT.DISCOUNT));
    }
    if (isValidElement(stringOutput)) {
        stringOutput = replace(stringOutput, REPLACE_TEXT.SALES_TAX, getReplaceTextForOtherLanguages(REPLACE_TEXT.SALES_TAX));
    }

    return stringOutput;
};

export const getReplaceTextForOtherLanguages = (stringOutput) => {
    switch (stringOutput) {
        case REPLACE_TEXT.DISCOUNT:
            return LOCALIZATION_STRINGS.DISCOUNT;
        case REPLACE_TEXT.SALES_TAX:
            return LOCALIZATION_STRINGS.SALES_TAX;
        default:
            return '';
    }
};

export const translateLabels = (dataObject, selectedLanguage, message) => {
    if (isValidString(selectedLanguage) && !selectedLanguage.includes('en')) {
        if (isValidElement(dataObject) && isValidString(dataObject.message)) {
            let output = formatOtherLanguagesReceiptDetails(message, dataObject, selectedLanguage);
            if (isValidElement(output)) {
                return { ...dataObject, label: output };
            }
        } else {
            return { ...dataObject, label: message };
        }
    } else {
        return dataObject;
    }
    return dataObject;
};

export const translateWarnErrors = (validationErrors, isEnglishLanguage) => {
    let output = '';
    if (!isEnglishLanguage && isValidElement(validationErrors) && validationErrors.length > 0) {
        validationErrors.map((items) => {
            if (isValidElement(items) && isValidElement(items.errorCode)) {
                let message = _.find(APIErrorMessages(), function(obj) {
                    if (isValidElement(obj) && isValidElement(obj.errorCode)) {
                        return safeIntValue(obj.errorCode) === safeIntValue(items.errorCode);
                    }
                });
                if (isValidElement(message) && isValidElement(message.value_es)) {
                    output += formatReceiptDetails(message.value_es, items);
                }
            }
        });
    }
    return output;
};

/**
 * returns top two basket recommendation items
 * @param array
 * @returns {*}
 */
export const getTopTwoRecommendations = (array) => {
    if (isValidElement(array) && Array.isArray(array)) {
        return array.filter((item, index) => index === 0 || index === 1);
    } else {
        return [];
    }
};
/**
 * Mapping the top 2 basket recommendations with menu items and
 * returns the matching items with all menu property
 * @param recommendations
 * @param menus
 * @returns {*}
 */
export const formBasketRecommendation = (recommendations, menus) => {
    if (isValidElement(menus) && isValidElement(recommendations)) {
        const data = recommendations.map((item) => {
            let matchingMenu = menus.find((element) => element.id === item.recommendation);
            if (isValidElement(matchingMenu)) {
                return {
                    ...item,
                    recommendation: { ...matchingMenu, recommendedItem: true }
                };
            } else {
                //invalid recommended item. Because it does not comes under filtered menu
                return undefined;
            }
        });
        return data.filter((item) => item).map((element) => element.recommendation); // removes undefined & returns only the recommendation as an array
    }
    return null;
};

export const handleBestSellingAsRecommendations = (bestSelling, cartItems) => {
    if (isValidElement(bestSelling) && isValidElement(cartItems)) {
        let result = differenceBy(bestSelling, cartItems, 'id');
        result = result.map((element) => {
            return { ...element, recommendedItem: true };
        });
        return getTopTwoRecommendations(result);
    } else {
        return [];
    }
};

export const isThirdPartyDriverEnabled = (selectedOrderType, assignDriverThrough) => {
    return selectedOrderType === ORDER_TYPE.DELIVERY && isThirdPartyDriverAvailable(assignDriverThrough);
};

export const isThirdPartyDriverAvailable = (assignDriverThrough) => {
    return (
        isValidElement(assignDriverThrough) && (isNashTakeaway(assignDriverThrough) || assignDriverThrough === CONSTANTS.FALCON_DELIVERY)
    );
};

/**
 * used to log coupon events in analytics platform
 * @param featureGateResponse
 * @param event
 * @param couponObj
 */
export const logCouponStatus = (featureGateResponse, event, couponObj) => {
    const { coupon, storeId, coupon_value, coupon_label } = couponObj ?? {};
    let obj = {
        store_id: storeId
    };
    if (isValidString(coupon)) obj.coupon_code = coupon;
    if (isValidString(coupon_value)) obj.coupon_value = coupon_value;
    let couponType = getCouponType(coupon_label);
    if (isValidString(couponType)) obj.discount_type = couponType;

    Segment.trackEvent(featureGateResponse, event, obj);
};

export const isAdvancedDiscount = (storeConfigDiscountType) => {
    return isValidElement(storeConfigDiscountType) && storeConfigDiscountType === CONSTANTS.ADVANCED;
};

export const isOnlineDiscountApplied = (basketResponse) => {
    return isValidElement(basketResponse) && isValidElement(basketResponse.online_discount);
};

export const isNotSameStore = (basketStoreID, storeConfigId) => {
    return isValidElement(basketStoreID) && basketStoreID !== storeConfigId;
};

export const isSameStore = (basketStoreID, storeConfigId) => {
    return isValidElement(basketStoreID) && basketStoreID === storeConfigId;
};

export const formatTipValue = (value) => {
    if (isValidString(value)) {
        let newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        let formatedValue = ConTwoDecDigit(newValue);
        if (formatedValue?.indexOf('.') === 0) {
            return 0 + formatedValue;
        } else return formatedValue;
    }
    return '';
};

export const getGraphQlQuery = (type, errorObject, errorCode, errorSource = 'APP') => {
    return {
        query: GRAPH_QL_QUERY,
        variables: {
            input: {
                actionType: type,
                customerId: errorObject?.customerId,
                deviceInfo: JSON.stringify(getDeviceInfo()),
                errorCode: errorCode,
                errorObject: `${JSON.stringify(errorObject)}`,
                errorSource: errorSource,
                product: BASE_API_CONFIG.applicationName,
                token: ''
            }
        }
    };
};

export const showTipsUI = (globalTips, orderType) => {
    if (isValidElement(globalTips?.restaurant_tip) && globalTips?.restaurant_tip && orderType === ORDER_TYPE.COLLECTION) {
        return true;
    } else return isValidElement(globalTips?.driver_tip) && globalTips.driver_tip && orderType === ORDER_TYPE.DELIVERY;
};

export const tipsEnableCountry = (globalTipsEnable) => {
    return isValidElement(globalTipsEnable?.status) && globalTipsEnable?.status === Constants.ENABLED;
};

export const checkForPhoneNumberValidation = (e) => {
    if (isValidElement(e?.message) && e.message === BASKET_ERROR_MESSAGE.PHONE_NO_REQUIRED) {
        NavigationService.navigate(SCREEN_OPTIONS.PROFILE.route_name, {
            screen: SCREEN_OPTIONS.PROFILE.route_name,
            params: { verified: false, isUpdateProfile: true }
        });
    }
};

export const skipStoreOpenStatus = (featureGateResponse) => {
    return isCustomerApp() && featureGateResponse?.skip_store_status?.status === 'ENABLED';
};

export const getTACloseMessage = (store, orderType, preOrderAvailable, timezone = null) => {
    if (isValidElement(store)) {
        const { show_delivery, store_status, show_collection } = store;
        let deliveryAvailable = isDeliveryAvailable(show_delivery, store_status?.delivery);
        let collectionAvailable = isCollectionAvailable(show_collection, store_status?.collection);
        if (!deliveryAvailable && !collectionAvailable) {
            return isValidString(store?.online_closed_message) ? store?.online_closed_message : LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_NOW;
        } else if (orderType === ORDER_TYPE.DELIVERY && !deliveryAvailable) {
            return createClosedMessageForDelivery(orderType, store?.delivery_next_open, preOrderAvailable, timezone);
        } else if (orderType === ORDER_TYPE.COLLECTION && !collectionAvailable) {
            return createClosedMessageForDelivery(orderType, store?.collection_next_open, timezone);
        }
    } else return null;
};

export function createClosedMessageForDelivery(orderType, nextOpen, preOrderAvailable, timezone = null) {
    let message = LOCALIZATION_STRINGS.formatString(
        LOCALIZATION_STRINGS.CLOSED_FOR_ORDER_TYPE,
        orderType === ORDER_TYPE.DELIVERY ? LOCALIZATION_STRINGS.DELIVERY : LOCALIZATION_STRINGS.COLLECTION
    );
    if (isValidDateString(nextOpen)) {
        message += ` ${LOCALIZATION_STRINGS.formatString(
            LOCALIZATION_STRINGS.CLOSED_UNTIL_TIME_AVAILABLE,
            getNextOpenTime(nextOpen, timezone)
        )}`;
    }
    if (preOrderAvailable !== true) {
        message += `. ${LOCALIZATION_STRINGS.formatString(
            LOCALIZATION_STRINGS.CLOSED_OTHER_ORDER_TYPE_AVAILABLE,
            orderType === ORDER_TYPE.DELIVERY ? LOCALIZATION_STRINGS.COLLECTION : LOCALIZATION_STRINGS.DELIVERY
        )}`;
    }
    return message;
}

export function getNextOpenTime(timeStamp, timeZone) {
    const { today, tomorrow, actualDate, date, isAfter1Day } = extractTimeLogicForNextOpening(timeStamp, timeZone);
    let time = moment(date).format(DATE_FORMAT.HH_mm_a);
    if (actualDate === today) {
        return time;
    } else if (tomorrow) {
        return LOCALIZATION_STRINGS.TOMORROW + ', ' + time;
    } else if (isAfter1Day) {
        return moment(date).format(DATE_FORMAT.MMM_DD_YYYY_H_MM_A);
    } else {
        return time;
    }
}

export const getCouponType = (value) => {
    if (isValidString(value)) {
        return value.toString()?.includes('%') ? BasketConstants.PERCENT : BasketConstants.AMOUNT;
    }
    return null;
};

export const checkIsStoreClosed = (openingHours, timeZone, orderType = null, paddingDuration = 5) => {
    if (isValidElement(openingHours?.Collection) && isValidElement(openingHours?.Delivery) && isValidElement(timeZone)) {
        let currentMomentWithTimeZone = moment().tz(timeZone);
        let todayDayInISO = currentMomentWithTimeZone.isoWeekday();
        let currentTimeInMins = convertSlotToInt(currentMomentWithTimeZone.format(DATE_FORMAT.HH_mm));
        if (orderType === ORDER_TYPE.COLLECTION) {
            return !checkIfStoreOpenForOrderType(openingHours.Collection, todayDayInISO, currentTimeInMins, paddingDuration);
        } else if (orderType === ORDER_TYPE.DELIVERY) {
            return !checkIfStoreOpenForOrderType(openingHours.Delivery, todayDayInISO, currentTimeInMins, paddingDuration);
        } else {
            return (
                !checkIfStoreOpenForOrderType(openingHours.Collection, todayDayInISO, currentTimeInMins, paddingDuration) ||
                !checkIfStoreOpenForOrderType(openingHours.Delivery, todayDayInISO, currentTimeInMins, paddingDuration)
            );
        }
    }
    return false;
};

export const checkIfStoreOpenForOrderType = (openingTimeSlots, todayDayInISO, currentTimeInMins, paddingDuration) => {
    let today = WEEKDAYS_NAME_SHORT_ARRAY[todayDayInISO - 1];
    if (isValidString(getAvailableOpeningSlot(openingTimeSlots[today], currentTimeInMins, false, paddingDuration))) {
        return true;
    }
    // for 5-5 logic, we need to check if previous day is open
    if (currentTimeInMins < TIME_SLOT.CUT_OFF_5) {
        // Find prev Day
        let prevDayInISO = todayDayInISO - 1;
        if (prevDayInISO <= 0) {
            prevDayInISO = 7;
        }
        let prevDay = WEEKDAYS_NAME_SHORT_ARRAY[prevDayInISO - 1];
        return isValidString(getAvailableOpeningSlot(openingTimeSlots[prevDay], currentTimeInMins, true, paddingDuration));
    }
    return false;
};

/**
 * Checks if the slot if in between, check for slot in the day
 * @param timeSlots
 * @param currentTimeInMins
 * @param isPrevDay
 * @param paddingInMins
 * @returns {null|*}
 */
export const getAvailableOpeningSlot = (timeSlots, currentTimeInMins, isPrevDay = false, paddingInMins = 2) => {
    if (isArrayNonEmpty(timeSlots) && isValidString(currentTimeInMins)) {
        return timeSlots.find((item) => {
            let slotData = getTimeSlot(item),
                slotTimeOpeningHours,
                slotTimeCloseHours;
            if (isArrayNonEmpty(slotData)) {
                slotTimeOpeningHours = slotData[0];
                slotTimeCloseHours = slotData[1];
                if (slotTimeCloseHours < TIME_SLOT.CUT_OFF_5 && slotTimeOpeningHours >= slotTimeCloseHours) {
                    if (isPrevDay === true) {
                        slotTimeOpeningHours = 0;
                    } else {
                        slotTimeCloseHours = TIME_SLOT.HR_24;
                    }
                }
            }
            return currentTimeInMins >= slotTimeOpeningHours - paddingInMins && currentTimeInMins < slotTimeCloseHours + paddingInMins;
        });
    } else {
        return null;
    }
};

// Converts 12:12-10.30 to (slot1:int, slot2:int)
// retuns null on invalid value
export const getTimeSlot = (slotDate) => {
    if (slotDate?.includes('-') === true) {
        const slots = removeAlphabets(slotDate).split('-');
        let slot1 = convertSlotToInt(slots[0]);
        let slot2 = convertSlotToInt(slots[1]);
        return [slot1, slot2];
    }

    return null;
};

export const convertSlotToInt = (slot) => {
    let time = 0;
    if (isValidElement(slot) && slot.includes(':')) {
        const hourMins = slot.split(':');
        time = Math.min(safeIntValue(hourMins[0] ?? 0), 23) * 60 + Math.min(safeIntValue(hourMins[1] ?? 0), 59);
    }
    return time;
};
