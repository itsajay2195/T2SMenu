import {
    getUpdatedProfileResponse,
    getActualValues,
    isFieldValuesChanged,
    fetchSMSSubscriptionStatus,
    fetchEmailSubscriptionStatus,
    validateProfileStates,
    validateProfileFields,
    getPrefixedCountryCode,
    fetchNotificationSubscriptionStatus,
    checkNetworkInterruptionError
} from 'appmodules/ProfileModule/Utils/ProfileHelper';
import { profile, s3Config } from '../data';

let props = { profileResponse: { ...profile } };
let state = {
    emailId: 'pavithra.p@touch2success.com',
    firstName: 'Pavithra',
    inValidFirstName: false,
    inValidLastName: false,
    lastName: 'Purushothaman',
    phone: '9842479693',
    showEmptyFirstNameError: false,
    showEmptyLastNameError: false,
    showUnsavedChangedPopUp: false,
    showValidEmailIdError: false,
    showValidPhoneError: false
};

describe('ProfileHelper Testing', () => {
    describe('getUpdatedProfileResponse Testing', () => {
        test('getUpdatedProfileResponse', () => {
            expect(getUpdatedProfileResponse(profile, 'is_subscribed_sms', 'NO')).toBe(profile);
            expect(getUpdatedProfileResponse(profile, 'is_subscribed_sms', 'YES')).toBe(profile);
            expect(getUpdatedProfileResponse(undefined, '', '')).toBe(undefined);
            expect(getUpdatedProfileResponse(profile, 'is_subscribed_email', 'NO')).toBe(profile);
            expect(getUpdatedProfileResponse(profile, 'is_subscribed_email', 'YES')).toBe(profile);
            expect(getUpdatedProfileResponse(null, '', '')).toBe(null);
            expect(getUpdatedProfileResponse(undefined, undefined, null)).toBe(undefined);
            expect(getUpdatedProfileResponse(undefined, {}, null)).toBe(undefined);
            expect(getUpdatedProfileResponse({}, [], null)).toStrictEqual({});
            expect(getUpdatedProfileResponse({}, [], undefined)).toStrictEqual({});
            expect(getUpdatedProfileResponse({}, [], {})).toStrictEqual({});
            expect(getUpdatedProfileResponse([], [], [])).toStrictEqual([]);
            expect(getUpdatedProfileResponse({}, [], [])).toStrictEqual({});
        });
    });

    describe('getActualValues Testing', () => {
        test('getActualValues', () => {
            expect(getActualValues(props)).toEqual({});
            expect(getActualValues([])).toStrictEqual({});
            expect(getActualValues({})).toStrictEqual({});
            expect(getActualValues(null)).toStrictEqual({});
            expect(getActualValues(undefined)).toStrictEqual({});
            expect(getActualValues({ profileResponse: [] })).toStrictEqual({});
            expect(getActualValues({ profileResponse: {} })).toStrictEqual({});
            expect(getActualValues({ profileResponse: null })).toStrictEqual({});
            expect(getActualValues({ profileResponse: undefined })).toStrictEqual({});
        });
    });

    describe('validateProfileStates Testing', () => {
        test('validateProfileStates', () => {
            expect(validateProfileStates(state, props)).toEqual({
                inValidFirstName: false,
                inValidLastName: false,
                showEmptyFirstNameError: false,
                showEmptyLastNameError: false,
                showValidEmailIdError: false,
                showValidPhoneError: false
            });
            expect(validateProfileStates(state, {})).toEqual({
                inValidFirstName: false,
                inValidLastName: false,
                showEmptyFirstNameError: false,
                showEmptyLastNameError: false,
                showValidEmailIdError: false,
                showValidPhoneError: false
            });
            expect(validateProfileStates({}, {})).toEqual({
                inValidFirstName: true,
                inValidLastName: true,
                showEmptyFirstNameError: true,
                showEmptyLastNameError: true,
                showValidEmailIdError: true,
                showValidPhoneError: true
            });
            expect(validateProfileStates(undefined, undefined)).toEqual({});
            expect(validateProfileStates(state, undefined)).toEqual({});
            expect(validateProfileStates(undefined, props)).toEqual({});
        });
    });

    describe('fetchSMSSubscriptionStatus Testing', () => {
        test('fetchSMSSubscriptionStatus', () => {
            expect(fetchSMSSubscriptionStatus(profile)).toBe(true);
            expect(fetchSMSSubscriptionStatus(null)).toBe(false);
            expect(fetchSMSSubscriptionStatus(undefined)).toBe(false);
            expect(fetchSMSSubscriptionStatus({})).toBe(false);
            expect(fetchSMSSubscriptionStatus(state)).toBe(false);
            expect(fetchSMSSubscriptionStatus(props)).toBe(false);
        });
    });

    describe('isFieldValuesChanged Testing', () => {
        test('isFieldValuesChanged', () => {
            expect(isFieldValuesChanged(props, state)).toBe(false);
            expect(isFieldValuesChanged(props, undefined)).toBe(false);
            expect(isFieldValuesChanged(undefined, state)).toBe(false);
            expect(isFieldValuesChanged(null, state)).toBe(false);
            expect(isFieldValuesChanged(props, null)).toBe(false);
            expect(isFieldValuesChanged(null, null)).toBe(false);
            expect(isFieldValuesChanged({}, {})).toBe(false);
            expect(isFieldValuesChanged({}, state)).toBe(false);
            expect(isFieldValuesChanged(props, {})).toBe(true);
        });
    });

    describe('fetchEmailSubscriptionStatus Testing', () => {
        test('fetchEmailSubscriptionStatus', () => {
            expect(fetchEmailSubscriptionStatus(profile)).toBe(true);
            expect(fetchEmailSubscriptionStatus(null)).toBe(false);
            expect(fetchEmailSubscriptionStatus(undefined)).toBe(false);
            expect(fetchEmailSubscriptionStatus({})).toBe(false);
            expect(fetchEmailSubscriptionStatus(state)).toBe(false);
            expect(fetchEmailSubscriptionStatus(state)).toBe(false);
            expect(fetchEmailSubscriptionStatus(props)).toBe(false);
        });
    });

    describe('fetchNotificationSubscriptionStatus Testing', () => {
        test('fetchNotificationSubscriptionStatus', () => {
            expect(fetchNotificationSubscriptionStatus(profile)).toBe(false);
            expect(fetchNotificationSubscriptionStatus(null)).toBe(false);
            expect(fetchNotificationSubscriptionStatus(undefined)).toBe(false);
            expect(fetchNotificationSubscriptionStatus(state)).toBe(false);
            expect(fetchNotificationSubscriptionStatus(props)).toBe(false);
            expect(fetchNotificationSubscriptionStatus({})).toBe(false);
            expect(fetchNotificationSubscriptionStatus([])).toBe(false);
        });
    });

    describe('validateProfileFields Testing', () => {
        test('validateProfileFields', () => {
            expect(validateProfileFields(state, props)).toBe(false);
            expect(validateProfileFields(undefined, props)).toBe(false);
            expect(validateProfileFields(null, props)).toBe(false);
            expect(validateProfileFields(state, null)).toBe(false);
            expect(validateProfileFields(state, undefined)).toBe(false);
            expect(validateProfileFields(undefined, null)).toBe(false);
            expect(validateProfileFields({}, {})).toBe(false);
        });
    });

    describe('getPrefixedCountryCode Testing', () => {
        test('getPrefixedCountryCode', () => {
            expect(getPrefixedCountryCode(s3Config.country.id, '9876543210')).toBe('09876543210');
            expect(getPrefixedCountryCode(s3Config, '9')).toBe('9');
            expect(getPrefixedCountryCode(null, '')).toBe('');
            expect(getPrefixedCountryCode(s3Config, '')).toBe('');
        });
    });

    describe('checkNetworkInterruptionError Testing', () => {
        test('checkNetworkInterruptionError', () => {
            expect(checkNetworkInterruptionError('')).toBe(undefined);
            expect(checkNetworkInterruptionError(null)).toBe(undefined);
            expect(checkNetworkInterruptionError(undefined)).toBe(undefined);
            //as this function doesn't return any value, the expected result will be undefined only for any value
            expect(checkNetworkInterruptionError({ type: 'NETWORK_ERROR' })).toBe(undefined);
            expect(checkNetworkInterruptionError({ type: ' ' })).toBe(undefined);
            expect(checkNetworkInterruptionError({ type: null })).toBe(undefined);
            expect(checkNetworkInterruptionError({ type: undefined })).toBe(undefined);
            expect(checkNetworkInterruptionError({ type: 0 })).toBe(undefined);
            expect(checkNetworkInterruptionError({ type: {} })).toBe(undefined);
        });
    });
});
