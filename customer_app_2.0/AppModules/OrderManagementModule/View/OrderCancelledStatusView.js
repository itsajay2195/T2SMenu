import React, { Component } from 'react';
import { Image, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { REFUND_OPTION, VIEW_ID } from '../Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import styles from './Styles/OrderStatusStyle';
import { T2SButton, T2SOutlineButton } from 't2sbasemodule/UI';
import { connect } from 'react-redux';
import { getRefundOptionAction, updateRefundMethodAction } from '../Redux/OrderManagementAction';
import { copyToClipboard, getDeviceInfo, isValidElement, isValidString, safeStringValue } from 't2sbasemodule/Utils/helpers';
import { getUserName } from '../../BaseModule/Helper';
import { Text } from 'react-native-paper';
import { getRefundAdditionalMessage } from '../Utils/OrderManagementHelper';
import { selectCurrencySymbol, selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import { debounce } from 'lodash';

class OrderCancelStatusView extends Component {
    constructor() {
        super();
        this.state = {
            showRefundButton: true
        };
    }
    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.ORDER_CANCELLED);
        this.props.getRefundOptionAction(this.props.orderDetails.id);
    }
    componentWillUnmount() {
        this.setState({ showRefundButton: true });
    }

    render() {
        const { screenName, orderDetails, refundOptions, currency } = this.props;
        const { showRefundButton } = this.state;
        let additionalMsg = getRefundAdditionalMessage(currency, orderDetails);
        return (
            <View style={styles.cancelledStatusContainer}>
                <View style={styles.refundImageContainer}>
                    <Image style={styles.refundImage} source={require('../Images/OrderCancelled.jpg')} />
                </View>
                <T2SText
                    style={styles.cancelledOrderIdText}
                    screenName={screenName}
                    id={VIEW_ID.ORDER_ID_TEXT}
                    onPress={this.handleCopyOrderID.bind(this, orderDetails.id)}
                    onLongPress={this.handleCopyOrderID.bind(this, orderDetails.id)}>
                    {`${LOCALIZATION_STRINGS.ORDER_ID.toUpperCase()} ${orderDetails.id}`}
                </T2SText>
                <View style={styles.descriptionContainer}>
                    <T2SText style={styles.cancelledOrderDescText} screenName={screenName} id={VIEW_ID.CANCELLED_DESCRIPTION_TEXT}>
                        {convertMessageToAppLanguage(orderDetails.cancel_reason_message, this.props.languageKey)}
                    </T2SText>
                </View>
                {isValidElement(refundOptions?.data) &&
                    refundOptions.data.length > 0 &&
                    (isValidElement(refundOptions.data[0]?.ask_for_refund_destination) &&
                    refundOptions.data[0].ask_for_refund_destination &&
                    showRefundButton ? (
                        <View style={styles.refundContainer}>
                            <T2SText style={styles.wantRefundText} screenName={screenName} id={VIEW_ID.HOW_YOU_WANT_REFUND_TEXT}>
                                {LOCALIZATION_STRINGS.REFUND_QUESTION}
                            </T2SText>

                            {isValidString(additionalMsg) && (
                                <T2SText
                                    style={styles.wantRefundAdditionalText}
                                    screenName={screenName}
                                    id={VIEW_ID.HOW_YOU_WANT_REFUND_PARTIAL_PAYMENT_TEXT}>
                                    {convertMessageToAppLanguage(additionalMsg)}
                                </T2SText>
                            )}
                            <View style={styles.refundButtonContainer}>
                                <View style={styles.buttonView}>
                                    <T2SOutlineButton
                                        style={styles.refundCardButton}
                                        buttonTextStyle={styles.refundCardButtonText}
                                        contentStyle={styles.buttonHeight}
                                        uppercase={true}
                                        screenName={screenName}
                                        id={VIEW_ID.CARD_BUTTON}
                                        title={LOCALIZATION_STRINGS.CARD}
                                        onPress={this.handleRefundClickedAction.bind(this, REFUND_OPTION.CARD)}
                                    />
                                </View>
                                <View style={styles.buttonView}>
                                    <T2SButton
                                        style={styles.refundButton}
                                        buttonTextStyle={styles.refundButtonText}
                                        contentStyle={styles.buttonHeight}
                                        screenName={screenName}
                                        id={VIEW_ID.WALLET_BUTTON}
                                        title={LOCALIZATION_STRINGS.WALLET}
                                        onPress={this.handleRefundClickedAction.bind(this, REFUND_OPTION.WALLET)}
                                    />
                                </View>
                            </View>
                            <T2SText style={styles.refundMessageText} screenName={screenName} id={VIEW_ID.REFUND_MESSAGE_TEXT}>
                                {`${LOCALIZATION_STRINGS.REFUND_INFO}`}
                            </T2SText>
                            <T2SText style={styles.refundNoteText} screenName={screenName} id={VIEW_ID.REFUND_NOTE_TEXT}>
                                <Text style={styles.refundNoteStarText}>*</Text>
                                {convertMessageToAppLanguage(refundOptions.data[0].terms_and_condition_message)}
                            </T2SText>
                        </View>
                    ) : (
                        isValidString(refundOptions?.data[0]?.refunded_message) && (
                            <View style={styles.refundSuccessContainer}>
                                <T2SText style={styles.wantRefundText} screenName={screenName} id={VIEW_ID.REFUNDED_TO_WALLET_MSG_TEXT}>
                                    {convertMessageToAppLanguage(refundOptions.data[0].refunded_message)}
                                </T2SText>
                            </View>
                        )
                    ))}
            </View>
        );
    }
    handleRefundClickedAction = debounce(
        (refundOptionChose) => {
            this.handleRefundClick(refundOptionChose);
        },
        500,
        { leading: true, trailing: false }
    );

    handleRefundClick(refundOptionChose) {
        Analytics.logEvent(
            ANALYTICS_SCREENS.ORDER_CANCELLED,
            refundOptionChose === REFUND_OPTION.CARD
                ? ANALYTICS_EVENTS.REFUND_BUTTON_CARD_CLICKED
                : ANALYTICS_EVENTS.REFUND_BUTTON_WALLET_CLICKED
        );
        this.props.updateRefundMethodAction(
            this.props.orderDetails.id,
            JSON.stringify(getDeviceInfo()),
            refundOptionChose,
            getUserName(this.props.profileResponse)
        );
        this.setState({ showRefundButton: false });
    }

    handleCopyOrderID(orderId) {
        if (isValidString(orderId)) {
            copyToClipboard(safeStringValue(orderId));
        }
    }
}

const mapStateToProps = (state) => ({
    currency: selectCurrencySymbol(state),
    refundOptions: state.orderManagementState.refundOptions,
    profileResponse: state.profileState.profileResponse,
    languageKey: selectLanguageKey(state)
});
const mapDispatchToProps = {
    getRefundOptionAction,
    updateRefundMethodAction
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderCancelStatusView);
