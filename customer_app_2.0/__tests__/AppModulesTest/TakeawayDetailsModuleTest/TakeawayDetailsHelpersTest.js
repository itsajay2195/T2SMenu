import {
    checkDeepLinkMenuParamsExist,
    getDateOfInspection,
    getHygienicRatingValueAndId,
    getRatingText,
    getTakeawayAddress
} from 'appmodules/TakeawayDetailsModule/Utils/TakeawayDetailsHelper';
import { rating } from '../data';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

let takeawayDetails = {
    storeConfigAddress: {
        town: 'Jerusalem',
        city: 'Paris',
        region: 'New york'
    },
    storeConfigNumber: '21 - 69',
    storeConfigPostcode: 'AA11AA',
    storeConfigTown: 'Stoke-On-Trent',
    storeConfigCity: 'Stroke On Trent',
    storeConfigStreet: 'Victoria Park Road'
};

describe('TakeawayDetailsHelpers Testing', () => {
    describe('getDateOfInspection Testing', () => {
        test('getDateOfInspection', () => {
            expect(getDateOfInspection(rating)).toBe('26 Nov 2019');
            expect(getDateOfInspection(null)).toBe(LOCALIZATION_STRINGS.DATE_NOT_AVAILABLE);
        });
    });

    describe('getHygienicRatingValueAndId Testing', () => {
        test('getHygienicRatingValueAndId', () => {
            expect(getHygienicRatingValueAndId(0)).toBe('0' + LOCALIZATION_STRINGS.URGENT_IMPROVEMENT_NECESSARY);
            expect(getHygienicRatingValueAndId(1)).toBe('1' + LOCALIZATION_STRINGS.MAJOR_IMPROVEMENT_NECESSARY);
            expect(getHygienicRatingValueAndId(2)).toBe('2' + LOCALIZATION_STRINGS.IMPROVEMENT_NECESSARY);
            expect(getHygienicRatingValueAndId(3)).toBe('3' + LOCALIZATION_STRINGS.SATISFACTORY);
            expect(getHygienicRatingValueAndId(4)).toBe('4' + LOCALIZATION_STRINGS.GOOD);
            expect(getHygienicRatingValueAndId(5)).toBe('5' + LOCALIZATION_STRINGS.VERY_GOOD);
            expect(getHygienicRatingValueAndId(6)).toBe('6');
            expect(getHygienicRatingValueAndId(null)).toBe('null');
        });
    });

    describe('getRatingText Testing', () => {
        test('getRatingText', () => {
            expect(getRatingText(0)).toBe(LOCALIZATION_STRINGS.URGENT_IMPROVEMENT_NECESSARY);
            expect(getRatingText(1)).toBe(LOCALIZATION_STRINGS.MAJOR_IMPROVEMENT_NECESSARY);
            expect(getRatingText(2)).toBe(LOCALIZATION_STRINGS.IMPROVEMENT_NECESSARY);
            expect(getRatingText(3)).toBe(LOCALIZATION_STRINGS.SATISFACTORY);
            expect(getRatingText(4)).toBe(LOCALIZATION_STRINGS.GOOD);
            expect(getRatingText(5)).toBe(LOCALIZATION_STRINGS.VERY_GOOD);
            expect(getRatingText(6)).toBe('');
            expect(getRatingText(null)).toBe('');
        });
    });

    describe('checkDeepLinkMenuParamsExist Testing', () => {
        test('checkDeepLinkMenuParamsExist', () => {
            expect(checkDeepLinkMenuParamsExist({ delivery_time: '20' })).toBe(false);
            expect(checkDeepLinkMenuParamsExist({ delivery_time: '20', rating: '20' })).toBe(false);
            expect(checkDeepLinkMenuParamsExist({ delivery_time: '20', collection_time: '10', rating: '2.3', total_reviews: 420 })).toBe(
                true
            );
            expect(checkDeepLinkMenuParamsExist('hi')).toBe(false);
            expect(checkDeepLinkMenuParamsExist({})).toBe(false);
            expect(() => checkDeepLinkMenuParamsExist(null)).toThrowError("Cannot read property 'delivery_time' of null");
        });
    });

    describe('getTakeawayAddress Testing', () => {
        test('getTakeawayAddress', () => {
            expect(
                getTakeawayAddress({
                    ...takeawayDetails
                })
            ).toBe('21 - 69, Victoria Park Road, Stroke On Trent, Stoke-On-Trent, AA11AA');
            expect(
                getTakeawayAddress({
                    ...takeawayDetails,
                    storeConfigAddress: undefined
                })
            ).toBe('21 - 69, Victoria Park Road, Stroke On Trent, Stoke-On-Trent, AA11AA');
            expect(
                getTakeawayAddress({
                    ...takeawayDetails,
                    storeConfigNumber: '15',
                    storeConfigCity: 'Stockholm'
                })
            ).toBe('15, Victoria Park Road, Stockholm, Stoke-On-Trent, AA11AA');
            expect(
                getTakeawayAddress({
                    storeConfigAddress: {
                        town: 'Jerusalem',
                        city: 'Paris',
                        region: 'New york'
                    },
                    storeConfigNumber: '21',
                    storeConfigPostcode: 'AA11AA'
                })
            ).toBe('21, New york, Jerusalem, AA11AA');
            expect(
                getTakeawayAddress({
                    storeConfigNumber: undefined,
                    storeConfigAddress: undefined,
                    storeConfigPostcode: 'AA11AA',
                    storeConfigCity: 'Stoke-On-Trent'
                })
            ).toBe('Stoke-On-Trent, AA11AA');
            expect(getTakeawayAddress({ storeConfigAddress: undefined, storeConfigNumber: '' })).toBe('');
            expect(() => getTakeawayAddress(null)).toThrowError("Cannot read property 'storeConfigAddress' of null");
            expect(getTakeawayAddress({})).toBe('');
        });
    });
});
