import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import {
    getFavouriteTakeawayAction,
    searchElementMethodAction,
    setTakeawayScrollTop,
    stopMenuLoaderAction,
    updateCheckedCuisines,
    updateHomeScreenStatusAction,
    updateSelectedCuisines,
    resetAdvanceFilter,
    filterTakeawayByOrderTypeAction,
    sortBasedOnCuisines
} from '../Redux/TakeawayListAction';
import { connect } from 'react-redux';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { isArrayNonEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { styles } from '../Style/TakeawaySearchListStyle';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { FILTER_TAKEAWAY_CONSTANTS, SCREEN_NAME, SEARCH_TYPE } from '../Utils/Constants';
import TakeawayListWidget from './Components/TakeawayListWidget';
import ViewCartButton from 'appmodules/BasketModule/View/Components/ViewCartButton';
import { redirectRouteAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import TakeawayErrorPage from './TakeawayErrorPage';
import TakeawayShimmer from './Components/TakeawayListShimmer';
import { FilterIconBadge, TakeawayListSearchBar } from './MicroComponents/ListSearchHeader';
import { SelectOrderTypeView } from './MicroComponents/SelectOrderTypeView';
import { selectedTAOrderTypeAction, updateNonBasketOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
import { selectCuisineSelected, selectFilterList, selectFilterType } from '../Redux/TakeawayListSelectors';
import { isOrderTypeToggleEnabled } from 'appmodules/BaseModule/GlobalAppHelper';
import { selectCountryBaseFeatureGateResponse } from 'appmodules/BasketModule/Redux/BasketSelectors';

const screenName = SCREEN_NAME.FILTERED_TAKEAWAY_LIST_SCREEN;
class CuisinesBasedList extends Component {
    constructor(props) {
        super(props);
        this.handleTextChanged = this.handleTextChanged.bind(this);
        this.handleLeftActionPress = this.handleLeftActionPress.bind(this);
        this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
        this.handleOnPress = this.handleOnPress.bind(this);
        this.clearIconOnPress = this.clearIconOnPress.bind(this);
        this.setFavoriteTACount = this.setFavoriteTACount.bind(this);
    }

    state = {
        textInputValue: null,
        favouriteTakeawaysCount: null,
        showClear: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.textInputValue !== nextState.textInputValue ||
            this.state.showClear !== nextState.showClear ||
            this.props.onlineTakeaways !== nextProps.onlineTakeaways ||
            this.props.preorderTakeaways !== nextProps.preorderTakeaways ||
            this.props.closedTakeaways !== nextProps.closedTakeaways ||
            this.props.filterType !== nextProps.filterType ||
            this.props.advancedSelectedCuisines !== nextProps.advancedSelectedCuisines ||
            this.props.advancedFilterList !== nextProps.advancedFilterList ||
            this.props.selectedTAOrderType !== nextProps.selectedTAOrderType
        );
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.TAKEAWAY_LIST);
        if (this.props.isMenuLoading) {
            this.props.stopMenuLoaderAction();
        }
        const { route } = this.props;
        if (isValidElement(route?.params?.searchText)) {
            this.setState({
                textInputValue: route.params.searchText
            });
        }
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
        });
    }
    componentWillUnmount() {
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
    }
    render() {
        const { takeawayList, takeawayGetSuccess, takeawayFetching, takeawaysCount, searchedTakeawayCount } = this.props;
        return (
            <BaseComponent
                showElevation={false}
                showCommonActions={false}
                showHeader={true}
                icon={FONT_ICON.BACK}
                customView={this.renderHeader()}
                handleLeftActionPress={this.handleLeftActionPress}>
                {takeawayFetching ? (
                    <TakeawayShimmer />
                ) : (takeawayGetSuccess && isValidElement(takeawayList) && takeawayList.length === 0) ||
                  (isValidElement(takeawaysCount) && takeawaysCount === 0) ? (
                    <TakeawayErrorPage />
                ) : (
                    <View style={styles.mainContainer}>
                        {this.renderSearchHeader()}
                        {isValidElement(searchedTakeawayCount) && searchedTakeawayCount === 0 ? (
                            <TakeawayErrorPage />
                        ) : (
                            this.renderTakeaway()
                        )}
                    </View>
                )}
            </BaseComponent>
        );
    }

    handleLeftActionPress() {
        this.props.resetAdvanceFilter();
        this.props.updateHomeScreenStatusAction(false, null);
        this.props.navigation.goBack();
    }

    renderTakeaway() {
        const {
            onlineTakeaways,
            preorderTakeaways,
            closedTakeaways,
            favouriteTakeaways,
            takeawayList,
            selectedTAOrderType,
            route,
            navigation,
            countryId
        } = this.props;
        return (
            <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContainer}>
                        {isArrayNonEmpty(takeawayList) && (
                            <TakeawayListWidget
                                favouriteTakeawaysCount={this.setFavoriteTACount}
                                favouriteTakeaways={favouriteTakeaways}
                                viewType={FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST}
                                onlineTakeaways={onlineTakeaways}
                                preorderTakeaways={preorderTakeaways}
                                closedTakeaways={closedTakeaways}
                                screenName={screenName}
                                navigation={navigation}
                                route={route}
                                orderType={selectedTAOrderType}
                                countryId={countryId}
                            />
                        )}
                    </View>
                </ScrollView>
                <ViewCartButton screenName={screenName} fromTakeawayList={true} handleBasketNavigation={true} />
            </>
        );
    }

    renderHeader() {
        const { route, advancedSelectedCuisines, advancedFilterList } = this.props;
        let showFilterCount = isArrayNonEmpty(advancedFilterList) || isArrayNonEmpty(advancedSelectedCuisines);

        let selectedCuisineName;
        if (isValidElement(route?.params?.selectedCuisines)) {
            selectedCuisineName = route.params.selectedCuisines;
        }
        const { selectedPostcode } = this.props;

        let badgeCount =
            (isValidElement(advancedSelectedCuisines) ? advancedSelectedCuisines.length : 0) +
            (isValidElement(advancedFilterList) ? advancedFilterList.length : 0);
        return (
            isValidString(selectedCuisineName) && (
                <T2SView style={styles.headerContentTop}>
                    <T2SText style={styles.headerAppStyle}>{selectedPostcode}</T2SText>
                    <FilterIconBadge
                        cuisineName={selectedCuisineName}
                        showFilterCount={showFilterCount}
                        handleOnPress={this.handleOnPress}
                        badgeCount={badgeCount}
                        screenName={screenName}
                    />
                </T2SView>
            )
        );
    }

    handleOnPress(name) {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.FILTER_ICON_PRESS);
        handleNavigation(SCREEN_OPTIONS.FILTER_SCREEN.route_name, {
            homeScreenFilter: true,
            selectedCuisineName: name
        });
    }

    renderSearchHeader() {
        const { selectedTAOrderType, countryId, featureGateResponse } = this.props;
        return (
            <T2SView style={styles.headerContentSearchBar}>
                <TakeawayListSearchBar
                    screenName={screenName}
                    textInputValue={this.state.textInputValue}
                    clearIconPress={this.clearIconOnPress}
                    onChangeText={this.handleTextChanged}
                    showClearIcon={this.state.showClear}
                />
                {isOrderTypeToggleEnabled(countryId, featureGateResponse) && (
                    <SelectOrderTypeView screenName={screenName} orderType={selectedTAOrderType} onPress={this.handleOrderTypeChange} />
                )}
            </T2SView>
        );
    }

    setFavoriteTACount(value) {
        this.setState({ favouriteTakeawaysCount: value });
    }

    handleOrderTypeChange(orderType) {
        // TODO: multiple action called in same function, Need to optimise it.
        const { takeawayList } = this.props;
        this.props.selectedTAOrderTypeAction(orderType);
        this.props.updateNonBasketOrderType(orderType);
        this.props.filterTakeawayByOrderTypeAction(takeawayList, orderType);
        this.makeCuisineFilterCall(orderType);
    }

    makeCuisineFilterCall(orderType) {
        const {
            cuisinesSelected,
            takeawayList,
            filterType,
            filterList,
            homeScreenFilter,
            selectedAdvancedFilterName,
            isFromOfferList,
            offerValue,
            maxOfferValue
        } = this.props;
        this.props.sortBasedOnCuisines(
            cuisinesSelected,
            takeawayList,
            filterType,
            SEARCH_TYPE.POST_CODE,
            filterList,
            homeScreenFilter,
            selectedAdvancedFilterName,
            orderType
        );
        if (isFromOfferList) {
            this.props.getOfferBasedTakeawayListAction(offerValue, maxOfferValue, orderType);
        }
    }

    clearIconOnPress() {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.ICON_CLEAR);
        this.handleTextChanged('');
    }

    handleTextChanged(value) {
        const { takeawayList, selectedOrderType } = this.props;
        this.setState({ textInputValue: value, showClear: isValidString(value) ? true : false });
        if (isValidElement(value)) {
            Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.SEARCH_TAKEAWAY);
            this.props.searchElementMethodAction(takeawayList, value, SEARCH_TYPE.TAKEAWAY_FILTER, selectedOrderType);
        }
    }
}
const mapStateToProps = (state) => ({
    takeawayList: state.takeawayListReducer.takeawayList,
    selectedPostcode: state.takeawayListReducer.selectedPostcode,
    onlineTakeaways: state.takeawayListReducer.advancedOnlineTakeaways,
    preorderTakeaways: state.takeawayListReducer.advancedPreorderTakeaways,
    closedTakeaways: state.takeawayListReducer.advancedClosedTakeaways,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    favouriteTakeaways: state.takeawayListReducer.favouriteTakeaways,
    takeawaysCount: state.takeawayListReducer.takeawaysCount,
    searchedTakeawayCount: state.takeawayListReducer.searchedTakeawayCount,
    selectedAdvancedFilterName: state.takeawayListReducer.selectedAdvancedFilterName,
    filterType: selectFilterType(state),
    cuisinesSelected: selectCuisineSelected(state),
    filterList: selectFilterList(state),
    listDetails: state.takeawayListReducer.listDetails,
    takeawayGetSuccess: state.takeawayListReducer.takeawayGetSuccess,
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    takeawayFetching: state.takeawayListReducer.takeawayFetching,
    advancedSelectedCuisines: state.takeawayListReducer.advancedSelectedCuisines,
    advancedFilterList: state.takeawayListReducer.advancedFilterList,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    countryName: state.appState.s3ConfigResponse?.country?.name,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    homeScreenFilter: state.takeawayListReducer.homeScreenFilter,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    featureGateResponse: selectCountryBaseFeatureGateResponse(state)
});

const mapDispatchToProps = {
    searchElementMethodAction,
    getFavouriteTakeawayAction,
    stopMenuLoaderAction,
    setTakeawayScrollTop,
    redirectRouteAction,
    setSideMenuActiveAction,
    updateCheckedCuisines,
    updateHomeScreenStatusAction,
    updateSelectedCuisines,
    resetAdvanceFilter,
    updateNonBasketOrderType,
    selectedTAOrderTypeAction,
    filterTakeawayByOrderTypeAction,
    sortBasedOnCuisines
};
export default connect(mapStateToProps, mapDispatchToProps)(CuisinesBasedList);
