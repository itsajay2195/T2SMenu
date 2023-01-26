import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { deleteCardDetailsAction, getCardDetailsAction } from '../Redux/ProfileAction';
import { getPaymentProvider, isValidElement } from 't2sbasemodule/Utils/helpers';
import { SavedCardStyles } from '../Styles/SavedCardDetailsStyle';
import { SCREEN_NAME, VIEW_ID } from '../Utils/ProfileConstants';
import { T2SAppBar } from 't2sbasemodule/UI';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import * as Analytics from '../../AnalyticsModule/Analytics';
import T2SPaginatedFlatList from 't2sbasemodule/UI/CommonUI/T2SPaginatedFlatList';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerCardDetails from './SavedCard';

let timeout;
class SavedCardDetails extends Component {
    constructor(props) {
        super(props);
        this.onRefreshHandle = this.onRefreshHandle.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.handleDeleteAction = this.handleDeleteAction.bind(this);
        this.handleDeleteCardRequestClose = this.handleDeleteCardRequestClose.bind(this);
        this.state = {
            isModalVisible: false,
            refreshState: false,
            cardID: null
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.SAVED_CARDS);
        // Saved card list always from profile screen
        Analytics.logEvent(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.GET_SAVED_CARDS);
        this.onRefreshHandle();
    }
    renderCardDetails(item) {
        if (isValidElement(item)) {
            return (
                <CustomerCardDetails
                    lastDigits={item?.last_4_digits}
                    cardType={item?.card_type}
                    isPrimary={item?.is_primary}
                    expiryDate={item?.expiry_date}
                    id={item?.id}
                    onDeletePressed={this.renderDeleteCardDetails}
                />
            );
        }
    }

    onRefreshHandle() {
        let paymentMode = getPaymentProvider(this.props.storeConfigPaymentProvider);
        if (isValidElement(paymentMode)) {
            this.props.getCardDetailsAction(getPaymentProvider(this.props.storeConfigPaymentProvider));
        }
    }

    renderCardDetailsView() {
        return (
            <T2SView>
                {isValidElement(this.props.savedCardDetails) && this.props.savedCardDetails.length > 0 && (
                    <T2SView>
                        <T2SPaginatedFlatList
                            screenName={SCREEN_NAME.SAVED_CARD_DETAILS}
                            id={VIEW_ID.SAVED_CARDS_FLAT_LIST}
                            onRefresh={this.onRefreshHandle}
                            keyExtractor={(item) => item.id}
                            data={this.props.savedCardDetails}
                            renderItem={({ item }) => this.renderCardDetails(item)}
                            renderHiddenItem={(item) => this.renderHiddenItem(item)}
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
                            showsVerticalScrollIndicator={false}
                            useFlatList
                        />
                    </T2SView>
                )}
            </T2SView>
        );
    }
    renderDeleteCardDetails = (id) => {
        if (isValidElement(id)) {
            this.setState({ isModalVisible: true, cardID: id });
        }
    };

    renderHiddenItem(data) {
        return (
            <View style={SavedCardStyles.deleteButtonViewStyle}>
                <T2STouchableOpacity
                    style={SavedCardStyles.deleteButtonStyle}
                    screenName={SCREEN_NAME.NOTIFICATION_LIST}
                    id={VIEW_ID.NOTIFICATIONS_LIST_ITEM}
                    onPress={this.renderDeleteCardDetails.bind(this, data?.item?.id)}>
                    <View style={SavedCardStyles.deleteButtonStyle}>
                        <T2SText
                            style={SavedCardStyles.deleteTextStyle}
                            id={VIEW_ID.CLEAR_ALL_ITEM_BUTTON}
                            screenName={SCREEN_NAME.NOTIFICATION_LIST}>
                            {LOCALIZATION_STRINGS.APP_DELETE}
                        </T2SText>
                    </View>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderNoCardView() {
        return (
            isValidElement(this.props.savedCardDetails) &&
            this.props.savedCardDetails.length === 0 && (
                <View style={SavedCardStyles.noCardView}>
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshState} onRefresh={this.onRefresh} />} />
                    <View style={SavedCardStyles.noCardView}>
                        <T2SText screenName={SCREEN_NAME.SAVED_CARD_DETAILS} id={VIEW_ID.NO_CARD_TEXT} style={SavedCardStyles.noCardText}>
                            {LOCALIZATION_STRINGS.SAVED_CARDS_NO_CARD_AVAILABLE}
                        </T2SText>
                    </View>
                </View>
            )
        );
    }
    onRefresh() {
        this.onRefreshHandle();
        this.setState({ refreshState: true });
        timeout = setTimeout(() => this.setState({ refreshState: false }), 2000);
    }
    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }
    handleDeleteCardRequestClose() {
        this.setState({ isModalVisible: false });
    }
    renderModal() {
        return (
            <T2SModal
                isVisible={this.state.isModalVisible}
                title={LOCALIZATION_STRINGS.MODAL_DELETE_MESSAGE}
                description={LOCALIZATION_STRINGS.DELETE_CARD_DESCRIPTION}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                requestClose={this.handleDeleteCardRequestClose}
                positiveButtonClicked={this.handleDeleteAction}
                negativeButtonClicked={this.handleDeleteCardRequestClose}
            />
        );
    }

    handleDeleteAction() {
        Analytics.logEvent(ANALYTICS_SCREENS.SAVED_CARDS, ANALYTICS_EVENTS.DELETE_CARD_DETAILS);
        this.setState({ isModalVisible: false });
        this.props.deleteCardDetailsAction(this.state.cardID, getPaymentProvider(this.props.storeConfigPaymentProvider));
    }

    render() {
        return (
            <SafeAreaView style={SavedCardStyles.containerStyle}>
                <T2SAppBar
                    title={LOCALIZATION_STRINGS.SAVED_CARDS}
                    screenName={SCREEN_NAME.SAVED_CARD_DETAILS}
                    id={VIEW_ID.SAVED_CARDS_HEADER}
                />
                {isValidElement(this.props.savedCardDetails) && this.props.savedCardDetails.length > 0
                    ? this.renderCardDetailsView()
                    : this.renderNoCardView()}
                {this.state.isModalVisible && this.renderModal()}
            </SafeAreaView>
        );
    }
}
const mapStateToProps = (state) => ({
    savedCardDetails: state.profileState.savedCardDetails,
    storeConfigPaymentProvider: state.appState.storeConfigResponse?.payment_provider
});
const mapDispatchToProps = {
    getCardDetailsAction,
    deleteCardDetailsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedCardDetails);
