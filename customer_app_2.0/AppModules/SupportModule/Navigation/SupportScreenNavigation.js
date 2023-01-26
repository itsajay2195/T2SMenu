import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import SupportScreen from '../View/SupportScreen';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';
import MyTicketsScreen from '../View/MyTicketsScreen';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';
import WebViewHelp from '../View/WebViewHelp';

const SupportStack = createStackNavigator();

export const SupportStackScreen = () => (
    <SupportStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <SupportStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.SUPPORT.route_name}
            component={SupportScreen}
        />
        <SupportStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />

        <SupportStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.MY_TICKETS_SCREEN.route_name}
            component={MyTicketsScreen}
        />

        <SupportStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name}
            component={WebViewHelp}
        />
    </SupportStack.Navigator>
);
