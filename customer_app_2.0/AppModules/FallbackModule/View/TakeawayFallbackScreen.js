import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { AppStyles } from 't2sbasemodule/Themes';
import { connect } from 'react-redux';
import { VIEW_ID } from '../../CommonWebviewModule/Utils/WebViewConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { SCREEN_NAME } from '../Util/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { handleGoBack } from '../../../CustomerApp/Navigation/Helper';

class TakeawayFallbackScreen extends Component {
    componentDidMount() {
        Analytics.logScreen(SCREEN_NAME);
    }

    render() {
        return (
            <SafeAreaView style={AppStyles.container}>
                {this.renderHeader()}
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
                    source={{ uri: this.props.takeawayFallbackUrl }}
                />
            </SafeAreaView>
        );
    }

    renderHeader() {
        return (
            <T2SAppBar
                title={'OrderNow'}
                handleLeftActionPress={() => {
                    handleGoBack();
                }}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    takeawayFallbackUrl: state.appState.takeawayFallbackUrl
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(TakeawayFallbackScreen);
