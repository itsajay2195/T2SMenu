import React, { useState } from 'react';
import { View, ImageBackground, Image } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { connect } from 'react-redux';
import { selectCurrencySymbol } from 't2sbasemodule/Utils/AppSelectors';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { Colors } from 't2sbasemodule/Themes';
import { getUserName } from 'appmodules/BaseModule/Helper';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/WalletConstants';
import { walletStyles } from '../Style/WalletStyles';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

let screenName = SCREEN_NAME.WALLET_SCREEN;

const WalletBannerWidget = (props) => {
    const [language, setLanguage] = useState(props.language);
    const { currency, walletBalance, profileName } = props;
    if (props.language !== language) {
        setLanguage(props.language);
    }
    return (
        <View>
            <ImageBackground
                source={require('../../Image/walletBanner.png')}
                style={walletStyles.backgroundImageView}
                imageStyle={walletStyles.backgroundImage}>
                <View style={walletStyles.mainContainer}>
                    <View style={walletStyles.rowContainer}>
                        <T2SIcon
                            screenName={screenName}
                            id={VIEW_ID.WALLET_IMAGE}
                            style={walletStyles.iconStyle}
                            icon={FONT_ICON.PAY}
                            size={60}
                            color={Colors.white}
                        />
                        <View style={walletStyles.balanceView}>
                            <T2SText id={VIEW_ID.WALLET_BALANCE_TEXT} screenName={screenName} style={walletStyles.balanceTextStyle}>
                                {LOCALIZATION_STRINGS.WALLET_BALANCE}
                            </T2SText>
                            <View style={walletStyles.row}>
                                <T2SText
                                    numberOfLines={1}
                                    id={VIEW_ID.WALLET_BALANCE_VALUE_TEXT}
                                    screenName={screenName}
                                    style={[walletStyles.currencyText]}>
                                    {currency}
                                    {walletBalance}
                                </T2SText>
                            </View>
                        </View>
                    </View>
                    <Image source={require('../../Image/Foodhub.png')} style={walletStyles.logoStyle} resizeMode="contain" />
                </View>
                <T2SText accessible={false} id={VIEW_ID.USER_NAME_TEXT} screenName={screenName} style={walletStyles.userNameStyle}>
                    {profileName}
                </T2SText>
            </ImageBackground>
        </View>
    );
};

const mapStateToProps = (state) => ({
    currency: selectCurrencySymbol(state),
    walletBalance: state.walletState.walletBalance,
    profileName: getUserName(state.profileState.profileResponse),
    language: state.appState.language?.code
});

export default React.memo(connect(mapStateToProps, null)(WalletBannerWidget));
