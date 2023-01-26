import { isNonCustomerApp } from 't2sbasemodule/Utils/helpers';

export const selectRecentOrders = (state) => state.foodHubHomeState.recentOrdersResponse;
export const selectPendingAndCompletedOrder = (state) => state.orderManagementState.pendingAndCompletedOrder;
export const menuResponseDataHashmap = (state) => state.menuState.menuMap;
export const selectRecentOrdersOfParticularTakeaway = (state) =>
    isNonCustomerApp() ? state.foodHubHomeState.recentOrdersOfTakeaway : state.homeState.previousOrdersResponse;
export const selectMenuResponse = (state) => state.menuState.menuResponse;
export const selectMenuItems = (state) => state.menuState.menuItems;
export const selectMenuAddOnGroupResponse = (state) => state.menuState.menuAddOnGroupResponse;
export const selectMenuAddonsLoadingResponse = (state) => state.menuState.isMenuAddonsLoading;
export const getMenuLastSyncTime = (state) => state.menuState.lastSyncMenuVersion;

export const getCurrentFilteredMenuDay = (state) => state.menuState.currentFilteredMenuDay;

export const getCurrentFilteredMenuOrderType = (state) => state.menuState.currentFilteredMenuOrderType;
export const getSubCatItemsSelector = (state) => {
    return state.menuState.categoryWiseMenu;
};
