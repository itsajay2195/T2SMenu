import React, { Component } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {
    calculateDate,
    checkIsValidEmail,
    firstCharacterUpperCased,
    formatPhoneNo,
    getCountryCode,
    getDateStr,
    getPhoneNoTableBooking,
    getTableReservationDate,
    isArrayNonEmpty,
    isValidElement,
    isValidNumber,
    isValidString,
    normalizePhoneNo,
    removePrefixFromNumber,
    safeIntValue,
    separateCountryPrefix,
    trimBlankSpacesInText
} from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import BaseComponent from '../../BaseModule/BaseComponent';
import { connect } from 'react-redux';
import { getTableReservationSlotsAction, postTableReservationAction, resetTableBookedAction } from '../Redux/TableReservationAction';
import TableReservationStyles from './Styles/TableReservationStyles';
import { TimeSlotListPopup } from './TimeSlotListPopup';
import { formatSelectedDate, formatSelectedTime, hasChanges, isNoOfPeopleExceeded } from '../Utils/TableReservationHelpers';
import { SCREEN_NAME, VIEW_ID } from '../Utils/TableReservationConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { selectHasUserLoggedIn, selectTimeZone } from 't2sbasemodule/Utils/AppSelectors';
import Colors from 't2sbasemodule/Themes/Colors';
import { removePhoneSpecialCharacters, validNumberFixRegex } from 't2sbasemodule/Utils/ValidationUtil';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import DiscardChangesModal from '../../DiscardChangesModal/View/DiscardChangesModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import moment from 'moment-timezone';
import _ from 'lodash';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { getPhoneMaxLength } from '../../BaseModule/GlobalAppHelper';
import { formatName } from '../../AuthModule/Utils/AuthHelpers';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';

let screenName = SCREEN_NAME.TABLE_RESERVATION;
const MAXIMUM_DAYS = 90;
let maxLinesForComments = 3;

class TableReservationScreen extends Component {
    constructor(props) {
        super(props);
        this.mobileNoText = null;
        this.handleConfirmAction = this.handleConfirmAction.bind(this);
        this.handleLeftActionPress = this.handleLeftActionPress.bind(this);
        this.handlePositiveButtonClicked = this.handlePositiveButtonClicked.bind(this);
        this.handleNegativeButtonClicked = this.handleNegativeButtonClicked.bind(this);
        this.dismissPopUp = this.dismissPopUp.bind(this);
        this.handleOnTimePressed = this.handleOnTimePressed.bind(this);
        this.hideDatePicker = this.hideDatePicker.bind(this);
        this.closeTimePicker = this.closeTimePicker.bind(this);
        this.showDatePicker = this.showDatePicker.bind(this);
        this.onDateConfirmPressed = this.onDateConfirmPressed.bind(this);
        this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
        this.state = {
            timeSlots: [],
            firstName: '',
            lastName: '',
            emailId: '',
            mobileNo: '',
            noOfPersons: '',
            comments: '',
            selectedTime: null,
            formattedSelectedTime: null,
            formattedSelectedDate: null,
            isCalendarVisible: false,
            isTimeModalVisible: false,
            date: getTableReservationDate(),
            endDate: calculateDate(getTableReservationDate(), DATE_FORMAT.DD_MMM_YYYY, MAXIMUM_DAYS),
            firstNameError: false,
            lastNameError: false,
            emailIdError: false,
            mobileNoError: false,
            selectTimeError: false,
            selectDateError: false,
            noOfPeopleError: false,
            tableReserved: false,
            showUnsavedChangedPopUp: false,
            commentsInputHeight: 40,
            errorMsg: '',
            prefixMobile: '',
            checkForMaxLength: false
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.TABLE_RESERVATION);
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.fetchData();
            this.props.getTableReservationSlotsAction(getDateStr(getTableReservationDate(this.props.timeZone), DATE_FORMAT.YYYY_MM_DD));
        });
        this.setState({ commentsInputHeight: 40 });
    }

    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }

    fetchData() {
        let { profileResponse, timeZone, countryIso } = this.props;
        if (isValidElement(profileResponse)) {
            let { first_name, last_name, email, phone } = profileResponse;
            this.setState({
                date: getTableReservationDate(timeZone),
                firstName: first_name,
                lastName: last_name,
                emailId: trimBlankSpacesInText(email),
                mobileNo: isValidString(phone) ? separateCountryPrefix(phone, countryIso) : ''
            });
        } else {
            this.setState({
                date: getTableReservationDate(timeZone),
                firstName: '',
                lastName: '',
                emailId: '',
                mobileNo: ''
            });
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { timeSlots, errorMsg, countryId, countryIso, isUserLoggedIn, profileResponse, timeZone, tableReserved } = props;
        let value = {};
        if (timeSlots !== state.timeSlots) {
            value.timeSlots = isValidElement(timeSlots) ? timeSlots : [];
            value.selectedTime = isArrayNonEmpty(timeSlots) ? timeSlots[0] : null;
            if (isValidElement(value.selectedTime)) {
                value.formattedSelectedTime = formatSelectedTime(value.selectedTime);
                const reservationDate = formatSelectedDate(getDateStr(state.date, DATE_FORMAT.YYYY_MM_DD), value.selectedTime);
                value.formattedSelectedDate = getDateStr(reservationDate, DATE_FORMAT.YYYY_MM_DD);
            }
        }
        if (errorMsg !== state.errorMsg) {
            value.selectDateError = isValidString(errorMsg);
            value.errorMsg = errorMsg;
        }
        if (!isValidString(state.prefixMobile) && isValidElement(countryIso)) {
            value.prefixMobile = getCountryCode(countryIso);
        }
        if (tableReserved !== state.tableReserved) {
            props.resetTableBookedAction();
            if (!isUserLoggedIn || !isValidElement(profileResponse)) {
                value.firstName = '';
                value.lastName = '';
                value.emailId = '';
                value.mobileNo = '';
            }
            if (isValidElement(profileResponse)) {
                const { first_name, last_name, email, phone } = profileResponse;
                let phoneNumber = removePrefixFromNumber(phone, countryId);
                value.firstName = isValidString(first_name) ? first_name : '';
                value.lastName = isValidString(last_name) ? last_name : '';
                value.emailId = isValidString(email) ? email : '';
                value.mobileNo = isValidString(phone) ? phoneNumber : '';
            }
            value.tableReserved = tableReserved;
            value.noOfPersons = '';
            value.selectedTime = null;
            value.comments = '';
            value.date = getTableReservationDate(timeZone);
            props.getTableReservationSlotsAction(getDateStr(getTableReservationDate(timeZone), DATE_FORMAT.YYYY_MM_DD));
        }
        return _.isEmpty(value) ? null : value;
    }

    render() {
        return (
            <BaseComponent
                showHeader={true}
                showZendeskChat={false}
                title={LOCALIZATION_STRINGS.TABLE_BOOKING}
                actions={
                    hasChanges(this.state, this.props) && (
                        <T2STouchableOpacity
                            style={TableReservationStyles.tickButtonStyle}
                            screenName={SCREEN_NAME.TABLE_RESERVATION}
                            id={VIEW_ID.CONFIRM_TICK_ICON_CLICKED}
                            onPress={this.handleConfirmAction}>
                            <T2SIcon name={FONT_ICON.TICK} size={25} color={Colors.black} />
                        </T2STouchableOpacity>
                    )
                }
                handleLeftActionPress={this.handleLeftActionPress}>
                <KeyboardAwareScrollView
                    enabled
                    behavior="padding"
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    extraHeight={20}>
                    <View style={TableReservationStyles.container}>
                        <View style={TableReservationStyles.textInputContainerIconStyle}>
                            <T2SIcon
                                name={FONT_ICON.CALENDAR}
                                size={30}
                                style={[
                                    TableReservationStyles.calendarIconStyle,
                                    { paddingBottom: Platform.OS === 'android' && this.state.selectDateError ? 15 : 0 }
                                ]}
                            />
                            <T2STouchableOpacity screenName={screenName} id={VIEW_ID.DATE_CONTAINER} onPress={this.showDatePicker}>
                                <T2STextInput
                                    screenName={screenName}
                                    id={VIEW_ID.SELECT_DATE}
                                    label={LOCALIZATION_STRINGS.SELECT_DATE}
                                    required={true}
                                    pointerEvents="none"
                                    editable={false}
                                    value={this.state.date}
                                    error={this.state.selectDateError}
                                    errorText={
                                        isValidString(this.state.errorMsg) ? this.state.errorMsg : LOCALIZATION_STRINGS.SELECT_DATE_ERROR
                                    }
                                />
                            </T2STouchableOpacity>
                            {/* {this.renderTextInput(VIEW_ID.SELECT_DATE)} */}
                        </View>
                        {this.state.isCalendarVisible && this.renderDatePicker()}
                        {this.renderTextInput(
                            VIEW_ID.FIRST_NAME,
                            LOCALIZATION_STRINGS.FIRST_NAME,
                            this.state.firstName,
                            this.state.firstNameError,
                            Platform.OS === 'android' ? 'visible-password' : 'default',
                            'words'
                        )}
                        {this.renderTextInput(
                            VIEW_ID.LAST_NAME,
                            LOCALIZATION_STRINGS.LAST_NAME,
                            this.state.lastName,
                            this.state.lastNameError,
                            Platform.OS === 'android' ? 'visible-password' : 'default',
                            'words'
                        )}
                        {this.renderTextInput(
                            VIEW_ID.EMAIL_ID,
                            LOCALIZATION_STRINGS.EMAIL_ID,
                            this.state.emailId,
                            this.state.emailIdError,
                            'email-address'
                        )}
                        {this.renderMobileNumber(VIEW_ID.MOBILE_NO)}
                        <View style={TableReservationStyles.textInputContainerIconStyle}>
                            <CustomIcon name={FONT_ICON.DOWN_ARROW} size={25} style={TableReservationStyles.downArrowIconStyle} />
                            <T2STouchableOpacity onPress={this.handleOnTimePressed} screenName={screenName} id={VIEW_ID.TIME_CONTAINER}>
                                <T2STextInput
                                    screenName={screenName}
                                    id={VIEW_ID.SELECT_TIME}
                                    label={LOCALIZATION_STRINGS.SELECT_TIME}
                                    required={true}
                                    pointerEvents="none"
                                    editable={false}
                                    value={this.state.selectedTime}
                                    error={this.state.selectTimeError}
                                    errorText={
                                        this.state.timeSlots.length === 0
                                            ? LOCALIZATION_STRINGS.RESERVATION_NOT_AVAILABLE_ERROR
                                            : LOCALIZATION_STRINGS.SELECT_TIME_ERROR
                                    }
                                />
                            </T2STouchableOpacity>
                        </View>

                        {this.renderTimeSlots()}
                        {this.renderTextInput(
                            VIEW_ID.NO_OF_PEOPLE,
                            LOCALIZATION_STRINGS.NO_OF_PEOPLE,
                            this.state.noOfPersons,
                            this.state.noOfPeopleError,
                            'numeric',
                            'none',
                            true,
                            2
                        )}
                        {this.renderTextInput(
                            VIEW_ID.COMMENTS,
                            LOCALIZATION_STRINGS.COMMENTS,
                            this.state.comments,
                            false,
                            Platform.OS === 'android' ? 'visible-password' : 'default',
                            'words',
                            false,
                            160,
                            true
                        )}
                        {this.renderDiscardChangesModal()}
                    </View>
                </KeyboardAwareScrollView>
            </BaseComponent>
        );
    }

    handleOnTouchStart() {
        if (isValidElement(this.mobileNoText)) {
            this.mobileNoText.focus();
        }
    }

    handleinputRef(id, input) {
        if (id === VIEW_ID.MOBILE_NO) {
            this.mobileNoText = input;
        }
    }

    handleOnContentSizeChange(id, event) {
        if (id === VIEW_ID.COMMENTS) {
            this.setState({ commentsInputHeight: event.nativeEvent.contentSize.height });
        }
    }

    renderMobileNumber(id) {
        return (
            <T2SView style={TableReservationStyles.phoneNumberContainer}>
                <T2SView style={TableReservationStyles.prefixContainer}>
                    <T2STouchableOpacity onPress={() => this.mobileNoText.focus()}>
                        <T2STextInput
                            screenName={screenName}
                            id={VIEW_ID.MOBILE_NO}
                            value={this.state.prefixMobile}
                            label={LOCALIZATION_STRINGS.MOBILE_NO}
                            required
                            editable={false}
                            error={this.state.mobileNoError}
                            errorText={this.getTextInputErrorText.bind(this, id)}
                            onTouchStart={this.handleOnTouchStart}
                        />
                    </T2STouchableOpacity>
                </T2SView>
                {this.renderTextInput(
                    VIEW_ID.MOBILE_NO,
                    LOCALIZATION_STRINGS.MOBILE_NO,
                    this.state.mobileNo,
                    this.state.mobileNoError,
                    'phone-pad',
                    false,
                    true,
                    getPhoneMaxLength(this.props.mobileLength, this.props.countryFlag),
                    false,
                    () => {
                        this.setState({
                            mobileNo: normalizePhoneNo(this.state.mobileNo),
                            prefixMobile: getCountryCode(this.props.countryIso),
                            checkForMaxLength: true
                        });
                    },
                    () => {
                        this.setState({
                            mobileNo: formatPhoneNo(this.state.mobileNo, this.props.countryIso, this.state.prefixMobile),
                            checkForMaxLength: false
                        });
                    }
                )}
            </T2SView>
        );
    }

    //TODO Based on the textInput ref we should focus the next textInput field by using keyboard (return/next) button
    renderTextInput(
        id,
        label,
        value,
        error = false,
        keyboardType = 'default',
        autoCapitalize = 'none',
        isRequired = this,
        maxlength = 160,
        autoCorrect = false,
        onFocus = null,
        onBlur = null
    ) {
        return (
            <View style={id === VIEW_ID.MOBILE_NO ? TableReservationStyles.phoneNumberFlexContainer : TableReservationStyles.textInputView}>
                <T2STextInput
                    screenName={screenName}
                    id={id}
                    label={id !== VIEW_ID.MOBILE_NO && label}
                    editable={!this.state.selectDateError}
                    value={value}
                    inputRef={this.handleinputRef.bind(this, id)}
                    maxLength={!this.state.checkForMaxLength && id === VIEW_ID.MOBILE_NO ? 100 : safeIntValue(maxlength)}
                    onChangeText={this.handleOnChangeText.bind(this, id)}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    error={error}
                    errorText={id !== VIEW_ID.MOBILE_NO && this.getTextInputErrorText(id)}
                    required={id !== VIEW_ID.COMMENTS && id !== VIEW_ID.MOBILE_NO}
                    multiline={id === VIEW_ID.COMMENTS}
                    scrollEnabled={id !== VIEW_ID.COMMENTS}
                    minHeight={
                        Platform.OS === 'ios' && id === VIEW_ID.COMMENTS && maxLinesForComments
                            ? 20 * maxLinesForComments
                            : Platform.OS === 'android' && id === VIEW_ID.COMMENTS
                            ? this.state.commentsInputHeight
                            : null
                    }
                    onContentSizeChange={this.handleOnContentSizeChange.bind(this, id)}
                    blurOnSubmit={true}
                    returnKeyType={'default'}
                    autoCorrect={autoCorrect}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            </View>
        );
    }

    renderDatePicker() {
        let currentDate = getTableReservationDate(this.props.timeZone);
        return (
            <DateTimePicker
                maximumDate={this.state.endDate}
                mode={'date'}
                date={isValidString(this.state.date) ? moment(this.state.date).toDate() : moment(currentDate).toDate()}
                isVisible={this.state.isCalendarVisible}
                onCancel={this.hideDatePicker}
                onConfirm={(date) => {
                    this.hideDatePicker();
                    this.onDateConfirmPressed(date);
                }}
                minimumDate={moment(currentDate).toDate()}
            />
        );
    }

    renderTimeSlots() {
        return (
            <TimeSlotListPopup
                title={LOCALIZATION_STRINGS.SELECT_TIME}
                inputData={this.state.timeSlots}
                visible={this.state.isTimeModalVisible}
                onRequestClose={this.closeTimePicker}
                onModelRowItemClicked={this.onModelRowItemClicked.bind(this)}
            />
        );
    }

    closeTimePicker() {
        this.setState({ isTimeModalVisible: false });
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.HIDE_TIME_PICKER);
    }

    getTextInputErrorText(id) {
        const { no_of_people } = this.props;
        const { firstName, lastName } = this.state;
        if (id === VIEW_ID.SELECT_DATE) return LOCALIZATION_STRINGS.SELECT_DATE_ERROR;
        if (id === VIEW_ID.FIRST_NAME)
            return !isValidString(firstName) ? LOCALIZATION_STRINGS.ENTER_FIRST_NAME : LOCALIZATION_STRINGS.VAILD_FIRST_NAME_LASTNAME;
        if (id === VIEW_ID.LAST_NAME)
            return !isValidString(lastName) ? LOCALIZATION_STRINGS.ENTER_LAST_NAME : LOCALIZATION_STRINGS.VAILD_FIRST_NAME_LASTNAME;
        if (id === VIEW_ID.EMAIL_ID) return LOCALIZATION_STRINGS.ENTER_EMAIL;
        if (id === VIEW_ID.MOBILE_NO) return LOCALIZATION_STRINGS.ENTER_MOBILE_NO;
        if (id === VIEW_ID.SELECT_TIME) return LOCALIZATION_STRINGS.SELECT_TIME_ERROR;
        if (id === VIEW_ID.NO_OF_PEOPLE)
            return !isNoOfPeopleExceeded(this.state.noOfPersons, no_of_people)
                ? LOCALIZATION_STRINGS.ENTER_NO_OF_PEOPLE
                : `${LOCALIZATION_STRINGS.NO_OF_PEOPLE_MORE_THAN} ${no_of_people}`;
    }

    resetErrorValues() {
        this.setState({
            firstNameError: false,
            lastNameError: false,
            emailIdError: false,
            mobileNoError: false,
            selectTimeError: false,
            selectDateError: false,
            noOfPeopleError: false,
            commentsInputHeight: 40
        });
    }

    renderDiscardChangesModal() {
        if (!this.state.showUnsavedChangedPopUp) return;
        return (
            <DiscardChangesModal
                isVisible={this.state.showUnsavedChangedPopUp}
                screenName={screenName}
                analyticsScreenName={ANALYTICS_SCREENS.TABLE_RESERVATION}
                handlePositiveButtonClicked={this.handlePositiveButtonClicked}
                handleNegativeButtonClicked={this.handleNegativeButtonClicked}
                requestClose={this.dismissPopUp}
            />
        );
    }

    handleLeftActionPress() {
        if (hasChanges(this.state, this.props)) {
            this.setState({
                showUnsavedChangedPopUp: true
            });
            return;
        }
        this.props.navigation.toggleDrawer();
        Analytics.logBackPress(ANALYTICS_SCREENS.TABLE_RESERVATION);
    }
    handlePositiveButtonClicked() {
        this.setState({
            showUnsavedChangedPopUp: false
        });
        this.handleConfirmAction();
    }
    handleNegativeButtonClicked() {
        this.setState({
            showUnsavedChangedPopUp: false
        });
        let { profileResponse } = this.props;
        let isUserLogin = isValidElement(profileResponse);
        this.setState({
            date: getTableReservationDate(this.props.timeZone),
            firstName: isUserLogin ? profileResponse.first_name : '',
            lastName: isUserLogin ? profileResponse.last_name : '',
            emailId: isUserLogin ? trimBlankSpacesInText(profileResponse.email) : '',
            mobileNo: isUserLogin ? profileResponse.phone : '',
            selectedTime: null,
            noOfPersons: '',
            comments: ''
        });
        this.props.navigation.toggleDrawer();
        this.resetErrorValues();
    }
    dismissPopUp() {
        this.setState({
            showUnsavedChangedPopUp: false
        });
    }

    handleOnChangeText(id, text) {
        if (id === VIEW_ID.FIRST_NAME) {
            let first_name = formatName(text);
            this.setState({
                firstName: firstCharacterUpperCased(first_name),
                firstNameError: !isValidString(first_name) || first_name.length < 2
            });
        }
        if (id === VIEW_ID.LAST_NAME) {
            let last_name = formatName(text);
            this.setState({
                lastName: firstCharacterUpperCased(last_name),
                lastNameError: !isValidString(last_name) || last_name.length < 2
            });
        }
        if (id === VIEW_ID.EMAIL_ID)
            this.setState({
                emailId: trimBlankSpacesInText(text),
                emailIdError: !isValidString(text)
            });
        if (id === VIEW_ID.MOBILE_NO) {
            let mobile_no = removePhoneSpecialCharacters(text);
            this.setState({
                mobileNo: removePrefixFromNumber(mobile_no, this.props.countryId),
                mobileNoError: !isValidNumber(mobile_no)
            });
        }
        if (id === VIEW_ID.NO_OF_PEOPLE)
            this.setState({
                noOfPersons: validNumberFixRegex(text),
                noOfPeopleError: isNoOfPeopleExceeded(text, this.props.no_of_people)
            });
        if (id === VIEW_ID.COMMENTS) {
            this.setState({ comments: firstCharacterUpperCased(text) });
        }
    }

    showDatePicker() {
        Keyboard.dismiss();
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.SHOW_DATE_PICKER);
        this.setState({ isCalendarVisible: true });
    }

    hideDatePicker() {
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.HIDE_DATE_PICKER);
        this.setState({ isCalendarVisible: false });
    }

    onDateConfirmPressed(date) {
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.DATE_SELECTED);
        this.setState({
            selectedTime: null,
            formattedSelectedTime: null,
            date: getDateStr(date, DATE_FORMAT.DD_MMM_YYYY)
        });
        this.props.getTableReservationSlotsAction(getDateStr(date, DATE_FORMAT.YYYY_MM_DD));
    }

    handleOnTimePressed() {
        Keyboard.dismiss();
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.SHOW_TIME_PICKER);
        if (this.state.timeSlots.length > 0) {
            this.setState({ isTimeModalVisible: true });
        } else if (!this.state.selectDateError) {
            showErrorMessage(LOCALIZATION_STRINGS.NO_TIME_SLOT_ERROR);
        }
    }

    onModelRowItemClicked(data) {
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.TIME_SELECTED);
        const formattedSelectedTime = formatSelectedTime(data);
        const reservationDate = formatSelectedDate(getDateStr(this.state.date, DATE_FORMAT.YYYY_MM_DD), data);
        const formattedSelectedDate = getDateStr(reservationDate, DATE_FORMAT.YYYY_MM_DD);

        this.setState({
            isTimeModalVisible: false,
            selectedTime: data,
            selectTimeError: false,
            formattedSelectedTime: formattedSelectedTime,
            formattedSelectedDate: formattedSelectedDate
        });
    }

    handleConfirmAction() {
        Analytics.logAction(ANALYTICS_SCREENS.TABLE_RESERVATION, ANALYTICS_EVENTS.ICON_SUBMIT);
        let { date, firstName, lastName, emailId, mobileNo, selectedTime, noOfPersons, comments, formattedSelectedDate } = this.state;

        if (
            isValidString(date) &&
            isValidString(firstName) &&
            firstName.length >= 2 &&
            isValidString(lastName) &&
            lastName.length >= 2 &&
            isValidString(emailId) &&
            checkIsValidEmail(emailId) &&
            isValidString(mobileNo) &&
            isValidString(selectedTime) &&
            isValidString(noOfPersons) &&
            !isNoOfPeopleExceeded(noOfPersons, this.props.no_of_people)
        ) {
            this.props.postTableReservationAction(
                firstName,
                lastName,
                formattedSelectedDate,
                selectedTime,
                getPhoneNoTableBooking(mobileNo, this.props.countryId, this.props.countryIso),
                emailId,
                comments,
                noOfPersons
            );
        } else {
            this.setState({
                selectDateError: !isValidString(date),
                firstNameError: !isValidString(firstName) || firstName.length < 2,
                lastNameError: !isValidString(lastName) || lastName.length < 2,
                emailIdError: !isValidString(emailId) || !checkIsValidEmail(emailId),
                mobileNoError: !isValidString(mobileNo),
                selectTimeError: !isValidString(selectedTime),
                noOfPeopleError: !isValidString(noOfPersons) || isNoOfPeopleExceeded(noOfPersons, this.props.no_of_people)
            });
        }
        Keyboard.dismiss();
    }
}

const mapStateToProps = (state) => ({
    tableReserved: state.tableReservationState.tableReserved,
    timeSlots: state.tableReservationState.timeSlots,
    no_of_people: state.tableReservationState.no_of_people,
    errorMsg: state.tableReservationState.errorMsg,
    timeZone: selectTimeZone(state),
    profileResponse: state.profileState.profileResponse,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    mobileLength: state.appState.s3ConfigResponse?.mobile?.max_length,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    isUserLoggedIn: selectHasUserLoggedIn(state)
});

const mapDispatchToProps = {
    getTableReservationSlotsAction,
    postTableReservationAction,
    resetTableBookedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(TableReservationScreen);
