import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { TAKEAWAY_SEARCH_LIST_TYPE } from './TakeawayListType';
import { FilterTakeawayNetwork } from '../Utils/FilterTakeawayNetwork';
import {
    isArrayNonEmpty,
    isFoodHubApp,
    isFranchiseApp,
    isNonCustomerApp,
    isValidElement,
    isValidNumber,
    isValidString,
    isEmpty,
    isUKTakeaway,
    isCustomerApp,
    getHostBasedOnEnv
} from 't2sbasemodule/Utils/helpers';
import {
    checkNecessaryConfigParams,
    filterTakeawayData,
    filterTakeawayList,
    getCuisinesFromTakeawayList,
    getSearchMethodFromTakeawayList,
    getSearchTermFromTakeawayList,
    isTakeawayListEmpty,
    newTakeawayList,
    patchDistanceOfTakeaway,
    searchMethod,
    searchTakeawayName,
    searchTARecommendationName,
    sortBasedOnCuisineAndFilter
} from '../Utils/Helper';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { FILTER_TYPE, LIVE_TRACKING_EVENT, SEARCH_TYPE, SCREEN_NAME } from '../Utils/Constants';
import { apiCall, updateConfiguration } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { appBase } from '../../../CustomerApp/Network/AppBaseNetwork';
import { makeGetMenuApiCall, resetMenuForNonCustomerApp } from 'appmodules/MenuModule/Redux/MenuSaga';
import { CONFIG_KEYS } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorConstants';
import { getFormattedAddress } from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { isOurRecommendationsEnable } from 'appmodules/HomeModule/Utils/HomeHelper';
import { HOME_TYPE } from 'appmodules/HomeModule/Redux/HomeType';
import { resetTakeawayAction } from './TakeawayListAction';
import { AddressNetwork } from 'appmodules/AddressModule/Network/AddressNetwork';
import {
    selectCountryBaseFeatureGateSelector,
    selectEnvConfig,
    selectHasUserLoggedIn,
    selectS3Response,
    selectTakeawayListReducer
} from 't2sbasemodule/Utils/AppSelectors';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS, SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { isOrderTypeToggleEnabled, isUKApp } from 'appmodules/BaseModule/GlobalAppHelper';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { ADDRESS_TYPE } from 'appmodules/AddressModule/Redux/AddressType';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { selectUserID, selectCountryBaseFeatureGateResponse } from 'appmodules/BasketModule/Redux/BasketSelectors';
import { NETWORK_CONSTANTS } from '../../../T2SBaseModule/Utils/Constants';
import { randomSessionToken } from '../../HomeModule/Utils/Helper';
import { getCurrentPageFromNavigation } from 'appmodules/AnalyticsModule/Utils/AnalyticsHelper';
import { selectMenuResponse } from 'appmodules/MenuModule/Redux/MenuSelector';
import { logStoreConfigResponse } from '../../../CustomerApp/Saga/AppSaga';

function* getTakeawayListByAddress(action) {
    try {
        let isNameSearchType = action.addressObj.type === SEARCH_TYPE.NAME;
        if ((isValidElement(action?.searchType) && SEARCH_TYPE.FUZZY_SEARCH === action.searchType.toString()) || isNameSearchType) {
            if (isNameSearchType) {
                action.addressObj.value = action?.addressObj?.description;
            }
            yield getTakeawayList({ ...action, searchByAddress: false });
        } else {
            const response = yield apiCall(AddressNetwork.getLocationLookupCall, action);
            yield put({ type: TYPES_CONFIG.UPDATE_GOOGLE_SESSION_TOKEN, googleSessionToken: randomSessionToken() });
            if (
                isArrayNonEmpty(response?.data) &&
                isValidNumber(response.data[0]?.geometry?.location?.lat) &&
                isValidNumber(response.data[0]?.geometry?.location?.lng)
            ) {
                let value = response.data[0].geometry.location;
                yield getTakeawayList({
                    ...action,
                    lat: value.lat,
                    lng: value.lng,
                    searchByAddress: true
                });
            }
        }
    } catch (e) {
        yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_FAILURE });
        //do noting
    }
}
function* getTakeawayListByUserAddress(action) {
    try {
        yield getTakeawayList({
            lat: action.address.latitude,
            lng: action.address.longitude,
            searchByAddress: true,
            addressObj: {
                ...action.address,
                description: getFormattedAddress(action.address)
            },
            description: getFormattedAddress(action.address)
        });
    } catch (e) {
        //do noting
    }
}

function* getTakeawayRecommendation(action, customer_id) {
    try {
        const configEnvType = yield select(selectEnvConfig);

        return yield apiCall(FilterTakeawayNetwork.getTakeawayRecommendation, {
            ...action,
            customer_id: customer_id,
            postCode: action.postCode.replace(/\s/g, ''),
            configType: configEnvType
        });
    } catch (e) {
        // do nothing;
    }
}

export function* getTakeawayList(action) {
    const s3ConfigResponse = yield select(selectS3Response);
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    let countryID = s3ConfigResponse?.country?.id;
    let countryISO = s3ConfigResponse?.country?.iso;
    const customer_id = yield select(selectUserID);

    //todo: need to optimise this better
    let addressValue = isValidElement(action?.addressObj?.value)
        ? action.addressObj.value
        : isValidElement(action?.addressObj?.description)
        ? action?.addressObj?.description
        : null;
    let selectedPostcodeValue = isFoodHubApp()
        ? action.searchByAddress
            ? isValidElement(action?.addressObj?.description)
                ? action.addressObj.description
                : ''
            : isValidElement(action.postCode)
            ? action.postCode
            : action?.addressObj?.description
        : addressValue;

    let envConfig = yield select(selectEnvConfig);
    try {
        let response,
            cuisinesResponse,
            best_match_response = null,
            takeaway_recommendation_response = null,
            recommendationTA = null;
        yield put(resetTakeawayAction());
        if (isFranchiseApp() || (isFoodHubApp() && !isUKApp(countryID))) {
            response = yield apiCall(FilterTakeawayNetwork.makePostGetTakeawayListCallInisFranchiseAppSearch, {
                ...action,
                ...getHostBasedOnEnv(countryID, envConfig)
            });
        } else {
            response =
                !action.searchByAddress && isValidString(action.postCode)
                    ? yield apiCall(FilterTakeawayNetwork.makePostGetTakeawayListCall, action)
                    : isValidElement(action?.addressObj?.type) && action?.addressObj?.type === SEARCH_TYPE.NAME
                    ? yield apiCall(FilterTakeawayNetwork.getTakeawayListByName, action)
                    : yield apiCall(FilterTakeawayNetwork.makePostGetTakeawayListByGeocodeCall, action);
        }
        let isFilterValid = isValidElement(response?.value?.filter_by?.filter);
        if (isArrayNonEmpty(response?.data)) {
            if (isNonCustomerApp()) {
                cuisinesResponse = yield getCuisinesFromTakeawayList(response.data, response.cuisines);
            }
            if (isValidString(customer_id) && isUKTakeaway(s3ConfigResponse?.country?.id)) {
                takeaway_recommendation_response = yield getTakeawayRecommendation(action, customer_id);
                if (isValidElement(takeaway_recommendation_response?.Data)) {
                    recommendationTA = filterTakeawayData(response.value.filter_by.filter, takeaway_recommendation_response?.Data);
                }
            }
            try {
                if (isUKTakeaway(s3ConfigResponse?.country?.id)) {
                    best_match_response = yield apiCall(FilterTakeawayNetwork.makeS3BestMatchWeightageCall);
                }
            } catch (e) {
                //TODO nothing to handle
            }
            patchDistanceOfTakeaway(response, s3ConfigResponse?.country?.distance_type, best_match_response);
            const isUserLoggedIn = yield select(selectHasUserLoggedIn);
            yield put({
                type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_SUCCESS,
                payload: response.data,
                selectedPostcode: selectedPostcodeValue,
                cuisinesList: isValidElement(cuisinesResponse) ? cuisinesResponse : null,
                listDetail: isValidElement(response?.value) ? response.value : null,
                filterDataType: isFilterValid ? response.value.filter_by.filter : null,
                selectedAddress: isValidElement(action.selectedAddress) ? action.selectedAddress : null,
                isSavedAddress: isValidElement(action.isSavedAddress) ? action.isSavedAddress : null,
                searchAddress: action.searchAddress,
                isDifferentAddress: action.isDifferentAddress && isUserLoggedIn,
                cuisinesResponse: response.cuisines,
                takeaway_recommendation_response: recommendationTA
            });
            logTAFound(featureGateResponse, action, countryISO, response?.data);

            if (isValidElement(response.value)) {
                let filterType = isFilterValid ? response.value.filter_by?.filter : FILTER_TYPE.DISTANCE_VALUE;
                let sortedResponse = filterTakeawayData(filterType, response.data);
                if (isArrayNonEmpty(sortedResponse)) {
                    let newTakeawayListResponse = newTakeawayList(sortedResponse);
                    if (isArrayNonEmpty(newTakeawayListResponse)) {
                        yield getFilterTakeawayList(newTakeawayListResponse, true, action.orderType);
                    }
                    yield getFilterTARecomendationList(recommendationTA, true, action.orderType);
                }
            } else {
                yield getFilterTakeawayList(response.data, true, action.orderType);
            }
        } else {
            logNoTA(featureGateResponse, action, countryISO, 'no_result');
            yield put({
                type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_FAILURE
            });
        }
    } catch (e) {
        logNoTA(featureGateResponse, action, countryISO, e?.type === NETWORK_CONSTANTS.API_ERROR ? 'failed' : 'connection_error');
        yield put({
            type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_FAILURE
        });
    }
}

function logNoTA(featureGateResponse, action, countryISO, error_type) {
    Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCH_FAILED, {
        country_code: countryISO,
        cause: action.searchByAddress ? SEGMENT_STRINGS.NO_TAKEAWAY_FOUND_AREA : SEGMENT_STRINGS.NO_TAKEAWAY_FOUND_POSTCODE,
        search: getSearchTermFromTakeawayList(action),
        type: error_type
    });
}

function logTAFound(featureGateResponse, action, countryISO, takeawayList) {
    Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCH_SUCCESS, {
        country_code: countryISO,
        search: getSearchTermFromTakeawayList(action),
        method: getSearchMethodFromTakeawayList(action),
        result: isArrayNonEmpty(takeawayList) ? takeawayList.length : 0
    });
}

function* getFilterTakeawayList(takeAwayList, checkByOrderType = false, orderType, isManualChange = false) {
    try {
        const s3ConfigResponse = yield select(selectS3Response);
        let countryId = s3ConfigResponse?.country?.id;
        const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        let filterTypeValue = isOrderTypeToggleEnabled(countryId, featureGateResponse) ? checkByOrderType : false;
        let filteredTakeaway = yield call(filterTakeawayList, takeAwayList, filterTypeValue, orderType);
        if (
            isValidElement(isManualChange) &&
            !isManualChange &&
            orderType === ORDER_TYPE.DELIVERY &&
            checkByOrderType &&
            orderType &&
            isTakeawayListEmpty(filteredTakeaway)
        ) {
            filteredTakeaway = yield call(filterTakeawayList, takeAwayList, filterTypeValue, ORDER_TYPE.COLLECTION);
            yield put({ type: ADDRESS_TYPE.SELECTED_TA_ORDER_TYPE, payload: ORDER_TYPE.COLLECTION });
            yield put({ type: ADDRESS_TYPE.UPDATE_NON_BASKET_ORDER_TYPE, payload: ORDER_TYPE.COLLECTION });
        }
        if (isValidElement(filteredTakeaway)) {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.SAVE_FILTERED_TAKEAWAYS, payload: filteredTakeaway });
        }
    } catch (e) {
        //do noting
    }
}

function* getFilterTARecomendationList(takeAwayList, checkByOrderType = false, orderType, isManualChange = false) {
    try {
        const s3ConfigResponse = yield select(selectS3Response);
        let countryId = s3ConfigResponse?.country?.id;
        const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        let filterTypeValue = isOrderTypeToggleEnabled(countryId, featureGateResponse) ? checkByOrderType : false;
        let filteredTakeaway = yield call(filterTakeawayList, takeAwayList, filterTypeValue, orderType);

        yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_FILTERBY_RECOMMENDATION, payload: filteredTakeaway?.onlineTakeaways });
    } catch (e) {
        //do noting
    }
}

function* getAdvanceFilterTakeawayList(takeAwayList, checkByOrderType = false, orderType) {
    try {
        const s3ConfigResponse = yield select(selectS3Response);
        const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        let countryId = s3ConfigResponse?.country?.id;
        let filterTypeValue = isOrderTypeToggleEnabled(countryId, featureGateResponse) ? checkByOrderType : false;
        const filteredTakeaway = yield call(filterTakeawayList, takeAwayList, filterTypeValue, orderType);

        if (isValidElement(filteredTakeaway)) {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.SAVE_ADVANCED_FILTERED_TAKEAWAYS, payload: filteredTakeaway });
        }
    } catch (e) {
        //do noting
    }
}

function* filterTakeawayListPostCuisinesSort(action, sortedTakeawayList) {
    try {
        if (isValidElement(action.filterType) && isValidElement(sortedTakeawayList)) {
            let response = yield filterTakeawayData(action.filterType, sortedTakeawayList);
            yield put({
                type: TAKEAWAY_SEARCH_LIST_TYPE.GET_FILTERED_TAKEAWAYS_COUNT,
                payload: isValidElement(response) ? response.length : 0
            });

            let newTakeawayListResponse = response;
            if (
                isValidElement(action.cuisines) &&
                action.cuisines.length === 0 &&
                isValidElement(action.filterList) &&
                action.filterList.length === 0 &&
                isValidElement(action.filterType) &&
                action.filterType === FILTER_TYPE.DISTANCE_VALUE &&
                !isValidString(action.selectedCuisineFilterName)
            ) {
                newTakeawayListResponse = newTakeawayList(response);
            }
            if (action.homeScreenFilter) {
                yield getAdvanceFilterTakeawayList(newTakeawayListResponse, true, action.orderType);
            } else {
                yield getFilterTakeawayList(newTakeawayListResponse, true, action.orderType, action.manualChange);
            }
            /*yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TAKEAWAY_SUCCESS, payload: response });*/
        }
    } catch (e) {
        //do nothing
    }
}

function* searchElementMethod(action) {
    try {
        const takeawayListReducer = yield select(selectTakeawayListReducer);
        let response;
        let taResponse;
        if (
            isValidElement(action.searchString) &&
            isValidElement(action.arrayList) &&
            isValidElement(action.searchType) &&
            isValidElement(takeawayListReducer)
        ) {
            const taRecommendation =
                isValidElement(takeawayListReducer?.takeaway_recommendation_response) &&
                takeawayListReducer.takeaway_recommendation_response.length > 0
                    ? takeawayListReducer.takeaway_recommendation_response.slice(0, 3)
                    : null;
            if (action.searchType === SEARCH_TYPE.CUISINES_FILTER) {
                response = searchMethod(action.arrayList, action.searchString);
            } else {
                response = yield searchTakeawayName(action.arrayList, action.searchString);
                if (isValidElement(taRecommendation)) {
                    taResponse = yield searchTARecommendationName(taRecommendation, action.searchString);
                    yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.SET_SEARCH_TA_RECOMMENDATION, payload: taResponse });
                }
            }
            if (isValidElement(response) && action.searchType === SEARCH_TYPE.TAKEAWAY_FILTER) {
                yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.GET_SEARCHED_TAKEAWAY_COUNT, payload: response.length });
                const takeawayListReducer = yield select(selectTakeawayListReducer);
                if (isValidElement(takeawayListReducer) && (takeawayListReducer.homeScreenFilter || takeawayListReducer.isFromOfferList)) {
                    yield getAdvanceFilterTakeawayList(response, isEmpty(action.searchString), action.orderType);
                } else {
                    let sortedResponse = filterTakeawayData(action.filterType, response);
                    if (isArrayNonEmpty(sortedResponse)) {
                        let newTakeawayListResponse = newTakeawayList(sortedResponse);
                        if (isArrayNonEmpty(newTakeawayListResponse)) {
                            yield getFilterTakeawayList(newTakeawayListResponse, true, action.orderType);
                        }
                    }
                }
            } else if (isValidElement(response) && action.searchType === SEARCH_TYPE.CUISINES_FILTER) {
                yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.SEARCH_ELEMENT_SUCCESS, payload: response });
            } else if (isValidElement(response) && action.searchType === SEARCH_TYPE.FAVOURITE_TAKEAWAYS) {
                let filteredFavouriteTakeawayList = yield filterTakeawayList(response, false, null);
                yield put({
                    type: TAKEAWAY_SEARCH_LIST_TYPE.GET_SEARCHED_FAVOURITE_TAKEAWAY_SUCCESS,
                    payload: filteredFavouriteTakeawayList
                });
            }
            if (isValidString(action?.searchString) && isValidElement(response)) {
                yield logSearchTakeawayResponse(response, action, takeawayListReducer?.filterType);
            }
        }
    } catch (e) {
        //do nothing
    }
}

function* logSearchTakeawayResponse(response, action, filterType) {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    let currentRoute = getCurrentPageFromNavigation();
    Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.TA_SEARCH, {
        search_string: action.searchString,
        sorting: filterType,
        result: isArrayNonEmpty(response) ? response.length : 0,
        search_status: response.length > 0 ? SEGMENT_STRINGS.SUCCESS : SEGMENT_STRINGS.FAILED,
        source: isValidString(currentRoute) ? currentRoute : SCREEN_NAME.TAKEAWAY_LIST_SCREEN
    });
}

function* sortBasedOnCuisinesSelected(action) {
    try {
        if (isValidElement(action.takeawayList)) {
            const response = yield sortBasedOnCuisineAndFilter(
                action.cuisines,
                action.takeawayList,
                action.filterList,
                action.homeScreenFilter,
                action.selectedCuisineFilterName
            );
            if (isValidElement(response)) {
                yield filterTakeawayListPostCuisinesSort(action, response);
            }
        }
    } catch (e) {
        //do nothing
    }
}

function* postFavouriteTakeaway(action) {
    try {
        if (isValidElement(action.storeId) && isValidElement(action.favourite)) {
            yield apiCall(FilterTakeawayNetwork.makePostFavouriteTakeawayCall, action);
        }
        yield put({
            type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATE_LOCAL_TAKEAWAY_LIST_FAVORITE,
            payload: action
        });
    } catch (e) {
        //do nothing
    }
}

export function* getFavouriteTakeaway() {
    try {
        const response = yield apiCall(FilterTakeawayNetwork.makeGetFavouriteTakeawayCall);
        if (isValidElement(response) && isValidElement(response.customer) && isValidElement(response.customer.stores)) {
            yield put({
                type: TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY_SUCCESS,
                payload: response.customer.stores
            });
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* getFavouriteTakeawayList() {
    try {
        const response = yield apiCall(FilterTakeawayNetwork.makeGetFavouriteTakeawayListCall);
        if (isValidElement(response) && isValidElement(response.wishlist)) {
            let filteredResponse = yield call(filterTakeawayList, response.wishlist, false, null);
            if (isValidElement(filteredResponse)) {
                yield put({
                    type: TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY_LIST_SUCCESS,
                    payload: filteredResponse,
                    response: response.wishlist
                });
            }
        }
    } catch (e) {
        // do nothing
    }
}

function* handleTakeawayClickAction(action) {
    let storeConfigResponse;
    try {
        //update store id
        yield updateStoreID(action);

        let menuResponsedata = yield select(selectMenuResponse);
        if (isCustomerApp() && isValidElement(menuResponsedata)) {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
        }

        //TODO if we get the preorder_date and apple_pay should come under settings obj from list API response we will enable the commented line
        // We are not yet respecting the Previous order toggle for displaying the previous order(2) in menu screen

        //todo: change this once api response gets updated. refer - fdhb-9060
        let isValidBestSellingParam = checkNecessaryConfigParams(action.storeInfo);
        yield put({ type: HOME_TYPE.FILTER_OUR_RECOMMENDATIONS, payload: null });
        storeConfigResponse =
            action.isFromRecentTakeaway || !isValidBestSellingParam ? yield apiCall(appBase.makeStoreConfigCall) : action.storeInfo;
        yield fork(logStoreConfigResponse, storeConfigResponse);
        yield fork(resetMenuForNonCustomerApp, storeConfigResponse.host);
        // Get recommendation for selected takeaway
        if (isValidElement(storeConfigResponse)) {
            yield put({ type: TYPES_CONFIG.STORE_CONFIG_SUCCESS, payload: storeConfigResponse });

            if (isOurRecommendationsEnable(storeConfigResponse?.our_recommendations)) {
                yield put({ type: HOME_TYPE.GET_MENU_RECOMMENDATION });
            } else {
                yield put({ type: HOME_TYPE.NO_RECOMMENDATIONS, payload: null });
            }
            yield fork(makeGetMenuApiCall, storeConfigResponse, false, action.isFromRecentTakeaway);
        } else {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
        }
    } catch (e) {
        yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.STOP_MENU_LOADER });
        showErrorMessage(e);
    }
}

function* resetStoreID() {
    if (isNonCustomerApp()) {
        let data = yield select(getConfiguration);
        yield call(updateConfiguration, {
            ...data,
            [CONFIG_KEYS.config_store_id]: null
        });
    }
}

export function* updateStoreID(action) {
    const { storeID, storeInfo } = action;
    if (isNonCustomerApp()) {
        let storeId = isValidElement(storeID) ? storeID : isValidElement(storeInfo?.config_id) ? storeInfo.config_id : null;
        let data = yield select(getConfiguration);
        yield call(updateConfiguration, {
            ...data,
            [CONFIG_KEYS.config_store_id]: storeId
        });
    }
}

export function* getAssociateTakeawayList() {
    try {
        const response = yield apiCall(FilterTakeawayNetwork.makeAssociateTakeawayCall);
        if (isValidElement(response) && isValidElement(response.customer) && isValidElement(response.customer.stores)) {
            yield put({
                type: TAKEAWAY_SEARCH_LIST_TYPE.GET_ASSOCIATE_TAKEAWAY_SUCCESS,
                payload: response.customer.stores
            });
        }
    } catch (e) {
        //do nothing
    }
}

export function* getOfferBasedTakeawayList(action) {
    try {
        const takeawayListReducer = yield select(selectTakeawayListReducer);
        if (isValidElement(takeawayListReducer) && isValidElement(takeawayListReducer.takeawayList)) {
            const filteredList = takeawayListReducer.takeawayList.filter(
                (takeaway) => takeaway.discount >= action.offer && takeaway.discount <= action.offerMax
            );
            const sortedList = filterTakeawayData(FILTER_TYPE.DISCOUNT, filteredList);
            yield getAdvanceFilterTakeawayList(sortedList, true, action.orderType);
        }
    } catch (e) {
        //do nothing
    }
}

export function* updateTALiveTracking(action) {
    try {
        const response = yield apiCall(FilterTakeawayNetwork.makeLiveTrackingCall, action);
        if (isValidElement(response?.outcome) && response.outcome === 'success') {
            if (action.event === LIVE_TRACKING_EVENT.SELECT_TA_FILTER_TYPE_EVENT) {
                yield put({
                    type: TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_EVENT_ID,
                    payload: response.id
                });
            }
        }
    } catch (e) {
        //do nothing
    }
}

export function* getFilterTARecommendation(action) {
    try {
        if (isValidElement(action.taRecommendation)) {
            const response = filterTakeawayData(action.filterType, action.taRecommendation);
            yield put({
                type: TAKEAWAY_SEARCH_LIST_TYPE.SET_FILTER_TA_RECOMMENDATION,
                payload: response
            });
        }
    } catch (e) {
        // Do nothings
    }
}

function* TakeawayListSaga() {
    yield all([
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST, getTakeawayList),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.SEARCH_ELEMENT, searchElementMethod),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.FILTER_CUISINES, sortBasedOnCuisinesSelected),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.POST_FAVOURITE_TAKEAWAY, postFavouriteTakeaway),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY, getFavouriteTakeaway),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.GET_FAVOURITE_TAKEAWAY_LIST, getFavouriteTakeawayList),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.TAKEAWAY_LIST_CLICK_ACTION, handleTakeawayClickAction),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.RESET_STORE_ID_CONFIG, resetStoreID),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_ADDRESS, getTakeawayListByAddress),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST_BY_USER_ADDRESS, getTakeawayListByUserAddress),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.GET_ASSOCIATE_TAKEAWAY, getAssociateTakeawayList),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TAKEAWAY_BASED_ON_OFFER, getOfferBasedTakeawayList),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.FILTER_TA_RECOMENDATION, getFilterTARecommendation),
        takeLatest(TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_LIVE_TRACKING, updateTALiveTracking)
    ]);
}

export default TakeawayListSaga;
