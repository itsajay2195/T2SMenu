import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';

import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import TakeawayDetails from '../View/TakeawayDetails';

const TakeawayDetailsStack = createStackNavigator();
export const TakeawayDetailsStackScreen = () => (
    <TakeawayDetailsStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <TakeawayDetailsStack.Screen name={SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name} component={TakeawayDetails} />
    </TakeawayDetailsStack.Navigator>
);
