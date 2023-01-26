import React, { Component } from 'react';
import { Image, View, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { GOOGLE_SIGN_IN_SCOPES, LOGIN_TYPE, SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStyle } from '../Styles/AuthStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SOutlineButton from 't2sbasemodule/UI/CommonUI/T2SOutlineButton';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { isFoodHubApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { Text } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import { handleSocialLoginAction, resetEmailExistingAction } from '../Redux/AuthAction';
import { T2SAppBar } from 't2sbasemodule/UI';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { GoogleSignin } from '@react-native-community/google-signin';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import appleAuth from '@invertase/react-native-apple-authentication';
import Config from 'react-native-config';
import { redirectRoutesAction, resetRedirectRoutesAction } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import _ from 'lodash';
import AssuranceModal from './AssuranceModal';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import { isAndroid } from '../../BaseModule/Helper';
import { getFoodhubLogoStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { selectCountryBaseFeatureGateResponse } from '../../BasketModule/Redux/BasketSelectors';

const screenName = SCREEN_NAME.SOCIAL_LOGIN_SCREEN;
GoogleSignin.configure({
    scopes: [GOOGLE_SIGN_IN_SCOPES.EMAIL, GOOGLE_SIGN_IN_SCOPES.PROFILE],
    webClientId: Config.WEBCLIENT_ID
});

class SocialLogin extends Component {
    constructor() {
        super();
        this.handleCreateAccountAction = this.handleCreateAccountAction.bind(this);
        this.handleLoginAction = this.handleLoginAction.bind(this);
    }

    state = {
        showSocialLoginLoading: false,
        showAssuranceModal: false
    };

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.SOCIAL_LOGIN_SCREEN);
        const { route } = this.props;
        if (isValidElement(route) && isValidElement(route.params) && isValidElement(route.params.redirectRoute)) {
            this.props.redirectRoutesAction(route.params.redirectRoute, route.params.redirectNavigation, route.params.fromTakeawayList);
        }
        setTimeout(
            () => {
                this.signInAutomatically();
            },
            isAndroid() ? 300 : 100
        );
    }

    signInAutomatically() {
        if (Platform.OS === 'android') {
            this.props.handleSocialLoginAction(LOGIN_TYPE.GOOGLE);
            this.logAnalytics(LOGIN_TYPE.GOOGLE);
        }
    }

    componentWillUnmount() {
        this.props.resetRedirectRoutesAction();
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { socialLoginLoading } = props;
        if (socialLoginLoading !== state.showSocialLoginLoading) {
            value.showSocialLoginLoading = socialLoginLoading;
        }
        return _.isEmpty(value) ? null : value;
    }

    render() {
        return (
            <SafeAreaView>
                <View style={AuthStyle.mainContainer}>
                    <T2SAppBar id={VIEW_ID.BACK_BUTTON} screenName={screenName} showElevation={false} />
                    <View style={AuthStyle.socialLoginButtonContainer}>
                        {isFoodHubApp() && this.renderFoodhubLogo()}
                        {this.renderMoreInfo()}
                        {appleAuth.isSupported &&
                            this.renderSocialLoginButton(VIEW_ID.APPLE_SIGN_IN_BUTTON, LOCALIZATION_STRINGS.APPLE_SIGN_IN)}
                        {this.renderSocialLoginButton(VIEW_ID.GOOGLE_SIGN_IN_BUTTON, LOCALIZATION_STRINGS.GOOGLE_SIGN_IN)}
                        {this.renderSocialLoginButton(VIEW_ID.FACEBOOK_SIGN_IN_BUTTON, LOCALIZATION_STRINGS.FACEBOOK_SIGN_IN)}
                        <View style={AuthStyle.orViewStyle}>
                            <View style={AuthStyle.orLineStyle} />
                            <Text style={AuthStyle.orTextStyle}>{`(${LOCALIZATION_STRINGS.OR})`}</Text>
                            <View style={AuthStyle.orLineStyle} />
                        </View>
                        <T2SOutlineButton
                            buttonStyle={[AuthStyle.socialLoginButtonStyle, AuthStyle.createAccountButtonStyle]}
                            buttonTextStyle={[AuthStyle.buttonTextStyle, AuthStyle.createAccount, { color: Colors.primaryColor }]}
                            screenName={screenName}
                            uppercase={true}
                            id={VIEW_ID.CREATE_ACCOUNT_BUTTON}
                            title={LOCALIZATION_STRINGS.CREATE_ACCOUNT}
                            onPress={this.handleCreateAccountAction}
                        />
                        <View style={AuthStyle.loginViewStyle}>
                            <Text style={AuthStyle.alreadyTextStyle}>{LOCALIZATION_STRINGS.ALREADY_ACCOUNT}</Text>
                            <T2STouchableOpacity screenName={screenName} id={VIEW_ID.LOGIN_BUTTON} onPress={this.handleLoginAction}>
                                <Text style={AuthStyle.loginTextStyle}>{LOCALIZATION_STRINGS.LOG_IN}</Text>
                            </T2STouchableOpacity>
                        </View>
                    </View>
                </View>
                {this.renderLoader()}
                {this.state.showAssuranceModal && this.renderAssuranceModal()}
            </SafeAreaView>
        );
    }

    renderFoodhubLogo() {
        return (
            <T2SImage
                style={AuthStyle.foodHubLogoStyle}
                resizeMode={'contain'}
                source={getFoodhubLogoStatus(this.props.countryBaseFeatureGateResponse?.foodhub_logo)}
            />
        );
    }

    renderMoreInfo() {
        return (
            <T2SText screenName={screenName} id={VIEW_ID.MORE_INFO_TEXT} style={AuthStyle.moreInfoContentTextStyle}>
                {Platform.OS === 'ios' ? LOCALIZATION_STRINGS.SOCIAL_MORE_INFO_IOS : LOCALIZATION_STRINGS.SOCIAL_MORE_INFO}
                {
                    <T2SText
                        onPress={() => {
                            this.setState({ showAssuranceModal: true });
                        }}
                        screenName={screenName}
                        id={VIEW_ID.MORE_INFO_CONTENT}
                        style={AuthStyle.moreInfoTextStyle}>
                        {LOCALIZATION_STRINGS.MORE_INFO}
                    </T2SText>
                }
            </T2SText>
        );
    }

    renderSocialLoginButton(id, title) {
        return (
            <T2SOutlineButton
                buttonStyle={AuthStyle.socialLoginButtonStyle}
                buttonTextStyle={[AuthStyle.buttonTextStyle]}
                screenName={screenName}
                id={id}
                title={title}
                onPress={this.handleSocialLoginActions.bind(this, id)}
                icon={this.renderIcon.bind(this, id)}
                uppercase={false}
            />
        );
    }

    renderIcon(id) {
        let file = null;
        if (id === VIEW_ID.APPLE_SIGN_IN_BUTTON) {
            file = require('../../../CustomerApp/Images/apple_logo.png');
        } else if (id === VIEW_ID.GOOGLE_SIGN_IN_BUTTON) {
            file = require('../../../CustomerApp/Images/google_logo.png');
        } else if (id === VIEW_ID.FACEBOOK_SIGN_IN_BUTTON) {
            file = require('../../../CustomerApp/Images/facebook_logo.png');
        }
        if (isValidElement(file)) {
            return (
                <View>
                    <Image style={AuthStyle.buttonIconStyle} source={file} />
                </View>
            );
        }
    }

    renderLoader() {
        if (this.state.showSocialLoginLoading) {
            return (
                <View style={AuthStyle.loadingViewStyle}>
                    <View style={AuthStyle.loadingWhiteViewStyle}>
                        <ActivityIndicator color={Colors.secondary_color} size={'large'} />
                    </View>
                </View>
            );
        }
    }

    renderAssuranceModal() {
        return <AssuranceModal onModalClose={this.handleAssuranceModalClose.bind(this)} />;
    }
    handleAssuranceModalClose(isClose) {
        this.setState({ showAssuranceModal: isClose });
    }
    handleSocialLoginActions(id) {
        if (id === VIEW_ID.APPLE_SIGN_IN_BUTTON) {
            this.logAnalytics(id);
            this.props.handleSocialLoginAction(LOGIN_TYPE.APPLE);
        } else if (id === VIEW_ID.GOOGLE_SIGN_IN_BUTTON) {
            this.logAnalytics(id);
            this.props.handleSocialLoginAction(LOGIN_TYPE.GOOGLE);
        } else if (id === VIEW_ID.FACEBOOK_SIGN_IN_BUTTON) {
            this.logAnalytics(id);
            this.props.handleSocialLoginAction(LOGIN_TYPE.FACEBOOK);
        } else {
            this.handleCreateAccountAction();
        }
    }

    logAnalytics(id) {
        const { countryBaseFeatureGateResponse } = this.props;
        if (isValidElement(id)) {
            if (id === VIEW_ID.APPLE_SIGN_IN_BUTTON) {
                Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.SIGN_UP_STARTED, {
                    method: LOGIN_TYPE.APPLE
                });
            } else if (id === VIEW_ID.GOOGLE_SIGN_IN_BUTTON) {
                Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.SIGN_UP_STARTED, {
                    method: LOGIN_TYPE.GOOGLE
                });
            } else if (id === VIEW_ID.FACEBOOK_SIGN_IN_BUTTON) {
                Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.SIGN_UP_STARTED, {
                    method: LOGIN_TYPE.FACEBOOK
                });
            } else if (id === VIEW_ID.CREATE_ACCOUNT_BUTTON) {
                Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.SIGN_UP_STARTED, {
                    method: LOGIN_TYPE.EMAIL
                });
            }
        }
    }
    handleCreateAccountAction() {
        this.props.resetEmailExistingAction();
        this.logAnalytics(VIEW_ID.CREATE_ACCOUNT_BUTTON);
        handleNavigation(SCREEN_OPTIONS.EMAIL_VERIFICATION.route_name);
    }

    handleLoginAction() {
        Analytics.logAction(ANALYTICS_SCREENS.SOCIAL_LOGIN_SCREEN, ANALYTICS_EVENTS.LOGIN_NAVIGATION_BUTTON_CLICKED);
        handleNavigation(SCREEN_OPTIONS.LOGIN.route_name);
    }
}

const mapStateToProps = (state) => ({
    socialLoginLoading: state.authState.socialLoginLoading,
    countryBaseFeatureGateResponse: selectCountryBaseFeatureGateResponse(state)
});

const mapDispatchToProps = {
    redirectRoutesAction,
    resetRedirectRoutesAction,
    resetEmailExistingAction,
    handleSocialLoginAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin);
