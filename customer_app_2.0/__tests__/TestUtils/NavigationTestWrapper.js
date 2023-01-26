import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import AppNavigation from '../../CustomerApp/Navigation/AppNavigation';
import { Provider } from 'react-redux';
import { mockStore } from './enzyme-test-utils';

export const NavigationTest = (navTest, diffState = {}) => {
    let navData = null;
    let navRefs = null;
    renderer.create(
        <Provider store={mockStore(diffState)}>
            <AppNavigation
                ref={(navigatorRef) => {
                    navRefs = navigatorRef;
                }}
                onNavigationStateChange={(data) => {
                    navData = data;
                }}
            />
        </Provider>
    );

    return navTest({ navigation: navRefs._navigation, navData });
};
