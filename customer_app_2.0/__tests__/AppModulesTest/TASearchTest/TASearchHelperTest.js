import {
    portalDiscount,
    searchMethod,
    sortBasedOnCuisines,
    cuisinesList,
    getMinOrder,
    getDeliveryWaitingTime,
    isFullDeliveryClosed,
    isFullCollectionClosed,
    getCollectionWaitingTime,
    getRatings,
    filterTakeawayList,
    getFavouriteTakeaways,
    getDiscountAmount,
    isDeliveryAvailable,
    isCollectionAvailable,
    isTakeawayOpen,
    canPreorder,
    isDeliveryPreorderAvailable,
    isCollectionPreorderAvailable,
    newTakeawayList,
    isNewTakeaway,
    isValidFavouriteTAList,
    preorderTakeawayOpenTime,
    isTakeawayBlocked,
    takeawayBlockedMessage,
    getDistanceType,
    takeawayListWithFavoritesUpdated,
    isDeliveryOpen,
    getRequiredCuisinesData,
    calculateCuisineCount,
    getDistanceTypeValue,
    isDeliveryFreeEnabled,
    isLowDeliveryFree,
    getTakeawayLogoUrl,
    getStoreStatusDelivery,
    getStoreStatusCollection,
    getOpenStatusBasedOnBusinessHours,
    getPreorderStatus,
    updateFilterType,
    isDeliveryOrPreOrderAvailable,
    isCollectionOrPreOrderAvailable,
    getCuisineColorCode,
    sortByCuisineCount,
    sortBySelectedCuisine,
    setFilterType,
    patchDistanceOfTakeaway,
    filterOfferList,
    getFormattedMessage,
    distanceBestMatch,
    getFilterCuisinesList,
    filterTakeawayData,
    getNearestBusinessHours,
    sortBasedOnCuisineAndFilter,
    getAdvanceFilterCuisinesBasedSort,
    getCuisinesFromTakeawayList,
    searchTakeawayName,
    checkNecessaryConfigParams,
    getSearchMethodFromTakeawayList,
    getSearchTermFromTakeawayList,
    searchTARecommendationName
} from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { takeawayListResponse, storeConfig, s3Config, cuisinesListData, cuisinesListWithCount, bestMatchWeightage } from '../data';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { getCurrentDateWithTimeZone } from 't2sbasemodule/Utils/DateUtil';
import { DISTANCE_TYPE, FILTER_TYPE } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import { offerBannerFilterList } from '../../../FoodHubApp/TakeawayListModule/Utils/SortByList';

let cuisinesArray = ['Alcohol', 'American', 'Asian'];
let currentDate = new Date();
let todayDate = currentDate.toISOString().slice(0, 10);

describe('TakeawaySearch Testing', () => {
    describe('portalDiscount Testing', () => {
        test('portalDiscount', () => {
            expect(portalDiscount(takeawayListResponse.data[0])).toBe(2);
            expect(portalDiscount(storeConfig)).toBe(10);
            expect(portalDiscount(null)).toBe(null);
            expect(portalDiscount([])).toBe(undefined);
        });
    });

    describe('filterTakeawayData Testing', () => {
        test('filterTakeawayData', () => {
            expect(filterTakeawayData('Name', takeawayListResponse.data)).toBe(takeawayListResponse.data);
            expect(filterTakeawayData('Discount', [])).toStrictEqual([]);
            expect(filterTakeawayData('Nearby', null)).toBe(null);
            expect(filterTakeawayData('Rating', takeawayListResponse.data)).toStrictEqual(takeawayListResponse.data);
        });
    });

    describe('getCuisinesFromTakeawayList Testing', () => {
        test('getCuisinesFromTakeawayList', () => {
            expect(getCuisinesFromTakeawayList(takeawayListResponse.data[0], cuisinesListData)).toStrictEqual([]);
            expect(getCuisinesFromTakeawayList([{ name: 'Subway', cuisines: ['Asian', 'Burgers', 'Balti'] }], cuisinesListData)).toEqual([
                {
                    count: 1,
                    name: 'Asian'
                },
                {
                    count: 1,
                    name: 'Balti'
                },
                {
                    count: 1,
                    image_url: 'https://assets.foodhub.com/static/core/img/1651838942eae66f25c4b7f8d15370a3a440f37934-62220.png',
                    name: 'Burgers'
                }
            ]);
            expect(getCuisinesFromTakeawayList([])).toEqual([]);
        });
    });

    describe('searchMethod Testing', () => {
        test('searchMethod', () => {
            expect(searchMethod(cuisinesListData, 'Ali')).toStrictEqual([
                {
                    image_url: 'https://assets.foodhub.com/static/core/img/1648116307027605a0f6ab0df08a057a0179cc807d-20985.png',
                    name: 'Italian'
                }
            ]);
            expect(searchMethod(cuisinesListData, 'A')).toEqual([
                {
                    image_url: 'https://assets.foodhub.com/static/core/img/164811541452113b85c71199810a77f49de6a16489-41667.png',
                    name: 'Bangladeshi'
                },
                {
                    image_url: 'https://assets.foodhub.com/static/core/img/1648116307027605a0f6ab0df08a057a0179cc807d-20985.png',
                    name: 'Italian'
                },
                {
                    image_url: 'https://assets.foodhub.com/static/core/img/1648116613773fd7fbf3cbc28f12c9bab1432b0f0b-90856.png',
                    name: 'Pizza'
                }
            ]);
            expect(searchMethod(cuisinesArray, ' ')).toEqual([]);
        });
    });

    describe('searchTakeawayName Testing', () => {
        test('searchTakeawayName', () => {
            expect(searchTakeawayName(takeawayListResponse.data, 'abc')).toEqual([]);
            expect(searchTakeawayName(takeawayListResponse.data, ' ')).toEqual(takeawayListResponse.data);
            expect(searchTakeawayName(takeawayListResponse.data, '  ')).toEqual([]);
            expect(searchTakeawayName(takeawayListResponse.data, 'Big')).toEqual(takeawayListResponse.data);
        });
    });

    describe('sortBasedOnCuisines Testing', () => {
        test('sortBasedOnCuisines', () => {
            expect(
                sortBasedOnCuisines(cuisinesArray, [
                    { name: 'Tunsall', cuisines: ['Asian', 'American', ' Burgers'] },
                    { name: 'Subway', cuisines: ['Curry', 'Asian'] }
                ])
            ).toStrictEqual([
                {
                    cuisines: ['Asian', 'American', ' Burgers'],
                    name: 'Tunsall'
                },
                {
                    cuisines: ['Curry', 'Asian'],
                    name: 'Subway'
                }
            ]);
            expect(sortBasedOnCuisines(['abc'], takeawayListResponse.data)).toEqual([]);
            expect(sortBasedOnCuisines([' '], takeawayListResponse.data)).toEqual([]);
        });
    });

    describe('cuisinesList Testing', () => {
        test('cuisinesList', () => {
            expect(cuisinesList(takeawayListResponse.data[0].cuisines)).toBe('Alcohol, American, Asian');
            expect(cuisinesList(null)).toEqual(LOCALIZATION_STRINGS.CUISINES_UNAVAILABLE);
            expect(cuisinesList(undefined)).toEqual(LOCALIZATION_STRINGS.CUISINES_UNAVAILABLE);
            expect(cuisinesList([])).toEqual(LOCALIZATION_STRINGS.CUISINES_UNAVAILABLE);
        });
    });

    describe('getMinOrder Testing', () => {
        test('getMinOrder', () => {
            expect(getMinOrder(storeConfig)).toBe('5.00');
            expect(getMinOrder({ delivery: { minimum_order: '2' } })).toBe('2');
            expect(getMinOrder(null)).toBe(null);
            expect(getMinOrder(undefined)).toBe(null);
            expect(getMinOrder({})).toBe(null);
            expect(getMinOrder()).toBe(null);
        });
    });

    describe('getDeliveryWaitingTime Testing', () => {
        test('getDeliveryWaitingTime', () => {
            expect(getDeliveryWaitingTime(storeConfig)).toBe('60 ' + LOCALIZATION_STRINGS.MINS);
            expect(getDeliveryWaitingTime(null)).toBe('');
            expect(getDeliveryWaitingTime({})).toBe('');
            expect(getDeliveryWaitingTime(undefined)).toBe('');
            expect(getDeliveryWaitingTime()).toBe('');
            expect(getDeliveryWaitingTime(takeawayListResponse.data[0])).toBe(LOCALIZATION_STRINGS.PREORDER);
        });
    });

    describe('isFullDeliveryClosed Testing', () => {
        test('isFullDeliveryClosed', () => {
            expect(isFullDeliveryClosed(1, 'open', 'yes')).toBe(false);
            expect(isFullDeliveryClosed(1, 'open', 'no')).toBe(false);
            expect(isFullDeliveryClosed(undefined)).toBe(true);
            expect(isFullDeliveryClosed()).toBe(true);
            expect(isFullDeliveryClosed(0, 'open', 'no')).toBe(true);
        });
    });

    describe('isFullCollectionClosed Testing', () => {
        test('isFullCollectionClosed', () => {
            expect(isFullCollectionClosed(1, 'open', 'yes')).toBe(false);
            expect(isFullCollectionClosed(1, 'open', 'no')).toBe(false);
            expect(isFullCollectionClosed(undefined)).toBe(true);
            expect(isFullCollectionClosed()).toBe(true);
            expect(isFullCollectionClosed(0, 'open', 'yes')).toBe(true);
        });
    });

    describe('getCollectionWaitingTime Testing', () => {
        test('getCollectionWaitingTime', () => {
            expect(getCollectionWaitingTime(storeConfig)).toBe('30 mins');
            expect(getCollectionWaitingTime(null)).toBe('');
            expect(getCollectionWaitingTime({})).toBe('');
            expect(getCollectionWaitingTime(undefined)).toBe('');
            expect(getCollectionWaitingTime()).toBe('');
            expect(getCollectionWaitingTime(takeawayListResponse.data[0])).toBe(LOCALIZATION_STRINGS.PREORDER);
        });
    });

    describe('getRatings Testing', () => {
        test('getRatings', () => {
            expect(getRatings(storeConfig?.rating)).toBe(4.8);
            expect(getRatings(takeawayListResponse.data[0]?.rating)).toBe(0);
            expect(getRatings(null)).toBe(0.0);
            expect(getRatings(undefined)).toBe(0.0);
            expect(getRatings({})).toBe(0.0);
            expect(getRatings()).toBe(0.0);
        });
    });

    describe('filterTakeawayList Testing', () => {
        test('filterTakeawayList', () => {
            expect(filterTakeawayList(takeawayListResponse.data)).toEqual({
                closedTakeawayList: [],
                onlineTakeaways: [],
                preOrderTakeaways: takeawayListResponse.data
            });
            expect(filterTakeawayList(null)).toEqual({
                closedTakeawayList: [],
                onlineTakeaways: [],
                preOrderTakeaways: []
            });
            expect(filterTakeawayList(undefined)).toEqual({
                closedTakeawayList: [],
                onlineTakeaways: [],
                preOrderTakeaways: []
            });
            expect(filterTakeawayList({})).toEqual({
                closedTakeawayList: [],
                onlineTakeaways: [],
                preOrderTakeaways: []
            });
            expect(filterTakeawayList()).toEqual({
                closedTakeawayList: [],
                onlineTakeaways: [],
                preOrderTakeaways: []
            });
        });
    });

    describe('getFavouriteTakeaways Testing', () => {
        test('getFavouriteTakeaways', () => {
            expect(getFavouriteTakeaways(takeawayListResponse.data)).toEqual([808940]);
            expect(getFavouriteTakeaways(undefined)).toEqual(null);
            expect(getFavouriteTakeaways(null)).toEqual(null);
            expect(getFavouriteTakeaways({})).toEqual(null);
            expect(getFavouriteTakeaways()).toEqual(null);
        });
    });

    describe('getDiscountAmount Testing', () => {
        test('getDiscountAmount', () => {
            expect(getDiscountAmount(portalDiscount(storeConfig))).toBe(10);
            expect(getDiscountAmount(null)).toBe(0);
            expect(getDiscountAmount(undefined)).toBe(0);
            expect(getDiscountAmount()).toBe(0);
        });
    });

    describe('isDeliveryAvailable, Testing', () => {
        test('isDeliveryAvailable', () => {
            expect(isDeliveryAvailable(1, 'open')).toBe(true);
            expect(isDeliveryAvailable(0, 'open')).toBe(false);
            expect(isDeliveryAvailable(1, 'closed')).toBe(false);
            expect(isDeliveryAvailable(0, 'closed')).toBe(false);
            expect(isDeliveryAvailable(undefined)).toBe(false);
            expect(isDeliveryAvailable()).toBe(false);
        });
    });

    describe('isCollectionAvailable, Testing', () => {
        test('isCollectionAvailable', () => {
            expect(isCollectionAvailable(1, 'open')).toBe(true);
            expect(isCollectionAvailable(0, 'open')).toBe(false);
            expect(isCollectionAvailable(0, 'closed')).toBe(false);
            expect(isCollectionAvailable(1, 'closed')).toBe(false);
            expect(isCollectionAvailable(undefined)).toBe(false);
            expect(isCollectionAvailable({})).toBe(false);
            expect(isCollectionAvailable()).toBe(false);
        });
    });

    describe('isTakeawayOpen, Testing', () => {
        test('isTakeawayOpen', () => {
            expect(isTakeawayOpen(1, 'open', 1, 'closed')).toBe(true);
            expect(isTakeawayOpen(0, 'open', 1, 'closed')).toBe(false);
            expect(isTakeawayOpen(1, 'closed', 1, 'closed')).toBe(false);
            expect(isTakeawayOpen(1, 'open', 0, 'closed')).toBe(true);
            expect(isTakeawayOpen(undefined)).toBe(false);
            expect(isTakeawayOpen({})).toBe(false);
            expect(isTakeawayOpen()).toBe(false);
        });
    });

    describe('canPreorder, Testing', () => {
        test('canPreorder', () => {
            expect(canPreorder(1, 'yes', 1, 'no')).toBe(true);
            expect(canPreorder(1, 'no', 1, 'no')).toBe(false);
            expect(canPreorder(0, 'yes', 1, 'no')).toBe(false);
            expect(canPreorder(1, 'yes', 1, 'yes')).toBe(true);
            expect(canPreorder(undefined)).toBe(false);
            expect(canPreorder()).toBe(false);
        });
    });

    describe('isDeliveryPreorderAvailable, Testing', () => {
        test('isDeliveryPreorderAvailable', () => {
            expect(isDeliveryPreorderAvailable(1, 'yes')).toBe(true);
            expect(isDeliveryPreorderAvailable(0, 'yes')).toBe(false);
            expect(isDeliveryPreorderAvailable(undefined)).toBe(false);
            expect(isDeliveryPreorderAvailable(1, 'no')).toBe(false);
            expect(isDeliveryPreorderAvailable()).toBe(false);
        });
    });

    describe('isCollectionPreorderAvailable, Testing', () => {
        test('isCollectionPreorderAvailable', () => {
            expect(isCollectionPreorderAvailable(1, 'yes')).toBe(true);
            expect(isCollectionPreorderAvailable(0, 'yes')).toBe(false);
            expect(isCollectionPreorderAvailable(undefined)).toBe(false);
            expect(isCollectionPreorderAvailable(1, 'no')).toBe(false);
            expect(isCollectionPreorderAvailable()).toBe(false);
        });
    });

    describe('newTakeawayList, Testing', () => {
        test('newTakeawayList', () => {
            expect(newTakeawayList(takeawayListResponse.data).length).toBe(1);
            expect(newTakeawayList(null)).toBe(null);
            expect(newTakeawayList(undefined)).toBe(undefined);
            expect(newTakeawayList({})).toEqual({});
            expect(newTakeawayList()).toBe();
        });
    });

    describe('isNewTakeaway Testing', () => {
        test('isNewTakeaway', () => {
            expect(isNewTakeaway(takeawayListResponse.data)).toBe(false);
            expect(isNewTakeaway(null)).toBe(false);
            expect(isNewTakeaway(undefined)).toBe(false);
            expect(isNewTakeaway()).toBe(false);
            expect(isNewTakeaway({})).toBe(false);
        });
    });

    describe('isValidFavouriteTAList Testing', () => {
        test('isValidFavouriteTAList', () => {
            expect(isValidFavouriteTAList(takeawayListResponse.data)).toBe(true);
            expect(isValidFavouriteTAList(null)).toBe(false);
            expect(isValidFavouriteTAList(undefined)).toBe(false);
            expect(isValidFavouriteTAList()).toBe(false);
            expect(isValidFavouriteTAList({})).toBe(false);
        });
    });

    describe('preorderTakeawayOpenTime Testing', () => {
        let today = new Date();
        test('preorderTakeawayOpenTime', () => {
            expect(preorderTakeawayOpenTime('2021-05-13 12:59:00', 'Europe/London', 'close_message')).toBe('Opens at ');
            expect(preorderTakeawayOpenTime('2021-05-13 12:59:00', 'Europe/London', 'opening_time_text')).toBe('2021-05-13 12:59');
            expect(preorderTakeawayOpenTime('2021-05-12 14:59:00', 'Europe/London', 'close_message', true)).toBe('Opens at ');
            expect(preorderTakeawayOpenTime('2021-05-14 14:59:00', 'Europe/London', 'opening_time_text')).toBe('2021-05-14 14:59');
            expect(preorderTakeawayOpenTime(today, 'Europe/London', 'opening_time_text')).toBe(`${today.getHours()}:${today.getMinutes()}`);
        });
    });

    describe('isTakeawayBlocked Testing', () => {
        test('isTakeawayBlocked', () => {
            expect(isTakeawayBlocked(804942, takeawayListResponse.data)).toBe(false);
            expect(isTakeawayBlocked(8049421, takeawayListResponse.data)).toBe(false);
            expect(isTakeawayBlocked(null, takeawayListResponse.data)).toBe(false);
        });
    });

    describe('takeawayBlockedMessage Testing', () => {
        test('takeawayBlockedMessage', () => {
            expect(takeawayBlockedMessage(804942, takeawayListResponse.data, 'en')).toBe(LOCALIZATION_STRINGS.TAKEAWAY_BLOCKED_MESSAGE);
            expect(takeawayBlockedMessage(8049421, takeawayListResponse.data, 'es')).toBe(LOCALIZATION_STRINGS.TAKEAWAY_BLOCKED_MESSAGE);
            expect(takeawayBlockedMessage(null, takeawayListResponse.data)).toBe(LOCALIZATION_STRINGS.TAKEAWAY_BLOCKED_MESSAGE);
        });
    });

    describe('getDistanceType Testing', () => {
        test('getDistanceType', () => {
            expect(getDistanceType(s3Config?.distance_type)).toBe(' mi');
            expect(getDistanceType('km')).toBe(' km');
            expect(getDistanceType(null)).toBe(' mi');
            expect(getDistanceType(undefined)).toBe(' mi');
            expect(getDistanceType()).toBe(' mi');
        });
    });

    describe('takeawayListWithFavoritesUpdated Testing', () => {
        test('takeawayListWithFavoritesUpdated', () => {
            expect(takeawayListWithFavoritesUpdated(takeawayListResponse.data, 8049421, 'YES').length).toBe(2);
            expect(takeawayListWithFavoritesUpdated([], 804942, 'YES').length).toBe(1);
            expect(takeawayListWithFavoritesUpdated(takeawayListResponse.data, 804942, 'NO').length).toBe(1);
        });
    });

    describe('isDeliveryOpen Testing', () => {
        test('isDeliveryOpen', () => {
            expect(isDeliveryOpen(takeawayListResponse.data)).toBe('closed');
            expect(isDeliveryOpen(storeConfig)).toBe('open');
            expect(isDeliveryOpen({ name: 'Foodhub UK Testing' })).toBe('closed');
            expect(isDeliveryOpen(null)).toBe('closed');
            expect(isDeliveryOpen()).toBe('closed');
            expect(isDeliveryOpen('')).toBe('closed');
        });
    });

    describe('getRequiredCuisinesData Testing', () => {
        test('getRequiredCuisinesData', () => {
            expect(
                getRequiredCuisinesData(cuisinesListData, [
                    'Balti',
                    'Bangladeshi',
                    'Burgers',
                    'Japanese',
                    'Italian',
                    'Ice Creams',
                    'Bangladeshi',
                    'Pizza',
                    'Burgers'
                ])
            ).toStrictEqual([
                {
                    count: 2,
                    image_url: 'https://assets.foodhub.com/static/core/img/164811541452113b85c71199810a77f49de6a16489-41667.png',
                    name: 'Bangladeshi'
                },
                {
                    count: 2,
                    image_url: 'https://assets.foodhub.com/static/core/img/1651838942eae66f25c4b7f8d15370a3a440f37934-62220.png',
                    name: 'Burgers'
                },
                {
                    count: 1,
                    name: 'Balti'
                },
                {
                    count: 1,
                    name: 'Ice Creams'
                },
                {
                    count: 1,
                    image_url: 'https://assets.foodhub.com/static/core/img/1648116307027605a0f6ab0df08a057a0179cc807d-20985.png',
                    name: 'Italian'
                },
                {
                    count: 1,
                    name: 'Japanese'
                },
                {
                    count: 1,
                    image_url: 'https://assets.foodhub.com/static/core/img/1648116613773fd7fbf3cbc28f12c9bab1432b0f0b-90856.png',
                    name: 'Pizza'
                }
            ]);
            expect(getRequiredCuisinesData(cuisinesListData, ['Bangladeshi', 'Bangladeshi'])).toStrictEqual([
                {
                    count: 2,
                    image_url: 'https://assets.foodhub.com/static/core/img/164811541452113b85c71199810a77f49de6a16489-41667.png',
                    name: 'Bangladeshi'
                }
            ]);
            expect(getRequiredCuisinesData(null, [])).toStrictEqual([]);
            expect(getRequiredCuisinesData()).toStrictEqual([]);
        });
    });

    describe('calculateCuisineCount Testing', () => {
        test('calculateCuisineCount', () => {
            expect(
                calculateCuisineCount(['Balti', 'Bangladeshi', 'Burgers', 'Italian', 'Ice Creams', 'Bangladeshi', 'Burgers'])
            ).toStrictEqual([
                {
                    count: 1,
                    name: 'Balti'
                },
                {
                    count: 2,
                    name: 'Bangladeshi'
                },
                {
                    count: 2,
                    name: 'Burgers'
                },
                {
                    count: 1,
                    name: 'Italian'
                },
                {
                    count: 1,
                    name: 'Ice Creams'
                }
            ]);
            expect(calculateCuisineCount(['Pizza', 'Burger'])).toStrictEqual([
                {
                    count: 1,
                    name: 'Pizza'
                },
                {
                    count: 1,
                    name: 'Burger'
                }
            ]);
            expect(calculateCuisineCount([])).toStrictEqual([]);
            expect(calculateCuisineCount(null)).toStrictEqual([]);
        });
    });

    describe('isDeliveryFreeEnabled Testing', () => {
        test('isDeliveryFreeEnabled', () => {
            expect(isDeliveryFreeEnabled({ delivery: { charge: 10.0 } })).toBe(false);
            expect(isDeliveryFreeEnabled({ delivery: { charge: 0 } })).toBe(true);
            expect(isDeliveryFreeEnabled()).toBe(false);
            expect(isDeliveryFreeEnabled(null)).toBe(false);
        });
    });

    describe('isLowDeliveryFree Testing', () => {
        test('isLowDeliveryFree', () => {
            expect(isLowDeliveryFree({ delivery: { charge: 10.0 } })).toBe(false);
            expect(isLowDeliveryFree({ delivery: { charge: 0 } })).toBe(true);
            expect(isLowDeliveryFree({ delivery: { charge: 2.0 } })).toBe(true);
            expect(isLowDeliveryFree({ delivery: { charge: -1 } })).toBe(true);
            expect(isLowDeliveryFree()).toBe(false);
            expect(isLowDeliveryFree(null)).toBe(false);
            expect(isLowDeliveryFree({ delivery: {} })).toBe(false);
        });
    });

    describe('getTakeawayLogoUrl', () => {
        //require() value not coming in jest.default image scenario not checked
        test('getTakeawayLogoUrl', () => {
            expect(
                getTakeawayLogoUrl(
                    { logo_url: 'https://www.touch2success.com/landing/etemp/foodhub-tem/homepage_testimonials_pierogicompany.png' },
                    true
                )
            ).toStrictEqual({
                uri: 'https://www.touch2success.com/landing/etemp/foodhub-tem/homepage_testimonials_pierogicompany.png'
            });
            expect(
                getTakeawayLogoUrl(
                    {
                        logo_url: 'https://www.touch2success.com/landing/etemp/foodhub-tem/homepage_testimonials_pierogicompany.png',
                        setting: {
                            logo_url: 'https://www.touch2success.com/landing/etemp/foodhub-tem/homepage_testimonials_pierogicompany.png'
                        }
                    },

                    false
                )
            ).toStrictEqual({
                uri: 'https://www.touch2success.com/landing/etemp/foodhub-tem/homepage_testimonials_pierogicompany.png'
            });
        });
    });

    describe('getStoreStatusDelivery Testing', () => {
        test('getStoreStatusDelivery', () => {
            expect(getStoreStatusDelivery(takeawayListResponse.data[0])).toBe('closed');
            expect(getStoreStatusDelivery({ store_status: { delivery: 'open' } })).toBe('open');
            expect(getStoreStatusDelivery({ name: 'Tunsall Pizzeria' })).toBe('closed');
            expect(getStoreStatusDelivery()).toBe('closed');
            expect(getStoreStatusDelivery(null)).toBe('closed');
        });
    });

    describe('getStoreStatusCollection Testing', () => {
        test('getStoreStatusCollection', () => {
            expect(getStoreStatusCollection(takeawayListResponse.data[0])).toBe('closed');
            expect(getStoreStatusCollection({ store_status: { delivery: 'open' } })).toBe('closed');
            expect(getStoreStatusCollection({ store_status: { delivery: 'open', collection: 'open' } })).toBe('open');
            expect(getStoreStatusCollection({ name: 'Tunsall Pizzeria' })).toBe('closed');
            expect(getStoreStatusCollection()).toBe('closed');
            expect(getStoreStatusCollection(null)).toBe('closed');
        });
    });

    describe('getOpenStatusBasedOnBusinessHours Testing', () => {
        let timestamp = getCurrentDateWithTimeZone('Europe/London');
        test('getOpenStatusBasedOnBusinessHours', () => {
            expect(getOpenStatusBasedOnBusinessHours(takeawayListResponse.data[0])).toBe('closed');
            expect(getOpenStatusBasedOnBusinessHours({ store_status: { delivery: 'open' } })).toBe('closed');
            expect(getOpenStatusBasedOnBusinessHours({ store_status: { delivery: 'open' } }, ORDER_TYPE.DELIVERY, timestamp)).toBe(
                'closed'
            );
            expect(getOpenStatusBasedOnBusinessHours([])).toBe('closed');
            expect(
                getOpenStatusBasedOnBusinessHours(
                    [
                        {
                            service_type: 'Delivery',
                            business_date: todayDate,
                            open_at: `${todayDate} 05:00:00`,
                            close_at: `${todayDate} 20:54:00`
                        }
                    ],
                    ORDER_TYPE.DELIVERY,
                    timestamp
                )
            ).toBe('open');
            expect(getOpenStatusBasedOnBusinessHours([])).toBe('closed');
            expect(getOpenStatusBasedOnBusinessHours()).toBe('closed');
            expect(getOpenStatusBasedOnBusinessHours(null)).toBe('closed');
        });
    });

    describe('getPreorderStatus Testing', () => {
        test('getPreorderStatus', () => {
            expect(getPreorderStatus({}, ORDER_TYPE.DELIVERY, 'closed')).toBe('no');
            expect(
                getPreorderStatus(
                    {
                        preorder_hours: {
                            delivery: {
                                pre_order: 'yes'
                            }
                        }
                    },
                    ORDER_TYPE.DELIVERY
                )
            ).toBe('yes');
            expect(getPreorderStatus({}, ORDER_TYPE.COLLECTION, 'closed')).toBe('no');
            expect(
                getPreorderStatus(
                    {
                        preorder_hours: {
                            collection: {
                                pre_order: 'yes'
                            }
                        }
                    },
                    ORDER_TYPE.COLLECTION,
                    'open'
                )
            ).toBe('yes');
            expect(
                getPreorderStatus(
                    {
                        preorder: 'ENABLED',
                        business_hours: [
                            {
                                service_type: 'Delivery',
                                business_date: todayDate,
                                open_at: `${todayDate} 05:00:00`,
                                close_at: `${todayDate} 20:54:00`
                            }
                        ]
                    },
                    ORDER_TYPE.DELIVERY,
                    'closed'
                )
            ).toBe('no');
            expect(getPreorderStatus(null)).toBe('no');
        });
    });

    describe('getDistanceTypeValue Testing', () => {
        test('getDistanceTypeValue', () => {
            expect(getDistanceTypeValue('kms')).toBe('kms');
            expect(getDistanceTypeValue(DISTANCE_TYPE.MILES)).toBe(DISTANCE_TYPE.MILES);
            expect(getDistanceTypeValue('')).toBe(DISTANCE_TYPE.MILES);
            expect(getDistanceTypeValue(null)).toBe(DISTANCE_TYPE.MILES);
        });
    });

    describe('isDeliveryOrPreOrderAvailable Testing', () => {
        test('isDeliveryOrPreOrderAvailable', () => {
            expect(isDeliveryOrPreOrderAvailable(1, 'open')).toBe(true);
            expect(isDeliveryOrPreOrderAvailable(1, 'closed', 'yes')).toBe(true);
            expect(isDeliveryOrPreOrderAvailable(0, 'open')).toBe(false);
            expect(isDeliveryOrPreOrderAvailable(0, 'closed', 'yes')).toBe(false);
            expect(isDeliveryOrPreOrderAvailable(1, 'closed', 'no')).toBe(false);
            expect(isDeliveryOrPreOrderAvailable(null, 'open', 'no')).toBe(false);
        });
    });

    describe('isCollectionOrPreOrderAvailable Testing', () => {
        test('isCollectionOrPreOrderAvailable', () => {
            expect(isCollectionOrPreOrderAvailable(1, 'open')).toBe(true);
            expect(isCollectionOrPreOrderAvailable(1, 'closed', 'yes')).toBe(true);
            expect(isCollectionOrPreOrderAvailable(0, 'open')).toBe(false);
            expect(isCollectionOrPreOrderAvailable(0, 'closed', 'yes')).toBe(false);
            expect(isCollectionOrPreOrderAvailable(1, 'closed', 'no')).toBe(false);
            expect(isCollectionOrPreOrderAvailable(null, 'open', 'no')).toBe(false);
        });
    });

    describe('getCuisineColorCode Testing', () => {
        test('getCuisineColorCode', () => {
            expect(getCuisineColorCode(10)).toStrictEqual(['#FBD99A', '#F5B261']);
            expect(getCuisineColorCode(1)).toStrictEqual(['#ECD8EB', '#D4AFD3']);
            expect(getCuisineColorCode(2)).toStrictEqual(['#FFEB9A', '#FFD361']);
            expect(getCuisineColorCode(3)).toStrictEqual(['#ADE8EB', '#75CCD2']);
            expect(getCuisineColorCode(9)).toStrictEqual(['#EEE6F3', '#D8C9E3']);
            expect(getCuisineColorCode(null)).toStrictEqual(['#FBD99A', '#F5B261']);
            expect(getCuisineColorCode('')).toStrictEqual(['#FBD99A', '#F5B261']);
            expect(getCuisineColorCode()).toStrictEqual(['#FBD99A', '#F5B261']);
        });
    });

    describe('updateFilterType Testing', () => {
        test('updateFilterType', () => {
            expect(
                updateFilterType({
                    filter_by: {
                        filter: 'Rating'
                    }
                })
            ).toBe('Rating');
            expect(updateFilterType({})).toBe(FILTER_TYPE.DISTANCE_VALUE);
            expect(
                updateFilterType({
                    filter_by: {
                        filter: ''
                    }
                })
            ).toBe('');
            expect(updateFilterType(null)).toBe(FILTER_TYPE.DISTANCE_VALUE);
        });
    });

    describe('sortBySelectedCuisine Testing', () => {
        test('sortBySelectedCuisine', () => {
            expect(sortBySelectedCuisine(cuisinesListWithCount, ['American'])).toStrictEqual([
                {
                    count: 5,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647938620e9401db07f111d3e4bf5446f7f5e66cc-29050.png',
                    name: 'Indian'
                },
                {
                    count: 4,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/164793502278b3b8e1042d480056a211945f51b01c-62697.png',
                    name: 'Desserts'
                },
                {
                    count: 3,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647934986d7faf2d888fa8ce838fa3a3bd761ec81-40518.png',
                    name: 'Curry'
                },
                {
                    count: 2,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1648105086611a790633d26a8322db47c705bbb069-66661.png',
                    name: 'Alcohol'
                }
            ]);
            expect(sortBySelectedCuisine(cuisinesListWithCount, ['Indian'])).toStrictEqual([
                {
                    count: 5,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647938620e9401db07f111d3e4bf5446f7f5e66cc-29050.png',
                    name: 'Indian'
                },
                {
                    count: 4,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/164793502278b3b8e1042d480056a211945f51b01c-62697.png',
                    name: 'Desserts'
                },
                {
                    count: 3,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647934986d7faf2d888fa8ce838fa3a3bd761ec81-40518.png',
                    name: 'Curry'
                },
                {
                    count: 2,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1648105086611a790633d26a8322db47c705bbb069-66661.png',
                    name: 'Alcohol'
                }
            ]);
            expect(sortBySelectedCuisine(cuisinesListWithCount, [])).toStrictEqual(cuisinesListWithCount);
            expect(sortBySelectedCuisine(null, [])).toStrictEqual(null);
        });
    });

    describe('sortByCuisineCount Testing', () => {
        test('sortByCuisineCount', () => {
            expect(sortByCuisineCount(cuisinesListWithCount)).toStrictEqual([
                {
                    count: 5,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647938620e9401db07f111d3e4bf5446f7f5e66cc-29050.png',
                    name: 'Indian'
                },
                {
                    count: 4,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/164793502278b3b8e1042d480056a211945f51b01c-62697.png',
                    name: 'Desserts'
                },
                {
                    count: 3,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647934986d7faf2d888fa8ce838fa3a3bd761ec81-40518.png',
                    name: 'Curry'
                },
                {
                    count: 2,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1648105086611a790633d26a8322db47c705bbb069-66661.png',
                    name: 'Alcohol'
                }
            ]);
            expect(
                sortByCuisineCount([
                    {
                        count: 5,
                        image_url:
                            'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647938620e9401db07f111d3e4bf5446f7f5e66cc-29050.png',
                        name: 'Indian'
                    }
                ])
            ).toStrictEqual([
                {
                    count: 5,
                    image_url:
                        'https://s3.eu-west-2.amazonaws.com/prod-cloudfiles-public.com/static/core/img/1647938620e9401db07f111d3e4bf5446f7f5e66cc-29050.png',
                    name: 'Indian'
                }
            ]);
            expect(sortByCuisineCount(null)).toStrictEqual([]);
            expect(sortByCuisineCount([])).toStrictEqual([]);
        });
    });

    describe('setFilterType Testing', () => {
        test('setFilterType', () => {
            expect(setFilterType(false, { filter: 'Rating' }, null, null)).toStrictEqual({ filterType: 'Rating' });
            expect(setFilterType(false, { filterDataType: 'BestMatch' }, null, null)).toStrictEqual({ filterType: 'BestMatch' });
            expect(setFilterType(true, { filter: 'Rating' }, null, null)).toStrictEqual({ advancedFilterType: 'Rating' });
            expect(setFilterType(true, { filterDataType: 'Rating' }, null, null)).toStrictEqual({ advancedFilterType: 'Rating' });
            expect(setFilterType(true, null, null, null)).toStrictEqual({ advancedFilterType: null });
        });
    });

    describe('patchDistanceOfTakeaway Testing', () => {
        test('patchDistanceOfTakeaway', () => {
            expect(patchDistanceOfTakeaway({})).toBe(undefined);
        });
    });

    describe('filterOfferList Testing', () => {
        test('filterOfferList', () => {
            expect(filterOfferList(offerBannerFilterList, takeawayListResponse.data)).toStrictEqual(offerBannerFilterList.slice(1));
            expect(
                filterOfferList(offerBannerFilterList, [
                    { name: 'Tunsall Pizzeria', discount: 25 },
                    { name: 'ABC TA', discount: 36 }
                ])
            ).toStrictEqual([
                {
                    id: 0,
                    offer: 20,
                    offerMax: 101,
                    title: 'MIN {0}% OFF'
                }
            ]);
            expect(filterOfferList(offerBannerFilterList, [])).toStrictEqual([]);
            expect(filterOfferList(null, [])).toStrictEqual(null);
        });
    });

    describe('getFormattedMessage Testing', () => {
        test('getFormattedMessage', () => {
            expect(getFormattedMessage('2022-06-30', '2022-06-30', '2022-07-01', false)).toBe(
                "Sorry, We're currently closed and will open {0}{1}at "
            );
            expect(getFormattedMessage('2022-06-30', '2022-06-30', '2022-07-01', true)).toBe('Opens at ');
            expect(getFormattedMessage('2022-06-22', '2022-06-30', '2022-07-01', false)).toBe(
                "Sorry, We're currently closed and will open {0}{1}at "
            );
            expect(getFormattedMessage(null, '2022-07-01', '2022-07-01', true)).toBe('Opening tomorrow at ');
        });
    });

    describe('getNearestBusinessHours Testing', () => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow?.toISOString()?.slice(0, 10);
        let businessHours = [
            {
                service_type: 'Delivery',
                business_date: todayDate,
                open_at: `${todayDate} 05:00:00`,
                close_at: `${todayDate} 20:54:00`
            },
            { service_type: 'Delivery', business_date: tomorrow, open_at: `${tomorrow} 00:00`, close_at: `${tomorrow} 04:54:00` }
        ];
        test('getNearestBusinessHours', () => {
            expect(getNearestBusinessHours(businessHours, ORDER_TYPE.DELIVERY)).toEqual('2022-12-20 05:00:00');
            expect(
                getNearestBusinessHours(businessHours, ORDER_TYPE.DELIVERY, {
                    delivery: { preorder: 'yes', next_open: '2022-07-03' },
                    collection: { preorder: 'no' }
                })
            ).toBe('2022-07-03');
            expect(getNearestBusinessHours([], ORDER_TYPE.COLLECTION)).toBe(null);
            expect(getNearestBusinessHours(businessHours, ORDER_TYPE.COLLECTION, storeConfig)).toBe('');
            expect(
                getNearestBusinessHours(
                    businessHours,
                    ORDER_TYPE.COLLECTION,
                    takeawayListResponse.data[0]?.preorder_hours,
                    null,
                    `${tomorrow} 10:20`
                )
            ).toBe('2022-12-21 10:20');
            expect(
                getNearestBusinessHours(businessHours, ORDER_TYPE.DELIVERY, takeawayListResponse.data[0]?.preorder_hours, null, '')
            ).toBe('2021-05-07 12:59:00');
            expect(getNearestBusinessHours([], null, null, null, '')).toBe(null);
            expect(
                getNearestBusinessHours(
                    businessHours,
                    ORDER_TYPE.COLLECTION,
                    takeawayListResponse.data[0]?.preorder_hours,
                    'Asia/Kolkata',
                    null
                )
            ).toBe('2021-05-07 12:59:00');
            expect(
                getNearestBusinessHours(
                    businessHours,
                    ORDER_TYPE.COLLECTION,
                    { delivery: { next_open: '' }, collection: { next_open: '2022-12-19 13:55' } },
                    'Asia/Kolkata',
                    null
                )
            ).toBe('2022-12-19 13:55');
            expect(
                getNearestBusinessHours(
                    businessHours,
                    ORDER_TYPE.DELIVERY,
                    { delivery: { next_open: '' }, collection: { next_open: '2022-12-19 13:55' } },
                    'Asia/Kolkata',
                    null
                )
            ).toBe('');
            expect(
                getNearestBusinessHours(
                    businessHours,
                    null,
                    { delivery: { next_open: '' }, collection: { next_open: '2022-12-19 13:55' } },
                    'Asia/Kolkata',
                    null
                )
            ).toBe('2022-12-20 05:00:00');
            expect(
                getNearestBusinessHours(
                    businessHours,
                    null,
                    { delivery: { next_open: '' }, collection: { next_open: '2022-12-19 13:55' } },
                    'Asia/Kolkata',
                    '2022-12-19 16:30'
                )
            ).toBe('2022-12-19 16:30');
        });
    });

    describe('sortBasedOnCuisineAndFilter Testing', () => {
        test('sortBasedOnCuisineAndFilter', () => {
            expect(
                sortBasedOnCuisineAndFilter(['Desserts'], takeawayListResponse.data, ['Offers', 'HygieneRating'], false, null)
            ).toStrictEqual([]);
            expect(sortBasedOnCuisineAndFilter([], takeawayListResponse.data, ['Offers'], false, 'Asian')).toStrictEqual(
                takeawayListResponse.data
            );
            expect(sortBasedOnCuisineAndFilter([], [], [], false, null)).toStrictEqual([]);
            expect(sortBasedOnCuisineAndFilter(['Asian'], takeawayListResponse.data, ['Offers'], true, null)).toStrictEqual([]);
        });
    });

    describe('distanceBestMatch Testing', () => {
        test('distanceBestMatch', () => {
            expect(distanceBestMatch(bestMatchWeightage, 12)).toBe(0);
            expect(distanceBestMatch(bestMatchWeightage, 1)).toBe(0);
            expect(distanceBestMatch(bestMatchWeightage, -1)).toBe(0);
            expect(distanceBestMatch(bestMatchWeightage, 0.14)).toBe(0);
            expect(distanceBestMatch(bestMatchWeightage, 3.41)).toBe(0);
        });
    });

    describe('getFilterCuisinesList Testing', () => {
        test('getFilterCuisinesList', () => {
            expect(getFilterCuisinesList(takeawayListResponse, 'Burgers')).toStrictEqual([]);
            expect(
                getFilterCuisinesList(
                    [
                        { name: 'Tunsall', cuisines: ['Asian', 'American', ' Burgers'] },
                        { name: 'Subway', cuisines: ['Curry', 'Asian'] }
                    ],
                    'Asian',
                    cuisinesListData
                )
            ).toStrictEqual([
                {
                    count: 1,
                    name: ' Burgers'
                },
                {
                    count: 1,
                    name: 'American'
                },
                {
                    count: 1,
                    name: 'Curry'
                }
            ]);
            expect(getFilterCuisinesList([{ name: 'Tunsall', cuisines: ['Asian'] }], 'Asian', cuisinesListData)).toStrictEqual([]);
            expect(getFilterCuisinesList([{ name: 'Tunsall', cuisines: ['Asian', 'Burgers'] }], 'Asian', cuisinesListData)).toStrictEqual([
                {
                    count: 1,
                    image_url: 'https://assets.foodhub.com/static/core/img/1651838942eae66f25c4b7f8d15370a3a440f37934-62220.png',
                    name: 'Burgers'
                }
            ]);
            expect(getFilterCuisinesList({}, 'Burgers', cuisinesListData)).toStrictEqual([]);
            expect(getFilterCuisinesList(null)).toStrictEqual([]);
        });
    });

    describe('getAdvanceFilterCuisinesBasedSort Testing', () => {
        test('getAdvanceFilterCuisinesBasedSort', () => {
            expect(getAdvanceFilterCuisinesBasedSort(takeawayListResponse.data, 'Burgers')).toStrictEqual([]);
            expect(getAdvanceFilterCuisinesBasedSort(takeawayListResponse.data, 'Asian')).toStrictEqual([]);
            expect(
                getAdvanceFilterCuisinesBasedSort(
                    [
                        { name: 'Domino', cuisines: [] },
                        { name: 'Subway', cuisines: ['Asian', 'Burgers', 'American'] },
                        { name: 'Tunsall', cuisines: ['Pizza', 'Burgers', 'Asian'] }
                    ],
                    ['Burgers']
                )
            ).toStrictEqual([
                {
                    cuisines: ['Asian', 'Burgers', 'American'],
                    name: 'Subway'
                },
                {
                    cuisines: ['Pizza', 'Burgers', 'Asian'],
                    name: 'Tunsall'
                }
            ]);
            expect(getAdvanceFilterCuisinesBasedSort([], ['Burgers'])).toStrictEqual([]);
            expect(getAdvanceFilterCuisinesBasedSort()).toBe(undefined);
        });
    });

    describe('checkNecessaryConfigParams Testing', () => {
        test('checkNecessaryConfigParams', () => {
            expect(checkNecessaryConfigParams({})).toBe(false);
            expect(
                checkNecessaryConfigParams({
                    our_recommendations: 'ENABLED',
                    card_payment: 'YES',
                    payment_provider: 'OPTOMANY',
                    ask_postcode_first: 1
                })
            ).toBe(true);
            expect(
                checkNecessaryConfigParams({
                    our_recommendations: 'ENABLED',
                    card_payment: 'YES'
                })
            ).toBe(false);
            expect(
                checkNecessaryConfigParams({
                    our_recommendations: 'ENABLED',
                    ask_postcode_first: 1
                })
            ).toBe(false);
            expect(checkNecessaryConfigParams(null)).toBe(false);
        });
    });
    describe('getSearchMethodFromTakeawayList testing', () => {
        test('getSearchMethodFromTakeawayList', () => {
            expect(getSearchMethodFromTakeawayList({ searchByAddress: true, postCode: 'AA11AA' })).toBe('');
            expect(getSearchMethodFromTakeawayList({ searchByAddress: true, searchType: 'area' })).toBe('area');
            expect(getSearchMethodFromTakeawayList({ searchByAddress: false, postCode: 'AA11AA' })).toBe('postcode');
            expect(getSearchMethodFromTakeawayList({ searchByAddress: false, searchType: 'area' })).toBe('');
            expect(getSearchMethodFromTakeawayList({})).toBe('');
            expect(getSearchMethodFromTakeawayList(null)).toBe('');
        });
    });
    describe('getSearchTermFromTakeawayList Testing', () => {
        test('getSearchTermFromTakeawayList', () => {
            expect(getSearchTermFromTakeawayList({ addressObj: {}, postCode: 'AA11AA' })).toBe('AA11AA');
            expect(getSearchTermFromTakeawayList({ addressObj: null, postCode: 'AA11AA', lat: 23.0434, lng: -2.3 })).toBe('23.0434,-2.3');
            expect(getSearchTermFromTakeawayList({ addressObj: { description: 'stoke on trent' }, postCode: 'AA11AA' })).toBe(
                'stoke on trent'
            );
            expect(getSearchTermFromTakeawayList({ addressObj: null })).toBe('');
            expect(getSearchTermFromTakeawayList(null)).toBe('');
        });
    });
    describe('searchTakeawayRecommendationName Testing', () => {
        test('searchTakeawayRecommendationName', () => {
            expect(searchTARecommendationName(takeawayListResponse.data, 'abc')).toEqual([]);
            expect(searchTARecommendationName(takeawayListResponse.data, ' ')).toEqual(takeawayListResponse.data);
            expect(searchTARecommendationName(takeawayListResponse.data, '  ')).toEqual([]);
            expect(searchTARecommendationName(takeawayListResponse.data, 'Big')).toEqual(takeawayListResponse.data);
        });
    });
});
