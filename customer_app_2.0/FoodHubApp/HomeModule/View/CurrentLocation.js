import { Component } from 'react';
import GeolocationAndroid from 'react-native-geolocation-service';
import { AppState, Platform } from 'react-native';
import GeolocationIOS from '@react-native-community/geolocation';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { hasLocationPermission } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';

let Geolocation = Platform.OS === 'ios' ? GeolocationIOS : GeolocationAndroid;
class CurrentLocation extends Component {
    state = {
        appState: AppState.currentState
    };
    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.handleLocation().then((r) => {});
        });
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.handleLocation().then((r) => {});
        }
        this.setState({ appState: nextAppState });
    };
    handleLocation = async () => {
        const hasPermission = await hasLocationPermission();
        if (hasPermission) {
            Geolocation.getCurrentPosition(
                (position) => {},
                (e) => {},
                {
                    enableHighAccuracy: true,
                    showLocationDialog: false,
                    timeout: 20000,
                    maximumAge: 0
                }
            );
        }
    };
    render() {
        return null;
    }
}

export default CurrentLocation;
