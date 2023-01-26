import React, { Component } from 'react';
import { Animated, Easing, ScrollView, Text, View } from 'react-native';
import propTypes from 'prop-types';
import { styles } from './Style/HeroNavigationStyle';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { VIEW_ID } from './HeroNavigationConstants';
import * as Analytics from '../../../../AppModules/AnalyticsModule/Analytics';
import { isValidElement } from '../../../Utils/helpers';
import T2SText from '../../CommonUI/T2SText';
import moment from 'moment-timezone';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { DATE_FORMAT } from '../../../Utils/DateUtil';
import Colors from '../../../Themes/Colors';
import { connect } from 'react-redux';
import { ADDRESS_FORM_TYPE } from 'appmodules/AddressModule/Utils/AddressConstants';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { getRecentOrderedDate } from '../../../../FoodHubApp/HomeModule/Utils/Helper';
import { CONSTANTS } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { selectTimeZone } from '../../../Utils/AppSelectors';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { logEventQcItemClick } from 'appmodules/AnalyticsModule/Analytics';
import { paymentErrorMessageAction } from 'appmodules/BasketModule/Redux/BasketAction';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { BuyWithPayComponent } from 'appmodules/QuickCheckoutModule/View/BuyWithGpayComponent';

const defaultConfig = { title: '', component: <View />, selectedValue: '' };

type prop = {};
let paymentErrorOptions, paymentSelectedIndex, mainPageTimeout, detailPageTimer;

class HeroNavigator extends Component<prop> {
    constructor(props) {
        super(props);
        this.state = {
            mainScreenOpacity: new Animated.Value(1),
            showMainPage: true,
            showDetailPage: false,
            isAnimationStarted: false,
            optionTitleListPositions: [],
            closeTime: new Date(),
            pageKey: 0,
            animatedPosition: new Animated.ValueXY({ x: 0, y: 0 }),
            closeScreen: false,
            totalAnimationOpacity: new Animated.Value(1),
            opacityAnimationRepeatCount: 0,
            opacityAnimationRunning: false,
            leftArrowPosition: new Animated.Value(-50),
            paymentErrorMessage: null
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (isValidElement(props.closeTime) && state.closeTime !== props.closeTime && !state.isAnimationStarted) {
            return {
                closeTime: props.closeTime,
                mainScreenOpacity: new Animated.Value(1),
                showMainPage: true,
                isAnimationStarted: false,
                showDetailPage: false
            };
        }
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (
            isValidElement(prevProps.basketTotal) &&
            isValidElement(this.props.basketTotal) &&
            prevProps.basketTotal !== this.props.basketTotal
        ) {
            this.performTotalAnimation();
        }
        return null;
    }
    componentWillUnmount() {
        this.props.paymentErrorMessageAction(null);
        if (isValidElement(mainPageTimeout)) {
            clearTimeout(mainPageTimeout);
        }
        if (isValidElement(detailPageTimer)) {
            clearTimeout(detailPageTimer);
        }
    }
    componentDidUpdate(prevProps) {
        if (isValidElement(this.props.paymentErrorMessage) && prevProps.paymentErrorMessage !== this.props.paymentErrorMessage) {
            const { config } = this.props;
            paymentErrorOptions = config.find((item) => item.title === LOCALIZATION_STRINGS.PAYMENT);
            paymentSelectedIndex = config.findIndex((item) => item.title === LOCALIZATION_STRINGS.PAYMENT);
            this.startAnimation(paymentSelectedIndex, paymentErrorOptions);
        }
    }
    render() {
        const { containerStyle } = this.props;
        return (
            <View style={[this.state.showDetailPage && { height: this.props.height }, containerStyle]}>
                {this.renderOptionList()}
                {this.renderOptionDetails()}
                {this.renderAnimatedHeader()}
            </View>
        );
    }

    renderOptionList() {
        const { mainScreenOpacity, showMainPage } = this.state;
        const { containerStyle, title, titleStyle, children } = this.props;
        const mainOpacity = mainScreenOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const containerAnimatedStyle = {
            opacity: mainOpacity
        };
        if (showMainPage) {
            return (
                <Animated.View style={[containerStyle, containerAnimatedStyle]}>
                    <Text style={[styles.title, titleStyle]}>{title.toUpperCase()}</Text>
                    {/*// As per discuss with PO team we cmd below lines*/}
                    {/*{showDifferentLocationInfoMessage && (*/}
                    {/*    <InfoComponent*/}
                    {/*        screenName={screenName}*/}
                    {/*        handleOnPress={() => {*/}
                    {/*            handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {*/}
                    {/*                viewType: ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS*/}
                    {/*            });*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*)}*/}

                    <ScrollView>{this.renderList()}</ScrollView>
                    {children}
                </Animated.View>
            );
        }
        return null;
    }

    renderList() {
        const { config, optionTitleStyle, screenName, isOrderProcessing } = this.props;
        return config.map((options, currentKey) => {
            const { isAnimationStarted, pageKey } = this.state;
            let isCollection = options.title === LOCALIZATION_STRINGS.COLLECTION;
            let isTotal = options.title === LOCALIZATION_STRINGS.TOTAL;
            return (
                <View key={currentKey} onLayout={this.setupPosition.bind(this, currentKey)}>
                    <T2STouchableOpacity
                        accessible={false}
                        screenName={screenName}
                        id={VIEW_ID.MAIN_PAGE_SUBTITLE_CLICK}
                        style={styles.listItem}
                        disabled={isCollection}
                        onPress={() => !isOrderProcessing && this.startAnimation(currentKey, options)}>
                        <T2SText
                            screenName={screenName}
                            id={VIEW_ID.MAIN_PAGE_SUBTITLE_KEY + options.title}
                            style={[styles.listTitle, optionTitleStyle]}>
                            {isAnimationStarted && pageKey === currentKey ? '' : options.title}
                        </T2SText>
                        {this.renderRightViewForQCRow(options)}
                        {!isCollection && <CustomIcon name={FONT_ICON.RIGHT_ARROW_2} style={styles.arrowRight} />}
                    </T2STouchableOpacity>
                    {!isTotal && <View style={styles.divider} />}
                </View>
            );
        });
    }
    renderRightViewForQCRow = (options) => {
        const { optionValueStyle, screenName } = this.props;
        const { pageKey } = this.state;
        if (options.title === LOCALIZATION_STRINGS.GET_IT_BY) {
            return this.renderGetItBy(options, screenName, pageKey);
        } else if (options.title === LOCALIZATION_STRINGS.TOTAL) {
            return this.renderTotal(options, screenName, pageKey);
        } else if (options.selectedValue === LOCALIZATION_STRINGS.GOOGLE_PAY || options.selectedValue === LOCALIZATION_STRINGS.APPLE_PAY) {
            return <BuyWithPayComponent isApplePay={options.selectedValue === LOCALIZATION_STRINGS.APPLE_PAY} screenName={screenName} />;
        } else {
            let isAddressNotAvailable = options.selectedValue === LOCALIZATION_STRINGS.ADDRESS_FORM_ADD_ADDRESS;
            return (
                <View
                    style={[
                        styles.listDescription,
                        optionValueStyle,
                        { color: isAddressNotAvailable ? Colors.greyHeaderText : Colors.darkBlack }
                    ]}>
                    <T2SText
                        screenName={screenName}
                        id={VIEW_ID.MAIN_PAGE_SUBTITLE_VALUE + options.selectedValue}
                        style={styles.rightRowText}>
                        {options.selectedValue}
                    </T2SText>
                </View>
            );
        }
    };
    setupPosition = (key, event) => {
        const layout = event.nativeEvent.layout;
        const { optionTitleListPositions } = this.state;
        optionTitleListPositions[key] = layout;
        this.setState({ optionTitleListPositions });
    };

    renderAnimatedHeader() {
        const { pageKey, isAnimationStarted, animatedPosition } = this.state;
        const { config, optionTitleStyle } = this.props;
        const selectedConfig = config[pageKey];
        if (!isAnimationStarted) return null;
        const marginStyle = {
            transform: [
                {
                    translateX: animatedPosition.x
                },
                {
                    translateY: animatedPosition.y
                }
            ],
            position: 'absolute'
        };
        return <Animated.Text style={[styles.animatedText, optionTitleStyle, marginStyle]}>{selectedConfig.title}</Animated.Text>;
    }

    startAnimation(selectedKey, options) {
        if (options.title === LOCALIZATION_STRINGS.DELIVERY) {
            if (options.selectedValue === LOCALIZATION_STRINGS.ADDRESS_FORM_ADD_ADDRESS) {
                handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {
                    viewType: ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS
                });
                return;
            }
        }
        logEventQcItemClick(options);
        const { mainScreenOpacity, animatedPosition, optionTitleListPositions, leftArrowPosition } = this.state;
        const { animationTimeout, paddingLeft, paddingTop, optionTitlePosition, easing, headerAnimatedTiming } = this.props;
        const y = optionTitleListPositions[selectedKey].y + paddingTop;
        animatedPosition.setValue({ x: paddingLeft, y });
        this.setState({ value: y });
        this.setState({ isAnimationStarted: true, pageKey: selectedKey, showDetailPage: true });
        Animated.parallel([
            Animated.timing(mainScreenOpacity, {
                toValue: 0,
                duration: animationTimeout,
                useNativeDriver: true
            }),
            Animated.timing(animatedPosition, {
                toValue: optionTitlePosition,
                duration: headerAnimatedTiming,
                easing,
                useNativeDriver: true
            }),
            Animated.timing(leftArrowPosition, {
                toValue: 5,
                duration: animationTimeout,
                useNativeDriver: true
            })
        ]).start(() => this.setState({ isAnimationStarted: false, showMainPage: false }));
    }

    closeScreen() {
        const { isAnimationStarted } = this.state;
        if (!isAnimationStarted) {
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.ICON_CLOSE);
            const { mainScreenOpacity, animatedPosition, pageKey, optionTitleListPositions, leftArrowPosition } = this.state;
            const { animationTimeout, paddingTop, paddingLeft, easing, headerAnimatedTiming } = this.props;
            const y = optionTitleListPositions[pageKey].y + paddingTop;
            const extraPadding = 15;
            animatedPosition.setValue({ x: paddingLeft + extraPadding, y: y - paddingTop }); //need to update the current position to the animated state
            const normalHeader = {
                x: paddingLeft,
                y: y
            };
            this.setState({ isAnimationStarted: true, showMainPage: true });
            Animated.parallel([
                Animated.timing(animatedPosition, {
                    toValue: normalHeader,
                    duration: headerAnimatedTiming,
                    useNativeDriver: true,
                    easing
                }),
                Animated.timing(mainScreenOpacity, {
                    toValue: 1,
                    duration: animationTimeout,
                    useNativeDriver: true
                }),
                Animated.timing(leftArrowPosition, {
                    toValue: -50,
                    duration: animationTimeout,
                    useNativeDriver: true
                })
            ]).start(() => {
                this.setState({ isAnimationStarted: false, showDetailPage: false });
            });
            mainPageTimeout = setTimeout(() => {
                this.setState({ isAnimationStarted: true, showMainPage: true });
            }, 100);

            detailPageTimer = setTimeout(() => {
                this.setState({ isAnimationStarted: false, showDetailPage: false }, () => {
                    const { paymentErrorMessage } = this.props;
                    if (isValidElement(paymentErrorMessage)) {
                        this.props.paymentErrorMessageAction(null);
                    }
                });
            }, animationTimeout);
        }
    }

    renderOptionDetails() {
        const { mainScreenOpacity, showDetailPage, pageKey, isAnimationStarted, leftArrowPosition } = this.state;
        const subScreenOpacity = mainScreenOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        });
        const { containerStyle, config, optionTitleStyle, screenName } = this.props;
        const containerAnimatedStyle = {
            opacity: subScreenOpacity
        };
        const leftArrowOpacity = leftArrowPosition.interpolate({
            inputRange: [-50, 0, 5],
            outputRange: [0, 0, 1]
        });
        const selectedConfig = isValidElement(config[pageKey]) ? config[pageKey] : defaultConfig;
        if (showDetailPage) {
            return (
                <View style={[styles.container, containerStyle]}>
                    <T2STouchableOpacity
                        accessible={false}
                        screenName={screenName}
                        id={VIEW_ID.SECOND_PAGE_TITLE}
                        style={styles.subTitleView}
                        onPress={() => this.closeScreen()}>
                        <Animated.View style={{ opacity: leftArrowOpacity }}>
                            <CustomIcon style={styles.backButton} name={FONT_ICON.LEFT_ARROW} />
                        </Animated.View>
                        <T2SText screenName={screenName} id={VIEW_ID + selectedConfig.title} style={[styles.listTitle, optionTitleStyle]}>
                            {isAnimationStarted ? '' : selectedConfig.title}
                        </T2SText>
                    </T2STouchableOpacity>
                    <Animated.View style={[styles.containerDetailed, containerStyle, containerAnimatedStyle]}>
                        {selectedConfig.component}
                    </Animated.View>
                </View>
            );
        }
        return null;
    }
    renderTotal(options, screenName, pageKey) {
        const { optionValueStyle } = this.props;
        const { totalAnimationOpacity, opacityAnimationRunning } = this.state;
        return (
            <Animated.View
                style={[
                    styles.preOrderContainer,
                    {
                        opacity: totalAnimationOpacity
                    }
                ]}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.MAIN_PAGE_SUBTITLE_VALUE + options.selectedValue}
                    style={[
                        styles.totalValueStyle,
                        optionValueStyle,
                        { color: opacityAnimationRunning ? Colors.primaryColor : Colors.darkBlack }
                    ]}>
                    {options.selectedValue}
                </T2SText>
            </Animated.View>
        );
    }
    performTotalAnimation(count = 2) {
        const { totalAnimationOpacity } = this.state;
        this.setState({
            opacityAnimationRepeatCount: count,
            opacityAnimationRunning: true
        });
        Animated.sequence([
            Animated.timing(totalAnimationOpacity, {
                toValue: 0,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true
            }),
            Animated.timing(totalAnimationOpacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true
            })
        ]).start(() => {
            if (this.state.opacityAnimationRepeatCount > 0) {
                this.performTotalAnimation(count - 1);
            } else {
                this.setState({
                    opacityAnimationRunning: false
                });
            }
        });
    }

    renderGetItBy(options, screenName, pageKey) {
        return (
            <View style={styles.preOrderContainer}>
                {options.selectedValue !== CONSTANTS.IMMEDIATELY && (
                    <View style={styles.preOrderViewStyle}>
                        <T2SText screenName={screenName} id={VIEW_ID.PRE_ORDER} style={styles.preOrderTextStyle}>
                            {LOCALIZATION_STRINGS.PREORDER.toUpperCase()}
                        </T2SText>
                    </View>
                )}
                <T2SText screenName={screenName} id={VIEW_ID.MAIN_PAGE_SUBTITLE_VALUE + pageKey} style={styles.valueStyle}>
                    {options.selectedValue === CONSTANTS.IMMEDIATELY
                        ? LOCALIZATION_STRINGS.ASAP
                        : this.formatPreOrderTime(options.selectedValue)}
                </T2SText>
                {this.props.isPreOrderASAP && (
                    <T2SText screenName={screenName} id={VIEW_ID.ASAP_TEXT}>
                        {` (${LOCALIZATION_STRINGS.ASAP})`}
                    </T2SText>
                )}
            </View>
        );
    }
    formatPreOrderTime(date) {
        let day = getRecentOrderedDate(date, this.props.timeZone);
        if (day === LOCALIZATION_STRINGS.TODAY) {
            return moment(date).format(DATE_FORMAT.HH_mm);
        }
        return `${day}, ${moment(date).format(DATE_FORMAT.HH_mm)}`;
    }
}

HeroNavigator.defaultProps = {
    title: '',
    config: [],
    titleStyle: {},
    optionTitleStyle: {},
    optionValueStyle: {},
    containerStyle: {},
    animationTimeout: 500,
    paddingTop: 65,
    paddingLeft: 15,
    optionTitlePosition: { x: 42, y: 14 },
    easing: Easing.out(Easing.exp),
    headerAnimatedTiming: 500
};

HeroNavigator.propTypes = {
    title: propTypes.string,
    config: propTypes.arrayOf(
        propTypes.objectOf({
            title: propTypes.string,
            selectedValue: propTypes.string,
            component: propTypes.any
        })
    ),
    titleStyle: propTypes.object,
    optionTitleStyle: propTypes.object,
    optionValueStyle: propTypes.object,
    screenName: propTypes.string,
    animationTimeout: propTypes.number,
    paddingTop: propTypes.number,
    paddingLeft: propTypes.number,
    easing: propTypes.any,
    headerAnimatedTiming: propTypes.number
};
const mapStateToProps = (state) => ({
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    timeZone: selectTimeZone(state)
});
const mapDispatchToProps = {
    paymentErrorMessageAction
};
export default connect(mapStateToProps, mapDispatchToProps)(HeroNavigator);
