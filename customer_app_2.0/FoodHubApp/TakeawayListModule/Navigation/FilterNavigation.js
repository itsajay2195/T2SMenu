import React from 'react';
import CuisinesScreen from '../View/Cuisines/CuisinesScreen';
import { TabNavigatorStyle } from '../Style/TabNavigatoreStyle';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { connect } from 'react-redux';
import {
    resetAction,
    setFilterType,
    setTakeawayScrollTop,
    sortBasedOnCuisines,
    takeawayListAction,
    updateCheckedCuisines,
    updateAdvancedCheckedCuisines,
    resetAdvanceFilterAction,
    resetAdvanceFilter,
    filterTARecomendation
} from '../Redux/TakeawayListAction';
import { SCREEN_NAME, VIEW_ID } from '../Utils/Constants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { View, BackHandler, ScrollView } from 'react-native';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { getFilterCuisinesList, updateFilterType } from '../Utils/Helper';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { handleSortByFilterTypeText } from '../Utils/SortByList';
import FilterCategoryList from '../View/Cuisines/FilterCategoryList';
import { selectCuisineSelected, selectFilterList, selectFilterType, selectSelectedCuisinesList } from '../Redux/TakeawayListSelectors';
import { selectOrderType } from 'appmodules/OrderManagementModule/Redux/OrderManagementSelectors';

class FilterTakeawayTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleLeftActionPress = this.handleLeftActionPress.bind(this);
        this.handleShowCuisineAction = this.handleShowCuisineAction.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.setFilterList = this.setFilterList.bind(this);
    }
    state = {
        previousSelectedCuisines: [],
        previousSelectedFilterType: null,
        defaultFilterType: null,
        filterList: [],
        selectedCuisineName: null,
        homeScreenFilter: false
    };

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.TAKEAWAY_FILTER);
        const cuisines = this.props.cuisinesSelected;
        const { route, filterList, filterType } = this.props;

        if (isValidElement(route) && isValidElement(route.params)) {
            this.setState({
                selectedCuisineName: route.params.selectedCuisineName,
                homeScreenFilter: route.params.homeScreenFilter
            });
        }
        this.setState({
            previousSelectedCuisines: isValidElement(cuisines) ? [...cuisines] : [],
            previousSelectedFilterType: isValidElement(filterType) ? filterType : null,
            defaultFilterType: updateFilterType(this.props.listDetails),
            filterList: isValidElement(filterList) ? [...filterList] : []
        });

        this.addEventListeners();
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        const { selectedCuisines, homeScreenFilter } = this.props;
        if (
            isValidElement(selectedCuisines) &&
            isArrayNonEmpty(prevProps.selectedCuisines) &&
            selectedCuisines.length === 0 &&
            !homeScreenFilter
        ) {
            this.props.updateCheckedCuisines(selectedCuisines);
        }
    }
    addEventListeners() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleLeftActionPress.bind(this, true));
        });
    }

    removeEventListener() {
        if (isValidElement(this.focusListener)) {
            this.props.navigation.removeListener(this.focusListener);
        }
        if (isValidElement(this.backHandler)) {
            this.backHandler.remove();
        }
    }

    isCuisinesUpdated = createSelector(
        [(state, props) => state.previousSelectedCuisines, (state, props) => props.selectedCuisines],
        (previousSelectedCuisines, selectedCuisines) =>
            !_.isEqual(
                _.sortBy(isValidElement(previousSelectedCuisines) ? previousSelectedCuisines : []),
                _.sortBy(isValidElement(selectedCuisines) ? selectedCuisines : [])
            )
    );

    isFilterTypeUpdated = (stateFilterType, propsFilterType) => {
        return isValidElement(stateFilterType) && isValidElement(propsFilterType) && stateFilterType !== propsFilterType;
    };

    isFilterListUpdated = (stateFilterList, propsFilterList) => {
        return (
            isValidElement(stateFilterList) &&
            isValidElement(propsFilterList) &&
            JSON.stringify(stateFilterList) !== JSON.stringify(propsFilterList)
        );
    };

    renderHeaderIconsActions() {
        const { selectedCuisines, filterType } = this.props;
        let minimumCount = 0;
        return (
            <T2SView style={{ flexDirection: 'row' }}>
                {(this.state.defaultFilterType !== filterType ||
                    (isValidElement(selectedCuisines) && selectedCuisines.length > minimumCount) ||
                    isArrayNonEmpty(this.state.filterList)) && (
                    <T2STouchableOpacity onPress={this.resetFilters}>
                        <T2SText id={VIEW_ID.RESET_BUTTON} style={TabNavigatorStyle.resetIconStyle}>
                            {LOCALIZATION_STRINGS.RESET}
                        </T2SText>
                    </T2STouchableOpacity>
                )}
            </T2SView>
        );
    }

    resetFilters() {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_FILTER, ANALYTICS_EVENTS.RESET_FILTER_CLICKED);
        if (this.props.homeScreenFilter) {
            this.props.resetAdvanceFilterAction();
        } else {
            this.props.resetAction();
        }
        this.setState({ previousSelectedCuisines: [], filterList: [] });
        this.sortCuisinesAction();
    }

    sortCuisinesAction(filterList = []) {
        const {
            filterType,
            selectedCuisines,
            takeAwayList,
            homeScreenFilter,
            selectedAdvancedFilterName,
            selectedTAOrderType,
            selectedPostcode,
            taRecommendation
        } = this.props;

        this.props.sortBasedOnCuisines(
            selectedCuisines,
            takeAwayList,
            filterType,
            selectedPostcode,
            filterList,
            homeScreenFilter,
            selectedAdvancedFilterName,
            selectedTAOrderType,
            taRecommendation
        );
    }

    handleSubmitData(isBackHandler = false) {
        const { filterType, selectedCuisines, takeAwayList, homeScreenFilter, taRecommendation } = this.props;
        if (isValidElement(filterType) && isValidElement(takeAwayList)) {
            Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_FILTER, ANALYTICS_EVENTS.FILTER_SUBMIT_CLICKED, {
                cuisinesSelected: selectedCuisines,
                filterApplied: filterType
            });
            if (homeScreenFilter) {
                this.props.updateAdvancedCheckedCuisines(selectedCuisines, this.state.filterList);
            } else {
                this.props.updateCheckedCuisines(selectedCuisines, this.state.filterList);
            }
            this.sortCuisinesAction(this.state.filterList);
        }
        this.props.setTakeawayScrollTop(true);
        this.props.filterTARecomendation(taRecommendation, filterType);
        if (!isBackHandler) {
            this.props.navigation.goBack();
        }
    }
    filterTitle() {
        return (
            <View style={TabNavigatorStyle.titleViewStyle}>
                <T2SText style={TabNavigatorStyle.titleTextStyle} screenName={SCREEN_NAME.NAVIGATOR_SCREEN} id={VIEW_ID.FILTER_TITLE}>
                    {LOCALIZATION_STRINGS.SORT_AND_FILTER}
                </T2SText>
            </View>
        );
    }

    handleLeftActionPress(isBackhandler = false) {
        const { homeScreenFilter, advancedFilterList, filterList, advancedFilterType, filterType } = this.props;
        let filterListValue = homeScreenFilter ? advancedFilterList : filterList;
        let filterTypeValue = homeScreenFilter ? advancedFilterType : filterType;
        if (
            this.isCuisinesUpdated(this.state, this.props) ||
            this.isFilterTypeUpdated(this.state.previousSelectedFilterType, filterTypeValue) ||
            this.isFilterListUpdated(this.state.filterList, filterListValue)
        ) {
            this.handleSubmitData(isBackhandler);
        } else {
            if (!isBackhandler) this.props.navigation.goBack();
        }
    }

    isCuisinesAvailable() {
        const { homeScreenFilter, takeAwayList, selectedAdvancedFilterName, cuisines } = this.props;
        let cuisinesList = homeScreenFilter ? getFilterCuisinesList(takeAwayList, selectedAdvancedFilterName, cuisines) : cuisines;
        return isArrayNonEmpty(cuisinesList);
    }

    setFilterList(filter) {
        this.setState({ filterList: filter });
    }
    render() {
        return (
            <BaseComponent
                showElevation={true}
                screenName={SCREEN_NAME.NAVIGATOR_SCREEN}
                id={VIEW_ID.HEADER_TITLE}
                customView={this.filterTitle()}
                actions={this.renderHeaderIconsActions()}
                showCommonActions={false}
                icon={FONT_ICON.BACK}
                showHeader={true}
                navigation={this.props.navigation}
                handleLeftActionPress={this.handleLeftActionPress.bind(this, false)}>
                <ScrollView>
                    <FilterCategoryList filterList={this.state.filterList} onFilterList={this.setFilterList} />
                    {this.isCuisinesAvailable() ? (
                        <CuisinesScreen
                            route={this.props.route}
                            navigation={this.props.navigation}
                            isFullScreenMode={false}
                            selectedCuisineName={this.state.selectedCuisineName}
                            showCuisineScreen={this.handleShowCuisineAction}
                        />
                    ) : null}
                    {this.renderSortByLabel()}
                </ScrollView>
            </BaseComponent>
        );
    }

    handleShowCuisineAction() {
        handleNavigation(SCREEN_OPTIONS.CUISINES_SCREEN.route_name, {
            isFullScreenMode: true
        });
    }

    renderSortByLabel() {
        return (
            <T2STouchableOpacity
                screenName={SCREEN_NAME.NAVIGATOR_SCREEN}
                id={VIEW_ID.SORT_BY_VIEW_TOUCHABLE}
                onPress={() => handleNavigation(SCREEN_OPTIONS.SORT_BY_SCREEN.route_name)}
                accessible={false}>
                <View style={TabNavigatorStyle.rowStyle}>
                    <T2SText id={VIEW_ID.SORT_BY_LABEL} screenName={SCREEN_NAME.NAVIGATOR_SCREEN} style={TabNavigatorStyle.sortLabelStyle}>
                        {LOCALIZATION_STRINGS.SORT_BY}
                    </T2SText>
                    <T2SText id={VIEW_ID.SORT_BY} screenName={SCREEN_NAME.NAVIGATOR_SCREEN} style={TabNavigatorStyle.sortTypeText}>
                        {handleSortByFilterTypeText(this.props.filterType)}
                    </T2SText>
                    <T2SIcon
                        screenName={SCREEN_NAME.NAVIGATOR_SCREEN}
                        id={VIEW_ID.SORT_BY_ARROW_ICON}
                        style={TabNavigatorStyle.optionsIconStyle}
                        name={FONT_ICON.RIGHT_ARROW_2}
                        size={16}
                    />
                </View>
            </T2STouchableOpacity>
        );
    }

    componentWillUnmount() {
        if (isValidElement(this.timeout)) {
            clearTimeout(this.timeout);
        }
        this.removeEventListener();
    }
}

const mapStateToProps = (state) => ({
    takeAwayList: state.takeawayListReducer.takeawayList,
    filterType: selectFilterType(state),
    cuisinesSelected: selectCuisineSelected(state),
    listDetails: state.takeawayListReducer.listDetails,
    selectedCuisines: selectSelectedCuisinesList(state),
    filterList: selectFilterList(state),
    homeScreenFilter: state.takeawayListReducer.homeScreenFilter,
    selectedAdvancedFilterName: state.takeawayListReducer.selectedAdvancedFilterName,
    selectedOrderType: selectOrderType(state),
    oldFilterType: state.takeawayListReducer.filterType,
    advancedFilterType: state.takeawayListReducer.advancedFilterType,
    advancedFilterList: state.takeawayListReducer.advancedFilterList,
    cuisines: state.takeawayListReducer.cuisinesArray,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    selectedPostcode: state.takeawayListReducer.selectedPostcode,
    taRecommendation: state.takeawayListReducer.recommendationTA
});
const mapDispatchToProps = {
    resetAction,
    resetAdvanceFilterAction,
    takeawayListAction,
    sortBasedOnCuisines,
    setTakeawayScrollTop,
    setFilterType,
    updateCheckedCuisines,
    updateAdvancedCheckedCuisines,
    resetAdvanceFilter,
    filterTARecomendation
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterTakeawayTabBar);
