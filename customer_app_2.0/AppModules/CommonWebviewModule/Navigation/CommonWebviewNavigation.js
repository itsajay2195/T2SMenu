import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';

import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';
import WebViewScreen from '../View/WebViewScreen';
import SupportScreen from '../../SupportModule/View/SupportScreen';
import { handleSwipeGesture } from '../../../CustomerApp/Navigation/NavigationUtils';

const AllergyInformationStack = createStackNavigator();
export const AllergyInformationStackScreen = () => (
    <AllergyInformationStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <AllergyInformationStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.ALLERGY_INFORMATION.route_name}
            component={WebViewScreen}
        />
        <AllergyInformationStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.SUPPORT.route_name}
            component={SupportScreen}
        />
        <AllergyInformationStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
    </AllergyInformationStack.Navigator>
);
const TermsAndConditionsStack = createStackNavigator();
export const TermsAndConditionsStackScreen = () => (
    <TermsAndConditionsStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <TermsAndConditionsStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name}
            component={WebViewScreen}
        />
        <TermsAndConditionsStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.PRIVACY_POLICY.route_name}
            component={WebViewScreen}
        />
        <TermsAndConditionsStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
    </TermsAndConditionsStack.Navigator>
);
const TermsOfUseStack = createStackNavigator();
export const TermsOfUseStackScreen = () => (
    <TermsOfUseStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <TermsOfUseStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.TERMS_OF_USE.route_name}
            component={WebViewScreen}
        />
        <TermsOfUseStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.PRIVACY_POLICY.route_name}
            component={WebViewScreen}
        />
        <TermsOfUseStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
    </TermsOfUseStack.Navigator>
);
const PrivacyPolicyStack = createStackNavigator();
export const PrivacyPolicyStackScreen = () => (
    <PrivacyPolicyStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <PrivacyPolicyStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.PRIVACY_POLICY.route_name}
            component={WebViewScreen}
        />
        <PrivacyPolicyStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.NOTIFICATIONS.route_name}
            component={NotificationsScreen}
        />
    </PrivacyPolicyStack.Navigator>
);

const AboutUsStack = createStackNavigator();
export const AboutUsStackScreen = () => (
    <AboutUsStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <AboutUsStack.Screen
            options={(props) => {
                handleSwipeGesture(props, true);
            }}
            name={SCREEN_OPTIONS.ABOUT_US.route_name}
            component={WebViewScreen}
        />
        <AboutUsStack.Screen
            options={(props) => {
                handleSwipeGesture(props, false);
            }}
            name={SCREEN_OPTIONS.SUPPORT.route_name}
            component={SupportScreen}
        />
    </AboutUsStack.Navigator>
);
