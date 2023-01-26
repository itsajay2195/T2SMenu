import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import { AuthStyle } from '../Styles/AuthStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEmailExisting, resetEmailExistingAction } from '../Redux/AuthAction';
import {
    checkIsValidEmail,
    firstCharacterUpperCased,
    isCustomerApp,
    isFoodHubApp,
    isValidElement,
    isValidString,
    trimBlankSpacesInText
} from 't2sbasemodule/Utils/helpers';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import _ from 'lodash';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { ProgressBar, Text } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import FastImage from 'react-native-fast-image';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getFoodhubLogoStatus } from '../../BaseModule/Utils/FeatureGateHelper';

const screenName = SCREEN_NAME.EMAIL_VERIFY_SCREEN;

class EmailVerification extends Component {
    constructor(props) {
        super(props);
        this.handleOnEmailChange = this.handleOnEmailChange.bind(this);
        this.handleTick = this.handleTick.bind(this);
        this.handleOnEndEditingEmail = this.handleOnEndEditingEmail.bind(this);
        this.state = {
            email: null,
            errorEmail: false,
            isExistingEmail: null,
            loader: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.EMAIL_LOOKUP_SCREEN);
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { isExistingEmail } = props;
        if (isExistingEmail !== state.isExistingEmail) {
            value.isExistingEmail = isExistingEmail;
            value.loader = false;
            if (isExistingEmail) value.showTick = false;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            isValidElement(this.props.isExistingEmail) &&
            prevProps.isExistingEmail !== this.props.isExistingEmail &&
            !this.props.isExistingEmail
        ) {
            this.props.resetEmailExistingAction();
            handleNavigation(SCREEN_OPTIONS.SIGN_UP.route_name, { email: this.state.email });
        }
    }

    render() {
        const { loader } = this.state;
        return (
            <View>
                <SafeAreaView>
                    <View style={AuthStyle.mainContainer}>
                        {this.renderHeader()}
                        {loader && <ProgressBar color={Colors.secondary_color} indeterminate={true} />}
                        {!isCustomerApp() && this.renderAppLogo()}
                        {this.renderEmailTextInput()}
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    renderHeader() {
        const { showTick, loader } = this.state;
        return (
            <T2SAppBar
                showElevation={false}
                actions={
                    loader ? (
                        <ActivityIndicator color={Colors.secondary_color} size={'small'} />
                    ) : (
                        <T2STouchableOpacity id={VIEW_ID.TICK} screenName={screenName} onPress={this.handleTick}>
                            <T2SText
                                id={VIEW_ID.TICK}
                                screenName={screenName}
                                style={[
                                    AuthStyle.alreadyTextStyle,
                                    showTick
                                        ? { color: Colors.textBlue, padding: 10 }
                                        : {
                                              color: Colors.suvaGrey,
                                              padding: 10
                                          }
                                ]}>
                                {firstCharacterUpperCased(LOCALIZATION_STRINGS.NEXT.toLowerCase())}
                            </T2SText>
                        </T2STouchableOpacity>
                    )
                }
            />
        );
    }

    renderAppLogo() {
        return (
            <FastImage
                style={{ height: 35, marginTop: 30 }}
                resizeMode={'contain'}
                source={
                    isFoodHubApp() ? getFoodhubLogoStatus(this.props.foodhub_logo) : require('../../../FranchiseApp/Images/app_logo.png')
                }
            />
        );
    }

    renderEmailTextInput() {
        const { email, errorEmail, isExistingEmail } = this.state;
        return (
            <View style={AuthStyle.formInputContainer}>
                <View style={AuthStyle.emailInputContainer}>
                    <T2STextInput
                        screenName={screenName}
                        id={VIEW_ID.EMAIL_TEXT}
                        label={LOCALIZATION_STRINGS.EMAIL_ID}
                        value={email}
                        autoCapitalize="none"
                        onChangeText={this.handleOnEmailChange}
                        error={errorEmail || isExistingEmail}
                        errorText={
                            (errorEmail && LOCALIZATION_STRINGS.ERROR_MESSAGE_EMAIL) ||
                            (isExistingEmail && LOCALIZATION_STRINGS.REGISTERED_EMAIL_ERROR)
                        }
                        keyboardType={'email-address'}
                        onEndEditing={this.handleOnEndEditingEmail}
                        autoFocus
                    />
                </View>
                {isValidElement(isExistingEmail) && isExistingEmail && this.renderAuthOption()}
                {this.renderNext()}
            </View>
        );
    }

    renderAuthOption() {
        return (
            <View style={AuthStyle.loginViewStyle}>
                <Text style={AuthStyle.alreadyTextStyle}>{LOCALIZATION_STRINGS.DO_YOU_WANT_TO}</Text>
                <T2STouchableOpacity
                    screenName={screenName}
                    id={VIEW_ID.LOGIN_BUTTON}
                    onPress={this.navigate.bind(this, SCREEN_OPTIONS.LOGIN.route_name)}>
                    <Text style={AuthStyle.loginTextStyle}>{` ${LOCALIZATION_STRINGS.LOG_IN}`}</Text>
                </T2STouchableOpacity>
                <Text style={AuthStyle.alreadyTextStyle}>{` ${LOCALIZATION_STRINGS.OR}`}</Text>
                <T2STouchableOpacity
                    screenName={screenName}
                    id={VIEW_ID.LOGIN_BUTTON}
                    onPress={this.navigate.bind(this, SCREEN_OPTIONS.FORGOT_PASSWORD.route_name)}>
                    <Text style={AuthStyle.loginTextStyle}>{` ${LOCALIZATION_STRINGS.RESET_PASSWORD}`}</Text>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderNext() {
        const { showTick } = this.state;
        return (
            <T2SButton
                buttonTextStyle={AuthStyle.nextTextStyle}
                buttonStyle={[AuthStyle.nextButtonContainer, !showTick && { backgroundColor: Colors.suvaGrey }]}
                contentStyle={{ height: 40 }}
                onPress={this.handleTick}
                screenName={screenName}
                id={VIEW_ID.NEXT_BUTTON}
                title={LOCALIZATION_STRINGS.NEXT}
            />
        );
    }

    handleTick() {
        const { email } = this.state;
        if (isValidString(email) && checkIsValidEmail(email)) {
            this.setState({ loader: true, isExistingEmail: null });
            this.props.getEmailExisting(email);
        } else {
            this.setState({ errorEmail: true });
        }
    }

    handleOnEmailChange(text) {
        this.props.resetEmailExistingAction();
        this.setState({
            isExistingEmail: null,
            email: trimBlankSpacesInText(text),
            showTick: isValidString(text) && checkIsValidEmail(text),
            errorEmail: false
        });
    }

    handleOnEndEditingEmail() {
        const { email } = this.state;
        this.setState({
            errorEmail: !isValidString(email) || !checkIsValidEmail(email)
        });
    }

    navigate(route) {
        const { email } = this.state;
        if (route === SCREEN_OPTIONS.LOGIN.route_name) {
            handleNavigation(route, { email, isFromEmailVerify: true });
        } else {
            handleNavigation(route, { email });
        }
    }
}

const mapStateToProps = (state) => ({
    isExistingEmail: state.authState.isExistingEmail,
    foodhub_logo: state.appState.countryBaseFeatureGateResponse?.foodhub_logo
});

const mapDispatchToProps = {
    getEmailExisting,
    resetEmailExistingAction
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailVerification);
