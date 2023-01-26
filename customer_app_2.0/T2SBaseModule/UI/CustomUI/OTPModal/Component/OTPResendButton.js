import React from 'react';
import { View } from 'react-native';
import propType from 'prop-types';
import styles from '../Style/OTPStyle';
import CustomIcon from '../../CustomIcon';
import { isMoreZero, isValidElement } from '../../../../Utils/helpers';
import { OTP_TYPE, VIEW_ID } from '../Utils/OTPConstants';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import T2STouchableOpacity from '../../../CommonUI/T2STouchableOpacity';
import Colors from '../../../../Themes/Colors';
import T2SView from '../../../CommonUI/T2SView';
import T2SText from '../../../CommonUI/T2SText';
let countDownTimer;
export default class OTPResendButton extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            countDownTimer: prop.second,
            isCountDownStarted: false
        };
    }
    componentDidMount() {
        this.startCountDownTimerFor(this.props.second);
    }
    componentWillUnmount() {
        if (isValidElement(countDownTimer)) {
            clearInterval(countDownTimer);
            countDownTimer = null;
        }
    }

    startCountDownTimerFor(seconds) {
        this.setState({ countDownTimer: seconds, isCountDownStarted: true });
        if (isValidElement(countDownTimer)) {
            clearInterval(countDownTimer);
            countDownTimer = null;
        }
        countDownTimer = setInterval(() => {
            if (isMoreZero(this.state.countDownTimer)) {
                this.setState((state) => ({ countDownTimer: state.countDownTimer - 1 }));
            } else {
                clearInterval(countDownTimer);
                this.setState({ isCountDownStarted: false });
            }
        }, 1000);
    }
    render() {
        return this.renderBothResendView();
    }
    renderBothResendView() {
        return (
            <T2SView style={styles.resendContainerViewStyle}>
                {this.renderResendView(OTP_TYPE.SMS)}
                <View style={styles.dividerLineStyle} />
                {this.renderResendView(OTP_TYPE.CALL)}
            </T2SView>
        );
    }
    renderResendView(type) {
        const { screenName } = this.props;
        let icon = FONT_ICON.CALL_FILLED;
        let id = VIEW_ID.RESEND_CALL_BUTTON;
        let name = LOCALIZATION_STRINGS.GET_OTP_ON_CALL;
        if (type === OTP_TYPE.SMS) {
            icon = FONT_ICON.MESSAGE;
            id = VIEW_ID.RESEND_SMS_BUTTON;
            name = LOCALIZATION_STRINGS.RESEND_SMS;
        }
        //TODO if timer need uncomment below line and match with new design
        // const timer = secondsToTimer(this.state.countDownTimer);
        const color = { color: this.isResendOptionEnabled(type) ? Colors.textBlue : Colors.mediumGray };
        return (
            <T2STouchableOpacity style={styles.resendViewStyle} accessible={false} onPress={() => this.handlePress(type)}>
                <T2SView style={styles.buttonContainer} screenName={screenName} id={id}>
                    <CustomIcon name={icon} style={[styles.buttonIconStyle, color]} />
                    <T2SText screenName={screenName} id={name} style={[styles.buttonTitle, color]}>
                        {name}
                    </T2SText>
                    {/*{isMoreZero(this.state.countDownTimer) && (*/}
                    {/*    <Text style={[styles.buttonTimer, color]}>{`${timer.minute}:${timer.second}`}</Text>*/}
                    {/*)}*/}
                </T2SView>
            </T2STouchableOpacity>
        );
    }
    handlePress = (type) => {
        if (this.isResendOptionEnabled(type)) {
            this.startCountDownTimerFor(this.props.second);
            this.props.onPress(type);
        }
    };
    isResendOptionEnabled = (type) => {
        if (this.props.type === OTP_TYPE.CALL && type === OTP_TYPE.SMS) {
            return false;
        }
        return !isMoreZero(this.state.countDownTimer);
    };
}

OTPResendButton.propTypes = {
    screenName: propType.string.isRequired,
    title: propType.string,
    type: propType.string,
    icon: propType.string,
    second: propType.number,
    onPress: propType.func
};
OTPResendButton.defaultProps = {
    screenName: undefined,
    type: '',
    title: '',
    icon: '',
    second: 30,
    onPress: () => {}
};
