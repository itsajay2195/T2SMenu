import { HOME_ADDRESS_TYPE } from './HomeAddressType';

const INITIAL_STATE = {
    showHideAddressSelection: false,
    selectedAddress: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HOME_ADDRESS_TYPE.SHOW_HIDE_SELECT_ADDRESS:
            return {
                ...state,
                showHideAddressSelection: action.payload
            };
        case HOME_ADDRESS_TYPE.SELECTED_ADDRESS:
            return {
                ...state,
                selectedAddress: action.payload
            };
        default:
            return state;
    }
};
