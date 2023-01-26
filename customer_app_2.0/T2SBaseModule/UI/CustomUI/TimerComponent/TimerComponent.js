import React, { Component } from 'react';
import { View } from 'react-native';
import { isValidElement } from '../../../Utils/helpers';
import { CountDownTimerHelper, getFormattedDeliveryTimeInMinutes } from './Utils/TimerComponentHelper';
import timerComponentStyle from './TimerComponentStyle';
import T2SText from '../../CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/Constants';
let waitingTimer;
class TimerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { duration: null };
    }

    componentDidMount() {
        this.orderTimeDifference();
    }
    componentDidUpdate(prevProps) {
        if (
            isValidElement(prevProps) &&
            isValidElement(prevProps.delivery_time) &&
            isValidElement(this.props) &&
            isValidElement(this.props.delivery_time)
        ) {
            if (prevProps.delivery_time !== this.props.delivery_time) {
                if (waitingTimer) clearInterval(waitingTimer);
                waitingTimer = null;
                this.orderTimeDifference();
            }
        }
    }

    componentWillUnmount() {
        if (waitingTimer) {
            clearInterval(waitingTimer);
        }
    }

    orderTimeDifference() {
        const { delivery_time, time_zone, pre_order_time, status } = this.props;
        if (isValidElement(delivery_time) && isValidElement(time_zone)) {
            let dt = new Date();
            dt.setSeconds(dt.getSeconds() + getFormattedDeliveryTimeInMinutes(time_zone, delivery_time, true));
            let countDownDate = dt.getTime();
            let durationTime = getFormattedDeliveryTimeInMinutes(time_zone, delivery_time, true);
            this.setState({
                duration: CountDownTimerHelper(durationTime, countDownDate, status, pre_order_time, this.props.showTimerForPreorder)
            });
            waitingTimer = setInterval(() => {
                this.setState({
                    duration: CountDownTimerHelper(durationTime, countDownDate, status, pre_order_time, this.props.showTimerForPreorder)
                });
            }, 1000);
        }
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return nextState?.duration !== this.state?.duration || nextProps?.delivery_time !== this.props.delivery_time;
    }

    render() {
        return <View>{this.renderCountdownTimer()}</View>;
    }

    renderCountdownTimer() {
        const { duration } = this.state;
        let { screenName, textStyle, id } = this.props;
        return (
            <T2SText id={VIEW_ID.TIMER_TEXT + '_' + id} screenName={screenName} style={[timerComponentStyle.timerTextStyle, textStyle]}>
                {duration}
            </T2SText>
        );
    }
}

export default TimerComponent;
