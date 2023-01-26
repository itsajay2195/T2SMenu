import {
    getCurrentLoyaltyPoints,
    getLoyaltyTransactionText,
    getOrderValuePointsTransactions
} from 'appmodules/LoyaltyPointsModule/Utils/LoyaltyHelper';
import { loyaltyPoints, loyaltyTransaction } from '../data';

describe('LoyaltyPointsHelper Testing', () => {
    describe('getCurrentLoyaltyPoints testing', () => {
        test('getCurrentLoyaltyPoints', () => {
            expect(getCurrentLoyaltyPoints(undefined)).toBe(0);
            expect(getCurrentLoyaltyPoints(loyaltyPoints)).toBe(8);
            expect(getCurrentLoyaltyPoints(null)).toBe(0);
        });
    });

    describe('getOrderValuePointsTransactions Testing', () => {
        test('getOrderValuePointsTransactions', () => {
            expect(getOrderValuePointsTransactions(null, null, null)).toBe('');
            expect(getOrderValuePointsTransactions(loyaltyTransaction, '$', loyaltyPoints.category_info)).toBe('$5.45');
            expect(getOrderValuePointsTransactions(null, '$', loyaltyPoints.category_info)).toBe('');
            expect(getOrderValuePointsTransactions(loyaltyTransaction, '$', null)).toBe('');
            expect(getOrderValuePointsTransactions(loyaltyTransaction, null, loyaltyPoints.category_info)).toBe('5.45');
            expect(getOrderValuePointsTransactions({ category_id: 1, comments: 'Good !!!' }, null, loyaltyPoints.category_info)).toBe(
                'Initial app download'
            );
        });
    });

    describe('getLoyaltyTransactionText testing', () => {
        test('getLoyaltyTransactionText', () => {
            expect(getLoyaltyTransactionText(null, null)).toBe(undefined);
            expect(getLoyaltyTransactionText(1, loyaltyPoints.category_info)).toBe('Initial app download');
            expect(getLoyaltyTransactionText(3, loyaltyPoints.category_info)).toBe('Order value points');
        });
    });
});
