import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';
import NotificationsScreen from '../View/NotificationsScreen';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';

const NotificationStack = createStackNavigator();
export const NotificationStackScreen = () => (
    <NotificationStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <NotificationStack.Screen name={SCREEN_OPTIONS.NOTIFICATIONS.route_name} component={NotificationsScreen} />
    </NotificationStack.Navigator>
);
