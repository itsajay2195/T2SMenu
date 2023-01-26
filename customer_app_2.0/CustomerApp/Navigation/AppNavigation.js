import React, { Component } from 'react';
import { batch, connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderStyleInterpolators, TransitionPresets, TransitionSpecs } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { navigationRef } from './NavigationService';
import SideMenu from '../View/SideMenu/SideMenu';
import { AuthStackScreen } from 'appmodules/AuthModule/Navigation/AuthNavigation';
import { ProfileStackScreen } from 'appmodules/ProfileModule/Navigation/ProfileNavigation';
import { NotificationStackScreen } from 'appmodules/NotificationModule/Navigation/NotificationNavigation';
import { TotalSavingsStackScreen } from 'appmodules/TotalSavingsModule/Navigation/TotalSavingsNavigation';
import { LoyaltyPointsStackScreen } from 'appmodules/LoyaltyPointsModule/Navigation/LoyaltyPointsNavigation';
import { TableReservationStackScreen } from 'appmodules/TableReservationModule/Navigation/TableReservationNavigation';
import { TakeawayDetailsStackScreen } from 'appmodules/TakeawayDetailsModule/Navigation/TakeawayDetailsStack';
import { customerAppTheme } from '../Theme';
import { SCREEN_OPTIONS } from './ScreenOptions';
import { T2SIcon } from 't2sbasemodule/UI';
import { QuickCheckoutStackScreen } from 'appmodules/QuickCheckoutModule/Navigation/QuickCheckoutNavigation';
import { ADDRESS_FORM_TYPE } from 'appmodules/AddressModule/Utils/AddressConstants';
import { isDebugBuildType, isFoodHubApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { OrderManagementNavigation } from 'appmodules/OrderManagementModule/Navigation/OrderManagementNavigation';
import { SupportStackScreen } from 'appmodules/SupportModule/Navigation/SupportScreenNavigation';
import { appInitialSetupAction, deepLinkToPage, resetExpiredBasketAction, launchBugsee, updateGoogleSessionToken } from '../Redux/Actions';
import {
    AboutUsStackScreen,
    AllergyInformationStackScreen,
    PrivacyPolicyStackScreen,
    TermsAndConditionsStackScreen,
    TermsOfUseStackScreen
} from 'appmodules/CommonWebviewModule/Navigation/CommonWebviewNavigation';
import { resetReOrderStoreConfigAction } from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import FreeItemsList from 'appmodules/BasketModule/View/FreeItems/FreeItemsList';
import ViewOrder from 'appmodules/OrderManagementModule/View/ViewOrder';
import { FavouriteNavigation } from '../../FoodHubApp/TakeawayListModule/Navigation/FavouriteNavigation';
import { WalletNavigation } from '../../FoodHubApp/WalletModule/Navigation/WalletNavigation';
import { HomeStackScreen } from 'appmodules/HomeModule/Navigation/HomeNavigation';
import { InformationModal } from 't2sbasemodule/UI/CommonUI/InformationModal';
import LanguageScreen from 'appmodules/LanguageModule/View/LanguageScreen';
import { setSessionMigrated } from 't2sbasemodule/Network/SessionManager/Redux/SessionManagerAction';
import { selectInitAPIStatus } from 't2sbasemodule/Utils/AppSelectors';
import CountryPickerScreen from '../../FoodHubApp/LandingPage/View/CountryPickerScreen';
import LandingPageScreen from '../../FoodHubApp/LandingPage/View/LandingPageScreen';
import AddOnScreen from 'appmodules/MenuModule/View/AddOn';
import { resetMenuRelatedDataForNonCustomerApps } from 'appmodules/MenuModule/Redux/MenuAction';
import SearchMenuView from 'appmodules/MenuModule/View/SearchMenuView';
import { Linking, Platform } from 'react-native';
import TakeawayFallbackScreen from 'appmodules/FallbackModule/View/TakeawayFallbackScreen';
import { ZohoSupport } from '../NativeModules/ZohoDesk';
import { AppConfig } from '../Utils/AppConfig';
import { isExpiredBasket } from 'appmodules/BaseModule/Helper';
import FallbackScreen from 'appmodules/FallbackModule/View/FallbackScreen';
import { AppConstants } from '../Utils/AppContants';
import LocationLocatorMapScreen from 'appmodules/HomeAddressModule/View/LocationLocatorMapScreen';
import LocationSearchScreen from 'appmodules/HomeAddressModule/View/LocationSearchScreen';
import AddressFormView from 'appmodules/HomeAddressModule/View/AddressFormView';
import { linking } from 'appmodules/RouterModule/Utils/RouterConfig';

import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import WebViewScreen from 'appmodules/CommonWebviewModule/View/WebViewScreen';
import { getConfiguration } from 't2sbasemodule/Network/SessionManager/Utils/SessionManagerSelectors';
import { getBugseeValue } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorHelper';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { handleSwipeGesture } from './NavigationUtils';
import ReferralScreen from 'appmodules/ProfileModule/View/ReferralScreen';
import FoodhubPaybyLinkPaymentScreen from 'appmodules/QuickCheckoutModule/View/FoodhubPaybyLinkPaymentScreen';
import WebViewComponent from 'appmodules/QuickCheckoutModule/View/WebViewPayment';
import Login from 'appmodules/AuthModule/View/Login';
import { randomSessionToken } from '../../FoodHubApp/HomeModule/Utils/Helper';
const routeNameRef = React.createRef();

class AppNavigation extends Component {
    constructor(props) {
        super(props);
        props.appInitialSetupAction();
    }

    componentDidMount() {
        this.callInit();
    }

    callInit() {
        const { configFileName } = this.props;
        if (getBugseeValue(configFileName)) {
            this.props.launchBugsee();
        }

        this.props.setSessionMigrated();

        if (isDebugBuildType()) {
            ZohoSupport.initialize({
                orgID: AppConfig.zohoSupport.orgId,
                appID: AppConfig.zohoSupport.appID,
                dataCenter: AppConfig.zohoSupport.dataCenter
            });
        } else {
            ZohoSupport.initialize({
                orgID: AppConfig.zohoSupport.orgId,
                appID: AppConfig.zohoSupport.appID,
                dataCenter: AppConfig.zohoSupport.dataCenter
            });
        }

        batch(() => {
            this.props.resetReOrderStoreConfigAction(null);
            this.props.resetMenuRelatedDataForNonCustomerApps();
        });
        if (isExpiredBasket(this.props.basketCreatedAt)) {
            this.props.resetExpiredBasketAction();
        }
        this.handleDeepLikingRedirection();

        const { googleSessionToken } = this.props;
        if (!isValidString(googleSessionToken)) {
            this.props.updateGoogleSessionToken(randomSessionToken());
        }
    }
    handleDeepLikingRedirection() {
        Linking.getInitialURL()
            .then((urlResponse) => {
                if (urlResponse) {
                    this.props.deepLinkToPage(urlResponse);
                }
            })
            .catch((error) => {
                showErrorMessage(error);
            });
        Linking.addEventListener('url', ({ url }) => {
            this.props.deepLinkToPage(url);
        });
    }

    onNavigationReady = () => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
    };

    onNavigationStateChange = () => {
        const previousRouteName = routeNameRef.current;
        const currentRoute = navigationRef.current?.getCurrentRoute();
        const currentRouteName = currentRoute?.name;

        if (currentRouteName && previousRouteName !== currentRouteName) {
            const { featureGateResponse } = this.props;
            let eventObj = { screen_name: currentRouteName };
            //use if analytics based info to be passed for screen tracking events
            if (isValidElement(currentRoute?.params?.analyticsObj)) {
                eventObj = { ...eventObj, ...currentRoute?.params?.analyticsObj };
            }
            Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.SCREEN_VIEW, eventObj);
        }

        routeNameRef.current = currentRouteName;
    };

    render() {
        if (isValidElement(this.props.initAPIStatus) && this.props.initAPIStatus === AppConstants.AppInitializationStatus.FALLBACK_SCREEN) {
            return <FallbackScreen />;
        } else {
            return (
                <PaperProvider
                    theme={customerAppTheme}
                    settings={{
                        icon: (props) => <T2SIcon {...props} size={30} color={customerAppTheme.colors.text} />
                    }}>
                    <NavigationContainer
                        linking={linking}
                        ref={navigationRef}
                        theme={customerAppTheme}
                        onReady={this.onNavigationReady}
                        onStateChange={this.onNavigationStateChange}>
                        <RootStackScreen />
                    </NavigationContainer>
                </PaperProvider>
            );
        }
    }
    componentWillUnmount() {
        try {
            Linking.removeEventListener('url');
        } catch (e) {
            //Nothing
        }
    }
}

const ModalTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: TransitionSpecs.TransitionIOSSpec,
        close: TransitionSpecs.TransitionIOSSpec
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({ current, layouts }) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateY: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.height, 0]
                        })
                    }
                ]
            },
            overlayStyle: {
                opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5]
                })
            }
        };
    }
};

const RootStack = createStackNavigator();
const RootStackScreen = () => {
    return (
        <RootStack.Navigator headerMode="none">
            <RootStack.Screen name={SCREEN_OPTIONS.MAIN_APP.route_name} component={AppDrawerScreen} />
            <AppDrawer.Screen name={SCREEN_OPTIONS.SOCIAL_LOGIN.route_name} component={AuthStackScreen} />
            <RootStack.Screen
                name={SCREEN_OPTIONS.QUICK_CHECKOUT.route_name}
                component={QuickCheckoutStackScreen}
                options={{
                    gestureEnabled: false,
                    cardStyle: { backgroundColor: 'rgba(0,0,0,0.15)' },
                    ...ModalTransition
                }}
            />
            <AppDrawer.Screen
                name={SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name}
                component={LocationSearchScreen}
                initialParams={{ viewType: ADDRESS_FORM_TYPE.ADD }}
            />
            <AppDrawer.Screen
                name={SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name}
                component={LocationLocatorMapScreen}
                initialParams={{ viewType: ADDRESS_FORM_TYPE.ADD }}
                options={(props) => {
                    handleSwipeGesture(props, false);
                }}
            />
            <AppDrawer.Screen
                name={SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name}
                component={AddressFormView}
                initialParams={{ viewType: ADDRESS_FORM_TYPE.ADD }}
            />
            <RootStack.Screen
                name={SCREEN_OPTIONS.FREE_GIFT_ITEMS.route_name}
                component={FreeItemsList}
                initialParams={{ freeItems: [] }}
            />
            <RootStack.Screen name={SCREEN_OPTIONS.VIEW_ORDER.route_name} component={ViewOrder} initialParams={{ orderId: null }} />
            <RootStack.Screen name={SCREEN_OPTIONS.RECOMMENDATIONS_ADDON.route_name} component={AddOnScreen} />
            {isFoodHubApp() && <RootStack.Screen name={SCREEN_OPTIONS.LOCATION_PICKER.route_name} component={LandingPageScreen} />}
            <RootStack.Screen
                name={SCREEN_OPTIONS.ALERT.route_name}
                component={InformationModal}
                options={{
                    animationEnabled: false,
                    gestureEnabled: false,
                    cardStyle: { backgroundColor: 'rgba(0,0,0,0)' }
                }}
            />
            <RootStack.Screen
                name={SCREEN_OPTIONS.MENU_SEARCH_SCREEN.route_name}
                component={SearchMenuView}
                options={{
                    animationEnabled: true,
                    cardStyle: { backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)' },
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalTransition
                }}
            />
            <RootStack.Screen name={SCREEN_OPTIONS.TAKEAWAY_FALL_BACK_SCREEN.route_name} component={TakeawayFallbackScreen} />
            <RootStack.Screen name={SCREEN_OPTIONS.WEB_VIEW_COMPONENT.route_name} component={WebViewScreen} />
            <RootStack.Screen name={SCREEN_OPTIONS.LOGIN.route_name} component={Login} />
            <RootStack.Screen name={SCREEN_OPTIONS.PBL_PAGE_PAYMENT.route_name} component={FoodhubPaybyLinkPaymentScreen} />
            <RootStack.Screen name={SCREEN_OPTIONS.WEBVIEW_PAYMENT.route_name} component={WebViewComponent} />
        </RootStack.Navigator>
    );
};

const AppDrawer = createDrawerNavigator();

class AppDrawerScreen extends Component<{}> {
    render() {
        return (
            <AppDrawer.Navigator
                backBehavior={'initialRoute'}
                drawerContent={(props) => <SideMenu {...props} />}
                screenOptions={{
                    headerShown: false
                    // gestureEnabled: false
                }}>
                <AppDrawer.Screen name={SCREEN_OPTIONS.LANDING.route_name} component={HomeStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.PROFILE.route_name} component={ProfileStackScreen} />
                <AppDrawer.Screen
                    options={{ unmountOnBlur: true }}
                    name={SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name}
                    component={FavouriteNavigation}
                />
                <AppDrawer.Screen
                    options={{ unmountOnBlur: true }}
                    name={SCREEN_OPTIONS.ORDER_HISTORY.route_name}
                    component={OrderManagementNavigation}
                />
                <AppDrawer.Screen options={{ unmountOnBlur: true }} name={SCREEN_OPTIONS.WALLET.route_name} component={WalletNavigation} />
                <AppDrawer.Screen
                    options={{ unmountOnBlur: true }}
                    name={SCREEN_OPTIONS.REFERRAL_SCREEN.route_name}
                    component={ReferralScreen}
                />
                <AppDrawer.Screen
                    options={{ unmountOnBlur: true }}
                    name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
                    component={NotificationStackScreen}
                />
                <AppDrawer.Screen name={SCREEN_OPTIONS.LOYALTY_POINTS.route_name} component={LoyaltyPointsStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.TABLE_BOOKING.route_name} component={TableReservationStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.TOTAL_SAVINGS.route_name} component={TotalSavingsStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name} component={TakeawayDetailsStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name} component={AllergyInformationStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name} component={TermsAndConditionsStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.TERMS_OF_USE.route_name} component={TermsOfUseStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.PRIVACY_POLICY.route_name} component={PrivacyPolicyStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.ABOUT_US.route_name} component={AboutUsStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.SUPPORT.route_name} component={SupportStackScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.LANGUAGE.route_name} component={LanguageScreen} />
                <AppDrawer.Screen name={SCREEN_OPTIONS.COUNTRY_PICKER.route_name} component={CountryPickerScreen} />
            </AppDrawer.Navigator>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        initAPIStatus: selectInitAPIStatus(state),
        featureGateResponse: state.appState.countryBaseFeatureGateResponse,
        basketCreatedAt: state.basketState.basketCreatedAt,
        configFileName: getConfiguration(state),
        googleSessionToken: state.appState.googleSessionToken
    };
};
const mapDispatchToProps = {
    setSessionMigrated,
    appInitialSetupAction,
    resetReOrderStoreConfigAction,
    resetMenuRelatedDataForNonCustomerApps,
    resetExpiredBasketAction,
    deepLinkToPage,
    launchBugsee,
    updateGoogleSessionToken
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
