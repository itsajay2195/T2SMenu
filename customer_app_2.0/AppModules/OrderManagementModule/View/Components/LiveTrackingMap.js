import React, { Component } from 'react';
import { Image, Platform, View } from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
// Component and Widgets Import
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
// Styles Import
import styles from '../../View/Styles/OrderStatusStyle';
// Constants and Strings Import
import { MARKER_ANIMATION_TIMEOUT, SCREEN_NAME, VIEW_ID } from '../../Utils/OrderManagementConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import LIVE_TRACKING_MAP_CONFIG from '../../Utils/MapConfig';
// Action and Helpers Import
import * as OrderManagementHelper from '../../Utils/OrderManagementHelper';
import { isValidElement, safeIntValue } from 't2sbasemodule/Utils/helpers';
import { T2SIcon, T2STouchableOpacity } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';

// import Colors from 't2sbasemodule/Themes/Colors';

let animateTimer = null;
class LiveTrackingMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markerRotation: LIVE_TRACKING_MAP_CONFIG.MARKER_ROTATION_ANGLE,
            takeAwayDetails: null,
            deliveryDetails: null,
            driverDetails: null,
            // travelledLocations: [],
            currentCoordinate: null,
            lastDriverLocation: null,
            showLocationResetButton: false
        };
        this.handleDriverMarkerAnimation = this.handleDriverMarkerAnimation.bind(this);
        this.feedDataForAnimation = this.feedDataForAnimation.bind(this);
        this.updateMapToFitWithMarkers = this.updateMapToFitWithMarkers.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps) {
            const previousDetails = prevProps.trackingData.driverDetails;
            const currentDetails = this.props.trackingData.driverDetails;
            if (previousDetails && currentDetails) {
                if (
                    previousDetails &&
                    currentDetails &&
                    isValidElement(previousDetails.locations) &&
                    this.checkIsLocationUpdated(previousDetails.locations, currentDetails.locations)
                ) {
                    this.feedDataForAnimation();
                }
            }
        }
    }

    checkIsLocationUpdated(previous, current) {
        if (isValidElement(previous) && isValidElement(current)) {
            return previous[0].latitude !== current[0].latitude;
        }
    }

    componentDidMount() {
        this.updateDataFromProps();
    }

    componentWillUnmount() {
        if (animateTimer) clearTimeout(animateTimer);
    }

    updateDataFromProps() {
        const { driverDetails } = this.props.trackingData;
        if (isValidElement(driverDetails) && isValidElement(driverDetails.locations) && driverDetails.locations.length > 0) {
            this.setState(
                () => ({
                    currentCoordinate: new AnimatedRegion({
                        ...driverDetails.locations[0],
                        latitudeDelta: LIVE_TRACKING_MAP_CONFIG.LATITUDE_DELTA,
                        longitudeDelta: LIVE_TRACKING_MAP_CONFIG.LONGITUDE_DELTA
                    })
                }),
                () => {
                    this.feedDataForAnimation();
                }
            );
        }
    }

    render() {
        const { takeAwayDetails, deliveryDetails, driverDetails } = this.props.trackingData;
        if (!OrderManagementHelper.checkDetailsAreValid(takeAwayDetails, deliveryDetails)) {
            return (
                <View style={styles.mapViewContainer}>
                    <T2SText
                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                        id={VIEW_ID.MAP_LOADING_ERROR_MESSAGE}
                        style={styles.loadMapErrorMessage}>
                        {LOCALIZATION_STRINGS.LOAD_MAP_ERROR_MESSAGE}
                    </T2SText>
                </View>
            );
        } else {
            return (
                <View style={styles.mapViewContainer}>
                    <MapView
                        ref={(map) => (this.map = map)}
                        style={styles.liveTrackingMap}
                        scrollEnabled={true}
                        zoomTapEnabled={false}
                        initialRegion={{
                            latitude: deliveryDetails.latLng.latitude,
                            longitude: deliveryDetails.latLng.longitude,
                            latitudeDelta: LIVE_TRACKING_MAP_CONFIG.LATITUDE_DELTA,
                            longitudeDelta: LIVE_TRACKING_MAP_CONFIG.LONGITUDE_DELTA
                        }}
                        mapPadding={
                            Platform.OS === 'android'
                                ? LIVE_TRACKING_MAP_CONFIG.ANDROID_EDGE_PADDING
                                : LIVE_TRACKING_MAP_CONFIG.IOS_EDGE_PADDING
                        }
                        moveOnMarkerPress={false}
                        onPanDrag={() => {
                            if (!this.state.showLocationResetButton) this.setState({ showLocationResetButton: true });
                        }}
                        onMapReady={() => {
                            this.updateMapToFitWithMarkers([VIEW_ID.HOME_MARKER, VIEW_ID.DRIVER_MARKER]);
                        }}>
                        <Marker
                            coordinate={deliveryDetails.latLng}
                            identifier={VIEW_ID.HOME_MARKER}
                            title={deliveryDetails.name}
                            zIndex={1}>
                            <Image
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                id={VIEW_ID.HOME_MARKER_IMAGE}
                                source={require('../../Images/HomeMarker.png')}
                            />
                        </Marker>
                        <Marker
                            coordinate={takeAwayDetails.latLng}
                            identifier={VIEW_ID.TAKEAWAY_MARKER}
                            title={takeAwayDetails.name}
                            zIndex={1}>
                            <T2SImage
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                id={VIEW_ID.TAKEAWAY_MARKER_IMAGE}
                                source={require('../../Images/TakeawayMarker.png')}
                            />
                        </Marker>
                        {isValidElement(driverDetails) &&
                            isValidElement(driverDetails.locations) &&
                            driverDetails.locations.length > 0 &&
                            this.state.currentCoordinate &&
                            (Platform.OS === 'android' ? (
                                <Marker
                                    ref={(driverMarker) => {
                                        this.driverMarker = driverMarker;
                                    }}
                                    coordinate={
                                        isValidElement(this.state.lastDriverLocation)
                                            ? this.state.lastDriverLocation
                                            : driverDetails.locations[0]
                                    }
                                    identifier={VIEW_ID.DRIVER_MARKER}
                                    flat={true}
                                    zIndex={2}
                                    rotation={this.state.markerRotation}>
                                    <T2SImage
                                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                        id={VIEW_ID.DRIVER_MARKER_IMAGE}
                                        source={require('../../Images/Car.png')}
                                    />
                                </Marker>
                            ) : (
                                <Marker.Animated
                                    ref={(driverMarker) => {
                                        this.driverMarker = driverMarker;
                                    }}
                                    coordinate={this.state.currentCoordinate}
                                    identifier={VIEW_ID.DRIVER_MARKER}
                                    flat={true}
                                    zIndex={2}
                                    rotation={this.state.markerRotation}>
                                    <T2SImage
                                        screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                        id={VIEW_ID.DRIVER_MARKER_IMAGE}
                                        source={require('../../Images/Car.png')}
                                    />
                                </Marker.Animated>
                            ))}
                        {/*
                        // TODO As we don't have polyline in existing FoodHub app and we have a known issue with line drawing, we are commenting this feature for now.
                        {this.state.travelledLocations && (
                            <Polyline strokeColor={Colors.primaryColor} coordinates={this.state.travelledLocations} strokeWidth={8} />
                        {/*)}*/}
                    </MapView>
                    {this.state.showLocationResetButton && (
                        <View style={styles.resetLocationView}>
                            <T2STouchableOpacity
                                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                                id={VIEW_ID.RESET_LOCATION_ICON}
                                onPress={() => {
                                    this.setState({ showLocationResetButton: false });
                                    this.updateMapToFitWithMarkers([VIEW_ID.HOME_MARKER, VIEW_ID.DRIVER_MARKER]);
                                }}>
                                <T2SIcon style={styles.gpsIconStyle} color={Colors.blue} icon={FONT_ICON.GPS} size={30} />
                            </T2STouchableOpacity>
                        </View>
                    )}

                    {deliveryDetails.deliverySequence && this.renderDriverInfoMsgContainer(driverDetails, deliveryDetails.deliverySequence)}
                </View>
            );
        }
    }

    renderDriverInfoMsgContainer(driverDetails, deliverySequence) {
        return (
            <View style={styles.driverInfoContainer}>
                {isValidElement(driverDetails)
                    ? this.renderDriverPickedMessage(driverDetails, deliverySequence)
                    : this.renderDriverNotPickedMessage()}
            </View>
        );
    }

    renderDriverPickedMessage(driverDetails, deliverySequence) {
        return [
            <T2SImage
                screenName={SCREEN_NAME.ORDER_STATUS_SCREEN}
                id={VIEW_ID.DRIVER_IMAGE}
                key={VIEW_ID.DRIVER_IMAGE}
                style={styles.driverImageView}
                source={isValidElement(driverDetails.photo) ? { uri: driverDetails.photo } : require('../../Images/Avatar.png')}
            />,
            <View key={VIEW_ID.DRIVER_INFO_TEXT} style={styles.driverMessageContainer}>
                {safeIntValue(deliverySequence) === safeIntValue(driverDetails.currentSequence) ? (
                    <T2SText style={styles.driverInfoText} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.DRIVER_INFO_TEXT}>
                        <T2SText screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.DRIVER_NAME} style={styles.boldText}>
                            {driverDetails.name}
                        </T2SText>
                        {` ${LOCALIZATION_STRINGS.PICKED_YOUR_ORDER}`}
                    </T2SText>
                ) : (
                    <T2SText style={styles.driverInfoText} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.DRIVER_INFO_TEXT}>
                        <T2SText screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.DRIVER_NAME} style={styles.boldText}>
                            {driverDetails.name}
                        </T2SText>
                        {` ${LOCALIZATION_STRINGS.CURRENT_SEQUENCE} `}
                        <T2SText screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.CURRENT_SEQUENCE} style={styles.boldText}>
                            {OrderManagementHelper.appendOrdinals(driverDetails.currentSequence)}
                        </T2SText>
                        {` ${LOCALIZATION_STRINGS.DELIVERY_SEQUENCE} `}
                        <T2SText screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.DELIVERY_SEQUENCE} style={styles.boldText}>
                            {OrderManagementHelper.appendOrdinals(deliverySequence)}
                        </T2SText>
                        {` ${LOCALIZATION_STRINGS.WILL_REACH_SOON}`}
                    </T2SText>
                )}
            </View>
        ];
    }

    renderDriverNotPickedMessage() {
        return (
            <T2SText style={styles.driverInfoText} screenName={SCREEN_NAME.ORDER_STATUS_SCREEN} id={VIEW_ID.DRIVER_INFO_TEXT}>
                {LOCALIZATION_STRINGS.DRIVER_NOT_ASSIGNED}
            </T2SText>
        );
    }

    feedDataForAnimation() {
        const { driverDetails } = this.props.trackingData;
        const { lastDriverLocation } = this.state;
        let lastLatLngIndex = -1;
        if (lastDriverLocation !== null) {
            lastLatLngIndex = driverDetails.locations.findIndex((item) => {
                return item.latitude === lastDriverLocation.latitude && item.longitude === lastDriverLocation.longitude;
            });
        }
        if (isValidElement(driverDetails) && isValidElement(driverDetails.locations)) {
            let driverAnimateLocations;
            if (lastLatLngIndex > -1) {
                driverAnimateLocations = driverDetails.locations.slice(0, lastLatLngIndex + 1);
            } else {
                // TODO As we don't have polyline in existing FoodHub app and we have a known issue with line drawing, we are commenting this feature for now.
                /* this.setState(() => ({
                    travelledLocations: driverDetails.locations
                })); */
                driverAnimateLocations = driverDetails.locations[0];
            }
            this.handleDriverMarkerAnimation(driverAnimateLocations, lastLatLngIndex);
            this.setState(() => ({
                lastDriverLocation: driverDetails.locations[0]
            }));
        }
    }

    handleDriverMarkerAnimation(driverAnimateLocations, driverPositionIndex) {
        const { currentCoordinate } = this.state;
        if (driverPositionIndex > 0 && currentCoordinate) {
            let timeFraction = 0.05;
            const startLocation = driverAnimateLocations[driverPositionIndex];
            const endLocation = driverAnimateLocations[driverPositionIndex - 1];
            const bearingAngle = OrderManagementHelper.bearingBetweenLocations(startLocation, endLocation);
            this.setState({
                markerRotation: bearingAngle
            });

            const animateMarker = () => {
                const interpolatePos = OrderManagementHelper.getLatLngInterpolatePos(timeFraction, startLocation, endLocation);
                // TODO As we don't have polyline in existing FoodHub app and we have a known issue with line drawing, we are commenting this feature for now.
                /*this.setState((prevState) => ({
                    travelledLocations: [...prevState.travelledLocations, interpolatePos]
                }));*/
                if (Platform.OS === 'android') {
                    if (this.driverMarker) {
                        this.driverMarker.animateMarkerToCoordinate(interpolatePos, LIVE_TRACKING_MAP_CONFIG.MARKER_ANIMATION_TIME);
                    }
                } else {
                    currentCoordinate.timing(interpolatePos).start();
                }

                this.updateMapToFitWithMarkers([VIEW_ID.HOME_MARKER, VIEW_ID.DRIVER_MARKER]);
                timeFraction += Math.random() * (0.25 - 0) + 0;
                if (timeFraction < 1) {
                    animateTimer = setTimeout(() => {
                        animateMarker();
                    }, MARKER_ANIMATION_TIMEOUT);
                } else {
                    this.handleDriverMarkerAnimation(driverAnimateLocations, driverPositionIndex - 1);
                }
            };

            animateMarker();
        }
    }

    updateMapToFitWithMarkers(markersList) {
        if (isValidElement(this.map)) {
            this.map.fitToSuppliedMarkers(markersList, {
                edgePadding:
                    Platform.OS === 'android' ? LIVE_TRACKING_MAP_CONFIG.ANDROID_EDGE_PADDING : LIVE_TRACKING_MAP_CONFIG.IOS_EDGE_PADDING
            });
        }
    }
}

export default LiveTrackingMap;
