import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import { AuthStyle } from '../Styles/AuthStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginAction, resetEmailExistingAction } from '../Redux/AuthAction';
import { checkIsValidEmail, isValidElement, isValidString, trimBlankSpacesInText } from 't2sbasemodule/Utils/helpers';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { handleGoBack, handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { Text } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import _ from 'lodash';
class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
        this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
        this.handleLoginAction = this.handleLoginAction.bind(this);
        this.handleSignUpAction = this.handleSignUpAction.bind(this);
        this.handleForgotPasswordAction = this.handleForgotPasswordAction.bind(this);
        this.handleInputRefForPassword = this.handleInputRefForPassword.bind(this);
        this.handleOnFocusForPassword = this.handleOnFocusForPassword.bind(this);
        this.handleOnEndEditingForPassword = this.handleOnEndEditingForPassword.bind(this);
        this.handleInputRefForEmail = this.handleInputRefForEmail.bind(this);
        this.handleOnFocusForEmail = this.handleOnFocusForEmail.bind(this);
        this.handleOnEndEditingForEmail = this.handleOnEndEditingForEmail.bind(this);
        this.emailField = null;
        this.state = {
            email: null,
            password: null,
            errorEmail: false,
            showTick: false,
            errorPassword: false,
            hidePassword: true,
            showLoginLoading: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.LOGIN_SCREEN);
        if (isValidElement(this.props.route)) {
            let { route } = this.props;
            if (isValidElement(route.params) && isValidElement(route.params.email)) {
                this.setState({ email: trimBlankSpacesInText(route.params.email) });
            }
        }
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            if (isValidElement(this.emailField)) {
                this.emailField.focus();
            }
        });
    }
    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { loginLoading } = props;
        if (loginLoading !== state.showLoginLoading) {
            value.showLoginLoading = loginLoading;
        }
        return _.isEmpty(value) ? null : value;
    }

    render() {
        return (
            <SafeAreaView>
                <T2SView style={AuthStyle.mainContainer}>
                    {this.renderHeader()}
                    {this.renderBody()}
                </T2SView>
            </SafeAreaView>
        );
    }
    renderHeader() {
        return (
            <T2SAppBar
                actions={this.renderHeaderButton()}
                showElevation={false}
                id={VIEW_ID.BACK_BUTTON}
                screenName={SCREEN_NAME.LOGIN_SCREEN}
            />
        );
    }
    renderHeaderButton() {
        const { showLoginLoading } = this.state;
        return (
            <View>
                {showLoginLoading ? (
                    <View style={AuthStyle.activityLoaderView}>
                        <ActivityIndicator color={Colors.secondary_color} size={'small'} />
                    </View>
                ) : (
                    <T2STouchableOpacity screenName={SCREEN_NAME.LOGIN_SCREEN} id={VIEW_ID.LOGIN_BUTTON} onPress={this.handleLoginAction}>
                        {/*<ActivityIndicator color={Colors.secondary_color} size={'small'} />*/}
                        <Text style={AuthStyle.loginTextStyle}>{LOCALIZATION_STRINGS.LOGIN}</Text>
                    </T2STouchableOpacity>
                )}
            </View>
        );
    }
    renderBody() {
        return (
            <KeyboardAwareScrollView
                style={AuthStyle.scrollView}
                enabled
                behavior="padding"
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                <T2SView style={AuthStyle.buttonContainer}>
                    {this.renderEmailTextInput()}
                    {this.renderPasswordTextInput()}
                    {this.renderForgotPassword()}
                </T2SView>
                {this.renderNewUserSignupButton()}
            </KeyboardAwareScrollView>
        );
    }

    handleInputRefForEmail(ref) {
        this.emailField = ref;
    }

    handleOnFocusForEmail() {
        this.setState({ errorEmail: false, errorPassword: false });
    }

    handleOnEndEditingForEmail() {
        this.setState({
            errorEmail: !isValidString(this.state.email) || !checkIsValidEmail(this.state.email)
        });
    }

    renderEmailTextInput() {
        return (
            <View style={AuthStyle.textInputViewStyle}>
                <T2STextInput
                    inputRef={this.handleInputRefForEmail}
                    screenName={SCREEN_NAME.LOGIN_SCREEN}
                    onSubmitEditing={this.handleSubmitEmail}
                    id={VIEW_ID.EMAIL_TEXT}
                    label={LOCALIZATION_STRINGS.EMAIL}
                    value={this.state.email}
                    autoCapitalize="none"
                    onFocus={this.handleOnFocusForEmail}
                    onChangeText={this.handleOnEmailChange.bind(this)}
                    onEndEditing={this.handleOnEndEditingForEmail}
                    error={this.state.errorEmail}
                    errorText={LOCALIZATION_STRINGS.ERROR_MESSAGE_EMAIL}
                    keyboardType={'email-address'}
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
            </View>
        );
    }

    handleInputRefForPassword(ref) {
        this.passwordField = ref;
    }

    handleOnFocusForPassword(ref) {
        this.setState({
            errorPassword: false
        });
    }

    handleOnEndEditingForPassword() {
        this.setState({
            errorPassword: !isValidString(this.state.password)
        });
    }
    renderPasswordTextInput() {
        return (
            <T2SView style={[AuthStyle.textInputViewStyle, AuthStyle.password]} accessible={false}>
                <T2STextInput
                    inputRef={this.handleInputRefForPassword}
                    onSubmitEditing={this.handleSubmitPassword}
                    label={LOCALIZATION_STRINGS.PASSWORD}
                    value={this.state.password}
                    textContentType={'oneTimeCode'}
                    onFocus={this.handleOnFocusForPassword}
                    onChangeText={this.handleOnPasswordChange.bind(this)}
                    onEndEditing={this.handleOnEndEditingForPassword}
                    secureTextEntry={this.state.hidePassword}
                    autoCapitalize="none"
                    error={this.state.errorPassword}
                    errorText={LOCALIZATION_STRINGS.INVALID_PASSWORD}
                    screenName={SCREEN_NAME.LOGIN_SCREEN}
                    id={VIEW_ID.PASSWORD_TEXT}
                    accessible={false}
                />

                <T2STouchableOpacity
                    onPress={() => this.setState({ hidePassword: !this.state.hidePassword })}
                    style={AuthStyle.eyeIconViewStyle}
                    accessible={false}>
                    <T2SIcon
                        name={this.state.hidePassword ? FONT_ICON.EYE_CLOSE : FONT_ICON.EYE_OPEN}
                        size={25}
                        color={Colors.suvaGrey}
                        screenName={SCREEN_NAME.LOGIN_SCREEN}
                        id={this.state.hidePassword ? VIEW_ID.EYE_CLOSE : VIEW_ID.EYE_OPEN}
                    />
                </T2STouchableOpacity>
            </T2SView>
        );
    }
    renderForgotPassword() {
        return (
            <T2STouchableOpacity style={AuthStyle.forgotPwdViewStyle} onPress={this.handleForgotPasswordAction} accessible={false}>
                <T2SText style={AuthStyle.forgotPwdTextStyle} screenName={SCREEN_NAME.LOGIN_SCREEN} id={VIEW_ID.FORGOT_PASSWORD}>
                    {LOCALIZATION_STRINGS.FORGOT_PASSWORD}
                </T2SText>
            </T2STouchableOpacity>
        );
    }
    renderNewUserSignupButton() {
        return (
            <T2SView style={AuthStyle.loginViewStyle}>
                <T2SText style={AuthStyle.alreadyTextStyle}>{LOCALIZATION_STRINGS.NEW_USER}</T2SText>
                <T2STouchableOpacity screenName={SCREEN_NAME.LOGIN_SCREEN} id={VIEW_ID.SIGN_UP_BUTTON} onPress={this.handleSignUpAction}>
                    <Text style={AuthStyle.loginTextStyle}>{LOCALIZATION_STRINGS.SIGN_UP}</Text>
                </T2STouchableOpacity>
            </T2SView>
        );
    }
    handleSubmitEmail() {
        isValidString(this.state.email) && !this.state.email.isEmpty && !this.state.errorEmail && this.emailField.focus();
    }
    handleSubmitPassword() {
        isValidString(this.state.password) && !this.state.password.isEmpty && !this.state.errorPassword && this.passwordField.blur();
    }
    handleOnPasswordChange(text) {
        this.setState({ password: text });
    }
    handleOnEmailChange(text) {
        this.setState({
            email: trimBlankSpacesInText(text),
            showTick: isValidString(text) && checkIsValidEmail(text)
        });
    }
    handleLoginAction() {
        Keyboard.dismiss();
        if (!isValidString(this.state.email) || !checkIsValidEmail(this.state.email)) {
            this.setState({ errorEmail: true });
        } else if (!isValidString(this.state.password)) {
            this.setState({ errorPassword: true });
        } else {
            this.props.loginAction(this.state.email, this.state.password);
            Analytics.logAction(ANALYTICS_SCREENS.LOGIN_SCREEN, ANALYTICS_EVENTS.LOGIN_BUTTON_CLICKED);
        }
    }

    handleSignUpAction() {
        Analytics.logAction(ANALYTICS_SCREENS.LOGIN_SCREEN, ANALYTICS_EVENTS.SIGN_UP_NAVIGATION_BUTTON_CLICKED);
        this.props.resetEmailExistingAction();
        if (
            isValidElement(this.props.route) &&
            isValidElement(this.props.route.params) &&
            isValidElement(this.props.route.params.isFromEmailVerify) &&
            this.props.route.params.isFromEmailVerify
        ) {
            handleGoBack();
        }
        this.props.navigation.replace(SCREEN_OPTIONS.EMAIL_VERIFICATION.route_name);
    }

    handleForgotPasswordAction() {
        Analytics.logAction(ANALYTICS_SCREENS.LOGIN_SCREEN, ANALYTICS_EVENTS.FORGOT_PASSWORD_BUTTON_CLICKED);
        handleNavigation(SCREEN_OPTIONS.FORGOT_PASSWORD.route_name, { email: trimBlankSpacesInText(this.state.email) });
    }
}

const mapStateToProps = (state) => ({
    loginLoading: state.authState.loginLoading
});
const mapDispatchToProps = {
    loginAction,
    resetEmailExistingAction
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
