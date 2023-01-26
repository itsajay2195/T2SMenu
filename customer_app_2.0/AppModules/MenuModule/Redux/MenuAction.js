import { MENU_TYPE } from './MenuType';
export const resetMenuResponseAction = () => {
    return {
        type: MENU_TYPE.RESET_MENU_RESPONSE_ACTION
    };
};
export const resetMenuRelatedDataForNonCustomerApps = () => {
    return {
        type: MENU_TYPE.RESET_MENU_RELATED_DATA_NON_CUSTOMER_APPS
    };
};

export const menuItemId = (id) => {
    return {
        type: MENU_TYPE.MENU_ITEM_ID,
        id
    };
};

export const setCategoryItems = (payload) => {
    return {
        type: MENU_TYPE.SET_CATEGORY_ITEMS,
        payload: payload
    };
};

export const setSubCatItems = (payload) => {
    return {
        type: MENU_TYPE.SET_SUBCAT_ITEMS,
        payload: { items: payload }
    };
};
