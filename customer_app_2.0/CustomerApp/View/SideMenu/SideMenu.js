import React, { Component } from 'react';
import { AppState, Image, ScrollView, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { chooseCountryList, redirectRouteAction, refreshSideMenuAction, setSideMenuActiveAction } from '../../Redux/Actions';
import {
    getCountryNameIso,
    getSelectedLanguage,
    getTakeawayCountryName,
    handleReDirectToStoreReview,
    isCustomerApp,
    isFoodHubApp,
    isValidElement,
    isValidNotEmptyString,
    isValidString,
    isValidURL
} from 't2sbasemodule/Utils/helpers';
import SplashScreen from 'react-native-lottie-splash-screen';
import CodePush from 'react-native-code-push';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { customerAppTheme } from '../../Theme';
import { SCREEN_OPTIONS } from '../../Navigation/ScreenOptions';
import styles from '../SideMenu/styles/SideMenuStyle';
import { FONT_ICON } from '../../Fonts/FontIcon';
import { T2SDivider } from 't2sbasemodule/UI';
import * as Analytics from '../../../AppModules/AnalyticsModule/Analytics';
import { constructSideMenu, isBasketItemsReminder, isLoyalityPointEnabled, loginRequiredScreens } from '../../Utils/SideMenuHelper';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { invalidSessionAction, onLogoutAction } from 'appmodules/AuthModule/Redux/AuthAction';
import { handleNavigation } from '../../Navigation/Helper';
import { SCREEN_NAME, SIDE_MENU_CONSTANTS, TABLE_BOOKING_PAGE, VIEW_ID } from './SideMenuConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { resetDeliveryLookupAction, updateSelectedOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
import { showHideOrderTypeAction, showHideTAOrderTypeAction } from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import OrderTypeSelectionModal from 'appmodules/AddressModule/View/Components/OrderTypeSelectionModal';
import OfflineNotice from 't2sbasemodule/Managers/OfflineNoticeManager/OfflineNoticeManager';
import {
    getFoodhubLogoStatus,
    getReferralCampaignStatus,
    getShowPlayStoreRatingLeftMenu,
    getSilentCodePushStatus
} from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import AppUpdateManager from 't2sbasemodule/Managers/UpdateManager/AppUpdateManager';
import Config from 'react-native-config';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import OTPModalContainer from 'appmodules/ProfileModule/View/OTPModalContainer';
import { SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { getSplashTimeout } from 'appmodules/BaseModule/Helper';
import PushNotificationManager from 't2sbasemodule/Managers/PushNotificationManager/PushNotificationManager';
import SelectAddressScreen from 'appmodules/HomeAddressModule/View/SelectAddressScreen';
import { showHideSelectAddressAction } from 'appmodules/HomeAddressModule/Redux/HomeAddressAction';
import PushNotification from 'react-native-push-notification';
import { AppConstants } from '../../Utils/AppContants';
import { deleteAllPushNotificationReceived } from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotifiactionAction';
import TAOrderTypeModal from '../../../FoodHubApp/TakeawayListModule/View/Components/TAOrderTypeModal';
// import Instabug, { BugReporting } from 'instabug-reactnative';
import SideMenuVersion from './SideMenuVersion';
import SideMenuItem from './SideMenuItem';
import { restartQuickCheckout } from 'appmodules/QuickCheckoutModule/Redux/QuickCheckoutAction';
import * as Braze from 'appmodules/AnalyticsModule/Braze';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

let splashTimeout, logoutTimeout, yesClickTimeout;
class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.handleLogoutNegativeButtonClicked = this.handleLogoutNegativeButtonClicked.bind(this);
        this.handleLogoutYesClick = this.handleLogoutYesClick.bind(this);
        this.state = {
            showMore: false,
            showLogoutModal: false,
            configuratorCount: 0,
            showLocationPermissionDeniedModal: false,
            appState: AppState.currentState
        };
        this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
        this.props.refreshSideMenuAction();
        this.handleNavigateClickPropForLessRender = this.handleNavigateClickPropForLessRender.bind(this);
        this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
        this.handleNavigateClickPropForMoreRender = this.handleNavigateClickPropForMoreRender.bind(this);
        this.handleNavigateClickPropForFoodhubApp = this.handleNavigateClickPropForFoodhubApp.bind(this);
        this.handleNavigateClickPropForRenderingLanguageSelection = this.handleNavigateClickPropForRenderingLanguageSelection.bind(this);
        this.handleNavigateClickPropForSideMenuItems = this.handleNavigateClickPropForSideMenuItems.bind(this);
        this.handleVersionClick = this.handleVersionClick.bind(this);
    }

    componentDidMount() {
        splashTimeout = setTimeout(() => {
            SplashScreen.hide();
        }, getSplashTimeout());
        this.codePushSync();
        const { countryBaseFeatureGateResponse } = this.props;
        if (isBasketItemsReminder(countryBaseFeatureGateResponse)) {
            AppState.addEventListener('change', this.handleAppStateChange);
        }
    }

    componentDidUpdate(prevProps) {
        // if (
        //     isValidElement(this.props.profileResponse) &&
        //     isValidElement(this.props.profileResponse.email) &&
        //     ((isValidElement(prevProps.profileResponse) &&
        //         isValidElement(prevProps.profileResponse.email) &&
        //         prevProps.profileResponse.email !== this.props.profileResponse.email) ||
        //         !isValidElement(prevProps.profileResponse))
        // ) {
        //     BugReporting.setInvocationEvents([Instabug.invocationEvent.floatingButton]);
        // }
    }

    componentWillUnmount() {
        /**
         * Re-allow restarts, and optionally trigger
         * a restart if one was currently pending.
         */
        if (isBasketItemsReminder(this.props.countryBaseFeatureGateResponse)) AppState.removeEventListener('change');
        CodePush.allowRestart();
        if (isValidElement(logoutTimeout)) {
            clearTimeout(logoutTimeout);
        }
        if (isValidElement(splashTimeout)) {
            clearTimeout(splashTimeout);
        }
        if (isValidElement(yesClickTimeout)) {
            clearTimeout(yesClickTimeout);
        }
    }

    handleAppStateChange = (nextAppState) => {
        const { cartItems, createBasketResponse, profileResponse, countryBaseFeatureGateResponse } = this.props;
        let basketId = isValidElement(createBasketResponse?.resource_id) && createBasketResponse.resource_id;
        let reminderMinutes =
            isValidElement(countryBaseFeatureGateResponse?.basket_items_reminder?.schedule_mins) &&
            countryBaseFeatureGateResponse.basket_items_reminder.schedule_mins * 60 * 1000;
        this.setState({ appState: nextAppState });
        if (isValidElement(basketId) && nextAppState === AppConstants.APP_STATUS.ACTIVE) {
            this.props.restartQuickCheckout();
        }
        let userName = isValidString(profileResponse?.first_name) ? profileResponse.first_name : LOCALIZATION_STRINGS.FOODIE;
        if (nextAppState === AppConstants.APP_STATUS.ACTIVE) {
            PushNotification.cancelAllLocalNotifications();
        }
        if (
            isValidElement(cartItems) &&
            cartItems.length > 0 &&
            isValidElement(basketId) &&
            nextAppState.match(AppConstants.APP_STATUS.BACKGROUND)
        ) {
            PushNotification.localNotificationSchedule({
                id: `${basketId}`,
                message: `${userName} ${LOCALIZATION_STRINGS.CART_REMAINDER}`,
                date: new Date(Date.now() + reminderMinutes),
                userInfo: {
                    basket: basketId
                }
            });
        }
    };

    codePushSync() {
        const { countryBaseFeatureGateResponse } = this.props;
        const silentCodePush = getSilentCodePushStatus(countryBaseFeatureGateResponse);
        let updateDialogOptions = {
            updateTitle: Config.APP_NAME,
            optionalUpdateMessage: LOCALIZATION_STRINGS.CODE_PUSH_OPTIONAL_DESCRIPTION,
            optionalIgnoreButtonLabel: LOCALIZATION_STRINGS.CODE_PUSH_NOT_NOW,
            optionalInstallButtonLabel: LOCALIZATION_STRINGS.CODE_PUSH_UPDATE,
            mandatoryContinueButtonLabel: LOCALIZATION_STRINGS.CODE_PUSH_UPDATE,
            mandatoryUpdateMessage:
                LOCALIZATION_STRINGS.CODE_PUSH_MANDATORY_DESCRIPTION +
                Config.APP_NAME +
                LOCALIZATION_STRINGS.CODE_PUSH_MANDATORY_DESCRIPTION_2
        };
        CodePush.sync(
            {
                updateDialog: silentCodePush ? null : updateDialogOptions,
                mandatoryInstallMode: silentCodePush ? CodePush.InstallMode.ON_NEXT_RESUME : CodePush.InstallMode.IMMEDIATE,
                installMode: silentCodePush ? CodePush.InstallMode.ON_NEXT_RESTART : CodePush.InstallMode.IMMEDIATE
            },
            (syncStatus) => {
                switch (syncStatus) {
                    case CodePush.SyncStatus.UPDATE_INSTALLED:
                        break;
                    case CodePush.SyncStatus.UPDATE_IGNORED:
                        break;
                    case CodePush.SyncStatus.UNKNOWN_ERROR:
                        break;
                    case CodePush.SyncStatus.INSTALLING_UPDATE:
                        break;
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                        break;
                    case CodePush.SyncStatus.UP_TO_DATE:
                        break;
                }
            }
        );
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: customerAppTheme.colors.drawer }}>
                {this.state.showLogoutModal && this.renderLogoutModal()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => (this.scrollView = ref)}
                    onContentSizeChange={() => {
                        if (isValidElement(this.scrollView)) {
                            this.scrollView.scrollToEnd({ animated: true });
                        }
                    }}>
                    <View style={styles.drawerContent}>
                        <View style={styles.navigationHeader} {...setTestId(SCREEN_NAME.SIDE_MENU, VIEW_ID.FOOD_HUB_LOGO_CONTAINER)}>
                            <T2STouchableOpacity
                                screenName={SCREEN_NAME.SIDE_MENU}
                                id={VIEW_ID.BACK_ARROW}
                                style={styles.backButtonStyle}
                                onPress={() => {
                                    Analytics.logBackPress(ANALYTICS_SCREENS.SIDE_MENU);
                                    this.props.navigation.navigate(SCREEN_OPTIONS.HOME.route_name);
                                }}>
                                <CustomIcon name={FONT_ICON.BACK} size={22} />
                            </T2STouchableOpacity>
                            {this.renderAppLogo()}
                        </View>
                        {this.renderLessSideMenuItems()}
                        <T2SDivider style={styles.dividerStyle} />
                        {this.renderMoreOrLessButton()}
                        {this.renderLoadMoreSideMenuItems()}
                    </View>
                </ScrollView>
                <SideMenuVersion
                    handleVersion={this.handleVersionClick}
                    foodhub_logo={this.props.countryBaseFeatureGateResponse?.foodhub_logo}
                />
                {this.renderOrderTypeModal()}
                {this.renderAddressSelection()}
                {this.renderTAOrderTypeModal()}
                <OTPModalContainer navigation={this.props.navigation} />
                <AppUpdateManager />
                <OfflineNotice />
                <PushNotificationManager />
            </SafeAreaView>
        );
    }

    handleVersionClick() {
        const { isUserLoggedIn, profileResponse } = this.props;
        if (
            isUserLoggedIn &&
            isValidElement(profileResponse) &&
            isValidString(profileResponse.email) &&
            (profileResponse.email.endsWith('@touch2success.com') || profileResponse.email.endsWith('@foodhub.com'))
        ) {
            this.setState({ configuratorCount: this.state.configuratorCount + 1 }, () => {
                if (this.state.configuratorCount === 5) {
                    handleNavigation(SCREEN_OPTIONS.CONFIGURATOR.route_name);
                    this.setState({ configuratorCount: 0 });
                }
            });
        }
    }

    handleNavigateClickPropForLessRender() {
        const { countryBaseFeatureGateResponse, profileResponse, storeIOSlink, storeAndroidLink, countryIso } = this.props;
        handleReDirectToStoreReview(countryBaseFeatureGateResponse, profileResponse, null, storeIOSlink, storeAndroidLink, countryIso);
    }

    handleShowMoreClick = () => {
        this.setState((previousState) => ({ showMore: !previousState.showMore }));
    };
    handleNavigation = (routeName) => {
        Analytics.logAction(ANALYTICS_SCREENS.SIDE_MENU, ANALYTICS_EVENTS.DRAWER_NAVIGATION, { screen_navigate_to: routeName });
        const { navigation, isUserLoggedIn } = this.props;
        const isLoginRequired = loginRequiredScreens(routeName, isUserLoggedIn);
        let route;
        if (isLoginRequired) {
            route = SCREEN_OPTIONS.SOCIAL_LOGIN.route_name;
            navigation.closeDrawer();
            this.props.redirectRouteAction(routeName);
        } else {
            route = routeName;
            this.props.setSideMenuActiveAction(routeName);
        }
        const navigateAction = CommonActions.navigate({
            name: route
        });
        navigation.dispatch(navigateAction);
    };

    renderLessSideMenuItems = () => {
        const { visibleSideMenuItems, isUserLoggedIn, countryBaseFeatureGateResponse } = this.props;

        if (isValidElement(visibleSideMenuItems)) {
            let finalList = constructSideMenu(
                visibleSideMenuItems,
                isUserLoggedIn,
                this.isShowLoyaltyPoints(),
                this.isShowTableReservation(),
                this.isShowReferFriend(),
                countryBaseFeatureGateResponse
            );
            return (
                <View>
                    {this.formSideMenuItems(finalList)}
                    {!isCustomerApp() && getShowPlayStoreRatingLeftMenu(countryBaseFeatureGateResponse) && (
                        <SideMenuItem
                            screenName={LOCALIZATION_STRINGS.RATE_APP}
                            selection={false}
                            screenDisplayName={LOCALIZATION_STRINGS.RATE_APP}
                            handleNavigateClickProp={this.handleNavigateClickPropForLessRender}
                            ImageName={FONT_ICON.STAR_STROKE}
                        />
                    )}
                </View>
            );
        }
    };

    isShowLoyaltyPoints() {
        const { loyaltyStatus, profileResponse, loyaltyStatusMessage } = this.props;
        return (
            isCustomerApp() &&
            isValidElement(loyaltyStatus) &&
            isValidElement(profileResponse) &&
            isValidElement(profileResponse.loyalty_point_available) &&
            isLoyalityPointEnabled(loyaltyStatus, loyaltyStatusMessage, profileResponse.loyalty_point_available) &&
            loyaltyStatus === SIDE_MENU_CONSTANTS.ENABLED
        );
    }

    isShowTableReservation() {
        return isCustomerApp() && isValidElement(this.props.bookingPage) && this.props.bookingPage === TABLE_BOOKING_PAGE;
    }

    isShowReferFriend() {
        const { profileResponse, countryBaseFeatureGateResponse } = this.props;
        const isReferralEnabled = getReferralCampaignStatus(countryBaseFeatureGateResponse);
        return isFoodHubApp() && isReferralEnabled && isValidNotEmptyString(profileResponse?.referralLink);
    }

    handleNavigateClickPropForMoreRender() {
        this.props.navigation.closeDrawer();
        logoutTimeout = setTimeout(() => this.setState({ showLogoutModal: true }), 200);
    }
    renderLoadMoreSideMenuItems = () => {
        const { hiddenSideMenuItems, isUserLoggedIn } = this.props;
        if (isValidElement(hiddenSideMenuItems) && this.state.showMore) {
            return (
                <View>
                    {this.renderCountryPick()}
                    {this.renderLanguageSelection()}
                    {this.formSideMenuItems(hiddenSideMenuItems)}
                    {isUserLoggedIn && (
                        <SideMenuItem
                            selectedItem={this.props.selectedItem}
                            screenName={LOCALIZATION_STRINGS.LOGOUT}
                            selection={false}
                            screenDisplayName={LOCALIZATION_STRINGS.LOGOUT}
                            handleNavigateClickProp={this.handleNavigateClickPropForMoreRender}
                            ImageName={FONT_ICON.LOGOUT}
                        />
                    )}
                </View>
            );
        }
    };

    handleNavigateClickPropForFoodhubApp(screenName) {
        this.props.chooseCountryList(screenName);
        this.handleNavigation(screenName);
    }

    renderCountryPick() {
        return (
            isFoodHubApp() && (
                <SideMenuItem
                    screenName={SCREEN_OPTIONS.COUNTRY_PICKER.route_name}
                    screenDisplayName={getTakeawayCountryName(this.props.countryName)}
                    selectedItem={this.props.selectedItem}
                    handleNavigateClickProp={this.handleNavigateClickPropForFoodhubApp}
                    ImageName={getCountryNameIso(this.props.countryIso)}
                />
            )
        );
    }

    handleNavigateClickPropForRenderingLanguageSelection(screenName) {
        this.handleNavigation(screenName);
    }

    renderLanguageSelection() {
        let defaultLanguage = getSelectedLanguage(this.props.language, this.props.defaultLanguage);
        return (
            <SideMenuItem
                labelCount={null}
                screenName={SCREEN_OPTIONS.LANGUAGE.route_name}
                screenDisplayName={isValidElement(defaultLanguage) ? defaultLanguage.name : ''}
                selectedItem={this.props.selectedItem}
                handleNavigateClickProp={this.handleNavigateClickPropForRenderingLanguageSelection}
                ImageName={FONT_ICON.LANGUAGE}
            />
        );
    }

    renderMoreOrLessButton() {
        return (
            <SideMenuItem
                screenName={LOCALIZATION_STRINGS.MORE}
                selection={false}
                screenDisplayName={!this.state.showMore ? LOCALIZATION_STRINGS.MORE : LOCALIZATION_STRINGS.LESS}
                handleNavigateClickProp={this.handleShowMoreClick}
                ImageName={FONT_ICON.MORE}
                trailingIcon={!this.state.showMore ? FONT_ICON.ARROW_DOWN : FONT_ICON.ARROW_UP}
            />
        );
    }

    handleLogoutNegativeButtonClicked() {
        this.setState({ showLogoutModal: false });
    }

    renderLogoutModal() {
        return (
            <T2SModal
                isVisible={this.state.showLogoutModal}
                requestClose={this.handleLogoutNegativeButtonClicked}
                title={LOCALIZATION_STRINGS.LOGOUT}
                description={LOCALIZATION_STRINGS.LOGOUT_MESSAGE}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                positiveButtonClicked={this.handleLogoutYesClick}
                negativeButtonClicked={this.handleLogoutNegativeButtonClicked}
            />
        );
    }

    handleLogoutYesClick() {
        let { countryBaseFeatureGateResponse } = this.props;
        Braze.logLogoutAnalytics(countryBaseFeatureGateResponse, SEGMENT_STRINGS.MANUAL);
        this.setState({ showLogoutModal: false });
        this.props.onLogoutAction();
        this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
        this.props.deleteAllPushNotificationReceived();
        this.setState({ showLogoutModal: false });
        yesClickTimeout = setTimeout(() => {
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
            showInfoMessage(LOCALIZATION_STRINGS.LOGOUT_SUCCESSFULLY);
        }, 200);
    }

    dismissInvalidSessionModal() {
        this.props.invalidSessionAction(false);
    }

    handleNavigateClickPropForSideMenuItems(screenName) {
        this.handleNavigation(screenName);
    }

    formSideMenuItems(array) {
        return array.map((value, index) => {
            return (
                <SideMenuItem
                    key={index}
                    screenName={value.key}
                    screenDisplayName={isValidString(value.name) ? value.name : value.key}
                    selectedItem={this.props.selectedItem}
                    handleNavigateClickProp={this.handleNavigateClickPropForSideMenuItems}
                    ImageName={value.icon_name}
                />
            );
        });
    }

    renderAppLogo = () => {
        const { countryBaseFeatureGateResponse } = this.props;
        if (isFoodHubApp()) {
            return (
                <Image
                    resizeMode="contain"
                    style={styles.navigationHeaderImage}
                    source={getFoodhubLogoStatus(countryBaseFeatureGateResponse?.foodhub_logo)}
                />
            );
        } else {
            const { storeConfigLogoUrl, imageLogoUrl } = this.props;
            if (isValidURL(imageLogoUrl)) {
                return <T2SFastImage resizeMode="contain" style={styles.navigationHeaderImage} source={{ uri: imageLogoUrl }} />;
            } else if (isCustomerApp() && isValidURL(storeConfigLogoUrl)) {
                return <T2SFastImage resizeMode="contain" style={styles.navigationHeaderImage} source={{ uri: storeConfigLogoUrl }} />;
            } else {
                return (
                    <Image resizeMode="contain" style={styles.navigationHeaderImage} source={require('../../Images/takeaway_logo.png')} />
                );
            }
        }
    };

    renderOrderTypeModal() {
        return <OrderTypeSelectionModal onOrderTypeModalClose={this.onOrderTypeModalClose} deliveryFor="" />;
    }
    renderAddressSelection() {
        return <SelectAddressScreen onAddressSelectionClose={this.onAddressSelectionClose} deliveryFor="" />;
    }

    onOrderTypeModalClose = () => {
        this.props.showHideOrderTypeAction(false);
        this.props.resetDeliveryLookupAction();
    };

    renderTAOrderTypeModal() {
        return <TAOrderTypeModal onOrderTypeModalClose={this.taOrderTypeModalClose} deliveryFor={''} />;
    }

    taOrderTypeModalClose = () => {
        this.props.showHideTAOrderTypeAction(false);
    };

    onAddressSelectionClose = () => {
        this.props.showHideSelectAddressAction(false);
    };
}

const mapStateToProps = (state) => ({
    selectedItem: state.appState.activeMenu,
    visibleSideMenuItems: state.appState.visibleSideMenuItems,
    hiddenSideMenuItems: state.appState.hiddenSideMenuItems,
    connectionStatus: state.appState.connectionStatus,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    profileResponse: state.profileState.profileResponse,
    language: state.appState.language,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    createBasketResponse: state.basketState.createBasketResponse,
    cartItems: state.basketState.cartItems,
    loyaltyStatus: state.appState.storeConfigResponse?.loyalty_status,
    loyaltyStatusMessage: state.appState.storeConfigResponse?.loyalty_status_message,
    bookingPage: state.appState.storeConfigResponse?.booking_page,
    storeConfigLogoUrl: state.appState.storeConfigResponse?.logo_url,
    countryName: state.appState.s3ConfigResponse?.country?.name,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    imageLogoUrl: state.appState.s3ConfigResponse?.config?.images?.logo_url,
    defaultLanguage: state.appState.s3ConfigResponse?.language?.default,
    payment_mode: state.basketState.payment_mode,
    paymentStatus: state.basketState.paymentStatus,
    storeIOSlink: state.appState.storeConfigResponse?.ios_link,
    storeAndroidLink: state.appState.storeConfigResponse?.android_link
});

const mapDispatchToProps = {
    refreshSideMenuAction,
    setSideMenuActiveAction,
    onLogoutAction,
    redirectRouteAction,
    invalidSessionAction,
    resetDeliveryLookupAction,
    chooseCountryList,
    updateSelectedOrderType,
    showHideOrderTypeAction,
    showHideTAOrderTypeAction,
    showHideSelectAddressAction,
    deleteAllPushNotificationReceived,
    restartQuickCheckout
};
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
