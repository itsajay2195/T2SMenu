import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState, ScrollView, View } from 'react-native';
import BaseComponent from '../../BaseModule/BaseComponent';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import OrderTypeAction from './components/OrderTypeAction';
import { SCREEN_NAME, STATUS_FETCH_TIMEOUT, VIEW_ID } from '../Utils/HomeConstants';
import styles from './Styles/HomeStyle';
import { dashboardSync, hideRatingAction } from '../Redux/HomeAction';
import OurRecommendations from './OurRecommendations';
import PreviousOrderComponent from './PreviousOrderComponent';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import * as Analytics from '../../AnalyticsModule/Analytics';
import {
    getDateStr,
    getTakeawayId,
    isArrayNonEmpty,
    isCustomerApp,
    isValidElement,
    isValidString,
    isValidURL
} from 't2sbasemodule/Utils/helpers';
import CurrentOffersComponent from './CurrentOffersComponent';
import {
    isCollectionAvailableSelector,
    isDeliveryAvailableSelector,
    isPreOrderAvailableSelector,
    isTakeAwayOpenSelector,
    selectCurrencySymbol,
    selectHasUserLoggedIn,
    selectPrimaryAddressSelector,
    selectTimeZone
} from 't2sbasemodule/Utils/AppSelectors';
import OurRecommendationLoader from './SkeletonLoaders/OurRecommendationLoader';
import CurrentOffersLoader from './SkeletonLoaders/CurrentOffersLoader';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import ViewAllReviewsScreen from '../../ReviewModule/View/ViewAllReviewsScreen';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { getStoreConfigAction, getTakeawayImageListAction } from '../../TakeawayDetailsModule/Redux/TakeawayDetailsAction';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import T2SStarRating from 't2sbasemodule/UI/CommonUI/T2SStarRating';
import CurrentOrderStatus from './CurrentOrderStatusWidget';
import { ORDER_STATUS, ORDER_TYPE } from '../../BaseModule/BaseConstants';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { getReviewOrderID, isStoreAPIOptimisationEnabled, isStoreStatusClosed } from '../Utils/HomeHelper';
import PreviousOrderLoader from './SkeletonLoaders/PreviousOrderLoader';
import {
    disableReorderButtonAction,
    makeGetOrderListAction,
    reOrderAction,
    reOrderBasketNavigation,
    resetReOrderFlags,
    resetReOrderResponseAction,
    setOrderIDAction,
    showHideOrderTypeAction,
    updateOrderDetailsData
} from '../../OrderManagementModule/Redux/OrderManagementAction';
import { updateStoreIdIntoBasket } from '../../BasketModule/Redux/BasketAction';
import HomeScreenBottomButtons from './components/HomeScreenBottomButtons';
import _, { debounce } from 'lodash';
import { isGPSLocationEnabled } from 't2sbasemodule/UI/CustomUI/LocationManager/Utils/LocationManagerHelper';
import Geolocation from '@react-native-community/geolocation';
import {
    getAddressFromLatLong,
    resetCurrentLocationAction,
    selectDeliveryAddressAction,
    updateSelectedOrderType
} from '../../AddressModule/Redux/AddressAction';
import { selectOrderID, selectOrderType } from '../../OrderManagementModule/Redux/OrderManagementSelectors';
import AndroidBackExit from '../../../T2SBaseModule/Utils/AndroidBackExit';
import { extractOrderType, getValidAddress } from '../../OrderManagementModule/Utils/OrderManagementHelper';
import { isPreOrderEnabled } from '../../QuickCheckoutModule/Utils/Helper';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { RE_ORDER_TRIGGER_SCREEN } from '../../OrderManagementModule/Utils/OrderManagementConstants';
import { getTotalReviewsCount } from '../../ReviewModule/Utils/ReviewHelper';
import GenericImageComponent from './GenericImageComponent';
import { selectFilteredRecommendation } from '../Utils/HomeSelector';
import ItemNotAvailableModal from '../../BasketModule/View/Components/ItemNotAvailableModal';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import {
    selectCollectionStatus,
    selectDeliveryStatus,
    selectPreorderCollectionStatus,
    selectPreorderDeliveryStatus
} from '../../../FoodHubApp/TakeawayListModule/Redux/TakeawayListSelectors';
import { isOrderTypeEnabled, isTakeawayOpen } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { AppConstants } from '../../../CustomerApp/Utils/AppContants';
import { checkIsStoreClosed, getTACloseMessage, skipStoreOpenStatus } from '../../BasketModule/Utils/BasketHelper';

let dashBoardSyncTimer;
let currentAppState = AppConstants.APP_STATUS.ACTIVE;
let orderAPISkipCount = 0;
const HEARTBEAT_SKIP_ORDER_API = 4; // Based on STATUS_FETCH_TIMEOUT
const HEARTBEAT_SKIP_STORE_API_10 = 10; // every 1 mint, hit store API
const HEARTBEAT_SKIP_STORE_API_2 = 2;
let storeAPISkipCount = 0;

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.handleOrderTypePress = this.handleOrderTypePress.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.state = {
            notificationCount: 0,
            previousOrderId: 0,
            showRating: true,
            reOrderType: '', //Order type of Completed Order which we reOrdering.
            reOrderID: 0,
            reOrderStoreId: null
        };
    }

    componentWillUnmount() {
        if (isValidElement(dashBoardSyncTimer)) {
            clearInterval(dashBoardSyncTimer);
            dashBoardSyncTimer = null;
        }
        if (isValidElement(this.navigationOnFocusEventListener)) {
            this.props.navigation.removeListener(this.navigationOnFocusEventListener);
        }
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.props.resetReOrderFlags();
        this.props.disableReorderButtonAction(false);
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.HOME_SCREEN);
        this.navigationOnFocusEventListener = this.props.navigation.addListener('focus', () => {
            this.props.dashboardSync();
        });

        if (this.props.isMenuLoading) {
            this.props.stopMenuLoaderAction();
        }
        this.setDefaultOrderType();
        if (isValidElement(dashBoardSyncTimer)) {
            clearInterval(dashBoardSyncTimer);
            dashBoardSyncTimer = null;
        }
        dashBoardSyncTimer = setInterval(() => {
            this.refreshOrderAndStoreInformation();
        }, STATUS_FETCH_TIMEOUT);
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    refreshOrderAndStoreInformation = () => {
        const {
            pendingOrder,
            isUserLoggedIn,
            opening_hours,
            store_status,
            timeZone,
            store_endpoint_hit_durations,
            store_api_optimisation
        } = this.props;
        if (isUserLoggedIn) {
            // If user have pending order, hit order api every 30 sec, but else 2 mins is enough
            orderAPISkipCount++;
            if (isArrayNonEmpty(pendingOrder) || orderAPISkipCount >= HEARTBEAT_SKIP_ORDER_API) {
                this.props.makeGetOrderListAction();
                orderAPISkipCount = 0;
            }
        }
        let storeAPIOptimisationEnabled = isStoreAPIOptimisationEnabled(store_api_optimisation);
        storeAPISkipCount++;
        if (
            storeAPISkipCount % (storeAPIOptimisationEnabled ? HEARTBEAT_SKIP_STORE_API_10 : HEARTBEAT_SKIP_STORE_API_2) === 0 ||
            (storeAPIOptimisationEnabled &&
                isStoreStatusClosed(store_status, ORDER_TYPE.DELIVERY) !==
                    checkIsStoreClosed(opening_hours, timeZone, ORDER_TYPE.DELIVERY, store_endpoint_hit_durations?.interval)) ||
            isStoreStatusClosed(store_status, ORDER_TYPE.COLLECTION) !==
                checkIsStoreClosed(opening_hours, timeZone, ORDER_TYPE.COLLECTION, store_endpoint_hit_durations?.interval)
        ) {
            storeAPISkipCount = 0;
            this.props.getStoreConfigAction();
        }
    };

    handleAppStateChange = (nextAppState) => {
        if (isCustomerApp() && currentAppState.match(/inactive|background/) && nextAppState.match(AppConstants.APP_STATUS.ACTIVE)) {
            this.props.getStoreConfigAction();
        }
        currentAppState = nextAppState;
    };

    componentDidUpdate(prevProps, prevState) {
        const { storeConfigShowDelivery, storeStatusDelivery } = this.props;
        //to update default order type once store config response comes
        if (
            (isValidElement(storeConfigShowDelivery) && !isValidElement(prevProps?.storeConfigShowDelivery)) ||
            (isValidElement(storeStatusDelivery) && !isValidElement(prevProps?.storeStatusDelivery))
        ) {
            this.setDefaultOrderType();
        }
    }

    setDefaultOrderType() {
        const { storeConfigShowCollection, storeConfigShowDelivery } = this.props;
        //Update order type based on storeInfo
        if (isOrderTypeEnabled(storeConfigShowCollection) && !isOrderTypeEnabled(storeConfigShowDelivery)) {
            this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
            return;
        }
        //Update order type based on previous selection.Because of route reset from view cart button
        if (this.props.selectedOrderType === ORDER_TYPE.COLLECTION) {
            this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
        } else if (isValidElement(this.props.selectedPostcode) && isValidElement(this.props.selectedAddressId)) {
            this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, this.props.selectedPostcode, this.props.selectedAddressId);
        } else {
            this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY);
        }
    }

    render() {
        const {
            storeConfigSettingsBannerUrl,
            navigation,
            isUserLoggedIn,
            selectedOrderType,
            storeConfigTotalReviews,
            storeConfigName,
            storeConfigOnlineClosedMessage
        } = this.props;
        let { notificationCount } = this.state;
        return (
            <BaseComponent
                showSearch={false}
                showHeader={true}
                showZendeskChat
                showNotificationOption={true}
                title={isValidString(storeConfigName) ? storeConfigName : LOCALIZATION_STRINGS.HOME}
                navigation={navigation}
                notificationCount={notificationCount}
                customView={
                    <View style={styles.contentStyle}>
                        <T2SText style={styles.titleStyle} id={VIEW_ID.TITLE} screenName={SCREEN_NAME.HOME_SCREEN}>
                            {isValidString(storeConfigName) ? storeConfigName : LOCALIZATION_STRINGS.HOME}
                        </T2SText>
                    </View>
                }
                customViewStyle={styles.customViewStyle}
                actions={
                    <OrderTypeAction
                        key={VIEW_ID.COLLECTION_DELIVERY_ICON}
                        orderType={selectedOrderType}
                        onPress={this.handleOrderTypePress}
                        screenName={SCREEN_NAME.HOME_SCREEN}
                    />
                }>
                <ScrollView style={styles.primaryContainer} showsVerticalScrollIndicator={false}>
                    {this.checkTakeawayCloseTime(storeConfigOnlineClosedMessage)}
                    {this.renderCurrentOffersComponent(storeConfigSettingsBannerUrl)}
                    {/*{isUserLoggedIn && this.renderRatingComponent()}*/}
                    {isUserLoggedIn && this.renderOrderStatus()}
                    {isUserLoggedIn && this.renderPreviousOrderComponent()}
                    {this.renderOurRecommendation()}
                    {getTotalReviewsCount(storeConfigTotalReviews) > 0 && this.renderReviewScreen()}
                </ScrollView>
                <HomeScreenBottomButtons title={LOCALIZATION_STRINGS.VIEW_MENU} navigation={navigation} />
                <AndroidBackExit navigation={navigation} />
                <ItemNotAvailableModal />
            </BaseComponent>
        );
    }

    handleOrderTypePress() {
        isGPSLocationEnabled().then((status) => {
            const {
                storeConfigShowCollection,
                storeConfigShowDelivery,
                storeStatusCollection,
                storeStatusDelivery,
                storeConfigPreOrder,
                countryBaseFeatureGateResponse
            } = this.props;
            if (isValidElement(status)) {
                // if (!isValidElement(storeConfigId)) {
                //     showErrorMessage(LOCALIZATION_STRINGS.PLEASE_HOLD_ON_WHILE_WE_INITIALIZE);
                // } else
                if (
                    skipStoreOpenStatus(countryBaseFeatureGateResponse) ||
                    isTakeawayOpen(storeConfigShowDelivery, storeStatusDelivery, storeConfigShowCollection, storeStatusCollection) ||
                    isPreOrderEnabled(storeConfigPreOrder)
                ) {
                    Analytics.logAction(ANALYTICS_SCREENS.HOME, ANALYTICS_SCREENS.ORDER_TYPE);
                    this.props.showHideOrderTypeAction(true);
                } else {
                    showErrorMessage(LOCALIZATION_STRINGS.TAKEAWAY_CLOSED_MESSAGE);
                }
                if (status) {
                    this.handleLocation();
                }
            }
        });
    }

    handleLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;
                this.props.getAddressFromLatLong(latitude, longitude, undefined, false, true);
            },
            () => {
                this.props.resetCurrentLocationAction();
            }
        );
    }

    /**
     * We should not display this rating widget.
     * When the current orders are available.
     * When the previous order already reviewed.
     * When user clicks the close icon for specific order till restart the app
     * @returns {*}
     */
    renderRatingComponent() {
        const { pendingOrder, previousOrder } = this.props;
        let order_id = getReviewOrderID(pendingOrder, previousOrder);
        if (this.state.showRating && order_id !== 0 && !_.includes(this.props.previousOrderId, order_id)) {
            return (
                <View style={styles.orderStatusParentContainer}>
                    <T2SStarRating
                        startingValue={0}
                        ratingCount={5}
                        onFinishRating={(value) => {
                            Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.RATING_SWIPED);
                            handleNavigation(SCREEN_OPTIONS.POST_REVIEW.route_name, {
                                order_id: order_id,
                                rating: value
                            });
                        }}
                        onCloseRating={() => {
                            this.props.hideRatingAction(order_id);
                            this.setState({
                                previousOrderId: order_id,
                                showRating: false
                            });
                        }}
                    />
                </View>
            );
        }
    }

    renderTakeawayCloseInfo(infoMessage) {
        return (
            <View style={styles.takeawayCloseInfoMessageViewStyle}>
                <T2SIcon name={FONT_ICON.SHEILD} size={40} style={styles.sheildIconStyle} screenName={SCREEN_NAME.HOME_SCREEN} />
                <T2SText
                    style={styles.takeawayCloseInfoMessageTextStyle}
                    id={VIEW_ID.TAKEAWAY_CLOSE_INFO_MESSAGE}
                    screenName={SCREEN_NAME.HOME_SCREEN}>
                    {infoMessage}
                </T2SText>
            </View>
        );
    }

    checkTakeawayCloseTime(storeConfigOnlineClosedMessage) {
        if (isValidElement(storeConfigOnlineClosedMessage)) {
            const infoMessage = storeConfigOnlineClosedMessage;
            const preOrderMessage = this.props.isPreOrderEnabled ? LOCALIZATION_STRINGS.PREORDER_AVAILABLE : '';
            return this.renderTakeawayCloseInfo(infoMessage + preOrderMessage);
        } else return null;
    }

    renderOrderStatus() {
        const { pendingOrder, currency } = this.props;
        const currentOrderData = isValidElement(pendingOrder) && pendingOrder.length > 0 ? pendingOrder[0] : null;
        if (isValidElement(currentOrderData) && currentOrderData.status < ORDER_STATUS.DELIVERED) {
            return (
                <CurrentOrderStatus
                    screenName={SCREEN_NAME.HOME_SCREEN}
                    title={LOCALIZATION_STRINGS.APP_ORDER_STATUS}
                    orderType={currentOrderData.sending}
                    status={currentOrderData.status}
                    currency={`${currency}${currentOrderData.total}`}
                    orderData={currentOrderData}
                    timeZone={isValidElement(this.props.timeZone) && this.props.timeZone}
                    onPress={() => {
                        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.CURRENT_ORDER_ITEM_CLICKED);
                        this.setOrderData(currentOrderData);
                        handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
                            orderId: currentOrderData.id,
                            analyticsObj: { order_id: currentOrderData.id }
                        });
                    }}
                />
            );
        }
    }

    setOrderData(data) {
        this.props.updateOrderDetailsData(data);
    }

    renderReviewHeader() {
        return (
            <View style={styles.reviewRowContainer}>
                <T2SText style={styles.headerTextStyle} screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.HEADER_REVIEW}>
                    {LOCALIZATION_STRINGS.CUSTOMER_REVIEWS}
                </T2SText>
                <T2STouchableOpacity
                    screenName={SCREEN_NAME.HOME_SCREEN}
                    id={VIEW_ID.REVIEW_VIEW_ALL}
                    activeOpacity={0.9}
                    onPress={() => {
                        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.HOME_REVIEW_VIEW_ALL);
                        handleNavigation(SCREEN_OPTIONS.VIEW_ALL_REVIEWS.route_name);
                    }}>
                    <T2SText style={styles.viewAllTextStyle} screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.REVIEW_VIEW_ALL_TEXT}>
                        {LOCALIZATION_STRINGS.VIEW_ALL}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderReviewScreen() {
        return (
            <View style={styles.reviewContainerStyle}>
                {this.renderReviewHeader()}
                <ViewAllReviewsScreen isFromHome={true} />
            </View>
        );
    }

    renderCurrentOffersComponent(storeConfigSettingsBannerUrl) {
        const bannerURL = storeConfigSettingsBannerUrl;
        let { currentOffersResponse } = this.props;
        if (isValidElement(currentOffersResponse) && currentOffersResponse.length > 1) {
            if (isValidString(bannerURL)) {
                currentOffersResponse = [...currentOffersResponse, { image: bannerURL }];
            }
            return (
                <View style={styles.previousOrderContainerStyle}>
                    <CurrentOffersComponent
                        response={currentOffersResponse}
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        itemClicked={(item) => {
                            handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
                                category: item.category
                            });
                        }}
                    />
                </View>
            );
        } else if (
            isValidElement(currentOffersResponse) &&
            currentOffersResponse.length === 1 &&
            isValidURL(currentOffersResponse[0].image)
        ) {
            return (
                <T2STouchableOpacity
                    style={styles.singleBannerContainer}
                    onPress={() => {
                        handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
                            category: currentOffersResponse[0].category
                        });
                    }}>
                    <T2SFastImage
                        style={styles.singleBannerImageStyle}
                        source={{ uri: currentOffersResponse[0].image }}
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        id={VIEW_ID.OFFER_IMAGE_VIEW}
                    />
                </T2STouchableOpacity>
            );
        } else if (isValidElement(currentOffersResponse)) {
            return (
                <View style={styles.defaultContainerStyle}>
                    <GenericImageComponent screenName={SCREEN_NAME.HOME_SCREEN} imageURL={isValidElement(bannerURL) ? bannerURL : null} />
                </View>
            );
        } else if (!isValidElement(currentOffersResponse)) {
            return (
                <View style={styles.previousOrderContainerStyle}>
                    <CurrentOffersLoader />
                </View>
            );
        }
    }

    renderPreviousOrderHeader(prevOrderResponse) {
        const previousOrderDate = getDateStr(prevOrderResponse.order_placed_on, DATE_FORMAT.DD_MMM_YYYY);
        const disableReorder = skipStoreOpenStatus(this.props.countryBaseFeatureGateResponse)
            ? false
            : !this.props.isPreOrderEnabled && !this.props.isTakeawayOpened;
        return (
            <View style={styles.previousOrderHeaderStyle}>
                <T2SText style={styles.previousOrderHeaderTextStyle} screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.PREVIOUS_ORDER_TITLE}>
                    {LOCALIZATION_STRINGS.PREVIOUS_ORDER}
                </T2SText>
                <View style={styles.previousOrderReOrderContainerStyle}>
                    <T2SText
                        style={styles.previousOrderHeaderDateStyle}
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        id={VIEW_ID.PREVIOUS_ORDER_DATE}>
                        {isValidElement(previousOrderDate) ? previousOrderDate : LOCALIZATION_STRINGS.NOT_APPLICABLE}
                    </T2SText>
                    <T2STouchableOpacity
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        id={VIEW_ID.RE_ORDER}
                        disabled={disableReorder}
                        onPress={() => {
                            const { previousOrderResponse } = this.props;
                            if (isValidElement(previousOrderResponse) && previousOrderResponse.length > 0) {
                                const selectedOrder = previousOrderResponse[0];
                                const orderType = extractOrderType(selectedOrder.sending);
                                const storeId = getTakeawayId(selectedOrder.store);
                                this.setState(
                                    {
                                        reOrderType: orderType, //Order type of Completed Order which we reOrdering.
                                        reOrderID: selectedOrder.id,
                                        reOrderStoreId: storeId
                                    },
                                    () => {
                                        this.handleReorderClick(selectedOrder.id, storeId, orderType);
                                    }
                                );
                            }
                        }}
                        style={[styles.buttonStyle, { opacity: disableReorder ? 0.6 : 1.0 }]}>
                        <T2SText
                            screenName={SCREEN_NAME.HOME_SCREEN}
                            id={VIEW_ID.RE_ORDER}
                            style={[styles.buttonTextStyle, { opacity: disableReorder ? 0.6 : 1.0 }]}>
                            {LOCALIZATION_STRINGS.RE_ORDER}
                        </T2SText>
                    </T2STouchableOpacity>
                </View>
            </View>
        );
    }

    renderPreviousOrderComponent() {
        const { previousOrderResponse, currency, showPreviousOrderLoader } = this.props;
        if (isArrayNonEmpty(previousOrderResponse)) {
            // seperating the below condition to avoid keeps loading as it falls in else condition.
            // (previousOrderResponse.data.length > 0) as true and (data[0].summary.items.length > 0) returns false

            if (
                isValidElement(previousOrderResponse[0].summary) &&
                isValidElement(previousOrderResponse[0].summary.items) &&
                previousOrderResponse[0].summary.items.length > 0
            ) {
                return (
                    <View>
                        {this.renderPreviousOrderHeader(previousOrderResponse[0])}
                        <View style={styles.previousOrderContainerStyle}>
                            <PreviousOrderComponent
                                currency={currency}
                                previousOrderResponse={previousOrderResponse[0].summary.items}
                                screenName={SCREEN_NAME.HOME_SCREEN}
                            />
                        </View>
                    </View>
                );
            } else return null;
        } else if (isValidElement(previousOrderResponse) && previousOrderResponse.length === 0) {
            return null;
        } else if (showPreviousOrderLoader) {
            return (
                <View style={styles.previousOrderContainerStyle}>
                    <PreviousOrderLoader />
                </View>
            );
        }
    }

    renderOurRecommendation() {
        const { ourRecommendation, currency, ourRecommendationsLoading } = this.props;
        if (isValidElement(ourRecommendation)) {
            if (ourRecommendation.length > 0) {
                return (
                    <View>
                        <View style={styles.reviewRowContainer}>
                            <T2SText
                                style={styles.ourRecommendationHeaderStyle}
                                screenName={SCREEN_NAME.HOME_SCREEN}
                                id={VIEW_ID.HOME_OUR_RECOMMENDATION_TITLE}>
                                {LOCALIZATION_STRINGS.OUR_RECOMMENDATIONS}
                            </T2SText>
                            {/* <T2SText
                                style={styles.viewAllTextStyle}
                                screenName={SCREEN_NAME.HOME_SCREEN}
                                id={VIEW_ID.OUR_RECOMMENDATION_VIEW_ALL}
                                onPress={() => handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name)}>
                                {LOCALIZATION_MODULE_STRINGS.VIEW_ALL}
                            </T2SText>*/}
                        </View>
                        <View style={styles.ourRecommendationContainerStyle}>
                            <OurRecommendations currency={currency} response={ourRecommendation} screenName={SCREEN_NAME.HOME_SCREEN} />
                        </View>
                    </View>
                );
            } else {
                return null;
            }
        } else {
            return (
                ourRecommendationsLoading && (
                    <View style={styles.ourRecommendationContainerStyle}>
                        <OurRecommendationLoader />
                    </View>
                )
            );
        }
    }

    handleReorderClick = debounce(
        (orderId, storeID, orderType) => {
            this.props.resetReOrderResponseAction();
            this.switchOrderTypeForReOrder(orderType);
            this.props.reOrderAction(orderId, storeID, orderType, this.props.navigation);
            Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.HOME_PREVIOUS_ORDER_ADD_REORDER);
            this.props.reOrderBasketNavigation(orderId, storeID, this.props.navigation, orderType, RE_ORDER_TRIGGER_SCREEN.HOME_SCREEN);
            this.props.setOrderIDAction(orderId);
        },
        300,
        { leading: true, trailing: false }
    );
    switchOrderTypeForReOrder = (sending) => {
        if (isValidElement(sending) && sending !== this.props.selectedOrderType) {
            if (sending === ORDER_TYPE.DELIVERY) {
                const { deliveryAddress, primaryAddress } = this.props;
                let address = getValidAddress(deliveryAddress, primaryAddress);
                if (isValidElement(address)) {
                    this.props.updateSelectedOrderType(ORDER_TYPE.DELIVERY, address.postcode, address.id);
                    this.props.selectDeliveryAddressAction(address);
                }
            } else {
                this.props.updateSelectedOrderType(ORDER_TYPE.COLLECTION);
            }
        }
    };
}

const mapStateToProps = (state) => ({
    pendingOrder: state.orderManagementState.pendingOrder,
    previousOrder: state.orderManagementState.previousOrder,
    ourRecommendation: selectFilteredRecommendation(state),
    previousOrderResponse: state.homeState.previousOrdersResponse,
    showPreviousOrderLoader: state.homeState.previousOrdersLoader,
    currency: selectCurrencySymbol(state),
    isUserLoggedIn: selectHasUserLoggedIn(state),
    images: state.takeawayDetailsState.images,
    timeZone: selectTimeZone(state),
    previousOrderId: state.homeState.previousOrderId,
    selectedOrderType: selectOrderType(state),
    selectedPostcode: state.addressState.selectedPostcode,
    currentOffersResponse: state.homeState.currentOffersResponse,
    isTakeawayOpened: isTakeAwayOpenSelector(state),
    isPreOrderEnabled: isPreOrderAvailableSelector(state),
    orderId: selectOrderID(state),
    isCollectionAvailable: isCollectionAvailableSelector(state),
    isDeliveryAvailable: isDeliveryAvailableSelector(state),
    deliveryAddress: state.addressState.deliveryAddress,
    language: state.appState.language,
    selectedAddressId: state.addressState.selectedAddressId,
    primaryAddress: selectPrimaryAddressSelector(state),
    ourRecommendationsLoading: state.homeState.ourRecommendationsLoading,
    storeConfigShowCollection: state.appState.storeConfigResponse?.show_collection,
    storeStatusCollection: selectCollectionStatus(state),
    storeConfigShowDelivery: state.appState.storeConfigResponse?.show_delivery,
    storeStatusDelivery: selectDeliveryStatus(state),
    storeConfigPreOrderDelivery: selectPreorderDeliveryStatus(state),
    storeConfigPreOrderCollection: selectPreorderCollectionStatus(state),
    storeConfigTotalReviews: state.appState.storeConfigResponse?.total_reviews,
    storeConfigPreOrder: state.appState.storeConfigResponse?.preorder,
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigOnlineClosedMessage: getTACloseMessage(
        state.appState.storeConfigResponse,
        selectOrderType(state),
        isPreOrderAvailableSelector(state),
        selectTimeZone(state)
    ),
    storeConfigSettingsBannerUrl: state.appState.storeConfigResponse?.setting?.banner_url,
    storeConfigOurRecommendations: state.appState.storeConfigResponse?.our_recommendations,
    storeConfigId: state.appState.storeConfigResponse?.id,
    storeConfigNextOpen: state.appState.storeConfigResponse?.next_open,
    countryBaseFeatureGateResponse: state.appState.countryBaseFeatureGateResponse,
    opening_hours: state.appState.storeConfigResponse?.opening_hours?.advanced,
    store_status: state.appState.storeConfigResponse?.store_status,
    store_endpoint_hit_durations: state.appState?.countryBaseFeatureGateResponse?.store_endpoint_hit_durations,
    store_api_optimisation: state.appState?.countryBaseFeatureGateResponse?.store_api_optimisation
});

const mapDispatchToProps = {
    makeGetOrderListAction,
    getTakeawayImageListAction,
    updateOrderDetailsData,
    dashboardSync,
    hideRatingAction,
    showHideOrderTypeAction,
    setOrderIDAction,
    getAddressFromLatLong,
    disableReorderButtonAction,
    resetReOrderResponseAction,
    updateSelectedOrderType,
    selectDeliveryAddressAction,
    resetReOrderFlags,
    reOrderBasketNavigation,
    updateStoreIdIntoBasket,
    resetCurrentLocationAction,
    reOrderAction,
    getStoreConfigAction
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
