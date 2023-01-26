import React, { Component } from 'react';
import { T2SAppBar, T2SButton, T2SRadioButton } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { VIEW_ID } from '../Utils/SupportConstants';
import BaseComponent from '../../BaseModule/BaseComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import Colors from 't2sbasemodule/Themes/Colors';
import T2STouchableWithoutFeedback from '../../../T2SBaseModule/UI/CommonUI/T2STouchableWithoutFeedback';
import { CancelOrderReasonsList } from '../Utils/OrderHelpConstantsData';
import { CancelOrderScreenStyle } from '../Style/CancelOrderScreenStyle';
import { getCancelReasonsAction, orderCancelAction } from '../../OrderManagementModule/Redux/OrderManagementAction';
import { isSelectedItem } from '../Utils/SupportHelpers';
import { getOrderStoreId } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { removeEmptySpaceFormStart } from 't2sbasemodule/Utils/ValidationUtil';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { getEmail, getPhoneNumber, getUserName } from '../../BaseModule/Helper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import * as Analytics from '../../AnalyticsModule/Analytics';

let screenName = SCREEN_OPTIONS.CANCEL_ORDER_SCREEN.screen_title;

class CancelOrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            CancelReasonText: ''
        };
    }
    componentDidMount() {
        //Todo As per current requirement no need to hit this API we are using static content only
        // this.props.getCancelReasonsAction();
    }

    render() {
        return (
            <BaseComponent showHeader={false} showElevation={false}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    title={LOCALIZATION_STRINGS.CANCEL_ORDER_TEXT}
                    showElevation={true}
                />
                <KeyboardAvoidingView
                    {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
                    showsVerticalScrollIndicator={false}
                    style={CancelOrderScreenStyle.mainContainer}>
                    <ScrollView keyboardShouldPersistTaps="always" style={CancelOrderScreenStyle.cancelReasonListContainer}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            contentContainerStyle={{ flexGrow: 1 }}
                            showsVerticalScrollIndicator={false}
                            data={CancelOrderReasonsList()}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={this.renderItem.bind(this)}
                        />
                    </ScrollView>
                    {this.renderBottomButton()}
                </KeyboardAvoidingView>
            </BaseComponent>
        );
    }
    renderItem({ item, index }) {
        return (
            <>
                <T2STouchableWithoutFeedback
                    id={VIEW_ID.CANCEL_REASON_CLICKED}
                    screenName={screenName}
                    onPress={this.handleCancelItemClick.bind(this, item)}>
                    <View style={CancelOrderScreenStyle.radioButtonView}>
                        <T2SText
                            screenName={screenName}
                            style={CancelOrderScreenStyle.cancelOrderTitleText}
                            id={VIEW_ID.CANCEL_REASON_TEXT + item.title}>
                            {item.title}
                        </T2SText>
                        <T2SRadioButton
                            style={CancelOrderScreenStyle.radioButton}
                            id={VIEW_ID.RADIO_BUTTON}
                            screenName={screenName}
                            status={isSelectedItem(item, this.state.selectedItem)}
                            onPress={() => this.setState({ selectedItem: item, CancelReasonText: '' })}
                        />
                    </View>
                </T2STouchableWithoutFeedback>
                {item.isTextFieldAvailable && isSelectedItem(item, this.state.selectedItem) && this.renderCustomCancelTextFiled()}
                <View style={CancelOrderScreenStyle.dividerStyle} />
            </>
        );
    }
    handleCancelItemClick(item) {
        this.setState({ selectedItem: item, CancelReasonText: '' });
    }
    renderCustomCancelTextFiled() {
        return (
            <T2SView style={CancelOrderScreenStyle.textInputContainer} screenName={screenName} id={VIEW_ID.INSTRUCTION_TEXT_INPUT}>
                <TextInput
                    multiline={true}
                    id={VIEW_ID.INSTRUCTION_TEXT_INPUT}
                    screenName={screenName}
                    value={this.state.CancelReasonText}
                    onChangeText={this.handleOnReasonTextChange.bind(this)}
                    autoFocus
                />
            </T2SView>
        );
    }
    handleOnReasonTextChange(text) {
        this.setState({ CancelReasonText: removeEmptySpaceFormStart(text) });
    }
    renderBottomButton() {
        const { CancelReasonText, selectedItem } = this.state;
        let isButtonEnable = isValidString(CancelReasonText)
            ? isValidString(selectedItem) && selectedItem.isTextFieldAvailable
            : isValidString(selectedItem) && !selectedItem.isTextFieldAvailable;
        return (
            <View style={CancelOrderScreenStyle.submitButtonContainer}>
                <View style={CancelOrderScreenStyle.buttonView}>
                    <T2SButton
                        opacity={isButtonEnable ? 1 : 0.5}
                        title={LOCALIZATION_STRINGS.DONT_CANCEL.toUpperCase()}
                        screenName={screenName}
                        id={VIEW_ID.DONT_CANCEL_SUBMIT_BUTTON}
                        color={Colors.white}
                        buttonStyle={CancelOrderScreenStyle.DontCancelButtonView}
                        buttonTextStyle={CancelOrderScreenStyle.DontCancelButtonText}
                        onPress={() => {
                            isButtonEnable && this.props.navigation.goBack();
                        }}
                    />
                    <T2SButton
                        opacity={isButtonEnable ? 1 : 0.5}
                        title={LOCALIZATION_STRINGS.CANCEL_ORDER_TEXT.toUpperCase()}
                        screenName={screenName}
                        buttonStyle={CancelOrderScreenStyle.CancelBtnContainer}
                        id={VIEW_ID.CANCEL_ORDER_SUBMIT_BUTTON}
                        onPress={isButtonEnable && this.handleCancelOrderClick.bind(this)}
                    />
                </View>
            </View>
        );
    }
    handleCancelOrderClick() {
        const { orderDetails, profileResponse } = this.props;
        const { CancelReasonText, selectedItem } = this.state;
        let storeID = getOrderStoreId(orderDetails);
        let cancelReason = isValidString(CancelReasonText) && selectedItem.isTextFieldAvailable ? CancelReasonText : selectedItem.reason;
        let orderId = isValidElement(orderDetails) && isValidElement(orderDetails.data) && orderDetails.data.id;
        handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
            orderId: orderId,
            analyticsObj: {
                order_id: orderId,
                store_id: storeID
            }
        });
        Analytics.logEvent(ANALYTICS_SCREENS.CANCEL_ORDER_SCREEN, ANALYTICS_EVENTS.REPORT_MISSING_ITEMS_SUBMIT_CLICKED, {
            name: getUserName(profileResponse),
            emailId: getEmail(profileResponse),
            phoneNo: getPhoneNumber(profileResponse),
            orderID: isValidString(orderId) && orderId
        });
        this.props.orderCancelAction(orderId, 'cancel', selectedItem.id, cancelReason, storeID);
    }
}
const mapStateToProps = (state) => ({
    orderDetails: state.orderManagementState.orderDetailsResponse,
    profileResponse: state.profileState.profileResponse
});
const mapDispatchToProps = {
    orderCancelAction,
    getCancelReasonsAction
};
export default connect(mapStateToProps, mapDispatchToProps)(CancelOrderScreen);
