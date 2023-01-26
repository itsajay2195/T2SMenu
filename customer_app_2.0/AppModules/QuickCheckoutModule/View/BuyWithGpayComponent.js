import { Image, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from 't2sbasemodule/UI/CustomUI/HeroNavigator/HeroNavigationConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import React from 'react';
import { BuyWithPaymentStyle } from './Styles/BuyWithPaymentStyle';

export const BuyWithPayComponent = (props) => {
    const { screenName, isApplePay, alignmentStyle, textStyle, showWithImage = false } = props;
    return (
        <View style={[BuyWithPaymentStyle.containerStyle, alignmentStyle]}>
            <T2SText screenName={screenName} id={VIEW_ID.MAIN_PAGE_SUBTITLE_VALUE} style={[BuyWithPaymentStyle.BuyWithText, textStyle]}>
                {LOCALIZATION_STRINGS.BUY_WITH}
            </T2SText>
            <Image
                screenName={screenName}
                id={isApplePay ? VIEW_ID.QC_GOOGLE_ICON : VIEW_ID.QC_APPLE_ICON}
                source={
                    isApplePay
                        ? showWithImage
                            ? require('../Images/apple_pay_white.png')
                            : require('../Images/apple_pay.png')
                        : require('../Images/g_pay.png')
                }
                style={isApplePay ? BuyWithPaymentStyle.applePayIconStyle : BuyWithPaymentStyle.iconStyle}
                resizeMode="contain"
            />
        </View>
    );
};
