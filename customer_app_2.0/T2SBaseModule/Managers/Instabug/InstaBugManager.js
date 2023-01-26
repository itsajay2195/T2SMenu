import React from 'react';
import { connect } from 'react-redux';
import Instabug from 'instabug-reactnative';
import { isDebugBuildType, isFoodHubApp } from '../../Utils/helpers';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import { setInstaBugEventType } from './Utils/InstaBugHelper';
import { selectHasUserLoggedIn } from '../../Utils/AppSelectors';
import { Colors } from '../../Themes';

class InstaBugManager extends React.Component {
    componentDidMount() {
        //Automation build no need insta bug
        Instabug.start(isDebugBuildType() ? AppConfig.Instabug.BETA_KEY : AppConfig.Instabug.LIVE_KEY, [Instabug.invocationEvent.shake]);
        Instabug.setTrackUserSteps(true);
        Instabug.setPrimaryColor(isFoodHubApp() ? Colors.secondary_color : Colors.foodHubDarkGreen);
        const { isUserLoggedIn, profileResponse } = this.props;
        setInstaBugEventType(isUserLoggedIn, profileResponse);
    }
    componentDidUpdate(prevProps) {
        const { isUserLoggedIn, profileResponse } = this.props;
        if (prevProps.isUserLoggedIn !== isUserLoggedIn) {
            setInstaBugEventType(isUserLoggedIn, profileResponse);
        }
    }
    render() {
        return null;
    }
}

const mapStateToProps = (state) => {
    return {
        isUserLoggedIn: selectHasUserLoggedIn(state),
        profileResponse: state.profileState.profileResponse
    };
};
export default connect(mapStateToProps, null)(InstaBugManager);
