import Modal from 'react-native-modal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { RadioButton } from 'react-native-paper';
import { orderTypeSelectionStyle } from 'appmodules/AddressModule/View/styles/OrderTypeSelectionStyle';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import { SCREEN_NAME, VIEW_ID } from 'appmodules/AddressModule/Utils/AddressConstants';
import { Keyboard, Platform, View } from 'react-native';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import styles from '../../../../CustomerApp/View/Style/FlashMessageStyle';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { CHECKBOX_STATUS } from 'appmodules/HomeModule/Utils/HomeConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { selectedTAOrderTypeAction, updateNonBasketOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
import { T2SIcon } from 't2sbasemodule/UI';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { renderFlashMessageIcon, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import FlashMessage from 't2sbasemodule/UI/CustomUI/FlashMessageComponent';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { SEARCH_TYPE } from '../../Utils/Constants';
import { filterTakeawayByOrderTypeAction, sortBasedOnCuisines, getOfferBasedTakeawayListAction } from '../../Redux/TakeawayListAction';
import { selectFilterList, selectCuisineSelected, selectFilterType } from '../../Redux/TakeawayListSelectors';
import _ from 'lodash';

const screenName = SCREEN_NAME.ORDER_TYPE_SELECTION_MODAL;

class TAOrderTypeModal extends Component {
    constructor(props) {
        super(props);
        this.handleCollectionRadioButton = this.handleCollectionRadioButton.bind(this);
        this.handleDeliveryRadioButton = this.handleDeliveryRadioButton.bind(this);
        this.handleKeyboardDismiss = this.handleKeyboardDismiss.bind(this);
        this.state = {
            orderType: '',
            keyboardSpace: 0,
            showHideTAOrderType: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.ORDER_TYPE);
        this.handleKeyboardDismiss();
        //to get keyboard height
        Keyboard.addListener('keyboardDidShow', (frames) => {
            if (!frames.endCoordinates) return;
            this.setState({ keyboardSpace: frames.endCoordinates.height });
        });
        Keyboard.addListener('keyboardDidHide', (frames) => {
            this.setState({ keyboardSpace: 0 });
        });
    }

    handleKeyboardDismiss() {
        Keyboard.dismiss();
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        if (props.showHideTAOrderType !== state.showHideTAOrderType) {
            value.showHideTAOrderType = props.showHideTAOrderType;
        }
        if (props.selectedTAOrderType !== state.orderType) {
            value.orderType = props.selectedTAOrderType;
        }
        return _.isEmpty(value) ? null : value;
    }

    render() {
        return (
            <Modal
                style={[
                    orderTypeSelectionStyle.modalStyle,
                    [
                        Platform.OS === 'ios'
                            ? { bottom: this.state.keyboardSpace ? this.state.keyboardSpace * 2 - this.state.keyboardSpace : 0 }
                            : null
                    ]
                ]}
                isVisible={this.state.showHideTAOrderType}
                onBackdropPress={() => this.props.onOrderTypeModalClose()}
                animationInTiming={250}
                backdropTransitionInTiming={0}
                animationOutTiming={250}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating={true}
                useNativeDriver={false}>
                {this.renderCloseIcon()}
                {this.renderOrderTypeView()}
                <FlashMessage
                    accessible={false}
                    position="top"
                    floating={true}
                    style={styles.flashMessageStyle}
                    renderFlashMessageIcon={renderFlashMessageIcon}
                    ref={(ref) => (this.flashMessageRef = ref)}
                />
            </Modal>
        );
    }

    renderCloseIcon() {
        return (
            <T2STouchableOpacity
                onPress={this.onPressClose.bind(this)}
                screenName={screenName}
                style={orderTypeSelectionStyle.closeIconContainer}>
                <T2SIcon
                    name={FONT_ICON.CLOSE}
                    style={orderTypeSelectionStyle.closeIconStyle}
                    onPress={this.onPressClose.bind(this)}
                    screenName={screenName}
                    id={VIEW_ID.CLOSE_ICON}
                />
            </T2STouchableOpacity>
        );
    }

    renderOrderTypeView() {
        return (
            <T2SView style={orderTypeSelectionStyle.modalView} screenName={screenName} id={VIEW_ID.RENDER_ORDER_TYPE}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.IS_DELIVERY_AVAILABLE_TEXT}
                    style={orderTypeSelectionStyle.unAvailDeliveryHeaderText}>
                    {LOCALIZATION_STRINGS.ORDER_TYPE}
                </T2SText>
                {this.renderDeliveryOption()}
                {this.renderCollectionOption()}
            </T2SView>
        );
    }

    renderDeliveryOption() {
        const { selectedTAOrderType } = this.props;
        return (
            <View>
                <View style={orderTypeSelectionStyle.divider} />
                <T2STouchableOpacity
                    style={orderTypeSelectionStyle.radioButtonView}
                    screenName={screenName}
                    id={VIEW_ID.CHECKBOX_VIEW}
                    onPress={this.handleDeliveryRadioButton}
                    accessible={false}>
                    <RadioButton.Android
                        {...setTestId(screenName, VIEW_ID.RADIO_BUTTON_DELIVERY)}
                        value={CHECKBOX_STATUS.DELIVERY}
                        uncheckedColor={Colors.primaryColor}
                        color={Colors.primaryColor}
                        onPress={this.handleDeliveryRadioButton}
                        status={selectedTAOrderType === ORDER_TYPE.DELIVERY ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                    />
                    <T2SText
                        screenName={screenName}
                        id={VIEW_ID.DELIVERY_TEXT}
                        accessibilityState={{ checked: selectedTAOrderType === ORDER_TYPE.DELIVERY }}
                        style={orderTypeSelectionStyle.radioButtonText}>
                        {LOCALIZATION_STRINGS.DELIVERY}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderCollectionOption() {
        const { selectedTAOrderType } = this.props;
        return (
            <View>
                <View style={orderTypeSelectionStyle.divider} />
                <T2STouchableOpacity
                    style={orderTypeSelectionStyle.radioButtonView}
                    screenName={screenName}
                    id={VIEW_ID.CHECKBOX_VIEW}
                    onPress={this.handleCollectionRadioButton}
                    accessible={false}>
                    <RadioButton.Android
                        {...setTestId(screenName, VIEW_ID.RADIO_BUTTON_COLLECTION)}
                        value={CHECKBOX_STATUS.COLLECTION}
                        uncheckedColor={Colors.primaryColor}
                        color={Colors.primaryColor}
                        onPress={this.handleCollectionRadioButton}
                        status={selectedTAOrderType === ORDER_TYPE.COLLECTION ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                    />
                    <T2SText
                        screenName={screenName}
                        id={VIEW_ID.COLLECTION_TEXT}
                        accessibilityState={{ checked: selectedTAOrderType === ORDER_TYPE.COLLECTION }}
                        style={orderTypeSelectionStyle.radioButtonText}>
                        {LOCALIZATION_STRINGS.COLLECTION}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    onPressClose() {
        Analytics.logAction(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.ICON_CLOSE);
        this.props.onOrderTypeModalClose();
    }

    handleDeliveryRadioButton() {
        if (this.props.selectedTAOrderType === ORDER_TYPE.DELIVERY) {
            showInfoMessage(LOCALIZATION_STRINGS.DELIVERY_SELECTED);
        } else {
            showInfoMessage(LOCALIZATION_STRINGS.DELIVERY + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED);
        }
        this.handleOrderTypeChangeAction(ORDER_TYPE.DELIVERY);
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.DELIVERY_SELECTED);
    }

    handleCollectionRadioButton() {
        if (this.props.selectedTAOrderType === ORDER_TYPE.COLLECTION) {
            showInfoMessage(LOCALIZATION_STRINGS.COLLECTION_SELECTED);
        } else {
            showInfoMessage(LOCALIZATION_STRINGS.COLLECTION + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED.toLowerCase());
        }
        this.handleOrderTypeChangeAction(ORDER_TYPE.COLLECTION);
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.COLLECTION_SELECTED);
    }

    handleOrderTypeChangeAction(orderType) {
        const { takeawayList } = this.props;
        this.props.selectedTAOrderTypeAction(orderType);
        this.props.updateNonBasketOrderType(orderType);
        this.props.onOrderTypeModalClose();
        this.props.filterTakeawayByOrderTypeAction(takeawayList, orderType);
        this.makeCuisineFilterCall(orderType);
    }

    makeCuisineFilterCall(orderType) {
        const {
            cuisinesSelected,
            takeawayList,
            filterType,
            filterList,
            homeScreenFilter,
            selectedAdvancedFilterName,
            isFromOfferList,
            offerValue,
            maxOfferValue
        } = this.props;
        this.props.sortBasedOnCuisines(
            cuisinesSelected,
            takeawayList,
            filterType,
            SEARCH_TYPE.POST_CODE,
            filterList,
            homeScreenFilter,
            selectedAdvancedFilterName,
            orderType
        );
        if (isFromOfferList) {
            this.props.getOfferBasedTakeawayListAction(offerValue, maxOfferValue, orderType);
        }
    }

    componentWillUnmount() {
        if (isValidElement(this.keyboardDidShowListener)) {
            this.keyboardDidShowListener.remove();
        }
        if (isValidElement(this.keyboardDidHideListener)) {
            this.keyboardDidHideListener.remove();
        }
    }
}

const mapStateToProps = (state) => ({
    screenName: state.addressState.screenName,
    showHideTAOrderType: state.orderManagementState.showHideTAOrderType,
    takeawayList: state.takeawayListReducer.takeawayList,
    selectedAdvancedFilterName: state.takeawayListReducer.selectedAdvancedFilterName,
    filterType: selectFilterType(state),
    cuisinesSelected: selectCuisineSelected(state),
    filterList: selectFilterList(state),
    offerValue: state.takeawayListReducer.filterListWithOffer,
    maxOfferValue: state.takeawayListReducer.filterListWithMaxOffer,
    isFromOfferList: state.takeawayListReducer.isFromOfferList,
    homeScreenFilter: state.takeawayListReducer.homeScreenFilter,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    basketStoreID: state.basketState.storeID
});

const mapDispatchToProps = {
    filterTakeawayByOrderTypeAction,
    sortBasedOnCuisines,
    getOfferBasedTakeawayListAction,
    selectedTAOrderTypeAction,
    updateNonBasketOrderType
};

export default connect(mapStateToProps, mapDispatchToProps)(TAOrderTypeModal);
