import { checkConfirmPassword, formatName, getStoreIDForConsent, validName } from 'appmodules/AuthModule/Utils/AuthHelpers';
import { isFoodHubApp } from 't2sbasemodule/Utils/helpers';
import { s3Config } from '../data';

describe('LoginHelperModule Testing', () => {
    describe('checkConfirmPassword Testing', () => {
        test('checkConfirmPassword', () => {
            expect(checkConfirmPassword(null, null)).toBe(true);
            expect(checkConfirmPassword('', '')).toBe(true);
            expect(checkConfirmPassword(undefined, undefined)).toBe(true);
            expect(checkConfirmPassword('Test@123', 'Test@123')).toBe(true);
            expect(checkConfirmPassword(null, 'Test@1234')).toBe(false);
            expect(checkConfirmPassword('Test@123', null)).toBe(false);
        });
    });

    describe('validName Testing', () => {
        test('validName', () => {
            expect(validName(null)).toBe(undefined);
            expect(validName(undefined)).toBe(undefined);
            expect(validName('abc')).toBe(true);
            expect(validName('abc xyz')).toBe(true);
            expect(validName('x')).toBe(false);
            expect(validName('@')).toBe(false);
            expect(validName('.')).toBe(false);
            expect(validName(' ')).toBe(false);
            expect(validName('')).toBe(false);
        });
    });

    describe('formatName Testing', () => {
        test('formatName', () => {
            expect(formatName('abc')).toBe('abc');
            expect(formatName('abc xyz')).toBe('abc xyz');
            expect(formatName('abc9xyz')).toBe('abcxyz');
            expect(formatName('abc#yz')).toBe('abcyz');
            expect(formatName('')).toBe('');
            expect(formatName(null)).toBe('');
            expect(formatName(undefined)).toBe('');
        });
    });

    describe('getStoreIDForConsent Testing', () => {
        test('getStoreIDForConsent', () => {
            //to change the isFoodHubApp() config change it in __mock__/react-native-config.js
            if (isFoodHubApp()) {
                expect(getStoreIDForConsent(s3Config)).toBe('794891');
                expect(getStoreIDForConsent('')).toBe('794891');
                expect(getStoreIDForConsent(null)).toBe('794891');
                expect(getStoreIDForConsent(undefined)).toBe('794891');
                expect(getStoreIDForConsent()).toBe('794891');
                expect(getStoreIDForConsent('config')).toBe('794891');
            } else {
                const falseData = { config: { franchise: {} } };
                expect(getStoreIDForConsent(s3Config)).toBe(s3Config.config.franchise.store_id); //valid data
                expect(getStoreIDForConsent('')).toBe(undefined);
                expect(getStoreIDForConsent(falseData)).toBe(undefined); // invalid data missing store_id
                expect(getStoreIDForConsent(null)).toBe(undefined);
                expect(getStoreIDForConsent(undefined)).toBe(undefined);
            }
        });
    });
});
