import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';
import Login from '../View/Login';
import SignUp from '../View/SignUp';
import ForgotPassword from '../View/ForgotPassword';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import SocialLogin from '../View/SocialLogin';
import Agreement from '../View/Agreement';
import WebViewScreen from '../../CommonWebviewModule/View/WebViewScreen';
import SupportScreen from '../../SupportModule/View/SupportScreen';
import EmailVerification from '../View/EmailVerify';
import WebViewHelp from '../../SupportModule/View/WebViewHelp';

const AuthStack = createStackNavigator();
export const AuthStackScreen = () => (
    <AuthStack.Navigator
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <AuthStack.Screen name={SCREEN_OPTIONS.SOCIAL_LOGIN.route_name} component={SocialLogin} />
        <AuthStack.Screen name={SCREEN_OPTIONS.LOGIN.route_name} component={Login} />
        <AuthStack.Screen name={SCREEN_OPTIONS.SIGN_UP.route_name} component={SignUp} />
        <AuthStack.Screen name={SCREEN_OPTIONS.FORGOT_PASSWORD.route_name} component={ForgotPassword} />
        <AuthStack.Screen name={SCREEN_OPTIONS.AGREEMENT.route_name} component={Agreement} />
        <AuthStack.Screen name={SCREEN_OPTIONS.TERMS_OF_USE.route_name} component={WebViewScreen} />
        <AuthStack.Screen name={SCREEN_OPTIONS.PRIVACY_POLICY.route_name} component={WebViewScreen} />
        <AuthStack.Screen name={SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name} component={WebViewScreen} />
        <AuthStack.Screen name={SCREEN_OPTIONS.CONTACT.route_name} component={SupportScreen} />
        <AuthStack.Screen name={SCREEN_OPTIONS.EMAIL_VERIFICATION.route_name} component={EmailVerification} />
        <AuthStack.Screen name={SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name} component={WebViewHelp} />
    </AuthStack.Navigator>
);
