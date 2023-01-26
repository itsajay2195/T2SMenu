import { getUserName, showInformationAlert, getAPIAccessToken, getEmail, getPhoneNumber, getDarkColor } from 'appmodules/BaseModule/Helper';
import { profile } from '../data';
import { getFormattedTAPhoneNumber, getPhoneNumberNormalized } from 't2sbasemodule/Utils/helpers';

describe('BaseHelper Testing', () => {
    describe('getUserName Testing', () => {
        test('getUserName', () => {
            expect(getUserName({ first_name: '', last_name: '' })).toBe('');
            expect(getUserName({})).toBe('');
            expect(getUserName(null)).toBe('');
            expect(getUserName(undefined)).toBe('');
            expect(getUserName(profile)).toBe('Pavithra Purushothaman');
            expect(getUserName({ first_name: 'Pavithra', last_name: '' })).toBe('Pavithra');
            expect(getUserName({ first_name: '', last_name: 'Purushothaman' })).toBe('Purushothaman');
        });
    });

    describe('showInformationAlert Testing', () => {
        test('showInformationAlert', () => {
            expect(showInformationAlert('t', 'test')).toEqual({
                payload: { name: 'alert', params: { description: 'test', positiveButtonText: undefined, title: 't' } },
                type: 'NAVIGATE'
            });
            expect(showInformationAlert(null, null)).toEqual({
                payload: { name: 'alert', params: { description: null, positiveButtonText: undefined, title: null } },
                type: 'NAVIGATE'
            });
        });
    });

    test('separateCountryPrefix', () => {
        // US - Valid
        expect(getFormattedTAPhoneNumber('17182742087', 'US')).toEqual('(718) 274-2087');
        expect(getFormattedTAPhoneNumber('2012987481', 'US')).toEqual('(201) 298-7481');

        // UK - Valid
        expect(getFormattedTAPhoneNumber('448082711524', 'GB')).toEqual('0808 271 1524');
        expect(getFormattedTAPhoneNumber('08082711524', 'GB')).toEqual('0808 271 1524');
        expect(getFormattedTAPhoneNumber('07911123456', 'GB')).toEqual('07911 123456');
        expect(getFormattedTAPhoneNumber('01539620246', 'GB')).toEqual('015396 20246');
        expect(getFormattedTAPhoneNumber('03333231707', 'GB')).toEqual('0333 323 1707');

        // Ireland - Valid
        expect(getFormattedTAPhoneNumber('35318394460', 'IE')).toEqual('(01) 839 4460');
        expect(getFormattedTAPhoneNumber('018394460', 'IE')).toEqual('(01) 839 4460');

        // Guatemala - Valid
        expect(getFormattedTAPhoneNumber('50223618180', 'GT')).toEqual('2361 8180');
        expect(getFormattedTAPhoneNumber('023618180', 'GT')).toEqual('2361 8180');

        // Australia - Valid
        expect(getFormattedTAPhoneNumber('61292903814', 'AU')).toEqual('(02) 9290 3814');
        expect(getFormattedTAPhoneNumber('0292903814', 'AU')).toEqual('(02) 9290 3814');

        // US - Invalid
        expect(getFormattedTAPhoneNumber('20129874811', 'US')).toEqual('20129874811'); // invalid case
        expect(getFormattedTAPhoneNumber('201298748', 'US')).toEqual('201298748');
        expect(getFormattedTAPhoneNumber('120129874811', 'US')).toEqual('20129874811'); // invalid case
        expect(getFormattedTAPhoneNumber('1201298748', 'US')).toEqual('1201298748');
        // UK - invalid
        expect(getFormattedTAPhoneNumber('44808271152', 'GB')).toEqual('808271152');
        expect(getFormattedTAPhoneNumber('0808271152', 'GB')).toEqual('808271152');

        // US - Valid
        expect(getFormattedTAPhoneNumber('17182742087', 'US')).toEqual('(718) 274-2087');
        expect(getFormattedTAPhoneNumber('2012987481', 'US')).toEqual('(201) 298-7481');

        //International Format

        // US - Valid
        expect(getFormattedTAPhoneNumber('17182742087', 'US', true)).toEqual('+1 718 274 2087');

        // UK - Valid
        expect(getFormattedTAPhoneNumber('448082711524', 'GB', true)).toEqual('+44 808 271 1524');
        expect(getFormattedTAPhoneNumber('08082711524', 'GB', true)).toEqual('+44 808 271 1524');
        expect(getFormattedTAPhoneNumber('07911123456', 'GB', true)).toEqual('+44 7911 123456');
        expect(getFormattedTAPhoneNumber('01539620246', 'GB', true)).toEqual('+44 15396 20246');
        expect(getFormattedTAPhoneNumber('03333231707', 'GB', true)).toEqual('+44 333 323 1707');

        // Ireland - Valid
        expect(getFormattedTAPhoneNumber('35318394460', 'IE', true)).toEqual('+353 1 839 4460');
        expect(getFormattedTAPhoneNumber('018394460', 'IE', true)).toEqual('+353 1 839 4460');

        // Guatemala - Valid
        expect(getFormattedTAPhoneNumber('50223618180', 'GT', true)).toEqual('+502 2361 8180');
        expect(getFormattedTAPhoneNumber('023618180', 'GT', true)).toEqual('+502 2361 8180');

        // Australia - Valid
        expect(getFormattedTAPhoneNumber('61292903814', 'AU', true)).toEqual('+61 2 9290 3814');
        expect(getFormattedTAPhoneNumber('0292903814', 'AU', true)).toEqual('+61 2 9290 3814');
    });

    test('getPhoneNumberNormalized', () => {
        expect(getPhoneNumberNormalized('17182742087', 'US')).toEqual('+17182742087');
        expect(getPhoneNumberNormalized('2012987481', 'US')).toEqual('+12012987481');
        expect(getPhoneNumberNormalized('448082711524', 'GB')).toEqual('+448082711524');
        expect(getPhoneNumberNormalized('08082711524', 'GB')).toEqual('+448082711524');
        expect(getPhoneNumberNormalized('61292903814', 'AU')).toEqual('+61292903814');
        expect(getPhoneNumberNormalized('0292903814', 'AU')).toEqual('+61292903814');
    });

    describe('getAPIAccessToken Testing', () => {
        test('getAPIAccessToken', () => {
            expect(getAPIAccessToken(profile)).toBe('7b3edf45e792d265553e2c8c6b5e7f80');
            expect(getAPIAccessToken(null)).toBe('');
            expect(getAPIAccessToken(undefined)).toBe('');
            expect(getAPIAccessToken({})).toBe('');
            expect(getAPIAccessToken('')).toBe('');
        });
    });

    describe('getEmail Testing', () => {
        test('getEmail', () => {
            expect(getEmail(null)).toBe('');
            expect(getEmail(undefined)).toBe('');
            expect(getEmail({})).toBe('');
            expect(getEmail('')).toBe('');
            expect(getEmail(profile)).toBe('pavithra.p@touch2success.com');
        });
    });

    describe('getPhoneNumber Testing', () => {
        test('getPhoneNumber', () => {
            expect(getPhoneNumber(null)).toBe('');
            expect(getPhoneNumber(undefined)).toBe('');
            expect(getPhoneNumber({})).toBe('');
            expect(getPhoneNumber('')).toBe('');
            expect(getPhoneNumber(profile)).toBe('09842479693');
        });
    });
    describe('getDarkColor Testing', () => {
        test('getDarkColor', () => {
            expect(getDarkColor('#03020e')).toBe('#000000');
            expect(getDarkColor('#256000')).toBe('#000000');
            expect(getDarkColor('')).toBe('#000000');
            expect(getDarkColor(null)).toBe(null);
            expect(getDarkColor(undefined)).toBe(undefined);
        });
    });
});
