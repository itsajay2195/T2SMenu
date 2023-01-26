import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, View } from 'react-native';
import { style } from './style';
import Colors from '../../../Themes/Colors';
import { setTestId } from '../../../Utils/AutomationHelper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { VIEW_ID } from './constants';
import { isValidElement } from '../../../Utils/helpers';

export default class QuickCheckoutSwipeButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            left: new Animated.Value(0),
            height: 0,
            closeTime: new Date(),
            positionX: 0,
            maxLeft: 0
        };

        this.pan = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderStart: this.onPanResponderStart,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onShouldBlockNativeResponder: () => true
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (isValidElement(props.closeTime) && state.closeTime !== props.closeTime) {
            props.onFailed();
            return {
                left: new Animated.Value(0),
                closeTime: props.closeTime,
                positionX: 0
            };
        }
    }

    UNSAFE_componentWillMount() {
        this.pan = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderStart: this.onPanResponderStart,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onShouldBlockNativeResponder: () => true
        });
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null {
        this.pan = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderStart: this.onPanResponderStart,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onShouldBlockNativeResponder: () => true
        });
    }

    onPanResponderStart = () => {
        if (this.props.disabled) {
            return true;
        } else {
            this.props.onSwipeStart();
        }
    };
    onPanResponderMove = (event, gestureState) => {
        const { left, positionX, maxLeft } = this.state;
        const { disabled } = this.props;
        const { dx } = gestureState;
        const newX = positionX + dx;
        if (newX > 0 && newX < maxLeft && !disabled) {
            left.setValue(newX);
        }
        this.props.onSwipeMove();
    };

    onPanResponderRelease = (event, gestureState) => {
        const { maxLeft, left } = this.state;
        const { disabled, onSuccess, onFailed } = this.props;
        if (!disabled) {
            if (gestureState.dx > 0) {
                Animated.timing(left, {
                    toValue: maxLeft,
                    duration: 1200,
                    useNativeDriver: false
                }).start(() => {
                    if (left._value >= maxLeft) {
                        onSuccess();
                        this.setState({ positionX: maxLeft });
                    }
                });
            } else {
                Animated.timing(left, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: false
                }).start(() => {
                    onFailed();
                    this.setState({ positionX: 0 });
                });
            }
        }
    };

    onLayout = (event) => {
        const { height, width, x } = event.nativeEvent.layout;
        this.setState({ height, positionX: x, maxLeft: width - height });
    };

    // this method is used to turn on the swipe button via ref
    switchOn() {
        const { left, maxLeft } = this.state;
        Animated.timing(left, {
            toValue: maxLeft,
            duration: 100,
            useNativeDriver: false
        }).start();
        this.props.onSuccess();
        this.setState({ positionX: maxLeft });
    }

    // this method is used to turn off the swipe button via ref
    switchOff() {
        const { left } = this.state;
        Animated.timing(left, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start();
        this.props.onFailed();
        this.setState({ positionX: 0 });
    }

    render() {
        const { left, height, maxLeft } = this.state;
        const {
            style: styles,
            successContainerStyle,
            thumbContainerStyle,
            visibleTextStyle,
            successTextStyle,
            shape,
            height: buttonHeight,
            visibleText,
            successText,
            thumb: Thumb,
            fadevarient,
            disabled,
            disabledColor,
            screenName,
            textAnimationVelocity
        } = this.props;
        const fontSize = (height * 3.33) / 10;
        const borderRadius = shape === 'round' ? height / 2 : shape === 'rounded-edge' ? 5 : 0;
        const width = left.interpolate({
            inputRange: [0, maxLeft],
            outputRange: [height, maxLeft + height]
        });
        const visibleTextLeft = left.interpolate({
            inputRange: [0, maxLeft],
            outputRange: [0, maxLeft / textAnimationVelocity]
        });
        const successTextLeft = left.interpolate({
            inputRange: [0, maxLeft],
            outputRange: [-maxLeft / textAnimationVelocity, 0]
        });
        const visibleTextOpacity = left.interpolate({
            inputRange: [0, (maxLeft * fadevarient) / 100, maxLeft],
            outputRange: [1, 0, 0]
        });
        const successTextOpacity = left.interpolate({
            inputRange: [0, (maxLeft * (100 - fadevarient)) / 100, maxLeft],
            outputRange: [0, 0, 1]
        });
        const panStyle = {
            position: 'absolute',
            width: '15%',
            height: height,
            left
        };
        const successPadStyle = {
            width,
            height
        };
        const Disable = () => {
            if (disabled) {
                return (
                    <T2SView
                        id={VIEW_ID.DISABLED}
                        screenName={screenName}
                        style={{
                            backgroundColor: disabledColor,
                            ...style.disabledOverlay
                        }}
                    />
                );
            }
            return null;
        };
        return (
            <View
                style={{
                    borderRadius,
                    height: buttonHeight,
                    ...style.container,
                    ...styles
                }}>
                <Animated.View style={style.flex} onLayout={this.onLayout} {...this.pan.panHandlers}>
                    {/* text before success */}
                    <Animated.Text
                        style={{
                            fontSize,
                            opacity: visibleTextOpacity,
                            width: maxLeft + height,
                            left: visibleTextLeft,
                            ...style.visibleText,
                            ...visibleTextStyle
                        }}
                        {...setTestId(screenName, VIEW_ID.VISIBLE_TEXT)}>
                        {visibleText}
                    </Animated.Text>
                    {/* success view */}
                    <Animated.View
                        style={{
                            borderRadius,
                            ...style.successContainerStyle,
                            ...successContainerStyle,
                            ...successPadStyle
                        }}>
                        {/* success text */}
                        <Animated.Text
                            style={{
                                fontSize,
                                opacity: successTextOpacity,
                                width: maxLeft + height,
                                left: successTextLeft,
                                ...style.visibleText,
                                ...successTextStyle
                            }}
                            {...setTestId(screenName, VIEW_ID.SUCCESS_TEXT)}>
                            {successText}
                        </Animated.Text>
                    </Animated.View>
                    {/* thumb view */}
                    <Animated.View
                        style={{
                            ...style.thumbContainerStyle,
                            ...thumbContainerStyle,
                            ...panStyle
                        }}>
                        <Thumb />
                    </Animated.View>
                </Animated.View>
                <Disable />
            </View>
        );
    }
}

const empty = () => {};

QuickCheckoutSwipeButton.defaultProps = {
    style: {},
    successContainerStyle: {},
    thumbContainerStyle: {},
    visibleTextStyle: {},
    successTextStyle: {},
    shape: 'square',
    height: 50,
    disabled: false,
    disabledColor: Colors.grey + '44',
    threshold: 50,
    fadevarient: 50,
    textAnimationVelocity: 4,
    visibleText: '',
    successText: '',
    thumb: View,
    onSwipeStart: empty,
    onSuccess: empty,
    onFailed: empty
};

QuickCheckoutSwipeButton.propTypes = {
    style: PropTypes.object,
    successContainerStyle: PropTypes.object,
    thumbContainerStyle: PropTypes.object,
    visibleTextStyle: PropTypes.object,
    successTextStyle: PropTypes.object,
    shape: PropTypes.oneOf(['square', 'rounded-edge', 'round']),
    height: PropTypes.number,
    disabled: PropTypes.bool,
    disabledColor: PropTypes.string,
    threshold: PropTypes.number,
    fadevarient: PropTypes.number,
    visibleText: PropTypes.string,
    successText: PropTypes.string,
    thumb: PropTypes.any,
    onSwipeStart: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailed: PropTypes.func,
    screenName: PropTypes.string.isRequired,
    logEvent: PropTypes.func
};
