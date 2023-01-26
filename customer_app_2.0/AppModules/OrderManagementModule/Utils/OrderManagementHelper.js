/* eslint-disable no-extend-native */
import { Linking, Platform } from 'react-native';
import moment from 'moment-timezone';
import {
    getTakeawayName,
    isCustomerApp,
    isNonEmptyString,
    isValidElement,
    isValidNumber,
    isValidString,
    safeFloatValue,
    safeFloatValueWithoutDecimal,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import {
    AVAILABLE_ORDER_TYPES,
    MIN_DISTANCE_IN_KM,
    MIN_STATUS_FETCH_TIMEOUT,
    ORDER_HISTORY_BUTTONS,
    ORDER_TYPE,
    STATUS_FETCH_TIMEOUT
} from './OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { CHECK_ORDER_TYPE, ORDER_STATUS, ORDER_TYPE as ORDERTYPE } from '../../BaseModule/BaseConstants';
import { DATE_FORMAT, formatDateString, getBusinessMomentForDate, getCurrentMoment } from 't2sbasemodule/Utils/DateUtil';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import { store } from '../../../CustomerApp/Redux/Store/ConfigureStore';
import Config from 'react-native-config';
import {
    isCollectionAvailableForStore,
    isDeliveryAvailableForStore,
    reOrderStoreCollectionAvailable,
    reOrderStoreCollectionPreOrderAvailable,
    reOrderStoreDeliveryAvailable,
    reOrderStoreDeliveryPreOrderAvaialble
} from 't2sbasemodule/Utils/AppSelectors';
import { BOOL_CONSTANT } from '../../AddressModule/Utils/AddressConstants';
import { getLive_trackingStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { addressVisible, isOrderTypeToggleEnabled } from '../../BaseModule/GlobalAppHelper';
import { CONFIG_TYPE } from '../../BaseModule/GlobalAppConstants';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { getUserName } from '../../BaseModule/Helper';

export const getPaymentTypeBasedTotalPaidBy = (totalPaidByCard, totalPaidByWallet, paymentMode, currency) => {
    let paymentTypeStr = '';
    const paidByCard = isValidString(totalPaidByCard) ? parseFloat(totalPaidByCard) : 0.0;
    const paidByWallet = isValidString(totalPaidByWallet) ? parseFloat(totalPaidByWallet) : 0.0;
    if (paidByCard > 0 && paidByWallet > 0) {
        paymentTypeStr = `(${LOCALIZATION_STRINGS.WALLET}: ${currency}${paidByWallet}, ${LOCALIZATION_STRINGS.CARD}: ${currency}${paidByCard})`;
    } else if (paidByCard > 0) {
        if (paymentMode === '1') {
            paymentTypeStr = LOCALIZATION_STRINGS.CARD_PROCESSING;
        } else {
            paymentTypeStr = LOCALIZATION_STRINGS.CARD;
        }
    } else if (paidByWallet > 0) {
        paymentTypeStr = LOCALIZATION_STRINGS.WALLET;
    } else {
        paymentTypeStr = getPaymentType(paymentMode);
    }
    return paymentTypeStr;
};

export const getPaymentType = (paymentMode) => {
    let paymentTypeStr = '';
    if (isValidNumber(paymentMode)) {
        paymentMode = paymentMode.toString();
    }
    switch (paymentMode) {
        case '0':
            paymentTypeStr = LOCALIZATION_STRINGS.CASH;
            break;
        case '1':
            paymentTypeStr = LOCALIZATION_STRINGS.CARD_PROCESSING;
            break;
        case '3':
        case '3.5':
            paymentTypeStr = LOCALIZATION_STRINGS.CARD;
            break;
        case '7':
            paymentTypeStr = LOCALIZATION_STRINGS.APPLE_PAY;
            break;
        case '8':
            paymentTypeStr = LOCALIZATION_STRINGS.WALLET;
            break;
        case '12':
            paymentTypeStr = LOCALIZATION_STRINGS.CARD_WALLET_PARTIAL_PAYMENT;
            break;

        default:
            paymentTypeStr = '';
    }
    return paymentTypeStr;
};

export const isCollectionOnly = (availableDeliveryType) => {
    return availableDeliveryType === AVAILABLE_ORDER_TYPES.COLLECTION_ONLY;
};
export const getAvailableOrderType = (
    storeConfigShowDelivery,
    storeConfigShowCollection,
    storeConfigAskPostcodeFirst,
    showPostcodeFirst = false
) => {
    if (
        isValidElement(storeConfigShowDelivery) &&
        isValidElement(storeConfigShowCollection) &&
        isValidElement(storeConfigAskPostcodeFirst)
    ) {
        if (storeConfigShowCollection === 1 && storeConfigShowDelivery === 1) {
            if (showPostcodeFirst && storeConfigAskPostcodeFirst === 1) {
                return AVAILABLE_ORDER_TYPES.ASK_POST_CODE_COLLECTION_DELIVERY;
            } else {
                return AVAILABLE_ORDER_TYPES.COLLECTION_DELIVERY;
            }
        } else if (storeConfigShowCollection === 0 && storeConfigShowDelivery === 1) {
            if (showPostcodeFirst && storeConfigAskPostcodeFirst === 1) {
                return AVAILABLE_ORDER_TYPES.ASK_POST_CODE_DELIVERY;
            } else {
                return AVAILABLE_ORDER_TYPES.DELIVERY_ONLY;
            }
        } else if (storeConfigShowCollection === 1 && storeConfigShowDelivery === 0) {
            return AVAILABLE_ORDER_TYPES.COLLECTION_ONLY;
        } else {
            return AVAILABLE_ORDER_TYPES.CLOSED;
        }
    } else {
        return AVAILABLE_ORDER_TYPES.CLOSED;
    }
};

export const isAnyOrderTypeAvailable = (storeConfigShowDelivery, storeConfigShowCollection) => {
    if (isValidElement(storeConfigShowDelivery) && isValidElement(storeConfigShowCollection)) {
        return !(storeConfigShowDelivery === 0 && storeConfigShowCollection === 0);
    } else {
        return false;
    }
};

export const getViewOrderType = (sending) => {
    if (sending === 'delivery' || sending === 'to') {
        return ORDER_TYPE.DELIVERY;
    } else if (sending === 'collection') {
        return ORDER_TYPE.COLLECTION;
    } else if (sending === 'waiting') {
        return ORDER_TYPE.WAITING;
    } else if (sending === 'restaurant') {
        return ORDER_TYPE.RESTAURANT;
    } else {
        return '';
    }
};

export const getModifiedTime = (time) => {
    if (isValidString(time)) {
        return time
            .replace('minutes', 'mins')
            .replace('minute', 'min')
            .replace('seconds', 'secs')
            .replace('second', 'sec')
            .replace('hours', 'hrs')
            .replace('hour', 'hr');
    } else {
        return time;
    }
};

export const getOrderDateFormat = (string, timezone = T2SConfig.default.timeZone) => {
    if (isCustomerApp()) {
        let orderDate = moment.tz(string, timezone);
        let today = isCustomerApp() ? getCurrentMoment(timezone) : getCurrentMoment();
        const differ = today.diff(orderDate, 'days');
        if (differ < 1) {
            return getModifiedTime(orderDate.from(today));
        } else if (differ < 2) {
            return LOCALIZATION_STRINGS.YESTERDAY;
        } else {
            return formatDateString(string, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM_YYYY);
        }
    } else {
        return formatDateString(string, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM_YYYY);
    }
};

export const isValidTotalSavings = (totalSavings) => {
    return isValidNumber(totalSavings) && parseFloat(totalSavings) > 0;
};

export const isValidDiscount = (data) => {
    if (isValidElement(data)) {
        const { status, online_discount_value } = data;
        return isValidString(online_discount_value) && online_discount_value !== '0.00' && status !== ORDER_STATUS.CANCEL_ORDER;
    } else {
        return false;
    }
};

export const checkToEnableLiveTrackingMode = (orderStatus, deliveryType, countryBaseFeatureGateResponse) => {
    //TODO as of now we don't want to show the live tracking if needed uncomment below line.
    // Here, we should check the takeaway has D2S and should check co-ordinate points are available - CA-86
    return (
        isValidNumber(orderStatus) &&
        orderStatus === ORDER_STATUS.SENT &&
        isValidString(deliveryType) &&
        (deliveryType.toLowerCase() === ORDER_TYPE.DELIVERY.toLocaleLowerCase() || deliveryType.toLowerCase() === 'to') &&
        getLive_trackingStatus(countryBaseFeatureGateResponse)
    );
    //return true;
};

export const checkIfOrderIsApplicableForLiveTrackingCheck = (orderDetails, countryBaseFeatureGate) => {
    return (
        isValidElement(orderDetails) &&
        isValidElement(orderDetails.data) &&
        isValidElement(orderDetails.data.status) &&
        isValidElement(orderDetails.data.sending) &&
        checkToEnableLiveTrackingMode(orderDetails.data.status, orderDetails.data.sending, countryBaseFeatureGate)
    );
};

export const getTakeAwayDetails = (takeAwayResponse) => {
    if (isValidElement(takeAwayResponse)) {
        return {
            latLng: {
                latitude: safeFloatValueWithoutDecimal(takeAwayResponse.lat),
                longitude: safeFloatValueWithoutDecimal(takeAwayResponse.lng)
            },
            name: getTakeawayName(takeAwayResponse?.name)
        };
    }
    return null;
};

export const getDeliveryDetails = (deliveryDataResponse) => {
    if (isValidElement(deliveryDataResponse)) {
        return {
            latLng: {
                latitude: safeFloatValueWithoutDecimal(deliveryDataResponse.latitude),
                longitude: safeFloatValueWithoutDecimal(deliveryDataResponse.longitude)
            },
            name: deliveryDataResponse.postcode,
            deliverySequence: deliveryDataResponse.delivery_sequence
        };
    }
    return null;
};

export const getDriverDetails = (driverDataResponse) => {
    if (isValidElement(driverDataResponse)) {
        return {
            locations: formatLocationLatLng(driverDataResponse.locations),
            name: driverDataResponse.name,
            currentSequence: driverDataResponse.current_sequence,
            phoneNo: driverDataResponse.phone,
            photo: driverDataResponse.image,
            totalOrders: driverDataResponse.total_orders
        };
    }
    return null;
};

export const formatLocationLatLng = (driverLocations) => {
    if (isValidElement(driverLocations) && driverLocations.length > 0) {
        return driverLocations.map((item) => ({
            latitude: safeFloatValueWithoutDecimal(item.lat),
            longitude: safeFloatValueWithoutDecimal(item.lng)
        }));
    } else {
        return null;
    }
};

export const checkDetailsAreValid = (takeAwayDetails, deliveryDetails) => {
    return isValidElement(takeAwayDetails) && isValidElement(deliveryDetails);
};

export const appendOrdinals = (numberStr) => {
    if (!numberStr) return '';
    const sequenceNumber = safeIntValue(numberStr);
    let sequenceNumWithOrdinal;
    if (sequenceNumber === 1) sequenceNumWithOrdinal = `${sequenceNumber}st`;
    else if (sequenceNumber === 2) sequenceNumWithOrdinal = `${sequenceNumber}nd`;
    else if (sequenceNumber === 3) sequenceNumWithOrdinal = `${sequenceNumber}rd`;
    else sequenceNumWithOrdinal = `${sequenceNumber}th`;
    return sequenceNumWithOrdinal;
};

export const bearingBetweenLocations = (latLng1, latLng2) => {
    if (isValidElement(latLng1) && isValidElement(latLng2)) {
        const PI = 3.14159;
        const lat1 = (latLng1.latitude * PI) / 180;
        const long1 = (latLng1.longitude * PI) / 180;
        const lat2 = (latLng2.latitude * PI) / 180;
        const long2 = (latLng2.longitude * PI) / 180;

        const dLon = long2 - long1;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let bearing = Math.atan2(y, x);

        bearing = bearing.toDegrees();
        bearing = (bearing + 360) % 360;

        return safeFloatValueWithoutDecimal(bearing);
    } else return 0;
};

export const getLatLngInterpolatePos = (fraction, startPosLatLng, endPosLatLng) => {
    let fromLat = startPosLatLng?.latitude?.toRadians();
    let fromLng = startPosLatLng?.longitude?.toRadians();
    let toLat = endPosLatLng?.latitude?.toRadians();
    let toLng = endPosLatLng?.longitude?.toRadians();
    let cosFromLat = Math.cos(fromLat);
    let cosToLat = Math.cos(toLat);
    // Computes Spherical interpolation coefficients.
    let angle = computeAngleBetween(fromLat, fromLng, toLat, toLng);
    let sinAngle = Math.sin(angle);
    if (sinAngle < 1e-6) {
        return startPosLatLng;
    }
    let a = Math.sin((1 - fraction) * angle) / sinAngle;
    let b = Math.sin(fraction * angle) / sinAngle;
    // Converts from polar to vector and interpolate.
    let x = a * cosFromLat * Math.cos(fromLng) + b * cosToLat * Math.cos(toLng);
    let y = a * cosFromLat * Math.sin(fromLng) + b * cosToLat * Math.sin(toLng);
    let z = a * Math.sin(fromLat) + b * Math.sin(toLat);
    // Converts interpolated vector back to polar.
    let lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    let lng = Math.atan2(y, x);
    return { latitude: lat.toDegrees(), longitude: lng.toDegrees() };
};

export const computeAngleBetween = (fromLat, fromLng, toLat, toLng) => {
    if (isValidElement(fromLat) && isValidElement(fromLng) && isValidElement(toLat) && isValidElement(toLng)) {
        let dLat = fromLat - toLat;
        let dLng = fromLng - toLng;
        return (
            2 *
            Math.asin(Math.sqrt(Math.pow(Math.sin(dLat / 2), 2) + Math.cos(fromLat) * Math.cos(toLat) * Math.pow(Math.sin(dLng / 2), 2)))
        );
    } else {
        return 0;
    }
};

export const getCurrentTimeInMS = () => {
    return new Date().getTime();
};

if (typeof Number.prototype.toRadians === 'undefined') {
    Number.prototype.toRadians = function() {
        return (this * Math.PI) / 180;
    };
}

if (typeof Number.prototype.toDegrees === 'undefined') {
    Number.prototype.toDegrees = function() {
        return this * (180 / Math.PI);
    };
}

export const manipulateReceiptResponse = (response) => {
    if (isValidElement(response) && isValidElement(response.item) && response.item.length > 0) {
        response.item = response.item.map((data) => {
            return {
                ...data,
                totalPrice: (data.quantity * safeFloatValue(data.price)).toFixed(2)
            };
        });
    }
    return response;
};

export const getFormattedAddress = (item) => {
    if (isValidElement(item)) {
        const { house_number, flat, address_line1, address_line2, postcode } = item;
        return `${isValidString(house_number) ? house_number + ' ' : ''}${isValidString(flat) ? flat + ', ' : ''}${
            isValidString(address_line1) ? address_line1 + ', ' : ''
        }${isValidString(postcode) ? postcode : ''}${isValidString(address_line2) ? ', ' + address_line2 : ''}`;
    } else return '';
};

export const getAddressWithoutCityName = (item) => {
    if (isValidElement(item)) {
        const { house_number, flat, address_line1, postcode } = item;
        return `${isValidString(house_number) ? house_number + ' ' : ''}${isValidString(address_line1) ? address_line1 + ', ' : ''}${
            isValidString(flat) ? flat + ', ' : ''
        }${isValidString(postcode) ? postcode : ''}`;
    } else return '';
};

export const getHouseNO = (house_number, doorNo, houseno, forTAlist) => {
    return isValidString(house_number)
        ? forTAlist && house_number.length > 5
            ? house_number.slice(0, 5).concat('... ')
            : house_number + ' '
        : isValidString(doorNo)
        ? forTAlist && doorNo.length > 5
            ? doorNo.slice(0, 5).concat('.., ')
            : doorNo + ' '
        : isValidString(houseno)
        ? houseno.length > 5
            ? houseno.slice(0, 5).concat('... ')
            : houseno + ' '
        : '';
};
export const getAddressLine1 = (address_line1, address1) => {
    return isValidString(address_line1) ? address_line1 : isValidString(address1) ? address1 : '';
};

export const getFormattedFullAddress = (item, forTAlist) => {
    //TODO if not needed remove the /n for postcode
    if (!isValidElement(item)) {
        return '';
    }
    const { house_number, flat, address_line1, address_line2, postcode, area, postCode, doorNo, houseno, address1, address2 } = item;
    let resultant_postcode = isValidString(postcode) ? postcode : isValidString(postCode) ? postCode : '';
    return `${getHouseNO(house_number, doorNo, houseno, forTAlist)}${
        isValidString(flat) ? (forTAlist && flat.length > 10 ? flat.slice(0, 10).concat('... ') : flat + ', ') : ''
    }${getAddressLine1(address_line1, address1)}${isValidString(resultant_postcode) ? ', ' + resultant_postcode : ''}${
        isValidString(area) ? ', ' + area : ''
    }${isValidString(address_line2) ? ', ' + address_line2 : isValidString(address2) ? ', ' + address2 : ''}`;
};

export const hasValidLatLong = (orderTrackingDetails) => {
    return (
        isValidElement(orderTrackingDetails) &&
        isValidElement(orderTrackingDetails.data) &&
        isValidElement(orderTrackingDetails.data.driver) &&
        isValidElement(orderTrackingDetails.data.driver.locations) &&
        orderTrackingDetails.data.driver.locations.length > 0
    );
};

export const getAddressObj = (s3ConfigResponse, storeConfigHost, address) => {
    let addressObj = {};
    if (isNonEmptyString(address?.house_number)) {
        addressObj.house_number = address.house_number;
    }
    if (isNonEmptyString(address?.flat)) {
        addressObj.flat = address.flat;
    }
    addressObj.address_line1 = address?.address_line1;
    addressObj.address_line2 = address?.address_line2;
    addressObj.postcode = address?.postcode;
    if (addressVisible(s3ConfigResponse, CONFIG_TYPE.AREA)) {
        addressObj.area = address?.area;
    }
    addressObj.latitude = isValidElement(address?.latitude) ? address.latitude : undefined;
    addressObj.longitude = isValidElement(address?.longitude) ? address.longitude : undefined;
    addressObj.app_name = Config.APP_TYPE;
    addressObj.host = isValidString(storeConfigHost) ? storeConfigHost : undefined;
    return addressObj;
};

export const isOrderTypeAvailable = (
    storeConfigShowDelivery,
    storeStatusDelivery,
    storeConfigShowCollection,
    storeStatusCollection,
    sending
) => {
    if (isValidString(sending)) {
        return sending === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION
            ? isCollectionAvailableForStore(storeConfigShowCollection, storeStatusCollection)
            : isDeliveryAvailableForStore(storeConfigShowDelivery, storeStatusDelivery);
    }
    return false;
};

export const isPreOrderAvailableForCollection = (storeConfigPreOrderCollection) => {
    if (isValidString(storeConfigPreOrderCollection)) {
        return storeConfigPreOrderCollection.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
    }
    return false;
};
export const isPreOrderAvailableForDelivery = (storeConfigPreOrderDelivery) => {
    // const preOrderHours =
    //     isValidElement(storeConfiguration) && isValidElement(storeConfiguration.preorder_hours) && storeConfiguration.preorder_hours;
    // const preOrderDelivery = isValidElement(preOrderHours) && isValidElement(preOrderHours.delivery) && preOrderHours.delivery;
    // return preOrderDelivery.pre_order === BOOL_CONSTANT.YES.toLowerCase();
    if (isValidString(storeConfigPreOrderDelivery)) {
        return storeConfigPreOrderDelivery.toLowerCase() === BOOL_CONSTANT.YES.toLowerCase();
    }
    return false;
};
export const isPreOrderAvailableForType = (storeConfigPreOrderDelivery, storeConfigPreOrderCollection, orderType) => {
    return orderType === ORDERTYPE.COLLECTION
        ? isPreOrderAvailableForCollection(storeConfigPreOrderCollection)
        : isPreOrderAvailableForDelivery(storeConfigPreOrderDelivery);
};
export const extractOrderType = (sending) => {
    return sending?.toLowerCase() === ORDERTYPE.COLLECTION ? ORDERTYPE.COLLECTION : ORDERTYPE.DELIVERY;
};

export const getTakeawayNameForOrder = (orders, id) => {
    // Filtering that particular order
    if (isValidElement(orders)) {
        let ordersArray = Array.isArray(orders) ? orders : [];
        const order = ordersArray.filter((orderObj) => {
            return orderObj.id === id;
        });
        return order.length > 0 && isValidElement(order[0]) ? getTakeawayName(order[0].store?.name) : '';
    } else return '';
};
export const getDeliveryTimeOrder = (orders, id) => {
    // Filtering that particular order
    if (isValidElement(orders)) {
        let ordersArray = Array.isArray(orders) ? orders : [];
        const order = ordersArray.filter((orderObj) => {
            return orderObj.id === id;
        });
        return order.length > 0 && isValidElement(order[0]) ? getDeliveryTime(order[0]) : '';
    } else return '';
};
export const getDeliveryTime = (order) => {
    if (isValidElement(order)) {
        return order.delivery_time;
    }
};

export const getOrder = (orders, id) => {
    // Filtering that particular order
    if (isValidElement(orders)) {
        let ordersArray = Array.isArray(orders) ? orders : [];
        const order = ordersArray.filter((orderObj) => {
            return orderObj.id === id;
        });
        // Checking for not null
        if (order.length > 0 && isValidElement(order[0]) && isValidElement(order[0].store) && isValidString(order[0].store.name)) {
            return order[0];
        }
        // Else return nothing
        return null;
    } else return null;
};

export const getRefundAdditionalMessage = (currencySymbol, data) => {
    let currency = isValidString(currencySymbol) ? currencySymbol : '';
    if (isValidElement(data)) {
        const { total_paid_by_card, total_paid_by_wallet } = data;
        if (
            isValidElement(total_paid_by_card) &&
            isValidElement(total_paid_by_wallet) &&
            safeFloatValue(total_paid_by_card) > 0 &&
            safeFloatValue(total_paid_by_wallet) > 0
        ) {
            return `${currency}${total_paid_by_wallet} ${LOCALIZATION_STRINGS.WILL_BE_CREDITED_TO_YOUR_WALLET} ${currency}${total_paid_by_card} ${LOCALIZATION_STRINGS.WAS_PAID_THROUGH_CARD}  ${LOCALIZATION_STRINGS.HOW_WOULD_YOU_LIKE_TO_GET_IT_REFUNDED}`;
        }
    }
    return '';
};
export const checkOrderTypeAvailabilityFromReOrderStoreConfig = (sending) => {
    let state = store.getState();
    if (isValidString(sending)) {
        return sending === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION
            ? reOrderStoreCollectionAvailable(state)
            : reOrderStoreDeliveryAvailable(state);
    }
    return false;
};
export const checkPreOrderAvailabilityFromReOrderStoreConfig = (sending) => {
    let state = store.getState();
    if (isValidString(sending)) {
        return sending === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION
            ? reOrderStoreCollectionPreOrderAvailable(state)
            : reOrderStoreDeliveryPreOrderAvaialble(state);
    }
    return false;
};
export const fetchIntervalBasedOnDistanceInDelivery = (orderTrackingDetails) => {
    if (isValidElement(orderTrackingDetails) && isValidElement(orderTrackingDetails.data)) {
        const { delivery, driver } = orderTrackingDetails.data;
        if (
            isValidElement(delivery) &&
            isValidElement(delivery.latitude) &&
            isValidElement(delivery.longitude) &&
            isValidElement(driver) &&
            isValidElement(driver.locations) &&
            isValidElement(driver.locations[0]) &&
            isValidElement(driver.locations[0].lat) &&
            isValidElement(driver.locations[0].lng)
        ) {
            let distanceRemaining = getDistanceFromLatLonInKm(
                delivery.latitude,
                delivery.longitude,
                driver.locations[0].lat,
                driver.locations[0].lng
            );
            if (distanceRemaining <= MIN_DISTANCE_IN_KM) {
                return MIN_STATUS_FETCH_TIMEOUT;
            } else {
                return STATUS_FETCH_TIMEOUT;
            }
        } else {
            return STATUS_FETCH_TIMEOUT;
        }
    } else {
        return STATUS_FETCH_TIMEOUT;
    }
};

/**
 * Note we have used haversine formula to calculate the distance.
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    if (lat1 || lat2 || lon1 || lon2) {
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1); // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return d;
    }
    return 0;
}

export function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export const getOrderHistoryRightButton = (order) => {
    if (order?.status === ORDER_STATUS.CANCEL_ORDER) {
        return ORDER_HISTORY_BUTTONS.REORDER;
    } else if (order?.status <= ORDER_STATUS.DELIVERED) {
        return ORDER_HISTORY_BUTTONS.TRACK_ORDER;
    } else {
        return ORDER_HISTORY_BUTTONS.REORDER;
    }
};

export const handleJoinBetaClick = () => {
    let URL = Platform.OS === 'ios' ? AppConfig.IOS_JOIN_BETA_URL : AppConfig.ANDROID_JOIN_BETA_URL;
    try {
        Linking.canOpenURL(URL).then((supported) => {
            if (!supported) {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            } else {
                return Linking.openURL(URL);
            }
        });
    } catch (e) {
        //Nothing to Handle
    }
};
export const getTitleTxt = (data, profileResponse) => {
    if (isValidElement(data) && isValidString(data.sending)) {
        if (getViewOrderType(data.sending) === ORDER_TYPE.DELIVERY) {
            const { houseno, address1, postcode } = data;
            let title = '';
            if (isValidString(houseno)) title = title + houseno + ' ';
            if (isValidString(address1)) title = title + address1 + ', ';
            if (isValidString(postcode)) title = title + postcode;
            return title;
        } else {
            return `${LOCALIZATION_STRINGS.COLLECTION}: ${getUserName(profileResponse)}`;
        }
    } else return null;
};
export const updateReview = (prevOrderList, payload) => {
    if (isValidElement(prevOrderList)) {
        return prevOrderList.map((item) => {
            if (item?.id === payload?.order_info_id) {
                return { ...item, review: payload };
            } else {
                return item;
            }
        });
    }
};

export const getValidAddress = (deliveryAddress, primaryAddress) => {
    const delivery_Address = isValidElement(deliveryAddress) ? deliveryAddress : isValidElement(primaryAddress) ? primaryAddress : null;
    if (isValidElement(delivery_Address) && isValidElement(delivery_Address.postcode) && isValidElement(delivery_Address.id)) {
        return delivery_Address;
    } else {
        return null;
    }
};

export const isCollectionOrderType = (OrderType) => {
    return isValidElement(OrderType) && OrderType?.toLowerCase() === ORDER_TYPE.COLLECTION.toLowerCase();
};

export const getOrderStoreId = (orderData) => {
    return (
        isValidElement(orderData) &&
        isValidElement(orderData.data) &&
        isValidElement(orderData.data.store) &&
        isValidElement(orderData.data.store.id) &&
        orderData.data.store.id
    );
};

export const isDeliverOrder = (orderData) => {
    return isValidString(orderData?.sending) && orderData.sending.toLowerCase() === 'to';
};

export const updatedDeliveryTime = (updatedDeliveryTimeDataList, updatedDeliveryTimeOrder) => {
    let updatedList =
        isValidElement(updatedDeliveryTimeDataList) && updatedDeliveryTimeDataList.length > 0
            ? updatedDeliveryTimeDataList.map((item) => {
                  if (item?.orderId === updatedDeliveryTimeOrder?.orderId) {
                      return {
                          ...item,
                          isDeliveryTimeUpdated: true,
                          updated_delivery_time: updatedDeliveryTimeOrder?.updated_delivery_time
                      };
                  } else {
                      return item;
                  }
              })
            : [];
    return updatedList;
};

export const getDeliveryTimeDelayText = (orderData, deliveryTimeUpdatedList) => {
    let timeZone = orderData?.data?.time_zone;
    let getOrderData =
        isValidElement(deliveryTimeUpdatedList) &&
        deliveryTimeUpdatedList.length > 0 &&
        deliveryTimeUpdatedList.find((item) => item.orderId === orderData?.data?.id);
    let duration = moment.duration(
        getCurrentMoment(timeZone).diff(getBusinessMomentForDate(getOrderData?.requestedTime, timeZone, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS))
    );
    let seconds = duration.asSeconds();
    if (seconds < 30) {
        return LOCALIZATION_STRINGS.DELIVERY_DELAY_LOADING_MESSAGE;
    } else if (seconds >= 30 && seconds < 60) {
        return LOCALIZATION_STRINGS.DELIVERY_DELAY_MESSAGE_LESS_A_MINIS;
    } else {
        return LOCALIZATION_STRINGS.DELIVERY_DELAY_MESSAGE_MORE_A_MINIS;
    }
};

export const getRefundAmount = (refundAmount) => {
    let refundValue = isValidString(refundAmount) && parseFloat(refundAmount);
    if (refundValue > 0.0) {
        return refundAmount;
    } else return '';
};

export const getToastMessageForTakeawayOpenStatus = (
    countryId,
    name,
    featureGateResponse,
    orderType,
    isDeliveryTAAvailable,
    isCollectionTAAvailable
) => {
    let errorMessage = '';
    if (isOrderTypeToggleEnabled(countryId, featureGateResponse)) {
        if (orderType === ORDER_TYPE.DELIVERY && !isDeliveryTAAvailable && isCollectionTAAvailable) {
            errorMessage = `'${name}' ${LOCALIZATION_STRINGS.COLLECTION_ONLY}`;
        } else if (orderType === ORDER_TYPE.COLLECTION && isDeliveryTAAvailable && !isCollectionTAAvailable) {
            errorMessage = `'${name}' ${LOCALIZATION_STRINGS.DELIVERY_ONLY}`;
        }
    } else {
        if (!isDeliveryTAAvailable && isCollectionTAAvailable) {
            errorMessage = `'${name}' ${LOCALIZATION_STRINGS.COLLECTION_ONLY}`;
        } else if (isDeliveryTAAvailable && !isCollectionTAAvailable) {
            errorMessage = `'${name}' ${LOCALIZATION_STRINGS.DELIVERY_ONLY}`;
        }
    }
    return errorMessage;
};
