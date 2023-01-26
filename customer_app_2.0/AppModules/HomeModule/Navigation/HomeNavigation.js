import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import ViewAllReviewsScreen from '../../ReviewModule/View/ViewAllReviewsScreen';
import PostReviewScreen from '../../ReviewModule/View/PostReviewScreen';
import ConfiguratorScreen from '../../ConfiguratorModule/View/ConfiguratorScreen';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';
import CurrentLocationMapViewScreen from '../../AddressModule/View/Components/CurrentLocationMapViewScreen';
import OrderStatus from '../../OrderManagementModule/View/OrderStatus';
import { AddOnNavigation } from '../../MenuModule/Navigation/AddonNavigation';
import MenuScreen from '../../MenuModule/View/MenuOptimizedScreen';
import WebViewScreen from '../../CommonWebviewModule/View/WebViewScreen';
import BasketScreen from '../../BasketModule/View/BasketScreen';
import HomeScreen from '../View/HomeScreen';
import { isFoodHubApp, isNonCustomerApp } from 't2sbasemodule/Utils/helpers';
import FoodHubHomeScreen from '../../../FoodHubApp/HomeModule/View/FoodHubHomeScreen';
import TakeawayDetails from '../../TakeawayDetailsModule/View/TakeawayDetails';
import LandingPageScreen from '../../../FoodHubApp/LandingPage/View/LandingPageScreen';
import TakeawaySearchList from '../../../FoodHubApp/TakeawayListModule/View/TakeawaySearchList';
import FilterTakeawayTabBar from '../../../FoodHubApp/TakeawayListModule/Navigation/FilterNavigation';
import FavouriteTakeawayScreen from '../../../FoodHubApp/TakeawayListModule/View/FavouriteTakeawayScreen';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';
import SupportScreen from '../../SupportModule/View/SupportScreen';
import SortByScreen from '../../../FoodHubApp/TakeawayListModule/View/SortbyScreen';
import CuisinesScreen from '../../../FoodHubApp/TakeawayListModule/View/Cuisines/CuisinesScreen';
import OrderHelpView from 'appmodules/SupportModule/View/OrderHelpView';
import WhereIsMyOrderScreen from 'appmodules/SupportModule/View/WhereIsMyOrderScreen';
import CancelOrderScreen from '../../SupportModule/View/CancelOrderScreen';
import CuisinesBasedList from '../../../FoodHubApp/TakeawayListModule/View/CuisinesBasedList';
import WebViewHelp from '../../SupportModule/View/WebViewHelp';
import LocationLocatorMapScreen from '../../HomeAddressModule/View/LocationLocatorMapScreen';
import AddressFormView from '../../HomeAddressModule/View/AddressFormView';
import { ProfileStackScreen } from '../../ProfileModule/Navigation/ProfileNavigation';
import MyTicketsScreen from '../../SupportModule/View/MyTicketsScreen';
import QuickReviewFeedback from '../../ReviewModule/View/QuickReviewFeedback';
import styles from '../View/Styles/HomeStyle';
import ReportMissingItemsScreen from '../../SupportModule/View/ReportMissingItemsScreen';
import NewMenu from '../../MenuModule/View/NewMenu';
import NewMenuItemList from '../../MenuModule/View/NewMenuItemList';
import NewSubCatListScreen from '../../MenuModule/View/NewSubCatListScreen';

const HomeStack = createStackNavigator();
export const HomeStackScreen = () => (
    <HomeStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.HOME.route_name}
            component={isNonCustomerApp() ? FoodHubHomeScreen : HomeScreen}
        />
        <HomeStack.Screen
            name={SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name}
            component={LocationLocatorMapScreen}
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
        />
        <HomeStack.Screen name={SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name} component={AddressFormView} />
        {isFoodHubApp() && <HomeStack.Screen name={SCREEN_OPTIONS.LOCATION_PICKER.route_name} component={LandingPageScreen} />}
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.CURRENT_LOCATION_MAP_CONTAINER.route_name}
            component={CurrentLocationMapViewScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name}
            component={ViewAllReviewsScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.POST_REVIEW.route_name}
            component={PostReviewScreen}
        />
        <HomeStack.Screen name={SCREEN_OPTIONS.CONFIGURATOR.route_name} component={ConfiguratorScreen} />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MENU_ADD_ON.route_name}
            component={AddOnNavigation}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ORDER_TRACKING.route_name}
            component={OrderStatus}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.BASKET.route_name}
            component={BasketScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.PROFILE.route_name}
            component={ProfileStackScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name}
            component={WebViewScreen}
        />
        <HomeStack.Screen name={SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name} component={TakeawayDetails} />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MENU_SCREEN.route_name}
            component={MenuScreen}
        />
        <HomeStack.Screen
            name={SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name}
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            component={TakeawaySearchList}
        />
        <HomeStack.Screen name={SCREEN_OPTIONS.NEW_MENU_CATEGORY_SCREEN.route_name} component={NewMenu} />
        <HomeStack.Screen name={SCREEN_OPTIONS.NEW_MENU_ITEM_SCREEN.route_name} component={NewMenuItemList} />
        <HomeStack.Screen name={SCREEN_OPTIONS.NEW_MENU_SUBCAT_SCREEN.route_name} component={NewSubCatListScreen} />
        <HomeStack.Screen name={SCREEN_OPTIONS.FILTER_SCREEN.route_name} component={FilterTakeawayTabBar} />
        <HomeStack.Screen name={SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name} component={FavouriteTakeawayScreen} />
        <HomeStack.Screen name={SCREEN_OPTIONS.SUPPORT.route_name} component={SupportScreen} />
        <HomeStack.Screen name={SCREEN_OPTIONS.SORT_BY_SCREEN.route_name} component={SortByScreen} />
        <HomeStack.Screen name={SCREEN_OPTIONS.CUISINES_SCREEN.route_name} component={CuisinesScreen} />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ORDER_HELP_VIEW.route_name}
            component={OrderHelpView}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.WHERE_IS_MY_ORDER_SCREEN.route_name}
            component={WhereIsMyOrderScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.CANCEL_ORDER_SCREEN.route_name}
            component={CancelOrderScreen}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name}
            component={WebViewHelp}
        />
        <HomeStack.Screen name={SCREEN_OPTIONS.CUISINE_BASED_TA_LIST_SCREEN.route_name} component={CuisinesBasedList} />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MY_TICKETS_SCREEN.route_name}
            component={MyTicketsScreen}
        />
        <HomeStack.Screen
            name={SCREEN_OPTIONS.QUICK_FEEDBACK.route_name}
            component={QuickReviewFeedback}
            options={{
                animationEnabled: true,
                cardStyle: styles.cardStyle,
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS
            }}
        />
        <HomeStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.REPORT_MISSING_ITEM_SCREEN.route_name}
            component={ReportMissingItemsScreen}
        />
    </HomeStack.Navigator>
);
