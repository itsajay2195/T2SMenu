import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { string, number } from 'prop-types';
import { styles } from '../styles/InformationStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/TakeawayDetailsConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import MapView, { Marker } from 'react-native-maps';
import { showMap } from '../../Utils/TakeawayDetailsHelper';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { getFormattedTAPhoneNumber, isValidString } from 't2sbasemodule/Utils/helpers';
import * as appHelper from 't2sbasemodule/Utils/helpers';

type Props = {};
export default class MapLocationComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this.handlePhoneNumberClickAction = this.handlePhoneNumberClickAction.bind(this);
        this.handleShowMapAction = this.handleShowMapAction.bind(this);
    }

    handlePhoneNumberClickAction(phoneNumber) {
        appHelper.callDialPad(phoneNumber);
    }

    handleShowMapAction() {
        const { lat, long } = this.props;
        showMap(lat, long);
    }

    render() {
        const { lat, long, address, screenName, storeConfigPhone, countryIso, isInternationalFormat } = this.props;
        const coordinate = { latitude: lat, longitude: long };
        const phoneNumber = getFormattedTAPhoneNumber(storeConfigPhone, countryIso, isInternationalFormat);
        return (
            <View>
                <T2SText id={VIEW_ID.MAP_LOCATION_TEXT} screenName={screenName} style={styles.sideHeading}>
                    {LOCALIZATION_STRINGS.LOCATION}
                </T2SText>
                <T2STouchableOpacity onPress={this.handleShowMapAction} id={VIEW_ID.MAP_ADDRESS} screenName={screenName}>
                    <T2SText id={VIEW_ID.MAP_ADDRESS} screenName={screenName} style={styles.address}>
                        {address}
                    </T2SText>
                </T2STouchableOpacity>
                {isValidString(storeConfigPhone) && (
                    <T2STouchableOpacity onPress={this.handlePhoneNumberClickAction.bind(this, phoneNumber)}>
                        <T2SText id={VIEW_ID.MAP_ADDRESS} screenName={screenName} style={styles.phone}>
                            {phoneNumber}
                        </T2SText>
                    </T2STouchableOpacity>
                )}
                <View style={styles.spacing2} />

                <MapView
                    onPress={this.handleShowMapAction}
                    style={styles.mapView}
                    initialRegion={{
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}>
                    <Marker coordinate={coordinate} onPress={this.handleShowMapAction}>
                        <Image resizeMode={'contain'} style={styles.mapPin} source={require('../../Images/Home.png')} />
                    </Marker>
                </MapView>
            </View>
        );
    }
}

MapLocationComponent.defaultProps = {
    screenName: '',
    lat: 0,
    long: 0,
    address: ''
};
MapLocationComponent.propTypes = {
    screenName: string.isRequired,
    lat: number,
    long: number,
    address: string
};
