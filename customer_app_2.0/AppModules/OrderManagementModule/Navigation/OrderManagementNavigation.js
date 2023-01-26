import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { AddOnNavigation } from '../../MenuModule/Navigation/AddonNavigation';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';
import OrderHistoryScreen from '../View/OrderHistoryScreen';
import ViewReviewsScreen from '../../ReviewModule/View/ViewReviewScreen';
import PostReviewScreen from '../../ReviewModule/View/PostReviewScreen';
import OrderStatus from '../../OrderManagementModule/View/OrderStatus';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';
import ViewOrder from '../View/ViewOrder';
import BasketScreen from '../../BasketModule/View/BasketScreen';
import MenuScreen from '../../MenuModule/View/MenuOptimizedScreen';
import ViewAllReviewsScreen from '../../ReviewModule/View/ViewAllReviewsScreen';
import TakeawayDetails from '../../TakeawayDetailsModule/View/TakeawayDetails';
import WebViewScreen from '../../CommonWebviewModule/View/WebViewScreen';
import OrderHelpView from 'appmodules/SupportModule/View/OrderHelpView';
import WhereIsMyOrderScreen from 'appmodules/SupportModule/View/WhereIsMyOrderScreen';
import ReportMissingItemsScreen from '../../SupportModule/View/ReportMissingItemsScreen';
import CancelOrderScreen from '../../SupportModule/View/CancelOrderScreen';
import WebViewHelp from '../../SupportModule/View/WebViewHelp';
import { ProfileStackScreen } from '../../ProfileModule/Navigation/ProfileNavigation';

const OrderManagementStackNavigation = createStackNavigator();
export const OrderManagementNavigation = () => (
    <OrderManagementStackNavigation.Navigator
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.ORDER_HISTORY.route_name}
            component={OrderHistoryScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ORDER_TRACKING.route_name}
            component={OrderStatus}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_REVIEW.route_name}
            component={ViewReviewsScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.POST_REVIEW.route_name}
            component={PostReviewScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_ORDER.route_name}
            component={ViewOrder}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.BASKET.route_name}
            component={BasketScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MENU_SCREEN.route_name}
            component={MenuScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.PROFILE.route_name}
            component={ProfileStackScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MENU_ADD_ON.route_name}
            component={AddOnNavigation}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name}
            component={ViewAllReviewsScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name}
            component={TakeawayDetails}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name}
            component={WebViewScreen}
        />

        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ORDER_HELP_VIEW.route_name}
            component={OrderHelpView}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.WHERE_IS_MY_ORDER_SCREEN.route_name}
            component={WhereIsMyOrderScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.REPORT_MISSING_ITEM_SCREEN.route_name}
            component={ReportMissingItemsScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.CANCEL_ORDER_SCREEN.route_name}
            component={CancelOrderScreen}
        />
        <OrderManagementStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name}
            component={WebViewHelp}
        />
    </OrderManagementStackNavigation.Navigator>
);
