import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { T2SIcon, T2STouchableOpacity } from 't2sbasemodule/UI';
import { ORDER_HISTORY_BUTTONS, SCREEN_NAME, VIEW_ID, VIEW_ORDER_SOURCE } from '../../Utils/OrderManagementConstants';
import { styles } from '../Styles/OrderHistoryCustomerItemStyle';
import { ORDER_STATUS } from '../../../BaseModule/BaseConstants';
import { getTakeawayId, getTakeawayName, isValidElement, isValidNumber, isValidString } from 't2sbasemodule/Utils/helpers';
import { getOrderDateFormat, getOrderHistoryRightButton, getTitleTxt, isValidDiscount } from '../../Utils/OrderManagementHelper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { selectCurrencyFromS3Config, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { getCurrencyFromBasketResponse } from '../../../BaseModule/GlobalAppHelper';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { updateOrderDetailsData } from '../../Redux/OrderManagementAction';
import { selectPendingOrderLength, selectPreviousOrderLength } from '../../Redux/OrderManagementSelectors';
import { canGiveReview } from '../../../ReviewModule/Utils/ReviewHelper';

class OrderHistoryCustomerItem extends Component {
    constructor(props) {
        super(props);
        this.onButtonClicked = this.onButtonClicked.bind(this);
        this.state = {
            showReasonModal: false,
            reasonMsg: '',
            change: false
        };
    }

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            // As rerender is not called after language is changed, did this tricky
            this.setState({ change: true });
        });
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            // As rerender is not called after language is changed, did this tricky
            this.setState({ change: false });
        });
    }
    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.change !== nextState.change ||
            this.props.orderData.status !== nextProps.orderData.status ||
            this.props.pendingOrderLength !== nextProps.pendingOrderLength ||
            this.props.previousOrderLength !== nextProps.previousOrderLength
        );
    }
    render() {
        const { orderData, timezone, showDivider, profileResponse } = this.props;
        const orderTime = getOrderDateFormat(orderData.order_placed_on, timezone);

        return (
            <T2STouchableOpacity
                accessible={false}
                id={VIEW_ID.ORDER_LIST_ITEM_VIEW + '_' + orderData.id}
                screenName={SCREEN_NAME.ORDER_HISTORY}
                onPress={() => {
                    if (isValidElement(orderData)) {
                        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_HISTORY, ANALYTICS_EVENTS.LIST_ITEM_CLICKED, { id: orderData.id });
                        if (orderData.status <= ORDER_STATUS.DELIVERED || orderData.status === ORDER_STATUS.CANCEL_ORDER) {
                            this.onButtonClicked(ORDER_HISTORY_BUTTONS.TRACK_ORDER);
                        } else {
                            this.onButtonClicked(ORDER_HISTORY_BUTTONS.VIEW_ORDER);
                        }
                    }
                }}
                style={styles.rootContainer}>
                <View
                    style={[
                        styles.itemContainer,
                        orderData.status <= ORDER_STATUS.DELIVERED ? {} : styles.colorWhite,
                        !showDivider ? { marginBottom: 0 } : null
                    ]}>
                    <View style={styles.titleContainer}>
                        <T2SText
                            screenName={SCREEN_NAME.ORDER_HISTORY}
                            id={VIEW_ID.DELIVERY_ADDRESS + '_' + orderData.id + '_' + orderData.id}
                            style={styles.title}
                            numberOfLines={1}>
                            {getTitleTxt(orderData, profileResponse)}
                        </T2SText>
                        <T2SText
                            style={[styles.dateStyle, orderData.status <= ORDER_STATUS.DELIVERED ? {} : styles.dateColorBlurred]}
                            id={VIEW_ID.ORDER_DATE_AND_TIME_TEXT + '_' + orderData.id}
                            screenName={SCREEN_NAME.ORDER_HISTORY}>
                            {orderTime}
                        </T2SText>
                    </View>
                    {this.renderButtons(orderData)}
                </View>
            </T2STouchableOpacity>
        );
    }

    renderButtons(data) {
        return (
            <View style={styles.buttonContainer}>
                {this.renderFeedbackButton(data)}
                <View
                    style={[
                        styles.verticalDivider,
                        styles.marginEnd_16,
                        { backgroundColor: data.status <= ORDER_STATUS.DELIVERED ? Colors.suvaGrey : Colors.dividerGrey }
                    ]}
                />
                {this.renderRightButton(data)}
                {data.status === ORDER_STATUS.CANCEL_ORDER && (
                    <View style={styles.cancelOrderContainer}>
                        <T2SText
                            style={styles.cancelOrderText}
                            id={VIEW_ID.ORDER_CANCELLED + '_' + data.id}
                            screenName={SCREEN_NAME.ORDER_HISTORY}
                            numberOfLines={1}
                            adjustsFontSizeToFit>
                            {LOCALIZATION_STRINGS.CANCELLED}
                        </T2SText>
                        <T2SIcon
                            screenName={SCREEN_NAME.ORDER_HISTORY}
                            id={VIEW_ID.ICON_CANCEL + '_' + data.id}
                            icon={FONT_ICON.WRONG}
                            color={Colors.freeOption}
                            size={17}
                        />
                    </View>
                )}
                {data.status !== ORDER_STATUS.CANCEL_ORDER && this.renderPrice(data)}
            </View>
        );
    }

    renderPrice(data) {
        return (
            <View style={styles.priceContainer}>
                <T2SText
                    style={
                        data.status <= ORDER_STATUS.DELIVERED
                            ? [styles.priceText, { color: Colors.black }]
                            : [styles.priceText, { color: Colors.suvaGrey }]
                    }
                    id={VIEW_ID.ORDER_AMOUNT + '_' + data.id}
                    screenName={SCREEN_NAME.ORDER_HISTORY}>
                    {getCurrencyFromBasketResponse(data?.store?.currency, this.props.currency)} {data.total}
                </T2SText>
                {isValidDiscount(data) && (
                    <View style={styles.savingsContainer}>
                        <T2SIcon
                            id={VIEW_ID.SAVINGS_ICON + '_' + data.id}
                            screenName={SCREEN_NAME.ORDER_HISTORY}
                            icon={FONT_ICON.TOTAL_SAVINGS}
                            color={Colors.primaryColor}
                            style={styles.savingsIcon}
                            size={18}
                        />
                        <T2SText
                            style={styles.savingsText}
                            id={VIEW_ID.ORDER_SAVINGS + '_' + data.id}
                            screenName={SCREEN_NAME.ORDER_HISTORY}>
                            {isValidElement(data) && isValidNumber(data.online_discount_value) ? data.online_discount_value : ''}
                        </T2SText>
                    </View>
                )}
            </View>
        );
    }

    renderRightButton(data) {
        switch (getOrderHistoryRightButton(data)) {
            case ORDER_HISTORY_BUTTONS.TRACK_ORDER: {
                return this.renderTrackOrderButton(data);
            }
            case ORDER_HISTORY_BUTTONS.REORDER: {
                return this.renderReorderButton(data);
            }
            default: {
                return this.renderReorderButton(data);
            }
        }
    }

    renderFeedbackButton(data) {
        return (
            <T2STouchableOpacity
                id={VIEW_ID.ORDER_FEEDBACK + '_' + data.id}
                screenName={SCREEN_NAME.ORDER_HISTORY}
                accessible={false}
                onPress={this.onButtonClicked.bind(this, ORDER_HISTORY_BUTTONS.FEEDBACK) /*this.handleFeedBack(data)*/}>
                <View style={styles.buttonParent}>
                    <T2SText
                        id={VIEW_ID.ORDER_FEEDBACK_TEXT + '_' + data.id}
                        screenName={SCREEN_NAME.ORDER_HISTORY}
                        style={styles.buttonText}>
                        {' ' + LOCALIZATION_STRINGS.APP_FEED_BACK + ' '}
                    </T2SText>
                    {isValidElement(data.review) && data.review?.is_ignored !== 'YES' && (
                        <T2SIcon
                            id={VIEW_ID.FEEDBACK_TICK_ICON + '_' + data.id}
                            screenName={SCREEN_NAME.ORDER_HISTORY}
                            icon={isValidString(data.review.response) ? FONT_ICON.DOUBLE_TICK : FONT_ICON.TICK}
                            color={Colors.primaryColor}
                            size={isValidString(data.review.response) ? 20 : 16}
                            style={styles.tickIconStyle}
                        />
                    )}
                </View>
            </T2STouchableOpacity>
        );
    }

    renderTrackOrderButton(data) {
        return (
            <T2STouchableOpacity
                id={VIEW_ID.TRACK_ORDER_TEXT + '_' + data.id}
                screenName={SCREEN_NAME.ORDER_HISTORY}
                onPress={this.onButtonClicked.bind(this, ORDER_HISTORY_BUTTONS.TRACK_ORDER) /*this.handleTrackOrder(data)*/}>
                <View style={styles.buttonParent}>
                    <Text style={styles.buttonText}>{LOCALIZATION_STRINGS.TRACK_ORDER}</Text>
                </View>
            </T2STouchableOpacity>
        );
    }

    renderReorderButton(data) {
        return (
            <T2STouchableOpacity
                id={VIEW_ID.REORDER_TEXT + '_' + data.id}
                screenName={SCREEN_NAME.ORDER_HISTORY}
                onPress={this.onButtonClicked.bind(this, ORDER_HISTORY_BUTTONS.REORDER) /*this.handleViewOrder(data)*/}>
                <View style={styles.buttonParent}>
                    <Text style={styles.buttonText}>{LOCALIZATION_STRINGS.REORDER}</Text>
                </View>
            </T2STouchableOpacity>
        );
    }

    onButtonClicked(type) {
        const { orderData } = this.props;

        switch (type) {
            case ORDER_HISTORY_BUTTONS.FEEDBACK:
                this.handleFeedBack(orderData);
                break;
            case ORDER_HISTORY_BUTTONS.VIEW_ORDER:
                this.handleViewOrder(orderData);
                break;
            case ORDER_HISTORY_BUTTONS.TRACK_ORDER:
                this.handleTrackOrder(orderData);
                break;
            case ORDER_HISTORY_BUTTONS.REORDER:
                this.handleViewOrder(orderData);
                break;
            case ORDER_HISTORY_BUTTONS.REASON:
                this.handleReason(orderData);
                break;
        }
    }

    handleViewOrder(data) {
        if (isValidElement(data)) {
            Analytics.logEvent(ANALYTICS_SCREENS.ORDER_HISTORY, ANALYTICS_EVENTS.VIEW_ORDER_BUTTON_CLICKED);
            this.setOrderData(data);
            const { id, store, sending } = data;
            handleNavigation(SCREEN_OPTIONS.VIEW_ORDER.route_name, {
                data: data,
                orderId: id,
                storeID: getTakeawayId(store),
                sending: sending,
                name: getTakeawayName(store?.name),
                source: VIEW_ORDER_SOURCE.ORDER_HISTORY,
                delivery_time: data.delivery_time
            });
        }
    }

    handleReason(data) {
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_HISTORY, ANALYTICS_EVENTS.REASON_BUTTON_CLICKED);
        this.setState({ reasonMsg: data.cancel_reason_message, showReasonModal: true });
    }

    handleTrackOrder(data) {
        if (isValidElement(data)) {
            Analytics.logEvent(ANALYTICS_SCREENS.ORDER_HISTORY, ANALYTICS_EVENTS.TRACK_ORDER_BUTTON_CLICKED);
            this.setOrderData(data);
            const { id, store, sending } = data;
            let store_id = getTakeawayId(store);
            handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
                orderId: id,
                storeID: store_id,
                sending: sending,
                name: getTakeawayName(store?.name),
                store: store,
                analyticsObj: {
                    order_id: id,
                    store_id: store_id
                }
            });
        }
    }

    handleFeedBack(data) {
        if (isValidElement(data)) {
            this.setOrderData(data);
            Analytics.logEvent(ANALYTICS_SCREENS.ORDER_HISTORY, ANALYTICS_EVENTS.FEEDBACK_BUTTON_CLICKED);
            const { id, store, review } = data;
            if (canGiveReview(data)) {
                handleNavigation(SCREEN_OPTIONS.POST_REVIEW.route_name, {
                    order_id: id,
                    store: store,
                    storeID: getTakeawayId(store)
                });
            } else {
                handleNavigation(SCREEN_OPTIONS.VIEW_REVIEW.route_name, { review, store });
            }
        }
    }

    setOrderData(data) {
        this.props.updateOrderDetailsData(data);
    }
}

const mapStateToProps = (state) => ({
    timezone: selectTimeZone(state),
    profileResponse: state.profileState.profileResponse,
    pendingOrderLength: selectPendingOrderLength(state),
    previousOrderLength: selectPreviousOrderLength(state),
    currency: selectCurrencyFromS3Config(state)
});

const mapDispatchToProps = {
    updateOrderDetailsData
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryCustomerItem);
