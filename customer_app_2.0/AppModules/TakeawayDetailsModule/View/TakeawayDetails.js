import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles/InformationStyle';
import { T2SDivider, T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { SCREEN_NAME, VIEW_ID } from '../Utils/TakeawayDetailsConstants';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import DescriptionComponent from './components/DescriptionComponent';
import HygienicRatingWidget from './components/HygienicRatingWidget';
import T2SImageGalleryWidget from './components/T2SImageGalleryWidget';
import CuisinesGalleryWidget from './components/CuisinesGalleryWidget';
import OpenHours from 't2sbasemodule/UI/CustomUI/OpenHours/OpenHours';
import { getHygieneRatingAction, getTakeawayImageListAction, getStoreConfigAction } from '../Redux/TakeawayDetailsAction';
import { getFormattedTAPhoneNumber, isArrayNonEmpty, isUKTakeaway, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import MapLocationComponent from './components/MapLocationComponent';
import { getHygieneRatingStatus } from '../../BaseModule/Utils/FeatureGateHelper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import BaseComponent from '../../BaseModule/BaseComponent';
import { ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import * as Segment from '../../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../../AnalyticsModule/SegmentConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { getTakeawayAddress } from '../Utils/TakeawayDetailsHelper';
import { getCountryById } from '../../../FoodHubApp/LandingPage/Utils/Helper';
import * as appHelper from 't2sbasemodule/Utils/helpers';

const { ABOUT } = LOCALIZATION_STRINGS;
const screenName = SCREEN_NAME.INFORMATION;

class TakeawayDetails extends Component {
    state = {
        navIcon:
            isValidElement(this.props.route) &&
            isValidElement(this.props.route.params) &&
            isValidElement(this.props.route.params.isFromMenu) &&
            this.props.route.params.isFromMenu
                ? FONT_ICON.BACK
                : FONT_ICON.HAMBURGER,
        showDailyOpenHours: true
    };

    constructor(props) {
        super(props);
        this.callTakeaway = this.callTakeaway.bind(this);
        this.handleViewMoreLessAction = this.handleViewMoreLessAction.bind(this);
    }
    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.TAKEAWAY_DETAILS);
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.onScreenFocused();
        });
    }
    callTakeaway() {
        const { storeConfigPhone, countryBaseFeatureGateResponse, country_id, countryList, countryId } = this.props;
        const country = getCountryById(countryList, country_id);
        if (isValidElement(storeConfigPhone)) {
            const phoneNumber = getFormattedTAPhoneNumber(storeConfigPhone, country?.iso, countryId !== country?.id);
            appHelper.callDialPad(phoneNumber);
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.TA_CALLED, {
                source: 'takeaway_info_page'
            });
        }
    }
    onScreenFocused() {
        this.props.getStoreConfigAction();
        this.props.getTakeawayImageListAction();
        this.props.getHygieneRatingAction();
    }

    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }

    render() {
        const { storeConfigName, images } = this.props;
        let title = isValidElement(storeConfigName) ? storeConfigName : LOCALIZATION_STRINGS.ABOUT_US;
        return (
            <BaseComponent
                title={title}
                showHeader={true}
                icon={this.state.navIcon}
                showElevation={false}
                showZendeskChat={false}
                navigation={this.props.navigation}
                headerStyle={styles.headerShadowStyle}
                actions={[
                    <T2SIcon
                        key={FONT_ICON.CALL_FILLED}
                        icon={FONT_ICON.CALL_FILLED}
                        id={VIEW_ID.CALL_ICON}
                        screenName={screenName}
                        onPress={this.callTakeaway}
                        size={25}
                        style={styles.headerCallIcon}
                    />
                ]}>
                {isValidElement(storeConfigName) && this.renderTakeawayDetails(images)}
            </BaseComponent>
        );
    }

    renderTakeawayDetails(images) {
        const {
            storeConfigOpeningHours,
            storeConfigDescription,
            storeConfigLongitude,
            storeConfigLatitude,
            storeConfigCuisines,
            storeConfigPhone,
            country_id,
            countryList,
            countryId
        } = this.props;
        const country = getCountryById(countryList, country_id);
        const takeaway_address = getTakeawayAddress(this.props);
        return (
            <ScrollView {...setTestId(screenName, VIEW_ID.INFORMATION_BODY_SCROLLVIEW)}>
                {this.renderHeaderAndDescription(storeConfigDescription)}
                {this.renderGalleryWidget(images)}
                {this.renderOpeningHours(storeConfigOpeningHours)}
                {this.renderCuisines(storeConfigCuisines)}
                {this.renderHygieneRating()}
                {this.renderMapContainer(
                    storeConfigLatitude,
                    storeConfigLongitude,
                    takeaway_address,
                    storeConfigPhone,
                    country?.iso,
                    countryId !== country?.id
                )}
            </ScrollView>
        );
    }

    renderOpeningHours(opening_hours) {
        const { showDailyOpenHours } = this.state;
        if (isValidElement(opening_hours) && isValidElement(opening_hours.advanced)) {
            return (
                <T2SView>
                    <T2SText id={VIEW_ID.OPEN_HOURS_HEADING} screenName={screenName} style={styles.sideHeading}>
                        {LOCALIZATION_STRINGS.OPEN_HOURS}
                    </T2SText>
                    <OpenHours
                        openHoursData={opening_hours}
                        screenName={screenName}
                        showFullData={showDailyOpenHours}
                        id={VIEW_ID.OPEN_HOURS_VIEW}
                    />
                    <T2SView style={styles.viewMoreContainer}>
                        <T2STouchableOpacity onPress={this.handleViewMoreLessAction} id={VIEW_ID.VIEW_MORE} screenName={screenName}>
                            <T2SText style={styles.viewMoreStyle} id={VIEW_ID.VIEW_MORE} screenName={screenName}>
                                {showDailyOpenHours ? LOCALIZATION_STRINGS.VIEW_MORE : LOCALIZATION_STRINGS.VIEW_LESS}
                            </T2SText>
                        </T2STouchableOpacity>
                    </T2SView>
                    <T2SDivider style={styles.divider} />
                </T2SView>
            );
        }
    }

    handleViewMoreLessAction() {
        this.setState({ showDailyOpenHours: !this.state.showDailyOpenHours });
    }

    renderHeaderAndDescription(description) {
        return (
            <T2SView>
                <T2SText id={VIEW_ID.ABOUT_HEADING} screenName={screenName} style={styles.infoHeading}>
                    {ABOUT}
                </T2SText>
                <DescriptionComponent screenName={screenName} text={description} />
                <T2SDivider style={styles.divider} />
            </T2SView>
        );
    }

    renderHygieneRating() {
        if (isUKTakeaway(this.props.countryId) && getHygieneRatingStatus(this.props.countryBaseFeatureGateResponse)) {
            return (
                <T2SView>
                    <HygienicRatingWidget />
                    <T2SDivider style={styles.divider} />
                </T2SView>
            );
        }
    }

    renderCuisines(cuisines) {
        if (isArrayNonEmpty(cuisines)) {
            return (
                <T2SView>
                    <CuisinesGalleryWidget data={cuisines} />
                    <T2SDivider style={styles.divider} />
                </T2SView>
            );
        }
    }

    renderMapContainer(lat, lng, takeaway_address, storeConfigPhone, countryIso, isInternationalFormat) {
        let trimAddress = isValidString(takeaway_address) ? takeaway_address.replace(/,\s/g, '') : '';
        //to check if address string is valid
        if (isValidString(trimAddress)) {
            return (
                <T2SView>
                    <MapLocationComponent
                        screenName={screenName}
                        lat={Number(lat)}
                        long={Number(lng)}
                        address={takeaway_address}
                        storeConfigPhone={storeConfigPhone}
                        countryIso={countryIso}
                        isInternationalFormat={isInternationalFormat}
                    />
                </T2SView>
            );
        }
    }

    renderGalleryWidget(images) {
        return (
            isValidElement(images) &&
            images.length > 0 && (
                <T2SView>
                    <T2SImageGalleryWidget data={images} />
                    <View style={styles.spacing2} />
                    <T2SDivider style={styles.divider} />
                </T2SView>
            )
        );
    }
}

const mapStateToProps = ({ appState, takeawayDetailsState, landingState }) => ({
    countryId: appState.s3ConfigResponse?.country?.id,
    images: takeawayDetailsState.images,
    countryBaseFeatureGateResponse: appState.countryBaseFeatureGateResponse,
    storeConfigDescription: appState.storeConfigResponse?.description,
    storeConfigOpeningHours: appState.storeConfigResponse?.opening_hours,
    storeConfigNumber: appState.storeConfigResponse?.number,
    storeConfigAddress: appState.storeConfigResponse?.address,
    storeConfigCity: appState.storeConfigResponse?.city,
    storeConfigTown: appState.storeConfigResponse?.town,
    storeConfigStreet: appState.storeConfigResponse?.street,
    storeConfigPostcode: appState.storeConfigResponse?.postcode,
    storeConfigLatitude: appState.storeConfigResponse?.lat,
    storeConfigLongitude: appState.storeConfigResponse?.lng,
    storeConfigCuisines: appState.storeConfigResponse?.cuisines,
    storeConfigName: appState.storeConfigResponse?.name,
    storeConfigPhone: appState.storeConfigResponse?.phone,
    country_id: appState.storeConfigResponse?.country_id,
    countryList: landingState.countryList
});

const mapDispatchToProps = {
    getTakeawayImageListAction,
    getHygieneRatingAction,
    getStoreConfigAction
};

export default connect(mapStateToProps, mapDispatchToProps)(TakeawayDetails);
