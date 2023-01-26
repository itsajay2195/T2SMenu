import {
    isFoodHubApp,
    isValidElement,
    isValidNumber,
    isValidString,
    isValidNotEmptyString,
    safeIntValue,
    isCustomerApp,
    isArrayNonEmpty
} from 't2sbasemodule/Utils/helpers';
import { isUKApp } from '../../BaseModule/GlobalAppHelper';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import {
    formatPostcodeFormatUK,
    isValidPostCode,
    postcodeValidationFormatter,
    validAlphaNumericRegex
} from 't2sbasemodule/Utils/ValidationUtil';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { all, fork, putResolve, select, takeLeading, put } from 'redux-saga/effects';
import { getTakeawayList, updateStoreID } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSaga';
import { TAKEAWAY_SEARCH_LIST_TYPE } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListType';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { appBase } from '../../../CustomerApp/Network/AppBaseNetwork';
import { Linking } from 'react-native';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';
import { ROUTER_LIST_IDENTIFIER } from '../Utils/Constants';
import { logStoreConfigResponse, updateStoreConfigResponse } from '../../../CustomerApp/Saga/AppSaga';

import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { CommonActions } from '@react-navigation/native';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import {
    selectUserResponse,
    selectHasUserLoggedIn,
    selectS3Response,
    selectCountry,
    selectStoreConfigResponse
} from 't2sbasemodule/Utils/AppSelectors';
import { PROFILE_TYPE } from '../../ProfileModule/Redux/ProfileType';
import { checkDeepLinkMenuParamsExist } from '../../TakeawayDetailsModule/Utils/TakeawayDetailsHelper';
import { HOME_TYPE } from '../../../FoodHubApp/HomeModule/Redux/HomeType';
import { getReferralCampaignStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { selectCartItems, selectCountryBaseFeatureGateResponse } from '../../BasketModule/Redux/BasketSelectors';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { convertLatLngToString } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { makeStoreConfigCall } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsSaga';
import { makeGetOrderDetailsCall } from '../../OrderManagementModule/Redux/OrderManagementSaga';
import { selectOrderDetailsResponse } from '../../QuickCheckoutModule/Utils/QCSelector';
import { DATE_FORMAT, getBusinessMomentForDate } from 't2sbasemodule/Utils/DateUtil';
import { PBL_ORDER_STATUS } from '../../QuickCheckoutModule/Utils/PaymentConst';
import { basketUpdateObject } from '../../BasketModule/Redux/BasketSaga';
import { BasketNetwork } from '../../BasketModule/Network/BasketNetwork';
import moment from 'moment-timezone';
import { isTableReservationEnabled } from '../../TableReservationModule/Utils/TableReservationHelpers';

var parser = require('url-parse');

function* handleOtherCountryTakeawayList(countryID, query) {
    try {
        yield fork(getTakeawayList, {
            lat: query.lat,
            lng: query.lng,
            searchByAddress: true,
            addressObj: {
                description: ''
            },
            description: ''
        });
        const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        const s3ConfigResponse = yield select(selectS3Response);
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
            country_code: s3ConfigResponse?.country?.iso,
            search: convertLatLngToString(query),
            method: 'deep_link'
        });
    } catch (e) {
        // Nothing
    }
}

function* handleUKTakeawayList(countryID, paths) {
    try {
        let location, town;
        if (paths.length > 2) {
            location = paths[2];
        }
        if (!isValidElement(location)) {
            return;
        } else if (isValidString(location)) {
            location = location.replace(/%20/g, ' ');
        }
        let postCode = location;
        if (isValidString(paths[3]) || isValidPostCode(postCode, countryID)) {
            let formatPostcode = isValidString(paths[3]) ? paths[3] : postCode;
            postCode = formatPostcodeFormatUK(postcodeValidationFormatter(formatPostcode)).toUpperCase();
        } else {
            town = location;
        }
        handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
        const featureGateResponse = yield select(selectCountryBaseFeatureGateResponse);
        const s3ConfigResponse = yield select(selectS3Response);
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
            country_code: s3ConfigResponse?.country?.iso,
            search: postCode,
            method: 'deep_link'
        });

        yield putResolve({
            type: TAKEAWAY_SEARCH_LIST_TYPE.GET_TAKEAWAY_LIST,
            postCode,
            searchByAddress: false,
            orderType: ORDER_TYPE.DELIVERY,
            town
        });
    } catch (e) {
        showErrorMessage(e.message);
    }
}

function getTimeDifferenceBetweenCurrentTimeFromOrderPlaced(timeZone, delivery_time) {
    if (isValidElement(timeZone) && isValidElement(delivery_time)) {
        let storeLocalTime = moment()
            .tz(timeZone)
            .format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
        let deliveryTime = moment(delivery_time).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
        return moment(storeLocalTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(deliveryTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS));
    }
}

function getFormattedDeliveryTimeInMinutes(timeZone, delivery_time, returnAsSec = false) {
    if (isValidElement(timeZone) && timeZone) {
        let timeDifference = getTimeDifferenceBetweenCurrentTimeFromOrderPlaced(timeZone, delivery_time);
        let duration = moment.duration(timeDifference);
        if (returnAsSec) {
            return duration.as('seconds');
        } else {
            let hour = Math.floor(duration.asHours());

            if (duration._milliseconds < 0) {
                return '0';
            } else {
                return hour * 60 + parseInt(moment.utc(timeDifference).format('m'));
            }
        }
    }
    return '0';
}

const getOrderStatus = (orderDetails) => {
    if (isValidElement(orderDetails) && isValidElement(orderDetails.data)) {
        const { payment, order_placed_on, time_zone, status } = orderDetails.data;
        if (isValidElement(order_placed_on) && isValidElement(time_zone)) {
            const orderPlacedTime = getBusinessMomentForDate(order_placed_on, time_zone);
            const duration = getFormattedDeliveryTimeInMinutes(time_zone, orderPlacedTime);

            if (safeIntValue(payment) !== 3 && duration < 45 && status === '0') {
                return PBL_ORDER_STATUS.READY_TO_PAY;
            } else if (safeIntValue(payment) === 3) {
                return PBL_ORDER_STATUS.ALREADY_PAID;
            } else if (duration >= 45) {
                return PBL_ORDER_STATUS.EXPIRED_ORDER;
            }
        } else {
            return PBL_ORDER_STATUS.INVAILD_ORDER;
        }
    }
    return PBL_ORDER_STATUS.INVAILD_ORDER;
};

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

function* getOrderDetails(orderId, host, cutomerID, url, store) {
    try {
        yield makeGetOrderDetailsCall({
            orderId,
            refreshDriver: false,
            storeID: store,
            fromPBL: true
        });

        const response = yield select(selectOrderDetailsResponse);
        const ORDER_PBL_STATUS = getOrderStatus(response);
        switch (ORDER_PBL_STATUS) {
            case PBL_ORDER_STATUS.READY_TO_PAY: {
                handleNavigation(SCREEN_OPTIONS.PBL_PAGE_PAYMENT.route_name, {
                    orderId,
                    host,
                    cutomerID,
                    url,
                    isFromPBL: true
                });
                break;
            }
            case PBL_ORDER_STATUS.EXPIRED_ORDER: {
                showErrorMessage('Link had been is Expired');
                break;
            }
            case PBL_ORDER_STATUS.ALREADY_PAID: {
                showErrorMessage('Order has been paid already');
                break;
            }
            case PBL_ORDER_STATUS.INVAILD_ORDER: {
                showErrorMessage('Invalid Order');
                Linking.openURL(url);
                break;
            }
        }
    } catch (e) {
        Linking.openURL(url);
        showErrorMessage('Invalid Order');
    }
}

function* handlePBLLink(action) {
    const { host, orderId, cutomerID, url, store } = action;
    yield updateStoreID({ storeID: store });
    yield makeStoreConfigCall({});
    yield put({ type: PROFILE_TYPE.RESET_PBL });

    if (yield handleLoginVerification(action)) {
        try {
            const data = yield basketUpdateObject({
                type: 'update_basket',
                updateType: 'view',
                allergyInfo: '',
                coupon: undefined,
                newBasketId: undefined,
                isPblOrder: true
            });
            yield apiCall(BasketNetwork.makeUpdateBasketCall, { data, cartID: orderId });
            yield getOrderDetails(orderId, host, cutomerID, url, store);
        } catch (e) {
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
            Linking.openURL(url);
        }
    }
}

function* handleRedirectTakeawayPage(countryID, paths, appLink) {
    try {
        let storeConfigResponse = {},
            storeIdInLink = false;
        let town, slug_name;
        if (countryID === T2SConfig.country.UK) {
            if (isValidElement(paths) && isValidNumber(paths[paths?.length - 1])) {
                // divide by 5 done to get store_id
                yield updateStoreID({ storeID: paths[paths?.length - 1] / 5 });
                storeIdInLink = true;
                storeConfigResponse = yield apiCall(appBase.makeStoreConfigCall);
                yield fork(logStoreConfigResponse, storeConfigResponse);
                yield fork(updateStoreConfigResponse, {
                    payload: storeConfigResponse
                });
            } else {
                town = paths[1]?.replace('/-/g', ' ');
                slug_name = paths[2];
            }
            if (isValidString(town) && isValidString(slug_name) && !storeIdInLink) {
                ///todo: get key name same as in consumer/store from API Team
                town = decodeURIComponent(town);
                slug_name = decodeURIComponent(slug_name);
                storeConfigResponse = yield apiCall(appBase.makeStoreDetailsFromSlagAPICall, {
                    slug_name: slug_name,
                    town
                });
            }
            if (isValidElement(storeConfigResponse?.data) && isValidElement(storeConfigResponse?.data[0]) && !storeIdInLink) {
                ///call store config if expected values are not coming
                storeConfigResponse = storeConfigResponse?.data[0];
                yield updateStoreID({ storeInfo: storeConfigResponse });
                if (!checkDeepLinkMenuParamsExist(storeConfigResponse)) {
                    storeConfigResponse = yield apiCall(appBase.makeStoreConfigCall);
                }
                yield fork(logStoreConfigResponse, storeConfigResponse);
                yield fork(updateStoreConfigResponse, {
                    payload: storeConfigResponse
                });
            }
        } else if (countryID !== T2SConfig.country.UK && paths.length >= 5) {
            let storeId = isValidElement(paths[4]) ? paths[4] / 5 : 0;
            yield updateStoreID({ storeID: storeId });
            storeConfigResponse.id = storeId;
        }

        let routeScreen = '';
        yield putResolve({
            type: TAKEAWAY_SEARCH_LIST_TYPE.RESET_TAKEAWAY_LIST
        });
        if (appLink.includes(ROUTER_LIST_IDENTIFIER.TAKEAWAY_MENU_PAGE) || appLink.includes(ROUTER_LIST_IDENTIFIER.CA_TAKEAWAY_MENU_PAGE)) {
            handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
                isFromReOrder: false,
                isFromRecentTakeAway: true,
                storeConfig: storeConfigResponse
            });
            Analytics.logAction(ANALYTICS_SCREENS.DEEP_LINK, ANALYTICS_EVENTS.DEEP_LINKING_OPENED);
            return;
        } else if (appLink.endsWith(ROUTER_LIST_IDENTIFIER.TAKEAWAY_INFO_PAGE)) {
            routeScreen = [{ name: SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name, params: { isFromMenu: true } }];
        } else if (appLink.endsWith(ROUTER_LIST_IDENTIFIER.TAKEAWAY_REVIEWS_PAGE) || appLink.endsWith(ROUTER_LIST_IDENTIFIER.CA_REVIEW)) {
            routeScreen = [{ name: SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name, params: { isFromMenu: true } }];
        }
        NavigationService.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: SCREEN_OPTIONS.HOME.route_name },
                    {
                        name: SCREEN_OPTIONS.MENU_SCREEN.route_name,
                        params: { isFromReOrder: false, isFromRecentTakeAway: true, storeConfig: storeConfigResponse }
                    },
                    ...routeScreen
                ]
            })
        );
    } catch (e) {
        showErrorMessage(e.message);
    }
}

function* deepLinkToPage(action) {
    if (isValidElement(action.payload)) {
        const appLink = action.payload.trim();
        try {
            var appLinkURL = parser(appLink, true);
            let paths = appLinkURL?.pathname?.split('/');
            let countryID = yield select(selectCountry);
            Analytics.logAction(ANALYTICS_SCREENS.DEEP_LINK, ANALYTICS_EVENTS.DEEP_LINKING_RECEIVED);
            if (isFoodHubApp()) {
                yield checkForReferral(appLink, appLinkURL, countryID);
            }
            if (appLinkURL?.pathname?.trim().length !== 1) {
                if (isValidElement(paths) && paths.length >= 0) {
                    //todo: if already in same screen, deeplink to same screen shouldn't go to home and re navigate
                    yield put({ type: HOME_TYPE.SET_APP_CURRENT_STATE, payload: true });
                    handleNavigation(SCREEN_OPTIONS.HOME.route_name);

                    if (paths.includes(ROUTER_LIST_IDENTIFIER.FH_THRID_PART_OFFER)) {
                        //TODO Have to handle the third party offer flow
                    } else if (paths.includes(ROUTER_LIST_IDENTIFIER.UK_TAKEAWAY_LIST_PAGE)) {
                        if (countryID === T2SConfig.country.UK) {
                            yield fork(handleUKTakeawayList, countryID, paths);
                        } else {
                            handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                            yield fork(handleOtherCountryTakeawayList, countryID, appLinkURL.query);
                        }
                    } else if (paths.includes(ROUTER_LIST_IDENTIFIER.UK_TAKEAWAY_LOCATION_PAGE)) {
                        yield fork(handleUKTakeawayList, countryID, paths);
                    } else if (
                        isValidString(appLink) &&
                        (appLink.includes(ROUTER_LIST_IDENTIFIER.TAKEAWAY_MENU_PAGE) ||
                            appLink.includes(ROUTER_LIST_IDENTIFIER.CA_TAKEAWAY_MENU_PAGE) ||
                            appLink.endsWith(ROUTER_LIST_IDENTIFIER.TAKEAWAY_INFO_PAGE) ||
                            appLink.endsWith(ROUTER_LIST_IDENTIFIER.TAKEAWAY_REVIEWS_PAGE))
                    ) {
                        yield fork(handleRedirectTakeawayPage, countryID, paths, appLink);
                    } else if (isCustomerApp() && appLink.endsWith(ROUTER_LIST_IDENTIFIER.CA_REVIEW)) {
                        handleNavigation(SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name, { isFromMenu: true });
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FOODHUB_TOTAL_SAVINGS_PAGE)) {
                        handleNavigation(SCREEN_OPTIONS.TOTAL_SAVINGS.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FH_TERMS_AND_USE)) {
                        handleNavigation(SCREEN_OPTIONS.TERMS_OF_USE.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FH_TERMS_AND_CONDITION)) {
                        handleNavigation(SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.CA_CONTACT_US)) {
                        handleNavigation(SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FH_ABOUT_US)) {
                        handleNavigation(SCREEN_OPTIONS.ABOUT_US.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FH_PRIVACY)) {
                        handleNavigation(SCREEN_OPTIONS.PRIVACY_POLICY.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FH_ALLERGY)) {
                        handleNavigation(SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name);
                    } else if (paths.includes(ROUTER_LIST_IDENTIFIER.FH_NOTIFICATION)) {
                        handleNavigation(SCREEN_OPTIONS.NOTIFICATIONS.route_name);
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.FH_SIGN_UP)) {
                        const isLoggedInUser = yield select(selectHasUserLoggedIn);
                        if (isLoggedInUser !== true) {
                            handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
                        } else {
                            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
                        }
                    } else if (appLink.includes(ROUTER_LIST_IDENTIFIER.PAY_BY_LINK) && isUKApp(countryID)) {
                        let orderDetails = action.payload;
                        if (isValidString(orderDetails)) {
                            let orderId = isValidString(paths[2]) && paths[2];
                            let host = null;
                            let store = null;
                            let cutomerID = null;

                            let orderData = orderDetails.split('&');
                            for (const orderDataKey in orderData) {
                                let obj = orderData[orderDataKey].split('=');
                                if (obj.length === 2) {
                                    switch (obj[0]) {
                                        case 'host':
                                            host = obj[1];
                                            break;
                                        case 'storeId':
                                            store = obj[1];
                                            break;
                                    }
                                }
                            }
                            let url = `https://${host}/paybylink/${orderId}?source=qr&product=MY-TAKEAWAY`;
                            let userLoggedIn = yield select(selectHasUserLoggedIn);
                            if (userLoggedIn) {
                                yield* handlePBLLink({ host, orderId, cutomerID, url, store });
                            } else {
                                handleNavigation(SCREEN_OPTIONS.HOME.route_name);
                                Linking.openURL(url);
                            }
                        }
                    } else if (paths.includes(ROUTER_LIST_IDENTIFIER.FH_BASKET)) {
                        const cartItems = yield select(selectCartItems);
                        if (isArrayNonEmpty(cartItems)) {
                            handleNavigation(SCREEN_OPTIONS.BASKET.route_name);
                        } else {
                            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
                        }
                    } else if (isCustomerApp() && paths.includes(ROUTER_LIST_IDENTIFIER.TABLE_BOOKING)) {
                        let storeConfigResponse = yield select(selectStoreConfigResponse);
                        if (!isValidElement(storeConfigResponse)) {
                            yield makeStoreConfigCall();
                            storeConfigResponse = yield select(selectStoreConfigResponse);
                        }
                        if (isTableReservationEnabled(storeConfigResponse?.booking_page)) {
                            handleNavigation(SCREEN_OPTIONS.TABLE_BOOKING.route_name);
                        }
                    }
                    Analytics.logAction(ANALYTICS_SCREENS.DEEP_LINK, ANALYTICS_EVENTS.DEEP_LINKING_OPENED);
                } else {
                    Linking.openURL(appLink);
                }
            } else {
                handleNavigation(SCREEN_OPTIONS.HOME.route_name);
            }
        } catch (e) {
            Analytics.logAction(ANALYTICS_SCREENS.DEEP_LINK, ANALYTICS_EVENTS.DEEP_LINKING_FAILED);
        }
    }
}

function* checkForReferral(appLink, appLinkURL, countryID) {
    const featureGate = yield select(selectCountryBaseFeatureGateResponse);
    if (
        isFoodHubApp() &&
        isUKApp(countryID) &&
        getReferralCampaignStatus(featureGate) &&
        appLink?.includes(ROUTER_LIST_IDENTIFIER.FH_REFERRAL)
    ) {
        if (isValidElement(appLinkURL?.query?.referral)) {
            const { referral } = appLinkURL.query;
            Analytics.logEvent(ANALYTICS_SCREENS.HOME, ANALYTICS_EVENTS.REFERRAL_CLICKED, { code: referral });
            if (validAlphaNumericRegex(referral)) {
                yield put({ type: PROFILE_TYPE.UPDATE_REFERRAL_CODE, referralCode: referral });
            } else {
                Analytics.logEvent(ANALYTICS_SCREENS.HOME, ANALYTICS_EVENTS.REFERRAL_INVALID, { code: referral });
            }
        }
    }
}

function* RouterSaga() {
    yield all([takeLeading(TYPES_CONFIG.DEEPLINK_TO_PAGE, deepLinkToPage), takeLeading(TYPES_CONFIG.PBL_TO_PAY, handlePBLLink)]);
}
export default RouterSaga;
