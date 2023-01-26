import React, { Component } from 'react';
import { Animated, Dimensions, FlatList, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import {
    isCustomerApp,
    isFranchiseApp,
    isNonCustomerApp,
    isValidElement,
    isValidString,
    safeStringValue,
    isValidURL,
    getTakeawayName,
    isFoodHubApp,
    isArrayNonEmpty
} from 't2sbasemodule/Utils/helpers';
import {
    postFavouriteTakeawayAction,
    takeawayListClickAction,
    updateStoreConfigResponseForViewAction,
    stopMenuLoaderAction
} from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListAction';
import { CATEGORY_TEXT_HEIGHT, ITEMS_TO_RENDER_BEFORE_FIRST_LOAD, ITEMS_TO_RENDER_POST_FIRST_LOAD, VIEW_ID } from '../Utils/MenuConstants';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Styles from './Styles/MenuStyle';
import { T2SText } from 't2sbasemodule/UI';
import styles from './Styles/MenuList';
import MenuItemList from './MenuItemList';
import { constructSectionListData, getName, isTakeawayFavorite } from '../Utils/MenuHelpers';
import {
    getCollectionWaitingTime,
    getDeliveryWaitingTime,
    getMinOrder,
    getRatings,
    isTakeawayOpen,
    logFavouritesSegment,
    portalDiscount
} from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { Card } from 'react-native-paper';
import TakeawayDetailsCardSkeleton from '../Utils/TakeawayDetailsCardSkeleton';
import { FAVOURITE_TAKEAWAY } from '../../../FoodHubApp/TakeawayListModule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import {
    selectCurrencyFromStore,
    selectHasUserLoggedIn,
    selectIsSpanishLanguage,
    selectStoreConfigResponse,
    selectStoreId
} from 't2sbasemodule/Utils/AppSelectors';
import ViewCartButton from '../../BasketModule/View/Components/ViewCartButton';
import MenuRecentOrders from './Components/MenuRecentOrders';
import _, { debounce } from 'lodash';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import {
    reOrderBasketNavigation,
    resetReOrderFlags,
    resetReOrderResponseAction,
    setOrderIDAction,
    showHideOrderTypeAction
} from '../../OrderManagementModule/Redux/OrderManagementAction';
import { repeatAddOnAction, stopCartLoadingAction } from '../../BasketModule/Redux/BasketAction';
import { getAddressFromLatLong, resetCurrentLocationAction } from '../../AddressModule/Redux/AddressAction';
import { redirectRouteAction } from '../../../CustomerApp/Redux/Actions';
import { selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import { isPreOrderEnabled } from '../../QuickCheckoutModule/Utils/Helper';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { selectRecentOrdersOfParticularTakeaway } from '../Redux/MenuSelector';
import MenuSkeletonLoader from '../Utils/MenuSkeletonLoader';
import { selectAddOnModalVisibility, selectCartItems } from '../../BasketModule/Redux/BasketSelectors';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { getRecommendationResponse, selectFilteredRecommendation } from '../../HomeModule/Utils/HomeSelector';
import T2SFloatingActionButton from 't2sbasemodule/UI/CommonUI/T2SFloatingActionButton';
import MenuCategoryView from 't2sbasemodule/UI/CustomUI/MenuCategoryView/View/MenuCategoryView';
import MenuSearchHeader from './Components/MenuSearchHeader';
import Modal from 'react-native-modal';
import { SEGMENT_CONSTANTS, SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import MinimumOrder from '../../../FoodHubApp/TakeawayListModule/View/Components/MinimumOrder';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import PreviousOrderComponent from '../../HomeModule/View/PreviousOrderComponent';
import T2SDivider from 't2sbasemodule/UI/CommonUI/T2SDivider';
import MenuTakeawayInfoComponent from './Components/MenuTakeawayInfoComponent';
import T2SImageBackground from 't2sbasemodule/UI/CommonUI/T2SImageBackground';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import SubCatImageComponent from './Components/SubCatImageComponent';
import {
    selectCollectionStatus,
    selectDeliveryStatus,
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { getStoreConfigAction } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsAction';
import { skipStoreOpenStatus } from '../../BasketModule/Utils/BasketHelper';
import { refreshRecommendation } from '../../HomeModule/Redux/HomeAction';

let SCREEN_HEIGHT = Dimensions.get('window').height,
    TRANSITION_THRESHOLD = SCREEN_HEIGHT / 25,
    currentViewableItem = null,
    screenName = SCREEN_OPTIONS.MENU_SCREEN.screen_title,
    springAnimationTimeout,
    initialItemsToRenderTimeout,
    menuCategoryIconTimeout,
    updateStoreConfigTimeout;
let checkIsFoodhubApp = isFoodHubApp();
class MenuOptimizedScreen extends Component {
    constructor(props) {
        super(props);
        this.reOrderClicked = this.reOrderClicked.bind(this);
        this.onOrderTypeActionPressed = this.onOrderTypeActionPressed.bind(this);
        this.handleFavouriteTakeaway = this.handleFavouriteTakeaway.bind(this);
        this.handleSearchIconClickAction = this.handleSearchIconClickAction.bind(this);
        this.handleViewInfoClick = this.handleViewInfoClick.bind(this);
        this.handleReviewsClick = this.handleReviewsClick.bind(this);
        this.onScrollListener = this.onScrollListener.bind(this);
        this.handleTabHeaderLayout = this.handleTabHeaderLayout.bind(this);
        this.renderSectionItem = this.renderSectionItem.bind(this);
        this.renderMenuItem = this.renderMenuItem.bind(this);
        this.handleMenuFloatingAction = this.handleMenuFloatingAction.bind(this);
        this.handleCloseCategoryList = this.handleCloseCategoryList.bind(this);
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
        let storeConfig = this.props.route?.params?.storeConfig;
        this.state = {
            sectionListData: [
                {
                    title: '',
                    data: [
                        {
                            item: {}
                        }
                    ],
                    index: 0
                }
            ],
            filteredMenu: [],
            menuRecommendation: null,
            headerData: [],
            discount: portalDiscount(storeConfig),
            minOrder: getMinOrder(storeConfig),
            rating: getRatings(storeConfig),
            delivery_wait: getDeliveryWaitingTime(storeConfig),
            collection_wait: getCollectionWaitingTime(storeConfig),
            isFavorite: isTakeawayFavorite(storeConfig?.id, props.favouriteTakeaways, props.isUserLoggedIn),
            takeawayToFavoriteId: null,
            showLoader: false,
            storeConfigResponse: storeConfig,
            activeIndex: 1,
            onScrollFinished: false,
            stickyHeader: new Animated.Value(0),
            springValue: new Animated.Value(0),
            springOpacity: new Animated.Value(0),
            isStickyHeaderShown: false,
            collapsedHeaderHeight: 0,
            stickyHeaderValue: new Animated.Value(0),
            menuCardTransform: new Animated.Value(0),
            initialItemsToRender: ITEMS_TO_RENDER_BEFORE_FIRST_LOAD,
            onScrollBeginDrag: false,
            showMenuCategory: false,
            isScrolledManually: false,
            takeaway_name: '',
            showMenuCategoryIcon: false,
            bestSellingResponse: null
        };
        //TODO to get exact position in section list  - furture purpose
        // this.viewAbilityConfig = {
        //     waitForInteraction: false,
        //     minimumViewTime: 100,
        //     viewAreaCoveragePercentThreshold: 5
        // };
    }

    static getDerivedStateFromProps(props, state) {
        const { storeConfigResponse, storeConfigRating, filteredMenu, bestSellingResponse, menuRecommendation } = props;
        let value = {};
        if (
            (isValidElement(filteredMenu) && filteredMenu !== state.filteredMenu) ||
            (isValidElement(filteredMenu) && props.menuRecommendation !== state.menuRecommendation) ||
            (isValidElement(bestSellingResponse) && bestSellingResponse !== state.bestSellingResponse)
        ) {
            let sectionListData = isArrayNonEmpty(filteredMenu) && constructSectionListData(filteredMenu, menuRecommendation);
            let headerData = isArrayNonEmpty(sectionListData) && sectionListData.map((d) => d.title);
            value = {
                sectionListData: sectionListData,
                filteredMenu: props.filteredMenu,
                headerData: headerData,
                menuRecommendation: props.menuRecommendation,
                bestSellingResponse: props.bestSellingResponse
            };
        }
        if (isValidElement(storeConfigResponse) && storeConfigResponse !== state.storeConfigResponse) {
            if (isNonCustomerApp()) {
                value = {
                    discount: portalDiscount(storeConfigResponse),
                    minOrder: getMinOrder(storeConfigResponse),
                    rating: getRatings(storeConfigRating),
                    collection_wait: getCollectionWaitingTime(storeConfigResponse),
                    delivery_wait: getDeliveryWaitingTime(storeConfigResponse),
                    storeConfigResponse
                };
            } else {
                value = { storeConfigResponse };
            }
        }

        if (state.showLoader && (isValidString(state.delivery_wait) || isValidString(state.collection_wait))) {
            value = { showLoader: false };
        }
        return _.isEmpty(value) ? null : value;
    }

    componentDidMount() {
        if (isNonCustomerApp()) {
            this.renderCardTransformAnimation();
            springAnimationTimeout = setTimeout(() => {
                this.startSpringAnimation();
            }, 600);
        }
        menuCategoryIconTimeout = setTimeout(() => {
            this.setState({ showMenuCategoryIcon: true });
        }, 2000);
        this.getMenuPersistLogic();
        if (this.props.isBasketLoading) {
            this.props.stopCartLoadingAction();
        }
        initialItemsToRenderTimeout = setTimeout(() => {
            if (this.state.initialItemsToRender === ITEMS_TO_RENDER_BEFORE_FIRST_LOAD) {
                this.setState({ initialItemsToRender: ITEMS_TO_RENDER_POST_FIRST_LOAD });
            }
        }, 50);

        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            if (isValidElement(this.state.takeawayToFavoriteId) && isValidElement(this.props.isUserLoggedIn) && this.props.isUserLoggedIn) {
                this.handleFavouriteTakeaway(this.state.takeawayToFavoriteId, this.state.takeaway_name);
            }
        });
    }

    renderCardTransformAnimation() {
        Animated.timing(this.state.menuCardTransform, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }

    startSpringAnimation() {
        Animated.parallel([
            Animated.timing(this.state.springOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }),
            Animated.spring(this.state.springValue, {
                toValue: 1,
                friction: 5,
                tension: 15,
                velocity: 20,
                useNativeDriver: true
            })
        ]).start();
    }

    componentWillUnmount() {
        this.props.resetReOrderFlags();
        if (isValidElement(springAnimationTimeout)) {
            clearTimeout(springAnimationTimeout);
        }
        if (isValidElement(initialItemsToRenderTimeout)) {
            clearTimeout(initialItemsToRenderTimeout);
        }
        if (isValidElement(menuCategoryIconTimeout)) {
            clearTimeout(menuCategoryIconTimeout);
        }
        if (isValidElement(updateStoreConfigTimeout)) {
            clearTimeout(updateStoreConfigTimeout);
        }
    }

    getMenuPersistLogic() {
        const { route, storeConfigResponse, prevStoreConfigResponse } = this.props;
        if (isValidElement(route) && isValidElement(route.params)) {
            const isFromRecentTakeAway = isValidElement(route.params.isFromRecentTakeAway) ? route.params.isFromRecentTakeAway : false;
            if (isFromRecentTakeAway && isNonCustomerApp()) {
                this.setState({
                    showLoader: true
                });
            }
            if (route.params.isFromCartIcon && isValidElement(prevStoreConfigResponse)) {
                //For Customer App we are hitting the API every kill and launch
                let storeConfigData = isCustomerApp() ? storeConfigResponse : prevStoreConfigResponse;
                this.props.takeawayListClickAction(storeConfigData, isFromRecentTakeAway);
            } else if (isValidElement(route.params.storeConfig)) {
                this.props.takeawayListClickAction(route.params.storeConfig, isFromRecentTakeAway);
            } else if (isValidElement(storeConfigResponse)) {
                this.props.takeawayListClickAction(storeConfigResponse, isFromRecentTakeAway);
            }
        }
    }

    handleReOrder = debounce(
        (reOrderId, storeID, orderType) => {
            if (isValidElement(reOrderId)) {
                Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.REORDER_ACTION, {
                    order_id: safeStringValue(reOrderId)
                });
                this.props.resetReOrderResponseAction();
                this.props.reOrderBasketNavigation(reOrderId, storeID, this.props.navigation, orderType, screenName);
                this.props.setOrderIDAction(reOrderId);
            }
        },
        300,
        { leading: true, trailing: false }
    );

    renderSectionItem({ item, section }) {
        if (section.index === 0) {
            return isNonCustomerApp() ? this.renderTakeawayInfoCard(item, section) : this.renderMenuRecentOrders(item, section);
        }
        return this.renderMenuList(item);
    }

    renderInfoCardImage() {
        const { headerImage } = this.props;
        //to do: need to change for bigfoodie
        if (!isValidURL(headerImage)) {
            return (
                <T2SImageBackground
                    style={[styles.defaultHeaderImage, styles.alignCenterStyle]}
                    source={
                        isFranchiseApp()
                            ? require('../../../FranchiseApp/Images/no_image_background.png')
                            : require('../../../FoodHubApp/Images/no_image_background.png')
                    }>
                    <T2SImage
                        style={styles.headerLogoImageStyle}
                        source={
                            isFranchiseApp()
                                ? require('../../../FranchiseApp/Images/app_logo_transparent.png')
                                : require('../../../FoodHubApp/Images/foodhub_logo_white.png')
                        }
                    />
                </T2SImageBackground>
            );
        }
    }

    renderTakeawayInfoCard(item, section) {
        const { isMenuLoading } = this.props;
        const { sectionListData } = this.state;
        const detailedCardTransform = this.state.menuCardTransform.interpolate({
            inputRange: [0, 1],
            outputRange: [-(SCREEN_HEIGHT / 2.47), 0]
        });
        const menuCardTransform = {
            transform: [
                {
                    translateY: detailedCardTransform
                }
            ]
        };
        return (
            <View>
                <Animated.View style={menuCardTransform}>
                    <T2SView accessible={false} style={styles.cardContainerStyle}>
                        {this.renderCard()}
                    </T2SView>
                    {this.renderBestSellingList()}
                    {sectionListData.length > 1 && !isMenuLoading && this.renderMenuRecentOrders(item, section)}
                </Animated.View>
                {sectionListData.length === 1 && !isMenuLoading && this.renderNoMenu()}
                {isMenuLoading && <MenuSkeletonLoader />}
            </View>
        );
    }

    renderMenuRecentOrders(item, section) {
        const { route, isMenuLoading, recentOrders } = this.props;
        let isFromReOrder =
            isValidElement(route) &&
            isValidElement(route.params) &&
            isValidElement(route.params.isFromReOrder) &&
            route.params.isFromReOrder
                ? route.params.isFromReOrder
                : false;
        return (
            <View>
                {isCustomerApp() && this.renderBestSellingList()}
                {isValidElement(recentOrders) && recentOrders.length > 0 && (
                    <MenuRecentOrders isFromReOrder={isFromReOrder} handleReOrder={this.reOrderClicked.bind(this)} />
                )}
                <View style={Styles.categoryContainer} />
                {isCustomerApp() && isMenuLoading && <MenuSkeletonLoader />}
            </View>
        );
    }
    renderMenuList(item) {
        if (isValidElement(item)) {
            let { name, description, image, second_language_name, id } = item;
            let isValidsubCatImage = isValidURL(image);
            return (
                <View>
                    {(isValidElement(name) || isValidElement(description)) && (
                        <View style={Styles.subCategoryContainer}>
                            {isValidsubCatImage && (
                                <SubCatImageComponent
                                    imageUrl={image}
                                    itemId={id}
                                    screenName={screenName}
                                    imageText={getName(item.name, second_language_name)}
                                />
                            )}
                            {!isValidsubCatImage && isValidString(item.name) && (
                                <T2SText
                                    id={VIEW_ID.SUB_CATEGORY + name?.toString()}
                                    screenName={screenName}
                                    style={Styles.subCategoryStyle}>
                                    {getName(name, second_language_name)}
                                </T2SText>
                            )}
                            {isValidString(description) && (
                                <T2SText id={VIEW_ID.SUB_CATEGORY + description} screenName={screenName} style={Styles.descriptionStyle}>
                                    {description}
                                </T2SText>
                            )}
                        </View>
                    )}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(keyExtractorItem) => keyExtractorItem?.id?.toString()}
                        data={item?.item}
                        renderItem={this.renderMenuItem}
                        ItemSeparatorComponent={() => <T2SDivider style={Styles.itemDivider} />}
                    />
                    <T2SDivider style={Styles.itemDivider} />
                </View>
            );
        }
    }

    renderMenuItem({ item }) {
        return (
            <MenuItemList
                isFromReOrder={this.props.isFromReOrder}
                name={item.name}
                offer={item.offer}
                secondLanguage={item.second_language_name}
                description={item.description}
                price={item.price}
                currency={this.props.currency}
                item={item}
                screenName={screenName}
                image={item.image}
                item_id={item.id}
                category_id={item.category_id}
                isFromReOrderItem={item.isFromReOrderItem}
                collectionType={item.collection}
                deliveryType={item.delivery}
            />
        );
    }

    renderSectionHeader({ section }) {
        return (
            section.index !== 0 && (
                <View style={Styles.categoryContainer}>
                    <T2SText id={VIEW_ID.CATEGORY} screenName={screenName} style={Styles.categoryStyle}>
                        {section.title}
                    </T2SText>
                </View>
            )
        );
    }

    renderFavorite() {
        const { storeConfigResponse } = this.props;
        if (isValidElement(storeConfigResponse) && isValidElement(storeConfigResponse.id)) {
            return (
                <T2SIcon
                    id={this.state.isFavorite ? VIEW_ID.HEART_FILL_ICON : VIEW_ID.HEART_STOKE_ICON}
                    screenName={screenName}
                    icon={this.state.isFavorite ? FONT_ICON.HEART_FILL : FONT_ICON.HEART_STROKE}
                    color={Colors.rating_color}
                    size={22}
                    onPress={this.handleFavouriteTakeaway.bind(this, storeConfigResponse.id, storeConfigResponse.name)}
                />
            );
        }
    }

    renderSearch() {
        return (
            <T2SIcon
                id={VIEW_ID.SEARCH_ICON}
                screenName={screenName}
                icon={FONT_ICON.SEARCH}
                color={Colors.suvaGrey}
                style={Styles.searchIconStyle}
                size={22}
                onPress={this.handleSearchIconClickAction}
            />
        );
    }

    handleSearchIconClickAction() {
        this.props.navigation.navigate(SCREEN_OPTIONS.MENU_SEARCH_SCREEN.route_name);
    }

    handleFavouriteTakeaway(takeaway_id, takeaway_name) {
        const { countryBaseFeatureGateResponse } = this.props;
        let { isFavorite } = this.state;
        Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.FAVORITE_ICON_CLICKED);
        if (isValidString(takeaway_id)) {
            if (isValidElement(this.props.isUserLoggedIn) && this.props.isUserLoggedIn) {
                this.setState({ isFavorite: !isFavorite, takeawayToFavoriteId: null, takeaway_name: takeaway_name });
                this.props.postFavouriteTakeawayAction(takeaway_id, isFavorite ? FAVOURITE_TAKEAWAY.NO : FAVOURITE_TAKEAWAY.YES);
                logFavouritesSegment(
                    countryBaseFeatureGateResponse,
                    takeaway_name,
                    isFavorite ? SEGMENT_CONSTANTS.REMOVE : SEGMENT_CONSTANTS.ADD,
                    this.props.favouriteTakeaways,
                    true
                );
            } else {
                this.setState({ takeawayToFavoriteId: takeaway_id });
                this.props.redirectRouteAction(SCREEN_OPTIONS.MENU_SCREEN.route_name);
                handleNavigation(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
            }
        }
    }

    renderCard() {
        let { collection_wait, delivery_wait, showLoader } = this.state;
        let {
            currency,
            storeFromListResponse,
            storeConfigName,
            storeConfigTotalReviews,
            storeConfigId,
            assignDriverThrough,
            storeStatusCollection,
            storeConfigShowCollection,
            storeConfigDistanceInMiles,
            storeConfigShowDelivery,
            storeStatusDelivery,
            storeConfigCharge,
            storeConfigPreOrderCollection,
            storeConfigPreOrderDelivery,
            distanceType,
            storeConfigDeliveryCharge,
            route
        } = this.props;
        const springValue = {
            transform: [{ scale: this.state.springValue }],
            opacity: this.state.springOpacity
        };
        let storeResponseFromList = route?.params?.storeConfig;
        if (showLoader) {
            return (
                <Card accessible={false} elevation={2} style={{ height: SCREEN_HEIGHT / 4.44 }}>
                    <TakeawayDetailsCardSkeleton />
                </Card>
            );
        } else {
            return (
                <MenuTakeawayInfoComponent
                    storeFromListResponse={storeFromListResponse}
                    distanceType={distanceType}
                    currency={currency}
                    collection_wait={collection_wait}
                    delivery_wait={delivery_wait}
                    showLoader={showLoader}
                    springValue={springValue}
                    isFavorite={this.state.isFavorite}
                    handleFavouriteTakeaway={this.handleFavouriteTakeaway.bind(this)}
                    handleReviewsClick={this.handleReviewsClick.bind(this)}
                    handleViewInfoClick={this.handleViewInfoClick.bind(this)}
                    storeConfigName={storeConfigName}
                    storeConfigTotalReviews={storeConfigTotalReviews}
                    storeConfigId={storeConfigId}
                    assignDriverThrough={assignDriverThrough}
                    storeStatusCollection={storeStatusCollection}
                    storeStatusDelivery={storeStatusDelivery}
                    storeConfigShowCollection={storeConfigShowCollection}
                    storeConfigDistanceInMiles={storeConfigDistanceInMiles}
                    storeConfigShowDelivery={storeConfigShowDelivery}
                    storeConfigCharge={storeConfigCharge}
                    storeConfigPreOrderCollection={storeConfigPreOrderCollection}
                    storeConfigPreOrderDelivery={storeConfigPreOrderDelivery}
                    storeConfigDeliveryCharge={storeConfigDeliveryCharge}
                    deliveryChargeFromList={storeResponseFromList?.delivery}
                />
            );
        }
    }

    handleReviewsClick() {
        const { storeConfigResponse, countryBaseFeatureGateResponse } = this.props;
        if (isValidElement(storeConfigResponse)) {
            Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.REVIEWS);
            handleNavigation(SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name);
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.REVIEW_PAGE_VIEWED, {
                takeaway: storeConfigResponse.name
            });
        }
    }

    handleViewInfoClick() {
        const { storeConfigResponse, countryBaseFeatureGateResponse } = this.props;
        this.props.getStoreConfigAction();
        if (isValidElement(storeConfigResponse)) {
            this.props.showHideOrderTypeAction(false);
            Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.TAKEAWAY_INFO);
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.VIEW_INFO, {
                takeaway: storeConfigResponse.name
            });
            handleNavigation(SCREEN_OPTIONS.TAKEAWAY_DETAILS.route_name, { isFromMenu: true });
        }
    }

    renderViewCartButton() {
        return <ViewCartButton screenName={screenName} />;
    }

    onScrollListener(event) {
        if (event.nativeEvent.contentOffset.y > TRANSITION_THRESHOLD) {
            if (!this.state.isStickyHeaderShown) {
                this.setState({ isStickyHeaderShown: true });
            }
        } else if (event.nativeEvent.contentOffset.y < TRANSITION_THRESHOLD) {
            if (this.state.isStickyHeaderShown) {
                this.setState({ isStickyHeaderShown: false, activeIndex: 1 });
            }
        }
    }

    renderNoMenu() {
        return (
            <View style={styles.emptyMenuContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.EMPTY_MENU_TEXT} style={styles.emptyMenuText}>
                    {LOCALIZATION_STRINGS.EMPTY_MENU}
                </T2SText>
            </View>
        );
    }

    handleTabHeaderLayout(event) {
        if (isValidElement(event) && isValidElement(event.nativeEvent) && isValidElement(event.nativeEvent.layout))
            this.setState({ collapsedHeaderHeight: event.nativeEvent.layout.height });
    }

    onOrderTypeActionPressed() {
        const {
            isVisible,
            storeConfigShowCollection,
            storeConfigShowDelivery,
            storeStatusDelivery,
            storeStatusCollection,
            storeConfigPreOrder,
            countryBaseFeatureGateResponse,
            storeConfigId
        } = this.props;
        Analytics.logEvent(ANALYTICS_SCREENS.MENU, ANALYTICS_EVENTS.ORDER_TYPE);
        if (isValidElement(isVisible) && isVisible === true) {
            this.props.repeatAddOnAction(false);
        }
        if (
            (isCustomerApp() && !isValidElement(storeConfigId)) ||
            skipStoreOpenStatus(countryBaseFeatureGateResponse) ||
            isTakeawayOpen(storeConfigShowDelivery, storeStatusDelivery, storeConfigShowCollection, storeStatusCollection) ||
            isPreOrderEnabled(storeConfigPreOrder)
        ) {
            this.props.showHideOrderTypeAction(true);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_MESSAGE);
        }
    }

    goBackHandler = debounce(
        () => {
            Analytics.logBackPress(ANALYTICS_SCREENS.MENU);
            if (this.props.navigation.canGoBack()) {
                this.props.navigation.goBack();
                if (checkIsFoodhubApp) {
                    updateStoreConfigTimeout = setTimeout(() => {
                        this.props.updateStoreConfigResponseForViewAction(null);
                    }, 10);
                }
            }
        },
        1000,
        { leading: true, trailing: false }
    );

    reOrderClicked(item) {
        const { storeConfigResponse, selectedOrderType } = this.props;
        const storeId =
            isValidElement(item.store) && isValidElement(item.store.id)
                ? item.store.id
                : isValidElement(storeConfigResponse) && isValidElement(storeConfigResponse.id) && storeConfigResponse.id;
        this.handleReOrder(item.id, storeId, selectedOrderType);
    }

    getStickyHeaderTop() {
        const { stickyHeader } = this.state;

        return isNonCustomerApp()
            ? stickyHeader.interpolate({
                  inputRange: [
                      0,
                      TRANSITION_THRESHOLD - 70,
                      TRANSITION_THRESHOLD - 60,
                      TRANSITION_THRESHOLD - 50,
                      TRANSITION_THRESHOLD - 40,
                      TRANSITION_THRESHOLD - 30,
                      TRANSITION_THRESHOLD - 20,
                      TRANSITION_THRESHOLD - 10,
                      TRANSITION_THRESHOLD
                  ],
                  outputRange: [-200, -200, -200, -200, -60, -50, -40, -10, 0],
                  extrapolate: 'clamp'
              })
            : stickyHeader.interpolate({ inputRange: [0, TRANSITION_THRESHOLD], outputRange: [0, 0] });
    }

    getHeaderMainContainerOpacity() {
        return this.state.stickyHeader.interpolate({
            inputRange: [0, 100, SCREEN_HEIGHT / 2.38],
            outputRange: [1, 0, 0]
        });
    }

    getSpringValue() {
        const { stickyHeader } = this.state;

        const dynamicHeader = stickyHeader.interpolate({
            inputRange: [-200, 0, 50, 70, 100, 150, 200],
            outputRange: [100, 0, -10, -20, -30, -50, -60]
        });

        return {
            transform: [{ scale: this.state.springValue }, { translateY: dynamicHeader }]
        };
    }

    renderBestSellingList() {
        const { bestSellingResponse, selectedOrderType } = this.props;
        if (isValidElement(bestSellingResponse) && bestSellingResponse.length > 0)
            return (
                <View style={[Styles.categoryContainer, Styles.bestSellingAlignment]}>
                    <View style={Styles.likeIconStyle}>
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
                    <PreviousOrderComponent
                        screenName={screenName}
                        previousOrderResponse={bestSellingResponse}
                        isFromBestSelling={true}
                        selectedOrderType={selectedOrderType}
                    />
                </View>
            );
    }

    render() {
        const { isSpanish, selectedOrderType } = this.props;
        const { sectionListData, isStickyHeaderShown } = this.state;
        const loading = this.props.route?.params?.isLoading;
        if (isValidElement(sectionListData)) {
            return (
                <View style={[Styles.parentContainer]}>
                    <MenuSearchHeader
                        goBackHandler={this.goBackHandler}
                        handleSearchIconClickAction={this.handleSearchIconClickAction}
                        onOrderTypeActionPressed={this.onOrderTypeActionPressed}
                        isSpanish={isSpanish}
                        selectedOrderType={selectedOrderType}
                        showTakeAwayName={isStickyHeaderShown}
                        takeAwayName={getTakeawayName(this.props.storeConfigName)}
                    />
                    {isStickyHeaderShown && <View style={Styles.dividerStyle} />}
                    {isValidElement(loading) && loading ? <MenuSkeletonLoader /> : this.renderAnimatedSectionList()}
                    {isNonCustomerApp() && <StatusBar backgroundColor={'transparent'} translucent={true} barStyle={'dark-content'} />}
                    {this.renderViewCartButton()}
                    {this.renderMenuCategoryPopup()}
                    {this.renderMenuFloatingButton()}
                </View>
            );
        }
    }

    renderAnimatedSectionList() {
        const { sectionListData } = this.state;
        const { isMenuLoading, cartItems } = this.props;
        return (
            <Animated.SectionList
                windowSize={1000}
                contentContainerStyle={isValidElement(cartItems) && cartItems.length > 0 && styles.menuListBottomPadding}
                ref={(ref) => (this.contentRef = ref)}
                showsVerticalScrollIndicator={false}
                sections={sectionListData}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: {} } }], {
                    useNativeDriver: true,
                    listener: (event) => {
                        this.onScrollListener(event);
                    }
                })}
                renderItem={this.renderSectionItem}
                renderSectionHeader={!isMenuLoading && this.renderSectionHeader}
                initialNumToRender={5}
                scrollEventThrottle={16}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                bounces={false}
                scrollEnabled={!isMenuLoading}
                onViewableItemsChanged={this.onViewableItemsChanged}
                stickySectionHeadersEnabled={false}
            />
        );
    }

    onViewableItemsChanged({ viewableItems }) {
        const { sectionListData } = this.state;
        if (isValidElement(viewableItems)) {
            if (
                isValidElement(viewableItems.length === 1) &&
                isValidElement(viewableItems[0]) &&
                isValidElement(viewableItems[0].section) &&
                viewableItems[0].section.index === 0
            ) {
                currentViewableItem = viewableItems[0];
            } else if (
                isValidElement(sectionListData) &&
                viewableItems.length > 1 &&
                isValidElement(viewableItems[viewableItems.length - 1]) &&
                isValidElement(viewableItems[viewableItems.length - 1].section) &&
                viewableItems[viewableItems.length - 1].section.index === sectionListData.length - 1
            ) {
                currentViewableItem = viewableItems[viewableItems.length - 1];
            } else {
                let midLength = Math.floor(viewableItems.length / 2);
                if (isValidElement(viewableItems[midLength])) {
                    currentViewableItem = viewableItems[midLength];
                }
            }
        }
    }
    getActiveIndex(item) {
        return isValidElement(item) && item.section.index > 0 ? item.section.index : 1;
    }

    renderMenuCategoryPopup() {
        const { showMenuCategory, headerData } = this.state;
        return (
            <Modal
                isVisible={showMenuCategory}
                style={[styles.categoryContainer, { height: CATEGORY_TEXT_HEIGHT * headerData.length }]}
                animationInTiming={200}
                onBackdropPress={this.handleCloseCategoryList}>
                {this.renderMenuCategoryView()}
            </Modal>
        );
    }

    renderMenuCategoryView() {
        const { showMenuCategory, headerData, activeIndex } = this.state;
        if (showMenuCategory) {
            return (
                <View>
                    <MenuCategoryView
                        navigation={this.props.navigation}
                        data={headerData}
                        activeIndex={activeIndex}
                        onItemSelected={(index) => {
                            this.handleOnItemSelected(index);
                        }}
                    />
                </View>
            );
        }
    }

    renderMenuFloatingButton() {
        const { showMenuCategory, showMenuCategoryIcon } = this.state;
        if (!this.props.isMenuLoading && showMenuCategoryIcon) {
            return (
                <View style={styles.floatingButtonBackgroundViewStyle}>
                    <T2SFloatingActionButton
                        screenName={screenName}
                        id={VIEW_ID.MENU_CATEGORY_ICON}
                        onPress={this.handleMenuFloatingAction}
                        icon={showMenuCategory ? FONT_ICON.CLOSE : FONT_ICON.FOOD_MENU}
                        iconSize={20}
                        floatingButtonStyle={styles.floatingButtonStyle}
                        floatingButtonIconStyle={styles.floatingButtonIconStyle}
                        floatingButtonTextStyle={styles.floatingButtonTextStyle}
                        name={showMenuCategory ? LOCALIZATION_STRINGS.CLOSE.toUpperCase() : LOCALIZATION_STRINGS.MENU.toUpperCase()}
                    />
                </View>
            );
        }
    }
    renderMinOrder = (minOrder, name, currency, freeDelivery) => {
        return (
            <MinimumOrder
                name={name}
                minOrder={minOrder}
                currency={currency}
                freeDelivery={freeDelivery}
                screenName={this.props.screenName}
            />
        );
    };

    handleMenuFloatingAction() {
        const { showMenuCategory, isScrolledManually } = this.state;
        if (!showMenuCategory && !isScrolledManually) {
            this.setState({ activeIndex: this.getActiveIndex(currentViewableItem), showMenuCategory: !this.state.showMenuCategory });
        } else {
            this.setState({ showMenuCategory: !this.state.showMenuCategory });
        }
    }

    handleOnItemSelected(key) {
        if (isValidElement(key) && isValidElement(this.contentRef)) {
            let timer;
            this.setState({ activeIndex: key, isScrolledManually: true });
            let wait = new Promise((resolve) => (timer = setTimeout(resolve, 100))).finally(() => clearTimeout(timer)); // Smaller number should work
            wait.then(() => {
                this.contentRef.scrollToLocation({
                    sectionIndex: key,
                    itemIndex: 0,
                    viewPosition: 0,
                    animated: true,
                    viewOffset: isNonCustomerApp() ? this.state.collapsedHeaderHeight : 0
                });
            });
        }
        this.handleCloseCategoryList();
    }

    handleCloseCategoryList() {
        this.setState({ showMenuCategory: false });
    }
}

const mapStateToProps = (state) => ({
    filteredMenu: state.menuState.uiFilteredMenu,
    storeConfigResponse: selectStoreConfigResponse(state),
    isMenuLoading: state.takeawayListReducer.isMenuLoading,
    currency: selectCurrencyFromStore(state),
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    menuRecommendation: selectFilteredRecommendation(state),
    isUserLoggedIn: selectHasUserLoggedIn(state),
    storeID: selectStoreId(state),
    favouriteTakeaways: state.takeawayListReducer.favouriteTakeaways,
    selectedOrderType: selectOrderType(state),
    isBasketLoading: state.basketState.isBasketLoading,
    addressFromLocation: state.addressState.addressFromLocation,
    recentOrders: selectRecentOrdersOfParticularTakeaway(state),
    isVisible: selectAddOnModalVisibility(state),
    storeFromListResponse: state.appState.storeFromListResponse,
    isSpanish: selectIsSpanishLanguage(state),
    bestSellingResponse: selectFilteredRecommendation(state),
    ourRecommendation: getRecommendationResponse(state),
    cartItems: selectCartItems(state),
    basketStoreID: state.basketState.storeID,
    prevStoreConfigResponse: state.appState.prevStoreConfigResponse,
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigRating: state.appState.storeConfigResponse?.rating,
    storeConfigTotalReviews: state.appState.storeConfigResponse?.total_reviews,
    storeConfigId: state.appState.storeConfigResponse?.id,
    assignDriverThrough: state.appState.storeConfigResponse?.assign_driver_through,
    storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    storeStatusCollection: selectCollectionStatus(state),
    storeStatusDelivery: selectDeliveryStatus(state),
    storeConfigDistanceInMiles: state.appState.storeConfigResponse?.distanceInMiles,
    storeConfigCharge: state.appState.storeConfigResponse?.charge,
    storeConfigPreOrderDelivery: selectPreorderDeliveryStatus(state),
    storeConfigPreOrderCollection: selectPreorderCollectionStatus(state),
    storeConfigPreOrder: state.appState.storeConfigResponse?.preorder,
    storeConfigDeliveryCharge: state.appState.storeConfigResponse?.delivery,
    distanceType: state.appState.s3ConfigResponse?.country?.distance_type,
    profileResponse: state.profileState.profileResponse
});

const mapDispatchToProps = {
    takeawayListClickAction,
    resetReOrderResponseAction,
    setOrderIDAction,
    resetReOrderFlags,
    getAddressFromLatLong,
    resetCurrentLocationAction,
    postFavouriteTakeawayAction,
    redirectRouteAction,
    showHideOrderTypeAction,
    stopCartLoadingAction,
    reOrderBasketNavigation,
    repeatAddOnAction,
    updateStoreConfigResponseForViewAction,
    getStoreConfigAction,
    stopMenuLoaderAction,
    refreshRecommendation
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuOptimizedScreen);
