import React, { Component } from 'react';
import { ImageBackground, View } from 'react-native';
import { T2SIcon, T2STouchableOpacity, T2SView } from 't2sbasemodule/UI';
import { ORDER_HISTORY_BUTTONS, SCREEN_NAME, VIEW_ID, VIEW_ORDER_SOURCE } from '../../Utils/OrderManagementConstants';
import { styles } from '../Styles/OrderHistoryFoodHubItemStyle';
import { CHECK_ORDER_TYPE, ORDER_STATUS, ORDER_TYPE } from '../../../BaseModule/BaseConstants';
import { getTakeawayId, getTakeawayName, isFranchiseApp, isValidElement, isValidNotEmptyString } from 't2sbasemodule/Utils/helpers';
import { getOrderDateFormat, getOrderHistoryRightButton, isValidDiscount } from '../../Utils/OrderManagementHelper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { selectCurrencyFromS3Config, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { getCurrencyFromBasketResponse } from '../../../BaseModule/GlobalAppHelper';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import JoinBetaView from './JoinBetaView';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { updateOrderDetailsData } from '../../Redux/OrderManagementAction';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { selectPendingOrderLength, selectPreviousOrderLength } from '../../Redux/OrderManagementSelectors';
import { debounce } from 'lodash';
import OrderHistoryButtons from '../MicroComponent/OrderHistoryButtons';
import FeedBackButton from '../MicroComponent/FeedBackButton';
import { canGiveReview } from '../../../ReviewModule/Utils/ReviewHelper';

class OrderHistoryFoodHubItem extends Component {
    constructor(props) {
        super(props);
        this.onButtonClicked = this.onButtonClicked.bind(this);
        this.handleReasonRequestClose = this.handleReasonRequestClose.bind(this);
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
            this.props.orderData.review !== nextProps.orderData.review ||
            this.props.orderData.status !== nextProps.orderData.status ||
            this.props.pendingOrderLength !== nextProps.pendingOrderLength ||
            this.props.previousOrderLength !== nextProps.previousOrderLength
        );
    }

    render() {
        const { orderData, timezone, showDivider } = this.props;
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
                    {this.renderLogo(orderData)}
                    <View style={styles.contentContainer}>
                        <View style={styles.titleContainer}>
                            <T2SText
                                screenName={SCREEN_NAME.ORDER_HISTORY}
                                id={VIEW_ID.TAKEAWAY_NAME + '_' + orderData.id}
                                style={styles.title}
                                numberOfLines={1}>
                                {this.getTitleTxt(orderData)}
                            </T2SText>

                            {orderData.sending === ORDER_TYPE.WAITING && (
                                <T2SView style={styles.waitingViewStyle}>
                                    <T2SText style={styles.waitingTextStyle}>{LOCALIZATION_STRINGS.ORDER_KIOSK}</T2SText>
                                </T2SView>
                            )}
                            <T2SText
                                style={[styles.dateStyle, orderData.status <= ORDER_STATUS.DELIVERED ? null : styles.dateColorBlurred]}
                                id={VIEW_ID.ORDER_DATE_AND_TIME_TEXT + '_' + orderData.id}
                                screenName={SCREEN_NAME.ORDER_HISTORY}>
                                {orderTime}
                            </T2SText>
                        </View>
                        <View style={styles.priceContainer}>
                            {this.renderOrderType(orderData)}
                            {this.renderSavings(orderData)}
                        </View>
                        {this.renderButtons(orderData)}
                        {this.renderReasonModal()}
                    </View>
                </View>
                {orderData.status <= ORDER_STATUS.DELIVERED && !showDivider && <JoinBetaView screenName={SCREEN_NAME.ORDER_HISTORY} />}
            </T2STouchableOpacity>
        );
    }
    renderLogo(data) {
        return (
            <View style={styles.logoImageContainer}>
                <ImageBackground
                    imageStyle={styles.imageBackgroundStyle}
                    source={
                        isValidElement(data.store) &&
                        isValidElement(data.store.portal_setting) &&
                        isValidNotEmptyString(data.store.portal_setting.logo_url)
                            ? { uri: data.store.portal_setting.logo_url }
                            : isValidElement(data.store) && isValidNotEmptyString(data.store.website_logo_url)
                            ? { uri: data.store.website_logo_url }
                            : isFranchiseApp()
                            ? require('../../../../FranchiseApp/Images/no_image_small_pattern.png')
                            : require('../../Images/DefaultTakeawayLogo.png')
                    }
                    style={styles.imageStyle}
                    resizeMode="contain"
                />
            </View>
        );
    }

    renderOrderType(data) {
        return (
            <View style={styles.orderTypeContainer}>
                <T2SIcon
                    id={VIEW_ID.ORDER_TYPE_ICON + '_' + data.id}
                    screenName={SCREEN_NAME.ORDER_HISTORY}
                    style={[{ marginStart: CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION ? -3 : 1 }]}
                    icon={data.sending === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION ? FONT_ICON.COLLECTION : FONT_ICON.DELIVERY}
                    color={isValidElement(data.status) && data.status <= ORDER_STATUS.DELIVERED ? Colors.black : Colors.secondary_color}
                    size={FONT_ICON.COLLECTION ? 23 : 22}
                />
                <View
                    style={[
                        styles.verticalDivider,
                        { backgroundColor: data.status <= ORDER_STATUS.DELIVERED ? Colors.black : Colors.dividerGrey }
                    ]}
                />
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
            </View>
        );
    }

    renderSavings(data) {
        if (isValidDiscount(data)) {
            return (
                <View style={styles.savingsContainer}>
                    <T2SIcon
                        id={VIEW_ID.SAVINGS_ICON + '_' + data.id}
                        screenName={SCREEN_NAME.ORDER_HISTORY}
                        icon={FONT_ICON.TOTAL_SAVINGS}
                        color={Colors.primaryColor}
                        style={styles.savingsIcon}
                        size={18}
                    />
                    <T2SText style={styles.savingsText} id={VIEW_ID.ORDER_SAVINGS + '_' + data.id} screenName={SCREEN_NAME.ORDER_HISTORY}>
                        {parseFloat(data.online_discount_value).toFixed(2)}
                    </T2SText>
                </View>
            );
        }
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
        return <FeedBackButton data={data} onPress={this.onButtonClicked} feedBackButton={ORDER_HISTORY_BUTTONS.FEEDBACK} />;
    }

    renderTrackOrderButton(orderData) {
        return (
            <OrderHistoryButtons
                id={VIEW_ID.TRACK_ORDER_TEXT + '_' + orderData.id}
                onPress={this.onButtonClicked}
                buttonPressed={ORDER_HISTORY_BUTTONS.TRACK_ORDER}
                text={LOCALIZATION_STRINGS.TRACK_ORDER}
            />
        );
    }

    renderReorderButton(orderData) {
        return (
            <OrderHistoryButtons
                id={VIEW_ID.REORDER_TEXT + '_' + orderData.id}
                onPress={this.onButtonClicked}
                buttonPressed={ORDER_HISTORY_BUTTONS.REORDER}
                text={LOCALIZATION_STRINGS.REORDER}
            />
        );
    }

    getTitleTxt(data) {
        return isValidElement(data) && isValidElement(data.store) && getTakeawayName(data.store?.name);
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

    handleFeedBack = debounce(
        (data) => {
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
        },
        300,
        { leading: true, trailing: false }
    );

    setOrderData(data) {
        this.props.updateOrderDetailsData(data);
    }
    handleReasonRequestClose() {
        this.setState({ showReasonModal: false });
    }
    renderReasonModal() {
        return (
            <T2SModal
                isVisible={this.state.showReasonModal}
                requestClose={this.handleReasonRequestClose}
                title={LOCALIZATION_STRINGS.REASON.trim()}
                description={this.state.reasonMsg}
                negativeButtonText={null}
                positiveButtonText={LOCALIZATION_STRINGS.OK}
                positiveButtonClicked={this.handleReasonRequestClose}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    timezone: selectTimeZone(state),
    pendingOrderLength: selectPendingOrderLength(state),
    previousOrderLength: selectPreviousOrderLength(state),
    currency: selectCurrencyFromS3Config(state)
});

const mapDispatchToProps = {
    updateOrderDetailsData
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryFoodHubItem);
