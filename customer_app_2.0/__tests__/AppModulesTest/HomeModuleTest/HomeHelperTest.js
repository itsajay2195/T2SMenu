import {
    getReviewOrderID,
    isTakeawayClosed,
    isTakeawayOpen,
    isOurRecommendationsEnable,
    getPlacedDateTime,
    isStoreStatusClosed,
    isStoreAPIOptimisationEnabled
} from 'appmodules/HomeModule/Utils/HomeHelper';
import {
    advancedOpeningHoursData1,
    advancedOpeningHoursData2,
    advancedOpeningHoursData3,
    advancedOpeningHoursData4,
    advancedOpeningHoursData5,
    advancedOpeningHoursData6,
    advancedOpeningHoursData7,
    pendingOrder,
    previosOrder,
    storeConfig,
    storeStatusClosedData,
    storeStatusOpenData
} from '../data';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import {
    checkIfStoreOpenForOrderType,
    checkIsStoreClosed,
    getAvailableOpeningSlot,
    getTimeSlot
} from 'appmodules/BasketModule/Utils/BasketHelper';

describe('HomeHelper Testing', () => {
    describe('getReviewOrderID Testing', () => {
        test('getReviewOrderID', () => {
            expect(getReviewOrderID([], previosOrder)).toBe(452767795);
            expect(getReviewOrderID([], [])).toBe(0);
            expect(getReviewOrderID(pendingOrder, [])).toBe(0);
            expect(getReviewOrderID([], [])).toBe(0);
            expect(getReviewOrderID(null, null)).toBe(0);
            expect(getReviewOrderID(undefined, undefined)).toBe(0);
            expect(getReviewOrderID('', '')).toBe(0);
        });
    });

    describe('isTakeawayClosed Testing', () => {
        test('isTakeawayClosed', () => {
            expect(isTakeawayClosed(storeConfig)).toBe(false);
            expect(isTakeawayClosed(storeConfig?.store_status.restaurant)).toBe(true);
            expect(isTakeawayClosed(null)).toBe(false);
            expect(isTakeawayClosed(undefined)).toBe(false);
            expect(isTakeawayClosed('')).toBe(false);
        });
    });

    describe('isTakeawayOpen Testing', () => {
        test('isTakeawayOpen', () => {
            expect(
                isTakeawayOpen(storeConfig.store_status.delivery, storeConfig.store_status.collection, storeConfig.store_status.restaurant)
            ).toBe(false);
            storeConfig.store_status.delivery = 'open';
            expect(
                isTakeawayOpen(storeConfig.store_status.delivery, storeConfig.store_status.collection, storeConfig.store_status.restaurant)
            ).toBe(false);
            storeConfig.store_status.collection = 'open';
            expect(
                isTakeawayOpen(storeConfig.store_status.delivery, storeConfig.store_status.collection, storeConfig.store_status.restaurant)
            ).toBe(false);
            storeConfig.store_status.restaurant = 'open';
            expect(
                isTakeawayOpen(storeConfig.store_status.delivery, storeConfig.store_status.collection, storeConfig.store_status.restaurant)
            ).toBe(true);
            expect(isTakeawayOpen(null, storeConfig.store_status.collection, storeConfig.store_status.restaurant)).toBe(false);
            expect(isTakeawayOpen(storeConfig.store_status.delivery, null, storeConfig.store_status.restaurant)).toBe(false);
            expect(isTakeawayOpen(null)).toBe(false);
            expect(isTakeawayOpen(undefined)).toBe(false);
            expect(isTakeawayOpen('')).toBe(false);
        });
    });

    describe('isOurRecommendationsEnable Testing', () => {
        test('isOurRecommendationsEnable', () => {
            expect(isOurRecommendationsEnable(storeConfig.our_recommendations)).toBe(true);
            storeConfig.our_recommendations = 'DISABLED';
            expect(isOurRecommendationsEnable(storeConfig.our_recommendations)).toBe(false);
            expect(isOurRecommendationsEnable('')).toBe(false);
            expect(isOurRecommendationsEnable(undefined)).toBe(false);
            expect(isOurRecommendationsEnable(null)).toBe(false);
        });
    });
    describe('getPlacedDateTime Testing', () => {
        test('getPlacedDateTime', () => {
            expect(getPlacedDateTime(null)).toBe('Ordered on NA at NA');
            expect(getPlacedDateTime(undefined)).toBe('Ordered on NA at NA');
            expect(getPlacedDateTime('')).toBe('Ordered on Invalid date at Invalid date');
            expect(getPlacedDateTime('2021-11-11 08:48:16')).toBe('Ordered on 11 Nov at 08:48 AM');
            expect(getPlacedDateTime('2021-11-11 18:48:16')).toBe('Ordered on 11 Nov at 06:48 PM');
            expect(getPlacedDateTime('2021-11-29 18:48:16')).toBe('Ordered on 29 Nov at 06:48 PM');
            expect(getPlacedDateTime('2021-29-11 18:48:16')).toBe('Ordered on Invalid date at Invalid date');
        });
    });
    describe('storeStatusClosed Testing', () => {
        //Set mockdate 2022-10-06T11:00:30+01:00 before run the below test case
        test('isStoreStatusClosed', () => {
            expect(isStoreStatusClosed(null, null)).toBe(false);
            expect(isStoreStatusClosed(null, ORDER_TYPE.DELIVERY)).toBe(false);
            expect(isStoreStatusClosed(null, ORDER_TYPE.COLLECTION)).toBe(false);
            expect(isStoreStatusClosed(storeStatusOpenData, null)).toBe(false);
            expect(isStoreStatusClosed(storeStatusOpenData, ORDER_TYPE.DELIVERY)).toBe(false);
            expect(isStoreStatusClosed(storeStatusClosedData, ORDER_TYPE.DELIVERY)).toBe(true);
            expect(isStoreStatusClosed(storeStatusOpenData, ORDER_TYPE.COLLECTION)).toBe(false);
            expect(isStoreStatusClosed(storeStatusClosedData, ORDER_TYPE.COLLECTION)).toBe(true);
        });
        test('checkIsStoreClosed', () => {
            expect(checkIsStoreClosed(null, null)).toBe(false);
            expect(checkIsStoreClosed(undefined, 'Europe/London')).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData1, null)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData1, 'Europe/London', ORDER_TYPE.COLLECTION)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData2, 'Europe/London', ORDER_TYPE.COLLECTION)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData3, 'Europe/London', ORDER_TYPE.DELIVERY)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData4, 'Europe/London', ORDER_TYPE.DELIVERY)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData5, 'Europe/London', ORDER_TYPE.DELIVERY)).toBe(true);
            expect(checkIsStoreClosed(advancedOpeningHoursData6, 'Europe/London', ORDER_TYPE.DELIVERY)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData7, 'Europe/London', ORDER_TYPE.DELIVERY)).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData7, 'America/Chicago')).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData7, 'Australia/Sydney')).toBe(false);
            expect(checkIsStoreClosed(advancedOpeningHoursData7, 'Asia/Tokyo')).toBe(false);
        });
        test('getAvailableOpeningSlot', () => {
            let currentTime = 11 * 60;
            expect(getAvailableOpeningSlot(null, null)).toEqual(null);
            expect(getAvailableOpeningSlot(undefined, currentTime)).toEqual(null);
            expect(getAvailableOpeningSlot(advancedOpeningHoursData1.Collection.THU, null)).toEqual(null);
            expect(getAvailableOpeningSlot(advancedOpeningHoursData1.Collection.THU, currentTime)).toEqual('02:00 - 23:59');
            expect(getAvailableOpeningSlot(advancedOpeningHoursData2.Delivery.THU, currentTime)).toEqual('THU 02:00 - 13:00');
            expect(getAvailableOpeningSlot(advancedOpeningHoursData3.Delivery.THU, currentTime)).toEqual(undefined);
            expect(getAvailableOpeningSlot(advancedOpeningHoursData4.Delivery.THU, currentTime)).toEqual(undefined);
            expect(getAvailableOpeningSlot(advancedOpeningHoursData5.Delivery.THU, currentTime)).toEqual(undefined);
            expect(getAvailableOpeningSlot(advancedOpeningHoursData6.Delivery.THU, currentTime)).toEqual('10:00 - 23:59');
            expect(getAvailableOpeningSlot(advancedOpeningHoursData6.Collection.THU, currentTime)).toEqual('11:00 - 23:59');
            expect(getAvailableOpeningSlot(advancedOpeningHoursData7.Collection.THU, currentTime)).toEqual(null);
            expect(getAvailableOpeningSlot(['06:00 - 02:00'], 300)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['00:00 - 00:00'], 300)).toEqual('00:00 - 00:00');
            expect(getAvailableOpeningSlot(['00:00 - 00:30'], 300)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['00:00 - 00:30'], 25)).toEqual('00:00 - 00:30');
            expect(getAvailableOpeningSlot(['08:00 - 00:30'], 1000)).toEqual('08:00 - 00:30');
            expect(getAvailableOpeningSlot(['08:00 - 14:30', '20:00 - 02:00'], 740)).toEqual('08:00 - 14:30');
            expect(getAvailableOpeningSlot(['08:00 - 14:30', '20:00 - 02:00'], 960)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['08:00 - 14:30', '20:00 - 02:00'], 0)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['08:00 - 14:30', '20:00 - 02:00'], 30)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['08:00 - 00:30'], 20, true)).toEqual('08:00 - 00:30');
            expect(getAvailableOpeningSlot(['08:00 - 00:30'], 480)).toEqual('08:00 - 00:30');
            expect(getAvailableOpeningSlot(['08:00 - 00:30'], 479)).toEqual('08:00 - 00:30');
            expect(getAvailableOpeningSlot(['08:00 - 00:30'], 478)).toEqual('08:00 - 00:30');
            expect(getAvailableOpeningSlot(['08:00 - 00:30'], 477)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['08:00 - 14:00'], 840)).toEqual('08:00 - 14:00');
            expect(getAvailableOpeningSlot(['08:00 - 14:00'], 841)).toEqual('08:00 - 14:00');
            expect(getAvailableOpeningSlot(['08:00 - 14:00'], 842)).toEqual(undefined);
            expect(getAvailableOpeningSlot(['00:00 - 00:00'], 0)).toEqual('00:00 - 00:00');
            expect(getAvailableOpeningSlot(['00:00 - 00:00'], 1)).toEqual('00:00 - 00:00');
            expect(getAvailableOpeningSlot(['00:00 - 00:00'], 1440)).toEqual('00:00 - 00:00');
            expect(getAvailableOpeningSlot(['00:00 - 00:00'], 1439)).toEqual('00:00 - 00:00');
            expect(getAvailableOpeningSlot(['00:00 - 00:00'], 1438)).toEqual('00:00 - 00:00');
        });

        test('checkIfStoreOpenForOrderType', () => {
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 1, 400)).toEqual(false);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 1, 700)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 2, 20)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 2, 400)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 3, 400)).toEqual(false);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 4, 400)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 5, 400)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 6, 400)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 7, 400)).toEqual(false);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 1, 100)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Delivery, 1, 360)).toEqual(false);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Collection, 7, 180)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Collection, 7, 20)).toEqual(true);
            expect(checkIfStoreOpenForOrderType(advancedOpeningHoursData5.Collection, 7, 90)).toEqual(false);
        });

        test('getTimeSlot', () => {
            expect(getTimeSlot('')).toEqual(null);
            expect(getTimeSlot(null)).toEqual(null);
            expect(getTimeSlot('closed')).toEqual(null);
            expect(getTimeSlot('12:12')).toEqual(null);
            expect(getTimeSlot('12:12-10.30')).toEqual([732, 0]);
            expect(getTimeSlot('00:12 - 4:00')).toEqual([12, 240]);
            expect(getTimeSlot('00:00 - 00:00')).toEqual([0, 0]);
            expect(getTimeSlot('00:00 - 12:00')).toEqual([0, 720]);
            expect(getTimeSlot('00:00 - 12:45')).toEqual([0, 765]);
            expect(getTimeSlot('00:00 - 12:99')).toEqual([0, 779]);
            expect(getTimeSlot('00:00 - 12:59')).toEqual([0, 779]);
            expect(getTimeSlot('00:00 - 12.59')).toEqual([0, 0]);
        });
    });

    describe('isStoreAPIOptimisationEnabled Testing', () => {
        test('isStoreAPIOptimisationEnabled', () => {
            expect(isStoreAPIOptimisationEnabled(null)).toBe(false);
            expect(isStoreAPIOptimisationEnabled(undefined)).toBe(false);
            expect(isStoreAPIOptimisationEnabled('')).toBe(false);
            expect(isStoreAPIOptimisationEnabled(0)).toBe(false);
            expect(isStoreAPIOptimisationEnabled({})).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: null })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: undefined })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: '' })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: 'true' })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: 0 })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: 1 })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: {} })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: false })).toBe(false);
            expect(isStoreAPIOptimisationEnabled({ enable: true })).toBe(true);
        });
    });
});
