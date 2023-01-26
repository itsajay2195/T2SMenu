import React, { useCallback } from 'react';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { VIEW_ID } from '../../Utils/HomeConstants';
import { View } from 'react-native';
import styles from '../../Styles/HomeStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getOrderTrackingOrdertype, getTakeawayName } from 't2sbasemodule/Utils/helpers';
import { getCurrencyFromBasketResponse } from 'appmodules/BaseModule/GlobalAppHelper';
import OrderTrackingWidget from 't2sbasemodule/UI/CustomUI/OrderTracking/OrderTracking';
import { ORDER_STATUS } from 'appmodules/BaseModule/BaseConstants';
import { isPreOrderOrder } from 't2sbasemodule/UI/CustomUI/TimerComponent/Utils/TimerComponentHelper';
import SizedBox from 't2sbasemodule/UI/CustomUI/SizedBox';
import PendingOrderTimerComponent from './PendingOrderTimerComponent';

const RecentPendingOrderComponent = ({
    screenName,
    name,
    id,
    currencyId,
    currency,
    total,
    sending,
    status,
    pre_order_time,
    delivery_time,
    time_zone,
    onPendingOrderClicked
}) => {
    const handleOnPress = useCallback(() => {
        onPendingOrderClicked(id);
    }, [id, onPendingOrderClicked]);
    return (
        <T2STouchableOpacity accessible={false} screenName={screenName} id={VIEW_ID.RECENT_ORDER_VIEW} onPress={handleOnPress}>
            <View style={[styles.baseMarginViewStyle, styles.marginTop]}>
                <View style={styles.storeNameAndTimerViewStyle}>
                    <T2SText style={styles.storeNameTextStyle} screenName={screenName} id={VIEW_ID.RECENT_ORDER_STORE_NAME + '_' + id}>
                        {getTakeawayName(name)}
                    </T2SText>
                    {/*//here we are using T2STouchableOpacity for automation id*/}
                    <T2STouchableOpacity
                        activeOpacity={1}
                        id={VIEW_ID.ORDER_TIMER_TEXT + '_' + id}
                        screenName={screenName}
                        style={styles.timerViewStyle}>
                        <PendingOrderTimerComponent
                            isDeliveredOrder={status < ORDER_STATUS.DELIVERED}
                            screenName={screenName}
                            id={id}
                            delivery_time={delivery_time}
                            time_zone={time_zone}
                        />
                    </T2STouchableOpacity>
                </View>
                <View style={styles.itemTotalViewStyle}>
                    <T2SText style={styles.itemTotalTextStyle} screenName={screenName} id={VIEW_ID.RECENT_ORDER_TOTAL_PRICE + '_' + id}>
                        {getCurrencyFromBasketResponse(currencyId, currency)}
                        {total}
                    </T2SText>
                </View>
                <OrderTrackingWidget
                    screenName={screenName}
                    orderType={getOrderTrackingOrdertype(sending)}
                    isPreOrder={isPreOrderOrder(pre_order_time)}
                    orderID={id}
                    currentStatus={status}
                />
            </View>
            <SizedBox height={5} style={styles.sizeBoxStyle} />
        </T2STouchableOpacity>
    );
};

export default React.memo(RecentPendingOrderComponent);
