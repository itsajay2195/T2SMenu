import { ImageBackground, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { styles } from '../Styles/OrderHistoryFoodHubItemStyle';
import React from 'react';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { VIEW_ID } from '../../Utils/OrderManagementConstants';
import { handleJoinBetaClick } from '../../Utils/OrderManagementHelper';
import Config from 'react-native-config';
import { isFoodHubApp } from 't2sbasemodule/Utils/helpers';
import T2STouchableWithoutFeedback from 't2sbasemodule/UI/CommonUI/T2STouchableWithoutFeedback';

const JoinBetaView = (props) => {
    if (isFoodHubApp()) {
        return (
            <ImageBackground
                source={require('../../Images/BetaBG.png')}
                style={[styles.joinBetaImageBackGroundStyle, props.isOrderStatus && { marginTop: 20 }]}>
                <T2STouchableWithoutFeedback style={styles.joinBetaImageTouchStyle}>
                    <View style={[styles.joinBetaViewStyle, props.isOrderStatus && { marginTop: 5 }]}>
                        <T2SText id={VIEW_ID.WHATS_NEW_TEXT} screenName={props.screenName} style={styles.joinBetaText}>
                            {LOCALIZATION_STRINGS.WHATS_NEW_TEXT}
                            <T2SText
                                id={VIEW_ID.FOODHUB_CLICK_TEXT}
                                screenName={props.screenName}
                                style={[
                                    styles.joinBetaText,
                                    {
                                        fontFamily: FONT_FAMILY.SEMI_BOLD,
                                        color: Colors.primaryTextColor
                                    }
                                ]}
                                onPress={() => handleJoinBetaClick()}>
                                {Config.APP_NAME + LOCALIZATION_STRINGS.CLICK_TEXT}
                            </T2SText>
                            <T2SText
                                id={VIEW_ID.JOIN_BETA_TEXT}
                                screenName={props.screenName}
                                style={[styles.joinBetaText, { color: Colors.lightBlue, paddingVertical: 8, paddingRight: 8 }]}
                                onPress={() => handleJoinBetaClick()}>
                                {LOCALIZATION_STRINGS.JOIN_BETA_TEXT}
                            </T2SText>
                        </T2SText>
                    </View>
                </T2STouchableWithoutFeedback>
            </ImageBackground>
        );
    } else {
        return null;
    }
};
export default JoinBetaView;
