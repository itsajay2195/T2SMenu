import React, { Component } from 'react';
import { Animated, Dimensions, Easing, Keyboard, Platform, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import Colors from 't2sbasemodule/Themes/Colors';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { ProfileConstants, VIEW_ID } from '../Utils/ProfileConstants';
import styles from '../Styles/ProfileStyles';
import BaseComponent from '../../BaseModule/BaseComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { selectStoreId } from 't2sbasemodule/Utils/AppSelectors';
import T2STouchableWithoutFeedback from 't2sbasemodule/UI/CommonUI/T2STouchableWithoutFeedback';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { OPT_IN, OPT_OUT } from '../../BaseModule/BaseConstants';
import { updateEmailConsentAction, updateNotificationConsentAction, updateSMSConsentAction } from '../../AuthModule/Redux/AuthAction';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import {
    checkIsValidEmail,
    firstCharacterUpperCased,
    getAppName,
    getCountryCode,
    getPhoneFromCountryNumber,
    getPolicyId,
    isValidElement,
    isValidNumber,
    isValidString,
    normalizePhoneNo,
    removePrefixFromNumber,
    safeIntValue,
    separateCountryPrefix,
    trimBlankSpacesInText
} from 't2sbasemodule/Utils/helpers';
import {
    deleteAccountAction,
    exportDataAction,
    getProfileAction,
    resetPBLAction,
    resetProfileProgress,
    updateProfileAction,
    updateProfileAPIStatusAction
} from '../Redux/ProfileAction';
import { removePhoneSpecialCharacters } from 't2sbasemodule/Utils/ValidationUtil';
import DiscardChangesModal from '../../DiscardChangesModal/View/DiscardChangesModal';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import {
    fetchEmailSubscriptionStatus,
    fetchNotificationSubscriptionStatus,
    fetchSMSSubscriptionStatus,
    getActualValues,
    isFieldValuesChanged,
    logSMSOptSegment,
    showSavedCards,
    logAutoOptInOut,
    validateProfileFields,
    validateProfileStates
} from '../Utils/ProfileHelper';
import { getPhoneMaxLength } from '../../BaseModule/GlobalAppHelper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import ActivityIndicator from 'react-native-paper/src/components/ActivityIndicator';
import { LENGTH } from '../../AuthModule/Utils/AuthConstants';
import { formatName, validName } from '../../AuthModule/Utils/AuthHelpers';
import _ from 'lodash';
import ProfileDetails from '../MicroComponents/ProfileDetails';
import ProfileTextRow from '../MicroComponents/ProfileTextRow';
import ProfileSwitchRow from '../MicroComponents/ProfileSwitchRow';
import { getReferralCampaignStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import FlashMessage from 't2sbasemodule/UI/CustomUI/FlashMessageComponent';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import { convertProfileResponseToAnalytics } from '../../AnalyticsModule/Braze';
import { autoPresentQCAction } from '../../BasketModule/Redux/BasketAction';

const DEFAULT_HEIGHT = 100;
const MAXIMUM_HEIGHT = 200;
let screenName = SCREEN_OPTIONS.PROFILE.route_name;
class Profile extends Component {
    constructor() {
        super();
        this.advancedOptionsHeight = new Animated.Value(0);
        this.passTextInput = null;
        this.handleLeftActionPress = this.handleLeftActionPress.bind(this);
        this.handleSaveButton = this.handleSaveButton.bind(this);
        this.handleOnChangeText = this.handleOnChangeText.bind(this);
        this.onDownArrowPressed = this.onDownArrowPressed.bind(this);
        this.onUpArrowPressed = this.onUpArrowPressed.bind(this);
        this.handleDeleteAccountPositive = this.handleDeleteAccountPositive.bind(this);
        this.handleExportDataPositive = this.handleExportDataPositive.bind(this);
        this.handlePositiveButtonClicked = this.handlePositiveButtonClicked.bind(this);
        this.handleNegativeButtonClicked = this.handleNegativeButtonClicked.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.dismissPopUp = this.dismissPopUp.bind(this);
        this.handlePromotionOnPress = this.handlePromotionOnPress.bind(this);
        this.handleExportDataNegative = this.handleExportDataNegative.bind(this);
        this.handleDeleteAccountNegative = this.handleDeleteAccountNegative.bind(this);
        this.renderExportDataCustomView = this.renderExportDataCustomView.bind(this);
        this.state = {
            firstName: '',
            lastName: '',
            phone: '',
            emailId: '',
            deleteText: '',
            exportEmailId: '',
            showEmptyFirstNameError: false,
            inValidFirstName: false,
            showEmptyLastNameError: false,
            inValidLastName: false,
            showValidPhoneError: false,
            showValidEmailIdError: false,
            emailOptionToggle: false,
            SMSOptionToggle: false,
            notificationToggle: false,
            showExportModal: false,
            showDeleteAccountModal: false,
            showUpArrow: false,
            showUnsavedChangedPopUp: false,
            profileResponse: null,
            prefixMobile: '',
            doShowLoading: false,
            isUpdateProfile: false,
            checkMaximumLength: false
        };
    }

    componentDidMount() {
        const { profileResponse, navigation } = this.props;
        this.navigationOnFocusEventListener = navigation.addListener('focus', () => {
            this.onFocus();
        });
        this.navigationOnFocusEventListener = navigation.addListener('blur', () => {
            if (!isValidString(profileResponse.phone)) this.setState({ phone: '', prefixMobile: '' });
            Keyboard.dismiss();
        });
        this.props.resetProfileProgress();
        Analytics.logScreen(screenName);
    }

    onFocus() {
        const { route, profileResponse } = this.props;
        if (isValidElement(route.params)) {
            const { params } = route;
            if (isValidElement(params?.showUpdatePhoneNumber) && !isValidString(profileResponse?.phone)) {
                showErrorMessage(LOCALIZATION_STRINGS.UPDATE_PHONE_NUMBER_CONTENT);
            }
            if (isValidElement(params?.isUpdateProfile) && params.isUpdateProfile) {
                screenName = SCREEN_OPTIONS.UPDATE_PROFILE.route_name;
            }
        }
        if (isValidElement(profileResponse)) {
            const { first_name, last_name, phone, email } = profileResponse;
            this.setState({
                showEmptyFirstNameError: !(isValidString(first_name) && first_name.length > 0),
                inValidFirstName: !validName(first_name),
                showEmptyLastNameError: !(isValidString(last_name) && last_name.length > 0),
                inValidLastName: !validName(last_name),
                showValidPhoneError: !isValidString(phone),
                showValidEmailIdError: !(isValidString(email) && email.length > 0),
                isUpdateProfile: route?.params?.isUpdateProfile,
                isFromPayByLink: route?.params?.isFromPayByLink
            });
        }
        this.props.updateProfileAPIStatusAction(false);
        this.props.getProfileAction(false);
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { profileResponse, doShowProfileLoading, countryIso } = props;
        if (isValidElement(profileResponse) && state.profileResponse !== props.profileResponse) {
            const { first_name, last_name, phone, email } = profileResponse;
            value = {
                profileResponse,
                firstName: firstCharacterUpperCased(first_name),
                lastName: firstCharacterUpperCased(last_name),
                phone: isValidString(phone) ? separateCountryPrefix(phone, countryIso) : '',
                emailId: trimBlankSpacesInText(email),
                prefixMobile: isValidElement(phone) ? getCountryCode(countryIso) : ''
            };
            if (!state.isUpdateProfile) {
                value = {
                    ...value,
                    exportEmailId: email,
                    SMSOptionToggle: fetchSMSSubscriptionStatus(profileResponse),
                    emailOptionToggle: fetchEmailSubscriptionStatus(profileResponse),
                    notificationToggle: fetchNotificationSubscriptionStatus(profileResponse)
                };
            }
        } else if (state.doShowLoading !== doShowProfileLoading) {
            value.doShowLoading = doShowProfileLoading;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }
    render() {
        const { showUpArrow, isUpdateProfile } = this.state;
        return (
            <BaseComponent
                title={LOCALIZATION_STRINGS.PROFILE}
                showHeader={true}
                showElevation={true}
                showZendeskChat={false}
                navigation={this.props.navigation}
                actions={isFieldValuesChanged(this.props, this.state) && this.renderActionButton()}
                icon={isUpdateProfile ? FONT_ICON.BACK : FONT_ICON.HAMBURGER}
                handleLeftActionPress={this.handleLeftActionPress}>
                <View style={styles.container}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollViewStyle}
                        showsVerticalScrollIndicator={false}
                        ref={(ref) => (this.scrollView = ref)}
                        onContentSizeChange={() => {
                            if (isValidElement(this.scrollView) && showUpArrow) {
                                this.scrollView.scrollToEnd({ animated: true });
                            }
                        }}>
                        {this.renderFirstName()}
                        {this.renderLastName()}
                        {this.renderMobileNumber()}
                        {this.renderEmail()}
                        {!isUpdateProfile && this.renderPromotions()}
                        {this.renderDiscardChangesModal()}
                    </ScrollView>
                </View>
            </BaseComponent>
        );
    }

    handleLeftActionPress() {
        Keyboard.dismiss();
        Analytics.logBackPress(ANALYTICS_SCREENS.PROFILE);
        if (this.state.isFromPayByLink) {
            this.props.resetPBLAction();
        }
        if (isFieldValuesChanged(this.props, this.state)) this.setState({ showUnsavedChangedPopUp: true });
        else this.goBack();
    }

    renderActionButton() {
        let { doShowLoading } = this.state;
        if (doShowLoading) {
            return <ActivityIndicator color={Colors.secondary_color} size={'small'} />;
        } else {
            return (
                <T2STouchableOpacity style={styles.tickIconStyle} onPress={this.handleSaveButton}>
                    <CustomIcon
                        {...setTestId(screenName, VIEW_ID.TICK_ICON)}
                        name={FONT_ICON.TICK}
                        size={25}
                        disabled={!isFieldValuesChanged(this.props, this.state)}
                    />
                </T2STouchableOpacity>
            );
        }
    }

    handleSaveButton() {
        let { firstName, lastName, phone, emailId, isUpdateProfile, isFromPayByLink } = this.state;
        const { countryId, countryIso } = this.props;
        const newState = validateProfileStates(this.state, this.props);
        this.setState({ ...newState });
        if (validateProfileFields(newState, this.props)) {
            Keyboard.dismiss();
            Analytics.logAction(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.UPDATE_PROFILE);
            this.props.updateProfileAction(
                emailId,
                getPhoneFromCountryNumber(phone, countryId, countryIso),
                firstName.trim(),
                lastName.trim(),
                isUpdateProfile,
                isFromPayByLink
            );
        }
    }

    renderFirstName() {
        const { firstName, showEmptyFirstNameError, inValidFirstName } = this.state;
        return (
            <ProfileDetails
                value={firstName}
                showEmptyError={showEmptyFirstNameError}
                inValidError={inValidFirstName}
                handleOnChangeText={this.handleOnChangeText}
                viewId={VIEW_ID.FIRST_NAME_TEXT}
                labelId={LOCALIZATION_STRINGS.FIRST_NAME}
                errorText={LOCALIZATION_STRINGS.ERROR_MESSAGE_FIRST_NAME}
                invalidErrorText={LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_FIRST_NAME}
            />
        );
    }

    renderLastName() {
        const { lastName, showEmptyLastNameError, inValidLastName } = this.state;
        return (
            <ProfileDetails
                value={lastName}
                showEmptyError={showEmptyLastNameError}
                inValidError={inValidLastName}
                handleOnChangeText={this.handleOnChangeText}
                viewId={VIEW_ID.LAST_NAME_TEXT}
                labelId={LOCALIZATION_STRINGS.LAST_NAME}
                errorText={LOCALIZATION_STRINGS.ERROR_MESSAGE_LAST_NAME}
                invalidErrorText={LOCALIZATION_STRINGS.PLEASE_ENTER_VALID_LAST_NAME}
            />
        );
    }

    renderMobileNumber() {
        const { prefixMobile, phone, showValidPhoneError, checkMaximumLength } = this.state;
        const { route, countryIso, mobileLength, countryFlag } = this.props;
        const length = getPhoneMaxLength(mobileLength, countryFlag);
        return (
            <View style={styles.phoneNumberContainer} {...setTestId(screenName, VIEW_ID.PHONE_NUMBER_VIEW)} accessible={false}>
                <View
                    style={styles.prefixContainerForModal}
                    {...setTestId(screenName, VIEW_ID.PHONE_NUMBER_PREFIX_TEXT)}
                    accessible={false}>
                    <T2STextInput
                        screenName={screenName}
                        id={VIEW_ID.PHONE_NUMBER_PREFIX_TEXT}
                        style={styles.textInputStyle}
                        value={prefixMobile}
                        label={LOCALIZATION_STRINGS.APP_PHONE_NUMBER}
                        required
                        editable={false}
                        error={showValidPhoneError}
                        errorText={LOCALIZATION_STRINGS.INVALID_PHONE}
                    />
                </View>
                <View
                    style={[styles.textInputContainer, styles.phoneNumberFlexContainer]}
                    {...setTestId(screenName, VIEW_ID.PHONE_NUMBER_TEXT)}
                    accessible={false}>
                    <T2STextInput
                        value={phone}
                        screenName={screenName}
                        id={VIEW_ID.PHONE_NUMBER_TEXT}
                        onChangeText={this.handleOnChangeText.bind(this, VIEW_ID.PHONE_NUMBER_TEXT)}
                        onBlur={this.handleOnBlur.bind(this, phone, countryIso)}
                        onFocus={this.handleOnFocus.bind(this, phone, countryIso)}
                        keyboardType={'phone-pad'}
                        maxLength={checkMaximumLength && isValidNumber(length) ? safeIntValue(length) : LENGTH.DEFAULT_MAX_LENGTH}
                        error={showValidPhoneError}
                        dontShowUnderLine={true}
                        autoFocus={route?.params?.verified}
                    />
                </View>
            </View>
        );
    }

    handleOnBlur(phone, countryIso) {
        this.setState({
            phone: separateCountryPrefix(phone, countryIso),
            checkMaximumLength: false,
            showValidPhoneError: !isValidString(phone)
        });
    }

    handleOnFocus(phone, countryIso) {
        this.setState({
            phone: normalizePhoneNo(phone),
            prefixMobile: getCountryCode(countryIso),
            showValidPhoneError: false,
            checkMaximumLength: true
        });
    }

    renderEmail() {
        const { emailId, showValidEmailIdError, showValidPhoneError } = this.state;
        return (
            <View style={showValidPhoneError ? styles.emailMargintopActive : styles.emailMargintopDeactive}>
                <ProfileDetails
                    value={emailId}
                    showEmptyError={showValidEmailIdError}
                    handleOnChangeText={this.handleOnChangeText}
                    viewId={VIEW_ID.EMAIL_ID_TEXT}
                    labelId={LOCALIZATION_STRINGS.EMAIL}
                    errorText={LOCALIZATION_STRINGS.INVALID_EMAIL}
                />
            </View>
        );
    }

    handleOnChangeText(id, text) {
        if (id === VIEW_ID.FIRST_NAME_TEXT) {
            const first_name = formatName(text);
            this.setState({
                firstName: firstCharacterUpperCased(first_name),
                showEmptyFirstNameError: first_name.length > 0 && !isValidString(first_name),
                inValidFirstName: !validName(first_name)
            });
        } else if (id === VIEW_ID.LAST_NAME_TEXT) {
            const last_name = formatName(text);
            this.setState({
                lastName: firstCharacterUpperCased(last_name),
                showEmptyLastNameError: last_name.length > 0 && !isValidString(last_name),
                inValidLastName: !validName(last_name)
            });
        } else if (id === VIEW_ID.PHONE_NUMBER_TEXT) {
            const phone = removePhoneSpecialCharacters(text);
            const { countryId } = this.props;
            this.setState({
                phone: removePrefixFromNumber(phone, countryId),
                showValidPhoneError: !isValidString(phone)
            });
        } else if (id === VIEW_ID.EMAIL_ID_TEXT) {
            this.setState({
                emailId: trimBlankSpacesInText(text),
                exportEmailId: text,
                showValidEmailIdError: !isValidString(text)
            });
        } else if (id === VIEW_ID.EXPORT_DATA) {
            this.setState({ exportEmailId: text });
        } else if (id === VIEW_ID.DELETE_ACCOUNT_TEXT) {
            this.setState({ deleteText: isValidString(text) ? text.trim()?.toUpperCase() : '' });
        }
    }

    renderPromotions() {
        const { storeConfigName, featureGateResponse, storeConfigPaymentProvider } = this.props;
        const savedCardEnabled = showSavedCards(storeConfigPaymentProvider, featureGateResponse);
        const referralEnabled = getReferralCampaignStatus(featureGateResponse);
        return (
            <View style={styles.promotionsContainer}>
                {this.renderDeliveryAddress()}
                {savedCardEnabled && this.renderSavedCards()}
                {referralEnabled && this.renderReferral()}
                <T2SText id={VIEW_ID.PROMOTIONS_HEADER_TEXT} screenName={screenName} style={styles.promotionsHeader}>
                    {`${LOCALIZATION_STRINGS.PROMOTIONS_HEADER} ${getAppName(storeConfigName)} ${LOCALIZATION_STRINGS.THROUGH}`}
                </T2SText>
                {this.renderEmailPromotion()}
                {this.renderSMSPromotion()}
                {this.renderNotificationPromotion()}
                {this.renderExtraOptions()}
            </View>
        );
    }

    renderDeliveryAddress() {
        return (
            <ProfileTextRow
                viewId={VIEW_ID.DELIVERY_ADDRESS}
                title={LOCALIZATION_STRINGS.ADDRESS_BOOK}
                onRowClicked={this.handlePromotionOnPress}
            />
        );
    }

    renderSavedCards() {
        return (
            <ProfileTextRow
                viewId={VIEW_ID.SAVED_CARD_DETAILS}
                title={LOCALIZATION_STRINGS.SAVED_CARDS}
                onRowClicked={this.handlePromotionOnPress}
            />
        );
    }

    renderEmailPromotion() {
        const { emailOptionToggle } = this.state;
        return (
            <ProfileSwitchRow
                viewId={VIEW_ID.EMAIL_TEXT}
                title={LOCALIZATION_STRINGS.EMAIL}
                toggleId={VIEW_ID.EMAIL_TOGGLE + '_' + emailOptionToggle}
                toggleValue={emailOptionToggle}
                toggleChange={this.toggleChange.bind(this, VIEW_ID.EMAIL_TOGGLE)}
            />
        );
    }

    renderSMSPromotion() {
        const { SMSOptionToggle } = this.state;
        return (
            <ProfileSwitchRow
                viewId={VIEW_ID.SMS_TEXT}
                title={LOCALIZATION_STRINGS.SMS}
                toggleId={VIEW_ID.SMS_TOGGLE + '_' + SMSOptionToggle}
                toggleValue={SMSOptionToggle}
                toggleChange={this.toggleChange.bind(this, VIEW_ID.SMS_TOGGLE)}
            />
        );
    }

    renderNotificationPromotion() {
        const { notificationToggle } = this.state;
        return (
            <ProfileSwitchRow
                viewId={VIEW_ID.APP_NOTIFICATION_TEXT}
                title={LOCALIZATION_STRINGS.APP_NOTIFICATION}
                toggleId={VIEW_ID.NOTIFICATIONS_TOGGLE + '_' + notificationToggle}
                toggleValue={notificationToggle}
                toggleChange={this.toggleChange.bind(this, VIEW_ID.NOTIFICATIONS_TOGGLE)}
            />
        );
    }

    toggleChange(id) {
        let { emailOptionToggle, SMSOptionToggle, notificationToggle } = this.state;
        const { featureGateResponse, isProfileAPICompleted } = this.props;
        let eventObj = {
            email: emailOptionToggle,
            sms: SMSOptionToggle,
            pushNotification: notificationToggle
        };
        if (isProfileAPICompleted) {
            if (id === VIEW_ID.EMAIL_TOGGLE) {
                this.setState({ emailOptionToggle: !emailOptionToggle });
                this.updateConsent(emailOptionToggle ? OPT_OUT : OPT_IN, ProfileConstants.EMAIL);
                eventObj = {
                    email: !emailOptionToggle,
                    sms: SMSOptionToggle,
                    pushNotification: notificationToggle
                };
            } else if (id === VIEW_ID.SMS_TOGGLE) {
                this.setState({ SMSOptionToggle: !SMSOptionToggle });
                this.updateConsent(SMSOptionToggle ? OPT_OUT : OPT_IN, ProfileConstants.SMS);
                eventObj = {
                    email: emailOptionToggle,
                    sms: !SMSOptionToggle,
                    pushNotification: notificationToggle
                };
                logSMSOptSegment(featureGateResponse, !SMSOptionToggle);
            } else if (id === VIEW_ID.NOTIFICATIONS_TOGGLE) {
                this.setState(() => ({ notificationToggle: !notificationToggle }));
                this.updateConsent(notificationToggle ? OPT_OUT : OPT_IN, ProfileConstants.APP_NOTIFICATION);
                eventObj = {
                    email: emailOptionToggle,
                    sms: SMSOptionToggle,
                    pushNotification: !notificationToggle
                };
            }
            Analytics.logAction(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.UPDATE_CONSENT, eventObj);
            logAutoOptInOut(ANALYTICS_SCREENS.PROFILE, eventObj.sms, eventObj.email);
        }
    }

    updateConsent(action, type) {
        const { storeId, profileResponse, policyLookupResponse } = this.props;
        if (isValidElement(policyLookupResponse) && isValidElement(storeId) && isValidElement(profileResponse.id)) {
            if (type === ProfileConstants.EMAIL) {
                const policyId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.email);
                this.props.updateEmailConsentAction(profileResponse.id, storeId, policyId, action, ProfileConstants.EMAIL_POLICY_KEY);
            } else if (type === ProfileConstants.SMS) {
                const policyId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.sms);
                this.props.updateSMSConsentAction(profileResponse.id, storeId, policyId, action, ProfileConstants.SMS_POLICY_KEY);
            } else if (type === ProfileConstants.APP_NOTIFICATION) {
                const policyId = getPolicyId(policyLookupResponse, BASE_PRODUCT_CONFIG.policy_type_id.pushNotification);
                this.props.updateNotificationConsentAction(
                    profileResponse.id,
                    storeId,
                    policyId,
                    action,
                    ProfileConstants.NOTIFICATION_POLICY_KEY
                );
            }
        }
    }

    renderReferral() {
        const { profileResponse } = this.props;
        let viewID, title;
        if (isValidString(profileResponse?.referralLink)) {
            viewID = VIEW_ID.REFERRAL_LINK_VIEW;
            title = LOCALIZATION_STRINGS.REFER_FRIENDS_HEADER;
        } else {
            viewID = VIEW_ID.NO_REFERRAL_VIEW;
            title = LOCALIZATION_STRINGS.NO_REFERRAL_LINK_MSG;
        }
        return <ProfileTextRow viewId={viewID} title={title} onRowClicked={this.handlePromotionOnPress} />;
    }

    renderExtraOptions() {
        const heightAnimated = this.advancedOptionsHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_HEIGHT, MAXIMUM_HEIGHT]
        });
        const { showUpArrow, showExportModal, showDeleteAccountModal } = this.state;
        return (
            <T2STouchableWithoutFeedback
                accessible={false}
                onPress={showUpArrow ? this.onUpArrowPressed : this.onDownArrowPressed}
                id={VIEW_ID.ADVANCED_OPTIONS}
                screenName={screenName}>
                <Animated.View style={{ height: heightAnimated }}>
                    <Animated.View style={styles.rowStyle}>
                        <T2SText id={VIEW_ID.ADVANCE_OPTIONS_TEXT} screenName={screenName} style={styles.advancedOptions}>
                            {LOCALIZATION_STRINGS.ADVANCE_OPTIONS}
                        </T2SText>
                        <CustomIcon
                            {...setTestId(screenName, VIEW_ID.DOWN_ARROW_ICON)}
                            name={showUpArrow ? FONT_ICON.UP_ARROW : FONT_ICON.DOWN_ARROW}
                            size={20}
                        />
                    </Animated.View>
                    {showUpArrow && this.renderExportData()}
                    {showUpArrow && this.renderDeleteAccount()}
                    {showExportModal && this.renderExportDataModal()}
                    {showDeleteAccountModal && this.renderDeleteAccountModal()}
                </Animated.View>
            </T2STouchableWithoutFeedback>
        );
    }

    onDownArrowPressed() {
        this.setState({ showUpArrow: true });
        Animated.timing(this.advancedOptionsHeight, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear
        }).start();
    }

    onUpArrowPressed() {
        this.setState({ showUpArrow: false });
        Animated.timing(this.advancedOptionsHeight, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear
        }).start();
    }

    renderExportData() {
        return (
            <ProfileTextRow
                viewId={VIEW_ID.EXPORT_DATA}
                title={LOCALIZATION_STRINGS.EXPORT_MY_DATA}
                onRowClicked={this.handlePromotionOnPress}
            />
        );
    }

    renderDeleteAccount() {
        return (
            <ProfileTextRow
                viewId={VIEW_ID.DELETE_ACCOUNT}
                title={LOCALIZATION_STRINGS.DELETE_ACCOUNT}
                onRowClicked={this.handlePromotionOnPress}
            />
        );
    }

    handlePromotionOnPress(id) {
        if (id === VIEW_ID.DELIVERY_ADDRESS) {
            Analytics.logEvent(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.ADDRESS_BOOK);
            setTimeout(() => {
                handleNavigation(SCREEN_OPTIONS.DELIVERY_ADDRESS.route_name);
            }, 10);
        } else if (id === VIEW_ID.SAVED_CARD_DETAILS) {
            Analytics.logEvent(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.SAVED_CARD_DETAILS);
            setTimeout(() => {
                handleNavigation(SCREEN_OPTIONS.SAVED_CARD_DETAILS.route_name);
            }, 10);
        } else if (id === VIEW_ID.EXPORT_DATA) {
            this.setState({ showExportModal: true });
        } else if (id === VIEW_ID.DELETE_ACCOUNT) {
            this.setState({ showDeleteAccountModal: true });
        } else if (id === VIEW_ID.REFERRAL_LINK_VIEW) {
            handleNavigation(SCREEN_OPTIONS.REFERRAL_SCREEN.route_name, { showBackButton: true });
        } else if (id === VIEW_ID.NO_REFERRAL_VIEW) {
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
        }
    }

    renderExportDataModal() {
        const { consentId } = this.props;
        let { showExportModal } = this.state;
        if (isValidElement(consentId)) {
            return (
                <T2SModal
                    screenName={screenName}
                    dialogCancelable={true}
                    title={LOCALIZATION_STRINGS.EXPORT_MY_DATA}
                    isVisible={showExportModal}
                    negativeButtonStyle={styles.negativeButtonStyle}
                    positiveButtonStyle={styles.positiveButtonStyle}
                    positiveButtonText={LOCALIZATION_STRINGS.EXPORT_MY_DATA_EXPORT.toUpperCase()}
                    negativeButtonText={LOCALIZATION_STRINGS.CANCEL.toUpperCase()}
                    titleTextStyle={styles.titleTextStyle}
                    requestClose={this.handleExportDataNegative}
                    positiveButtonClicked={this.handleExportDataPositive}
                    customView={this.renderExportDataCustomView()}
                    negativeButtonClicked={this.handleExportDataNegative}
                />
            );
        }
    }

    handleExportDataPositive() {
        let { exportEmailId } = this.state;
        const { consentId } = this.props;
        if (!isValidString(exportEmailId) || !checkIsValidEmail(exportEmailId)) {
            showErrorMessage(LOCALIZATION_STRINGS.INVALID_EMAIL);
        } else {
            this.handleExportDataNegative();
            Analytics.logAction(ANALYTICS_SCREENS.PROFILE, ANALYTICS_EVENTS.EXPORT_DATA);
            this.props.exportDataAction(exportEmailId, consentId, ProfileConstants.DEVICE_INFO, ProfileConstants.EXPORT);
        }
    }

    handleExportDataNegative() {
        this.setState({ showExportModal: false });
    }

    renderExportDataCustomView() {
        let { exportEmailId } = this.state;
        return (
            <ProfileDetails
                isFromModal={true}
                value={exportEmailId}
                handleOnChangeText={this.handleOnChangeText}
                viewId={VIEW_ID.EXPORT_MAIL_TEXT}
                labelId={LOCALIZATION_STRINGS.EMAIL_ID}
            />
        );
    }

    renderDeleteAccountModal() {
        const { consentId } = this.props;
        let { showDeleteAccountModal } = this.state;
        if (isValidElement(consentId)) {
            return (
                <ScrollView keyboardShouldPersistTaps="handled">
                    <T2SModal
                        id={VIEW_ID.DELETE_ACCOUNT_MODAL}
                        screenName={screenName}
                        dialogCancelable={true}
                        title={this.renderDeleteAccountTitle()}
                        isTitleVisible={true}
                        isVisible={showDeleteAccountModal}
                        titleCenter={true}
                        positiveButtonStyle={styles.deleteButtonStyle}
                        negativeButtonStyle={styles.negativeButtonStyle}
                        positiveButtonText={LOCALIZATION_STRINGS.APP_DELETE}
                        negativeButtonText={LOCALIZATION_STRINGS.CANCEL.toUpperCase()}
                        requestClose={this.handleDeleteAccountNegative}
                        positiveButtonClicked={this.handleDeleteAccountPositive}
                        customView={this.renderDeleteAccountCustomView()}
                        negativeButtonClicked={this.handleDeleteAccountNegative}
                        onModalHide={this.handleDeleteAccountNegative}
                    />
                </ScrollView>
            );
        }
    }

    renderDeleteAccountTitle() {
        return (
            <T2SText id={VIEW_ID.DELETE_ACCOUNT} screenName={screenName} style={styles.titleTextStyle}>
                {LOCALIZATION_STRINGS.ENTER}{' '}
                <T2SText id={VIEW_ID.DELETE_ACCOUNT} screenName={screenName} style={styles.deleteTextStyle}>
                    {LOCALIZATION_STRINGS.APP_DELETE.toUpperCase()}
                </T2SText>{' '}
                {LOCALIZATION_STRINGS.DELETE_ACCOUNT_MODAL_TITLE}
            </T2SText>
        );
    }

    renderDeleteAccountCustomView() {
        const windowHeight = Dimensions.get('window').height;
        const { deleteText } = this.state;
        return (
            <View style={styles.textInputViewStyle}>
                <T2STextInput
                    screenName={screenName}
                    id={VIEW_ID.DELETE_ACCOUNT_TEXT}
                    style={styles.deleteTextInputStyle}
                    onChangeText={this.handleOnChangeText.bind(this, VIEW_ID.DELETE_ACCOUNT_TEXT)}
                    autoFocus={true}
                    placeholder={LOCALIZATION_STRINGS.APP_DELETE.toUpperCase()}
                    placeholderTextColor={Colors.lightAsh}
                    autoCapitalize={'characters'}
                    keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
                    value={deleteText}
                />
                <View style={{ top: windowHeight / 2.5 }}>
                    <FlashMessage position="bottom" floating={true} ref={(ref) => (this.flashMessageRef = ref)} />
                </View>
            </View>
        );
    }

    handleDeleteAccountPositive() {
        Keyboard.dismiss();
        const { consentId, featureGateResponse, profileResponse, countryIso } = this.props;
        let { deleteText, emailId } = this.state;
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.DELETE_ACCOUNT, {
            ...convertProfileResponseToAnalytics(profileResponse, countryIso)
        });
        if (isValidString(deleteText) && deleteText.trim()?.toUpperCase() === LOCALIZATION_STRINGS.APP_DELETE.toUpperCase()) {
            this.setState({ showDeleteAccountModal: false, deleteText: '' });
            this.props.deleteAccountAction(emailId, consentId, ProfileConstants.DEVICE_INFO, ProfileConstants.DELETE);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.DELETE_ACCOUNT_ERROR, this.flashMessageRef);
        }
    }

    handleDeleteAccountNegative() {
        this.setState({ showDeleteAccountModal: false, deleteText: '' });
    }

    renderDiscardChangesModal() {
        const { showUnsavedChangedPopUp } = this.state;
        return (
            <DiscardChangesModal
                isVisible={showUnsavedChangedPopUp}
                screenName={screenName}
                analyticsScreenName={ANALYTICS_SCREENS.PROFILE}
                handlePositiveButtonClicked={this.handlePositiveButtonClicked}
                handleNegativeButtonClicked={this.handleNegativeButtonClicked}
                requestClose={this.dismissPopUp}
            />
        );
    }

    handlePositiveButtonClicked() {
        this.dismissPopUp();
        this.handleSaveButton();
    }
    handleNegativeButtonClicked() {
        this.setState(getActualValues(this.props));
        this.goBack();
    }

    dismissPopUp() {
        this.setState({ showUnsavedChangedPopUp: false });
    }

    goBack() {
        if (!this.state.isUpdateProfile) {
            this.props.navigation.toggleDrawer();
        } else {
            const { route, navigation } = this.props;
            if (isValidElement(route?.params?.isFromReOrder) && route.params.isFromReOrder) {
                navigation.popToTop();
            } else {
                navigation.goBack();
            }
            showErrorMessage(LOCALIZATION_STRINGS.PHONE_NUMBER_UPDATE);
            this.props.autoPresentQCAction(false);
        }
    }
}

const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    policyLookupResponse: state.appState.policyLookupResponse,
    consentId: state.authState.consentId,
    storeId: selectStoreId(state),
    featureGateResponse: state.appState.countryBaseFeatureGateResponse,
    isProfileAPICompleted: state.profileState.isProfileAPICompleted,
    doShowProfileLoading: state.authState.showProfileLoading,
    storeConfigPaymentProvider: state.appState.storeConfigResponse?.payment_provider,
    storeConfigName: state.appState.storeConfigResponse?.name,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    mobileLength: state.appState.s3ConfigResponse?.mobile?.max_length,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag
});

const mapDispatchToProps = {
    updateProfileAction,
    deleteAccountAction,
    exportDataAction,
    getProfileAction,
    updateEmailConsentAction,
    updateSMSConsentAction,
    updateProfileAPIStatusAction,
    resetProfileProgress,
    updateNotificationConsentAction,
    autoPresentQCAction,
    resetPBLAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
