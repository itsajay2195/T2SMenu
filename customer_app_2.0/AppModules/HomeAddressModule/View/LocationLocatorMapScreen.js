import React, { Component } from 'react';
import { FlatList, Keyboard, View, TouchableOpacity, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { isValidElement, isValidNumber, isValidString, safeFloatValueWithoutDecimal } from 't2sbasemodule/Utils/helpers';
import styles from '../Style/MapContainerStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import Colors from 't2sbasemodule/Themes/Colors';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { T2SIcon, T2STouchableOpacity } from 't2sbasemodule/UI';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { ADDRESS_FORM_TYPE, MAP_DELTA_VALUE, SCREEN_NAME, VIEW_ID } from '../../AddressModule/Utils/AddressConstants';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import {
    extractAddress,
    extractLocation,
    extractPostcode,
    getDefaultLatitude,
    getDefaultLongitude,
    isValidCoordinates
} from '../../AddressModule/Utils/AddressHelpers';
import {
    getAddressFromLatLong,
    getAddressFromPlacesId,
    getAutoCompletePlaces,
    resetAddressFromLocationAction,
    resetAutoCompletePlaces,
    resetManualAddress,
    setAddressFromLocationAction
} from '../../AddressModule/Redux/AddressAction';
import { connect } from 'react-redux';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import _, { debounce } from 'lodash';
import { hasLocationPermission } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';
import AddAddressManual from './Component/AddAddressManual';
import { SearchHeader } from './Component/SearchHeader';
import Geolocation from '@react-native-community/geolocation';
import TextStyle from '../Style/AddEditCustomerAddressStyle';
const screenName = SCREEN_OPTIONS.GET_ADDRESS_MAP.route_name;
var isLatestRegionUpdated = false;
class LocationLocatorMapScreen extends Component {
    constructor(props) {
        super(props);
        this.mapView = null;
        this.handleOnSuggestionChange = this.handleOnSuggestionChange.bind(this);
        this.handleClearSuggestion = this.handleClearSuggestion.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.handleMapType = this.handleMapType.bind(this);
        this.handleCurrentLocationPressed = this.handleCurrentLocationPressed.bind(this);
        this.state = {
            suggestion: '',
            mapType: 'hybrid', //satellite view with labels
            ...this.getLatLong(),
            updateRegion: false,
            latitudeDelta: MAP_DELTA_VALUE,
            longitudeDelta: MAP_DELTA_VALUE,
            isLocationGranted: false,
            googleSessionToken: null
        };
    }

    getLatLong() {
        const { route, addressFromLocation } = this.props;
        if (isValidElement(route?.params?.viewType)) {
            const { params } = route;
            if (
                (params.viewType === ADDRESS_FORM_TYPE.EDIT ||
                    params.viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY ||
                    params.viewType === ADDRESS_FORM_TYPE.QC) &&
                isValidElement(params?.data)
            ) {
                const { latitude, longitude, postcode, postCode } = params.data;
                return {
                    latitude: isValidString(latitude) && isValidNumber(latitude) ? latitude : '',
                    longitude: isValidString(longitude) && isValidNumber(longitude) ? longitude : '',
                    postCode: isValidElement(postcode) ? postcode : isValidElement(postCode) ? postCode : ''
                };
            } else if (isValidElement(params.latitude) && isValidElement(params.longitude)) {
                return {
                    latitude: params.latitude,
                    longitude: params.longitude
                };
            } else if (isValidElement(addressFromLocation)) {
                return {
                    ...extractLocation(addressFromLocation),
                    ...extractPostcode(addressFromLocation)
                };
            } else {
                this.setDefaultLatLong();
            }
        } else {
            this.setDefaultLatLong();
        }
        this.props.resetManualAddress();
    }

    setDefaultLatLong() {
        const { mapLatitude, mapLongitude } = this.props;
        return {
            latitude: getDefaultLatitude(mapLatitude),
            longitude: getDefaultLongitude(mapLongitude)
        };
    }

    static getDerivedStateFromProps(props, state) {
        let value = {};
        const { latitude, longitude, area } = state;
        const { addressFromLocation, s3ConfigResponse, doorNoManual } = props;
        let location = {};
        if (isValidElement(addressFromLocation)) {
            location = extractLocation(addressFromLocation);
        }
        if (
            (isValidElement(location.latitude) && location.latitude !== latitude) ||
            (isValidElement(location.longitude) && location.longitude !== longitude)
        ) {
            value = { ...extractLocation(addressFromLocation) };
            value = { ...value, ...extractAddress(addressFromLocation, s3ConfigResponse, area, doorNoManual) };
        }
        if (props.googleSessionToken !== state.googleSessionToken) {
            value.googleSessionToken = props.googleSessionToken;
        }

        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        this.navigationOnFocusEventListener = this.props.navigation.addListener('blur', () => {
            this.handleClearSuggestion();
        });
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.handleOnScreenFocus();
            this.setMapLocationFromQC();
        });
        Analytics.logScreen(ANALYTICS_SCREENS.ADDRESS_AUTO_COMPLETE_SCREEN);
        this.props.resetAutoCompletePlaces();
        this.checkLocationPermission();
        this.setCameraPosition();
    }

    setMapLocationFromQC() {
        const { route, searchAddress } = this.props;
        if (route?.params?.viewType === ADDRESS_FORM_TYPE.QC && isValidElement(searchAddress)) {
            this.props.setAddressFromLocationAction(searchAddress);
        }
    }

    handleOnScreenFocus() {
        const { area } = this.state;
        const { addressFromLocation, s3ConfigResponse, doorNoManual } = this.props;
        this.setState({
            ...extractAddress(addressFromLocation, s3ConfigResponse, area, doorNoManual),
            ...extractLocation(addressFromLocation)
        });
    }

    componentWillUnmount() {
        this.props.resetManualAddress();
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { latitude, longitude } = this.state;
        if ((prevState.latitude !== latitude || prevState.longitude !== longitude) && isLatestRegionUpdated) {
            if (isValidCoordinates(latitude, longitude)) {
                this.updateRegion(latitude, longitude);
            }
        }
    }

    updateRegion(lat, long) {
        const { latitudeDelta, longitudeDelta } = this.state;
        this.timeout = setTimeout(() => {
            if (isValidElement(this.mapView)) {
                this.mapView.animateToRegion(
                    {
                        latitude: safeFloatValueWithoutDecimal(lat),
                        longitude: safeFloatValueWithoutDecimal(long),
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta
                    },
                    200
                );
            }
        }, 500);
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaFlex}>
                <View style={styles.screenContainer}>
                    {this.renderHeader()}
                    {this.renderMapView()}
                    <View>
                        <T2STouchableOpacity style={styles.buttonContainer} onPress={this.handleConfirm}>
                            <T2SText style={styles.buttonTextStyle}>{LOCALIZATION_STRINGS.CONFIRM_OTP_CONFIRM.toUpperCase()}</T2SText>
                        </T2STouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    renderHeader() {
        return (
            <SearchHeader
                screenName={screenName}
                suggestion={this.state.suggestion}
                onChange={this.handleOnSuggestionChange}
                onClear={this.handleClearSuggestion}
                onBack={this.handleGoBack}
                reference={null}
            />
        );
    }

    renderSuggestions() {
        const { suggestions } = this.props;
        return (
            <View style={styles.suggestionContainer}>
                {isValidElement(suggestions) && suggestions.length > 0
                    ? this.renderSuggestionsList()
                    : isValidElement(suggestions) && this.renderNoSuggestions()}
            </View>
        );
    }

    renderSuggestionsList() {
        const { suggestions } = this.props;
        return (
            <View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={suggestions}
                    keyboardShouldPersistTaps={'always'}
                    renderItem={({ item, index }) => this.renderSuggestionItem(item, index)}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={() => <View style={styles.suggestionDivider} />}
                />
                {this.renderAddAddress()}
            </View>
        );
    }

    renderAddAddress() {
        const { route } = this.props;
        return (
            <>
                <View style={styles.suggestionDivider} />
                <AddAddressManual
                    viewType={route?.params?.viewType === ADDRESS_FORM_TYPE.QC ? route?.params?.viewType : null}
                    screenName={screenName}
                    resetAddressFromLocationAction={this.props.resetAddressFromLocationAction}
                />
            </>
        );
    }

    renderSuggestionItem(item, index) {
        return (
            <T2STouchableOpacity
                screenName={screenName}
                id={VIEW_ID.PLACES_ITEM + index.toString()}
                onPress={this.handleItemSelected.bind(this, item)}
                accessible={false}>
                <View style={styles.suggestionItemContainer}>
                    <T2SIcon style={styles.suggestionLocationIcon} icon={FONT_ICON.MAP} size={24} color={Colors.tabGrey} />
                    <T2SText
                        style={styles.suggestionItemText}
                        numberOfLines={1}
                        screenName={screenName}
                        id={VIEW_ID.PLACES_ITEM + index.toString()}>
                        {item.description}
                    </T2SText>
                </View>
            </T2STouchableOpacity>
        );
    }

    renderNoSuggestions() {
        const { route } = this.props;
        return (
            <View>
                <T2SText screenName={screenName} id={VIEW_ID.EMPTY_TEXT} style={styles.noSuggestionItem}>
                    {LOCALIZATION_STRINGS.NO_PLACES_FOUND}
                </T2SText>
                <AddAddressManual
                    viewType={route?.params?.viewType === ADDRESS_FORM_TYPE.QC ? route?.params?.viewType : null}
                    screenName={screenName}
                    resetAddressFromLocationAction={this.props.resetAddressFromLocationAction}
                />
            </View>
        );
    }

    renderMapView() {
        //TODO show user location button by checking the permission
        const { latitude, longitude, mapType, isLocationGranted } = this.state;
        return (
            <View style={styles.mapView}>
                <>
                    <View style={TextStyle.marginContainer}>
                        <T2SText style={TextStyle.instructionText} id={VIEW_ID.ADDRESS_DESCRIPTION} screenName={SCREEN_NAME.MAP_CONTAINER}>
                            {LOCALIZATION_STRINGS.ADDRESS_INSTRUCTION}
                        </T2SText>
                    </View>
                    <MapView
                        ref={(ref) => {
                            this.mapView = ref;
                        }}
                        provider={PROVIDER_GOOGLE}
                        style={styles.mapContainer}
                        initialRegion={{
                            latitude: safeFloatValueWithoutDecimal(latitude),
                            longitude: safeFloatValueWithoutDecimal(longitude),
                            latitudeDelta: MAP_DELTA_VALUE,
                            longitudeDelta: MAP_DELTA_VALUE
                        }}
                        mapType={mapType}
                        zoomEnabled
                        zoomTapEnabled
                        onRegionChange={(resgion, isGesture) => {
                            if (isValidElement(isGesture?.isGesture) && isGesture?.isGesture) {
                                isLatestRegionUpdated = false;
                            }
                        }}
                        onRegionChangeComplete={(region, isGesture) => {
                            this.handleOnRegionChangeComplete(region, isGesture);
                        }}
                        showsUserLocation
                        showsMyLocationButton={isLocationGranted}
                        showsBuildings
                    />
                    <TouchableOpacity
                        style={Platform.OS === 'android' ? styles.aOSCurrentLocationBtnStyle : styles.iOSCurrentLocationBtnStyle}
                        onPress={this.handleCurrentLocationPressed}
                        disabled={!isLocationGranted}
                    />
                    {this.renderMapOptions()}
                </>
                {this.renderSuggestions()}
            </View>
        );
    }

    renderMapOptions() {
        const { mapType } = this.state;
        return (
            <>
                <T2STouchableOpacity onPress={this.handleMapType.bind(this, mapType)} style={styles.mapTypeContainer}>
                    <T2SImage
                        style={styles.mapTypeImageStyle}
                        source={
                            mapType === 'standard'
                                ? require('../../../FoodHubApp/Images/satellite.png')
                                : require('../../../FoodHubApp/Images/standard.png')
                        }
                    />
                </T2STouchableOpacity>
                <View style={styles.pinLocationContainer}>
                    <CustomIcon name={FONT_ICON.MAP_FILL} size={30} color={Colors.persianRed} />
                    {this.renderLocationHint()}
                </View>
            </>
        );
    }

    renderLocationHint() {
        const { postCode } = this.state;
        if (isValidString(postCode)) {
            return (
                <View style={styles.pinLocationTextContainer}>
                    <T2SText
                        style={styles.pinLocationTextDisplayStyle}
                        id={VIEW_ID.PIN_LOCATION_TEXT}
                        screenName={SCREEN_NAME.MAP_CONTAINER}>
                        {postCode} ({LOCALIZATION_STRINGS.YOU_ARE_HERE})
                    </T2SText>
                </View>
            );
        }
    }

    handleMapType(mapType) {
        this.setState({ mapType: mapType === 'standard' ? 'hybrid' : 'standard' });
    }

    handleOnRegionChangeComplete = debounce((region, isGesture) => {
        if (isValidElement(region)) {
            const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
            if (isValidCoordinates(latitude, longitude)) {
                this.setState({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
                if (isValidElement(latitude) && isValidElement(longitude) && isGesture.isGesture) {
                    this.props.getAddressFromLatLong(latitude, longitude, isValidElement(screenName) && screenName);
                }
            }
        }
    }, 0);
    handleCurrentLocationPressed() {
        Geolocation.getCurrentPosition((position) => {
            let { latitude, longitude } = position.coords;
            if (isValidElement(latitude) && isValidElement(longitude)) {
                isLatestRegionUpdated = true;
                this.props.getAddressFromLatLong(latitude, longitude, isValidElement(screenName) && screenName);
            }
        });
    }

    //TODO doing this tricky way to avoid incorrect location and multiple calling. Need to optimise
    compareLatLong(region) {
        const { latitude: lat1, longitude: lng1 } = region;
        const { latitude: lat2, longitude: lng2 } = this.state;
        return (
            this.getDecimalFourDigit(lat1) === this.getDecimalFourDigit(parseFloat(lat2)) ||
            this.getDecimalFourDigit(lng1) === this.getDecimalFourDigit(parseFloat(lng2))
        );
    }

    getDecimalFourDigit(number) {
        return number.toFixed(4).split('.')[1];
    }

    handleConfirm() {
        this.setState({ updateRegion: true });
        isLatestRegionUpdated = true;
        const { route } = this.props;
        if (
            route?.params?.viewType === ADDRESS_FORM_TYPE.EDIT ||
            route?.params?.viewType === ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY ||
            route?.params?.viewType === ADDRESS_FORM_TYPE.QC
        ) {
            handleNavigation(SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name, {
                data: route.params.data,
                viewType: route.params.viewType
            });
        } else {
            handleNavigation(SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name, {
                viewType: route.params.viewType
            });
        }
    }

    handleItemSelected(item) {
        if (isValidElement(item.place_id)) {
            const { googleSessionToken } = this.state;
            this.dismissKeyboard();
            this.handleClearSuggestion();
            this.props.resetAddressFromLocationAction();
            isLatestRegionUpdated = true;
            this.props.getAddressFromPlacesId({ place_id: item.place_id }, null, googleSessionToken);
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

    checkLocationPermission() {
        hasLocationPermission().then((granted) => {
            this.setState({ isLocationGranted: granted });
        });
    }
    setCameraPosition() {
        setTimeout(() => {
            this.mapView.setCamera({
                camera: 14
            });
        }, 300);
    }

    dismissKeyboard() {
        Keyboard.dismiss();
    }
}

const mapStateToProps = (state) => ({
    suggestions: state.addressState.placesSuggestions,
    s3ConfigResponse: state.appState.s3ConfigResponse,
    fussySearchSuggestions: state.addressState.fussySearchSuggestions,
    addressFromLocation: state.addressState.addressFromLocation,
    mapLatitude: state.appState.s3ConfigResponse?.map?.latitude,
    mapLongitude: state.appState.s3ConfigResponse?.map?.longitude,
    searchAddress: state.takeawayListReducer.searchAddress,
    googleSessionToken: state.appState.googleSessionToken,
    doorNoManual: state.addressState.doorNoManual
});
const mapDispatchToProps = {
    getAddressFromLatLong,
    getAutoCompletePlaces,
    resetAutoCompletePlaces,
    resetAddressFromLocationAction,
    getAddressFromPlacesId,
    setAddressFromLocationAction,
    resetManualAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationLocatorMapScreen);
