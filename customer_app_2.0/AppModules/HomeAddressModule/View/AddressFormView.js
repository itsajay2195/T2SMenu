import React, { Component } from 'react';
import { View, Text, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import styles from '../Style/AddEditCustomerAddressStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import Colors from 't2sbasemodule/Themes/Colors';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import { ADDRESS_FORM_TYPE, SCREEN_NAME, VIEW_ID } from '../../AddressModule/Utils/AddressConstants';
import {
    addressEmptyMessage,
    addressInvalidMessage,
    addressLabel,
    addressMaxLength,
    addressRequired,
    addressVisible,
    isAutoCompletePickerArea,
    isUKApp,
    isValidField
} from '../../BaseModule/GlobalAppHelper';
import { CONFIG_TYPE } from '../../BaseModule/GlobalAppConstants';
import {
    firstCharacterUpperCased,
    getPostCodeKeyboardType,
    isArrayNonEmpty,
    isValidElement,
    isValidString,
    validateRegex
} from 't2sbasemodule/Utils/helpers';
import {
    formatPostcodeFormatUK,
    postcodeValidationFormatter,
    removePrefixZeroFixRegex,
    validAlphaNumericWithHyphenFixRegex
} from 't2sbasemodule/Utils/ValidationUtil';
import {
    addressParamsObj,
    extractAddress,
    extractLocation,
    extractStateInfoFromRouteParam,
    getAddressWithSeparator,
    getDefaultLatitude,
    getDefaultLongitude,
    hasChanges,
    isValidAreaFromFuzzyResults,
    validateFields,
    validateStates
} from '../../AddressModule/Utils/AddressHelpers';
import { selectLanguageKey, selectPostcodeRegex } from 't2sbasemodule/Utils/AppSelectors';
import {
    addAddressAction,
    getAddressFromUserInput,
    getAutocompleteFuzzySearchAreaAction,
    resetManualAddress,
    setDoorNoByManual,
    setFlatNoByManual,
    updateAddressAction
} from '../../AddressModule/Redux/AddressAction';
import { connect } from 'react-redux';
import { T2SIcon } from 't2sbasemodule/UI';
import { ValidatePostCodeUK } from '../../../FoodHubApp/HomeModule/Utils/Helper';
import _ from 'lodash';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SSwitch from 't2sbasemodule/UI/CommonUI/T2SSwitch';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { customerAppTheme } from '../../../CustomerApp/Theme';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import { isIOS } from '../../BaseModule/Helper';
import { selectFilterList, selectFilterType } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { resetAction } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';

let screenName = SCREEN_NAME.ADD_ADDRESS;
let inputWidth = 160;

class AddressFormView extends Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.handleKeyboardDismiss = this.handleKeyboardDismiss.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleEndEditing = this.handleEndEditing.bind(this);
        this.handlePrimaryAddressToggle = this.handlePrimaryAddressToggle.bind(this);
        this.handleStreetNameEndEditing = this.handleStreetNameEndEditing.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.state = {
            doorNo: '',
            flat: '',
            address_line1: '',
            address_line2: '',
            postCode: '',
            area: '',
            showEmptyDoorNumberError: false,
            showInvalidDoorNumberError: false,
            showEmptyPostcodeError: false,
            showInvalidPostCodeError: false,
            showEmptyAddressError: false,
            showInvalidAddressError: false,
            showEmptyCityError: false,
            showInvalidCityError: false,
            showEmptyAreaError: false,
            showInvalidAreaError: false,
            latitude: getDefaultLatitude(this.props.mapLatitude),
            longitude: getDefaultLongitude(this.props.mapLongitude),
            prevAddressFromLocation: null,
            prevSearchedPostcode: '',
            showFussySearchAutocompleteView: false,
            togglePrimaryAddressButton: false,
            displayAddressLine1: '',
            edited: false
        };
    }
    componentDidMount() {
        if (this.props?.addressResponse?.data?.length === 0) {
            this.setState({ togglePrimaryAddressButton: true });
        }
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        let { addressFromLocation, s3ConfigResponse, route, doorNoManual, flatNoManual } = props;
        const { data } = route?.params;
        const { latitude, longitude, edited } = state;
        let location = {};
        if (isValidElement(addressFromLocation)) {
            location = extractLocation(addressFromLocation);
        }
        if (
            (isValidElement(location.latitude) && location.latitude !== latitude) ||
            (isValidElement(location.longitude) && location.longitude !== longitude)
        ) {
            if (isValidElement(addressFromLocation)) {
                value = {
                    address_line2: '',
                    area: '',
                    flat: flatNoManual,
                    ...extractAddress(addressFromLocation, s3ConfigResponse, state.area, doorNoManual),
                    ...extractLocation(addressFromLocation),
                    prevAddressFromLocation: addressFromLocation
                };
            } else {
                value = {
                    address: '',
                    city: '',
                    prevAddressFromLocation: null
                };
            }
        } else if (!edited && isValidElement(data) && isValidElement(data.longitude) && isValidElement(data.latitude)) {
            value = {
                ...extractStateInfoFromRouteParam(data, doorNoManual, flatNoManual)
            };
        }
        return _.isEmpty(value) ? null : value;
    }
    renderHeaderButton() {
        if (hasChanges(null, this.state, '', this.props.s3ConfigResponse))
            return (
                <T2STouchableOpacity screenName={screenName} id={VIEW_ID.TICK_ICON_CLICK} onPress={this.handleSave}>
                    <T2SIcon screenName={screenName} id={VIEW_ID.TICK_ICON} icon={FONT_ICON.TICK} onPress={this.handleSave} />
                </T2STouchableOpacity>
            );
    }
    handleGoBack() {
        const { address_line1 } = this.state;
        const isValidAddress = isValidString(address_line1) && address_line1.length > 1;
        if (isValidAddress) {
            this.getAddressFromUserInput(this.getValidAddress());
        }
        this.goBack();
    }

    goBack() {
        if (NavigationService.navigationRef.current?.canGoBack()) {
            NavigationService.navigationRef.current?.goBack();
        }
    }
    render() {
        const { s3ConfigResponse, route } = this.props;

        return (
            <SafeAreaView style={styles.mainContainer}>
                <T2SAppBar
                    id={VIEW_ID.BACK_BUTTON}
                    screenName={screenName}
                    title={LOCALIZATION_STRINGS.CONFIRM_ADDRESS}
                    showElevation={true}
                    actions={this.renderHeaderButton()}
                    handleLeftActionPress={this.handleGoBack}
                />

                <KeyboardAvoidingView
                    style={styles.mainContainer}
                    enabled
                    {...(isIOS() ? { behavior: 'padding' } : {})}
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.marginContainer}>
                        <Text style={styles.instructionText}>{LOCALIZATION_STRINGS.ADDRESS_INSTRUCTION}</Text>
                    </View>
                    {this.renderAddressFields()}
                    <View style={styles.buttonView}>
                        <T2SButton
                            id={VIEW_ID.SAVE_BUTTON}
                            screenName={screenName}
                            style={[
                                styles.buttonContainer,
                                {
                                    backgroundColor: hasChanges(null, this.state, route.params.viewType, s3ConfigResponse)
                                        ? Colors.primaryColor
                                        : Colors.secondaryTextColor
                                }
                            ]}
                            title={
                                route.params.viewType === ADDRESS_FORM_TYPE.EDIT ? LOCALIZATION_STRINGS.UPDATE : LOCALIZATION_STRINGS.SAVE
                            }
                            onPress={this.handleSave}
                            disabled={!hasChanges(null, this.state, '', s3ConfigResponse)}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    renderAddressFields() {
        const { s3ConfigResponse, languageKey } = this.props;
        return (
            <View style={[styles.marginContainer, { marginHorizontal: 20 }]}>
                <View style={styles.doorAndFlatContainer}>
                    {this.renderDoorNumber(s3ConfigResponse, languageKey)}
                    {this.renderFlat(s3ConfigResponse)}
                </View>
                {this.renderDoorNumberErrorText()}
                {this.renderPostcode(s3ConfigResponse, languageKey)}
                {this.renderAddress(s3ConfigResponse, languageKey)}
                {this.renderCity(s3ConfigResponse, languageKey)}
                {addressVisible(s3ConfigResponse, CONFIG_TYPE.AREA) && (
                    <View style={styles.stateTextInputContainer}>{this.renderState(s3ConfigResponse, languageKey)}</View>
                )}
                {this.renderPrimaryToggle()}
            </View>
        );
    }
    renderDoorNumberErrorText() {
        const { showEmptyDoorNumberError, showInvalidDoorNumberError } = this.state;
        const { s3ConfigResponse, languageKey } = this.props;
        if (showEmptyDoorNumberError || showInvalidDoorNumberError) {
            return (
                <T2SText style={{ color: customerAppTheme.colors.error }} screenName={screenName} id={VIEW_ID.DOOR_ERROR_TEXT}>
                    {(this.state.showEmptyDoorNumberError && addressEmptyMessage(s3ConfigResponse, CONFIG_TYPE.HOUSE_NUMBER)) ||
                        (this.state.showInvalidDoorNumberError &&
                            addressInvalidMessage(s3ConfigResponse, CONFIG_TYPE.HOUSE_NUMBER, languageKey))}
                </T2SText>
            );
        }
    }

    renderDoorNumber(s3ConfigResponse, languageKey) {
        const { doorNo, showEmptyDoorNumberError, showInvalidDoorNumberError } = this.state;
        return (
            <View style={styles.doorViewStyle}>
                <T2STextInput
                    screenName={screenName}
                    id={VIEW_ID.DOOR_NO_TEXT}
                    label={LOCALIZATION_STRINGS.DOOR}
                    onChangeText={this.handleChangeText.bind(this, VIEW_ID.DOOR_NO_TEXT)}
                    onSubmitEditing={this.handleKeyboardDismiss}
                    value={doorNo}
                    error={showEmptyDoorNumberError || showInvalidDoorNumberError}
                    required={addressRequired(s3ConfigResponse, CONFIG_TYPE.HOUSE_NUMBER)}
                />
            </View>
        );
    }

    renderFlat(s3ConfigResponse) {
        const { flat } = this.state;
        return (
            <T2STextInput
                style={styles.flatView}
                screenName={screenName}
                id={VIEW_ID.FLAT_TEXT}
                label={addressLabel(s3ConfigResponse, CONFIG_TYPE.FLAT)}
                onChangeText={this.handleChangeText.bind(this, VIEW_ID.FLAT_TEXT)}
                onSubmitEditing={this.handleKeyboardDismiss}
                value={flat}
            />
        );
    }

    renderPostcode(s3ConfigResponse, languageKey) {
        const { postCode, showEmptyPostcodeError, showInvalidPostCodeError } = this.state;
        return (
            <T2STextInput
                screenName={screenName}
                id={VIEW_ID.POSTCODE_TEXT}
                autoCorrect={false}
                keyboardType={getPostCodeKeyboardType(s3ConfigResponse).keyboardType}
                label={addressLabel(s3ConfigResponse, CONFIG_TYPE.POSTCODE)}
                onChangeText={this.handleChangeText.bind(this, VIEW_ID.POSTCODE_TEXT)}
                onSubmitEditing={this.handleKeyboardDismiss}
                onEndEditing={this.handleEndEditing}
                value={postCode}
                error={showEmptyPostcodeError || showInvalidPostCodeError}
                errorText={
                    (showEmptyPostcodeError && addressEmptyMessage(s3ConfigResponse, CONFIG_TYPE.POSTCODE)) ||
                    (showInvalidPostCodeError && addressInvalidMessage(s3ConfigResponse, CONFIG_TYPE.POSTCODE, languageKey))
                }
                required={addressRequired(s3ConfigResponse, CONFIG_TYPE.POSTCODE)}
                maxLength={addressMaxLength(s3ConfigResponse, CONFIG_TYPE.POSTCODE)}
            />
        );
    }

    renderAddress(s3ConfigResponse, languageKey) {
        const { address_line1, showEmptyAddressError, showInvalidAddressError } = this.state;
        return (
            <T2STextInput
                screenName={screenName}
                id={VIEW_ID.ADDRESS_TEXT}
                inputRef={this.doorEditText}
                onChangeText={this.handleChangeText.bind(this, VIEW_ID.ADDRESS_TEXT)}
                onSubmitEditing={this.handleKeyboardDismiss}
                onEndEditing={this.handleStreetNameEndEditing}
                label={this.labelLengthOfTextInput(addressLabel(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1))}
                value={address_line1}
                error={showEmptyAddressError || showInvalidAddressError}
                errorText={
                    (showEmptyAddressError && addressEmptyMessage(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1)) ||
                    (showInvalidAddressError && addressInvalidMessage(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1, languageKey))
                }
                required={addressRequired(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1)}
                keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
            />
        );
    }

    renderCity(s3ConfigResponse, languageKey) {
        const { address_line2, showEmptyCityError, showInvalidCityError } = this.state;
        return (
            <T2STextInput
                screenName={screenName}
                id={VIEW_ID.CITY_TEXT}
                onChangeText={this.handleChangeText.bind(this, VIEW_ID.CITY_TEXT)}
                onSubmitEditing={this.handleKeyboardDismiss}
                label={addressLabel(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2)}
                value={address_line2}
                error={showEmptyCityError || showInvalidCityError}
                errorText={
                    (showEmptyCityError && addressEmptyMessage(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2)) ||
                    (showInvalidCityError && addressInvalidMessage(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2, languageKey))
                }
                required={addressRequired(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2)}
                keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
            />
        );
    }

    renderState(s3ConfigResponse, languageKey) {
        const { area, showEmptyAreaError, showInvalidAreaError } = this.state;
        return (
            <T2STextInput
                screenName={screenName}
                id={VIEW_ID.STATE_TEXT}
                onChangeText={this.handleChangeText.bind(this, VIEW_ID.STATE_TEXT)}
                onSubmitEditing={this.handleKeyboardDismiss}
                label={addressLabel(s3ConfigResponse, CONFIG_TYPE.AREA)}
                value={area}
                error={showEmptyAreaError || showInvalidAreaError}
                errorText={
                    (showEmptyAreaError && addressEmptyMessage(s3ConfigResponse, CONFIG_TYPE.AREA)) ||
                    (showInvalidAreaError && addressInvalidMessage(s3ConfigResponse, CONFIG_TYPE.AREA, languageKey))
                }
                required={addressRequired(s3ConfigResponse, CONFIG_TYPE.AREA)}
                keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
            />
        );
    }

    handleEndEditing() {
        const { s3ConfigResponse } = this.props;
        const { postCode } = this.state;
        if (isAutoCompletePickerArea(s3ConfigResponse)) {
            let isValidArea = isValidAreaFromFuzzyResults(this.props, postCode);
            this.setState({
                showFussySearchAutocompleteView: false,
                showEmptyPostcodeError: !isValidString(postCode),
                showInvalidPostCodeError: !isValidArea
            });
            isValidArea && this.handlePostCodeLookup();
        } else {
            this.handlePostCodeLookup();
        }
    }
    setEditState() {
        const { edited } = this.state;
        if (!edited) {
            this.setState({ edited: true });
        }
    }

    handleChangeText(id, text) {
        const { s3ConfigResponse, countryId } = this.props;
        this.setEditState();
        switch (id) {
            case VIEW_ID.DOOR_NO_TEXT:
                this.props.setDoorNoByManual(null);
                this.setState({
                    doorNo: text,
                    showEmptyDoorNumberError: !isValidString(text),
                    showInvalidDoorNumberError: isValidString(text) && !isValidField(s3ConfigResponse, CONFIG_TYPE.HOUSE_NUMBER, text)
                });
                this.props.setDoorNoByManual(text);
                break;
            case VIEW_ID.FLAT_TEXT:
                this.setState({ flat: removePrefixZeroFixRegex(validAlphaNumericWithHyphenFixRegex(text)) });
                this.props.setFlatNoByManual(text);
                break;
            case VIEW_ID.POSTCODE_TEXT:
                this.setState({
                    postCode: isUKApp(countryId) ? formatPostcodeFormatUK(postcodeValidationFormatter(text)).toUpperCase() : text,
                    showEmptyPostcodeError: !isValidString(text),
                    showInvalidPostCodeError: isValidString(text) && !isValidField(s3ConfigResponse, CONFIG_TYPE.POSTCODE, text)
                });
                if (isAutoCompletePickerArea(s3ConfigResponse)) {
                    if (text.length > 2) {
                        isValidElement(text) && this.setState({ showFussySearchAutocompleteView: true });
                        isValidString(text) && this.props.getAutocompleteFuzzySearchAreaAction(text);
                    } else {
                        this.setState({ showFussySearchAutocompleteView: false });
                    }
                }
                break;
            case VIEW_ID.ADDRESS_TEXT:
                this.setState({
                    address_line1: firstCharacterUpperCased(text),
                    showEmptyAddressError: !isValidString(text),
                    showInvalidAddressError: isValidString(text) && !isValidField(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE1, text)
                });
                break;
            case VIEW_ID.CITY_TEXT:
                this.setState({
                    address_line2: firstCharacterUpperCased(text),
                    showEmptyCityError: !isValidString(text),
                    showInvalidCityError: isValidString(text) && !isValidField(s3ConfigResponse, CONFIG_TYPE.ADDRESS_LINE2, text)
                });
                break;
            case VIEW_ID.STATE_TEXT:
                this.setState({
                    area: firstCharacterUpperCased(text),
                    showEmptyAreaError: !isValidString(text),
                    showInvalidAreaError: isValidString(text) && !isValidField(s3ConfigResponse, CONFIG_TYPE.AREA, text)
                });
        }
    }

    handleKeyboardDismiss() {
        Keyboard.dismiss();
    }

    renderPrimaryToggle() {
        const { addressResponse } = this.props;
        const { togglePrimaryAddressButton } = this.state;
        return (
            <View style={styles.primaryAddressUpdateContainer}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.SET_AS_PRIMARY_ADDRESS_TEXT}
                    style={styles.primaryAddressUpdateTextDisplayStyle}>
                    {LOCALIZATION_STRINGS.ADDRESS_FORM_SET_AS_DEFAULT}
                </T2SText>
                <T2SSwitch
                    screenName={screenName}
                    id={VIEW_ID.SET_AS_PRIMARY_ADDRESS_SWITCH}
                    color={Colors.primaryColor}
                    value={togglePrimaryAddressButton}
                    onValueChange={this.handlePrimaryAddressToggle}
                    disabled={addressResponse?.data?.length === 0}
                />
            </View>
        );
    }

    handlePrimaryAddressToggle() {
        const { togglePrimaryAddressButton } = this.state;
        this.setState({ togglePrimaryAddressButton: !togglePrimaryAddressButton, edited: true });
    }

    handlePostCodeLookup() {
        const { postCodeRegex, countryId } = this.props;
        const { postCode, prevSearchedPostcode } = this.state;
        const isCountryUK = isUKApp(countryId);
        if ((isCountryUK && ValidatePostCodeUK(postCode)) || (!isCountryUK && validateRegex(postCodeRegex, postCode))) {
            this.setState({ prevSearchedPostcode: postCode });
            if (postCode !== prevSearchedPostcode) {
                this.getAddressFromUserInput(postCode);
            }
        } else {
            if (isValidString(postCode)) {
                this.setState({ showInvalidPostCodeError: true });
            } else {
                this.setState({ showEmptyPostcodeError: true });
            }
        }
    }

    handleStreetNameEndEditing() {
        const { s3ConfigResponse } = this.props;
        const { address_line1 } = this.state;
        if (isAutoCompletePickerArea(s3ConfigResponse)) {
            let isValidArea = isValidAreaFromFuzzyResults(this.props, address_line1);
            this.setState({
                showFussySearchAutocompleteView: false,
                showEmptyAddressError: !isValidString(address_line1),
                showInvalidAddressError: !isValidArea
            });
            isValidArea && this.handlePostCodeLookupByAddressLine1();
        } else {
            this.handlePostCodeLookupByAddressLine1();
        }
    }

    handlePostCodeLookupByAddressLine1() {
        const { address_line1, displayAddressLine1 } = this.state;
        const isValidAddress = isValidString(address_line1) && address_line1.length > 1;
        if (isValidAddress) {
            this.setState({ displayAddressLine1: address_line1 });
            if (address_line1 !== displayAddressLine1) {
                getAddressFromUserInput(this.getValidAddress());
            }
        } else {
            this.setState({ showEmptyAddressError: true });
        }
    }
    getAddressFromUserInput(address) {
        if (isValidString(address)) {
            this.props.getAddressFromUserInput(address);
        }
    }

    labelLengthOfTextInput(label) {
        if (isValidElement(label)) {
            let removeSpecialCharLabel = label.split(' ');
            if (isValidElement(removeSpecialCharLabel)) {
                removeSpecialCharLabel = removeSpecialCharLabel.join('');
                return isValidElement(removeSpecialCharLabel.length) && removeSpecialCharLabel.length < 16
                    ? removeSpecialCharLabel
                    : removeSpecialCharLabel.substring(0, this.getTrimmedNumber(inputWidth)) + this.returnAdditionalString();
            }
        }
        return this.returnAdditionalString();
    }

    getTrimmedNumber() {
        if (inputWidth > 200) {
            return 25;
        } else if (inputWidth > 190) {
            return 22;
        } else if (inputWidth > 180) {
            return 20;
        } else if (inputWidth > 170) {
            return 18;
        } else if (inputWidth > 160) {
            return 16;
        }
    }

    returnAdditionalString() {
        return this.getTrimmedNumber() < 25 ? '...' : '';
    }

    handleSave() {
        const { route, navigation, s3ConfigResponse } = this.props;
        const { viewType, data, isFromOrderTypeModal, forSearchTA } = route.params;
        const newState = validateStates(this.state, this.props);
        if (viewType === ADDRESS_FORM_TYPE.EDIT || viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY) {
            this.setEditState();
        }

        this.setState({ ...newState });
        if (!validateFields(newState)) return;
        if (viewType === ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS || forSearchTA || viewType === ADDRESS_FORM_TYPE.QC) {
            let popCount = viewType === ADDRESS_FORM_TYPE.QC ? 2 : 3;
            this.props.addAddressAction(
                navigation,
                addressParamsObj(this.state, s3ConfigResponse),
                this.getValidAddress(),
                popCount,
                isFromOrderTypeModal,
                isFromOrderTypeModal,
                !isFromOrderTypeModal,
                viewType
            );
        } else if (viewType === ADDRESS_FORM_TYPE.ADD || viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY_ADD) {
            this.props.addAddressAction(navigation, addressParamsObj(this.state, s3ConfigResponse), this.getValidAddress(), 3, viewType);
        } else if (viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY) {
            this.props.updateAddressAction(
                navigation,
                data?.id,
                addressParamsObj(this.state, s3ConfigResponse),
                this.getValidAddress(),
                3,
                viewType
            );
        } else {
            this.props.updateAddressAction(navigation, data?.id, addressParamsObj(this.state, s3ConfigResponse), this.getValidAddress(), 2);
        }
        if (forSearchTA) {
            this.resetFilterForTAList();
        }
    }
    resetFilterForTAList() {
        const { filterType, filterLIst } = this.props;
        if (isArrayNonEmpty(filterType) || isArrayNonEmpty(filterLIst)) {
            this.props.resetAction();
        }
    }

    getValidAddress() {
        const { postCodeRegex, countryId } = this.props;
        const isCountryUK = isUKApp(countryId);
        let address = '';
        const { doorNo, flat, address_line1, address_line2, postCode } = this.state;

        if (isValidString(doorNo)) {
            address = doorNo;
        }
        if (isValidString(flat)) {
            address = getAddressWithSeparator(address) + flat;
        }
        if (isValidString(address_line1)) {
            address = getAddressWithSeparator(address) + address_line1;
        }
        if (isValidString(address_line2)) {
            address = getAddressWithSeparator(address) + address_line2;
        }
        if ((isCountryUK && ValidatePostCodeUK(postCode)) || (!isCountryUK && validateRegex(postCodeRegex, postCode))) {
            address = getAddressWithSeparator(address) + postCode;
        }
        return address;
    }
}

const mapStateToProps = (state) => ({
    s3ConfigResponse: state.appState.s3ConfigResponse,
    addressFromLocation: state.addressState.addressFromLocation,
    postCodeRegex: selectPostcodeRegex(state),
    languageKey: selectLanguageKey(state),
    addressResponse: state.addressState.addressResponse,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    mapLatitude: state.appState.s3ConfigResponse?.map?.latitude,
    mapLongitude: state.appState.s3ConfigResponse?.map?.longitude,
    filterType: selectFilterType(state),
    filterList: selectFilterList(state),
    doorNoManual: state.addressState.doorNoManual,
    flatNoManual: state.addressState.flatNoByManual
});
const mapDispatchToProps = {
    addAddressAction,
    updateAddressAction,
    getAddressFromUserInput,
    getAutocompleteFuzzySearchAreaAction,
    resetAction,
    setDoorNoByManual,
    setFlatNoByManual,
    resetManualAddress
};
export default connect(mapStateToProps, mapDispatchToProps)(AddressFormView);
