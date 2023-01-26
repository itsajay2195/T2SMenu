import {
    decompressApiResponse,
    filterScheduleByDate,
    filterScheduleByTime,
    filterCurrentMenu,
    filterArray,
    isAddonNameExistInModifierList,
    isModifierExists,
    extractAddOnCategoryGroup,
    extractAddonItems,
    isCategoryGroupAlreadyAvailableFor,
    getSearchResult,
    getModifierColor,
    getModifierStyle,
    getModifiedTextStyle,
    getAddOnPrice,
    getAddonText,
    convertAddonGroupListToDict,
    getButtonName,
    hasAddOn,
    isTakeawayFavorite
} from 'appmodules/MenuModule/Utils/MenuHelpers';
import {
    addOnCategory,
    cartItemForbasketResponse,
    compressedData,
    menuAddOn,
    menuResponse,
    storeConfig,
    takeawayListResponse
} from '../data';
import Colors from 't2sbasemodule/Themes/Colors';
import Styles from 'appmodules/MenuModule/View/Styles/AddOnStyles';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import {
    calculateMenuSyncTime,
    constructItemForBasketRecommendation,
    getCartItemsFromBasketResponse,
    isItemAvailableForSelectedOrderType
} from 'appmodules/MenuModule/Utils/MenuHelpers';
import { getCurrentBusinessMoment, isBetweenDays, isBetweenTime } from 't2sbasemodule/Utils/DateUtil';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import { resetDeviceTime, setDeviceTime, setDeviceTimeZone, TIME_ZONE } from '../../TestUtils/DateTestUtils';
import moment from 'moment-timezone';

describe('MenuModule Testing', () => {
    test('decompressApiResponse', () => {
        expect(decompressApiResponse(compressedData.data[0]).length).toEqual(26);
        expect(decompressApiResponse(null)).toEqual(null);
        expect(decompressApiResponse(undefined)).toEqual(null);
    });

    test('getCurrentBusinessMoment', () => {
        setDeviceTime('2022-09-04 12:06:19');
        expect(getCurrentBusinessMoment(TIME_ZONE.UK).format()).toEqual('2022-09-04T12:06:19+01:00');
        setDeviceTime('2022-09-04 05:06:19');
        expect(getCurrentBusinessMoment(TIME_ZONE.UK).format()).toEqual('2022-09-04T05:06:19+01:00');
        setDeviceTime('2022-09-04 04:06:19');
        expect(getCurrentBusinessMoment(TIME_ZONE.UK).format()).toEqual('2022-09-03T04:06:19+01:00');
        expect(getCurrentBusinessMoment(TIME_ZONE.AUS).format()).toEqual('2022-09-04T13:06:19+10:00');
        expect(getCurrentBusinessMoment(TIME_ZONE.US).format()).toEqual('2022-09-03T20:06:19-07:00');
        setDeviceTime('2022-09-04 12:06:19', TIME_ZONE.AUS);
        expect(getCurrentBusinessMoment(TIME_ZONE.AUS).format()).toEqual('2022-09-04T12:06:19+10:00');
    });

    test('isBetweenDays', () => {
        setDeviceTime('2022-09-04 05:06:19');
        expect(
            isBetweenDays(
                moment('2022-09-04 19:06:19', 'YYYY-MM-DD'),
                moment('2022-09-05 19:06:19').endOf('day'),
                getCurrentBusinessMoment(TIME_ZONE.UK)
            )
        ).toEqual(true);
        expect(
            isBetweenDays(
                moment('2022-09-04 19:06:19', 'YYYY-MM-DD'),
                moment('2022-09-05 19:06:19').endOf('day'),
                getCurrentBusinessMoment(TIME_ZONE.AUS)
            )
        ).toEqual(true);
        expect(isBetweenDays(moment('2022-09-04 19:06:19', 'YYYY-MM-DD'), moment('2022-09-05 19:06:19').endOf('day'), null)).toEqual(true);
        setDeviceTime('2022-09-04 04:06:19');
        expect(
            isBetweenDays(
                moment('2022-09-04 19:06:19', 'YYYY-MM-DD'),
                moment('2022-09-05 19:06:19').endOf('day'),
                getCurrentBusinessMoment(TIME_ZONE.UK)
            )
        ).toEqual(false);
    });

    test('filterScheduleByDate', () => {
        expect(filterScheduleByDate(menuResponse[0], getCurrentBusinessMoment(TIME_ZONE.UK))).toEqual(false);
        setDeviceTime('2022-09-04 19:06:19');
        expect(filterScheduleByDate(menuResponse[0], getCurrentBusinessMoment(TIME_ZONE.UK))).toEqual(true);
        setDeviceTimeZone(TIME_ZONE.AUS);
        expect(filterScheduleByDate(menuResponse[0], getCurrentBusinessMoment(TIME_ZONE.UK))).toEqual(true);

        function getData(start_date, end_date) {
            return {
                schedule: [
                    {
                        start_date: start_date,
                        end_date: end_date
                    }
                ]
            };
        }

        setDeviceTimeZone(TIME_ZONE.UK);
        const moment = getCurrentBusinessMoment(TIME_ZONE.UK);

        expect(filterScheduleByDate(getData('2022-09-04 19:06:19', '2022-09-04 19:06:19'), moment)).toEqual(true);
        expect(filterScheduleByDate(getData('2022-09-04 19:06:19', null), moment)).toEqual(true);
        expect(filterScheduleByDate(getData(null, null), moment)).toEqual(true);
        expect(
            filterScheduleByDate({
                schedule: []
            })
        ).toEqual(true);
        setDeviceTime('2022-09-05 19:06:19');
        expect(filterScheduleByDate(getData('2022-09-04 19:06:19', '2022-09-05 19:06:19'))).toEqual(true);
        setDeviceTime('2022-09-06 19:06:19');
        expect(filterScheduleByDate(getData('2022-09-04 19:06:19', '2022-09-05 19:06:19'))).toEqual(false);
        setDeviceTime('2022-09-03 19:06:19');
        expect(filterScheduleByDate(getData('2022-09-04 19:06:19', '2022-09-05 19:06:19'))).toEqual(false);
        resetDeviceTime();
    });

    test('isBetweenTime', () => {
        setDeviceTime('2022-09-04 19:06:19');
        expect(isBetweenTime(moment('2022-09-04 19:06:19'), moment('2022-09-04 19:06:19'), getCurrentBusinessMoment(TIME_ZONE.UK))).toEqual(
            true
        );
        expect(isBetweenTime('2022-09-04 19:06:19', '2022-09-04 19:06:19', getCurrentBusinessMoment(TIME_ZONE.UK))).toEqual(true);
    });

    test('filterScheduleByTime', () => {
        expect(filterScheduleByTime(menuResponse[0], getCurrentBusinessMoment(T2SConfig.default.timeZone))).toBe(true);

        function getData(start_time, end_time) {
            return {
                schedule: [
                    {
                        start_time: start_time,
                        end_time: end_time
                    }
                ]
            };
        }

        expect(filterScheduleByTime(getData('2022-09-04 19:06:19', null), getCurrentBusinessMoment(T2SConfig.default.timeZone))).toEqual(
            true
        );
        expect(filterScheduleByTime(getData(null, null), getCurrentBusinessMoment(T2SConfig.default.timeZone))).toEqual(true);
        setDeviceTime('2022-09-05 19:05:18');
        expect(
            filterScheduleByTime(
                getData('2022-09-04 19:06:19', '2022-09-05 14:34:19'),
                getCurrentBusinessMoment(T2SConfig.default.timeZone)
            )
        ).toEqual(true);
        setDeviceTime('2022-09-05 19:06:19');
        expect(
            filterScheduleByTime(
                getData('2022-09-04 19:06:19', '2022-09-05 19:06:19'),
                getCurrentBusinessMoment(T2SConfig.default.timeZone)
            )
        ).toEqual(false);
        setDeviceTime('2022-09-06 19:06:19');
        expect(
            filterScheduleByTime(
                getData('2022-09-04 19:06:19', '2022-09-05 19:06:19'),
                getCurrentBusinessMoment(T2SConfig.default.timeZone)
            )
        ).toEqual(false);
        resetDeviceTime();
    });

    describe('filterCurrentMenu Testing', () => {
        test('filterCurrentMenu', () => {
            expect(filterCurrentMenu(menuResponse, 'Delivery', 'monday', '2021-05-17T06:20:42.665Z', false).length).toBe(1);
            expect(filterCurrentMenu(menuResponse, 'collection', 'monday', '2021-05-17T06:20:42.665Z', false).length).toBe(1);
            expect(filterCurrentMenu(menuResponse, 'Delivery', 'tuesday', '2021-05-17T06:20:42.665Z', false).length).toBe(1);
            expect(filterCurrentMenu(menuResponse, '', '', '2021-05-17T06:20:42.665Z', false).length).toBe(0);
        });
    });

    describe('filterArray Testing', () => {
        test('filterArray', () => {
            expect(filterArray(menuResponse, 'Delivery', 'monday', '2021-05-17T06:20:42.665Z').length).toBe(1);
            expect(filterArray(menuResponse, 'Collection', 'monday', '2021-05-17T06:20:42.665Z').length).toBe(1);
            expect(filterArray(menuResponse, 'Delivery', 'tuesday', '2021-05-17T06:20:42.665Z').length).toBe(1);
            expect(filterArray(menuResponse, '', '', '2021-05-17T06:20:42.665Z').length).toBe(0);
        });
    });

    describe('isAddonNameExistInModifierList Testing', () => {
        test('isAddonNameExistInModifierList', () => {
            expect(isAddonNameExistInModifierList('No')).toBe(true);
            expect(isAddonNameExistInModifierList('Less')).toBe(true);
            expect(isAddonNameExistInModifierList('On Chips')).toBe(true);
            expect(isAddonNameExistInModifierList('On-Chips')).toBe(true);
            expect(isAddonNameExistInModifierList('On Burger')).toBe(true);
            expect(isAddonNameExistInModifierList('On-Burger')).toBe(true);
            expect(isAddonNameExistInModifierList('Free')).toBe(true);
            expect(isAddonNameExistInModifierList('On Half')).toBe(true);
            expect(isAddonNameExistInModifierList('On-Half')).toBe(true);
            expect(isAddonNameExistInModifierList('test')).toBe(false);
            expect(isAddonNameExistInModifierList('')).toBe(false);
            expect(isAddonNameExistInModifierList(' ')).toBe(false);
        });
    });

    describe('isModifierExists Testing', () => {
        test('isModifierExists', () => {
            expect(isModifierExists('No', addOnCategory)).toBe(true);
            expect(isModifierExists('no', addOnCategory)).toBe(true);
            expect(isModifierExists('Free', addOnCategory)).toBe(true);
            expect(isModifierExists('free', addOnCategory)).toBe(true);
            expect(isModifierExists('test', addOnCategory)).toBe(false);
            expect(isModifierExists(null, addOnCategory)).toBe(false);
            expect(isModifierExists(null, null)).toBe(false);
            expect(isModifierExists(undefined, undefined)).toBe(false);
            expect(isModifierExists('test', null)).toBe(false);
        });
    });

    describe('extractAddOnCategoryGroup Testing', () => {
        test('extractAddOnCategoryGroup', () => {
            expect(extractAddOnCategoryGroup(11322054, addOnCategory.data)).toEqual(addOnCategory.data[0]);
            expect(extractAddOnCategoryGroup(11322055, addOnCategory.data)).toEqual(addOnCategory.data[1]);
            expect(extractAddOnCategoryGroup(11322056, addOnCategory.data)).toEqual(addOnCategory.data[2]);
            expect(extractAddOnCategoryGroup(11322054, null)).toEqual(undefined);
            expect(extractAddOnCategoryGroup(null, addOnCategory.data)).toEqual(undefined);
        });
    });

    describe('extractAddonItems Testing', () => {
        test('extractAddonItems', () => {
            expect(extractAddonItems(10298058, menuAddOn)).toEqual([menuAddOn[0], menuAddOn[1]]);
            expect(extractAddonItems(10298424, menuAddOn)).toEqual([menuAddOn[2]]);
            expect(extractAddonItems(null, menuAddOn)).toEqual(undefined);
            expect(extractAddonItems(10298424, null)).toEqual(undefined);
        });
    });

    describe('isCategoryGroupAlreadyAvailableFor Testing', () => {
        test('isCategoryGroupAlreadyAvailableFor', () => {
            expect(isCategoryGroupAlreadyAvailableFor(11322054, addOnCategory.data)).toEqual(addOnCategory.data[0]);
            expect(isCategoryGroupAlreadyAvailableFor(11322055, addOnCategory.data)).toEqual(addOnCategory.data[1]);
            expect(isCategoryGroupAlreadyAvailableFor(11322056, addOnCategory.data)).toEqual(addOnCategory.data[2]);
            expect(isCategoryGroupAlreadyAvailableFor(11322054, null)).toEqual(null);
            expect(isCategoryGroupAlreadyAvailableFor(null, addOnCategory.data)).toEqual(null);
        });
    });

    describe('getSearchResult Testing', () => {
        test('getSearchResult', () => {
            expect(getSearchResult('Oat', menuResponse)).toEqual(menuResponse);
            expect(getSearchResult('Oat', menuResponse).length).toEqual(1);
            expect(getSearchResult('abc', menuResponse)).toEqual([]);
            expect(getSearchResult('', menuResponse)).toEqual(menuResponse);
            expect(getSearchResult(' ', menuResponse)).toEqual(menuResponse);
        });
    });

    describe('getModifierColor Testing', () => {
        test('getModifierColor', () => {
            expect(getModifierColor('Less', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('On Chips', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('On-Chips', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('On Burger', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('On-Burger', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('On Half', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('On-Half', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('Free', 'NONE')).toBe(Colors.modifier);
            expect(getModifierColor('No', 'NONE')).toBe(Colors.BittersweetRed);
            expect(getModifierColor('No', 'No')).toBe(Colors.white);
            expect(getModifierColor('Less', 'Less')).toBe(Colors.white);
            expect(getModifierColor('On Chips', 'On Chips')).toBe(Colors.white);
            expect(getModifierColor('On-Chips', 'On-Chips')).toBe(Colors.white);
            expect(getModifierColor('On Burger', 'On Burger')).toBe(Colors.white);
            expect(getModifierColor('On-Burger', 'On-Burger')).toBe(Colors.white);
            expect(getModifierColor('On Half', 'On Half')).toBe(Colors.white);
            expect(getModifierColor('On-Half', 'On-Half')).toBe(Colors.white);
            expect(getModifierColor('Free', 'Free')).toBe(Colors.white);
        });
    });

    describe('getModifierStyle Testing', () => {
        test('getModifierStyle', () => {
            expect(getModifierStyle('Less', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('On Chips', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('On-Chips', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('On Burger', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('On-Burger', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('On Half', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('On-Half', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('Free', 'NONE')).toBe(Styles.modifierAddOnStyle);
            expect(getModifierStyle('No', 'NONE')).toBe(Styles.noModifierAddOnStyle);
            expect(getModifierStyle('No', 'No')).toBe(Styles.noSelectedModifierAddOnStyle);
            expect(getModifierStyle('Less', 'Less')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('On Chips', 'On Chips')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('On-Chips', 'On-Chips')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('On Burger', 'On Burger')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('On-Burger', 'On-Burger')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('On Half', 'On Half')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('On-Half', 'On-Half')).toBe(Styles.selectedModifierAddOnStyle);
            expect(getModifierStyle('Free', 'Free')).toBe(Styles.selectedModifierAddOnStyle);
        });
    });

    describe('getModifiedTextStyle Testing', () => {
        test('getModifiedTextStyle', () => {
            expect(getModifiedTextStyle('NONE')).toEqual({});
            expect(getModifiedTextStyle('No')).toBe(Styles.modifierNoTextStyle);
            expect(getModifiedTextStyle('Less')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('On Chips')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('On-Chips')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('On Burger')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('On-Burger')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('On Half')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('On-Half')).toBe(Styles.modifierTextStyle);
            expect(getModifiedTextStyle('Free')).toBe(Styles.modifierTextStyle);
        });
    });

    describe('getAddonText Testing', () => {
        test('getAddonText', () => {
            expect(getAddonText(menuAddOn[0])).toBe('No Mushy Peas');
            expect(getAddonText(menuAddOn[1])).toBe('Garden Peas test');
            expect(getAddonText(menuAddOn[2])).toBe('Free Lettuce');
            expect(getAddonText(null)).toBe('');
            expect(getAddonText(undefined)).toBe('');
            expect(getAddonText()).toBe('');
        });
    });

    describe('getAddOnPrice Testing', () => {
        test('getAddOnPrice', () => {
            expect(getAddOnPrice(menuAddOn[0])).toBe('');
            expect(getAddOnPrice(menuAddOn[1])).toBe('0.40');
            expect(getAddOnPrice(menuAddOn[2])).toBe('3.00');
            expect(getAddOnPrice(null)).toBe('');
            expect(getAddOnPrice(undefined)).toBe('');
            expect(getAddOnPrice()).toBe('');
        });
    });

    describe('hasAddOn Testing', () => {
        test('hasAddOn', () => {
            expect(hasAddOn(menuAddOn[0])).toBe(true);
            expect(hasAddOn(menuAddOn[1])).toBe(true);
            expect(hasAddOn(menuAddOn[2])).toBe(true);
            expect(hasAddOn(null)).toBe(false);
            expect(hasAddOn(undefined)).toBe(false);
            expect(hasAddOn()).toBe(false);
        });
    });

    describe('getButtonName Testing', () => {
        test('getButtonName', () => {
            expect(getButtonName(addOnCategory.data[0])).toBe(LOCALIZATION_STRINGS.ADD_ITEM);
            expect(getButtonName(addOnCategory.data[1])).toBe(LOCALIZATION_STRINGS.ADD_ITEM);
            expect(getButtonName(addOnCategory.data[2])).toBe(LOCALIZATION_STRINGS.ADD_ITEM);
            expect(getButtonName(null)).toBe(LOCALIZATION_STRINGS.ADD_ITEM);
            expect(getButtonName(undefined)).toBe(LOCALIZATION_STRINGS.ADD_ITEM);
            expect(getButtonName()).toBe(LOCALIZATION_STRINGS.ADD_ITEM);
        });
    });

    describe('convertAddonGroupListToDict Testing', () => {
        test('convertAddonGroupListToDict', () => {
            expect(convertAddonGroupListToDict(menuAddOn)).toEqual({
                '209862064': menuAddOn[0],
                '209862065': menuAddOn[1],
                '209865457': menuAddOn[2]
            });
            expect(convertAddonGroupListToDict(null)).toEqual({});
        });
    });

    describe('isTakeawayFavorite Testing', () => {
        test('isTakeawayFavorite', () => {
            expect(isTakeawayFavorite(storeConfig, takeawayListResponse.data, true)).toBe(false);
            expect(isTakeawayFavorite(null, takeawayListResponse, true)).toBe(false);
            expect(isTakeawayFavorite(storeConfig, null, true)).toBe(false);
            expect(isTakeawayFavorite(null, null, true)).toBe(false);
            expect(isTakeawayFavorite(storeConfig, takeawayListResponse, false)).toBe(false);
            expect(isTakeawayFavorite(null, null, false)).toBe(false);
        });
    });

    describe('isItemAvailableForSelectedOrderType Testing', () => {
        test('isItemAvailableForSelectedOrderType', () => {
            expect(isItemAvailableForSelectedOrderType('collection', menuResponse[0])).toBe(false);
            expect(isItemAvailableForSelectedOrderType('delivery', menuResponse[0])).toBe(false);
            expect(isItemAvailableForSelectedOrderType('delivery', null)).toBe(false);
        });
    });

    describe('calculateMenuSyncTime Testing', () => {
        test('calculateMenuSyncTime', () => {
            expect(calculateMenuSyncTime(storeConfig)).toBe('808940-1617950526');
        });
    });

    describe('constructItemForBasketRecommendation Testing', () => {
        test('constructItemForBasketRecommendation', () => {
            expect(constructItemForBasketRecommendation(menuResponse)).toEqual([menuResponse[0].subcat[0].item[0]]);
            expect(constructItemForBasketRecommendation(null)).toEqual([]);
            expect(constructItemForBasketRecommendation(undefined)).toEqual([]);
            expect(constructItemForBasketRecommendation(menuResponse).length).toEqual(1);
        });
    });

    describe('getCartItemsFromBasketResponse Testing', () => {
        test('getCartItemsFromBasketResponse', () => {
            expect(getCartItemsFromBasketResponse(menuResponse)).toEqual([cartItemForbasketResponse]);
            expect(getCartItemsFromBasketResponse(null)).toEqual([]);
            expect(getCartItemsFromBasketResponse(undefined)).toEqual([]);
        });
    });
});
