import React from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, View, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import styles from './Style/OTPStyle';
import { VIEW_ID } from 'appmodules/ProfileModule/Utils/ProfileConstants';
import T2SText from '../../CommonUI/T2SText';
import OTPResendButton from './Component/OTPResendButton';
import { isValidElement, isValidString } from '../../../Utils/helpers';
import T2SView from '../../CommonUI/T2SView';
import T2SIcon from '../../CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import T2STouchableOpacity from '../../CommonUI/T2STouchableOpacity';
import Colors from '../../../../T2SBaseModule/Themes/Colors';
import * as Analytics from '../../../../AppModules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS } from 'appmodules/AnalyticsModule/AnalyticsConstants';

const OTPModal = (props) => {
    const {
        screenName,
        analyticsScreenName,
        isVisible,
        requestClose,
        type,
        onOTPChange,
        resendOTP,
        dialogCancelable,
        otpLength,
        description,
        errorMsg,
        otpLimitExceeded,
        OTPValue
    } = props;
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => (dialogCancelable ? requestClose() : {})}
            onRequestClose={() => requestClose()}
            onModalShow={() => {
                // Focusing keyboard when modal shows up
                if (isValidElement(this.otpInput)) this.otpInput.focus();
                Analytics.logAction(analyticsScreenName, ANALYTICS_EVENTS.OTP_MODAL_SHOW);
            }}>
            {Platform.OS === 'android' ? (
                <View>
                    <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
                </View>
            ) : null}
            <KeyboardAvoidingView
                style={styles.keyboardViewStyle}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                showsVerticalScrollIndicator={false}>
                <View style={styles.containerStyle}>
                    <View style={styles.padding15}>
                        <View style={styles.verifyTextViesStyle}>
                            <T2SText id={VIEW_ID.VERIFY_NUMBER_TEXT} screenName={screenName} style={styles.modelTitleStyle}>
                                {description}
                            </T2SText>
                        </View>
                        <T2SView screenName={screenName} id={VIEW_ID.OTP_TEXT_INPUT}>
                            <TextInput
                                ref={(ref) => {
                                    this.otpInput = ref;
                                }}
                                style={[
                                    styles.otpInput,
                                    {
                                        borderBottomColor: isValidString(errorMsg) ? Colors.secondary_color : Colors.textBlue,
                                        color: otpLimitExceeded ? Colors.silver : Colors.black
                                    }
                                ]}
                                keyboardType="numeric"
                                value={OTPValue}
                                maxLength={otpLength}
                                onChangeText={(otp) => onOTPChange(otp)}
                                id={VIEW_ID.OTP_TEXT_INPUT}
                                screenName={screenName}
                                editable={!otpLimitExceeded}
                                requestFocus
                            />
                        </T2SView>

                        {isValidString(errorMsg) ? (
                            <T2SText style={styles.errorTextStyle} id={VIEW_ID.OTP_ERROR_MSG_TEXT} screenName={screenName}>
                                {errorMsg}
                            </T2SText>
                        ) : (
                            <View style={styles.emptyErrorTextView} />
                        )}
                        {!otpLimitExceeded ? (
                            <View>
                                <OTPResendButton screenName={screenName} type={type} onPress={(otpType) => resendOTP(otpType)} />
                            </View>
                        ) : null}
                    </View>
                    <T2STouchableOpacity onPress={() => requestClose()} style={styles.closeIconStyle}>
                        <T2SIcon icon={FONT_ICON.CLOSE} size={20} />
                    </T2STouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
OTPModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    onOTPChange: PropTypes.func.isRequired,
    resendOTP: PropTypes.func.isRequired,
    requestClose: PropTypes.func.isRequired,
    dialogCancelable: PropTypes.bool,
    otpLength: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    errorMsg: PropTypes.string.isRequired,
    otpLimitExceeded: PropTypes.bool
};
OTPModal.defaultProps = {
    dialogCancelable: true,
    screenName: 'Verify OTP Modal',
    otpLength: 4,
    otpLimitExceeded: false
};

export default OTPModal;
