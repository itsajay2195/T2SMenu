import React from 'react';
import { Platform } from 'react-native';

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import QuickCheckoutScreen from '../View/QuickCheckoutScreen';
import WebViewComponent from '../View/WebViewPayment';
import TransactionFailureComponent from '../View/TransactionFailureComponent';

const QuickCheckoutStack = createStackNavigator();

export const QuickCheckoutStackScreen = () => (
    <QuickCheckoutStack.Navigator headerMode="none">
        <QuickCheckoutStack.Screen
            name={SCREEN_OPTIONS.QUICK_CHECKOUT.route_name}
            component={QuickCheckoutScreen}
            options={{
                animationEnabled: true,
                cardStyle: { backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)' },
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS
            }}
        />
        <QuickCheckoutStack.Screen
            name={SCREEN_OPTIONS.WEBVIEW_PAYMENT.route_name}
            component={WebViewComponent}
            options={{
                gestureEnabled: false
            }}
        />
        <QuickCheckoutStack.Screen
            name={SCREEN_OPTIONS.TRANSACTION_FAILURE.route_name}
            component={TransactionFailureComponent}
            options={{
                animationEnabled: true,
                cardStyle: { backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)' },
                cardOverlayEnabled: true,
                ...TransitionPresets.ModalSlideFromBottomIOS
            }}
        />
    </QuickCheckoutStack.Navigator>
);
