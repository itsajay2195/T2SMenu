import React, { Component } from 'react';
import { Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import { AuthStyle } from '../Styles/AuthStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { forgotPasswordAction } from '../Redux/AuthAction';
import { checkIsValidEmail, isValidElement, isValidString, trimBlankSpacesInText } from 't2sbasemodule/Utils/helpers';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { Text } from 'react-native-paper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.handleResetPasswordAction = this.handleResetPasswordAction.bind(this);
        this.handleOnEmailChange = this.handleOnEmailChange.bind(this);
        this.handleOnEndEditing = this.handleOnEndEditing.bind(this);
        this.state = {
            email: null,
            errorEmail: false,
            resetPasswordPressed: false,
            showTick: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.FORGOT_PASSWORD_SCREEN);
        let { route } = this.props;
        if (isValidElement(route.params) && isValidElement(route.params.email)) {
            this.setState({ email: trimBlankSpacesInText(route.params.email) });
        }
    }

    render() {
        return (
            <View>
                <SafeAreaView>
                    <View style={AuthStyle.mainContainer}>
                        {this.renderHeader()}
                        {this.renderEmailTextInput()}
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    renderHeader() {
        const { resendLink } = this.props;
        return (
            <T2SAppBar
                showElevation={false}
                id={VIEW_ID.BACK_BUTTON}
                screenName={SCREEN_NAME.FORGOT_PASSWORD_SCREEN}
                actions={
                    isValidElement(resendLink) &&
                    !resendLink && (
                        <T2STouchableOpacity
                            screenName={SCREEN_NAME.FORGOT_PASSWORD_SCREEN}
                            id={VIEW_ID.RESEND_BUTTON_TEXT}
                            onPress={this.handleResetPasswordAction}>
                            <Text style={[AuthStyle.loginTextStyle, { fontSize: setFont(15) }]}>{LOCALIZATION_STRINGS.RESET}</Text>
                        </T2STouchableOpacity>
                    )
                }
            />
        );
    }

    handleOnEndEditing() {
        this.setState({
            errorEmail: !isValidString(this.state.email) || !checkIsValidEmail(this.state.email)
        });
    }

    renderEmailTextInput() {
        const { resendLink } = this.props;
        return (
            <View style={AuthStyle.formInputContainer}>
                <View style={AuthStyle.emailInputContainer}>
                    <T2STextInput
                        screenName={SCREEN_NAME.FORGOT_PASSWORD_SCREEN}
                        id={VIEW_ID.EMAIL_TEXT}
                        label={LOCALIZATION_STRINGS.EMAIL_ID}
                        value={this.state.email}
                        autoCapitalize="none"
                        onChangeText={this.handleOnEmailChange}
                        error={this.state.errorEmail}
                        errorText={LOCALIZATION_STRINGS.ERROR_MESSAGE_EMAIL}
                        keyboardType={'email-address'}
                        onEndEditing={this.handleOnEndEditing}
                        autoFocus
                    />
                    {this.state.showTick && (
                        <T2SIcon
                            style={AuthStyle.tickIconViewStyle}
                            color={Colors.primaryColor}
                            icon={FONT_ICON.TICK}
                            size={22}
                            id={VIEW_ID.TICK}
                        />
                    )}
                    <T2SText
                        style={AuthStyle.resendTextStyle}
                        screenName={SCREEN_NAME.FORGOT_PASSWORD_SCREEN}
                        id={VIEW_ID.RESEND_MESSAGE_TEXT}>
                        {LOCALIZATION_STRINGS.RESEND_EMAIL_TEXT}
                    </T2SText>
                    {isValidElement(resendLink) && resendLink && this.renderResendLink()}
                </View>
            </View>
        );
    }
    //
    //TODO As we don't have all required infrastructure for resend option, Resend UI is designed and made invisible as same as FoodHub App
    renderResendLink() {
        return (
            <View style={AuthStyle.resendLinkContainer}>
                <T2SText
                    style={AuthStyle.didNotReceiveText}
                    screenName={SCREEN_NAME.FORGOT_PASSWORD_SCREEN}
                    id={VIEW_ID.DID_NOT_RECEIVE_LINK_TEXT}>
                    {LOCALIZATION_STRINGS.DID_NOT_RECEIVE_LINK}
                </T2SText>
                <T2STouchableOpacity onPress={this.handleResetPasswordAction.bind(this, true)}>
                    <T2SText
                        style={AuthStyle.resendButtonText}
                        screenName={SCREEN_NAME.FORGOT_PASSWORD_SCREEN}
                        id={VIEW_ID.RESEND_BUTTON_TEXT}>
                        {LOCALIZATION_STRINGS.CONFIRM_OTP_RESEND}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }
    handleOnEmailChange(text) {
        this.setState({ email: trimBlankSpacesInText(text), showTick: isValidString(text) && checkIsValidEmail(text) });
    }

    handleResetPasswordAction(resendLink) {
        Analytics.logAction(ANALYTICS_SCREENS.FORGOT_PASSWORD_SCREEN, ANALYTICS_EVENTS.RESET_PASSWORD_BUTTON_CLICKED);
        if (!isValidString(this.state.email) || !checkIsValidEmail(this.state.email)) {
            this.setState({ errorEmail: true });
        } else if (!resendLink) {
            Keyboard.dismiss();
            this.props.forgotPasswordAction(this.state.email);
        } else {
            Keyboard.dismiss();
            this.props.forgotPasswordAction(this.state.email, resendLink);
        }
    }
}

const mapStateToProps = (state) => ({
    resendLink: state.authState.resendLink
});
const mapDispatchToProps = {
    forgotPasswordAction
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
