import React, { Component } from 'react';
import { Animated, BackHandler, Dimensions, Keyboard, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Styles/QuickCheckoutStyles';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { connect } from 'react-redux';
import {
    isCollectionAvailableSelector,
    isDeliveryAvailableSelector,
    isPreOrderAvailableForCollectionSelector,
    isPreOrderAvailableForDeliverySelector,
    selectCurrencyFromStore,
    selectHost,
    selectPreOrderASAP,
    selectTakeawayAddressSelector,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import { CONSTANTS, PAYMENT_TYPE, QUICK_CHECKOUT_SCREEN_KEYS, SCREEN_NAME, VIEW_ID } from '../Utils/QuickCheckoutConstants';
import {
    addressStringFromAddressObj,
    checkToShowLegalAgeConfirmation,
    getAddressForQCFlow,
    getBasketTotal,
    getDeliveryAddressForQCFlow,
    getSelectedPaymentTypeValue,
    isApplePayEnabled,
    isCollectionOrder,
    isDifferentPostCodeFromLocation,
    isExpressPayment,
    isGooglePayEnabled,
    isImmediateOptionAvailable,
    isPreOrderEnabled,
    isWalletPaymentEnabled,
    preOrderFormatedDate,
    shouldShowContactFreeDelivery
} from '../Utils/Helper';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import QuickCheckoutSwipeButton from 't2sbasemodule/UI/CustomUI/QuickCheckoutSwipeButton/QuickCheckoutSwipeButton';
import HeroNavigator from 't2sbasemodule/UI/CustomUI/HeroNavigator/HeroNavigator';
import QuickCheckoutDetails from './QuickCheckoutDetails';
import { isFoodHubApp, isValidElement, isValidNotEmptyString, isValidString, trimCommaAndSpace } from 't2sbasemodule/Utils/helpers';
import {
    autoPresentQCAction,
    getPreOrderDates,
    paymentErrorMessageAction,
    setContactFreeAction,
    setPreOrderDate,
    updateBasketAction,
    updateUserPaymentMode
} from '../../BasketModule/Redux/BasketAction';
import {
    getPaymentModeForBasket,
    selectBasketErrors,
    selectBasketViewItems,
    selectBasketWarnings,
    selectCanClaimOffer,
    selectContactFreeDelivery,
    selectFreeItemAvailable,
    selectPaymentErrorMessage,
    selectPreOrderDate,
    selectPreOrderDatesForCollection,
    selectPreOrderDatesForDelivery,
    selectRecommendationSelectedFromBasket
} from '../../BasketModule/Redux/BasketSelectors';
import { BASKET_UPDATE_TYPE } from '../../BasketModule/Utils/BasketConstants';
import {
    proceedCheckoutAction,
    resetCvvAction,
    resetMissingItemBasketAction,
    resetMissingItemBasketProceedAction,
    restartQuickCheckout,
    updateCvvAction
} from '../Redux/QuickCheckoutAction';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { getWalletBalanceAction } from '../../../FoodHubApp/WalletModule/Redux/WalletAction';
import { T2SDivider, T2SIcon } from 't2sbasemodule/UI';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import CvvModal from 't2sbasemodule/UI/CustomUI/CvvModal/CvvModal';
import { POSTCODE_LOOKUP_API_STATUS } from '../../AddressModule/Utils/AddressConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { checkDeliveryAddressAvailability } from '../../AddressModule/Redux/AddressAction';
import { getWalletStatus, isGlobalTipEnable } from '../../BaseModule/Utils/FeatureGateHelper';
import LottieView from 'lottie-react-native';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import _, { debounce } from 'lodash';
import MissingItemModel from './MissingItemModel';
import RecommendationList from '../../BasketModule/View/Components/RecommendationList';
import { filterFreeItem, showTipsUI, tipsEnableCountry } from '../../BasketModule/Utils/BasketHelper';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import CheckoutBottomButton from './MicroComponents/CheckoutBottomButton';
import ErrorMessageComponent from './MicroComponents/ErrorMessageComponent';
import ContactLessFreeDelivery from './MicroComponents/ContactLessDeliveryComponent';
import { isUKApp } from '../../BaseModule/GlobalAppHelper';
import InfoComponent from './MicroComponents/InfoComponent';

const { height } = Dimensions.get('window');
let screenName = SCREEN_NAME.QUICK_CHECKOUT_SCREEN;

class QuickCheckoutScreen extends Component {
    constructor(props) {
        super(props);
        this.resetVerifyCvv = this.resetVerifyCvv.bind(this);
        this.handleContactFree = this.handleContactFree.bind(this);
        this.handleClaimOffer = this.handleClaimOffer.bind(this);
        this.handleMissingItemCancelClicked = this.handleMissingItemCancelClicked.bind(this);
        this.handleMissingItemProceedClicked = this.handleMissingItemProceedClicked.bind(this);
        this.handleOrderSwipeStart = this.handleOrderSwipeStart.bind(this);
        this.handleOrderSwipeMove = this.handleOrderSwipeMove.bind(this);
        this.handleOrderOnFailed = this.handleOrderOnFailed.bind(this);
        this.handleOrderOnSuccess = this.handleOrderOnSuccess.bind(this);
        this.handleCheckoutButtonAction = this.handleCheckoutButtonAction.bind(this);
        this.handleBuyWithPayAction = this.handleBuyWithPayAction.bind(this);
        this.handleCvvModalCancelClicked = this.handleCvvModalCancelClicked.bind(this);
        this.handleOnCvvComplete = this.handleOnCvvComplete.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            selectedDeliveryAddress: getAddressForQCFlow(this.props),
            closeTime: new Date(),
            restart: new Date(),
            payment_mode: this.props.payment_mode,
            animatedMargin: new Animated.Value(height),
            getItBy: isValidString(this.props.preOrderDate) ? this.props.preOrderDate : CONSTANTS.IMMEDIATELY,
            showOrderProcessingLoader: false,
            disableQCWindow: false,
            qcHeight: 0,
            toolTipVisible: false,
            paymentErrorMessage: this.props.paymentErrorMessage,
            cardTransactionFailed: false,
            isPreOrderASAP: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        if (
            !isCollectionOrder(props) &&
            isValidElement(props.deliveryAddress) &&
            state.selectedDeliveryAddress !== addressStringFromAddressObj(props.deliveryAddress)
        ) {
            value.closeTime = new Date();
            value.selectedDeliveryAddress = addressStringFromAddressObj(props.deliveryAddress);
        }
        if (isValidElement(props.payment_mode) && state.payment_mode !== props.payment_mode) {
            value.payment_mode = props.payment_mode;
        }
        if (
            (isValidElement(props.showOrderProcessingLoader) && state.showOrderProcessingLoader !== props.showOrderProcessingLoader) ||
            (isValidElement(props.restart) && state.restart !== props.restart)
        ) {
            value.showOrderProcessingLoader = props.showOrderProcessingLoader;
            value.disableQCWindow = props.showOrderProcessingLoader;
            value.restart = props.restart;
        }
        if (props.paymentErrorMessage !== state.paymentErrorMessage) {
            value.paymentErrorMessage = props.paymentErrorMessage;
        }
        if (props.cardTransactionFailed !== state.cardTransactionFailed) {
            value.cardTransactionFailed = props.cardTransactionFailed;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.QC);
        const {
            preOrderASAPEnabled,
            isPreOrderASAP,
            isCollectionAvailable,
            isDeliveryAvailable,
            selectedOrderType,
            preOrderCollectionDates,
            preOrderDeliveryDates,
            preOrderDate,
            countryBaseFeatureGateResponse,
            storeConfigWalletEnabled,
            postCodeLookupApiStatus,
            payment_mode
        } = this.props;
        setTimeout(function() {
            Keyboard.dismiss();
        }, 1500);
        this.setAnimatedMargin(1);
        this.setState({
            selectedDeliveryAddress: getAddressForQCFlow(this.props),
            getItBy: isValidString(preOrderDate)
                ? preOrderDate
                : isImmediateOptionAvailable(isCollectionAvailable, isDeliveryAvailable, selectedOrderType)
                ? CONSTANTS.IMMEDIATELY
                : preOrderFormatedDate(preOrderCollectionDates, preOrderDeliveryDates, selectedOrderType),
            isPreOrderASAP:
                isImmediateOptionAvailable(isCollectionAvailable, isDeliveryAvailable, selectedOrderType) &&
                preOrderASAPEnabled &&
                isPreOrderASAP
        });
        this.addEventListeners();
        this.props.getPreOrderDates();
        if (
            (isFoodHubApp() && getWalletStatus(countryBaseFeatureGateResponse)) ||
            isWalletPaymentEnabled(storeConfigWalletEnabled, countryBaseFeatureGateResponse)
        ) {
            this.props.getWalletBalanceAction();
        }
        if (!isCollectionOrder(this.props)) {
            const address = getDeliveryAddressForQCFlow(this.props);
            if (
                isValidElement(address) &&
                (postCodeLookupApiStatus === POSTCODE_LOOKUP_API_STATUS.NOT_TRIGGERED || POSTCODE_LOOKUP_API_STATUS.FAILED)
            ) {
                this.props.checkDeliveryAddressAvailability(address);
            }
        }
        if (!isImmediateOptionAvailable(isCollectionAvailable, isDeliveryAvailable, selectedOrderType)) {
            this.props.setPreOrderDate(
                preOrderFormatedDate(preOrderCollectionDates, preOrderDeliveryDates, selectedOrderType),
                preOrderASAPEnabled
            );
        }
        if (payment_mode === PAYMENT_TYPE.GOOGLE_PAY) {
            this.props.restartQuickCheckout();
        }
    }

    addEventListeners() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState({ selectedDeliveryAddress: getAddressForQCFlow(this.props) });
            this.props.getPreOrderDates();
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
        });
    }

    removeEventListener() {
        if (isValidElement(this.focusListener)) {
            this.props.navigation.removeListener(this.focusListener);
        }
        if (isValidElement(this.backHandler)) {
            this.backHandler.remove();
        }
    }

    handleBackButtonClick() {
        return this.state.disableQCWindow;
    }
    renderInfoMessage() {
        const { payment_mode, countryBaseFeatureGateResponse, selectedOrderType, globalTip, globalTipsEnable } = this.props;
        if (
            payment_mode === PAYMENT_TYPE.CASH &&
            isGlobalTipEnable(countryBaseFeatureGateResponse) &&
            tipsEnableCountry(globalTipsEnable) &&
            showTipsUI(globalTip, selectedOrderType)
        )
            return (
                <>
                    <InfoComponent screenName={screenName} infoText={LOCALIZATION_STRINGS.TIP_CASH_INFO_MESSAGE} />
                    <T2SDivider />
                </>
            );
    }

    getDynamicHeight(layout) {
        if (isValidElement(layout)) {
            this.setState({ qcHeight: layout.height });
        }
    }

    render() {
        const {
            isRecommendationSelectedFromBasket,
            cartItems,
            basketData,
            navigation,
            addressCurrentLocation,
            deliveryAddress,
            countryId
        } = this.props;
        return (
            <SafeAreaView style={styles.rootContainer}>
                <View style={styles.quickCheckoutViewStyle}>
                    <Animated.View style={styles.quickCheckoutContainerStyle}>
                        <View style={styles.topContainer}>
                            <View style={styles.closeContainer}>
                                <T2SIcon
                                    name={FONT_ICON.CLOSE}
                                    style={styles.closeIcon}
                                    onPress={this.closeModal}
                                    screenName={screenName}
                                    id={VIEW_ID.CLOSE_ICON}
                                />
                            </View>
                            {isValidElement(isRecommendationSelectedFromBasket) &&
                                !isRecommendationSelectedFromBasket &&
                                isValidElement(cartItems) &&
                                Array.isArray(cartItems) &&
                                cartItems.length > 0 && (
                                    <RecommendationList
                                        selectedScreenIds={'_' + screenName}
                                        isOrderProcessing={this.state.disableQCWindow}
                                    />
                                )}
                            <View style={styles.quickCheckoutContentViewStyle}>
                                {this.renderInfoMessage()}
                                {this.renderErrorOrWarnings()}
                                <T2SDivider />
                            </View>
                            <View
                                style={styles.quickCheckoutContentViewStyle}
                                onLayout={(event) => {
                                    this.getDynamicHeight(event.nativeEvent.layout);
                                }}>
                                <HeroNavigator
                                    showDifferentLocationInfoMessage={
                                        isFoodHubApp() &&
                                        isUKApp(countryId) &&
                                        !isCollectionOrder(this.props) &&
                                        isDifferentPostCodeFromLocation(addressCurrentLocation, deliveryAddress)
                                    }
                                    isOrderProcessing={this.state.disableQCWindow}
                                    height={this.state.qcHeight}
                                    screenName={screenName}
                                    title={LOCALIZATION_STRINGS.QUICK_CHECKOUT}
                                    closeTime={this.state.closeTime}
                                    config={this.getListOfScreenConfig()}
                                    basketTotal={getBasketTotal(basketData)}
                                    navigation={navigation}
                                    paymentErrorMessage={this.state.paymentErrorMessage}
                                    isPreOrderASAP={this.state.isPreOrderASAP}>
                                    {this.renderContactFreeDelivery()}
                                    {this.renderLegalAgeDeclaration()}
                                    <View style={styles.swipeOrderButtonContainerStyle}>{this.renderOrderButton()}</View>
                                </HeroNavigator>
                            </View>
                        </View>
                    </Animated.View>
                </View>
                <View style={styles.fixSafeViewBottomBackground} />
                {this.renderVerifyCVVModal()}
                {this.renderMissingItemModel()}
            </SafeAreaView>
        );
    }

    renderLegalAgeDeclaration() {
        const { storeConfigCuisines } = this.props;
        let showLegalAge = checkToShowLegalAgeConfirmation(storeConfigCuisines);
        if (showLegalAge) {
            return (
                <View style={styles.legalAgeDeclarationContainer}>
                    <T2SText style={styles.legalAgeText} screenName={screenName} id={VIEW_ID.LEGAL_AGE_DECLARATION}>
                        {LOCALIZATION_STRINGS.LEGAL_AGE_DECLARATION}
                    </T2SText>
                </View>
            );
        }
    }

    handleOrderSwipeStart() {
        this.setState({ disableQCWindow: true });
    }
    handleOrderOnFailed() {
        this.setState({ disableQCWindow: false });
    }
    handleOrderSwipeMove() {
        const { postCodeLookupApiStatus, basketError } = this.props;
        if (postCodeLookupApiStatus === POSTCODE_LOOKUP_API_STATUS.FAILED || isValidElement(basketError)) {
            this.props.restartQuickCheckout();
        }
    }
    handleOrderOnSuccess() {
        const { deliveryAddress } = this.props;
        Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.SWIPE_TO_CHECKOUT);
        if (!isCollectionOrder(this.props) && !isValidElement(deliveryAddress)) {
            showErrorMessage(LOCALIZATION_STRINGS.SELECT_DELIVERY_ADDRESS);
            this.setState({ disableQCWindow: false, showOrderProcessingLoader: false });
        } else {
            this.setState({ showOrderProcessingLoader: true, disableQCWindow: true }, () => {
                this.props.proceedCheckoutAction();
            });
        }
    }

    renderOrderButton() {
        let lightStyle = {
                backgroundColor: Colors.primaryColor
            },
            darkStyle = {
                backgroundColor: Colors.foodHubDarkGreen
            },
            swipeText = LOCALIZATION_STRINGS.SWIPE_ORDER;
        const { selectedDeliveryAddress } = this.state;
        const { basketError, basketLoader, postCodeLookupApiStatus } = this.props;
        let isSwipeDisable = false;
        if (
            (!isCollectionOrder(this.props) &&
                (!isValidNotEmptyString(selectedDeliveryAddress) || postCodeLookupApiStatus === POSTCODE_LOOKUP_API_STATUS.FAILED)) ||
            isValidElement(basketError)
        ) {
            isSwipeDisable = true;
            this.state.disableQCWindow && this.setState({ disableQCWindow: false });
        }
        return (
            <T2SView screenName={screenName} id={VIEW_ID.QC_BUTTON_CONTAINER} style={styles.orderButtonContainer}>
                {this.state.showOrderProcessingLoader ? (
                    this.renderLoader()
                ) : AppConfig.isSwipeToCheck ? (
                    <QuickCheckoutSwipeButton
                        ref={(swipebutton) => (this.swipebutton = swipebutton)}
                        shape="rounded-edge"
                        thumb={() => <CustomIcon name={FONT_ICON.DOUBLE_ARROW} size={20} style={styles.iconStyle} />}
                        visibleText={swipeText}
                        visibleTextStyle={styles.visibleTextStyle}
                        successText={LOCALIZATION_STRINGS.PLACE_ORDER}
                        successTextStyle={styles.visibleTextStyle}
                        closeTime={this.state.restart}
                        onSwipeStart={this.handleOrderSwipeStart}
                        onFailed={this.handleOrderOnFailed}
                        onSwipeMove={this.handleOrderSwipeMove}
                        disabled={isSwipeDisable || basketLoader}
                        height={52}
                        onSuccess={this.handleOrderOnSuccess}
                        screenName={screenName}
                        style={lightStyle}
                        thumbContainerStyle={darkStyle}
                        successContainerStyle={darkStyle}
                    />
                ) : (
                    this.renderBottomButton(isSwipeDisable || basketLoader)
                )}
            </T2SView>
        );
    }

    renderComponent(key, defaultValue = undefined) {
        return (
            <View style={styles.rootContainer}>
                {this.renderItemDivider()}
                <QuickCheckoutDetails
                    screenKey={key}
                    defaultValue={defaultValue}
                    onClose={this.handleQuickCheckoutDetailsClose}
                    paymentType={isValidElement(this.state.payment_mode) && this.state.payment_mode.toLowerCase()}
                />
            </View>
        );
    }

    renderItemDivider() {
        return <View style={styles.itemDividerStyle} />;
    }

    getListOfScreenConfig() {
        const { selectedDeliveryAddress } = this.state;
        const { storeConfigPreOrder, basketData, currency } = this.props;
        const screenConfigs = [];
        screenConfigs.push({
            title: isCollectionOrder(this.props) ? LOCALIZATION_STRINGS.COLLECTION : LOCALIZATION_STRINGS.DELIVERY,
            selectedValue:
                (!isCollectionOrder(this.props) && isValidNotEmptyString(selectedDeliveryAddress)) || isCollectionOrder(this.props)
                    ? trimCommaAndSpace(selectedDeliveryAddress)
                    : LOCALIZATION_STRINGS.ADDRESS_FORM_ADD_ADDRESS,
            component: this.renderComponent(QUICK_CHECKOUT_SCREEN_KEYS.QC_ADDRESS, selectedDeliveryAddress)
        });

        screenConfigs.push({
            title: LOCALIZATION_STRINGS.PAYMENT,
            selectedValue: getSelectedPaymentTypeValue(this.state.payment_mode, this.props),
            component: this.renderComponent(QUICK_CHECKOUT_SCREEN_KEYS.PAYMENT, this.state.payment_mode)
        });

        if (isPreOrderEnabled(storeConfigPreOrder)) {
            screenConfigs.push({
                title: LOCALIZATION_STRINGS.GET_IT_BY,
                selectedValue: this.state.getItBy,
                component: this.renderComponent(QUICK_CHECKOUT_SCREEN_KEYS.DELIVERY_TIME, this.state.getItBy)
            });
        }

        if (isValidElement(basketData?.total?.value)) {
            screenConfigs.push({
                title: LOCALIZATION_STRINGS.TOTAL,
                selectedValue: currency + basketData.total.value,
                component: this.renderComponent(QUICK_CHECKOUT_SCREEN_KEYS.AMOUNT)
            });
        }

        return screenConfigs;
    }

    componentWillUnmount() {
        this.removeEventListener();
        if (isValidElement(this.closeTimeout)) {
            clearTimeout(this.closeTimeout);
        }
    }

    setAnimatedMargin(toValue, duration = 500) {
        Animated.timing(this.state.animatedMargin, {
            toValue,
            duration
        }).start();
    }

    closeModal = debounce(
        (isFromClaimOffer = false) => {
            if (!this.state.disableQCWindow) {
                this.setAnimatedMargin(height);
                this.props.autoPresentQCAction(false);
                setTimeout(() => {
                    if (!this.state.disableQCWindow) {
                        this.props.navigation.pop();
                    }
                }, 400);
            }
        },
        3000,
        { leading: true, trailing: false }
    );

    renderContactFreeDelivery() {
        const { orderType, selectedPaymentMode, countryBaseFeatureGateResponse, contactFreeDelivery } = this.props;
        let isContactFreeDelivery = shouldShowContactFreeDelivery(orderType, selectedPaymentMode, countryBaseFeatureGateResponse);
        if (!isContactFreeDelivery) return null;
        return (
            <ContactLessFreeDelivery
                screenName={screenName}
                handleContactFree={this.handleContactFree}
                contactFreeDelivery={contactFreeDelivery}
            />
        );
    }

    handleContactFree() {
        const { contactFreeDelivery } = this.props;
        Analytics.logEvent(screenName, ANALYTICS_SCREENS.QC, {
            contact_free: !contactFreeDelivery
        });
        this.props.setContactFreeAction(!contactFreeDelivery);
    }

    renderErrorOrWarnings() {
        let { basketError, basketWarnings, deliveryAddress, postCodeLookupApiStatus } = this.props;
        const { paymentErrorMessage } = this.state;
        if (
            !isCollectionOrder(this.props) &&
            postCodeLookupApiStatus === POSTCODE_LOOKUP_API_STATUS.FAILED &&
            isValidElement(deliveryAddress)
        ) {
            if (!isValidElement(basketError)) {
                basketError = LOCALIZATION_STRINGS.ERROR_MESSAGE_UNSERVICEABLE_POSTCODE;
            }
        }

        if (isValidElement(basketError) && isValidElement(basketWarnings)) {
            return (
                <View>
                    {this.renderError(basketError)}
                    <T2SDivider />
                    {this.renderWarning()}
                </View>
            );
        } else if (isValidElement(basketError)) {
            return this.renderError(basketError);
        } else if (isValidElement(paymentErrorMessage)) {
            return this.renderError(paymentErrorMessage);
        } else if (isValidElement(basketWarnings) && this.isClaimAvailable()) {
            return (
                <View>
                    {this.renderWarning()}
                    <T2SDivider />
                    {this.renderClaimOffer()}
                </View>
            );
        } else if (isValidElement(basketWarnings)) {
            return this.renderWarning();
        } else if (this.isClaimAvailable()) {
            return this.renderClaimOffer();
        }
        //TODO while displaying the error message we don't want to show the Claim offer message
    }

    isClaimAvailable() {
        const { claimOffer, isGiftItemAvailable, freeItemClicked, host, menuResponse } = this.props;
        const freeItems = filterFreeItem(host, menuResponse);
        return claimOffer || (isGiftItemAvailable && freeItems.length > 0 && !freeItemClicked);
    }
    renderClaimOffer() {
        const { claimOffer } = this.props;
        return (
            <T2STouchableOpacity
                style={styles.warningContainer}
                screeName={screenName}
                id={VIEW_ID.CLAIM_OFFER_VIEW}
                onPress={this.handleClaimOffer}>
                <T2SIcon icon={FONT_ICON.INFO_ICON_FILLED} color={Colors.primaryColor} size={24} />
                <T2SText screenName={screenName} id={VIEW_ID.CLAIM_OFFER_TEXT} style={styles.claimOfferText}>
                    {claimOffer ? LOCALIZATION_STRINGS.CLAIM_OFFER_TAP_DESCRIPTION : LOCALIZATION_STRINGS.FREE_GIFT_MSG}
                </T2SText>
            </T2STouchableOpacity>
        );
    }
    handleClaimOffer() {
        const { claimOffer, host, menuResponse } = this.props;
        const freeItems = filterFreeItem(host, menuResponse);
        Analytics.logEvent(screenName, ANALYTICS_EVENTS.CLIM_OFFER_CLICKED);
        if (claimOffer) {
            this.handleClaimOfferTapped();
        } else {
            this.handleGiftItemTapped(freeItems);
        }
    }
    handleClaimOfferTapped = debounce(
        () => {
            this.closeModal();
        },
        300,
        { leading: true, trailing: false }
    );
    handleGiftItemTapped = debounce(
        (freeItems) => {
            this.props.navigation.navigate(SCREEN_OPTIONS.FREE_GIFT_ITEMS.route_name, {
                showBackButton: true,
                freeItems: freeItems
            });
        },
        300,
        { leading: true, trailing: false }
    );
    renderWarning() {
        const { basketWarnings } = this.props;
        return (
            <View style={styles.warningContainer}>
                <T2SIcon icon={FONT_ICON.ALERT} color={Colors.orange} size={24} />
                <T2SText screenName={screenName} id={VIEW_ID.WARNING_TEXT} style={styles.warningText}>
                    {basketWarnings}
                </T2SText>
            </View>
        );
    }
    renderError(basketError) {
        return <ErrorMessageComponent screenName={screenName} error={basketError} />;
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
            this.props.proceedCheckoutAction();
            this.resetVerifyCvv();
        }
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

    handleMissingItemCancelClicked() {
        this.props.resetMissingItemBasketAction();
    }
    handleMissingItemProceedClicked() {
        this.props.resetMissingItemBasketProceedAction();
    }

    renderMissingItemModel() {
        const { showMissingItem, currency, missingItemArray } = this.props;

        return (
            <MissingItemModel
                isVisible={showMissingItem}
                proceedClicked={this.handleMissingItemCancelClicked}
                currency={currency}
                missingItems={missingItemArray}
                cancelClicked={this.handleMissingItemProceedClicked}
                dialogCancelable={false}
            />
        );
    }

    renderLoader() {
        let loaderFile = require('../Utils/PlacingOrderLoader.json');
        if (isExpressPayment(this.props.payment_mode)) {
            loaderFile = require('../Utils/PlacingOrder_Orange.json');
        }
        return (
            <View style={styles.lottieViewStyle}>
                <LottieView source={loaderFile} autoPlay={true} loop={true} style={styles.lottieAnimationViewStyle} />
                <T2SText style={styles.placingYourOrderTextStyle}>{LOCALIZATION_STRINGS.PROCESSING_YOUR_ORDER}</T2SText>
            </View>
        );
    }

    renderBottomButton(isSwipeDisable) {
        const {
            payment_mode,
            countryBaseFeatureGateResponse,
            storeConfigSettingApplePay,
            storeConfigApplePay,
            storeConfigCardPayment
        } = this.props;
        const isExpressPay = isExpressPayment(payment_mode);
        const showBuyWithButton =
            isApplePayEnabled(storeConfigSettingApplePay, storeConfigApplePay, countryBaseFeatureGateResponse) ||
            isGooglePayEnabled(storeConfigCardPayment, countryBaseFeatureGateResponse);
        return (
            <CheckoutBottomButton
                screenName={screenName}
                isSwipeDisable={isSwipeDisable}
                showBuyWithButton={showBuyWithButton}
                onCheckoutClicked={this.handleCheckoutButtonAction}
                onBuyWithClicked={this.handleBuyWithPayAction}
                isExpressPay={isExpressPay}
            />
        );
    }

    handleCheckoutButtonAction = debounce(
        () => {
            Analytics.logEvent(ANALYTICS_SCREENS.QC, ANALYTICS_EVENTS.SWIPE_TO_CHECKOUT);
            if (!isCollectionOrder(this.props) && !isValidElement(this.props.deliveryAddress)) {
                showErrorMessage(LOCALIZATION_STRINGS.SELECT_DELIVERY_ADDRESS);
                this.setState({ disableQCWindow: false, showOrderProcessingLoader: false });
            } else {
                this.setState({ showOrderProcessingLoader: true, disableQCWindow: true }, () => {
                    this.props.proceedCheckoutAction();
                });
            }
        },
        500,
        { leading: true, trailing: false }
    );

    handleBuyWithPayAction = debounce(
        (paymentType) => {
            const isApplePay = paymentType === PAYMENT_TYPE.APPLE_PAY;
            this.props.updateUserPaymentMode(isApplePay ? PAYMENT_TYPE.APPLE_PAY : PAYMENT_TYPE.GOOGLE_PAY);
            this.setState({ payment_mode: isApplePay ? PAYMENT_TYPE.APPLE_PAY : PAYMENT_TYPE.GOOGLE_PAY }, () => {
                this.handleCheckoutButtonAction();
                Analytics.logEvent(
                    ANALYTICS_SCREENS.QC,
                    isApplePay ? ANALYTICS_EVENTS.SWIPE_TO_CHECKOUT_APPLE_PAY : ANALYTICS_EVENTS.SWIPE_TO_CHECKOUT_GOOGLE_PAY
                );
            });
        },
        500,
        { leading: true, trailing: false }
    );

    handleQuickCheckoutDetailsClose = (key, item, isPreOrderASAP) => {
        this.setState({ closeTime: new Date() });
        if (key === QUICK_CHECKOUT_SCREEN_KEYS.DELIVERY_TIME) {
            this.setState({
                getItBy: item === CONSTANTS.IMMEDIATELY ? item : item,
                isPreOrderASAP: isValidElement(isPreOrderASAP) ? isPreOrderASAP : false
            });
            this.props.setPreOrderDate(item, isPreOrderASAP);
        } else if (key === QUICK_CHECKOUT_SCREEN_KEYS.PAYMENT) {
            this.setState({ payment_mode: item.toUpperCase() });
        } else if (key === QUICK_CHECKOUT_SCREEN_KEYS.QC_ADDRESS) {
            if (isValidElement(item) && item === 'COLLECTION') {
                this.setState({ selectedDeliveryAddress: getAddressForQCFlow(this.props) });
            } else {
                this.setState({ selectedDeliveryAddress: addressStringFromAddressObj(item) });
            }
        }
        this.props.updateBasketAction(BASKET_UPDATE_TYPE.VIEW);
    };
}

const mapStateToProps = (state) => ({
    basketData: state.basketState.viewBasketResponse,
    restart: state.basketState.restart,
    addressResponse: state.addressState.addressResponse,
    currency: selectCurrencyFromStore(state),
    postcode: state.addressState.selectedPostcode,
    payment_mode: state.basketState.payment_mode,
    basketLoader: state.basketState.basketLoader,
    orderType: selectOrderType(state),
    preOrderDate: selectPreOrderDate(state),
    deliveryAddress: state.addressState.deliveryAddress,
    takeAwayAddress: selectTakeawayAddressSelector(state),
    walletBalance: state.walletState.walletBalance,
    isDeliveryPreOrderAvailable: isPreOrderAvailableForDeliverySelector(state),
    isCollectionPreOrderAvailable: isPreOrderAvailableForCollectionSelector(state),
    basketError: selectBasketErrors(state),
    basketWarnings: selectBasketWarnings(state),
    savedCardDetails: state.profileState.savedCardDetails,
    user_selected_card_id: state.basketState.user_selected_card_id,
    showVerifyCVV: state.basketState.showVerifyCVV,
    inValidCvvErrorMsg: state.basketState.inValidCvvErrorMsg,
    postCodeLookupApiStatus: state.addressState.postCodeLookupApiStatus,
    isCollectionAvailable: isCollectionAvailableSelector(state),
    isDeliveryAvailable: isDeliveryAvailableSelector(state),
    preOrderCollectionDates: selectPreOrderDatesForCollection(state),
    preOrderDeliveryDates: selectPreOrderDatesForDelivery(state),
    selectedOrderType: selectOrderType(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    showOrderProcessingLoader: state.basketState.showOrderProcessingLoader,
    timeZone: selectTimeZone(state),
    paymentErrorMessage: selectPaymentErrorMessage(state),
    contactFreeDelivery: selectContactFreeDelivery(state),
    selectedPaymentMode: getPaymentModeForBasket(state),
    showMissingItem: state.basketState.showMissingItem,
    missingItemArray: state.basketState.missingItemArray,
    isRecommendationSelectedFromBasket: selectRecommendationSelectedFromBasket(state),
    menuResponse: state.menuState.menuResponse,
    host: selectHost(state),
    claimOffer: selectCanClaimOffer(state),
    isGiftItemAvailable: selectFreeItemAvailable(state),
    freeItemClicked: state.basketState.freeItemClicked,
    cardTransactionFailed: state.basketState.cardTransactionFailed,
    cartItems: selectBasketViewItems(state),
    preOrderASAPEnabled: selectPreOrderASAP(state),
    isPreOrderASAP: state.basketState.isPreOrderASAP,
    storeConfigWalletEnabled: state.appState.storeConfigResponse?.wallet_payment,
    storeConfigCardPayment: state.appState.storeConfigResponse?.card_payment,
    storeConfigPreOrder: state.appState.storeConfigResponse?.preorder,
    storeConfigCuisines: state.appState.storeConfigResponse?.cuisines,
    storeConfigApplePay: state.appState.storeConfigResponse?.apple_pay,
    storeConfigSettingApplePay: state.appState.storeConfigResponse?.setting?.apple_pay,
    addressCurrentLocation: state.takeawayListReducer.addressCurrentLocation,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    globalTip: state.appState.storeConfigResponse?.global_tip,
    globalTipsEnable: state.appState.s3ConfigResponse?.global_tip
});
const mapDispatchToProps = {
    getPreOrderDates,
    setPreOrderDate,
    updateBasketAction,
    proceedCheckoutAction,
    restartQuickCheckout,
    updateCvvAction,
    resetCvvAction,
    resetMissingItemBasketAction,
    resetMissingItemBasketProceedAction,
    getWalletBalanceAction,
    checkDeliveryAddressAvailability,
    paymentErrorMessageAction,
    setContactFreeAction,
    autoPresentQCAction,
    updateUserPaymentMode
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickCheckoutScreen);
