import {
    getPostCode,
    extractAddress,
    extractLocation,
    getPostcodeFromAddressResponse,
    extractStateInfoFromRouteParam,
    hasChanges,
    extractDeliveryAddressFromAddressList,
    getPrimaryPostCode,
    isPrimaryAddress,
    validateStates,
    validateFields,
    addressParamsObj,
    isValidCoordinates,
    getDefaultLatitude,
    getDefaultLongitude,
    getDefaultDelta,
    deletePrimaryAddressHelper,
    addAddressLocally,
    extractPostcode,
    addressMissingFieldsPayload,
    getHostAndFranchise,
    getOrderTypeForBasket,
    isBasketOrderTypeChanged,
    isBasketOrder,
    isValidAreaFromFuzzyResults,
    validAddress,
    getDeliveryAddressSortByLatestUpdate,
    getAddressWithSeparator,
    formattedAddressObj,
    isAlreadySavedAddress,
    searchTakeawayAddressFormat,
    getOrderTypeToggleDefaultValue,
    skipForCA,
    isValidSearchInput
} from 'appmodules/AddressModule/Utils/AddressHelpers';
import { s3Config, addressData, addressState, addresses, addressStateValue, storeConfig, featureGateResponse } from '../data';
import { FOODHUB_FRANCHISE_ID, FOODHUB_HOST_NAME } from '../../../CustomerApp/Utils/AppContants';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';

describe('AddressHelper Testing', () => {
    describe('getPostCode Testing', () => {
        test('getPostCode', () => {
            expect(getPostCode(addressData)).toBe('ST6 5SB');
            expect(getPostCode(null)).toBe('');
            expect(getPostCode(undefined)).toBe('');
            expect(
                getPostCode({
                    address_components: [
                        {
                            long_name: 'ST6 6DX',
                            short_name: null,
                            types: ['postal_code']
                        }
                    ]
                })
            ).toBe(null);
            expect(
                getPostCode({
                    address_components: [
                        {
                            long_name: 'ST6 6DX',
                            short_name: undefined,
                            types: ['postal_code']
                        }
                    ]
                })
            ).toBe(undefined);
        });
        let address = {
            address: '',
            address_line2: 'Tunstall, Stoke-on-Trent',
            area: 'Stoke-on-Trent, England',
            city: '',
            country: 'United Kingdom',
            doorNo: '1',
            latitude: 53.0627109,
            longitude: -2.2069169,
            showEmptyAddressError: false,
            showEmptyAreaError: false,
            showEmptyCityError: false,
            showEmptyDoorNumberError: false,
            showInvalidAddressError: false,
            showInvalidAreaError: false,
            showInvalidCityError: false,
            showInvalidDoorNumberError: false
        };
        describe('extractAddress Testing', () => {
            test('extractAddress', () => {
                expect(extractAddress(addressData, s3Config, '')).toEqual({
                    ...address,
                    address_line1: '',
                    postCode: '',
                    showInvalidPostCodeError: false
                });
                expect(extractAddress(null, s3Config, '')).toEqual(undefined);
                expect(extractAddress(addressData, null, '')).toEqual({
                    ...address,
                    address_line1: 'Pebble View',
                    displayPostcode: 'ST6 5SB',
                    postCode: 'ST6 5SB'
                });
            });
        });

        describe('extractLocation Testing', () => {
            test('extractLocation', () => {
                expect(extractLocation(addressData)).toEqual({
                    latitude: 53.0627109,
                    longitude: -2.2069169
                });
                expect(extractLocation(null)).toEqual(undefined);
                expect(extractLocation(undefined)).toEqual(undefined);
            });
        });

        describe('getPostcodeFromAddressResponse Testing', () => {
            test('getPostcodeFromAddressResponse', () => {
                expect(getPostcodeFromAddressResponse(addressData.address_components)).toBe('ST6 5SB');
                expect(getPostcodeFromAddressResponse(null)).toBe(undefined);
                expect(getPostcodeFromAddressResponse(undefined)).toBe(undefined);
                expect(getPostcodeFromAddressResponse([])).toBe(undefined);
                expect(
                    getPostcodeFromAddressResponse([
                        {
                            long_name: null,
                            short_name: 'ST6 6DX',
                            types: ['postal_code']
                        }
                    ])
                ).toBe(null);
                expect(
                    getPostcodeFromAddressResponse([
                        {
                            long_name: undefined,
                            short_name: 'ST6 6DX',
                            types: ['postal_code']
                        }
                    ])
                ).toBe(undefined);
                expect(
                    getPostcodeFromAddressResponse([
                        {
                            long_name: 'ST6 6DX',
                            short_name: 'ST6 6DX',
                            types: ['political', 'sublocality', 'sublocality_level_1', 'postal_code']
                        }
                    ])
                ).toBe(undefined);
                expect(
                    getPostcodeFromAddressResponse([
                        {
                            long_name: 'ST6 6DX',
                            short_name: 'ST6 6DX',
                            types: []
                        }
                    ])
                ).toBe(undefined);
            });
        });
    });

    describe('extractStateInfoFromRouteParam Testing', () => {
        test('extractStateInfoFromRouteParam', () => {
            expect(extractStateInfoFromRouteParam(addresses.data[0])).toEqual({
                address_line1: 'Preston',
                address_line2: 'Preston',
                area: 'Victoria',
                displayPostcode: '3072',
                doorNo: '1',
                flat: '1',
                latDelta: 0.001,
                latitude: '-37.7399362',
                longDelta: 0.001,
                longitude: '145.0107588',
                postCode: '3072',
                togglePrimaryAddressButton: false
            });
            expect(extractStateInfoFromRouteParam({})).toEqual({
                address_line1: '',
                address_line2: '',
                area: '',
                displayPostcode: '',
                doorNo: '',
                flat: '',
                latDelta: 10,
                latitude: '',
                longDelta: 10,
                longitude: '',
                postCode: '',
                togglePrimaryAddressButton: false
            });
            expect(extractStateInfoFromRouteParam({ address_line1: null, address_line2: undefined })).toEqual({
                address_line1: '',
                address_line2: '',
                area: '',
                displayPostcode: '',
                doorNo: '',
                flat: '',
                latDelta: 10,
                latitude: '',
                longDelta: 10,
                longitude: '',
                postCode: '',
                togglePrimaryAddressButton: false
            });
        });
    });

    describe('hasChanges Testing', () => {
        test('hasChanges', () => {
            expect(hasChanges(addresses.data[0], addressState, 'edit', s3Config)).toBe(true);
            expect(hasChanges(addresses.data[1], addressState, 'edit', s3Config)).toBe(false);
            expect(hasChanges(addresses.data[1], addressState, 'edit', s3Config)).toBe(false);
            expect(hasChanges(addresses.data[0], addressState, null, s3Config)).toBe(true);
            expect(hasChanges(addresses.data[0], addressState, undefined, s3Config)).toBe(true);
            expect(hasChanges(addresses.data[0], addressState, 'edit', undefined)).toBe(true);
            expect(hasChanges(addresses.data[0], addressState, 'edit', null)).toBe(true);
            expect(hasChanges(addresses.data[0], addressState, 'edit', {})).toBe(true);
        });
    });

    describe('extractDeliveryAddressFromAddressList Testing', () => {
        test('extractDeliveryAddressFromAddressList', () => {
            expect(extractDeliveryAddressFromAddressList(addresses.data[0], null, addresses)).toEqual(addresses.data[1]);
            expect(extractDeliveryAddressFromAddressList(null, null, addresses)).toEqual(addresses.data[1]);
        });
    });

    describe('getPrimaryPostCode Testing', () => {
        test('getPrimaryPostCode', () => {
            expect(getPrimaryPostCode()).toBe('');
            expect(getPrimaryPostCode('AA1 1AA', addresses)).toBe('ST6 5SB');
            expect(getPrimaryPostCode('AA1 1AA', addresses)).toBe('ST6 5SB');
            expect(getPrimaryPostCode('ST66DX', addresses)).toBe('ST6 5SB');
            expect(getPrimaryPostCode('', addresses)).toBe('ST6 5SB');
            expect(getPrimaryPostCode(null, addresses)).toBe('');
            expect(getPrimaryPostCode(undefined, addresses)).toBe('');
            expect(getPrimaryPostCode({}, addresses)).toBe('ST6 5SB');
            expect(getPrimaryPostCode('AA1 1AA', addresses)).toBe('ST6 5SB');
            expect(getPrimaryPostCode('AA1 1AA', null)).toBe('');
            expect(getPrimaryPostCode('AA1 1AA', undefined)).toBe('');
            expect(getPrimaryPostCode('AA1 1AA', '')).toBe('');
            expect(getPrimaryPostCode('AA1 1AA', {})).toBe('');
        });
    });

    describe('isPrimaryAddress Testing', () => {
        test('isPrimaryAddress', () => {
            expect(isPrimaryAddress(addresses.data[0])).toBe(false);
            expect(isPrimaryAddress(addresses.data[1])).toBe(true);
            expect(isPrimaryAddress(null)).toBe(false);
            expect(isPrimaryAddress(undefined)).toBe(false);
            expect(isPrimaryAddress({})).toBe(false);
        });
    });

    describe('validateStates Testing', () => {
        test('validateStates', () => {
            expect(validateStates(addressState, { s3ConfigResponse: s3Config })).toEqual({
                showEmptyAddressError: false,
                showEmptyAreaError: false,
                showEmptyCityError: false,
                showEmptyDoorNumberError: false,
                showEmptyPostcodeError: false,
                showInvalidAddressError: false,
                showInvalidAreaError: false,
                showInvalidCityError: false,
                showInvalidDoorNumberError: false,
                showInvalidPostCodeError: true
            });
        });
    });

    let state = {
        showEmptyDoorNumberError: false,
        showInvalidDoorNumberError: false,
        showEmptyPostcodeError: false,
        showInvalidPostCodeError: false,
        showEmptyAddressError: false,
        showInvalidAddressError: false,
        showEmptyCityError: false,
        showInvalidCityError: false,
        showEmptyAreaError: false,
        showInvalidAreaError: false
    };
    describe('validateFields Testing', () => {
        test('validateFields', () => {
            expect(validateFields({})).toBe(true);
            expect(validateFields(state)).toBe(true);
            expect(validateFields({ showEmptyDoorNumberError: true })).toBe(false);
            expect(validateFields({ showEmptyDoorNumberError: null })).toBe(true);
            expect(validateFields({ showEmptyDoorNumberError: false })).toBe(true);
            expect(validateFields({ showEmptyDoorNumberError: undefined })).toBe(true);
            expect(validateFields({ showInvalidDoorNumberError: true })).toBe(false);
            expect(validateFields({ showInvalidDoorNumberError: null })).toBe(true);
            expect(validateFields({ showInvalidDoorNumberError: undefined })).toBe(true);
            expect(validateFields({ showInvalidDoorNumberError: false })).toBe(true);
            expect(validateFields({ showEmptyPostcodeError: true })).toBe(false);
            expect(validateFields({ showEmptyPostcodeError: null })).toBe(true);
            expect(validateFields({ showEmptyPostcodeError: undefined })).toBe(true);
            expect(validateFields({ showEmptyPostcodeError: false })).toBe(true);
            expect(validateFields({ showInvalidPostCodeError: true })).toBe(false);
            expect(validateFields({ showInvalidPostCodeError: null })).toBe(true);
            expect(validateFields({ showInvalidPostCodeError: undefined })).toBe(true);
            expect(validateFields({ showInvalidPostCodeError: false })).toBe(true);
            expect(validateFields({ showEmptyAddressError: true })).toBe(false);
            expect(validateFields({ showEmptyAddressError: null })).toBe(true);
            expect(validateFields({ showEmptyAddressError: undefined })).toBe(true);
            expect(validateFields({ showEmptyAddressError: false })).toBe(true);
            expect(validateFields({ showEmptyCityError: true })).toBe(false);
            expect(validateFields({ showEmptyCityError: null })).toBe(true);
            expect(validateFields({ showEmptyCityError: undefined })).toBe(true);
            expect(validateFields({ showEmptyCityError: false })).toBe(true);
            expect(validateFields({ showInvalidCityError: true })).toBe(false);
            expect(validateFields({ showInvalidCityError: false })).toBe(true);
            expect(validateFields({ showInvalidCityError: null })).toBe(true);
            expect(validateFields({ showInvalidCityError: undefined })).toBe(true);
            expect(validateFields({ showEmptyAreaError: true })).toBe(false);
            expect(validateFields({ showInvalidAreaError: true })).toBe(false);
            expect(validateFields({ showInvalidAreaError: false })).toBe(true);
        });
    });

    describe('addressParamsObj Testing', () => {
        test('addressParamsObj', () => {
            expect(addressParamsObj(addressState, s3Config)).toEqual({
                address_line1: 'Pebble View',
                address_line2: 'Stoke-on-Trent',
                flat: '',
                house_number: '1',
                is_primary: 'NO',
                latitude: 53.0627109,
                longitude: -2.2069169,
                postcode: 'ST6 5SB'
            });
        });
    });

    describe('isValidCoordinates Testing', () => {
        test('isValidCoordinates', () => {
            expect(isValidCoordinates('-37.7399362', '145.0107588')).toBe(true);
            expect(isValidCoordinates(-37.7399362, 145.0107588)).toBe(true);
            expect(isValidCoordinates(null, 145.0107588)).toBe(false);
            expect(isValidCoordinates('text', '145.0107588')).toBe(true);
            expect(isValidCoordinates('', '')).toBe(false);
            expect(isValidCoordinates('-37.7399362', null)).toBe(false);
            expect(isValidCoordinates(undefined, null)).toBe(false);
        });
    });

    describe('getDefaultLatitude Testing', () => {
        test('getDefaultLatitude', () => {
            expect(getDefaultLatitude(s3Config.map.latitude)).toBe('53.062790');
            expect(getDefaultLatitude(null)).toBe(0);
            expect(getDefaultLatitude(undefined)).toBe(0);
            expect(getDefaultLatitude('')).toBe('');
        });
    });

    describe('getDefaultLongitude Testing', () => {
        test('getDefaultLongitude', () => {
            expect(getDefaultLongitude(s3Config.map.longitude)).toBe('-2.202990');
            expect(getDefaultLongitude(null)).toBe(0);
            expect(getDefaultLongitude(undefined)).toBe(0);
            expect(getDefaultLatitude('')).toBe('');
        });
    });

    describe('getDefaultDelta Testing', () => {
        test('getDefaultDelta', () => {
            expect(getDefaultDelta(s3Config)).toBe(20);
            expect(getDefaultDelta(null)).toBe(20);
            expect(getDefaultDelta(undefined)).toBe(20);
            expect(getDefaultDelta({})).toBe(20);
        });
    });

    describe('deletePrimaryAddressHelper Testing', () => {
        test('deletePrimaryAddressHelper', () => {
            expect(deletePrimaryAddressHelper(addresses.data, [addresses.data[0]], 19676806)).toBe(21);
            expect(deletePrimaryAddressHelper(addresses.data, [addresses.data[1]], 19575788)).toBe(21);
            expect(deletePrimaryAddressHelper(null, [addresses.data[1]], 19575788)).toBe(undefined);
            expect(deletePrimaryAddressHelper(undefined, [addresses.data[1]], 19575788)).toBe(undefined);
        });
    });

    describe('addAddressLocally Testing', () => {
        test('addAddressLocally', () => {
            expect(addAddressLocally(addresses, addresses.data[0])).toEqual(addresses);
            expect(addAddressLocally(null, addresses.data[0])).toEqual(null);
            expect(addAddressLocally(undefined, addresses.data[0])).toEqual(undefined);
        });
    });
    describe('extractPostcode Testing', () => {
        test('extractPostcode', () => {
            expect(extractPostcode(addressData)).toEqual({ postCode: 'ST6 5SB' });
            expect(extractPostcode('')).toEqual(undefined);
            expect(extractPostcode(null)).toEqual(undefined);
        });
    });
    describe('addressMissingFieldsPayload Testing', () => {
        test('addressMissingFieldsPayload', () => {
            expect(
                addressMissingFieldsPayload(
                    {
                        address_line1: 'Pebble View',
                        address_line2: 'Stoke-on-Trent',
                        house_number: '1',
                        area: '',
                        postcode: 'ST6 5SB'
                    },
                    addressStateValue
                )
            ).toEqual({
                address_line1: 'Pebble View',
                address_line2: 'Stoke-on-Trent',
                area: '',
                house_number: '1',
                postcode: 'ST6 5SB'
            });
            expect(
                addressMissingFieldsPayload(
                    {
                        address_line1: 'Pebble View'
                    },
                    addressStateValue
                )
            ).toEqual({
                address_line1: 'Pebble View'
            });
            expect(addressMissingFieldsPayload({}, addressStateValue)).toEqual({});
            expect(addressMissingFieldsPayload(undefined, addressStateValue)).toEqual(undefined);
        });
    });
    describe('getHostAndFranchise Testing', () => {
        test('getHostAndFranchise', () => {
            expect(getHostAndFranchise({ config_env_type: 'LIVE' })).toEqual({
                host: FOODHUB_HOST_NAME.LIVE,
                franchise: FOODHUB_FRANCHISE_ID.LIVE
            });
            expect(getHostAndFranchise({ config_env_type: 'QA' })).toEqual({
                franchise: '2461',
                host: 'foodhub.com'
            });
        });
    });

    describe('getOrderTypeForBasket Testing', () => {
        test('getOrderTypeForBasket', () => {
            expect(getOrderTypeForBasket(ORDER_TYPE.DELIVERY)).toBe(ORDER_TYPE.DELIVERY);
            expect(getOrderTypeForBasket(ORDER_TYPE.COLLECTION)).toBe(ORDER_TYPE.COLLECTION);
            expect(getOrderTypeForBasket(ORDER_TYPE.BOTH)).toBe(ORDER_TYPE.BOTH);
            expect(getOrderTypeForBasket(ORDER_TYPE.WAITING)).toBe(ORDER_TYPE.WAITING);
            expect(getOrderTypeForBasket(null)).toBe(ORDER_TYPE.DELIVERY);
            expect(getOrderTypeForBasket(undefined)).toBe(ORDER_TYPE.DELIVERY);
            expect(getOrderTypeForBasket('')).toBe('');
        });
    });

    describe('isBasketOrderTypeChanged Testing', () => {
        test('isBasketOrderTypeChanged', () => {
            expect(isBasketOrderTypeChanged()).toBe(false);
        });
    });

    describe('isBasketOrder Testing', () => {
        test('isBasketOrder', () => {
            expect(isBasketOrder(storeConfig.id, storeConfig.id)).toBe(true);
            expect(isBasketOrder(null, storeConfig.id)).toBe(false);
            expect(isBasketOrder(undefined, storeConfig.id)).toBe(false);
            expect(isBasketOrder('', storeConfig.id)).toBe(false);
            expect(isBasketOrder(1234, storeConfig.id)).toBe(false);
            expect(isBasketOrder({}, storeConfig.id)).toBe(false);
            expect(isBasketOrder('1234', storeConfig.id)).toBe(false);
            expect(isBasketOrder(storeConfig.id, null)).toBe(false);
            expect(isBasketOrder(storeConfig.id, undefined)).toBe(false);
            expect(isBasketOrder(storeConfig.id, '')).toBe(false);
            expect(isBasketOrder(storeConfig.id, 1234)).toBe(false);
            expect(isBasketOrder(storeConfig.id, {})).toBe(false);
            expect(isBasketOrder(storeConfig.id, '1234')).toBe(false);
            expect(isBasketOrder('1234', '1234')).toBe(true);
        });
    });

    describe('isValidAreaFromFuzzyResults Testing', () => {
        test('isValidAreaFromFuzzyResults', () => {
            expect(isValidAreaFromFuzzyResults(null, null)).toBe(false);
            expect(isValidAreaFromFuzzyResults(null, false)).toBe(false);
            expect(isValidAreaFromFuzzyResults(null, undefined)).toBe(false);
            expect(isValidAreaFromFuzzyResults(null, '')).toBe(false);
            expect(isValidAreaFromFuzzyResults(null, 1234)).toBe(false);
            expect(isValidAreaFromFuzzyResults(null, 'test')).toBe(false);
            expect(isValidAreaFromFuzzyResults(undefined, 'test')).toBe(false);
            expect(isValidAreaFromFuzzyResults('', 'test')).toBe(false);
            expect(isValidAreaFromFuzzyResults({}, 'test')).toBe(false);
            expect(isValidAreaFromFuzzyResults({ undefined }, 'test')).toBe(false);
            expect(isValidAreaFromFuzzyResults({ fussySearchSuggestions: ['test', 'no'] }, 'test')).toBe(true);
            expect(isValidAreaFromFuzzyResults({ fussySearchSuggestions: ['yes', 'no'] }, 'test')).toBe(false);
        });
    });

    describe('validAddress Testing', () => {
        test('validAddress', () => {
            expect(validAddress(addressStateValue, { s3Config })).toBe(true);
            expect(validAddress(null, { s3Config })).toBe(false);
            expect(validAddress(undefined, { s3Config })).toBe(false);
            expect(validAddress('', { s3Config })).toBe(false);
            expect(validAddress({}, { s3Config })).toBe(false);
            expect(validAddress(addressStateValue, {})).toBe(false);
            expect(validAddress(addressStateValue, null)).toBe(false);
            expect(validAddress(addressStateValue, undefined)).toBe(false);
            expect(validAddress(addressStateValue, { undefined })).toBe(false);
            expect(validAddress(addressStateValue, '')).toBe(false);
        });
    });

    describe('formattedAddressObj Testing', () => {
        test('formattedAddressObj', () => {
            expect(formattedAddressObj(addressStateValue, true, s3Config.post_code.reg_ex)).toBe('Preston, Preston, AA1 1AA');
            expect(formattedAddressObj(addressStateValue, false, s3Config.post_code.reg_ex)).toBe('Preston, Preston, AA1 1AA');
            expect(formattedAddressObj(addressStateValue, null, s3Config.post_code.reg_ex)).toBe('Preston, Preston, AA1 1AA');
            expect(formattedAddressObj(addressStateValue, undefined, s3Config.post_code.reg_ex)).toBe('Preston, Preston, AA1 1AA');
            expect(formattedAddressObj(addressStateValue, true, null)).toBe('Preston, Preston, AA1 1AA');
            expect(formattedAddressObj(addressStateValue, false, undefined)).toBe('Preston, Preston, AA1 1AA');
            expect(formattedAddressObj(null, false, undefined)).toBe('');
        });
    });

    describe('isAlreadySavedAddress Testing', () => {
        test('isAlreadySavedAddress', () => {
            const { data } = addresses;
            expect(isAlreadySavedAddress(data[0], data[1])).toBe(false);
            expect(isAlreadySavedAddress(data[0], data[1])).toBe(false);
            expect(isAlreadySavedAddress(data[1], addressState)).toBe(true);
            expect(isAlreadySavedAddress(data[1], data[0])).toBe(false);
            expect(isAlreadySavedAddress(data[0], null)).toBe(false);
            expect(isAlreadySavedAddress(data[0], undefined)).toBe(false);
            expect(isAlreadySavedAddress(null, data[0])).toBe(false);
            expect(isAlreadySavedAddress(undefined, data[0])).toBe(false);
        });
    });

    describe('getDeliveryAddressSortByLatestUpdate Testing', () => {
        test('getDeliveryAddressSortByLatestUpdate', () => {
            expect(getDeliveryAddressSortByLatestUpdate(addresses.data)).toBe(addresses.data[2]);
            expect(getDeliveryAddressSortByLatestUpdate(null)).toBe(null);
            expect(getDeliveryAddressSortByLatestUpdate(undefined)).toBe(null);
            expect(getDeliveryAddressSortByLatestUpdate({})).toBe(null);
        });
    });

    describe('getAddressWithSeparator Testing', () => {
        test('getAddressWithSeparator', () => {
            expect(getAddressWithSeparator('test')).toBe('test, ');
            expect(getAddressWithSeparator(1)).toBe('1, ');
            expect(getAddressWithSeparator(null)).toBe(null);
            expect(getAddressWithSeparator(undefined)).toBe(undefined);
        });
    });

    describe('searchTakeawayAddressFormat Testing', () => {
        test('searchTakeawayAddressFormat', () => {
            expect(searchTakeawayAddressFormat(addresses.data[0])).toBe('1 1, Preston, 3072');
            expect(searchTakeawayAddressFormat(addresses.data[0], true)).toBe('1 1, Preston, 3072');
            expect(searchTakeawayAddressFormat(addresses.data[0], false)).toBe('1 1, Preston, 3072');
            expect(searchTakeawayAddressFormat(null)).toBe('');
            expect(searchTakeawayAddressFormat(undefined)).toBe('');
        });
    });

    describe('isValidSearchInput Testing', () => {
        test('isValidSearchInput', () => {
            expect(isValidSearchInput(null)).toBe(false);
            expect(isValidSearchInput(undefined)).toBe(false);
            expect(isValidSearchInput('')).toBe(false);
            expect(isValidSearchInput(0)).toBe(false);
            expect(isValidSearchInput(0.0)).toBe(false);
            expect(isValidSearchInput(true)).toBe(false);
            expect(isValidSearchInput(' ')).toBe(false);
            expect(isValidSearchInput('       ')).toBe(false);
            expect(isValidSearchInput('s')).toBe(false);
            expect(isValidSearchInput('st')).toBe(false);
            expect(isValidSearchInput(' st')).toBe(false);
            expect(isValidSearchInput('st6')).toBe(true);
        });
    });

    describe('getOrderTypeToggleDefaultValue Testing', () => {
        test('getOrderTypeToggleDefaultValue', () => {
            expect(getOrderTypeToggleDefaultValue(featureGateResponse.data)).toEqual(ORDER_TYPE.DELIVERY);
            expect(getOrderTypeToggleDefaultValue('')).toEqual(ORDER_TYPE.DELIVERY);
            expect(getOrderTypeToggleDefaultValue(undefined)).toEqual(ORDER_TYPE.DELIVERY);
        });
    });

    describe('skipForCA Testing', () => {
        //Todo need to check add app config
        test('skipForCA', () => {
            expect(skipForCA(null)).toEqual(true);
            expect(skipForCA('122333')).toEqual(false);
        });
    });
});
