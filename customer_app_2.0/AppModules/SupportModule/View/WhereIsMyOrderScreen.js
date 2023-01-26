import React, { Component } from 'react';
import { T2SAppBar } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { SCREEN_NAME, VIEW_ID } from '../Utils/SupportConstants';
import BaseComponent from '../../BaseModule/BaseComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import {
    getOrderDetailWithDriverInfoAction,
    requestDeliveryTimeUpdateAction
} from '../../OrderManagementModule/Redux/OrderManagementAction';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Style } from '../Style/WhereIsMyOrderScreenStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import LottieView from 'lottie-react-native';
import { getFormattedTAPhoneNumber, isValidElement, isValidString, safeIntValue } from 't2sbasemodule/Utils/helpers';

import {
    deliverTimeRequestOrder,
    getDriverName,
    getDriverPhone,
    getStorePhoneNumber,
    getUpdatedDeliveryTime,
    isDeliveryOrderTimeCompeleted,
    isDeliveryTimeUpdateOrder,
    isNonDeliveryTimeRequestOrder
} from '../Utils/SupportHelpers';
import {
    DATE_FORMAT,
    formatDateString,
    getBusinessMomentForDate,
    getCurrentBusinessMoment,
    getTimeDifference
} from 't2sbasemodule/Utils/DateUtil';
import { selectLanguageKey, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import { Autolink } from 'react-native-autolink';
import { Colors } from '../../../T2SBaseModule/Themes';
import T2SStyledText from 't2sbasemodule/UI/CommonUI/T2SStyledText';
import { getDeliveryTimeDelayText, isCollectionOrderType, isDeliverOrder } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { CallButtonComponent } from 't2sbasemodule/UI/CommonUI/CallButtonComponent';
import { ORDER_STATUS } from '../../BaseModule/BaseConstants';
import * as appHelper from 't2sbasemodule/Utils/helpers';
import { getCountryById } from '../../../FoodHubApp/LandingPage/Utils/Helper';

let screenName = SCREEN_OPTIONS.WHERE_IS_MY_ORDER_SCREEN.screen_title;

class WhereIsMyOrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            delayText: null,
            showStartingLoader: false
        };
    }
    updateOrderDetails() {
        const { route } = this.props;
        const { params } = isValidElement(route) && route;
        const { orderId, storeID } = isValidElement(params) && params;
        if (isValidElement(orderId)) {
            this.props.getOrderDetailWithDriverInfoAction(orderId, storeID, true);
        }
    }

    componentDidMount() {
        //Todo As per discuss with deepan no need to hit this endpoint
        this.updateOrderDetails();
        const { orderDetails, timezone, deliverTimeRequestedOrderData } = this.props;
        let orderDetailsData = orderDetails?.data;
        const currentBusinessMoment = getCurrentBusinessMoment(timezone);
        const orderStatus = safeIntValue(orderDetailsData?.status);
        const currentDeliveryTime = getBusinessMomentForDate(orderDetailsData?.delivery_time, timezone);
        const duration = getTimeDifference(currentBusinessMoment, currentDeliveryTime);
        if (
            isDeliveryOrderTimeCompeleted(orderDetailsData, orderStatus, duration) &&
            !isDeliveryTimeUpdateOrder(deliverTimeRequestedOrderData, orderDetails)
        )
            this.setState({ showStartingLoader: true });
        this.timeout = setTimeout(() => {
            this.updateLoaderStatus(false);
        }, 3000);
    }
    componentDidUpdate(prevProps, prevState) {
        const { orderDetails } = this.props;
        let orderStatus = safeIntValue(orderDetails?.data?.status);
        if (
            isValidElement(prevProps) &&
            isValidElement(orderDetails.data) &&
            isValidElement(orderDetails.data.status) &&
            isValidElement(prevProps.orderDetails.data) &&
            isValidElement(prevProps.orderDetails.data.status)
        ) {
            if (
                isDeliverOrder(orderDetails?.data) &&
                prevProps.orderDetails.data.status !== orderDetails.data.status &&
                orderStatus === safeIntValue(ORDER_STATUS.ACCEPTED)
            ) {
                this.updateOrderDetails();
            }
            if (parseFloat(orderDetails.data.status) >= parseFloat(ORDER_STATUS.DELIVERED)) {
                this.props.navigation.goBack();
            }
        }
    }

    onRefresh() {
        this.setState({ showLoader: true });
        this.updateOrderDetails();
        this.timeout = setTimeout(() => {
            this.setState({ showLoader: false });
        }, 1000);
    }

    renderBottomChatButton() {
        //As per demo feedback removed chat button
        // const { profileResponse, storeConfigResponse, countryBaseFeatureGateResponse, languageKey, orderDetails } = this.props;
        const { orderDetails, countryList, countryId } = this.props;
        let orderDetailsData = orderDetails?.data;
        const country = getCountryById(countryList, orderDetailsData?.store?.country_id);
        return (
            <View style={Style.chatButtonView}>
                <CallButtonComponent
                    storePhoneNumber={getFormattedTAPhoneNumber(
                        getStorePhoneNumber(this.props.orderDetails),
                        country?.iso,
                        countryId !== country?.id
                    )}
                    screenName={screenName}
                    addBottomMargin={true}
                />
                {/*<ChatButtonComponent*/}
                {/*    profileResponse={profileResponse}*/}
                {/*    languageKey={languageKey}*/}
                {/*    countryBaseFeatureGateResponse={countryBaseFeatureGateResponse}*/}
                {/*    storeConfigResponse={storeConfigResponse}*/}
                {/*    orderId={*/}
                {/*        isValidElement(orderDetails) &&*/}
                {/*        isValidElement(orderDetails.data) &&*/}
                {/*        isValidElement(orderDetails.data.id) &&*/}
                {/*        orderDetails.data.id*/}
                {/*    }*/}
                {/*    screenName={screenName}*/}
                {/*/>*/}
            </View>
        );
    }

    render() {
        return (
            <BaseComponent showHeader={false} showElevation={false}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    title={LOCALIZATION_STRINGS.WHERE_IS_MY_ORDER}
                    showElevation={true}
                />
                {this.renderMainContent()}
                {this.renderBottomChatButton()}
            </BaseComponent>
        );
    }

    renderLoaderView() {
        if (this.state.showStartingLoader) {
            return (
                <View style={Style.loaderContainer}>
                    <LottieView source={require('../Utils/forkandspoon.json')} autoPlay={true} loop={true} style={Style.lottieView} />
                    <T2SText id={VIEW_ID.PLEASE_WAIT_WHILE_TXT} screenName={screenName} style={Style.loaderMessageText}>
                        {LOCALIZATION_STRINGS.DELIVERY_DELAY_LOADING_MESSAGE}
                    </T2SText>
                </View>
            );
        }
    }
    renderMainContent() {
        const data = this.getOrderStatusData();
        const { orderDetails, deliverTimeRequestedOrderData, timezone, countryList, countryId } = this.props;
        let orderDetailsData = orderDetails?.data;
        const country = getCountryById(countryList, orderDetailsData?.store?.country_id);

        const currentBusinessMoment = getCurrentBusinessMoment(timezone);
        const orderStatus = safeIntValue(orderDetailsData?.status);
        const currentDeliveryTime = getBusinessMomentForDate(orderDetailsData?.delivery_time, timezone);
        const duration = getTimeDifference(currentBusinessMoment, currentDeliveryTime);
        if (
            isDeliveryOrderTimeCompeleted(orderDetailsData, orderStatus, duration) &&
            isDeliveryTimeUpdateOrder(deliverTimeRequestedOrderData, orderDetails, true)
        ) {
            return this.renderDeliveryTimeRequestLoader();
        } else if (isValidElement(data)) {
            const { image, mainContent, additionalContent, number } = data;
            return (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={this.state.showLoader} onRefresh={this.onRefresh.bind(this)} />}
                    style={Style.contentContainer}>
                    {isValidElement(image) && (
                        <View style={Style.driverImageContainer}>
                            <Image source={image} style={Style.driverImage} />
                        </View>
                    )}
                    {isValidString(mainContent) && (
                        <Autolink
                            text={mainContent}
                            component={View}
                            renderText={(text) => (
                                <T2SStyledText
                                    id={VIEW_ID.YOUR_ORDER_RUNNING_DELAYED_TXT}
                                    screenName={screenName}
                                    style={Style.contentMessageText}>
                                    {text}
                                </T2SStyledText>
                            )}
                        />
                    )}
                    {isValidString(additionalContent) && (
                        <Text style={Style.additionalContentMessageText}>
                            <T2SStyledText id={VIEW_ID.STORE_NUMBER_TEXT} screenName={screenName} style={Style.contentMessageText}>
                                {additionalContent}
                            </T2SStyledText>
                            <T2SText
                                style={[Style.additionalContentMessageText, { color: Colors.lightBlue }]}
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                id={VIEW_ID.STORE_NUMBER}
                                onPress={this.handleCallSupportPress.bind(
                                    this,
                                    getFormattedTAPhoneNumber(number, country?.iso, countryId !== country?.id)
                                )}>
                                {getFormattedTAPhoneNumber(number, country?.iso, countryId !== country?.id)}
                            </T2SText>
                            {isValidString(data.additionalContent1) && data.additionalContent1}
                        </Text>
                    )}
                </ScrollView>
            );
        } else {
            return this.renderLoaderView();
        }
    }
    renderDeliveryTimeRequestLoader() {
        const { orderDetails, deliverTimeRequestedOrderData } = this.props;
        let deliveryTimeDelayText = getDeliveryTimeDelayText(orderDetails, deliverTimeRequestedOrderData);
        return (
            <View style={Style.loaderContainer}>
                <LottieView source={require('../Utils/forkandspoon.json')} autoPlay={true} loop={true} style={Style.lottieView} />
                <T2SText id={VIEW_ID.PLEASE_WAIT_WHILE_TXT} screenName={screenName} style={Style.loaderMessageText}>
                    {deliveryTimeDelayText}
                </T2SText>
            </View>
        );
    }
    updateDeliveryTimerText(deliveryTimeData) {
        if (isValidElement(deliveryTimeData)) {
            this.setState({ delayText: deliveryTimeData });
        }
    }
    handleCallSupportPress(phoneNumber) {
        appHelper.callDialPad(phoneNumber);
    }
    //TODO need to optimise this function
    getOrderStatusData() {
        const { orderDetails, deliverTimeRequestedOrderData, timezone } = this.props;
        let orderDetailsData = orderDetails.data;
        if (
            !this.state.showStartingLoader &&
            isValidElement(orderDetailsData) &&
            isValidElement(orderDetailsData.status) &&
            isValidElement(orderDetailsData.sending)
        ) {
            const timeZone = isValidString(orderDetailsData?.time_zone) ? orderDetailsData.time_zone : timezone;
            const orderStatus = safeIntValue(orderDetailsData?.status);
            const phoneNumber = getStorePhoneNumber(orderDetails);
            let driverNumber = getDriverPhone(orderDetailsData);
            driverNumber = isValidString(driverNumber) ? driverNumber : phoneNumber;
            const driverName = getDriverName(orderDetailsData);
            const currentBusinessMoment = getCurrentBusinessMoment(timeZone);
            const currentDeliveryTime = getBusinessMomentForDate(orderDetailsData?.delivery_time, timeZone);
            const duration = getTimeDifference(currentBusinessMoment, currentDeliveryTime);
            const isDeliveryTimeUpdatedOrder = isDeliveryTimeUpdateOrder(deliverTimeRequestedOrderData, orderDetails);
            const updatedDeliveryTimeOrder = getUpdatedDeliveryTime(deliverTimeRequestOrder(deliverTimeRequestedOrderData, orderDetails));
            const updatedDeliveryTime = isDeliveryTimeUpdatedOrder && getBusinessMomentForDate(updatedDeliveryTimeOrder, timeZone);
            if (orderStatus === safeIntValue(ORDER_STATUS.PLACED)) {
                return {
                    image: require('../Images/helpCheckingWithTA.png'),
                    mainContent: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.ORDER_NOT_ACCEPTED),
                    additionalContent: LOCALIZATION_STRINGS.TA_CONTACT_HELP,
                    number: phoneNumber
                };
            } else if (isDeliveryTimeUpdateOrder(deliverTimeRequestedOrderData, orderDetails)) {
                return {
                    image: require('../Images/helpDelayOnDelivery.png'),
                    mainContent: LOCALIZATION_STRINGS.formatString(
                        LOCALIZATION_STRINGS.YOUR_ORDER_RUNNING_DELAYED_MSG,
                        formatDateString(updatedDeliveryTime, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.HH_mm_a)
                    )
                };
            } else if (orderStatus === safeIntValue(ORDER_STATUS.ACCEPTED)) {
                const additionalContent =
                    duration < 0 && isNonDeliveryTimeRequestOrder(updatedDeliveryTimeOrder)
                        ? LOCALIZATION_STRINGS.TA_HELP_COOKING_DELAY_MSG
                        : LOCALIZATION_STRINGS.TA_CONTACT_HELP;
                return {
                    image: require('../Images/helpOnTimeReady.png'),
                    mainContent:
                        duration > 0 &&
                        LOCALIZATION_STRINGS.formatString(
                            LOCALIZATION_STRINGS.TA_CONTACT_HELP_ON_TIME,
                            formatDateString(orderDetailsData?.delivery_time, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.HH_mm_a)
                        ),
                    additionalContent: additionalContent,
                    number: phoneNumber
                };
            } else if (orderStatus === safeIntValue(ORDER_STATUS.SENT)) {
                if (isCollectionOrderType(orderDetailsData.sending)) {
                    return {
                        image: require('../Images/helpCheckingWithTA.png'),
                        mainContent: LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_HELP_ON_TIME_COLLECTION),
                        additionalContent: '',
                        number: ''
                    };
                } else {
                    return {
                        image: require('../Images/helpOnTimeDelivery.png'),
                        mainContent: '',
                        additionalContent: isValidString(driverName)
                            ? LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.TA_HELP_ON_TIME_DELIVERY, driverName)
                            : LOCALIZATION_STRINGS.TA_HELP_ON_TIME_DELIVERY_NO_NAME,
                        number: driverNumber
                    };
                }
            }
        }
    }

    updateLoaderStatus(status = false) {
        this.setState({
            showStartingLoader: status
        });
    }
}

const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    languageKey: selectLanguageKey(state),
    orderDetails: state.orderManagementState.orderDetailsResponse,
    timezone: selectTimeZone(state),
    deliverTimeRequestedOrderData: state.orderManagementState.deliverTimeRequestedOrderData,
    countryList: state.landingState.countryList,
    countryId: state.appState.s3ConfigResponse?.country?.id
});
const mapDispatchToProps = {
    getOrderDetailWithDriverInfoAction,
    requestDeliveryTimeUpdateAction
};
export default connect(mapStateToProps, mapDispatchToProps)(WhereIsMyOrderScreen);
