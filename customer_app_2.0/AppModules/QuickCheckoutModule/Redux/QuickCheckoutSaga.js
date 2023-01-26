import { all, call, fork, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import { QC_ACTION_TYPE } from './QuickCheckoutType';
import { BasketNetwork } from '../../BasketModule/Network/BasketNetwork';
import {
    convertFloat,
    isArrayNonEmpty,
    isFranchiseApp,
    isNonCustomerApp,
    isValidElement,
    isValidNotEmptyString,
    isValidString,
    makeHapticFeedback
} from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import {
    applePayLabel,
    applePayMetaData,
    consumerReference,
    generateMetaDataForJudoPay,
    getConsumerReference,
    getJudoPayLabel,
    selectBasketID,
    selectBasketViewItems,
    selectBasketViewResponse,
    selectCardAmount,
    selectCountryBaseFeatureGateResponse,
    selectCvv,
    selectDeliveryAddress,
    selectLiveTrackingId,
    selectPaymentMode,
    selectPreOrderDate,
    selectSavedCardDetails,
    selectTotal,
    selectTotalValue,
    selectUserPaymentMode,
    selectUserSelectedCardId
} from '../../BasketModule/Redux/BasketSelectors';
import { ORDER_TYPE } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import { addressStringFromAddressObj, getCardItem, paymentReference } from '../Utils/Helper';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import {
    isPreOrderAvailableSelector,
    isTakeAwayOpenSelector,
    selectCountryBaseFeatureGateSelector,
    selectCurrencyFromStore,
    selectHost,
    selectS3Response,
    selectStoreConfigResponse,
    selectTimeZone,
    selectUserResponse,
    selectWalletBalance
} from 't2sbasemodule/Utils/AppSelectors';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { CARD_PAYMENT_FAILED, CHECKOUT_PAYMENT_TYPE, CHECKOUT_STATUS, PAYMENT_TYPE } from '../Utils/QuickCheckoutConstants';
import { TAKEAWAY_SEARCH_LIST_TYPE } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListType';
import { Constants, Constants as T2SBaseConstants, HapticFrom } from 't2sbasemodule/Utils/Constants';
import { AddressNetwork } from '../../AddressModule/Network/AddressNetwork';
import { getAddressObj, getViewOrderType } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { ADDRESS_TYPE } from '../../AddressModule/Redux/AddressType';
import { basketUpdateObject } from '../../BasketModule/Redux/BasketSaga';
import { BASKET_ERROR_MESSAGE, BASKET_UPDATE_TYPE } from '../../BasketModule/Utils/BasketConstants';
import { getStoreId } from '../../ConfiguratorModule/Utils/ConfiguratorHelper';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { logNonFatalEvent } from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS } from '../../AnalyticsModule/AnalyticsConstants';
import { makeGetRecentTakeawayCall } from '../../../FoodHubApp/HomeModule/Redux/HomeSaga';
import { ERROR_CODE } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerConstants';
import { selectMenuResponse } from '../../MenuModule/Redux/MenuSelector';
import { getBusinessDayForDate, getBusinessMomentForDate } from 't2sbasemodule/Utils/DateUtil';
import { filterCurrentMenu } from '../../MenuModule/Utils/MenuHelpers';
import _ from 'lodash';
import { MENU_TYPE } from '../../MenuModule/Redux/MenuType';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS, SEGMENT_STRINGS } from '../../AnalyticsModule/SegmentConstants';
import Judo, {
    JudoAmount,
    JudoAuthorization,
    JudoCardNetwork,
    JudoConfiguration,
    JudoGooglePayEnvironment,
    JudoReference,
    JudoTransactionType
} from 'judokit-react-native';
import * as Braze from '../../AnalyticsModule/Braze';
import { selectReferralCode } from '../../ProfileModule/Redux/ProfileSelectors';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { makeFHLogApiCall } from '../../FHLogsModule/Redux/FhLogsSaga';
import { checkForPhoneNumberValidation, getGraphQlQuery } from '../../BasketModule/Utils/BasketHelper';
import { FH_LOG_ERROR_CODE } from '../../FHLogsModule/Utils/FhLogsConstants';
import { PROFILE_TYPE } from '../../ProfileModule/Redux/ProfileType';
import { makePostReferralCall, syncProfileForReferral } from '../../ProfileModule/Redux/ProfileSaga';
import { getNativePayGateway, getReferralCampaignStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { LIVE_TRACKING_EVENT } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import { isAndroid, isIOS } from '../../BaseModule/Helper';
import { NativeModules } from 'react-native';
import { ApplePay } from '../../../CustomerApp/NativeModules/ZohoDesk';
import { FH_LOGS_TYPE } from '../../FHLogsModule/Redux/FhLogsType';

const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
const { RnGpay } = NativeModules;

function* proceedCheckoutCall() {
    try {
        const orderType = yield select(selectOrderType);
        if (isValidElement(orderType)) {
            const isTakeAwayOpen = yield select(isTakeAwayOpenSelector);
            let isPreOrderEnable = yield select(isPreOrderAvailableSelector);

            if (isTakeAwayOpen || isPreOrderEnable) {
                if (orderType.toLowerCase() === ORDER_TYPE.DELIVERY.toLowerCase()) {
                    const s3ConfigResponse = yield select(selectS3Response);
                    let storeConfigResponse = yield select(selectStoreConfigResponse);
                    const deliveryAddress = yield select(selectDeliveryAddress);
                    const deliveryLookupResponse = yield apiCall(AddressNetwork.makeDeliveryLookupCall, {
                        addressObj: getAddressObj(s3ConfigResponse, storeConfigResponse?.host, deliveryAddress)
                    });
                    if (isValidElement(deliveryLookupResponse)) {
                        yield put({ type: ADDRESS_TYPE.DELIVERY_LOOKUP_SUCCESS, payload: deliveryLookupResponse });
                        yield* checkBasketValidation();
                    }
                } else {
                    yield* checkBasketValidation();
                }
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_NOW);
                yield* swipeBack();
                NavigationService.navigationRef.current?.goBack();
            }
        } else {
            //TODO Need to handle with Order Type
        }
    } catch (e) {
        if (e.code === ERROR_CODE.VALIDATION) {
            logNonFatalEvent(null, BUSINESS_CRITICAL_EXCEPTIONAL_EVENTS.BASKET_VALIDATION_ERROR);
        }
        showErrorMessage(e);
        yield* swipeBack();
    }
}

// * TODO Need Refactor
function* checkBasketValidation() {
    let proceedPayment = true;
    const cartID = yield select(selectBasketID);
    const data = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    if (isValidElement(data)) {
        let isPreOrderEnable = yield select(isPreOrderAvailableSelector);
        let cartItems = yield select(selectBasketViewItems);
        if (isFranchiseApp() && isPreOrderEnable && isValidString(data.pre_order_time)) {
            try {
                const menuResponse = yield select(selectMenuResponse);
                if (isValidElement(menuResponse)) {
                    const orderType = yield select(selectOrderType);
                    let timezone = yield select(selectTimeZone);
                    let currentBusinessDay = getBusinessDayForDate(data.pre_order_time, timezone);
                    let currentBusinessMoment = getBusinessMomentForDate(data.pre_order_time, timezone);
                    let filteredMenu = filterCurrentMenu(menuResponse, orderType, currentBusinessDay, currentBusinessMoment, true);
                    let missingItemArray = [...cartItems];
                    filteredMenu.forEach((category) => {
                        if (isValidElement(category) && isValidElement(category.subcat) && missingItemArray.length > 0) {
                            category.subcat.forEach((subcat) => {
                                if (isValidElement(subcat) && isValidElement(subcat.item) && missingItemArray.length > 0) {
                                    subcat.item.forEach((item) => {
                                        if (isValidElement(item) && missingItemArray.length > 0) {
                                            let availableItem = _.findIndex(missingItemArray, function(o) {
                                                return o.item_id === item.id;
                                            });
                                            if (isValidElement(availableItem) && availableItem !== -1) {
                                                missingItemArray.splice(availableItem, 1);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                    if (missingItemArray.length > 0) {
                        proceedPayment = false;
                        yield put({
                            type: BASKET_TYPE.SHOW_MISSING_ITEM_BASKET,
                            payload: { missing: true, missingItemArray: missingItemArray }
                        });
                        yield fork(swipeBack);
                    }
                }
            } catch (e) {
                proceedPayment = true;
                //Nothing to Handle
            }
        }
        if (proceedPayment) {
            try {
                const response = yield apiCall(BasketNetwork.makeUpdateBasketCall, { data, cartID });
                if (isValidElement(response) && isValidElement(response.basket)) {
                    const referralCode = yield select(selectReferralCode);
                    const order_info_id = yield select(selectBasketID);
                    const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
                    if (isValidElement(referralCode) && isValidElement(order_info_id) && getReferralCampaignStatus(featureGateResponse)) {
                        yield* makePostReferralCall({ referralCode, order_info_id });
                    }
                    yield logCheckout();
                    yield* proceedToPaymentFlow();
                    yield* swipeBack();
                } else {
                    showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
                    yield* swipeBack();
                }
            } catch (e) {
                yield* swipeBack();
                checkForPhoneNumberValidation(e);
            }
        }
    } else {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        yield* swipeBack();
    }
}

export function* logAnalytics(cart_id, eventData = null) {
    const { customers_id, payment_mode, storeID, cartID } = isValidElement(eventData) && eventData;
    const paymentMode = isValidElement(payment_mode) ? payment_mode : yield select(selectUserPaymentMode);
    const basketResponse = yield select(selectBasketViewResponse);
    const total = isValidElement(basketResponse?.total) ? basketResponse.total : 0;
    const currency = yield select(selectCurrencyFromStore);
    const liveTrackingId = yield select(selectLiveTrackingId);
    const config = yield select(getConfiguration);
    const store_id = isValidElement(storeID) ? storeID : getStoreId(config);
    Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.PLACE_ORDER_COMPLETE, {
        payment_type: paymentMode,
        cart_id: isValidElement(cartID) ? cartID : cart_id,
        isFromCheckOut: true,
        total_price: total.value,
        currency,
        value: total.value
    });

    let body = {
        config_id: store_id,
        id: liveTrackingId,
        conversion: 'TRUE',
        order_id: isValidElement(cartID) ? cartID : cart_id,
        customer_id: isValidElement(customers_id) ? customers_id : basketResponse?.customer_id,
        order_value: total.value,
        type: 'update'
    };
    yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.SET_TA_LIVE_TRACKING, event: LIVE_TRACKING_EVENT.PLACE_ORDER, body });
}

export function* logConfirmOrder(action) {
    let isOrderConfirm = isValidElement(action?.isFromBeginCheckout) ? !action?.isFromBeginCheckout : true;
    let isFromReorder = isValidElement(action?.fromReorder) ? action.fromReorder : false;
    yield logCheckout(isOrderConfirm, isValidString(action?.payload) ? action.payload : '', isFromReorder);
}

export function* logCheckout(isConfirmOrder = false, message = '', isFromReorder = false) {
    const deliveryAddress = yield select(selectDeliveryAddress);
    const s3ConfigResponse = yield select(selectS3Response);
    const payment = yield select(selectPaymentMode);
    const data = yield getHostAndCartId();
    const preOrderDate = yield select(selectPreOrderDate);
    const basketResponse = yield select(selectBasketViewResponse);
    const featureGateResponse = yield select(selectCountryBaseFeatureGateSelector);
    const storeConfigResponse = yield select(selectStoreConfigResponse);

    if (isValidElement(basketResponse)) {
        const { total, coupon_code, type, currency, online_discount, collection_discount, sub_total } = basketResponse;
        let orderType = isValidString(type) ? getViewOrderType(type?.toLowerCase()) : '';
        let totalValue = convertFloat(total?.value);
        let obj = {
            order_id: data.cartID,
            country_code: s3ConfigResponse?.country?.iso,
            value: isValidElement(totalValue) && totalValue,
            total_price: isValidElement(totalValue) && totalValue, //duplicated to make it readable for user
            sub_total: isValidElement(sub_total) && convertFloat(sub_total.value),
            currency: isValidElement(currency) && currency,
            takeaway: storeConfigResponse?.name,
            payment_mode: payment
        };
        if (isValidString(coupon_code)) {
            obj.coupon = coupon_code;
        }
        if (isValidString(orderType)) {
            obj.order_type = orderType;
            let delivery_address = addressStringFromAddressObj(deliveryAddress, true);
            if (orderType === ORDER_TYPE.DELIVERY && isValidString(delivery_address)) {
                obj.delivery_address = delivery_address;
            }
        }
        if (!isConfirmOrder) {
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.BEGIN_CHECKOUT, {
                ...obj,
                source: isFromReorder ? SEGMENT_STRINGS.REORDER : SEGMENT_STRINGS.TAKEAWAY_LIST
            });
        } else {
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.ORDER_PLACED, {
                ...obj,
                preset_discount: isValidElement(online_discount) || isValidElement(collection_discount),
                pre_order: isValidString(preOrderDate),
                payment_status: isValidString(message) ? SEGMENT_STRINGS.DECLINE : SEGMENT_STRINGS.SUCCESSFUL,
                order_status: isValidString(message) ? message : SEGMENT_STRINGS.PLACED
            });
        }
        if (isValidElement(deliveryAddress) && isValidElement(deliveryAddress.address_line2)) {
            Braze.setUserHomeCity(deliveryAddress.address_line2, featureGateResponse);
        }
    }
}

function* proceedToPaymentFlow() {
    const basketResponse = yield select(selectBasketViewResponse);
    let totalAmount = yield select(selectTotalValue);
    const payment = yield select(selectPaymentMode);
    const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
    const cartID = yield select(selectBasketID);
    Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.PAYMENT_PAGE, {
        payment_mode: payment,
        order_id: cartID
    });
    if ((isValidElement(basketResponse) && parseFloat(totalAmount) === 0) || payment === PAYMENT_TYPE.CASH) {
        yield makeCashPayment(payment === PAYMENT_TYPE.CASH ? PAYMENT_TYPE.CASH : PAYMENT_TYPE.CARD);
    } else if (payment === PAYMENT_TYPE.WALLET) {
        yield makeWalletFullPayment();
    } else if (payment === PAYMENT_TYPE.PARTIAL_PAYMENT) {
        yield makeWalletPartialPayment();
    } else if (payment === PAYMENT_TYPE.CARD_FROM_LIST) {
        yield makeCardPayment();
    } else if (payment === PAYMENT_TYPE.CARD || payment === PAYMENT_TYPE.NEW_CARD) {
        yield makeNewCardPayment();
    } else if (payment === PAYMENT_TYPE.APPLE_PAY || payment === PAYMENT_TYPE.GOOGLE_PAY) {
        const gateway = getNativePayGateway(payment, featureGateResponse);
        if (isValidElement(gateway)) {
            if (gateway === AppConfig.CheckoutGateway.key) {
                yield makeCheckoutPayment(payment);
            } else if (gateway === AppConfig.JudoKit.key) {
                let serviceChargeResponse = yield call(makeServiceChargeCall);
                yield makeJudoPayment(payment, serviceChargeResponse);
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.PAYMENT_NOT_SUPPORTED_MSG);
            }
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.PAYMENT_NOT_SUPPORTED_MSG);
        }
    } else {
        //TODO for finding the dev mistake. If not needed will remove it in future
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
}

function* makeCashPayment(overridePaymentType = undefined) {
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    let data = yield getHostAndCartId();
    const { cartID, host } = data;
    try {
        const response = yield apiCall(BasketNetwork.makeConfirmOrderCall, {
            cartId: cartID,
            host: host,
            payment: overridePaymentType ?? PAYMENT_TYPE.CASH
        });
        yield fork(validatePaymentResponse, response, cartID);
    } catch (e) {
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                store_id: orderStoreID,
                order_id: cartID,
                errorMessage: e.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.CASH_ORDER_CONFIRMATION_FAIL, eventData);
        }
        showErrorMessage(e);
        yield* swipeBack();
    }
}

function* validatePaymentResponse(response, cartID) {
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    const storeID = getStoreId(config);

    const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
    if (isValidElement(response) && isValidString(response.outcome) && response.outcome === Constants.SUCCESS) {
        yield fork(syncProfileForReferral);
        yield logConfirmOrder();
        yield logAnalytics(cartID);
        yield put({ type: BASKET_TYPE.NAVIGATION_RESET_TO_HOME_FROM_BASKET, payload: true });
        yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_STORE_ID_CONFIG });
        handleNavigation(null, { orderId: cartID, storeID: storeID }, SCREEN_OPTIONS.ORDER_HISTORY.route_name);
        handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
            orderId: cartID,
            storeID: storeID,
            isFromCheckOut: true,
            analyticsObj: {
                order_id: cartID,
                store_id: storeID
            }
        });
        yield put({ type: BASKET_TYPE.RESET_BASKET });
        yield put({ type: PROFILE_TYPE.UPDATE_REFERRAL_CODE, referralCode: null });
        makeHapticFeedback(featureGateResponse, HapticFrom.ORDER_PLACED);
        if (isNonCustomerApp()) {
            yield put({ type: MENU_TYPE.RESET_MENU_RESPONSE_ACTION });
            yield fork(makeGetRecentTakeawayCall);
        }
    } else {
        showErrorMessage(response);
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                store_id: orderStoreID,
                order_id: cartID,
                errorMessage: response.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.CASH_ORDER_CONFIRMATION_FAIL, eventData);
        }
        yield* swipeBack();
    }
}

function* makeCardPayment(callAgain = true) {
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    let data = yield getHostAndCartId();
    const { cartID } = data;
    let eventData;
    if (isValidElement(basketData)) {
        eventData = {
            customerId: basketData.customers_id,
            payment_mode: basketData.payment_mode,
            phone: basketData.phone,
            store_id: orderStoreID,
            order_id: cartID,
            basketData: basketData
        };
    }
    try {
        const savedCardDetails = yield select(selectSavedCardDetails);
        const userSelectedCardId = yield select(selectUserSelectedCardId);
        const selectedCard = getCardItem(savedCardDetails, userSelectedCardId);
        const cvv = yield select(selectCvv);

        const response = yield apiCall(BasketNetwork.makeCardPayment, {
            cartId: cartID,
            customer_payment_id: selectedCard.id,
            cvv
        });
        response.isSavedCardTransaction = true;
        if (
            response?.outcome === T2SBaseConstants.FAILED &&
            response?.message?.toLowerCase().includes(BASKET_ERROR_MESSAGE.API_PARAMS_MISSING_ERROR)
        ) {
            eventData.response = response;
            if (callAgain) {
                yield makeCardPayment(!callAgain);
            }
            yield put({
                type: FH_LOGS_TYPE.NEW_CARD_PAYMENT_LOG,
                graphqlQuery: getGraphQlQuery(CARD_PAYMENT_FAILED, eventData)
            });
        }

        yield fork(handlePaymentRedirection, response);
    } catch (e) {
        yield put({ type: BASKET_TYPE.CVV, payload: undefined });
        let errorData;
        errorData = {
            ...eventData,
            errorMessage: isValidElement(e?.message) ? e.message : null
        };
        Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.CARD_ORDER_CONFIRMATION_FAIL, errorData);
        if (e?.message?.toLowerCase().includes(BASKET_ERROR_MESSAGE.API_PARAMS_MISSING_ERROR)) {
            if (callAgain) {
                yield makeCardPayment(!callAgain);
            }
            yield put({
                type: FH_LOGS_TYPE.NEW_CARD_PAYMENT_LOG,
                graphqlQuery: getGraphQlQuery(CARD_PAYMENT_FAILED, errorData)
            });
        } else {
            showErrorMessage(e);
        }

        yield fork(swipeBack);
    }
}

function* makeNewCardPayment(throwRedirectionError = false) {
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    const cartID = yield select(selectBasketID);
    try {
        let data = yield getHostAndCartId();
        const config = yield select(getConfiguration);
        const storeID = getStoreId(config);
        const { host } = data;
        const response = yield apiCall(BasketNetwork.makePaymentLinkCall, {
            cartId: cartID,
            host: host
        });
        if (isValidElement(response) && isValidString(response.url)) {
            handleNavigation(SCREEN_OPTIONS.WEBVIEW_PAYMENT.route_name, { url: response.url, storeID: storeID });
            if (throwRedirectionError) showErrorMessage(LOCALIZATION_STRINGS.UNABLE_TO_RETRIEVE_INFORMATION);
        }
    } catch (e) {
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                store_id: orderStoreID,
                order_id: cartID,
                errorMessage: e.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.NEW_CARD_PAYMENT_ORDER_CONFIRMATION_FAIL, eventData);
        }
        checkForPhoneNumberValidation(e);
        showErrorMessage(e);
        yield* swipeBack();
    }
}

function* makeWalletFullPayment() {
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    const cartID = yield select(selectBasketID);
    try {
        let totalAmount = yield select(selectTotalValue);
        const response = yield apiCall(BasketNetwork.makeWalletFullPayment, {
            cartId: cartID,
            totalAmount: totalAmount
        });
        yield fork(validatePaymentResponse, response, cartID);
    } catch (e) {
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                store_id: orderStoreID,
                order_id: cartID,
                errorMessage: e.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.WALLET_ORDER_CONFIRMATION_FAIL, eventData);
        }
        showErrorMessage(e);
        yield* swipeBack();
    }
}

function* makeWalletPartialPayment() {
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    const cartID = yield select(selectBasketID);
    try {
        const savedCardDetails = yield select(selectSavedCardDetails);
        const userSelectedCardId = yield select(selectUserSelectedCardId);
        const selectedCard = getCardItem(savedCardDetails, userSelectedCardId);
        const cvv = yield select(selectCvv);
        const card_amount = yield select(selectCardAmount);
        const wallet_amount = yield select(selectWalletBalance);

        const response = yield apiCall(BasketNetwork.makeWalletPartialPayment, {
            cartId: cartID,
            customer_payment_id: selectedCard.id,
            wallet_amount,
            card_amount,
            cvv
        });
        response.isSavedCardTransaction = true;
        yield fork(handlePaymentRedirection, response);
    } catch (e) {
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                store_id: orderStoreID,
                order_id: cartID,
                errorMessage: e.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.PARTIAL_ORDER_CONFIRMATION_FAIL, eventData);
        }
        showErrorMessage(e);
        yield* swipeBack();
    }
}

function* makeJudoPayment(paymentMode, serviceCharge) {
    const total = yield select(selectTotal);
    const consumerRef = yield select(consumerReference);
    const metaData = yield select(applePayMetaData, serviceCharge);
    const label = yield select(applePayLabel);
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    const config = yield select(getConfiguration);
    const orderStoreID = getStoreId(config);
    let data = yield getHostAndCartId();
    const { cartID } = data;
    const auth: JudoAuthorization = AppConfig.JudoKit.isSandBox
        ? { token: AppConfig.JudoKit.sandbox_token, secret: AppConfig.JudoKit.sandbox_secret }
        : { token: AppConfig.JudoKit.token, secret: AppConfig.JudoKit.secret };
    const judo = new Judo(auth);
    judo.isSandboxed = AppConfig.JudoKit.isSandBox;
    let amount = isValidElement(total) && isValidString(total.value) ? total.value : '0.00';

    const paymentDetails: JudoAmount = {
        value: amount,
        currency: 'GBP'
    };
    const reference: JudoReference = {
        consumerReference: consumerRef,
        paymentReference: paymentReference(),
        metadata: metaData
    };
    const configuration: JudoConfiguration = {
        judoId: AppConfig.JudoKit.judoId,
        amount: paymentDetails,
        reference: reference,
        isInitialRecurringPayment: false,
        applePayConfiguration: {
            merchantId: AppConfig.JudoKit.merchantId,
            countryCode: 'GB',
            paymentSummaryItems: [
                {
                    label: label,
                    amount: amount
                }
            ]
        }
    };
    const cardNetworks = JudoCardNetwork.Visa | JudoCardNetwork.Mastercard;
    // const JudoBillingAddressParameters = {
    //     addressFormat: JudoAddressFormat.MINIMAL,
    //     isPhoneNumberRequired: false
    // };
    // const JudoShippingAddressParameters = {
    //     allowedCountryCodes: ['GB', 'US'],
    //     isPhoneNumberRequired: false
    // };
    const googleConfiguration: JudoConfiguration = {
        judoId: AppConfig.JudoKit.googleJudoId,
        amount: paymentDetails,
        reference: reference,
        isInitialRecurringPayment: false,
        uiConfiguration: {
            isAVSEnabled: true,
            shouldPaymentMethodsDisplayAmount: true,
            shouldPaymentButtonDisplayAmount: true,
            shouldPaymentMethodsVerifySecurityCode: true
        },
        supportedCardNetworks: cardNetworks,
        googlePayConfiguration: {
            countryCode: 'GB',
            environment: AppConfig.JudoKit.isSandBox ? JudoGooglePayEnvironment.TEST : JudoGooglePayEnvironment.PRODUCTION,
            isEmailRequired: true,
            isBillingAddressRequired: false,
            isShippingAddressRequired: false
        }
    };
    let appleResponse = {};
    appleResponse.isSavedCardTransaction = false;
    let eventData = {
        customers_id: basketData.customers_id,
        payment_mode: paymentMode,
        phone: basketData.phone,
        store_id: orderStoreID,
        order_id: cartID
    };
    Analytics.logEvent(
        ANALYTICS_SCREENS.QC,
        paymentMode === PAYMENT_TYPE.GOOGLE_PAY
            ? ANALYTICS_EVENTS.ANDROID_PAY_TRANSACTION_STARTED
            : ANALYTICS_EVENTS.APPLE_PAY_TRANSACTION_STARTED
    );
    try {
        let response =
            paymentMode === PAYMENT_TYPE.GOOGLE_PAY
                ? yield judo.invokeGooglePay(JudoTransactionType.Payment, googleConfiguration)
                : yield iApplePayAvailable(judo, configuration)
                      ? yield judo.invokeApplePay(JudoTransactionType.Payment, configuration)
                      : null;
        if (isValidElement(response) && isValidElement(response.result)) {
            if (!isNaN(response.result)) {
                if (response.result === 0) {
                    appleResponse.outcome = T2SBaseConstants.SUCCESS;
                    yield put({ type: QC_ACTION_TYPE.CHECK_PAYMENT_STATUS, payload: T2SBaseConstants.SUCCESS });
                } else {
                    appleResponse.message = isValidString(response.message) ? response.message : LOCALIZATION_STRINGS.PAYMENT_FAILED;
                    appleResponse.outcome = T2SBaseConstants.FAILED;
                    eventData.errorMessage = appleResponse.message;
                    eventData.response = JSON.stringify(response);
                    eventData.type = 'INVALID_RESULT';
                    yield fork(logJudoPayFailureEvents, paymentMode, eventData);
                    yield put({ type: QC_ACTION_TYPE.CHECK_PAYMENT_STATUS, payload: T2SBaseConstants.FAILED });
                }
            } else {
                appleResponse.message = LOCALIZATION_STRINGS.PAYMENT_FAILED;
                appleResponse.outcome = T2SBaseConstants.FAILED;

                eventData.errorMessage = appleResponse.message;
                eventData.response = JSON.stringify(response);
                eventData.type = 'NAN';
                yield fork(logJudoPayFailureEvents, paymentMode, eventData);
                yield put({ type: QC_ACTION_TYPE.CHECK_PAYMENT_STATUS, payload: T2SBaseConstants.FAILED });
            }
        } else {
            appleResponse.message = LOCALIZATION_STRINGS.PAYMENT_FAILED;
            appleResponse.outcome = T2SBaseConstants.FAILED;

            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(response);
            eventData.type = 'INVALID_RESPONSE';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        }
        yield* handlePaymentRedirection(appleResponse);
    } catch (error) {
        let applePayResponse = {};
        yield put({ type: QC_ACTION_TYPE.CHECK_PAYMENT_STATUS, payload: T2SBaseConstants.FAILED });
        applePayResponse.isSavedCardTransaction = false;
        if (error.code === 'JUDO_USER_CANCELLED') {
            applePayResponse.userCancellation = true;
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(error);
            eventData.type = 'JUDO_USER_CANCELLED';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
            //Do Nothing except Cancel the operation using swipeback done at the end of the block.
        } else if (error.code === 'JUDO_ERROR' && error.userInfo && error.userInfo.result === 'Declined') {
            applePayResponse.message = LOCALIZATION_STRINGS.CARD_DECLINED;
            Analytics.logEvent(
                ANALYTICS_SCREENS.QC,
                paymentMode === PAYMENT_TYPE.GOOGLE_PAY
                    ? ANALYTICS_EVENTS.ANDROID_PAY_CARD_DECLINED
                    : ANALYTICS_EVENTS.APPLE_PAY_CARD_DECLINED
            );
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(error);
            eventData.type = 'CARD_DECLINED';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        } else {
            applePayResponse.message = error.message || LOCALIZATION_STRINGS.APP_SOMETHING_WENT_WRONG;
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(error);
            eventData.type = 'EXCEPTION';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        }
        yield* handlePaymentRedirection(applePayResponse);
    }
}

function* makeCheckoutPayment(paymentMode) {
    const eventData = {};
    try {
        let totalAmount = yield select(selectTotalValue);
        let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
        const cartID = yield select(selectBasketID);
        const s3ConfigResponse = yield select(selectS3Response);
        const config = yield select(getConfiguration);
        const orderStoreID = getStoreId(config);
        eventData.store_id = orderStoreID;
        eventData.order_id = cartID;
        eventData.phone = basketData?.phone;
        eventData.customers_id = basketData?.customers_id;
        if (isIOS()) {
            const requestData = generateApplePayRequestData(totalAmount, s3ConfigResponse);
            const applePayResponse = yield call(ApplePay.requestPayment, requestData);
            if (isValidElement(applePayResponse)) {
                yield makePaymentRequest(paymentMode, applePayResponse, cartID);
            } else {
                eventData.errorMessage = LOCALIZATION_STRINGS.TRANSACTION_CANCELLED;
                eventData.type = LOCALIZATION_STRINGS.TRANSACTION_CANCELLED;
                yield fork(logJudoPayFailureEvents, paymentMode, eventData);
                showErrorMessage(eventData.errorMessage);
                yield* swipeBack(true);
            }
        } else if (isAndroid()) {
            const requestData = generateGooglePayRequest(totalAmount, s3ConfigResponse);
            RnGpay.setEnvironment(AppConfig.CheckoutGateway.isSandBox ? RnGpay.ENVIRONMENT_TEST : RnGpay.ENVIRONMENT_PRODUCTION);
            const isReadyToPay = yield call([RnGpay, RnGpay.isReadyToPay], allowedCardNetworks, allowedCardAuthMethods);
            if (isReadyToPay) {
                const googlePayResponse = yield call([RnGpay, RnGpay.requestPayment], requestData);
                if (isValidElement(googlePayResponse)) {
                    yield makePaymentRequest(paymentMode, googlePayResponse, cartID);
                } else {
                    eventData.errorMessage = LOCALIZATION_STRINGS.PAYEMENT_TOKEN_NOT_GENERATED;
                    eventData.type = LOCALIZATION_STRINGS.PAYEMENT_TOKEN_NOT_GENERATED;
                    yield fork(logJudoPayFailureEvents, paymentMode, eventData);
                    showErrorMessage(eventData.errorMessage);
                    yield* swipeBack();
                }
            } else {
                eventData.errorMessage = LOCALIZATION_STRINGS.DEVICE_NOT_SUPPORT;
                eventData.type = LOCALIZATION_STRINGS.DEVICE_NOT_SUPPORT;
                yield fork(logJudoPayFailureEvents, paymentMode, eventData);
                showErrorMessage(eventData.errorMessage);
                yield* swipeBack();
            }
        } else {
            eventData.errorMessage = LOCALIZATION_STRINGS.DEVICE_NOT_SUPPORT;
            eventData.type = LOCALIZATION_STRINGS.DEVICE_NOT_SUPPORT;
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
            showErrorMessage(eventData.errorMessage);
            yield* swipeBack();
        }
    } catch (error) {
        eventData.errorMessage = error.message || LOCALIZATION_STRINGS.APP_SOMETHING_WENT_WRONG;
        eventData.response = isValidElement(error) ? JSON.stringify(error) : '';
        eventData.type = 'EXCEPTION';
        showErrorMessage(eventData.errorMessage);
        yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        yield* swipeBack(true);
    }
}

const generateGooglePayRequest = (totalAmount, s3ConfigResponse) => {
    const { currency } = s3ConfigResponse;

    return {
        cardPaymentMethod: {
            tokenizationSpecification: {
                type: AppConfig.CheckoutGateway.type,
                // other:
                gateway: AppConfig.CheckoutGateway.gateway,
                gatewayMerchantId: AppConfig.CheckoutGateway.isSandBox
                    ? AppConfig.CheckoutGateway.gatewaySandboxMerchantId
                    : AppConfig.CheckoutGateway.gatewayMerchantId
            },
            allowedCardNetworks,
            allowedCardAuthMethods
        },
        transaction: {
            totalPrice: totalAmount,
            totalPriceStatus: 'FINAL',
            currencyCode: currency?.iso
        },
        merchantName: AppConfig.APP_NAME
    };
};
const generateApplePayRequestData = (totalAmount, s3ConfigResponse) => {
    const { country, currency } = s3ConfigResponse;
    return {
        merchantIdentifier: AppConfig.CheckoutGateway.isSandBox
            ? AppConfig.CheckoutGateway.sandbox_merchantId
            : AppConfig.CheckoutGateway.merchantId,
        supportedNetworks: ['mastercard', 'visa'], //add if any networks, add Native iOS ApplePayToken.swift file too
        countryCode: country?.iso,
        currencyCode: currency?.iso,
        paymentSummaryItems: [
            {
                label: LOCALIZATION_STRINGS.TOTAL,
                amount: totalAmount
            }
        ]
    };
};

function* makePaymentRequest(paymentMode, sdkKeyResponse, cartID) {
    const eventData = {};
    let appleResponse = {};
    try {
        const response = yield apiCall(BasketNetwork.makeCheckoutGatewayPayment, {
            order_id: cartID,
            type: paymentMode === PAYMENT_TYPE.GOOGLE_PAY ? CHECKOUT_PAYMENT_TYPE.GOOGLE_PAY : CHECKOUT_PAYMENT_TYPE.APPLE_PAY,
            token_data: sdkKeyResponse
        });
        if (
            isValidElement(response?.data?.payments?.status) &&
            response?.data?.payments?.status === CHECKOUT_STATUS.PENDING &&
            isValidString(response?.data?.payments._links?.redirect?.href)
        ) {
            const config = yield select(getConfiguration);
            const orderStoreID = getStoreId(config);
            handleNavigation(SCREEN_OPTIONS.WEBVIEW_PAYMENT.route_name, {
                url: response.data.payments._links.redirect.href,
                storeID: orderStoreID
            });
        } else if (
            (isValidElement(response?.data?.payments?.approved) && response?.data?.payments?.approved === true) ||
            (isValidElement(response?.data?.payments?.status) && response?.data?.payments?.status === CHECKOUT_STATUS.AUTHORIZED) ||
            (isValidElement(response?.data?.payments?.response_summary) &&
                response?.data?.payments?.response_summary === CHECKOUT_STATUS.APPROVED)
        ) {
            appleResponse.isSavedCardTransaction = false;
            appleResponse.outcome = T2SBaseConstants.SUCCESS;
            yield fork(handlePaymentRedirection, appleResponse);
        } else if (isValidElement(response?.data?.payments?.status) && response?.data?.payments?.status === CHECKOUT_STATUS.DECLINED) {
            appleResponse.message = LOCALIZATION_STRINGS.CARD_DECLINED;
            appleResponse.outcome = T2SBaseConstants.FAILED;
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(response);
            eventData.type = 'CARD_FAILED';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
            yield fork(handlePaymentRedirection, appleResponse, true);
        } else {
            appleResponse.message = LOCALIZATION_STRINGS.PAYMENT_FAILED;
            appleResponse.outcome = T2SBaseConstants.FAILED;
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(response);
            eventData.type = 'INVALID_RESULT';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
            yield fork(handlePaymentRedirection, appleResponse, true);
        }
    } catch (error) {
        showErrorMessage(error.message || LOCALIZATION_STRINGS.APP_SOMETHING_WENT_WRONG);
        eventData.errorMessage = error.message || LOCALIZATION_STRINGS.APP_SOMETHING_WENT_WRONG;
        eventData.response = isValidElement(error) ? JSON.stringify(error) : '';
        eventData.type = 'EXCEPTION';
        yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        yield* swipeBack(true);
    }
}

function* iApplePayAvailable(judo, configuration) {
    return yield judo.isApplePayAvailableWithConfiguration(configuration);
}

function* logJudoPayFailureEvents(paymentMode, eventData) {
    yield fork(updateFHLogApiCall, paymentMode, eventData);
    let errorMsg =
        paymentMode === PAYMENT_TYPE.GOOGLE_PAY ? ANALYTICS_EVENTS.ANDROID_PAY_ORDER_FAILED : ANALYTICS_EVENTS.APPLE_PAY_ORDER_FAILED;
    Analytics.logEvent(ANALYTICS_SCREENS.QC, errorMsg, eventData);
}

function* updateFHLogApiCall(paymentMode, eventData) {
    try {
        const errorSource =
            paymentMode === PAYMENT_TYPE.GOOGLE_PAY ? ANALYTICS_EVENTS.ANDROID_PAY_ORDER_FAILED : ANALYTICS_EVENTS.APPLE_PAY_ORDER_FAILED;
        const graphqlQuery = getGraphQlQuery(eventData.type, eventData, FH_LOG_ERROR_CODE.JUDO_PAY_FAILURE_ERROR_CODE, errorSource);
        yield fork(makeFHLogApiCall, { graphqlQuery });
    } catch (e) {
        //TODO nothing to handle
    }
}

function* handlePaymentRedirection(response, eventData = null) {
    const { storeID: store_id, cartID: cart_id } = isValidElement(eventData) && eventData;
    let basketData = yield basketUpdateObject({ updateType: BASKET_UPDATE_TYPE.SWIPE_CHECKOUT });
    let cartID = isValidElement(cart_id) ? cart_id : yield select(selectBasketID);
    const config = yield select(getConfiguration);
    const storeID = isValidElement(store_id) ? store_id : getStoreId(config);
    const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
    if (isValidElement(response) && isValidElement(response.isSavedCardTransaction) && response.isSavedCardTransaction) {
        yield put({ type: BASKET_TYPE.RESET_CARD_TRANSACTION_FAILURE });
    }
    if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
        yield put({ type: BASKET_TYPE.NAVIGATION_RESET_TO_HOME_FROM_BASKET, payload: true });
        if (isNonCustomerApp()) {
            yield put({ type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_STORE_ID_CONFIG });
            yield put({ type: MENU_TYPE.RESET_MENU_RESPONSE_ACTION });
            yield fork(makeGetRecentTakeawayCall);
        }
        yield fork(syncProfileForReferral);
        handleNavigation(null, { orderId: cartID, storeID: storeID }, SCREEN_OPTIONS.ORDER_HISTORY.route_name);
        handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
            orderId: cartID,
            storeID: storeID,
            analyticsObj: {
                order_id: cartID,
                store_id: storeID
            }
        });
        yield logConfirmOrder();
        yield logAnalytics(cartID, eventData);
        yield put({ type: BASKET_TYPE.RESET_BASKET });
        yield put({ type: PROFILE_TYPE.UPDATE_REFERRAL_CODE, referralCode: null });
        makeHapticFeedback(featureGateResponse, HapticFrom.ORDER_PLACED);
    } else if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.CHALLENGED) {
        yield put({ type: BASKET_TYPE.SHOW_VERIFY_CVV, payload: true });
    } else if (isValidElement(response) && isValidElement(response.message)) {
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                storeID: storeID,
                cartID: cartID,
                errorMessage: response.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.CARD_ORDER_FAILED_INVALID_CCV_NUMBER, eventData);
        }

        yield put({ type: BASKET_TYPE.CVV, payload: undefined });
        yield fork(swipeBack);
        yield* handleRetryTransaction(response);
    } else if (isValidElement(response) && isValidElement(response.userCancellation) && response.userCancellation === true) {
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                storeID: storeID,
                cartID: cartID,
                errorMessage: response.message
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.CARD_ORDER_CONFIRMATION_FAIL, eventData);
        }
        yield* swipeBack();
    } else {
        yield put({ type: BASKET_TYPE.CVV, payload: undefined });
        if (isValidElement(basketData)) {
            let eventData = {
                customers_id: basketData.customers_id,
                payment_mode: basketData.payment_mode,
                phone: basketData.phone,
                storeID: storeID,
                cartID: cartID,
                errorMessage: LOCALIZATION_STRINGS.WENT_WRONG
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.CARD_ORDER_CONFIRMATION_FAIL, eventData);
        }
        yield fork(swipeBack);
        yield* handleRetryTransaction(response);
    }
}

function* handleRetryTransaction(response) {
    const { isSavedCardTransaction, message } = response ?? {};
    if (isValidElement(isSavedCardTransaction) && isSavedCardTransaction) {
        // if (
        //     isValidString(code) &&
        //     (code === TRANSACTION_FAILURE_CODE.AVS_MISSING ||
        //         code === TRANSACTION_FAILURE_CODE.EXCEEDS_AMOUNT ||
        //         code === TRANSACTION_FAILURE_CODE.REDIRECT_NEW_CARD)
        // ) {
        //     yield makeNewCardPayment(true);
        // } else
        if (AppConfig.SAVED_CARD_PAYMENT_FAILURE_RETRY) {
            yield put({ type: BASKET_TYPE.CARD_TRANSACTION_FAILURE_MESSAGE, payload: message });
            handleNavigation(SCREEN_OPTIONS.TRANSACTION_FAILURE.route_name, null);
        } else {
            showErrorMessage(message);
        }
    } else {
        showErrorMessage(message);
    }
}

function* swipeBack() {
    yield put({ type: BASKET_TYPE.RESTART_AGAIN, payload: new Date() });
}

function* getHostAndCartId() {
    const cartID = yield select(selectBasketID);
    const host = yield select(selectHost);
    return { cartID, host };
}

function* proceedToPaymentFromPBL(actions) {
    try {
        if (yield handleLoginVerification(actions)) {
            const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
            let payment = actions?.payload?.payment;
            const {
                total,
                userID,
                orderId,
                customers_id,
                phone,
                store_id,
                host,
                takeawayName,
                merchant_id,
                email,
                first_name,
                last_name,
                house_number,
                address_line1,
                address_line2
            } = actions.payload;
            if (payment === PAYMENT_TYPE.WALLET) {
                yield proceedWalletFullPayment(
                    total,
                    orderId,
                    featureGateResponse,
                    customers_id,
                    PAYMENT_TYPE.WALLET,
                    phone,
                    store_id,
                    true
                );
            } else if (payment === PAYMENT_TYPE.CARD_FROM_LIST) {
                yield makeCardPayment(true);
            } else if (payment === PAYMENT_TYPE.APPLE_PAY || payment === PAYMENT_TYPE.GOOGLE_PAY) {
                yield* proceedJudoPayment(
                    total,
                    getConsumerReference(merchant_id, orderId),
                    generateMetaDataForJudoPay(
                        orderId,
                        userID,
                        total,
                        host,
                        takeawayName,
                        merchant_id,
                        email,
                        phone,
                        first_name,
                        last_name,
                        house_number,
                        address_line1,
                        address_line2
                    ),
                    getJudoPayLabel(actions.payload.takeawayName),
                    payment,
                    userID,
                    phone,
                    store_id,
                    orderId,
                    'GBP',
                    'GB',
                    true
                );
            } else if (payment === PAYMENT_TYPE.CARD || payment === PAYMENT_TYPE.NEW_CARD) {
                yield proceedNewCardPayment(orderId, host, store_id, userID, payment, phone, featureGateResponse, true);
            }
        }
    } catch (e) {
        yield* swipeBack();
    }
}

function* handleLoginVerification(action) {
    yield putResolve({ type: PROFILE_TYPE.GET_PROFILE, isRequiredBrazeUpdate: false });
    let profileResponse = yield select(selectUserResponse);
    let { first_name, last_name, email, phone } = isValidElement(profileResponse) && profileResponse;
    try {
        if (isValidNotEmptyString(first_name) && isValidNotEmptyString(last_name) && isValidString(email) && isValidString(phone)) {
            return true;
        } else {
            yield put({ type: PROFILE_TYPE.UPDATE_RECENT_PBL, payload: action, isFromPayByLink: true });
            handleNavigation(SCREEN_OPTIONS.PROFILE.route_name, {
                screen: SCREEN_OPTIONS.PROFILE.route_name,
                params: { verified: false, isUpdateProfile: true, isFromPayByLink: true }
            });
        }
    } catch (e) {
        // do Nothing
    }
}

function* proceedNewCardPayment(cartID, host, storeID, customers_id, payment_mode, phone, featureGateResponse, isFromPBL = false) {
    try {
        const response = yield apiCall(BasketNetwork.makePaymentLinkCall, {
            cartId: cartID,
            host: host,
            isAppPBL: isFromPBL
        });
        if (isValidElement(response) && isValidString(response.url)) {
            handleNavigation(SCREEN_OPTIONS.WEBVIEW_PAYMENT.route_name, {
                url: response.url,
                storeID: storeID,
                isFromPBL: isFromPBL,
                cartId: cartID
            });
        } else {
            let eventData = {
                customers_id: customers_id,
                payment_mode: payment_mode,
                phone: phone,
                storeID: storeID,
                cartID: cartID,
                errorMessage: ''
            };
            Analytics.logEvent(ANALYTICS_SCREENS.QC, SEGMENT_EVENTS.NEW_CARD_PAYMENT_ORDER_CONFIRMATION_FAIL, eventData);
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.NEW_CARD_PAYMENT_ORDER_CONFIRMATION_FAIL, eventData);
            yield* swipeBack();
        }
    } catch (e) {
        let eventData = {
            customers_id: customers_id,
            payment_mode: payment_mode,
            phone: phone,
            storeID: storeID,
            cartID: cartID,
            errorMessage: e.message
        };
        Analytics.logEvent(ANALYTICS_SCREENS.QC, SEGMENT_EVENTS.NEW_CARD_PAYMENT_ORDER_CONFIRMATION_FAIL, eventData);
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.NEW_CARD_PAYMENT_ORDER_CONFIRMATION_FAIL, eventData);
        showErrorMessage(e);
        yield* swipeBack();
    }
}

function* proceedWalletFullPayment(total, cartID, featureGateResponse, customers_id, payment_mode, phone, orderStoreID, fromPBL) {
    try {
        const response = yield apiCall(BasketNetwork.makeWalletFullPayment, {
            cartId: cartID,
            totalAmount: total,
            isAppPBL: fromPBL
        });
        yield fork(
            validatePaymentResponse,
            response,
            cartID,
            featureGateResponse,
            customers_id,
            payment_mode,
            phone,
            orderStoreID,
            fromPBL
        );
    } catch (e) {
        let eventData = {
            customers_id: customers_id,
            payment_mode: payment_mode,
            phone: phone,
            storeID: orderStoreID,
            cartID: cartID,
            errorMessage: e.message
        };
        Analytics.logEvent(ANALYTICS_SCREENS.QC, SEGMENT_EVENTS.WALLET_ORDER_CONFIRMATION_FAIL, eventData);
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.WALLET_ORDER_CONFIRMATION_FAIL, eventData);
        showErrorMessage(e);
        yield* swipeBack();
    }
}

function* proceedJudoPayment(
    total,
    consumerRef,
    metaData,
    label,
    paymentMode,
    customers_id,
    phone,
    orderStoreID,
    cartID,
    currency,
    countryCode,
    isFromPBL = false
) {
    const auth: JudoAuthorization = AppConfig.JudoKit.isSandBox
        ? { token: AppConfig.JudoKit.sandbox_token, secret: AppConfig.JudoKit.sandbox_secret }
        : { token: AppConfig.JudoKit.token, secret: AppConfig.JudoKit.secret };
    const judo = new Judo(auth);
    judo.isSandboxed = AppConfig.JudoKit.isSandBox;
    let amount = isValidString(total) ? total : '0.00';

    const paymentDetails: JudoAmount = {
        value: amount,
        currency: currency
    };
    const reference: JudoReference = {
        consumerReference: consumerRef,
        paymentReference: paymentReference(),
        metadata: metaData
    };
    const configuration: JudoConfiguration = {
        judoId: AppConfig.JudoKit.judoId,
        amount: paymentDetails,
        reference: reference,
        isInitialRecurringPayment: false,
        applePayConfiguration: {
            merchantId: AppConfig.JudoKit.merchantId,
            countryCode: countryCode,
            paymentSummaryItems: [
                {
                    label: label,
                    amount: amount
                }
            ]
        }
    };
    const cardNetworks = JudoCardNetwork.Visa | JudoCardNetwork.Mastercard;
    // const JudoBillingAddressParameters = {
    //     addressFormat: JudoAddressFormat.MINIMAL,
    //     isPhoneNumberRequired: false
    // };
    // const JudoShippingAddressParameters = {
    //     allowedCountryCodes: ['GB', 'US'],
    //     isPhoneNumberRequired: false
    // };
    const googleConfiguration: JudoConfiguration = {
        judoId: AppConfig.JudoKit.googleJudoId,
        amount: paymentDetails,
        reference: reference,
        isInitialRecurringPayment: false,
        uiConfiguration: {
            isAVSEnabled: true,
            shouldPaymentMethodsDisplayAmount: true,
            shouldPaymentButtonDisplayAmount: true,
            shouldPaymentMethodsVerifySecurityCode: true
        },
        supportedCardNetworks: cardNetworks,
        googlePayConfiguration: {
            countryCode: 'GB',
            environment: AppConfig.JudoKit.isSandBox ? JudoGooglePayEnvironment.TEST : JudoGooglePayEnvironment.PRODUCTION,
            isEmailRequired: true,
            isBillingAddressRequired: false,
            isShippingAddressRequired: false
        }
    };
    let appleResponse = {};
    appleResponse.isSavedCardTransaction = false;
    let eventData = {
        customers_id: customers_id,
        payment_mode: paymentMode,
        phone: phone,
        storeID: orderStoreID,
        cartID: cartID
    };
    try {
        let response =
            paymentMode === PAYMENT_TYPE.GOOGLE_PAY
                ? yield judo.invokeGooglePay(JudoTransactionType.Payment, googleConfiguration)
                : yield iApplePayAvailable(judo, configuration)
                      ? yield judo.invokeApplePay(JudoTransactionType.Payment, configuration)
                      : null;

        if (isValidElement(response) && isValidElement(response.result)) {
            if (!isNaN(response.result)) {
                if (response.result === 0) {
                    appleResponse.outcome = T2SBaseConstants.SUCCESS;
                } else {
                    appleResponse.message = isValidString(response.message) ? response.message : LOCALIZATION_STRINGS.PAYMENT_FAILED;
                    appleResponse.outcome = T2SBaseConstants.FAILED;

                    eventData.errorMessage = appleResponse.message;
                    eventData.response = JSON.stringify(response);
                    eventData.type = 'INVALID_RESULT';
                    yield fork(logJudoPayFailureEvents, paymentMode, eventData);
                }
            } else {
                appleResponse.message = LOCALIZATION_STRINGS.PAYMENT_FAILED;
                appleResponse.outcome = T2SBaseConstants.FAILED;

                eventData.errorMessage = appleResponse.message;
                eventData.response = JSON.stringify(response);
                eventData.type = 'NAN';
                yield fork(logJudoPayFailureEvents, paymentMode, eventData);
            }
        } else {
            appleResponse.message = LOCALIZATION_STRINGS.PAYMENT_FAILED;
            appleResponse.outcome = T2SBaseConstants.FAILED;

            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(response);
            eventData.type = 'INVALID_RESPONSE';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        }
        yield* handlePaymentRedirection(appleResponse, eventData, isFromPBL);
    } catch (error) {
        let applePayResponse = {};
        applePayResponse.isSavedCardTransaction = false;
        if (error.code === 'JUDO_USER_CANCELLED') {
            applePayResponse.userCancellation = true;
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(error);
            eventData.type = 'JUDO_USER_CANCELLED';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
            //Do Nothing except Cancel the operation using swipeback done at the end of the block.
        } else if (error.code === 'JUDO_ERROR' && error.userInfo && error.userInfo.result === 'Declined') {
            applePayResponse.message = LOCALIZATION_STRINGS.CARD_DECLINED;
            Analytics.logEvent(
                ANALYTICS_SCREENS.QC,
                paymentMode === PAYMENT_TYPE.GOOGLE_PAY ? SEGMENT_EVENTS.ANDROID_PAY_CARD_DECLINED : SEGMENT_EVENTS.APPLE_PAY_CARD_DECLINED
            );
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(error);
            eventData.type = 'CARD_DECLINED';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        } else {
            applePayResponse.message = error.message || LOCALIZATION_STRINGS.APP_SOMETHING_WENT_WRONG;
            eventData.errorMessage = appleResponse.message;
            eventData.response = JSON.stringify(error);
            eventData.type = 'EXCEPTION';
            yield fork(logJudoPayFailureEvents, paymentMode, eventData);
        }
        yield* handlePaymentRedirection(applePayResponse, eventData);
    }
}

function* makeServiceChargeCall() {
    try {
        const cartID = yield select(selectBasketID);
        const response = yield apiCall(BasketNetwork.makeServiceChargeCall, { cartId: cartID });
        if (isArrayNonEmpty(response?.data) && response?.outcome === T2SBaseConstants.SUCCESS) {
            return response.data;
        }
        return null;
    } catch (e) {
        //
    }
}

function* QuickCheckoutSaga() {
    yield all([
        takeLatest(QC_ACTION_TYPE.PROCEED_CHECKOUT_ACTION_TYPE, proceedCheckoutCall),
        takeLatest(BASKET_TYPE.MAKE_CASH_ORDER, makeCashPayment),
        takeLatest(BASKET_TYPE.MAKE_CASH_ORDER, swipeBack),
        takeLatest(SEGMENT_EVENTS.ORDER_PLACED, logConfirmOrder),
        takeLatest(BASKET_TYPE.PROCEED_TO_PAYMENT_FLOW, proceedToPaymentFromPBL)
    ]);
}

export default QuickCheckoutSaga;
