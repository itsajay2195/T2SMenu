import React, { Fragment } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

//Common Widgets
import OrderTrackingPoint from './Components/OrderTrackingPoint';
import OrderTrackingStatus from './Components/OrderTrackingStatus';

// Constants and Strings, Styles
import { ORDER_TYPE } from '../../../../AppModules/BaseModule/BaseConstants';
import styles from './OrderTrackingStyle';

// Helper and Actions
import * as OrderTrackingHelper from './Utils/OrderTrackingHelper';
import { ORDER_STATUS_ENUM } from './Utils/OrderTrackingConfig';

/**
 * How to use this widget?
 * Step 1: Import this OrderTracking.js in your code
 * Step 2: Add widget Component in JSX and Sent below params as props
 * @param {currentStatus:number, orderType:string, displayMode:string} props
 * Sample Code:
 * import OrderTrackingWidget from 't2sbasemodule/UI/CustomUI/OrderTracking/OrderTracking';
 * JSX: <OrderTrackingWidget orderType={'delivery'} currentStatus={'2.5'} />
 */
const OrderTracking = (props) => {
    const { currentStatus, orderType, screenName, orderID, isPreOrder } = props;
    const currentStatusEnum = OrderTrackingHelper.getOrderStatusEnum(currentStatus);
    const displayProps = OrderTrackingHelper.getDisplayProps(currentStatusEnum, orderType, isPreOrder);
    return (
        <View accessilbe={false} style={styles.orderTrackingContainer}>
            <View accessible={false} style={styles.statusPointContainer}>
                {displayProps.map((item, index) => (
                    <Fragment key={index}>
                        <LottieView
                            style={styles.lottieAnimationStyle}
                            source={item.statusIcon}
                            autoPlay={item.stageNo <= currentStatusEnum && !item.isCompleted}
                            loop={!item.isCompleted && item.stageNo !== ORDER_STATUS_ENUM.PLACED}
                        />
                        <OrderTrackingPoint screenName={screenName} key={index} data={item} orderType={orderType} />
                    </Fragment>
                ))}
            </View>
            <View style={styles.statusTextContainer}>
                {displayProps.map((item, index) => (
                    <Fragment key={index}>
                        <OrderTrackingStatus orderID={orderID} screenName={screenName} key={index} data={item} />
                        {index < displayProps.length - 1 && <View style={styles.dummyView} />}
                    </Fragment>
                ))}
            </View>
        </View>
    );
};

OrderTracking.propType = {
    currentStatus: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired
};

OrderTracking.defaultProps = {
    orderType: ORDER_TYPE.DELIVERY
};

export default OrderTracking;
