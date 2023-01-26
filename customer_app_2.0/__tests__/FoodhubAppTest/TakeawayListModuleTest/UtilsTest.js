import { isDeliveryChargeAvailable, isFreeDelivery, isNashTakeaway } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { CONSTANTS } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';

describe('Take Testing', () => {
    describe('isNashTakeaway', () => {
        test('isNashTakeaway', () => {
            expect(isNashTakeaway(null)).toBe(false);
            expect(isNashTakeaway('test')).toBe(false);
            expect(isNashTakeaway(CONSTANTS.FALCON_DELIVERY)).toBe(true);
            expect(isNashTakeaway('')).toBe(false);
        });
    });
    describe('DeliveryCharge Testing', () => {
        let setDeliveryChargeValue = (value) => {
            return { charge: value };
        };
        test('isDeliveryChargeAvailable', () => {
            expect(isDeliveryChargeAvailable(null)).toBe(false);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue(0))).toBe(false);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue(undefined))).toBe(false);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue(0.0))).toBe(false);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue('0.0'))).toBe(false);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue(0.1))).toBe(true);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue(11.1))).toBe(true);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue('11.1'))).toBe(true);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue('0'))).toBe(false);
            expect(isDeliveryChargeAvailable(setDeliveryChargeValue(' '))).toBe(false);
            expect(isDeliveryChargeAvailable(undefined)).toBe(false);
        });
        test('isFreeDelivery', () => {
            expect(isFreeDelivery(null)).toBe(false);
            expect(isFreeDelivery(setDeliveryChargeValue(0))).toBe(true);
            expect(isFreeDelivery(setDeliveryChargeValue(undefined))).toBe(false);
            expect(isFreeDelivery(setDeliveryChargeValue(0.0))).toBe(true);
            expect(isFreeDelivery(setDeliveryChargeValue('0.0'))).toBe(true);
            expect(isFreeDelivery(setDeliveryChargeValue(0.1))).toBe(false);
            expect(isFreeDelivery(setDeliveryChargeValue(11.1))).toBe(false);
            expect(isFreeDelivery(setDeliveryChargeValue('11.1'))).toBe(false);
            expect(isFreeDelivery(setDeliveryChargeValue('0'))).toBe(true);
            expect(isFreeDelivery(setDeliveryChargeValue(''))).toBe(true);
            expect(isFreeDelivery(undefined)).toBe(false);
        });
    });
});
