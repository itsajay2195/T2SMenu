import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { T2SAppBar, T2SText } from 't2sbasemodule/UI';
import { HELP_OPTIONS_TYPE, SCREEN_NAME, VIEW_ID } from '../Utils/SupportConstants';
import { OrderHelpViewStyle } from '../Style/OrderHelpViewStyle';
import { T2SExpandableView } from 't2sbasemodule/UI/CommonUI/T2SExpadingView';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { getFormattedTAPhoneNumber, isValidElement, isValidString, safeFloatValue } from 't2sbasemodule/Utils/helpers';
import { selectLanguageKey, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';
import { startLiveChat } from '../../BaseModule/Helper';
import {
    getOrderDetailWithDriverInfoAction,
    resetReceiptResponse,
    viewOrderAction
} from '../../OrderManagementModule/Redux/OrderManagementAction';
import { ORDER_STATUS } from '../../BaseModule/BaseConstants';
import BaseComponent from '../../BaseModule/BaseComponent';
import {
    getOngoingOrderOptions,
    getOrderHelpViewType,
    getPreviousOrderOptions,
    getRefundByWalletOrder,
    getStorePhoneNumber,
    isRefundByWalletInProgress
} from '../Utils/SupportHelpers';
import { ChatButtonComponent } from 't2sbasemodule/UI/CustomUI/ChatButton/ChatButtonComponent';
import { CallButtonComponent } from 't2sbasemodule/UI/CommonUI/CallButtonComponent';
import { isCollectionOrderType } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { ORDER_TYPE } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import Config from 'react-native-config';
import * as appHelper from 't2sbasemodule/Utils/helpers';
import { getCountryById } from '../../../FoodHubApp/LandingPage/Utils/Helper';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { convertProfileResponseToAnalytics } from '../../AnalyticsModule/Braze';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import * as Segment from '../../AnalyticsModule/Segment';
import * as Analytics from '../../AnalyticsModule/Analytics';

let screenName = SCREEN_NAME.ORDER_HELP;

class OrderHelpView extends Component {
    constructor() {
        super();
        this.handleOnPressHelpItem = this.handleOnPressHelpItem.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
        this.state = {
            isExpandedItem: null
        };
    }

    componentDidMount() {
        const { route } = this.props;
        const { params } = isValidElement(route) && route;
        const { orderId, storeID } = isValidElement(params) && params;
        if (isValidElement(orderId)) {
            this.props.getOrderDetailWithDriverInfoAction(orderId, storeID);
            this.props.viewOrderAction(orderId, storeID);
        }
    }

    trackOnPressHelpItem(type, orderId) {
        const { profileResponse, countryBaseFeatureGateResponse, countryIso } = this.props;
        let eventObj = convertProfileResponseToAnalytics(profileResponse, countryIso);
        if (isValidString(orderId)) eventObj.order_id = orderId;
        let helpType = getOrderHelpViewType(type);
        if (isValidElement(helpType)) eventObj.method = helpType;
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_HELP_VIEW, helpType + '_' + 'CLICK', eventObj);
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.HELP_CLICKED, eventObj);
    }

    handleOnPressHelpItem(item) {
        const { profileResponse, countryBaseFeatureGateResponse, languageKey } = this.props;
        const { params } = this.props.route;
        const { orderId } = isValidElement(params) && params;
        const { isExpandedItem } = this.state;
        const isExpandableItem = isValidElement(isExpandedItem) && isExpandedItem.id === item.id ? null : item;
        this.setState({
            isExpandedItem: isValidElement(item.isDropDownAvailable) && item.isDropDownAvailable ? isExpandableItem : null
        });

        this.trackOnPressHelpItem(item.type, orderId);
        switch (item.type) {
            case HELP_OPTIONS_TYPE.WHERE_IS_MY_ORDER:
                if (isValidElement(orderId)) {
                    handleNavigation(SCREEN_OPTIONS.WHERE_IS_MY_ORDER_SCREEN.route_name, {
                        orderId: params.orderId,
                        storeID: params.storeID
                    });
                }
                break;
            case HELP_OPTIONS_TYPE.SOME_THINGS_ELSE:
                if (isValidElement(orderId)) {
                    startLiveChat(profileResponse, languageKey, countryBaseFeatureGateResponse, orderId);
                }
                break;
            case HELP_OPTIONS_TYPE.MISSING_ITEMS:
                handleNavigation(SCREEN_OPTIONS.REPORT_MISSING_ITEM_SCREEN.route_name);
                break;
            case HELP_OPTIONS_TYPE.CANCEL_ORDER:
                !item.isDropDownAvailable && handleNavigation(SCREEN_OPTIONS.CANCEL_ORDER_SCREEN.route_name);
                break;
        }
    }

    handleBackPress() {
        this.props.resetReceiptResponse();
        this.props.navigation.goBack();
    }

    render() {
        const { orderDetails, timezone } = this.props;
        let helpData =
            isValidElement(orderDetails) &&
            isValidElement(orderDetails.data) &&
            (safeFloatValue(orderDetails.data.status) >= safeFloatValue(ORDER_STATUS.DELIVERED)
                ? getPreviousOrderOptions(orderDetails.data)
                : getOngoingOrderOptions(orderDetails.data, timezone));
        return (
            <BaseComponent showHeader={false} showElevation={false}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    title={LOCALIZATION_STRINGS.HELP}
                    handleLeftActionPress={this.handleBackPress}
                />
                <FlatList
                    data={helpData}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </BaseComponent>
        );
    }

    renderItem(item) {
        const { orderDetails } = this.props;
        let orderType =
            isValidElement(orderDetails) && isValidElement(orderDetails.data) && isValidElement(orderDetails.data.sending)
                ? orderDetails.data.sending
                : ORDER_TYPE.DELIVERY;
        return (
            <T2SExpandableView
                onPress={this.handleOnPressHelpItem}
                isExpanded={
                    isValidElement(this.state.isExpandedItem) &&
                    isValidElement(this.state.isExpandedItem.id) &&
                    this.state.isExpandedItem.isDropDownAvailable &&
                    this.state.isExpandedItem.id === item.id
                }
                expandView={this.renderExpandView(item)}
                data={item}
                orderType={orderType}
                screenName={screenName}
                clickId={VIEW_ID.CLICKED_TITLE_TEXT + '_' + item.id}
                titleId={VIEW_ID.CONTENT_TITLE_TEXT + '_' + item.id}
            />
        );
    }

    renderExpandView(item) {
        const { params } = this.props.route;
        const { profileResponse, countryBaseFeatureGateResponse, languageKey, orderDetails, countryList, countryId } = this.props;
        const contry = getCountryById(countryList, orderDetails?.data?.store?.country_id);
        return (
            <T2SView screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.ORDER_HELP_VIEW}>
                {this.renderExpandContent(item.type)}
                <View
                    style={[
                        OrderHelpViewStyle.buttonView,
                        !(item.isChatButtonAvailable && item.isTakeawayButtonAvailable) && OrderHelpViewStyle.customButtonView
                    ]}
                    screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                    id={VIEW_ID.ORDER_HELP_VIEW}>
                    {item.isTakeawayButtonAvailable && (
                        <CallButtonComponent
                            storePhoneNumber={getFormattedTAPhoneNumber(
                                getStorePhoneNumber(orderDetails),
                                contry?.iso,
                                countryId !== contry?.id
                            )}
                            screenName={screenName}
                        />
                    )}
                    {item.isChatButtonAvailable && (
                        <ChatButtonComponent
                            profileResponse={profileResponse}
                            languageKey={languageKey}
                            countryBaseFeatureGateResponse={countryBaseFeatureGateResponse}
                            orderId={params.orderId}
                            screenName={screenName}
                        />
                    )}
                </View>
            </T2SView>
        );
    }

    renderExpandContent(type) {
        switch (type) {
            case HELP_OPTIONS_TYPE.EDIT_ORDER_INSTRUCTIONS:
                return this.renderEditOrderInstructions();
            case HELP_OPTIONS_TYPE.UNABLE_TO_REACH_TAKEAWAY:
                return this.renderUnableToReachTakeaway();
            case HELP_OPTIONS_TYPE.ORDER_NOT_DELIVERED:
                return this.renderOrderNotDelivered();
            case HELP_OPTIONS_TYPE.DAMAGED_ITEMS:
                return this.renderDamagedItems();
            case HELP_OPTIONS_TYPE.REFUND_DELAYS:
                return this.renderRefundDelays();
            case HELP_OPTIONS_TYPE.CANCEL_ORDER:
                return this.renderCancelOrderInfo();
        }
    }

    renderCancelOrderInfo() {
        const { orderDetails, countryList, countryId } = this.props;
        const phoneNumber = getStorePhoneNumber(orderDetails);
        const contry = getCountryById(countryList, orderDetails?.data?.store?.country_id);

        return (
            <View style={OrderHelpViewStyle.expandViewStyle}>
                <T2SText
                    style={OrderHelpViewStyle.cancelTextStyle}
                    screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                    id={VIEW_ID.ORDER_CANCEL_INFO_MSG}>
                    {LOCALIZATION_STRINGS.ORDER_CANCEL_INFO_MSG}
                    <T2SText
                        style={OrderHelpViewStyle.commonLinkTextStyle}
                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                        id={VIEW_ID.STORE_NUMBER}
                        onPress={this.handleCallSupportPress.bind(
                            this,
                            getFormattedTAPhoneNumber(phoneNumber, contry?.iso, countryId !== contry?.id)
                        )}>
                        {getFormattedTAPhoneNumber(phoneNumber, contry?.iso, countryId !== contry?.id)}
                    </T2SText>
                    {LOCALIZATION_STRINGS.ORDER_CANCEL_INFO_MSG2}
                </T2SText>
            </View>
        );
    }

    renderEditOrderInstructions() {
        const { orderDetails, countryList, countryId } = this.props;
        const phoneNumber = getStorePhoneNumber(orderDetails);
        const country = getCountryById(countryList, orderDetails?.data?.store?.country_id);

        return (
            <View style={OrderHelpViewStyle.expandViewStyle}>
                <T2SText style={OrderHelpViewStyle.expandContentStyle} id={VIEW_ID.EDIT_ORDER_INSTRUCTIONS_TEXT} screenName={screenName}>
                    {LOCALIZATION_STRINGS.EDIT_ORDER_DESCRIPTION_TEXT}
                </T2SText>
                <T2SText
                    style={[OrderHelpViewStyle.expandContentStyle, { paddingVertical: 10 }]}
                    screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                    id={VIEW_ID.YOU_CAN_REACH_THEM_AT + phoneNumber}>
                    {LOCALIZATION_STRINGS.YOU_CAN_REACH_TEXT + ' '}
                    <T2SText
                        style={OrderHelpViewStyle.commonLinkTextStyle}
                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                        id={VIEW_ID.STORE_NUMBER}
                        onPress={this.handleCallSupportPress.bind(
                            this,
                            getFormattedTAPhoneNumber(phoneNumber, country?.iso, countryId !== country?.id)
                        )}>
                        {getFormattedTAPhoneNumber(phoneNumber, country?.iso, countryId !== country?.id)}
                    </T2SText>
                </T2SText>
            </View>
        );
    }

    handleCallSupportPress(phoneNumber) {
        appHelper.callDialPad(phoneNumber);
    }

    renderUnableToReachTakeaway() {
        return (
            <View style={OrderHelpViewStyle.expandViewStyle}>
                <T2SText screenName={screenName} style={OrderHelpViewStyle.expandContentStyle} id={VIEW_ID.UNABLE_TO_REACH_TAKEAWAY_TEXT}>
                    {LOCALIZATION_STRINGS.UNABLE_TO_REACH_DESCRIPTION_TEXT}
                </T2SText>
            </View>
        );
    }

    renderOrderNotDelivered() {
        const { orderDetails } = this.props;
        return (
            <View style={OrderHelpViewStyle.expandViewStyle}>
                <T2SText screenName={screenName} style={OrderHelpViewStyle.expandContentStyle} id={VIEW_ID.ORDER_NOT_DELIVERED_TEXT}>
                    {isCollectionOrderType(orderDetails.data.sending)
                        ? LOCALIZATION_STRINGS.ORDER_NOT_DELIVERED_TEXT_COLLECTION
                        : LOCALIZATION_STRINGS.ORDER_NOT_DELIVERED_TEXT}
                </T2SText>
            </View>
        );
    }

    renderDamagedItems() {
        return (
            <View style={OrderHelpViewStyle.expandViewStyle}>
                <T2SText screenName={screenName} style={OrderHelpViewStyle.expandContentStyle} id={VIEW_ID.DAMAGED_ITEMS_TEXT}>
                    {LOCALIZATION_STRINGS.DAMAGED_ITEMS_TEXT}
                </T2SText>
            </View>
        );
    }

    renderRefundDelays() {
        const { orderDetails, previousOrder } = this.props;
        let orderData = isValidElement(orderDetails) && isValidElement(orderDetails.data) && orderDetails.data;
        return (
            <View style={OrderHelpViewStyle.expandViewStyle}>
                <T2SText screenName={screenName} style={OrderHelpViewStyle.expandContentStyle} id={VIEW_ID.REFUND_DELAYS_TEXT}>
                    {isValidElement(getRefundByWalletOrder(orderData, previousOrder))
                        ? isRefundByWalletInProgress(getRefundByWalletOrder(orderData, previousOrder))
                            ? LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.REFUND_DELAYS_PROCESS_TEXT_WALLET, Config.APP_NAME)
                            : LOCALIZATION_STRINGS.formatString(LOCALIZATION_STRINGS.REFUND_DELAYS_TEXT_WALLET, Config.APP_NAME)
                        : LOCALIZATION_STRINGS.REFUND_DELAYS_TEXT}
                </T2SText>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    languageKey: selectLanguageKey(state),
    orderDetails: state.orderManagementState.orderDetailsResponse,
    timezone: selectTimeZone(state),
    previousOrder: state.orderManagementState.previousOrder,
    countryList: state.landingState.countryList,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    countryIso: state.appState.s3ConfigResponse?.country?.iso
});

const mapDispatchToProps = {
    viewOrderAction,
    getOrderDetailWithDriverInfoAction,
    resetReceiptResponse
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderHelpView);
