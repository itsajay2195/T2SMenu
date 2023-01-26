import {
    firstCharacterUpperCased,
    isCustomerApp,
    isValidElement,
    isValidNumber,
    isValidString,
    safeFloatValueWithoutDecimal,
    validateRegex
} from 't2sbasemodule/Utils/helpers';
import { ADDRESS_FORM_TYPE, BOOL_CONSTANT, MAP_CONTAINER_CONSTANTS } from './AddressConstants';
import { DeliveryAddressConstants } from '../../ProfileModule/Utils/ProfileConstants';
import { addressVisible, isAutoCompletePickerArea, isValidField } from '../../BaseModule/GlobalAppHelper';
import { CONFIG_TYPE } from '../../BaseModule/GlobalAppConstants';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import {
    selectBasketStoreID,
    selectCountryBaseFeatureGateSelector,
    selectPrimaryAddressSelector,
    selectStoreConfigResponse
} from 't2sbasemodule/Utils/AppSelectors';
import { store } from '../../../CustomerApp/Redux/Store/ConfigureStore';
import { ORDER_TYPE, TOGGLE_STATUS } from '../../BaseModule/BaseConstants';
import { ENV_TYPE, getEnvType } from '../../../CustomerApp/Utils/AppConfig';
import { FOODHUB_FRANCHISE_ID, FOODHUB_HOST_NAME } from '../../../CustomerApp/Utils/AppContants';
import _ from 'lodash';
import moment from 'moment-timezone';
import { ValidatePostCodeUK } from '../../../FoodHubApp/HomeModule/Utils/Helper';
import { getAddressLine1, getHouseNO } from '../../OrderManagementModule/Utils/OrderManagementHelper';

export const getPostCode = (data) => {
    let postcode = '';
    if (isValidElement(data)) {
        data.address_components.forEach((items) => {
            if (isValidElement(items)) {
                items.types.forEach((obj) => {
                    if (obj === 'postal_code') {
                        postcode = items.short_name;
                        return postcode;
                    }
                });
            }
        });
    }
    return postcode;
};

export const extractPostcode = (data) => {
    let newObj = {};
    if (isValidElement(data) && isValidElement(data.address_components)) {
        data.address_components.forEach((items) => {
            if (isValidElement(items)) {
                items.types.forEach((obj) => {
                    if (obj === MAP_CONTAINER_CONSTANTS.POSTAL_CODE) {
                        newObj.postCode = items.long_name;
                    }
                });
            }
        });
        return newObj;
    }
};

export const extractAddress = (data, s3ConfigResponse, postcode, doorNo = '') => {
    let newObj = {};
    const isAutoCompletedPickerPostCode = isAutoCompletePickerArea(s3ConfigResponse);
    if (isValidElement(data) && isValidElement(data.address_components)) {
        data.address_components.forEach((items) => {
            if (isValidElement(items)) {
                items.types.forEach((obj) => {
                    if (obj === MAP_CONTAINER_CONSTANTS.POSTAL_CODE) {
                        if (isAutoCompletedPickerPostCode) {
                            newObj.showEmptyAreaError = false;
                            newObj.showInvalidAreaError = false;
                            newObj.showInvalidPostCodeError = false;
                            newObj.showEmptyAddressError = false;
                            newObj.showEmptyCityError = false;
                            newObj.showInvalidCityError = false;
                            newObj.showEmptyDoorNumberError = false;
                            newObj.showInvalidDoorNumberError = false;
                            if (items.long_name !== postcode) {
                                newObj.address_line1 = '';
                            }
                        } else {
                            newObj.postCode = items.long_name;
                            newObj.displayPostcode = items.long_name;
                            newObj.showEmptyCityError = false;
                            newObj.showInvalidCityError = false;
                        }
                    } else if (obj === MAP_CONTAINER_CONSTANTS.COUNTRY) {
                        newObj.country = items.long_name;
                    } else if (
                        obj === MAP_CONTAINER_CONSTANTS.SUB_LOCALITY_1 ||
                        obj === MAP_CONTAINER_CONSTANTS.POSTAL_TOWN ||
                        obj === MAP_CONTAINER_CONSTANTS.LOCALITY
                    ) {
                        if (obj !== MAP_CONTAINER_CONSTANTS.LOCALITY) {
                            if (isValidString(newObj.address_line2) && !newObj.address_line2.toLowerCase().includes(items.long_name)) {
                                newObj.address_line2 += ', ' + firstCharacterUpperCased(items.long_name);
                            } else if (!isValidString(newObj.address_line2)) {
                                newObj.address_line2 = firstCharacterUpperCased(items.long_name);
                            }
                        } else if (obj === MAP_CONTAINER_CONSTANTS.LOCALITY && !isValidString(newObj.address_line2)) {
                            newObj.address_line2 = firstCharacterUpperCased(items.long_name);
                        } else if (obj === MAP_CONTAINER_CONSTANTS.LOCALITY && isValidString(newObj.address_line2)) {
                            newObj.addtionalLocality = firstCharacterUpperCased(items.long_name);
                        }
                        newObj.showEmptyCityError = false;
                        newObj.showInvalidCityError = false;
                    } else if (obj === MAP_CONTAINER_CONSTANTS.SUB_PREMISE) {
                        newObj.unitNo = firstCharacterUpperCased(items.long_name);
                        newObj.showEmptyDoorNumberError = false;
                        newObj.showInvalidDoorNumberError = false;
                    } else if (obj === MAP_CONTAINER_CONSTANTS.STREET_NUMBER) {
                        let house_no = isValidString(doorNo) ? doorNo : items.long_name;
                        newObj.doorNo = firstCharacterUpperCased(house_no);
                        newObj.showEmptyDoorNumberError = false;
                        newObj.showInvalidDoorNumberError = false;
                    } else if (obj === MAP_CONTAINER_CONSTANTS.ROUTE || obj === MAP_CONTAINER_CONSTANTS.STREET_NUMBER) {
                        newObj.address_line1 = firstCharacterUpperCased(items.long_name);
                        newObj.showEmptyAddressError = false;
                        newObj.showInvalidAddressError = false;
                    } else if (obj === MAP_CONTAINER_CONSTANTS.ADMIN_AREA_1 || obj === MAP_CONTAINER_CONSTANTS.ADMIN_AREA_2) {
                        if (isValidString(newObj.area) && !newObj.area.toLowerCase().includes(items.long_name)) {
                            newObj.area += ', ' + items.long_name;
                        } else if (!isValidString(newObj.area)) {
                            newObj.area = firstCharacterUpperCased(items.long_name);
                        }
                        newObj.showEmptyAreaError = false;
                        newObj.showInvalidAreaError = false;
                    }
                });
            }
        });

        if (!isValidString(newObj.doorNo) && isValidString(doorNo)) {
            newObj.doorNo = firstCharacterUpperCased(doorNo);
            newObj.showEmptyDoorNumberError = false;
        }
        if (!isValidElement(newObj.city)) {
            newObj.city = '';
        }
        if (!isValidElement(newObj.address)) {
            newObj.address = '';
        }
        if (isValidString(newObj.unitNo)) {
            if (!isValidString(newObj.doorNo)) {
                newObj.doorNo = newObj.unitNo;
            } else if (isValidString(data.formatted_address)) {
                //sometimes address maybe 2/111 format with subpremise as 2 & street_no as 111.Checking if it matches door no.in address value
                let splitDoorNo = data.formatted_address.split(' ');
                let resultantDoorNo = splitDoorNo?.[0];
                if (
                    isValidString(resultantDoorNo) &&
                    (newObj.unitNo + '/' + newObj.doorNo === resultantDoorNo || newObj.unitNo + '-' + newObj.doorNo === resultantDoorNo)
                ) {
                    newObj.doorNo = resultantDoorNo;
                }
            }
        }
        if (
            isValidString(newObj.area) &&
            isValidString(newObj.addtionalLocality) &&
            !newObj.area.toLowerCase().includes(newObj.addtionalLocality.toLowerCase())
        ) {
            newObj.address_line2 += ', ' + firstCharacterUpperCased(newObj.addtionalLocality);
        } else if (isValidString(newObj.addtionalLocality) && !isValidString(newObj.area)) {
            newObj.area = firstCharacterUpperCased(newObj.addtionalLocality);
        }
        if (!isValidElement(newObj.address_line1)) {
            newObj.address_line1 = '';
        }
        if (!isValidElement(newObj.address_line2)) {
            newObj.address_line2 = '';
        }
        if (!isValidElement(newObj.postCode)) {
            newObj.postCode = '';
        }
        if (!isValidElement(newObj.country)) {
            newObj.country = '';
        }
        if (isValidElement(data?.geometry?.location)) {
            let { lat, lng } = data.geometry.location;
            if (isValidElement(lat)) {
                newObj.latitude = lat;
            }
            if (isValidElement(lng)) {
                newObj.longitude = lng;
            }
        }
        return newObj;
    }
};

export const extractLocation = (data) => {
    let newObj = {};
    if (isValidElement(data) && isValidElement(data.geometry) && isValidElement(data.geometry.location)) {
        newObj.latitude = data.geometry.location.lat;
        newObj.longitude = data.geometry.location.lng;
        return newObj;
    }
};

export const getPostcodeFromAddressResponse = (addressResponse) => {
    if (isValidElement(addressResponse)) {
        for (let i = 0; i < addressResponse.length; i++) {
            if (
                isValidElement(addressResponse[i].types) &&
                addressResponse[i].types.length > 0 &&
                addressResponse[i].types[0] === MAP_CONTAINER_CONSTANTS.POSTAL_CODE
            ) {
                return addressResponse[i].long_name;
            }
        }
    }
};
export const extractStateInfoFromRouteParam = (data, doorNo = '', flatNo = '') => {
    if (isValidElement(data)) {
        return {
            doorNo: isValidString(doorNo) ? doorNo : isValidElement(data.house_number) ? data.house_number : '',
            flat: isValidString(flatNo) ? flatNo : isValidElement(data.flat) ? data.flat : '',
            address_line1: isValidElement(data.address_line1) ? data.address_line1 : '',
            address_line2: isValidElement(data.address_line2) ? data.address_line2 : '',
            postCode: isValidElement(data.postcode) ? data.postcode : '',
            displayPostcode: isValidElement(data.postcode) ? data.postcode : '',
            latitude: isValidString(data.latitude) && isValidNumber(data.latitude) ? data.latitude : '',
            longitude: isValidString(data.longitude) && isValidNumber(data.longitude) ? data.longitude : '',
            latDelta: isValidElement(data.latitude) ? 0.001 : 10,
            longDelta: isValidElement(data.longitude) ? 0.001 : 10,
            togglePrimaryAddressButton: isValidElement(data.is_primary) ? data.is_primary === BOOL_CONSTANT.YES : false,
            area: isValidElement(data.area) ? data.area : ''
        };
    }
};

export const hasChanges = (data, state, viewType, s3ConfigResponse) => {
    if (viewType === ADDRESS_FORM_TYPE.EDIT && isValidElement(data)) {
        return (
            state.doorNo !== data.house_number ||
            state.flat !== data.flat ||
            state.address_line1 !== data.address_line1 ||
            state.address_line2 !== data.address_line2 ||
            state.postCode !== data.postcode ||
            (addressVisible(s3ConfigResponse, CONFIG_TYPE.AREA) && state.area !== data.area)
        );
    } else {
        return (
            isValidString(state.doorNo) ||
            isValidString(state.flat) ||
            isValidString(state.address_line1) ||
            isValidString(state.address_line2) ||
            isValidString(state.postCode) ||
            (addressVisible(s3ConfigResponse, CONFIG_TYPE.AREA) && isValidString(state.area))
        );
    }
};

export const getOrderTypeForBasket = (selectedOrderType, defaultOrderType) => {
    if (isValidElement(selectedOrderType)) {
        return selectedOrderType;
    } else {
        return isValidString(defaultOrderType) ? defaultOrderType : ORDER_TYPE.DELIVERY;
    }
};

export const getDefaultOrderType = (defaultOrderType) => {
    return isValidString(defaultOrderType) ? defaultOrderType : ORDER_TYPE.DELIVERY;
};

export const isBasketOrderTypeChanged = () => {
    if (isValidElement(store) && isValidElement(store.getState())) {
        const state = store.getState();
        const basketStoreID = selectBasketStoreID(state);
        const storeConfigResponse = selectStoreConfigResponse(state);
        return isBasketOrder(basketStoreID, storeConfigResponse?.id);
    }
    return false;
};

export const getOrderTypeToggleDefaultValue = (configResponse) => {
    if (isValidString(configResponse?.order_type_toggle?.status) && configResponse?.order_type_toggle?.status === TOGGLE_STATUS.ENABLED) {
        return configResponse.order_type_toggle?.options?.default;
    }
    return ORDER_TYPE.DELIVERY;
};

export const isBasketOrder = (basketStoreID, storeConfigId) => {
    return isValidElement(basketStoreID) && isValidElement(storeConfigId) && basketStoreID === storeConfigId;
};

export const extractDeliveryAddressFromAddressList = (state, selectedAddressId, addressResponse) => {
    if (isValidElement(addressResponse) && isValidElement(addressResponse.data) && addressResponse.data.length > 0) {
        let filteredResult = addressResponse.data.find((item) => Number(item.id) === Number(selectedAddressId));
        if (isValidElement(filteredResult)) {
            return filteredResult;
        } else {
            const primaryAddress = addressResponse.data.find((item) => item.is_primary === DeliveryAddressConstants.YES);
            if (isValidElement(primaryAddress)) {
                return primaryAddress;
            }
            return state.deliveryAddress;
        }
    } else return state.primaryAddress;
};
export const getPrimaryPostCode = (postcodeState, response) => {
    if (!isValidElement(postcodeState) || !isValidElement(response) || !response?.data) return '';
    const primaryAddress = response.data.find((item) => item.is_primary === DeliveryAddressConstants.YES);
    if (isValidElement(primaryAddress)) {
        return primaryAddress.postcode;
    }
    return postcodeState;
};

export const isPrimaryAddress = (item) => {
    return item?.is_primary === DeliveryAddressConstants.YES;
};
export const isValidAreaFromFuzzyResults = (props, areaText) => {
    if (isValidElement(props) && isValidString(areaText)) {
        if (isValidElement(props.fussySearchSuggestions) && props.fussySearchSuggestions.length > 0) {
            return isValidElement(props.fussySearchSuggestions.find((areaStr) => areaStr === areaText));
        }
    }
    return false;
};

export const validateStates = (state, props) => {
    const { doorNo, address_line1, address_line2, postCode, area } = state;
    const isAreaAutoCompleteEnabled = isAutoCompletePickerArea(props.s3ConfigResponse);
    return {
        showEmptyDoorNumberError: !isValidString(doorNo),
        showInvalidDoorNumberError: isValidString(doorNo) && !isValidField(props.s3ConfigResponse, CONFIG_TYPE.HOUSE_NUMBER, doorNo),
        showEmptyPostcodeError: !isValidString(postCode),
        showInvalidPostCodeError: isAreaAutoCompleteEnabled
            ? !isValidAreaFromFuzzyResults(props, state.postCode)
            : isValidString(postCode) && !isValidField(props.s3ConfigResponse, CONFIG_TYPE.POSTCODE, postCode),
        showEmptyAddressError: !isValidString(address_line1),
        showInvalidAddressError:
            isValidString(address_line1) && !isValidField(props.s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1, address_line1),
        showEmptyCityError: !isValidString(address_line2),
        showInvalidCityError:
            isValidString(address_line2) && !isValidField(props.s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2, address_line2),
        showEmptyAreaError: addressVisible(props.s3ConfigResponse, CONFIG_TYPE.AREA) && !isValidString(area),
        showInvalidAreaError:
            isValidString(area) &&
            addressVisible(props.s3ConfigResponse, CONFIG_TYPE.AREA) &&
            !isValidField(props.s3ConfigResponse, CONFIG_TYPE.AREA, area)
    };
};

export const validateFields = (state) => {
    return !(
        state.showEmptyDoorNumberError ||
        state.showInvalidDoorNumberError ||
        state.showEmptyPostcodeError ||
        state.showInvalidPostCodeError ||
        state.showEmptyAddressError ||
        state.showInvalidAddressError ||
        state.showEmptyCityError ||
        state.showInvalidCityError ||
        state.showEmptyAreaError ||
        state.showInvalidAreaError
    );
};

export const addressParamsObj = (state, config) => {
    const { doorNo, flat, address_line1, address_line2, postCode, area, latitude, longitude } = state;
    let is_primary = state.togglePrimaryAddressButton ? BOOL_CONSTANT.YES : BOOL_CONSTANT.NO;
    let obj = {
        house_number: isValidString(doorNo) ? doorNo.trim() : '',
        flat: isValidElement(flat) ? flat.trim() : undefined,
        postcode: isValidString(postCode) ? postCode.trim() : '',
        address_line1: firstCharacterUpperCased(address_line1).trim(),
        address_line2: firstCharacterUpperCased(address_line2).trim(),
        is_primary,
        latitude,
        longitude
    };
    // Dynamic address fields based upon location config
    if (addressVisible(config, CONFIG_TYPE.AREA)) obj.area = firstCharacterUpperCased(area);
    return obj;
};

export const isValidCoordinates = (latitude, longitude) => {
    return safeFloatValueWithoutDecimal(latitude) !== 0 && safeFloatValueWithoutDecimal(longitude) !== 0;
};

export const getDefaultLatitude = (latitude) => {
    return isValidElement(latitude) ? latitude : 0;
};

export const getDefaultLongitude = (longitude) => {
    return isValidElement(longitude) ? longitude : 0;
};

export const getDefaultDelta = (s3ConfigResponse) => {
    return isValidElement(s3ConfigResponse) &&
        isValidElement(s3ConfigResponse.country) &&
        isValidElement(s3ConfigResponse.country.id) &&
        s3ConfigResponse.country.id === T2SConfig.country.UK
        ? 20
        : isValidElement(s3ConfigResponse) &&
          isValidElement(s3ConfigResponse.country) &&
          isValidElement(s3ConfigResponse.country.id) &&
          s3ConfigResponse.country.id === T2SConfig.country.US
        ? 60
        : 20;
};

export const deletePrimaryAddressHelper = (data, filterResult, deleteAddressId) => {
    if (isValidElement(data)) {
        if (
            (data.length > 0 && filterResult.length > 0 && filterResult[0].id === deleteAddressId) ||
            (data.length > 0 && filterResult.length === 0)
        ) {
            let item = data[data.length - 1];
            if (item.id !== deleteAddressId) {
                logSegment(item);
                return item.id;
            } else if (data.length > 1) {
                let primaryItem = data[data.length - 2];
                logSegment(primaryItem);
                return primaryItem.id;
            }
        }
    }
};

export const logSegment = (currentAddress) => {
    if (isValidElement(store) && isValidElement(store.getState())) {
        const state = store.getState();
        let previousAddress = selectPrimaryAddressSelector(state);
        let featureGate = selectCountryBaseFeatureGateSelector(state);

        if (isValidElement(previousAddress) && isValidElement(currentAddress)) {
            Segment.trackEvent(featureGate, SEGMENT_EVENTS.HOME_ADDRESS_CHANGE, {
                previous_city: `${previousAddress.address_line1}, ${previousAddress.address_line2}, ${previousAddress.postcode}`,
                current_city: `${currentAddress.address_line1}, ${currentAddress.address_line2}, ${currentAddress.postcode}`
            });
        }
    }
};

export const addAddressLocally = (addressResponse, newAddress) => {
    if (isValidElement(addressResponse) && isValidElement(addressResponse.data)) {
        let id = addressResponse.data.find((d) => d.id === newAddress.id);
        if (!id) {
            if (isValidElement(newAddress.is_primary) && newAddress.is_primary === BOOL_CONSTANT.YES) {
                addressResponse.data.forEach((currentAddress, index) => {
                    if (addressResponse.data[index].is_primary === BOOL_CONSTANT.YES) {
                        addressResponse.data[index].is_primary = BOOL_CONSTANT.NO;
                    }
                });
            }
            addressResponse.data.unshift(newAddress);
        }
    }
    return addressResponse;
};

export const validAddress = (address, props, doCheckLatLng = true) => {
    const { house_number, postcode, address_line1, address_line2, area, latitude, longitude } = address;
    const { s3ConfigResponse } = props;
    const isAreaAutoCompleteEnabled = isAutoCompletePickerArea(s3ConfigResponse);

    const isValidDoorNo = isValidString(house_number) && isValidField(s3ConfigResponse, CONFIG_TYPE.HOUSE_NUMBER, house_number);
    const isValidPostCode = isAreaAutoCompleteEnabled
        ? isValidAreaFromFuzzyResults(props, postcode)
        : isValidString(postcode) && isValidField(s3ConfigResponse, CONFIG_TYPE.POSTCODE, postcode);
    const isValidAddress = isValidString(address_line1) && isValidField(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1, address_line1);
    const isValidCity = isValidString(address_line2) && isValidField(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2, address_line2);
    const isValidArea = !addressVisible(s3ConfigResponse, CONFIG_TYPE.AREA) || isValidString(area);
    const isValidLatitude = !doCheckLatLng || isValidElement(latitude);
    const isValidLongitude = !doCheckLatLng || isValidElement(longitude);
    return isValidDoorNo && isValidPostCode && isValidAddress && isValidCity && isValidArea && isValidLatitude && isValidLongitude;
};

export const addressMissingFieldsPayload = (address, state) => {
    const {
        missingHouseNo,
        missingPostCode,
        missingAddressLine1,
        missingAddressLine2,
        missingArea,
        house_number,
        postcode,
        address_line1,
        address_line2,
        area
    } = state;
    if (missingHouseNo) address.house_number = house_number;
    if (missingPostCode) address.postcode = postcode;
    if (missingAddressLine1) address.address_line1 = address_line1;
    if (missingAddressLine2) address.address_line2 = address_line2;
    if (missingArea) address.area = area;
    return address;
};

export const getDeliveryAddressSortByLatestUpdate = (addressData) => {
    let sortData = _.orderBy(
        addressData,
        [
            (item) => {
                return isValidElement(item?.updated_at) && moment(item?.updated_at);
            }
        ],
        ['desc']
    );
    if (isValidElement(sortData) && sortData.length > 0) {
        return sortData[0];
    } else {
        return null;
    }
};

export const getAddressWithSeparator = (address) => {
    return isValidString(address) ? address + ', ' : address;
};

export const formattedAddressObj = (addressData, isCountryUK, postCodeRegex) => {
    let address = '';
    if (isValidElement(addressData)) {
        const { doorNo, flat, address_line1, address_line2, postCode } = addressData;
        if (isValidString(doorNo)) {
            address = doorNo;
        }
        if (isValidString(flat)) {
            address = getAddressWithSeparator(address) + flat;
        }
        if (isValidString(address_line1)) {
            address = getAddressWithSeparator(address) + address_line1;
        }
        if (isValidString(address_line2)) {
            address = getAddressWithSeparator(address) + address_line2;
        }
        if ((isCountryUK && ValidatePostCodeUK(postCode)) || (!isCountryUK && validateRegex(postCodeRegex, postCode))) {
            address = getAddressWithSeparator(address) + postCode;
        }
    }
    return address;
};

export const isAlreadySavedAddress = (savedAddress, selectedAddress) => {
    if (isValidElement(savedAddress) && isValidElement(selectedAddress)) {
        const { house_number, address_line1, address_line2, postcode } = savedAddress;
        if (
            isValidElement(selectedAddress.address_line1) &&
            isValidElement(selectedAddress.address_line2) &&
            (isValidString(selectedAddress.doorNo) || isValidElement(selectedAddress.houseno)) &&
            (isValidString(selectedAddress.postCode) || isValidElement(selectedAddress.postcode))
        ) {
            return (
                address_line1 === selectedAddress.address_line1 &&
                address_line2 === selectedAddress.address_line2 &&
                (house_number === selectedAddress.doorNo || house_number === selectedAddress.houseno) &&
                (postcode === selectedAddress.postCode || postcode === selectedAddress.postcode)
            );
        }
    }
    return false;
};

export const searchTakeawayAddressFormat = (addressData, forTAList = true) => {
    const { house_number, doorNo, houseno, flat, postcode, postCode, address_line1, address1 } = isValidElement(addressData) && addressData;
    let resultant_postcode = isValidString(postcode) ? postcode : isValidString(postCode) ? postCode : '';
    return `${getHouseNO(house_number, doorNo, houseno, forTAList)}${
        isValidString(flat) ? (forTAList && flat.length > 10 ? flat.slice(0, 10).concat('... ') : flat + ', ') : ''
    }${getAddressLine1(address_line1, address1)}${isValidString(resultant_postcode) ? ', ' + resultant_postcode : ''}`;
};
export const getHostAndFranchise = (config) => {
    let envType = getEnvType(config);
    //TODO this needs to be configurable
    if (envType === ENV_TYPE.QA) {
        return {
            host: FOODHUB_HOST_NAME.QA,
            franchise: FOODHUB_FRANCHISE_ID.QA
        };
    } else {
        return {
            host: FOODHUB_HOST_NAME.LIVE,
            franchise: FOODHUB_FRANCHISE_ID.LIVE
        };
    }
};

export const skipForCA = (storeID) => {
    return isCustomerApp() && !isValidElement(storeID);
};

export const isValidSearchInput = (text) => {
    return isValidString(text) && (typeof text === 'string' || text instanceof String) && text.trim().length >= 3;
};
