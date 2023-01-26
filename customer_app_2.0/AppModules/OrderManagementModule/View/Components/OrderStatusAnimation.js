import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import IndeterminateProgress from './IndeterminateProgress';
import { Colors } from 't2sbasemodule/Themes';
import { T2SIcon, T2SText } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import LottieView from 'lottie-react-native';
import { ORDER_STATUS } from 'appmodules/BaseModule/BaseConstants';
import AnimationTimerComponent, { animationData } from './AnimationTimerComponent';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import styles from '../Styles/OrderStatusAnimationStyle';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { getMinutesAndSeconds } from 't2sbasemodule/UI/CustomUI/OrderTracking/Utils/OrderTrackingHelper';
import Animated, { Transition, Transitioning, Value, Easing, timing } from 'react-native-reanimated';
import { VIEW_ID } from '../../Utils/OrderManagementConstants';

const OrderStatusAnimation = ({ status, closeAnimation, orderPlacedTime, timeZone, languageKey }) => {
    const [details, setDetails] = useState(null);
    const [timer, setTimer] = useState(0);
    const [successView, setSuccessView] = useState(false);
    const [orderStatus, setOrderStatus] = useState(status);
    const ref = useRef();
    const opacity = new Value(0);
    const config = {
        duration: 700,
        toValue: 1,
        easing: Easing.inOut(Easing.ease)
    };
    const anim = timing(opacity, config);
    const prevStatus = usePrevious(orderStatus);

    const transition = (
        <Transition.Together>
            <Transition.In type="slide-top" />
            <Transition.Change interpolation="easeInOut" />
        </Transition.Together>
    );

    useEffect(() => {
        setOrderStatus(status);
        const { minutes, seconds } = getMinutesAndSeconds(timeZone, orderPlacedTime);
        //order takes time to accept, more than 1 minute,
        if (status === ORDER_STATUS.PLACED && minutes >= 1) {
            ref.current.animateNextTransition();
            anim.start();
            setDetails(animationData[animationData.length - 1]);
            // start multiple animations if seconds is less than 60
        } else if (status === ORDER_STATUS.PLACED && minutes === 0) {
            if (seconds <= 60) {
                anim.start();
                setTimer(seconds);
            }
            // show order accepted animation
        } else if (status === ORDER_STATUS.ACCEPTED && prevStatus === '1') {
            setSuccessView(true);
            //show order tracking screen
        } else if ((Number(status) > 1 && prevStatus !== '1') || (Number(status) >= 3 && Number(status) <= 6)) {
            closeAnimation();
        }
    }, [closeAnimation, orderPlacedTime, prevStatus, orderStatus, status, timeZone, anim]);

    const onAnimationFinish = () => {
        closeAnimation();
    };
    const updateImageAndText = (info) => {
        if (isValidElement(info)) {
            ref.current.animateNextTransition();
            anim.start();
            setDetails(info);
        }
    };
    return (
        <View>
            {successView ? (
                <View>
                    <LottieView
                        onAnimationFinish={onAnimationFinish}
                        autoPlay
                        loop={false}
                        style={styles.lottieAnimationStyle}
                        source={require('../../../../T2SBaseModule/UI/CustomUI/OrderTracking/Utils/OrderTrackingAnimation/confetti_animation.json')}
                    />
                    <View style={styles.successContainer}>
                        <T2SIcon icon={FONT_ICON.NOTIFY_SUCCESS} color={Colors.primaryColor} size={55} style={styles.leftIconStyle} />
                        <T2SText style={styles.successText}>{LOCALIZATION_STRINGS.ORDER_ACCEPTED_SUCCESS}</T2SText>
                    </View>
                </View>
            ) : (
                <Transitioning.View ref={ref} transition={transition}>
                    <IndeterminateProgress />
                    {isValidElement(details) && (
                        <Animated.View style={[styles.wrapper, { opacity: opacity }]}>
                            <T2SText id={VIEW_ID.ORDER_STATUS_DESCRIPTION} style={styles.text}>
                                {details.text}
                            </T2SText>
                            <View style={[styles.iconContainer]}>
                                <T2SIcon icon={details.image} color={Colors.black} size={65} style={styles.leftIconStyle} />
                            </View>
                        </Animated.View>
                    )}
                    <AnimationTimerComponent seconds={timer} updateData={updateImageAndText} languageKey={languageKey} />
                </Transitioning.View>
            )}
        </View>
    );
};
//custom hook to compare hte previous value of props
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}
export default React.memo(OrderStatusAnimation);
