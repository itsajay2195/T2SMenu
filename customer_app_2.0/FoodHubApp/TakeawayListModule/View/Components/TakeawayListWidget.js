import React, { Component } from 'react';
import { SectionList, View } from 'react-native';
import { connect } from 'react-redux';
import { getWebviewUrl, isArrayNonEmpty, isValidElement, isValidString, isWebviewEnabled } from 't2sbasemodule/Utils/helpers';
import Colors from 't2sbasemodule/Themes/Colors';
import {
    getNetworkStatus,
    isCollectionAvailableForStore,
    isDeliveryAvailableForStore,
    selectHasUserLoggedIn,
    selectLanguageKey,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { styles } from '../../Style/TakeawayListWidgetStyle';
import { FAVOURITE_TAKEAWAY, FILTER_TAKEAWAY_CONSTANTS, LIVE_TRACKING_EVENT, VIEW_ID } from '../../Utils/Constants';
import {
    postFavouriteTakeawayAction,
    setTakeawayScrollTop,
    updateStoreConfigResponseAction,
    updateStoreConfigResponseForViewAction,
    updateTALiveTrackingAction
} from '../../Redux/TakeawayListAction';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import {
    getFavouriteTakeaways,
    getPreorderStatus,
    getStoreStatusCollection,
    getStoreStatusDelivery,
    isValidFavouriteTAList,
    logFavouritesSegment,
    isCollectionOrPreOrderAvailable,
    isDeliveryOrPreOrderAvailable,
    isValidFavSearchedTakeawayList
} from '../../Utils/Helper';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { selectCartItems } from 'appmodules/BasketModule/Redux/BasketSelectors';
import { redirectRouteAction, updateFallbackUrl } from '../../../../CustomerApp/Redux/Actions';
import {
    getToastMessageForTakeawayOpenStatus,
    isPreOrderAvailableForCollection,
    isPreOrderAvailableForDelivery
} from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import { updateSelectedOrderType } from 'appmodules/AddressModule/Redux/AddressAction';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import TakeawayList from '../TakeawayList';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import _ from 'lodash';
import { selectFilterType } from '../../Redux/TakeawayListSelectors';

class TakeawayListWidget extends Component {
    constructor(props) {
        super(props);
        this.handleFavouriteTakeaway = this.handleFavouriteTakeaway.bind(this);
        this.handlePersistLogic = this.handlePersistLogic.bind(this);
        this.renderTADivider = this.renderTADivider.bind(this);
        this.state = {
            favouriteTakeaways: null,
            takeawayToFavoriteId: null,
            favTANames: [],
            selectedTakeAway: null
        };
    }

    componentDidMount() {
        if (isValidElement(this.props.isUserLoggedIn) && this.props.isUserLoggedIn && !isValidElement(this.state.favouriteTakeaways)) {
            this.updateFavouriteTakeaways();
        }
        this.navigationListener =
            this.props.navigation &&
            this.props.navigation.addListener('focus', () => {
                if (isValidElement(this.props) && this.props.takeawayListScrollTop) {
                    this.sectionList &&
                        this.sectionList.scrollToLocation({
                            sectionIndex: 0,
                            itemIndex: 0
                        });
                    this.props.setTakeawayScrollTop(false);
                }
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.favouriteTakeaways !== this.props.favouriteTakeaways) {
            this.updateFavouriteTakeaways();
        }
        if (
            prevState.favouriteTakeaways !== this.state.favouriteTakeaways &&
            this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST
        ) {
            this.props.favouriteTakeawaysCount(this.state.favouriteTakeaways);
        }
        if (
            isValidElement(this.state.takeawayToFavoriteId) &&
            isValidElement(this.props.route) &&
            isValidElement(this.props.route.params) &&
            isValidElement(this.props.route.params.params) &&
            isValidElement(this.props.route.params.params.loginSuccess) &&
            this.props.route.params.params.loginSuccess
        ) {
            this.handleFavouriteTakeaway(this.state.takeawayToFavoriteId, this.state.favouriteTakeaways);
        }
    }

    componentWillUnmount() {
        this.updateFavouriteTakeaways();
        if (isValidElement(this.navigationListener)) {
            this.props.navigation.removeListener(this.navigationListener);
        }
    }

    updateFavouriteTakeaways() {
        this.setState({ favouriteTakeaways: getFavouriteTakeaways(this.props.favouriteTakeaways) });
        if (this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST) {
            this.props.favouriteTakeawaysCount(this.props.favouriteTakeaways);
        }
        if (this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.FAVOURITE_TAKEAWAY_LIST) {
            this.props.updateFavouriteTakeawayList();
        }
    }

    isFavouriteTakeawaySelected(item, favouriteTakeaways) {
        if (isValidElement(favouriteTakeaways) && favouriteTakeaways.length > 0) {
            return favouriteTakeaways.includes(item);
        }
    }

    handleFavouriteTakeaway(itemId, itemName, favouriteTakeaways) {
        if (!this.props.networkConnected) {
            showErrorMessage(LOCALIZATION_STRINGS.GENERIC_ERROR_MSG, null, Colors.persianRed);
            return;
        }
        Analytics.logEvent(ANALYTICS_SCREENS.TAKEAWAY_LIST, ANALYTICS_EVENTS.FAVOURITE_TAKEAWAY_ICON_PRESS);
        if (
            isValidElement(this.props.isUserLoggedIn) &&
            this.props.isUserLoggedIn &&
            this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST
        ) {
            if (this.isFavouriteTakeawaySelected(itemId, favouriteTakeaways)) {
                favouriteTakeaways = favouriteTakeaways.filter(function(value) {
                    return value !== itemId;
                });
                this.setState({ favouriteTakeaways: favouriteTakeaways, takeawayToFavoriteId: null });
                this.props.favouriteTakeawaysCount(favouriteTakeaways);
                this.props.postFavouriteTakeawayAction(itemId, FAVOURITE_TAKEAWAY.NO);
                this.constructForLog(itemName, SEGMENT_CONSTANTS.REMOVE);
            } else {
                if (!isValidElement(favouriteTakeaways)) {
                    this.setState({ favouriteTakeaways: [itemId], takeawayToFavoriteId: null });
                } else {
                    favouriteTakeaways.push(itemId);
                    this.setState({ favouriteTakeaways: favouriteTakeaways, takeawayToFavoriteId: null });
                }
                this.props.favouriteTakeawaysCount(this.state.favouriteTakeaways);
                this.props.postFavouriteTakeawayAction(itemId, FAVOURITE_TAKEAWAY.YES);
                this.constructForLog(itemName, SEGMENT_CONSTANTS.ADD);
            }
        } else if (
            isValidElement(this.props.isUserLoggedIn) &&
            this.props.isUserLoggedIn &&
            this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.FAVOURITE_TAKEAWAY_LIST
        ) {
            if (this.isFavouriteTakeawaySelected(itemId, favouriteTakeaways)) {
                favouriteTakeaways = favouriteTakeaways.filter(function(value) {
                    return value !== itemId;
                });
                this.setState({ favouriteTakeaways: favouriteTakeaways, takeawayToFavoriteId: null });
                this.props.postFavouriteTakeawayAction(itemId, FAVOURITE_TAKEAWAY.NO);
                this.constructForLog(itemName, SEGMENT_CONSTANTS.REMOVE);
            }
        } else {
            this.setState({ takeawayToFavoriteId: itemId });
            if (this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST) {
                this.props.redirectRouteAction(SCREEN_OPTIONS.TAKEAWAY_LIST_SCREEN.route_name);
            } else {
                this.props.redirectRouteAction(SCREEN_OPTIONS.FAVOURITE_TAKEAWAY_SCREEN.route_name);
            }
            handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
        }
    }

    constructForLog(itemName, action) {
        const { favouriteTakeaways, countryBaseFeatureGateResponse } = this.props;
        let names = [];
        if (this.state.favTANames.length > 0) {
            if (action === SEGMENT_CONSTANTS.ADD) {
                names = [...this.state.favTANames, itemName];
            } else if (action === SEGMENT_CONSTANTS.REMOVE) {
                names = _.filter(this.state.favTANames, function(o) {
                    return o !== itemName;
                });
            }
        } else {
            if (action === SEGMENT_CONSTANTS.ADD) names.push(itemName);
            if (isValidElement(favouriteTakeaways)) {
                favouriteTakeaways.map((ta) => {
                    if (action === SEGMENT_CONSTANTS.ADD && isValidElement(ta.name)) {
                        names.push(ta.name);
                    } else if (action === SEGMENT_CONSTANTS.REMOVE && itemName !== ta.name && isValidElement(ta.name)) {
                        names.push(ta.name);
                    }
                });
            }
        }
        this.setState({ favTANames: names });
        logFavouritesSegment(countryBaseFeatureGateResponse, itemName, action, names, false);
    }
    handleCollectionOrderType() {
        this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
    }
    render() {
        const { viewType, cartItems } = this.props;
        return (
            <View style={[styles.mainContainer, isArrayNonEmpty(cartItems) && { marginBottom: 20 }]}>
                {viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST && this.renderSectionList()}
                {viewType === FILTER_TAKEAWAY_CONSTANTS.FAVOURITE_TAKEAWAY_LIST && this.renderFlatList()}
            </View>
        );
    }

    renderFlatList() {
        const { screenName, data, favouriteTakeaways, searchedFavouriteTakeawayList, isFromFavouriteSearch } = this.props;
        const isValidList = isFromFavouriteSearch
            ? isValidFavSearchedTakeawayList(searchedFavouriteTakeawayList)
            : isValidFavouriteTAList(favouriteTakeaways);
        return (
            <View>
                <T2SText
                    screenName={screenName}
                    id={isValidList ? VIEW_ID.YOUR_FAV : VIEW_ID.NO_FAVOURITES}
                    style={isValidList ? styles.openTakeawaysHeaderStyle : styles.noFavouriteTextStyle}>
                    {isValidList ? LOCALIZATION_STRINGS.YOUR_FAVOURITES : LOCALIZATION_STRINGS.NO_FAVOURITE_TA_TEXT}
                </T2SText>
                {isValidElement(data) && this.renderSectionList()}
            </View>
        );
    }

    renderSectionList() {
        const { preorderTakeaways, closedTakeaways, onlineTakeaways, viewType } = this.props;
        let sections = [];
        if (isValidElement(onlineTakeaways) && onlineTakeaways.length > 0) {
            if (viewType === FILTER_TAKEAWAY_CONSTANTS.FAVOURITE_TAKEAWAY_LIST) {
                sections.push({ data: onlineTakeaways });
            } else {
                sections.push({
                    title: LOCALIZATION_STRINGS.TAKEAWAYS,
                    data: onlineTakeaways
                });
            }
        }
        if (isValidElement(preorderTakeaways) && preorderTakeaways.length > 0) {
            sections.push({
                title: LOCALIZATION_STRINGS.PREORDER,
                data: preorderTakeaways
            });
        }
        if (isValidElement(closedTakeaways) && closedTakeaways.length > 0) {
            sections.push({
                title: LOCALIZATION_STRINGS.TAKEAWAYS_CURRENTLY_CLOSED,
                data: closedTakeaways
            });
        }
        if (isValidElement(sections) && sections.length > 0)
            return (
                <SectionList
                    ref={(sectionList) => {
                        this.sectionList = sectionList;
                    }}
                    sections={sections}
                    onScrollToIndexFailed={this.handleOnScrollToIndexFailed.bind(this, sections)}
                    renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    keyExtractor={(item) => item.id}
                    stickySectionHeadersEnabled={false}
                    keyboardShouldPersistTaps={'always'}
                    renderItem={(item) => isValidElement(item) && this.renderTakeawayList(item.item, item.section)}
                    ItemSeparatorComponent={this.renderTADivider}
                />
            );
    }

    renderTADivider() {
        return <View style={styles.divideStyle} />;
    }
    renderSectionHeader(section) {
        const { screenName } = this.props;
        return (
            <T2SText
                screenName={screenName}
                id={VIEW_ID.SECTION_HEADER}
                style={
                    !isValidElement(section.title)
                        ? [{ paddingVertical: 0, paddingHorizontal: 0, marginTop: -18 }]
                        : [
                              styles.closedTakeawaysHeaderStyle,
                              section.title === LOCALIZATION_STRINGS.TAKEAWAYS_CURRENTLY_CLOSED && [
                                  styles.currentlyClosedBackground,
                                  styles.closedTakeawayMarginTop
                              ]
                          ]
                }>
                {section.title}
            </T2SText>
        );
    }
    handleOnScrollToIndexFailed(error, sections) {
        this.sectionList.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
        setTimeout(() => {
            if (sections.length !== 0 && this.sectionList !== null) {
                this.sectionList.scrollToIndex({ index: error.index, animated: true });
            }
        }, 100);
    }

    renderTakeawayList(listItem, section) {
        const {
            screenName,
            viewType,
            orderType,
            basketStoreID,
            selectedTAOrderType,
            associateTakeawayResponse,
            cartItems,
            languageKey,
            distanceType,
            timeZone,
            countryId
        } = this.props;
        let isTakeawayCurrentlyClosed =
            isValidElement(section) && isValidString(section.title) && section.title === LOCALIZATION_STRINGS.TAKEAWAYS_CURRENTLY_CLOSED;
        return (
            <TakeawayList
                item={listItem}
                navigation={this.props.navigation}
                screenName={screenName}
                selectedStoreID={basketStoreID}
                viewType={viewType}
                cartItems={cartItems}
                handlePersistLogic={this.handlePersistLogic}
                associateTakeawayResponse={associateTakeawayResponse}
                languageKey={languageKey}
                filterByType={orderType}
                isTakeawayClosed={isTakeawayCurrentlyClosed}
                selectedTAOrderType={selectedTAOrderType}
                distanceType={distanceType}
                timeZone={timeZone}
                countryId={countryId}
            />
        );
    }

    handlePersistLogic(item, orderType) {
        if (isValidElement(item)) {
            if (isWebviewEnabled()) {
                this.props.updateFallbackUrl(getWebviewUrl(item));
                this.setOrderTypeAndEvents(orderType, item);
                handleNavigation(SCREEN_OPTIONS.TAKEAWAY_FALL_BACK_SCREEN.route_name);
            } else {
                // handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
                //     isFromReOrder: false,
                //     isFromRecentTakeAway: false,
                //     storeConfig: item,
                //     isLoading: !this.props.networkConnected && item.id !== this.state.selectedTakeAway
                // });
                this.setState({ selectedTakeAway: item.id });
                setTimeout(() => {
                    this.props.updateStoreConfigResponseForViewAction(item);
                    this.setOrderTypeAndEvents(orderType, item);
                }, 10);
                this.showTAStatusMessage(orderType, item);
                let body = {
                    config_id: item.id,
                    type: 'create',
                    filter_by: this.props.filterType
                };
                this.props.updateTALiveTrackingAction(LIVE_TRACKING_EVENT.SELECT_TA_FILTER_TYPE_EVENT, body);
                handleNavigation(SCREEN_OPTIONS.NEW_MENU_CATEGORY_SCREEN.route_name, {
                    isFromReOrder: false,
                    isFromRecentTakeAway: false,
                    storeConfig: item,
                    isLoading: !this.props.networkConnected && item.id !== this.state.selectedTakeAway
                });
            }
        }
    }

    setOrderTypeAndEvents(orderType, item) {
        const { profileResponse, isUserLoggedIn, countryBaseFeatureGateResponse, countryISO, screenName } = this.props;
        if (orderType === ORDER_TYPE.COLLECTION) {
            this.handleCollectionOrderType();
        } else {
            this.setDefaultOrderType(item);
        }
        Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.TAKEAWAY_SELECT, {
            country: countryISO,
            source: screenName,
            takeaway: item.name,
            user_id: isUserLoggedIn && isValidElement(profileResponse) ? profileResponse.id : null
        });
    }

    setDefaultOrderType(item) {
        const { show_delivery, show_collection } = item;
        let storeStatusDelivery = getStoreStatusDelivery(item);
        let storeStatusCollection = getStoreStatusCollection(item);
        let preOrderStatusDelivery = getPreorderStatus(item, ORDER_TYPE.DELIVERY, storeStatusDelivery);
        let preOrderStatusCollection = getPreorderStatus(item, ORDER_TYPE.COLLECTION, storeStatusCollection);

        const deliveryAvailable =
            isDeliveryAvailableForStore(show_delivery, storeStatusDelivery) || isPreOrderAvailableForDelivery(preOrderStatusDelivery);
        const collectionAvailable =
            isCollectionAvailableForStore(show_collection, storeStatusCollection) ||
            isPreOrderAvailableForCollection(preOrderStatusCollection);
        if (!deliveryAvailable && collectionAvailable) {
            this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
            return;
        }
        this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, this.props.selectedPostcode, this.props.selectedAddressId);
    }

    showTAStatusMessage(orderType, item) {
        const { countryId, featureGateResponse } = this.props;
        const { name, show_delivery, show_collection } = item;

        let storeStatusDelivery = getStoreStatusDelivery(item);
        let storeStatusCollection = getStoreStatusCollection(item);
        let preOrderStatusDelivery = getPreorderStatus(item, ORDER_TYPE.DELIVERY, storeStatusDelivery);
        let preOrderStatusCollection = getPreorderStatus(item, ORDER_TYPE.COLLECTION, storeStatusCollection);

        let isDeliveryTAAvailable = isDeliveryOrPreOrderAvailable(show_delivery, storeStatusDelivery, preOrderStatusDelivery);
        let isCollectionTAAvailable = isCollectionOrPreOrderAvailable(show_collection, storeStatusCollection, preOrderStatusCollection);

        let errorMessage = getToastMessageForTakeawayOpenStatus(
            countryId,
            name,
            featureGateResponse,
            orderType,
            isDeliveryTAAvailable,
            isCollectionTAAvailable
        );
        if (isValidString(errorMessage)) {
            showErrorMessage(errorMessage);
        }
    }
}

const mapStateToProps = (state) => ({
    isUserLoggedIn: selectHasUserLoggedIn(state),
    cartItems: selectCartItems(state),
    associateTakeawayResponse: state.takeawayListReducer.associateTakeawayResponse,
    distanceType: state.appState.s3ConfigResponse?.country?.distance_type,
    countryISO: state.appState.s3ConfigResponse?.country?.iso,
    countryFlag: state.appState.s3ConfigResponse?.country?.flag,
    selectedPostcode: state.addressState.selectedPostcode,
    selectedAddressId: state.addressState.selectedAddressId,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    basketStoreID: state.basketState.storeID,
    takeawayListScrollTop: state.takeawayListReducer.takeawayListScrollTop,
    languageKey: selectLanguageKey(state),
    networkConnected: getNetworkStatus(state),
    profileResponse: state.profileState.profileResponse,
    favouriteTakeaways: state.takeawayListReducer.favouriteTakeaways,
    selectedTAOrderType: state.addressState.selectedTAOrderType,
    timeZone: selectTimeZone(state),
    filterType: selectFilterType(state),
    countryId: state.appState.s3ConfigResponse?.country?.id,
    searchedFavouriteTakeawayList: state.takeawayListReducer.searchedFavouriteTakeawayList
});

const mapDispatchToProps = {
    postFavouriteTakeawayAction,
    redirectRouteAction,
    updateSelectedOrderType,
    setTakeawayScrollTop,
    updateStoreConfigResponseForViewAction,
    updateFallbackUrl,
    updateStoreConfigResponseAction,
    updateTALiveTrackingAction
};
export default connect(mapStateToProps, mapDispatchToProps)(TakeawayListWidget);
