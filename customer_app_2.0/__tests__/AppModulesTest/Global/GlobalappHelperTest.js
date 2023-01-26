import {
    isValidField,
    addressLabel,
    addressEmptyMessage,
    addressRequired,
    addressMaxLength,
    getSearchMaxLength,
    countryId,
    getCurrency,
    getCurrencyFromOrder,
    getCountryFromDeepLinkPath,
    getISOFromStore,
    isCanadaApp,
    isAUSApp,
    isUSApp,
    isUKApp,
    getCurrencyFromStore,
    isPostCodeSearch,
    getClientType,
    isEatAppyClient,
    isAddressSearch,
    getSearchType,
    isAutoCompletePickerArea,
    isAutoCompleteFind,
    iso,
    userCurrency,
    getPhoneMaxLength,
    addressVisible,
    addressInvalidMessage,
    getValidConfig,
    getLabelName
} from 'appmodules/BaseModule/GlobalAppHelper';
import { previosOrder, s3Config, storeConfig } from '../data';
import { CONFIG_TYPE, CURRENCY, SEARCH_TYPE } from 'appmodules/BaseModule/GlobalAppConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import { COUNTRY_CONFIG } from '../../../FoodHubApp/LandingPage/Utils/LandingPageConstants';
import { getFoodhubLogoStatus } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import { COUNTRY_NAME } from '../../../AppModules/AddressModule/Utils/AddressConstants';

describe('isValidField Testing', () => {
    describe('isValidField Testing', () => {
        test('isValidField', () => {
            expect(isValidField(null, CONFIG_TYPE.PHONE, null)).toBe(false);
            expect(isValidField(s3Config, null, null)).toBe(false);
            expect(isValidField(null, null, null)).toBe(false);
            expect(isValidField(undefined, undefined, undefined)).toBe(false);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, null)).toBe(false);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, undefined)).toBe(false);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, 'test')).toBe(true);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, '2342')).toBe(true);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, '7446411868')).toBe(true);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, '74464 11868')).toBe(true);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, '07446411868')).toBe(true);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, '@#$%A@#$%^')).toBe(true);
            expect(isValidField(s3Config, CONFIG_TYPE.PHONE, '213sdf324@#$%')).toBe(true);
        });
    });

    describe('addressLabel Testing', () => {
        test('addressLabel', () => {
            expect(addressLabel({}, 'post_code')).toBe('Postcode');
            expect(addressLabel(s3Config, 'post_code')).toBe('Postcode');
            expect(addressLabel(s3Config, '')).toBe(undefined);
        });
    });

    describe('getLabelName Testing', () => {
        // TODO export getLabelName before run
        test('getLabelName', () => {
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.HOUSE_NUMBER)).toBe(LOCALIZATION_STRINGS.HOUSE_DOOR_NO);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.FLAT)).toBe(LOCALIZATION_STRINGS.APARTMENT);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.POSTCODE)).toBe(LOCALIZATION_STRINGS.ZIPCODE);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.ADDRESS_LINE1)).toBe(LOCALIZATION_STRINGS.STREET);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.ADDRESS_LINE2)).toBe(LOCALIZATION_STRINGS.CITY);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.AREA)).toBe(LOCALIZATION_STRINGS.STATE);
            expect(getLabelName('', CONFIG_TYPE.HOUSE_NUMBER)).toBe(LOCALIZATION_STRINGS.HOUSE_DOOR_NO);
            expect(getLabelName('', CONFIG_TYPE.FLAT)).toBe(LOCALIZATION_STRINGS.STREET);
            expect(getLabelName('', CONFIG_TYPE.POSTCODE)).toBe(LOCALIZATION_STRINGS.POST_CODE);
            expect(getLabelName('', CONFIG_TYPE.ADDRESS_LINE1)).toBe(LOCALIZATION_STRINGS.ADDRESS);
            expect(getLabelName('', CONFIG_TYPE.ADDRESS_LINE2)).toBe(LOCALIZATION_STRINGS.CITY);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.HOUSE_NUMBER)).toBe(LOCALIZATION_STRINGS.HOUSE_DOOR_NO);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.FLAT)).toBe(LOCALIZATION_STRINGS.APARTMENT);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.POSTCODE)).toBe(LOCALIZATION_STRINGS.POST_CODE);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.ADDRESS_LINE1)).toBe(LOCALIZATION_STRINGS.STREET);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.ADDRESS_LINE2)).toBe(LOCALIZATION_STRINGS.CITY);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.AREA)).toBe(LOCALIZATION_STRINGS.STATE);
        });
    });

    describe('getLabelName Testing', () => {
        // TODO export getLabelName before run
        test('getLabelName', () => {
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.HOUSE_NUMBER)).toBe(LOCALIZATION_STRINGS.HOUSE_DOOR_NO);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.FLAT)).toBe(LOCALIZATION_STRINGS.APARTMENT);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.POSTCODE)).toBe(LOCALIZATION_STRINGS.ZIPCODE);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.ADDRESS_LINE1)).toBe(LOCALIZATION_STRINGS.STREET);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.ADDRESS_LINE2)).toBe(LOCALIZATION_STRINGS.CITY);
            expect(getLabelName(COUNTRY_NAME.UNITED_STATES, CONFIG_TYPE.AREA)).toBe(LOCALIZATION_STRINGS.STATE);
            expect(getLabelName('', CONFIG_TYPE.HOUSE_NUMBER)).toBe(LOCALIZATION_STRINGS.HOUSE_DOOR_NO);
            expect(getLabelName('', CONFIG_TYPE.FLAT)).toBe(LOCALIZATION_STRINGS.STREET);
            expect(getLabelName('', CONFIG_TYPE.POSTCODE)).toBe(LOCALIZATION_STRINGS.POST_CODE);
            expect(getLabelName('', CONFIG_TYPE.ADDRESS_LINE1)).toBe(LOCALIZATION_STRINGS.ADDRESS);
            expect(getLabelName('', CONFIG_TYPE.ADDRESS_LINE2)).toBe(LOCALIZATION_STRINGS.CITY);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.HOUSE_NUMBER)).toBe(LOCALIZATION_STRINGS.HOUSE_DOOR_NO);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.FLAT)).toBe(LOCALIZATION_STRINGS.APARTMENT);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.POSTCODE)).toBe(LOCALIZATION_STRINGS.POST_CODE);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.ADDRESS_LINE1)).toBe(LOCALIZATION_STRINGS.STREET);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.ADDRESS_LINE2)).toBe(LOCALIZATION_STRINGS.CITY);
            expect(getLabelName(COUNTRY_NAME.AUSTRALIA, CONFIG_TYPE.AREA)).toBe(LOCALIZATION_STRINGS.STATE);
        });
    });

    describe('addressEmptyMessage Testing', () => {
        test('addressEmptyMessage', () => {
            expect(addressEmptyMessage(s3Config, '')).toBe(LOCALIZATION_STRINGS.ADDRESS_ENTER_FIELD);
            expect(addressEmptyMessage(s3Config, 'post_code')).toBe(LOCALIZATION_STRINGS.ADDRESS_EMPTY_ERROR + 'Postcode');
        });
    });

    describe('addressRequired Testing', () => {
        test('addressRequired', () => {
            expect(addressRequired(s3Config, 'post_code')).toBe(true);
            expect(addressRequired(s3Config, '')).toBe(false);
        });
    });

    describe('addressMaxLength Testing', () => {
        test('addressMaxLength', () => {
            expect(addressMaxLength(s3Config, '')).toBe(100);
            expect(addressMaxLength(s3Config, 'post_code')).toBe(45);
        });
    });

    describe('getSearchMaxLength Testing', () => {
        test('getSearchMaxLength', () => {
            expect(getSearchMaxLength(s3Config, '')).toBe(100);
            expect(getSearchMaxLength(s3Config, 'post_code')).toBe(100);
        });
    });

    describe('countryId Testing', () => {
        test('countryId', () => {
            expect(countryId(2)).toBe(2);
            expect(countryId('')).toBe(1);
        });
    });

    describe('getCurrency Testing', () => {
        test('getCurrency', () => {
            expect(getCurrency(0)).toBe(0);
            expect(getCurrency(10)).toBe(10);
            expect(getCurrency('2')).toBe('2');
            expect(getCurrency(0.3)).toBe(0.3);
            expect(getCurrency('')).toBe('');
            expect(getCurrency(null)).toBe('');
            expect(getCurrency(undefined)).toBe('');
        });
    });

    describe('getCurrencyFromOrder Testing', () => {
        test('getCurrencyFromOrder', () => {
            expect(getCurrencyFromOrder(previosOrder)).toBe(CURRENCY.POUNDS);
            expect(getCurrencyFromOrder({})).toBe(CURRENCY.POUNDS);
        });
    });

    describe('getCountryFromDeepLinkPath Testing', () => {
        test('getCountryFromDeepLinkPath', () => {
            expect(getCountryFromDeepLinkPath(T2SConfig.website_url.UK)).toBe(T2SConfig.country.UK);
            expect(getCountryFromDeepLinkPath(T2SConfig.website_url.IRE)).toBe(T2SConfig.country.IRE);
            expect(getCountryFromDeepLinkPath(T2SConfig.website_url.AUS)).toBe(T2SConfig.country.AUS);
            expect(getCountryFromDeepLinkPath(T2SConfig.website_url.NZ)).toBe(T2SConfig.country.NZ);
            expect(getCountryFromDeepLinkPath(T2SConfig.website_url.US)).toBe(T2SConfig.country.US);
            expect(getCountryFromDeepLinkPath('')).toBe(T2SConfig.country.UK);
        });
    });

    describe('getISOFromStore Testing', () => {
        test('getISOFromStore', () => {
            expect(getISOFromStore({})).toBe('');
            expect(getISOFromStore(storeConfig)).toBe('GB');
        });
    });

    describe('isCanadaApp Testing', () => {
        test('isCanadaApp', () => {
            expect(isCanadaApp(10)).toBe(true);
            expect(isCanadaApp(11)).toBe(false);
        });
    });

    describe('isAUSApp Testing', () => {
        test('isAUSApp', () => {
            expect(isAUSApp(3)).toBe(true);
            expect(isAUSApp(33)).toBe(false);
        });
    });
    describe('isUSApp Testing', () => {
        test('isUSApp', () => {
            expect(isUSApp(7)).toBe(true);
            expect(isUSApp(0)).toBe(false);
        });
    });

    describe('isUKApp Testing', () => {
        test('isUKApp', () => {
            expect(isUKApp(1)).toBe(true);
            expect(isUKApp(2)).toBe(false);
        });
    });

    describe('getCurrencyFromStore Testing', () => {
        test('getCurrencyFromStore', () => {
            expect(getCurrencyFromStore({})).toBe('');
            expect(getCurrencyFromStore(storeConfig)).toBe(1);
            expect(getCurrencyFromStore(null)).toBe('');
            expect(getCurrencyFromStore(undefined)).toBe('');
        });
    });

    describe('isPostCodeSearch Testing', () => {
        test('isPostCodeSearch', () => {
            expect(isPostCodeSearch(SEARCH_TYPE.POSTCODE, 'au')).toBe(true);
            expect(getClientType('', '')).toBe(false);
        });
    });

    describe('getClientType Testing', () => {
        test('getClientType', () => {
            expect(getClientType('T2S', 'au')).toBe('T2S');
            expect(getClientType('', '')).toBe(false);
        });
    });

    describe('isEatAppyClient Testing', () => {
        test('isEatAppyClient', () => {
            expect(isEatAppyClient('EAT-APPY', 'au')).toBe(true);
            expect(isEatAppyClient('EAT-APPY', '')).toBe(true);
        });
    });

    describe('isAddressSearch Testing', () => {
        test('isAddressSearch', () => {
            expect(isAddressSearch(SEARCH_TYPE.POSTCODE, 'au')).toBe(false);
            expect(isAddressSearch('', '')).toBe(false);
        });
    });

    describe('getSearchType Testing', () => {
        test('getSearchType', () => {
            expect(getSearchType('', '')).toBe('postcode');
            expect(getSearchType(SEARCH_TYPE.POSTCODE, 'au')).toBe('postcode');
        });
    });

    describe('isAutoCompletePickerArea Testing', () => {
        test('isAutoCompletePickerArea', () => {
            expect(isAutoCompletePickerArea({})).toBe(false);
            expect(isAutoCompletePickerArea(s3Config)).toBe(true);
        });
    });

    describe('isAutoCompleteFind Testing', () => {
        test('isAutoCompleteFind', () => {
            expect(isAutoCompleteFind(SEARCH_TYPE.POSTCODE, 'EAT-APPY', 'au')).toBe(true);
            expect(isAutoCompleteFind('', '', '')).toBe(false);
        });
    });

    describe('iso Testing', () => {
        test('iso', () => {
            expect(iso('', '', '')).toBe('GB');
            expect(iso('NZ', 'nz')).toBe('NZ');
        });
    });

    describe('userCurrency Testing', () => {
        test('userCurrency', () => {
            expect(userCurrency('$', 'nz')).toBe('$');
            expect(userCurrency('', '')).toBe('\u00a3');
        });
    });

    describe('getPhoneMaxLength Testing', () => {
        test('getPhoneMaxLength', () => {
            expect(getPhoneMaxLength(10, 'gb')).toBe(9);
            expect(getPhoneMaxLength(0, 'nz')).toBe(99);
            expect(getPhoneMaxLength()).toBe(10);
        });
    });

    describe('addressVisible Testing', () => {
        test('addressVisible', () => {
            expect(addressVisible(s3Config, 'post_code')).toBe(true);
            expect(addressVisible(s3Config, '')).toBe(false);
        });
    });

    describe('addressInvalidMessage Testing', () => {
        test('addressInvalidMessage', () => {
            expect(addressInvalidMessage(s3Config, '')).toBe(LOCALIZATION_STRINGS.ADDRESS_INVALID_FIELD);
            expect(addressInvalidMessage(s3Config, 'post_code', 'en')).toBe('The Postcode format is invalid');
        });
    });

    describe('addressEmptyMessage Testing', () => {
        test('addressEmptyMessage', () => {
            expect(addressEmptyMessage(s3Config, 'post_code')).toBe(LOCALIZATION_STRINGS.ADDRESS_EMPTY_ERROR + 'Postcode');
            expect(addressEmptyMessage(s3Config, '')).toBe(LOCALIZATION_STRINGS.ADDRESS_ENTER_FIELD);
        });
    });

    describe('getValidConfig Testing', () => {
        test('getValidConfig', () => {
            expect(getValidConfig(s3Config, 'post_code', 'name')).toBe(s3Config);
            expect(getValidConfig(s3Config, 'post_code', '')).toBe(COUNTRY_CONFIG.gb);
            expect(getValidConfig({}, '', '')).toBe(COUNTRY_CONFIG.gb);
        });
    });

    //TO DO: return boolean condition on getFoodhubLogoStatus method to check unit test
    describe('getFoodhubLogoStatus Testing', () => {
        test('getFoodhubLogoStatus', () => {
            expect(getFoodhubLogoStatus(null)).toEqual({});
            expect(getFoodhubLogoStatus(true)).toEqual({});
            expect(getFoodhubLogoStatus('')).toEqual({});
            expect(getFoodhubLogoStatus(undefined)).toEqual({});
            expect(getFoodhubLogoStatus([])).toEqual({});
            expect(getFoodhubLogoStatus('ss')).toEqual({});
            expect(getFoodhubLogoStatus({})).toEqual({});
            expect(getFoodhubLogoStatus({ status: '' })).toEqual({});
            expect(getFoodhubLogoStatus({ status: null })).toEqual({});
            expect(getFoodhubLogoStatus({ status: undefined })).toEqual({});
            expect(getFoodhubLogoStatus({ status: {} })).toEqual({});
            expect(getFoodhubLogoStatus({ status: [] })).toEqual({});
            expect(getFoodhubLogoStatus({ status: 'DISABLED' })).toEqual({});
            expect(getFoodhubLogoStatus({ status: 'DISABLED' })).toEqual({});
            expect(getFoodhubLogoStatus({ status: 'DISABLED', options: { enable_black: true } })).toEqual({});
            expect(getFoodhubLogoStatus({ status: 'ENABLED', options: { enable_black: false } })).toEqual({});
            expect(getFoodhubLogoStatus({ status: 'ENABLED', options: { enable_black: true } })).toEqual({});
        });
    });
});
