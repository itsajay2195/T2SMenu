import React from 'react';
import { ImageBackground, Text, View, ViewPropTypes } from 'react-native';
import Styles from '../Styles/LoyaltyStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, SCREEN_VIEW_ID } from '../Utils/LoyaltyConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';

const viewPropTypes = ViewPropTypes || View.propTypes;

const LoyaltyBannerView = ({ value }) => {
    return (
        <View screenName={SCREEN_NAME} id={SCREEN_VIEW_ID.LOYALTY_BANNER_VIEW} style={Styles.loyaltyViewParent} accessible={false}>
            <ImageBackground
                source={require('../Images/LoyaltyBanner.png')}
                style={[Styles.pointsBannerView]}
                imageStyle={Styles.pointsBannerImageStyle}>
                <View style={Styles.pointsView}>
                    <Text style={Styles.pointsTitle}>{LOCALIZATION_STRINGS.AVAILABLE_LOYALTY_POINTS}</Text>
                    <T2SText screenName={SCREEN_NAME} id={SCREEN_VIEW_ID.LOYALTY_POINTS_TEXT} style={Styles.pointsText}>
                        {value}
                    </T2SText>
                </View>
                <View style={Styles.pointsIcon}>
                    <CustomIcon name={FONT_ICON.LOYALTY_POINTS} size={60} color={Colors.white} />
                </View>
            </ImageBackground>
        </View>
    );
};

LoyaltyBannerView.propTypes = {
    imageBackgroundStyle: viewPropTypes.style
};

export default LoyaltyBannerView;
