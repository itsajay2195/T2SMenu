import {
    DEFAULT_DISPLAY_PROPS,
    DEFAULT_DISPLAY_PROPS_COLLECTION,
    ORDER_STATUS_ENUM,
    ORDER_STATUS_ICON_ANIMATION_JSON
} from './OrderTrackingConfig';
import { ORDER_STATUS, ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import moment from 'moment-timezone';
import { DATE_FORMAT } from '../../../../Utils/DateUtil';
import { isValidElement } from '../../../../Utils/helpers';

/**
 *  This method is to get status text constant based on Order type and Display type
 *  Input params displayMode and orderType
 *  Return order status string object
 */
const getStatusText = (orderType, currentStatus) => {
    if (orderType === ORDER_TYPE.COLLECTION) {
        return {
            PLACED: currentStatus === ORDER_STATUS_ENUM.PLACED ? LOCALIZATION_STRINGS.PLACED : LOCALIZATION_STRINGS.ORDER_ACCEPTED,
            COOKING: LOCALIZATION_STRINGS.COOKING,
            DELIVERED: LOCALIZATION_STRINGS.ORDER_DELIVERED,
            COLLECTED: LOCALIZATION_STRINGS.ORDER_COLLECTED,
            READY: LOCALIZATION_STRINGS.ORDER_READY
        };
    } else {
        return {
            PLACED: currentStatus === ORDER_STATUS_ENUM.PLACED ? LOCALIZATION_STRINGS.PLACED : LOCALIZATION_STRINGS.ORDER_ACCEPTED,
            COOKING: LOCALIZATION_STRINGS.COOKING,
            READY: LOCALIZATION_STRINGS.ON_THE_WAY,
            DELIVERED: LOCALIZATION_STRINGS.ORDER_DELIVERED
        };
    }
};

/**
 *  This method is to get status icon constant based on Order type
 *  Input params orderType
 *  Return order status icon object
 */
const getStatusIcon = (orderType, currentStatus) => {
    return orderType === ORDER_TYPE.COLLECTION
        ? getAnimationForCollectionBasedOnCurrentStatus(currentStatus)
        : getAnimationForDeliveryBasedOnCurrentStatus(currentStatus);
};

const getAnimationForDeliveryBasedOnCurrentStatus = (currentStatus) => {
    switch (currentStatus) {
        case ORDER_STATUS_ENUM.PLACED:
            return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_1;
        case ORDER_STATUS_ENUM.COOKING:
            return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_2;
        case ORDER_STATUS_ENUM.READY:
            return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_3;
        case ORDER_STATUS_ENUM.DELIVERED:
            return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_4;
        case ORDER_STATUS_ENUM.OTHER:
            return ORDER_STATUS_ICON_ANIMATION_JSON.DELIVERY_TYPE_WITH_STAGE_1;
    }
};

const getAnimationForCollectionBasedOnCurrentStatus = (currentStatus) => {
    switch (currentStatus) {
        case ORDER_STATUS_ENUM.PLACED:
            return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_1;
        case ORDER_STATUS_ENUM.COOKING:
            return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_2;
        case ORDER_STATUS_ENUM.READY:
            return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_3;
        case ORDER_STATUS_ENUM.DELIVERED:
            return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_4;
        case ORDER_STATUS_ENUM.OTHER:
            return ORDER_STATUS_ICON_ANIMATION_JSON.COLLECTION_TYPE_WITH_STAGE_1;
    }
};

export const getDisplayProps = (currentStatus, orderType, isPreOrder) => {
    let updatedDisplayProps = [];
    const displayProps =
        (currentStatus === ORDER_STATUS_ENUM.READY || currentStatus === ORDER_STATUS_ENUM.DELIVERED) && orderType !== ORDER_TYPE.COLLECTION
            ? DEFAULT_DISPLAY_PROPS
            : orderType !== ORDER_TYPE.COLLECTION
            ? DEFAULT_DISPLAY_PROPS.filter((item) => item.stageNo !== ORDER_STATUS_ENUM.READY)
            : DEFAULT_DISPLAY_PROPS_COLLECTION;
    displayProps.forEach((item, key) => {
        let updatedItem;
        if (item.stageNo < currentStatus || currentStatus === DEFAULT_DISPLAY_PROPS.length) {
            updatedItem = {
                ...item,
                isCompleted: true,
                textColor: Colors.black,
                stageLinkColor: Colors.primaryColor,
                stagePointColor: Colors.primaryColor
            };
        } else if (item.stageNo === currentStatus) {
            updatedItem = {
                ...item,
                isCompleted: false,
                textColor: Colors.black,
                stagePointColor: Colors.carrotOrange
            };
        } else {
            updatedItem = item;
        }
        updatedDisplayProps[key] = {
            ...updatedItem,
            statusText: getStatusText(orderType, currentStatus)[item.stageKey],
            statusIcon: getStatusIcon(orderType, currentStatus)[item.stageKey]
        };
    });
    return updatedDisplayProps;
};

export const getOrderStatusEnum = (orderStatus) => {
    let orderStatusEnum;

    switch (orderStatus) {
        case ORDER_STATUS.PENDING:
        case ORDER_STATUS.PLACED:
            orderStatusEnum = ORDER_STATUS_ENUM.PLACED;
            break;
        case ORDER_STATUS.ACCEPTED:
        case ORDER_STATUS.COOKING:
            orderStatusEnum = ORDER_STATUS_ENUM.COOKING;
            break;
        case ORDER_STATUS.SENT:
            orderStatusEnum = ORDER_STATUS_ENUM.READY;
            break;
        case ORDER_STATUS.DELIVERED:
        case ORDER_STATUS.HIDDEN:
        case ORDER_STATUS.MANAGER_DELETED:
        case ORDER_STATUS.DELETED:
        case ORDER_STATUS.NOT_USED:
            orderStatusEnum = ORDER_STATUS_ENUM.DELIVERED;
            break;
        case ORDER_STATUS.CARD_PROCESSING:
            orderStatusEnum = ORDER_STATUS_ENUM.OTHER;
            break;
        default:
            orderStatusEnum = ORDER_STATUS_ENUM.OTHER;
            break;
    }
    return orderStatusEnum;
};

export const getMinutesAndSeconds = (timeZone, orderPlacedTime) => {
    const storeLocalTime = moment()
        .tz(timeZone)
        .format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
    const placedTime = moment(orderPlacedTime).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
    const timeDifference = moment(storeLocalTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS).diff(
        moment(placedTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)
    );
    let duration = moment.duration(timeDifference);
    const minutes = Math.floor(duration.asMinutes());
    const seconds = Math.floor(duration.asSeconds());
    return { minutes, seconds };
};

export const getOrderStatusText = (status) => {
    if (isValidElement(status)) {
        for (let key in ORDER_STATUS) {
            if (ORDER_STATUS[key] == status) {
                return key;
            }
        }
    }
    return null;
};
