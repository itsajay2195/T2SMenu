import React from 'react';

import styles from '../OrderTrackingStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { ORDER_STATUS_ENUM } from '../Utils/OrderTrackingConfig';
import { TRACKING_VIEW_ID } from '../Utils/OrderTrackingConstant';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';

const OrderTrackingPoint = (props) => {
    return [
        (props.orderType === ORDER_TYPE.DELIVERY && props.data.stageNo !== ORDER_STATUS_ENUM.DELIVERED) ||
        (props.orderType === ORDER_TYPE.COLLECTION && props.data.stageNo !== ORDER_STATUS_ENUM.READY) ||
        (props.orderType === ORDER_TYPE.WAITING && props.data.stageNo !== ORDER_STATUS_ENUM.READY) ? (
            <T2SView
                key={`Line` + props.data.stageNo}
                screenName={props.screenName}
                id={TRACKING_VIEW_ID.STATUS_POINT + props.data.stageKey}
                style={[styles.lineViewHorizontal, { backgroundColor: props.data.stageLinkColor }]}
            />
        ) : null
    ];
};

export default OrderTrackingPoint;
