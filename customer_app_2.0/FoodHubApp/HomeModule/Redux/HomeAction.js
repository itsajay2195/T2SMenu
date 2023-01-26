import { HOME_TYPE } from './HomeType';

export const getRecentTakeawayAction = () => {
    return {
        type: HOME_TYPE.GET_RECENT_TAKEAWAYS
    };
};

export const getRecentOrders = () => {
    return {
        type: HOME_TYPE.GET_RECENT_ORDERS
    };
};

export const getFoodHubTotalSavingsAction = () => {
    return {
        type: HOME_TYPE.GET_FOODHUB_TOTALSAVINGS
    };
};

export const getAutoCompletePlacesAction = (text, sessiontoken) => {
    return {
        type: HOME_TYPE.GET_AUTOCOMPLETE_PLACES,
        text,
        sessiontoken
    };
};

export const resetAutoCompletePlacesAction = () => {
    return {
        type: HOME_TYPE.RESET_AUTOCOMPLETE_PLACES
    };
};

export const resetTakeawayRelatedOrderResponse = () => {
    return {
        type: HOME_TYPE.RESET_RECENT_TAKEAWAY_RESPONSE
    };
};

export const postcodeInput = (postcode) => {
    return {
        type: HOME_TYPE.POSTCODE_INPUT,
        payload: postcode
    };
};
export const resetTextInputState = () => {
    return {
        type: HOME_TYPE.RESET_POSTCODE_TEXT_INPUT
    };
};

export const getUserAddressFormBackground = (latitude, longitude, redirectTAList) => {
    return {
        type: HOME_TYPE.GET_USER_ADDRESS_LOCATION_FROM_BACKGROUND,
        latitude,
        longitude,
        redirectTAList
    };
};

export const setAppCurrentStateAction = (payload) => {
    return {
        type: HOME_TYPE.SET_APP_CURRENT_STATE,
        payload
    };
};
