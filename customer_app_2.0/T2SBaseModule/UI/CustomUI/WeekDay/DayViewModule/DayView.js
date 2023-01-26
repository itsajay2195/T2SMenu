import React, { Component } from 'react';
import { View } from 'react-native';
import Style from './DayViewStyle';
import Colors from '../../../../Themes/Colors';
import { TEST_ID } from '../WeekDayConstants';
import T2STouchableOpacity from '../../../CommonUI/T2STouchableOpacity';
import T2SImageBackground from '../../../CommonUI/T2SImageBackground';
import T2SText from '../../../CommonUI/T2SText';
import { isValidElement } from '../../../../Utils/helpers';
import { setFont } from '../../../../Utils/ResponsiveFont';

export default class DayView extends Component {
    state = { isDayEnabled: !this.props.isDisabled };
    UNSAFE_componentWillMount(): void {
        this.setState({
            isDayEnabled: !this.props.isDisabled
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            isDayEnabled: !nextProps.isDisabled
        });
    }
    handleWeekDayTapAction = () => {
        this.updateToParentView(!this.props.isDaySelected);
    };
    updateToParentView(status) {
        var obj = {};
        obj[this.props.day] = status ? '1' : '0';
        this.props.updateCurrentState(obj);
    }

    render() {
        return (
            <T2STouchableOpacity
                style={[Style.buttonContainerStyle, Style.dayButtonStyles]}
                disabled={!this.props.isTouchEnabled}
                onPress={() => this.handleWeekDayTapAction()}
                screenName={this.props.screenName}
                id={this.props.id + TEST_ID.DAY_ACTION}>
                <View
                    style={{
                        ...Style.textContainerStyle
                    }}>
                    <T2SImageBackground
                        style={Style.imageStyle}
                        source={
                            this.state.isDayEnabled
                                ? this.props.isDaySelected
                                    ? require('../Images/day_enabled.png')
                                    : require('../Images/day_disabled.png')
                                : this.props.isDaySelected
                                ? require('../Images/day_expired.png')
                                : require('../Images/day_disabled.png')
                        }
                        screenName={this.props.screenName}
                        id={this.props.id + TEST_ID.DAY_BG_IMAGE}>
                        <View style={Style.dayTextStyle}>
                            <T2SText
                                style={{
                                    ...Style.textViewStyle,
                                    color: this.props.isDaySelected ? Colors.white : Colors.suvaGrey,
                                    fontSize: isValidElement(this.props.fontSize) && setFont(this.props.fontSize)
                                }}
                                screenName={this.props.screenName}
                                numberOfLines={1}
                                id={this.props.id + TEST_ID.DAY_TEXT}>
                                {this.props.title}
                            </T2SText>
                        </View>
                    </T2SImageBackground>
                </View>
            </T2STouchableOpacity>
        );
    }
}
