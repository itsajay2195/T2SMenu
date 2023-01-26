import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import React, { useCallback } from 'react';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import styles from '../../Style/SearchAddressStyle';
import { ADDRESS_FORM_TYPE, VIEW_ID } from '../../../AddressModule/Utils/AddressConstants';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import {
    getAddressFromLatLong,
    getAddressFromPlacesId,
    getAutoCompletePlaces,
    resetAddressFromLocationAction,
    resetAutoCompletePlaces,
    resetManualAddress
} from '../../../AddressModule/Redux/AddressAction';
import { redirectRouteAction } from '../../../../CustomerApp/Redux/Actions';
import { connect } from 'react-redux';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const AddAddressManual = ({
    screenName,
    resetAddressFromLocationAction,
    forSearchTA = false,
    isUserLoggedIn,
    redirectRouteAction,
    viewType = null
}) => {
    const onPress = useCallback(() => {
        resetManualAddress();
        if (isUserLoggedIn) {
            resetAddressFromLocationAction();
            handleNavigation(SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name, {
                viewType: forSearchTA ? ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY_ADD : isValidElement(viewType) ? viewType : ADDRESS_FORM_TYPE.ADD,
                forSearchTA: forSearchTA
            });
        } else {
            handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
            redirectRouteAction(SCREEN_OPTIONS.ADD_ADDRESS_FORM_SCREEN.route_name, {
                viewType: isValidElement(viewType) ? viewType : forSearchTA ? ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY_ADD : ADDRESS_FORM_TYPE.ADD,
                forSearchTA: forSearchTA
            });
        }
    }, [forSearchTA, isUserLoggedIn, redirectRouteAction, resetAddressFromLocationAction, viewType]);
    //Todo we need to updated  user logout flow
    if (isUserLoggedIn)
        return (
            <T2STouchableOpacity id={VIEW_ID.ADD_ADDRESS_VIEW} screenname={screenName} style={styles.addManualContainer} onPress={onPress}>
                <CustomIcon name={FONT_ICON.ADD_CIRCLE} size={24} style={styles.addManualIcon} />
                <T2SText screenName={screenName} id={VIEW_ID.ADD_MANUAL} style={styles.manualText}>
                    {LOCALIZATION_STRINGS.AddAddressManually + '...'}
                </T2SText>
            </T2STouchableOpacity>
        );
};

const mapStateToProps = (state) => ({
    suggestions: state.addressState.placesSuggestions,
    addressFromLocation: state.addressState.addressFromLocation,
    currentLocation: state.addressState.currentLocation,
    addressResponse: state.addressState.addressResponse,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    s3ConfigResponse: state.appState.s3ConfigResponse,
    addressCurrentLocation: state.takeawayListReducer.addressCurrentLocation,
    isUserLoggedIn: selectHasUserLoggedIn(state)
});

const mapDispatchToProps = {
    getAutoCompletePlaces,
    resetAutoCompletePlaces,
    resetAddressFromLocationAction,
    getAddressFromPlacesId,
    getAddressFromLatLong,
    redirectRouteAction,
    resetManualAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AddAddressManual));
