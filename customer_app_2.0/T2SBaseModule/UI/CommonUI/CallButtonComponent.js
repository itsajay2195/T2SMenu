import { View } from 'react-native';
import React from 'react';
import { CallButtonStyle } from './Style/CallButtonStyle';
import T2STouchableOpacity from './T2STouchableOpacity';
import T2SText from './T2SText';
import * as appHelper from '../../Utils/helpers';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

export const CallButtonComponent = ({ screenName, storePhoneNumber, addBottomMargin = false }) => {
    return (
        <T2STouchableOpacity
            id={VIEW_ID.CALL_BUTTON_CLICKED}
            screenName={screenName}
            style={[
                CallButtonStyle.buttonMainContainer,
                isValidElement(addBottomMargin) && addBottomMargin && CallButtonStyle.customBottomMargin
            ]}
            onPress={handleCallSupportPress.bind(this, storePhoneNumber)}>
            <View style={CallButtonStyle.buttonViewStyle}>
                {/*<T2SIcon icon={FONT_ICON.CALL_STROKE} size={24} color={Colors.primaryColor} />*/}
                <T2SText id={VIEW_ID.CALL_TAKEAWAY_TEXT} style={CallButtonStyle.buttonTextStyle} screenName={screenName}>
                    {LOCALIZATION_STRINGS.CALL_TAKEAWAY}
                </T2SText>
            </View>
        </T2STouchableOpacity>
    );
};

function handleCallSupportPress(storePhoneNumber) {
    appHelper.callDialPad(storePhoneNumber);
}
export const VIEW_ID = {
    CALL_BUTTON_CLICKED: 'call_button_clicked',
    CALL_TAKEAWAY_TEXT: 'call_takeaway_clicked'
};
