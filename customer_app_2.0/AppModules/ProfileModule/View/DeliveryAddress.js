import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import {
    deleteAddressAction,
    getAddressAction,
    selectDeliveryAddressAction,
    updatePrimaryAddressAction,
    resetAddressFromLocationAction
} from '../../AddressModule/Redux/AddressAction';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import styles from '../Styles/DeliveryAddressStyles';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { SCREEN_NAME, VIEW_ID } from '../Utils/ProfileConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ADDRESS_FORM_TYPE, BOOL_CONSTANT } from '../../AddressModule/Utils/AddressConstants';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import T2SPaginatedFlatList from 't2sbasemodule/UI/CommonUI/T2SPaginatedFlatList';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { getFormattedFullAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { deletePrimaryAddressHelper } from '../../AddressModule/Utils/AddressHelpers';
import T2SIcon from '../../../T2SBaseModule/UI/CommonUI/T2SIcon';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import _ from 'lodash';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import DeliveryAddressItem from '../MicroComponents/DeliveryAddressItem';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

class DeliveryAddressScreen extends Component {
    constructor(props) {
        super(props);
        this.onRefreshHandle = this.onRefreshHandle.bind(this);
        this.handleDeleteAddressPositiveButtonClicked = this.handleDeleteAddressPositiveButtonClicked.bind(this);
        this.handleDeleteAddressNegativeButtonClicked = this.handleDeleteAddressNegativeButtonClicked.bind(this);
        this.handleAddressClickedAction = this.handleAddressClickedAction.bind(this);
        this.renderRowContentView = this.renderRowContentView.bind(this);
        this.state = {
            showDeleteModal: false,
            selectedItemId: null
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.DELIVERY_ADDRESS);
        if (this.props.isUserLoggedIn) {
            this.props.getAddressAction();
        }
    }
    handleDeleteAddressPositiveButtonClicked() {
        {
            if (isValidElement(this.state.selectedItemId)) {
                const { deliveryAddress } = this.props;
                if (isValidElement(deliveryAddress) && this.state.selectedItemId === deliveryAddress.id) {
                    this.props.selectDeliveryAddressAction(null);
                }
                let data = this.props.addressResponse.data;
                if (isValidElement(data)) {
                    const filterResult = data.filter((newObj) => {
                        return newObj.is_primary === BOOL_CONSTANT.YES;
                    });
                    if (isValidElement(deletePrimaryAddressHelper(data, filterResult, this.state.selectedItemId))) {
                        this.props.updatePrimaryAddressAction(deletePrimaryAddressHelper(data, filterResult, this.state.selectedItemId));
                    }
                }
                Analytics.logAction(ANALYTICS_SCREENS.DELIVERY_ADDRESS, ANALYTICS_EVENTS.DELETE_ADDRESS);
                this.props.deleteAddressAction(this.state.selectedItemId);
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
            }
            this.setState({ showDeleteModal: false, selectedItemId: null });
        }
    }
    handleDeleteAddressNegativeButtonClicked() {
        this.setState({ showDeleteModal: false, selectedItemId: null });
    }
    renderDeleteAddressModel() {
        return (
            <T2SModal
                id={VIEW_ID.DELETE_ADDRESS_MODAL}
                screenName={SCREEN_NAME.DELIVERY_ADDRESS}
                dialogCancelable={true}
                description={LOCALIZATION_STRINGS.DELETE_ADDRESS_ALERT_MSG}
                isVisible={this.state.showDeleteModal}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                requestClose={this.handleDeleteAddressNegativeButtonClicked}
                positiveButtonClicked={this.handleDeleteAddressPositiveButtonClicked}
                negativeButtonClicked={this.handleDeleteAddressNegativeButtonClicked}
            />
        );
    }

    renderNoInfoView() {
        return (
            <T2SView
                id={VIEW_ID.NO_ADDRESS_AVAILABLE_VIEW}
                screenName={SCREEN_NAME.DELIVERY_ADDRESS}
                style={styles.noAddressContentContainerStyle}>
                <Text style={styles.noInfoTextStyle}>{LOCALIZATION_STRINGS.NO_ADDRESS_AVAILABLE}</Text>
            </T2SView>
        );
    }

    deleteAddress(item, rowMap) {
        if (
            isValidElement(rowMap) &&
            isValidElement(item) &&
            isValidElement(item.id) &&
            _.has(rowMap, item.id) &&
            isValidElement(rowMap[item.id.toString()])
        ) {
            rowMap[item.id.toString()].closeRow();
        }
        this.setState({
            selectedItemId: item.id,
            showDeleteModal: true
        });
    }

    renderContent() {
        if (isValidElement(this.props.addressResponse)) {
            return this.props.addressResponse.data.length > 0 ? this.renderAddressList() : this.renderNoInfoView();
        }
    }

    renderRowContentView({ item }) {
        const address = getFormattedFullAddress(item);
        return (
            <DeliveryAddressItem
                handleAddressClickedAction={this.handleAddressClickedAction}
                itemId={item.id}
                address={address}
                itemPrimary={item.is_primary}
            />
        );
    }

    onRefreshHandle() {
        this.props.getAddressAction();
    }
    renderAddressList() {
        let data = this.props.addressResponse.data;

        return (
            <T2SPaginatedFlatList
                id={VIEW_ID.NOTIFICATIONS_LIST_ITEM}
                screenName={SCREEN_NAME.DELIVERY_ADDRESS}
                showsVerticalScrollIndicator={false}
                onRefresh={this.onRefreshHandle}
                useFlatList
                keyExtractor={(item) => item.id.toString()}
                data={data}
                renderItem={this.renderRowContentView}
                renderHiddenItem={(item, rowMap) => this.renderHiddenView(item, rowMap)}
                disableRightSwipe={true}
                rightOpenValue={-100}
                recalculateHiddenLayout={true}
                onEndReachedThreshold={0.01}
                swipeToOpenPercent={5}
                swipeToClosePercent={5}
                closeOnRowOpen={true}
                closeOnRowBeginSwipe={true}
                closeOnScroll={true}
                closeOnRowPress={true}
            />
        );
    }

    renderHiddenView(data, rowMap) {
        const address = getFormattedFullAddress(data?.item);
        return (
            <View style={styles.deleteButtonStyle} {...setTestId(SCREEN_NAME.DELIVERY_ADDRESS, VIEW_ID.DELETE_ADDRESS)}>
                <T2STouchableOpacity
                    id={address + VIEW_ID.DELETE_ADDRESS}
                    screenName={SCREEN_NAME.DELIVERY_ADDRESS}
                    style={styles.deleteView}
                    onPress={this.deleteAddress.bind(this, data.item, rowMap)}>
                    <T2SText style={styles.deleteText} id={VIEW_ID.DELETE_TEXT} screenName={SCREEN_NAME.DELIVERY_ADDRESS}>
                        {LOCALIZATION_STRINGS.APP_DELETE}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }
    render() {
        return (
            <SafeAreaView style={styles.DeliveryAddressMainView}>
                <T2SAppBar
                    title={LOCALIZATION_STRINGS.ADDRESS_BOOK}
                    actions={
                        <T2SIcon
                            icon={FONT_ICON.ADD}
                            id={VIEW_ID.PLUS}
                            size={25}
                            onPress={() => {
                                Analytics.logAction(ANALYTICS_SCREENS.DELIVERY_ADDRESS, ANALYTICS_EVENTS.ADD_ADDRESS_ACTION);
                                handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {
                                    viewType: ADDRESS_FORM_TYPE.ADD
                                });
                            }}
                            style={styles.addIconStyle}
                            screenName={SCREEN_NAME.DELIVERY_ADDRESS}
                        />
                    }
                />

                {this.state.showDeleteModal ? this.renderDeleteAddressModel() : null}

                <T2SView id={VIEW_ID.ADDRESS_VIEW} style={styles.addressView} screenName={SCREEN_NAME.DELIVERY_ADDRESS}>
                    {this.renderContent()}
                </T2SView>
            </SafeAreaView>
        );
    }

    handleAddressClickedAction(itemId) {
        const { data } = this.props.addressResponse;
        const item = isArrayNonEmpty(data) ? data.find((Data) => Data.id === itemId) : null;
        this.props.resetAddressFromLocationAction();
        handleNavigation(SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name, {
            viewType: ADDRESS_FORM_TYPE.EDIT,
            data: item
        });
    }
}

const mapStateToProps = (state) => ({
    addressResponse: state.addressState.addressResponse,
    deliveryAddress: state.addressState.deliveryAddress,
    isUserLoggedIn: selectHasUserLoggedIn(state)
});
const mapDispatchToProps = {
    getAddressAction,
    deleteAddressAction,
    updatePrimaryAddressAction,
    selectDeliveryAddressAction,
    resetAddressFromLocationAction
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryAddressScreen);
