import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { style } from './T2SPreorderTimingStyle';
import moment from 'moment-timezone';
import T2SText from '../T2SText';
import { DATE_FORMAT } from '../../../Utils/DateUtil';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { Colors } from '../../../Themes';
import { isValidElement } from '../../../Utils/helpers';

const T2SPreorderTimingWidget = ({ date, onPress, screenName, selected, isPreOrderASAP }) => {
    const momentDate = moment(date, DATE_FORMAT.YYYY_MM_DD_HH_mm);
    const formatedTime = momentDate.format(DATE_FORMAT.HH_mm);
    const formatedDate = momentDate.format(DATE_FORMAT.DD_MMM);

    const onItemClicked = useCallback(() => {
        if (isValidElement(onPress)) {
            onPress(date, isPreOrderASAP);
        }
    }, [date, isPreOrderASAP, onPress]);

    return (
        <TouchableOpacity
            style={selected ? [style.timeContainer, style.selectedTimeContainer] : style.timeContainer}
            onPress={onItemClicked}
            accessible={false}>
            <T2SText
                id={formatedTime}
                screenName={screenName}
                style={selected ? [style.timeTextStyle, style.selectedTimeText] : style.timeTextStyle}>
                {formatedTime}
                {isPreOrderASAP && (
                    <T2SText style={selected ? [style.asapTextStyle, style.selectedAsapText] : style.asapTextStyle}>
                        {` (${LOCALIZATION_STRINGS.ASAP})`}
                    </T2SText>
                )}
            </T2SText>
            {
                <T2SText
                    id={formatedDate + formatedTime}
                    screenName={screenName}
                    style={selected ? [style.dateTextStyle, { color: Colors.white }] : style.dateTextStyle}>
                    {formatedDate}
                </T2SText>
            }
        </TouchableOpacity>
    );
};

export default React.memo(T2SPreorderTimingWidget);
