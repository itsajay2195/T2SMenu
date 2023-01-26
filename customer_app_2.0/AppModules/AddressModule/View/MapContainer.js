import { View } from 'react-native';
import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { isValidElement, isValidString, safeFloatValueWithoutDecimal } from 't2sbasemodule/Utils/helpers';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from './styles/MapContainerStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ADDRESS_FORM_TYPE, SCREEN_NAME, VIEW_ID } from '../Utils/AddressConstants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { getAddressFromLatLong } from '../Redux/AddressAction';
import { connect } from 'react-redux';
import { getDefaultDelta, getDefaultLatitude, getDefaultLongitude, isValidCoordinates } from '../Utils/AddressHelpers';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';

let isEditAddress = false,
    timeout;
class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.onLayOutReady = this.onLayOutReady.bind(this);
        this.mapView = null;
        this.state = {
            latitude: getDefaultLatitude(this.props.s3ConfigResponse),
            longitude: getDefaultLongitude(this.props.s3ConfigResponse),
            latitudeDelta: getDefaultDelta(this.props.s3ConfigResponse),
            longitudeDelta: getDefaultDelta(this.props.s3ConfigResponse),
            isPinLocationClicked: false,
            onMapReady: false
        };
        isEditAddress = props.screenName === ADDRESS_FORM_TYPE.EDIT || props.screenName === ADDRESS_FORM_TYPE.ADDRESS_LOOKUP_WITH_PREFILL;
    }

    componentDidMount() {
        if (
            (isValidElement(this.props.isAddFlow) && this.props.isAddFlow === ADDRESS_FORM_TYPE.ADD) ||
            this.props.isAddFlow === ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS
        ) {
            this.onIconPress(true);
        } else {
            this.updateRegion(this.props.latitude, this.props.longitude);
            this.onIconPress(false);
        }
    }
    componentWillUnmount() {
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.latitude !== this.props.latitude || prevProps.longitude !== this.props.longitude) {
            if (isValidCoordinates(this.props.latitude, this.props.longitude)) {
                this.updateRegion(this.props.latitude, this.props.longitude);
            }
        }
        if (prevProps.permissionOrLocationError !== this.props.permissionOrLocationError) {
            if (
                (this.props.permissionOrLocationError &&
                    isValidElement(this.props.isAddFlow) &&
                    this.props.isAddFlow === ADDRESS_FORM_TYPE.ADD) ||
                this.props.isAddFlow === ADDRESS_FORM_TYPE.ADD_SELECTED_ADDRESS ||
                this.props.addressToolTip
            ) {
                this.setState({
                    latitudeDelta: getDefaultDelta(this.props.s3ConfigResponse),
                    longitudeDelta: getDefaultDelta(this.props.s3ConfigResponse)
                });
            } else {
                this.setState({ latitudeDelta: 0.003, longitudeDelta: 0.003 });
            }
        }
    }

    updateRegion(lat, long) {
        if (isValidElement(this.mapView) && this.state.onMapReady && this.props.isLocationBeingUpdated) {
            this.mapView.animateToRegion(
                {
                    latitude: safeFloatValueWithoutDecimal(lat),
                    longitude: safeFloatValueWithoutDecimal(long),
                    latitudeDelta: this.props.latitudeDelta,
                    longitudeDelta: this.props.longitudeDelta
                },
                200
            );
        } else if (!this.state.onMapReady && isEditAddress) {
            this.props.updateIsLocationFromPostcode(true);
            timeout = setTimeout(() => {
                this.mapView.animateToRegion(
                    {
                        latitude: safeFloatValueWithoutDecimal(lat),
                        longitude: safeFloatValueWithoutDecimal(long),
                        latitudeDelta: this.props.latitudeDelta,
                        longitudeDelta: this.props.longitudeDelta
                    },
                    200
                );
            }, 500);
        }
    }

    onIconPress(getPinnedLocation) {
        this.props.handlePinLocation(getPinnedLocation);
        if (isValidElement(this.props.setLocation)) {
            this.props.setLocation(this.state.latitude, this.state.longitude);
        }

        this.setState({ isPinLocationClicked: true });
    }

    onLayOutReady() {
        this.setState({ onMapReady: true });
        if (isValidElement(this.mapView) && this.props.isLocationBeingUpdated && isEditAddress) {
            this.mapView.animateToRegion(
                {
                    latitude: safeFloatValueWithoutDecimal(this.props.latitude),
                    longitude: safeFloatValueWithoutDecimal(this.props.longitude),
                    latitudeDelta: this.props.latitudeDelta,
                    longitudeDelta: this.props.longitudeDelta
                },
                200
            );
        }
    }

    render() {
        const {
            iconName,
            handlePinLocation,
            addressFromLatLong,
            addressToolTip,
            permissionOrLocationError,
            isAddFlow,
            isAutoCompletePickerAvailable
        } = this.props;
        return (
            <T2SView style={styles.mapMainContainer}>
                {isValidElement(addressToolTip) &&
                    addressToolTip &&
                    !permissionOrLocationError &&
                    isValidElement(addressFromLatLong) &&
                    isValidElement(addressFromLatLong.formatted_address) && (
                        <T2SView style={styles.currentLocationTextContainer} accessible={false}>
                            <T2SText
                                screenName={SCREEN_NAME.MAP_CONTAINER}
                                id={VIEW_ID.CURRENT_LOCATION_TEXT}
                                style={styles.currentLocationHeaderText}>
                                {LOCALIZATION_STRINGS.CURRENT_LOCATION}
                            </T2SText>
                            <T2SText screenName={SCREEN_NAME.MAP_CONTAINER} id={VIEW_ID.ADDRESS_TEXT} style={styles.currentLocationText}>
                                {this.props.addressFromLatLong.formatted_address}
                            </T2SText>
                        </T2SView>
                    )}
                <MapView
                    ref={(ref) => {
                        this.mapView = ref;
                    }}
                    provider={PROVIDER_GOOGLE}
                    style={
                        isValidElement(this.props.isFullScreenView) && this.props.isFullScreenView
                            ? styles.mapContainerFullView
                            : styles.mapContainer
                    }
                    mapType="standard"
                    zoomEnabled
                    zoomTapEnabled
                    initialRegion={{
                        latitude: safeFloatValueWithoutDecimal(this.state.latitude),
                        longitude: safeFloatValueWithoutDecimal(this.state.longitude),
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta
                    }}
                    onMapReady={this.onLayOutReady}
                    onRegionChangeComplete={(region) => {
                        if (isValidElement(region)) {
                            if (!this.props.isLocationBeingUpdated) {
                                if (isValidCoordinates(region.latitude, region.longitude)) {
                                    Analytics.logEvent(
                                        isAddFlow === ADDRESS_FORM_TYPE.ADD
                                            ? ANALYTICS_SCREENS.ADD_ADDRESS
                                            : ANALYTICS_SCREENS.EDIT_ADDRESS,
                                        ANALYTICS_EVENTS.MAP_PIN_MOVED,
                                        { latitude: region.latitude, longitude: region.longitude }
                                    );
                                    this.setState({
                                        latitude: region.latitude,
                                        longitude: region.longitude,
                                        latitudeDelta: region.latitudeDelta,
                                        longitudeDelta: region.longitudeDelta
                                    });
                                }
                                if (
                                    isValidElement(this.state.latitude) &&
                                    isValidElement(this.state.longitude) &&
                                    (this.state.longitude !== getDefaultLatitude(this.props.s3ConfigResponse) ||
                                        this.state.longitude !== getDefaultLongitude(this.props.s3ConfigResponse)) &&
                                    isValidCoordinates(this.state.latitude, this.state.longitude)
                                ) {
                                    if (!isEditAddress) {
                                        this.props.getAddressFromLatLong(
                                            region.latitude,
                                            region.longitude,
                                            isValidElement(this.props.screenName) && this.props.screenName
                                        );
                                    } else {
                                        isEditAddress = false;
                                    }
                                }
                            } else {
                                this.props.updateIsLocationFromPostcode(false);
                            }
                        }
                    }}
                />
                {isValidElement(iconName) && (
                    <View style={styles.pinLocationContainer}>
                        <CustomIcon name={iconName} size={30} style={styles.pinLocationIconStyle} />
                        <View style={styles.pinLocationTextContainer}>
                            {isValidString(this.props.postCode) &&
                                (!this.props.permissionOrLocationError || isEditAddress || this.props.isInitialAddressFetched) && (
                                    <T2SText
                                        style={styles.pinLocationTextDisplayStyle}
                                        id={VIEW_ID.PIN_LOCATION_TEXT}
                                        screenName={SCREEN_NAME.MAP_CONTAINER}>
                                        {this.props.postCode} ({LOCALIZATION_STRINGS.YOU_ARE_HERE})
                                    </T2SText>
                                )}
                        </View>
                    </View>
                )}
                {isValidElement(handlePinLocation) && !isAutoCompletePickerAvailable && (
                    <T2STouchableOpacity
                        onPress={this.onIconPress.bind(this, true)}
                        accessible={false}
                        style={styles.handlePinLocationIconContainerStyle}>
                        <T2SIcon
                            name={FONT_ICON.GPS}
                            size={35}
                            color={Colors.mildBlue}
                            id={VIEW_ID.PIN_LOCATION_BUTTON}
                            screenName={SCREEN_NAME.MAP_CONTAINER}
                        />
                    </T2STouchableOpacity>
                )}
            </T2SView>
        );
    }
}

const mapStateToProps = (state) => ({
    addressFromLatLong: state.addressState.addressFromLocation
});
const mapDispatchToProps = {
    getAddressFromLatLong
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
