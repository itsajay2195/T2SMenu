/**
 * Created by Deepan at 01/12/2020 11:57
 */

import React, { Component } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/QuickCheckoutStyles';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { PAYMENT_TYPE, VIEW_ID } from '../Utils/QuickCheckoutConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CvvModal from 't2sbasemodule/UI/CustomUI/CvvModal/CvvModal';
import LottieView from 'lottie-react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { selectCurrencyFromStore } from 't2sbasemodule/Utils/AppSelectors';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import Colors from 't2sbasemodule/Themes/Colors';
import { proceedCheckoutAction, resetCvvAction, restartQuickCheckout, updateCvvAction } from '../Redux/QuickCheckoutAction';
import { getSelectedPaymentTypeValue } from '../Utils/Helper';
import { paymentErrorMessageAction, resetCardTransactionAction, showHideRetryPaymentLoader } from '../../BasketModule/Redux/BasketAction';
import { selectTotalValue } from '../../BasketModule/Redux/BasketSelectors';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';

let screenName = ANALYTICS_SCREENS.TRANSACTION_FAILURE_SCREEN;
const { height } = Dimensions.get('window');

class TransactionFailureComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payment_mode: this.props.payment_mode,
            cvv: '',
            cvv_error: false,
            showRetryPaymentLoader: false,
            disableWindow: false,
            animatedMargin: new Animated.Value(height),
            qcHeight: 0
        };

        this.handleOnCvvComplete = this.handleOnCvvComplete.bind(this);
        this.handleCvvModalCancelClicked = this.handleCvvModalCancelClicked.bind(this);
        this.handleOtherPaymentsAction = this.handleOtherPaymentsAction.bind(this);
        this.handleRetryAction = this.handleRetryAction.bind(this);
        this.handleCloseAction = this.handleCloseAction.bind(this);
    }

    componentDidMount() {
        Analytics.logScreen(screenName);
        this.setAnimatedMargin(1);
    }

    static getDerivedStateFromProps(props, state) {
        const { showRetryPaymentLoader, payment_mode } = props;
        if (isValidElement(payment_mode) && state.payment_mode !== payment_mode) {
            return {
                payment_mode
            };
        }
        if (isValidElement(showRetryPaymentLoader) && state.showRetryPaymentLoader !== showRetryPaymentLoader) {
            return {
                showRetryPaymentLoader
            };
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.rootContainer}>
                <View style={styles.quickCheckoutViewStyle}>
                    <Animated.View style={styles.quickCheckoutContainerStyle}>
                        <View style={styles.topContainer}>
                            <View style={styles.closeContainer}>
                                <T2SIcon
                                    name={FONT_ICON.CLOSE}
                                    style={styles.closeIcon}
                                    onPress={this.handleCloseAction}
                                    screenName={screenName}
                                    id={VIEW_ID.CLOSE_ICON}
                                />
                            </View>
                            <View
                                style={styles.transactionModalContentViewStyle}
                                onLayout={(event) => {
                                    this.getDynamicHeight(event.nativeEvent.layout);
                                }}>
                                <T2SText
                                    id={VIEW_ID.TRANSACTION_FAILURE_HEADER_TEXT}
                                    screenName={screenName}
                                    style={styles.transactionFailureHeaderText}>
                                    {LOCALIZATION_STRINGS.TRANSACTION_FAILED}
                                </T2SText>

                                <T2SText
                                    id={VIEW_ID.TRANSACTION_FAILURE_MESSAGE_TEXT}
                                    screenName={screenName}
                                    style={styles.transactionFailureMessageText}>
                                    {this.props.cardTransactionFailureMessage}
                                </T2SText>
                                {this.renderCardView()}
                                {isValidElement(this.state.showRetryPaymentLoader) && this.state.showRetryPaymentLoader
                                    ? this.renderLoader()
                                    : this.renderButtonContainer()}
                            </View>
                        </View>
                    </Animated.View>
                </View>
                <View style={styles.fixSafeViewBottomBackground} />
                {this.renderVerifyCVVModal()}
            </SafeAreaView>
        );
    }

    renderCardView() {
        return (
            <View style={styles.transactionModalRowContainer}>
                <T2SText id={VIEW_ID.SELECTED_CARD_TEXT} screenName={screenName} style={styles.cardText}>
                    {getSelectedPaymentTypeValue(this.state.payment_mode, this.props)}
                </T2SText>
                <T2SText id={VIEW_ID.TOTAL_AMOUNT_TEXT} screenName={screenName} style={styles.amountText}>
                    {this.props.currency + this.props.total}
                </T2SText>
            </View>
        );
    }

    renderButtonContainer() {
        return (
            <View style={styles.transactionModalRowContainer}>
                <T2SButton
                    screenName={screenName}
                    id={VIEW_ID.OTHER_PAYMENTS_BUTTON}
                    buttonStyle={styles.otherPaymentsButtonStyle}
                    buttonTextStyle={styles.otherPaymentsButtonTextStyle}
                    color={Colors.white}
                    mode={'outlined'}
                    title={LOCALIZATION_STRINGS.OTHER_PAYMENTS}
                    onPress={this.handleOtherPaymentsAction}
                />
                <T2SButton
                    screenName={screenName}
                    id={VIEW_ID.RETRY_BUTTON}
                    buttonStyle={styles.retryButtonStyle}
                    buttonTextStyle={styles.retryButtonTextStyle}
                    title={LOCALIZATION_STRINGS.RETRY}
                    onPress={this.handleRetryAction}
                />
            </View>
        );
    }

    renderLoader() {
        let loaderFile = require('../Utils/PlacingOrderLoader.json');
        const { payment_mode } = this.props;
        if (
            payment_mode === PAYMENT_TYPE.WALLET ||
            payment_mode === PAYMENT_TYPE.CARD_FROM_LIST ||
            payment_mode === PAYMENT_TYPE.PARTIAL_PAYMENT
        ) {
            loaderFile = require('../Utils/PlacingOrder_Orange.json');
        }
        return (
            <View style={[styles.lottieViewStyle, { marginTop: 10, marginBottom: 10 }]}>
                <LottieView source={loaderFile} autoPlay={true} loop={true} style={styles.lottieAnimationViewStyle} />
                <T2SText style={styles.placingYourOrderTextStyle}>{LOCALIZATION_STRINGS.PROCESSING_YOUR_ORDER}</T2SText>
            </View>
        );
    }

    renderVerifyCVVModal() {
        const { showVerifyCVV, inValidCvvErrorMsg } = this.props;
        const errorMsg = isValidString(inValidCvvErrorMsg) ? inValidCvvErrorMsg : LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_CVV;
        return (
            <CvvModal
                screenName={screenName}
                isVisible={showVerifyCVV}
                requestClose={this.resetVerifyCvv}
                errorMsg={errorMsg}
                payClicked={this.handleOnCvvComplete}
                cancelClicked={this.handleCvvModalCancelClicked}
                dialogCancelable={false}
            />
        );
    }

    handleCvvModalCancelClicked() {
        this.resetVerifyCvv();
        this.resetLoader();
    }

    handleOnCvvComplete(cvv) {
        const { showVerifyCVV } = this.props;
        if (showVerifyCVV && cvv.length >= 3) {
            this.props.updateCvvAction(cvv);
            this.props.proceedCheckoutAction();
            this.resetVerifyCvv();
        }
    }

    resetVerifyCvv() {
        this.props.resetCvvAction();
    }
    getDynamicHeight = (layout) => {
        if (isValidElement(layout)) {
            this.setState({ qcHeight: layout.height });
        }
    };
    handleOtherPaymentsAction() {
        Analytics.logEvent(screenName, ANALYTICS_EVENTS.OTHER_PAYMENTS_BUTTON_CLICKED);
        this.props.navigation.goBack();
        this.props.resetCardTransactionAction();
        this.props.paymentErrorMessageAction(this.state.cardTransactionFailureMessage);
    }

    handleRetryAction() {
        Analytics.logEvent(screenName, ANALYTICS_EVENTS.RETRY_BUTTON_CLICKED);
        this.props.showHideRetryPaymentLoader(true);
        this.setState({ showOrderProcessingLoader: true }, () => {
            this.props.proceedCheckoutAction();
        });
    }

    handleCloseAction() {
        if (!this.state.disableWindow) {
            Analytics.logEvent(screenName, ANALYTICS_EVENTS.ICON_CLOSE);
            this.setAnimatedMargin(height);
            setTimeout(() => {
                if (!this.state.disableWindow) {
                    this.props.navigation.pop();
                }
            }, 400);
        }
    }

    setAnimatedMargin(toValue, duration = 500) {
        Animated.timing(this.state.animatedMargin, {
            toValue,
            duration
        }).start();
    }

    resetLoader() {
        this.props.showHideRetryPaymentLoader(false);
    }
}

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromStore(state),
    payment_mode: state.basketState.payment_mode,
    total: selectTotalValue(state),
    savedCardDetails: state.profileState.savedCardDetails,
    user_selected_card_id: state.basketState.user_selected_card_id,
    showVerifyCVV: state.basketState.showVerifyCVV,
    inValidCvvErrorMsg: state.basketState.inValidCvvErrorMsg,
    showRetryPaymentLoader: state.basketState.showRetryPaymentLoader,
    cardTransactionFailureMessage: state.basketState.cardTransactionFailureMessage,
    walletBalance: state.walletState.walletBalance
});

const mapDispatchToProps = {
    proceedCheckoutAction,
    restartQuickCheckout,
    updateCvvAction,
    resetCvvAction,
    paymentErrorMessageAction,
    resetCardTransactionAction,
    showHideRetryPaymentLoader
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionFailureComponent);
