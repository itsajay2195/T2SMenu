import { MENU_TYPE } from './MenuType';

const INITIAL_STATE = {
    lastSyncMenuVersion: null,
    currentFilteredMenuDay: null,
    currentFilteredMenuOrderType: null,
    menuResponse: null,
    menuAddOnGroupResponse: null,
    filteredMenu: null,
    isMenuLoading: false,
    menuItems: null,
    itemId: null,
    uiFilteredMenu: null,
    isMenuAddonsLoading: false,
    categoryWiseMenu: 'null',
    subCatWiseMenu: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MENU_TYPE.GET_MENU_SUCCESS:
            return {
                ...state,
                menuResponse: action.payload.menuResponse,
                lastSyncMenuVersion: action.payload.syncMenu
            };
        case MENU_TYPE.GET_MENU_ADD_ON_GROUP_SUCCESS:
            return {
                ...state,
                menuAddOnGroupResponse: action.payload,
                isMenuAddonsLoading: false
            };
        case MENU_TYPE.GET_FILTERED_MENU_SUCCESS:
            return {
                ...state,
                uiFilteredMenu: action.payload.uiFilteredMenu,
                filteredMenu: action.payload.filterMenu,
                currentFilteredMenuDay: action.payload.currentBusinessDay,
                currentFilteredMenuOrderType: action.payload.currentOrderType,
                menuItems: action.payload.menuItems
            };
        case MENU_TYPE.RESET_MENU_RESPONSE_ACTION:
            return {
                ...state,
                lastSyncMenuVersion: null,
                currentFilteredMenuDay: null,
                currentFilteredMenuOrderType: null,
                menuResponse: null,
                menuAddOnGroupResponse: null,
                filteredMenu: null,
                menuItems: null,
                itemId: null,
                isMenuAddonsLoading: false
            };
        case MENU_TYPE.MENU_ITEM_ID:
            return {
                ...state,
                itemId: action.id
            };
        case MENU_TYPE.SET_ADDONS_LOADING:
            return {
                ...state,
                isMenuAddonsLoading: action.payload
            };
        case MENU_TYPE.SET_CATEGORY_ITEMS:
            return {
                ...state,
                categoryWiseMenu: action.payload
            };
        case MENU_TYPE.SET_SUBCAT_ITEMS:
            return {
                ...state,
                subCatWiseMenu: action.payload.items
            };
        default:
            return state;
    }
};
