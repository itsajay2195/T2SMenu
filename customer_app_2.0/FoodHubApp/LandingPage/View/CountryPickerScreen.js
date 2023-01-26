import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../Styles/LandingPageStyle';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { changeCountryConfig, resetUnsupportedCountryResponseAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { getTakeawayCountryId, isValidElement } from 't2sbasemodule/Utils/helpers';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { resetStoreIDAction, resetTakeawaysOnCountrySwitchAction } from '../../TakeawayListModule/Redux/TakeawayListAction';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { resetTextInputState } from '../../HomeModule/Redux/HomeAction';
import Flag from 'react-native-flags';
import { deleteCartAction } from 'appmodules/BasketModule/Redux/BasketAction';
let screenName = SCREEN_OPTIONS.COUNTRY_PICKER.route_name;

class CountryPickerScreen extends Component {
    state = {
        selectedCountryId: getTakeawayCountryId(this.props.countryId)
    };

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.COUNTRY_SELECTION);
    }

    render() {
        const { countryList } = this.props;
        return (
            <BaseComponent title={LOCALIZATION_STRINGS.CHOOSE_COUNTRY} showHeader={true} showElevation={true} showCommonActions={false}>
                <T2SView style={[styles.container, styles.countriesListContainer]}>
                    {isValidElement(countryList) && isValidElement(countryList.data) ? (
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            data={countryList.data}
                            renderItem={({ item }) => {
                                return this.renderCountryItem(item);
                            }}
                        />
                    ) : null}
                </T2SView>
            </BaseComponent>
        );
    }

    handleCountrySelection(data) {
        if (isValidElement(data)) {
            const { countryId, basketStoreID } = this.props;
            const { id, name, flag } = data;
            Analytics.logEvent(ANALYTICS_SCREENS.COUNTRY_SELECTION, ANALYTICS_EVENTS.COUNTRY_CLICKED, {
                country_name: name
            });
            Analytics.setUserId(ANALYTICS_EVENTS.COUNTRY, name);
            if (getTakeawayCountryId(countryId) !== id) {
                this.props.deleteCartAction({ basketStoreID: basketStoreID });
            }
            this.props.resetUnsupportedCountryResponseAction();
            this.props.resetTakeawaysOnCountrySwitchAction();
            this.props.resetStoreIDAction();
            this.setState({ selectedId: id });
            this.props.changeCountryConfig(flag, name);
            this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
            this.props.resetTextInputState();
            handleNavigation(SCREEN_OPTIONS.HOME.route_name);
        }
    }

    renderCountryItem(data) {
        return (
            <T2STouchableOpacity accessible={false} onPress={this.handleCountrySelection.bind(this, data)}>
                <View style={styles.countryPickerItemContainer}>
                    <Flag style={styles.countryItemIcon} code={data.iso} size={32} />
                    <T2SText screenName={screenName} id={data.name} style={styles.countryItemTxt}>
                        {data.name}
                    </T2SText>
                    {getTakeawayCountryId(this.props.countryId) === data.id && (
                        <T2SIcon style={styles.tickIconStyle} color={Colors.primaryColor} icon={FONT_ICON.TICK} size={20} />
                    )}
                </View>
            </T2STouchableOpacity>
        );
    }
}

const mapStateToProps = (state) => ({
    countryList: state.landingState.countryList,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    basketStoreID: state.basketState.storeID
});

const mapDispatchToProps = {
    changeCountryConfig,
    resetStoreIDAction,
    setSideMenuActiveAction,
    resetUnsupportedCountryResponseAction,
    resetTakeawaysOnCountrySwitchAction,
    resetTextInputState,
    deleteCartAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryPickerScreen);
