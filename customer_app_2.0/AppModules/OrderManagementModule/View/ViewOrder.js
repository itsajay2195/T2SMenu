import React, { Component } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { T2SAppBar, T2SButton, T2SDivider } from 't2sbasemodule/UI';
import {
    disableReorderButtonAction,
    reOrderBasketNavigation,
    resetReceiptResponse,
    resetReOrderFlags,
    resetReOrderResponseAction,
    setOrderIDAction,
    viewOrderAction
} from '../Redux/OrderManagementAction';
import styles from '../View/Styles/ViewOrderStyle';
import {
    isPreOrder,
    selectOrderInstructions,
    selectOrderStatus,
    selectOrderType,
    selectPayment,
    selectReceiptAdminFee,
    selectReceiptCarryBag,
    selectReceiptCollectionDiscount,
    selectReceiptCouponSummary,
    selectReceiptDeliveryCharge,
    selectReceiptOnlineDiscount,
    selectReceiptOrderItems,
    selectReceiptPointsGain,
    selectReceiptPointsRemaining,
    selectReceiptRedeemAmount,
    selectReceiptResponse,
    selectReceiptServiceCharge,
    selectReceiptSubTotal,
    selectReceiptTotal,
    selectReceiptVAT,
    selectRefundRequested,
    selectRefundStatus,
    selectTotalPaidByCard,
    selectTotalPaidByWallet
} from '../Redux/OrderManagementSelectors';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import CartItem from '../../BasketModule/View/Components/CartItem';
import {
    isCollectionAvailableSelector,
    isDeliveryAvailableSelector,
    isPreOrderAvailableSelector,
    isTakeAwayOpenSelector,
    selectLanguageKey,
    selectPhone,
    selectPrimaryAddressSelector,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import { getPriceSummary } from '../../BasketModule/Utils/BasketHelper';
import { getFormattedTAPhoneNumber, isArrayNonEmpty, isCustomerApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { BasketConstants } from '../../BasketModule/Utils/BasketConstants';
import ExpandCollapseHeader from './Components/ExpandCollapseHeader';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import {
    extractOrderType,
    getPaymentTypeBasedTotalPaidBy,
    getTakeawayNameForOrder,
    getValidAddress,
    isValidTotalSavings
} from '../Utils/OrderManagementHelper';
import { RE_ORDER_TRIGGER_SCREEN, SCREEN_NAME, VIEW_ID } from '../Utils/OrderManagementConstants';
import { ORDER_STATUS, ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { selectDeliveryAddressAction, updateSelectedOrderType } from '../../AddressModule/Redux/AddressAction';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import _, { debounce } from 'lodash';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import ViewOrderLoader from './Components/ViewOrderLoader';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import { startHelp } from 'appmodules/BaseModule/Helper';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { getPhonenumberLink } from '../../SupportModule/Utils/SupportHelpers';
import { iso } from '../../BaseModule/GlobalAppHelper';
import RefundRequested from './Components/RefundRequested';
import RefundStatus from './Components/RefundStatus';
import { getCountryById } from '../../../FoodHubApp/LandingPage/Utils/Helper';
import * as appHelper from 't2sbasemodule/Utils/helpers';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';

let screenName = SCREEN_NAME.VIEW_ORDER;

class ViewOrder extends Component {
    constructor(props) {
        super(props);
        this.handleLiveChatClick = this.handleLiveChatClick.bind(this);
        this.handleCallButtonClick = this.handleCallButtonClick.bind(this);
    }
    state = {
        name: null,
        currency:
            isValidElement(this.props.viewOrderResponse) && isValidElement(this.props.viewOrderResponse.currency_symbol)
                ? this.props.viewOrderResponse.currency_symbol
                : '',
        reOrderButtonStatus: false
    };

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            const { route } = this.props;
            // Getting storeId from params, if it's null taking it from `props.storeID`
            const storeIdFromParams =
                isValidElement(route.params) && isValidElement(route.params.storeID) ? route.params.storeID : undefined;
            this.props.viewOrderAction(route.params.orderId, storeIdFromParams);
            Analytics.logScreen(ANALYTICS_SCREENS.VIEW_ORDER);
            if (this.state.reOrderButtonStatus) {
                this.setState({
                    reOrderButtonStatus: false
                });
            }
        });
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { viewOrderResponse } = props;
        if (
            isValidElement(viewOrderResponse) &&
            isValidElement(viewOrderResponse.currency_symbol) &&
            viewOrderResponse.currency_symbol !== state.currency
        ) {
            value.currency = viewOrderResponse.currency_symbol;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentWillUnmount() {
        this.props.resetReceiptResponse();
        this.props.resetReOrderFlags();
        this.props.disableReorderButtonAction(false);

        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }

    renderRefundRequestedView() {
        const { currency } = this.state;
        const { refundRequestedData } = this.props;
        if (isArrayNonEmpty(refundRequestedData)) return <RefundRequested currency={currency} screenName={screenName} />;
    }
    renderRefundStatusView() {
        const { refundRequestedData, refundStatus } = this.props;
        if (isArrayNonEmpty(refundRequestedData) && isValidString(refundStatus?.data?.message)) {
            return <RefundStatus screenName={screenName} />;
        }
    }

    render() {
        const { items, isPreOrder } = this.props;
        const { currency } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <T2SAppBar
                    id={VIEW_ID.TAKEAWAY_HEADER_TEXT}
                    screenName={screenName}
                    actions={this.renderHeaderButtons()}
                    title={this.getTitle()}
                />
                <View style={styles.foodHubListStyle}>
                    {this.renderRefundRequestedView()}
                    {this.renderRefundStatusView()}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <CartItem data={item} currency={currency} index={index} viewMode={true} isPreOrder={isPreOrder} />
                        )}
                        ItemSeparatorComponent={() => <T2SDivider />}
                        ListFooterComponent={this.footer()}
                        ListHeaderComponent={this.header()}
                    />
                </View>
                {this.renderBottomButton()}
            </SafeAreaView>
        );
    }

    getTitle() {
        const { pendingAndCompletedOrder, previousOrder, route } = this.props;
        const { name, orderId } = route.params;
        const pendingOrderTAName = getTakeawayNameForOrder(pendingAndCompletedOrder, orderId);
        const completedOrderTAName = getTakeawayNameForOrder(previousOrder, orderId);
        return isValidString(name)
            ? name
            : isValidString(pendingOrderTAName)
            ? pendingOrderTAName
            : isValidString(completedOrderTAName)
            ? completedOrderTAName
            : '';
    }

    renderHeaderButtons() {
        return <View style={styles.headerIconContainer}>{this.renderChatText()}</View>;
    }
    renderChatText() {
        return (
            <T2STouchableOpacity id={VIEW_ID.LIVE_CHAT_VIEW} screenName={screenName} onPress={this.handleLiveChatClick}>
                <T2SText screenName={screenName} id={VIEW_ID.LIVE_CHAT} style={styles.commonLinkTextStyle}>
                    {LOCALIZATION_STRINGS.HELP}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    /**
     * If needed we will reuse it in future
     */
    renderChatButton() {
        return (
            <T2STouchableOpacity
                id={VIEW_ID.LIVE_CHAT}
                screenName={screenName}
                icon={FONT_ICON.LIVE_CHAT}
                size={25}
                onPress={() => {
                    this.handleLiveChatClick();
                }}>
                {/*{/Todo we need to chanege this once merged with developmet use icon inst/}*/}
                <Image style={styles.ChatView} source={require('../../SupportModule/Images/ChatImage.png')} />
            </T2STouchableOpacity>
        );
    }
    renderCallButton() {
        return (
            <T2SIcon
                style={styles.headerIcon}
                id={VIEW_ID.CALL_BUTTON}
                screenName={screenName}
                icon={FONT_ICON.CALL_FILLED}
                size={25}
                onPress={this.handleCallButtonClick}
            />
        );
    }
    handleCallButtonClick() {
        const { phone, viewOrderResponse, countryIso, country_id, countryFlag, countryList, countryId, featureGateResponse } = this.props;
        const country = getCountryById(countryList, country_id);

        let takeawayNumber = getPhonenumberLink(phone, iso(countryIso, countryFlag));
        if (isValidElement(takeawayNumber)) {
            appHelper.callDialPad(getFormattedTAPhoneNumber(phone, countryIso, countryId !== country?.id));
            Analytics.logEvent(ANALYTICS_SCREENS.VIEW_ORDER, ANALYTICS_EVENTS.CALL_ICON_CLICKED);
        } else if (isValidElement(viewOrderResponse) && isValidString(viewOrderResponse.takeaway_number)) {
            appHelper.callDialPad(getFormattedTAPhoneNumber(viewOrderResponse.takeaway_number, countryIso, countryId !== country?.id));
            Analytics.logEvent(ANALYTICS_SCREENS.VIEW_ORDER, ANALYTICS_EVENTS.CALL_ICON_CLICKED);
        }
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.TA_CALLED, {
            source: 'view_order'
        });
    }

    footer() {
        let summaries = getPriceSummary(this.props);
        const { total } = this.props;

        if (isValidElement(summaries) && summaries.length > 0 && isValidElement(total)) {
            return (
                <View style={styles.dividerLargeStyle}>
                    <View style={styles.priceSummaryContainer}>{this.renderDiscountsAndTotal()}</View>
                    <T2SDivider />
                    {this.renderTotal()}
                    {this.renderLoyaltyPoints()}
                </View>
            );
        } else {
            return (
                <View style={styles.previousOrderContainerStyle}>
                    <ViewOrderLoader />
                </View>
            );
        }
    }
    header() {
        const { data } = this.props.route.params;
        const { refundedMessage } = this.props;
        return (
            <T2SView>
                {isValidElement(data) &&
                isValidElement(data.status) &&
                data.status === ORDER_STATUS.CANCEL_ORDER &&
                isValidString(data.cancel_reason_message) ? (
                    <View style={styles.cancelOrderView}>
                        <T2SView style={styles.cancelOrderRow}>
                            <T2SIcon name={FONT_ICON.BACKWARD} size={25} style={styles.backIconStyle} color={Colors.primaryColor} />
                            <T2SText style={styles.cancelTextStyle}>{LOCALIZATION_STRINGS.CANCELLED_TEXT}</T2SText>
                        </T2SView>
                        <T2SText style={styles.cancelledMessage}>
                            {convertMessageToAppLanguage(data.cancel_reason_message, this.props.languageKey)}
                        </T2SText>
                        {isValidString(refundedMessage) && (
                            <T2SText
                                style={[styles.cancelledMessage, styles.refundInfoText]}
                                screenName={screenName}
                                id={VIEW_ID.REFUNDED_TO_WALLET_MSG_TEXT}>
                                {refundedMessage}
                            </T2SText>
                        )}
                    </View>
                ) : null}
                <ExpandCollapseHeader />

                {this.props.items ? (
                    <T2SText style={styles.basketTextStyle}>{LOCALIZATION_STRINGS.YOUR_BASKET.toUpperCase()}</T2SText>
                ) : null}
                {this.props.isPreOrder ? (
                    <T2SText style={styles.preOrderText}>{LOCALIZATION_STRINGS.PREORDER.toUpperCase()}</T2SText>
                ) : null}
            </T2SView>
        );
    }

    renderLoyaltyPoints() {
        const { points_gained, points_remaining } = this.props;
        if (isCustomerApp()) {
            return (
                <View>
                    {((isValidElement(points_gained) && isValidTotalSavings(points_gained.value)) ||
                        (isValidElement(points_remaining) && isValidTotalSavings(points_remaining.value))) && (
                        <View style={{ marginVertical: 10 }}>
                            <T2SDivider />
                        </View>
                    )}
                    {isValidElement(points_gained) && isValidTotalSavings(points_gained.value) && (
                        <View style={styles.foodHubPriceSummaryStyle}>
                            <T2SText screenName={screenName} id={VIEW_ID.POINTS_GAIN_LABEL} style={styles.subTotalStyle}>
                                {points_gained.label}
                            </T2SText>
                            <T2SText screenName={screenName} id={VIEW_ID.POINTS_GAIN_VALUE} style={styles.subTotalStyle}>
                                {points_gained.value}
                            </T2SText>
                        </View>
                    )}
                    {isValidElement(points_remaining) && isValidTotalSavings(points_remaining.value) && (
                        <View style={styles.foodHubPriceSummaryStyle}>
                            <T2SText screenName={screenName} id={VIEW_ID.POINTS_REMAIN_LABEL} style={styles.subTotalStyle}>
                                {points_remaining.label}
                            </T2SText>
                            <T2SText screenName={screenName} id={VIEW_ID.POINTS_REMAIN_VALUE} style={styles.subTotalStyle}>
                                {points_remaining.value}
                            </T2SText>
                        </View>
                    )}
                </View>
            );
        }
    }

    renderDiscountsAndTotal() {
        let summaries = getPriceSummary(this.props);
        const { currency } = this.state;
        if (isValidElement(summaries) && summaries.length > 0 && isValidElement(currency)) {
            return summaries.map((item, index) => {
                return (
                    <View key={index.toString()} style={styles.foodHubPriceSummaryStyle}>
                        <T2SText
                            screenName={screenName}
                            id={VIEW_ID.PRICE_LABEL + item.label}
                            style={index !== 0 ? styles.foodHubLabelStyle : styles.subTotalStyle}>
                            {item.label}
                        </T2SText>
                        <T2SText
                            screenName={screenName}
                            id={VIEW_ID.PRICE_VALUE + item.label}
                            style={
                                item.type === BasketConstants.DISCOUNT
                                    ? styles.foodHubLabelGreenStyle
                                    : index !== 0
                                    ? styles.foodHubLabelStyle
                                    : styles.subTotalStyle
                            }>
                            {item.type === BasketConstants.DISCOUNT ? `-${item.value}` : `${item.value}`}
                        </T2SText>
                    </View>
                );
            });
        }
    }

    renderTotal() {
        const { total, payment, totalPaidByCard, totalPaidByWallet } = this.props;
        const { currency } = this.state;

        if (isValidElement(total)) {
            return (
                <View>
                    <View style={[styles.foodHubPriceSummaryStyle, { marginTop: 10 }]}>
                        <View style={styles.totalLabelContainer}>
                            <T2SText screenName={screenName} id={VIEW_ID.TOTAL_LABEL} style={styles.totalLabelStyle}>
                                {total.label}
                            </T2SText>
                        </View>
                        <View style={styles.row}>
                            <T2SText
                                screenName={screenName}
                                id={
                                    VIEW_ID.TOTAL_LABEL_PAYMENT +
                                    getPaymentTypeBasedTotalPaidBy(totalPaidByCard, totalPaidByWallet, payment, currency)
                                }
                                style={styles.foodHubTotalPaymentStyle}>
                                {getPaymentTypeBasedTotalPaidBy(totalPaidByCard, totalPaidByWallet, payment, currency)}
                            </T2SText>
                            <T2SText
                                screenName={screenName}
                                id={VIEW_ID.TOTAL_VALUE + currency + total.value}
                                style={styles.foodHubTotalValueStyle}>
                                {currency}
                                {total.value}
                            </T2SText>
                        </View>
                    </View>
                    {this.renderInstruction()}
                </View>
            );
        }
    }

    renderInstruction() {
        if (this.props.orderInstructions.length === 0) return;
        return (
            <View style={styles.instructionContainerStyle}>
                <Text style={styles.instructionTitleStyle}>{LOCALIZATION_STRINGS.INSTRUCTIONS} </Text>
                <Text style={styles.instructionDescriptionStyle}>
                    {convertMessageToAppLanguage(this.props.orderInstructions, this.props.languageKey)}
                </Text>
                <Divider />
            </View>
        );
    }

    renderBottomButton() {
        const { route, items, viewOrderResponse } = this.props;
        if (
            isValidElement(items) &&
            isValidElement(items.length > 0) &&
            isValidElement(viewOrderResponse) &&
            (viewOrderResponse.status === ORDER_STATUS.HIDDEN || viewOrderResponse.status === ORDER_STATUS.CANCEL_ORDER)
        ) {
            return (
                <View style={styles.bottomContainer}>
                    <T2SButton
                        disabled={this.state.reOrderButtonStatus}
                        title={LOCALIZATION_STRINGS.REORDER}
                        screenName={screenName}
                        id={VIEW_ID.REPEAT_ORDER}
                        color={Colors.primaryColor}
                        onPress={() => {
                            Analytics.logEvent(ANALYTICS_SCREENS.VIEW_ORDER, ANALYTICS_EVENTS.REORDER_ACTION);
                            const { orderId, sending, storeID, name } = route.params;
                            const { pendingAndCompletedOrder } = this.props;
                            const reOrderType = extractOrderType(isValidElement(sending) ? sending : viewOrderResponse.sending);
                            const reOrderStoreId = isValidElement(storeID)
                                ? storeID
                                : isValidElement(viewOrderResponse.store_id)
                                ? viewOrderResponse.store_id
                                : undefined;
                            this.setState(
                                {
                                    name: isValidString(name) ? name : getTakeawayNameForOrder(pendingAndCompletedOrder, orderId)
                                },
                                () => {
                                    this.handleReorderClick(orderId, reOrderStoreId, reOrderType);
                                }
                            );
                        }}
                    />
                </View>
            );
        }
    }

    handleLiveChatClick() {
        const { profileResponse, languageKey, countryBaseFeatureGateResponse, viewOrderResponse } = this.props;
        let { orderId, storeID } = this.props.route.params;
        if (!isValidString(storeID)) {
            storeID = isValidElement(viewOrderResponse.store_id) ? viewOrderResponse.store_id : undefined;
        }
        if (isValidElement(profileResponse)) {
            startHelp(profileResponse, storeID, languageKey, countryBaseFeatureGateResponse, orderId);
        }
    }

    handleReorderClick = debounce(
        (orderId, storeID, orderType) => {
            this.props.resetReOrderResponseAction();
            this.setState({
                reOrderButtonStatus: true
            });
            this.switchOrderTypeForReOrder(orderType);
            this.props.reOrderBasketNavigation(
                orderId,
                storeID,
                this.props.navigation,
                orderType,
                RE_ORDER_TRIGGER_SCREEN.VIEW_ORDER_SCREEN
            );
            this.props.setOrderIDAction(orderId);
        },
        300,
        { leading: true, trailing: false }
    );

    switchOrderTypeForReOrder(sending) {
        if (sending !== this.props.selectedOrderType) {
            if (sending === ORDER_TYPE.DELIVERY) {
                const { deliveryAddress, primaryAddress } = this.props;
                let address = getValidAddress(deliveryAddress, primaryAddress);
                if (isValidElement(address)) {
                    this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, address.postcode, address.id);
                    this.props.selectDeliveryAddressAction(address);
                }
            } else {
                this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
            }
        }
    }
}

const mapStateToProps = (state) => ({
    items: selectReceiptOrderItems(state),
    subTotal: selectReceiptSubTotal(state),
    serviceCharge: selectReceiptServiceCharge(state),
    vat: selectReceiptVAT(state),
    adminFee: selectReceiptAdminFee(state),
    onlineDiscount: selectReceiptOnlineDiscount(state),
    collectionDiscount: selectReceiptCollectionDiscount(state),
    couponSummary: selectReceiptCouponSummary(state),
    carryBag: selectReceiptCarryBag(state),
    redeemAmount: selectReceiptRedeemAmount(state),
    total: selectReceiptTotal(state),
    payment: selectPayment(state),
    phone: selectPhone(state),
    orderStatus: selectOrderStatus(state),
    orderInstructions: selectOrderInstructions(state),
    isPreOrder: isPreOrder(state),
    isTakeawayOpened: isTakeAwayOpenSelector(state),
    isPreOrderEnabled: isPreOrderAvailableSelector(state),
    isCollectionAvailable: isCollectionAvailableSelector(state),
    isDeliveryAvailable: isDeliveryAvailableSelector(state),
    deliveryCharge: selectReceiptDeliveryCharge(state),
    deliveryAddress: state.addressState.deliveryAddress,
    selectedOrderType: selectOrderType(state),
    viewOrderResponse: selectReceiptResponse(state),
    totalPaidByCard: selectTotalPaidByCard(state),
    totalPaidByWallet: selectTotalPaidByWallet(state),
    points_remaining: selectReceiptPointsRemaining(state),
    points_gained: selectReceiptPointsGain(state),
    pendingAndCompletedOrder: state.orderManagementState.pendingAndCompletedOrder,
    previousOrder: state.orderManagementState.previousOrder,
    primaryAddress: selectPrimaryAddressSelector(state),
    languageKey: selectLanguageKey(state),
    profileResponse: state.profileState.profileResponse,
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    timezone: selectTimeZone(state),
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    refundRequestedData: selectRefundRequested(state),
    refundStatus: selectRefundStatus(state),
    refundedMessage: state.orderManagementState?.viewOrderResponse?.refundedMessage,
    driverTips: state.orderManagementState?.viewOrderResponse?.cart_charge?.driver_tips,
    country_id: state.appState.storeConfigResponse?.country_id,
    countryList: state.landingState.countryList
});
const mapDispatchToProps = {
    viewOrderAction,
    resetReceiptResponse,
    resetReOrderResponseAction,
    disableReorderButtonAction,
    resetReOrderFlags,
    updateSelectedOrderType,
    selectDeliveryAddressAction,
    setOrderIDAction,
    reOrderBasketNavigation
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrder);
