import { BASKET_TYPE } from './BasketType';
import { BasketNetwork } from '../Network/BasketNetwork';
import {
    convertFloat,
    getPaymentProvider,
    isArrayNonEmpty,
    isCustomerApp,
    isNonCustomerApp,
    isValidElement,
    isValidString,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { all, call, debounce, delay, fork, put, putResolve, select, takeEvery, takeLatest } from 'redux-saga/effects';
import {
    getPaymentModeForBasket,
    getPaymentModeForBasketLookup,
    getResourceId,
    selectBasketID,
    selectBasketProgress,
    selectBasketRecommendationRefId,
    selectBasketSubTotal,
    selectBasketViewItems,
    selectBasketViewResponse,
    selectBOGOFResourceID,
    selectCart,
    selectCartItems,
    selectCollectionDiscount,
    selectContactFreeDelivery,
    selectCountryBaseFeatureGateResponse,
    selectCouponApplied,
    selectDriverTipValue,
    selectGlobalTipsStatusDisabled,
    selectIsBasketRecommendationEnabled,
    selectIsFromReOrderScreen,
    selectLastRepeatAddOnResourceID,
    selectMissingItemArray,
    selectNewBasketResponse,
    selectOnlineDiscount,
    selectOrderInstructions,
    selectPaymentMode,
    selectPreOrderASAPForAPI,
    selectPreOrderDate,
    selectPrimaryCardId,
    selectResourceID,
    selectResourceIdFromResponse,
    selectSavedCardDetails,
    selectSequence,
    selectStoreIDFromCartItems,
    selectTotalValue,
    selectUserPaymentMode,
    selectUserSelectedCardId
} from './BasketSelectors';
import {
    checkForPhoneNumberValidation,
    formAPIData,
    formBasketRecommendation,
    getTopTwoRecommendations,
    handleBestSellingAsRecommendations,
    isAdvancedDiscount,
    isBOGOFItem,
    isBOGOHItem,
    isNoOfferItem,
    isResourceIDMatch,
    isThirdPartyDriverAvailable,
    logCouponStatus,
    manipulateBasketResponse,
    showTipsUI
} from '../Utils/BasketHelper';
import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import { selectUserID, selectUserProfile } from '../../ProfileModule/Redux/ProfileSelectors';
import DeviceInfo from 'react-native-device-info';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { BASKET_ERROR_MESSAGE, BASKET_UPDATE_TYPE, BasketConstants } from '../Utils/BasketConstants';
import { selectOrderType, selectReorderResponse } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { selectAddressForDelivery, selectAddressState, selectPostCodeDelivery } from '../../AddressModule/Redux/AddressSelectors';
import {
    getAskPostCode,
    isTakeAwayOpenSelector,
    selectBasketRecommendationFeatureGate,
    selectCountryBaseFeatureGateSelector,
    selectCurrencyISO,
    selectedOrderType,
    selectHasUserLoggedIn,
    selectPushNotificationToken,
    selectS3Response,
    selectSearchedPostcode,
    selectStoreConfigResponse,
    selectStoreId,
    selectTakeawayListReducer,
    selectWalletBalance,
    selectEnvConfig,
    selectPostcodeRegex
} from 't2sbasemodule/Utils/AppSelectors';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { makeGetCardDetailsCall, makeGetProfileCall, makePostSendOTPCall } from '../../ProfileModule/Redux/ProfileSaga';
import { AUTH_TYPE } from '../../AuthModule/Redux/AuthType';
import { isExistingUser, isVerifyOtp } from 't2sbasemodule/UI/CustomUI/OTPModal/Utils/OTPHelper';
import { ProfileConstants, SAVED_CARD_FROM_SCREEN } from '../../ProfileModule/Utils/ProfileConstants';
import { ADDRESS_TYPE } from '../../AddressModule/Redux/AddressType';
import { PAYMENT_TYPE } from '../../QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { ORDER_MANAGEMENT_TYPE } from '../../OrderManagementModule/Redux/OrderManagementType';
import { showHideOrderTypeAction } from '../../OrderManagementModule/Redux/OrderManagementAction';
import { constructAddOnCategoryObject, hasAddOn } from '../../MenuModule/Utils/MenuHelpers';
import {
    addOrRemoveItemToBasketAction,
    editFromBasketAction,
    repeatAddOnAction,
    resetBasket,
    resetNewBasketResponse,
    resetReOrderAddOnItemAction,
    updateBasketId,
    updateLastAddOnItemAction
} from './BasketAction';
import { filterMenu, makeMenu, makeMenuAddons } from '../../MenuModule/Redux/MenuSaga';
import _ from 'lodash';
import { selectMenuAddOnGroupResponse, selectMenuAddonsLoadingResponse, selectMenuItems } from '../../MenuModule/Redux/MenuSelector';
import { makeGetOurRecommendations } from '../../HomeModule/Redux/HomeSaga';
import { selectFilteredRecommendation } from '../../HomeModule/Utils/HomeSelector';
import { getBaseURL } from '../../ConfiguratorModule/Utils/ConfiguratorHelper';
import { getCartItemsFromBasketResponse } from 'appmodules/MenuModule/Utils/MenuHelpers';
import { selectPrimaryAddress, selectTakeawayListState } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import * as Segment from '../../AnalyticsModule/Segment';
import { isUKApp } from '../../BaseModule/GlobalAppHelper';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS, SEGMENT_STRINGS } from '../../AnalyticsModule/SegmentConstants';
import { makeStoreConfigCall } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsSaga';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { getAddressObj } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { addressParamsObj, formattedAddressObj, isAlreadySavedAddress } from '../../AddressModule/Utils/AddressHelpers';
import { TAKEAWAY_SEARCH_LIST_TYPE } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListType';
import { makeGetAddressCall } from '../../AddressModule/Redux/AddressSaga';
import { ADDRESS_FORM_TYPE } from '../../AddressModule/Utils/AddressConstants';
import { logConfirmOrder } from '../../QuickCheckoutModule/Redux/QuickCheckoutSaga';
import { PROFILE_TYPE } from '../../ProfileModule/Redux/ProfileType';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';

function* makeCreateBasketCall(action) {
    try {
        yield put({ type: ADDRESS_TYPE.UPDATE_BASKET_ORDER_TYPE, payload: null });
        yield put({ type: BASKET_TYPE.CREATE_BASKET_PROGRESS, payload: true });
        const orderType = yield select(selectOrderType);
        const response = yield apiCall(BasketNetwork.makeCreateBasketCall, { orderType: orderType });
        const profileResponse = yield select(selectUserProfile);
        const storeResponse = yield select(selectStoreConfigResponse);
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        yield put({ type: BASKET_TYPE.UPDATE_PREORDER_DATE, payload: storeResponse });
        yield put({ type: BASKET_TYPE.CREATE_BASKET_SUCCESS, payload: response, storeResponse: storeResponse });
        Segment.trackEventNonInteractiveEvent(featureGateResponse, SEGMENT_EVENTS.BASKET_CREATION, { order_id: response.resource_id });
        yield fork(updateSearchedDeliveryAddress);
        yield call(makeAddOrRemoveItemToBasketCall, action);
        yield put({ type: BASKET_TYPE.CREATE_BASKET_PROGRESS, payload: false });
        yield put({ type: PROFILE_TYPE.RESET_PBL });
        let provider = getPaymentProvider(storeResponse?.payment_provider);
        if (isValidElement(profileResponse)) {
            yield fork(makeGetProfileCall);
            yield fork(makeGetCardDetailsCall, { provider, fromScreen: SAVED_CARD_FROM_SCREEN.CART });
            yield fork(updatePaymentMode);
        }
    } catch (e) {
        showErrorMessage(e);
        yield put({ type: BASKET_TYPE.CREATE_BASKET_PROGRESS, payload: false });
        yield put(resetBasket());
    }
}

/**
 * This is for updating the delivery address of the user based on dashboard search
 */
export function* updateSearchedDeliveryAddress() {
    const takeawayListState = yield select(selectTakeawayListState);
    const selectedAddress = takeawayListState.selectedAddress;
    const isSavedAddress = takeawayListState.isSavedAddress;
    const s3ConfigResponse = yield select(selectS3Response);
    const postCodeRegex = yield select(selectPostcodeRegex);
    const orderType = yield select(selectOrderType);
    const addressState = yield select(selectAddressState);
    const { addressResponse } = addressState;
    const { data } = isValidElement(addressResponse) && addressResponse;
    let countryId, isUKCountry, savedSelectedAddress, isDeliveryOrder;
    countryId = s3ConfigResponse?.country?.id;
    isDeliveryOrder = orderType === ORDER_TYPE.DELIVERY;
    isUKCountry = isUKApp(countryId);
    if (isUKCountry && isArrayNonEmpty(data)) {
        savedSelectedAddress = data.find((item) => isAlreadySavedAddress(item, selectedAddress));
    }
    if (
        isValidElement(isSavedAddress) &&
        !isSavedAddress &&
        !isValidElement(savedSelectedAddress) &&
        isValidString(selectedAddress?.doorNo)
    ) {
        let addressObj = addressParamsObj({ ...selectedAddress, togglePrimaryAddressButton: !isArrayNonEmpty(data) }, s3ConfigResponse),
            formattedAddress = formattedAddressObj(addressObj, isUKCountry, postCodeRegex),
            addressActionObj;
        addressActionObj = {
            navigation: null,
            addressObj,
            addressForLookup: formattedAddress,
            popBackCount: null,
            isFromOrderType: false,
            isFromOrderTypeModal: false,
            isFromQC: false,
            viewType: null,
            updateOrderType: orderType === ORDER_TYPE.DELIVERY,
            isAutoSave: true
        };
        yield put({ type: ADDRESS_TYPE.POST_ADD_ADDRESS, ...addressActionObj });
    } else if (isValidElement(savedSelectedAddress) && isDeliveryOrder) {
        yield put({ type: ADDRESS_TYPE.UPDATE_SEARCHED_ADDRESS, address: savedSelectedAddress });
        yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.UPDATED_SEARCH_ADDRESS, payload: true });
    } else if (isValidElement(selectedAddress) && isDeliveryOrder) {
        yield put({ type: ADDRESS_TYPE.UPDATE_SEARCHED_ADDRESS, address: selectedAddress });
    }
}
/**
 * This is for resetting the delivery address of the user based on confirm order, clear basket, app relaunch and country config changes
 */
export function* updatePrimaryAddress() {
    const primaryAddress = yield select(selectPrimaryAddress);
    const orderType = yield select(selectOrderType);
    if (isValidElement(primaryAddress) && orderType === ORDER_TYPE.DELIVERY) {
        yield put({ type: ADDRESS_TYPE.UPDATE_SEARCHED_ADDRESS, address: primaryAddress });
    }
}

export function* updatePaymentMode() {
    const storeResponse = yield select(selectStoreConfigResponse);
    const walletBalance = yield select(selectWalletBalance);
    const totalAmount = yield select(selectTotalValue);
    let userPaymentMode = yield select(selectUserPaymentMode);
    const savedCardDetails = yield select(selectSavedCardDetails);
    const userSelectedCardId = yield select(selectUserSelectedCardId);
    const primaryCardId = yield select(selectPrimaryCardId);
    const countryBaseFeatureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
    const basketData = yield select(selectBasketViewResponse);
    const orderType = yield select(selectOrderType);

    if (
        orderType === ORDER_TYPE.COLLECTION &&
        (userPaymentMode === PAYMENT_TYPE.CARD_FROM_LIST || userPaymentMode === PAYMENT_TYPE.PARTIAL_PAYMENT)
    ) {
        userPaymentMode = null;
    } else if (
        orderType === ORDER_TYPE.DELIVERY &&
        isValidElement(savedCardDetails) &&
        savedCardDetails.length > 0 &&
        userPaymentMode === PAYMENT_TYPE.CARD
    ) {
        userPaymentMode = null;
    }

    // if (isValidElement(savedCardDetails) && savedCardDetails.length > 0 && userPaymentMode === PAYMENT_TYPE.CARD) {
    //     userPaymentMode = null;
    // }
    //RESET the userPaymentMode w
    yield put({
        type: BASKET_TYPE.UPDATE_USER_PAYMENT_MODE,
        user_payment_mode: userPaymentMode
    });

    if (!isValidElement(userSelectedCardId)) {
        yield put({
            type: BASKET_TYPE.UPDATE_USER_SELECTED_CARD_ID,
            user_selected_card_id: primaryCardId
        });
    }
    yield put({
        type: BASKET_TYPE.UPDATE_PAYMENT_MODE,
        storeResponse,
        walletBalance,
        totalAmount,
        userPaymentMode,
        savedCardDetails,
        countryBaseFeatureGateResponse,
        basketData,
        selectedOrderType: orderType
    });
}

function* clearBasketNavigationBack(action) {
    let currentRoute = NavigationService.navigationRef.current.getCurrentRoute();
    if (isValidElement(currentRoute) && currentRoute.name === SCREEN_OPTIONS.QUICK_CHECKOUT.route_name) {
        NavigationService.goBack();
    }
    const cart_ID = yield select(selectBasketID);
    yield putResolve({
        type: BASKET_TYPE.RESET_BASKET
    });
    if (isValidElement(cart_ID)) {
        showErrorMessage(LOCALIZATION_STRINGS.APP_CLEAR_BASKET);
        NavigationService.goBack();
    }
}

function* makeAddOrRemoveItemToBasketCall(action) {
    let resourceID;
    try {
        if (isValidElement(action) && action.fromBasket) {
            yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: true });
        }
        if (action.fromBasketRecommendation) {
            action.recommendation_ref_id = yield select(selectBasketRecommendationRefId);
            action.recommendation_id = action.id;
        }
        const cartID = yield select(selectBasketID);
        const { offer } = action.item;
        let response;
        if (isValidElement(cartID)) {
            yield put({ type: BASKET_TYPE.START_CART_LOADING });
            const basketResponse = yield select(selectBasketViewResponse);
            const resourceIDs = yield select(getResourceId);
            const isCouponApplied = yield select(selectCouponApplied);
            if (
                isValidElement(basketResponse) &&
                isValidElement(basketResponse.item) &&
                basketResponse.item.length === 1 &&
                action.fromBasket &&
                action.quantity === 0 &&
                isResourceIDMatch(action, resourceIDs) &&
                action.quantityType === ADD_BUTTON_CONSTANT.MINUS
            ) {
                yield logAddRemoveItem(action, basketResponse?.total?.value);
                yield call(clearBasketNavigationBack, action);
                return;
            }
            if (isNoOfferItem(offer) && !action.fromFreeItems) {
                if (isValidElement(action.addOns)) {
                    response = yield makePostRequest(action, cartID);
                } else {
                    if (action.fromBasket) {
                        resourceID = action.item.id;
                    } else {
                        if (isValidElement(action.repeatAddOnType)) {
                            resourceID = yield select(selectLastRepeatAddOnResourceID, action.id);
                            const resourceIDFromBasketResponse = yield select(selectResourceIdFromResponse, resourceID);
                            action = { ...action, quantity: resourceIDFromBasketResponse.quantity + 1 };
                        } else {
                            resourceID = yield select(selectResourceID, action.id);
                        }
                    }
                    //remove local resource ID
                    if (action.quantity === 0) {
                        yield put({
                            type: BASKET_TYPE.REMOVE_RESOURCE_ID_ACTION,
                            payload: { action, resourceID }
                        });
                        // if (action.fromBasket) {
                        //     yield* basketInstantSoftDelete(action.item);
                        // }
                    }
                    if (isValidElement(resourceID)) {
                        response = yield makeUpdateQuantityRequest(action, cartID, resourceID);
                    } else {
                        if (action.quantity !== 0) response = yield makePostRequest(action, cartID);
                    }
                }
            } else if (isBOGOHItem(offer) || isBOGOFItem(offer) || action.fromFreeItems) {
                if (action.quantityType === ADD_BUTTON_CONSTANT.MINUS) {
                    if (action.fromBasket) {
                        resourceID = action.item.id;
                        // yield basketInstantSoftDelete(action.item);
                    } else {
                        resourceID = yield select(selectBOGOFResourceID, action.item);
                    }
                    yield put({
                        type: BASKET_TYPE.REMOVE_RESOURCE_ID_ACTION,
                        payload: { action, resourceID }
                    });
                    response = yield makeUpdateQuantityRequest({ ...action, quantity: 0 }, cartID, resourceID);
                } else {
                    response = yield makePostRequest(action, cartID);
                }
            }
            if (isValidElement(response) && isValidElement(response.success)) {
                //if the basket.total is not valid, the basket is empty, so it falls on below condition
                if (isValidElement(response.basket.total) && isValidElement(response.basket.total.value))
                    yield logAddRemoveItem(action, response.basket.total.value);
                if (
                    (action.fromBasket && !isValidElement(response.basket)) ||
                    (action.fromBasket && isValidElement(response.basket) && !isValidElement(response.basket.item))
                ) {
                    yield call(clearBasketNavigationBack, action);
                    return;
                } else if (!action.fromFreeItems && isValidElement(response.resource_id)) {
                    yield put({
                        type: BASKET_TYPE.ADD_REMOVE_ITEM_TO_BASKET_SUCCESS,
                        payload: {
                            resourceID: response.resource_id,
                            id: action.id,
                            offer: offer,
                            addOns: isValidElement(action.addOns) ? action.addOns : [],
                            item: action.item
                        }
                    });
                }

                if (isValidElement(response.basket) && isValidElement(response.basket.item)) {
                    const basket = manipulateBasketResponse(response);
                    yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
                    if (isValidElement(response.basket.item) && action.fromBasket)
                        yield put({ type: BASKET_TYPE.UPDATE_CART_ITEMS, basketItems: response.basket.item });
                }
                if (
                    isValidElement(response.basket) &&
                    ((isValidElement(response.basket.data) && response.basket.data.length === 0) ||
                        (isValidElement(response.basket.item) &&
                            (response.basket.item.length === 0 ||
                                (response.basket.item.length === 1 && response.basket.item[0].free === true))) ||
                        !isValidElement(response.basket.item))
                ) {
                    yield fork(makeDeleteCartCall, action);
                    yield logAddRemoveItem(action, 0);
                    yield put({ type: BASKET_TYPE.RESET_BASKET });
                    if (action.fromBasket) {
                        let currentRoute = NavigationService.navigationRef.current.getCurrentRoute();
                        if (isValidElement(currentRoute) && currentRoute.name === SCREEN_OPTIONS.QUICK_CHECKOUT.route_name) {
                            NavigationService.goBack();
                        }
                        NavigationService.goBack();
                        showErrorMessage(LOCALIZATION_STRINGS.APP_CLEAR_BASKET);
                    }
                }

                if (
                    (isValidElement(action) && action.fromBasketRecommendation) ||
                    (isValidElement(action) && action.fromBasket && action.quantity === 0)
                ) {
                    yield fork(getBasketRecommendations);
                }

                if (
                    response?.basket?.coupon_code === '' &&
                    isValidString(isCouponApplied) &&
                    action.quantityType === ADD_BUTTON_CONSTANT.MINUS
                ) {
                    const storeConfigResponse = yield select(selectStoreConfigResponse);
                    const storeId =
                        isValidElement(storeConfigResponse) && isValidElement(storeConfigResponse.id) ? storeConfigResponse.id : undefined;
                    if (
                        (isValidElement(response?.basket?.online_discount) || isValidElement(response?.basket?.collection_discount)) &&
                        response?.basket?.item?.length > 0
                    ) {
                        yield put({
                            type: BASKET_TYPE.LOOKUP_COUPON,
                            coupon: isCouponApplied,
                            storeID: storeId,
                            isAdvanceCoupon: isAdvancedDiscount(storeConfigResponse)
                        });
                    }
                }
            }
            if (action.fromFreeItems) {
                yield put({ type: BASKET_TYPE.UPDATE_FREE_ITEM_CLICKED });
            }
        } else {
            //create basket & add item
            yield* makeCreateBasketCall(action);
        }
        if (isValidElement(action) && action.fromBasket) {
            yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
        }
        yield put({ type: BASKET_TYPE.STOP_CART_LOADING });
        const progress = yield select(selectBasketProgress);
        if (progress) {
            yield put({ type: BASKET_TYPE.CREATE_BASKET_PROGRESS, payload: false });
        }
        yield fork(updatePaymentMode);
    } catch (e) {
        yield put({ type: BASKET_TYPE.STOP_CART_LOADING });
        const progress = yield select(selectBasketProgress);
        if (progress) {
            yield put({ type: BASKET_TYPE.CREATE_BASKET_PROGRESS, payload: false });
        }
        if (action.quantityType === ADD_BUTTON_CONSTANT.MINUS) {
            yield put({
                type: BASKET_TYPE.HANDLE_NETWORK_ERROR,
                payload: { action, resourceID, id: action.id }
            });
        }
        if (e.message === BASKET_ERROR_MESSAGE.INVALID_CART) {
            yield put({ type: BASKET_TYPE.RESET_BASKET });
        } else if (e.message === BASKET_ERROR_MESSAGE.INVALID_ITEM || e.message === BASKET_ERROR_MESSAGE.EXCLUDE_FREE) {
            const cartItems = yield select(selectCartItems);
            showErrorMessage(LOCALIZATION_STRINGS.INVALID_ITEM);
            if (cartItems?.length === 1) {
                yield put({ type: BASKET_TYPE.RESET_BASKET });
                handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name);
            }
            yield put({
                type: BASKET_TYPE.ADD_BUTTON_TAPPED_ACTION,
                id: action.id,
                item: action.item,
                qty: 1,
                incrementType: ADD_BUTTON_CONSTANT.MINUS,
                isFromBasketScreen: action.fromBasket,
                fromHome: false,
                fromBasketRecommendation: action.fromBasketRecommendation,
                isInvalidItem: true
            });
        } else if (e.message !== BASKET_ERROR_MESSAGE.INVALID_ORDER_ITEM) {
            showErrorMessage(e);
        }
        if (isValidElement(action) && action.fromBasket) {
            yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
        }
    }
}

function* logAddRemoveItem(action, totalAmount) {
    const store_id = yield select(selectStoreId);
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    const currency = yield select(selectCurrencyISO);
    const s3ConfigResponse = yield select(selectS3Response);
    const cartID = yield select(selectBasketID);
    const isUserLoggedIn = yield select(selectHasUserLoggedIn);
    const storeConfigResponse = yield select(selectStoreConfigResponse);
    let profile = null;
    if (isUserLoggedIn) {
        profile = yield select(selectUserProfile);
    }
    let { item, quantity, quantityType } = action;
    let total = convertFloat(totalAmount);
    let obj = {
        order_id: cartID,
        // addon: isValidElement(action.addOns) ? action.addOns : [], not required as per PO for moEngage
        item_name: isValidElement(item) ? item.name : '',
        item_qty: safeIntValue(quantity),
        takeaway: isValidElement(storeConfigResponse) ? storeConfigResponse.name : '',
        item_price: isValidElement(item) ? convertFloat(item.price) : 0,
        user_id: isValidElement(profile) ? profile.id : null,
        country_code: s3ConfigResponse?.country?.iso,
        source: SEGMENT_STRINGS.TAKEAWAY_LIST,
        value: isValidElement(total) ? total : 0, //duplicated for firebase analytics
        total_price: isValidElement(total) ? total : 0,
        discount_types: isValidElement(item) ? item.offer : SEGMENT_CONSTANTS.NONE,
        currency: currency,
        store_id: store_id
    };
    let eventName = SEGMENT_EVENTS.ADD_ITEM;
    if (ADD_BUTTON_CONSTANT.MINUS === quantityType) {
        eventName = SEGMENT_EVENTS.REMOVE_ITEM;
        obj.qty_remaining = safeIntValue(quantity);
        obj.qty_removed = safeIntValue(1);
    }
    Segment.trackEvent(featureGateResponse, eventName, obj);
}

function* makeAddButtonTappedAction(action) {
    const {
        item,
        id,
        qty,
        incrementType,
        isFromBasketScreen,
        fromHome,
        isFromReOrder,
        fromBasketRecommendation,
        isInvalidItem,
        isFromNewMenu
    } = action;
    const basketIdProgress = yield select(selectBasketProgress);
    if (basketIdProgress) return;
    const cartItems = yield select(selectCartItems);
    if (incrementType === ADD_BUTTON_CONSTANT.MINUS && !isFromBasketScreen && isInvalidItem) {
        if (cartItems?.length <= 1) {
            yield put({ type: BASKET_TYPE.RESET_BASKET });
            return;
        } else {
            cartItems.find((cartItem, index) => {
                if (cartItem?.id === action?.id) {
                    cartItems?.splice(index, 1);
                }
            });
            yield put({ type: BASKET_TYPE.UPDATE_CART_ITEMS_ON_FOCUS, basketItems: cartItems });
            return;
        }
    }
    const askPostCode = yield select(getAskPostCode);
    const selectedOrderType = yield select(selectOrderType);
    const menuAddOnGroupResponse = yield select(selectMenuAddOnGroupResponse);
    const isTakeawayOpen = yield select(isTakeAwayOpenSelector);
    const resIDs = yield select(getResourceId);
    const isMenuAddonsLoading = yield select(selectMenuAddonsLoadingResponse);

    //---------Ask for postcode----------//
    if (isCustomerApp() && isTakeawayOpen && askPostCode === 1 && !isValidElement(selectedOrderType) && cartItems.length === 0) {
        yield put(showHideOrderTypeAction(true));
        return;
    }
    if (fromBasketRecommendation) {
        if (hasAddOn(action.item)) {
            let addOnCategoryGroup = constructAddOnCategoryObject(item.item_addon_cat);
            if (isValidElement(addOnCategoryGroup)) {
                NavigationService.navigate(SCREEN_OPTIONS.RECOMMENDATIONS_ADDON.route_name, {
                    addOnCategoryId: item.item_addon_cat,
                    name: item.name,
                    itemId: item.id,
                    addOnCategoryGroup,
                    selectedItem: item,
                    quantity: qty,
                    fromHome,
                    isFromReOrder: isFromReOrder,
                    isFromBasketRecommendation: true
                });
            } else {
                yield put(
                    addOrRemoveItemToBasketAction(
                        id,
                        qty,
                        incrementType,
                        item,
                        isFromBasketScreen,
                        undefined,
                        undefined,
                        false,
                        fromBasketRecommendation
                    )
                );
            }
        } else {
            // yield put(removeBasketRecommendationItem(id)); //remove item locally
            yield put(
                addOrRemoveItemToBasketAction(
                    id,
                    qty,
                    incrementType,
                    item,
                    isFromBasketScreen,
                    undefined,
                    undefined,
                    false,
                    fromBasketRecommendation
                )
            );
        }
        return;
    }

    if (!isFromBasketScreen && !isValidElement(menuAddOnGroupResponse) && !isMenuAddonsLoading) {
        yield* makeMenuAddons();
        //---------Add-on items----------//
    } else if (hasAddOn(action.item)) {
        if (incrementType === ADD_BUTTON_CONSTANT.ADD) {
            if (!isFromBasketScreen) {
                //---------re-order addon flow----------//
                if (isValidElement(item) && isValidElement(item.reorderAddons) && item.reorderAddons.length > 0) {
                    yield put(updateLastAddOnItemAction(qty, id, item.item_addon_cat, item.reorderAddons, item));
                    yield put(repeatAddOnAction(true));
                } else {
                    yield put(resetReOrderAddOnItemAction());
                    //---------Repeat add on----------//
                    const existingItem = cartItems?.find((data) => data?.id === id);
                    if (existingItem) {
                        const addOnCategoryGroup = constructAddOnCategoryObject(item.item_addon_cat);
                        //This check is to handle "AddOn Group is Valid and has no addons"
                        if (isValidElement(addOnCategoryGroup)) {
                            yield put(repeatAddOnAction(true));
                            yield put(updateLastAddOnItemAction(qty, id, item.item_addon_cat));
                        } else {
                            yield handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item);
                        }
                    } else {
                        //---------Add on Navigation----------//
                        if (isValidElement(item)) {
                            NavigationService.navigate(SCREEN_OPTIONS.MENU_ADD_ON.route_name, {
                                screen: SCREEN_OPTIONS.MENU_ADD_ON.route_name,
                                params: {
                                    addOnCategoryId: item.item_addon_cat,
                                    name: item.name,
                                    itemId: item.id,
                                    selectedItem: item,
                                    quantity: qty,
                                    fromHome,
                                    isFromReOrder: isFromReOrder,
                                    isFromNewMenu: isFromNewMenu
                                }
                            });
                        }
                        // } else {
                        //     yield handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item);
                        // }
                    }
                }
                //---------If action is from basket screen and if the item is BOGOF or BOGOH, we need to add as anew item along with with addons----------//
            } else if (isFromBasketScreen && (isBOGOFItem(item.offer) || isBOGOHItem(item.offer))) {
                const data = resIDs.find((element) => element.resourceID === item.id);
                if (data) {
                    yield handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item, data.addOns);
                }
            } else if (isFromBasketScreen && isNoOfferItem(item.offer)) {
                yield handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item);
            }
        } else {
            /**
             * If we remove add-on menu item from all screens except basket screen,
             * then we show an alert to user to remove from the basket
             */
            const sameItems = resIDs.filter((element) => element.id === id && element.addOns.length > 0);
            if (sameItems.length > 1 && !isFromBasketScreen) {
                yield put(editFromBasketAction(true));
            } else {
                yield handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item);
            }
        }
    } else {
        yield handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item);
    }
}

function* handleAddOrRemoveItemToBasket(isFromBasketScreen, id, qty, incrementType, item, addOns) {
    if (isValidElement(addOns)) {
        yield put(addOrRemoveItemToBasketAction(id, qty, incrementType, item, isFromBasketScreen, addOns));
    } else {
        yield put(addOrRemoveItemToBasketAction(id, qty, incrementType, item, isFromBasketScreen));
    }
}

// function* makeViewBasketCall() {
//     try {
//         const cartID = yield select(selectBasketID);
//         if (isValidElement(cartID)) {
//             const response = yield call(BasketNetwork.makeViewBasketCall, cartID);
//             if (isValidElement(response)) {
//                 yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: response });
//             }
//         } else {
//             showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
//         }
//     } catch (e) {
//         showErrorMessage(e);
//     }
// }

function* getParamsForFetchBasket() {
    const payment_mode = yield select(getPaymentModeForBasket);
    return { basket: true, payment_mode };
}

export function* basketUpdateObject(action) {
    const userID = yield select(selectUserID);
    const orderType = yield select(selectOrderType);
    const postCode = yield select(selectPostCodeDelivery);
    const preOrderDate = yield select(selectPreOrderDate);
    let deliveryAddress = yield select(selectAddressForDelivery);
    const contactFreeDelivery = yield select(selectContactFreeDelivery);
    const profileResponse = yield select(selectUserProfile);
    const paymentMode = yield select(selectPaymentMode);
    const deviceName = yield DeviceInfo.getDeviceName();
    const getBasket = yield getParamsForFetchBasket();
    const pushNotificationToken = yield select(selectPushNotificationToken);
    const orderComments = isValidString(action.allergyInfo) ? action.allergyInfo : yield select(selectOrderInstructions);
    const preOrderASAP = yield select(selectPreOrderASAPForAPI);

    const storeResponse = yield select(selectStoreConfigResponse);
    const isThirdPartyAvailable = isThirdPartyDriverAvailable(storeResponse?.assign_driver_through);
    const driveTipValue = yield select(selectDriverTipValue);
    const isPblOrder = isValidElement(action?.isPblOrder) ? action?.isPblOrder : false;

    let driver_tip;
    let tipsConfigStatusDisabled = yield select((state) => selectGlobalTipsStatusDisabled(state, orderType));

    if (!isValidElement(deliveryAddress) && !isValidElement(action.isPblOrder)) {
        // if user doesnot have deliveryAddress set, then set searched lat, lng and postcode
        const takeawayListReducer = yield select(selectTakeawayListReducer);
        if (isValidElement(takeawayListReducer?.listDetails?.location?.postcode)) {
            const { postcode, lat, long } = takeawayListReducer.listDetails?.location;
            deliveryAddress = {
                postcode: isValidElement(postcode) ? postcode : undefined,
                latitude: isValidElement(lat) ? lat : undefined,
                longitude: isValidElement(long) ? long : undefined
            };
        } else {
            // send store postcode to api
            const postcode = yield select(selectSearchedPostcode);
            const storeResponse = yield select(selectStoreConfigResponse);
            deliveryAddress = {
                postcode: isValidElement(storeResponse?.postcode) ? storeResponse.postcode : isValidElement(postcode) ? postcode : undefined
            };
        }
    } else {
        if (!isValidElement(action.isPblOrder)) {
            const s3ConfigResponse = yield select(selectS3Response);
            const storeConfigResponse = yield select(selectStoreConfigResponse);
            deliveryAddress = getAddressObj(s3ConfigResponse, storeConfigResponse?.host, deliveryAddress);
        }
    }
    if (isValidString(driveTipValue) && tipsConfigStatusDisabled) {
        driver_tip = 0.0;
        yield put({ type: BASKET_TYPE.SELECTED_DRIVER_TIPS_ITEM, payload: { item: null, itemIndex: null } });
    } else {
        driver_tip =
            isValidElement(driveTipValue?.percent) && driveTipValue.percent > 0
                ? driveTipValue.percent + '%'
                : isValidElement(driveTipValue?.value) && parseFloat(driveTipValue?.value) > 0
                ? driveTipValue?.value
                : '0.0';
    }
    let object = {
        userID,
        deviceName,
        orderType,
        postCode,
        preOrderDate,
        deliveryAddress,
        contactFreeDelivery,
        profileResponse,
        pushNotificationToken,
        orderComments,
        paymentMode,
        preOrderASAP,
        isThirdPartyAvailable,
        driver_tip
    };

    return formAPIData({ action, object, getBasket, isPblOrder });
}

export function* makeUpdateBasketCall(action) {
    try {
        const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
        yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: true });
        let cartID;
        if (isValidElement(action.newBasketId)) {
            yield putResolve(updateBasketId(action.newBasketId));
            cartID = action.newBasketId;
        } else {
            cartID = yield select(selectBasketID);
        }
        const data = yield basketUpdateObject(action);
        if (isValidElement(data)) {
            const response = yield apiCall(BasketNetwork.makeUpdateBasketCall, { data, cartID });
            if (isValidElement(response) && isValidElement(response.basket)) {
                const basket = manipulateBasketResponse(response);
                let basketCoupon = response.basket.coupon;
                yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
                yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
                yield updateBasketWithNewBasketResponse(action, basket); //based on the order type change API
                const fromReOrderScreen = yield select(selectIsFromReOrderScreen);
                if (isValidElement(action.coupon) && isValidElement(basketCoupon)) {
                    logCouponStatus(featureGateResponse, SEGMENT_EVENTS.COUPON_APPLIED, {
                        coupon: response.basket.coupon_code,
                        coupon_value: basketCoupon.value,
                        coupon_label: basketCoupon.label,
                        storeId: action?.storeId
                    });
                }
                if (
                    fromReOrderScreen &&
                    action.updateType === BASKET_UPDATE_TYPE.VIEW &&
                    isValidElement(basket.item) &&
                    basket.item.length > 0
                ) {
                    const reOrderResponse = yield select(selectReorderResponse);
                    yield put({
                        type: BASKET_TYPE.UPDATE_CART_FROM_RE_ORDER,
                        payload: basket.item,
                        addOns:
                            isValidElement(reOrderResponse) && isValidElement(reOrderResponse.addons) && reOrderResponse.addons.length > 0
                                ? reOrderResponse.addons
                                : []
                    });
                    yield put({ type: BASKET_TYPE.FROM_RE_ORDER_ACTION, payload: false });
                    yield fork(getBasketRecommendations);
                    yield logConfirmOrder({ isFromBeginCheckout: true, fromReorder: true });
                }
                yield fork(updatePaymentMode);
            } else {
                yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
                yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
                if (isValidElement(action.showMessage) || action.showMessage) {
                    showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
                }
            }
            if (action.updateType === BASKET_UPDATE_TYPE.VIEW) {
                let storeConfig = yield select(selectStoreConfigResponse);
                if (isValidElement(storeConfig) && !isValidElement(storeConfig.phone)) yield fork(makeStoreConfigCall);
            }
        } else {
            yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
        }
    } catch (e) {
        yield put({ type: BASKET_TYPE.FETCHING_CART_RESPONSE, isCartFetching: false });
        yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
        if (isValidElement(action.showMessage) || action.showMessage) {
            showErrorMessage(e);
        }
        checkForPhoneNumberValidation(e);
    }
}

export function* makeLookupLoyaltyPointsCall() {
    try {
        if (isCustomerApp()) {
            const response = yield apiCall(BasketNetwork.makeLookupLoyaltyPointsCall);
            if (isValidElement(response)) {
                yield put({ type: BASKET_TYPE.LOOKUP_LOYALTY_POINTS_SUCCESS, payload: response });
            }
        }
    } catch (e) {
        //TODO: no need to handle
    }
}
export function* makeLookupLoyaltyTransactionsCall() {
    try {
        if (isCustomerApp()) {
            const response = yield apiCall(BasketNetwork.makeLookupLoyaltyTransactionsCall);
            if (isValidElement(response) && isValidElement(response.data) && response.outcome === T2SBaseConstants.SUCCESS) {
                yield put({ type: BASKET_TYPE.GET_LOYALTY_TRANSACTIONS_SUCCESS, payload: response.data });
            }
        }
    } catch (e) {
        //TODO: no need to handle
    }
}

function* makeLookupCouponCall(action) {
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);

    try {
        let coupon = action.coupon;
        let payment_mode = yield select(getPaymentModeForBasketLookup);
        let order_type = yield select(selectedOrderType);
        let subTotal = yield select(selectBasketSubTotal);
        let online_discount = yield select(selectOnlineDiscount);
        let collection_discount = yield select(selectCollectionDiscount);

        let discount = action.isAdvanceCoupon
            ? online_discount?.value
            : order_type === ORDER_TYPE.DELIVERY
            ? online_discount?.value
            : parseFloat(collection_discount?.value) + parseFloat(online_discount?.value);

        const storeID = isValidElement(action?.storeID) ? action.storeID : yield select(selectStoreId);
        const response = yield apiCall(BasketNetwork.makeLookupCouponCall, {
            coupon: coupon,
            platform: BasketConstants.COUPON_PLATFORM,
            payment_mode: payment_mode,
            storeID,
            service_type: order_type,
            subTotal,
            discount
        });
        if (isValidElement(response)) {
            yield put({ type: BASKET_TYPE.LOOKUP_COUPON_SUCCESS, payload: { ...response, coupon } });
            yield fork(makeUpdateBasketCall, {
                type: BASKET_TYPE.UPDATE_BASKET,
                updateType: BASKET_UPDATE_TYPE.COUPON,
                coupon: coupon,
                storeId: storeID
            });
            if (discount > 0 && response.message !== BasketConstants.COUPON_AVAILABLE) {
                showInfoMessage(response.message);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        if (isValidElement(e) && isValidElement(e.message)) {
            yield put({ type: BASKET_TYPE.LOOKUP_COUPON_FAILED, payload: e });
            logCouponStatus(featureGateResponse, SEGMENT_EVENTS.COUPON_NOT_APPLIED, {
                coupon: action.coupon,
                storeId: isValidElement(action?.storeID) ? action.storeID : yield select(selectStoreId)
            });
        }
    }
}

function* makePaymentLinkCall(action) {
    try {
        const response = yield apiCall(BasketNetwork.makePaymentLinkCall, action);
        if (isValidElement(response)) {
            yield put({ type: BASKET_TYPE.PAYMENT_LINK_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makePostRequest(action, cartID) {
    yield put({ type: BASKET_TYPE.CREATE_BASKET_PROGRESS, payload: true });
    const sequenceState = yield select(selectSequence);
    let sequence = sequenceState + 1;
    yield put({
        type: BASKET_TYPE.UPDATE_SEQUENCE,
        payload: sequence
    });
    if (isValidElement(action.addOns)) {
        yield put({
            type: BASKET_TYPE.ADD_LAST_ADD_ON_TO_ARRAY,
            payload: { item: action.item, addOns: action.addOns }
        });
    }
    const getBasket = yield getParamsForFetchBasket();
    return yield apiCall(BasketNetwork.makeAddOrRemoveItemToBasketCall, { ...action, cartID, sequence, getBasket });
}

function* makeUpdateQuantityRequest(action, cartID, resourceID) {
    const getBasket = yield getParamsForFetchBasket();
    return yield apiCall(BasketNetwork.updateQuantity, { ...action, cartID, resourceID, getBasket });
}

function* makeRedeemCall(action) {
    try {
        const cartID = yield select(selectBasketID);
        const response = yield apiCall(BasketNetwork.makeRedeemCall, { action, cartID });
        if (isValidElement(response) && isValidElement(response.basket)) {
            const basket = manipulateBasketResponse(response);
            yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeDeleteCartCall(action) {
    try {
        let storeID;
        yield fork(updatePrimaryAddress);
        if (isNonCustomerApp()) {
            let storeConfigId = yield select(selectStoreId);
            yield put({ type: ADDRESS_TYPE.RESET_DELIVERY_LOOKUP_SUCCESS });
            yield put({
                type: ADDRESS_TYPE.RESET_UPDATE_NON_BASKET_ORDER_TYPE,
                basketStoreId: action?.basketStoreID,
                storeId: storeConfigId
            });
            storeID = isValidElement(action) && isValidElement(action.basketStoreID) ? action.basketStoreID : storeConfigId;
            if (!isValidElement(storeID)) {
                yield put({ type: BASKET_TYPE.RESET_BASKET });
                return;
            }
        }
        yield put({ type: BASKET_TYPE.RESET_BASKET });
        if (isValidElement(action.isFromReOrder) && action.isFromReOrder && isValidElement(action.orderId)) {
            yield put({
                type: ORDER_MANAGEMENT_TYPE.TRIGGER_RE_ORDER,
                orderId: action.orderId,
                storeID: action.storeID,
                navigation: action.navigation,
                sending: action.sending
            });
        }
    } catch (e) {
        yield put({ type: BASKET_TYPE.RESET_BASKET });
    }
}

/**
 * TODO Need Refactor
 */
function* proceedWithoutMissingItem(action) {
    try {
        const missingItemArray = yield select(selectMissingItemArray);
        const cartID = yield select(selectBasketID);
        let cartItems = yield select(selectCart);
        let resIds = yield select(getResourceId);
        const storeID = isValidElement(action) && isValidElement(action.basketStoreID) ? action.basketStoreID : yield select(selectStoreId);
        if (isValidElement(missingItemArray)) {
            let missingItems = [];
            for (let i = 0; i < missingItemArray.length; i++) {
                missingItems.push(missingItemArray[i].id);
                let availableItem = _.findIndex(cartItems, function(o) {
                    return o.id === missingItemArray[i].item_id;
                });
                let availableResoureItem = _.findIndex(resIds, function(o) {
                    return o.id === missingItemArray[i].item_id;
                });
                if (isValidElement(availableItem) && availableItem !== -1) {
                    cartItems.splice(availableItem, 1);
                }
                if (isValidElement(availableResoureItem) && availableResoureItem !== -1) {
                    resIds.splice(availableResoureItem, 1);
                }
            }
            const response = yield apiCall(BasketNetwork.bulkRemoveItem, {
                cartID: cartID,
                item_ids: missingItems,
                storeID: storeID
            });
            if (isValidElement(response) && isValidElement(response.basket)) {
                const basket = manipulateBasketResponse(response);
                if (isValidElement(basket) && isValidElement(basket.data) && basket.data.length === 0) {
                    NavigationService.navigate(SCREEN_OPTIONS.MENU_SCREEN.route_name);
                    showErrorMessage(LOCALIZATION_STRINGS.APP_CLEAR_BASKET);
                    yield put({ type: BASKET_TYPE.RESET_BASKET });
                } else {
                    yield put({
                        type: BASKET_TYPE.DELETE_BULK_ITEM_BASKET_SUCCESS,
                        payload: {
                            cartItems: cartItems,
                            resIds: resIds
                        }
                    });
                }
                yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
            }
            yield put({ type: BASKET_TYPE.RESET_MISSING_ITEM_BASKET });
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeDeleteItemCall(action) {
    try {
        const { item } = action;
        const cartID = yield select(selectBasketID);
        const getBasket = yield getParamsForFetchBasket();
        const storeID = yield select(selectStoreIDFromCartItems);
        const response = yield apiCall(BasketNetwork.makeDeleteItem, { id: item.id, cartID, getBasket, storeID });
        if (isValidElement(response) && isValidElement(response.basket)) {
            const basket = manipulateBasketResponse(response);
            if (isValidElement(basket) && isValidElement(basket.data) && basket.data.length === 0) {
                NavigationService.navigate(SCREEN_OPTIONS.MENU_SCREEN.route_name);
                showErrorMessage(LOCALIZATION_STRINGS.APP_CLEAR_BASKET);
                yield put({ type: BASKET_TYPE.RESET_BASKET });
            }
            yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
            yield put({ type: BASKET_TYPE.DELETE_ITEM_BASKET_SUCCESS, payload: item });
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeBasketUpdateErrorItems(action) {
    try {
        const resourceID = action.elements.resourceID;
        const quantity = action.elements.action.quantity;
        const offer = action.elements.action.item.offer;
        const cartID = yield select(selectBasketID);
        const ID = action.elements.action.id;
        const getBasket = yield getParamsForFetchBasket();
        const response = yield apiCall(BasketNetwork.updateQuantity, {
            quantity: isNoOfferItem(offer) ? quantity : 0,
            resourceID,
            cartID,
            getBasket
        });
        if (isValidElement(response) && isValidElement(response.basket)) {
            const basket = manipulateBasketResponse(response);
            yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
            yield put({ type: BASKET_TYPE.DELETE_NETWORK_ITEMS, payload: ID });
        }
    } catch (e) {
        //no need to handle because we're updating the items without user intention
    }
}

// function* basketInstantSoftDelete(data) {
//     const { id, offer } = data;
//     if (isNoOfferItem(offer)) {
//         yield put({ type: BASKET_TYPE.REMOVE_ITEM_INSTANTLY_FROM_BASKET, payload: id });
//         const items = yield select(selectCartItems);
//         if (items.length === 0) {
//             NavigationService.navigate(SCREEN_OPTIONS.MENU_SCREEN.route_name);
//             showErrorMessage(LOCALIZATION_MODULE_STRINGS.APP_CLEAR_BASKET);
//         }
//     } else {
//         const basketItems = yield select(selectBasketViewItems);
//         const bogofData = basketItems.filter((item) => item.offer === BasketConstants.BOGOF);
//         if (bogofData.length === 1) {
//             yield put({ type: BASKET_TYPE.REMOVE_ITEM_INSTANTLY_FROM_BASKET, payload: id });
//         }
//         const bogohData = basketItems.filter((item) => item.offer === BasketConstants.BOGOH);
//         if (bogohData.length === 1) {
//             yield put({ type: BASKET_TYPE.REMOVE_ITEM_INSTANTLY_FROM_BASKET, payload: id });
//         }
//     }
// }

function* makePreOrderDatesCall(action) {
    try {
        const response = yield apiCall(BasketNetwork.getPreOrderDates);
        if (isValidElement(response) && isValidElement(response.preorder_hours)) {
            yield put({ type: BASKET_TYPE.GET_PRE_ORDER_DATES_SUCCESS, payload: response.preorder_hours });
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

export function* makeLookupAccountVerifyAction(action) {
    try {
        let response = yield apiCall(BasketNetwork.makeLookupAccountVerify, action);
        if (isValidElement(response)) {
            let responseObj = isValidElement(response.account_verified) ? response : { account_verified: response };
            if (
                isValidString(responseObj.account_verified.outcome) &&
                responseObj.account_verified.outcome.toLowerCase() === T2SBaseConstants.SUCCESS.toLowerCase()
            ) {
                const { account_verified } = responseObj;
                yield put({ type: AUTH_TYPE.OTP_PHONE_NUMBER, payload: action.phone });
                yield put({ type: AUTH_TYPE.ACCOUNT_VERIFIED, payload: responseObj.account_verified });
                if (!isExistingUser(account_verified) && isVerifyOtp(account_verified) && isValidString(action.phone)) {
                    yield* makePostSendOTPCall({
                        phone: action.phone,
                        otpType: isValidString(account_verified.type) ? account_verified.type : ProfileConstants.SMS
                    });
                }
                const takeawayListState = yield select(selectTakeawayListState);
                const selectedAddress = takeawayListState.selectedAddress;
                let viewType = ADDRESS_FORM_TYPE.TA_SEARCH_ADDRESS_SAVE;
                if (isValidElement(selectedAddress)) {
                    yield fork(makeGetAddressCall, { viewType });
                }
                // else if (isUserVerificationRequired(account_verified)) {
                //TODO if required we will redirect to profile screen in future
                // handleNavigation(SCREEN_OPTIONS.PROFILE.route_name, {
                //     screen: SCREEN_OPTIONS.PROFILE.route_name,
                //     params: { verified: false, isUpdateProfile: true }
                // });
                // } else {
                //TODO in this case we should not open the QC model.
                // handleNavigation(SCREEN_OPTIONS.QUICK_CHECKOUT.route_name);
                // }
                if (isValidElement(action.isFromReOrder)) return responseObj;
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            if (isValidElement(action.isFromReOrder)) return null;
        }
    } catch (e) {
        showErrorMessage(e);
        if (isValidElement(action.isFromReOrder)) return null;
    }
}
function* getBasketRecommendations() {
    try {
        const featureGateBasketRecommendation = yield select(selectBasketRecommendationFeatureGate);
        const showBasketRecommendation = yield select(selectIsBasketRecommendationEnabled);
        if (featureGateBasketRecommendation && showBasketRecommendation) {
            const storeResponse = yield select(selectStoreConfigResponse);
            const configEnvType = yield select(selectEnvConfig);
            let basketItems = yield select(selectBasketViewItems);
            const configurationData = yield select(getConfiguration);
            //TODO we need to check why this delay added here sometimes we are getting the basketItems as undefined
            if (!isValidElement(basketItems)) {
                yield delay(500);
                basketItems = yield select(selectBasketViewItems);
            }
            yield put({ type: BASKET_TYPE.BASKET_RECOMMENDATION_LOADING, payload: true });
            const items = isValidElement(basketItems) ? basketItems.map((item) => item.item_id).join(',') : null;
            const response = yield call(BasketNetwork.makeBasketRecommendations, {
                host: storeResponse.host,
                items: items,
                baseUrl: getBaseURL(configurationData),
                configType: configEnvType
            });
            // https://docs.google.com/document/d/1bOjgXw6hhdxclw7sV_3_2qY85dTvKbYaK6nWz3_rFMU/edit
            if (
                isValidElement(response.recommendations) &&
                Array.isArray(response.recommendations) &&
                response.recommendations.length > 0
            ) {
                let menuItems = yield select(selectMenuItems);
                //Menu Response is null when the user comes from reorder screen, so make the menu API call
                if (!isValidElement(menuItems)) {
                    //MAKE MENU API CALL HERE
                    yield call(makeMenu);
                    menuItems = yield select(selectMenuItems);
                    yield fork(makeMenuAddons);
                }

                let validMenu = formBasketRecommendation(response.recommendations, menuItems);
                if (isValidElement(validMenu)) {
                    let recentRecommendations = getTopTwoRecommendations(validMenu);
                    //if ML Response has only one item then include 1 item from best selling
                    if (recentRecommendations.length === 1) {
                        yield fork(handleBestSellingAsBasketRecommendations, recentRecommendations);
                    } else {
                        yield put({
                            type: BASKET_TYPE.BASKET_RECOMMENDATION_SUCCESS,
                            payload: {
                                recommendation_ref_id: response.recommendation_id,
                                recommendation: recentRecommendations,
                                type: BasketConstants.BR_TYPE_ML
                            }
                        });
                    }
                }
                yield put({ type: BASKET_TYPE.BASKET_RECOMMENDATION_LOADING, payload: false });
            } else {
                yield fork(handleBestSellingAsBasketRecommendations);
            }
        }
    } catch (e) {
        yield put({ type: BASKET_TYPE.BASKET_RECOMMENDATION_LOADING, payload: false });
        // showErrorMessage(e);
    }
}
//Showing best selling items as recommendations
export function* handleBestSellingAsBasketRecommendations(mlRecommendation) {
    try {
        let ourRecommendations = yield select(selectFilteredRecommendation);
        if (!isValidElement(ourRecommendations)) {
            yield call(makeGetOurRecommendations);
            ourRecommendations = yield select(selectFilteredRecommendation);
        }
        const orderType = yield select(selectOrderType);
        let recommendation = [];
        if (isValidElement(ourRecommendations)) {
            if (orderType === ORDER_TYPE.COLLECTION) {
                recommendation = ourRecommendations.filter((element) => element.collection === 1);
            } else {
                recommendation = ourRecommendations.filter((element) => element.delivery === 1);
            }
        }

        const cartItems = yield select(selectCartItems);
        const recommendations = handleBestSellingAsRecommendations(recommendation, cartItems);
        //this if block will execute if there is only one item in ML Response
        if (isValidElement(mlRecommendation) && Array.isArray(mlRecommendation)) {
            if (recommendations.length > 0) {
                const finalItem = _.uniqBy([...mlRecommendation, recommendations[0]], 'id');
                yield put({
                    type: BASKET_TYPE.BASKET_RECOMMENDATION_SUCCESS,
                    payload: { recommendation: finalItem, type: BasketConstants.BR_TYPE_MIXED }
                });
            } else {
                yield put({
                    type: BASKET_TYPE.BASKET_RECOMMENDATION_SUCCESS,
                    payload: { recommendation: mlRecommendation, type: BasketConstants.BR_TYPE_ML }
                });
            }
        } else {
            yield put({
                type: BASKET_TYPE.BASKET_RECOMMENDATION_SUCCESS,
                payload: { recommendation: recommendations, type: BasketConstants.BR_TYPE_BS }
            });
        }
    } catch (e) {
        yield put({ type: BASKET_TYPE.BASKET_RECOMMENDATION_LOADING, payload: false });
        // Nothing to handle
    }
}

function* handleAddOnAddItemAction(action) {
    const { id, quantity, quantityType, item, fromBasket, addOns, repeatAddOnType, fromFreeItems, fromBasketRecommendation } = action;
    yield put({
        type: BASKET_TYPE.ADD_ON_ITEM_BUTTON_TAPPED_ACTION_ADD_TO_BASKET,
        id,
        quantity,
        quantityType,
        item,
        fromBasket,
        addOns,
        repeatAddOnType,
        fromFreeItems,
        fromBasketRecommendation
    });
    yield fork(makeAddOrRemoveItemToBasketCall, action);
}

function* makeOrderChangeCall(action) {
    try {
        yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: true });
        const cartId = yield select(selectBasketID);
        const response = yield apiCall(BasketNetwork.makeOrderChange, { cartID: cartId, serviceType: action.orderType });
        if (isValidElement(response)) {
            yield put({ type: BASKET_TYPE.CHANGE_API_ACTION_SUCCESS, payload: response });
        }
        yield fork(filterMenu);
        yield delay(500);
        yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
    } catch (e) {
        yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
        showErrorMessage(e);
    }
}

function* updateBasketWithNewBasketResponse(action, basket) {
    if (action.newBasketId) {
        if (isValidElement(basket.data) && basket.data.length === 0) {
            NavigationService.goBack();
            yield put({ type: BASKET_TYPE.RESET_BASKET });
        } else {
            const newBasketResponse = yield select(selectNewBasketResponse);
            if (isValidElement(newBasketResponse)) {
                yield put({
                    type: BASKET_TYPE.UPDATE_BASKET_ITEM_WITH_NEW_RESPONSE,
                    payload: basket.item,
                    addOns:
                        isValidElement(newBasketResponse) && isValidElement(newBasketResponse.addons) && newBasketResponse.addons.length > 0
                            ? newBasketResponse.addons
                            : []
                });
                yield put(resetNewBasketResponse());
            }
        }
    }
}
function* updateCartItem() {
    const remoteCartItems = yield select(selectBasketViewItems);
    const localCart = yield select(selectCartItems);
    if (isValidElement(remoteCartItems) && isValidElement(localCart)) {
        const data = getCartItemsFromBasketResponse(remoteCartItems);
        yield put({ type: BASKET_TYPE.UPDATE_CART_ITEMS_ON_FOCUS, basketItems: data });
    }
}
export function* updateDriverTips(action) {
    let driverTips = action.driverTips;
    const cartID = yield select(selectBasketID);
    const orderType = yield select(selectOrderType);
    const paymentMode = yield select(getPaymentModeForBasket);
    const storeResponse = yield select(selectStoreConfigResponse);
    let globalTip = isValidElement(storeResponse?.global_tip) && storeResponse?.global_tip;
    let isDriverTipsAvailable = showTipsUI(globalTip, orderType);
    const data = {
        basket: true,
        driver_tip: isValidString(driverTips) ? driverTips : 0.0,
        payment_mode: isValidElement(action?.paymentMode) ? action.paymentMode : paymentMode
    };
    if (isValidString(cartID) && isDriverTipsAvailable) {
        try {
            const response = yield apiCall(BasketNetwork.makeUpdateBasketCall, { data, cartID });
            if (response?.outcome?.toLowerCase() === T2SBaseConstants.SUCCESS.toLowerCase()) {
                const basket = manipulateBasketResponse(response);
                yield put({ type: BASKET_TYPE.VIEW_BASKET_SUCCESS, payload: basket });
                yield put({ type: BASKET_TYPE.BASKET_LOADER, payload: false });
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
        } catch (e) {
            showErrorMessage(e);
        }
    }
}

function* BasketSaga() {
    yield all([
        takeEvery(BASKET_TYPE.ADD_REMOVE_ITEM_TO_BASKET, makeAddOrRemoveItemToBasketCall),
        takeEvery(BASKET_TYPE.ADD_BUTTON_TAPPED_ACTION, makeAddButtonTappedAction),
        takeLatest(BASKET_TYPE.UPDATE_BASKET, makeUpdateBasketCall),
        takeLatest(BASKET_TYPE.LOOKUP_LOYALTY_POINTS, makeLookupLoyaltyPointsCall),
        takeLatest(BASKET_TYPE.LOOKUP_COUPON, makeLookupCouponCall),
        takeLatest(BASKET_TYPE.PAYMENT_LINK, makePaymentLinkCall),
        takeLatest(BASKET_TYPE.APPLY_REDEEM, makeRedeemCall),
        takeLatest(BASKET_TYPE.PROCEED_WITHOUT_MISSING_ITEM_BASKET, proceedWithoutMissingItem),
        takeLatest(BASKET_TYPE.DELETE_ITEM_BASKET, makeDeleteItemCall),
        takeLatest(BASKET_TYPE.HANDLE_NETWORK_UPDATE_BASKET, makeBasketUpdateErrorItems),
        takeLatest(BASKET_TYPE.DELETE_CART, makeDeleteCartCall),
        takeLatest(BASKET_TYPE.GET_PRE_ORDER_DATES, makePreOrderDatesCall),
        takeLatest(BASKET_TYPE.LOOKUP_ACCOUNT_VERIFY, makeLookupAccountVerifyAction),
        debounce(1000, BASKET_TYPE.ADD_ON_ITEM_BUTTON_TAPPED_ACTION, handleAddOnAddItemAction),
        takeLatest(BASKET_TYPE.GET_LOYALTY_TRANSACTIONS, makeLookupLoyaltyTransactionsCall),
        takeLatest(BASKET_TYPE.CHANGE_API_ACTION, makeOrderChangeCall),
        takeLatest(BASKET_TYPE.UPDATE_GIFT_ITEM_ACTION, updateCartItem),
        takeEvery(BASKET_TYPE.GET_BASKET_RECOMMENDATION, getBasketRecommendations),
        takeEvery(BASKET_TYPE.UPDATE_DRIVER_TIPS, updateDriverTips)
    ]);
}

export default BasketSaga;
