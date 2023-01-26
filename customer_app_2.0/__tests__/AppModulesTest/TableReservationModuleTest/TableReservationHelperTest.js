import {
    formatSelectedTime,
    formatSelectedDate,
    hasChanges,
    isNoOfPeopleExceeded,
    isTableReservationEnabled
} from '../../../AppModules/TableReservationModule/Utils/TableReservationHelpers';
import { profile } from '../data';

describe('TableReservationHelpers Testing', () => {
    describe('formatSelectedTime Testing', () => {
        test('formatSelectedTime', () => {
            expect(formatSelectedTime('20-00')).toBe('08:00 PM');
            expect(formatSelectedTime('8-00')).toBe('08:00 AM');
            expect(formatSelectedTime(null)).toBe(null);
            expect(formatSelectedTime(undefined)).toBe(null);
        });
    });

    describe('formatSelectedDate Testing', () => {
        test('formatSelectedDate', () => {
            expect(formatSelectedDate('2021-05-06', '20:00')).toBe('2021-05-06');
            expect(formatSelectedDate('2021-05-06', null)).toBe('2021-05-06');
            expect(formatSelectedDate(null, '20:00')).toBe(null);
            expect(formatSelectedDate(null, null)).toBe(null);
        });
    });

    describe('hasChanges Testing', () => {
        test('hasChanges', () => {
            expect(
                hasChanges(
                    {
                        emailId: 'pavithra.p@touch2success.com',
                        firstName: 'Pavithra',
                        lastName: 'Purushothaman',
                        mobileNo: '09876543210',
                        selectedTime: '10:20',
                        noOfPersons: '5',
                        comments: 'test',
                        date: '2021-06-17'
                    },
                    { profileResponse: profile }
                )
            ).toBe(true);
            expect(hasChanges({}, {})).toBe(false);
        });
    });

    describe('isNoOfPeopleExceeded testing', () => {
        test('isNoOfPeopleExceeded', () => {
            expect(isNoOfPeopleExceeded(5, 10)).toBe(false);
            expect(isNoOfPeopleExceeded(15, 10)).toBe(true);
            expect(isNoOfPeopleExceeded(10, 10)).toBe(false);
            expect(isNoOfPeopleExceeded(null, 10)).toBe(false);
            expect(isNoOfPeopleExceeded(10, null)).toBe(true);
            expect(isNoOfPeopleExceeded(null, null)).toBe(false);
            expect(isNoOfPeopleExceeded(0, 0)).toBe(false);
        });
    });

    describe('isTableReservationEnabled testing', () => {
        test('isTableReservationEnabled', () => {
            expect(isTableReservationEnabled(null)).toBe(false);
            expect(isTableReservationEnabled()).toBe(false);
            expect(isTableReservationEnabled(0)).toBe(false);
            expect(isTableReservationEnabled(1)).toBe(true);
            expect(isTableReservationEnabled('1')).toBe(false);
            expect(isTableReservationEnabled(true)).toBe(false);
            expect(isTableReservationEnabled('')).toBe(false);
        });
    });
});
