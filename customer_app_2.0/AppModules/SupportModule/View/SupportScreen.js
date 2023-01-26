import React, { Component, Fragment } from 'react';
import { BackHandler, Image, View } from 'react-native';
import BaseComponent from '../../BaseModule/BaseComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { SupportStyle } from '../Style/SupportScreenStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { connect } from 'react-redux';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { MODULE, SCREEN_NAME, VIEW_ID } from '../Utils/SupportConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { redirectRouteAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import { isFoodHubApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { selectHasUserLoggedIn, selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import { handleHelpCenterRedirection, showMyTickets } from '../Utils/SupportHelpers';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { debounce } from 'lodash';
import { startLiveChat } from 'appmodules/BaseModule/Helper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';

class SupportScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromWebview: null
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.SUPPORT);
        const { route } = this.props;
        if (isValidElement(route) && isValidElement(route.params)) {
            this.setState({ fromWebview: route.params.fromWebview });
            this.backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
                handleNavigation(route.params.fromWebview);
                return true;
            });
        }
    }

    componentWillUnmount() {
        this.backhandler && this.backhandler.remove();
    }

    render() {
        let iconProps = {};
        if (isValidElement(this.state.fromWebview)) {
            iconProps.icon = FONT_ICON.BACK;
            iconProps.handleLeftActionPress = () => handleNavigation(this.state.fromWebview);
        }
        return (
            <BaseComponent
                showElevation={true}
                showHeader={true}
                {...iconProps}
                title={LOCALIZATION_STRINGS.SUPPORT}
                navigation={this.props.navigation}>
                <View style={SupportStyle.mainContainer}>
                    {isFoodHubApp() ? (
                        this.renderFoodhubContent()
                    ) : (
                        <Fragment>
                            <View style={[SupportStyle.imageAndTextContainerView]}>{this.renderHelpCenter()}</View>
                            {this.renderHorizontalLine()}
                            <View style={SupportStyle.imageAndTextContainerView}>{this.renderLiveChat()}</View>
                        </Fragment>
                    )}
                    {this.renderHorizontalLine()}
                    <View style={SupportStyle.imageAndTextContainerView}>{this.renderOrders()}</View>
                </View>
            </BaseComponent>
        );
    }
    renderFoodhubContent() {
        return (
            <Fragment>
                <View style={[SupportStyle.imageAndTextContainerView]}>
                    {this.renderHelpCenter()}
                    {this.renderVerticalDividerLine()}
                    {this.renderMyTicket()}
                </View>
                {this.renderHorizontalLine()}
                <View style={SupportStyle.imageAndTextContainerView}>
                    {this.renderMessage()}
                    {this.renderVerticalDividerLine()}
                    {this.renderLiveChat()}
                </View>
            </Fragment>
        );
    }

    renderHelpCenter() {
        return (
            <View style={[SupportStyle.imageAndTextView]}>
                <T2STouchableOpacity onPress={this.handleRequiresLoginAction.bind(this, MODULE.HELP_CENTER)}>
                    <View style={SupportStyle.imageView}>
                        <Image source={require('../Images/support.png')} style={SupportStyle.imageStyle} />
                    </View>
                    <T2SText style={SupportStyle.titleTextStyle} id={VIEW_ID.HELP_CENTER_TEXT} screenName={SCREEN_NAME.SUPPORT}>
                        {LOCALIZATION_STRINGS.HELP_CENTER}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderMyTicket() {
        return (
            <View style={SupportStyle.imageAndTextView}>
                <T2STouchableOpacity onPress={this.handleRequiresLoginAction.bind(this, MODULE.MY_TICKETS)}>
                    <View style={SupportStyle.imageView}>
                        <Image source={require('../Images/Myticket.png')} style={SupportStyle.imageStyle} />
                    </View>
                    <T2SText style={SupportStyle.titleTextStyle} id={VIEW_ID.MY_TICKETS_TEXT} screenName={SCREEN_NAME.SUPPORT}>
                        {LOCALIZATION_STRINGS.MY_TICKETS}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderHorizontalLine() {
        return (
            <View style={SupportStyle.horizontalDividerLineContainer}>
                <View style={SupportStyle.horizontalDividerLine} />
                <View style={SupportStyle.horizontalDividerLine} />
            </View>
        );
    }

    renderMessage() {
        return (
            <View style={SupportStyle.imageAndTextView}>
                <T2STouchableOpacity onPress={this.handleRequiresLoginAction.bind(this, MODULE.CONTACT_US)}>
                    <View style={SupportStyle.imageView}>
                        <Image source={require('../Images/Message.png')} style={SupportStyle.imageStyle} />
                    </View>
                    <T2SText style={SupportStyle.titleTextStyle} id={VIEW_ID.CONTACT_US_TEXT} screenName={SCREEN_NAME.SUPPORT}>
                        {LOCALIZATION_STRINGS.CONTACT_US}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderLiveChat() {
        return (
            <View style={SupportStyle.imageAndTextView}>
                <T2STouchableOpacity onPress={this.handleRequiresLoginAction.bind(this, MODULE.LIVE_CHAT)}>
                    <View style={SupportStyle.imageView}>
                        <Image source={require('../Images/liveChat.png')} style={SupportStyle.imageStyle} />
                    </View>
                    <T2SText style={SupportStyle.titleTextStyle} id={VIEW_ID.LIVE_CHAT_TEXT} screenName={SCREEN_NAME.SUPPORT}>
                        {LOCALIZATION_STRINGS.LIVE_CHAT}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderVerticalDividerLine() {
        return <View style={[SupportStyle.mainVerticalDividerLine, { marginVertical: 20 }]} />;
    }

    renderOrders() {
        return (
            <T2SView screenName={SCREEN_NAME.SUPPORT} id={VIEW_ID.ORDER_NOW_VIEW} style={SupportStyle.imageAndTextView}>
                <T2STouchableOpacity onPress={this.showHome.bind(this)}>
                    <View style={SupportStyle.imageView}>
                        <Image source={require('../Images/Orders.png')} style={SupportStyle.imageStyle} />
                    </View>
                    <T2SText screenName={SCREEN_NAME.SUPPORT} style={SupportStyle.titleTextStyle} id={VIEW_ID.ORDER_NOW_TEXT}>
                        {LOCALIZATION_STRINGS.ORDER_NOW}
                    </T2SText>
                </T2STouchableOpacity>
            </T2SView>
        );
    }

    showHome = debounce(
        () => {
            this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
            this.props.navigation.navigate(SCREEN_OPTIONS.HOME.route_name);
            Analytics.logEvent(ANALYTICS_SCREENS.SUPPORT, ANALYTICS_EVENTS.ORDER_NOW);
        },
        500,
        { leading: true, trailing: false }
    );

    handleRequiresLoginAction = debounce(
        (module) => {
            let { isUserLoggedIn, profileResponse, deviceToken, countryBaseFeatureGateResponse, defaultLanguage, languageKey } = this.props;
            if (isUserLoggedIn) {
                if (module === MODULE.HELP_CENTER) {
                    handleHelpCenterRedirection(profileResponse, languageKey);
                } else if (module === MODULE.MY_TICKETS) {
                    Analytics.logEvent(ANALYTICS_SCREENS.SUPPORT, ANALYTICS_EVENTS.MY_TICKETS);
                    showMyTickets(profileResponse);
                } else if (module === MODULE.CONTACT_US) {
                    Analytics.logEvent(ANALYTICS_SCREENS.SUPPORT, ANALYTICS_EVENTS.CONTACT_US);
                    // showContactSupport(profileResponse);
                    handleNavigation(SCREEN_OPTIONS.MY_TICKETS_SCREEN.route_name);
                } else if (module === MODULE.LIVE_CHAT) {
                    Analytics.logEvent(ANALYTICS_SCREENS.SUPPORT, ANALYTICS_EVENTS.LIVE_CHAT);
                    startLiveChat(profileResponse, defaultLanguage, countryBaseFeatureGateResponse);
                }
            } else {
                handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
                this.props.redirectRouteAction(SCREEN_OPTIONS.SUPPORT.route_name, {
                    module: module,
                    deviceToken: deviceToken,
                    countryBaseFeatureGateResponse: countryBaseFeatureGateResponse,
                    defaultLanguage: defaultLanguage
                });
            }
        },
        500,
        { leading: true, trailing: false }
    );
}

const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    deviceToken: state.pushNotificationState.deviceToken,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    language: state.appState.language,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    defaultLanguage: selectLanguageKey(state),
    languageKey: selectLanguageKey(state)
});

const mapDispatchToProps = {
    setSideMenuActiveAction,
    redirectRouteAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportScreen);
