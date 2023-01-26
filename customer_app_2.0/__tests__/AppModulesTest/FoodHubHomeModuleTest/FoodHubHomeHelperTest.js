import {
    ValidatePostCodeUK,
    getModifiedName,
    getModifiedRating,
    getModifiedReviews,
    getModifiedImageURL,
    getRecentOrderedDate,
    randomSessionToken,
    extractValueString,
    renderSummaryItems,
    getTakeawayImage,
    getLatestOrder,
    getPostCodeFromRecentOrder,
    isPendingOrderNotAvailable
} from '../../../FoodHubApp/HomeModule/Utils/Helper';
import { pendingOrders, previosOrders, summaryItem } from '../data';

describe('FoodHubHomeHelper Testing', () => {
    describe('ValidatePostCodeUK Testing', () => {
        test('ValidatePostCodeUK', () => {
            expect(ValidatePostCodeUK('ST66DX')).toBe(true);
            expect(ValidatePostCodeUK('st66dx')).toBe(true);
            expect(ValidatePostCodeUK('st6 6dx')).toBe(true);
            expect(ValidatePostCodeUK('ST6 6DX')).toBe(true);
            expect(ValidatePostCodeUK('605105')).toBe(false);
            expect(ValidatePostCodeUK('000000')).toBe(false);
            expect(ValidatePostCodeUK(null)).toBe(false);
            expect(ValidatePostCodeUK(undefined)).toBe(false);
            expect(ValidatePostCodeUK('')).toBe(false);
        });
    });

    describe('getModifiedName Testing', () => {
        test('getModifiedName', () => {
            expect(getModifiedName('abcdefghijkl')).toBe('abcdefghij');
            expect(getModifiedName('abcdefghi')).toBe('abcdefghi');
            expect(getModifiedName(null)).toBe('');
            expect(getModifiedName(undefined)).toBe('');
            expect(getModifiedName('')).toBe('');
        });
    });

    describe('getModifiedRating Testing', () => {
        test('getModifiedRating', () => {
            expect(getModifiedRating('0')).toBe('0.0');
            expect(getModifiedRating('1')).toBe('1.0');
            expect(getModifiedRating(0)).toBe('0.0');
            expect(getModifiedRating(1)).toBe('1.0');
            expect(getModifiedRating(1.2)).toBe('1.2');
            expect(getModifiedRating(1.25)).toBe('1.3');
            expect(getModifiedRating('')).toBe('0.0');
            expect(getModifiedRating(null)).toBe('0.0');
            expect(getModifiedRating(undefined)).toBe('0.0');
        });
    });

    describe('getModifiedReviews Testing', () => {
        test('getModifiedReviews', () => {
            expect(getModifiedReviews(12)).toBe(12);
            expect(getModifiedReviews(1)).toBe(1);
            expect(getModifiedReviews(0)).toBe(0);
            expect(getModifiedReviews('1')).toBe(1);
            expect(getModifiedReviews(null)).toBe(0);
            expect(getModifiedReviews(undefined)).toBe(0);
            expect(getModifiedReviews('')).toBe(0);
        });
    });

    const image_url =
        'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg';
    describe('getModifiedImageURL Testing', () => {
        test('getModifiedImageURL', () => {
            expect(getModifiedImageURL(null)).toBe('');
            expect(getModifiedImageURL(undefined)).toBe('');
            expect(getModifiedImageURL('')).toBe('');
            expect(getModifiedImageURL(image_url)).toBe(image_url);
        });
    });

    describe('getRecentOrderedDate Testing', () => {
        test('getRecentOrderedDate', () => {
            expect(getRecentOrderedDate(null, null)).toBe('');
            expect(getRecentOrderedDate('', '')).toBe('');
            expect(getRecentOrderedDate(undefined, undefined)).toBe('');
            expect(getRecentOrderedDate('2021-04-27 13:11:20', 'Asia/Kolkata')).toBe('27 Apr');
            expect(getRecentOrderedDate('2021-04-27', 'Asia/Kolkata')).toBe('27 Apr');
            expect(getRecentOrderedDate('2021-04-27', null)).toBe('27 Apr');
        });
    });

    describe('randomSessionToken Testing', () => {
        test('randomSessionToken', () => {
            expect(randomSessionToken().length).toBe(36);
        });
    });

    describe('extractValueString Testing', () => {
        test('extractValueString', () => {
            expect(extractValueString({ value: 'test' })).toBe('test');
            expect(extractValueString(null)).toBe('');
            expect(extractValueString(undefined)).toBe('');
            expect(extractValueString('')).toBe('');
            expect(extractValueString({ value: '' })).toBe('');
            expect(extractValueString({})).toBe('');
        });
    });
    // TODO: Unable to run test cases, getting 'Cannot find module' error
    describe('renderSummaryItems Testing', () => {
        test('renderSummaryItems', () => {
            expect(renderSummaryItems(summaryItem)).toBe('T20. Green Curry Chicken, T16. Red Curry Chicken');
            expect(renderSummaryItems({ items: [], addons: [], missing_items: [], missing_addons: [] })).toBe('');
            expect(renderSummaryItems(null)).toBe('');
            expect(renderSummaryItems(undefined)).toBe('');
            expect(renderSummaryItems('')).toBe('');
        });
    });
    describe('getTakeawayImage Testing', () => {
        test('getTakeawayImage', () => {
            expect(
                getTakeawayImage({
                    store: {
                        website_logo_url: 'https://public.touch2success.com/static/core/img/03.png',
                        portal_setting: {
                            logo_url: 'https://public.touch2success.com/static/core/img/03.jpg'
                        }
                    }
                })
            ).toBe('https://public.touch2success.com/static/core/img/03.png');
            expect(
                getTakeawayImage({
                    store: {
                        portal_setting: {
                            logo_url: 'https://public.touch2success.com/static/core/img/03.jpg'
                        }
                    }
                })
            ).toBe('https://public.touch2success.com/static/core/img/03.jpg');
            expect(getTakeawayImage({})).toEqual({});
        });
        expect(getTakeawayImage(null)).toEqual({});
        expect(getTakeawayImage({})).toEqual({});
        expect(getTakeawayImage('')).toEqual({});
    });

    describe('getLatestOrder Testing', () => {
        test('getLatestOrder', () => {
            expect(getLatestOrder(pendingOrders, previosOrders)).toBe(previosOrders[0]);
            expect(getLatestOrder(pendingOrders, {})).toBe(pendingOrders[0]);
            expect(getLatestOrder({}, previosOrders)).toBe(previosOrders[0]);
            expect(getLatestOrder({}, {})).toBe(null);
            expect(getLatestOrder(null, null)).toBe(null);
            expect(getLatestOrder(undefined, undefined)).toBe(null);
            expect(getLatestOrder('', '')).toBe(null);
        });
    });

    describe('getLatestOrder Testing', () => {
        test('getLatestOrder', () => {
            expect(getLatestOrder(pendingOrders, previosOrders)).toBe(previosOrders[0]);
            expect(getLatestOrder(pendingOrders, {})).toBe(pendingOrders[0]);
            expect(getLatestOrder({}, previosOrders)).toBe(previosOrders[0]);
            expect(getLatestOrder({}, {})).toBe(null);
            expect(getLatestOrder({}, {})).toBe(null);
            expect(getLatestOrder(undefined, undefined)).toBe(null);
            expect(getLatestOrder(null, null)).toBe(null);
            expect(getLatestOrder('', '')).toBe(null);
        });
    });

    describe('getPostCodeFromRecentOrder Testing', () => {
        test('getPostCodeFromRecentOrder', () => {
            expect(getPostCodeFromRecentOrder(pendingOrders, previosOrders, 1)).toBe('78205');
            expect(getPostCodeFromRecentOrder(pendingOrders, {}, 1)).toBe('AA1 1AA');
            expect(getPostCodeFromRecentOrder({}, previosOrders, 1)).toBe('78205');
            expect(getPostCodeFromRecentOrder({}, {}, 1)).toBe(undefined);
            expect(getPostCodeFromRecentOrder({}, {}, 1)).toBe(undefined);
            expect(getPostCodeFromRecentOrder(undefined, undefined, undefined)).toBe(undefined);
            expect(getPostCodeFromRecentOrder('', '', '')).toBe(undefined);
            expect(getPostCodeFromRecentOrder(null, null, null)).toBe(undefined);
            expect(getPostCodeFromRecentOrder(pendingOrders, previosOrders, 2)).toBe(undefined);
        });
    });

    describe('isPendingOrderNotAvailable Testing', () => {
        test('isPendingOrderNotAvailable', () => {
            expect(isPendingOrderNotAvailable(pendingOrders)).toBe(false);
            expect(isPendingOrderNotAvailable(pendingOrders)).toBe(false);
            expect(isPendingOrderNotAvailable({})).toBe(true);
            expect(isPendingOrderNotAvailable({})).toBe(true);
            expect(isPendingOrderNotAvailable(null)).toBe(true);
            expect(isPendingOrderNotAvailable(undefined)).toBe(true);
            expect(isPendingOrderNotAvailable('')).toBe(true);
        });
    });
    describe('extractValueString Testing', () => {
        test('extractValueString', () => {
            expect(extractValueString({ value: 'red' })).toBe('red');
            expect(extractValueString({ value: 'yellow' })).toBe('yellow');
            expect(extractValueString({})).toBe('');
            expect(extractValueString(null)).toBe('');
            expect(extractValueString(undefined)).toBe('');
            expect(extractValueString('')).toBe('');
        });
    });
});
