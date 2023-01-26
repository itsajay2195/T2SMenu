import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, VIEW_ID } from '../Utils/HomeConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { CHECK_ORDER_TYPE, ORDER_STATUS, ORDER_TYPE } from '../../BaseModule/BaseConstants';
import OrderTrackingWidget from 't2sbasemodule/UI/CustomUI/OrderTracking/OrderTracking';
import styles from './Styles/HomeStyle';
import Colors from 't2sbasemodule/Themes/Colors';
import CurrentOrderLoaders from './SkeletonLoaders/CurrentOrderLoaders';
import TimerComponent from 't2sbasemodule/UI/CustomUI/TimerComponent/TimerComponent';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { DEFAULT_TIME } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import timerComponentStyle from 't2sbasemodule/UI/CustomUI/TimerComponent/TimerComponentStyle';
import { isPreOrderOrder } from '../../../T2SBaseModule/UI/CustomUI/TimerComponent/Utils/TimerComponentHelper';

class CurrentOrderStatusWidget extends Component {
    render() {
        const { currency, orderType, status, orderData, screenName, title, onPress } = this.props;
        if (isValidElement(orderData)) {
            return (
                <View style={styles.orderStatusParentContainer}>
                    <T2STouchableOpacity
                        accessible={false}
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        id={VIEW_ID.ORDER_STATUS_VIEW}
                        onPress={onPress}>
                        <View style={styles.orderStatusContainer}>
                            <View style={styles.orderStatusTitleContainer}>
                                <T2SText style={styles.orderStatusTitleTextStyle} screenName={screenName} id={VIEW_ID.ORDER_STATUS_TITLE}>
                                    {title}
                                </T2SText>
                                <View style={styles.orderStatusTimeContainer}>
                                    <T2SIcon
                                        name={FONT_ICON.CLOCK}
                                        size={25}
                                        style={styles.timerIconStyle}
                                        screenName={screenName}
                                        id={VIEW_ID.DASHBOARD_TIMER_ICON}
                                    />
                                    {this.renderTimer(orderData)}
                                </View>
                            </View>
                            <View style={styles.deliveryTitleContainer}>
                                <View style={styles.orderStatusTimeContainer}>
                                    {orderType === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION ? (
                                        <T2SIcon name={FONT_ICON.COLLECTION} size={30} color={Colors.secondaryTextColor} />
                                    ) : (
                                        <T2SIcon name={FONT_ICON.DELIVERY} color={Colors.secondaryTextColor} />
                                    )}
                                    <T2SText style={styles.deliveryTextColor} screenName={screenName} id={VIEW_ID.ORDER_STATUS_DELIVERY}>
                                        {orderType === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION
                                            ? LOCALIZATION_STRINGS.COLLECTION
                                            : LOCALIZATION_STRINGS.DELIVERY}
                                    </T2SText>
                                </View>
                                <T2SText
                                    style={styles.deliveryPriceTextColor}
                                    screenName={screenName}
                                    id={VIEW_ID.ORDER_STATUS_DELIVERY_PRICE}>
                                    {currency}
                                </T2SText>
                            </View>

                            <OrderTrackingWidget
                                screenName={SCREEN_NAME.HOME_SCREEN}
                                orderType={
                                    orderType === CHECK_ORDER_TYPE.ORDER_TYPE_COLLECTION ? ORDER_TYPE.COLLECTION : ORDER_TYPE.DELIVERY
                                }
                                isPreOrder={isPreOrderOrder(orderData.pre_order_time)}
                                currentStatus={status}
                            />
                        </View>
                    </T2STouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.orderStatusParentContainer}>
                    <CurrentOrderLoaders />
                </View>
            );
        }
    }

    renderTimer(orderData) {
        const { screenName } = this.props;
        return orderData.status < ORDER_STATUS.DELIVERED ? (
            isValidElement(orderData) && isValidElement(orderData.delivery_time) && isValidElement(orderData.time_zone) && (
                <TimerComponent
                    id={orderData?.id}
                    status={orderData?.status}
                    pre_order_time={orderData?.pre_order_time}
                    delivery_time={orderData.delivery_time}
                    time_zone={orderData.time_zone}
                    screenName={screenName}
                    showTimerForPreorder={false}
                />
            )
        ) : (
            <Text style={timerComponentStyle.timerTextStyle}> {DEFAULT_TIME}</Text>
        );
    }
}

CurrentOrderStatusWidget.propType = {
    onPress: PropTypes.func.isRequired,
    orderType: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    orderData: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired
};

export default CurrentOrderStatusWidget;
