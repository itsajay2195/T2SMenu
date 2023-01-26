import React, { Component } from 'react';
import MapContainer from '../MapContainer';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import BaseComponent from '../../../BaseModule/BaseComponent';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { CurrentLocationMapViewStyle } from '../styles/CurrentLocationMapViewStyles';
import { PERMISSION_CONSTANTS, SCREEN_NAME, VIEW_ID } from '../../Utils/AddressConstants';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { isGPSLocationEnabled } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import Geolocation from 'react-native-geolocation-service';
import GeolocationIOS from '@react-native-community/geolocation';
import * as NavigationService from '../../../../CustomerApp/Navigation/NavigationService';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { Platform } from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { openSettings } from 'react-native-permissions';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
let fetchCurrentLocationTimer;
class CurrentLocationMapViewScreen extends Component {
    constructor(props) {
        super(props);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handlePinLocation = this.handlePinLocation.bind(this);
        this.onEnableGPSPressed = this.onEnableGPSPressed.bind(this);
        this.onEnableLocationPermissionPressed = this.onEnableLocationPermissionPressed.bind(this);
    }

    componentDidMount() {
        this.fetchCurrentLocationAddress();
        Analytics.logScreen(ANALYTICS_SCREENS.ADDRESS_PICKER_MAP_CONTAINER);
    }
    componentWillUnmount() {
        if (isValidElement(fetchCurrentLocationTimer)) {
            clearInterval(fetchCurrentLocationTimer);
            fetchCurrentLocationTimer = null;
        }
    }

    fetchCurrentLocationAddress() {
        isGPSLocationEnabled().then((status) => {
            if (isValidElement(status)) {
                this.shouldShowGPSAccessModal(!status);
                if (status) {
                    this.handlePinLocation();
                }
            } else {
                this.shouldShowGPSAccessModal(true);
            }
            if (isValidElement(fetchCurrentLocationTimer)) {
                clearInterval(fetchCurrentLocationTimer);
                fetchCurrentLocationTimer = null;
            }
        });
    }

    state = {
        latitude: this.props.route.params.latitude,
        longitude: this.props.route.params.longitude,
        showEnableLocationPermission: false,
        isInitialLocationFetched: true,
        showEnableGPS: false
    };

    onEnableGPSPressed() {
        if (Platform.OS === 'android') {
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
                    }
                })
                .catch((error) => {});
        } else {
            try {
                openSettings();
            } catch (error) {
                showErrorMessage(isValidElement(error) ? error.message : LOCALIZATION_STRINGS.COULD_NOT_OPEN_SETTING);
            }
        }
    }

    onEnableLocationPermissionPressed() {
        try {
            openSettings();
        } catch (error) {
            showErrorMessage(isValidElement(error) ? error.message : LOCALIZATION_STRINGS.COULD_NOT_OPEN_SETTING);
        }
        if (isValidElement(fetchCurrentLocationTimer)) {
            clearInterval(fetchCurrentLocationTimer);
            fetchCurrentLocationTimer = null;
        }
        fetchCurrentLocationTimer = setInterval(() => {
            this.fetchCurrentLocationAddress();
        }, 2000);
    }

    render() {
        const { showEnableGPS, showEnableLocationPermission } = this.state;
        return (
            <BaseComponent>
                <T2SAppBar
                    screenName={SCREEN_NAME.ADDRESS_PICKER_MAP_CONTAINER}
                    id={VIEW_ID.ADDRESS_LOOKUP_MAP_APP_BAR}
                    handleLeftActionPress={this.handleGoBack}
                    actions={
                        <CustomIcon
                            style={CurrentLocationMapViewStyle.tickIconStyle}
                            name={FONT_ICON.TICK}
                            size={25}
                            onPress={this.handleConfirm}
                            screenName={SCREEN_NAME.ADDRESS_PICKER_MAP_CONTAINER}
                        />
                    }
                    showElevation={false}
                />
                {showEnableGPS ? (
                    <T2STouchableOpacity onPress={this.onEnableGPSPressed} style={CurrentLocationMapViewStyle.permissionViewStyle}>
                        <T2SText style={CurrentLocationMapViewStyle.permissionTextStyle}>{PERMISSION_CONSTANTS.ENABLE_GPS}</T2SText>
                    </T2STouchableOpacity>
                ) : showEnableLocationPermission ? (
                    <T2STouchableOpacity
                        onPress={this.onEnableLocationPermissionPressed}
                        style={CurrentLocationMapViewStyle.permissionViewStyle}>
                        <T2SText style={CurrentLocationMapViewStyle.permissionTextStyle}>{PERMISSION_CONSTANTS.ENABLE_PERMISSION}</T2SText>
                    </T2STouchableOpacity>
                ) : null}
                <MapContainer
                    isFullScreenView={true}
                    addressToolTip={true}
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    handlePinLocation={this.handlePinLocation}
                    latitudeDelta={this.state.showEnableLocationPermission || this.state.showEnableGPS ? 100 : 0.003}
                    longitudeDelta={this.state.showEnableLocationPermission || this.state.showEnableGPS ? 100 : 0.003}
                    iconName={FONT_ICON.MAP_FILL}
                    setLocation={(latitude, longitude) => {
                        this.setState({ latitude, longitude });
                    }}
                    isInitialLocationFetched={this.state.isInitialLocationFetched}
                    isFromCurrentLocationContainer={true}
                    permissionOrLocationError={this.state.showEnableLocationPermission || this.state.showEnableGPS}
                    isLocationUpdatedFromPostcode={false}
                    updateIsLocationFromPostcode={() => {}}
                />
            </BaseComponent>
        );
    }

    shouldShowGPSAccessModal(show) {
        this.setState({
            showEnableLocationPermission: show
        });
    }

    geoLocationCommonSuccessCallback(position) {
        if (this.state.showEnableGPS) {
            this.setState({ showEnableGPS: false });
        }
        if (this.state.showEnableLocationPermission) {
            this.shouldShowGPSAccessModal(false);
        }
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude, isInitialLocationFetched: true });
    }
    geoLocationCommonFailureCallback(e) {
        if (
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_1 ||
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_2 ||
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_3 ||
            e.message === PERMISSION_CONSTANTS.NO_GPS_MESSAGE_4
        ) {
            this.setState({ showEnableGPS: true });
        }
    }

    handlePinnedLocationForIOS() {
        GeolocationIOS.getCurrentPosition(
            (position) => {
                this.geoLocationCommonSuccessCallback(position);
            },
            (e) => {
                this.geoLocationCommonFailureCallback(e);
            },
            {
                enableHighAccuracy: true,
                // timeout: 5000,
                maximumAge: 10000,
                showLocationDialog: false
            }
        );
    }

    handlePinLocation() {
        if (Platform.OS === 'ios') {
            this.handlePinnedLocationForIOS();
        } else {
            this.handlePinnedLocationForAndroid();
        }
    }

    handlePinnedLocationForAndroid() {
        Geolocation.getCurrentPosition(
            (position) => {
                this.geoLocationCommonSuccessCallback(position);
            },
            (e) => {
                this.geoLocationCommonFailureCallback(e);
            },
            {
                enableHighAccuracy: false,
                showLocationDialog: false
            }
        );
    }

    /**
     * this is for showing back the Order Type Selection Modal
     */
    showOrderTypeSelectionModal() {
        const { route } = this.props;
        const { params } = isValidElement(route) && route;
        const { setModalVisibleState } = isValidElement(params) && params;
        if (isValidElement(setModalVisibleState)) {
            this.props.route.params.setModalVisibleState(true);
        }
    }

    handleGoBack() {
        this.showOrderTypeSelectionModal();
        if (NavigationService.navigationRef.current?.canGoBack()) {
            NavigationService.navigationRef.current?.goBack();
        }
        Analytics.logBackPress(ANALYTICS_SCREENS.ADDRESS_PICKER_MAP_CONTAINER);
    }

    handleConfirm() {
        // this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY);
        this.props.route.params.setModalVisibleState(true);
        if (NavigationService.navigationRef.current?.canGoBack()) {
            NavigationService.navigationRef.current?.goBack();
        }
        Analytics.logEvent(ANALYTICS_SCREENS.ADDRESS_PICKER_MAP_CONTAINER, ANALYTICS_EVENTS.ADDRESS_SELECTED_MAP_VIEW);
    }
}

export default CurrentLocationMapViewScreen;
