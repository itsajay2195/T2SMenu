import {
    appendOrdinals,
    bearingBetweenLocations,
    checkDetailsAreValid,
    checkIfOrderIsApplicableForLiveTrackingCheck,
    checkOrderTypeAvailabilityFromReOrderStoreConfig,
    checkPreOrderAvailabilityFromReOrderStoreConfig,
    checkToEnableLiveTrackingMode,
    computeAngleBetween,
    deg2rad,
    extractOrderType,
    fetchIntervalBasedOnDistanceInDelivery,
    formatLocationLatLng,
    getAddressLine1,
    getAddressObj,
    getAddressWithoutCityName,
    getAvailableOrderType,
    getCurrentTimeInMS,
    getDeliveryDetails,
    getDeliveryTime,
    getDeliveryTimeDelayText,
    getDeliveryTimeOrder,
    getDistanceFromLatLonInKm,
    getDriverDetails,
    getFormattedAddress,
    getFormattedFullAddress,
    getHouseNO,
    getLatLngInterpolatePos,
    getModifiedTime,
    getOrder,
    getOrderDateFormat,
    getOrderHistoryRightButton,
    getOrderStoreId,
    getPaymentType,
    getPaymentTypeBasedTotalPaidBy,
    getRefundAdditionalMessage,
    getRefundAmount,
    getTakeAwayDetails,
    getTakeawayNameForOrder,
    getTitleTxt,
    getToastMessageForTakeawayOpenStatus,
    getValidAddress,
    getViewOrderType,
    hasValidLatLong,
    isAnyOrderTypeAvailable,
    isCollectionOnly,
    isCollectionOrderType,
    isDeliverOrder,
    isOrderTypeAvailable,
    isPreOrderAvailableForCollection,
    isPreOrderAvailableForDelivery,
    isPreOrderAvailableForType,
    isValidDiscount,
    isValidTotalSavings,
    manipulateReceiptResponse,
    updatedDeliveryTime,
    updateReview
} from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import {
    addresses,
    featureGateResponse,
    order,
    orderList,
    orderResponse,
    orderTrackingDetails,
    previosOrder,
    profile,
    review,
    s3Config,
    storeConfig,
    takeawayListResponse
} from '../data';
import { CURRENCY } from 'appmodules/BaseModule/GlobalAppConstants';
import { getOrderStatusText } from 't2sbasemodule/UI/CustomUI/OrderTracking/Utils/OrderTrackingHelper';
import { ORDER_STATUS } from '../../../AppModules/BaseModule/BaseConstants';
import { resetAppType, setAppType } from '../../TestUtils/DateTestUtils';

let address = {
    house_number: '95',
    flat: '',
    postcode: 'ST6 6DX',
    address_line1: 'Victoria Park Road',
    address_line2: 'Tunstall, Stoke-on-Trent',
    is_primary: 'YES',
    latitude: 53.0627967,
    longitude: -2.203116,
    id: 21307983
};

describe('OrderManagementHelper testing', () => {
    describe('getAddressObj Testing', () => {
        test('getAddressObj', () => {
            expect(getAddressObj(s3Config, 'host:d-1337.t2scdn.com', { flat: 'Sunshine apartments', house_number: 21 })).toEqual({
                app_name: 'FOODHUB',
                flat: 'Sunshine apartments',
                host: 'host:d-1337.t2scdn.com',
                house_number: 21
            });
            expect(getAddressObj(s3Config, '', addresses.data[3])).toEqual({
                address_line1: 'Victoria Park road',
                address_line2: 'Stoke on trent',
                app_name: 'FOODHUB',
                house_number: '2/1',
                postcode: 'AA11AA'
            });
            expect(getAddressObj(null, '', addresses.data[0])).toEqual({
                address_line1: 'Preston',
                address_line2: 'Preston',
                app_name: 'FOODHUB',
                flat: '1',
                house_number: '1',
                latitude: '-37.7399362',
                longitude: '145.0107588',
                postcode: '3072'
            });
            expect(getAddressObj(null, '', {})).toEqual({
                app_name: 'FOODHUB'
            });
            expect(getAddressObj(s3Config, '', null)).toEqual({
                app_name: 'FOODHUB'
            });
            expect(getAddressObj(null, '', null)).toEqual({
                app_name: 'FOODHUB'
            });
            expect(getAddressObj(s3Config, null, null)).toEqual({
                app_name: 'FOODHUB'
            });
            expect(getAddressObj()).toEqual({
                app_name: 'FOODHUB'
            });
        });
    });

    describe('getPaymentTypeBasedTotalPaidBy testing', () => {
        test('getPaymentTypeBasedTotalPaidBy', () => {
            expect(getPaymentTypeBasedTotalPaidBy('1', '1', '12', CURRENCY.POUNDS)).toBe('(Wallet: £1, Card: £1)');
            expect(getPaymentTypeBasedTotalPaidBy(null, '1', '8', CURRENCY.POUNDS)).toBe('Wallet');
            expect(getPaymentTypeBasedTotalPaidBy(undefined, '1', '8', CURRENCY.POUNDS)).toBe('Wallet');
            expect(getPaymentTypeBasedTotalPaidBy(0, '1', '8', CURRENCY.POUNDS)).toBe('Wallet');
            expect(getPaymentTypeBasedTotalPaidBy('1', null, '3', CURRENCY.POUNDS)).toBe('Card');
            expect(getPaymentTypeBasedTotalPaidBy('1', undefined, '3', CURRENCY.POUNDS)).toBe('Card');
            expect(getPaymentTypeBasedTotalPaidBy('1', 0, '3', CURRENCY.POUNDS)).toBe('Card');
            expect(getPaymentTypeBasedTotalPaidBy('1', null, '1', CURRENCY.POUNDS)).toBe('Card processing');
            expect(getPaymentTypeBasedTotalPaidBy('1', undefined, '1', CURRENCY.POUNDS)).toBe('Card processing');
            expect(getPaymentTypeBasedTotalPaidBy('1', 0, '1', CURRENCY.POUNDS)).toBe('Card processing');
            expect(getPaymentTypeBasedTotalPaidBy(0, 0, '0', CURRENCY.POUNDS)).toBe('Cash');
            expect(getPaymentTypeBasedTotalPaidBy(0, 0, '7', CURRENCY.POUNDS)).toBe('Apple Pay');
        });
    });

    describe('getPaymentType testing', () => {
        test('getPaymentType', () => {
            expect(getPaymentType('0')).toBe('Cash');
            expect(getPaymentType('1')).toBe('Card processing');
            expect(getPaymentType('3')).toBe('Card');
            expect(getPaymentType('3.5')).toBe('Card');
            expect(getPaymentType('7')).toBe('Apple Pay');
            expect(getPaymentType('8')).toBe('Wallet');
            expect(getPaymentType('12')).toBe('Card + Wallet');
            expect(getPaymentType('10')).toBe('');
            expect(getPaymentType(null)).toBe('');
            expect(getPaymentType(undefined)).toBe('');
            expect(getPaymentType(0)).toBe('Cash');
            expect(getPaymentType('')).toBe('');
        });
    });

    describe('isCollectionOnly testing', () => {
        test('isCollectionOnly', () => {
            expect(isCollectionOnly('COLLECTION_ONLY')).toBe(true);
            expect(isCollectionOnly('DELIVERY_ONLY')).toBe(false);
            expect(isCollectionOnly('COLLECTION_DELIVERY')).toBe(false);
            expect(isCollectionOnly('ASK_POST_CODE_DELIVERY')).toBe(false);
            expect(isCollectionOnly('ASK_POST_CODE_COLLECTION_DELIVERY')).toBe(false);
            expect(isCollectionOnly('CLOSED')).toBe(false);
            expect(isCollectionOnly('')).toBe(false);
            expect(isCollectionOnly('test')).toBe(false);
            expect(isCollectionOnly(null)).toBe(false);
            expect(isCollectionOnly(undefined)).toBe(false);
        });
    });

    describe('getAvailableOrderType testing', () => {
        test('getAvailableOrderType', () => {
            expect(getAvailableOrderType(storeConfig, true)).toBe('CLOSED');
            expect(getAvailableOrderType(storeConfig, false)).toBe('CLOSED');
            expect(getAvailableOrderType(null, false)).toBe('CLOSED');
            expect(getAvailableOrderType(undefined, false)).toBe('CLOSED');
            expect(getAvailableOrderType(null, true)).toBe('CLOSED');
            expect(getAvailableOrderType(undefined, true)).toBe('CLOSED');
            expect(getAvailableOrderType(1, 1)).toBe('CLOSED');
            expect(getAvailableOrderType(1, 1, true)).toBe('COLLECTION_DELIVERY');
            expect(getAvailableOrderType(1, 0, true)).toBe('DELIVERY_ONLY');
            expect(getAvailableOrderType(0, 1, true)).toBe('COLLECTION_ONLY');
            expect(getAvailableOrderType(0, 0, false)).toBe('CLOSED');
            expect(getAvailableOrderType(0, 0, true)).toBe('CLOSED');
            expect(getAvailableOrderType(0, 1, 0, true)).toBe('COLLECTION_ONLY');
            expect(getAvailableOrderType(1, 0, 1, true)).toBe('ASK_POST_CODE_DELIVERY');
            expect(getAvailableOrderType(1, 1, 1, true)).toBe('ASK_POST_CODE_COLLECTION_DELIVERY');
            expect(getAvailableOrderType(0, 1, true, true)).toBe('COLLECTION_ONLY');
            expect(getAvailableOrderType(true, 1, true, true)).toBe('CLOSED');
        });
    });

    describe('isAnyOrderTypeAvailable testing', () => {
        test('isAnyOrderTypeAvailable', () => {
            expect(isAnyOrderTypeAvailable(storeConfig)).toBe(false);
            expect(isAnyOrderTypeAvailable(null)).toBe(false);
            expect(isAnyOrderTypeAvailable(undefined)).toBe(false);
            expect(isAnyOrderTypeAvailable(true, 1)).toBe(true);
            expect(isAnyOrderTypeAvailable(false, true)).toBe(true);
            expect(isAnyOrderTypeAvailable(1, 1)).toBe(true);
            expect(isAnyOrderTypeAvailable(0, 0)).toBe(false);
            expect(isAnyOrderTypeAvailable(0, false)).toBe(true);
            expect(isAnyOrderTypeAvailable(0, '')).toBe(true);
            expect(isAnyOrderTypeAvailable(undefined, '')).toBe(false);
            expect(isAnyOrderTypeAvailable()).toBe(false);
        });
    });

    describe('getViewOrderType testing', () => {
        test('getViewOrderType', () => {
            expect(getViewOrderType('delivery')).toBe('Delivery');
            expect(getViewOrderType('to')).toBe('Delivery');
            expect(getViewOrderType('collection')).toBe('Collection');
            expect(getViewOrderType('waiting')).toBe('In-Store');
            expect(getViewOrderType('restaurant')).toBe('Restaurant');
            expect(getViewOrderType('')).toBe('');
            expect(getViewOrderType(null)).toBe('');
            expect(getViewOrderType(undefined)).toBe('');
            expect(getViewOrderType({})).toBe('');
        });
    });

    describe('getOrderDateFormat testing', () => {
        test('getOrderDateFormat', () => {
            //non customer app
            expect(getOrderDateFormat('2021-07-29 11:43:34', 'Asia/Kolkata')).toBe('29 Jul 2021');
            expect(getOrderDateFormat('2021-08-04 11:43:34', 'Asia/Kolkata')).toBe('04 Aug 2021');
            expect(getOrderDateFormat('2021-08-03 11:43:34', 'Asia/Kolkata')).toBe('03 Aug 2021');
            expect(getOrderDateFormat('2021-07-29 11:43:34', 'Asia/Kolkata')).toBe('29 Jul 2021');
            expect(getOrderDateFormat('2021-07-29 11:43:34')).toBe('29 Jul 2021');
            expect(getOrderDateFormat(null)).toBe('NA');
            expect(getOrderDateFormat('', 'Europe/London')).toBe('NA');
            expect(getOrderDateFormat('2022-12-02', 'Europe/London')).toBe('02 Dec 2022');
            setAppType('CUSTOMER');
            expect(getOrderDateFormat('2022-04-05', 'Europe/London')).toBe('Yesterday');
            expect(getOrderDateFormat('2022-04-06', 'Europe/London')).toBe('12 hrs ago');
            expect(getOrderDateFormat('2022-04-10', 'Europe/London')).toBe('in 3 days');
            expect(getOrderDateFormat('2022-04-01', 'Asia/Kolkata')).toBe('01 Apr 2022');
            expect(getOrderDateFormat(null)).toBe('NA');
            expect(getOrderDateFormat('')).toBe('NA');
            resetAppType();
        });
    });

    describe('getModifiedTime testing', () => {
        test('getModifiedTime', () => {
            expect(getModifiedTime('')).toBe('');
            expect(getModifiedTime('10 minutes')).toBe('10 mins');
            expect(getModifiedTime('10')).toBe('10');
            expect(getModifiedTime('10 minute')).toBe('10 min');
            expect(getModifiedTime('10 seconds')).toBe('10 secs');
            expect(getModifiedTime('1 sec')).toBe('1 sec');
            expect(getModifiedTime('2 hours')).toBe('2 hrs');
            expect(getModifiedTime('2 hours 30 minutes 2 second')).toBe('2 hrs 30 mins 2 sec');
            expect(getModifiedTime(null)).toBe(null);
            expect(getModifiedTime()).toBe(undefined);
            expect(getModifiedTime('hi hello world')).toBe('hi hello world');
            expect(getModifiedTime(undefined)).toBe(undefined);
        });
    });
    describe('isValidTotalSavings testing', () => {
        test('isValidTotalSavings', () => {
            expect(isValidTotalSavings('1.10')).toBe(true);
            expect(isValidTotalSavings(1.1)).toBe(true);
            expect(isValidTotalSavings('0')).toBe(false);
            expect(isValidTotalSavings('0.0')).toBe(false);
            expect(isValidTotalSavings('0.00')).toBe(false);
            expect(isValidTotalSavings(0)).toBe(false);
            expect(isValidTotalSavings('')).toBe(false);
            expect(isValidTotalSavings(null)).toBe(false);
            expect(isValidTotalSavings(undefined)).toBe(false);
        });
    });

    describe('isValidDiscount testing', () => {
        test('isValidDiscount', () => {
            expect(isValidDiscount(order)).toBe(false);
            expect(isValidDiscount(null)).toBe(false);
            expect(isValidDiscount(undefined)).toBe(false);
            expect(isValidDiscount('')).toBe(false);
            expect(isValidDiscount({})).toBe(false);
            expect(isValidDiscount({ status: ORDER_STATUS.CANCEL_ORDER, online_discount_value: null })).toBe(false);
            expect(isValidDiscount({ status: ORDER_STATUS.ACCEPTED, online_discount_value: '2.50' })).toBe(true);
            expect(isValidDiscount({ status: '', online_discount_value: 2.0 })).toBe(true);
            expect(isValidDiscount({ status: '', online_discount_value: '0.00' })).toBe(false);
        });
    });

    describe('checkToEnableLiveTrackingMode testing', () => {
        test('checkToEnableLiveTrackingMode', () => {
            expect(checkToEnableLiveTrackingMode('0', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('1', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('2', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('2.5', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', 'to', featureGateResponse.data)).toBe(true);
            expect(checkToEnableLiveTrackingMode('3.5', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('4', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('4.1', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('4.5', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('5', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('6', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('11', 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('0', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('1', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('2', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('2.5', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', 'delivery', featureGateResponse.data)).toBe(true);
            expect(checkToEnableLiveTrackingMode('3.5', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('4', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('4.1', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('4.5', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('5', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('6', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('11', 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', 'test', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', '', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', null, featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', undefined, featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('', 'test', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode(3, '', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode(null, 'delivery', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode(undefined, 'to', featureGateResponse.data)).toBe(false);
            expect(checkToEnableLiveTrackingMode('3', 'to', null)).toBe(true);
            expect(checkToEnableLiveTrackingMode('3', 'delivery', undefined)).toBe(true);
            expect(checkToEnableLiveTrackingMode(null, null, null)).toBe(false);
            expect(checkToEnableLiveTrackingMode(undefined, undefined, undefined)).toBe(false);
        });
    });

    describe('checkIfOrderIsApplicableForLiveTrackingCheck testing', () => {
        test('checkIfOrderIsApplicableForLiveTrackingCheck', () => {
            expect(checkIfOrderIsApplicableForLiveTrackingCheck({ data: order }, featureGateResponse.data)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck({ data: order }, null)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck({ data: order }, undefined)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck({ data: null }, undefined)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck({ data: {} }, undefined)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck({ data: undefined }, undefined)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck(null, null)).toBe(false);
            expect(checkIfOrderIsApplicableForLiveTrackingCheck(undefined, undefined)).toBe(false);
        });
    });

    describe('getTakeAwayDetails testing', () => {
        test('getTakeAwayDetails', () => {
            expect(getTakeAwayDetails(takeawayListResponse.data[0])).toEqual({
                latLng: { latitude: 53.3117389, longitude: -2.9654895 },
                name: 'BigFoodie Takeaway'
            });
            expect(getTakeAwayDetails(null)).toBe(null);
            expect(getTakeAwayDetails(undefined)).toBe(null);
            expect(getTakeAwayDetails({})).toEqual({ latLng: { latitude: 0, longitude: 0 }, name: '' });
            expect(getTakeAwayDetails('hi')).toEqual({ latLng: { latitude: 0, longitude: 0 }, name: '' });
            expect(getTakeAwayDetails('')).toEqual({ latLng: { latitude: 0, longitude: 0 }, name: '' });
            expect(getTakeAwayDetails({ lat: '', lng: '', name: 'Test TA' })).toStrictEqual({
                latLng: { latitude: NaN, longitude: NaN },
                name: 'Test TA'
            });
            expect(getTakeAwayDetails({ lng: '10.209', name: 'Test TA' })).toStrictEqual({
                latLng: { latitude: 0, longitude: 10.209 },
                name: 'Test TA'
            });
        });
    });

    describe('getDeliveryDetails testing', () => {
        test('getDeliveryDetails', () => {
            expect(getDeliveryDetails(order)).toEqual({
                deliverySequence: undefined,
                latLng: { latitude: 53.061129, longitude: -2.204682 },
                name: 'AA1 1AA'
            });
            expect(getDeliveryDetails(null)).toBe(null);
            expect(getDeliveryDetails(undefined)).toBe(null);
            expect(getDeliveryDetails({})).toEqual({ deliverySequence: undefined, latLng: { latitude: 0, longitude: 0 }, name: undefined });
            expect(getDeliveryDetails('hii')).toEqual({
                deliverySequence: undefined,
                latLng: { latitude: 0, longitude: 0 },
                name: undefined
            });
            expect(getDeliveryDetails({ postcode: 'AA11AA' })).toEqual({
                deliverySequence: undefined,
                latLng: { latitude: 0, longitude: 0 },
                name: 'AA11AA'
            });
            expect(getDeliveryDetails({ postcode: 'AA11AA', latitude: 2.135, longitude: '-13.689' })).toEqual({
                deliverySequence: undefined,
                latLng: { latitude: 2.135, longitude: -13.689 },
                name: 'AA11AA'
            });
        });
    });

    describe('checkDetailsAreValid testing', () => {
        test('checkDetailsAreValid', () => {
            expect(checkDetailsAreValid({}, {})).toBe(true);
            expect(checkDetailsAreValid(null, {})).toBe(false);
            expect(checkDetailsAreValid(undefined, {})).toBe(false);
            expect(checkDetailsAreValid({}, null)).toBe(false);
            expect(checkDetailsAreValid({}, undefined)).toBe(false);
            expect(checkDetailsAreValid(null, undefined)).toBe(false);
            expect(checkDetailsAreValid({}, '')).toBe(true);
            expect(checkDetailsAreValid(2, '')).toBe(true);
            expect(checkDetailsAreValid(2, 'hi')).toBe(true);
        });
    });

    let data = orderResponse;
    data.item[0] = { ...orderResponse.item[0], totalPrice: '5.50' };
    describe('manipulateReceiptResponse testing', () => {
        test('manipulateReceiptResponse', () => {
            expect(manipulateReceiptResponse(orderResponse)).toEqual(data);
            expect(manipulateReceiptResponse(null)).toEqual(null);
            expect(manipulateReceiptResponse(undefined)).toEqual(undefined);
            expect(manipulateReceiptResponse({})).toEqual({});
            expect(manipulateReceiptResponse({ item: [] })).toEqual({
                item: []
            });
            expect(
                manipulateReceiptResponse({
                    item: [
                        { name: 'Burger', price: 2.578, quantity: 2 },
                        { name: 'Pizza', price: 15.572, quantity: 1 }
                    ]
                })
            ).toEqual({
                item: [
                    {
                        name: 'Burger',
                        price: 2.578,
                        quantity: 2,
                        totalPrice: '5.16'
                    },
                    {
                        name: 'Pizza',
                        price: 15.572,
                        quantity: 1,
                        totalPrice: '15.57'
                    }
                ]
            });
            expect(manipulateReceiptResponse({ item: [{ name: 'conizza', price: 1.456, quantity: 0 }] })).toEqual({
                item: [
                    {
                        name: 'conizza',
                        price: 1.456,
                        quantity: 0,
                        totalPrice: '0.00'
                    }
                ]
            });
        });
    });

    describe('getFormattedAddress testing', () => {
        test('getFormattedAddress', () => {
            expect(getFormattedAddress(address)).toBe('95 Victoria Park Road, ST6 6DX, Tunstall, Stoke-on-Trent');
            expect(getFormattedAddress(addresses.data[0])).toBe('1 1, Preston, 3072, Preston');
            expect(getFormattedAddress(addresses.data[1])).toBe('1 Pebble View, ST6 5SB, Stoke-on-Trent');
            expect(getFormattedAddress(null)).toBe('');
            expect(getFormattedAddress(undefined)).toBe('');
            expect(getFormattedAddress('')).toBe('');
            expect(getFormattedAddress({ house_number: '2/6', address_line1: 'Paris', postcode: 'ST55DY' })).toBe('2/6 Paris, ST55DY');
            expect(getFormattedAddress({})).toBe('');
            expect(getFormattedAddress({ postcode: 'AA11AA' })).toBe('AA11AA');
            expect(getFormattedAddress({ flat: 'Sunshine apartments', postcode: 'ST55DC', house: '2' })).toBe(
                'Sunshine apartments, ST55DC'
            );
        });
    });

    describe('getAddressWithoutCityName testing', () => {
        test('getAddressWithoutCityName', () => {
            expect(getAddressWithoutCityName(address)).toBe('95 Victoria Park Road, ST6 6DX');
            expect(getAddressWithoutCityName(addresses.data[0])).toBe('1 Preston, 1, 3072');
            expect(getAddressWithoutCityName(addresses.data[1])).toBe('1 Pebble View, ST6 5SB');
            expect(getAddressWithoutCityName(null)).toBe('');
            expect(getAddressWithoutCityName(undefined)).toBe('');
            expect(getAddressWithoutCityName('')).toBe('');
            expect(
                getAddressWithoutCityName({ house_number: '2/1', postcode: 'AA11AA', address_line1: 'Victoria Park road', city: 'Paris' })
            ).toBe('2/1 Victoria Park road, AA11AA');
            expect(getAddressWithoutCityName({ house_number: '2/1', postcode: 'AA11AA', city: 'Paris' })).toBe('2/1 AA11AA');
            expect(getAddressWithoutCityName(addresses.data[3])).toBe('2/1 Victoria Park road, AA11AA');
        });
    });

    describe('getAddressLine1 Testing', () => {
        test('getAddressLine1', () => {
            expect(getAddressLine1(null)).toBe('');
            expect(getAddressLine1('')).toBe('');
            expect(getAddressLine1(undefined)).toBe('');
            expect(getAddressLine1('', 'Paris')).toBe('Paris');
            expect(getAddressLine1('Victoria Park', 'Paris')).toBe('Victoria Park');
            expect(getAddressLine1('', null)).toBe('');
            expect(getAddressLine1(undefined, null)).toBe('');
        });
    });

    describe('getFormattedFullAddress testing', () => {
        test('getFormattedFullAddress', () => {
            expect(getFormattedFullAddress(address)).toBe('95 Victoria Park Road, ST6 6DX, Tunstall, Stoke-on-Trent');
            expect(getFormattedFullAddress(addresses.data[0])).toBe('1 1, Preston, 3072, Victoria, Preston');
            expect(getFormattedFullAddress(addresses.data[1])).toBe('1 Pebble View, ST6 5SB, Stoke-on-Trent');
            expect(getFormattedFullAddress(null)).toBe('');
            expect(getFormattedFullAddress(undefined)).toBe('');
            expect(getFormattedFullAddress('')).toBe('');
            expect(getFormattedFullAddress({ house_number: '2/12F', doorNo: '22', flat: 'Sunshine apartments' })).toBe(
                '2/12F Sunshine apartments, '
            );
            expect(getFormattedFullAddress(addresses.data[4])).toBe('2/12F Sunshine apartments, hanley, Stanley, Stoke on trent');
            expect(getFormattedFullAddress(addresses.data[4], true)).toBe('2/12F Sunshine a... hanley, Stanley, Stoke on trent');
            expect(
                getFormattedFullAddress(
                    {
                        house_number: '2/12F',
                        doorNo: '22',
                        flat: 'Sunshine apartments',
                        address2: 'Paris',
                        address_line2: 'Stoken on trent'
                    },
                    true
                )
            ).toBe('2/12F Sunshine a... , Stoken on trent');
            expect(
                getFormattedFullAddress(
                    {
                        house_number: '2/12F',
                        doorNo: '22',
                        postcode: 'AA11AA'
                    },
                    true
                )
            ).toBe('2/12F , AA11AA');
        });
    });

    describe('getHouseNO Testing', () => {
        test('getHouseNO', () => {
            expect(getHouseNO('2', '3/2', '3ABC/2')).toBe('2 ');
            expect(getHouseNO('2', '3/2', null)).toBe('2 ');
            expect(getHouseNO('2', '3/2', null, true)).toBe('2 ');
            expect(getHouseNO('', '2B', '23', true)).toBe('2B ');
            expect(getHouseNO('', '2B', '23', false)).toBe('2B ');
            expect(getHouseNO('', '', null, false)).toBe('');
            expect(getHouseNO('', '2B', '23', null)).toBe('2B ');
            expect(getHouseNO('', '2B', '23', 'HI')).toBe('2B ');
            expect(getHouseNO(null, '2HELLO WORLD', '23', 'HI')).toBe('2HELL.., ');
            expect(getHouseNO('hiHelloWorld', '2', '23', true)).toBe('hiHel... ');
            expect(getHouseNO('', undefined, '23 Flat B/12', true)).toBe('23 Fl... ');
            expect(getHouseNO()).toBe('');
        });
    });

    describe('isOrderTypeAvailable testing', () => {
        test('isOrderTypeAvailable', () => {
            expect(isOrderTypeAvailable(1, 'open', 1, '', 'collection')).toBe(false);
            expect(isOrderTypeAvailable(1, 'open', 1, undefined, 'to')).toBe(true);
            expect(isOrderTypeAvailable(0, 'open', 1, 'open', 'collection')).toBe(true);
            expect(isOrderTypeAvailable(0, 'open', 1, 'closed', 'collection')).toBe(false);
            expect(isOrderTypeAvailable(0, 'closed', 0, 'closed')).toBe(false);
            expect(isOrderTypeAvailable(true, 'open', undefined, undefined)).toBe(false);
            expect(isOrderTypeAvailable('', undefined, 1, 'open', 'delivery')).toBe(false);
            expect(isOrderTypeAvailable('', undefined, 1, 'open', 'collection')).toBe(true);
            expect(isOrderTypeAvailable(0, 'open', 0, 'closed', 'collection')).toBe(false);
            expect(isOrderTypeAvailable(0, 'open', 1, 'open', 'collection')).toBe(true);
            expect(isOrderTypeAvailable(undefined, undefined, undefined, undefined)).toBe(false);
            expect(isOrderTypeAvailable(undefined, undefined, undefined, undefined)).toBe(false);
            expect(isOrderTypeAvailable(undefined, 'open', '', '', 'to')).toBe(false);
            expect(isOrderTypeAvailable()).toBe(false);
        });
    });

    describe('isPreOrderAvailableForCollection testing', () => {
        test('isPreOrderAvailableForCollection', () => {
            expect(isPreOrderAvailableForCollection('YES')).toBe(true);
            expect(isPreOrderAvailableForCollection('yes')).toBe(true);
            expect(isPreOrderAvailableForCollection('NO')).toBe(false);
            expect(isPreOrderAvailableForCollection('no')).toBe(false);
            expect(isPreOrderAvailableForCollection(null)).toBe(false);
            expect(isPreOrderAvailableForCollection(undefined)).toBe(false);
            expect(isPreOrderAvailableForCollection('')).toBe(false);
            expect(isPreOrderAvailableForCollection()).toBe(false);
        });
    });

    describe('isPreOrderAvailableForDelivery testing', () => {
        test('isPreOrderAvailableForDelivery', () => {
            expect(isPreOrderAvailableForDelivery('YES')).toBe(true);
            expect(isPreOrderAvailableForDelivery('yes')).toBe(true);
            expect(isPreOrderAvailableForDelivery('NO')).toBe(false);
            expect(isPreOrderAvailableForDelivery('no')).toBe(false);
            expect(isPreOrderAvailableForDelivery(null)).toBe(false);
            expect(isPreOrderAvailableForDelivery(undefined)).toBe(false);
            expect(isPreOrderAvailableForDelivery()).toBe(false);
            expect(isPreOrderAvailableForDelivery('')).toBe(false);
        });
    });

    describe('isPreOrderAvailableForType testing', () => {
        test('isPreOrderAvailableForType', () => {
            expect(isPreOrderAvailableForType('YES', 'YES', 'collection')).toBe(true);
            expect(isPreOrderAvailableForType('YES', 'NO', 'collection')).toBe(false);
            expect(isPreOrderAvailableForType('NO', 'YES', 'collection')).toBe(true);
            expect(isPreOrderAvailableForType('NO', 'NO', 'collection')).toBe(false);
            expect(isPreOrderAvailableForType('', '', 'collection')).toBe(false);
            expect(isPreOrderAvailableForType('YES', 'YES', 'delivery')).toBe(true);
            expect(isPreOrderAvailableForType('YES', 'NO', 'delivery')).toBe(true);
            expect(isPreOrderAvailableForType('NO', 'YES', 'delivery')).toBe(false);
            expect(isPreOrderAvailableForType('NO', 'NO', 'delivery')).toBe(false);
            expect(isPreOrderAvailableForType('', '', 'delivery')).toBe(false);
            expect(isPreOrderAvailableForType('YES', 'YES', 'to')).toBe(true);
            expect(isPreOrderAvailableForType('YES', 'NO', 'to')).toBe(true);
            expect(isPreOrderAvailableForType('NO', 'YES', 'to')).toBe(false);
            expect(isPreOrderAvailableForType('NO', 'NO', 'to')).toBe(false);
            expect(isPreOrderAvailableForType('', '', 'to')).toBe(false);
            expect(isPreOrderAvailableForType(null, null, 'to')).toBe(false);
            expect(isPreOrderAvailableForType(undefined, undefined, 'to')).toBe(false);
            expect(isPreOrderAvailableForType('', '', null)).toBe(false);
            expect(isPreOrderAvailableForType('', '', undefined)).toBe(false);
        });
    });

    describe('extractOrderType testing', () => {
        test('extractOrderType', () => {
            expect(extractOrderType('collection')).toBe('collection');
            expect(extractOrderType('delivery')).toBe('delivery');
            expect(extractOrderType('to')).toBe('delivery');
            expect(extractOrderType('')).toBe('delivery');
            expect(extractOrderType(null)).toBe('delivery');
            expect(extractOrderType(undefined)).toBe('delivery');
            expect(extractOrderType('COLLECTION')).toBe('collection');
            expect(extractOrderType('TO')).toBe('delivery');
            expect(extractOrderType('DELIVERY')).toBe('delivery');
        });
    });

    describe('getTakeawayNameForOrder testing', () => {
        test('getTakeawayNameForOrder', () => {
            expect(getTakeawayNameForOrder([order], 485732841)).toBe('F8LIVE TEST 1');
            expect(getTakeawayNameForOrder([order], 0)).toBe('');
            expect(getTakeawayNameForOrder([order], null)).toBe('');
            expect(getTakeawayNameForOrder([], '')).toBe('');
            expect(getTakeawayNameForOrder([], 485732841)).toBe('');
            expect(getTakeawayNameForOrder('', 485732841)).toBe('');
            expect(getTakeawayNameForOrder([order, orderList], 485732841)).toBe('F8LIVE TEST 1');
            expect(getTakeawayNameForOrder([order, orderList], 319913998)).toBe('Web3-AUS');
            expect(getTakeawayNameForOrder(null, 485732841)).toBe('');
            expect(getTakeawayNameForOrder(undefined, 485732841)).toBe('');
            expect(getTakeawayNameForOrder({ name: 'test' }, 485732841)).toBe('');
            expect(getTakeawayNameForOrder('test', 485732841)).toBe('');
            expect(getTakeawayNameForOrder('', 485732841)).toBe('');
        });
    });

    describe('getOrder testing', () => {
        test('getOrder', () => {
            expect(getOrder([order], 485732841)).toEqual(order);
            expect(getOrder([order], 0)).toBe(null);
            expect(getOrder([order], null)).toBe(null);
            expect(getOrder([order], undefined)).toBe(null);
            expect(getOrder([], 0)).toBe(null);
            expect(getOrder(null, null)).toBe(null);
            expect(getOrder(undefined, undefined)).toBe(null);
            expect(getOrder('', null)).toBe(null);
            expect(getOrder({}, null)).toBe(null);
        });
    });

    describe('checkOrderTypeAvailabilityFromReOrderStoreConfig testing', () => {
        test('checkOrderTypeAvailabilityFromReOrderStoreConfig', () => {
            expect(checkOrderTypeAvailabilityFromReOrderStoreConfig('collection')).toBe(false);
            expect(checkOrderTypeAvailabilityFromReOrderStoreConfig('to')).toBe(false);
            expect(checkOrderTypeAvailabilityFromReOrderStoreConfig('delivery')).toBe(false);
            expect(checkOrderTypeAvailabilityFromReOrderStoreConfig('')).toBe(false);
            expect(checkOrderTypeAvailabilityFromReOrderStoreConfig(null)).toBe(false);
            expect(checkOrderTypeAvailabilityFromReOrderStoreConfig(undefined)).toBe(false);
        });
    });

    describe('checkPreOrderAvailabilityFromReOrderStoreConfig testing', () => {
        test('checkPreOrderAvailabilityFromReOrderStoreConfig', () => {
            expect(checkPreOrderAvailabilityFromReOrderStoreConfig('collection')).toBe(false);
            expect(checkPreOrderAvailabilityFromReOrderStoreConfig('to')).toBe(false);
            expect(checkPreOrderAvailabilityFromReOrderStoreConfig('delivery')).toBe(false);
            expect(checkPreOrderAvailabilityFromReOrderStoreConfig('')).toBe(false);
            expect(checkPreOrderAvailabilityFromReOrderStoreConfig(null)).toBe(false);
            expect(checkPreOrderAvailabilityFromReOrderStoreConfig(undefined)).toBe(false);
        });
    });

    describe('getOrderHistoryRightButton testing', () => {
        test('getOrderHistoryRightButton', () => {
            expect(getOrderHistoryRightButton(order)).toBe('reorder');
            expect(getOrderHistoryRightButton(null)).toBe('reorder');
            expect(getOrderHistoryRightButton(undefined)).toBe('reorder');
            expect(getOrderHistoryRightButton('')).toBe('reorder');
            expect(getOrderHistoryRightButton({})).toBe('reorder');
            expect(getOrderHistoryRightButton({ status: '2' })).toBe('track_order');
            expect(getOrderHistoryRightButton({ status: '4.1' })).toBe('reorder');
            expect(getOrderHistoryRightButton({ status: '3' })).toBe('track_order');
            expect(getOrderHistoryRightButton({ status: 0 })).toBe('track_order');
            expect(getOrderHistoryRightButton({ name: 'Test TA' })).toBe('reorder');
            expect(getOrderHistoryRightButton({ status: '6' })).toBe('reorder');
        });
    });

    describe('getValidAddress testing', () => {
        test('getValidAddress', () => {
            expect(getValidAddress(address, addresses.data[0])).toEqual(address);
            expect(getValidAddress(address, addresses.data[1])).toEqual(address);
            expect(getValidAddress(null, addresses.data[0])).toEqual(addresses.data[0]);
            expect(getValidAddress(null, addresses.data[1])).toEqual(addresses.data[1]);
            expect(getValidAddress(null, null)).toEqual(null);
            expect(getValidAddress(undefined, undefined)).toEqual(null);
            expect(getValidAddress({ id: 21, flat: 'X Residency' }, undefined)).toEqual(null);
            expect(getValidAddress({ id: 21, flat: 'X Apt', postcode: 'AA11AA' }, null)).toEqual({
                id: 21,
                flat: 'X Apt',
                postcode: 'AA11AA'
            });
            expect(getValidAddress({}, undefined)).toEqual(null);
            expect(getValidAddress({}, {})).toEqual(null);
            expect(getValidAddress(null, { id: 32, postcode: 'ST66DY' })).toEqual({ id: 32, postcode: 'ST66DY' });
        });
    });

    describe('appendOrdinals testing', () => {
        test('appendOrdinals', () => {
            expect(appendOrdinals(1)).toBe('1st');
            expect(appendOrdinals('1')).toBe('1st');
            expect(appendOrdinals(2)).toBe('2nd');
            expect(appendOrdinals('2')).toBe('2nd');
            expect(appendOrdinals(3)).toBe('3rd');
            expect(appendOrdinals('3')).toBe('3rd');
            expect(appendOrdinals('4')).toBe('4th');
            expect(appendOrdinals(4)).toBe('4th');
            expect(appendOrdinals(0)).toBe('');
            expect(appendOrdinals(null)).toBe('');
            expect(appendOrdinals(undefined)).toBe('');
            expect(appendOrdinals('')).toBe('');
        });
    });

    let latLng1 = {
        latitude: '52.872449107060994',
        longitude: '-2.1515259223112'
    };
    let latLng2 = {
        latitude: '52.8725662091762',
        longitude: '-2.152248931319753'
    };

    describe('bearingBetweenLocations testing', () => {
        test('bearingBetweenLocations', () => {
            expect(bearingBetweenLocations(latLng1, latLng2)).toBe(285.02093622944545);
            expect(bearingBetweenLocations(null, latLng2)).toBe(0);
            expect(bearingBetweenLocations(undefined, latLng2)).toBe(0);
            expect(bearingBetweenLocations(latLng1, null)).toBe(0);
            expect(bearingBetweenLocations(latLng1, undefined)).toBe(0);
            expect(bearingBetweenLocations(null, null)).toBe(0);
            expect(bearingBetweenLocations(undefined, undefined)).toBe(0);
            expect(bearingBetweenLocations({ latitude: 0, longitude: 0 }, undefined)).toBe(0);
            expect(bearingBetweenLocations({ latitude: 0, longitude: '' })).toBe(0);
        });
    });

    describe('fetchIntervalBasedOnDistanceInDelivery testing', () => {
        test('fetchIntervalBasedOnDistanceInDelivery', () => {
            expect(fetchIntervalBasedOnDistanceInDelivery(orderTrackingDetails)).toBe(10000);
            expect(fetchIntervalBasedOnDistanceInDelivery(null)).toBe(30000);
            expect(fetchIntervalBasedOnDistanceInDelivery(undefined)).toBe(30000);
            expect(fetchIntervalBasedOnDistanceInDelivery({})).toBe(30000);
            expect(fetchIntervalBasedOnDistanceInDelivery({ data: { delivery: {}, driver: {} } })).toBe(30000);
            expect(fetchIntervalBasedOnDistanceInDelivery({ data: {} })).toBe(30000);
            expect(fetchIntervalBasedOnDistanceInDelivery({ data: { delivery: null } })).toBe(30000);
            expect(
                fetchIntervalBasedOnDistanceInDelivery({
                    data: {
                        delivery: { latitude: '53.02', longitude: '-2.15' },
                        driver: {
                            locations: [
                                {
                                    lat: '50.872449107060994',
                                    lng: '-2.1515259223112',
                                    accuracy: 0
                                },
                                {
                                    lat: '52.8725662091762',
                                    lng: '-2.152248931319753',
                                    accuracy: 0
                                }
                            ]
                        }
                    }
                })
            ).toBe(30000);
            expect(
                fetchIntervalBasedOnDistanceInDelivery({
                    data: {
                        delivery: { latitude: '53.02', longitude: '-2.15' },
                        driver: {
                            locations: [
                                {
                                    lat: '54.872449107060994',
                                    lng: '-2.1515259223112',
                                    accuracy: 0
                                },
                                {
                                    lat: '54.8725662091762',
                                    lng: '-2.152248931319753',
                                    accuracy: 0
                                }
                            ]
                        }
                    }
                })
            ).toBe(30000);
        });
    });

    describe('getDriverDetails testing', () => {
        test('getDriverDetails', () => {
            expect(getDriverDetails(orderTrackingDetails.data.driver)).toEqual({
                currentSequence: 1,
                locations: [
                    {
                        latitude: 52.872449107060994,
                        longitude: -2.1515259223112
                    },
                    {
                        latitude: 52.8725662091762,
                        longitude: -2.152248931319753
                    },
                    {
                        latitude: 52.87268535177536,
                        longitude: -2.153002183093239
                    }
                ],
                name: 'Pavithra',
                phoneNo: '07446411868',
                photo:
                    'https://public.touch2success.com/1eae5d25813b23045b9525fc1f19fe6f/img/1625595189b3dff26d8922e172a1a42fac908f1c00.jpg',
                totalOrders: 1
            });
            expect(getDriverDetails(null)).toBe(null);
            expect(getDriverDetails(undefined)).toEqual(null);
            expect(getDriverDetails({})).toEqual({ locations: null });
            expect(getDriverDetails({ name: 'Test TA', phone: '7449290100' })).toEqual({
                locations: null,
                name: 'Test TA',
                phoneNo: '7449290100'
            });
            expect(
                getDriverDetails({
                    name: 'Test TA 2',
                    locations: [
                        { lat: 0.23, lng: -23.34 },
                        { lat: 2.324, lng: -36.343 }
                    ]
                })
            ).toEqual({
                locations: [
                    {
                        latitude: 0.23,
                        longitude: -23.34
                    },
                    {
                        latitude: 2.324,
                        longitude: -36.343
                    }
                ],
                name: 'Test TA 2'
            });
            expect(
                getDriverDetails({
                    name: 'Test TA 2',
                    locations: [{ lat: 0.23, lng: -23.34 }, {}]
                })
            ).toEqual({
                locations: [
                    {
                        latitude: 0.23,
                        longitude: -23.34
                    },
                    {
                        latitude: 0,
                        longitude: 0
                    }
                ],
                name: 'Test TA 2'
            });
        });
    });

    describe('getLatLngInterpolatePos testing', () => {
        test('getLatLngInterpolatePos', () => {
            expect(
                getLatLngInterpolatePos(
                    0.05,
                    getDriverDetails(orderTrackingDetails.data.driver).locations.slice(0, 2)[1],
                    getDriverDetails(orderTrackingDetails.data.driver).locations.slice(0, 2)[0]
                )
            ).toEqual({ latitude: 52.87256035417472, longitude: -2.1522127807766096 });
            expect(getLatLngInterpolatePos(null, { latitude: 2, longitude: -0.23 }, { latitude: 13.89, longitude: -2.455 })).toEqual({
                latitude: 2,
                longitude: -0.23
            });
            expect(getLatLngInterpolatePos(0, { latitude: 2.239, longitude: -0.343 }, { latitude: 0.236, longitude: -2.34 })).toEqual({
                latitude: 2.2389999999999994,
                longitude: -0.343
            });
            expect(getLatLngInterpolatePos(0.8, { latitude: 12.29, longitude: -0.3 }, { latitude: 0.93, longitude: -4.34 })).toEqual({
                latitude: 3.204149663217912,
                longitude: -3.544294734351686
            });
            expect(getLatLngInterpolatePos(0.8, { latitude: -2.29, longitude: -0.3 }, { latitude: 35.93, longitude: -108.34 })).toEqual({
                latitude: 36.33815828734957,
                longitude: -82.03811394368647
            });
            expect(getLatLngInterpolatePos(0.5, null, null)).toBe(null);
            expect(getLatLngInterpolatePos()).toBe();
        });
    });

    describe('computeAngleBetween Testing', () => {
        test('computeAngleBetween', () => {
            expect(computeAngleBetween(0, -13.245, 145.32, 34.56)).toBe(2.1382495400938164);
            expect(computeAngleBetween(null, 0, -2.3, undefined)).toBe(0);
            expect(computeAngleBetween()).toBe(0);
            expect(computeAngleBetween(0.45, 0, -21.23, -0.34)).toBe(2.725464028484634);
            expect(computeAngleBetween(null)).toBe(0);
            expect(computeAngleBetween(null, 'hi')).toBe(0);
        });
    });

    describe('updateReview testing', () => {
        test('updateReview', () => {
            expect(updateReview([orderList, order], review[0])).toEqual([{ ...orderList, review: review[0] }, order]);
            expect(updateReview([orderList, order], review[1])).toEqual([{ ...orderList, review: review[1] }, order]);
            expect(updateReview([orderList, order], review[2])).toEqual([orderList, { ...order, review: review[2] }]);
            expect(updateReview([], review[2])).toEqual([]);
            expect(updateReview(null, review[2])).toEqual();
            expect(updateReview(null, '')).toEqual();
            expect(updateReview([{ id: 22, name: 'TEST TA' }], null)).toEqual([
                {
                    id: 22,
                    name: 'TEST TA'
                }
            ]);
            expect(updateReview([], null)).toEqual([]);
            expect(updateReview([{ id: 22 }], { order_info_id: 23, message: 'Good service' })).toEqual([
                {
                    id: 22
                }
            ]);

            expect(
                updateReview([{ id: 22 }], {
                    order_info_id: 22,
                    message: 'good food',
                    delivery: '5',
                    food: '5',
                    name: 'Dave'
                })
            ).toEqual([
                {
                    id: 22,
                    review: {
                        delivery: '5',
                        food: '5',
                        message: 'good food',
                        name: 'Dave',
                        order_info_id: 22
                    }
                }
            ]);
        });
    });

    describe('getTitleTxt testing', () => {
        test('getTitleTxt', () => {
            expect(getTitleTxt(order, profile)).toBe('1 Stroke-on-trent, AA1 1AA');
            expect(getTitleTxt(null, profile)).toBe(null);
            expect(getTitleTxt(undefined, profile)).toBe(null);
            expect(getTitleTxt(order, null)).toBe('1 Stroke-on-trent, AA1 1AA');
            expect(getTitleTxt(order, undefined)).toBe('1 Stroke-on-trent, AA1 1AA');
            expect(getTitleTxt(null, null)).toBe(null);
            expect(getTitleTxt(undefined, undefined)).toBe(null);
            expect(getTitleTxt({}, {})).toBe(null);
            expect(getTitleTxt(orderResponse, profile)).toBe('Collection: Pavithra Purushothaman');
        });
    });

    describe('hasValidLatLong testing', () => {
        test('hasValidLatLong', () => {
            expect(hasValidLatLong(orderTrackingDetails)).toBe(true);
            expect(hasValidLatLong(null)).toBe(false);
            expect(hasValidLatLong(undefined)).toBe(false);
            expect(hasValidLatLong({})).toBe(false);
            expect(hasValidLatLong('HI')).toBe(false);
            expect(hasValidLatLong({ data: { name: 'test' } })).toBe(false);
            expect(hasValidLatLong({ data: { driver: {} } })).toBe(false);
            expect(hasValidLatLong({ data: { driver: { name: 'Susan', locations: [{ lat: 0.23, lng: -2.34 }] } } })).toBe(true);
            expect(hasValidLatLong({ data: { driver: { name: 'Susan', locations: [{ lat: 0.23, lng: -2.34 }, {}] } } })).toBe(true);
            expect(hasValidLatLong({ data: { driver: 0 } })).toBe(false);
        });
    });
    describe('getOrderStatusText Testing', () => {
        test('getOrderStatusText', () => {
            expect(getOrderStatusText(0)).toBe('PENDING');
            expect(getOrderStatusText(2)).toBe('ACCEPTED');
            expect(getOrderStatusText('')).toBe(null);
            expect(getOrderStatusText(3.5)).toBe('DELIVERED');
            expect(getOrderStatusText(null)).toBe(null);
        });
    });
    describe('getToastMessageForTakeawayOpenStatus testing', () => {
        const customFeatureGate = {
            order_type_toggle: {
                status: 'DISABLED',
                enable: false,
                options: {
                    default: 'delivery'
                }
            }
        };
        test('getToastMessageForTakeawayOpenStatus', () => {
            expect(getToastMessageForTakeawayOpenStatus(3, 'Hot KebabHALAL', featureGateResponse.data, 'Delivery', true, true)).toBe('');
            expect(getToastMessageForTakeawayOpenStatus(3, 'Hot KebabHALAL', featureGateResponse.data, 'Delivery', false, true)).not.toBe(
                ''
            );
            expect(getToastMessageForTakeawayOpenStatus(3, 'Hot KebabHALAL', featureGateResponse.data, 'Collection', true, true)).toBe('');

            expect(getToastMessageForTakeawayOpenStatus(3, 'Hot KebabHALAL', featureGateResponse.data, 'Collection', true, false)).not.toBe(
                ''
            );
            expect(getToastMessageForTakeawayOpenStatus(1, 'Hot KebabHALAL', featureGateResponse.data, 'Collection', true, false)).not.toBe(
                ''
            );
            expect(getToastMessageForTakeawayOpenStatus(1, 'Hot KebabHALAL', undefined, 'Collection', true, false)).not.toBe('');
            expect(getToastMessageForTakeawayOpenStatus(1, 'Test TA', featureGateResponse.data, 'Delivery', true, true)).toBe('');
            expect(getToastMessageForTakeawayOpenStatus(1, 'Test TA', customFeatureGate, 'Delivery', true, true)).toBe('');
            expect(getToastMessageForTakeawayOpenStatus(1, 'Test TA', customFeatureGate, 'Delivery', true, false)).toBe(
                "'Test TA'  is doing delivery order only"
            );
            expect(getToastMessageForTakeawayOpenStatus(4, 'Test TA', customFeatureGate, 'Collection', false, true)).toBe(
                "'Test TA'  is doing collection order only"
            );
            expect(getToastMessageForTakeawayOpenStatus(4, 'Test TA', customFeatureGate, null, false, true)).toBe(
                "'Test TA'  is doing collection order only"
            );
            expect(getToastMessageForTakeawayOpenStatus(4, 'Test TA', customFeatureGate, null, false, false)).toBe('');
        });
    });

    describe('formatLocationLatLng Testing', () => {
        test('formatLocationLatLng', () => {
            expect(formatLocationLatLng(null)).toBe(null);
            expect(formatLocationLatLng()).toBe(null);
            expect(formatLocationLatLng([{ lat: 2.03 }, { name: 'aks' }])).toStrictEqual([
                {
                    latitude: 2.03,
                    longitude: 0
                },
                {
                    latitude: 0,
                    longitude: 0
                }
            ]);
            expect(
                formatLocationLatLng([
                    { name: 'test', lat: 2.13, lng: '0.345' },
                    { name: 'test2', lat: 2.134, lng: '-1.23' }
                ])
            ).toStrictEqual([
                {
                    latitude: 2.13,
                    longitude: 0.345
                },
                {
                    latitude: 2.134,
                    longitude: -1.23
                }
            ]);
            expect(formatLocationLatLng([{}])).toStrictEqual([{ latitude: 0, longitude: 0 }]);
            expect(() => formatLocationLatLng('hii')).toThrowError('driverLocations.map is not a function');
        });
    });

    describe('getDeliveryTimeOrder Testing', () => {
        test('getDeliveryTimeOrder', () => {
            expect(getDeliveryTimeOrder([order], 485732841)).toBe('2021-07-29 11:44:34');
            expect(getDeliveryTimeOrder([order], 0)).toBe('');
            expect(getDeliveryTimeOrder([order], null)).toBe('');
            expect(getDeliveryTimeOrder([], '')).toBe('');
            expect(getDeliveryTimeOrder([], 485732841)).toBe('');
            expect(getDeliveryTimeOrder('', 485732841)).toBe('');
            expect(getDeliveryTimeOrder([order, orderList], 485732841)).toBe('2021-07-29 11:44:34');
            expect(getDeliveryTimeOrder([order, orderList], 319913998)).toBe('2020-12-24 19:04:25');
            expect(getDeliveryTimeOrder(null, 485732841)).toBe('');
            expect(getDeliveryTimeOrder(undefined, 485732841)).toBe('');
            expect(getDeliveryTimeOrder({ name: 'test' }, 485732841)).toBe('');
            expect(getDeliveryTimeOrder('test', 485732841)).toBe('');
            expect(getDeliveryTimeOrder('', 485732841)).toBe('');
        });
    });

    describe('getDeliveryTime Testing', () => {
        test('getDeliveryTime', () => {
            expect(getDeliveryTime({ name: 'Test' })).toBe();
            expect(getDeliveryTime({ name: 'Test', delivery_time: '2020-10-21 12:30' })).toBe('2020-10-21 12:30');
            expect(getDeliveryTime('')).toBe();
            expect(getDeliveryTime(null)).toBe();
            expect(getDeliveryTime({})).toBe();
            expect(getDeliveryTime(undefined)).toBe();
            expect(getDeliveryTime()).toBe();
        });
    });

    describe('getRefundAdditionalMessage Testing', () => {
        test('getRefundAdditionalMessage', () => {
            expect(getRefundAdditionalMessage('$', { total_paid_by_card: 20.0, total_paid_by_wallet: 5 })).toBe(
                '$5 will be credited to your wallet. $20 was paid through card,  how would you like to get it refunded?'
            );
            expect(getRefundAdditionalMessage('$', { total_paid_by_card: 2.0, total_paid_by_wallet: 0 })).toBe('');
            expect(getRefundAdditionalMessage('', { total_paid_by_card: 2.0, total_paid_by_wallet: 10.0 })).toBe(
                '10 will be credited to your wallet. 2 was paid through card,  how would you like to get it refunded?'
            );
            expect(getRefundAdditionalMessage(null, { total_paid_by_card: 2.0, total_paid_by_wallet: 10.0 })).toBe(
                '10 will be credited to your wallet. 2 was paid through card,  how would you like to get it refunded?'
            );
            expect(getRefundAdditionalMessage('$', { total_paid_by_card: 1.5 })).toBe('');
            expect(getRefundAdditionalMessage('$', {})).toBe('');
            expect(getRefundAdditionalMessage(null, null)).toBe('');
            expect(getRefundAdditionalMessage('', undefined)).toBe('');
            expect(getRefundAdditionalMessage(null, {})).toBe('');
            expect(getRefundAdditionalMessage('', 'hi')).toBe('');
            expect(getRefundAdditionalMessage()).toBe('');
        });
    });

    describe('isCollectionOrderType Testing', () => {
        test('isCollectionOrderType', () => {
            expect(isCollectionOrderType('collection')).toBe(true);
            expect(isCollectionOrderType('COLLECTION')).toBe(true);
            expect(isCollectionOrderType('TO')).toBe(false);
            expect(isCollectionOrderType(undefined)).toBe(false);
            expect(isCollectionOrderType('')).toBe(false);
            expect(isCollectionOrderType()).toBe(false);
            expect(isCollectionOrderType(null)).toBe(false);
        });
    });

    describe('getOrderStoreId Testing', () => {
        test('getOrderStoreId', () => {
            expect(getOrderStoreId(null)).toBe(false);
            expect(getOrderStoreId('')).toBe(false);
            expect(getOrderStoreId({})).toBe(false);
            expect(getOrderStoreId({ data: {} })).toBe(false);
            expect(getOrderStoreId({ data: null })).toBe(false);
            expect(getOrderStoreId({ data: { store: { id: 123 } } })).toBe(123);
            expect(getOrderStoreId({ data: { store: { id: null } } })).toBe(false);
            expect(getOrderStoreId()).toBe(false);
        });
    });

    describe('isDeliverOrder Testing', () => {
        test('isDeliverOrder', () => {
            expect(isDeliverOrder(null)).toBe(false);
            expect(isDeliverOrder('')).toBe(false);
            expect(isDeliverOrder({})).toBe(false);
            expect(isDeliverOrder({ sending: 'collection' })).toBe(false);
            expect(isDeliverOrder({ sending: 'TO' })).toBe(true);
            expect(isDeliverOrder({ sending: 'DELIVERY' })).toBe(false);
            expect(isDeliverOrder({ sending: 'to' })).toBe(true);
            expect(isDeliverOrder({ sending: '' })).toBe(false);
            expect(isDeliverOrder({ sending: null })).toBe(false);
        });
    });

    describe('getDeliveryTimeDelayText testing', () => {
        test('getDeliveryTimeDelayText', () => {
            expect(
                getDeliveryTimeDelayText({ data: previosOrder[0] }, [
                    {
                        orderId: 452767795,
                        storeID: 811111,
                        requestedTime: '2022-12-16T11:34:42.527Z',
                        isDeliveryTimeUpdated: false
                    }
                ])
            ).toBe("Wait we're trying to contact the takeaway");
            expect(
                getDeliveryTimeDelayText({ data: previosOrder[0] }, [
                    {
                        orderId: 452767795,
                        storeID: 811111,
                        requestedTime: '2022-04-06T11:34:42.527Z',
                        isDeliveryTimeUpdated: false
                    }
                ])
            ).toBe('It’s taking longer than usual, Takeaway maybe crowded right now');
            expect(
                getDeliveryTimeDelayText({ data: previosOrder[0] }, [
                    {
                        orderId: 452767795,
                        storeID: 811111,
                        requestedTime: '2022-04-06T12:01:09.117Z',
                        isDeliveryTimeUpdated: false
                    }
                ])
            ).toBe('Hold on a bit more, Takeaway is reviewing this order');
            expect(getDeliveryTimeDelayText(null, [])).toBe("Wait we're trying to contact the takeaway");
            expect(getDeliveryTimeDelayText(null)).toBe("Wait we're trying to contact the takeaway");
            expect(getDeliveryTimeDelayText({})).toBe("Wait we're trying to contact the takeaway");
        });
    });

    describe('getCurrentTimeInMS Testing', () => {
        test('getCurrentTimeInMS', () => {
            expect(getCurrentTimeInMS()).toBe(1649242918135);
            expect(getCurrentTimeInMS(null)).toBe(1649242918135);
            expect(getCurrentTimeInMS('')).toBe(1649242918135);
        });
    });

    describe('getRefundAmount Testing', () => {
        test('getRefundAmount', () => {
            expect(getRefundAmount('12.00')).toBe('12.00');
            expect(getRefundAmount(13)).toBe(13);
            expect(getRefundAmount(-1)).toBe('');
            expect(getRefundAmount('')).toBe('');
            expect(getRefundAmount(null)).toBe('');
            expect(getRefundAmount('hi')).toBe('');
            expect(getRefundAmount('12.90')).toBe('12.90');
            expect(getRefundAmount('0.0')).toBe('');
            expect(getRefundAmount(0)).toBe('');
            expect(getRefundAmount(NaN)).toBe('');
            expect(getRefundAmount({})).toBe('');
        });
    });

    describe('deg2rad Testing', () => {
        test('deg2rad', () => {
            expect(deg2rad(2)).toEqual(0.03490658503988659);
            expect(deg2rad(-2.3)).toBe(-0.04014257279586958);
            expect(deg2rad(1.0)).toBe(0.017453292519943295);
            expect(deg2rad(0)).toBe(0);
            expect(deg2rad('hi')).toBe(NaN);
            expect(deg2rad(null)).toBe(0);
            expect(deg2rad('')).toBe(0);
            expect(deg2rad(undefined)).toBe(NaN);
        });
    });

    describe('updatedDeliveryTime Testing', () => {
        test('updatedDeliveryTime', () => {
            expect(updatedDeliveryTime(null, {})).toStrictEqual([]);
            expect(
                updatedDeliveryTime(
                    [
                        { orderId: 12, sending: 'to' },
                        { orderId: 23, name: 'Test TA' }
                    ],
                    12
                )
            ).toEqual([
                { orderId: 12, sending: 'to' },
                { name: 'Test TA', orderId: 23 }
            ]);
            expect(
                updatedDeliveryTime(
                    [
                        { orderId: 12, sending: 'to' },
                        { orderId: 23, name: 'Test TA' }
                    ],
                    { orderId: 12, name: 'Test' }
                )
            ).toEqual([
                {
                    isDeliveryTimeUpdated: true,
                    orderId: 12,
                    sending: 'to'
                },
                {
                    name: 'Test TA',
                    orderId: 23
                }
            ]);
            expect(updatedDeliveryTime([], {})).toEqual([]);
            expect(updatedDeliveryTime([], { orderId: 12 })).toEqual([]);
            expect(updatedDeliveryTime([{ orderId: null }], { orderId: 12 })).toStrictEqual([
                {
                    orderId: null
                }
            ]);
        });
    });

    describe('getDistanceFromLatLonInKm Testing', () => {
        test('getDistanceFromLatLonInKm', () => {
            expect(getDistanceFromLatLonInKm(12.02, -3.34, 45.13, -2.44)).toBe(3682.656762497548);
            expect(getDistanceFromLatLonInKm(0, null, null, 0)).toBe(0);
            expect(getDistanceFromLatLonInKm(null, undefined, null, null)).toBe(0);
            expect(getDistanceFromLatLonInKm(null, -3.34, 0, -2.44)).toBe(100.07543398010284);
            expect(getDistanceFromLatLonInKm(null, undefined, null, -2.44)).toBe(NaN);
            expect(getDistanceFromLatLonInKm(null, '', null, null)).toBe(0);
            expect(getDistanceFromLatLonInKm(52.0)).toBe(NaN);
            expect(getDistanceFromLatLonInKm(12.02, 0, 0, -2.44)).toBe(1363.4256985761963);
            expect(getDistanceFromLatLonInKm(12.02, 13.09, 12.21, null)).toBe(1423.1433177420126);
            expect(getDistanceFromLatLonInKm(12.02, -3.32, 13.09, -3.14)).toBe(120.57181197622509);
        });
    });
});
