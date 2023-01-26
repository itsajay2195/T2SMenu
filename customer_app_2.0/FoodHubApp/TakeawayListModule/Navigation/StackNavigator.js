import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';
import TakeawaySearchList from '../View/TakeawaySearchList';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import FilterTakeawayTabBar from './FilterNavigation';
import FavouriteTakeawayScreen from '../View/FavouriteTakeawayScreen';
import MenuScreen from 'appmodules/MenuModule/View/MenuOptimizedScreen';
import { AddOnNavigation } from 'appmodules/MenuModule/Navigation/AddonNavigation';
import BasketScreen from 'appmodules/BasketModule/View/BasketScreen';
import NewMenu from '../../../AppModules/MenuModule/View/NewMenu';

const TakeawayListNavigation = createStackNavigator();
export const TakeawayListNavigationScreen = () => (
    <TakeawayListNavigation.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <TakeawayListNavigation.Screen name={SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name} component={TakeawaySearchList} />
        <TakeawayListNavigation.Screen name={SCREEN_OPTIONS.FILTER_SCREEN.route_name} component={FilterTakeawayTabBar} />
        <TakeawayListNavigation.Screen name={SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name} component={FavouriteTakeawayScreen} />
        <TakeawayListNavigation.Screen name={SCREEN_OPTIONS.MENU_SCREEN.route_name} component={MenuScreen} />
        <TakeawayListNavigation.Screen name={'NewMenu'} component={NewMenu} />
        <TakeawayListNavigation.Screen name={SCREEN_OPTIONS.MENU_ADD_ON.route_name} component={AddOnNavigation} />
        <TakeawayListNavigation.Screen name={SCREEN_OPTIONS.BASKET.route_name} component={BasketScreen} />
    </TakeawayListNavigation.Navigator>
);
