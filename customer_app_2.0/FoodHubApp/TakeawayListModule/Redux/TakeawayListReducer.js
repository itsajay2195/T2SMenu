import { TAKEAWAY_SEARCH_LIST_TYPE } from './TakeawayListType';
import { isArrayNonEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import {
    getCuisinesFromTakeawayList,
    getFilterCuisinesList,
    setFilterType,
    sortByCuisineCount,
    sortBySelectedCuisine,
    takeawayListWithFavoritesUpdated,
    updateFilterType
} from '../Utils/Helper';
import { HOME_TYPE } from '../../HomeModule/Redux/HomeType';
import { ADDRESS_TYPE } from 'appmodules/AddressModule/Redux/AddressType';

const INITIAL_STATE = {
    takeawayList: null,
    listDetails: null,
    cuisinesArray: null,
    filteredElementArray: null,
    filterType: null,
    cuisinesSelected: [],
    selectedCuisines: [],
    advancedSelectedCuisines: [],
    filterList: [],
    sortedCuisinesTakeawayList: null,
    onlineTakeaways: null,
    preorderTakeaways: null,
    closedTakeaways: null,
    favouriteTakeaways: null,
    favouriteTakeawayList: null,
    searchedFavouriteTakeawayList: null,
    takeawaysCount: null,
    searchedTakeawayCount: null,
    selectedPostcode: null,
    takeawayFetching: false,
    takeawayGetSuccess: false,
    isMenuLoading: false,
    takeawayListScrollTop: false,
    isCuisinesUpdated: false,
    associateTakeawayResponse: [],
    isFilterTypeUpdated: false,
    previouslySelectedCuisines: [],
    previousSelectedFilterType: null,
    redirectBasketRoute: null,
    redirectNavigation: null,
    fromTakeawayList: false,
    advancedFilterType: null,
    advancedCuisineSelected: [],
    advancedFilterList: [],
    homeScreenFilter: false,
    advancedOnlineTakeaways: null,
    advancedPreorderTakeaways: null,
    advancedClosedTakeaways: null,
    selectedAdvancedFilterName: null,
    filterListWithOffer: null,
    filterListWithMaxOffer: null,
    isFromOfferList: false,
    cuisinesResponse: null, //response from api
    favouriteTakeawayListResponse: null,
    takeaway_recommendation_response: null,
    search_takeaway_response: null,
    selectedAddress: null,
    isSavedAddress: null,
    searchAddress: null,
    isDifferentAddress: null,
    addressCurrentLocation: null,
    takeawayLiveTrackingEventID: null,
    recommendationTA: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HOME_TYPE.RESET_AUTOCOMPLETE_PLACES:
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_TAKEAWAY_LIST:
            return {
                ...state,
                onlineTakeaways: null,
                preorderTakeaways: null,
                closedTakeaways: null,
                takeawayGetSuccess: false,
                selectedPostcode: null,
                takeawaysCount: null,
                searchedTakeawayCount: null,
                invalidPostCodeOrAddress: false,
                advancedOnlineTakeaways: null,
                advancedPreorderTakeaways: null,
                advancedClosedTakeaways: null,
                filterListWithOffer: null,
                filterListWithMaxOffer: null,
                isFromOfferList: false,
                cuisinesResponse: null,
                takeawayLiveTrackingEventID: null,
                takeaway_recommendation_response: null,
                search_takeaway_response: null,
                recommendationTA: null
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST:
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_ADDRESS:
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_USER_ADDRESS: {
            const { isSavedAddress, isDifferentAddress, selectedPostcode, searchAddress } = action;
            return {
                ...state,
                takeawayFetching: true,
                invalidPostCodeOrAddress: false,
                takeawayList: null,
                selectedAddress: isValidElement(action.selectedAddress) && action.selectedAddress,
                isSavedAddress: isValidElement(isSavedAddress) ? isSavedAddress : null,
                searchAddress: searchAddress,
                isDifferentAddress: isValidElement(isDifferentAddress) ? isDifferentAddress : state.isDifferentAddress,
                selectedPostcode: isValidString(selectedPostcode) ? selectedPostcode.toUpperCase() : state.selectedPostcode
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_SUCCESS: {
            const { cuisinesList, selectedPostcode, listDetail, selectedAddress } = action;
            return {
                ...state,
                takeawayList: action.payload,
                takeawayGetSuccess: true,
                invalidPostCodeOrAddress: false,
                cuisinesArray: isValidElement(cuisinesList) ? cuisinesList : state.cuisinesArray,
                selectedPostcode: isValidString(selectedPostcode) ? selectedPostcode.toUpperCase() : state.selectedPostcode,
                listDetails: isValidElement(listDetail) ? listDetail : state.listDetails,
                ...setFilterType(state.homeScreenFilter, action, state.filterType, state.advancedFilterType),
                cuisinesResponse: action.cuisinesResponse,
                selectedAddress: selectedAddress,
                takeaway_recommendation_response: action.takeaway_recommendation_response
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_FAILURE:
            return {
                ...state,
                takeawayList: [],
                takeawayGetSuccess: true,
                takeawayFetching: false,
                invalidPostCodeOrAddress: true
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TAKEAWAY_SUCCESS:
            return {
                ...state,
                takeawayList: action.payload
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.SEARCH_ELEMENT_SUCCESS:
            return {
                ...state,
                filteredElementArray: action.payload
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.SET_FILTER_TYPE:
            return {
                ...state,
                ...setFilterType(state.homeScreenFilter, action, state.filterType, state.advancedFilterType)
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_CHECKED_ADVANCE_CUISINES:
            return {
                ...state,
                advancedCuisineSelected: action.cuisinesArray,
                advancedSelectedCuisines: action.cuisinesArray,
                advancedFilterList: isValidElement(action.filterList) ? action.filterList : state.filterList,
                cuisinesArray: isArrayNonEmpty(action.cuisinesArray)
                    ? sortBySelectedCuisine(state.cuisinesArray, action.cuisinesArray)
                    : sortByCuisineCount(state.cuisinesArray)
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_CHECKED_CUISINES:
            return {
                ...state,
                cuisinesSelected: action.cuisinesArray,
                selectedCuisines: action.cuisinesArray,
                filterList: isValidElement(action.filterList) ? action.filterList : state.filterList,
                cuisinesArray: isArrayNonEmpty(action.cuisinesArray)
                    ? sortBySelectedCuisine(state.cuisinesArray, action.cuisinesArray)
                    : sortByCuisineCount(state.cuisinesArray)
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_ACTION:
            return {
                ...state,
                cuisinesSelected: [],
                selectedCuisines: [],
                filterList: [],
                cuisinesArray: sortByCuisineCount(state.cuisinesArray),
                filterType: updateFilterType(state.listDetails),
                takeawaysCount: null,
                searchedTakeawayCount: null
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.ADVANCED_RESET_ACTION:
            return {
                ...state,
                advancedCuisineSelected: [],
                advancedSelectedCuisines: [],
                advancedFilterList: [],
                cuisinesArray: sortByCuisineCount(
                    getFilterCuisinesList(state.takeawayList, state.selectedAdvancedFilterName, state.cuisinesArray)
                ),
                advancedFilterType: updateFilterType(state.listDetails),
                takeawaysCount: null,
                searchedTakeawayCount: null
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_CUISINES_ACTION:
            return {
                ...state,
                cuisinesSelected: [],
                selectedCuisines: [],
                cuisinesArray: sortByCuisineCount(state.cuisinesArray)
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_ADVANCE_CUISINES_ACTION:
            return {
                ...state,
                advancedCuisineSelected: [],
                advancedSelectedCuisines: [],
                cuisinesArray: sortByCuisineCount(
                    getFilterCuisinesList(state.takeawayList, state.selectedAdvancedFilterName, state.cuisinesArray)
                )
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.FITLER_RESET: {
            return {
                ...state,
                advancedCuisineSelected: [],
                advancedSelectedCuisines: [],
                advancedFilterList: [],
                cuisinesArray: sortBySelectedCuisine(
                    getCuisinesFromTakeawayList(state.takeawayList, state.cuisinesResponse),
                    state.selectedCuisines
                ),
                advancedFilterType: updateFilterType(state.listDetails),
                takeawaysCount: null,
                searchedTakeawayCount: null,
                filterListWithOffer: null,
                filterListWithMaxOffer: null,
                isFromOfferList: false
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.SAVE_FILTERED_TAKEAWAYS:
            return {
                ...state,
                onlineTakeaways: action.payload.onlineTakeaways,
                preorderTakeaways: action.payload.preOrderTakeaways,
                closedTakeaways: action.payload.closedTakeawayList,
                advancedFilterType: updateFilterType(state.listDetails),
                takeawayFetching: false
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.SAVE_ADVANCED_FILTERED_TAKEAWAYS:
            return {
                ...state,
                advancedOnlineTakeaways: action.payload.onlineTakeaways,
                advancedPreorderTakeaways: action.payload.preOrderTakeaways,
                advancedClosedTakeaways: action.payload.closedTakeawayList
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY_SUCCESS:
            return {
                ...state,
                favouriteTakeaways: isValidElement(action.payload) ? action.payload : INITIAL_STATE.favouriteTakeaways
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY_LIST_SUCCESS:
            return {
                ...state,
                favouriteTakeawayList: isValidElement(action.payload) ? action.payload : INITIAL_STATE.favouriteTakeawayList,
                favouriteTakeawayListResponse: isValidElement(action.response) && action.response
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_SEARCHED_FAVOURITE_TAKEAWAY_SUCCESS:
            return {
                ...state,
                searchedFavouriteTakeawayList: isValidElement(action.payload) ? action.payload : INITIAL_STATE.searchedFavouriteTakeawayList
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_LOCAL_TAKEAWAY_LIST_FAVORITE:
            return {
                ...state,
                favouriteTakeaways: takeawayListWithFavoritesUpdated(
                    state.favouriteTakeaways,
                    action.payload.storeId,
                    action.payload.favourite
                )
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_FILTERED_TAKEAWAYS_COUNT:
            return {
                ...state,
                takeawaysCount: action.payload,
                searchedTakeawayCount: null
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_SEARCHED_TAKEAWAY_COUNT:
            return {
                ...state,
                searchedTakeawayCount: action.payload
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.POST_FAVOURITE_TAKEAWAY:
            return {
                ...state,
                favouriteTakeawayList:
                    action.favourite === 'NO' && isValidElement(state.favouriteTakeawayList) && state.favouriteTakeawayList.length > 0
                        ? state.favouriteTakeawayList.filter((item) => item.id !== action.storeId)
                        : state.favouriteTakeawayList
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.START_MENU_LOADER:
            return {
                ...state,
                isMenuLoading: true
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER:
            return {
                ...state,
                isMenuLoading: false
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.TAKEAWAY_LIST_CLICK_ACTION:
            return {
                ...state,
                isMenuLoading: true
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.SET_TAKEAWAY_SCROLL_TOP:
            return {
                ...state,
                takeawayListScrollTop: action.payload
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.GET_ASSOCIATE_TAKEAWAY_SUCCESS:
            return {
                ...state,
                associateTakeawayResponse: action.payload
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_FAVOURITE_SEARCH_LIST:
            return {
                ...state,
                searchedFavouriteTakeawayList: null
            };
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_TAKEAWAYS_ON_COUNTRY_SWITCH: {
            return {
                ...state,
                takeawayList: null,
                takeawayGetSuccess: false
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.REDIRECT_ROUTE_BASKET_ACTION: {
            return {
                ...state,
                redirectBasketRoute: action.routes,
                redirectNavigation: action.redirectNavigation,
                fromTakeawayList: action.fromTakeawayList
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_ROUTE_BASKET_ACTION: {
            return {
                ...state,
                redirectBasketRoute: null,
                redirectNavigation: null,
                fromTakeawayList: false
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.STOP_TAKEAWAY_FIND_LOADING: {
            return {
                ...state,
                takeawayFetching: false
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.SELECTED_CUISINES_LIST: {
            return {
                ...state,
                selectedCuisines: action.cuisines
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.ADVANCE_SELECTED_CUISINES_LIST: {
            return {
                ...state,
                advancedSelectedCuisines: action.cuisines
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_HOME_SCREEN_FILTER_STATUS: {
            return {
                ...state,
                homeScreenFilter: action.homeScreenStatus,
                selectedAdvancedFilterName: action.selectedAdvancedFilterName
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TAKEAWAY_BASED_ON_OFFER: {
            return {
                ...state,
                filterListWithOffer: action.offer,
                filterListWithMaxOffer: action.offerMax,
                isFromOfferList: true
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.SET_FILTER_TA_RECOMMENDATION: {
            return {
                ...state,
                recommendationTA: action.payload
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.SET_SEARCH_TA_RECOMMENDATION: {
            return {
                ...state,
                search_takeaway_response: action.payload
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.UPDATED_SEARCH_ADDRESS: {
            return {
                ...state,
                isSavedAddress: action.payload
            };
        }
        case ADDRESS_TYPE.UPDATE_CURRENT_LOCATION: {
            return {
                ...state,
                addressCurrentLocation: action.payload
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_EVENT_ID: {
            return {
                ...state,
                takeawayLiveTrackingEventID: action.payload
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.RESET_TA_EVENT_ID: {
            return {
                ...state,
                takeawayLiveTrackingEventID: null
            };
        }
        case TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_FILTERBY_RECOMMENDATION: {
            return {
                ...state,
                recommendationTA: action.payload
            };
        }
        default:
            return {
                ...state
            };
    }
};
