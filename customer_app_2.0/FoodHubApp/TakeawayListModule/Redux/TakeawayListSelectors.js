import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { selectAddressState } from 'appmodules/AddressModule/Redux/AddressSelectors';
import { isPrimaryAddress } from 'appmodules/AddressModule/Utils/AddressHelpers';
import { isUKApp } from 'appmodules/BaseModule/GlobalAppHelper';
import { selectS3Response, selectStoreConfigResponse } from 't2sbasemodule/Utils/AppSelectors';
import { getPreorderStatus, getStoreStatusCollection, getStoreStatusDelivery } from '../Utils/Helper';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';

export const selectTakeawayListState = (state) => state.takeawayListReducer;

/**
 * TODO Implemented only for UK need to do the same for other countries as well
 */
export const selectSearchedAddress = (state) => {
    const isUK = isUKApp(selectS3Response(state)?.country?.id);
    const addressState = selectAddressState(state);
    const takeawayListState = selectTakeawayListState(state);
    const { selectedPostcode } = isValidElement(takeawayListState) && takeawayListState;
    const { addressResponse } = addressState;
    const { data } = isValidElement(addressResponse) && addressResponse;
    let address = null;
    let checkIsAddressSelected = isValidElement(addressState?.selectedAddressId);
    if (isUK && isArrayNonEmpty(data) && isValidElement(selectedPostcode) && !checkIsAddressSelected) {
        address = data.find((item) => (item.postcode === selectedPostcode) & isPrimaryAddress(item));
        if (isValidElement(address)) {
            return address;
        } else return data.find((item) => item.postcode === selectedPostcode);
    }
    return null;
};

export const selectPrimaryAddress = (state) => {
    const addressState = selectAddressState(state);
    const { addressResponse } = addressState;
    const { data } = isValidElement(addressResponse) && addressResponse;
    if (isValidElement(data) && data.length > 0) {
        let selectedAddress = data.find((item) => isPrimaryAddress(item));
        return isValidElement(selectedAddress) ? selectedAddress : data[0];
    }
    return null;
};

export const selectCuisineSelected = (state) => {
    const takeawayListState = selectTakeawayListState(state);
    const { homeScreenFilter, advancedCuisineSelected, cuisinesSelected } = takeawayListState;
    if (isValidElement(homeScreenFilter) && isValidElement(advancedCuisineSelected) && isValidElement(cuisinesSelected)) {
        return homeScreenFilter ? advancedCuisineSelected : cuisinesSelected;
    }
    return cuisinesSelected;
};

export const selectFilterType = (state) => {
    const takeawayListState = selectTakeawayListState(state);
    const { homeScreenFilter, advancedFilterType, filterType } = takeawayListState;
    if (isValidElement(homeScreenFilter) && isValidElement(advancedFilterType) && isValidElement(filterType)) {
        return homeScreenFilter ? advancedFilterType : filterType;
    }
    return null;
};

export const selectFilterList = (state) => {
    const takeawayListState = selectTakeawayListState(state);
    const { homeScreenFilter, advancedFilterList, filterList } = takeawayListState;
    if (isValidElement(homeScreenFilter)) {
        return homeScreenFilter ? advancedFilterList : filterList;
    }
    return null;
};

export const selectSelectedCuisinesList = (state) => {
    const takeawayListState = selectTakeawayListState(state);
    const { homeScreenFilter, selectedCuisines, advancedSelectedCuisines } = takeawayListState;
    if (isValidElement(homeScreenFilter)) {
        return homeScreenFilter ? advancedSelectedCuisines : selectedCuisines;
    }
    return null;
};

export const selectDeliveryStatus = (state) => {
    const storeConfig = selectStoreConfigResponse(state);
    return getStoreStatusDelivery(storeConfig);
};

export const selectCollectionStatus = (state) => {
    const storeConfig = selectStoreConfigResponse(state);
    return getStoreStatusCollection(storeConfig);
};

export const selectPreorderDeliveryStatus = (state) => {
    const deliveryStatus = selectDeliveryStatus(state);
    const storeConfig = selectStoreConfigResponse(state);
    return getPreorderStatus(storeConfig, ORDER_TYPE.DELIVERY, deliveryStatus);
};

export const selectPreorderCollectionStatus = (state) => {
    const collectionStatus = selectCollectionStatus(state);
    const storeConfig = selectStoreConfigResponse(state);
    return getPreorderStatus(storeConfig, ORDER_TYPE.COLLECTION, collectionStatus);
};
