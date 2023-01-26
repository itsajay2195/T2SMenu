import { isArrayNonEmpty, isValidElement, isValidNumber, isValidString, kFormatter, validateRegex } from 't2sbasemodule/Utils/helpers';
import moment from 'moment-timezone';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { Dimensions } from 'react-native';
import { isUKApp } from 'appmodules/BaseModule/GlobalAppHelper';
import _ from 'lodash';
import { UK_REGEX_PATTERN } from 'appmodules/BaseModule/GlobalAppConstants';
import { VIEW_ID } from 'appmodules/ProfileModule/Utils/ProfileConstants';
let SCREEN_HEIGHT = Dimensions.get('window').height;
let TRANSITION_THRESHOLD = SCREEN_HEIGHT / 6.66;

export const ValidatePostCodeUK = (postCode) => {
    return isValidElement(postCode) ? validateRegex(UK_REGEX_PATTERN, postCode) : false;
};
export const getModifiedName = (name) => {
    return isValidElement(name) ? name.substring(0, 10) : '';
};

export const getModifiedRating = (rating) => {
    return isValidNumber(rating) ? parseFloat(rating).toFixed(1) : (0).toFixed(1);
};

export const getModifiedReviews = (total_reviews) => {
    return isValidNumber(total_reviews) ? kFormatter(total_reviews) : 0;
};

export const getModifiedImageURL = (logo_url) => {
    return isValidElement(logo_url) ? logo_url : '';
};

export const getRecentOrderedDate = (orderPlacedDate, timeZone) => {
    if (!isValidElement(orderPlacedDate) || !isValidString(orderPlacedDate)) return '';
    if (isValidElement(timeZone)) {
        let currentDate = moment()
            .tz(timeZone)
            .format('DD MMM');
        let previousDay = moment()
            .tz(timeZone)
            .subtract(1, 'days');
        let tomorrowDay = moment()
            .tz(timeZone)
            .add(1, 'days');
        return currentDate === moment.tz(orderPlacedDate, timeZone).format('DD MMM')
            ? LOCALIZATION_STRINGS.TODAY
            : moment(previousDay).format('DD MMM') === moment.tz(orderPlacedDate, timeZone).format('DD MMM')
            ? LOCALIZATION_STRINGS.YESTERDAY
            : moment(tomorrowDay).format('DD MMM') === moment.tz(orderPlacedDate, timeZone).format('DD MMM')
            ? LOCALIZATION_STRINGS.TOMORROW
            : moment.tz(orderPlacedDate, timeZone).format('DD MMM');
    } else return moment(orderPlacedDate).format('DD MMM');
};

export const randomSessionToken = () => {
    let value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
    return value;
};

export function extractValueString(item) {
    return isValidElement(item) && isValidString(item.value) ? item.value : '';
}

export const getStickyHeaderOpacityInterpolation = (stickyHeaderOpacity) => {
    return stickyHeaderOpacity?.interpolate({
        inputRange: [0, TRANSITION_THRESHOLD - 10, TRANSITION_THRESHOLD - 5, TRANSITION_THRESHOLD],
        outputRange: [0, 0.7, 0.8, 1]
    });
};

export const renderSummaryItems = (summary) => {
    if (isValidElement(summary?.items) && Array.isArray(summary?.items)) {
        const available_items = summary?.items.map((items) => items.name).join(', ');
        const missing_items = summary?.missing_items.map((items) => items.name).join(', ');
        const result = isValidElement(available_items) && available_items?.length > 0 ? available_items : '';
        return result + (missing_items?.length > 0 && available_items?.length > 0 ? ', ' : '') + missing_items;
    }
    return '';
};

export const getTakeawayImage = (item) => {
    if (isValidElement(item?.store?.website_logo_url)) {
        return item.store.website_logo_url;
    } else if (isValidElement(item?.store?.portal_setting?.logo_url)) {
        return item.store.portal_setting.logo_url;
    } else {
        return require('../../../FranchiseApp/Images/no_image_small_pattern.png');
    }
};

export const getDeliveryOrders = (orderData) => {
    if (isValidElement(orderData)) {
        let getDeliveryOrder = orderData.filter((item) => item?.sending === 'to');
        return getDeliveryOrder;
    }
};
export const getLatestOrder = (pendingOrder, previousOrder) => {
    let pendingDeliveryOrder, previousDeliveryOrder, latestOrder;
    pendingDeliveryOrder = isValidElement(pendingOrder) && pendingOrder?.length > 0 ? getDeliveryOrders(pendingOrder) : [];
    previousDeliveryOrder = isValidElement(previousOrder) && previousOrder?.length > 0 ? getDeliveryOrders(previousOrder) : [];
    let orderData = [...pendingDeliveryOrder, ...previousDeliveryOrder];
    latestOrder = deliveryOrderSortByOrderPlacedTime(orderData);
    if (isValidElement(latestOrder) && latestOrder.length > 0) {
        return latestOrder[0];
    } else return null;
};

export const getPostCodeFromRecentOrder = (pendingOrder, previousOrder, countryId) => {
    if (isUKApp(countryId)) {
        let orderData = getLatestOrder(pendingOrder, previousOrder);
        if (isValidElement(orderData?.postcode)) return orderData.postcode;
    }
};

export const deliveryOrderSortByOrderPlacedTime = (orderList) => {
    return _.orderBy(
        orderList,
        [
            (obj) => {
                return isValidElement(obj?.order_placed_on) && moment(obj.order_placed_on);
            }
        ],
        ['desc']
    );
};

export const isPendingOrderNotAvailable = (orderData) => {
    return isValidElement(orderData?.length) ? orderData.length <= 0 : true;
};

export const getOrderItemsWithQuantity = (summary) => {
    if (isValidElement(summary?.items) && Array.isArray(summary?.items)) {
        const available_items = summary?.items
            .map((items) => (isValidElement(items.quantity) ? items.quantity + 'x ' : '') + items.name)
            .join(', ');
        const missing_items = summary?.missing_items
            .map((items) => (isValidElement(items.quantity) ? items.quantity + 'x ' : '') + items.name)
            .join(', ');
        const result = isArrayNonEmpty(available_items) ? available_items : '';
        return result + (isArrayNonEmpty(missing_items) && isArrayNonEmpty(available_items) ? ', ' : '') + missing_items;
    }
    return '';
};

export const getShareImage = (viewID) => {
    if (viewID === VIEW_ID.SHARE_MESSAGE_IMAGE) {
        return require('../../../T2SBaseModule/Images/common/message.png');
    } else if (viewID === VIEW_ID.SHARE_WHATSAPP_IMAGE) {
        return require('../../../T2SBaseModule/Images/common/whatsapp.png');
    } else if (viewID === VIEW_ID.SHARE_OPTION_IMAGE) {
        return require('../../../T2SBaseModule/Images/common/share.png');
    }
};
