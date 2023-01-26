import { removeAlphabets, isForceUpdateAvailable, isOptionalUpdateAvailable } from 't2sbasemodule/Utils/helpers';

describe('T2SBaseModule Testing  ', () => {
    describe('removeAlphabets Testing', () => {
        test('removeAlphabets', () => {
            expect(removeAlphabets('1234')).toBe('1234');
            expect(removeAlphabets(null, [])).toBe('');
            expect(removeAlphabets('WED1234', [])).toBe('1234');
            expect(removeAlphabets('!@@aqwewe1234')).toBe('1234');
            expect(removeAlphabets('')).toBe('');
            expect(removeAlphabets(undefined)).toBe('');
        });
    });
    describe('isForceUpdateAvailable Testing', () => {
        test('isForceUpdateAvailable', () => {
            expect(isForceUpdateAvailable('10.11', false)).toEqual(true);
            expect(isForceUpdateAvailable('10.11', true)).toEqual(false);
        });
    });
    describe('isOptionalUpdateAvailable Testing', () => {
        test('isOptionalUpdateAvailable', () => {
            expect(isOptionalUpdateAvailable('10.12', false, false, false)).toEqual(true);
            expect(isOptionalUpdateAvailable('10.12', true, false, false)).toEqual(false);
            expect(isOptionalUpdateAvailable('10.12', true, true, false)).toEqual(false);
            expect(isOptionalUpdateAvailable('10.12', true, true, true)).toEqual(false);
            expect(isOptionalUpdateAvailable('10.12', false, true, true)).toEqual(false);
            expect(isOptionalUpdateAvailable('10.12', false, false, true)).toEqual(false);
            expect(isOptionalUpdateAvailable('10.12', false, true, false)).toEqual(false);
            expect(isOptionalUpdateAvailable('10.12', true, false, true)).toEqual(false);
            expect(isOptionalUpdateAvailable(null, false, false, false)).toEqual(false);
            expect(isOptionalUpdateAvailable(undefined, false, false, false)).toEqual(false);
        });
    });
});
