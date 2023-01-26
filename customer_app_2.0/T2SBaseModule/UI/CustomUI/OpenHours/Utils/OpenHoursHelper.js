import { WEEKDAYS_NAME_SHORT, OPEN_HOURS_CONSTANTS, WEEKDAYS_NAME_SHORT_ARRAY } from './OpenHoursConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import moment from 'moment-timezone';
import { isValidElement, isValidString } from '../../../../Utils/helpers';

const OPEN_HOURS_HEADER_DATA = () => {
    return [
        {
            bgColor: Colors.backgroundGrey,
            isHeader: true,
            columnData: [
                {
                    isTime: false,
                    isFirstColumn: true,
                    titleText: LOCALIZATION_STRINGS.DAY,
                    timings: []
                },
                {
                    isTime: false,
                    isFirstColumn: false,
                    titleText: LOCALIZATION_STRINGS.COLLECTION,
                    timings: []
                },
                {
                    isTime: false,
                    isFirstColumn: false,
                    titleText: LOCALIZATION_STRINGS.DELIVERY,
                    timings: []
                }
            ]
        }
    ];
};

/**
 * Method to format opening hours response to render UI
 * @param openHoursJsonData, timeZone
 * @returns {{bgColor: string, isHeader: boolean, columnData: [{titleText: *, timings: [], isToday:boolean, isTime: boolean}, {titleText: *, timings: [], isTime: boolean}, {titleText: *, timings: [], isTime: boolean}]}[]}
 */
export const getOpenHoursFormattedDate = (openHoursJsonData, timeZone, showFullData = false) => {
    let formattedOpenHoursData = [...OPEN_HOURS_HEADER_DATA()];
    if (!isValidElement(openHoursJsonData.advanced)) {
        return null;
        // TODO: Opening hours handle only for advanced version, basic version yet to implement.
    }
    const { Collection, Delivery } = openHoursJsonData.advanced;

    let startingIndex = 1;
    const momentOfZone = moment().tz(timeZone);
    const day = momentOfZone.day();
    let today = WEEKDAYS_NAME_SHORT_ARRAY[day - 1];
    // eslint-disable-next-line no-unused-vars
    for (const dayName of WEEKDAYS_NAME_SHORT_ARRAY) {
        let isToday = dayName === today;

        formattedOpenHoursData.push({
            bgColor: showFullData ? Colors.white : startingIndex % 2 === 0 ? Colors.backgroundGrey : Colors.whiteSmoke,
            isHeader: false,
            columnData: [
                {
                    isTime: false,
                    isFirstColumn: true,
                    titleText: getFullDayName(dayName),
                    isToday: isToday,
                    timings: []
                },
                getTimingsFromString(Collection[dayName], dayName),
                getTimingsFromString(Delivery[dayName], dayName)
            ]
        });
        startingIndex++;
    }

    if (showFullData) {
        return [...OPEN_HOURS_HEADER_DATA(), formattedOpenHoursData.find((item) => item.columnData[0].isToday)];
    }
    return formattedOpenHoursData;
};

/**
 * Method to get full day name aling with opening hours for collection and delivery
 * @param dayName
 * @returns {string|{titleStr: *}}
 */
const getFullDayName = (dayName) => {
    let titleStr;
    switch (dayName) {
        case WEEKDAYS_NAME_SHORT.MONDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_MONDAY;
            break;
        case WEEKDAYS_NAME_SHORT.TUESDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_TUESDAY;
            break;
        case WEEKDAYS_NAME_SHORT.WEDNESDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_WEDNESDAY;
            break;
        case WEEKDAYS_NAME_SHORT.THURSDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_THURSDAY;
            break;
        case WEEKDAYS_NAME_SHORT.FRIDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_FRIDAY;
            break;
        case WEEKDAYS_NAME_SHORT.SATURDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_SATURDAY;
            break;
        case WEEKDAYS_NAME_SHORT.SUNDAY:
            titleStr = LOCALIZATION_STRINGS.SHORT_SUNDAY;
            break;
        default:
            titleStr = OPEN_HOURS_CONSTANTS.INVALID_DAY;
            break;
    }
    return titleStr;
};

/**
 * Method to get timings from opening hours string
 * @param timingsArr
 * @param dayNameShort
 * @returns {{isClosed: boolean, titleText: string, timings: [], isTime: boolean}}
 */
const getTimingsFromString = (timingsArr, dayNameShort) => {
    const timingsObj = {
        isTime: true,
        isFirstColumn: false,
        isClosed: false,
        titleText: '',
        timings: []
    };

    if (timingsArr[0] === undefined || timingsArr[0] === OPEN_HOURS_CONSTANTS.CLOSED) {
        timingsObj.isClosed = true;
        timingsObj.titleText = LOCALIZATION_STRINGS.CLOSED;
    } else {
        timingsObj.timings = timingsArr.map((item) => {
            if (isValidElement(item)) {
                let timeStr = item.trim().split(' ');
                let startTimeObj, endTimeObj;
                if (timeStr[0] === dayNameShort) {
                    startTimeObj = timeConvertTo12HrFormat(timeStr[1]);
                    endTimeObj = isValidElement(timeStr[4]) ? timeConvertTo12HrFormat(timeStr[4]) : timeConvertTo12HrFormat(timeStr[3]);
                } else {
                    startTimeObj = timeConvertTo12HrFormat(timeStr[0]);
                    endTimeObj = timeConvertTo12HrFormat(timeStr[2]);
                }
                return {
                    startTime: startTimeObj.convertedTime,
                    startTimeAmPm: startTimeObj.amPmStr,
                    endTime: endTimeObj.convertedTime,
                    endTimeAmPm: endTimeObj.amPmStr
                };
            }
        });
    }
    return timingsObj;
};

/**
 * Method to convert 24Hr time string to 12Hr format
 * @param time
 * @returns {{convertedTime: *, amPmStr: *}}
 */
const timeConvertTo12HrFormat = (time) => {
    if (isValidString(time)) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        let timeAmPm;
        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            timeAmPm = time[0] < 12 ? 'AM' : 'PM';
            time[0] = +time[0] % 12 || 12; // Adjust hours
            //time[0] = String(time[0]).padStart(2, '0');
        }
        return { convertedTime: time.join(''), amPmStr: timeAmPm };
    } else {
        return {
            convertedTime: '',
            amPmStr: ''
        };
    }
};
