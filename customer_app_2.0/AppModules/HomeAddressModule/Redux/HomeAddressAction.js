import { HOME_ADDRESS_TYPE } from './HomeAddressType';

export const showHideSelectAddressAction = (show) => {
    return {
        type: HOME_ADDRESS_TYPE.SHOW_HIDE_SELECT_ADDRESS,
        payload: show
    };
};

export const selectedAddressAction = (address) => {
    return {
        type: HOME_ADDRESS_TYPE.SELECTED_ADDRESS,
        payload: address
    };
};
