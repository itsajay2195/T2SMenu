import React, { Component } from 'react';
import { View, FlatList, Keyboard, AppState } from 'react-native';
import styles from '../Style/SearchAddressStyle';
import { T2SIcon, T2SModal, T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import { Colors } from 't2sbasemodule/Themes';
import { defaultTouchArea, isArrayNonEmpty, isValidElement, isValidNumber, isValidString } from 't2sbasemodule/Utils/helpers';
import { connect } from 'react-redux';
import {
    getAddressFromPlacesId,
    getAutoCompletePlaces,
    resetAddressFromLocationAction,
    resetAutoCompletePlaces,
    getAddressFromLatLong
} from '../../AddressModule/Redux/AddressAction';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ADDRESS_FORM_TYPE, PERMISSION_CONSTANTS, SCREEN_NAME, VIEW_ID } from '../../AddressModule/Utils/AddressConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { isGPSLocationEnabled } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';
import { extractAddress, extractLocation } from '../../AddressModule/Utils/AddressHelpers';
import GeolocationIOS from '@react-native-community/geolocation';
import { openSettings } from 'react-native-permissions';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import Geolocation from 'react-native-geolocation-service';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { isAndroid } from '../../BaseModule/Helper';
import AddAddressManual from './Component/AddAddressManual';
import { SearchHeader } from './Component/SearchHeader';
import { getFormattedFullAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { getTakeawayListAction, resetAction } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { redirectRouteAction } from '../../../CustomerApp/Redux/Actions';
import { AppConstants } from '../../../CustomerApp/Utils/AppContants';
import { selectFilterList, selectFilterType } from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import _ from 'lodash';

let screenName = SCREEN_NAME.SEARCH_PLACES_SCREEN,
    timeout,
    currentAppState = AppConstants.APP_STATUS.ACTIVE;
class LocationSearchScreen extends Component {
    constructor(props) {
        super(props);
        this.handleOnSuggestionChange = this.handleOnSuggestionChange.bind(this);
        this.handleClearSuggestion = this.handleClearSuggestion.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.handlePositiveButtonClicked = this.handlePositiveButtonClicked.bind(this);
        this.handleNegativeButtonClicked = this.handleNegativeButtonClicked.bind(this);
        this.searchRefMethod = this.searchRefMethod.bind(this);
        this.state = {
            suggestion: '',
            locationDeniedModal: false,
            currentLocation: null,
            appState: AppState.currentState,
            googleSessionToken: null
        };
    }
    handleAppStateChange = (nextAppState) => {
        if (currentAppState.match(/inactive|background/) && nextAppState.match(AppConstants.APP_STATUS.ACTIVE)) {
            this.fetchCurrentLocation(true);
        }
        currentAppState = nextAppState;
    };

    componentDidMount() {
        const { currentLocation, suggestion } = this.state;
        const { viewType } = this.props.route?.params;
        if (!isValidString(suggestion) && isValidElement(this.props.suggestions)) {
            this.props.resetAutoCompletePlaces();
        }
        this.navigationOnBlurEventListener = this.props.navigation.addListener('blur', () => {
            this.handleClearSuggestion();
        });
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            // viewType param won't be take form out off the focus block
            const { viewType } = this.props.route?.params;
            if (viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY) {
                this.setCurrentLocation();
            }
        });
        if (viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY) {
            this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
        }
        if (!isValidElement(currentLocation)) {
            this.fetchCurrentLocation(true);
        }
        this.setState({
            ...extractLocation(this.props.currentLocation)
        });
        timeout = setTimeout(() => {
            if (isValidElement(this.searchRef)) this.searchRef.focus();
        }, 400);
    }
    setCurrentLocation() {
        const { addressCurrentLocation, s3ConfigResponse } = this.props;
        if (isValidElement(addressCurrentLocation?.addres)) {
            let addressFormatte = extractAddress(this.props.addressCurrentLocation, s3ConfigResponse);
            this.setState({ currentLocation: getFormattedFullAddress(addressFormatte) });
        }
    }
    static getDerivedStateFromProps(props, state) {
        const { addressCurrentLocation, s3ConfigResponse } = props;
        const { currentLocation, googleSessionToken } = state;
        let value = {};
        if (
            !isValidString(currentLocation) &&
            isValidElement(addressCurrentLocation) &&
            isValidElement(addressCurrentLocation.address_components) &&
            isValidElement(addressCurrentLocation.formatted_address)
        ) {
            let addressFormatte = extractAddress(addressCurrentLocation, s3ConfigResponse);
            value.currentLocation = getFormattedFullAddress(addressFormatte);
        }
        if (props.googleSessionToken !== googleSessionToken) {
            value.googleSessionToken = props.googleSessionToken;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
        if (isValidElement(this.appStateSubscription)) {
            this.appStateSubscription.remove();
        }
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(this.navigationOnBlurEventListener)) {
            this.props.navigation.removeListener(this.navigationOnBlurEventListener);
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderHeader()}
                {this.renderSuggestions()}
                {this.renderLocationDeniedModal()}
            </SafeAreaView>
        );
    }

    searchRefMethod(ref) {
        this.searchRef = ref;
    }

    renderHeader() {
        return (
            <SearchHeader
                screenName={screenName}
                suggestion={this.state.suggestion}
                reference={this.searchRefMethod}
                onChange={this.handleOnSuggestionChange}
                onClear={this.handleClearSuggestion}
                onBack={this.handleGoBack}
            />
        );
    }

    renderSuggestions() {
        const { suggestions } = this.props;
        return (
            <View style={styles.contentContainer}>
                {isValidElement(suggestions) && suggestions.length > 0
                    ? this.renderSuggestionsList()
                    : isValidElement(suggestions)
                    ? this.renderNoSuggestions()
                    : this.renderCurrentLocation()}
            </View>
        );
    }

    renderSuggestionsList(showDeliveryAddress) {
        const { suggestions, addressResponse, resetAddressFromLocationAction } = this.props;
        let suggestList = showDeliveryAddress ? (isArrayNonEmpty(addressResponse?.data) ? addressResponse.data : null) : suggestions;
        if (isValidElement(suggestList))
            return (
                <>
                    {showDeliveryAddress && isArrayNonEmpty(addressResponse?.data) && (
                        <T2SText style={styles.savedAddressHeader}>{LOCALIZATION_STRINGS.SAVED_ADDRESS}</T2SText>
                    )}
                    <KeyboardAwareScrollView
                        contentContainerStyle={{ paddingBottom: 80 }}
                        enabled
                        behavior="padding"
                        keyboardShouldPersistTaps={'always'}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={suggestList}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={({ item, index }) => this.renderSuggestionItem(item, index, showDeliveryAddress)}
                            keyExtractor={(item, index) => index}
                            ItemSeparatorComponent={() => <View style={styles.suggestionDivider} />}
                        />
                        <View style={styles.suggestionDivider} />
                        {!showDeliveryAddress && (
                            <AddAddressManual
                                screenName={screenName}
                                resetAddressFromLocationAction={resetAddressFromLocationAction}
                                forSearchTA={true}
                            />
                        )}
                    </KeyboardAwareScrollView>
                </>
            );
    }
    showEditIcon(item) {
        return (
            <T2STouchableOpacity
                hitSlop={defaultTouchArea()}
                style={styles.editIcon}
                onPress={this.handleDeliveryAddressEditClick.bind(this, item)}>
                <T2SIcon
                    style={styles.suggestionLocationIcon}
                    onPress={this.handleDeliveryAddressEditClick.bind(this, item)}
                    icon={FONT_ICON.EDIT_UNFILL}
                    size={24}
                    color={Colors.tabGrey}
                />
            </T2STouchableOpacity>
        );
    }

    renderSuggestionItem(item, index, showDeliveryAddress) {
        let addressText = showDeliveryAddress ? getFormattedFullAddress(item) : item.description;
        return (
            <T2STouchableOpacity
                screenName={screenName}
                id={VIEW_ID.PLACES_ITEM}
                onPress={this.handleItemSelected.bind(this, item, showDeliveryAddress)}
                accessible={false}>
                <View style={styles.suggestionItemContainer}>
                    <T2SIcon style={styles.suggestionLocationIcon} icon={FONT_ICON.MAP} size={24} color={Colors.tabGrey} />
                    <T2SText
                        style={styles.suggestionItemText}
                        numberOfLines={1}
                        screenName={screenName}
                        id={VIEW_ID.PLACES_ITEM + index.toString()}>
                        {addressText}
                    </T2SText>
                    {showDeliveryAddress && this.showEditIcon(item)}
                </View>
            </T2STouchableOpacity>
        );
    }

    handleDeliveryAddressEditClick(item) {
        const { data } = this.props.addressResponse;
        const addressItem = isArrayNonEmpty(data) ? data.find((Data) => Data.id === item.id) : null;
        this.props.resetAddressFromLocationAction();
        handleNavigation(SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name, {
            viewType: ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY,
            data: addressItem
        });
    }
    renderNoSuggestions() {
        const { viewType } = this.props.route?.params;
        return (
            <View>
                <T2SText screenName={screenName} id={VIEW_ID.EMPTY_TEXT} style={styles.noSuggestionItem}>
                    {LOCALIZATION_STRINGS.NO_PLACES_FOUND}
                </T2SText>
                <AddAddressManual
                    forSearchTA={viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY}
                    screenName={screenName}
                    resetAddressFromLocationAction={this.props.resetAddressFromLocationAction}
                />
            </View>
        );
    }
    renderCurrentLocation() {
        const { viewType } = this.props.route?.params;
        const { currentLocation } = this.state;
        if (viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY) {
            let isLocationEnabled = isValidString(this.state.currentLocation);
            return (
                <View style={styles.currentLocationView}>
                    <T2SText style={[styles.currentLocationTxt, styles.currentLocationHeader]}>
                        {LOCALIZATION_STRINGS.CURRENT_LOCATION}
                    </T2SText>
                    <T2STouchableOpacity
                        style={styles.currentLocationContainer}
                        onPress={
                            isLocationEnabled
                                ? this.handleItemSelected.bind(this, this.props.addressCurrentLocation, false)
                                : this.fetchCurrentLocation.bind(this, false)
                        }>
                        <View style={styles.locationContainer}>
                            <T2SIcon icon={FONT_ICON.LOCATION_FILL} size={25} style={styles.currentLocationIcon} />
                            <T2SText style={styles.currentLocationTxt}>
                                {isLocationEnabled ? currentLocation : LOCALIZATION_STRINGS.LOCATION_DISABLE}
                            </T2SText>
                        </View>
                        {!isLocationEnabled && <T2SText style={styles.locationDisabledText}>{LOCALIZATION_STRINGS.ENABLE}</T2SText>}
                    </T2STouchableOpacity>
                    {this.renderSuggestionsList(true)}
                </View>
            );
        } else {
            return (
                <T2STouchableOpacity
                    style={styles.GPSContainer}
                    onPress={this.fetchCurrentLocation.bind(this, false)}
                    screenName={screenName}
                    id={VIEW_ID.CURRENT_LOCATION_VIEW}
                    accessible={false}>
                    <T2SIcon
                        screenName={screenName}
                        id={VIEW_ID.CURRENT_LOCATION_ICON}
                        icon={FONT_ICON.GPS}
                        size={30}
                        style={styles.currentLocationIcon}
                    />
                    <T2SText style={styles.currentLocationTxt} screenName={screenName} id={VIEW_ID.CURRENT_LOCATION_TEXT}>
                        {LOCALIZATION_STRINGS.CURRENT_LOCATION}
                    </T2SText>
                </T2STouchableOpacity>
            );
        }
    }
    renderLocationDeniedModal() {
        return (
            <T2SModal
                isVisible={this.state.locationDeniedModal}
                description={LOCALIZATION_STRINGS.LOCATION_BLOCKED}
                positiveButtonText={LOCALIZATION_STRINGS.OK}
                positiveButtonClicked={this.handlePositiveButtonClicked}
                requestClose={this.handleNegativeButtonClicked}
                negativeButtonText={LOCALIZATION_STRINGS.CANCEL}
                negativeButtonClicked={this.handleNegativeButtonClicked}
            />
        );
    }

    handleItemSelected(item, showDeliveryAddress = false) {
        const { viewType } = this.props.route?.params;
        const { googleSessionToken } = this.state;
        let addressPostCode,
            forSearchTA = viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY;
        if (showDeliveryAddress) {
            addressPostCode = forSearchTA && isValidElement(item.postCode) ? item.postCode : isValidElement(item.postcode) && item.postcode;
            this.props.navigation.goBack();
            this.props.getTakeawayListAction(addressPostCode, false, this.props.selectedTAOrderType, item);
            const { countryBaseFeatureGateResponse, countryISO } = this.props;
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, {
                country_code: countryISO,
                search: addressPostCode,
                method: viewType
            });
        } else if (isValidElement(item.place_id)) {
            this.handleClearSuggestion();
            this.props.resetAddressFromLocationAction();
            this.props.getAddressFromPlacesId({ place_id: item.place_id }, forSearchTA, googleSessionToken);
            if (!forSearchTA)
                setTimeout(() => {
                    handleNavigation(SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name, { viewType });
                }, 1000);
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

    handleClearSuggestion() {
        this.setState({ suggestion: '' });
        this.props.resetAutoCompletePlaces();
    }

    handleGoBack() {
        this.handleClearSuggestion();
        this.props.resetAddressFromLocationAction();
        this.props.navigation.goBack();
    }

    handleOnSuggestionChange(text) {
        this.setState({ suggestion: text }, () => {
            const { googleSessionToken } = this.state;
            this.props.getAutoCompletePlaces(text, googleSessionToken);
        });
    }

    fetchCurrentLocation(checkOnly = false) {
        this.dismissKeyboard();
        isGPSLocationEnabled(checkOnly).then((status) => {
            if (isValidElement(status)) {
                if (status) {
                    this.handleCurrentLocation(checkOnly);
                } else {
                    if (!checkOnly) openSettings().then((r) => {});
                }
            }
        });
    }

    handleCurrentLocation(noFallback = false) {
        if (isAndroid()) {
            this.getCurrentLocationForAndroid(noFallback);
        } else {
            this.getCurrentLocationForIOS(noFallback);
        }
    }

    getCurrentLocationForIOS(noFallback = false) {
        GeolocationIOS.getCurrentPosition(
            (position) => {
                this.getCommonSuccessCallBack(position, noFallback);
            },
            (e) => {
                if (!noFallback && this.checkIfLocationFailure(e)) {
                    try {
                        openSettings();
                    } catch (error) {
                        showErrorMessage(isValidElement(error) ? error.message : LOCALIZATION_STRINGS.COULD_NOT_OPEN_SETTING);
                    }
                }
            },
            {
                enableHighAccuracy: true,
                showLocationDialog: false,
                timeout: 20000,
                forceLocationManager: true,
                maximumAge: 0
            }
        );
    }

    getCurrentLocationForAndroid(noFallback) {
        Geolocation.getCurrentPosition(
            (position) => {
                this.getCommonSuccessCallBack(position, noFallback);
            },
            (e) => {
                if (!noFallback && this.checkIfLocationFailure(e)) {
                    LocationServicesDialogBox.checkLocationServicesIsEnabled({
                        message: LOCALIZATION_STRINGS.ENABLE_MESSAGE,
                        ok: LOCALIZATION_STRINGS.TURN_ON,
                        cancel: LOCALIZATION_STRINGS.I_DONT_WANT,
                        showDialog: true,
                        preventOutSideTouch: false,
                        preventBackClick: false
                    })
                        .then((_) => {
                            if (_.enabled) {
                                this.fetchCurrentLocation();
                            }
                        })
                        .catch((error) => {});
                }
            },
            {
                enableHighAccuracy: true,
                showLocationDialog: false,
                forceLocationManager: true,
                timeout: 20000,
                maximumAge: 0
            }
        );
    }

    getCommonSuccessCallBack(position, permissionCheckOnly = false) {
        if (
            isValidElement(position) &&
            isValidElement(position.coords) &&
            isValidNumber(position.coords.latitude) &&
            isValidNumber(position.coords.longitude)
        ) {
            const { viewType } = this.props.route?.params;
            this.props.getAddressFromLatLong(
                position.coords.latitude,
                position.coords.longitude,
                isValidElement(screenName) && screenName,
                false,
                true,
                false
            );
            if (!permissionCheckOnly && viewType !== ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY)
                handleNavigation(SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    viewType: ADDRESS_FORM_TYPE.ADD
                });
        }
    }

    checkIfLocationFailure(e) {
        return (
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_1 ||
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_2 ||
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_3 ||
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_4
        );
    }

    handleNegativeButtonClicked() {
        this.setState({ locationDeniedModal: false });
    }

    handlePositiveButtonClicked() {
        this.setState({ locationDeniedModal: false });
        openSettings().then((r) => {});
    }

    dismissKeyboard() {
        Keyboard.dismiss();
    }
}

const mapStateToProps = (state) => ({
    suggestions: state.addressState.placesSuggestions,
    addressFromLocation: state.addressState.addressFromLocation,
    currentLocation: state.addressState.currentLocation,
    addressResponse: state.addressState.addressResponse,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    s3ConfigResponse: state.appState.s3ConfigResponse,
    addressCurrentLocation: state.takeawayListReducer.addressCurrentLocation,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    filterType: selectFilterType(state),
    filterList: selectFilterList(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    googleSessionToken: state.appState.googleSessionToken
});

const mapDispatchToProps = {
    getAutoCompletePlaces,
    resetAutoCompletePlaces,
    resetAddressFromLocationAction,
    getAddressFromPlacesId,
    getAddressFromLatLong,
    getTakeawayListAction,
    redirectRouteAction,
    resetAction
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationSearchScreen);
