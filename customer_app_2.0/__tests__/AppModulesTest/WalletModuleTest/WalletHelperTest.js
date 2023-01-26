import { getWalletFormattedDate, getTransactionName } from '../../../FoodHubApp/WalletModule/Utils/WalletHelper';
import { orderData, transactionItem } from '../data';
import { isWalletOrder } from 'appmodules/SupportModule/Utils/SupportHelpers';

describe('WalletHelpers Testing', () => {
    describe('getWalletFormattedDate Testing', () => {
        test('getWalletFormattedDate', () => {
            expect(getWalletFormattedDate(null)).toBe('NA');
            expect(getWalletFormattedDate(undefined)).toBe('NA');
            expect(getWalletFormattedDate('2021-04-27 11:33:13')).toBe('27 Apr, 11:33');
            expect(getWalletFormattedDate('2021-04-27')).toBe('27 Apr, 00:00');
        });
    });

    describe('getTransactionName Testing', () => {
        test('getTransactionName', () => {
            expect(getTransactionName(transactionItem[0])).toBe('Paid for Order ID 437260251');
            expect(getTransactionName(transactionItem[1])).toBe('Deposited by FH');
            expect(getTransactionName(transactionItem[2])).toBe('Deposited by FH for Order ID 437260252');
            expect(getTransactionName(transactionItem[3])).toBe('Refunded for Order ID 437260253');
            expect(getTransactionName(null)).toBe('');
            expect(getTransactionName(undefined)).toBe('');
        });
    });

    describe('isWalletOrder Testing', () => {
        test('isWalletOrder', () => {
            expect(isWalletOrder(null)).toBe(false);
            expect(isWalletOrder(undefined)).toBe(false);
            expect(isWalletOrder(orderData[0])).toBe(false);
            expect(isWalletOrder(orderData[1])).toBe(false);
            expect(isWalletOrder(orderData[2])).toBe(false);
            expect(isWalletOrder(orderData[3])).toBe(false);
            expect(isWalletOrder(orderData[4])).toBe(false);
            expect(isWalletOrder(orderData[5])).toBe(false);
            expect(isWalletOrder(orderData[6])).toBe(true);
        });
    });
});
