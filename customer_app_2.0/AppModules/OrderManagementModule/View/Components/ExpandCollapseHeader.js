import React, { Component, Fragment } from 'react';
import { Animated, View } from 'react-native';
import { connect } from 'react-redux';

import { Card } from 'react-native-paper';
import styles from '../../View/Styles/ExpandCollapseStyle';
import { T2SIcon, T2SText, T2STouchableOpacity, T2SView } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import {
    selectOrderID,
    selectOrderNo,
    selectOrderPlacedTime,
    selectReceiptAddress1,
    selectReceiptCustomer,
    selectReceiptHouseNo,
    selectReceiptOrderType,
    selectReceiptPostcode
} from '../../Redux/OrderManagementSelectors';
import moment from 'moment-timezone';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { CHECK_ORDER_TYPE } from '../../../BaseModule/BaseConstants';
import { copyToClipboard, defaultTouchArea, isValidElement, isValidString, safeStringValue } from 't2sbasemodule/Utils/helpers';
import { resetReceiptResponse } from '../../Redux/OrderManagementAction';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/OrderManagementConstants';
import Colors from 't2sbasemodule/Themes/Colors';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';

const DEFAULT_HEIGHT = 30;

class ExpandCollapseHeader extends Component {
    constructor(props) {
        super(props);
        this.onOrderIdClicked = this.onOrderIdClicked.bind(this);
        this.onReceiptHeaderUpArrowPressed = this.onReceiptHeaderUpArrowPressed.bind(this);
        this.onReceiptHeaderDownArrowPressed = this.onReceiptHeaderDownArrowPressed.bind(this);
        this.state = {
            showUpArrow: true
        };
    }

    componentDidMount() {
        this.receiptContentHeight = new Animated.Value(DEFAULT_HEIGHT);
    }

    componentWillUnmount() {
        this.props.resetReceiptResponse();
    }

    onReceiptHeaderDownArrowPressed() {
        this.setState({ showUpArrow: true });
        Animated.timing(this.receiptContentHeight, {
            toValue: DEFAULT_HEIGHT,
            duration: 100
        }).start();
    }

    onReceiptHeaderUpArrowPressed() {
        this.setState({ showUpArrow: false });
        Animated.timing(this.receiptContentHeight, {
            toValue: 80,
            duration: 100
        }).start();
    }

    onOrderIdClicked() {
        Analytics.logEvent(ANALYTICS_SCREENS.VIEW_ORDER, ANALYTICS_EVENTS.COPY_ORDER_ID);
        const { orderID } = this.props;
        if (isValidElement(orderID)) {
            copyToClipboard(safeStringValue(orderID));
        }
    }

    render() {
        const { customerData, orderType } = this.props;
        if (isValidElement(customerData)) {
            return (
                <Fragment>
                    {orderType === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION && this.renderCollectionOrder()}
                    {(orderType === CHECK_ORDER_TYPE.ORDER_TYPE_TO || orderType === CHECK_ORDER_TYPE.ORDER_TYPE_DELIVERY) &&
                        this.renderDeliveryOrder()}
                    {orderType === CHECK_ORDER_TYPE.ORDER_TYPE_WAITING && this.renderWaitingOrder()}
                </Fragment>
            );
        }
        return null;
    }

    renderDeliveryOrder() {
        const { houseNo, postcode, address } = this.props;
        return (
            <Card
                accessible={false}
                style={styles.foodHubCardStyle}
                onPress={() => {
                    Analytics.logEvent(ANALYTICS_SCREENS.VIEW_ORDER, ANALYTICS_EVENTS.COLLAPSABLE_HEADER_CLICKED);
                    this.state.showUpArrow ? this.onReceiptHeaderUpArrowPressed() : this.onReceiptHeaderDownArrowPressed();
                }}>
                <Animated.View style={[styles.animatedViewContainer, { height: this.receiptContentHeight }]}>
                    <Animated.View style={styles.orderDetailsMinimalLayout}>
                        <View style={styles.orderDetailsMinimalHeadLayout}>
                            <View style={styles.iconAndNameStyle}>
                                <T2SIcon
                                    id={FONT_ICON.BIKE}
                                    screenName={SCREEN_NAME.VIEW_ORDER}
                                    name={FONT_ICON.BIKE}
                                    style={styles.iconStyle}
                                    size={25}
                                    color={Colors.secondary_color}
                                />
                                <T2SText id={VIEW_ID.ADDRESS} screenName={SCREEN_NAME.VIEW_ORDER}>
                                    {isValidString(houseNo) && houseNo} {isValidString(address) && address}
                                    {(isValidString(houseNo) || isValidString(address)) && ', '}
                                    {isValidString(postcode) && postcode}
                                </T2SText>
                            </View>
                        </View>
                        {this.state.showUpArrow ? (
                            <T2SIcon
                                id={VIEW_ID.ARROW_DOWN}
                                screenName={SCREEN_NAME.VIEW_ORDER}
                                icon={FONT_ICON.ARROW_DOWN}
                                size={22}
                                style={styles.arrowStyle}
                            />
                        ) : (
                            <View>
                                <T2SIcon
                                    id={VIEW_ID.ARROW_UP}
                                    screenName={SCREEN_NAME.VIEW_ORDER}
                                    icon={FONT_ICON.ARROW_UP}
                                    size={22}
                                    style={styles.arrowStyle}
                                />
                            </View>
                        )}
                    </Animated.View>
                    {this.state.showUpArrow === false && <View style={styles.orderIDContainer}>{this.renderCollapsedDetails()}</View>}
                </Animated.View>
            </Card>
        );
    }

    renderCollectionOrder() {
        return (
            <View style={styles.collectionHeaderStyle}>
                <T2SIcon
                    id={FONT_ICON.COLLECTION}
                    screenName={SCREEN_NAME.VIEW_ORDER}
                    name={FONT_ICON.COLLECTION}
                    size={25}
                    color={Colors.secondary_color}
                />
                <View style={styles.animatedViewContainer}>{this.renderCollapsedDetails()}</View>
            </View>
        );
    }
    renderOrderNoText() {
        const { order_no } = this.props;
        return (
            <T2SText screenName={SCREEN_NAME.VIEW_ORDER} id={VIEW_ID.ORDER_NO_TEXT}>
                {LOCALIZATION_STRINGS.ORDER_NO} {order_no}
            </T2SText>
        );
    }

    renderWaitingOrder() {
        return (
            <View style={styles.collectionHeaderStyle}>
                <T2SIcon
                    id={FONT_ICON.COLLECTION}
                    screenName={SCREEN_NAME.VIEW_ORDER}
                    name={FONT_ICON.EPOS}
                    size={25}
                    color={Colors.secondary_color}
                />
                <View style={[styles.animatedViewContainer, { flex: 1 }]}>{this.renderCollapsedDetails()}</View>
                <T2SView style={styles.waitingViewStyle}>
                    <T2SText style={styles.waitingTextStyle}>{LOCALIZATION_STRINGS.ORDER_KIOSK}</T2SText>
                </T2SView>
            </View>
        );
    }

    renderCollapsedDetails() {
        const { orderType } = this.props;
        return (
            <Fragment>
                {isValidString(orderType) && orderType === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION && this.renderOrderNoText()}
                <T2STouchableOpacity
                    accessbile={false}
                    screenName={SCREEN_NAME.VIEW_ORDER}
                    id={VIEW_ID.ORDER_ID_TEXT_CLICK}
                    onPress={this.onOrderIdClicked}
                    hitSlop={defaultTouchArea()}>
                    <T2SText screenName={SCREEN_NAME.VIEW_ORDER} id={VIEW_ID.ORDER_ID_TEXT}>
                        {LOCALIZATION_STRINGS.ORDER_ID} {this.props.orderID}
                    </T2SText>
                </T2STouchableOpacity>
                <T2SText screenName={SCREEN_NAME.VIEW_ORDER} id={VIEW_ID.ORDER_PLACED_ON_TEXT}>
                    {LOCALIZATION_STRINGS.PLACED_ON}: {moment(this.props.orderPlacedOn).format(DATE_FORMAT.DD_MMM_YYY__HH_MM)}
                </T2SText>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    orderID: selectOrderID(state),
    order_no: selectOrderNo(state),
    orderPlacedOn: selectOrderPlacedTime(state),
    orderType: selectReceiptOrderType(state),
    houseNo: selectReceiptHouseNo(state),
    postcode: selectReceiptPostcode(state),
    address: selectReceiptAddress1(state),
    customerData: selectReceiptCustomer(state),
    pendingAndCompletedOrder: state.orderManagementState.pendingAndCompletedOrder
});
const mapDispatchToProps = {
    resetReceiptResponse
};
export default connect(mapStateToProps, mapDispatchToProps)(ExpandCollapseHeader);
