import Modal from 'react-native-modal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { RadioButton } from 'react-native-paper';
import { orderTypeSelectionStyle } from '../../AddressModule/View/styles/OrderTypeSelectionStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import { ADDRESS_FORM_TYPE, SCREEN_NAME, VIEW_ID } from '../../AddressModule/Utils/AddressConstants';
import { FlatList, View } from 'react-native';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import styles from '../../../CustomerApp/View/Style/FlashMessageStyle';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { CHECKBOX_STATUS } from '../../HomeModule/Utils/HomeConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { T2SIcon } from 't2sbasemodule/UI';
import { getFormattedAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { renderFlashMessageIcon } from 't2sbasemodule/Network/NetworkHelpers';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import FlashMessage from 't2sbasemodule/UI/CustomUI/FlashMessageComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { isUKApp } from '../../BaseModule/GlobalAppHelper';
import { selectedAddressAction } from '../Redux/HomeAddressAction';
import { getTakeawayListAction } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';

const screenName = SCREEN_NAME.ADDRESS_SELECTION;

class SelectAddressScreen extends Component {
    constructor(props) {
        super(props);
        this.setSelectedType = this.setSelectedType.bind(this);
        this.handleAddAddress = this.handleAddAddress.bind(this);
        this.handleAddressSelected = this.handleAddressSelected.bind(this);
        this.state = {
            selectedAddress: '',
            selectedAddressId: '',
            showHideAddressSelection: true
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.ADDRESS_SELECTION);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.showHideAddressSelection !== state.showHideAddressSelection) {
            return { ...state, showHideAddressSelection: props.showHideAddressSelection };
        }
        if (props.selectedAddress !== state.selectedAddress) {
            return { ...state, selectedAddress: props.selectedAddress };
        }
        return null;
    }

    render() {
        const { showHideAddressSelection } = this.state;
        return (
            <Modal
                style={orderTypeSelectionStyle.modalStyle}
                isVisible={showHideAddressSelection}
                onModalShow={this.setSelectedType}
                onBackdropPress={this.onPressClose.bind(this)}
                animationInTiming={250}
                backdropTransitionInTiming={0}
                animationOutTiming={250}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating={true}
                useNativeDriver={false}>
                {this.renderCloseIcon()}
                {this.renderAddressSelectionView()}
                <FlashMessage
                    accessible={false}
                    position="top"
                    floating={true}
                    style={styles.flashMessageStyle}
                    renderFlashMessageIcon={renderFlashMessageIcon}
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

    renderAddressSelectionView() {
        return (
            <T2SView style={orderTypeSelectionStyle.modalView} screenName={screenName} id={VIEW_ID.RENDER_ORDER_TYPE}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.IS_DELIVERY_AVAILABLE_TEXT}
                    style={orderTypeSelectionStyle.unAvailDeliveryHeaderText}>
                    {LOCALIZATION_STRINGS.CHOOSE_YOUR_ADDRESS}
                </T2SText>
                {this.renderSavedAddress()}
            </T2SView>
        );
    }

    renderSavedAddress() {
        let data = this.props.addressResponse;
        return (
            <T2SView screenName={screenName} id={VIEW_ID.USER_LOGGED_IN_VIEW}>
                {isValidElement(data) && isValidElement(data.data) && data.data.length > 0 && (
                    <FlatList
                        ref={(ref) => (this.listRef = ref)}
                        style={orderTypeSelectionStyle.addressListViewStyle}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        getItemLayout={this.getItemLayout}
                        data={data.data}
                        renderItem={({ item, index }) => this.renderSavedAddressList(item, index)}
                        ItemSeparatorComponent={() => <View style={orderTypeSelectionStyle.divider} />}
                    />
                )}
                {this.renderAddAddress()}
            </T2SView>
        );
    }

    renderSavedAddressList(item, index) {
        let { selectedAddress } = this.props;
        return (
            <T2STouchableOpacity
                onLayout={() => this.getLayoutToScroll(item, index)}
                id={VIEW_ID.SAVED_ADDRESS}
                screenName={screenName}
                style={orderTypeSelectionStyle.addressFlatListView}
                onPress={this.handleAddressSelected.bind(this, item)}>
                <View style={orderTypeSelectionStyle.column_style}>
                    <RadioButton.Android
                        uncheckedColor={Colors.primaryColor}
                        color={Colors.primaryColor}
                        value={item.id}
                        onPress={this.handleAddressSelected.bind(this, item)}
                        status={
                            isValidElement(selectedAddress) && selectedAddress.id === item.id
                                ? CHECKBOX_STATUS.CHECKED
                                : CHECKBOX_STATUS.UNCHECKED
                        }
                    />
                    <T2SText
                        id={VIEW_ID.ADDRESS_TEXT}
                        screenName={screenName}
                        style={orderTypeSelectionStyle.addressText}
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
                                style={orderTypeSelectionStyle.primaryText}>
                                {LOCALIZATION_STRINGS.PRIMARY_ADDRESS}
                            </T2SText>
                        </View>
                    )}
                </View>
            </T2STouchableOpacity>
        );
    }

    renderAddAddress() {
        return (
            <View>
                <View style={orderTypeSelectionStyle.divider} />
                <T2STouchableOpacity
                    style={orderTypeSelectionStyle.radioButtonView}
                    screenName={screenName}
                    id={VIEW_ID.CHECKBOX_VIEW}
                    onPress={this.handleAddAddress}
                    accessible={false}>
                    <CustomIcon name={FONT_ICON.ADD} size={22} color={Colors.primaryColor} style={{ padding: 10, paddingLeft: 5 }} />
                    <T2SText screenName={screenName} id={VIEW_ID.COLLECTION_TEXT} style={orderTypeSelectionStyle.radioButtonText}>
                        {LOCALIZATION_STRINGS.ADDRESS_FORM_ADD_ADDRESS}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    setSelectedType() {
        const { selectedAddress } = this.props;
        this.setState({
            selectedAddressId: isValidElement(selectedAddress.id) ? selectedAddress.id : ''
        });
    }

    onPressClose() {
        this.props.onAddressSelectionClose();
    }

    getItemLayout = (data, index) => ({ length: 60, offset: 60 * index, index });

    getLayoutToScroll(item, index) {
        let { selectedAddress } = this.props;
        if (item.id === selectedAddress.id && isValidElement(this.listRef)) {
            this.listRef.scrollToIndex({ index: index });
        }
    }

    handleAddressSelected(item) {
        const { selectedAddress, countryId } = this.props;
        if (isValidElement(item)) {
            this.props.selectedAddressAction(item);
            this.onPressClose();
            if (!(isUKApp(countryId) && selectedAddress.postcode === item.postcode)) {
                this.props.getTakeawayListAction(selectedAddress.postcode, false, this.props.selectedOrderType);
                const { countryBaseFeatureGateResponse, countryISO } = this.props;
                Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
                    country_code: countryISO,
                    search: selectedAddress.postcode,
                    method: 'saved_address'
                });
            }
        }
    }

    handleAddAddress() {
        this.onPressClose();
        handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {
            viewType: ADDRESS_FORM_TYPE.ADD
        });
    }
}

const mapStateToProps = (state) => ({
    addressResponse: state.addressState.addressResponse,
    selectedPostcode: state.addressState.selectedPostcode,
    showHideAddressSelection: state.homeAddressState.showHideAddressSelection,
    selectedAddress: state.homeAddressState.selectedAddress,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    countryISO: state.appState.s3ConfigResponse?.country?.iso
});

const mapDispatchToProps = {
    selectedAddressAction,
    getTakeawayListAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAddressScreen);
