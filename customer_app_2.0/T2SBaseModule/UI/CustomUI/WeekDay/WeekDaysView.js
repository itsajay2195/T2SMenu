import React, { Component } from 'react';
import { View } from 'react-native';
import DayView from './DayViewModule/DayView';
import WeekDayStyle from './WeekDaysViewStyle';
import { WEEKDAYS } from './WeekDayConstants';
import { isValidElement } from '../../../Utils/helpers';
import { setFont } from '../../../Utils/ResponsiveFont';

export default class WeekDaysView extends Component {
    state = {
        monday: '0',
        tuesday: '0',
        wednesday: '0',
        thursday: '0',
        friday: '0',
        saturday: '0',
        sunday: '0',
        isDisable: 'true',
        isDayViewTouchEnabled: 'false',
        fontSize: setFont(8)
    };
    UNSAFE_componentWillMount(): void {
        this.setState({
            monday: this.props.monday,
            tuesday: this.props.tuesday,
            wednesday: this.props.wednesday,
            thursday: this.props.thursday,
            friday: this.props.friday,
            saturday: this.props.saturday,
            sunday: this.props.sunday,
            isDisable: this.props.isDisable,
            isDayViewTouchEnabled: this.props.isDayViewTouchEnabled,
            fontSize: this.props.fontSize
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            monday: nextProps.monday,
            tuesday: nextProps.tuesday,
            wednesday: nextProps.wednesday,
            thursday: nextProps.thursday,
            friday: nextProps.friday,
            saturday: nextProps.saturday,
            sunday: nextProps.sunday,
            isDisable: nextProps.isDisable,
            isDayViewTouchEnabled: nextProps.isDayViewTouchEnabled,
            fontSize: nextProps.fontSize
        });
    }
    updateFromDayView(newObj) {
        const nextState = { ...this.state, ...newObj };
        if (
            parseInt(nextState.monday) +
                parseInt(nextState.tuesday) +
                parseInt(nextState.wednesday) +
                parseInt(nextState.thursday) +
                parseInt(nextState.friday) +
                parseInt(nextState.saturday) +
                parseInt(nextState.sunday) ===
                0 &&
            isValidElement(this.props.minOneValue) &&
            this.props.minOneValue
        ) {
            return;
        }
        this.setState(
            {
                ...newObj
            },
            () => {
                this.props.updateFromWeekdayView({
                    monday: this.state.monday,
                    tuesday: this.state.tuesday,
                    wednesday: this.state.wednesday,
                    thursday: this.state.thursday,
                    friday: this.state.friday,
                    saturday: this.state.saturday,
                    sunday: this.state.sunday
                });
            }
        );
    }
    render() {
        return (
            <View style={[WeekDayStyle.containerStyle, this.props.style]}>
                <DayView
                    title="M"
                    day={WEEKDAYS.MONDAY}
                    isDaySelected={this.state.monday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    id={this.props.id + WEEKDAYS.MONDAY}
                    screen={this.props.screen}
                />
                <DayView
                    title="T"
                    day={WEEKDAYS.TUESDAY}
                    isDaySelected={this.state.tuesday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    screen={this.props.screen}
                    id={this.props.id + WEEKDAYS.TUESDAY}
                />
                <DayView
                    title="W"
                    day={WEEKDAYS.WEDNESDAY}
                    isDaySelected={this.state.wednesday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    id={this.props.id + WEEKDAYS.WEDNESDAY}
                    screen={this.props.screen}
                />
                <DayView
                    title="T"
                    day={WEEKDAYS.THURSDAY}
                    isDaySelected={this.state.thursday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    id={this.props.id + WEEKDAYS.THURSDAY}
                    screen={this.props.screen}
                />
                <DayView
                    title="F"
                    day={WEEKDAYS.FRIDAY}
                    isDaySelected={this.state.friday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    id={this.props.id + WEEKDAYS.FRIDAY}
                    screen={this.props.screen}
                />
                <DayView
                    title="S"
                    day={WEEKDAYS.SATURDAY}
                    isDaySelected={this.state.saturday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    id={this.props.id + WEEKDAYS.SATURDAY}
                    screen={this.props.screen}
                />
                <DayView
                    title="S"
                    day={WEEKDAYS.SUNDAY}
                    isDaySelected={this.state.sunday === '1'}
                    isTouchEnabled={this.state.isDayViewTouchEnabled}
                    isDisabled={this.state.isDisable}
                    fontSize={this.state.fontSize}
                    updateCurrentState={(data) => this.updateFromDayView(data)}
                    id={this.props.id + WEEKDAYS.SUNDAY}
                    screen={this.props.screen}
                />
            </View>
        );
    }
}
