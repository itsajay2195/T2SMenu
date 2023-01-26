import React from 'react';
import { FlatList, Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import styles from '../../Style/CuisinesStyles';
import {
    resetAdvanceCuisines,
    resetCuisines,
    searchElementMethodAction,
    updateCheckedCuisines,
    updateSelectedCuisines,
    sortBasedOnCuisines
} from '../../Redux/TakeawayListAction';
import { SEARCH_TYPE, VIEW_ID, LIMIT_DISCOUNT_VALUE_TO_DISPLAY } from '../../Utils/Constants';
import { isArrayNonEmpty, isEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import CuisinesRow from './CuisinesRow';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import _ from 'lodash';
import { T2SText } from 't2sbasemodule/UI';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { SortByStyles } from '../../Style/SortByScreenStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFilterCuisinesList, sortBySelectedCuisine } from '../../Utils/Helper';
import { selectCuisineSelected, selectFilterList, selectFilterType, selectSelectedCuisinesList } from '../../Redux/TakeawayListSelectors';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { CuisineSearchInput, CuisinesHeaderTitle, CuisinesSearchAndResetHeader } from '../MicroComponents/CuisinesSearchInput';

class CuisinesScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleShowMoreAction = this.handleShowMoreAction.bind(this);
        this.handleSearchButtonAction = this.handleSearchButtonAction.bind(this);
        this.handleLeftPressAction = this.handleLeftPressAction.bind(this);
        this.getCuisinesList = this.getCuisinesList.bind(this);
        this.handleSearchedItem = this.handleSearchedItem.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.clearIconOnPress = this.clearIconOnPress.bind(this);
        this.handleResetAction = this.handleResetAction.bind(this);
        this.searchRef = null;
        this.state = {
            textInputValue: null,
            checkBoxStatus: false,
            showClear: false,
            showMore: false,
            showSearch: false,
            isFullScreenModel: false,
            cuisinesList: null,
            isFromTakeawayList: false
        };
    }

    componentDidMount() {
        if (isValidElement(this.props.route) && isValidElement(this.props.route.params)) {
            const { isFullScreenMode, isFromTakeawayList } = this.props.route.params;
            this.setState({
                isFullScreenModel: isValidElement(isFullScreenMode) ? isFullScreenMode : false,
                isFromTakeawayList: isValidElement(isFromTakeawayList) ? isFromTakeawayList : false
            });
        }
        this.setState({
            cuisinesList: this.getCuisinesList()
        });
    }

    getCuisinesList() {
        let data;
        const {
            filteredCuisines,
            cuisines,
            homeScreenFilter,
            takeAwayList,
            selectedAdvancedFilterName,
            advancedCuisineSelected
        } = this.props;
        let isSearchCuisine = isValidString(this.state.textInputValue) && isValidElement(filteredCuisines);
        let isHomeScreenFilter = isValidString(homeScreenFilter) && homeScreenFilter;
        if (isSearchCuisine) {
            data = filteredCuisines;
        } else {
            data = isHomeScreenFilter
                ? sortBySelectedCuisine(getFilterCuisinesList(takeAwayList, selectedAdvancedFilterName, cuisines), advancedCuisineSelected)
                : isValidElement(cuisines) && _.sortBy(cuisines);
        }
        return data;
    }

    render() {
        let data = this.getCuisinesList();
        let isSearchCuisine = isValidString(this.state.textInputValue) && isValidElement(this.props.filteredCuisines);
        return isValidElement(data)
            ? isValidElement(this.state.isFullScreenModel) && this.state.isFullScreenModel
                ? this.contentWithSafeArea(data, isSearchCuisine)
                : this.contentWithOutSafeArea(data, isSearchCuisine)
            : null;
    }

    contentWithSafeArea(data, isSearchCuisine) {
        return (
            <SafeAreaView style={styles.topShadowContainer}>
                <T2SAppBar
                    handleLeftActionPress={this.handleLeftPressAction}
                    title={LOCALIZATION_STRINGS.CUISINES}
                    headerTextStyle={SortByStyles.headerTextStyle}
                    actions={this.renderCustomView()}
                />
                {isArrayNonEmpty(data) ? this.renderCuisineList(data, isSearchCuisine) : this.renderNoSearchResults()}
            </SafeAreaView>
        );
    }

    renderNoSearchResults() {
        return (
            <View style={SortByStyles.emptyMenuContainer}>
                <T2SText
                    screenName={SCREEN_OPTIONS.MENU_SCREEN.screen_title}
                    id={VIEW_ID.EMPTY_MENU_TEXT}
                    style={SortByStyles.emptyMenuText}>
                    {LOCALIZATION_STRINGS.EMPTY_SEARCH_RESULT}
                </T2SText>
            </View>
        );
    }

    handleLeftPressAction() {
        this.props.updateCheckedCuisines(this.props.selectedCuisines);
        if (isValidElement(this.state.isFromTakeawayList) && this.state.isFromTakeawayList) {
            const {
                selectedCuisines,
                takeAwayList,
                filterType,
                selectedPostcode,
                filterList,
                homeScreenFilter,
                selectedAdvancedFilterName,
                selectedTAOrderType
            } = this.props;
            this.props.sortBasedOnCuisines(
                selectedCuisines,
                takeAwayList,
                filterType,
                selectedPostcode,
                filterList,
                homeScreenFilter,
                selectedAdvancedFilterName,
                selectedTAOrderType
            );
        }
        this.props.navigation.goBack();
    }

    contentWithOutSafeArea(data, isSearchCuisine) {
        return (
            <View>
                <CuisinesHeaderTitle listDataLength={isArrayNonEmpty(data) ? data.length : 0} handleOnPress={this.handleShowMoreAction} />
                {this.renderCuisineList(isValidElement(data) ? data.slice(0, LIMIT_DISCOUNT_VALUE_TO_DISPLAY) : [], isSearchCuisine)}
            </View>
        );
    }

    renderCustomView() {
        let minimumCount = 0;
        return (
            <View>
                {this.state.showSearch ? (
                    <View style={styles.searchViewStyle}>
                        <CuisineSearchInput
                            textValue={this.state.textInputValue}
                            handleTextChange={this.handleTextChange}
                            placeholderText={LOCALIZATION_STRINGS.SEARCH_CUISINES}
                            autoFocus={true}
                            handleClose={this.clearIconOnPress}
                            showClose={true}
                        />
                    </View>
                ) : (
                    <CuisinesSearchAndResetHeader
                        showReset={
                            this.props?.cuisinesSelected?.length > minimumCount || this.props.selectedCuisines?.length > minimumCount
                        }
                        handleSearchButtonAction={this.handleSearchButtonAction}
                        handleResetAction={this.handleResetAction}
                    />
                )}
            </View>
        );
    }

    clearIconOnPress() {
        this.handleTextChange('');
        this.setState({ textInputValue: null, showClear: false, showSearch: false });
    }

    handleResetAction() {
        if (this.state.showSearch) {
            this.setState({ showSearch: false, textInputValue: null, showClear: false });
        } else {
            if (this.props.homeScreenFilter) {
                this.props.resetAdvanceCuisines();
            } else {
                this.props.resetCuisines();
            }
        }
    }

    renderCuisineList(listData, isSearchCuisine) {
        return (
            <KeyboardAwareScrollView
                enabled
                behavior="padding"
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="always"
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}>
                <View style={[styles.flatListShowLessView, { paddingBottom: this.state.isFullScreenModel ? 10 : 0 }]}>
                    <View style={styles.cuisineInnerViewStyle}>
                        <FlatList
                            contentContainerStyle={{ paddingHorizontal: 1 }}
                            showsHorizontalScrollIndicator={false}
                            numColumns={3}
                            keyExtractor={(item) => item.name}
                            data={listData}
                            renderItem={this.renderItem}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }

    renderItem = ({ item, index }) => {
        let selected = this.isCheckBoxEnabled(item.name);
        return (
            <CuisinesRow
                isSelected={selected}
                itemName={item.name}
                itemCount={item.count}
                imageUrl={item.image_url}
                index={index}
                showCuisineCount={true}
                handleCheckBox={this.handleCheckBox}
            />
        );
    };

    renderSearchResult = ({ item, index }) => {
        let selected = this.isCheckBoxEnabled(item.name);
        return (
            <CuisinesRow
                selected={selected}
                itemName={item.name}
                itemCount={item.count}
                imageUrl={item.image_url}
                index={index}
                showCuisineCount={true}
                handleCheckBox={this.handleSearchedItem}
            />
        );
    };

    isCheckBoxEnabled(item) {
        return isValidElement(this.props.selectedCuisines) ? this.props.selectedCuisines.includes(item) : false;
    }

    handleSearchedItem(itemName) {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_FILTER, ANALYTICS_EVENTS.CUISINES_BUTTON_CLICKED);
        Keyboard.dismiss();
        const { homeScreenFilter } = this.props;
        this.handleSelectedCuisine();
        if (!this.isCheckBoxEnabled(itemName)) {
            if (isValidElement(homeScreenFilter) && homeScreenFilter) {
                this.props.updateSelectedCuisines([itemName], this.props.homeScreenFilter);
            } else {
                this.props.updateSelectedCuisines([...this.props.selectedCuisines, itemName], this.props.homeScreenFilter);
            }
        }
    }

    handleCheckBox(itemName) {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_FILTER, ANALYTICS_EVENTS.CUISINES_BUTTON_CLICKED);
        Keyboard.dismiss();
        const { homeScreenFilter, selectedCuisines } = this.props;
        if (!this.isCheckBoxEnabled(itemName)) {
            this.handleSelectedCuisine();
            if (isValidElement(homeScreenFilter) && homeScreenFilter) {
                this.props.updateSelectedCuisines([itemName], homeScreenFilter);
            } else {
                this.props.updateSelectedCuisines([...selectedCuisines, itemName], homeScreenFilter);
            }
        } else {
            let filteredItems = selectedCuisines.filter(function(value) {
                return value !== itemName;
            });
            this.handleSelectedCuisine();
            this.props.updateSelectedCuisines(filteredItems, homeScreenFilter);
        }
    }

    handleSelectedCuisine() {
        this.setState({
            checkBoxStatus: !this.state.checkBoxStatus,
            showClear: false,
            showSearch: isEmpty(this.state.textInputValue) ? false : this.state.showSearch
        });
    }

    handleTextChange(value) {
        this.setState({ textInputValue: value, showClear: isValidString(value) });
        this.props.searchElementMethodAction(this.state.cuisinesList, value, SEARCH_TYPE.CUISINES_FILTER, this.props.selectedTAOrderType);
    }

    handleShowMoreAction() {
        this.setState({
            textInputValue: null,
            showSearch: false
        });
        this.props.showCuisineScreen();
    }

    handleSearchButtonAction() {
        this.setState({ showSearch: true });
        if (isValidElement(this.searchRef)) this.searchRef.focus();
    }
}
const mapStateToProps = (state) => ({
    takeAwayList: state.takeawayListReducer.takeawayList,
    cuisines: state.takeawayListReducer.cuisinesArray,
    filteredCuisines: state.takeawayListReducer.filteredElementArray,
    cuisinesSelected: selectCuisineSelected(state),
    selectedCuisines: selectSelectedCuisinesList(state),
    homeScreenFilter: state.takeawayListReducer.homeScreenFilter,
    advancedCuisineSelected: state.takeawayListReducer.advancedCuisineSelected,
    selectedAdvancedFilterName: state.takeawayListReducer.selectedAdvancedFilterName,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    filterType: selectFilterType(state),
    selectedPostcode: state.takeawayListReducer.selectedPostcode,
    filterList: selectFilterList(state)
});

const mapDispatchToProps = {
    updateCheckedCuisines,
    searchElementMethodAction,
    updateSelectedCuisines,
    resetCuisines,
    resetAdvanceCuisines,
    sortBasedOnCuisines
};

export default connect(mapStateToProps, mapDispatchToProps)(CuisinesScreen);
