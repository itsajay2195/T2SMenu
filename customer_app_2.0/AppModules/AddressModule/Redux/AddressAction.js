import { ADDRESS_TYPE } from './AddressType';
import { isBasketOrderTypeChanged } from '../Utils/AddressHelpers';

export const getAddressAction = (viewType) => {
    return {
        type: ADDRESS_TYPE.GET_ADDRESS,
        viewType
    };
};

export const addAddressAction = (
    navigation,
    addressObj,
    addressForLookup,
    popBackCount = 1,
    isFromOrderType = false,
    isFromOrderTypeModal = false,
    isFromQC = false,
    viewType
) => {
    return {
        type: ADDRESS_TYPE.POST_ADD_ADDRESS,
        navigation,
        addressObj,
        isFromOrderType,
        isFromOrderTypeModal,
        isFromQC,
        addressForLookup,
        popBackCount,
        viewType
    };
};

export const updatePrimaryAddressAction = (id) => {
    return {
        type: ADDRESS_TYPE.UPDATE_PRIMARY_ADDRESS,
        id: id
    };
};

export const updateAddressAction = (navigation, id, addressObj, addressForLookup, popBackCount = 1, viewType) => {
    return {
        type: ADDRESS_TYPE.UPDATE_ADDRESS,
        navigation,
        id,
        addressObj,
        addressForLookup,
        popBackCount,
        viewType
    };
};

export const deleteAddressAction = (id, navigation) => {
    return {
        type: ADDRESS_TYPE.DELETE_ADDRESS,
        id: id,
        navigation
    };
};

export const updateSelectedOrderType = (selectedOrderType = null, selectedPostcode = null, selectedAddressId = null) => {
    return {
        type: ADDRESS_TYPE.UPDATE_SELECTED_ORDER_TYPE,
        payload: { selectedOrderType, selectedPostcode, selectedAddressId, isBasketChanged: isBasketOrderTypeChanged() }
    };
};

export const updateNonBasketOrderType = (
    selectedOrderType = null,
    selectedPostcode = null,
    selectedAddressId = null,
    isFromMenuScreen = false
) => {
    return {
        type: ADDRESS_TYPE.UPDATE_NON_BASKET_ORDER_TYPE,
        payload: { selectedOrderType, selectedPostcode, selectedAddressId, isFromMenuScreen }
    };
};

export const selectedTAOrderTypeAction = (selectedTAOrderType = null) => {
    return {
        type: ADDRESS_TYPE.SELECTED_TA_ORDER_TYPE,
        payload: selectedTAOrderType
    };
};

export const selectDeliveryAddressAction = (deliveryAddress) => {
    return {
        type: ADDRESS_TYPE.DELIVERY_ADDRESS_SELECT,
        deliveryAddress
    };
};

export const deliveryLookupAction = (
    addressObj,
    deliveryFor = '',
    addressId = null,
    selectedAddress = null,
    callOrderChangeApi = false,
    isFromQCscreen = false,
    updateOrderType = true
) => {
    return {
        type: ADDRESS_TYPE.DELIVERY_LOOKUP,
        addressObj,
        deliveryFor,
        addressId,
        selectedAddress,
        callOrderChangeApi,
        isFromQCscreen,
        updateOrderType
    };
};

export const resetDeliveryLookupAction = () => {
    return {
        type: ADDRESS_TYPE.RESET_DELIVERY_LOOKUP_SUCCESS
    };
};

export const getAddressFromLatLong = (
    latitude,
    longitude,
    screenName = undefined,
    isCallDeliveryLookup = false,
    updateCurrentLocation = false,
    forSearchTA = false
) => {
    return {
        type: ADDRESS_TYPE.GET_ADDRESS_FROM_LOCATION,
        latitude,
        longitude,
        screenName,
        isCallDeliveryLookup,
        updateCurrentLocation,
        forSearchTA
    };
};

export const getAddressFromUserInput = (address, screenName = undefined, isCallDeliveryLookup = false) => {
    return {
        type: ADDRESS_TYPE.GET_ADDRESS_FROM_LOCATION,
        address,
        screenName,
        isCallDeliveryLookup
    };
};

export const checkDeliveryAddressAvailability = (deliveryAddress) => {
    return {
        type: ADDRESS_TYPE.CHECK_DELIVERY_ADDRESS_AVAILABILITY,
        deliveryAddress: deliveryAddress
    };
};

export const resetAddressFromLocationAction = () => {
    return {
        type: ADDRESS_TYPE.RESET_ADDRESS_FROM_LOCATION
    };
};

export const resetCurrentLocationAction = () => {
    return {
        type: ADDRESS_TYPE.RESET_CURRENT_LOCATION
    };
};

export const getAutocompleteFuzzySearchAreaAction = (fussySearchInput) => {
    return {
        type: ADDRESS_TYPE.FUSSY_SEARCH_AUTOCOMPLETE,
        fussySearchInput: fussySearchInput
    };
};

export const getAddressFromPlacesId = (addressObj, forSearchTA, sessiontoken) => {
    return {
        type: ADDRESS_TYPE.MANAGE_GET_ADDRESS_FROM_PLACE_ID,
        addressObj: addressObj,
        forSearchTA,
        sessiontoken
    };
};

export const getAutoCompletePlaces = (text, sessiontoken) => {
    return {
        type: ADDRESS_TYPE.MANAGE_ADDRESS_GET_AUTO_COMPLETE_PLACE,
        text,
        sessiontoken
    };
};

export const resetAutoCompletePlaces = () => {
    return {
        type: ADDRESS_TYPE.RESET_MANAGE_ADDRESS_GET_AUTO_COMPLETE
    };
};

export const setAddressFromLocationAction = (payload) => {
    return {
        type: ADDRESS_TYPE.SET_ADDRESS_FROM_LOCATION,
        payload
    };
};
export const setDoorNoByManual = (payload) => {
    return {
        type: ADDRESS_TYPE.SET_MANUAL_DOORNO,
        payload
    };
};
export const setFlatNoByManual = (payload) => {
    return {
        type: ADDRESS_TYPE.SET_MANUAL_FLATNO,
        payload
    };
};
export const resetManualAddress = (payload) => {
    return {
        type: ADDRESS_TYPE.RESET_MANUAL_ADDRESS
    };
};
