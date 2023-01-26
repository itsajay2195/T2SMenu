import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
// Common Widget
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import CurrentOrderLoaders from 'appmodules/HomeModule/View/SkeletonLoaders/CurrentOrderLoaders';
// Constants and Strings and Styles
import { VIEW_ID } from '../../Utils/HomeConstants';
import styles from '../../Styles/HomeStyles';
import Colors from 't2sbasemodule/Themes/Colors';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
// Actions and Helpers
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import RecentPendingOrderComponent from '../MicroComponents/RecentPendingOrderComponent';
import RecentOrderListComponent from '../MicroComponents/RecentOrderListComponent';
import { getTakeawayImage, renderSummaryItems } from '../../Utils/Helper';
import { selectCurrencyFromS3Config } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';

class RecentOrdersComponent extends Component {
    constructor(props) {
        super(props);
        this.handleReorderClickedAction = this.handleReorderClickedAction.bind(this);
        this.handlePendingOrderClickedAction = this.handlePendingOrderClickedAction.bind(this);
    }

    render() {
        return (
            <View>
                {this.renderRecentPendingComponent()}
                {this.renderRecentComponent()}
            </View>
        );
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return nextProps?.orderData?.data !== this.props.orderData?.data || nextProps?.pendingOrder !== this.props?.pendingOrder;
    }
    renderRecentPendingComponent() {
        const { pendingOrder, screenName } = this.props;
        if (isValidElement(pendingOrder)) {
            return (
                <T2SView style={{ backgroundColor: Colors.grey }}>
                    <FlatList
                        data={pendingOrder}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderRecentPendingOrderComponent}
                    />
                </T2SView>
            );
        } else {
            return (
                <T2SView style={styles.orderStatusContainer} screenName={screenName} id={VIEW_ID.ORDER_STATUS_CONTAINER}>
                    <CurrentOrderLoaders />
                </T2SView>
            );
        }
    }

    renderRecentComponent() {
        const { orderData, screenName } = this.props;
        if (isValidElement(orderData) && isValidElement(orderData.data)) {
            return <FlatList data={orderData.data} keyExtractor={(item) => item.id.toString()} renderItem={this.renderRecentOrder} />;
        } else {
            return (
                <T2SView style={styles.orderStatusContainer} screenName={screenName} id={VIEW_ID.ORDER_STATUS_CONTAINER}>
                    <CurrentOrderLoaders />
                </T2SView>
            );
        }
    }
    renderRecentPendingOrderComponent = ({ item }) => {
        const { screenName, currency } = this.props;
        return (
            <RecentPendingOrderComponent
                screenName={screenName}
                name={item?.store?.name}
                id={item?.id}
                currency={currency}
                total={item?.total}
                sending={item?.sending}
                status={item?.status}
                pre_order_time={item?.pre_order_time}
                delivery_time={item?.delivery_time}
                time_zone={item?.time_zone}
                currencyId={item?.store?.currency}
                onPendingOrderClicked={this.handlePendingOrderClickedAction}
            />
        );
    };

    renderRecentOrder = ({ item }) => {
        const { isSpanish, screenName, currency } = this.props;
        return (
            <RecentOrderListComponent
                screenName={screenName}
                name={item?.store?.name}
                id={item?.id}
                order_placed_on={item?.order_placed_on}
                timeZone={item?.time_zone}
                sending={item?.sending}
                isSpanish={isSpanish}
                currency={currency}
                total={item?.total}
                reorderText={LOCALIZATION_STRINGS.RE_ORDER}
                status={item?.status}
                currencyId={item?.store?.currency}
                summaryItems={renderSummaryItems(item?.summary)}
                sendingText={
                    item?.sending === ORDER_TYPE.DELIVERY || item?.sending === 'to'
                        ? LOCALIZATION_STRINGS.DELIVERY
                        : LOCALIZATION_STRINGS.COLLECTION
                }
                imageURL={getTakeawayImage(item)}
                onReOrderClicked={this.handleReorderClickedAction}
            />
        );
    };

    handleReorderClickedAction(id) {
        const { orderData } = this.props;
        let reOrderItem = orderData?.data.find((item) => item.id === id);
        this.props.onReOrderClicked(reOrderItem);
    }

    handlePendingOrderClickedAction(id) {
        const { pendingOrder } = this.props;
        let pendingOrderItem = pendingOrder.find((item) => item.id === id);
        this.props.onPendingOrderClicked(pendingOrderItem);
    }
}

RecentOrdersComponent.propType = {
    orderData: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired
};
const mapStateToProps = (state) => ({
    currency: selectCurrencyFromS3Config(state)
});

export default connect(mapStateToProps, null)(RecentOrdersComponent);
