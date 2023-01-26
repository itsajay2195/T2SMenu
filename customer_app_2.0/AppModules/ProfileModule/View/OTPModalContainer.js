import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getOTPType, isExistingUser, isVerifyOtp } from 't2sbasemodule/UI/CustomUI/OTPModal/Utils/OTPHelper';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { getFormattedTAPhoneNumber, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import otpStyle from 't2sbasemodule/UI/CustomUI/OTPModal/Style/OTPStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { OTP_TYPE } from 't2sbasemodule/UI/CustomUI/OTPModal/Utils/OTPConstants';
import OTPModal from 't2sbasemodule/UI/CustomUI/OTPModal/OTPModal';
import { resetVerifyOTPErrorMsgAction, resetVerifyOTPValuesAction, sendOTPAction, verifyOTPAction } from '../Redux/ProfileAction';
import { changeOtpVerifyStatusAction, resetOtpPhoneNumberAction } from '../../AuthModule/Redux/AuthAction';
import { debounce } from 'lodash';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import { selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';

class OTPModalContainer extends Component {
    constructor(props) {
        super(props);
        this.resetVerifyOtp = this.resetVerifyOtp.bind(this);
        this.handleOnConfirmOTP = this.handleOnConfirmOTP.bind(this);
        this.onOTPComplete = this.onOTPComplete.bind(this);
        this.onOTPChange = this.onOTPChange.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.state = {
            verifyOtpDescription: null,
            OTPValue: '',
            // Local state for `verifyOtpErrorMsg` to validate and clear `OTPValue`
            verifyOtpErrorMsg: null
        };
    }
    componentWillUnmount() {
        this.setState({ OTPValue: '' });
    }

    static getDerivedStateFromProps(props, state) {
        const { verifyOtpErrorMsg, otpLimitExceeded, showVerifyOTP } = props;
        if (showVerifyOTP && isValidElement(verifyOtpErrorMsg) && state.verifyOtpErrorMsg !== verifyOtpErrorMsg) {
            // If OTP dialog needs to show `showVerifyOTP`
            // And if OTP error message is not null
            // And state.verifyOtpErrorMsg not equals to props.verifyOtpErrorMsg
            if (otpLimitExceeded) {
                // just updating `verifyOtpErrorMsg` to state
                return {
                    ...state,
                    verifyOtpErrorMsg: verifyOtpErrorMsg
                };
            } else {
                // User entered invalid OTP
                // So clearing `OTPValue`
                return {
                    ...state,
                    OTPValue: '',
                    verifyOtpErrorMsg: verifyOtpErrorMsg
                };
            }
        } else if (showVerifyOTP && isValidElement(state.verifyOtpErrorMsg) && !isValidElement(verifyOtpErrorMsg)) {
            // If OTP dialog needs to show `showVerifyOTP`
            // And if OTP error message is null `props.verifyOtpErrorMsg`
            // And if local OTP error message is not null `state.verifyOtpErrorMsg`
            return {
                ...state,
                verifyOtpErrorMsg: verifyOtpErrorMsg
            };
        } else if (!showVerifyOTP) {
            return {
                ...state,
                OTPValue: ''
            };
        }
    }

    render() {
        return (
            <Fragment>
                {this.renderConfirmOTPModal()}
                {this.renderVerifyOTPModal()}
            </Fragment>
        );
    }

    renderConfirmOTPModal() {
        let { otpPhoneNumber, accountVerified, isDuplicatePhone, showOTPConfirmModel, coutryIso } = this.props;
        if (isExistingUser(accountVerified) || isDuplicatePhone) {
            return (
                <T2SModal
                    screenName={SCREEN_OPTIONS.PROFILE.screen_title}
                    isVisible={isValidElement(otpPhoneNumber) && isDuplicatePhone ? showOTPConfirmModel : isVerifyOtp(accountVerified)}
                    titleCenter={true}
                    titleTextStyle={otpStyle.modelTitleStyle}
                    description={`${LOCALIZATION_STRINGS.CONFIRM_OTP_MODEL_DESCRIPTION_ONE} ${getFormattedTAPhoneNumber(
                        otpPhoneNumber,
                        coutryIso
                    )} ${LOCALIZATION_STRINGS.CONFIRM_OTP_MODEL_DESCRIPTION_TWO}`}
                    descriptionTextStyle={otpStyle.modelDescriptionStyle}
                    positiveButtonText={LOCALIZATION_STRINGS.YES}
                    positiveButtonClicked={this.handleOnConfirmOTP.bind(this, true)}
                    negativeButtonText={LOCALIZATION_STRINGS.NO}
                    negativeButtonClicked={this.handleOnConfirmOTP.bind(this, false)}
                    requestClose={() => true}
                />
            );
        }
    }

    handleOnConfirmOTP = debounce(
        (confirm) => {
            //TODO If reset is not needed for cancel option move inside the if condition
            const { otpPhoneNumber, accountVerified, fromScreen, isUpdateProfile } = this.props;
            this.props.changeOtpVerifyStatusAction();
            Analytics.logAction(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.CONFIRM_OTP, { confirm });
            if (confirm) {
                this.props.sendOTPAction(otpPhoneNumber, getOTPType(accountVerified), fromScreen, isUpdateProfile);
            } else {
                this.props.resetOtpPhoneNumberAction();
            }
        },
        2000,
        { leading: true, trailing: false }
    );

    renderVerifyOTPModal() {
        let {
            otpPhoneNumber,
            otpRequestedFrom,
            accountVerified,
            showVerifyOTP,
            otpLength,
            verifyOtpErrorMsg,
            otpLimitExceeded
        } = this.props;
        const type = getOTPType(accountVerified);
        const description = otpLimitExceeded
            ? LOCALIZATION_STRINGS.EXCEEDED_THE_LIMIT
            : isValidElement(this.state.verifyOtpDescription)
            ? this.state.verifyOtpDescription
            : type === OTP_TYPE.SMS
            ? LOCALIZATION_STRINGS.OTP_IS_SENT
            : LOCALIZATION_STRINGS.CALLING_YOUR_NUMBER;
        if (isValidElement(otpPhoneNumber)) {
            return (
                <OTPModal
                    otpRequestedFrom={isValidElement(otpRequestedFrom) ? otpRequestedFrom : ANALYTICS_SCREENS.PROFILE}
                    screenName={SCREEN_OPTIONS.HOME.screen_title}
                    isVisible={showVerifyOTP}
                    type={type}
                    phone={otpPhoneNumber}
                    otpLength={otpLength}
                    OTPValue={this.state.OTPValue}
                    onOTPComplete={this.onOTPComplete}
                    onOTPChange={this.onOTPChange}
                    resendOTP={this.resendOTP}
                    requestClose={this.resetVerifyOtp}
                    description={description}
                    errorMsg={convertMessageToAppLanguage(verifyOtpErrorMsg, this.props.languageKey)}
                    otpLimitExceeded={otpLimitExceeded}
                    dialogCancelable={false}
                />
            );
        }
    }

    resetVerifyOtp() {
        this.setState({ OTPValue: '' });
        this.props.resetVerifyOTPValuesAction();
    }

    onOTPChange(otp) {
        let { otpLength } = this.props;
        //TODO if needed the call back for on change we can use this one
        this.setState({ OTPValue: otp });
        if (otp.length === otpLength) {
            this.onOTPComplete(otp);
        }
        this.props.resetVerifyOTPErrorMsgAction();
    }

    onOTPComplete(otp) {
        const { otpPhoneNumber, otpLength, showVerifyOTP, isUpdateProfile } = this.props;
        if (showVerifyOTP && otp.length === otpLength && isValidString(otpPhoneNumber)) {
            Analytics.logAction(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.OTP_VERIFY, { phone: otpPhoneNumber });
            this.props.verifyOTPAction(otpPhoneNumber, otp, isUpdateProfile);
        }
    }
    resendOTP(otpType) {
        let { otpPhoneNumber, isUpdateProfile } = this.props;
        this.props.sendOTPAction(otpPhoneNumber, otpType, true, isUpdateProfile);
        this.setState({
            verifyOtpDescription: otpType === OTP_TYPE.SMS ? LOCALIZATION_STRINGS.OTP_IS_SENT : LOCALIZATION_STRINGS.CALLING_YOUR_NUMBER
        });
    }
}

const mapStateToProps = (state) => ({
    otpPhoneNumber: state.authState.otpPhoneNumber,
    accountVerified: state.authState.accountVerified,
    otpLength: state.profileState.otpLength,
    verifyOtpErrorMsg: state.profileState.verifyOtpErrorMsg,
    otpLimitExceeded: state.profileState.otpLimitExceeded,
    isDuplicatePhone: state.profileState.isDuplicatePhone,
    showVerifyOTP: state.profileState.showVerifyOTP,
    isUpdateProfile: state.profileState.isUpdateProfile,
    showOTPConfirmModel: state.profileState.showOTPConfirmModel,
    languageKey: selectLanguageKey(state),
    coutryIso: state.appState.s3ConfigResponse?.country?.iso
});

const mapDispatchToProps = {
    sendOTPAction,
    changeOtpVerifyStatusAction,
    verifyOTPAction,
    resetOtpPhoneNumberAction,
    resetVerifyOTPErrorMsgAction,
    resetVerifyOTPValuesAction
};

export default connect(mapStateToProps, mapDispatchToProps)(OTPModalContainer);
