import { isMoreThan24Hours } from 't2sbasemodule/Utils/DateUtil';

describe('DateUtils Testing', () => {
    describe('isMoreThan24Hours Testing', () => {
        test('isMoreThan24Hours', () => {
            expect(isMoreThan24Hours('2022-10-1 00:00:00', 'Europe/London')).toEqual(true);
            expect(isMoreThan24Hours('2020-10-11 00:00:00', 'Australia/Sydney')).toEqual(false);
            expect(isMoreThan24Hours('2022-10-12', 'Europe/London')).toEqual(true);
            expect(isMoreThan24Hours(null, 'Europe/London')).toEqual(false);
            expect(isMoreThan24Hours('2022-10-21 00:00:00', null)).toEqual(true);
            expect(isMoreThan24Hours()).toEqual(false);
        });
    });
});
