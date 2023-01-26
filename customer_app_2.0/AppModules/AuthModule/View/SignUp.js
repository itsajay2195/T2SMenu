import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, Platform, View } from 'react-native';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { SignUpStyle } from '../Styles/SignUpStyles';
import T2SCheckBox from 't2sbasemodule/UI/CommonUI/T2SCheckBox';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { AuthConstants, LENGTH, SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import {
    checkRegexPatternTest,
    firstCharacterUpperCased,
    getCountryCode,
    getPhoneFromCountryNumber,
    isValidElement,
    isValidNumber,
    isValidString,
    normalizePhoneNo,
    removePrefixFromNumber,
    safeIntValue,
    isValidNotEmptyString,
    isSmsPromotionChecked,
    isEmailPromotionChecked,
    isCustomerApp,
    separateCountryPrefix,
    checkIsValidEmail,
    trimBlankSpacesInText
} from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { connect } from 'react-redux';
import { registerAction, setRegisterError } from '../Redux/AuthAction';
import { checkConfirmPassword, formatName, PASSWORD_PATTERN, validName } from '../Utils/AuthHelpers';
import * as Analytics from '../../AnalyticsModule/Analytics';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { Text } from 'react-native-paper';
import HyperlinkText from 't2sbasemodule/UI/CustomUI/HyperlinkText';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { AuthStyle } from '../Styles/AuthStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { removePhoneSpecialCharacters } from 't2sbasemodule/Utils/ValidationUtil';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { getPhoneMaxLength, isValidField } from '../../BaseModule/GlobalAppHelper';
import { CONFIG_TYPE } from '../../BaseModule/GlobalAppConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import _ from 'lodash';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import BaseComponent from '../../BaseModule/BaseComponent';
import { logAutoOptInOut } from '../../ProfileModule/Utils/ProfileHelper';

const screenName = SCREEN_NAME.SIGN_UP_SCREEN;
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.mobileNumberText = null;
        this.handleEndEditingText = this.handleEndEditingText.bind(this);
        this.handleOnFocusText = this.handleOnFocusText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSignUpAPI = this.handleSignUpAPI.bind(this);
        this.handleSubmitButtonState = this.handleSubmitButtonState.bind(this);
        this.handleSmsCheckBox = this.handleSmsCheckBox.bind(this);
        this.handleEmailCheckBox = this.handleEmailCheckBox.bind(this);
        this.hideChangesModal = this.hideChangesModal.bind(this);
        this.handleOnTouchStartForMobileNumber = this.handleOnTouchStartForMobileNumber.bind(this);
        this.handleInputRefForTextInput = this.handleInputRefForTextInput.bind(this);
        this.handleOnChangeText = this.handleOnChangeText.bind(this);
    }

    state = {
        firstName: null,
        lastName: null,
        mobileNumber: null,
        email: null,
        password: null,
        confirmPassword: null,
        isSubmitButtonEnabled: false,
        emailChecked: false,
        smsChecked: false,
        gdprChecked: true,
        errorFirstName: false,
        inValidFirstName: false,
        errorLastName: false,
        inValidLastName: false,
        errorEmail: false,
        errorMobileNumber: false,
        errorPassword: false,
        errorConfirmPassword: false,
        showsChangesModal: false,
        hidePassword: true,
        showSignUpLoading: false,
        prefixMobile: null,
        checkForMaxLength: false
    };

    componentDidMount() {
        Analytics.logScreen(screenName);
        this.props.setRegisterError(false);
        if (isValidElement(this.props.route)) {
            let { route } = this.props;
            if (isValidElement(route.params) && isValidElement(route.params.email)) {
                this.setState({ email: trimBlankSpacesInText(route.params.email) });
            }
        }
        const { promotion_campaigns, opt_in_opt_out_email, opt_in_opt_out_sms } = this.props;
        if (isCustomerApp() && isValidElement(opt_in_opt_out_email) && isValidElement(opt_in_opt_out_sms)) {
            this.setPromotions(opt_in_opt_out_email, opt_in_opt_out_sms);
        } else if (isValidElement(promotion_campaigns)) {
            this.setPromotions(promotion_campaigns.opt_in_opt_out_email, promotion_campaigns.opt_in_opt_out_sms);
        }
    }

    setPromotions(email, sms) {
        this.setState({
            emailChecked: isEmailPromotionChecked(email),
            smsChecked: isSmsPromotionChecked(sms)
        });
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { signUpLoading } = props;
        if (signUpLoading !== state.showSignUpLoading) {
            value.showSignUpLoading = signUpLoading;
        }
        return _.isEmpty(value) ? null : value;
    }

    render() {
        return (
            <BaseComponent showHeader={false} showElevation={false}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    showElevation={false}
                    actions={this.renderHeaderSignUpButton()}
                />
                <KeyboardAwareScrollView enabled behavior="padding" keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                    <View>
                        {this.renderFirstName()}
                        {this.renderLastName()}
                        {this.renderMobileNumber(VIEW_ID.MOBILE_NUMBER_TEXT)}
                        {this.renderEmailId()}
                        {this.renderPassword()}
                        {this.renderConfirmPassword()}
                        {this.renderPrivacyPolicy()}
                        {this.renderPromotion()}
                        {this.renderBottomSignUpButton()}
                    </View>
                </KeyboardAwareScrollView>
                {this.checkRegisterError()}
                {this.renderSaveChangesModal()}
            </BaseComponent>
        );
    }

    renderHeaderSignUpButton() {
        const { showSignUpLoading, isSubmitButtonEnabled } = this.state;
        return (
            <View>
                {showSignUpLoading ? (
                    <View style={AuthStyle.activityLoaderView}>
                        <ActivityIndicator color={Colors.secondary_color} size={'small'} />
                    </View>
                ) : (
                    <T2STouchableOpacity screenName={screenName} id={VIEW_ID.SIGN_UP_BUTTON} onPress={this.handleSubmit}>
                        <T2SText
                            screenName={screenName}
                            id={VIEW_ID.SIGN_UP_TEXT}
                            style={[
                                SignUpStyle.signUpTextStyle,
                                isSubmitButtonEnabled ? { color: Colors.textBlue } : { color: Colors.suvaGrey }
                            ]}>
                            {`${LOCALIZATION_STRINGS.AGREE.toUpperCase()} & ${LOCALIZATION_STRINGS.SIGN_UP.toUpperCase()}`}
                        </T2SText>
                    </T2STouchableOpacity>
                )}
            </View>
        );
    }

    renderFirstName() {
        return (
            <View>
                {this.renderTextInputFields(
                    VIEW_ID.FIRST_NAME_TEXT,
                    'default',
                    false,
                    LENGTH.NAME_MAX_LENGTH,
                    this.handleOnFocusText,
                    this.handleEndEditingText
                )}
            </View>
        );
    }

    renderLastName() {
        return (
            <View>
                {this.renderTextInputFields(
                    VIEW_ID.LAST_NAME_TEXT,
                    'default',
                    false,
                    LENGTH.NAME_MAX_LENGTH,
                    this.handleOnFocusText,
                    this.handleEndEditingText
                )}
            </View>
        );
    }

    handleOnTouchStartForMobileNumber() {
        if (isValidElement(this.mobileNumberText)) {
            this.mobileNumberText.focus();
        }
    }
    renderMobileNumber(id) {
        return (
            <T2SView style={AuthStyle.phoneNumberContainer}>
                <T2SView screenName={screenName} id={VIEW_ID.MOBILE_NUMBER_VIEW} style={AuthStyle.prefixContainer}>
                    <T2STouchableOpacity
                        screenName={screenName}
                        id={VIEW_ID.MOBILE_NUMBER_TOUCHABLE}
                        onPress={() => this.mobileNumberText.focus()}>
                        <T2STextInput
                            screenName={screenName}
                            id={VIEW_ID.MOBILE_NUMBER_TEXT}
                            value={this.state.prefixMobile}
                            required
                            label={this.getTextInputLabel(id)}
                            editable={false}
                            error={this.getTextInputError(id)}
                            errorText={this.getTextInputErrorText(id)}
                            onTouchStart={this.handleOnTouchStartForMobileNumber}
                        />
                    </T2STouchableOpacity>
                </T2SView>
                {this.renderTextInputFields(
                    VIEW_ID.MOBILE_NUMBER_TEXT,
                    'numeric',
                    false,
                    getPhoneMaxLength(this.props.mobileLength, this.props.countryFlag),
                    this.handleOnFocusText,
                    this.handleEndEditingText
                )}
            </T2SView>
        );
    }

    renderEmailId() {
        return (
            <View>
                {this.renderTextInputFields(
                    VIEW_ID.EMAIL_TEXT,
                    'email-address',
                    false,
                    undefined,
                    this.handleOnFocusText,
                    this.handleEndEditingText
                )}
            </View>
        );
    }

    renderPassword() {
        return (
            <View>
                {this.renderTextInputFields(
                    VIEW_ID.PASSWORD_TEXT,
                    'default',
                    this.state.hidePassword,
                    undefined,
                    this.handleOnFocusText,
                    this.handleEndEditingText
                )}
            </View>
        );
    }

    renderConfirmPassword() {
        return (
            <View>
                {this.renderTextInputFields(
                    VIEW_ID.CONFIRM_PASSWORD_TEXT,
                    'default',
                    this.state.hidePassword,
                    undefined,
                    this.handleOnFocusText,
                    this.handleEndEditingText
                )}
            </View>
        );
    }

    renderTextInputFields(id, keyboardType, textEntry, maxLength, onFocus, onEndEditing) {
        const { prefixMobile } = this.state;
        return (
            <T2SView
                style={[
                    SignUpStyle.textInputContainer,
                    id === VIEW_ID.MOBILE_NUMBER_TEXT
                        ? isValidElement(prefixMobile) && prefixMobile.length > 3
                            ? AuthStyle.phoneNumberLongerDigitFlexContainer
                            : AuthStyle.phoneNumberFlexContainer
                        : null
                ]}>
                {this.renderInput(id, keyboardType, textEntry, maxLength, onFocus, onEndEditing)}
                {id === VIEW_ID.PASSWORD_TEXT
                    ? this.renderPasswordIcon()
                    : id === VIEW_ID.CONFIRM_PASSWORD_TEXT
                    ? this.renderConfirmPasswordIcon()
                    : null}
            </T2SView>
        );
    }

    handleInputRefForTextInput(input, id) {
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) this.mobileNumberText = input;
    }

    renderInput(id, keyboardType = 'default', textEntry = false, maxLength = undefined, onFocus = null, onEndEditing = null) {
        const { checkForMaxLength } = this.state;
        return (
            <T2STextInput
                screenName={screenName}
                id={id}
                label={id !== VIEW_ID.MOBILE_NUMBER_TEXT && this.getTextInputLabel(id)}
                value={this.getTextInputValue(id)}
                onChangeText={this.handleOnChangeText}
                keyboardType={
                    id === VIEW_ID.FIRST_NAME_TEXT || id === VIEW_ID.LAST_NAME_TEXT
                        ? Platform.OS === 'android'
                            ? 'visible-password'
                            : keyboardType
                        : keyboardType
                }
                textContentType={id === VIEW_ID.PASSWORD_TEXT || id === VIEW_ID.CONFIRM_PASSWORD_TEXT ? 'oneTimeCode' : 'userName'}
                autoCapitalize={id === VIEW_ID.FIRST_NAME_TEXT || id === VIEW_ID.LAST_NAME_TEXT ? 'words' : 'none'}
                secureTextEntry={textEntry}
                maxLength={checkForMaxLength && isValidNumber(maxLength) ? safeIntValue(maxLength) : LENGTH.DEFAULT_MAX_LENGTH}
                error={this.getTextInputError(id)}
                errorText={id !== VIEW_ID.MOBILE_NUMBER_TEXT && this.getTextInputErrorText(id)}
                required={id !== VIEW_ID.MOBILE_NUMBER_TEXT && true}
                dontShowUnderLine={id === VIEW_ID.MOBILE_NUMBER_TEXT}
                autoFocus={id === VIEW_ID.FIRST_NAME_TEXT}
                onEndEditing={onEndEditing}
                onFocus={onFocus}
                accessible={false}
                inputRef={this.handleInputRefForTextInput}
            />
        );
    }

    renderPasswordIcon() {
        let { hidePassword } = this.state;
        return (
            <T2STouchableOpacity
                screenName={screenName}
                id={AuthConstants.PASSWORD_EYE_ICON_CLICKED}
                onPress={() => this.setState({ hidePassword: !hidePassword })}
                style={SignUpStyle.eyeIconViewStyle}>
                <CustomIcon name={hidePassword ? FONT_ICON.EYE_CLOSE : FONT_ICON.EYE_OPEN} color={Colors.suvaGrey} size={30} />
            </T2STouchableOpacity>
        );
    }

    renderConfirmPasswordIcon() {
        let { hidePassword } = this.state;
        return (
            <T2STouchableOpacity
                screenName={screenName}
                id={AuthConstants.CONFIRM_PASSWORD_EYE_ICON_CLICKED}
                onPress={() => this.setState({ hidePassword: !hidePassword })}
                style={SignUpStyle.eyeIconViewStyle}>
                <CustomIcon name={hidePassword ? FONT_ICON.EYE_CLOSE : FONT_ICON.EYE_OPEN} color={Colors.suvaGrey} size={30} />
            </T2STouchableOpacity>
        );
    }

    renderPrivacyPolicy() {
        return (
            <View style={SignUpStyle.privacyPolicyMainView}>
                <View style={SignUpStyle.privacyPolicyView}>
                    {this.renderCommonText(LOCALIZATION_STRINGS.PRIVACY_POLICY_TEXT, SignUpStyle.commonTextStyle)}
                    {this.renderHyperLinkText(VIEW_ID.TERMS_AND_CONDITIONS_TEXT, LOCALIZATION_STRINGS.TERMS_AND_CONDITIONS)}
                    {this.renderCommonText(LOCALIZATION_STRINGS.PRIVACY_POLICY_COMMA, SignUpStyle.commonTextStyle)}
                    {this.renderHyperLinkText(VIEW_ID.TERMS_OF_USE_TEXT, LOCALIZATION_STRINGS.TERMS_OF_USE)}
                    {this.renderCommonText(' ' + LOCALIZATION_STRINGS.PRIVACY_POLICY_AND, SignUpStyle.commonTextStyle)}
                    {this.renderHyperLinkText(VIEW_ID.PRIVACY_POLICY_TEXT, LOCALIZATION_STRINGS.PRIVACY_POLICY)}
                </View>
            </View>
        );
    }

    renderCommonText(name, textStyle) {
        return <Text style={textStyle}>{name}</Text>;
    }

    renderHyperLinkText(id, name) {
        return (
            <HyperlinkText
                id={id}
                screenName={screenName}
                onPress={this.handleGDPRScreenNavigation.bind(this, this.getRouteName(id))}
                name={name}
            />
        );
    }

    renderPromotion() {
        const { emailChecked, smsChecked } = this.state;
        return (
            <View>
                <View style={SignUpStyle.promotionTextView}>
                    <View style={SignUpStyle.promotionTextWrapView}>
                        {this.renderCommonText(LOCALIZATION_STRINGS.PROMOTIONS_TEXT, SignUpStyle.promotionsText)}
                    </View>
                </View>
                <View style={SignUpStyle.checkBoxContainer}>
                    <View style={[SignUpStyle.checkBoxView, { paddingRight: 15 }]}>
                        <T2SCheckBox
                            id={VIEW_ID.EMAIL_CHECKBOX}
                            screenName={screenName}
                            label={LOCALIZATION_STRINGS.EMAIL}
                            textstyle={SignUpStyle.checkTextStyle}
                            status={emailChecked === true ? AuthConstants.CHECKBOX_CHECKED : null}
                            onPress={this.handleSmsCheckBox}
                        />
                    </View>
                    <View style={SignUpStyle.checkBoxView}>
                        <T2SCheckBox
                            id={VIEW_ID.SMS_CHECKBOX}
                            screenName={screenName}
                            label={LOCALIZATION_STRINGS.SMS}
                            textstyle={SignUpStyle.checkTextStyle}
                            status={smsChecked === true ? AuthConstants.CHECKBOX_CHECKED : null}
                            onPress={this.handleEmailCheckBox}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderBottomSignUpButton() {
        const { isSubmitButtonEnabled } = this.state;
        return (
            <View style={SignUpStyle.signUpContainer}>
                <T2SButton
                    buttonTextStyle={SignUpStyle.nextTextStyle}
                    buttonStyle={[
                        SignUpStyle.nextButtonContainer,
                        !isSubmitButtonEnabled && { backgroundColor: Colors.suvaGrey },
                        { marginTop: 10, marginBottom: 20 }
                    ]}
                    onPress={this.handleSubmit}
                    screenName={screenName}
                    id={VIEW_ID.NEXT_BUTTON}
                    title={`${LOCALIZATION_STRINGS.AGREE.toUpperCase()} & ${LOCALIZATION_STRINGS.SIGN_UP}`}
                />
            </View>
        );
    }

    renderSaveChangesModal() {
        return (
            <T2SModal
                id={VIEW_ID.SAVE_CHANGES_MODAL}
                screenName={screenName}
                dialogCancelable={true}
                title={LOCALIZATION_STRINGS.ATTENTION}
                isVisible={this.state.showsChangesModal}
                positiveButtonText={LOCALIZATION_STRINGS.SAVE}
                negativeButtonText={LOCALIZATION_STRINGS.DISCARD}
                description={LOCALIZATION_STRINGS.MODAL_DESCRIPTION}
                requestClose={this.hideChangesModal}
                positiveButtonClicked={this.hideChangesModal}
                negativeButtonClicked={this.hideChangesModal}
            />
        );
    }

    hideChangesModal() {
        this.setState({ showsChangesModal: false });
    }

    checkRegisterError() {
        const { registerError } = this.props;
        if (isValidElement(registerError) && registerError) {
            this.setState({ isSubmitButtonEnabled: true });
            this.props.setRegisterError(false);
        }
    }

    handleSubmit() {
        let isValid = true;
        const { s3ConfigResponse, countryId, countryIso } = this.props;
        let { firstName, lastName, email, mobileNumber, password, confirmPassword, gdprChecked } = this.state;
        let _mobileNumber = getPhoneFromCountryNumber(mobileNumber, countryId, countryIso);
        if (!isValidNotEmptyString(firstName)) {
            this.setState({ errorFirstName: true });
            isValid = false;
        } else if (!validName(firstName)) {
            this.setState({ inValidFirstName: true });
            isValid = false;
        }
        if (!isValidNotEmptyString(lastName)) {
            this.setState({ errorLastName: true });
            isValid = false;
        } else if (!validName(lastName)) {
            this.setState({ inValidLastName: true });
            isValid = false;
        }
        if (!isValidNotEmptyString(_mobileNumber)) {
            this.setState({ errorMobileNumber: true });
            isValid = false;
        }
        if (!isValidField(s3ConfigResponse, CONFIG_TYPE.PHONE, _mobileNumber)) {
            this.setState({ errorMobileNumber: true });
            isValid = false;
        }
        if (!isValidNotEmptyString(email) || !checkIsValidEmail(email)) {
            this.setState({ errorEmail: true });
            isValid = false;
        }
        if (!isValidString(password) || !checkRegexPatternTest(PASSWORD_PATTERN, password)) {
            this.setState({ errorPassword: true });
            isValid = false;
        }
        if (!isValidString(confirmPassword) || !checkConfirmPassword(password, confirmPassword)) {
            this.setState({ errorConfirmPassword: true });
            isValid = false;
        }
        if (isValid && isValidElement(gdprChecked) && !gdprChecked) {
            showErrorMessage(LOCALIZATION_STRINGS.PLEASE_ACCEPT_TEARM);
            isValid = false;
        }
        if (isValid) {
            this.handleSignUpAPI();
        }
    }

    handleSignUpAPI() {
        Keyboard.dismiss();
        this.setState({ isSubmitButtonEnabled: false });
        const { email, password, firstName, lastName, mobileNumber, gdprChecked, emailChecked, smsChecked } = this.state;
        const { countryId, countryIso } = this.props;
        this.props.registerAction(
            email,
            password,
            firstName,
            lastName,
            getPhoneFromCountryNumber(mobileNumber, countryId, countryIso),
            gdprChecked,
            emailChecked,
            smsChecked,
            true
        );
        Analytics.logEvent(screenName, ANALYTICS_EVENTS.SIGN_UP_BUTTON_CLICKED);
        logAutoOptInOut(ANALYTICS_SCREENS.SIGN_UP_SCREEN, smsChecked, emailChecked);
    }

    handleOnFocusText(id) {
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) {
            this.setState({
                mobileNumber: normalizePhoneNo(this.state.mobileNumber),
                // errorMobileNumber: false,
                prefixMobile: getCountryCode(this.props.countryIso),
                checkForMaxLength: true
            });
        }
    }

    handleEndEditingText(id) {
        let { firstName, lastName, email, mobileNumber, password, confirmPassword } = this.state;
        if (id === VIEW_ID.FIRST_NAME_TEXT) {
            if (!isValidString(firstName)) this.setState({ errorFirstName: true, checkForMaxLength: false });
            else if (!validName(firstName)) this.setState({ inValidFirstName: true, checkForMaxLength: false });
        }
        if (id === VIEW_ID.LAST_NAME_TEXT) {
            if (!isValidString(lastName)) this.setState({ errorLastName: true, checkForMaxLength: false });
            else if (!validName(lastName)) this.setState({ inValidLastName: true, checkForMaxLength: false });
        }
        if (id === VIEW_ID.EMAIL_TEXT) this.setState({ errorEmail: !checkIsValidEmail(email) });
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) {
            this.setState({
                mobileNumber: separateCountryPrefix(mobileNumber, this.props.countryIso),
                errorMobileNumber: !isValidField(this.props.s3ConfigResponse, CONFIG_TYPE.PHONE, mobileNumber),
                checkForMaxLength: false
            });
        }
        if (id === VIEW_ID.PASSWORD_TEXT) this.setState({ errorPassword: !isValidString(password) });
        if (id === VIEW_ID.CONFIRM_PASSWORD_TEXT) this.setState({ errorConfirmPassword: !checkConfirmPassword(password, confirmPassword) });
    }

    getTextInputLabel(id) {
        if (id === VIEW_ID.FIRST_NAME_TEXT) return LOCALIZATION_STRINGS.FIRST_NAME;
        if (id === VIEW_ID.LAST_NAME_TEXT) return LOCALIZATION_STRINGS.LAST_NAME;
        if (id === VIEW_ID.EMAIL_TEXT) return LOCALIZATION_STRINGS.EMAIL;
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) return LOCALIZATION_STRINGS.APP_MOBILE_NUMBER;
        if (id === VIEW_ID.PASSWORD_TEXT) return LOCALIZATION_STRINGS.PASSWORD;
        if (id === VIEW_ID.CONFIRM_PASSWORD_TEXT) return LOCALIZATION_STRINGS.CONFIRM_PASSWORD;
    }

    getTextInputValue(id) {
        let { firstName, lastName, email, mobileNumber, password, confirmPassword } = this.state;
        if (id === VIEW_ID.FIRST_NAME_TEXT) return firstName;
        if (id === VIEW_ID.LAST_NAME_TEXT) return lastName;
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) return mobileNumber;
        if (id === VIEW_ID.EMAIL_TEXT) return email;
        if (id === VIEW_ID.PASSWORD_TEXT) return password;
        if (id === VIEW_ID.CONFIRM_PASSWORD_TEXT) return confirmPassword;
    }

    handleOnChangeText(text, id) {
        if (id === VIEW_ID.FIRST_NAME_TEXT) {
            this.setState(
                {
                    firstName: firstCharacterUpperCased(formatName(text)),
                    errorFirstName: false,
                    inValidFirstName: false,
                    checkForMaxLength: true
                },
                this.handleSubmitButtonState
            );
        }
        if (id === VIEW_ID.LAST_NAME_TEXT) {
            this.setState(
                {
                    lastName: firstCharacterUpperCased(formatName(text)),
                    errorLastName: false,
                    inValidLastName: false,
                    checkForMaxLength: true
                },
                this.handleSubmitButtonState
            );
        }
        if (id === VIEW_ID.EMAIL_TEXT)
            this.setState({ email: trimBlankSpacesInText(text), errorEmail: false }, this.handleSubmitButtonState);
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) {
            this.setState(
                {
                    mobileNumber: removePrefixFromNumber(removePhoneSpecialCharacters(text), this.props.countryId),
                    errorMobileNumber: false
                },
                this.handleSubmitButtonState
            );
        }
        if (id === VIEW_ID.PASSWORD_TEXT) {
            let { confirmPassword } = this.state;
            if (isValidString(confirmPassword)) this.setState({ errorConfirmPassword: !checkConfirmPassword(text, confirmPassword) });
            this.setState({ password: text, errorPassword: false }, this.handleSubmitButtonState);
        }
        if (id === VIEW_ID.CONFIRM_PASSWORD_TEXT)
            this.setState({ confirmPassword: text, errorConfirmPassword: false }, () => {
                this.handleSubmitButtonState();
                this.handleEndEditingText(VIEW_ID.CONFIRM_PASSWORD_TEXT);
            });
    }

    handleSubmitButtonState() {
        let { firstName, lastName, mobileNumber, email, password, confirmPassword, gdprChecked } = this.state;
        const { s3ConfigResponse, countryId, countryIso } = this.props;
        let buttonEnable =
            isValidNotEmptyString(firstName) &&
            validName(firstName) &&
            isValidNotEmptyString(lastName) &&
            validName(lastName) &&
            isValidField(s3ConfigResponse, CONFIG_TYPE.PHONE, getPhoneFromCountryNumber(mobileNumber, countryId, countryIso)) &&
            isValidString(email) &&
            isValidString(password) &&
            isValidString(confirmPassword) &&
            checkConfirmPassword(password, confirmPassword) &&
            gdprChecked;
        if (buttonEnable) return this.setState({ isSubmitButtonEnabled: true });
        else return this.setState({ isSubmitButtonEnabled: false });
    }

    getTextInputError(id) {
        let {
            errorFirstName,
            inValidFirstName,
            errorLastName,
            inValidLastName,
            errorMobileNumber,
            errorEmail,
            errorPassword,
            errorConfirmPassword
        } = this.state;
        if (id === VIEW_ID.FIRST_NAME_TEXT) return errorFirstName || inValidFirstName;
        if (id === VIEW_ID.LAST_NAME_TEXT) return errorLastName || inValidLastName;
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) return errorMobileNumber;
        if (id === VIEW_ID.EMAIL_TEXT) return errorEmail;
        if (id === VIEW_ID.PASSWORD_TEXT) return errorPassword;
        if (id === VIEW_ID.CONFIRM_PASSWORD_TEXT) return errorConfirmPassword;
    }

    getTextInputErrorText(id) {
        let { errorFirstName, inValidFirstName, errorLastName, inValidLastName } = this.state;
        if (id === VIEW_ID.FIRST_NAME_TEXT) {
            if (errorFirstName) return LOCALIZATION_STRINGS.ERROR_MESSAGE_FIRST_NAME;
            else if (inValidFirstName) return LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_FIRST_NAME;
        }
        if (id === VIEW_ID.LAST_NAME_TEXT) {
            if (errorLastName) return LOCALIZATION_STRINGS.ERROR_MESSAGE_LAST_NAME;
            else if (inValidLastName) return LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_LAST_NAME;
        }
        if (id === VIEW_ID.MOBILE_NUMBER_TEXT) return LOCALIZATION_STRINGS.ERROR_MESSAGE_MOBILE_NUMBER;
        if (id === VIEW_ID.EMAIL_TEXT) return LOCALIZATION_STRINGS.ERROR_MESSAGE_EMAIL;
        if (id === VIEW_ID.PASSWORD_TEXT) return LOCALIZATION_STRINGS.ERROR_MESSAGE_PASSWORD_PATTERN;
        if (id === VIEW_ID.CONFIRM_PASSWORD_TEXT) return LOCALIZATION_STRINGS.ERROR_MESSAGE_PASSWORD_MISMATCH;
    }

    handleSmsCheckBox() {
        this.setState({ emailChecked: !this.state.emailChecked });
    }

    handleEmailCheckBox() {
        this.setState({ smsChecked: !this.state.smsChecked });
    }

    handleGDPRScreenNavigation(routeName) {
        handleNavigation(routeName, { showBackButton: true });
    }

    getRouteName(id) {
        if (id === VIEW_ID.TERMS_AND_CONDITIONS_TEXT) return SCREEN_OPTIONS.TERMS_AND_CONDITIONS.route_name;
        else if (id === VIEW_ID.TERMS_OF_USE_TEXT) return SCREEN_OPTIONS.TERMS_OF_USE.route_name;
        else return SCREEN_OPTIONS.PRIVACY_POLICY.route_name;
    }
}

const mapStateToProps = (state) => ({
    s3ConfigResponse: state.appState.s3ConfigResponse,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    promotion_campaigns: state.appState.s3ConfigResponse?.promotion_campaigns,
    registerError: state.authState.registerError,
    signUpLoading: state.authState.signUpLoading,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    mobileLength: state.appState.s3ConfigResponse?.mobile?.max_length,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    opt_in_opt_out_email: state.appState.storeConfigResponse?.opt_in_opt_out_email,
    opt_in_opt_out_sms: state.appState.storeConfigResponse?.opt_in_opt_out_sms
});

const mapDispatchToProps = {
    registerAction,
    setRegisterError
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
