import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { T2SAppBar } from 't2sbasemodule/UI';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReferralStyles } from '../Styles/ReferralStyles';
import { SCREEN_NAME, VIEW_ID } from '../Utils/ProfileConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import {
    isValidElement,
    openShareOption,
    safeStringValue,
    shareMessageToMessageApp,
    shareMessageToWhatsApp,
    writeToClipboard
} from 't2sbasemodule/Utils/helpers';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { getShareImage } from '../../../FoodHubApp/HomeModule/Utils/Helper';

let screenName = SCREEN_NAME.REFERRAL_SCREEN;
let timeout;

class ReferralScreen extends Component {
    constructor(props) {
        super(props);
        this.handleCopyAction = this.handleCopyAction.bind(this);
        this.handleShareAction = this.handleShareAction.bind(this);
        this.handleShareMessageAppAction = this.handleShareMessageAppAction.bind(this);
        this.handleShareWhatsAppAction = this.handleShareWhatsAppAction.bind(this);

        this.state = {
            showBackButton: false,
            copyText: LOCALIZATION_STRINGS.COPY,
            backgroundColor: Colors.white,
            borderColor: Colors.primaryColor,
            copyTextColor: Colors.primaryColor
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.REFERRAL_SCREEN);
        this.didFocus = this.props.navigation.addListener('focus', () => {
            if (isValidElement(this.props.route?.params?.showBackButton)) {
                this.setState({ showBackButton: this.props.route?.params?.showBackButton });
            }
        });
    }

    componentWillUnmount() {
        if (isValidElement(this.didFocus)) {
            this.props.navigation.removeListener(this.didFocus);
        }
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }

    render() {
        return (
            <SafeAreaView style={ReferralStyles.mainContainer}>
                <T2SAppBar
                    title={LOCALIZATION_STRINGS.REFER_FRIENDS_HEADER}
                    screenName={screenName}
                    id={VIEW_ID.REFERRAL_LINK_VIEW_HEADER}
                    icon={!this.state.showBackButton ? FONT_ICON.HAMBURGER : FONT_ICON.BACK}
                />
                <View style={ReferralStyles.childContainer}>
                    {this.renderInfoTextView()}
                    {this.renderSubInfoText()}
                    {this.renderShareLink()}
                    {this.renderCopyView()}
                    {this.renderMoreShareLink()}
                    {this.renderShareView()}
                </View>
            </SafeAreaView>
        );
    }
    renderInfoTextView() {
        return (
            <T2SText style={ReferralStyles.infoText} screenName={screenName} id={VIEW_ID.REFERRAL_INFO_TEXT}>
                {LOCALIZATION_STRINGS.REFERRAL_SCREEN_INFO_MSG}
            </T2SText>
        );
    }
    renderSubInfoText() {
        return (
            <T2SText style={ReferralStyles.infoText1} screenName={screenName} id={VIEW_ID.REFERRAL_INFO_TEXT}>
                {`(${LOCALIZATION_STRINGS.VALID_FOR_PRE_PAID_ORDER_ONLY})`}
            </T2SText>
        );
    }

    renderShareLink() {
        return (
            <T2SText style={ReferralStyles.childHeaderText} screenName={screenName} id={VIEW_ID.SHARE_LINK_TEXT}>
                {LOCALIZATION_STRINGS.SHARE_YOUR_LINK}
            </T2SText>
        );
    }

    renderCopyView() {
        return (
            <View style={ReferralStyles.copyView}>
                {this.renderCopyLink()}
                {this.renderCopyButton()}
            </View>
        );
    }

    renderCopyLink() {
        return (
            <View style={ReferralStyles.copyLinkTextView}>
                <T2SText numberOfLines={1} style={ReferralStyles.copyLinkText} screenName={screenName} id={VIEW_ID.COPY_TEXT}>
                    {this.props.referralLink}
                </T2SText>
            </View>
        );
    }

    renderCopyButton() {
        const { copyText, backgroundColor, borderColor, copyTextColor } = this.state;
        return (
            <T2STouchableOpacity
                style={[ReferralStyles.copyButton, { backgroundColor: backgroundColor, borderColor: borderColor }]}
                screenName={screenName}
                id={VIEW_ID.COPY_BUTTON}
                onPress={this.handleCopyAction}>
                <T2SText
                    uppercase={true}
                    style={[ReferralStyles.copyButtonText, { color: copyTextColor }]}
                    screenName={screenName}
                    id={VIEW_ID.COPY_TEXT}>
                    {copyText}
                </T2SText>
            </T2STouchableOpacity>
        );
    }
    renderMoreShareLink() {
        return (
            <T2SText style={ReferralStyles.childHeaderText} screenName={screenName} id={VIEW_ID.SHARE_LINK_TEXT}>
                {LOCALIZATION_STRINGS.MORE_WAYS_TO_SHARE}
            </T2SText>
        );
    }

    renderShareView() {
        return (
            <View style={ReferralStyles.copyView}>
                {this.renderMessageShareButton()}
                {this.renderWhatsAppShareButton()}
                {this.renderShareOptionButton()}
            </View>
        );
    }

    renderMessageShareButton() {
        return (
            <T2STouchableOpacity
                style={ReferralStyles.shareView}
                screenName={screenName}
                id={VIEW_ID.SHARE_MESSAGE_BUTTON}
                onPress={this.handleShareMessageAppAction}>
                {this.renderShareIcon(VIEW_ID.SHARE_MESSAGE_IMAGE)}
                <T2SText style={ReferralStyles.shareButtonText} screenName={screenName} id={VIEW_ID.SHARE_MESSAGE_TEXT}>
                    {LOCALIZATION_STRINGS.MESSAGE}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    renderWhatsAppShareButton() {
        return (
            <T2STouchableOpacity
                style={ReferralStyles.shareView}
                screenName={screenName}
                id={VIEW_ID.SHARE_WHATSAPP_BUTTON}
                onPress={this.handleShareWhatsAppAction}>
                {this.renderShareIcon(VIEW_ID.SHARE_WHATSAPP_IMAGE)}
                <T2SText style={ReferralStyles.shareButtonText} screenName={screenName} id={VIEW_ID.SHARE_WHATSAPP_TEXT}>
                    {LOCALIZATION_STRINGS.WHATSAPP}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    renderShareOptionButton() {
        return (
            <T2STouchableOpacity
                style={ReferralStyles.shareView}
                screenName={screenName}
                id={VIEW_ID.SHARE_OPTION_BUTTON}
                onPress={this.handleShareAction}>
                {this.renderShareIcon(VIEW_ID.SHARE_OPTION_IMAGE)}
                <T2SText style={ReferralStyles.shareButtonText} screenName={screenName} id={VIEW_ID.SHARE_OPTION_TEXT}>
                    {LOCALIZATION_STRINGS.SHARE}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    renderShareIcon(viewID) {
        return (
            <Image
                screenName={screenName}
                id={viewID}
                source={getShareImage(viewID)}
                style={ReferralStyles.shareIcon}
                resizeMode="contain"
            />
        );
    }

    handleCopyAction() {
        writeToClipboard(safeStringValue(this.props.referralLink)).then(() =>
            this.setState({
                copyText: LOCALIZATION_STRINGS.COPIED,
                backgroundColor: Colors.primaryColor,
                borderColor: Colors.primaryColor,
                copyTextColor: Colors.white
            })
        );
        timeout = setTimeout(
            () =>
                this.setState({
                    copyText: LOCALIZATION_STRINGS.COPY,
                    backgroundColor: Colors.white,
                    borderColor: Colors.primaryColor,
                    copyTextColor: Colors.primaryColor
                }),
            1000
        );
    }
    handleShareMessageAppAction() {
        shareMessageToMessageApp(LOCALIZATION_STRINGS.REFERRAL_SCREEN_INFO_MSG, this.props.referralLink);
    }
    handleShareWhatsAppAction() {
        shareMessageToWhatsApp(LOCALIZATION_STRINGS.REFERRAL_SCREEN_INFO_MSG, this.props.referralLink);
    }
    handleShareAction() {
        openShareOption(LOCALIZATION_STRINGS.REFERRAL_SCREEN_INFO_MSG, this.props.referralLink);
    }
}
const mapStateToProps = (state) => ({
    referralLink: state.profileState.profileResponse?.referralLink
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReferralScreen);
