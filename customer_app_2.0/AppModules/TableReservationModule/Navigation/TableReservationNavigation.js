import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import React from 'react';

import TableReservationScreen from '../View/TableReservationScreen';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import NotificationsScreen from '../../NotificationModule/View/NotificationsScreen';

const TableReservationStack = createStackNavigator();
export const TableReservationStackScreen = () => (
    <TableReservationStack.Navigator
        headerMode="screen"
        screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureEnabled: false,
            headerShown: false
        }}>
        <TableReservationStack.Screen name={SCREEN_OPTIONS.TABLE_BOOKING.route_name} component={TableReservationScreen} />
        <TableReservationStack.Screen name={SCREEN_OPTIONS.NOTIFICATIONS.route_name} component={NotificationsScreen} />
    </TableReservationStack.Navigator>
);
