//https://reactnavigation.org/docs/navigating-without-navigation-prop/
import * as React from 'react';
import { StackActions } from '@react-navigation/native';

const navigationRef = React.createRef();

const navigate = (name, params) => {
    navigationRef.current?.navigate(name, params);
};

// Gets the current screen from navigation state
const getActiveRouteName = (state) => {
    const route = state.routes[state.index];
    if (route.state) {
        // Dive into nested navigators
        return getActiveRouteName(route.state);
    }

    return route.name;
};
const popToTop = () => {
    if (navigationRef.current?.canGoBack()) {
        navigationRef.current?.dispatch(StackActions.popToTop());
    }
};
const dispatch = (action) => {
    navigationRef.current?.dispatch(action);
};
const goBack = () => {
    navigationRef.current?.dispatch(StackActions.pop());
};
export { navigationRef, getActiveRouteName, navigate, popToTop, dispatch, goBack };
