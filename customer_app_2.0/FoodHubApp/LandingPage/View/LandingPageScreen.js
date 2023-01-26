import React, { Component } from 'react';
import { FlatList, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../Styles/LandingPageStyle';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import Flag from 'react-native-flags';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { changeCountryConfig, resetUnsupportedCountryResponseAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { getTakeawayCountryId, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { AppConstants } from '../../../CustomerApp/Utils/AppContants';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import T2SImageBackground from 't2sbasemodule/UI/CommonUI/T2SImageBackground';
import { resetStoreIDAction, resetTakeawaysOnCountrySwitchAction } from '../../TakeawayListModule/Redux/TakeawayListAction';
import { VIEW_ID } from '../Utils/LandingPageConstants';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { resetBasket } from 'appmodules/BasketModule/Redux/BasketAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCountryList } from '../Utils/Helper';

class LandingPageScreen extends Component {
    state = {
        initAPIStatus: this.props.initAPIStatus,
        selectedCountryId: getTakeawayCountryId(this.props.countryId)
    };

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.LANDING_PAGE);
        Analytics.logEvent(ANALYTICS_SCREENS.LANDING_PAGE, ANALYTICS_EVENTS.SELECTED_COUNTRY, {
            country_code: this.props.countryISO
        });
        if (isValidElement(this.props.initAPIStatus) && this.props.initAPIStatus === AppConstants.AppInitializationStatus.COMPLETED) {
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (isValidElement(props.initAPIStatus) && props.initAPIStatus === AppConstants.AppInitializationStatus.COMPLETED) {
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
        }
    }

    render() {
        const { params } = this.props.route;
        const { countryList } = this.props;
        let countryObj = getCountryList(countryList);
        return this.props.initAPIStatus === AppConstants.AppInitializationStatus.SHOW_COUNTRY_PICK ? (
            <SafeAreaView style={styles.container}>
                <T2SView style={styles.imageContainer}>
                    <T2SImageBackground style={styles.backgroundImage} source={require('../Utils/Images/country_bg.jpg')}>
                        {/* showHeader means -> navigation drawer will come*/}
                        {isValidElement(params) && isValidElement(params.showHeader) && (
                            <T2SView style={styles.headerStyle}>
                                <T2SIcon
                                    style={styles.headerIconStyle}
                                    screenName={SCREEN_OPTIONS.LANDING.route_name}
                                    id={VIEW_ID.LEFT_BUTTON}
                                    icon={FONT_ICON.HAMBURGER}
                                    size={25}
                                    onPress={() => {
                                        Analytics.logEvent(ANALYTICS_SCREENS.LANDING_PAGE, ANALYTICS_EVENTS.HAMBURGER_ICON_CLICKED);
                                        this.props.navigation.toggleDrawer();
                                    }}
                                />
                            </T2SView>
                        )}
                    </T2SImageBackground>
                    <Image style={styles.foodHubLogoImage} source={require('../Utils/Images/logo_red.png')} resizeMode={'contain'} />
                    <T2SText style={styles.countryDescContainer}>
                        <T2SText style={styles.countryDesc}>{LOCALIZATION_STRINGS.WE_DONT_CHARGE_ANY_COMMISSION}</T2SText>
                        <T2SText style={[styles.countryDesc, styles.boldText]}>{LOCALIZATION_STRINGS.EXC_DISCOUNT}</T2SText>
                        <T2SText style={styles.countryDesc}>{' ' + LOCALIZATION_STRINGS.AND + ' '}</T2SText>
                        <T2SText style={[styles.countryDesc, styles.boldText]}>{LOCALIZATION_STRINGS.OFFERS}</T2SText>
                        <T2SText style={styles.countryDesc}>{LOCALIZATION_STRINGS.NOW_ORDER_YOUR_FAVORITE_FOOD}</T2SText>
                    </T2SText>
                </T2SView>
                <T2SView style={styles.countriesContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <T2SView>
                            <T2SText style={styles.countryHeader}>{LOCALIZATION_STRINGS.SELECT_COUNTRY}</T2SText>
                            {isValidElement(countryObj) && (
                                <FlatList
                                    style={styles.countryListStyle}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    data={countryObj}
                                    renderItem={({ item, index }) => {
                                        return this.renderCountryItem(item, index < countryObj.length - 1, true);
                                    }}
                                />
                            )}
                        </T2SView>
                    </ScrollView>
                </T2SView>
            </SafeAreaView>
        ) : // <FHSplashComponent />
        null;
    }

    renderCountryItem(data, showDivider, clickable) {
        return (
            <T2STouchableOpacity
                disabled={!clickable}
                accessible={false}
                onPress={() => {
                    if (isValidElement(data)) {
                        Analytics.logEvent(ANALYTICS_SCREENS.LANDING_PAGE, ANALYTICS_EVENTS.COUNTRY_CLICKED, { country_name: data.name });
                        if (isValidString(this.state.selectedCountryId) && this.state.selectedCountryId !== data.id) {
                            this.props.resetBasket();
                        }
                        this.props.resetUnsupportedCountryResponseAction();
                        this.props.resetTakeawaysOnCountrySwitchAction();
                        this.props.resetStoreIDAction();
                        this.setState({ selectedCountryId: data.id });
                        this.props.changeCountryConfig(data.key, data.name);
                        this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
                        handleNavigation(SCREEN_OPTIONS.HOME.route_name);
                    }
                }}>
                <T2SView style={[styles.countryItemContainer, showDivider ? styles.countryItemDivider : null]}>
                    <Flag style={styles.countryItemIcon} code={data.iso} size={32} />
                    <T2SText
                        id={VIEW_ID.COUNTRY_SELECTION + '_' + data.name}
                        screenName={SCREEN_OPTIONS.LANDING.route_name}
                        style={styles.countryItemTxt}>
                        {data.name}
                    </T2SText>
                    {getTakeawayCountryId(this.props.countryId) === data.id && (
                        <T2SIcon
                            id={VIEW_ID.ICON_TICK + '_' + data.name}
                            screenName={SCREEN_OPTIONS.LANDING.route_name}
                            color={Colors.primaryColor}
                            icon={FONT_ICON.TICK}
                            style={styles.tickIconStyle}
                            size={20}
                        />
                    )}
                </T2SView>
            </T2STouchableOpacity>
        );
    }
}

const mapStateToProps = (state) => ({
    countryId: state.appState.s3ConfigResponse?.country?.id,
    defaultLanguage: state.appState.s3ConfigResponse?.language?.default,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    initAPIStatus: state.appState.initAPIStatus,
    countryList: state.landingState.countryList
});

const mapDispatchToProps = {
    changeCountryConfig,
    resetStoreIDAction,
    setSideMenuActiveAction,
    resetUnsupportedCountryResponseAction,
    resetTakeawaysOnCountrySwitchAction,
    resetBasket
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPageScreen);
