import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';

import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import AddOnScreen from '../View/AddOn';

const AddOnStack = createStackNavigator();
export const AddOnNavigation = () => (
    <AddOnStack.Navigator
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <AddOnStack.Screen name={SCREEN_OPTIONS.MENU_ADD_ON.route_name} component={AddOnScreen} />
    </AddOnStack.Navigator>
);
