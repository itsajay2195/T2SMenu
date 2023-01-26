import Modal from 'react-native-modal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { RadioButton } from 'react-native-paper';
import { orderTypeSelectionStyle } from '../styles/OrderTypeSelectionStyle';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import { ADDRESS_FORM_TYPE, DELIVERY_FOR, POSTCODE_LOOKUP_API_STATUS, SCREEN_NAME, VIEW_ID } from '../../Utils/AddressConstants';
import { FlatList, Keyboard, Platform, TextInput, View } from 'react-native';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import styles from '../../../../CustomerApp/View/Style/FlashMessageStyle';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { CHECKBOX_STATUS } from '../../../HomeModule/Utils/HomeConstants';
import {
    getPostCodeKeyboardType,
    getTakeawayCountryId,
    isCustomerApp,
    isValidElement,
    isValidString,
    validatePostcode
} from 't2sbasemodule/Utils/helpers';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { isValidPostCode } from 't2sbasemodule/Utils/ValidationUtil';
import { deliveryLookupAction, updateNonBasketOrderType, updateSelectedOrderType } from '../../Redux/AddressAction';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { T2SIcon } from 't2sbasemodule/UI';
import {
    getAddressObj,
    getAvailableOrderType,
    getFormattedAddress,
    isCollectionOnly,
    isPreOrderAvailableForCollection,
    isPreOrderAvailableForDelivery
} from '../../../OrderManagementModule/Utils/OrderManagementHelper';
import { ORDER_TYPE } from '../../../BaseModule/BaseConstants';
import { renderFlashMessageIcon, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { showHideOrderTypeAction } from '../../../OrderManagementModule/Redux/OrderManagementAction';
import {
    isCollectionAvailableForStore,
    isDeliveryAvailableForStore,
    isPreOrderAvailableSelector,
    selectAskPostCode,
    selectHasUserLoggedIn,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import { selectOrderType } from '../../../OrderManagementModule/Redux/OrderManagementSelectors';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import FlashMessage from 't2sbasemodule/UI/CustomUI/FlashMessageComponent';
import { isPostCodeSearch } from '../../../BaseModule/GlobalAppHelper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { selectCartItems } from '../../../BasketModule/Redux/BasketSelectors';
import { makeChangeAction } from '../../../BasketModule/Redux/BasketAction';
import { getTACloseMessage, isSameStore } from '../../../BasketModule/Utils/BasketHelper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { isBasketOrder, skipForCA } from '../../Utils/AddressHelpers';
import {
    selectCollectionStatus,
    selectDeliveryStatus,
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { getRecommendationResponse } from '../../../HomeModule/Utils/HomeSelector';
import { refreshRecommendation } from '../../../HomeModule/Redux/HomeAction';

const screenName = SCREEN_NAME.ORDER_TYPE_SELECTION_MODAL;
let isCustomer = isCustomerApp();
class OrderTypeSelectionModal extends Component {
    constructor(props) {
        super(props);
        this.setSelectedType = this.setSelectedType.bind(this);
        this.handleCollectionRadioButton = this.handleCollectionRadioButton.bind(this);
        this.handleDeliveryRadioButton = this.handleDeliveryRadioButton.bind(this);
        this.handleAddAddress = this.handleAddAddress.bind(this);
        this.handleSearchPostCode = this.handleSearchPostCode.bind(this);
        this.handleKeyboardDismiss = this.handleKeyboardDismiss.bind(this);
        this.state = {
            postCode: '',
            deliveryFor: '',
            fullAddress: '',
            postCodeLookupApiStatus: POSTCODE_LOOKUP_API_STATUS.NOT_TRIGGERED,
            selectedAddressId: '',
            selectedAddress: '',
            latitude: null,
            longitude: null,
            address: null,
            addressResponse: null,
            keyboardSpace: 0,
            showHideOrderType: false,
            selectedNotAvailableAddress: null
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.ORDER_TYPE);
        this.setAddressFromLocation();
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

    setAddressFromLocation() {
        if (isValidElement(this.props.currentLocation) && isValidElement(this.props.currentLocation.formatted_address)) {
            this.setState({ fullAddress: this.props.currentLocation.formatted_address });
        }
    }

    handleKeyboardDismiss() {
        Keyboard.dismiss();
    }

    setSelectedType() {
        const { selectedPostcode, selectedAddressId } = this.props;
        this.setState({
            postCode: isValidElement(selectedPostcode) ? selectedPostcode : '',
            selectedAddressId: isValidElement(selectedAddressId) ? selectedAddressId : ''
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showHideOrderType !== state.showHideOrderType) {
            return { ...state, showHideOrderType: props.showHideOrderType, selectedNotAvailableAddress: null };
        }
        if (!isValidElement(state.postCode) && props.selectedPostcode !== state.postCode) {
            return { ...state, postCode: props.selectedPostcode };
        }
        if (props.selectedAddressId !== state.selectedAddressId) {
            return { ...state, selectedAddressId: props.selectedAddressId };
        }
        if (props.postCodeLookupApiStatus !== state.postCodeLookupApiStatus) {
            if (props.postCodeLookupApiStatus === POSTCODE_LOOKUP_API_STATUS.SUCCESS) {
                props.onOrderTypeModalClose();
                return { ...state, postCode: null, postCodeLookupApiStatus: POSTCODE_LOOKUP_API_STATUS.NOT_TRIGGERED };
            }
            return { ...state, postCodeLookupApiStatus: props.postCodeLookupApiStatus };
        }
        let fullAddress = '';
        if (isValidElement(props.currentLocation) && isValidElement(props.currentLocation.formatted_address)) {
            fullAddress = props.currentLocation.formatted_address;
        }
        if (props.deliveryFor === '') {
            return {
                ...state,
                deliveryFor: '',
                fullAddress: isValidElement(fullAddress) ? fullAddress : LOCALIZATION_STRINGS.FETCHING_LOCATION
            };
        } else if (props.deliveryFor === DELIVERY_FOR.POSTCODE) {
            return { ...state, deliveryFor: DELIVERY_FOR.POSTCODE };
        } else if (props.deliveryFor === DELIVERY_FOR.LOCATION) {
            return { ...state, deliveryFor: DELIVERY_FOR.LOCATION, fullAddress };
        } else if (props.deliveryFor === DELIVERY_FOR.ADDRESS) {
            return { ...state, deliveryFor: DELIVERY_FOR.ADDRESS };
        }
        return null;
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
                isVisible={this.state.showHideOrderType}
                onModalShow={this.setSelectedType}
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
    onPressClose() {
        Analytics.logAction(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.ICON_CLOSE);
        this.props.onOrderTypeModalClose();
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
        let {
            isUserLoggedIn,
            storeConfigAskPostcodeFirst,
            storeConfigShowCollection,
            storeConfigShowDelivery,
            storeStatusDelivery,
            storeConfigPreOrderDelivery,
            storeConfigId
        } = this.props;
        let availableDeliveryType = getAvailableOrderType(storeConfigShowDelivery, storeConfigShowCollection, storeConfigAskPostcodeFirst);
        const deliveryAvailable =
            skipForCA(storeConfigId) ||
            isDeliveryAvailableForStore(storeConfigShowDelivery, storeStatusDelivery) ||
            isPreOrderAvailableForDelivery(storeConfigPreOrderDelivery);

        return (
            <T2SView style={orderTypeSelectionStyle.modalView} screenName={screenName} id={VIEW_ID.RENDER_ORDER_TYPE}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.IS_DELIVERY_AVAILABLE_TEXT}
                    style={orderTypeSelectionStyle.unAvailDeliveryHeaderText}>
                    {isCollectionOnly(availableDeliveryType)
                        ? LOCALIZATION_STRINGS.NO_DELIVERY_SERVICE_MSG
                        : LOCALIZATION_STRINGS.ORDER_TYPE}
                </T2SText>
                {isUserLoggedIn ? this.renderUserLoggedIn(deliveryAvailable) : this.renderUserLoggedOut(deliveryAvailable)}
            </T2SView>
        );
    }

    renderCollectionOption() {
        const { selectedNotAvailableAddress } = this.state;
        const {
            selectedOrderType,
            storeConfigPreOrderCollection,
            storeConfigShowCollection,
            storeStatusCollection,
            storeConfigId
        } = this.props;
        const collectionAvailable =
            skipForCA(storeConfigId) ||
            isCollectionAvailableForStore(storeConfigShowCollection, storeStatusCollection) ||
            isPreOrderAvailableForCollection(storeConfigPreOrderCollection);
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
                        uncheckedColor={Colors.tabGrey}
                        color={Colors.primaryColor}
                        disabled={!collectionAvailable}
                        onPress={this.handleCollectionRadioButton}
                        status={selectedOrderType === ORDER_TYPE.COLLECTION ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                    />
                    <T2SText
                        screenName={screenName}
                        id={VIEW_ID.COLLECTION_TEXT}
                        accessibilityState={{ disabled: !collectionAvailable, checked: selectedOrderType === ORDER_TYPE.COLLECTION }}
                        style={
                            collectionAvailable ? orderTypeSelectionStyle.radioButtonText : orderTypeSelectionStyle.radioButtonTextDisable
                        }>
                        {LOCALIZATION_STRINGS.COLLECTION}
                    </T2SText>
                </T2STouchableOpacity>
                {!collectionAvailable &&
                    selectedNotAvailableAddress === ORDER_TYPE.COLLECTION &&
                    this.renderTakeawayNotOpen(ORDER_TYPE.COLLECTION)}
            </View>
        );
    }
    renderDeliveryOption(deliveryAvailable) {
        const { selectedNotAvailableAddress } = this.state;
        const { selectedOrderType } = this.props;
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
                        disabled={!deliveryAvailable}
                        onPress={this.handleDeliveryRadioButton}
                        status={selectedOrderType === ORDER_TYPE.DELIVERY ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                    />
                    <T2SText
                        screenName={screenName}
                        id={VIEW_ID.DELIVERY_TEXT}
                        accessibilityState={{ disabled: !deliveryAvailable, checked: selectedOrderType === ORDER_TYPE.DELIVERY }}
                        style={
                            deliveryAvailable ? orderTypeSelectionStyle.radioButtonText : orderTypeSelectionStyle.radioButtonTextDisable
                        }>
                        {LOCALIZATION_STRINGS.DELIVERY}
                    </T2SText>
                </T2STouchableOpacity>
                {!deliveryAvailable &&
                    selectedNotAvailableAddress === ORDER_TYPE.DELIVERY &&
                    this.renderTakeawayNotOpen(ORDER_TYPE.DELIVERY)}
            </View>
        );
    }

    renderUserLoggedIn(deliveryAvailable) {
        let data = this.props.addressResponse;
        return (
            <T2SView screenName={screenName} id={VIEW_ID.USER_LOGGED_IN_VIEW}>
                {this.renderCurrentLocation(deliveryAvailable)}
                {this.renderCollectionOption()}
                <View style={orderTypeSelectionStyle.divider} />
                {isValidElement(data) && isValidElement(data.data) && data.data.length > 0 ? (
                    <FlatList
                        ref={(ref) => (this.listRef = ref)}
                        style={orderTypeSelectionStyle.addressListViewStyle}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        getItemLayout={this.getItemLayout}
                        data={data.data}
                        renderItem={({ item, index }) => this.renderSavedAddressList(item, deliveryAvailable, index)}
                    />
                ) : (
                    <T2SText id={VIEW_ID.NO_ADDRESS_TEXT} screenName={screenName} style={orderTypeSelectionStyle.noAddressText}>
                        {LOCALIZATION_STRINGS.NO_ADDRESS}
                    </T2SText>
                )}
            </T2SView>
        );
    }

    getItemLayout = (data, index) => ({ length: 60, offset: 60 * index, index });

    renderUserLoggedOut(deliveryAvailable) {
        let { deliveryFor } = this.state;
        let { searchType, countryFlag, askPostCode } = this.props;

        let checkIsPostcodeSearch = isPostCodeSearch(searchType, countryFlag);
        let showEnterPostcode = isCustomer && checkIsPostcodeSearch && askPostCode === 1 && deliveryAvailable;
        return (
            <T2SView screenName={screenName} id={VIEW_ID.USER_LOGGED_OUT_VIEW}>
                {showEnterPostcode && (
                    <View>
                        {this.renderEnterPostcode()}
                        {deliveryFor === DELIVERY_FOR.POSTCODE && this.renderErrorMsg()}
                    </View>
                )}
                {showEnterPostcode && this.renderCurrentLocation(deliveryAvailable)}
                {this.renderDeliveryOption(deliveryAvailable)}
                {this.renderCollectionOption()}
            </T2SView>
        );
    }

    renderEnterPostcode() {
        let { postCode } = this.state;
        const keyboardType = getPostCodeKeyboardType(this.props.s3ConfigResponse);
        return (
            <T2SView style={orderTypeSelectionStyle.searchBarView} screenName={screenName} id={VIEW_ID.SEARCH_BAR}>
                <TextInput
                    screenName={screenName}
                    id={VIEW_ID.SEARCH_BAR_TEXT_INPUT}
                    placeholder={LOCALIZATION_STRINGS.APP_ENTER_POSTCODE}
                    onChangeText={(text) => {
                        this.setState({
                            postCode: text,
                            deliveryFor: ''
                        });
                    }}
                    autoCapitalize={keyboardType.autoCapitalize}
                    keyboardType={keyboardType.keyboardType}
                    onEndEditing={() => {
                        //TODO if we enable this API call then we can't able to select collection option manually
                        // this.handleSearchPostCode();
                    }}
                    value={postCode}
                    autoFocus={false}
                    style={orderTypeSelectionStyle.textInputStyle}
                />
                <T2STouchableOpacity
                    style={orderTypeSelectionStyle.searchIconContainer}
                    screenName={screenName}
                    id={VIEW_ID.SEARCH_ICON_VIEW}
                    onPress={this.handleSearchPostCode}>
                    <T2SIcon id={VIEW_ID.SEARCH_ICON} screenName={screenName} icon={FONT_ICON.SEARCH} size={32} />
                </T2STouchableOpacity>
            </T2SView>
        );
    }

    renderTakeawayNotOpen(orderType) {
        const { storeConfigResponse, isPreOrderEnabled, timezone } = this.props;
        return (
            <T2SText screenName={screenName} id={VIEW_ID.UNSERVICEABLE_POSTCODE_TEXT} style={orderTypeSelectionStyle.nonServiceableAddress}>
                {getTACloseMessage(storeConfigResponse, orderType, isPreOrderEnabled, timezone)}
            </T2SText>
        );
    }

    renderErrorMsg() {
        let { deliveryFor } = this.state;
        return (
            <T2SText
                screenName={screenName}
                id={VIEW_ID.UNSERVICEABLE_POSTCODE_TEXT}
                style={
                    deliveryFor === DELIVERY_FOR.POSTCODE
                        ? orderTypeSelectionStyle.nonServiceablePostCode
                        : orderTypeSelectionStyle.nonServiceableAddress
                }>
                {LOCALIZATION_STRINGS.ERROR_MESSAGE_UNSERVICEABLE_POSTCODE}
            </T2SText>
        );
    }
    renderCurrentLocation(isDeliveryAvailable) {
        let { isUserLoggedIn } = this.props;
        let { deliveryFor } = this.state;
        return (
            <View>
                <View style={orderTypeSelectionStyle.divider} />
                <T2STouchableOpacity
                    screenName={screenName}
                    id={VIEW_ID.RENDER_CURRENT_LOCATION}
                    style={orderTypeSelectionStyle.locationFindViewUserLoggedIn}
                    onPress={this.handleAddAddress}>
                    <T2SIcon
                        screenName={screenName}
                        id={VIEW_ID.GPS_ICON}
                        icon={FONT_ICON.GPS}
                        size={32}
                        color={Colors.ashColor}
                        style={orderTypeSelectionStyle.iconStyle}
                    />
                    <T2SView style={orderTypeSelectionStyle.locationTouchableView} screenName={screenName} id={VIEW_ID.LOCATION_VIEW}>
                        <T2SText id={VIEW_ID.CURRENT_LOCATION_TEXT} screenName={screenName} style={orderTypeSelectionStyle.locationText}>
                            {LOCALIZATION_STRINGS.CURRENT_LOCATION}
                        </T2SText>
                        <T2SText screenName={screenName} id={VIEW_ID.LAT_LONG_TEXT} style={orderTypeSelectionStyle.currentLocationStyle}>
                            {this.getAddress()}
                        </T2SText>
                    </T2SView>
                    {isUserLoggedIn && (
                        <T2STouchableOpacity
                            onPress={this.handleAddAddress}
                            style={orderTypeSelectionStyle.addEditTextContainer}
                            disabled={!isDeliveryAvailable}
                            accessible={false}>
                            <T2SText
                                screenName={screenName}
                                id={VIEW_ID.ADD_ADDRESS_TEXT}
                                style={
                                    isDeliveryAvailable
                                        ? orderTypeSelectionStyle.addEditTextStyle
                                        : orderTypeSelectionStyle.addEditTextDisableStyle
                                }>
                                {LOCALIZATION_STRINGS.ADDRESS_FORM_ADD_ADDRESS}
                            </T2SText>
                        </T2STouchableOpacity>
                    )}
                </T2STouchableOpacity>
                {deliveryFor === DELIVERY_FOR.LOCATION && this.renderErrorMsg()}
            </View>
        );
    }

    getAddress() {
        let { latitude, longitude, address } = this.state;
        let { fullAddress } = this.state;
        if (isValidString(fullAddress)) {
            return fullAddress;
        } else if (isValidString(address)) {
            return address;
        } else if (isValidElement(latitude) && isValidElement(longitude)) {
            return `lat:${latitude} long:${longitude}`;
        } else {
            return LOCALIZATION_STRINGS.ERROR_LOCATION_UNAVAILABLE;
        }
    }

    getLayoutToScroll(item, index) {
        let { selectedAddressId } = this.props;
        if (item.id === selectedAddressId && isValidElement(this.listRef)) {
            this.listRef.scrollToIndex({ index: index });
        }
    }

    renderSavedAddressList(item, isDeliveryAvailable, index) {
        let { deliveryFor, selectedNotAvailableAddress } = this.state;
        let { selectedOrderType, deliveryAddress, selectedInvalidAddressId } = this.props;
        return (
            <View onLayout={() => this.getLayoutToScroll(item, index)}>
                <T2STouchableOpacity
                    id={VIEW_ID.SAVED_ADDRESS}
                    screenName={screenName}
                    style={orderTypeSelectionStyle.addressFlatListView}
                    onPress={this.handleAddressSelected.bind(this, item, isDeliveryAvailable)}>
                    <View style={orderTypeSelectionStyle.addressMainContainer}>
                        <View style={orderTypeSelectionStyle.column_style}>
                            <RadioButton.Android
                                uncheckedColor={Colors.tabGrey}
                                color={Colors.primaryColor}
                                value={item.id}
                                disabled={!isDeliveryAvailable}
                                onPress={this.handleAddressSelected.bind(this, item, isDeliveryAvailable)}
                                status={
                                    selectedOrderType === ORDER_TYPE.DELIVERY &&
                                    isValidElement(deliveryAddress) &&
                                    deliveryAddress.id === item.id
                                        ? CHECKBOX_STATUS.CHECKED
                                        : CHECKBOX_STATUS.UNCHECKED
                                }
                            />
                            <T2SText
                                id={VIEW_ID.ADDRESS_TEXT}
                                screenName={screenName}
                                style={
                                    isDeliveryAvailable ? orderTypeSelectionStyle.addressText : orderTypeSelectionStyle.addressTextDisable
                                }
                                numberOfLines={2}
                                ellipsizeMode="tail">
                                {getFormattedAddress(item)}
                            </T2SText>
                        </View>
                        <View style={orderTypeSelectionStyle.PrimaryTextView}>
                            {item.is_primary === ADDRESS_FORM_TYPE.YES && (
                                <View style={orderTypeSelectionStyle.primaryTextContainer}>
                                    <T2SText
                                        id={VIEW_ID.SET_AS_PRIMARY_ADDRESS_TEXT}
                                        screenName={screenName}
                                        style={
                                            isDeliveryAvailable
                                                ? orderTypeSelectionStyle.primaryText
                                                : orderTypeSelectionStyle.primaryTextDisable
                                        }>
                                        {LOCALIZATION_STRINGS.PRIMARY_ADDRESS}
                                    </T2SText>
                                </View>
                            )}
                        </View>
                    </View>
                </T2STouchableOpacity>
                {deliveryFor === DELIVERY_FOR.ADDRESS && selectedInvalidAddressId === item.id
                    ? this.renderErrorMsg()
                    : !isDeliveryAvailable && selectedNotAvailableAddress === item.id && this.renderTakeawayNotOpen(ORDER_TYPE.DELIVERY)}
                <View style={orderTypeSelectionStyle.divider} />
            </View>
        );
    }

    handleAddAddress() {
        this.props.onOrderTypeModalClose();
        handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {
            viewType: ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS,
            isFromOrderTypeModal: true
        });
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.ADD_ADDRESS_ACTION);
    }

    setModalVisibleState = (isOrderTypeModalVisible) => {
        this.props.showHideOrderTypeAction(isOrderTypeModalVisible);
    };

    handleAddressSelected(item, isDeliveryAvailable) {
        const { basketStoreID, storeConfigId, storeConfigHost } = this.props;
        if (isDeliveryAvailable) {
            if (isValidElement(item) && isValidElement(item.id)) {
                this.setState({
                    selectedAddressId: item.id,
                    selectedAddress: getFormattedAddress(item)
                });
                this.props.deliveryLookupAction(
                    getAddressObj(this.props.s3ConfigResponse, storeConfigHost, item),
                    DELIVERY_FOR.ADDRESS,
                    item.id,
                    getFormattedAddress(item),
                    isSameStore(basketStoreID, storeConfigId)
                );
                Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.ADDRESS_SELECTED, { selectedAddressId: item.id });
            }
        } else {
            this.setState({
                selectedNotAvailableAddress: item.id
            });
        }
    }

    handleSearchPostCode() {
        let { postCode } = this.state;
        if (isValidString(postCode)) {
            let currentPostCode = validatePostcode(postCode, getTakeawayCountryId(this.props.countryId));
            if (isValidPostCode(currentPostCode, getTakeawayCountryId(this.props.countryId))) {
                this.props.deliveryLookupAction(currentPostCode, DELIVERY_FOR.POSTCODE);
                Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.SEARCH_POSTCODE, { postcode: postCode });
            }
        }
    }
    handleDeliveryRadioButton() {
        let { storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery, storeConfigId } = this.props;
        const deliveryAvailable =
            skipForCA(storeConfigId) ||
            isDeliveryAvailableForStore(storeConfigShowDelivery, storeStatusDelivery) ||
            isPreOrderAvailableForDelivery(storeConfigPreOrderDelivery);
        if (deliveryAvailable) {
            if (this.props.selectedOrderType === ORDER_TYPE.DELIVERY) {
                showInfoMessage(LOCALIZATION_STRINGS.DELIVERY_SELECTED);
            } else {
                showInfoMessage(LOCALIZATION_STRINGS.DELIVERY + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED.toLowerCase());
            }
            this.handleOrderTypeChangeAction(ORDER_TYPE.DELIVERY);
            Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.DELIVERY_SELECTED);
        } else {
            this.setState({
                selectedNotAvailableAddress: ORDER_TYPE.DELIVERY
            });
        }
        this.handleOrderTypeChangeAction(ORDER_TYPE.DELIVERY);
        this.props.refreshRecommendation(this.props.ourRecommendation);
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.DELIVERY_SELECTED);
    }

    handleCollectionRadioButton() {
        const { storeConfigPreOrderCollection, storeConfigShowCollection, storeStatusCollection, storeConfigId } = this.props;
        const collectionAvailable =
            skipForCA(storeConfigId) ||
            isCollectionAvailableForStore(storeConfigShowCollection, storeStatusCollection) ||
            isPreOrderAvailableForCollection(storeConfigPreOrderCollection);
        if (collectionAvailable) {
            if (this.props.selectedOrderType === ORDER_TYPE.COLLECTION) {
                showInfoMessage(LOCALIZATION_STRINGS.COLLECTION_SELECTED);
            } else {
                showInfoMessage(LOCALIZATION_STRINGS.COLLECTION + LOCALIZATION_STRINGS.ORDER_TYPE_SELECTED.toLowerCase());
            }
            this.handleOrderTypeChangeAction(ORDER_TYPE.COLLECTION);
            Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.COLLECTION_SELECTED);
        } else {
            this.setState({
                selectedNotAvailableAddress: ORDER_TYPE.COLLECTION
            });
        }
        this.handleOrderTypeChangeAction(ORDER_TYPE.COLLECTION);
        this.props.refreshRecommendation(this.props.ourRecommendation);
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.COLLECTION_SELECTED);
    }

    handleOrderTypeChangeAction(orderType) {
        const { basketStoreID, storeConfigId } = this.props;
        if (isBasketOrder(basketStoreID, storeConfigId)) {
            this.props.updateSelectedOrderType(orderType);
        } else {
            this.props.updateNonBasketOrderType(orderType, null, null, true);
        }
        this.props.onOrderTypeModalClose();
        this.makeChangeAPICall(orderType);
    }

    componentWillUnmount() {
        if (isValidElement(this.keyboardDidShowListener)) {
            this.keyboardDidShowListener.remove();
        }
        if (isValidElement(this.keyboardDidHideListener)) {
            this.keyboardDidHideListener.remove();
        }
    }

    makeChangeAPICall(orderType) {
        const { cartItems, basketStoreID, storeConfigId } = this.props;
        if (cartItems.length > 0 && isSameStore(basketStoreID, storeConfigId)) {
            this.props.makeChangeAction(orderType, true);
        }
    }
}

const mapStateToProps = (state) => ({
    addressResponse: state.addressState.addressResponse,
    s3ConfigResponse: state.appState.s3ConfigResponse,
    postCodeLookupApiStatus: state.addressState.postCodeLookupApiStatus,
    deliveryFor: state.addressState.deliveryFor,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    selectedOrderType: selectOrderType(state),
    selectedAddressId: state.addressState.selectedAddressId,
    selectedInvalidAddressId: state.addressState.selectedInvalidAddressId,
    selectedPostcode: state.addressState.selectedPostcode,
    screenName: state.addressState.screenName,
    showHideOrderType: state.orderManagementState.showHideOrderType,
    askPostCode: selectAskPostCode(state),
    currentLocation: state.addressState.currentLocation,
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    cartItems: selectCartItems(state),
    basketStoreID: state.basketState.storeID,
    deliveryAddress: state.addressState.deliveryAddress,
    storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    storeConfigAskPostcodeFirst: state.appState.storeConfigResponse?.ask_postcode_first,
    storeStatusDelivery: selectDeliveryStatus(state),
    storeStatusCollection: selectCollectionStatus(state),
    storeConfigPreOrderDelivery: selectPreorderDeliveryStatus(state),
    storeConfigPreOrderCollection: selectPreorderCollectionStatus(state),
    storeConfigId: state.appState.storeConfigResponse?.id,
    storeConfigHost: state.appState.storeConfigResponse?.host,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    searchType: state.appState.s3ConfigResponse?.search?.type,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    storeConfigResponse: state.appState.storeConfigResponse,
    isPreOrderEnabled: isPreOrderAvailableSelector(state),
    ourRecommendation: getRecommendationResponse(state),
    timezone: selectTimeZone(state)
});

const mapDispatchToProps = {
    updateSelectedOrderType,
    updateNonBasketOrderType,
    deliveryLookupAction,
    showHideOrderTypeAction,
    makeChangeAction,
    refreshRecommendation
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderTypeSelectionModal);
