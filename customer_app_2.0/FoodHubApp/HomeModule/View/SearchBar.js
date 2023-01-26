import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, Platform, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
    getAutoCompletePlacesAction,
    getUserAddressFormBackground,
    postcodeInput,
    resetAutoCompletePlacesAction,
    resetTextInputState
} from '../Redux/HomeAction';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import {
    getTakeawayListAction,
    getTakeawayListByAddressAction,
    getTakeawayListByLocation,
    getTakeawayListFromUserAddress,
    resetTakeawayAction
} from '../../TakeawayListModule/Redux/TakeawayListAction';
import { isGPSLocationEnabled } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';
import { isArrayNonEmpty, isFoodHubApp, isUKTakeaway, isValidElement, isValidNumber, isValidString } from 't2sbasemodule/Utils/helpers';
import GeolocationIOS from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { getAddressFromLatLong, resetAddressFromLocationAction } from 'appmodules/AddressModule/Redux/AddressAction';
import { getPostcodeFromAddressResponse } from 'appmodules/AddressModule/Utils/AddressHelpers';
import styles from '../Styles/HomeStyles';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';

import { SCREEN_NAME, VIEW_ID } from '../Utils/HomeConstants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { formatPostcodeFormatUK, postcodeValidationFormatter } from 't2sbasemodule/Utils/ValidationUtil';
import { getLatestOrder, ValidatePostCodeUK } from '../Utils/Helper';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import {
    getPlaceholderText,
    getSearchMaxLength,
    getSearchType,
    isAutoCompleteFind,
    isEatAppyClient,
    isPostCodeSearch,
    isUKApp
} from 'appmodules/BaseModule/GlobalAppHelper';
import { getNetworkStatus, selectHasUserLoggedIn, selectIsSpanishLanguage, selectLanguageKey } from 't2sbasemodule/Utils/AppSelectors';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { PERMISSION_CONSTANTS } from 'appmodules/AddressModule/Utils/AddressConstants';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { openSettings } from 'react-native-permissions';
import * as Analytics from '../../../AppModules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SEARCH_TYPE } from '../../TakeawayListModule/Utils/Constants';
import { T2SModal } from 't2sbasemodule/UI';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS, SEGMENT_STRINGS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
import { isIOS } from 'appmodules/BaseModule/Helper';
import { extractLocation } from 'appmodules/AddressModule/Utils/AddressHelpers';
import { SPINNER_RESET_VALUE } from '../../../CustomerApp/Utils/AppContants';
import { convertLatLngToString } from '../../TakeawayListModule/Utils/Helper';
import _ from 'lodash';

let timeout,
    setTime,
    clearGPSSearchTimeout,
    screenName = SCREEN_NAME.HOME_SCREEN;

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.fetchCurrentLocationAddress = this.fetchCurrentLocationAddress.bind(this);
        this.resetSearchInput = this.resetSearchInput.bind(this);
        this.handleFindButton = this.handleFindButton.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.handleLocationButtonClicked = this.handleLocationButtonClicked.bind(this);
        this.handleNegativeButtonClicked = this.handleNegativeButtonClicked.bind(this);
        this.handlePositiveButtonClicked = this.handlePositiveButtonClicked.bind(this);
        this.resetGPSIconSpinner = this.resetGPSIconSpinner.bind(this);
        this.state = {
            postCode: '',
            lat: 0,
            long: 0,
            address: '',
            postCodeTriggered: false,
            isDDShowing: false,
            makeFieldEmpty: false,
            locationFetching: false,
            locationDeniedModal: false,
            locationFetchFromGPSIcon: false,
            redirectTAList: true,
            showLoader: false,
            searchValue: '',
            googleSessionToken: null
        };
    }

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            const { countryId, postcode } = this.props;
            if (isValidElement(countryId) && isUKApp(countryId) && !isValidString(postcode)) this.handleLocationButtonClicked(true);
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        const { pendingOrder, previousOrder, isUserLoggedIn, countryId } = this.props;
        let latestPrevPropOrder = getLatestOrder(prevProps.pendingOrder, prevProps.previousOrder);
        let latestOrder = getLatestOrder(pendingOrder, previousOrder);
        if (
            prevProps.isUserLoggedIn !== isUserLoggedIn ||
            prevProps.countryId !== countryId ||
            latestPrevPropOrder?.id !== latestOrder?.id
        ) {
            this.handleBackgroundPostCodeFetch();
        }
    }
    handleBackgroundPostCodeFetch() {
        const { countryId, postcode } = this.props;
        if (isFoodHubApp()) {
            if (isUKApp(countryId) && !isValidString(postcode)) {
                this.handleLocationButtonClicked(true);
            } else if (!isUKApp(countryId)) {
                this.props.postcodeInput('');
                this.setState({ locationFetchFromGPSIcon: false });
            }
        }
    }

    componentWillUnmount() {
        if (isValidElement(this.keyboardDidHideListener)) {
            this.keyboardDidHideListener.remove();
        }
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
        if (isValidElement(setTime)) {
            clearTimeout(setTime);
        }
        this.clearGPSSearchTimeoutInterval();
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }
    _keyboardDidHide() {
        // Un-focus search input
        this.postcodeRef.blur();
        this.props.onMoveTop && this.props.onMoveTop(false);
        isAutoCompleteFind(this.props.searchType, this.props.clientType, this.props.countryFlag) &&
            this.props.toggleAutocomplete &&
            this.props.toggleAutocomplete(false);
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        if (
            isValidElement(state.postCodeTriggered) &&
            state.postCodeTriggered &&
            isValidElement(props.addressFromLocation) &&
            isValidElement(props.addressFromLocation.address_components)
        ) {
            let postCodeFetched = isAutoCompleteFind(props.searchType, props.clientType, props.countryFlag)
                ? props.addressFromLocation.formatted_address
                : getPostcodeFromAddressResponse(props.addressFromLocation.address_components);
            if (isValidElement(postCodeFetched) && postCodeFetched !== state.postCode && state.locationFetchFromGPSIcon) {
                isValidElement(props.onChangeText) && props.onChangeText(postCodeFetched);
                props.postcodeInput(postCodeFetched);
                props.resetAddressFromLocationAction();
                value.postCode = postCodeFetched;
                value.locationFetchFromGPSIcon = false;
                value.postCodeTriggered = false;
            }
        }
        if (state.postCode !== props.postcode && isValidString(props.postcode)) {
            value.postCode = props.postcode;
        }
        if (isValidString(state.postCode) && !isValidString(props.postcode)) {
            value.postCode = '';
            value.makeFieldEmpty = true;
        }
        if (!isValidString(props.postcode) && isValidElement(props.isItemSelected) && props.isItemSelected) {
            value.postCode = null;
        }
        if (props.googleSessionToken !== state.googleSessionToken) {
            value.googleSessionToken = props.googleSessionToken;
        }
        return _.isEmpty(value) ? null : value;
    }

    fetchCurrentLocationAddress(checkOnly = false) {
        const { postcode } = this.props;
        this.setState({ locationFetching: true });
        this.clearGPSSearchTimeoutInterval();
        clearGPSSearchTimeout = setTimeout(() => {
            this.setState({ locationFetchFromGPSIcon: false });
        }, SPINNER_RESET_VALUE);

        isGPSLocationEnabled(checkOnly).then((status) => {
            if (isValidElement(status)) {
                if (status) {
                    if (!checkOnly) {
                        this.setState({ locationFetchFromGPSIcon: true });
                    }
                    this.handleCurrentLocation(checkOnly);
                } else {
                    if (checkOnly && !isValidString(postcode)) {
                        this.handlePostCodeFromRecentOrder();
                    } else if (!checkOnly) {
                        this.setState({ locationDeniedModal: true, locationFetchFromGPSIcon: false });
                    }
                }
            }
        });
    }
    handlePostCodeFromRecentOrder() {
        this.props.getUserAddressFormBackground(null, null, this.state.redirectTAList);
        this.handleTAListRedirection();
    }
    getCommonSuccessCallBack(position, noFallback) {
        const { countryId, isUserLoggedIn, isAppOpen } = this.props;
        let { latitude, longitude } = isValidElement(position?.coords) && position?.coords;
        this.props.resetAddressFromLocationAction();
        if (isValidString(latitude) && isValidString(longitude) && isValidNumber(longitude)) {
            this.setState({
                lat: latitude,
                long: longitude,
                postCodeTriggered: true
            });
            if (noFallback) {
                if (isUKApp(countryId) && !isAppOpen) {
                    if (!isUserLoggedIn) {
                        timeout = setTimeout(() => {
                            this.props.getUserAddressFormBackground(latitude, longitude, this.state.redirectTAList);
                            this.handleTAListRedirection();
                        }, 800);
                    } else {
                        this.props.getUserAddressFormBackground(latitude, longitude, this.state.redirectTAList);
                        this.handleTAListRedirection();
                    }
                }
            } else {
                this.props.getAddressFromLatLong(latitude, longitude, screenName, false, true);
            }
        } else {
            this.handleTAListRedirection();
            this.handlePostCodeFromRecentOrder();
        }
    }

    handleTAListRedirection() {
        if (this.state.redirectTAList) {
            setTime = setTimeout(() => {
                this.setState({ redirectTAList: false, locationFetchFromGPSIcon: false });
            }, 1000);
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
                                this.fetchCurrentLocationAddress();
                            } else {
                                this.resetGPSIconSpinner();
                            }
                        })
                        .catch(() => {
                            this.resetGPSIconSpinner();
                        });
                } else if (noFallback) {
                    this.handlePostCodeFromRecentOrder();
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

    handleCurrentLocation(noFallback = false) {
        if (isIOS()) {
            this.getCurrentLocationForIOS(noFallback);
        } else {
            this.getCurrentLocationForAndroid(noFallback);
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
                } else if (noFallback) {
                    this.handlePostCodeFromRecentOrder();
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

    resetSearchInput() {
        if (!this.props.takeawayFetching) {
            this.setState({ postCode: null, locationFetchFromGPSIcon: false, lat: 0, long: 0 });
            this.props.resetAutoCompletePlacesAction();
            this.props.resetAreaSelected();
            this.props.changeSelectedItemStatus();
            this.props.resetTextInputState();
            this.props.resetAddressFromLocationAction();
            Analytics.logEvent(ANALYTICS_SCREENS.HOME, ANALYTICS_EVENTS.ICON_CLEAR);
        }
    }

    resetGPSIconSpinner() {
        this.setState({ locationFetchFromGPSIcon: false });
        this.clearGPSSearchTimeoutInterval();
    }

    clearGPSSearchTimeoutInterval() {
        if (isValidElement(clearGPSSearchTimeout)) {
            clearTimeout(clearGPSSearchTimeout);
            clearGPSSearchTimeout = null;
        }
    }

    getTextInputValue() {
        let { makeFieldEmpty, locationFetching, postCode } = this.state;
        let { searchedIndex, areaSelected } = this.props;
        if (!makeFieldEmpty) {
            if (isValidElement(searchedIndex)) {
                if (isValidString(postCode)) {
                    return postCode;
                } else {
                    return isUKTakeaway(this.props.countryId) &&
                        isValidString(formatPostcodeFormatUK(postcodeValidationFormatter(searchedIndex)))
                        ? formatPostcodeFormatUK(postcodeValidationFormatter(searchedIndex)).toUpperCase()
                        : searchedIndex;
                }
            } else if (locationFetching) {
                return postCode;
            } else if (isArrayNonEmpty(areaSelected)) {
                return areaSelected;
            } else {
                return postCode;
            }
        } else {
            return '';
        }
    }

    onChangeSearchInput(text) {
        let isAutoComplete, postCodeText;
        isAutoComplete = isAutoCompleteFind(this.props.searchType, this.props.clientType);
        postCodeText = isValidString(formatPostcodeFormatUK(postcodeValidationFormatter(text)))
            ? formatPostcodeFormatUK(postcodeValidationFormatter(text)).toUpperCase()
            : '';
        isValidElement(this.props.onChangeText) && this.props.onChangeText(text);
        this.props.postcodeInput(isAutoComplete ? text : postCodeText);
        this.setState({ makeFieldEmpty: false, locationFetching: false });
        const { googleSessionToken } = this.state;
        if (isAutoComplete) {
            this.setState({ postCode: text });
            if (text.length > 2) {
                isValidElement(this.props.toggleAutocomplete) && this.props.toggleAutocomplete(true);
                this.props.getAutoCompletePlacesAction(text, googleSessionToken);
            } else {
                this.props.resetAutoCompletePlacesAction();
            }
        } else {
            this.setState({
                postCode: postCodeText
            });
        }
    }

    isCloseIconEnabled() {
        return isValidString(this.getTextInputValue());
    }

    render() {
        const {
            searchType,
            clientType,
            countryFlag,
            configSearchName,
            languageKey,
            searchContainerStyle,
            isTop = false,
            searchStyle,
            countryId,
            onGetSearchBarHeight,
            searchMaxLength,
            autoFocus,
            takeawayFetching
        } = this.props;
        const searchPlaceHolder = isValidString(configSearchName) ? getPlaceholderText(configSearchName, languageKey) : '';
        const isAutoCompleteFindTrue = isAutoCompleteFind(searchType, clientType, countryFlag);
        return (
            <T2SView
                screenName={screenName}
                id={VIEW_ID.SEARCH_BAR_CONTAINER}
                style={searchContainerStyle}
                onLayout={(event) => {
                    let layout =
                        isValidElement(event.nativeEvent) &&
                        isValidElement(event.nativeEvent.layout) &&
                        isValidNumber(event.nativeEvent.layout.y)
                            ? event.nativeEvent.layout.y
                            : 0;
                    let searchBarHeight = isTop ? layout + 20 : layout + 80;
                    isAutoCompleteFindTrue && onGetSearchBarHeight && onGetSearchBarHeight(searchBarHeight);
                }}>
                <T2SView style={searchStyle || styles.searchBarView} screenName={screenName} id={VIEW_ID.SEARCH_BAR_VIEW}>
                    <TextInput
                        ref={(component) => (this.postcodeRef = component)}
                        style={styles.inputStyle}
                        selectionColor={Colors.black}
                        placeholderTextColor={Colors.textGreyColor}
                        onChangeText={this.onChangeSearchInput.bind(this)}
                        keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
                        autoCorrect={false}
                        maxLength={isUKApp(countryId) ? T2SConfig.maxPostCode.UK : getSearchMaxLength(searchMaxLength, countryFlag)}
                        autoFocus={autoFocus}
                        value={this.getTextInputValue()}
                        underlineColorAndroid={'transparent'}
                        placeholder={this.state.locationFetchFromGPSIcon ? LOCALIZATION_STRINGS.FETCHING_LOCATION : searchPlaceHolder}
                        onFocus={() => {
                            if (isAutoCompleteFindTrue) {
                                this.props.toggleAutocomplete && this.props.toggleAutocomplete(true);
                                this.props.onMoveTop && this.props.onMoveTop(true);
                            }
                        }}
                        accessible={false}
                        {...setTestId(screenName, VIEW_ID.SEARCH_BAR_INPUT_VIEW)}
                    />
                    {this.renderLocationIcon()}
                    {!isAutoCompleteFindTrue && this.renderFindButton(takeawayFetching)}
                </T2SView>
                {isAutoCompleteFindTrue && this.renderFindTakeawayButton(takeawayFetching)}
                {this.renderLocationDeniedModal()}
            </T2SView>
        );
    }

    renderLocationIcon() {
        return this.isCloseIconEnabled() ? (
            <TouchableOpacity
                onPress={this.resetSearchInput}
                style={styles.iconSpaceStyle}
                screenName={screenName}
                id={VIEW_ID.CLOSE_ICON_TOUCHID}>
                <T2SIcon
                    name={FONT_ICON.WRONG}
                    size={25}
                    color={Colors.rating_grey}
                    style={styles.gpsIconStyle}
                    screenName={screenName}
                    id={VIEW_ID.CLOSE_ICON}
                />
            </TouchableOpacity>
        ) : isValidElement(this.state.locationFetchFromGPSIcon) && this.state.locationFetchFromGPSIcon ? (
            <T2SView style={styles.loaderSpaceStyle}>
                <ActivityIndicator color={Colors.secondary_color} size={'small'} />
            </T2SView>
        ) : (
            <TouchableOpacity onPress={this.handleLocationButtonClicked.bind(this, false)} style={styles.iconSpaceStyle}>
                <T2SIcon name={FONT_ICON.GPS} size={30} style={styles.gpsIconStyle} screenName={screenName} id={VIEW_ID.GPS_ICON} />
            </TouchableOpacity>
        );
    }

    renderFindTakeawayButton(takeawayFetching) {
        return (
            <T2STouchableOpacity
                style={[styles.findFullButtonStyle, takeawayFetching ? { opacity: 0.5, paddingVertical: 10 } : { paddingVertical: 15 }]}
                screenName={screenName}
                id={VIEW_ID.FIND_BUTTON}
                disabled={takeawayFetching}
                onPress={!takeawayFetching && this.handleFindButton}>
                <T2SText style={styles.findTextStyle} screenName={screenName} id={VIEW_ID.FIND_TEXT}>
                    {LOCALIZATION_STRINGS.FIND_TAKEAWAY}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    renderFindButton(takeawayFetching) {
        return (
            <T2STouchableOpacity
                style={[styles.findButtonStyle, takeawayFetching ? { opacity: 1 } : {}]}
                screenName={screenName}
                id={VIEW_ID.FIND_BUTTON}
                disabled={takeawayFetching}
                onPress={!takeawayFetching && this.handleFindButton}>
                <T2SText
                    style={this.props.isSpanish ? [styles.findTextStyle, { fontSize: setFont(10.5) }] : styles.findTextStyle}
                    screenName={screenName}
                    id={VIEW_ID.FIND_TEXT}>
                    {LOCALIZATION_STRINGS.FIND}
                </T2SText>
            </T2STouchableOpacity>
        );
    }

    handleNegativeButtonClicked() {
        this.setState({ locationDeniedModal: false });
    }

    handlePositiveButtonClicked() {
        this.setState({ locationDeniedModal: false });
        openSettings().then((r) => {});
    }

    handleLocationButtonClicked(DontaskPermission = false) {
        this.setState({ makeFieldEmpty: false });
        this.fetchCurrentLocationAddress(DontaskPermission);
        Analytics.logEvent(ANALYTICS_SCREENS.HOME, ANALYTICS_EVENTS.ICON_GPS);
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

    handleFindButton() {
        Keyboard.dismiss();
        const {
            isUserLoggedIn,
            autocompletePlaces,
            searchedIndex,
            networkConnected,
            selectedItem,
            place_id,
            areaSelected,
            selectedTAOrderType,
            countryId,
            searchType,
            clientType,
            countryFlag,
            addressFromLocation
        } = this.props;
        const { lat, long } = this.state;
        let isEatAppyClientTrue = isEatAppyClient(clientType, countryFlag);
        if (!networkConnected) {
            showErrorMessage(LOCALIZATION_STRINGS.GENERIC_ERROR_MSG, null, Colors.persianRed);
            return;
        }
        const addressSearch = isAutoCompleteFind(searchType, clientType, countryFlag);
        if (addressSearch) {
            this.props.toggleAutocomplete && this.props.toggleAutocomplete(true);
            this.props.onMoveTop && this.props.onMoveTop(true);
        }
        //TODO here we should check the selected user address or manual user input in future release
        if (addressSearch) {
            let textInputValue = this.getTextInputValue();
            let latLongValue = extractLocation(addressFromLocation);
            let placeID = isValidString(place_id)
                ? place_id
                : isValidString(addressFromLocation?.place_id)
                ? addressFromLocation.place_id
                : '';
            if ((searchedIndex.length >= 3 && isEatAppyClientTrue) || (searchedIndex.length >= 3 && isArrayNonEmpty(autocompletePlaces))) {
                if (isArrayNonEmpty(autocompletePlaces) && isValidElement(placeID) && isValidElement(areaSelected)) {
                    handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                    this.logFind(searchedIndex, 'address');
                    this.props.getTakeawayListByAddressAction(
                        {
                            place_id: placeID,
                            description: areaSelected,
                            type: 'query',
                            value: textInputValue
                        },
                        getSearchType(searchType, countryFlag),
                        selectedTAOrderType
                    );
                } else if (isEatAppyClientTrue) {
                    handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                    this.logFind(searchedIndex, 'address');
                    this.props.getTakeawayListByAddressAction(
                        {
                            type: 'name',
                            value: textInputValue
                        },
                        SEARCH_TYPE.FUZZY_SEARCH,
                        selectedTAOrderType
                    );
                } else {
                    showErrorMessage(LOCALIZATION_STRINGS.ENTER_VALID_ADDRESS);
                    return;
                }
            }
            //Please Ref - https://touch2success.atlassian.net/browse/FDHB-6161
            // else if (
            //     !isEatAppyClientTrue &&
            //     isUserLoggedIn &&
            //     searchedIndex.length < 3 &&
            //     isValidElement(addressResponse) &&
            //     isArrayNonEmpty(addressResponse.data)
            // ) {
            //     handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
            //     this.props.getTakeawayListFromUserAddress(addressResponse.data[0]);
            //     this.logFind(searchedIndex, 'address');
            // }
            else if (!isEatAppyClientTrue && isUserLoggedIn && searchedIndex.length > 3 && isValidElement(selectedItem)) {
                handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                this.logFind(searchedIndex, 'address');
                this.props.getTakeawayListFromUserAddress(selectedItem);
            } else if (
                !isUKTakeaway(countryId) &&
                ((isValidString(textInputValue) && isValidElement(latLongValue) && isValidString(placeID)) ||
                    (!isValidElement(addressFromLocation) && isValidElement(lat) && isValidElement(long) && lat !== 0 && long !== 0))
            ) {
                handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                this.logFind(
                    textInputValue,
                    'latlong',
                    convertLatLngToString({
                        lat: isValidElement(latLongValue?.latitude) ? latLongValue.latitude : lat,
                        lng: isValidElement(latLongValue?.longitude) ? latLongValue.longitude : long
                    })
                );
                this.props.getTakeawayListByLocation(
                    {
                        type: 'latlong',
                        value: textInputValue,
                        place_id: placeID,
                        description: textInputValue
                    },
                    isValidElement(latLongValue?.latitude) ? latLongValue.latitude : lat,
                    isValidElement(latLongValue?.longitude) ? latLongValue.longitude : long,
                    selectedTAOrderType,
                    this.state.googleSessionToken
                );
                this.logFind(
                    convertLatLngToString({
                        lat: isValidElement(latLongValue?.latitude) ? latLongValue.latitude : lat,
                        lng: isValidElement(latLongValue?.longitude) ? latLongValue.longitude : long
                    }),
                    'latlong'
                );
            } else if (searchedIndex.length >= 3) {
                handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                this.props.getTakeawayListByAddressAction(
                    {
                        description: areaSelected,
                        type: 'query',
                        value: textInputValue
                    },
                    getSearchType(searchType, countryFlag),
                    selectedTAOrderType
                );
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.ENTER_VALID_ADDRESS);
                this.logError(searchedIndex, 'area');
            }
        } else {
            let formattedPostcode =
                isValidString(formatPostcodeFormatUK(postcodeValidationFormatter(searchedIndex))) &&
                formatPostcodeFormatUK(postcodeValidationFormatter(searchedIndex)).toUpperCase();
            if (
                (isValidElement(searchedIndex) && isUKApp(countryId) && ValidatePostCodeUK(formattedPostcode)) ||
                (!isUKApp(countryId) && isPostCodeSearch(searchType, countryFlag))
            ) {
                handleNavigation(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
                this.logFind(formattedPostcode, 'postcode');
                const postCode = isUKApp(countryId) ? formattedPostcode : searchedIndex;
                this.props.getTakeawayListAction(postCode, false, this.props.selectedTAOrderType);
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.ENTER_VALID_POSTCODE);
                this.logError(searchedIndex, 'postcode');
            }
        }
    }

    logFind(searchedIndex, type, latlng = null) {
        const { countryBaseFeatureGateResponse, countryISO } = this.props;
        let obj = {
            country_code: countryISO,
            search: searchedIndex,
            method: type
        };
        if (isValidElement(latlng)) {
            obj.location = latlng;
        }
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCHED, obj);
    }

    logError(searchedIndex, type) {
        const { countryBaseFeatureGateResponse, countryISO } = this.props;
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.ADDRESS_SEARCH_FAILED, {
            country_code: countryISO,
            cause: type === 'postcode' ? SEGMENT_STRINGS.INVALID_POSTCODE : SEGMENT_STRINGS.INVALID_AREA,
            search: searchedIndex,
            method: type
        });
    }
}

const mapStateToProps = (state) => ({
    addressFromLocation: state.addressState.addressFromLocation,
    addressResponse: state.addressState.addressResponse,
    autocompletePlaces: state.foodHubHomeState.autocompletePlaces,
    takeawayFetching: state.takeawayListReducer.takeawayFetching,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    postcode: state.foodHubHomeState.postcode,
    networkConnected: getNetworkStatus(state),
    isSpanish: selectIsSpanishLanguage(state),
    languageKey: selectLanguageKey(state),
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    configSearchName: state.appState.s3ConfigResponse?.search?.name,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    searchType: state.appState.s3ConfigResponse?.search?.type,
    clientType: state.appState.s3ConfigResponse?.config?.client_type,
    searchMaxLength: state.appState.s3ConfigResponse?.search?.max_length,
    pendingOrder: state.orderManagementState.pendingOrder,
    previousOrder: state.orderManagementState.previousOrder,
    isAppOpen: state.foodHubHomeState.isAppOpen,
    googleSessionToken: state.appState.googleSessionToken
});

const mapDispatchToProps = {
    getTakeawayListAction,
    getAddressFromLatLong,
    getAutoCompletePlacesAction,
    getTakeawayListByAddressAction,
    getTakeawayListFromUserAddress,
    resetTakeawayAction,
    resetAutoCompletePlacesAction,
    postcodeInput,
    resetAddressFromLocationAction,
    resetTextInputState,
    getUserAddressFormBackground,
    getTakeawayListByLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
