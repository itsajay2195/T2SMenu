import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';

import LoyaltyPointsScreen from '../View/LoyaltyPointsScreen';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';

const LoyaltyPointsScreenStack = createStackNavigator();
export const LoyaltyPointsStackScreen = () => (
    <LoyaltyPointsScreenStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <LoyaltyPointsScreenStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.LOYALTY_POINTS.route_name}
            component={LoyaltyPointsScreen}
        />
        <LoyaltyPointsScreenStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
    </LoyaltyPointsScreenStack.Navigator>
);
