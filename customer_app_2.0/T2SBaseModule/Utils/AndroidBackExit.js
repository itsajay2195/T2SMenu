import React, { Component, Fragment } from 'react';
import { BackHandler } from 'react-native';
import { showInfoMessage } from '../Network/NetworkHelpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { isValidElement } from './helpers';

let timerID;
class AndroidBackExit extends Component {
    state = {
        closeApp: 0
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
        if (isValidElement(timerID)) {
            clearTimeout(timerID);
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.setState({ closeApp: this.state.closeApp + 1 });
            this.handleBackButton();
            return true;
        });
    }

    handleBackButton = () => {
        if (this.state.closeApp < 2) {
            showInfoMessage(LOCALIZATION_STRINGS.EXIT_APP, null, true);
            timerID = setTimeout(() => {
                this.setState({ closeApp: 0 });
            }, 3000);
        } else if (this.state.closeApp === 2) {
            BackHandler.exitApp();
        }
    };

    render() {
        return <Fragment />;
    }
}
export default AndroidBackExit;
