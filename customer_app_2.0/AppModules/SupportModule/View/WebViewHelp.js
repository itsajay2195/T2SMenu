import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import BaseComponent from '../../BaseModule/BaseComponent';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { T2SModal } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { SCREEN_NAME, VIEW_ID } from '../../HomeModule/Utils/HomeConstants';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import Styles from '../Style/WebViewHelpStyle';
import Colors from 't2sbasemodule/Themes/Colors';

class WebViewHelp extends Component {
    constructor(props) {
        super(props);
        this.closeWebView = this.closeWebView.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
        this.handleCloseScreenRequestClose = this.handleCloseScreenRequestClose.bind(this);
        this.state = {
            isModalVisible: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.HELP_WEBVIEW_PAGE);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.handleBackPress();
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackPress() {
        //TODO if needed we will implement the close discard model alert
        // this.setState({ isModalVisible: true });
        this.closeWebView();
        Analytics.logBackPress(ANALYTICS_SCREENS.HELP_WEBVIEW_PAGE);
    }

    closeWebView() {
        this.webview.stopLoading();
        this.setState({ isModalVisible: false });
        this.props.navigation.goBack();
    }
    handleCloseScreenRequestClose() {
        this.setState({ isModalVisible: false });
    }
    renderCloseScreenModal() {
        return (
            <T2SModal
                screenName={SCREEN_NAME.WEB_VIEW_COMPONENT}
                id={VIEW_ID.WEBVIEW_MODAL}
                title={''}
                description={LOCALIZATION_STRINGS.WEBVIEW_CANCEL_DESCRIPTION}
                isVisible={this.state.isModalVisible}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                positiveButtonClicked={this.closeWebView}
                requestClose={this.handleCloseScreenRequestClose}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                negativeButtonClicked={this.handleCloseScreenRequestClose}
            />
        );
    }
    IndicatorLoadingView() {
        return (
            <View style={Styles.loderViewStyle}>
                <ActivityIndicator color={Colors.secondary_color} size={'large'} />
            </View>
        );
    }

    render() {
        const { route } = this.props;
        const { params } = route;
        let HeaderName = isValidElement(params) && isValidString(params.title) ? params.title : LOCALIZATION_STRINGS.CHAT;
        const INJECTED_JAVASCRIPT = `(function() {
     window.ReactNativeWebView.postMessage(document.getElementsByTagName('pre')[0].innerHTML);
 })();`;
        if (isValidElement(params)) {
            return (
                <BaseComponent
                    id={VIEW_ID.WEBVIEW_SCREEN_BASE_COMPONENT}
                    screenName={SCREEN_NAME.WEB_VIEW_COMPONENT}
                    showCommonActions={false}
                    showHeader={true}
                    title={HeaderName}
                    icon={FONT_ICON.BACK}
                    handleLeftActionPress={this.handleBackPress}>
                    <WebView
                        useWebKit={true}
                        startInLoadingState={true}
                        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E233 Safari/601.1"
                        ref={(ref) => (this.webview = ref)}
                        screenName={SCREEN_NAME.WEB_VIEW_COMPONENT}
                        id={VIEW_ID.WEBVIEW_COMPONENT}
                        source={{ uri: params.url }}
                        onNavigationStateChange={this.handleWebViewNavigationStateChange}
                        injectedJavaScript={INJECTED_JAVASCRIPT}
                        renderLoading={() => this.IndicatorLoadingView()}
                        onMessage={this.onMessage}
                    />
                    {this.state.isModalVisible && this.renderCloseScreenModal()}
                </BaseComponent>
            );
        }
        return null;
    }
    onMessage = (e) => {
        let { data } = e.nativeEvent; // data you will receive from html
        let json = JSON.parse(data);
        if (isValidElement(json) && isValidElement(json.outcome) && json.outcome === 'success') {
            //TODO if needed will handle
        }
        this.closeWebView(json.error);
    };
    handleWebViewNavigationStateChange = (newNavState) => {
        // const { url } = newNavState;
        // if (!url)
    };
}

const mapStateToProps = (state) => ({
    featureGateResponse: state.appState.countryBaseFeatureGateResponse
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WebViewHelp);
