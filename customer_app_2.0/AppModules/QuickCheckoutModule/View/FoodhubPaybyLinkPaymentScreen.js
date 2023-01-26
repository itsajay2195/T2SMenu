import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import styles from '../View/Styles/FullPagePaymentCheckoutStyles';
import T2STouchableOpacity from '../../../T2SBaseModule/UI/CommonUI/T2STouchableOpacity';
import T2SText from '../../../T2SBaseModule/UI/CommonUI/T2SText';
import { PAYMENT_TYPE, SCREEN_NAME, VIEW_ID } from '../Utils/QuickCheckoutConstants';
import { getSavedCardStatus, getWalletStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { isSavedCardAvailable } from '../../BasketModule/Utils/BasketHelper';
import T2SPaginatedFlatList from '../../../T2SBaseModule/UI/CommonUI/T2SPaginatedFlatList';
import { getOrderDetailsAction } from '../../OrderManagementModule/Redux/OrderManagementAction';
import {
    selectAddress1FromPBLOrder,
    selectAddress2FromPBLOrder,
    selectCurrencyFromPBLOrder,
    selectHousenoFromPBLOrder,
    selectMerchantIdFromPBLOrder,
    selectOrderDetailsResponse,
    selectSendingType,
    selectStoreIdFromPBLOrder,
    selectTakeawayNameFromPBLOrder,
    selectTotalFromPBLOrder
} from '../Utils/QCSelector';
import { isApplePayEnabled, isCardPaymentEnabled, isGooglePayEnabled } from '../Utils/Helper';
import CheckoutBottomButton from './MicroComponents/CheckoutBottomButton';
import _, { debounce } from 'lodash';
import {
    proceedCheckoutAction,
    proceedToPayment,
    resetCvvAction,
    restartQuickCheckout,
    updateCvvAction
} from '../Redux/QuickCheckoutAction';
import { isIOS } from '../../BaseModule/Helper';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { VIEW_ORDER_SOURCE } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import { getTAURL } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import FoodhubWalletComponent from './MicroComponents/FoodhubWalletComponent';
import PaymentTitleHeader from './MicroComponents/PaymentTitleHeader';
import CardListItemComponent from './MicroComponents/CardListItemComponent';
import { CHECKBOX_STATUS } from '../../HomeModule/Utils/HomeConstants';
import { getPaymentProvider, isFoodHubApp, isValidElement, isValidString, safeFloatRoundedValue } from 't2sbasemodule/Utils/helpers';
import { getCardDetailsAction, getProfileAction, resetPBLAction } from '../../ProfileModule/Redux/ProfileAction';
import { getWalletBalanceAction } from '../../../FoodHubApp/WalletModule/Redux/WalletAction';
import CvvModal from 't2sbasemodule/UI/CustomUI/CvvModal/CvvModal';
import { resetBasket, updateUserSelectedCardId } from '../../BasketModule/Redux/BasketAction';

let screenName = SCREEN_NAME.PBL_PAGE_PAYMENT;
class FoodhubPaybyLinkPaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.handleCheckoutButtonAction = this.handleCheckoutButtonAction.bind(this);
        this.handleBuyWithPayAction = this.handleBuyWithPayAction.bind(this);
        this.handleViewReceiptClick = this.handleViewReceiptClick.bind(this);
        this.handleCardItemSelection = this.handleCardItemSelection.bind(this);
        this.handleNewCardItemSelection = this.handleNewCardItemSelection.bind(this);
        this.handleWalletSelection = this.handleWalletSelection.bind(this);
        this.handleCvvModalCancelClicked = this.handleCvvModalCancelClicked.bind(this);
        this.handleOnCvvComplete = this.handleOnCvvComplete.bind(this);
        this.resetVerifyCvv = this.resetVerifyCvv.bind(this);
        this.handleLeftActionClicked = this.handleLeftActionClicked.bind(this);
        this.state = {
            showOrderProcessingLoader: false,
            walletChecked: false,
            walletDisabled: true,
            paymentType: PAYMENT_TYPE.CARD,
            userSelectedCard: null,
            restart: new Date()
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { total, walletBalance, savedCardDetails, countryBaseFeatureGateResponse } = props;
        let value = {};
        if (!getWalletStatus(countryBaseFeatureGateResponse)) {
            value.walletChecked = false;
            value.walletDisabled = true;
        } else if (walletBalance === '0.00' || total === '0.00') {
            value.walletChecked = false;
            value.walletDisabled = true;
        } else if (savedCardDetails.length === 0 && safeFloatRoundedValue(walletBalance) < safeFloatRoundedValue(total)) {
            value.walletChecked = false;
            value.walletDisabled = true;
        } else if (safeFloatRoundedValue(walletBalance) < safeFloatRoundedValue(total)) {
            value.walletChecked = false;
            value.walletDisabled = true;
        } else {
            value.walletDisabled = false;
        }

        if (
            (isValidElement(props.showOrderProcessingLoader) && state.showOrderProcessingLoader !== props.showOrderProcessingLoader) ||
            (isValidElement(props.restart) && state.restart !== props.restart)
        ) {
            value.showOrderProcessingLoader = props.showOrderProcessingLoader;
            value.restart = props.restart;
        }

        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        const { orderId, isFromPBL } = this.props.route.params;

        if (isValidElement(orderId) && isFromPBL) {
            this.props.getProfileAction(true);
            if (isFoodHubApp() && getWalletStatus(this.props.countryBaseFeatureGateResponse)) {
                this.props.getWalletBalanceAction();
            }
            this.props.resetCvvAction();
            this.props.getCardDetailsAction(getPaymentProvider(this.props.storeConfigPaymentProvider));
            const { countryBaseFeatureGateResponse, storeConfigSettingApplePay, storeConfigApplePay, storeConfigCardPayment } = this.props;
            const showBuyWithButton =
                isApplePayEnabled(storeConfigSettingApplePay, storeConfigApplePay, countryBaseFeatureGateResponse) ||
                isGooglePayEnabled(storeConfigCardPayment, countryBaseFeatureGateResponse);
            if (showBuyWithButton) {
                this.handleBuyWithPayAction();
            }
        }
    }

    render() {
        const { walletBalance, currency, storeConfigLogoURL, storeConfigThumbnailURL, total } = this.props;
        let sourceUrl = getTAURL(storeConfigLogoURL, storeConfigThumbnailURL);
        return (
            <SafeAreaView style={styles.rootContainer}>
                <View style={{ flex: 1 }}>
                    <T2SAppBar
                        showElevation={true}
                        title={LOCALIZATION_STRINGS.PAYMENT}
                        handleLeftActionPress={this.handleLeftActionClicked}
                        // actions={this.renderReceiptButton()}
                    />
                    <View style={styles.rootContainer}>
                        <PaymentTitleHeader sourceUrl={sourceUrl} currency={currency} total={total} />
                        <FoodhubWalletComponent
                            screenName={screenName}
                            walletBalance={walletBalance}
                            walletDisabled={this.state.walletDisabled}
                            currency={currency}
                            checkedState={this.state.walletChecked}
                            handleWalletSelection={this.handleWalletSelection}
                        />
                        {this.renderNewCard()}
                    </View>
                    {this.renderBottomButton()}
                </View>
                {this.renderVerifyCVVModal()}
            </SafeAreaView>
        );
    }

    handleLeftActionClicked() {
        this.props.resetPBLAction();
        this.props.resetBasket();
        handleNavigation(SCREEN_OPTIONS.HOME.route_name);
    }

    renderBottomButton() {
        const { countryBaseFeatureGateResponse, storeConfigSettingApplePay, storeConfigApplePay, storeConfigCardPayment } = this.props;
        const showBuyWithButton =
            isApplePayEnabled(storeConfigSettingApplePay, storeConfigApplePay, countryBaseFeatureGateResponse) ||
            isGooglePayEnabled(storeConfigCardPayment, countryBaseFeatureGateResponse);
        return (
            <CheckoutBottomButton
                screenName={screenName}
                isSwipeDisable={false}
                showBuyWithButton={showBuyWithButton}
                onCheckoutClicked={this.handleCheckoutButtonAction}
                onBuyWithClicked={this.handleBuyWithPayAction}
                isExpressPay={false}
            />
        );
    }
    handleCheckoutButtonAction = debounce(
        () => {
            this.setState({ showOrderProcessingLoader: true }, () => {
                const {
                    total,
                    merchant_id,
                    userID,
                    store_id,
                    takeawayName,
                    email,
                    phone,
                    first_name,
                    last_name,
                    house_number,
                    address_line1,
                    address_line2
                } = this.props;
                const { paymentType } = this.state;
                const { orderId, host } = this.props?.route?.params;
                this.setState({ showOrderProcessingLoader: true }, () => {
                    let payload = {
                        payment: paymentType,
                        total,
                        orderId,
                        merchant_id,
                        userID,
                        host,
                        store_id,
                        takeawayName,
                        email,
                        phone,
                        first_name,
                        last_name,
                        house_number,
                        address_line1,
                        address_line2
                    };
                    this.props.proceedToPayment(payload);
                });
            });
        },
        100,
        { leading: true, trailing: false }
    );

    handleBuyWithPayAction = debounce(
        () => {
            const payment = isIOS() ? PAYMENT_TYPE.APPLE_PAY : PAYMENT_TYPE.GOOGLE_PAY;
            const {
                total,
                merchant_id,
                userID,
                store_id,
                takeawayName,
                email,
                phone,
                first_name,
                last_name,
                house_number,
                address_line1,
                address_line2
            } = this.props;
            const { orderId, host } = this.props?.route?.params;
            this.setState({ showOrderProcessingLoader: true }, () => {
                let payload = {
                    payment,
                    total,
                    orderId,
                    merchant_id,
                    userID,
                    host,
                    store_id,
                    takeawayName,
                    email,
                    phone,
                    first_name,
                    last_name,
                    house_number,
                    address_line1,
                    address_line2
                };
                this.props.proceedToPayment(payload);
            });
        },
        500,
        { leading: true, trailing: false }
    );

    renderReceiptButton() {
        return <View style={styles.headerIconContainer}>{this.renderReceiptText()}</View>;
    }

    renderCardList() {
        const { savedCardDetails, countryBaseFeatureGateResponse } = this.props;
        if (getSavedCardStatus(countryBaseFeatureGateResponse) && isSavedCardAvailable(this.props)) {
            return (
                <View>
                    <T2SText screenName={screenName} id={VIEW_ID.CARD_DETAILS_TEXT} style={styles.cardTypeText}>
                        {LOCALIZATION_STRINGS.SAVED_CARDS}
                    </T2SText>
                    <T2SPaginatedFlatList
                        id={VIEW_ID.SAVED_CARDS_FLAT_LIST}
                        screenName={screenName}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        data={savedCardDetails}
                        renderItem={this.renderCardListItem}
                        useFlatList
                    />
                </View>
            );
        }
    }

    renderCardListItem = ({ item }) => {
        const { storeConfigCardPayment } = this.props;
        const { paymentType, user_selected_card_id } = this.state;
        return (
            <CardListItemComponent
                screenName={screenName}
                storeConfigCardPayment={storeConfigCardPayment}
                selectedType={paymentType}
                id={item?.id}
                last_4_digits={item?.last_4_digits}
                checkedStatus={
                    item?.id === user_selected_card_id &&
                    (paymentType === PAYMENT_TYPE.CARD_FROM_LIST || paymentType === PAYMENT_TYPE.PARTIAL_PAYMENT)
                        ? CHECKBOX_STATUS.CHECKED
                        : CHECKBOX_STATUS.UNCHECKED
                }
                handleCardItemSelection={this.handleCardItemSelection}
            />
        );
    };

    renderNewCard() {
        const { storeResponse } = this.props;
        const cardPaymentEnabled = isCardPaymentEnabled(storeResponse?.card_payment);
        if (cardPaymentEnabled) {
            return (
                <T2STouchableOpacity style={styles.addCardView} onPress={this.handleNewCardItemSelection}>
                    <T2SText style={styles.addCardText}>+ Add Card</T2SText>
                </T2STouchableOpacity>
            );
        }
    }

    renderReceiptText() {
        return (
            <T2STouchableOpacity
                id={VIEW_ID.RECEIPT_ID_BUTTON}
                screenName={SCREEN_NAME.PBL_PAGE_PAYMENT}
                onPress={this.handleViewReceiptClick}>
                <T2SText screenName={SCREEN_NAME.PBL_PAGE_PAYMENT} id={VIEW_ID.RECEIPT_ID_BUTTON} style={styles.commonLinkTextStyle}>
                    {LOCALIZATION_STRINGS.RECEIPT}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    renderVerifyCVVModal() {
        const { showVerifyCVV, inValidCvvErrorMsg } = this.props;
        const errorMsg = isValidString(inValidCvvErrorMsg) ? inValidCvvErrorMsg : LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_CVV;
        return (
            <CvvModal
                screenName={SCREEN_OPTIONS.HOME.screen_title}
                isVisible={showVerifyCVV}
                requestClose={this.resetVerifyCvv}
                errorMsg={errorMsg}
                payClicked={this.handleOnCvvComplete}
                cancelClicked={this.handleCvvModalCancelClicked}
                dialogCancelable={false}
            />
        );
    }

    handleCvvModalCancelClicked() {
        this.resetVerifyCvv();
        this.props.restartQuickCheckout();
    }
    resetVerifyCvv() {
        this.props.resetCvvAction();
    }

    handleOnCvvComplete(cvv) {
        const { showVerifyCVV } = this.props;
        if (showVerifyCVV && cvv.length >= 3) {
            this.props.updateCvvAction(cvv);
            this.handleCheckoutButtonAction();
            this.resetVerifyCvv();
        }
    }

    handleViewReceiptClick() {
        const { store_id, orderDetails: orderDetails } = this.props;
        const { orderId, name } = this.props.route.params;
        handleNavigation(SCREEN_OPTIONS.VIEW_ORDER.route_name, {
            data: orderDetails.data,
            orderId: orderId,
            storeID: store_id,
            sending: orderDetails.data.sending,
            name: name,
            source: VIEW_ORDER_SOURCE.ORDER_STATUS,
            delivery_time: orderDetails.data.delivery_time
        });
    }

    handleCardItemSelection(id) {
        const { paymentType, walletChecked } = this.state;
        if (paymentType === PAYMENT_TYPE.PARTIAL_PAYMENT || walletChecked) {
            this.setState({ paymentType: PAYMENT_TYPE.PARTIAL_PAYMENT, user_selected_card_id: id });
        } else {
            this.setState({ paymentType: PAYMENT_TYPE.CARD_FROM_LIST, user_selected_card_id: id });
        }
        if (isValidElement(id)) {
            this.props.updateUserSelectedCardId(id);
        }
    }

    handleNewCardItemSelection(id) {
        // TODO: Card Item selected need to handle
        this.setState({ paymentType: PAYMENT_TYPE.NEW_CARD });
        this.handleCheckoutButtonAction();
    }

    handleWalletSelection() {
        let paymentType;
        if (this.state.paymentType === PAYMENT_TYPE.CARD_FROM_LIST || this.state.paymentType === PAYMENT_TYPE.PARTIAL_PAYMENT) {
            paymentType = PAYMENT_TYPE.PARTIAL_PAYMENT;
        } else {
            paymentType = PAYMENT_TYPE.WALLET;
        }
        this.setState({ walletChecked: !this.state.walletChecked, paymentType: paymentType });
    }
}

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromPBLOrder(state),
    total: selectTotalFromPBLOrder(state),
    walletBalance: state.walletState.walletBalance,
    savedCardDetails: state.profileState.savedCardDetails,
    userID: state.profileState.profileResponse?.id,
    merchant_id: selectMerchantIdFromPBLOrder(state),
    store_id: selectStoreIdFromPBLOrder(state),
    takeawayName: selectTakeawayNameFromPBLOrder(state),
    email: state.profileState.profileResponse?.email,
    phone: state.profileState.profileResponse?.phone,
    first_name: state.profileState.profileResponse?.first_name,
    last_name: state.profileState.profileResponse?.last_name,
    house_number: selectHousenoFromPBLOrder(state),
    address_line1: selectAddress1FromPBLOrder(state),
    address_line2: selectAddress2FromPBLOrder(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    storeConfigWalletEnabled: state.appState.storeConfigResponse?.wallet_payment,
    storeConfigApplePay: state.appState.storeConfigResponse?.apple_pay,
    storeConfigSettingApplePay: state.appState.storeConfigResponse?.setting?.apple_pay,
    storeConfigCardPayment: state.appState.storeConfigResponse?.card_payment,
    storeConfigCashPayment: state.appState.storeConfigResponse?.cash_payment,
    storeConfigLogoURL: state.appState.storeConfigResponse?.setting?.logo_url,
    storeConfigThumbnailURL: state.appState.storeConfigResponse?.thumbnail_url,
    storeResponse: state.appState.storeConfigResponse,
    showOrderProcessingLoader: state.basketState.showOrderProcessingLoader,
    restart: state.basketState.restart,
    orderDetails: selectOrderDetailsResponse(state),
    selectedOrderType: selectSendingType(state),
    storeConfigPaymentProvider: state.appState.storeConfigResponse?.payment_provider,
    showVerifyCVV: state.basketState.showVerifyCVV,
    inValidCvvErrorMsg: state.basketState.inValidCvvErrorMsg
});
const mapDispatchToProps = {
    getOrderDetailsAction,
    proceedToPayment,
    getCardDetailsAction,
    getWalletBalanceAction,
    restartQuickCheckout,
    proceedCheckoutAction,
    updateCvvAction,
    resetCvvAction,
    updateUserSelectedCardId,
    getProfileAction,
    resetPBLAction,
    resetBasket
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodhubPaybyLinkPaymentScreen);
