import { WEEK_DAYS_CONSTANT as WeekDayConstants } from './WeekDayConstants';

export const calculateDefaultSize = (containerHeight) => {
    return containerHeight < WeekDayConstants.DEFAULT_DAY_VIEW_SIZE ? containerHeight : WeekDayConstants.DEFAULT_DAY_VIEW_SIZE;
};
export const calculateDynamicSize = (containerWidth) => {
    return (containerWidth - WeekDayConstants.NUMBER_OF_DAYS * WeekDayConstants.SPACING_BETWEEN_ITEMS) / WeekDayConstants.NUMBER_OF_DAYS;
};
export const isDayEnabled = (value) => {
    return value === '1';
};
