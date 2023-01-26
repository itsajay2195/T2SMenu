import { isValidElement, isValidString } from '../../../../Utils/helpers';
import moment from 'moment-timezone';
import { DATE_FORMAT } from '../../../../Utils/DateUtil';
import { ORDER_STATUS } from 'appmodules/BaseModule/BaseConstants';
import { DEFAULT_TIME } from 'appmodules/OrderManagementModule/Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

export const getFormattedDeliveryTimeInMinutes = (timeZone, delivery_time, returnAsSec = false) => {
    if (isValidElement(timeZone) && timeZone) {
        let timeDifference = getTimeDifferenceBetweenCurrentTimeFromDeliveryTime(timeZone, delivery_time);
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
};

export function getTimeDifferenceBetweenCurrentTimeFromDeliveryTime(timeZone, delivery_time) {
    if (isValidElement(timeZone) && isValidElement(delivery_time)) {
        let storeLocalTime = moment()
            .tz(timeZone)
            .format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
        let deliveryTime = moment(delivery_time).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
        return moment(deliveryTime, 'YYYY-MM-DD HH:mm:ss').diff(moment(storeLocalTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS));
    }
}
export const CountDownTimerHelper = (durationTime, countDownDate, status, preOrderTime, showTimerForPreorder = false) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (!showTimerForPreorder && hours >= 2 && isPreOrderOrder(preOrderTime)) {
        return LOCALIZATION_STRINGS.PREORDER;
    }
    if (distance < 0 || status >= ORDER_STATUS.DELIVERED) {
        return DEFAULT_TIME;
    } else if (days > 1) {
        return days > 1 ? zeroPad(days, 2) + ' ' + 'Days' : zeroPad(days, 2) + ' ' + 'Day';
    } else if (hours > 1) {
        return zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    } else if (hours < 1) {
        return zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    } else {
        return zeroPad(hours, 2) + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
    }
};

export const isPreOrderOrder = (preOrderTime) => isValidString(preOrderTime) && !preOrderTime.startsWith('0000');
