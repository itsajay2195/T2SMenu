import T2STouchableOpacity from '../../CommonUI/T2STouchableOpacity';
import { View } from 'react-native';
import { T2SText } from '../../index';
import React from 'react';
import { chatButtonStyle } from './ChatButtonStyle';
import { VIEW_ID } from './ChatButtonConstant';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { startLiveChat } from 'appmodules/BaseModule/Helper';

export const ChatButtonComponent = (props) => {
    const { screenName, profileResponse, countryBaseFeatureGateResponse, languageKey, orderId, data } = props;

    return (
        <T2STouchableOpacity
            id={VIEW_ID.CHAT_BUTTON_CLICKED}
            screenName={screenName}
            onPress={() => {
                startLiveChat(profileResponse, languageKey, countryBaseFeatureGateResponse, orderId, data);
            }}>
            <View style={chatButtonStyle.buttonViewStyle}>
                <T2SText style={chatButtonStyle.buttonTextStyle} id={VIEW_ID.CHAT_BUTTON_TEXT} screenName={screenName}>
                    {LOCALIZATION_STRINGS.CHAT_WITH_US}
                </T2SText>
            </View>
        </T2STouchableOpacity>
    );
};
