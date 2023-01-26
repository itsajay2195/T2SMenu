import React, { Component } from 'react';
import { T2SAppBar, T2SButton, T2SCheckBox, T2SDivider } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { UPDATE_MISSING_ITEMS, VIEW_ID } from '../Utils/SupportConstants';
import BaseComponent from '../../BaseModule/BaseComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { FlatList, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isArrayNonEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import {
    filterMissingItems,
    getMissingItems,
    isAllSelectedItems,
    isCashOrder,
    isMissingItemsAvailable,
    setRefundData,
    updateMissingItems
} from '../Utils/SupportHelpers';
import { selectLanguageKey, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import { selectReceiptOrderItems, selectRefundRequested } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import CartItem from '../../BasketModule/View/Components/CartItem';
import Colors from 't2sbasemodule/Themes/Colors';
import ReportMissingItemsStyle from '../Style/ReportMIssingItemsScreenStyle';
import { getEmail, getPhoneNumber, getUserName, startLiveChat } from '../../BaseModule/Helper';
import T2STouchableWithoutFeedback from '../../../T2SBaseModule/UI/CommonUI/T2STouchableWithoutFeedback';
import { submitMissingItemAction } from '../../OrderManagementModule/Redux/OrderManagementAction';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';

let screenName = SCREEN_OPTIONS.REPORT_MISSING_ITEM_SCREEN.screen_title;

class ReportMissingItemsScreen extends Component {
    constructor(props) {
        super(props);
        this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
        this.handleSubmitBtnClick = this.handleSubmitBtnClick.bind(this);
        this.state = {
            orderItems: isValidElement(props.items) && props.items.length > 0 && updateMissingItems(props.items),
            allItemsClicked: false,
            isRefundItems: false
        };
    }
    setRefundItems() {
        const { items, refundRequestedData } = this.props;
        if (isArrayNonEmpty(refundRequestedData)) {
            this.setState({ orderItems: setRefundData(items, refundRequestedData), isRefundItems: true });
        } else if (isArrayNonEmpty(items)) {
            this.setState({ orderItems: items, isRefundItems: false });
        }
    }
    componentDidMount() {
        this.setRefundItems();
    }

    render() {
        const { isRefundItems, orderItems } = this.state;
        return (
            <BaseComponent showHeader={false} showElevation={false}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    title={isRefundItems ? LOCALIZATION_STRINGS.REFUND_MISSING_ITEM : LOCALIZATION_STRINGS.REPORT_MISSING_ITEMS}
                    showElevation={true}
                />
                {!isRefundItems && this.renderAllMissingItem()}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={orderItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={this.renderMissingItem.bind(this)}
                    ItemSeparatorComponent={() => <T2SDivider />}
                />
                {this.renderBottomButton()}
            </BaseComponent>
        );
    }
    renderAllMissingItem() {
        return (
            <>
                <View>
                    <T2SText
                        style={ReportMissingItemsStyle.missingItemsTitleText}
                        id={VIEW_ID.WHICH_ITEMS_MISSING_TEXT}
                        screenName={screenName}>
                        {LOCALIZATION_STRINGS.WHICH_ITEMS_MISSING_TEXT}
                    </T2SText>
                </View>
                {this.renderAllItemsCheckboxView()}
            </>
        );
    }

    isButtonDisabled() {
        const { isRefundItems } = this.state;
        return isRefundItems;
    }
    renderMissingItem({ item, index }) {
        return (
            <CartItem
                data={item}
                index={index}
                viewMode={true}
                isMissItems={true}
                onPress={this.handleItemClick.bind(this, item)}
                addonOnPress={(addonItem, itemId) => {
                    this.handleItemClick(addonItem, itemId, item, true);
                }}
            />
        );
    }
    renderAllItemsCheckboxView() {
        return (
            <>
                <T2STouchableWithoutFeedback
                    id={VIEW_ID.CHECKBOX_BUTTON}
                    screenName={screenName}
                    onPress={this.handleCheckBoxClick.bind(this)}>
                    <View style={ReportMissingItemsStyle.allItemsTextContainer}>
                        <T2SText style={ReportMissingItemsStyle.allItemsText} id={VIEW_ID.ALL_ITEMS_TEXT} screenName={screenName}>
                            {LOCALIZATION_STRINGS.ALL_ITEMS}
                        </T2SText>
                        <T2SCheckBox
                            screenName={screenName}
                            unFillCheckBoxStyle={ReportMissingItemsStyle.checkboxUnFill}
                            id={VIEW_ID.CHECKBOX_BUTTON}
                            status={this.state.allItemsClicked}
                            onPress={this.handleCheckBoxClick.bind(this)}
                        />
                    </View>
                </T2STouchableWithoutFeedback>
                <T2SDivider />
            </>
        );
    }
    handleCheckBoxClick() {
        if (!this.isButtonDisabled())
            this.setState({
                orderItems: updateMissingItems(this.state.orderItems, UPDATE_MISSING_ITEMS.SELECTED_ALL_ITEMS, !this.state.allItemsClicked),
                allItemsClicked: !this.state.allItemsClicked
            });
    }
    handleItemClick(clickItem, itemId, items, isAddOn = false) {
        if (!this.isButtonDisabled()) {
            if (isAddOn) {
                let missingItems = updateMissingItems(
                    this.state.orderItems,
                    UPDATE_MISSING_ITEMS.SELECTED_ADDON_ITEMS,
                    items,
                    itemId,
                    clickItem
                );
                this.setState({
                    orderItems: missingItems,
                    allItemsClicked: isAllSelectedItems(missingItems)
                });
            } else if (!isAddOn) {
                let missingItems = updateMissingItems(this.state.orderItems, UPDATE_MISSING_ITEMS.SELECTED_ITEM, clickItem, null, null);
                this.setState({
                    orderItems: missingItems,
                    allItemsClicked: this.state.allItemsClicked ? !this.state.allItemsClicked : isAllSelectedItems(missingItems)
                });
            }
        }
    }
    renderBottomButton() {
        return (
            <View style={ReportMissingItemsStyle.submitButtonContainer}>
                <T2SButton
                    opacity={this.isButtonDisabled() || !isMissingItemsAvailable(this.state.orderItems) ? 0.5 : 1}
                    title={LOCALIZATION_STRINGS.SUBMIT.toUpperCase()}
                    screenName={screenName}
                    id={VIEW_ID.SUBMIT_BUTTON}
                    color={Colors.primaryColor}
                    onPress={!this.isButtonDisabled() && this.handleSubmitBtnClick}
                />
            </View>
        );
    }
    handleSubmitBtnClick() {
        const { profileResponse, countryBaseFeatureGateResponse, languageKey, orderDetails } = this.props;
        let orderID = isValidElement(orderDetails?.data?.id) && orderDetails.data.id;
        let storeID = isValidElement(orderDetails?.data?.store?.id) && orderDetails.data.store.id;
        let showChatForm =
            isValidElement(countryBaseFeatureGateResponse?.showPreChatForms?.enable) &&
            countryBaseFeatureGateResponse.showPreChatForms.enable;
        setTimeout(() => {
            startLiveChat(
                profileResponse,
                languageKey,
                countryBaseFeatureGateResponse,
                orderID,
                getMissingItems(this.state.orderItems),
                showChatForm
            );
        }, 100);
        Analytics.logEvent(ANALYTICS_SCREENS.REPORT_MISSING_ITEMS, ANALYTICS_EVENTS.REPORT_MISSING_ITEMS_SUBMIT_CLICKED, {
            name: getUserName(profileResponse),
            emailId: getEmail(profileResponse),
            phoneNo: getPhoneNumber(profileResponse),
            orderID: isValidString(orderID) && orderID
        });
        this.props.navigation.goBack();
        if (isValidElement(orderDetails?.data) && !isCashOrder(orderDetails.data)) {
            this.props.submitMissingItemAction(orderID, filterMissingItems(this.state.orderItems), storeID);
        }
    }
}
const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    languageKey: selectLanguageKey(state),
    orderDetails: state.orderManagementState.orderDetailsResponse,
    timezone: selectTimeZone(state),
    items: selectReceiptOrderItems(state),
    refundRequestedData: selectRefundRequested(state)
});
const mapDispatchToProps = {
    submitMissingItemAction
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportMissingItemsScreen);
