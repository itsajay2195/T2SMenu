import { TAKEAWAY_SEARCH_LIST_TYPE } from './TakeawayListType';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { SEARCH_TYPE } from '../../../AppModules/BaseModule/GlobalAppConstants';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { filterRecommendedTakeawayList, filterTakeawayList } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';

export const getTakeawayListAction = (
    postCode,
    searchByAddress = false,
    orderType = ORDER_TYPE.DELIVERY,
    selectedAddress,
    town = undefined
) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST,
        postCode,
        searchByAddress,
        orderType,
        town,
        selectedAddress
    };
};
export const getTakeawayListByAddressAction = (addressObj, searchType, orderType = ORDER_TYPE.DELIVERY, sessiontoken) => {
    searchType = isValidString(addressObj?.type) && addressObj.type === 'name' ? SEARCH_TYPE.NAME : searchType;
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_ADDRESS,
        addressObj,
        searchType,
        orderType,
        sessiontoken
    };
};

export const getTakeawayListByLocation = (addressObj, latitude, longitude, orderType = ORDER_TYPE.DELIVERY, sessiontoken) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_ADDRESS,
        addressObj,
        lat: latitude,
        lng: longitude,
        searchType: addressObj?.type,
        orderType,
        sessiontoken
    };
};

export const getTakeawayListFromUserAddress = (address) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_USER_ADDRESS,
        address
    };
};

export const takeawayListAction = (filterType, takeawayList, postCode) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TAKEAWAY,
        filterType,
        takeawayList,
        postCode
    };
};

export const searchElementMethodAction = (arrayList, searchString, searchType, orderType = ORDER_TYPE.DELIVERY, filterType = null) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.SEARCH_ELEMENT,
        arrayList,
        searchString,
        searchType,
        orderType,
        filterType
    };
};

export const setFilterType = (filter) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.SET_FILTER_TYPE,
        filter
    };
};

export const updateCheckedCuisines = (cuisinesArray, filterList) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_CHECKED_CUISINES,
        cuisinesArray,
        filterList
    };
};

export const updateAdvancedCheckedCuisines = (cuisinesArray, filterList) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_CHECKED_ADVANCE_CUISINES,
        cuisinesArray,
        filterList
    };
};

export const sortBasedOnCuisines = (
    cuisines,
    takeawayList,
    filterType,
    postCode,
    filterList,
    homeScreenFilter,
    selectedCuisineFilterName,
    orderType = ORDER_TYPE.DELIVERY,
    manualChange = true
) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.FILTER_CUISINES,
        cuisines,
        takeawayList,
        filterType,
        postCode,
        filterList,
        homeScreenFilter,
        selectedCuisineFilterName,
        orderType,
        manualChange
    };
};

export const updateSelectedCuisines = (cuisines, homeScreenFilter) => {
    return {
        type: homeScreenFilter
            ? TAKEAWAY_SEARCH_LIST_TYPE.ADVANCE_SELECTED_CUISINES_LIST
            : TAKEAWAY_SEARCH_LIST_TYPE.SELECTED_CUISINES_LIST,
        cuisines
    };
};

export const resetAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_ACTION
    };
};

export const resetCuisines = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_CUISINES_ACTION
    };
};

export const resetAdvanceCuisines = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_ADVANCE_CUISINES_ACTION
    };
};

export const resetAdvanceFilterAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.ADVANCED_RESET_ACTION
    };
};

export const postFavouriteTakeawayAction = (storeId, favourite) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.POST_FAVOURITE_TAKEAWAY,
        storeId,
        favourite
    };
};

export const getFavouriteTakeawayAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY
    };
};

export const getFavouriteTakeawayListAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY_LIST
    };
};

export const takeawayListClickAction = (storeInfo, isFromRecentTakeaway = false) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.TAKEAWAY_LIST_CLICK_ACTION,
        storeID: storeInfo?.id,
        storeInfo,
        isFromRecentTakeaway
    };
};
export const resetStoreAndConfigResponseAction = () => {
    return {
        type: TYPES_CONFIG.RESET_STORE_AND_BASKET_CONFIG
    };
};

export const resetStoreIDAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_STORE_ID_CONFIG
    };
};

export const resetTakeawayAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_TAKEAWAY_LIST
    };
};
export const stopMenuLoaderAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER
    };
};

export const startMenuLoaderAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.START_MENU_LOADER
    };
};

export const setTakeawayScrollTop = (payload) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.SET_TAKEAWAY_SCROLL_TOP,
        payload
    };
};

export const getAssociateTakeawayAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.GET_ASSOCIATE_TAKEAWAY
    };
};

export const updateStoreConfigResponseAction = (storeInfo) => {
    return {
        type: TYPES_CONFIG.STORE_CONFIG_SUCCESS,
        payload: storeInfo
    };
};
export const updateStoreConfigResponseForViewAction = (storeInfo, isFromReOrder = false, isFromRecentTakeAway = false) => {
    return {
        type: TYPES_CONFIG.UPDATE_STORE_CONFIG_RESPONSE_FOR_VIEW,
        payload: storeInfo,
        isFromReOrder,
        isFromRecentTakeAway
    };
};

export const resetTakeawaysOnCountrySwitchAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_TAKEAWAYS_ON_COUNTRY_SWITCH
    };
};

export const resetFavouriteSearchListAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_FAVOURITE_SEARCH_LIST
    };
};
export const redirectRoutesAction = (routes, redirectNavigation, fromTakeawayList) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.REDIRECT_ROUTE_BASKET_ACTION,
        routes,
        redirectNavigation,
        fromTakeawayList
    };
};
export const resetRedirectRoutesAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_ROUTE_BASKET_ACTION
    };
};
export const stopTakeawayButtonLoadingAction = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_TAKEAWAY_FIND_LOADING
    };
};

export const filterTakeawayByOrderTypeAction = (takeawayList, orderType) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.SAVE_FILTERED_TAKEAWAYS,
        payload: filterTakeawayList(takeawayList, true, orderType)
    };
};

export const updateHomeScreenStatusAction = (homeScreenStatus, selectedAdvancedFilterName) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_HOME_SCREEN_FILTER_STATUS,
        homeScreenStatus,
        selectedAdvancedFilterName
    };
};

export const resetAdvanceFilter = () => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.FITLER_RESET
    };
};

export const getOfferBasedTakeawayListAction = (offer, offerMax, orderType = ORDER_TYPE.DELIVERY) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TAKEAWAY_BASED_ON_OFFER,
        offer,
        offerMax,
        orderType
    };
};

export const updateTALiveTrackingAction = (event, body) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_LIVE_TRACKING,
        event,
        body
    };
};

export const filterTARecomendation = (taRecommendation, filterType) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TA_RECOMENDATION,
        taRecommendation,
        filterType
    };
};

export const filterTARecByOrderTypeAction = (takeawayList, orderType, filterType) => {
    return {
        type: TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_FILTERBY_RECOMMENDATION,
        payload: filterRecommendedTakeawayList(takeawayList, filterType, true, orderType)
    };
};
