import React from 'react';
import TimerComponent from 't2sbasemodule/UI/CustomUI/TimerComponent/TimerComponent';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import timerComponentStyle from 't2sbasemodule/UI/CustomUI/TimerComponent/TimerComponentStyle';
import { VIEW_ID } from '../../Utils/HomeConstants';
import { DEFAULT_TIME } from 'appmodules/OrderManagementModule/Utils/OrderManagementConstants';

const PendingOrderTimerComponent = ({ isDeliveredOrder, screenName, id, status, pre_order_time, delivery_time, time_zone }) => {
    return isDeliveredOrder ? (
        <TimerComponent
            id={id}
            status={status}
            pre_order_time={pre_order_time}
            delivery_time={delivery_time}
            time_zone={time_zone}
            screenName={screenName}
            showTimerForPreorder={false}
        />
    ) : (
        <T2SText style={timerComponentStyle.timerTextStyle} screenName={screenName} id={VIEW_ID.DEFAULT_TIME + '_' + id}>
            {' '}
            {DEFAULT_TIME}
        </T2SText>
    );
};

export default React.memo(PendingOrderTimerComponent);
