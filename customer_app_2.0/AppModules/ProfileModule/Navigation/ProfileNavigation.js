import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import Profile from '../View/Profile';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import DeliveryAddress from '../View/DeliveryAddress';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';
import SavedCardDetails from '../View/SavedCardDetails';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';
import ReferralScreen from '../View/ReferralScreen';

const ProfileStack = createStackNavigator();
export const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <ProfileStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.PROFILE.route_name}
            component={Profile}
        />
        <ProfileStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
        <ProfileStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.DELIVERY_ADDRESS.route_name}
            component={DeliveryAddress}
        />
        <ProfileStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.SAVED_CARD_DETAILS.route_name}
            component={SavedCardDetails}
        />
        <ProfileStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.REFERRAL_SCREEN.route_name}
            component={ReferralScreen}
        />
    </ProfileStack.Navigator>
);
