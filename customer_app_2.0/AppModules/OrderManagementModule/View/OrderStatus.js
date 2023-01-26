import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated, BackHandler, Image, RefreshControl, ScrollView, View } from 'react-native';
import BaseComponent from '../../BaseModule/BaseComponent';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import OrderTrackingWidget from 't2sbasemodule/UI/CustomUI/OrderTracking/OrderTracking';
import OrderStatusBottomButton from './OrderStatusBottomButtons';
import OrderCancelStatusView from './OrderCancelledStatusView';
import LiveTrackingMap from './Components/LiveTrackingMap';
import LikedExperienceModal from './LikedExperienceModal';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { SCREEN_NAME, STATUS_FETCH_TIMEOUT, VIEW_ID, VIEW_ORDER_SOURCE } from '../Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { ORDER_STATUS, ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { SCREEN_NAME as screenNameConstant } from '../../../FoodHubApp/HomeModule/Utils/HomeConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { Colors } from 't2sbasemodule/Themes';
import styles from '../View/Styles/OrderStatusStyle';
import {
    clearOrderDetailsAction,
    clearOrderTrackingDetailsAction,
    getOrderDetailsAction,
    getOrderTrackingDetailsAction,
    makeGetOrderListAction,
    resetRefundOptionAction
} from '../Redux/OrderManagementAction';
import { getConsumerPromotion, receiveOfferConsentAction } from '../../AuthModule/Redux/AuthAction';
import { setSideMenuActiveAction, updateAppStoreRatingByUser } from '../../../CustomerApp/Redux/Actions';
import { getNetworkStatus, selectCurrencyFromS3Config, selectLanguageKey, selectPhoneRegex } from 't2sbasemodule/Utils/AppSelectors';

import * as appHelper from 't2sbasemodule/Utils/helpers';
import {
    checkRegexPatternTest,
    copyToClipboard,
    distance,
    distanceValue,
    getFormattedTAPhoneNumber,
    getPolicyId,
    handleReDirectToStoreReview,
    isCustomerApp,
    isNonCustomerApp,
    isValidElement,
    isValidString,
    safeFloatValue,
    safeStringValue
} from 't2sbasemodule/Utils/helpers';
import * as orderManagementHelper from '../Utils/OrderManagementHelper';
import {
    checkIfOrderIsApplicableForLiveTrackingCheck,
    fetchIntervalBasedOnDistanceInDelivery,
    getOrder,
    getPaymentType
} from '../Utils/OrderManagementHelper';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import TimerComponent from 't2sbasemodule/UI/CustomUI/TimerComponent/TimerComponent';
import { selectOrderType } from '../Redux/OrderManagementSelectors';
import { getCurrencyFromBasketResponse } from '../../BaseModule/GlobalAppHelper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import JoinBetaView from './Components/JoinBetaView';
import { convertMessageToAppLanguage, showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import TearLines from '../../../T2SBaseModule/UI/CustomUI/TearLines';
import CardView from '../../../T2SBaseModule/UI/CustomUI/CardView';
import T2SCheckBox from '../../../T2SBaseModule/UI/CommonUI/T2SCheckBox';
import { AuthConstants } from '../../AuthModule/Utils/AuthConstants';
import { ProfileConstants } from '../../ProfileModule/Utils/ProfileConstants';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import OrderStatusSkeleton from './Components/OrderStatusSkeleton';
import _ from 'lodash';
import OrderStatusAnimation from './Components/OrderStatusAnimation';
import { isPreOrderOrder } from 't2sbasemodule/UI/CustomUI/TimerComponent/Utils/TimerComponentHelper';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import { logSMSOptSegment, logAutoOptInOut } from '../../ProfileModule/Utils/ProfileHelper';
import { isIOS, startHelp, startLiveChat } from 'appmodules/BaseModule/Helper';
import T2SStyledText from 't2sbasemodule/UI/CommonUI/T2SStyledText';
import { isMOreThen1MinsAndLessThen15Mins } from 't2sbasemodule/Utils/DateUtil';
import { CommonActions } from '@react-navigation/native';
import { getCountryById } from '../../../FoodHubApp/LandingPage/Utils/Helper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { showMap } from '../../TakeawayDetailsModule/Utils/TakeawayDetailsHelper';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import Geolocation from '@react-native-community/geolocation';
import { isGPSLocationEnabled } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';
import { getDistanceType } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { DISTANCE_TYPE } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import { convertProfileResponseToAnalytics } from '../../AnalyticsModule/Braze';
import { getOrderStatusText } from 't2sbasemodule/UI/CustomUI/OrderTracking/Utils/OrderTrackingHelper';

let refreshRate = STATUS_FETCH_TIMEOUT,
    timeout,
    fadeoutTimeout,
    loadServiceTimer;

class OrderStatus extends Component {
    constructor(props) {
        super(props);
        this.handleChatBotAction = this.handleChatBotAction.bind(this);
        this.handleAcceptButtonClicked = this.handleAcceptButtonClicked.bind(this);
        this.handleHelpClickAction = this.handleHelpClickAction.bind(this);
        this.handleViewOrderClick = this.handleViewOrderClick.bind(this);
        this.closeAnimation = this.closeAnimation.bind(this);
        this.handleOrderCancelledPopupRequestClose = this.handleOrderCancelledPopupRequestClose.bind(this);
        this.handleCancelOrderAction = this.handleCancelOrderAction.bind(this);
        this.handleBackClickAction = this.handleBackClickAction.bind(this);
        this.handleDirectionClick = this.handleDirectionClick.bind(this);
        this.fitAllMarkers = this.fitAllMarkers.bind(this);
        this.userLocationCoordinates = this.userLocationCoordinates.bind(this);
        this.state = {
            showReceiveOffersPopup: false,
            showCancelPopup: false,
            showBottomButton: false,
            orderDetails: null,
            showLikedExperienceModal: false,
            refreshState: false,
            storeConfig: null,
            smsChecked: true,
            emailChecked: true,
            fadeAnimation: new Animated.Value(0),
            orderId: null,
            profileResponse: null,
            showTracking: false,
            customer_lat: null,
            customer_long: null,
            distanceValue: ''
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.ORDER_STATUS);
        const { store, orderId } = isValidElement(this.props?.route?.params) && this.props.route.params;
        this.setState({ storeConfig: store, orderId });
        this.makeOrderDetailsCall();
        this.checkAndCallOrderTrackingDetails();
        this.makeOrderDetailsCallWithInterval();
        if (isCustomerApp()) {
            this.props.getConsumerPromotion();
        }
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.makeOrderDetailsCall();

            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackClickAction);
            this.userLocationCoordinates();
        });
    }
    componentWillUnmount() {
        const { screenName } = isValidElement(this.props?.route?.params) && this.props.route.params;

        if (isValidElement(screenName) && screenName === screenNameConstant.HOME_SCREEN) this.props.makeGetOrderListAction();

        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
        if (isValidElement(fadeoutTimeout)) {
            clearTimeout(fadeoutTimeout);
        }
        if (isValidElement(loadServiceTimer)) {
            clearInterval(loadServiceTimer);
        }
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(this.backHandler)) {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackClickAction);
        }
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { orderDetails, profileResponse } = props;
        if (isValidElement(orderDetails)) {
            if (isValidElement(state.orderDetails)) {
                if (
                    isValidElement(state.orderDetails.data) &&
                    isValidElement(orderDetails.data) &&
                    isValidElement(orderDetails.data.status) &&
                    orderDetails.data.status !== state.orderDetails.data.status
                ) {
                    if (orderDetails.data.status === ORDER_STATUS.CANCEL_ORDER) {
                        value.showCancelPopup = true;
                    }
                }
            }
            value.orderDetails = orderDetails;
        }
        if (isValidElement(profileResponse) && profileResponse !== state.profileResponse) {
            let { is_subscribed_sms, is_subscribed_email } = profileResponse;
            value.showReceiveOffersPopup =
                isValidString(is_subscribed_sms) &&
                is_subscribed_sms === ProfileConstants.TOGGLE_SUBSCRIPTION_NO &&
                isValidString(is_subscribed_email) &&
                is_subscribed_email === ProfileConstants.TOGGLE_SUBSCRIPTION_NO;
            value.profileResponse = profileResponse;
        }
        return _.isEmpty(value) ? null : value;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { customer_lat, customer_long } = nextState;
        if (isValidElement(nextProps?.orderDetails) && !isValidElement(customer_lat) && !isValidElement(customer_long)) {
            // this validation helps to display the polyline between co-ordinates.
            this.userLocationCoordinates();
        }
        if (customer_lat !== nextProps?.customer_lat || customer_long !== nextProps?.customer_long) {
            return true;
        }

        if (
            isValidElement(nextProps.orderTrackingDetails) &&
            isValidElement(this.props.orderTrackingDetails) &&
            isValidElement(nextProps.orderTrackingDetails.data) &&
            isValidElement(this.props.orderTrackingDetails.data) &&
            isValidElement(nextProps.orderTrackingDetails.data.driver) &&
            isValidElement(nextProps.orderTrackingDetails.data.driver.locations) &&
            isValidElement(nextProps.orderTrackingDetails.data.driver.locations[0]) &&
            isValidElement(nextProps.orderTrackingDetails.data.driver.locations[0].lat) &&
            isValidElement(nextProps.orderTrackingDetails.data.driver.locations[0].lng) &&
            isValidElement(this.props.orderTrackingDetails.data.driver) &&
            isValidElement(this.props.orderTrackingDetails.data.driver.locations) &&
            isValidElement(this.props.orderTrackingDetails.data.driver.locations[0]) &&
            isValidElement(this.props.orderTrackingDetails.data.driver.locations[0].lat) &&
            isValidElement(this.props.orderTrackingDetails.data.driver.locations[0].lng) &&
            (nextProps.orderTrackingDetails.data.driver.locations[0].lat !== this.props.orderTrackingDetails.data.driver.locations[0].lat ||
                nextProps.orderTrackingDetails.data.driver.locations[0].lng !==
                    this.props.orderTrackingDetails.data.driver.locations[0].lng)
        ) {
            let newRefreshRate = fetchIntervalBasedOnDistanceInDelivery(nextProps.orderTrackingDetails);
            if (newRefreshRate !== refreshRate) {
                refreshRate = newRefreshRate;
                this.makeOrderDetailsCallWithInterval();
                return true;
            }
        }
        return true;
    }

    onRefresh() {
        this.setState({ refreshState: true });
        this.makeOrderDetailsCall();
        this.checkAndCallOrderTrackingDetails();
        timeout = setTimeout(() => this.setState({ refreshState: false }), 2000);
    }
    handleBackClickAction() {
        const { navigation, route } = this.props;
        const { params } = route;
        if (isValidElement(params?.isFromWebviewPayment) && params.isFromWebviewPayment) {
            this.props.setSideMenuActiveAction(SCREEN_OPTIONS.ORDER_HISTORY.route_name);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: SCREEN_OPTIONS.ORDER_HISTORY.route_name }]
                })
            );
        } else if (navigation.getState()?.routes[0]?.name === SCREEN_OPTIONS.WALLET.route_name) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: SCREEN_OPTIONS.WALLET.route_name }]
                })
            );
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
        this.clearOrderData();
        return true;
    }

    clearOrderData() {
        this.props.clearOrderDetailsAction();
        this.props.clearOrderTrackingDetailsAction();
        this.props.resetRefundOptionAction();
    }

    render() {
        const orderDetails =
            isValidElement(this.props.orderDetails) && isValidElement(this.props.orderDetails.data) ? this.props.orderDetails.data : null;
        return (
            <BaseComponent showHeader={false}>
                <View style={styles.mainContainer}>
                    <T2SAppBar
                        title={LOCALIZATION_STRINGS.ORDER_STATUS}
                        showElevation={true}
                        actions={this.renderHeaderButtons()}
                        handleLeftActionPress={this.handleBackClickAction}
                    />
                    {isValidElement(orderDetails) ? (
                        orderDetails?.id?.toString() === this.state?.orderId?.toString() &&
                        (orderDetails.status === ORDER_STATUS.CANCEL_ORDER
                            ? this.renderCancelledStatusView(orderDetails)
                            : orderManagementHelper.checkToEnableLiveTrackingMode(
                                  orderDetails.status,
                                  orderDetails.sending,
                                  this.props.countryBaseFeatureGateResponse
                              )
                            ? orderManagementHelper.hasValidLatLong(this.props.orderTrackingDetails)
                                ? this.renderOrderStatusTrackingWithMapContainer(orderDetails)
                                : this.renderOrderStatusTrackingContainer(orderDetails)
                            : this.renderOrderStatusTrackingContainer(orderDetails))
                    ) : (
                        <OrderStatusSkeleton />
                    )}

                    {this.state.showCancelPopup && this.renderOrderCancelledPopup(orderDetails)}
                    <LikedExperienceModal
                        likedExperienceModalVisible={this.state.showLikedExperienceModal}
                        onHideModal={() => {
                            this.setState({ showLikedExperienceModal: false });
                        }}
                    />
                </View>
            </BaseComponent>
        );
    }

    renderHeaderButtons(orderDetails) {
        return (
            <View style={styles.navBarRightActionsView}>
                {this.renderCallButton()}
                {this.renderChatButton()}
                {this.renderHeaderTimer()}
            </View>
        );
    }

    renderHeaderTimer() {
        const orderDetails =
            isValidElement(this.props.orderDetails) && isValidElement(this.props.orderDetails.data) ? this.props.orderDetails.data : {};
        if (isValidElement(orderDetails) && orderDetails.status < ORDER_STATUS.DELIVERED) {
            return <View>{this.renderTimer(orderDetails, styles.headerTimerStyle)}</View>;
        }
    }

    //TODO NEED to Work Foodhub
    renderCallButton() {
        const { countryList, countryId, orderDetails } = this.props;
        const orderDetailsData = isValidElement(orderDetails) && isValidElement(orderDetails.data) ? orderDetails.data : null;
        const country = getCountryById(countryList, orderDetailsData?.store?.country_id);
        let storePhoneNumber = '';
        if (isNonCustomerApp() && isValidElement(this.state.storeConfig)) {
            storePhoneNumber = this.state.storeConfig.phone;
        } else if (isValidElement(this.props.orderDetails) && isValidElement(this.props.orderDetails.store)) {
            storePhoneNumber = this.props.orderDetails.store.phone;
        } else {
            storePhoneNumber = isValidElement(this.state.storeConfig)
                ? this.state.storeConfig.phone
                : isValidElement(this.props.storeConfigPhone)
                ? this.props.storeConfigPhone
                : '';
        }
        var phoneNumber = getFormattedTAPhoneNumber(storePhoneNumber, country?.iso, countryId !== country?.id);
        if (isValidString(storePhoneNumber) && checkRegexPatternTest(this.props.phoneRegex, storePhoneNumber)) {
            return (
                <T2STouchableOpacity
                    screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                    id={VIEW_ID.CALL_SUPPORT}
                    onPress={this.handleCallSupportPress.bind(this, phoneNumber)}>
                    <T2SIcon color={Colors.primaryTextColor} style={styles.callSupportIcon} icon={FONT_ICON.CALL_FILLED} size={22} />
                </T2STouchableOpacity>
            );
        }
    }

    renderChatButton() {
        return (
            <T2STouchableOpacity
                style={styles.chatButtonContainer}
                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                id={VIEW_ID.LIVE_CHAT_HEADER_BUTTON}
                onPress={this.handleHelpClickAction}>
                <Image style={styles.chatView} source={require('../../SupportModule/Images/ChatImage.png')} />
            </T2STouchableOpacity>
        );
    }
    userLocationCoordinates() {
        const { orderDetails } = this.props;
        isGPSLocationEnabled(true).then((status) => {
            if (isValidElement(status) && status && orderDetails?.data?.sending === ORDER_TYPE.COLLECTION) {
                this.handleLocation();
            }
        });
    }
    handleLocation() {
        Geolocation.getCurrentPosition((position) => {
            let { latitude, longitude } = position.coords;
            this.setState({ customer_lat: latitude, customer_long: longitude });
            setTimeout(() => {
                this.fitAllMarkers();
            }, 2000);
        });
    }
    async fitAllMarkers() {
        const { lat, lng } = this.props.orderDetails?.data?.store;
        const isValidTakeAewayLocation = isValidElement(lat) && isValidElement(lng);
        if (isValidTakeAewayLocation && this.map) {
            const coordinatesList = this.getCollectionMapCoordinates(this.props.orderDetails?.data);
            this.map.fitToCoordinates(coordinatesList, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: isIOS() ? true : false
            });
            if (coordinatesList.length > 1 && !isIOS()) {
                const camera = await this.map.getCamera();
                this.map.setCamera({
                    heading: camera.heading + 2,
                    zoom: camera.zoom - 0.5
                });
            }
        }
    }
    getCollectionMapCoordinates(orderDetails) {
        const { customer_lat, customer_long } = this.state;
        const { lat, lng } = orderDetails?.store;
        const isValidUserLocation = isValidElement(customer_lat) && isValidElement(customer_long);
        const isValidTakeAewayLocation = isValidElement(lat) && isValidElement(lng);
        const latInDouble = isValidTakeAewayLocation ? parseFloat(lat) : 0;
        const lngInDouble = isValidTakeAewayLocation ? parseFloat(lng) : 0;
        const customerLatInDouble = isValidUserLocation ? parseFloat(customer_lat) : 0;
        const customerLngInDouble = isValidUserLocation ? parseFloat(customer_long) : 0;

        var coordinatesList = [];
        //Takeaway lat and long
        if (isValidTakeAewayLocation) {
            coordinatesList.push({ latitude: latInDouble, longitude: lngInDouble });
        }
        //Customer lat and long
        if (isValidUserLocation) {
            coordinatesList.push({ latitude: customerLatInDouble, longitude: customerLngInDouble });
        }
        return coordinatesList;
    }
    getDistanceValueOfTakeawayAndUser(coordinatesList) {
        const { distanceType } = this.props;

        if (coordinatesList.length > 1) {
            const distanceInMiles = distance(
                coordinatesList[0].latitude,
                coordinatesList[0].longitude,
                coordinatesList[1].latitude,
                coordinatesList[1].longitude,
                distanceType === DISTANCE_TYPE.MILES ? 'M' : 'K'
            );
            return `${isValidElement(distanceInMiles) ? distanceValue(distanceInMiles) + getDistanceType(distanceType) : ''}`;
        }
        return '';
    }
    //TODO: click event on direction action
    handleDirectionClick() {
        const { lat, lng } = this.props.orderDetails?.data?.store;
        if (isValidElement(lat) && isValidElement(lng)) {
            showMap(lat, lng);
        }
    }
    renderDirectionButton() {
        return (
            <T2STouchableOpacity
                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                id={VIEW_ID.DIRECTION_BUTTON}
                style={styles.directionViewStyle}
                onPress={this.handleDirectionClick}>
                <T2SImage
                    screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                    id={VIEW_ID.DIRECTION_IMAGE}
                    source={require('../Images/Direction.png')}
                    resizeMode={'contain'}
                />
                <T2SText id={VIEW_ID.DIRECTION_TITLE} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} style={styles.directionTextStyle}>
                    {LOCALIZATION_STRINGS.DIRECTIONS}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    renderTimer(orderDetails, headerTimerStyle) {
        return (
            <TimerComponent
                id={orderDetails?.id}
                status={orderDetails?.status}
                pre_order_time={orderDetails?.pre_order_time}
                delivery_time={orderDetails?.delivery_time}
                time_zone={orderDetails?.time_zone}
                textStyle={isValidElement(headerTimerStyle) ? headerTimerStyle : {}}
                showTimerForPreorder={true}
            />
        );
    }
    renderTakeawayMapTracker(orderDetails) {
        const { customer_lat, customer_long } = this.state;
        const { lat, lng } = orderDetails?.store;
        const isValidUserLocation = isValidElement(customer_lat) && isValidElement(customer_long);
        const isValidTakeAewayLocation = isValidElement(lat) && isValidElement(lng);
        const latInDouble = isValidTakeAewayLocation ? parseFloat(lat) : 0;
        const lngInDouble = isValidTakeAewayLocation ? parseFloat(lng) : 0;
        const customerLatInDouble = isValidUserLocation ? parseFloat(customer_lat) : 0;
        const customerLngInDouble = isValidUserLocation ? parseFloat(customer_long) : 0;
        return isValidTakeAewayLocation ? (
            <View>
                <MapView
                    ref={(map) => {
                        this.map = map;
                    }}
                    onPress={this.handleDirectionClick}
                    style={styles.mapViewStyle}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    showsCompass={false}
                    moveOnMarkerPress={false}
                    initialRegion={{
                        latitude: latInDouble,
                        longitude: lngInDouble,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}>
                    <Marker coordinate={{ latitude: latInDouble, longitude: lngInDouble }} onPress={this.handleDirectionClick}>
                        <Image resizeMode={'contain'} style={styles.mapMarkerStyle} source={require('../Images/TakeawayMarker.png')} />
                    </Marker>
                    {isValidUserLocation && (
                        <Marker
                            coordinate={{ latitude: customerLatInDouble, longitude: customerLngInDouble }}
                            onPress={this.handleDirectionClick}>
                            <Image resizeMode={'contain'} style={styles.mapMarkerStyle} source={require('../Images/HomeMarker.png')} />
                        </Marker>
                    )}
                    <Polyline
                        coordinates={this.getCollectionMapCoordinates(orderDetails)}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeWidth={isIOS() ? 1 : 3}
                        lineDashPattern={isIOS() ? [5.1] : [15, 15]}
                    />
                </MapView>
                {this.renderTakeawayAddressContainer(orderDetails)}
            </View>
        ) : null;
    }
    reanderDistanceText(orderDetails) {
        const distanceValue = this.getDistanceValueOfTakeawayAndUser(this.getCollectionMapCoordinates(orderDetails));
        return isValidString(distanceValue) ? (
            <T2SText id={VIEW_ID.TAKEAWAY_NAME_DIRECTION} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} style={styles.distanceStyle}>
                {' (' + distanceValue + ')'}
            </T2SText>
        ) : null;
    }
    renderTakeawayAddressContainer(orderDetails) {
        const { name, street, postcode } = orderDetails?.store;
        const takeAwayAddress = isValidString(street) ? street + ', ' + postcode : postcode;
        const storeName = isValidString(name)
            ? name
            : isValidString(this.state.storeConfig?.name)
            ? this.state.storeConfig.name
            : isValidString(this.props.storeConfigName)
            ? this.props.storeConfigName
            : '';
        return (
            <View style={styles.addressContainerStyle}>
                <View style={styles.addressAddressContainerStyle}>
                    <View style={styles.takeawayParentView}>
                        <T2SText
                            id={VIEW_ID.TAKEAWAY_NAME_DIRECTION}
                            screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                            style={styles.takeawayNameStyle}>
                            {storeName}
                            {this.reanderDistanceText(orderDetails)}
                        </T2SText>
                    </View>
                    {isValidString(takeAwayAddress) && (
                        <T2SText
                            id={VIEW_ID.TAKEAWAY_NAME_ADDRESS}
                            screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                            style={styles.takeawayAddressStyle}>
                            {takeAwayAddress}
                        </T2SText>
                    )}
                </View>
                {this.renderDirectionButton()}
            </View>
        );
    }
    /**
     * TODO
     * 1) Order tracking experience
     */
    renderOrderStatusTrackingContainer(orderDetails) {
        return (
            <View style={styles.orderStatusParent}>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshState} onRefresh={() => this.onRefresh()} />}>
                    <View key={VIEW_ID.ORDER_STATUS_CONTAINER} style={styles.orderStatusContainer}>
                        {this.state.showTracking || isPreOrderOrder(orderDetails.pre_order_time) ? (
                            <>
                                {this.renderOrderStatusTracking(orderDetails)}
                                {this.renderPaymentDetailsView(orderDetails)}
                            </>
                        ) : (
                            <OrderStatusAnimation
                                status={orderDetails.status}
                                closeAnimation={this.closeAnimation}
                                orderPlacedTime={orderDetails.order_placed_on}
                                timeZone={orderDetails.time_zone}
                                languageKey={this.props.languageKey}
                            />
                        )}
                        {orderDetails.sending === ORDER_TYPE.COLLECTION && this.renderTakeawayMapTracker(orderDetails)}
                        {this.renderSupportAndCustomerExperienceView(orderDetails)}
                        {this.state.showReceiveOffersPopup && this.renderReceiveOffers()}
                        {this.showConsentSuccessMessage()}
                    </View>
                </ScrollView>
                {this.renderBottomButtonView(orderDetails)}
            </View>
        );
    }

    closeAnimation() {
        this.setState({ showTracking: true });
    }
    renderReceiveOffers() {
        const { emailChecked, smsChecked } = this.state;
        return (
            <CardView cardStyle={styles.cardStyle}>
                <TearLines ref="top" color={Colors.paleYellow} backgroundColor={Colors.white} tearSize={15} />
                <View
                    style={styles.offersView}
                    onLayout={(e) => {
                        this.refs.top.onLayout(e);
                    }}>
                    <T2SText id={VIEW_ID.RECEIVE_OFFERS_TITLE} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} style={styles.commonTextStyle}>
                        {LOCALIZATION_STRINGS.RECEIVE_OFFERS_TITLE}
                    </T2SText>
                    <View style={styles.checkBoxContainer}>
                        <View style={[styles.checkBoxView, { paddingRight: 15 }]}>
                            <T2SCheckBox
                                id={VIEW_ID.SMS_CHECKBOX}
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                label={LOCALIZATION_STRINGS.SMS}
                                textstyle={styles.checkTextStyle}
                                status={smsChecked === true ? AuthConstants.CHECKBOX_CHECKED : null}
                                onPress={() => this.setState({ smsChecked: !smsChecked })}
                            />
                        </View>
                        <View style={styles.checkBoxView}>
                            <T2SCheckBox
                                id={VIEW_ID.EMAIL_CHECKBOX}
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                label={LOCALIZATION_STRINGS.EMAIL}
                                textstyle={styles.checkTextStyle}
                                status={emailChecked === true ? AuthConstants.CHECKBOX_CHECKED : null}
                                onPress={() => this.setState({ emailChecked: !emailChecked })}
                            />
                        </View>
                        <View style={styles.acceptButtonView}>
                            <T2SButton
                                buttonTextStyle={styles.acceptButtonText}
                                buttonStyle={styles.acceptButton}
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                id={VIEW_ID.ACCEPT_BUTTON}
                                title={LOCALIZATION_STRINGS.ACCEPT}
                                uppercase={false}
                                contentStyle={30}
                                onPress={this.handleAcceptButtonClicked}
                                disabled={!emailChecked && !smsChecked}
                            />
                        </View>
                    </View>
                </View>
            </CardView>
        );
    }

    fadeIn() {
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 1000
        }).start(() => {
            this.dismissSuccessMessage();
        });
    }

    fadeOut() {
        Animated.timing(this.state.fadeAnimation, {
            toValue: 0,
            duration: 3000
        }).start();
    }

    showConsentSuccessMessage() {
        return (
            <Animated.View
                style={{
                    opacity: this.state.fadeAnimation
                }}>
                <CardView cardStyle={styles.cardStyle}>
                    <TearLines ref="top1" color={Colors.paleYellow} backgroundColor={Colors.white} tearSize={15} />
                    <View
                        style={styles.offersView}
                        onLayout={(e) => {
                            this.refs.top1.onLayout(e);
                        }}>
                        <T2SText
                            screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                            id={VIEW_ID.CONSENT_SUCCESS_MESSAGE}
                            style={styles.successMessage}>
                            {LOCALIZATION_STRINGS.CONSENT_SUCCESS}
                        </T2SText>
                    </View>
                </CardView>
            </Animated.View>
        );
    }

    dismissSuccessMessage() {
        fadeoutTimeout = setTimeout(() => {
            this.fadeOut();
        }, 3500);
    }

    handleAcceptButtonClicked() {
        const { profileResponse, policyLookupResponse, route, networkConnected, countryBaseFeatureGateResponse, orderDetails } = this.props;
        const { emailChecked, smsChecked } = this.state;
        let storeId = isValidElement(route?.params?.storeID)
            ? route.params.storeID
            : isValidElement(orderDetails?.data?.store?.id)
            ? orderDetails.data.store.id
            : null;
        let policyIds = [];
        if (!networkConnected) {
            showErrorMessage(LOCALIZATION_STRINGS.GENERIC_ERROR_MSG, null, Colors.persianRed);
            return;
        }
        if (!emailChecked && !smsChecked) {
            return;
        }
        if (emailChecked) {
            policyIds.push(getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.email));
        }
        if (smsChecked) {
            policyIds.push(getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.sms));
        }
        if (isValidElement(profileResponse) && isValidElement(profileResponse.id) && isValidElement(storeId) && isValidElement(policyIds)) {
            this.fadeIn();
            this.props.receiveOfferConsentAction(profileResponse.id, storeId, policyIds, SCREEN_NAME.ORDER_STATUS_SCREEN);
            this.setState({ showReceiveOffersPopup: false });
        }
        logSMSOptSegment(countryBaseFeatureGateResponse, smsChecked);
        logAutoOptInOut(ANALYTICS_SCREENS.ORDER_STATUS, smsChecked, emailChecked);
    }
    renderCustomePhoneNumber(storePhoneNumber, PhoneNumber) {
        let splitPhoneBySpace = PhoneNumber.split(' ');
        return splitPhoneBySpace.map((info) => (
            // eslint-disable-next-line react/jsx-key
            <T2SText style={styles.commonTextStyle} onPress={this.handleCallSupportPress.bind(this, PhoneNumber)}>
                <T2SText style={styles.commonLinkTextStyle} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.STORE_NUMBER}>
                    {info}
                </T2SText>
                <T2SText style={styles.clearTextStyle} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.STORE_NUMBER}>
                    {'-'}
                </T2SText>
            </T2SText>
        ));
    }

    renderSupportAndCustomerExperienceView(orderDetails) {
        const {
            countryBaseFeatureGateResponse,
            storeConfigPhone,
            storeConfigName,
            profileResponse,
            countryList,
            countryId,
            countryIso
        } = this.props;
        const country = getCountryById(countryList, orderDetails.store?.country_id);
        let storePhoneNumber = '';

        if (isNonCustomerApp()) {
            storePhoneNumber =
                isValidElement(orderDetails) && isValidElement(orderDetails.store) && isValidString(orderDetails.store.phone)
                    ? orderDetails.store.phone
                    : isValidElement(this.state.storeConfig) && isValidString(this.state.storeConfig.phone)
                    ? this.state.storeConfig.phone
                    : '';
        } else {
            storePhoneNumber =
                isValidElement(orderDetails) && isValidElement(orderDetails.store) && isValidString(orderDetails.store.phone)
                    ? orderDetails.store.phone
                    : isValidElement(storeConfigPhone) && isValidString(storeConfigPhone)
                    ? storeConfigPhone
                    : isValidElement(this.state.storeConfig) && isValidString(this.state.storeConfig.phone)
                    ? this.state.storeConfig.phone
                    : '';
        }
        var phoneNumber = getFormattedTAPhoneNumber(storePhoneNumber, country?.iso, countryId !== country?.id);
        const storeName =
            isValidElement(orderDetails) && isValidElement(orderDetails.store) && isValidString(orderDetails.store.name)
                ? orderDetails.store.name
                : isValidElement(this.state.storeConfig) && isValidString(this.state.storeConfig.name)
                ? this.state.storeConfig.name
                : isValidElement(storeConfigName) && isValidString(storeConfigName)
                ? storeConfigName
                : '';
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={styles.supportViewStyle}>
                    <T2SText style={styles.commonTextStyle}>
                        {isValidElement(orderDetails) &&
                            isValidElement(orderDetails.status) &&
                            orderDetails.status !== ORDER_STATUS.PLACED &&
                            (orderDetails.sending === ORDER_TYPE.DELIVERY
                                ? LOCALIZATION_STRINGS.DELIVERY_ORDER_PLACED
                                : LOCALIZATION_STRINGS.COLLECTION_ORDER_PLACED)}
                        {orderDetails.status !== ORDER_STATUS.PLACED && '\n\n'}
                        <T2SStyledText style={styles.commonTextStyle}>
                            {`${LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.SUPPORT_MESSAGE, storeName)} `}
                        </T2SStyledText>
                        {this.renderCustomePhoneNumber(storePhoneNumber, phoneNumber)}
                        <T2SText style={styles.commonTextStyle}>{LOCALIZATION_STRINGS.OR}</T2SText>
                        <T2SText
                            screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                            id={VIEW_ID.LIVE_CHAT}
                            style={styles.commonLinkTextStyle}
                            onPress={this.handleHelpClickAction}>
                            {' '}
                            {LOCALIZATION_STRINGS.HELP}
                        </T2SText>
                    </T2SText>
                </View>
                {isNonCustomerApp() && this.renderLikeYourExperience(countryBaseFeatureGateResponse, profileResponse, countryIso)}
            </View>
        );
    }
    renderLikeYourExperience(countryBaseFeatureGateResponse, profileResponse, countryIso) {
        const { storeIOSlink, storeAndroidLink } = this.props;
        return (
            <View style={styles.experienceView}>
                <T2SText style={styles.commonTextStyle} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.EXPERIENCE}>
                    {LOCALIZATION_STRINGS.EXPERIENCE}
                </T2SText>
                <View style={styles.reviewViewStyle}>
                    <CustomIcon
                        name={FONT_ICON.LIKE}
                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                        id={VIEW_ID.LIKE_ICON}
                        size={25}
                        color={Colors.primaryColor}
                        style={styles.likeViewStyle}
                        onPress={() => {
                            handleReDirectToStoreReview(
                                countryBaseFeatureGateResponse,
                                profileResponse,
                                this.state.orderId,
                                storeIOSlink,
                                storeAndroidLink,
                                countryIso,
                                true
                            );
                        }}
                    />
                    <CustomIcon
                        name={FONT_ICON.DISLIKE}
                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                        id={VIEW_ID.DISLIKE_ICON}
                        size={25}
                        color={Colors.secondary_color}
                        style={styles.disLikeViewStyle}
                        onPress={this.handleChatBotAction}
                    />
                </View>
            </View>
        );
    }
    renderOrderStatusTrackingWithMapContainer(orderDetails) {
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_STATUS, ANALYTICS_EVENTS.MAP_CONTAINER_VISIBLE);
        let orderTrackingDetails;
        if (isValidElement(this.props.orderTrackingDetails)) {
            const { takeaway, delivery, driver } = this.props.orderTrackingDetails.data;
            orderTrackingDetails = {
                takeAwayDetails: orderManagementHelper.getTakeAwayDetails(takeaway),
                deliveryDetails: orderManagementHelper.getDeliveryDetails(delivery),
                driverDetails: orderManagementHelper.getDriverDetails(driver)
            };
        }
        return [
            <View key={VIEW_ID.ORDER_STATUS_CONTAINER} style={styles.orderStatusContainer}>
                {this.renderOrderStatusTracking(orderDetails)}
            </View>,
            isValidElement(orderTrackingDetails) && (
                <LiveTrackingMap
                    key={VIEW_ID.LIVE_TRACKING_MAP_VIEW}
                    lastUpdatedTimInMS={orderManagementHelper.getCurrentTimeInMS()}
                    trackingData={orderTrackingDetails}
                />
            )
        ];
    }

    renderOrderStatusTracking(orderDetails) {
        return (
            <OrderTrackingWidget
                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                orderType={
                    orderDetails.sending === 'to' || orderDetails.sending === ORDER_TYPE.DELIVERY
                        ? ORDER_TYPE.DELIVERY
                        : ORDER_TYPE.COLLECTION
                }
                orderID={orderDetails.id}
                isPreOrder={isPreOrderOrder(orderDetails.pre_order_time)}
                currentStatus={orderDetails.payment !== 1 ? orderDetails.status : 0}
            />
        );
    }
    renderOrderNoText(order_no) {
        return (
            <T2SText style={styles.orderNoLabelStyle} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.ORDER_NO}>
                {LOCALIZATION_STRINGS.ORDER_NO} <T2SText style={styles.orderNoStyle}>{order_no}</T2SText>
            </T2SText>
        );
    }

    renderPaymentDetailsView(orderDetails) {
        const currency =
            isValidElement(orderDetails) && isValidString(orderDetails.currency)
                ? orderDetails.currency
                : isValidElement(this.props.pendingAndCompletedOrder) &&
                  isValidElement(this.props.pendingAndCompletedOrder.length > 0) &&
                  getCurrencyFromBasketResponse(
                      getOrder(this.props.pendingAndCompletedOrder, orderDetails.id)?.store?.currency,
                      this.props.currency
                  );
        const paymentTypeStr = orderManagementHelper.getPaymentTypeBasedTotalPaidBy(
            orderDetails.total_paid_by_card,
            orderDetails.total_paid_by_wallet,
            orderDetails.payment,
            currency
        );
        return (
            <View style={styles.paymentDetailsContainer}>
                <View style={styles.paymentTypeContainer}>
                    {orderDetails?.sending === ORDER_TYPE.COLLECTION ? (
                        this.renderOrderNoText(orderDetails?.order_no)
                    ) : (
                        <T2SText style={styles.orderIdLabelStyle} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.ORDER_ID_TEXT}>
                            {LOCALIZATION_STRINGS.ORDER_ID}
                            <T2SText
                                style={styles.orderIdStyle}
                                onPress={this.handleViewOrderClick}
                                onLongPress={this.handleCopyOrderID.bind(this, orderDetails.id)}>
                                {' '}
                                {orderDetails.id}
                            </T2SText>
                        </T2SText>
                    )}
                </View>
                <View style={styles.totalAmtContainer}>
                    <T2SText style={styles.totalText} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.PAYMENT_TYPE_TEXT}>
                        {`${paymentTypeStr}`}
                    </T2SText>
                    <T2SText style={styles.totalAmtText} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.TOTAL_AMOUNT_TEXT}>
                        {`${currency}${orderDetails.total}`}
                    </T2SText>
                </View>
            </View>
        );
    }

    renderBottomButtonView(orderDetails) {
        const { countryBaseFeatureGateResponse, profileResponse, storeIOSlink, storeAndroidLink, countryIso } = this.props;
        let isPendingOrder = orderDetails.status <= ORDER_STATUS.DELIVERED;
        return (
            <View>
                <OrderStatusBottomButton
                    screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                    orderDetails={orderDetails}
                    handleRateTheApp={() =>
                        handleReDirectToStoreReview(
                            countryBaseFeatureGateResponse,
                            profileResponse,
                            this.state.orderId,
                            storeIOSlink,
                            storeAndroidLink,
                            countryIso
                        )
                    }
                    handleLiveChatClick={this.handleChatBotAction}
                    handleViewOrderClick={this.handleViewOrderClick}
                    handleCancelOrderClick={this.handleCancelOrderAction}
                    cancelButtonVisible={
                        isMOreThen1MinsAndLessThen15Mins(orderDetails?.order_placed_on, orderDetails?.time_zone) &&
                        orderDetails.status <= safeFloatValue(ORDER_STATUS.PLACED) &&
                        orderDetails.sending !== 'waiting'
                    }
                />
                {isPendingOrder && <JoinBetaView isOrderStatus={isPendingOrder} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} />}
            </View>
        );
    }

    renderCancelledStatusView(orderDetails) {
        return (
            <View style={styles.orderStatusParent}>
                <ScrollView>
                    <OrderCancelStatusView
                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                        orderDetails={orderDetails}
                        handleViewOrderClick={this.handleViewOrderClick}
                    />
                </ScrollView>
                {this.renderBottomButtonView(orderDetails)}
            </View>
        );
    }
    handleOrderCancelledPopupRequestClose() {
        this.setState({ showCancelPopup: false });
    }

    handleCancelOrderAction() {
        handleNavigation(SCREEN_OPTIONS.CANCEL_ORDER_SCREEN.route_name);
    }

    renderOrderCancelledPopup(orderDetails) {
        let orderCancelReason =
            isValidElement(orderDetails) && isValidElement(orderDetails.cancel_reason_message) && orderDetails.cancel_reason_message;
        return (
            <T2SModal
                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                id={VIEW_ID.CANCEL_ORDER_MODAL}
                dialogCancelable={false}
                requestClose={this.handleOrderCancelledPopupRequestClose}
                title={LOCALIZATION_STRINGS.ORDER_CANCELLED_BY_TAKEAWAY}
                isVisible={this.state.showCancelPopup}
                description={convertMessageToAppLanguage(orderCancelReason, this.props.languageKey)}
                positiveButtonText={LOCALIZATION_STRINGS.OKAY}
                negativeButtonText={''}
                positiveButtonClicked={this.handleOrderCancelledPopupRequestClose}
            />
        );
    }

    makeOrderDetailsCall(refreshDriver = false) {
        const { orderId, storeID } = isValidElement(this.props?.route?.params) && this.props.route.params;
        if (isValidElement(orderId) && isValidElement(storeID)) this.props.getOrderDetailsAction(orderId, refreshDriver, storeID);
    }

    checkAndCallOrderTrackingDetails() {
        if (checkIfOrderIsApplicableForLiveTrackingCheck(this.props.orderDetails, this.props.countryBaseFeatureGateResponse)) {
            this.makeOrderTrackingDetailsCall();
        }
    }

    makeOrderTrackingDetailsCall() {
        const { orderId } = isValidElement(this.props?.route?.params) && this.props.route.params;
        if (isValidElement(orderId)) this.props.getOrderTrackingDetailsAction(orderId);
    }

    makeOrderDetailsCallWithInterval() {
        if (isValidElement(loadServiceTimer)) {
            clearInterval(loadServiceTimer);
            loadServiceTimer = null;
        }
        loadServiceTimer = setInterval(() => {
            this.makeOrderDetailsCall(true);
        }, refreshRate);
    }

    handleCallSupportPress(storePhoneNumber) {
        const { countryBaseFeatureGateResponse } = this.props;
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.TA_CALLED, {
            source: 'order_status'
        });
        appHelper.callDialPad(storePhoneNumber);
    }

    handleViewOrderClick() {
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_STATUS, ANALYTICS_EVENTS.VIEW_ORDER_BUTTON_CLICKED);
        const { orderDetails, storeConfigName } = this.props;
        const { storeID, name } = isValidElement(this.props?.route?.params) && this.props.route.params;
        if (isValidElement(orderDetails) && isValidElement(orderDetails.data) && isValidElement(orderDetails.data.id)) {
            handleNavigation(SCREEN_OPTIONS.VIEW_ORDER.route_name, {
                data: orderDetails.data,
                orderId: orderDetails.data.id,
                storeID: storeID,
                sending: orderDetails.data.sending,
                name: isValidString(name) ? name : storeConfigName,
                source: VIEW_ORDER_SOURCE.ORDER_STATUS,
                delivery_time: orderDetails.data.delivery_time
            });
        }
    }

    handleCopyOrderID(orderId) {
        if (isValidString(orderId)) {
            copyToClipboard(safeStringValue(orderId));
        }
    }

    handleChatBotAction() {
        const { profileResponse, languageKey, countryBaseFeatureGateResponse, orderDetails, countryIso } = this.props;
        const orderData = isValidElement(orderDetails) && isValidElement(orderDetails.data) ? orderDetails.data : {};
        if (isValidElement(orderData) && isValidElement(orderData.id)) {
            startLiveChat(profileResponse, languageKey, countryBaseFeatureGateResponse, orderData.id);
        }

        if (isValidElement(orderData) && isValidElement(profileResponse)) {
            const { payment, store, id, status } = orderData;
            let eventData = {
                payment_mode: getPaymentType(payment),
                store_id: safeStringValue(store?.id),
                order_id: safeStringValue(id),
                ...convertProfileResponseToAnalytics(profileResponse, countryIso)
            };
            let orderStatus = getOrderStatusText(status);
            if (isValidElement(orderStatus)) eventData.order_status = orderStatus;
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.THUMBS_DOWN_CLICKED, eventData);
            Analytics.logEvent(ANALYTICS_SCREENS.ORDER_STATUS, SEGMENT_EVENTS.DISLIKE_TAKEAWAY_ORDER, eventData);
        }
    }

    handleHelpClickAction() {
        const { profileResponse, languageKey, countryBaseFeatureGateResponse } = this.props;

        const { orderId, storeID } = isValidElement(this.props?.route?.params) && this.props.route.params;
        if (isValidElement(profileResponse)) {
            startHelp(profileResponse, storeID, languageKey, countryBaseFeatureGateResponse, orderId);
        }
    }
}

const mapStateToProps = (state) => ({
    orderDetails: state.orderManagementState.orderDetailsResponse,
    profileResponse: state.profileState.profileResponse,
    policyLookupResponse: state.appState.policyLookupResponse,
    appStoreRatingByUser: state.appState.appStoreRatingByUser,
    phoneRegex: selectPhoneRegex(state),
    orderTrackingDetails: state.orderManagementState.orderTrackingDetailsResponse,
    orderType: selectOrderType(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    pendingAndCompletedOrder: state.orderManagementState.pendingAndCompletedOrder,
    languageKey: selectLanguageKey(state),
    networkConnected: getNetworkStatus(state),
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigPhone: state.appState.storeConfigResponse?.phone,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    countryList: state.landingState.countryList,
    currency: selectCurrencyFromS3Config(state),
    distanceType: state.appState.s3ConfigResponse?.country?.distance_type,
    storeIOSlink: state.appState.storeConfigResponse?.ios_link,
    storeAndroidLink: state.appState.storeConfigResponse?.android_link
});

const mapDispatchToProps = {
    getOrderDetailsAction,
    getConsumerPromotion,
    updateAppStoreRatingByUser,
    getOrderTrackingDetailsAction,
    clearOrderDetailsAction,
    clearOrderTrackingDetailsAction,
    resetRefundOptionAction,
    makeGetOrderListAction,
    receiveOfferConsentAction,
    setSideMenuActiveAction
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus);
