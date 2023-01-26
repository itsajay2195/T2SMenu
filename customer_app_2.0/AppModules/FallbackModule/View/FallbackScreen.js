import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { AppStyles } from 't2sbasemodule/Themes';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-lottie-splash-screen';
import { VIEW_ID } from '../../CommonWebviewModule/Utils/WebViewConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { SCREEN_NAME } from '../Util/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { getSplashTimeout } from '../../BaseModule/Helper';

let splashTimeout;
class FallbackScreen extends Component {
    componentDidMount() {
        Analytics.logScreen(SCREEN_NAME);
        splashTimeout = setTimeout(() => {
            SplashScreen.hide();
        }, getSplashTimeout());
    }
    componentWillUnmount() {
        if (isValidElement(splashTimeout)) {
            clearTimeout(splashTimeout);
        }
    }

    render() {
        return (
            <SafeAreaView style={AppStyles.container}>
                <WebView
                    userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
                    useWebKit={true} //
                    id={VIEW_ID.WEB_VIEW}
                    originWhitelist={['*']}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                    allowUniversalAccessFromFileURLs={true}
                    allowFileAccess={true}
                    thirdPartyCookiesEnabled={true}
                    screenName={SCREEN_NAME}
                    source={{ uri: this.props.fallbackUrl }}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state, props) => ({
    fallbackUrl: state.appState.fallbackUrl
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(FallbackScreen);
