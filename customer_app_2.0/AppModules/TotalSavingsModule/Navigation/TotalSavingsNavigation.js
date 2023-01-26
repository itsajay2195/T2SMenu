import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';

import TotalSavingsScreen from '../View/TotalSavingsScreen';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';

const TotalSavingsStack = createStackNavigator();
export const TotalSavingsStackScreen = () => (
    <TotalSavingsStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <TotalSavingsStack.Screen name={SCREEN_OPTIONS.TOTAL_SAVINGS.route_name} component={TotalSavingsScreen} />
        <TotalSavingsStack.Screen name={SCREEN_OPTIONS.NOTIFICATIONS.route_name} component={NotificationsScreen} />
    </TotalSavingsStack.Navigator>
);
