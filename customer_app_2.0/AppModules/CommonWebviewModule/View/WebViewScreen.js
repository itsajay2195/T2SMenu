import React, { Component } from 'react';
import { Image, ScrollView, View, Platform, Linking } from 'react-native';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import BaseComponent from '../../BaseModule/BaseComponent';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import GDPRStyles from '../Styles/WebViewStyles';
import { getPolicyLookupResponse, wrapHtmlTag } from '../Utils/WebviewHelpers';
import { T2SAppBar } from 't2sbasemodule/UI';
import { callNumber, isFranchiseApp, isNonCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { VIEW_ID } from '../Utils/WebViewConstants';
import { policyLookupAction, redirectRouteAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { loginRequiredScreens } from '../../../CustomerApp/Utils/SideMenuHelper';
import { CommonActions } from '@react-navigation/native';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import _ from 'lodash';
import { isAndroid } from '../../BaseModule/Helper';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { getFoodhubLogoStatus } from '../../BaseModule/Utils/FeatureGateHelper';

let policyId = null;

class WebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.handleOnLoadEnd = this.handleOnLoadEnd.bind(this);
        this.onWebViewMessage = this.onWebViewMessage.bind(this);
        this.state = { htmlContent: '', screenName: '', showBackButton: false, webViewHeight: 0, showLogo: false };
    }

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            const { policyLookupResponse, route } = this.props;
            if (isValidElement(route) && isValidElement(route.name)) {
                policyId = this.getPolicyID(route.name);
            }
            if (isValidElement(route.params) && isValidElement(route.params.showBackButton)) {
                this.setState({ showBackButton: route.params.showBackButton });
            }
            if (isValidElement(policyLookupResponse) && isValidElement(policyLookupResponse.data) && isValidElement(policyId)) {
                this.setState({ htmlContent: getPolicyLookupResponse(policyLookupResponse.data, policyId) });
            } else {
                this.props.policyLookupAction();
            }
            Analytics.logScreen(this.getAnalyticsScreenName(route.name));
        });
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { policyLookupResponse } = props;
        if (policyLookupResponse !== state.policyLookupResponse) {
            value.policyLookupResponse = policyLookupResponse;
            if (isValidElement(policyLookupResponse) && isValidElement(policyLookupResponse.data) && isValidElement(policyId)) {
                value.htmlContent = getPolicyLookupResponse(policyLookupResponse.data, policyId);
            }
        }
        return _.isEmpty(value) ? null : value;
    }

    getAnalyticsScreenName(routeName) {
        if (routeName === SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name) {
            return ANALYTICS_SCREENS.TERMS_AND_CONDITIONS;
        } else if (routeName === SCREEN_OPTIONS.TERMS_OF_USE.route_name) {
            return ANALYTICS_SCREENS.TERMS_OF_USE;
        } else if (routeName === SCREEN_OPTIONS.PRIVACY_POLICY.route_name) {
            return ANALYTICS_SCREENS.PRIVACY_POLICY;
        } else if (routeName === SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name) {
            return ANALYTICS_SCREENS.ALLERGY_INFORMATION;
        } else if (routeName === SCREEN_OPTIONS.ABOUT_US.route_name) {
            return ANALYTICS_SCREENS.ABOUT_US;
        } else {
            return '';
        }
    }

    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }
    getPolicyID(routeName) {
        if (routeName === SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name) {
            this.setState({ screenName: LOCALIZATION_STRINGS.TERMS_AND_CONDITIONS });
            return BASE_PRODUCT_CONFIG.policy_type_id.terms_and_conditions;
        } else if (routeName === SCREEN_OPTIONS.TERMS_OF_USE.route_name) {
            this.setState({ screenName: LOCALIZATION_STRINGS.TERMS_OF_USE });
            return BASE_PRODUCT_CONFIG.policy_type_id.terms_of_use;
        } else if (routeName === SCREEN_OPTIONS.PRIVACY_POLICY.route_name) {
            this.setState({ screenName: LOCALIZATION_STRINGS.PRIVACY_POLICY });
            return BASE_PRODUCT_CONFIG.policy_type_id.privacy_policy;
        } else if (routeName === SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name) {
            this.setState({ screenName: LOCALIZATION_STRINGS.ALLERGY_INFORMATION });
            return BASE_PRODUCT_CONFIG.policy_type_id.allergy_information;
        } else if (routeName === SCREEN_OPTIONS.ABOUT_US.route_name) {
            this.setState({ screenName: LOCALIZATION_STRINGS.ABOUT_US });
            return BASE_PRODUCT_CONFIG.policy_type_id.about_us;
        }
    }

    getBaseUrl() {
        if (this.state.screenName === LOCALIZATION_STRINGS.ALLERGY_INFORMATION && Platform.OS === 'android') {
            return 'https://foodhub.co.uk'; //Dummy url to avoid the hash navigation issue in android webview
        }
    }

    render() {
        return (
            <BaseComponent
                showHeader={!this.state.showBackButton}
                showZendeskChat={false}
                showElevation={true}
                navigation={this.props.navigation}>
                <View style={GDPRStyles.container}>
                    {this.state.showBackButton && <T2SAppBar title={this.state.screenName} navigation={this.props.navigation} />}
                    {this.state.showLogo ? this.renderAboutUsView() : this.renderWebView()}
                </View>
            </BaseComponent>
        );
    }
    renderAboutUsView() {
        return (
            <ScrollView>
                {this.renderWebView(true)}
                {this.foodhubImageView()}
            </ScrollView>
        );
    }

    renderWebView(isAboutUs = false) {
        return (
            <WebView
                useWebKit={true}
                id={VIEW_ID.WEB_VIEW}
                screenName={this.state.screenName}
                style={isAboutUs && [GDPRStyles.innerContainer, { height: this.state.webViewHeight }]}
                javaScriptEnabled={true}
                allowUniversalAccessFromFileURLs={true}
                thirdPartyCookiesEnabled={true}
                source={{
                    baseUrl: this.getBaseUrl(),
                    html: wrapHtmlTag(this.state.htmlContent)
                }}
                ref={(ref) => {
                    this.webview = ref;
                }}
                originWhitelist={['*']}
                renderError={(e) => {
                    //LINT escape
                }}
                scalesPageToFit={false}
                onShouldStartLoadWithRequest={this.handleGDPRHyperLink.bind(this)}
                onMessage={this.onWebViewMessage}
                injectedJavaScript="window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
                onLoadEnd={this.handleOnLoadEnd}
            />
        );
    }

    onWebViewMessage(event: WebViewMessageEvent) {
        this.setState({ webViewHeight: Number(event.nativeEvent.data) });
    }

    foodhubImageView() {
        if (isNonCustomerApp()) {
            return (
                <View style={GDPRStyles.imageViewContainer}>
                    <Image
                        style={GDPRStyles.imageView}
                        source={
                            isFranchiseApp()
                                ? require('../../../FranchiseApp/Images/side_menu_cp_logo.png')
                                : getFoodhubLogoStatus(this.props.foodhub_logo)
                        }
                    />
                </View>
            );
        }
    }

    handleGDPRHyperLink(event) {
        const { policyLookupResponse, route } = this.props;
        Analytics.logAction(this.getAnalyticsScreenName(route.name), ANALYTICS_EVENTS.LINK_PRESSED_IN_WEBVIEW, { event: event.url });
        if (event.url.includes('terms-of-use') || event.url.includes('termsanduse')) {
            this.webview.stopLoading();
            if (!this.state.showBackButton) {
                this.props.setSideMenuActiveAction(SCREEN_OPTIONS.TERMS_OF_USE.route_name);
                handleNavigation(SCREEN_OPTIONS.TERMS_OF_USE.route_name, { showBackButton: true });
                return false;
            } else if (this.state.showBackButton) {
                this.setState({
                    htmlContent: getPolicyLookupResponse(
                        policyLookupResponse.data,
                        this.getPolicyID(SCREEN_OPTIONS.TERMS_OF_USE.route_name)
                    )
                });
                return false;
            }
        } else if (event.url.includes('privacy') && !event.url.includes('google')) {
            this.webview.stopLoading();
            if (!this.state.showBackButton) {
                this.props.setSideMenuActiveAction(SCREEN_OPTIONS.PRIVACY_POLICY.route_name);
                handleNavigation(SCREEN_OPTIONS.PRIVACY_POLICY.route_name, { showBackButton: true });
                return false;
            } else if (this.state.showBackButton) {
                this.setState({
                    htmlContent: getPolicyLookupResponse(
                        policyLookupResponse.data,
                        this.getPolicyID(SCREEN_OPTIONS.PRIVACY_POLICY.route_name)
                    )
                });
                return false;
            }
        } else if (event.url.includes('contactus') || event.url.includes('support')) {
            this.webview.stopLoading();
            const { navigation, isUserLoggedIn } = this.props;
            const isLoginRequired = loginRequiredScreens(SCREEN_OPTIONS.SUPPORT.route_name, isUserLoggedIn);
            let route;
            if (isLoginRequired) {
                route = SCREEN_OPTIONS.SOCIAL_LOGIN.route_name;
                this.props.redirectRouteAction(SCREEN_OPTIONS.CONTACT.route_name, { fromWebview: this.props.route.name });
            } else {
                route = SCREEN_OPTIONS.SUPPORT.route_name;
            }
            const navigateAction = CommonActions.navigate({
                name: route,
                params: {
                    fromWebview: this.props.route.name
                }
            });
            this.props.setSideMenuActiveAction(SCREEN_OPTIONS.SUPPORT.route_name);
            navigation.dispatch(navigateAction);
            return false;
        } else if (event.url.includes('tel')) {
            this.webview.stopLoading();
            callNumber(event.url);
            return false;
        } else if (
            event.url.startsWith('maps:') ||
            event.url.startsWith('geo:') ||
            event.url.startsWith('sms:') ||
            event.url.includes('mailto:')
        ) {
            if (isAndroid()) {
                Linking.openURL(event.url);
            } else {
                Linking.canOpenURL(event.url)
                    .then((supported) => {
                        if (!supported) {
                            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
                        } else {
                            Linking.openURL(event.url);
                        }
                    })
                    .catch((err) => {
                        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
                    });
            }
            return false;
        } else if (event.url.includes('http') || event.url.includes('www')) {
            this.webview.stopLoading();
            callNumber(event.url);
            return false;
        }
        return true;
    }
    handleOnLoadEnd() {
        // We will show logo only for `About Us` screen in FoodHub app
        if (this.props.route.name === SCREEN_OPTIONS.ABOUT_US.route_name && isNonCustomerApp() && this.state.showLogo !== true) {
            this.setState({ showLogo: true });
        }
    }
}

const mapStateToProps = (state) => ({
    policyLookupResponse: state.appState.policyLookupResponse,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    foodhub_logo: state.appState.countryBaseFeatureGateResponse?.foodhub_logo
});
const mapDispatchToProps = {
    setSideMenuActiveAction,
    redirectRouteAction,
    policyLookupAction
};
export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);
