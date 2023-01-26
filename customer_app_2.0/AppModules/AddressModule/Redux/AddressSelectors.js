import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { isPrimaryAddress } from '../Utils/AddressHelpers';

export const selectAddressState = (state) => state.addressState;

export const selectPostCodeDelivery = (state) => {
    const addressState = selectAddressState(state);
    if (isValidElement(addressState.selectedPostcode)) {
        return addressState.selectedPostcode;
    }
};

export const selectAddressForDelivery = (state) => {
    const addressState = selectAddressState(state);
    const deliveryAddress = isValidElement(addressState) && addressState.deliveryAddress;
    if (
        isValidElement(addressState.addressResponse) &&
        isValidElement(addressState.addressResponse.data) &&
        addressState.addressResponse.data.length > 0
    ) {
        //From this case default selectedAddressId address is null we will take from selected delivery address
        if (isValidElement(addressState.selectedAddressId) || isValidElement(deliveryAddress?.id)) {
            let selectAddressId = isValidElement(addressState.selectedAddressId) ? addressState.selectedAddressId : deliveryAddress?.id;
            return addressState.addressResponse.data.find((item) => item.id === selectAddressId);
        } else {
            let selectedAddress = addressState.addressResponse.data.find((item) => isPrimaryAddress(item));
            if (isValidElement(selectedAddress)) {
                return selectedAddress;
            } else {
                return addressState.addressResponse.data[0];
            }
        }
    } else if (isValidElement(deliveryAddress)) {
        return deliveryAddress;
    }
};

export const currentAddressLocation = (state) => state.addressState.currentLocation;
export const selectTAOrderType = (state) => state.addressState.selectedTAOrderType;
export const selectSavedAddress = (state) => state.addressState.addressResponse;
export const selectAppState = (state) => state.foodHubHomeState.isAppOpen;
