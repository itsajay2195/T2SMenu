import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { ORDER_STATUS, ORDER_TYPE, ORDER_TYPE_STATUS } from '../../BaseModule/BaseConstants';
import { isAnyOrderTypeAvailable } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { CHECK_TAKEAWAY_STATUS, OUR_RECOMMENDATION_ENABLED } from './HomeConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { DATE_FORMAT, formatDateString } from 't2sbasemodule/Utils/DateUtil';

export const getReviewOrderID = (pendingOrder, previousOrder) => {
    let orderId = 0;
    if (
        isValidElement(pendingOrder) &&
        pendingOrder.length === 0 &&
        isValidElement(previousOrder) &&
        previousOrder.length > 0 &&
        !isValidElement(previousOrder[0].review) &&
        previousOrder[0].status !== ORDER_STATUS.CANCEL_ORDER
    ) {
        orderId = previousOrder[0].id;
    }
    return orderId;
};

export const isTakeawayClosed = (storeConfigTakeawayOpenStatus) => {
    return storeConfigTakeawayOpenStatus === CHECK_TAKEAWAY_STATUS.CLOSED;
};

export const isTakeawayOpen = (storeConfigShowDelivery, storeConfigShowCollection, storeConfigTakeawayOpenStatus) => {
    return !isTakeawayClosed(storeConfigTakeawayOpenStatus) && isAnyOrderTypeAvailable(storeConfigShowDelivery, storeConfigShowCollection);
};

export const isOurRecommendationsEnable = (storeConfigOurRecommendations) => {
    return isValidElement(storeConfigOurRecommendations) && storeConfigOurRecommendations === OUR_RECOMMENDATION_ENABLED;
};

export const getPlacedDateTime = (order_placed_on) => {
    return `${LOCALIZATION_STRINGS.ORDERED_ON} ${formatDateString(order_placed_on, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM)} ${
        LOCALIZATION_STRINGS.AT
    } ${formatDateString(order_placed_on, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.HH_mm_a)}`;
};

export const isStoreStatusClosed = (store_status, orderType) => {
    if (orderType === ORDER_TYPE.COLLECTION) {
        return store_status?.collection === ORDER_TYPE_STATUS.CLOSED;
    } else if (orderType === ORDER_TYPE.DELIVERY) {
        return store_status?.delivery === ORDER_TYPE_STATUS.CLOSED;
    } else {
        return false;
    }
};

export const isStoreAPIOptimisationEnabled = (store_api_optimisation) => {
    return isValidElement(store_api_optimisation?.enable) && store_api_optimisation.enable === true;
};
