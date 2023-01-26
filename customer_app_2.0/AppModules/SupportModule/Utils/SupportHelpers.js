import { Platform } from 'react-native';
import { ZohoSupport } from '../../../CustomerApp/NativeModules/ZohoDesk';
import {
    isArrayNonEmpty,
    isBoolean,
    isFoodHubApp,
    isValidElement,
    isValidString,
    normalizePhoneNo,
    safeFloatValue,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { getAPIAccessToken, getEmail, getPhoneNumber, getUserName } from '../../BaseModule/Helper';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import parsePhoneNumber from 'libphonenumber-js';
import { DEFAULT_CHAT_BOT_DURATION, HELP_OPTIONS_TYPE, UPDATE_MISSING_ITEMS } from './SupportConstants';
import { ORDER_STATUS, ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { OnGoingOrderHelpData, PreviousOrderHelpData } from './OrderHelpConstantsData';
import {
    DATE_FORMAT,
    getBusinessMomentForDate,
    getCurrentMoment,
    isLessThenOneMin,
    isMOreThen1MinsAndLessThen15Mins
} from 't2sbasemodule/Utils/DateUtil';
import moment from 'moment-timezone';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { isDeliverOrder } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { MISSING_ITEM } from '../../OrderManagementModule/Utils/OrderManagementConstants';

export const getJwt = (id) => {
    return ZohoSupport.identifyJWT(id.toString());
};

export const showZendeskHelpCenter = (id, selectedLanguage) => {
    getJwt(id);
    if (Platform.OS === 'ios') {
        ZohoSupport.showHelpCenter(selectedLanguage);
    } else {
        ZohoSupport.showHelpCenter({});
    }
};

export const getStorePhoneNumber = (orderDetails) => {
    if (
        isValidElement(orderDetails) &&
        isValidElement(orderDetails.data) &&
        isValidElement(orderDetails.data.store) &&
        isValidElement(orderDetails.data.store.phone)
    ) {
        return orderDetails.data.store.phone;
    }
};
export const getPhonenumberLink = (phonenumber, countryCode) => {
    if (isValidString(phonenumber)) {
        const phoneNumber = parsePhoneNumber(phonenumber, countryCode);
        return `+${normalizePhoneNo(phoneNumber.formatInternational())}`;
    }
    return phonenumber;
};

export const getDriverName = (orderDetails) => {
    if (isValidElement(orderDetails) && isValidElement(orderDetails.driver) && isValidElement(orderDetails.driver.name)) {
        return orderDetails.driver.name.trim();
    }
    return '';
};
export const getDriverPhone = (orderDetails) => {
    if (isValidElement(orderDetails) && isValidElement(orderDetails.driver) && isValidElement(orderDetails.driver.phone)) {
        return orderDetails.driver.phone;
    }
    return '';
};

export const showMyTickets = (profileResponse) => {
    //getJwt(id);
    return ZohoSupport.showMyTicket(
        getEmail(profileResponse),
        getUserName(profileResponse),
        getPhoneNumber(profileResponse),
        getAPIAccessToken(profileResponse),
        AppConfig.zohoSupport.departmentID
    );
};

export const showLiveAgentChat = (profileResponse, orderId = '') => {
    if (isValidElement(profileResponse)) {
        return ZohoSupport.showChat(getEmail(profileResponse), getUserName(profileResponse), getPhoneNumber(profileResponse), 'Hi');
    }
};
export const submitNewTicket = (profileResponse, description) => {
    //getJwt(id);
    return ZohoSupport.submitNewTicket(
        getEmail(profileResponse),
        getUserName(profileResponse),
        getAPIAccessToken(profileResponse),
        `${LOCALIZATION_STRINGS.TICKET_FROM} ${getUserName(profileResponse)}`,
        isValidString(description) ? description : '',
        AppConfig.zohoSupport.departmentID
    );
};
export const showContactSupport = (profileResponse, orderId = '') => {
    if (isValidElement(profileResponse)) {
        return ZohoSupport.showNewTicket(
            getEmail(profileResponse),
            getUserName(profileResponse),
            getPhoneNumber(profileResponse),
            getAPIAccessToken(profileResponse),
            AppConfig.zohoSupport.departmentID
        );
    }
};

export const updateMissingItems = (itemData, type = UPDATE_MISSING_ITEMS.INITIAL, selectedItems, itemId, addonItem, updatedType) => {
    let updatedData;
    if (isValidElement(itemData) && itemData.length > 0)
        switch (type) {
            case UPDATE_MISSING_ITEMS.INITIAL:
                updatedData = itemData.map((items) => ({
                    ...items,
                    isSelected: false,
                    type: null,
                    addons:
                        isValidElement(items.addons) && items.addons.length > 0
                            ? items.addons.map((addonItems) => ({
                                  ...addonItems,
                                  isSelected: false,
                                  type: null
                              }))
                            : []
                }));
                return updatedData;
            case UPDATE_MISSING_ITEMS.SELECTED_ITEM:
                updatedData = itemData.map((items) => {
                    if (isValidElement(items)) {
                        const newItem = {
                            ...items,
                            isSelected: selectedItems.id === items.id ? !items.isSelected : items.isSelected
                        };
                        if (selectedItems.id === newItem.id) {
                            if (newItem.type !== MISSING_ITEM) {
                                newItem.type = MISSING_ITEM;
                            } else if (isValidString(items.type) && newItem.type === MISSING_ITEM) {
                                newItem.type = '';
                            }
                        }
                        return newItem;
                    }
                });
                return updatedData;
            case UPDATE_MISSING_ITEMS.SELECTED_ADDON_ITEMS:
                updatedData = itemData.map((items) => {
                    return {
                        ...items,
                        addons:
                            isValidElement(items?.addons) &&
                            items.addons.map((addon) => {
                                if (items.id === itemId && addon.id === addonItem.id) {
                                    if (addonItem?.type !== MISSING_ITEM) {
                                        addon.type = MISSING_ITEM;
                                    } else if (isValidString(addon.type) && addon?.type === MISSING_ITEM) {
                                        addon.type = '';
                                    }
                                }
                                return {
                                    ...addon,
                                    isSelected: items.id === itemId && addon.id === addonItem.id ? !addonItem.isSelected : addon.isSelected
                                };
                            })
                    };
                });
                return updatedData;
            case UPDATE_MISSING_ITEMS.SELECTED_ALL_ITEMS:
                updatedData = itemData.map((items) => ({
                    ...items,
                    isSelected: selectedItems,
                    type: items?.type === MISSING_ITEM ? '' : MISSING_ITEM,
                    addons:
                        isValidElement(items.addons) &&
                        items.addons.map((addonItems) => ({
                            ...addonItems,
                            isSelected: selectedItems,
                            type: addonItems?.type === MISSING_ITEM ? '' : MISSING_ITEM
                        }))
                }));
                return updatedData;
        }
};
export const getMissingAddonItems = (addonData) => {
    let missingItems = addonData.filter((items) => {
        return items.isSelected;
    });
    return missingItems;
};
export const getMissingItems = (data) => {
    let allItems = data;
    let missingItemsText = '';
    if (isArrayNonEmpty(allItems)) {
        allItems.forEach((item, i) => {
            missingItemsText += `${i + 1}. ${item.name} - ${item.menu_price} ${item.isSelected ? '- (Missing)' : ''}\n`;
            if (item.addons.length > 0)
                item.addons.forEach((addon, j) => {
                    missingItemsText += `${j + 2}. ${addon.name} - ${addon.menu_price} ${addon.isSelected ? '- (Missing)' : ''}\n`;
                });
        });
    }
    return missingItemsText;
};

export const filterMissingItems = (missingItems) => {
    let missingItemData = [];
    let missingAddonItem = [];
    if (isValidElement(missingItems))
        for (let i in missingItems) {
            if (isValidElement(missingItems[i].type) && missingItems[i].type === MISSING_ITEM) {
                missingItemData.push(missingItems[i]);
            }
            if (isArrayNonEmpty(missingItems[i].addons)) {
                missingAddonItem = missingItems[i].addons.filter((addonsItem) => {
                    return addonsItem.type === MISSING_ITEM;
                });
                if (missingAddonItem.length > 0) {
                    missingItemData.push(missingItems[i]);
                }
            }
        }
    return { item: [...missingItemData] };
};

export const isMissingItemsAvailable = (updateItems) => {
    if (isValidElement(updateItems) && updateItems.length > 0) {
        let missingItems = updateItems.filter((items) => {
            if (isValidElement(items.addons) && items.addons.length > 0 && getMissingAddonItems(items.addons).length > 0) {
                return items;
            } else if (items.isSelected) {
                return items;
            }
        });
        return missingItems.length > 0;
    } else {
        return false;
    }
};

export const isSelectedItem = (renderItem, selectedItem) => {
    return isValidElement(renderItem) && isValidElement(selectedItem) && renderItem.id === selectedItem.id;
};

export const isAllSelectedItems = (items, isAddon = false) => {
    let allItems = items.filter((item) => {
        if (item.addons.length > 0) {
            return getMissingAddonItems(item.addons).length === item.addons.length && item.isSelected;
        } else {
            return item.isSelected;
        }
    });
    return allItems.length === items.length;
};

export const getOngoingOrderOptions = (order, timezone) => {
    let timeZone = isValidString(order?.time_zone) ? order?.time_zone : timezone;
    if (isValidElement(order) && isValidElement(order.order_placed_on) && isValidElement(timeZone)) {
        let mainData = OnGoingOrderHelpData();
        if (isLessThenOneMin(order.order_placed_on, timeZone)) {
            mainData.splice(3, 1);
            return mainData;
        } else if (
            isMOreThen1MinsAndLessThen15Mins(order.order_placed_on, timeZone) &&
            order.status <= safeFloatValue(ORDER_STATUS.PLACED) &&
            order.sending !== ORDER_TYPE.WAITING
        ) {
            return mainData.map((item) => ({
                ...item,
                isDropDownAvailable: item.type === HELP_OPTIONS_TYPE.CANCEL_ORDER ? false : item.isDropDownAvailable
            }));
        } else {
            return mainData;
        }
    }
};

export const getPreviousOrderOptions = (order) => {
    let updateList = PreviousOrderHelpData();
    //TODO need to JAY confirmation
    // if (!isNonCancelledOrder(order)) {
    //     updateList.splice(0, 4);
    //     return updateList;
    // } else
    if (isCashOrder(order) || isNonCancelledOrder(order)) {
        updateList.splice(3, 1);
        return updateList;
    } else {
        return updateList;
    }
};

export const isCashOrder = (order) => {
    return (
        isValidElement(order) &&
        isValidElement(order.total_paid_by_card) &&
        isValidElement(order.total_paid_by_wallet) &&
        parseFloat(order.total_paid_by_card) === 0.0 &&
        parseFloat(order.total_paid_by_wallet) === 0.0
    );
};

export const isWalletOrder = (orderDetails) => {
    const { total_paid_by_wallet, total_paid_by_card } =
        isValidElement(orderDetails) && isValidElement(orderDetails.data) && orderDetails.data;
    return (
        isValidElement(total_paid_by_wallet) &&
        parseFloat(total_paid_by_wallet) > 0.0 &&
        isValidElement(total_paid_by_card) &&
        parseFloat(total_paid_by_card) === 0.0
    );
};

export const isNonCancelledOrder = (orderData) => {
    const { status } = isValidElement(orderData) && orderData;
    return isValidElement(status) && status !== ORDER_STATUS.CANCEL_ORDER;
};

export const isRequestedUpdatedDeliveryTime = (deliveryTime, timeZone, durationTime) => {
    let deliveryDifference =
        isValidElement(deliveryTime) &&
        isValidElement(timeZone) &&
        getBusinessMomentForDate(deliveryTime, timeZone, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS).subtract({
            minutes: durationTime
        });
    let currentTime = getCurrentMoment(timeZone);
    return moment(currentTime).isSameOrAfter(deliveryDifference, 'second');
};

export const getChatBotDeliveryDuration = (countryBaseFeatureGateResponse) => {
    return isValidElement(countryBaseFeatureGateResponse) &&
        isValidElement(countryBaseFeatureGateResponse.chat_bot_duration) &&
        isValidElement(countryBaseFeatureGateResponse.chat_bot_duration.options.duration)
        ? countryBaseFeatureGateResponse.chat_bot_duration.options.duration
        : DEFAULT_CHAT_BOT_DURATION;
};
export const getOrderTimeZone = (orderDetails, timeZone) => {
    return isValidElement(orderDetails?.data) && isValidString(orderDetails?.data.time_zone) ? orderDetails.data.time_zone : timeZone;
};

export const getOrderDeliveryTime = (orderDetails) => {
    return isValidElement(orderDetails?.data) && isValidString(orderDetails?.data?.delivery_time) && orderDetails.data.delivery_time;
};
// below wallet order status condition based on this params with status no
// -------destination------------
// ASUSUAL=1
// CARD=2
// WALLET=3
// -------refund_source_id---------
//     INTERNAL = 1;
// ORDER_STATUS_PAGE = 2;
// CANCELLED_ORDER_MAIL = 3;
// -------refund_status_id--------
//     QUEUED = 1;
// INITIALIZED = 2;
// FAILED = 3;
// COMPLETED = 4;
export const getRefundByWalletOrder = (currentOrder, allOrders) => {
    let orderIndex = isValidElement(allOrders) && allOrders.length > 0 ? allOrders.findIndex((item) => item.id === currentOrder.id) : null;
    let orderData = isValidElement(orderIndex) && orderIndex !== -1 ? allOrders[orderIndex] : null;
    return isValidElement(orderData) &&
        isValidElement(orderData.refund_request_log) &&
        isValidElement(orderData.refund_request_log.destination) &&
        parseInt(orderData.refund_request_log.destination) === 3
        ? orderData
        : null;
};

export const isRefundByWalletInProgress = (orderData) => {
    return (
        isValidElement(orderData) &&
        isValidElement(orderData.refund_request_log) &&
        isValidElement(orderData.refund_request_log.destination) &&
        isValidElement(orderData.refund_request_log.refund_status_id) &&
        orderData.refund_request_log.destination === 3 &&
        parseInt(orderData.refund_request_log.refund_status_id) !== 4
    );
};

export const onOpenHelpCenterSupport = (profileResponse, screenName) => {
    //Todo we need to add user data once done form web env
    handleNavigation(SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name, {
        url: `${AppConfig.HELP_CENTER_WEB_VIEW_URL}`,
        title: screenName
    });
};

export const handleHelpCenterRedirection = (profileResponse, language) => {
    Analytics.logEvent(ANALYTICS_SCREENS.SUPPORT, ANALYTICS_EVENTS.HELP_CENTER);
    if (isFoodHubApp()) {
        showZendeskHelpCenter(profileResponse.id, language);
    } else {
        onOpenHelpCenterSupport(profileResponse, LOCALIZATION_STRINGS.HELP_CENTER);
    }
};

export const getProfileResponse = (profileResponse) => {
    let userDetails = {};
    if (isValidString(profileResponse?.first_name)) {
        userDetails.first_name = profileResponse?.first_name;
    }
    if (isValidString(profileResponse?.last_name)) {
        userDetails.last_name = profileResponse?.last_name;
    }
    if (isValidString(profileResponse?.phone)) {
        userDetails.phone = profileResponse?.phone;
    }
    if (isValidString(profileResponse?.email)) {
        userDetails.email = profileResponse?.email;
    }
    return userDetails;
};
export const deliverTimeRequestOrder = (deliveryTimeUpdatedOrderData, orderDetails) => {
    if (isValidElement(deliveryTimeUpdatedOrderData) && deliveryTimeUpdatedOrderData.length > 0) {
        return deliveryTimeUpdatedOrderData.find((item) => item.orderId === orderDetails?.data?.id);
    } else return null;
};

export const isDeliveryTimeUpdateOrder = (deliveryTimeUpdatedOrderData, orderDetails, forWaitingText = false) => {
    if (isValidElement(orderDetails?.data?.id)) {
        let orderData = deliverTimeRequestOrder(deliveryTimeUpdatedOrderData, orderDetails);
        if (forWaitingText && isValidElement(orderData?.requestedTime) && !isValidElement(orderData.updated_delivery_time)) {
            return true;
        }
        return (
            !forWaitingText &&
            isValidElement(orderData) &&
            isValidElement(orderData.orderId) &&
            orderData?.orderId === orderDetails?.data?.id &&
            safeIntValue(orderDetails?.data?.status) > safeIntValue(ORDER_STATUS.PLACED) &&
            orderData?.isDeliveryTimeUpdated
        );
    }
};

export const getOrderDeliveryTimeReqID = (deliveryTimeData) => {
    if (isValidElement(deliveryTimeData) && isValidElement(deliveryTimeData.req_id) && !isBoolean(deliveryTimeData.req_id)) {
        return deliveryTimeData.req_id;
    } else return null;
};
export const getUpdatedDeliveryTime = (deliverTimeRequestOrder) => {
    if (isValidElement(deliverTimeRequestOrder?.updated_delivery_time)) return deliverTimeRequestOrder.updated_delivery_time;
};

export const isNonDeliveryTimeRequestOrder = (orderData) => {
    if (isValidElement(orderData?.isUpdatedDeliverTimeDisable)) return orderData.isUpdatedDeliverTimeDisable;
};

export const isDeliveryOrderTimeCompeleted = (orderDetailsData, orderStatus, duration) => {
    if (isValidElement(orderDetailsData) && isValidElement(orderStatus) && isValidElement(duration))
        return isDeliverOrder(orderDetailsData) && orderStatus === safeIntValue(ORDER_STATUS.ACCEPTED) && duration <= 0;
};

export const setRefundData = (itemData, refundData) => {
    let updatedData = itemData.map((items) => ({
        ...items,
        isSelected: isMissingItem(items, refundData),
        addons: isArrayNonEmpty(items?.addons)
            ? items.addons.map((addonItems) => ({
                  ...addonItems,
                  isSelected: isMissingItem(items, refundData) ? true : isMissingItem(items, refundData, addonItems.item_addon_id, true)
              }))
            : []
    }));
    return updatedData;
};
export const isMissingItem = (itemData, refundData, item_addon_id, forAddon = false) => {
    let refundItem, refundAddonItem, addonData;
    refundItem = refundData.find(
        (data) =>
            data.item_id === itemData.item_id &&
            (isArrayNonEmpty(data.order_item_addon_refund_log) ? itemData.addons.length === data.order_item_addon_refund_log.length : true)
    );
    if (!forAddon && isValidElement(refundItem?.type)) {
        return refundItem.type === MISSING_ITEM;
    } else if (forAddon && isValidElement(item_addon_id) && isArrayNonEmpty(refundItem?.order_item_addon_refund_log)) {
        addonData = refundItem.order_item_addon_refund_log;
        refundAddonItem = addonData.find((addonItem) => addonItem.item_addon_id === item_addon_id);
        return refundAddonItem?.type === MISSING_ITEM;
    } else return false;
};

export const getOrderHelpViewType = (type) => {
    if (isValidElement(type)) {
        for (let key in HELP_OPTIONS_TYPE) {
            if (HELP_OPTIONS_TYPE[key] == type) {
                return key?.toLowerCase();
            }
        }
    }
    return '';
};
