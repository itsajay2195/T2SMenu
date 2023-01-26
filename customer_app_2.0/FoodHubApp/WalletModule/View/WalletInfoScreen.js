import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { connect } from 'react-redux';
import { getWalletDetailsAction } from '../Redux/WalletAction';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import WalletBannerWidget from './Components/WalletBannerWidget';
import { walletStyles } from './Style/WalletStyles';
import { SCREEN_NAME, VIEW_ID, WALLET_TYPE } from '../Utils/WalletConstants';
import { selectCurrencySymbol } from 't2sbasemodule/Utils/AppSelectors';
import { getTransactionName, getWalletFormattedDate } from '../Utils/WalletHelper';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import T2SPaginatedFlatList from 't2sbasemodule/UI/CommonUI/T2SPaginatedFlatList';
import { copyToClipboard, isValidElement, safeIntValue, safeStringValue } from 't2sbasemodule/Utils/helpers';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { VIEW_ORDER_SOURCE } from 'appmodules/OrderManagementModule/Utils/OrderManagementConstants';
import { getDeliveryTimeOrder, getTakeawayNameForOrder } from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';

let screenName = SCREEN_NAME.WALLET_SCREEN,
    timeout;
class WalletInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.handlePullToRefresh = this.handlePullToRefresh.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleCopyOrderID = this.handleCopyOrderID.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }
    state = {
        refreshing: false
    };
    componentDidMount() {
        this.didFocus = this.props.navigation.addListener('focus', () => {
            this.props.getWalletDetailsAction(1, true);
            Analytics.logScreen(ANALYTICS_SCREENS.WALLET_PAGE);
        });
    }
    componentWillUnmount() {
        if (isValidElement(this.didFocus)) {
            this.props.navigation.removeListener(this.didFocus);
        }
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }

    renderRecentTransactions() {
        const { walletTransactionList } = this.props;
        return (
            <View style={walletStyles.transactionsMainContainer}>
                {walletTransactionList.length > 0 ? this.renderTransactionFlatList() : this.renderNoTransactionsFound()}
            </View>
        );
    }
    renderNoTransactionsFound() {
        return (
            <View>
                <T2SText id={VIEW_ID.NO_TRANSACTION_TEXT} screenName={screenName} style={walletStyles.noTransactionsText}>
                    {LOCALIZATION_STRINGS.NO_TRANSACTIONS}
                </T2SText>
            </View>
        );
    }
    renderTransactionFlatList() {
        const { walletTransactionList } = this.props;
        return (
            <View>
                <T2SText id={VIEW_ID.RESENT_TRANSACTION_TEXT} screenName={screenName} style={walletStyles.transactionHeaderText}>
                    {LOCALIZATION_STRINGS.RECENT_TRANSACTION.toUpperCase()}
                </T2SText>
                <T2SPaginatedFlatList
                    id={VIEW_ID.WALLET_TRANSACTION_LIST}
                    screenName={screenName}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this.handlePullToRefresh}
                    onPageEnd={this.handleLoadMore}
                    useFlatList
                    keyExtractor={(item, index) => index}
                    data={walletTransactionList}
                    renderItem={this.renderTransactionsItem}
                />
            </View>
        );
    }
    renderTransactionsItem = ({ item }) => {
        const date = getWalletFormattedDate(item.date);
        const { currency } = this.props;
        const isDebit = item.type !== WALLET_TYPE.PAYMENT || item.type.includes('reverse');
        return (
            <T2STouchableOpacity
                screenName={SCREEN_NAME}
                id={VIEW_ID.WALLET_LIST_ITEM}
                activeOpacity={0.5}
                onPress={this.handleItemClick.bind(this, item)}
                onLongPress={this.handleCopyOrderID.bind(this, item)}>
                <View style={walletStyles.rowBackGroundViewContainer}>
                    <View style={walletStyles.transactionNameView}>
                        <T2SText id={VIEW_ID.WALLET_TYPE_TEXT} screenName={screenName} style={walletStyles.transactionNameText}>
                            {getTransactionName(item)}
                        </T2SText>
                        <T2SText id={VIEW_ID.WALLET_DATE_TEXT} screenName={screenName} style={walletStyles.transactionTimeText}>
                            {date}
                        </T2SText>
                    </View>
                    <View style={walletStyles.transactionAmountView}>
                        <T2SText
                            id={VIEW_ID.WALLET_AMOUNT_TEXT}
                            screenName={screenName}
                            style={isDebit ? walletStyles.amountTextAdded : walletStyles.amountText}>
                            {`${isDebit ? '' : LOCALIZATION_STRINGS.MINUS} ${currency}${item.amount}`}
                        </T2SText>
                    </View>
                </View>
            </T2STouchableOpacity>
        );
    };

    checkIfClickable(item) {
        return item.type !== WALLET_TYPE.WALLET_TOPUP_REFERRER && item.type !== WALLET_TYPE.WALLET_REVERSE_REFERRER;
    }

    handleItemClick(item) {
        if (this.checkIfClickable(item)) {
            const { order_id } = item;
            const { pendingOrders, previousOrders } = this.props;
            Analytics.logEvent(ANALYTICS_SCREENS.WALLET_PAGE, ANALYTICS_EVENTS.TRANSACTION_DETAILS_CLICKED);
            if (isValidElement(order_id) && safeIntValue(order_id) > 0) {
                handleNavigation(SCREEN_OPTIONS.VIEW_ORDER.route_name, {
                    orderId: order_id,
                    source: VIEW_ORDER_SOURCE.WALLET,
                    name: getTakeawayNameForOrder([...pendingOrders, ...previousOrders], order_id),
                    delivery_time: getDeliveryTimeOrder([...pendingOrders, ...previousOrders], order_id)
                });
            }
        }
    }
    handleCopyOrderID(item) {
        if (this.checkIfClickable(item)) {
            const { order_id } = item;
            if (isValidElement(order_id) && safeIntValue(order_id) > 0) {
                copyToClipboard(safeStringValue(order_id));
            }
        }
    }
    onRefresh() {
        this.setState({ refreshing: true }, () => {
            this.props.getWalletDetailsAction(1, true);
            Analytics.logEvent(ANALYTICS_SCREENS.WALLET_PAGE, ANALYTICS_EVENTS.PAGE_REFRESHED);
        });
        timeout = setTimeout(() => this.setState({ refreshing: false }), 2000);
    }
    render() {
        return (
            <BaseComponent showHeader={true} showCommonActions={false} title={LOCALIZATION_STRINGS.WALLET}>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                    <WalletBannerWidget navigation={this.props.navigation} />
                    {this.renderRecentTransactions()}
                </ScrollView>
            </BaseComponent>
        );
    }

    handlePullToRefresh() {
        this.props.getWalletDetailsAction(1, true);
    }

    handleLoadMore() {
        let { current_page, has_more } = this.props;
        if (has_more) {
            const nextPage = safeIntValue(current_page) + 1;
            this.props.getWalletDetailsAction(nextPage);
        }
    }
}

const mapStateToProps = (state) => ({
    current_page: state.walletState.current_page,
    has_more: state.walletState.has_more,
    walletTransactionList: state.walletState.walletTransactionList,
    currency: selectCurrencySymbol(state),
    previousOrders: state.orderManagementState.previousOrder,
    pendingOrders: state.orderManagementState.pendingOrder
});
const mapDispatchToProps = {
    getWalletDetailsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletInfoScreen);
