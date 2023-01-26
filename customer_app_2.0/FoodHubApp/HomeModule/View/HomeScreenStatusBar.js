import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { Colors } from 't2sbasemodule/Themes';
import DeviceInfo from 'react-native-device-info';

let timeout;
class HomeScreenStatusBar extends Component {
    state = {
        isStickyHeaderShown: false,
        apiLevel: null
    };
    static getDerivedStateFromProps(props) {
        return {
            isStickyHeaderShown: props.isStickyHeaderShown
        };
    }

    componentDidMount() {
        DeviceInfo.getApiLevel().then((apiLevel) => {
            this.setState({ apiLevel: Platform.OS === 'android' ? apiLevel : null });
        });

        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            timeout = setTimeout(() => {
                if (this.state.isStickyHeaderShown) {
                    this.setStatusBarColor('transparent');
                } else {
                    this.setStatusBarColor(Colors.white);
                }
            }, 200);
        });
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            StatusBar.setBarStyle('dark-content');
            this.setStatusBarColor(Colors.white);
        });
    }
    setStatusBarColor(color) {
        if ((isValidElement(this.state.apiLevel) && this.state.apiLevel >= 23) || Platform.OS === 'ios') {
            StatusBar.setBackgroundColor(color);
        }
    }
    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }

    render() {
        return <StatusBar backgroundColor={this.getBgColor()} translucent={true} barStyle={'dark-content'} />;
    }

    getBgColor() {
        if ((isValidElement(this.state.apiLevel) && this.state.apiLevel >= 23) || Platform.OS === 'ios') {
            return !this.state.isStickyHeaderShown ? Colors.white : 'transparent';
        }
    }
}

export default HomeScreenStatusBar;
