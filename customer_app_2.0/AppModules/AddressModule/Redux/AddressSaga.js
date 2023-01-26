import { all, fork, put, select, takeLatest, takeLeading, putResolve } from 'redux-saga/effects';
import { ADDRESS_TYPE } from './AddressType';
import { AddressNetwork } from '../Network/AddressNetwork';
import {
    isValidElement,
    safeArray,
    isValidNumber,
    isValidString,
    isCustomerApp,
    isValidNotEmptyString,
    isArrayNonEmpty
} from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import {
    extractAddress,
    extractLocation,
    getHostAndFranchise,
    getDeliveryAddressSortByLatestUpdate,
    getPostCode,
    isBasketOrderTypeChanged,
    isPrimaryAddress,
    isValidSearchInput
} from '../Utils/AddressHelpers';
import { ADDRESS_FORM_TYPE, DELIVERY_FOR } from '../Utils/AddressConstants';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { getAddressObj, getFormattedAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { filterMenu } from '../../MenuModule/Redux/MenuSaga';
import {
    selectBasketID,
    selectCartItems,
    selectCountryBaseFeatureGateResponse,
    selectDeliveryAddress
} from '../../BasketModule/Redux/BasketSelectors';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';
import { BASKET_UPDATE_TYPE } from '../../BasketModule/Utils/BasketConstants';
import {
    selectCountryBaseFeatureGateSelector,
    selectEnvConfig,
    selectHasUserLoggedIn,
    selectS3Response,
    selectSearchedPostcode,
    selectStoreConfigResponse,
    selectStoreId
} from 't2sbasemodule/Utils/AppSelectors';
import { Keyboard } from 'react-native';
import { ORDER_MANAGEMENT_TYPE } from '../../OrderManagementModule/Redux/OrderManagementType';
import { makeChangeAction, updateBasketAction } from '../../BasketModule/Redux/BasketAction';
import { deliveryLookupAction } from './AddressAction';
import { makeUpdateBasketCall, updatePaymentMode, updateSearchedDeliveryAddress } from '../../BasketModule/Redux/BasketSaga';
import _ from 'lodash';
import { currentAddressLocation, selectSavedAddress, selectTAOrderType, selectAppState } from './AddressSelectors';
import { getPendingOrder, getPreviousOrder } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import {
    getLatestOrder,
    getPostCodeFromRecentOrder,
    isPendingOrderNotAvailable,
    randomSessionToken,
    ValidatePostCodeUK
} from '../../../FoodHubApp/HomeModule/Utils/Helper';
import { HOME_TYPE } from '../../../FoodHubApp/HomeModule/Redux/HomeType';
import { TAKEAWAY_SEARCH_LIST_TYPE } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListType';
import { handleGoBack, handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { makeGetOrderListCall } from '../../OrderManagementModule/Redux/OrderManagementSaga';
import { isDifferentLatLongFromCurrentLocation } from '../../HomeAddressModule/Utils/Helpers';
import { setUserLocationUserAttributes } from '../../AnalyticsModule/Braze';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { getRecommendationResponse } from '../../HomeModule/Utils/HomeSelector';
import { filterOurRecommendations } from '../../HomeModule/Redux/HomeSaga';

export function* makeGetAddressCall(action) {
    try {
        const response = yield apiCall(AddressNetwork.makeGetAddressCall);
        if (isValidElement(response)) {
            //once FDHB-1474 ticket is done, has to change here accordingly
            if (isValidElement(response.data)) {
                response.data = _.orderBy(
                    response.data,
                    (obj) => {
                        return obj.id;
                    },
                    'desc'
                );
            }
            const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
            yield put({ type: ADDRESS_TYPE.GET_ADDRESS_SUCCESS, payload: response });
            setUserLocationUserAttributes(response, featureGateResponse);
            if (action?.viewType === ADDRESS_FORM_TYPE.TA_SEARCH_ADDRESS_SAVE) {
                yield fork(updateSearchedDeliveryAddress);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makePostcodeLookupCall(action) {
    try {
        const response = yield apiCall(AddressNetwork.makePostcodeLookupCall, action);
        if (isValidElement(response)) {
            yield put({ type: ADDRESS_TYPE.POSTCODE_LOOKUP_SUCCESS, payload: response });
        } else {
            Keyboard.dismiss();
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        Keyboard.dismiss();
        showErrorMessage(e);
    }
}

function* makePostAddAddressCall(action) {
    try {
        if (!isValidElement(action.addressForLookup)) {
            //TODO it should not be null/undefined
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            return;
        }
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        const locationLookupResponse = yield apiCall(AddressNetwork.getLocationLookupCall, {
            addressObj: { value: action.addressForLookup }
        });
        if (
            isValidElement(locationLookupResponse) &&
            locationLookupResponse.data.length > 0 &&
            isValidElement(locationLookupResponse.data[0])
        ) {
            let newAddressObj = {
                ...action.addressObj,
                ...extractLocation(locationLookupResponse.data[0])
            };
            const response = yield apiCall(AddressNetwork.makePostAddAddressCall, { addressObj: newAddressObj });
            if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
                if (isValidElement(newAddressObj) && isPrimaryAddress(newAddressObj)) {
                    setUserLocationUserAttributes(newAddressObj, featureGateResponse, false);
                }
                if (isValidElement(action.isAutoSave) && action.isAutoSave) {
                    yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATED_SEARCH_ADDRESS, payload: true });
                }
                newAddressObj.id = response.resource_id;
                yield put({ type: ADDRESS_TYPE.INTERNAL_ADD_ADDRESS, payload: newAddressObj });
                if (isValidNumber(action.popBackCount) && action.popBackCount > 1) {
                    action.navigation.pop(action.popBackCount);
                } else if (isValidElement(action.navigation) && action.navigation.canGoBack()) {
                    action.navigation.goBack();
                }
                if (action.viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY || action.viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY_ADD) {
                    let getOrderType = yield select(selectTAOrderType);
                    let takeawayActionsData = {
                        postCode: isValidElement(newAddressObj?.postcode) ? newAddressObj.postcode : '',
                        searchByAddress: false,
                        orderType: getOrderType,
                        selectedAddress: newAddressObj
                    };
                    yield fork(logTakeawayListSearch, newAddressObj?.postcode, 'new_address');
                    yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST, ...takeawayActionsData });
                }
                if (action.viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY || action.viewType === ADDRESS_FORM_TYPE.QC) {
                    yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATED_SEARCH_ADDRESS, payload: true });
                }
                if (action.viewType === ADDRESS_FORM_TYPE.QC) {
                    handleNavigation(SCREEN_OPTIONS.QUICK_CHECKOUT.route_name);
                }
                let storeId = yield select(selectStoreId);
                if (action.viewType !== ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY && isValidElement(storeId)) {
                    action.addressObj.flat = isValidNotEmptyString(action?.addressObj?.flat) ? action.addressObj?.flat : undefined;
                    yield* makeDeliveryLookupCall({
                        ...action,
                        deliveryFor: DELIVERY_FOR.ADDRESS,
                        addressId: response.resource_id,
                        postcode: action.addressObj?.postcode,
                        updateOrderType: isValidElement(action.updateOrderType) ? action.updateOrderType : true
                    });
                }
                if (action.isFromOrderType) {
                    let addressData = { ...action, addressId: response.resource_id, deliveryFor: 'address' };
                    if (action.viewType !== ADDRESS_FORM_TYPE.QC) yield updateOrderType(addressData);
                    let cartId = yield select(selectBasketID);
                    let userLoggedIn = yield select(selectHasUserLoggedIn);
                    if (isValidElement(cartId) && userLoggedIn) {
                        yield put({ type: BASKET_TYPE.UPDATE_BASKET, updateType: BASKET_UPDATE_TYPE.VIEW });
                    }
                    if (action.isFromOrderTypeModal) {
                        yield put({ type: ORDER_MANAGEMENT_TYPE.SHOW_HIDE_ORDER_TYPE, payload: true });
                    }
                } else if (!isValidElement(action?.isAutoSave)) {
                    showInfoMessage(LOCALIZATION_STRINGS.ADDRESS_ADDED_SUCCESS);
                }
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.ADDRESS_UPDATED_FAILED);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeUpdatePrimaryAddressCall(action) {
    try {
        const response = yield apiCall(AddressNetwork.makeUpdatePrimaryAddressCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: ADDRESS_TYPE.UPDATE_PRIMARY_ADDRESS_SUCCESS, id: response.id });
            yield fork(makeGetAddressCall);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeUpdateAddressCall(action) {
    try {
        if (!isValidElement(action.addressForLookup)) {
            //TODO it should not be null/undefined
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            return;
        }
        const locationLookupResponse = yield apiCall(AddressNetwork.getLocationLookupCall, {
            addressObj: { value: action.addressForLookup }
        });
        if (
            isValidElement(locationLookupResponse) &&
            locationLookupResponse.data.length > 0 &&
            isValidElement(locationLookupResponse.data[0])
        ) {
            let newAddressObj = {
                ...action.addressObj,
                ...extractLocation(locationLookupResponse.data[0])
            };
            const response = yield apiCall(AddressNetwork.makeUpdateAddressCall, { addressObj: newAddressObj, id: action.id });
            if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
                yield put({ type: ADDRESS_TYPE.RESET_MANUAL_ADDRESS });
                if (isValidNumber(action.popBackCount) && action.popBackCount > 1) {
                    action.navigation.pop(action.popBackCount);
                } else {
                    action.navigation.goBack();
                }

                if (action.viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY) {
                    let getOrderType = yield select(selectTAOrderType);
                    let takeawayActionsData = {
                        postCode: isValidElement(action?.addressObj?.postcode) ? action.addressObj.postcode : null,
                        searchByAddress: false,
                        orderType: getOrderType,
                        selectedAddress: isValidElement(action.addressObj) ? action.addressObj : null,
                        isSavedAddress: true
                    };
                    yield fork(logTakeawayListSearch, action?.addressObj?.postcode, 'update_address');
                    yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST, ...takeawayActionsData });
                }
                showInfoMessage(LOCALIZATION_STRINGS.ADDRESS_UPDATED_SUCCESS);
                yield fork(makeGetAddressCall);
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.ADDRESS_UPDATED_FAILED);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeDeleteAddressCall(action) {
    try {
        const response = yield apiCall(AddressNetwork.makeDeleteAddressCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            showInfoMessage(LOCALIZATION_STRINGS.DELETE_ADDRESS_SUCCESS_MSG);
            yield* makeGetAddressCall();
            isValidElement(action.navigation) && action.navigation.goBack();
            //TODO if needed the callback uncomment the below line
            // yield put({ type: ADDRESS_TYPE.DELETE_ADDRESS_SUCCESS, id: response.id });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeDeliveryLookupCall(action) {
    //TODO It's only for OrderType selection modal. Don't use this call for any other delivery lookup action
    try {
        yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: true });
        yield put({ type: BASKET_TYPE.SET_ORDER_TYPE_CHANGE_LOADER, value: true });
        const postcode = yield select(selectSearchedPostcode);
        const deliveryAddress = yield select(selectDeliveryAddress);
        let addressObj = {};
        if (isValidElement(action?.addressObj?.postcode)) {
            addressObj = action.addressObj;
        } else if (isValidElement(deliveryAddress?.postcode)) {
            const s3ConfigResponse = yield select(selectS3Response);
            const storeConfigResponse = yield select(selectStoreConfigResponse);
            addressObj = getAddressObj(s3ConfigResponse, storeConfigResponse?.host, deliveryAddress);
        } else if (isValidElement(postcode)) {
            addressObj.postcode = postcode;
        } else {
            //TODO in this case dev may did mistake in somewhere. Need to check and validate
            return;
        }
        action.addressObj = addressObj;
        const response = yield apiCall(AddressNetwork.makeDeliveryLookupCall, action);
        if (isValidElement(response) && !isValidElement(action.isAutoSave)) {
            if (!action.isFromQCscreen && action.deliveryFor === DELIVERY_FOR.ADDRESS) {
                showInfoMessage(LOCALIZATION_STRINGS.DELIVERY + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED.toLowerCase());
            }
            yield put({ type: ADDRESS_TYPE.DELIVERY_LOOKUP_SUCCESS, payload: response });
            if (action.updateOrderType) {
                yield fork(updateOrderType, action);
            }
            yield fork(makeUpdateBasketCall, { updateType: BASKET_UPDATE_TYPE.VIEW, allergyInfo: '' });
            const cartItems = yield select(selectCartItems);
            if (
                action.updateOrderType &&
                cartItems.length > 0 &&
                ((isValidElement(action.callOrderChangeApi) && action.callOrderChangeApi) || action.isFromQC)
            ) {
                yield put(makeChangeAction(ORDER_TYPE.DELIVERY, true));
            }
        } else {
            yield all([
                put({ type: ADDRESS_TYPE.DELIVERY_LOOKUP_FAILURE, payload: response }),
                put({ type: ADDRESS_TYPE.DELIVERY_FOR, payload: action.deliveryFor }),
                put({ type: ADDRESS_TYPE.UPDATE_INVALID_ADDRESS_ID, payload: action.addressId }),
                put({ type: BASKET_TYPE.SET_ORDER_TYPE_CHANGE_LOADER, value: false }),
                put({ type: BASKET_TYPE.BASKET_LOADER, payload: false })
            ]);
        }
    } catch (e) {
        yield all([
            put({ type: BASKET_TYPE.BASKET_LOADER, payload: false }),
            put({ type: ADDRESS_TYPE.DELIVERY_LOOKUP_FAILURE, payload: e }),
            put({ type: ADDRESS_TYPE.DELIVERY_FOR, payload: action.deliveryFor }),
            put({ type: ADDRESS_TYPE.UPDATE_INVALID_ADDRESS_ID, payload: action.addressId }),
            put({ type: BASKET_TYPE.SET_ORDER_TYPE_CHANGE_LOADER, value: false })
        ]);
    }
}

function* updateOrderType(action) {
    if (isValidString(action.deliveryFor)) {
        const ourRecommendation = yield select(getRecommendationResponse);

        yield all([
            put({
                type: ADDRESS_TYPE.UPDATE_SELECTED_ORDER_TYPE,
                payload: {
                    selectedOrderType: ORDER_TYPE.DELIVERY,
                    selectedPostcode: action.postcode,
                    selectedAddressId: action.addressId,
                    isBasketChanged: isBasketOrderTypeChanged()
                }
            }),
            put({ type: ADDRESS_TYPE.DELIVERY_FOR, payload: '', showMessage: action.showMessage })
        ]);

        if (isValidElement(action.showMessage) || action.showMessage) {
            if (action.deliveryFor === DELIVERY_FOR.POSTCODE) {
                showInfoMessage(action.postCode + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED.toLowerCase());
            } else if (action.deliveryFor === DELIVERY_FOR.LOCATION || action.deliveryFor === DELIVERY_FOR.ADDRESS) {
                showInfoMessage(action.selectedAddress + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED.toLowerCase());
            }
        }
        // update basket
        const cartItems = yield select(selectCartItems);
        if (isValidElement(cartItems) && cartItems.length > 0 && isValidElement(action.callOrderChangeApi) && action.callOrderChangeApi) {
            yield put(updateBasketAction(BASKET_UPDATE_TYPE.VIEW));
        }
        yield fork(filterMenu);
        yield fork(filterOurRecommendations, ourRecommendation);
    }
}

function* makeGetAddressFromLocationCall(action) {
    let currentLocation = yield select(currentAddressLocation);
    try {
        const response = yield apiCall(AddressNetwork.getLocationLookupCall, {
            lat: action.latitude,
            lng: action.longitude,
            addressObj: { value: action.address }
        });
        if (isValidElement(response) && response.data.length > 0 && isValidElement(response.data[0])) {
            yield put({ type: ADDRESS_TYPE.GET_ADDRESS_FROM_LOCATION_SUCCESS, payload: response.data[0] });
            if (action.updateCurrentLocation || !isValidElement(currentLocation)) {
                yield put({ type: ADDRESS_TYPE.UPDATE_CURRENT_LOCATION, payload: response.data[0] });
            }
            if (action.forSearchTA) {
                let addressData, s3ConfigResponse, getOrderType, takeawayActionObj;
                s3ConfigResponse = yield select(selectS3Response);
                getOrderType = yield select(selectTAOrderType);
                addressData = extractAddress(response.data[0], s3ConfigResponse);
                takeawayActionObj = {
                    postCode: isValidElement(addressData?.postCode) ? addressData.postCode : null,
                    searchByAddress: false,
                    orderType: getOrderType,
                    selectedAddress: addressData
                };
                handleGoBack();
                yield fork(logTakeawayListSearch, addressData?.postCode, 'address_location');
                yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST, ...takeawayActionObj });
            }
            if (action.isCallDeliveryLookup) {
                let postCode = getPostCode(response.data[0]);
                let fullAddress = isValidElement(response.data[0].formatted_address) && response.data[0].formatted_address;
                let selectDeliveryFor = isValidElement(action.screenName === ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS)
                    ? DELIVERY_FOR.ADDRESS
                    : DELIVERY_FOR.LOCATION;
                if (isValidElement(postCode)) {
                    yield* makeDeliveryLookupCall({
                        postcode: postCode,
                        deliveryFor: selectDeliveryFor,
                        selectedAddress: fullAddress,
                        screenName: action.screenName,
                        updateOrderType: true
                    });
                }
            }
        } else {
            yield put({ type: ADDRESS_TYPE.GET_ADDRESS_FROM_LAT_LONG_FAILURE });
        }
    } catch (e) {
        //nothing to handle
    }
}
function* getUserAddressFromBackground(action) {
    const { latitude, longitude } = action;
    let pendingOrder = yield select(getPendingOrder);
    let previousOrder = yield select(getPreviousOrder);
    const selectS3CongfigResponse = yield select(selectS3Response);
    const countryId = selectS3CongfigResponse?.country?.id;
    let recentOrderPostCode = getPostCodeFromRecentOrder(pendingOrder, previousOrder, countryId);
    const userSavedAddress = yield select(selectSavedAddress);
    try {
        if (!isValidElement(getLatestOrder(pendingOrder, previousOrder))) {
            yield* makeGetOrderListCall();
            pendingOrder = yield select(getPendingOrder);
            previousOrder = yield select(getPreviousOrder);
        }
        let response,
            postCode,
            addressResponse,
            userCurrentAddress,
            isLatLongAvailable = isValidElement(latitude) && isValidElement(longitude),
            orderData = getLatestOrder(pendingOrder, previousOrder),
            orderType = yield select(selectTAOrderType);
        if (isLatLongAvailable || isValidElement(orderData) || isValidElement(userSavedAddress)) {
            let isAppOpen = yield select(selectAppState);
            if (isLatLongAvailable) {
                response = yield apiCall(AddressNetwork.getLocationLookupCall, {
                    lat: action.latitude,
                    lng: action.longitude
                });
                addressResponse = isArrayNonEmpty(response?.data) && isValidElement(response.data[0]) && response.data[0];
                yield put({ type: ADDRESS_TYPE.GET_ADDRESS_FROM_LOCATION_SUCCESS, payload: response.data[0] });
                yield put({ type: ADDRESS_TYPE.UPDATE_CURRENT_LOCATION, payload: response.data[0] });
            }
            if (action.redirectTAList && isPendingOrderNotAvailable(pendingOrder)) {
                /*
                Fetch Address flow is based on 3 type of address
                1.user lasted deliver order address
                2.user saved address
                3.user current location if it's in ON
                 */
                userCurrentAddress = extractAddress(addressResponse, selectS3CongfigResponse);
                let fetchAddress = isValidElement(getLatestOrder(pendingOrder, previousOrder))
                    ? getLatestOrder(pendingOrder, previousOrder)
                    : isArrayNonEmpty(userSavedAddress?.data)
                    ? isValidElement(getDeliveryAddressSortByLatestUpdate(userSavedAddress.data)) &&
                      getDeliveryAddressSortByLatestUpdate(userSavedAddress.data)
                    : isValidElement(userCurrentAddress?.postCode) && userCurrentAddress;
                postCode = isValidElement(fetchAddress?.postcode)
                    ? fetchAddress?.postcode
                    : isValidElement(userCurrentAddress?.postCode)
                    ? extractAddress(addressResponse, selectS3CongfigResponse).postCode
                    : null;
                if (!isAppOpen && isValidElement(postCode) && ValidatePostCodeUK(postCode)) {
                    handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                }
                const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
                let minimumDistance = isValidElement(featureGateResponse?.toolTipVisbleDistance?.distanceByMeter)
                    ? featureGateResponse?.toolTipVisbleDistance?.distanceByMeter
                    : 50;
                yield fork(logTakeawayListSearch, postCode, 'auto_search');
                const isUserLoggedIn = yield select(selectHasUserLoggedIn);
                yield put({
                    type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST,
                    postCode: postCode,
                    searchByAddress: false,
                    orderType: orderType,
                    selectedAddress: fetchAddress,
                    isDifferentAddress:
                        isLatLongAvailable && isValidElement(fetchAddress) && isValidElement(userCurrentAddress)
                            ? isUserLoggedIn && isDifferentLatLongFromCurrentLocation(userCurrentAddress, fetchAddress, minimumDistance)
                            : null
                });
                yield put({
                    type: HOME_TYPE.POSTCODE_INPUT,
                    payload: isValidElement(fetchAddress?.postcode)
                        ? fetchAddress.postcode
                        : isValidElement(fetchAddress?.postCode)
                        ? fetchAddress.postCode
                        : isValidElement(orderData?.postcode)
                        ? orderData.postcode
                        : ''
                });
            } else if (!isPendingOrderNotAvailable(pendingOrder) && ValidatePostCodeUK(orderData?.postcode)) {
                yield put({ type: HOME_TYPE.POSTCODE_INPUT, payload: orderData.postcode });
            }
        } else if (isValidElement(orderData?.postcode) && ValidatePostCodeUK(orderData.postcode)) {
            yield put({ type: HOME_TYPE.POSTCODE_INPUT, payload: orderData.postcode });
        }
    } catch (e) {
        yield put({ type: HOME_TYPE.POSTCODE_INPUT, payload: recentOrderPostCode });
    }
}

function* checkDeliveryAddressAvailability(action) {
    const { deliveryAddress } = action;
    if (isValidElement(deliveryAddress)) {
        const s3ConfigResponse = select(selectS3Response);
        const storeConfigResponse = select(selectStoreConfigResponse);
        const addressObj = getAddressObj(s3ConfigResponse, storeConfigResponse?.host, deliveryAddress);
        yield put(
            deliveryLookupAction(addressObj, DELIVERY_FOR.ADDRESS, deliveryAddress.id, getFormattedAddress(deliveryAddress), false, true)
        );
    } else {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
}

function* makeSearchAutoCompletePostcodeCall(action) {
    try {
        if (isValidElement(action.fussySearchInput)) {
            const response = yield apiCall(AddressNetwork.getLocationLookupCall({ addressObj: { value: action.fussySearchInput } }));
            if (isValidElement(response)) {
                if (isCustomerApp()) {
                    yield put({
                        type: ADDRESS_TYPE.FUSSY_SEARCH_AUTOCOMPLETE_SUCCESS,
                        payload: response.data
                    });
                } else {
                    yield put({
                        type: ADDRESS_TYPE.FUSSY_SEARCH_AUTOCOMPLETE_SUCCESS,
                        payload: response.result
                    });
                }
            }
        }
    } catch (e) {
        //
    }
}
function* getSearchAddressByPlaceId(action) {
    try {
        const response = yield apiCall(AddressNetwork.getLocationLookupCall, action);
        yield put({ type: TYPES_CONFIG.UPDATE_GOOGLE_SESSION_TOKEN, googleSessionToken: randomSessionToken(16) });
        if (
            isValidElement(response?.data) &&
            response.data.length > 0 &&
            isValidElement(response.data[0]?.geometry?.location) &&
            isValidNumber(response.data[0].geometry.location.lat) &&
            isValidNumber(response.data[0].geometry.location.lng) &&
            isValidElement(response.data[0].address_components[0])
        ) {
            if (action.forSearchTA) {
                let addressData, s3ConfigResponse, getOrderType, takeawayActionObj, postcode;
                addressData = response.data[0].address_components[0];
                s3ConfigResponse = yield select(selectS3Response);
                getOrderType = yield select(selectTAOrderType);
                postcode =
                    isValidElement(extractAddress(response.data[0], s3ConfigResponse)?.postCode) &&
                    extractAddress(response.data[0], s3ConfigResponse)?.postCode;
                takeawayActionObj = {
                    postCode: postcode,
                    searchByAddress: false,
                    orderType: getOrderType,
                    selectedAddress: extractAddress(response.data[0], s3ConfigResponse, addressData.long_name),
                    searchAddress: response.data[0],
                    isSavedAddress: false
                };
                yield fork(logTakeawayListSearch, postcode, 'postcode');
                yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST, ...takeawayActionObj });
                handleGoBack();
            }
            yield put({ type: ADDRESS_TYPE.MANAGE_GET_ADDRESS_FROM_PLACE_ID_SUCCESS, payload: response.data[0] });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        yield put({ type: ADDRESS_TYPE.MANAGE_GET_ADDRESS_FROM_PLACE_ID_FAILURE });
        showErrorMessage(e);
    }
}

function* logTakeawayListSearch(search, method) {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
    const s3ConfigResponse = yield select(selectS3Response);
    Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
        country_code: s3ConfigResponse?.country?.iso,
        search: search,
        method: method
    });
}

function* getAutoCompletePlaces(action) {
    try {
        let config = yield select(selectEnvConfig);
        if (isValidSearchInput(action?.text)) {
            const response = yield apiCall(AddressNetwork.getAutocompletePlacesCall, { ...action, ...getHostAndFranchise(config) });
            if (isValidElement(response)) {
                const data = isValidElement(response.data)
                    ? safeArray(response.data)
                    : isValidElement(response.result)
                    ? response.result
                    : [];
                yield put({
                    type: ADDRESS_TYPE.MANAGE_ADDRESS_GET_AUTO_COMPLETE_SUCCESS,
                    payload: data.filter((item) => isValidString(item.place_id) && isValidString(item.description))
                });
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        } else {
            yield putResolve({ type: ADDRESS_TYPE.RESET_MANAGE_ADDRESS_GET_AUTO_COMPLETE });
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* AddressSaga() {
    yield all([
        takeLeading(ADDRESS_TYPE.GET_ADDRESS, makeGetAddressCall),
        takeLeading(ADDRESS_TYPE.POSTCODE_LOOKUP, makePostcodeLookupCall),
        takeLeading(ADDRESS_TYPE.POST_ADD_ADDRESS, makePostAddAddressCall),
        takeLeading(ADDRESS_TYPE.UPDATE_PRIMARY_ADDRESS, makeUpdatePrimaryAddressCall),
        takeLeading(ADDRESS_TYPE.UPDATE_ADDRESS, makeUpdateAddressCall),
        takeLeading(ADDRESS_TYPE.DELETE_ADDRESS, makeDeleteAddressCall),
        takeLatest(ADDRESS_TYPE.DELIVERY_LOOKUP, makeDeliveryLookupCall),
        takeLatest(ADDRESS_TYPE.GET_ADDRESS_FROM_LOCATION, makeGetAddressFromLocationCall),
        takeLeading(ADDRESS_TYPE.CHECK_DELIVERY_ADDRESS_AVAILABILITY, checkDeliveryAddressAvailability),
        takeLeading(ADDRESS_TYPE.UPDATE_SELECTED_ORDER_TYPE, updatePaymentMode),
        takeLatest(ADDRESS_TYPE.FUSSY_SEARCH_AUTOCOMPLETE, makeSearchAutoCompletePostcodeCall),
        takeLatest(ADDRESS_TYPE.MANAGE_ADDRESS_GET_AUTO_COMPLETE_PLACE, getAutoCompletePlaces),
        takeLeading(ADDRESS_TYPE.MANAGE_GET_ADDRESS_FROM_PLACE_ID, getSearchAddressByPlaceId),
        takeLatest(HOME_TYPE.GET_USER_ADDRESS_LOCATION_FROM_BACKGROUND, getUserAddressFromBackground)
    ]);
}

export default AddressSaga;
