import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import PropTypes from 'prop-types';
import T2SText from './T2SText';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { ratingStyle } from './Style/T2SStarRatingStyle';
import { VIEW_ID } from 'appmodules/ReviewModule/Utils/ReviewConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { setTestId } from '../../Utils/AutomationHelper';
import Stars from './ratings/Stars';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';

const deviceWidth = Dimensions.get('window').width;

export default class T2SStarRating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    render() {
        const { closed } = this.state;
        const { screenName } = this.props;
        // Note: We have to provide offset from left to get the exact rating value. Refer react-native-swipeable-rating docs for details.
        const offsetFromLeft = (deviceWidth - 5 * 50) / 2;
        if (closed) return null;
        return (
            <View style={ratingStyle.container}>
                <CustomIcon
                    {...setTestId(screenName, VIEW_ID.CLOSE_BUTTON)}
                    style={ratingStyle.closeButton}
                    onPress={() => this.onCloseRating()}
                    size={25}
                    name={FONT_ICON.CLOSE}
                />
                <T2SText id={VIEW_ID.HOW_WAS_YOUR_PREVIOUS_ORDER_EXPERIENCE_TEXT} screenName={screenName} style={ratingStyle.textStyle}>
                    {LOCALIZATION_STRINGS.HOW_WAS_YOUR_PREVIOUS_ORDER_EXPERIENCE}
                </T2SText>
                <Stars
                    starContainerStyle={ratingStyle.starContainerStyle}
                    screenName={screenName}
                    id={VIEW_ID.VALUE_RATING}
                    starValue={this.state.value}
                    activeStarColor={ratingStyle.activeStarRatingColor}
                    inActiveStarColor={ratingStyle.inActiveStarRatingColor}
                    size={50}
                    offsetFromLeft={offsetFromLeft}
                    onPress={this.rateValue}
                />
            </View>
        );
    }
    rateValue = (value) => {
        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.RATING_SWIPED);
        this.setState({ value });
        this.onFinishRating(value);
    };
    onFinishRating = (value) => {
        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.RATING_SUBMITTED);
        this.props.onFinishRating(value);
    };
    onCloseRating = () => {
        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.RATING_WIDGET_CLOSED);
        this.props.onCloseRating();
    };
}

T2SStarRating.defaultProps = {
    screenName: '',
    startingValue: 0,
    minValue: 0
};

T2SStarRating.propTypes = {
    screenName: PropTypes.string.isRequired,
    readonly: PropTypes.bool,
    startingValue: PropTypes.number,
    minValue: PropTypes.number,
    onFinishRating: PropTypes.func,
    onCloseRating: PropTypes.func
};
