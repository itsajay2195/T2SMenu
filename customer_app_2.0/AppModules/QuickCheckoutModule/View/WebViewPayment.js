import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import BaseComponent from '../../BaseModule/BaseComponent';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { T2SIcon, T2SModal } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { SCREEN_NAME, VIEW_ID } from '../../HomeModule/Utils/HomeConstants';
import { isValidElement, isValidJson, isValidString, makeHapticFeedback } from 't2sbasemodule/Utils/helpers';
import { makeCashOrder, paymentErrorMessageAction, resetBasket } from '../../BasketModule/Redux/BasketAction';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { selectBasketID, selectTotal, selectUserPaymentMode } from '../../BasketModule/Redux/BasketSelectors';
import { restartQuickCheckout, trackOrderPlacedEvent } from '../Redux/QuickCheckoutAction';
import { BackHandler, View } from 'react-native';
import styles from './Styles/WebViewPaymentStyle';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { HapticFrom } from 't2sbasemodule/Utils/Constants';
import { SEGMENT_STRINGS } from '../../AnalyticsModule/SegmentConstants';
import * as Segment from '../../AnalyticsModule/Segment';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { selectCurrencyFromStore } from 't2sbasemodule/Utils/AppSelectors';
import { updateNewCardPaymentFhLogAction } from '../../FHLogsModule/Redux/FhLogsAction';
import { FH_LOG_ERROR_CODE, FH_LOG_TYPE } from '../../FHLogsModule/Utils/FhLogsConstants';
import { getGraphQlQuery } from '../../BasketModule/Utils/BasketHelper';
import { resetReferral } from '../../ProfileModule/Redux/ProfileAction';

let screenName = SCREEN_NAME.WEB_VIEW_COMPONENT;
class WebViewPayment extends Component {
    constructor(props) {
        super(props);
        this.closeWebView = this.closeWebView.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
        this.handleCloseScreenRequestClose = this.handleCloseScreenRequestClose.bind(this);
        this.state = {
            isModalVisible: false,
            errorMessage: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.QC_PAYMENT_PAGE);
        this.callFhLogs(FH_LOG_TYPE.NEW_CARD_PAYMENT_INITIATED);
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
        this.setState({ isModalVisible: true });
        Analytics.logBackPress(ANALYTICS_SCREENS.QC_PAYMENT_PAGE);
    }

    closeWebView(message = null) {
        const { isFromPBL } = this.props?.route?.params;
        this.webview.stopLoading();
        this.setState({ isModalVisible: false });
        if (!(isValidElement(isFromPBL) && isFromPBL)) {
            this.props.restartQuickCheckout();
            this.props.navigation.goBack();
            if (isValidString(message)) {
                this.callFhLogs(FH_LOG_TYPE.NEW_CARD_PAYMENT_CANCELLED);
                this.props.trackOrderPlacedEvent(message);
            }
        }
        this.props.navigation.goBack();
    }
    handleCloseScreenRequestClose() {
        this.setState({ isModalVisible: false });
    }
    renderCloseScreenModal() {
        return (
            <T2SModal
                screenName={screenName}
                id={VIEW_ID.WEBVIEW_MODAL}
                title={''}
                description={LOCALIZATION_STRINGS.WEBVIEW_CANCEL_DESCRIPTION}
                isVisible={this.state.isModalVisible}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                positiveButtonClicked={this.closeWebView.bind(this, SEGMENT_STRINGS.USER_CANCEL)}
                requestClose={this.handleCloseScreenRequestClose}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                negativeButtonClicked={this.handleCloseScreenRequestClose}
            />
        );
    }

    render() {
        const { route } = this.props;
        const { params } = route;
        const INJECTED_JAVASCRIPT = `(function() {
     window.ReactNativeWebView.postMessage(document.getElementsByTagName('pre')[0].innerHTML);
 })();`;
        if (isValidElement(params)) {
            return (
                <BaseComponent
                    id={VIEW_ID.WEBVIEW_SCREEN_BASE_COMPONENT}
                    screenName={screenName}
                    showCommonActions={false}
                    showHeader={true}
                    title={LOCALIZATION_STRINGS.PAYMENT}
                    icon={FONT_ICON.BACK}
                    handleLeftActionPress={this.handleBackPress}>
                    <>
                        <WebView
                            useWebKit={true}
                            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E233 Safari/601.1"
                            ref={(ref) => (this.webview = ref)}
                            screenName={screenName}
                            id={VIEW_ID.WEBVIEW_COMPONENT}
                            source={{ uri: params.url }}
                            onNavigationStateChange={this.handleWebViewNavigationStateChange}
                            injectedJavaScript={INJECTED_JAVASCRIPT}
                            onMessage={this.onMessage}
                        />
                    </>
                    <View style={this.state.errorMessage ? styles.topViewStyle : {}} />
                    {this.state.isModalVisible && this.renderCloseScreenModal()}
                </BaseComponent>
            );
        }
        return null;
    }

    renderSecurityInfo() {
        return (
            <View style={styles.infoContainer}>
                <T2SIcon icon={FONT_ICON.WARNING} color={Colors.lightOrange} size={24} />
                <T2SText style={styles.infoText} id={VIEW_ID.SECURITY_INFO} screenName={screenName}>
                    {LOCALIZATION_STRINGS.SAVED_CARD_SECURITY_INFO}
                </T2SText>
            </View>
        );
    }
    onMessage = (e) => {
        if (isValidElement(e?.nativeEvent)) {
            let { data } = e.nativeEvent;
            let json = isValidJson(data) ? JSON.parse(data) : null;
            if (isValidElement(json) && isValidElement(json.outcome) && json.outcome === 'success') {
                if (isValidElement(json.reason)) {
                    this.props.paymentErrorMessageAction(json.reason);
                }
            }
            this.closeWebView(isValidElement(json?.error) ? json.error : null);
        }
    };
    handleWebViewNavigationStateChange = (newNavState) => {
        let storeID, pblCartId;
        const { paymentMode, featureGateResponse, route } = this.props;
        const { isFromPBL } = this.props?.route?.params;
        if (isValidString(route?.params?.storeID)) {
            storeID = route.params.storeID;
        }

        if (isValidString(route?.params?.cartId)) {
            pblCartId = route.params.cartId;
        }
        const { url } = newNavState;

        if (!url) return;
        if (url.includes('do=cancel')) {
            this.closeWebView();
            this.callFhLogs(FH_LOG_TYPE.NEW_CARD_PAYMENT_CANCELLED);
            if (!(isValidElement(isFromPBL) && isFromPBL)) {
                Analytics.logEvent(ANALYTICS_SCREENS.QC_PAYMENT_PAGE, ANALYTICS_EVENTS.CANCEL_CARD_PAYMENT);
                Segment.trackEvent(featureGateResponse, ANALYTICS_EVENTS.CANCEL_CARD_PAYMENT);
            }
        } else if (url.includes('order-tracking') || url.includes('track_display.php')) {
            const { cartID, total, currency } = this.props;
            if (isValidElement(cartID)) {
                this.closeWebView();
                this.props.trackOrderPlacedEvent();
                this.callFhLogs(FH_LOG_TYPE.NEW_CARD_PAYMENT_SUCCESS);
                handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
                    orderId: cartID,
                    storeID: storeID,
                    isFromWebviewPayment: true,
                    analyticsObj: {
                        order_id: cartID,
                        store_id: storeID
                    }
                });
                Analytics.logEvent(ANALYTICS_SCREENS.QC_PAYMENT_PAGE, ANALYTICS_EVENTS.PLACE_ORDER_COMPLETE, {
                    payment_mode: paymentMode,
                    order_id: cartID,
                    price: total.value,
                    currency
                });
                this.props.resetBasket();
                makeHapticFeedback(featureGateResponse, HapticFrom.ORDER_PLACED);
                this.props.resetReferral();
            } else if (isFromPBL) {
                this.closeWebView();
                this.callFhLogs(FH_LOG_TYPE.NEW_CARD_PAYMENT_SUCCESS);
                handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
                    orderId: pblCartId,
                    storeID: storeID,
                    isFromWebviewPayment: true,
                    analyticsObj: {
                        order_id: pblCartId,
                        store_id: storeID
                    }
                });
                this.props.resetBasket();
                this.props.trackOrderPlacedEvent();
            }
        } else if (url.includes('payment/cancelled')) {
            Analytics.logEvent(ANALYTICS_SCREENS.QC_PAYMENT_PAGE, ANALYTICS_EVENTS.CANCEL_CARD_PAYMENT);
            Segment.trackEvent(featureGateResponse, ANALYTICS_EVENTS.CANCEL_CARD_PAYMENT);
            this.setState({ errorMessage: true });
            this.callFhLogs(FH_LOG_TYPE.NEW_CARD_PAYMENT_FAILED);
        }
    };

    getFhLogErrorObject() {
        const { route, cartID, customerId, phone, total, storeId } = this.props;
        return {
            customerID: customerId,
            phone: phone,
            storeID: storeId,
            cartID: cartID,
            total: total?.value,
            webViewUrl: route?.params?.url
        };
    }

    callFhLogs(type) {
        this.props.updateNewCardPaymentFhLogAction(
            getGraphQlQuery(type, this.getFhLogErrorObject(), FH_LOG_ERROR_CODE.NEW_CARD_PAYMENT_ERROR_CODE)
        );
    }
}

const mapStateToProps = (state) => ({
    cartID: selectBasketID(state),
    paymentMode: selectUserPaymentMode(state),
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    basketData: state.basketState.viewBasketResponse,
    payment_mode: state.basketState.payment_mode,
    currency: selectCurrencyFromStore(state),
    total: selectTotal(state),
    storeId: state.appState.storeConfigResponse?.id,
    customerId: state.profileState.profileResponse?.id,
    phone: state.profileState.profileResponse?.phone
});
const mapDispatchToProps = {
    makeCashOrder,
    resetBasket,
    restartQuickCheckout,
    paymentErrorMessageAction,
    trackOrderPlacedEvent,
    updateNewCardPaymentFhLogAction,
    resetReferral
};

export default connect(mapStateToProps, mapDispatchToProps)(WebViewPayment);
