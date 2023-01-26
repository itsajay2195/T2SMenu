import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './Redux/Store/ConfigureStore';
import DeviceInfo from 'react-native-device-info';
import { Colors } from 't2sbasemodule/Themes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './Navigation/AppNavigation';
import styles from './View/Style/FlashMessageStyle';
import { renderFlashMessageIcon } from 't2sbasemodule/Network/NetworkHelpers';
import { linking } from 'appmodules/RouterModule/Utils/RouterConfig';
import FlashMessage from 't2sbasemodule/UI/CustomUI/FlashMessageComponent';
import { analyticsInitialize } from '../AppModules/AnalyticsModule/Braze';

console.disableYellowBox = true;

export default class App extends Component {
    constructor(props) {
        super(props);
        analyticsInitialize();
    }

    componentDidMount() {
        DeviceInfo.getApiLevel().then((apiLevel) => {
            if (apiLevel >= 23 && Platform.OS === 'android') {
                StatusBar.setBackgroundColor(Colors.white);
                StatusBar.setBarStyle('dark-content');
            }
        });
    }

    render() {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <PersistGate bootstrapped={true} persistor={persistor}>
                        <AppNavigation linking={linking} />
                        {/*<InstaBugManager />*/}
                        <FlashMessage
                            accessible={false}
                            position="top"
                            floating={true}
                            style={styles.flashMessageStyle}
                            renderFlashMessageIcon={renderFlashMessageIcon}
                        />
                    </PersistGate>
                </Provider>
            </SafeAreaProvider>
        );
    }
}
