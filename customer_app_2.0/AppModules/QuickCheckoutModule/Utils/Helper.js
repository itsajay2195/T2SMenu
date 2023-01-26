import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import {
    getDateStr,
    isArrayNonEmpty,
    isFoodHubApp,
    isValidElement,
    isValidNotEmptyString,
    isValidNumber,
    isValidString
} from 't2sbasemodule/Utils/helpers';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { selectPrimaryAddressSelector } from 't2sbasemodule/Utils/AppSelectors';
import { store } from '../../../CustomerApp/Redux/Store/ConfigureStore';
import { CONSTANTS, LEGAL_AGE_CUISINES_ARRAY, PAYMENT_TYPE } from './QuickCheckoutConstants';
import _ from 'lodash';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { DeliveryAddressConstants } from '../../ProfileModule/Utils/ProfileConstants';
import {
    getApplePayStatus,
    getContactlessDeliveryStatus,
    getGooglePayStatus,
    getWalletStatus
} from '../../BaseModule/Utils/FeatureGateHelper';
import { getUniqueId } from 'react-native-device-info';
import { isAndroid, isIOS } from '../../BaseModule/Helper';
import { getStoreStatusCollection, getStoreStatusDelivery } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { extractAddress } from '../../AddressModule/Utils/AddressHelpers';

export const isCardPaymentEnabled = (storeConfigCardPayment) => {
    return (
        isValidString(storeConfigCardPayment) &&
        (storeConfigCardPayment.toUpperCase() === CONSTANTS.YES || storeConfigCardPayment.toUpperCase() === CONSTANTS.ENABLED)
    );
};

//TODO if we have wallet for customer app we can use this one
export const isWalletPaymentEnabled = (storeConfigWalletEnabled, countryBaseFeatureGateResponse) => {
    if (getWalletStatus(countryBaseFeatureGateResponse) && isValidString(storeConfigWalletEnabled)) {
        let walletValue = storeConfigWalletEnabled.toString()?.toUpperCase();
        return walletValue === '1' || walletValue === CONSTANTS.TRUE || walletValue === CONSTANTS.YES || walletValue === CONSTANTS.ENABLED;
    }
    return false;
};

export const isDeliveryOpened = (storeConfigResponse) => {
    let deliveryStatus = getStoreStatusDelivery(storeConfigResponse);
    return (
        isValidElement(storeConfigResponse?.show_delivery) &&
        storeConfigResponse.show_delivery === 1 &&
        deliveryStatus.toLowerCase() === 'open'
    );
};

export const isCollectionOpened = (storeConfigResponse) => {
    let collectionStatus = getStoreStatusCollection(storeConfigResponse);
    return (
        isValidElement(storeConfigResponse?.show_collection) &&
        storeConfigResponse.show_collection === 1 &&
        collectionStatus.toLowerCase() === 'open'
    );
};

export const isCashPaymentEnabled = (
    storeConfigCashPayment,
    storeConfigCardPayment,
    storeConfigOrdersCount = null,
    noOfTransactions = null
) => {
    //To prevent fake orders, after a user has ordered a certain no.of times specified in store response(storeConfigOrdersCount), cash payment is enabled
    let cardPaymentEnabled = isCardPaymentEnabled(storeConfigCardPayment);
    //if card option is not enabled, show cash option
    let checkCashConfig =
        isValidElement(storeConfigCashPayment) &&
        (storeConfigCashPayment === CONSTANTS.YES || storeConfigCashPayment === CONSTANTS.ENABLED);
    if (!cardPaymentEnabled) {
        return true;
    } else if (!isValidNumber(storeConfigOrdersCount) || !isValidNumber(noOfTransactions)) {
        return checkCashConfig;
    }
    return checkCashConfig && (isValidNumber(noOfTransactions) ? parseInt(noOfTransactions) >= parseInt(storeConfigOrdersCount) : true);
};

export const isPreOrderEnabled = (storeConfigPreOrder) => {
    if (isValidString(storeConfigPreOrder)) {
        return storeConfigPreOrder.toUpperCase() === CONSTANTS.ENABLED;
    }
    return false;
};

export const constructPreOrderDate = (collectionDates, deliveryDates, orderType) => {
    if (orderType === ORDER_TYPE.COLLECTION) {
        return getPreOrderSlots(collectionDates);
    } else {
        return getPreOrderSlots(deliveryDates);
    }
};

const getPreOrderSlots = (dates) => {
    let date;
    /* eslint-disable-next-line */
    for (let key in dates) {
        /* eslint-disable-next-line */
        if (dates.hasOwnProperty(key)) {
            date = dates[key];
        }
    }
    return date;
};

export const isCollectionOrder = (props) => {
    return isValidString(props?.orderType) && props.orderType.toLowerCase() === ORDER_TYPE.COLLECTION.toLowerCase();
};
export const getAddressForQCFlow = (props) => {
    if (isCollectionOrder(props)) {
        return isValidElement(props.takeAwayAddress) ? props.takeAwayAddress : '';
    } else {
        let address = getDeliveryAddressForQCFlow(props);
        if (isValidElement(address)) {
            return addressStringFromAddressObj(address);
        }
        return '';
    }
};
export const getDeliveryAddressForQCFlow = (props) => {
    if (!isCollectionOrder(props)) {
        if (isValidElement(props.deliveryAddress)) return props.deliveryAddress;
        let address = selectPrimaryAddressSelector(store.getState());
        if (isValidElement(address)) return address;
    }
    return '';
};
export const addressStringFromAddressObj = (address, addAddressLine2 = false) => {
    let takeAwayAddress = '';
    if (!isValidElement(address)) {
        return takeAwayAddress;
    }
    if (isValidNotEmptyString(address.house_number)) {
        takeAwayAddress = `${address.house_number} `;
    }
    if (isValidNotEmptyString(address.flat)) {
        takeAwayAddress = `${takeAwayAddress} ${address.flat}, `;
    }
    if (isValidNotEmptyString(address.address_line1)) {
        takeAwayAddress = `${takeAwayAddress} ${address.address_line1}, `;
    }
    if (isValidNotEmptyString(address.address_line2) && addAddressLine2) {
        takeAwayAddress = `${takeAwayAddress} ${address.address_line2}, `;
    }
    if (isValidNotEmptyString(address.area)) {
        takeAwayAddress = `${takeAwayAddress} ${address.area}, `;
    }
    if (isValidNotEmptyString(address.postcode)) {
        takeAwayAddress = `${takeAwayAddress} ${address.postcode}`;
    }
    return takeAwayAddress;
};

export const hasDeliveryAddress = (props) => {
    return isValidElement(props?.addressResponse) && props.addressResponse.data?.length > 0;
};

export const getSelectedPaymentTypeValue = (paymentMode, props) => {
    if (isValidElement(props)) {
        const { currency = '', walletBalance, savedCardDetails, user_selected_card_id } = props;
        switch (isValidElement(paymentMode) && paymentMode.toUpperCase()) {
            case PAYMENT_TYPE.WALLET:
                return `${LOCALIZATION_STRINGS.FOOD_HUB_WALLET} (${isValidString(currency) ? currency : ''}${walletBalance})`;
            case PAYMENT_TYPE.CARD_FROM_LIST:
                return getCardDetails(savedCardDetails, user_selected_card_id);
            case PAYMENT_TYPE.NEW_CARD:
                return LOCALIZATION_STRINGS.NEW_CARD;
            case PAYMENT_TYPE.CARD:
                return LOCALIZATION_STRINGS.CARD;
            case PAYMENT_TYPE.APPLE_PAY:
                return LOCALIZATION_STRINGS.APPLE_PAY;
            case PAYMENT_TYPE.GOOGLE_PAY:
                return LOCALIZATION_STRINGS.GOOGLE_PAY;
            case PAYMENT_TYPE.CASH:
                return LOCALIZATION_STRINGS.CASH;
            case PAYMENT_TYPE.PARTIAL_PAYMENT:
                return `${LOCALIZATION_STRINGS.FOOD_HUB_WALLET} (${currency}${walletBalance})\n${getCardDetails(
                    savedCardDetails,
                    user_selected_card_id
                )}`;
            default:
                return LOCALIZATION_STRINGS.CASH;
        }
    }
    return LOCALIZATION_STRINGS.CASH;
};

export const getCardItem = (savedCardDetails, user_selected_card_id) => {
    return _.find(savedCardDetails, (item) => {
        return item.id === user_selected_card_id;
    });
};

export const getCardDetails = (savedCardDetails, user_selected_card_id) => {
    let cardData = getCardItem(savedCardDetails, user_selected_card_id);
    return isValidElement(cardData) ? `${cardData.card_type}  ${LOCALIZATION_STRINGS.MASKED_CARD_NUMBER}${cardData.last_4_digits}` : '';
};

export const getPrimaryCardId = (savedCardDetails) => {
    try {
        if (isValidElement(savedCardDetails) && savedCardDetails.length > 0) {
            let cardData = _.find(savedCardDetails, (item) => {
                return isValidElement(item.is_primary) && item.is_primary === DeliveryAddressConstants.YES;
            });
            if (isValidElement(cardData) && isValidElement(cardData.id)) {
                return cardData.id;
            } else {
                return savedCardDetails[0].id;
            }
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

export const isImmediateOptionAvailable = (isCollectionAvailable, isDeliveryAvailable, selectedOrderType) => {
    return selectedOrderType?.toLowerCase() === ORDER_TYPE.COLLECTION ? isCollectionAvailable : isDeliveryAvailable;
};

//TODO Unit test case needs to be updated
export const preOrderFormatedDate = (preOrderCollectionDates, preOrderDeliveryDates, selectedOrderType) => {
    let dates = constructPreOrderDate(preOrderCollectionDates, preOrderDeliveryDates, selectedOrderType);
    if (isValidElement(dates) && dates.length > 0) {
        return dates[0];
    }
    return '';
};

export const paymentReference = () => {
    let uniqueID = getUniqueId();
    const date = getDateStr(new Date(), DATE_FORMAT.YYYYMMDDHHmmss);
    let reference = uniqueID + date;
    if (isValidString(reference)) {
        return reference
            .replace(/-/g, '')
            .replace(/\+/g, '')
            .replace(/-/g, '')
            .replace(/:/g, '')
            .replace(/\s/g, '');
    } else {
        return reference;
    }
};
function isPaymentTypeEnabled(type) {
    return type?.toUpperCase() === CONSTANTS.YES || type?.toUpperCase() === CONSTANTS.ENABLED;
}
export const isApplePayEnabled = (storeConfigSettingApplePay, storeConfigApplePay, countryBaseFeatureGateResponse) => {
    return (
        isIOS() &&
        isFoodHubApp() &&
        getApplePayStatus(countryBaseFeatureGateResponse) &&
        ((isValidElement(storeConfigSettingApplePay) && isPaymentTypeEnabled(storeConfigSettingApplePay)) ||
            (isValidElement(storeConfigApplePay) && isPaymentTypeEnabled(storeConfigApplePay)))
    );
};
//TODO: changes this function based on the store response & feature gate
export const isGooglePayEnabled = (storeConfigCardPayment, countryBaseFeatureGateResponse) => {
    return (
        isAndroid() && isFoodHubApp() && getGooglePayStatus(countryBaseFeatureGateResponse) && isCardPaymentEnabled(storeConfigCardPayment)
    );
    // return (
    //     isValidElement(storeResponse) &&
    //     ((isValidElement(storeResponse.setting) &&
    //         isValidElement(storeResponse.setting.google_pay) &&
    //         isPaymentTypeEnabled(storeResponse.setting.google_pay)) ||
    //         (isValidElement(storeResponse.google_pay) && isPaymentTypeEnabled(storeResponse.google_pay)))
    // );
};
export const shouldShowContactFreeDelivery = (orderType, payment_mode, countryBasedFeatureGateResponse) => {
    return (
        isValidElement(orderType) &&
        orderType === ORDER_TYPE.DELIVERY &&
        getContactlessDeliveryStatus(countryBasedFeatureGateResponse) &&
        isValidElement(payment_mode) &&
        payment_mode !== PAYMENT_TYPE.CASH
    );
};

export const checkToShowLegalAgeConfirmation = (storeConfigCuisines) => {
    let cuisines = [];
    if (isArrayNonEmpty(storeConfigCuisines)) {
        storeConfigCuisines.filter((cuisine) => {
            if (isValidElement(cuisine.name)) {
                LEGAL_AGE_CUISINES_ARRAY.filter((_cuisine) => {
                    if (_.includes(cuisine.name.toLowerCase(), _cuisine)) {
                        cuisines.push(cuisine.name);
                    }
                });
            }
        });
    }
    return cuisines.length > 0;
};

export const isExpressPayment = (payment_mode) => {
    if (isValidString(payment_mode)) {
        let mode = payment_mode.toUpperCase();
        return mode === PAYMENT_TYPE.WALLET || mode === PAYMENT_TYPE.CARD_FROM_LIST || mode === PAYMENT_TYPE.PARTIAL_PAYMENT;
    }
    return false;
};

export const getBasketTotal = (basketData) => {
    return isValidString(basketData?.total?.value) ? parseFloat(basketData.total.value) : 0;
};

export const isDifferentPostCodeFromLocation = (currentLocation, deliveryAddress) => {
    if (isValidElement(extractAddress(currentLocation)?.postCode) && isValidElement(deliveryAddress?.postcode)) {
        return extractAddress(currentLocation).postCode !== deliveryAddress.postcode;
    }
};
