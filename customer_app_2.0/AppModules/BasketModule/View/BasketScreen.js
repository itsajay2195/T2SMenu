import React, { Component } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SizedBox, T2SAppBar, T2SDivider } from 't2sbasemodule/UI';
import { BASKET_UPDATE_TYPE, SCREEN_NAME, VIEW_ID } from '../Utils/BasketConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import BottomButton from './Components/BottomButton';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import OrderTypeAction from '../../HomeModule/View/components/OrderTypeAction';
import { connect } from 'react-redux';
import {
    autoPresentQCAction,
    fetchingBasketResponse,
    lookupAccountVerifyAction,
    lookupLoyaltyPointsAction,
    networkErrorBasketUpdateAction,
    resetBasket,
    setOrderInstructionsAction,
    setResetToHome,
    updateBasketAction,
    updateStoreIdIntoBasket
} from '../Redux/BasketAction';
import {
    isCustomerApp,
    isFoodHubApp,
    isValidElement,
    isValidNotEmptyString,
    isValidString,
    isArrayNonEmpty,
    getFormattedTAPhoneNumber
} from 't2sbasemodule/Utils/helpers';
import {
    selectCurrencyFromBasket,
    selectHost,
    selectTakeawayName,
    isPreOrderAvailableSelector,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';

import styles from './Styles/BasketScreenStyles';
import {
    selectBanCustomer,
    selectBasketErrors,
    selectBasketItemsDuringNetworkError,
    selectBasketViewComments,
    selectBasketViewItems,
    selectBasketViewResponse,
    selectBasketWarnings,
    selectFreeItemAvailable,
    selectIsCartFetching,
    selectOfferItems,
    selectResetToHomeStatus
} from '../Redux/BasketSelectors';
import {
    containsItemWithCouponNotApplied,
    filterFreeItem,
    showTipsUI,
    tipsEnableCountry,
    getTACloseMessage,
    skipStoreOpenStatus
} from '../Utils/BasketHelper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import * as Analytics from '../../AnalyticsModule/Analytics';
import ContactFreeDelivery from './Components/ContactFreeDelivery';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import {
    prepareForReOrderAction,
    reOrderAction,
    resetReOrderResponseAction,
    showHideOrderTypeAction
} from '../../OrderManagementModule/Redux/OrderManagementAction';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import _, { debounce } from 'lodash';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import TotalSummary from './Components/TotalSummary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { allItemsMissing, oneOrMoreItemsMissing, selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { getWalletBalanceAction } from '../../../FoodHubApp/WalletModule/Redux/WalletAction';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { getWalletStatus, isGlobalTipEnable } from '../../BaseModule/Utils/FeatureGateHelper';
import { isPreOrderEnabled, isWalletPaymentEnabled } from '../../QuickCheckoutModule/Utils/Helper';
import BasketShimmer from './Components/BasketShimmer';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import ReOrderMissingItemModal from '../../OrderManagementModule/View/Components/ReOrderMissingItemModal';
import { StackActions } from '@react-navigation/native';
import { RE_ORDER_TRIGGER_SCREEN } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import CouponRowContainer from './Components/CouponRowContainer';
import BasketList from './Components/BasketList';
import BasketProgressbar from './Components/BasketProgressbar';
import * as appHelper from 't2sbasemodule/Utils/helpers';
import ErrorTextComponent from './Components/MicroComoponent/ErrorTextComponent';
import BasketWaringText from './Components/MicroComoponent/BasketWaringText';
import FreeGiftComponent from './Components/MicroComoponent/FreeGiftComponent';
import AllergyTextComponent from './Components/MicroComoponent/AllergyTextComponent';
import OfferItemTextComponent from './Components/MicroComoponent/OfferItemTextComponent';
import NotApplicableTextComponent from './Components/MicroComoponent/NotApplicableTextComponent';
import InstuctionsTextFieldComponent from './Components/MicroComoponent/InstuctionsTextFieldComponent';
import { selectCollectionStatus, selectDeliveryStatus } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { isNashTakeaway, isTakeawayOpen } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { getBasketRecommendations } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsAction';
import DriverTips from './Components/DriverTips';
import { PAYMENT_TYPE } from '../../QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { ADDRESS_FORM_TYPE } from '../../AddressModule/Utils/AddressConstants';
import { resetAddressFromLocationAction } from '../../AddressModule/Redux/AddressAction';
import { isUKApp } from '../../BaseModule/GlobalAppHelper';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { trackOrderPlacedEvent } from '../../QuickCheckoutModule/Redux/QuickCheckoutAction';
import { updateUserPaymentMode } from '../../BasketModule/Redux/BasketAction';

let SCREEN_HEIGHT = Dimensions.get('window').height,
    orderTypeTimeout,
    focusTimeout;
let screenName = SCREEN_NAME.BASKET_SCREEN;

class BasketScreen extends Component {
    constructor(props) {
        super(props);
        this.handleLeftActionClicked = this.handleLeftActionClicked.bind(this);
        this.handleBackAction = this.handleBackAction.bind(this);
        this.handleCheckoutClicked = this.handleCheckoutClicked.bind(this);
        this.updateAllergyInfo = this.updateAllergyInfo.bind(this);
        this.hideBanCustomerModal = this.hideBanCustomerModal.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
        this.handleAllergyOnPress = this.handleAllergyOnPress.bind(this);
        this.handleAllergyInfoNegativeButtonClicked = this.handleAllergyInfoNegativeButtonClicked.bind(this);
        this.handleAllergyInfoPositiveButtonClicked = this.handleAllergyInfoPositiveButtonClicked.bind(this);
        this.handleCheckoutButtonClicked = this.handleCheckoutButtonClicked.bind(this);
        this.instructionOnEndEditing = this.instructionOnEndEditing.bind(this);
        this.instructionsOnFocus = this.instructionsOnFocus.bind(this);
        this.instructionOnBlure = this.instructionOnBlure.bind(this);
        this.inputRef = this.inputRef.bind(this);
        this.instructionOnChangeText = this.instructionOnChangeText.bind(this);
        this.handleOrderTypeCLick = this.handleOrderTypeCLick.bind(this);
        this.state = {
            redeem: isValidElement(this.props.redeemAmount) || this.props.isRedeemApplied,
            allergyInfo: isValidElement(this.props.comments) ? this.props.comments : '',
            isKeyBoardShown: false,
            showCouponRemoveModal: false,
            hideErrorAndWarningView: false,
            isAllergyModalVisible: false,
            selectedOrderType: this.props.selectedOrderType,
            banCustomer: false,
            isProfileUpdated: null,
            showAllItemsMissingModal: false,
            showOneOrMoreItemMissingModal: false,
            showTakeawayClosedModal: false,
            showReplaceBasketModal: false,
            showSwitchOrderTypeModal: false,
            isBackPressed: false,
            goBack: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { showAllItemsMissingModal, showOneOrMoreItemMissingModal } = nextProps;
        let value = {};
        if (prevState.showAllItemsMissingModal !== showAllItemsMissingModal) {
            value.showAllItemsMissingModal = showAllItemsMissingModal;
        }
        if (prevState.showOneOrMoreItemMissingModal !== showOneOrMoreItemMissingModal) {
            value.showOneOrMoreItemMissingModal = showOneOrMoreItemMissingModal;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        const { comments, route } = this.props;
        const { isProfileUpdated, isFromReOrder, reOrderActionParams } = isValidElement(route?.params) && route.params;
        this.props.getBasketRecommendations();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.props.lookupAccountVerifyAction(this.props.profileResponse.phone, this.props.navigation);
        if (isValidElement(this.props.networkErrorItems)) {
            const { networkErrorItems } = this.props;
            networkErrorItems.forEach((element) => {
                this.props.networkErrorBasketUpdateAction(element);
            });
        }

        if (isValidElement(isFromReOrder) && isValidElement(reOrderActionParams) && isValidElement(reOrderActionParams.orderId)) {
            this.props.fetchingBasketResponse(true);
            this.props.reOrderAction(
                reOrderActionParams.orderId,
                reOrderActionParams.storeID,
                reOrderActionParams.sending,
                reOrderActionParams.navigation
            );
        } else {
            this.props.updateBasketAction(BASKET_UPDATE_TYPE.VIEW, this.state.allergyInfo);
        }

        if (isCustomerApp()) {
            this.props.lookupLoyaltyPointsAction();
        }
        if (
            (isFoodHubApp() && getWalletStatus(this.props.countryBaseFeatureGateResponse)) ||
            isWalletPaymentEnabled(this.props.storeConfigWalletEnabled, this.props.countryBaseFeatureGateResponse)
        ) {
            this.props.getWalletBalanceAction();
        }
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            this.setState({ hideErrorAndWarningView: true });
        });

        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.setState({ hideErrorAndWarningView: false });
            if (isValidElement(isProfileUpdated) && this.state.isProfileUpdated !== isProfileUpdated) {
                this.setState({ isProfileUpdated: isProfileUpdated });
                this.handleCheckoutClicked();
            }
            if (isValidString(comments)) {
                this.setState({ allergyInfo: comments });
            }
        });
    }

    componentWillUnmount() {
        if (isValidElement(this.keyboardDidShowListener)) {
            this.keyboardDidShowListener.remove();
        }
        if (isValidElement(this.keyboardDidHideListener)) {
            this.keyboardDidHideListener.remove();
        }
        this.props.fetchingBasketResponse(false);
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(focusTimeout)) {
            clearTimeout(focusTimeout);
        }
        if (isValidElement(orderTypeTimeout)) {
            clearTimeout(orderTypeTimeout);
        }
    }

    _keyboardDidShow() {
        this.setState({ isKeyBoardShown: true });
    }

    _keyboardDidHide() {
        Keyboard.dismiss();
        this.setState({ isKeyBoardShown: false });
        if (isValidElement(this.allergyRef)) {
            this.allergyRef.blur();
        }
    }

    componentDidUpdate(prevProps) {
        const { resetToHome, autoPresentQC, selectedOrderType, isCartFetching, route, comments } = this.props;
        if (selectedOrderType !== prevProps.selectedOrderType && !isCartFetching) {
            this.props.updateBasketAction(BASKET_UPDATE_TYPE.VIEW, this.state.allergyInfo);
        }
        if (autoPresentQC && autoPresentQC !== prevProps.autoPresentQC && !this.state.isBackPressed) {
            this.handleCheckoutClicked();
        }
        if (resetToHome !== prevProps.resetToHome && resetToHome) {
            this.resetHome();
        }
        if (
            isValidElement(route?.params?.isFromReOrder) &&
            route.params.isFromReOrder &&
            prevProps?.comments !== comments &&
            isValidString(comments)
        ) {
            this.instructionOnChangeText(comments);
        }
    }
    handleOrderTypeCLick() {
        const {
            storeConfigShowCollection,
            storeConfigShowDelivery,
            storeStatusCollection,
            storeStatusDelivery,
            storeConfigPreOrder,
            countryBaseFeatureGateResponse
        } = this.props;
        if (
            skipStoreOpenStatus(countryBaseFeatureGateResponse) ||
            isTakeawayOpen(storeConfigShowDelivery, storeStatusDelivery, storeConfigShowCollection, storeStatusCollection) ||
            isPreOrderEnabled(storeConfigPreOrder)
        ) {
            Analytics.logAction(ANALYTICS_SCREENS.BASKET_SCREEN, ANALYTICS_EVENTS.ORDER_TYPE);
            this.props.showHideOrderTypeAction(true);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_MESSAGE);
        }
    }
    render() {
        if (this.state.goBack) {
            return <T2SView />;
        }
        return (
            <SafeAreaView style={styles.rootContainer}>
                <T2SAppBar
                    showElevation={true}
                    title={this.basketTitle()}
                    handleLeftActionPress={this.handleLeftActionClicked}
                    actions={
                        <OrderTypeAction
                            key={VIEW_ID.COLLECTION_DELIVERY_ICON}
                            orderType={this.props.selectedOrderType}
                            onPress={this.handleOrderTypeCLick}
                            screenName={SCREEN_NAME.HOME_SCREEN}
                        />
                    }
                />
                {this.renderLoader()}
                {this.renderBody()}
                {this.state.isAllergyModalVisible && this.renderAllergyInfoModal()}
                {this.renderBanCustomerModel()}
                {this.renderReOrderPopUpModal()}
            </SafeAreaView>
        );
    }
    checkTakeawayCloseTime(storeConfigOnlineClosedMessage) {
        if (isValidElement(storeConfigOnlineClosedMessage)) {
            const infoMessage = storeConfigOnlineClosedMessage;
            const preOrderMessage = this.props.isPreOrderEnabled ? ' ' + LOCALIZATION_STRINGS.PREORDER_AVAILABLE : '';
            return this.renderTakeawayCloseInfo(infoMessage + preOrderMessage);
        } else return null;
    }

    renderTakeawayCloseInfo(infoMessage) {
        return (
            <View style={styles.takeawayCloseInfoMessageViewStyle}>
                <T2SIcon name={FONT_ICON.SHEILD} size={40} style={styles.sheildIconStyle} screenName={SCREEN_NAME.HOME_SCREEN} />
                <T2SText
                    style={styles.takeawayCloseInfoMessageTextStyle}
                    id={VIEW_ID.TAKEAWAY_CLOSE_INFO_MESSAGE}
                    screenName={SCREEN_NAME.HOME_SCREEN}>
                    {infoMessage}
                </T2SText>
            </View>
        );
    }

    handleLeftActionClicked = debounce(
        () => {
            this.handleBackAction();
        },
        2000,
        { leading: true, trailing: false }
    );

    basketTitle() {
        const { route, isCartFetching, cartItems, prevStoreConfigResponse, takeawayName, storeConfigId } = this.props;
        if (
            isValidElement(route) &&
            isValidElement(route.params) &&
            isValidElement(route.params.isFromReOrder) &&
            route.params.isFromReOrder
        ) {
            return isValidElement(cartItems) && cartItems.length > 0 && !isCartFetching ? this.props.takeawayName : '';
        } else if (
            isValidElement(prevStoreConfigResponse) &&
            isValidElement(storeConfigId) &&
            storeConfigId !== prevStoreConfigResponse.id &&
            isValidElement(prevStoreConfigResponse.name)
        ) {
            return prevStoreConfigResponse.name;
        }
        return takeawayName;
    }
    renderReOrderPopUpModal() {
        const { route, storeConfigId } = this.props;
        if (
            isValidElement(route) &&
            isValidElement(route.params) &&
            isValidElement(route.params.isFromReOrder) &&
            route.params.isFromReOrder &&
            isValidElement(route.params.reOrderActionParams)
        ) {
            const { reOrderActionParams } = route.params;
            return (
                <ReOrderMissingItemModal
                    takeawayClosedModalVisible={this.props.showTakeawayClosedModal}
                    replaceBasketModalVisible={this.props.showReplaceBasketModal}
                    allItemMissingModalVisible={this.state.showAllItemsMissingModal}
                    orderTypeSwitchModalVisible={this.props.showSwitchOrderTypeModal}
                    oneOrMoreItemMissingModalVisible={this.state.showOneOrMoreItemMissingModal}
                    hideAllItemMissingModal={() => this.setState({ showAllItemsMissingModal: false })}
                    hideOneOrMoreItemMissingModal={() => this.setState({ showOneOrMoreItemMissingModal: false })}
                    orderType={reOrderActionParams.sending}
                    oreOrderStoreID={reOrderActionParams.storeID}
                    navigation={reOrderActionParams.navigation}
                    orderID={reOrderActionParams.orderId}
                    reOrderSourceScreen={reOrderActionParams.reOrderFrom}
                    showOneOrMoreItemModalPositiveTapped={() => {
                        if (isValidElement(storeConfigId)) {
                            this.props.updateStoreIdIntoBasket(storeConfigId);
                            this.props.updateBasketAction(BASKET_UPDATE_TYPE.VIEW, this.state.allergyInfo);
                            this.setState({ showOneOrMoreItemMissingModal: false });
                            this.props.resetReOrderResponseAction();
                        }
                    }}
                    rePlaceBasketPositiveButtonTapped={() => {}}
                    switchOrderTypePositiveButtonTapped={(switchedOrderType) => {
                        orderTypeTimeout = setTimeout(() => {
                            this.props.prepareForReOrderAction(
                                reOrderActionParams.orderId,
                                reOrderActionParams.storeID,
                                reOrderActionParams.navigation,
                                switchedOrderType
                            );
                        }, 700);
                    }}
                />
            );
        }
    }
    renderBody() {
        const { cartItems, isCartFetching, storeConfigOnlineClosedMessage } = this.props;
        if (isValidElement(cartItems) && cartItems.length > 0 && !isCartFetching) {
            return (
                <KeyboardAvoidingView
                    style={styles.bodyContainer}
                    keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    accessible={false}>
                    {this.checkTakeawayCloseTime(storeConfigOnlineClosedMessage)}
                    <T2SText style={styles.title} screenName={screenName} id={VIEW_ID.SUB_HEADING}>
                        {LOCALIZATION_STRINGS.YOUR_BASKET.toUpperCase()}
                    </T2SText>
                    {this.renderErrorOrWarnings()}
                    <ScrollView style={styles.rootContainer} keyboardShouldPersistTaps="handled" ref={(ref) => (this.scrollView = ref)}>
                        {this.renderFlatList()}
                        <CouponRowContainer
                            onLayout={(event) => (this.couponLayout = event.nativeEvent.layout)}
                            navigation={this.props.navigation}
                            onFocus={this.handleCouponOnFocus.bind(this)}
                        />
                        <SizedBox
                            style={[styles.sizedBoxStyle, { marginTop: 10 }]}
                            height={5}
                            onLayout={(event) => (this.layout = event.nativeEvent.layout)}
                        />
                        {this.renderDriverTips()}
                        <SizedBox style={styles.sizedBoxStyle} height={5} />
                        <TotalSummary screenName={screenName} />
                        <SizedBox style={styles.sizedBoxStyle} height={5} />
                        {this.renderAllergyInfo()}
                        <View style={styles.staticHeight} />
                    </ScrollView>
                    <View
                        style={[
                            styles.bottomContainer,
                            this.state.isKeyBoardShown ? { flex: 0.25 } : { flex: 0.15 },
                            this.state.isKeyBoardShown && Platform.OS === 'ios' && { paddingTop: SCREEN_HEIGHT / 29 }
                        ]}>
                        <BottomButton addItemClicked={this.handleBackAction} checkoutClicked={this.handleCheckoutButtonClicked} />
                    </View>
                </KeyboardAvoidingView>
            );
        } else {
            return <BasketShimmer />;
        }
    }
    handleCheckoutButtonClicked() {
        this._keyboardDidHide();
        const { banCustomer } = this.props;
        if (banCustomer) {
            this.setState({ banCustomer: true });
        } else {
            this.handleCheckoutClicked();
        }
    }

    handleBackAction() {
        this.props.autoPresentQCAction(false);
        if (!this.state.goBack) {
            this.setState({ goBack: true, isBackPressed: true });
            const { route, basketResponse } = this.props;
            if (
                isValidElement(route) &&
                isValidElement(route.params) &&
                isValidElement(route.params.isFromReOrder) &&
                route.params.isFromReOrder &&
                isValidElement(
                    route.params.reOrderActionParams && route.params.reOrderActionParams.reOrderFrom !== RE_ORDER_TRIGGER_SCREEN.MENU_SCREEN
                )
            ) {
                this.props.navigation.dispatch(
                    StackActions.replace(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
                        isFromReOrder: route.params.isFromReOrder
                    })
                );
                return;
            }
            if (isValidElement(basketResponse) && this.state.allergyInfo !== basketResponse?.comments) {
                this.updateAllergyInfo();
            }
            this.props.navigation.goBack();
        }
    }

    handleCheckoutClicked(params = {}) {
        let { profileResponse, route, isSavedAddress, selectedAddress, countryId, assignDriverThrough } = this.props;
        let { first_name, last_name, email, phone } = isValidElement(profileResponse) && profileResponse;
        const { isFromReOrder } = isValidElement(route?.params) && route.params;
        this.props.setOrderInstructionsAction(this.state.allergyInfo);
        if (isNashTakeaway(assignDriverThrough)) {
            this.props.updateUserPaymentMode(PAYMENT_TYPE.CARD);
        }
        if (isValidNotEmptyString(first_name) && isValidNotEmptyString(last_name) && isValidString(email) && isValidString(phone)) {
            if (
                isValidElement(this.props.accountVerified) &&
                isValidString(this.props.accountVerified.outcome) &&
                this.props.accountVerified.outcome.toLowerCase() === T2SBaseConstants.SUCCESS.toLowerCase()
            ) {
                if (isValidElement(isFromReOrder) && isFromReOrder) {
                    params.isFromReOrder = isFromReOrder;
                }
                if (isUKApp(countryId) && isValidElement(isSavedAddress) && !isSavedAddress && isValidElement(selectedAddress)) {
                    this.props.resetAddressFromLocationAction();
                    handleNavigation(SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name, {
                        viewType: ADDRESS_FORM_TYPE.QC,
                        data: selectedAddress
                    });
                } else {
                    this.props.navigation.navigate(SCREEN_OPTIONS.QUICK_CHECKOUT.route_name, params);
                    this.props.trackOrderPlacedEvent('', true);
                }
            } else {
                this.props.lookupAccountVerifyAction(this.props.profileResponse.phone, this.props.navigation);
            }
        } else {
            handleNavigation(SCREEN_OPTIONS.PROFILE.route_name, {
                screen: SCREEN_OPTIONS.PROFILE.route_name,
                params: { verified: false, isUpdateProfile: true, isFromReOrder: isFromReOrder }
            });
        }
    }

    handleGiftItemTapped = debounce(
        () => {
            const { host, menuResponse } = this.props;
            const freeItems = filterFreeItem(host, menuResponse);
            this.props.navigation.navigate(SCREEN_OPTIONS.FREE_GIFT_ITEMS.route_name, {
                showBackButton: true,
                freeItems: freeItems
            });
        },
        300,
        { leading: true, trailing: false }
    );

    renderFlatList() {
        return <BasketList />;
    }

    updateAllergyInfo() {
        this.props.updateBasketAction(BASKET_UPDATE_TYPE.ALLERGY_INFO, this.state.allergyInfo);
    }
    instructionsOnFocus() {
        this.setState({ isKeyBoardShown: true });
        this.focusTimeout = setTimeout(() => {
            if (isValidElement(this.scrollView)) {
                this.scrollView.scrollToEnd({ animated: true });
            }
        }, 600);
    }
    handleCouponOnFocus() {
        if (isValidElement(this.scrollView)) {
            this.scrollView.scrollTo({ y: this.couponLayout.y, animated: true });
        }
    }
    driverTipsOnFocus() {
        this.focusTimeout = setTimeout(() => {
            if (isValidElement(this.scrollView)) {
                this.scrollView.scrollTo({ y: this.layout.y, animated: true });
            }
        }, 600);
    }
    instructionOnEndEditing() {
        Analytics.logEvent(ANALYTICS_SCREENS.BASKET_SCREEN, ANALYTICS_EVENTS.DELIVERY_INSTRUCTIONS);
        this.updateAllergyInfo();
    }
    instructionOnBlure() {
        this.setState({ isKeyboardShown: false });
    }
    instructionOnChangeText(text) {
        this.setState({ allergyInfo: text });
    }
    inputRef(ref) {
        this.allergyRef = ref;
    }
    renderAllergyInfo() {
        const { cartItems } = this.props;
        return (
            <View style={styles.allergyInfoContainer}>
                {this.renderFreeGiftView()}
                <InstuctionsTextFieldComponent
                    screenName={screenName}
                    allergyInfo={this.state.allergyInfo}
                    onEndEditing={this.instructionOnEndEditing}
                    onFocus={this.instructionsOnFocus}
                    onBlur={this.instructionOnBlure}
                    ref={this.inputRef}
                    onChangeText={this.instructionOnChangeText}
                />
                <AllergyTextComponent screenName={screenName} handleAllergyOnPress={this.handleAllergyOnPress} />
                {isValidElement(this.props.hasOfferItems) && <OfferItemTextComponent screenName={screenName} />}
                {containsItemWithCouponNotApplied(cartItems) && <NotApplicableTextComponent screenName={screenName} />}
            </View>
        );
    }

    handleAllergyOnPress() {
        Analytics.logEvent(ANALYTICS_SCREENS.BASKET_SCREEN, ANALYTICS_EVENTS.ALLERGY_INFORMATION_CLICKED);
        this.setState({ isAllergyModalVisible: true });
    }
    handleAllergyInfoNegativeButtonClicked() {
        this.setState({ isAllergyModalVisible: false });
    }
    handleAllergyInfoPositiveButtonClicked() {
        this.setState({ isAllergyModalVisible: false });
        handleNavigation(SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name, { showBackButton: true });
    }
    renderAllergyInfoModal() {
        return (
            <T2SModal
                screenName={screenName}
                title={LOCALIZATION_STRINGS.ALLERGY_POPUP.toUpperCase()}
                requestClose={() => this.setState({ isAllergyModalVisible: false })}
                titleTextStyle={styles.allergyModalTitle}
                isVisible={this.state.isAllergyModalVisible}
                description={this.renderAllergyContent()}
                descriptionTextStyle={styles.allergyDescription}
                negativeButtonText={LOCALIZATION_STRINGS.OKAY}
                positiveButtonText={LOCALIZATION_STRINGS.FAQ_PAGE}
                negativeButtonClicked={this.handleAllergyInfoNegativeButtonClicked}
                positiveButtonClicked={this.handleAllergyInfoPositiveButtonClicked}
            />
        );
    }

    renderAllergyContent() {
        const { storeConfigPhone, countryIso } = this.props;
        if (isValidElement(storeConfigPhone)) {
            return (
                <T2SText style={styles.allergyTextContainer}>
                    {LOCALIZATION_STRINGS.ALLERGY_MODAL_DESCRIPTION1}
                    <T2SText onPress={this.handlePhoneNumber} style={styles.taPhoneStyle}>
                        {getFormattedTAPhoneNumber(storeConfigPhone, countryIso)}
                    </T2SText>
                    {LOCALIZATION_STRINGS.ALLERGY_MODAL_DESCRIPTION2}
                </T2SText>
            );
        } else {
            return LOCALIZATION_STRINGS.ALLERGY_MODAL_DESCRIPTION;
        }
    }

    handlePhoneNumber() {
        const { storeConfigPhone, countryIso } = this.props;
        this.setState({ isAllergyModalVisible: false });
        appHelper.callDialPad(getFormattedTAPhoneNumber(storeConfigPhone, countryIso));
    }

    renderFreeGiftView() {
        const { host, menuResponse, isGiftItemAvailable, freeItemClicked } = this.props;
        const freeItems = filterFreeItem(host, menuResponse);

        if (isGiftItemAvailable && !freeItemClicked && freeItems.length > 0) {
            return <FreeGiftComponent screenName={screenName} handleGiftItemTapped={this.handleGiftItemTapped} />;
        }
    }
    renderErrorOrWarnings() {
        const { basketError, basketWarnings } = this.props;
        const { hideErrorAndWarningView } = this.state;
        if (hideErrorAndWarningView) {
            return null;
        }
        if (isValidElement(basketError) && isValidElement(basketWarnings)) {
            return (
                <View>
                    {this.renderError()}
                    <T2SDivider />
                    {this.renderWarning()}
                </View>
            );
        } else if (isValidElement(basketError)) {
            return this.renderError();
        } else if (isValidElement(basketWarnings)) {
            return this.renderWarning();
        }
    }
    renderWarning() {
        return <BasketWaringText basketWarnings={this.props.basketWarnings} screenName={screenName} />;
    }
    renderError() {
        return <ErrorTextComponent screenName={screenName} basketError={this.props.basketError} />;
    }
    renderContactFreeDelivery() {
        const { selectedOrderType } = this.props;
        if (isValidElement(selectedOrderType) && selectedOrderType === ORDER_TYPE.DELIVERY) {
            return (
                <T2SView style={styles.contactFreeContainer}>
                    <ContactFreeDelivery screenName={screenName} analyticsScreenName={ANALYTICS_SCREENS.BASKET_SCREEN} />
                    {this.state.isKeyBoardShown && <View style={styles.staticHeight} />}
                </T2SView>
            );
        }
    }

    resetHome() {
        this.props.navigation.popToTop();
        this.props.setResetToHome(false);
    }

    hideBanCustomerModal() {
        this.setState({ banCustomer: false });
    }

    renderBanCustomerModel() {
        return (
            <T2SModal
                id={VIEW_ID.BAN_CUSTOMER_MODAL}
                screenName={screenName}
                dialogCancelable={true}
                title={''}
                description={LOCALIZATION_STRINGS.BAN_CUSTOMER_DESCRIPTION}
                isVisible={this.state.banCustomer}
                positiveButtonText={LOCALIZATION_STRINGS.OK}
                negativeButtonText={''}
                requestClose={this.hideBanCustomerModal}
                positiveButtonClicked={this.hideBanCustomerModal}
            />
        );
    }

    renderLoader() {
        return <BasketProgressbar />;
    }

    renderDriverTips() {
        const { selectedOrderType, payment_mode, driverTipsList, globalTip, countryBaseFeatureGateResponse, globalTipsEnable } = this.props;
        if (
            tipsEnableCountry(globalTipsEnable) &&
            isGlobalTipEnable(countryBaseFeatureGateResponse) &&
            isArrayNonEmpty(driverTipsList) &&
            payment_mode !== PAYMENT_TYPE.CASH &&
            showTipsUI(globalTip, selectedOrderType)
        ) {
            return <DriverTips onFocus={this.driverTipsOnFocus.bind(this)} />;
        }
    }
}

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromBasket(state),
    cartItems: selectBasketViewItems(state),
    basketError: selectBasketErrors(state),
    menuResponse: state.menuState.menuResponse,
    host: selectHost(state),
    basketWarnings: selectBasketWarnings(state),
    networkErrorItems: selectBasketItemsDuringNetworkError(state),
    comments: selectBasketViewComments(state),
    selectedOrderType: selectOrderType(state),
    resetToHome: selectResetToHomeStatus(state),
    profileResponse: state.profileState.profileResponse,
    hasOfferItems: selectOfferItems(state),
    takeawayName: selectTakeawayName(state),
    accountVerified: state.authState.accountVerified,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    banCustomer: selectBanCustomer(state),
    showReplaceBasketModal: state.orderManagementState.showReplaceBasketModal,
    showTakeawayClosedModal: state.orderManagementState.showTakeawayClosedModal,
    showSwitchOrderTypeModal: state.orderManagementState.showSwitchOrderTypeModal,
    showAllItemsMissingModal: allItemsMissing(state),
    showOneOrMoreItemMissingModal: oneOrMoreItemsMissing(state),
    isCartFetching: selectIsCartFetching(state),
    autoPresentQC: state.basketState.autoPresentQC,
    isGiftItemAvailable: selectFreeItemAvailable(state),
    freeItemClicked: state.basketState.freeItemClicked,
    prevStoreConfigResponse: state.appState.prevStoreConfigResponse,
    storeConfigWalletEnabled: state.appState.storeConfigResponse?.wallet_payment,
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigId: state.appState.storeConfigResponse?.id,
    storeConfigPhone: state.appState.storeConfigResponse?.phone,
    storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    storeStatusCollection: selectCollectionStatus(state),
    storeStatusDelivery: selectDeliveryStatus(state),
    storeConfigPreOrder: state.appState.storeConfigResponse?.preorder,
    basketResponse: selectBasketViewResponse(state),
    payment_mode: state.basketState.payment_mode,
    driverTipsList: state.appState.s3ConfigResponse?.driver_tip,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    assignDriverThrough: state.appState.storeConfigResponse?.assign_driver_through,
    isSavedAddress: state.takeawayListReducer.isSavedAddress,
    selectedAddress: state.takeawayListReducer.selectedAddress,
    globalTip: state.appState.storeConfigResponse?.global_tip,
    globalTipsEnable: state.appState.s3ConfigResponse?.global_tip,
    storeConfigOnlineClosedMessage: getTACloseMessage(
        state.appState.storeConfigResponse,
        selectOrderType(state),
        isPreOrderAvailableSelector(state),
        selectTimeZone(state)
    ),
    isPreOrderEnabled: isPreOrderAvailableSelector(state)
});

const mapDispatchToProps = {
    lookupLoyaltyPointsAction,
    updateBasketAction,
    networkErrorBasketUpdateAction,
    showHideOrderTypeAction,
    setResetToHome,
    getWalletBalanceAction,
    lookupAccountVerifyAction,
    setOrderInstructionsAction,
    updateStoreIdIntoBasket,
    reOrderAction,
    prepareForReOrderAction,
    fetchingBasketResponse,
    resetReOrderResponseAction,
    getBasketRecommendations,
    resetAddressFromLocationAction,
    autoPresentQCAction,
    trackOrderPlacedEvent,
    resetBasket,
    updateUserPaymentMode
};

export default connect(mapStateToProps, mapDispatchToProps)(BasketScreen);
