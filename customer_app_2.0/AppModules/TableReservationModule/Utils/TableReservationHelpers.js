import moment from 'moment-timezone';
import {
    getDateStr,
    isArrayNonEmpty,
    isMoreZero,
    isValidElement,
    isValidString,
    normalizePhoneNo,
    safeIntValue
} from 't2sbasemodule/Utils/helpers';
import { DATE_FORMAT, isBefore5AM } from 't2sbasemodule/Utils/DateUtil';
import { removePrefixFromNumber } from 't2sbasemodule/Utils/helpers';
import { TABLE_BOOKING_PAGE } from '../../../CustomerApp/View/SideMenu/SideMenuConstants';

let selectedEndTime = null;

export const formatSelectedTime = (data) => {
    if (isValidElement(data)) {
        let time = data.toString();
        let splitTime = time.split('-');
        return moment(splitTime[0], [DATE_FORMAT.HH_mm]).format(DATE_FORMAT.HH_mm_a);
    } else {
        return null;
    }
};

export const formatSelectedDate = (date, selectedTime) => {
    if (!isValidElement(selectedTime)) {
        return date;
    }
    let time = selectedTime.toString();
    let splitTime = time.split('-');
    selectedEndTime = moment(splitTime[1], [DATE_FORMAT.HH_mm]);
    let selectedEndTimeHour = moment(selectedEndTime, [DATE_FORMAT.HH_mm]).format(DATE_FORMAT.HH);
    let selectedEndTimeMinute = moment(selectedEndTime, [DATE_FORMAT.HH_mm]).format(DATE_FORMAT.mm);
    if (isBefore5AM(selectedEndTimeHour, selectedEndTimeMinute)) {
        return moment(date, DATE_FORMAT.YYYY_MM_DD).add(1, 'day');
    } else {
        return date;
    }
};
export const hasChanges = (state, props) => {
    let { profileResponse, countryId, timeSlots } = props;
    let { firstName, lastName, emailId, mobileNo, selectedTime, noOfPersons, comments, date } = state;
    if (isValidElement(profileResponse)) {
        let phoneNumber = removePrefixFromNumber(normalizePhoneNo(profileResponse.phone), countryId);
        let stateMobileNo = removePrefixFromNumber(normalizePhoneNo(mobileNo), countryId);

        return (
            (isValidString(date) && getDateStr(new Date(), DATE_FORMAT.DD_MMM_YYYY) !== date) ||
            (isValidString(firstName) && profileResponse.first_name !== firstName) ||
            (isValidString(lastName) && profileResponse.last_name !== lastName) ||
            (isValidString(mobileNo) && stateMobileNo !== phoneNumber) ||
            (isValidString(emailId) && profileResponse.email !== emailId) ||
            isMoreZero(noOfPersons) ||
            (isValidString(comments) && comments.length > 0)
        );
    }

    return (
        (isValidString(date) && getDateStr(new Date(), DATE_FORMAT.DD_MMM_YYYY) !== date) ||
        (isValidString(firstName) && firstName.length > 0) ||
        (isValidString(lastName) && lastName.length > 0) ||
        (isValidString(mobileNo) && mobileNo.length > 0) ||
        (isValidString(emailId) && emailId.length > 0) ||
        (isArrayNonEmpty(selectedTime) && isArrayNonEmpty(timeSlots) && selectedTime !== timeSlots[0]) ||
        isMoreZero(noOfPersons) ||
        (isValidString(comments) && comments.length > 0)
    );
};

export const isNoOfPeopleExceeded = (value, noOfPeople) => {
    if (isValidElement(value)) {
        try {
            return safeIntValue(value) > noOfPeople;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};

export const isTableReservationEnabled = (tableBooking) => {
    return isValidElement(tableBooking) && tableBooking === TABLE_BOOKING_PAGE;
};
