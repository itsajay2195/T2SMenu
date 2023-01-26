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
import WalletInfoScreen from '../View/WalletInfoScreen';
import OrderHelpView from 'appmodules/SupportModule/View/OrderHelpView';
import ReportMissingItemsScreen from 'appmodules/SupportModule/View/ReportMissingItemsScreen';
import WhereIsMyOrderScreen from 'appmodules/SupportModule/View/WhereIsMyOrderScreen';
import CancelOrderScreen from 'appmodules/SupportModule/View/CancelOrderScreen';
import WebViewHelp from 'appmodules/SupportModule/View/WebViewHelp';

const WalletStackNavigation = createStackNavigator();
export const WalletNavigation = () => (
    <WalletStackNavigation.Navigator
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.WALLET.route_name} component={WalletInfoScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.ORDER_TRACKING.route_name} component={OrderStatus} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.VIEW_REVIEW.route_name} component={ViewReviewsScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.POST_REVIEW.route_name} component={PostReviewScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.NOTIFICATIONS.route_name} component={NotificationsScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.VIEW_ORDER.route_name} component={ViewOrder} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.BASKET.route_name} component={BasketScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.MENU_SCREEN.route_name} component={MenuScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.MENU_ADD_ON.route_name} component={AddOnNavigation} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.ORDER_HELP_VIEW.route_name} component={OrderHelpView} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.WHERE_IS_MY_ORDER_SCREEN.route_name} component={WhereIsMyOrderScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.REPORT_MISSING_ITEM_SCREEN.route_name} component={ReportMissingItemsScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.CANCEL_ORDER_SCREEN.route_name} component={CancelOrderScreen} />
        <WalletStackNavigation.Screen name={SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name} component={WebViewHelp} />
    </WalletStackNavigation.Navigator>
);
