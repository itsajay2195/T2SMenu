import React, { Component } from 'react';
import { View, ScrollView, FlatList, Platform, StatusBar, BackHandler } from 'react-native';
import {
    getFavouriteTakeawayAction,
    resetAction,
    searchElementMethodAction,
    setTakeawayScrollTop,
    sortBasedOnCuisines,
    stopMenuLoaderAction,
    updateAdvancedCheckedCuisines,
    updateHomeScreenStatusAction,
    getOfferBasedTakeawayListAction,
    filterTakeawayByOrderTypeAction,
    updateTALiveTrackingAction,
    filterTARecByOrderTypeAction
} from '../Redux/TakeawayListAction';
import { connect } from 'react-redux';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { defaultTouchArea, isArrayNonEmpty, isArrayEmpty, isFoodHubApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { styles } from '../Style/TakeawaySearchListStyle';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { isUKApp, isOrderTypeToggleEnabled } from 'appmodules/BaseModule/GlobalAppHelper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import BaseComponent from 'appmodules/BaseModule/BaseComponent';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import {
    FILTER_TAKEAWAY_CONSTANTS,
    LIVE_TRACKING_EVENT,
    SCREEN_NAME,
    SEARCH_TYPE,
    TOOL_TIP_LENGTH_VALUE,
    VIEW_ID
} from '../Utils/Constants';
import TakeawayListWidget from './Components/TakeawayListWidget';
import { showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import ViewCartButton from 'appmodules/BasketModule/View/Components/ViewCartButton';
import { redirectRouteAction, setSideMenuActiveAction } from '../../../CustomerApp/Redux/Actions';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import _, { debounce } from 'lodash';
import TakeawayErrorPage from './TakeawayErrorPage';
import TakeawayShimmer from './Components/TakeawayListShimmer';
import CuisinesRow from './Cuisines/CuisinesRow';
import { selectFilterList, selectFilterType } from '../Redux/TakeawayListSelectors';
import { cuisinesList, filterOfferList, getCollectionWaitingTime, getDeliveryWaitingTime, sortByCuisineCount } from '../Utils/Helper';
import { offerBannerFilterList } from '../Utils/SortByList';
import FavoriteIcon from './MicroComponents/FavoriteIconComponent';
import { FilterIconBadge, TakeawayListSearchBar } from './MicroComponents/ListSearchHeader';
import { OfferBannerListItem, SeeMoreButton } from './MicroComponents/OfferBannerListItem';
import { SelectOrderTypeView } from './MicroComponents/SelectOrderTypeView';
import { selectedTAOrderTypeAction, updateNonBasketOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
import { getModifiedImageURL } from '../../HomeModule/Utils/Helper';
import RecommendedTakeaway from './Components/RecommendedTakeaway';
import Styles from 'appmodules/MenuModule/View/Styles/MenuStyle';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { T2SIcon, T2STouchableOpacity } from 't2sbasemodule/UI';
import { ADDRESS_FORM_TYPE } from 'appmodules/AddressModule/Utils/AddressConstants';
import Tooltip from 'react-native-walkthrough-tooltip';
import Colors from 't2sbasemodule/Themes/Colors';
import { searchTakeawayAddressFormat } from 'appmodules/AddressModule/Utils/AddressHelpers';
import * as navigation from '../../../CustomerApp/Navigation/NavigationService';
import { selectCountryBaseFeatureGateResponse } from 'appmodules/BasketModule/Redux/BasketSelectors';
const screenName = SCREEN_NAME.TAKEAWAY_LIST_SCREEN;
let timeout;
class TakeawaySearchList extends Component {
    constructor(props) {
        super(props);
        this.changeLocation = this.changeLocation.bind(this);
        this.handleTextChanged = this.handleTextChanged.bind(this);
        this.handleHeaderFavouriteIconPress = this.handleHeaderFavouriteIconPress.bind(this);
        this.debounceChangeLocationPress = debounce(this.changeLocation, 1000, { leading: true, trailing: true });
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleFilterIconOnPress = this.handleFilterIconOnPress.bind(this);
        this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
        this.clearIconOnPress = this.clearIconOnPress.bind(this);
        this.setFavoriteTACount = this.setFavoriteTACount.bind(this);
        this.onOfferBannerItemPress = this.onOfferBannerItemPress.bind(this);
        this.onSeeMorePress = this.onSeeMorePress.bind(this);
        this.onRecommendedTakeawaySelected = this.onRecommendedTakeawaySelected.bind(this);

        this.state = {
            textInputValue: null,
            favouriteTakeawaysCount: null,
            showClear: false,
            toolTipVisible: false,
            offerBannerFilterList: isValidElement(offerBannerFilterList) ? offerBannerFilterList : []
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { takeawayList, isDifferentAddress, takeawayFetching, selectedAddress } = this.props;
        const { showClear, textInputValue } = this.state;
        if (isValidElement(takeawayList) && prevProps.takeawayList !== takeawayList) {
            let filteredList = filterOfferList(offerBannerFilterList, takeawayList);
            if (isValidElement(filteredList) && filteredList !== this.state.offerBannerFilterList) {
                this.setState({ offerBannerFilterList: filteredList });
            }
        }
        if (prevProps.isDifferentAddress !== isDifferentAddress && isDifferentAddress && takeawayFetching) {
            if (isValidElement(timeout)) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                this.handleToolTip(isDifferentAddress);
            }, 800);
        }
        if (showClear && isValidString(textInputValue) && selectedAddress !== prevProps.selectedAddress) {
            this.clearIconOnPress();
        }
    }

    handleToolTip(value) {
        this.setState({ toolTipVisible: value });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let value = {};
        if (
            isValidElement(nextProps?.favouriteTakeaways) &&
            !isValidElement(prevState.favouriteTakeawaysCount) &&
            nextProps.favouriteTakeaways !== prevState.favouriteTakeawaysCount &&
            isArrayEmpty(nextProps.takeawayList) &&
            nextProps.taRecommendation !== prevState.taRecommendation
        ) {
            value.favouriteTakeawaysCount = nextProps.favouriteTakeaways;
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.TAKEAWAY_LIST);
        if (this.props.isMenuLoading) {
            this.props.stopMenuLoaderAction();
        }
        this.flatListRef = React.createRef();
        this.getFavouriteTakeawayList();
        const { route } = this.props;
        if (isValidElement(route?.params?.searchText)) {
            const { searchText } = route.params;
            this.setState({
                textInputValue: searchText
            });
            Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.SELECTED_COUNTRY_POSTCODE, {
                current_country: this.props.countryISO,
                search_area: route.params.searchText,
                postcode_address: isValidString(this.props.listDetails?.location?.postcode)
                    ? this.props.listDetails.location.postcode
                    : this.props.selectedPostcode
            });
        }
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.props.setSideMenuActiveAction(SCREEN_OPTIONS.HOME.route_name);
            if (isValidElement(this.flatListRef) && isValidElement(this.flatListRef.current)) {
                this.flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
            }
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
        });
    }
    handleGoBack() {
        this.handleBackButtonClick();
        navigation.goBack();
    }
    handleBackButtonClick() {
        this.handleToolTip(false);
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }
    componentWillUnmount() {
        this.props.resetAction();
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
        if (isValidElement(this.backHandler)) {
            this.backHandler.remove();
        }
    }
    render() {
        const { takeawayList, takeawayGetSuccess, takeawayFetching, takeawaysCount } = this.props;
        return (
            <BaseComponent
                showElevation={false}
                showCommonActions={false}
                showHeader={true}
                icon={FONT_ICON.BACK}
                customView={this.renderHeader()}
                handleLeftActionPress={this.handleGoBack.bind(this)}>
                {takeawayFetching ? (
                    <TakeawayShimmer />
                ) : (takeawayGetSuccess && isValidElement(takeawayList) && takeawayList.length === 0) ||
                  (isValidElement(takeawaysCount) && takeawaysCount === 0) ? (
                    <TakeawayErrorPage />
                ) : (
                    this.renderTakeaway()
                )}
            </BaseComponent>
        );
    }
    renderTakeaway() {
        const {
            onlineTakeaways,
            preorderTakeaways,
            closedTakeaways,
            favouriteTakeaways,
            takeawayList,
            searchedTakeawayCount,
            cuisines,
            selectedTAOrderType,
            route,
            navigation,
            countryId
        } = this.props;
        // const { offerBannerFilterList } = this.state;
        const cuisinesList = isValidElement(cuisines) && sortByCuisineCount(cuisines);
        return (
            <>
                {this.renderSearchHeader()}
                {isValidElement(searchedTakeawayCount) && searchedTakeawayCount === 0 ? (
                    <TakeawayErrorPage />
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.mainContainer}>
                            {isArrayNonEmpty(cuisinesList) ? this.renderCuisineList(cuisinesList) : null}
                            {this.renderTakeawayRecommendation()}
                            {/*{isArrayNonEmpty(offerBannerFilterList) && this.renderOfferBannerList()}*/}
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
                )}
                <ViewCartButton screenName={screenName} fromTakeawayList={true} handleBasketNavigation={true} />
            </>
        );
    }

    setFavoriteTACount(value) {
        this.setState({ favouriteTakeawaysCount: value });
    }
    showDownArrow() {
        return (
            <T2STouchableOpacity hitSlop={defaultTouchArea()} onPress={this.handleAddressClick.bind(this)}>
                <T2SIcon style={styles.iconStyle} icon={FONT_ICON.Small_Arrow_Down} size={32} />
            </T2STouchableOpacity>
        );
    }
    getPostCode() {
        const { selectedPostcode, selectedAddress } = this.props;
        const displayPostcode = isValidElement(selectedAddress)
            ? searchTakeawayAddressFormat(selectedAddress, true)
            : isValidString(selectedPostcode)
            ? selectedPostcode
            : '';
        return displayPostcode;
    }

    renderHeaderTitle() {
        const { countryId } = this.props;
        const displayPostcode = this.getPostCode();
        let isUK = isFoodHubApp() && isUKApp(countryId);
        return (
            <T2STouchableOpacity hitSlop={defaultTouchArea()} onPress={this.handleAddressClick.bind(this)} style={styles.headerContent}>
                {isValidString(displayPostcode) && (
                    <>
                        <T2SText
                            style={styles.headerTextStyle}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            screenName={screenName}
                            id={VIEW_ID.POST_CODE + '_' + displayPostcode}>
                            {displayPostcode}
                        </T2SText>
                        {isUK && this.showDownArrow()}
                    </>
                )}
            </T2STouchableOpacity>
        );
    }
    handleAddressClick(isToolTip) {
        if (isFoodHubApp() && isUKApp(this.props.countryId)) {
            if (isToolTip) {
                this.handleToolTip(false);
            }
            handleNavigation(SCREEN_OPTIONS.LOCATION_SEARCH_SCREEN.route_name, {
                viewType: ADDRESS_FORM_TYPE.SEARCH_TAKEAWAY
            });
        }
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

    clearIconOnPress() {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.ICON_CLEAR);
        this.handleTextChanged('');
        this.setState({ textInputValue: null });
        this.setState({ showClear: false });
    }

    renderOfferBannerList() {
        return (
            <View style={styles.offerBannerList}>
                <FlatList
                    data={this.state.offerBannerFilterList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderOfferBannerItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    }

    renderOfferBannerItem = ({ item }) => {
        return (
            <OfferBannerListItem
                itemId={item.id}
                itemTitle={item.title}
                screenName={screenName}
                offerValue={item.offer}
                offerMaxValue={item.offerMax}
                onPress={this.onOfferBannerItemPress}
            />
        );
    };

    onOfferBannerItemPress(offerValue, offerMax) {
        this.props.getOfferBasedTakeawayListAction(offerValue, offerMax, this.props.selectedTAOrderType);
        this.props.navigation.navigate(SCREEN_OPTIONS.CUISINE_BASED_TA_LIST_SCREEN.route_name, {
            isFromOfferBanner: true
        });
    }

    renderTakeawayRecommendation() {
        const { taRecommendation, searchTaResponse, cuisinesSelected, filterList } = this.props;
        const data = isValidString(this.state.textInputValue) ? searchTaResponse : isValidElement(taRecommendation) && taRecommendation;
        let showFilterCount = isArrayNonEmpty(cuisinesSelected) || isArrayNonEmpty(filterList);
        return (
            isArrayNonEmpty(data) &&
            !showFilterCount && (
                <T2SView>
                    <View style={Styles.recommendIconStyle}>
                        <T2SIcon
                            id={VIEW_ID.LIKE_ICON}
                            screenName={screenName}
                            icon={FONT_ICON.LIKE}
                            color={Colors.suvaGrey}
                            style={Styles.searchIconStyle}
                            size={22}
                        />
                        <T2SText id={VIEW_ID.BEST_SELLING_ITEMS_VIEW} screenName={screenName} style={Styles.bestSellingHeaderText}>
                            {LOCALIZATION_STRINGS.TA_RECOMMENDATION}
                        </T2SText>
                    </View>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={isValidString(this.state.textInputValue) ? searchTaResponse?.slice(0, 3) : taRecommendation?.slice(0, 3)}
                        keyExtractor={(item) => item?.id?.toString()}
                        renderItem={this.renderListItem}
                        style={{ paddingHorizontal: 5 }}
                        scrollEnabled={false}
                    />
                </T2SView>
            )
        );
    }

    renderListItem = ({ item }) => {
        const { name, logo_url, rating, total_reviews, cuisines } = item;
        const { selectedTAOrderType } = this.props;
        let imageURL = getModifiedImageURL(logo_url);
        return (
            <RecommendedTakeaway
                name={name}
                rating={rating}
                total_reviews={total_reviews}
                imageURL={imageURL}
                delivery_time={selectedTAOrderType === ORDER_TYPE.DELIVERY ? getDeliveryWaitingTime(item) : getCollectionWaitingTime(item)}
                cuisines={cuisinesList(cuisines)}
                cuisineNotEmpty={isArrayNonEmpty(cuisines)}
                onRecommendedTakeawaySelected={this.onRecommendedTakeawaySelected.bind(this, item)}
                orderType={selectedTAOrderType}
            />
        );
    };

    onRecommendedTakeawaySelected(item) {
        handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
            isFromReOrder: false,
            isFromRecentTakeAway: false,
            storeConfig: item,
            isLoading: false
        });
        let body = {
            config_id: item.id,
            type: 'create',
            filter_by: 'recommeded'
        };
        this.props.updateTALiveTrackingAction(LIVE_TRACKING_EVENT.SELECT_TA_FILTER_TYPE_EVENT, body);
    }

    renderCuisineList(cuisinesList) {
        const data =
            isValidElement(cuisinesList) && isValidElement(cuisinesList.length) && cuisinesList.length > 15
                ? cuisinesList.slice(0, 15)
                : cuisinesList;
        return (
            !isValidString(this.state.textInputValue) && (
                <View>
                    <T2SText id={VIEW_ID.MENUS} screenName={screenName} style={styles.menuTextStyle}>
                        {LOCALIZATION_STRINGS.MENUS}
                    </T2SText>
                    <FlatList
                        horizontal={true}
                        ref={this.flatListRef}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(cuisine) => cuisine.name}
                        data={data}
                        renderItem={this.renderCuisineItem}
                        ListFooterComponent={() => this.renderSeeMore(cuisinesList)}
                        style={{ paddingLeft: 10 }}
                    />
                </View>
            )
        );
    }

    renderSeeMore(cuisinesList) {
        return isValidElement(cuisinesList) && isValidElement(cuisinesList.length) && cuisinesList.length > 15 ? (
            <SeeMoreButton screenName={screenName} onPress={this.onSeeMorePress} />
        ) : null;
    }

    renderCuisineItem = ({ item, index }) => {
        return (
            <CuisinesRow
                itemName={item.name}
                imageUrl={item.image_url}
                isFromTakeawayList={true}
                showCuisineCount={false}
                handleCheckBox={this.handleCheckBox}
                index={index}
            />
        );
    };

    onSeeMorePress() {
        handleNavigation(SCREEN_OPTIONS.CUISINES_SCREEN.route_name, {
            isFullScreenMode: true,
            isFromTakeawayList: true
        });
    }
    handleCheckBox(cuisineName) {
        const { takeawayList, filterType, selectedTAOrderType, selectedPostcode } = this.props;
        this.props.updateHomeScreenStatusAction(true, cuisineName);
        this.props.sortBasedOnCuisines([], takeawayList, filterType, selectedPostcode, [], true, cuisineName, selectedTAOrderType);
        this.props.navigation.navigate(SCREEN_OPTIONS.CUISINE_BASED_TA_LIST_SCREEN.route_name, {
            selectedCuisines: cuisineName
        });
    }

    changeLocation() {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.CHANGE_LOCATION_BUTTON_CLICKED);
        this.props.navigation.goBack();
    }

    renderHeader() {
        const { takeawayList } = this.props;
        const { favouriteTakeawaysCount, toolTipVisible, takeawayFetching } = this.state;
        return (
            <Tooltip
                isVisible={toolTipVisible}
                content={
                    <T2STouchableOpacity
                        hitSlop={defaultTouchArea(8)}
                        onPress={!takeawayFetching && this.handleAddressClick.bind(this, true)}>
                        <T2SText id={VIEW_ID.TOOLTIP_MSG} style={styles.toolTipText} screenName={screenName}>
                            {LOCALIZATION_STRINGS.TA_LIST_TOOLTIP_MSG}
                        </T2SText>
                    </T2STouchableOpacity>
                }
                displayInsets={TOOL_TIP_LENGTH_VALUE.TOP}
                tooltipStyle={styles.toolTipView}
                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                placement="bottom"
                backgroundColor={''}
                arrowStyle={TOOL_TIP_LENGTH_VALUE.ARROW_STYLE}
                contentStyle={{ backgroundColor: Colors.tip_bg_Black }}
                onClose={this.handleToolTip.bind(this, false)}>
                <T2SView style={[styles.headerContentSearchBar, styles.headerContentAlign]}>
                    {this.renderHeaderTitle()}

                    <T2SView style={styles.headerIconsContainer}>
                        <FavoriteIcon
                            onPress={this.handleHeaderFavouriteIconPress}
                            favouriteTakeawaysCount={isArrayNonEmpty(favouriteTakeawaysCount) ? favouriteTakeawaysCount.length : 0}
                        />
                        {isArrayNonEmpty(takeawayList) && this.showFilterIcon()}
                    </T2SView>
                </T2SView>
            </Tooltip>
        );
    }

    handleFilterIconOnPress() {
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.FILTER_ICON_PRESS);
        handleNavigation(SCREEN_OPTIONS.FILTER_SCREEN.route_name);
    }
    showFilterIcon() {
        const { cuisinesSelected, filterList } = this.props;
        let badgeCount =
            (isValidElement(cuisinesSelected) ? cuisinesSelected.length : 0) + (isValidElement(filterList) ? filterList.length : 0);
        let showFilterCount = isArrayNonEmpty(cuisinesSelected) || isArrayNonEmpty(filterList);
        return (
            <FilterIconBadge
                showFilterCount={showFilterCount}
                handleOnPress={this.handleFilterIconOnPress}
                badgeCount={badgeCount}
                screenName={screenName}
                isFromTAList={true}
            />
        );
    }

    getFavouriteTakeawayList() {
        if (isValidElement(this.props.isUserLoggedIn) && this.props.isUserLoggedIn) {
            this.props.getFavouriteTakeawayAction();
        }
    }
    handleTextChanged(value) {
        const { takeawayList, selectedTAOrderType, filterType } = this.props;
        if (value) {
            this.setState({ showClear: true });
        } else {
            this.setState({ showClear: false });
        }
        this.setState({ textInputValue: value });
        if (isValidElement(value)) {
            Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.SEARCH_TAKEAWAY);
            this.props.searchElementMethodAction(takeawayList, value, SEARCH_TYPE.TAKEAWAY_FILTER, selectedTAOrderType, filterType);
        }
    }
    handleHeaderFavouriteIconPress() {
        const { isUserLoggedIn } = this.props;
        const { favouriteTakeawaysCount } = this.state;
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.FAVORITE_ICON_CLICKED);
        if (isValidElement(isUserLoggedIn) && isUserLoggedIn) {
            if (isArrayNonEmpty(favouriteTakeawaysCount)) {
                this.props.setSideMenuActiveAction(SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name);
                handleNavigation(SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name, {
                    viewType: FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST
                });
            } else {
                showInfoMessage(LOCALIZATION_STRINGS.NO_FAVOURITES);
            }
        } else {
            this.props.redirectRouteAction(SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name);
            handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
        }
    }
    handleOrderTypeChange(orderType) {
        const { takeawayList, takeaway_recommendation_response, filterType } = this.props;
        this.props.selectedTAOrderTypeAction(orderType);
        this.props.updateNonBasketOrderType(orderType);
        this.props.filterTakeawayByOrderTypeAction(takeawayList, orderType);
        this.props.filterTARecByOrderTypeAction(takeaway_recommendation_response, orderType, filterType);
        this.makeCuisineFilterCall(orderType);
    }

    makeCuisineFilterCall(orderType) {
        const { cuisinesSelected, takeawayList, filterType, filterList, homeScreenFilter, selectedAdvancedFilterName } = this.props;
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
    }
}
const mapStateToProps = (state) => ({
    takeawayList: state.takeawayListReducer.takeawayList,
    selectedPostcode: state.takeawayListReducer.selectedPostcode,
    onlineTakeaways: state.takeawayListReducer.onlineTakeaways,
    preorderTakeaways: state.takeawayListReducer.preorderTakeaways,
    closedTakeaways: state.takeawayListReducer.closedTakeaways,
    isUserLoggedIn: selectHasUserLoggedIn(state),
    selectedAdvancedFilterName: state.takeawayListReducer.selectedAdvancedFilterName,
    favouriteTakeaways: state.takeawayListReducer.favouriteTakeaways,
    cuisinesSelected: state.takeawayListReducer.cuisinesSelected,
    filterType: selectFilterType(state),
    filterList: selectFilterList(state),
    takeawaysCount: state.takeawayListReducer.takeawaysCount,
    searchedTakeawayCount: state.takeawayListReducer.searchedTakeawayCount,
    listDetails: state.takeawayListReducer.listDetails,
    takeawayGetSuccess: state.takeawayListReducer.takeawayGetSuccess,
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    takeawayFetching: state.takeawayListReducer.takeawayFetching,
    cuisines: state.takeawayListReducer.cuisinesArray,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    isFromOfferList: state.takeawayListReducer.isFromOfferList,
    takeaway_recommendation_response: state.takeawayListReducer.takeaway_recommendation_response,
    taRecommendation: state.takeawayListReducer.recommendationTA,
    searchTaResponse: state.takeawayListReducer.search_takeaway_response,
    selectedAddress: state.takeawayListReducer.selectedAddress,
    isDifferentAddress: state.takeawayListReducer.isDifferentAddress,
    countryId: state.appState.s3ConfigResponse?.country?.id,
    featureGateResponse: selectCountryBaseFeatureGateResponse(state)
});

const mapDispatchToProps = {
    searchElementMethodAction,
    getFavouriteTakeawayAction,
    sortBasedOnCuisines,
    updateAdvancedCheckedCuisines,
    resetAction,
    stopMenuLoaderAction,
    setTakeawayScrollTop,
    redirectRouteAction,
    setSideMenuActiveAction,
    updateHomeScreenStatusAction,
    getOfferBasedTakeawayListAction,
    updateNonBasketOrderType,
    selectedTAOrderTypeAction,
    filterTakeawayByOrderTypeAction,
    updateTALiveTrackingAction,
    filterTARecByOrderTypeAction
};
export default connect(mapStateToProps, mapDispatchToProps)(TakeawaySearchList);
