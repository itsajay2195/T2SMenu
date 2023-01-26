import React, { Component } from 'react';
import { SectionList, Text, View } from 'react-native';
import BaseComponent from '../../BaseModule/BaseComponent';
import { batch, connect } from 'react-redux';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isNonCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { styles } from './Styles/OrderHistoryScreenStyle';
import Colors from 't2sbasemodule/Themes/Colors';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { makeGetTotalSavingsAction } from '../../TotalSavingsModule/Redux/TotalSavingsAction';
import { SCREEN_NAME, VIEW_ID } from '../Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import {
    disableReorderButtonAction,
    makeGetOrderListAction,
    resetReOrderFlags,
    updateOrderDetailsData
} from '../Redux/OrderManagementAction';
import { selectOrderHistoryList } from '../Redux/OrderManagementSelectors';
import OrderHistoryFoodHubItem from './Components/OrderHistoryFoodHubItem';
import OrderHistoryCustomerItem from './Components/OrderHistoryCustomerItem';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import OrderHistoryTotalSavings from './Components/OrderHistoryTotalSavings';

class OrderHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.onRefreshHandle = this.onRefreshHandle.bind(this);
        this.state = {
            isFetching: false
        };
    }

    componentDidMount() {
        this.didFocus = this.props.navigation.addListener('focus', () => {
            batch(() => {
                this.props.makeGetOrderListAction();
                this.props.makeGetTotalSavingsAction();
            });
            Analytics.logScreen(ANALYTICS_SCREENS.ORDER_HISTORY);
            this.setState({ change: true });
        });
    }

    componentWillUnmount() {
        if (isValidElement(this.didFocus)) {
            this.props.navigation.removeListener(this.didFocus);
            this.setState({ change: false });
        }
        this.props.resetReOrderFlags();
        this.props.disableReorderButtonAction(false);
    }

    render() {
        const { orderHistory } = this.props;
        return (
            <BaseComponent
                showElevation={true}
                showHeader={true}
                title={LOCALIZATION_STRINGS.ORDER_HISTORY}
                navigation={this.props.navigation}>
                <View style={styles.mainContainer}>
                    <OrderHistoryTotalSavings />
                    {isValidElement(orderHistory) && orderHistory.length > 0
                        ? this.renderSelectionList(orderHistory)
                        : this.renderErrorMessage()}
                </View>
            </BaseComponent>
        );
    }

    onRefreshHandle() {
        this.setState({ isFetching: true }, () => {
            this.props.makeGetOrderListAction();
        });
        this.setState({ isFetching: false });
    }

    renderSelectionList(orderHistory) {
        return (
            <SectionList
                id={VIEW_ID.ORDERS_LIST_VIEW}
                showsVerticalScrollIndicator={false}
                sections={orderHistory}
                refreshing={this.state.isFetching}
                onRefresh={this.onRefreshHandle}
                renderSectionHeader={this.renderSectionHeader}
                renderItem={({ item, index, section }) => isValidElement(item) && this.renderOrderListItem(item, index, section)}
                keyExtractor={(item, index) => item + index}
            />
        );
    }

    renderOrderListItem(item, index, section) {
        let showDivider = false;
        if (isValidElement(section) && isValidElement(section.data)) {
            showDivider = index !== section.data.length - 1;
        }
        if (isNonCustomerApp()) {
            return <OrderHistoryFoodHubItem navigation={this.props.navigation} orderData={item} showDivider={showDivider} />;
        } else {
            return <OrderHistoryCustomerItem navigation={this.props.navigation} orderData={item} showDivider={showDivider} />;
        }
    }

    renderErrorMessage() {
        return (
            isValidElement(this.props.orderHistory) &&
            this.props.orderHistory.length === 0 && (
                <View style={styles.messageContainer}>
                    <View style={styles.messageView}>
                        <T2SText
                            style={styles.errorMessageText}
                            id={VIEW_ID.EMPTY_ORDER_ERROR_MESSAGE_TEXT}
                            screenName={SCREEN_NAME.ORDER_HISTORY}>
                            {LOCALIZATION_STRINGS.EMPTY_ORDER_ERROR_MESSAGE}
                        </T2SText>
                        <T2SText
                            style={styles.errorMessageText}
                            id={VIEW_ID.ORDER_ERROR_MESSAGE_TEXT}
                            screenName={SCREEN_NAME.ORDER_HISTORY}>
                            {LOCALIZATION_STRINGS.ORDER_ERROR_MESSAGE}
                        </T2SText>
                    </View>
                </View>
            )
        );
    }

    renderSectionHeader({ section }) {
        return (
            <Text
                style={[
                    styles.sectionHeaderStyle,
                    section.title === LOCALIZATION_STRINGS.PENDING_ORDERS.toUpperCase()
                        ? { backgroundColor: Colors.suluGreen }
                        : { backgroundColor: Colors.dividerGrey }
                ]}>
                {section.title}
            </Text>
        );
    }
}

const mapStateToProps = (state) => ({
    orderHistory: selectOrderHistoryList(state)
});

const mapDispatchToProps = {
    makeGetOrderListAction,
    makeGetTotalSavingsAction,
    updateOrderDetailsData,
    disableReorderButtonAction,
    resetReOrderFlags
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryScreen);
