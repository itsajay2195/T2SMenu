import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import ViewReviewsScreen from 'appmodules/ReviewModule/View/ViewReviewScreen';
import PostReviewScreen from 'appmodules/ReviewModule/View/PostReviewScreen';
import OrderStatus from 'appmodules/OrderManagementModule/View/OrderStatus';
import NotificationsScreen from 'appmodules/NotificationModule/View/NotificationsScreen';
import ViewOrder from 'appmodules/OrderManagementModule/View/ViewOrder';
import BasketScreen from 'appmodules/BasketModule/View/BasketScreen';
import MenuScreen from 'appmodules/MenuModule/View/MenuOptimizedScreen';
import { AddOnNavigation } from 'appmodules/MenuModule/Navigation/AddonNavigation';
import FavouriteTakeawayScreen from '../View/FavouriteTakeawayScreen';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';
import TakeawayDetails from 'appmodules/TakeawayDetailsModule/View/TakeawayDetails';
import WebViewScreen from 'appmodules/CommonWebviewModule/View/WebViewScreen';
import WebViewHelp from 'appmodules/SupportModule/View/WebViewHelp';
import MyTicketsScreen from 'appmodules/SupportModule/View/MyTicketsScreen';
import SupportScreen from 'appmodules/SupportModule/View/SupportScreen';
import ViewAllReviewsScreen from 'appmodules/ReviewModule/View/ViewAllReviewsScreen';

const FavouriteStackNavigation = createStackNavigator();
export const FavouriteNavigation = () => (
    <FavouriteStackNavigation.Navigator
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name}
            component={FavouriteTakeawayScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ORDER_TRACKING.route_name}
            component={OrderStatus}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_REVIEW.route_name}
            component={ViewReviewsScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.POST_REVIEW.route_name}
            component={PostReviewScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_ORDER.route_name}
            component={ViewOrder}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.BASKET.route_name}
            component={BasketScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MENU_SCREEN.route_name}
            component={MenuScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MENU_ADD_ON.route_name}
            component={AddOnNavigation}
        />

        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name}
            component={TakeawayDetails}
        />
        <FavouriteStackNavigation.Screen name={SCREEN_OPTIONS.SUPPORT.route_name} component={SupportScreen} />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name}
            component={WebViewScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name}
            component={WebViewHelp}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MY_TICKETS_SCREEN.route_name}
            component={MyTicketsScreen}
        />
        <FavouriteStackNavigation.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name}
            component={ViewAllReviewsScreen}
        />
    </FavouriteStackNavigation.Navigator>
);
