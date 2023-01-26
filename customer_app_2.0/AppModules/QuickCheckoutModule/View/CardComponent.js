import { FlatList, ScrollView, View } from 'react-native';
import React, { Component } from 'react';
import styles from './Styles/CardComponentStyle';
import { RadioButton } from 'react-native-paper';
import { PAYMENT_TYPE, SCREEN_NAME, VIEW_ID } from '../Utils/QuickCheckoutConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { CHECKBOX_STATUS } from '../../HomeModule/Utils/HomeConstants';
import Colors from 't2sbasemodule/Themes/Colors';
import { isApplePayEnabled, isCardPaymentEnabled, isCashPaymentEnabled, isGooglePayEnabled, isWalletPaymentEnabled } from '../Utils/Helper';
import { isFoodHubApp, isValidElement, safeFloatRoundedValue } from 't2sbasemodule/Utils/helpers';
import T2SCheckBox from 't2sbasemodule/UI/CommonUI/T2SCheckBox';
import { selectCurrencyFromStore } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { getExpiryDateForCardDetails } from '../../ProfileModule/Utils/ProfileHelper';
import { selectTotalValue } from '../../BasketModule/Redux/BasketSelectors';
import { T2SDivider } from 't2sbasemodule/UI';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { getSavedCardStatus, getWalletStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import { isSavedCardAvailable, isThirdPartyDriverEnabled, isWalletPaymentApplicableForBasket } from '../../BasketModule/Utils/BasketHelper';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { ANALYTICS_EVENTS } from '../../AnalyticsModule/AnalyticsConstants';
import { ORDER_TYPE } from '../../BaseModule/BaseConstants';
import CashComponent from './MicroComponents/PaymentCashComponent';
import PaymentCardComponent from './MicroComponents/PaymentCardComponent';
import PaymentPayComponent from './MicroComponents/PaymentPayComponent';

type Props = {};
let screenName = SCREEN_NAME.QUICK_CHECKOUT_DETAIL_SCREEN;

class CardComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.handleWalletSelection = this.handleWalletSelection.bind(this);
    }

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    {this.renderWallet()}
                    {this.renderCardList()}
                    {this.renderGooglePay()}
                    {this.renderApplePay()}
                    {this.renderNewCard()}
                    {this.renderCardComponent()}
                    {this.renderCashComponent()}
                </View>
            </ScrollView>
        );
    }

    renderWallet() {
        const { storeConfigWalletEnabled, currency, walletBalance, selectedType, countryBaseFeatureGateResponse } = this.props;
        if (
            (isFoodHubApp() && getWalletStatus(countryBaseFeatureGateResponse)) ||
            isWalletPaymentEnabled(storeConfigWalletEnabled, countryBaseFeatureGateResponse)
        ) {
            return (
                <View>
                    <View style={styles.rootContainer}>
                        <T2SCheckBox
                            color={Colors.primaryColor}
                            label={`${LOCALIZATION_STRINGS.FOOD_HUB_WALLET} (${currency}${walletBalance})`}
                            checkBoxStyle={styles.checkBoxStyle}
                            textstyle={[styles.cashTextStyle, { paddingHorizontal: 5 }]}
                            id={VIEW_ID.QC_WALLET_CHECKBOX}
                            disabled={this.checkIsWalletDisabled()}
                            screenName={screenName}
                            status={selectedType === PAYMENT_TYPE.WALLET || selectedType === PAYMENT_TYPE.PARTIAL_PAYMENT}
                            onPress={this.handleWalletSelection}
                        />
                    </View>
                    <T2SDivider style={styles.divider} />
                </View>
            );
        }
    }

    renderCardList() {
        const { storeConfigCardPayment, countryBaseFeatureGateResponse, savedCardDetails, selectedOrderType } = this.props;
        if (
            getSavedCardStatus(countryBaseFeatureGateResponse) &&
            isSavedCardAvailable({ storeConfigCardPayment, savedCardDetails, selectedOrderType })
        ) {
            return (
                <FlatList
                    {...setTestId(screenName, VIEW_ID.SAVED_CARDS_FLAT_LIST)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    data={savedCardDetails}
                    renderItem={this.renderCardListItem}
                    useFlatList
                />
            );
        }
    }

    renderCardListItem = ({ item }) => {
        const { storeConfigCardPayment, selectedType, user_selected_card_id } = this.props;
        return (
            <T2STouchableOpacity activeOpacity={0.9} onPress={this.handleCardItemSelection.bind(this, item.id)} accessible={false}>
                <View style={styles.rootContainer}>
                    <RadioButton.Android
                        color={Colors.primaryColor}
                        style={styles.radioButtonStyle}
                        screenName={screenName}
                        id={VIEW_ID.QC_LIST_CARD_ITEM_RADIO}
                        {...setTestId(screenName, VIEW_ID.QC_LIST_CARD_ITEM + VIEW_ID.RADIO_BUTTON)}
                        disabled={!isCardPaymentEnabled(storeConfigCardPayment)}
                        status={
                            item.id === user_selected_card_id &&
                            (selectedType === PAYMENT_TYPE.CARD_FROM_LIST || selectedType === PAYMENT_TYPE.PARTIAL_PAYMENT)
                                ? CHECKBOX_STATUS.CHECKED
                                : CHECKBOX_STATUS.UNCHECKED
                        }
                        onPress={this.handleCardItemSelection.bind(this, item.id)}
                    />
                    {this.renderCardDetailsText(item)}
                </View>
            </T2STouchableOpacity>
        );
    };

    renderCardDetailsText(item) {
        return (
            <T2SView style={styles.cardMainContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.CARD_DETAILS_TEXT} style={styles.cardTypeText}>
                    {item.card_type}
                </T2SText>
                <T2SView style={styles.cardDetailsContainer}>
                    <T2SText screenName={screenName} id={VIEW_ID.CARD_NUMBER_TEXT} style={styles.cardNumberText}>
                        {LOCALIZATION_STRINGS.MASKED_CARD_NUMBER}
                        {item.last_4_digits}
                    </T2SText>
                    <T2SText screenName={screenName} id={VIEW_ID.EXPIRY_DATE_TEXT} style={styles.cardExpiryDateText}>
                        {getExpiryDateForCardDetails(item.expiry_date)}
                    </T2SText>
                </T2SView>
            </T2SView>
        );
    }

    renderNewCard() {
        const { itemClicked, storeConfigCardPayment, selectedType, savedCardDetails, selectedOrderType } = this.props;
        const cardPaymentEnabled = isCardPaymentEnabled(storeConfigCardPayment);
        if (isSavedCardAvailable({ storeConfigCardPayment, savedCardDetails, selectedOrderType })) {
            return (
                <PaymentCardComponent
                    screenName={screenName}
                    itemClicked={itemClicked}
                    paymentType={PAYMENT_TYPE.NEW_CARD}
                    analytics={ANALYTICS_EVENTS.PAYMENT_CARD_CLICK}
                    disabled={!cardPaymentEnabled}
                    isCardOptionSelected={selectedType === PAYMENT_TYPE.NEW_CARD}
                    labelName={LOCALIZATION_STRINGS.NEW_CARD}
                    viewId={VIEW_ID.QC_NEW_CARD}
                />
            );
        }
    }
    renderCardComponent() {
        const { itemClicked, storeConfigCardPayment, selectedType, savedCardDetails, selectedOrderType } = this.props;
        const cardPaymentEnabled = isCardPaymentEnabled(storeConfigCardPayment);
        const saveCardEnabled = isSavedCardAvailable({ storeConfigCardPayment, savedCardDetails, selectedOrderType });

        if (cardPaymentEnabled && !saveCardEnabled) {
            return (
                <PaymentCardComponent
                    screenName={screenName}
                    itemClicked={itemClicked}
                    paymentType={PAYMENT_TYPE.CARD}
                    analytics={ANALYTICS_EVENTS.PAYMENT_CARD_CLICK}
                    disabled={!cardPaymentEnabled}
                    isCardOptionSelected={selectedType === PAYMENT_TYPE.CARD}
                    labelName={LOCALIZATION_STRINGS.CARD}
                    viewId={VIEW_ID.QC_CARD}
                />
            );
        }
    }
    renderCashComponent() {
        const {
            itemClicked,
            storeConfigCashPayment,
            selectedType,
            storeConfigCardPayment,
            storeConfigOrdersCount,
            noOfOrdersOfCustomer
        } = this.props;
        const cashPaymentEnabled = isCashPaymentEnabled(
            storeConfigCashPayment,
            storeConfigCardPayment,
            storeConfigOrdersCount,
            noOfOrdersOfCustomer
        );
        const thirdPartyDriverEnabled = this.isThirdPartyDriverEnabled();
        if (cashPaymentEnabled) {
            return (
                <CashComponent
                    screenName={screenName}
                    isThirdPartyDriverEnabled={thirdPartyDriverEnabled}
                    disabled={!cashPaymentEnabled || thirdPartyDriverEnabled}
                    isCashOptionSelected={selectedType === PAYMENT_TYPE.CASH}
                    itemClicked={itemClicked}
                />
            );
        }
    }
    renderGooglePay() {
        const { itemClicked, selectedType, storeConfigCardPayment, countryBaseFeatureGateResponse } = this.props;
        const googlePayEnabled = isGooglePayEnabled(storeConfigCardPayment, countryBaseFeatureGateResponse);
        if (googlePayEnabled) {
            return (
                <PaymentPayComponent
                    screenName={screenName}
                    itemClicked={itemClicked}
                    paymentType={PAYMENT_TYPE.GOOGLE_PAY}
                    analytics={ANALYTICS_EVENTS.PAYMENT_GOOGLE_PAY_CLICK}
                    disabled={!googlePayEnabled}
                    isPayComponentSelected={selectedType === PAYMENT_TYPE.GOOGLE_PAY}
                    viewId={VIEW_ID.QC_GOOGLE_PAY_RADIO}
                />
            );
        }
    }
    renderApplePay() {
        const { itemClicked, selectedType, countryBaseFeatureGateResponse, storeConfigSettingApplePay, storeConfigApplePay } = this.props;
        const applePayEnabled = isApplePayEnabled(storeConfigSettingApplePay, storeConfigApplePay, countryBaseFeatureGateResponse);
        if (applePayEnabled) {
            return (
                <PaymentPayComponent
                    screenName={screenName}
                    itemClicked={itemClicked}
                    paymentType={PAYMENT_TYPE.APPLE_PAY}
                    analytics={ANALYTICS_EVENTS.PAYMENT_APPLE_PAY_CLICK}
                    disabled={!applePayEnabled}
                    isPayComponentSelected={selectedType === PAYMENT_TYPE.APPLE_PAY}
                    viewId={VIEW_ID.QC_APPLE_PAY_RADIO}
                    isApplePay={true}
                />
            );
        }
    }

    isThirdPartyDriverEnabled() {
        const { selectedOrderType, assignDriverThrough } = this.props;
        return isThirdPartyDriverEnabled(selectedOrderType, assignDriverThrough);
    }

    checkIsWalletDisabled() {
        const { walletBalance, totalAmount, selectedType, basketData } = this.props;
        if (!isWalletPaymentApplicableForBasket(basketData)) {
            return true;
        }
        if (selectedType === PAYMENT_TYPE.PARTIAL_PAYMENT || selectedType === PAYMENT_TYPE.CARD_FROM_LIST) {
            return walletBalance === '0.00' || totalAmount === '0.00';
        } else {
            return (
                walletBalance === '0.00' ||
                totalAmount === '0.00' ||
                safeFloatRoundedValue(walletBalance) < safeFloatRoundedValue(totalAmount)
            );
        }
    }

    handleWalletSelection() {
        const {
            itemClicked,
            walletBalance,
            totalAmount,
            selectedType,
            storeConfigCashPayment,
            savedCardDetails,
            selectedOrderType,
            storeConfigCardPayment,
            storeConfigOrdersCount,
            noOfOrdersOfCustomer
        } = this.props;

        if (isValidElement(itemClicked)) {
            if (selectedType === PAYMENT_TYPE.PARTIAL_PAYMENT) {
                this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_WALLET_CLICK, itemClicked, PAYMENT_TYPE.CARD_FROM_LIST);
            } else if (
                selectedType === PAYMENT_TYPE.CARD_FROM_LIST &&
                walletBalance !== '0.00' &&
                safeFloatRoundedValue(walletBalance) < safeFloatRoundedValue(totalAmount)
            ) {
                this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_WALLET_CLICK, itemClicked, PAYMENT_TYPE.PARTIAL_PAYMENT);
            } else if (selectedType === PAYMENT_TYPE.WALLET && isCardPaymentEnabled(storeConfigCardPayment)) {
                if (savedCardDetails.length > 0 && selectedOrderType === ORDER_TYPE.DELIVERY) {
                    this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_WALLET_CLICK, itemClicked, PAYMENT_TYPE.CARD_FROM_LIST);
                } else {
                    this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_WALLET_CLICK, itemClicked, PAYMENT_TYPE.CARD);
                }
            } else if (
                selectedType === PAYMENT_TYPE.WALLET &&
                isCashPaymentEnabled(storeConfigCashPayment, storeConfigCardPayment, storeConfigOrdersCount, noOfOrdersOfCustomer)
            ) {
                this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_WALLET_CLICK, itemClicked, PAYMENT_TYPE.CASH);
            } else {
                this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_WALLET_CLICK, itemClicked, PAYMENT_TYPE.WALLET);
            }
        }
    }

    handleCardItemSelection(id) {
        const { itemClicked, selectedType } = this.props;
        if (selectedType === PAYMENT_TYPE.PARTIAL_PAYMENT) {
            this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_CARD_CLICK, itemClicked, selectedType, id);
        } else {
            this.handleItemClick(ANALYTICS_EVENTS.PAYMENT_CARD_CLICK, itemClicked, PAYMENT_TYPE.CARD_FROM_LIST, id);
        }
    }

    handleItemClick(analytics, itemClicked, selectedItem, selectedCardId = null) {
        itemClicked(analytics, selectedItem, selectedCardId);
    }
}

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromStore(state),
    totalAmount: selectTotalValue(state),
    walletBalance: state.walletState.walletBalance,
    savedCardDetails: state.profileState.savedCardDetails,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    user_selected_card_id: state.basketState.user_selected_card_id,
    basketData: state.basketState.viewBasketResponse,
    selectedOrderType: selectOrderType(state),
    assignDriverThrough: state.appState.storeConfigResponse?.assign_driver_through,
    storeConfigWalletEnabled: state.appState.storeConfigResponse?.wallet_payment,
    storeConfigApplePay: state.appState.storeConfigResponse?.apple_pay,
    storeConfigSettingApplePay: state.appState.storeConfigResponse?.setting?.apple_pay,
    storeConfigCardPayment: state.appState.storeConfigResponse?.card_payment,
    storeConfigCashPayment: state.appState.storeConfigResponse?.cash_payment,
    storeConfigOrdersCount: state.appState.storeConfigResponse?.orders_count,
    noOfOrdersOfCustomer: state.profileState.profileResponse?.no_of_transactions
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CardComponent);
