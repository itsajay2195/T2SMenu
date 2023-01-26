import React, { Component } from 'react';
import { View } from 'react-native';
import {
    currencyValue,
    distanceValue,
    isArrayNonEmpty,
    isFranchiseApp,
    isValidElement,
    isValidString,
    kFormatter
} from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { styles } from '../Style/TakeawayListWidgetStyle';
import { FILTER_TAKEAWAY_CONSTANTS, VIEW_ID } from '../Utils/Constants';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import {
    canPreorder,
    cuisinesList,
    isNewTakeaway,
    isTakeawayBlocked,
    isTakeawayOpen,
    preorderTakeawayOpenTime,
    takeawayBlockedMessage,
    isDeliveryAvailable,
    isCollectionAvailable,
    isDeliveryPreorderAvailable,
    isCollectionPreorderAvailable,
    getTakeawayLogoUrl,
    getDeliveryWaitingTime,
    getDistanceType,
    getStoreStatusDelivery,
    getStoreStatusCollection,
    getPreorderStatus,
    getNearestBusinessHours,
    getCollectionWaitingTime,
    isNashTakeaway,
    isDeliveryChargeAvailable,
    isFreeDelivery
} from '../Utils/Helper';
import { getCurrency, isOrderTypeToggleEnabled } from 'appmodules/BaseModule/GlobalAppHelper';
import { showInformationAlert } from 'appmodules/BaseModule/Helper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import MinimumOrder from './Components/MinimumOrder';
import TakeawayImageComponent from './MicroComponents/TakeawayImageComponent';
import { getTotalReviewsCount } from 'appmodules/ReviewModule/Utils/ReviewHelper';
import TakeawayDetailsComponent from './MicroComponents/TakeawayDetailsComponent';
import ReviewAndMilesComponent, { RatingComponent } from './MicroComponents/ReviewAndMilesComponent';
import { selectCurrencyFromS3Config } from 't2sbasemodule/Utils/AppSelectors';
import { connect } from 'react-redux';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { MINIMUM_REVIEW_COUNT } from 'appmodules/MenuModule/Utils/MenuConstants';
import { selectCountryBaseFeatureGateResponse } from 'appmodules/BasketModule/Redux/BasketSelectors';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

class TakeawayList extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (
            this.props.item !== nextProps.item ||
            this.props.filterByType !== nextProps.filterByType ||
            this.props.selectedStoreID !== nextProps.selectedStoreID ||
            this.props.favouriteTakeaways !== nextProps.favouriteTakeaways ||
            (isValidElement(this.props.cartItems) &&
                isValidElement(nextProps.cartItems) &&
                isValidElement(this.props.cartItems.length) &&
                isValidElement(nextProps.cartItems.length) &&
                this.props.cartItems.length !== nextProps.cartItems.length)
        );
    }

    getTimeZone(item) {
        if (isValidElement(item?.time_zone)) {
            return item.time_zone;
        } else {
            return this.props.timeZone;
        }
    }

    onTakeawayClick(item, selectedStoreID, cartItems) {
        if (isValidElement(item.id)) {
            if (isTakeawayBlocked(item.id, this.props.associateTakeawayResponse)) {
                this.props.navigation.dispatch(
                    showInformationAlert('', takeawayBlockedMessage(item.id, this.props.associateTakeawayResponse, this.props.languageKey))
                );
            } else {
                this.props.handlePersistLogic(item, this.props.filterByType);
            }
        }
    }

    renderBottomView(item) {
        const { filterByType, viewType, countryId, featureGateResponse } = this.props;
        const { show_delivery, show_collection, business_hours, preorder_hours, time_zone, next_open } = isValidElement(item) && item;

        let orderTypeEnabled = isOrderTypeToggleEnabled(countryId, featureGateResponse);
        let storeStatusDelivery = getStoreStatusDelivery(item);
        let storeStatusCollection = getStoreStatusCollection(item);
        let preOrderStatusDelivery = getPreorderStatus(item, ORDER_TYPE.DELIVERY, storeStatusDelivery);
        let preOrderStatusCollection = getPreorderStatus(item, ORDER_TYPE.COLLECTION, storeStatusCollection);

        const getNextOpen = getNearestBusinessHours(
            business_hours,
            orderTypeEnabled ? filterByType : null,
            preorder_hours,
            time_zone,
            next_open
        );

        //todo: change once favorites list api changes
        let nextOpen = isValidElement(getNextOpen) ? getNextOpen : '';

        if (viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST && orderTypeEnabled) {
            if (filterByType === ORDER_TYPE.DELIVERY && isDeliveryAvailable(show_delivery, storeStatusDelivery)) {
                return this.renderDeliveryView(item);
            } else if (filterByType === ORDER_TYPE.COLLECTION && isCollectionAvailable(show_collection, storeStatusCollection)) {
                return this.renderCollectionView(item);
            } else if (filterByType === ORDER_TYPE.BOTH) {
                return this.renderBothCollectionAndDeliveryView(item);
            } else if (
                (filterByType === ORDER_TYPE.DELIVERY && isDeliveryPreorderAvailable(show_delivery, preOrderStatusDelivery)) ||
                (filterByType === ORDER_TYPE.COLLECTION && isCollectionPreorderAvailable(show_collection, preOrderStatusCollection))
            ) {
                return this.renderPreorderView(item, nextOpen);
            } else {
                return this.renderTakeawayClosedView(item, nextOpen);
            }
        } else {
            //for favorites screen
            if (isTakeawayOpen(show_delivery, storeStatusDelivery, show_collection, storeStatusCollection)) {
                return this.renderBothCollectionAndDeliveryView(item);
            } else if (canPreorder(show_delivery, preOrderStatusDelivery, show_collection, preOrderStatusCollection)) {
                return this.renderPreorderView(item, nextOpen);
            } else {
                return this.renderTakeawayClosedView(item, nextOpen);
            }
        }
    }

    renderTakeawayClosedView(item, nextOpen) {
        let time_zone = this.getTimeZone(item);
        let onlineclosedMessage = '';
        let openTime = '';
        if (!isValidString(item?.online_closed_message)) {
            onlineclosedMessage = preorderTakeawayOpenTime(nextOpen, time_zone, VIEW_ID.CLOSED_MESSAGE, false);
            openTime = preorderTakeawayOpenTime(nextOpen, time_zone, VIEW_ID.OPENING_TIME_TEXT, false);
        }
        return (
            <View style={styles.deliveryDetailsViewStyle}>
                <T2SText screenName={this.props.screenName} id={item.name + '_' + VIEW_ID.CLOSED_MESSAGE} style={styles.closedMessageStyle}>
                    {isValidString(item?.online_closed_message)
                        ? convertMessageToAppLanguage(item.online_closed_message, this.props.languageKey)
                        : isValidString(nextOpen)
                        ? convertMessageToAppLanguage(`${onlineclosedMessage}${openTime}`, this.props.languageKey)
                        : LOCALIZATION_STRINGS.SORRY_WE_ARE_CURRENTLY_CLOSED}
                </T2SText>
            </View>
        );
    }

    renderPreorderView(item, nextOpen) {
        let time_zone = this.getTimeZone(item);
        return (
            <View style={styles.deliveryDetailsViewStyle}>
                <T2SText screenName={this.props.screenName} id={item.name + '_' + VIEW_ID.CLOSED_MESSAGE} style={styles.closedMessageStyle}>
                    {isValidString(nextOpen)
                        ? preorderTakeawayOpenTime(nextOpen, time_zone, VIEW_ID.CLOSED_MESSAGE)
                        : LOCALIZATION_STRINGS.SORRY_WE_ARE_CURRENTLY_CLOSED}
                </T2SText>
                <T2SText
                    screenName={this.props.screenName}
                    id={item.name + '_' + VIEW_ID.OPENING_TIME_TEXT}
                    style={styles.openingTimeTextStyle}>
                    {isValidString(nextOpen) && preorderTakeawayOpenTime(nextOpen, time_zone, VIEW_ID.OPENING_TIME_TEXT)}
                </T2SText>
            </View>
        );
    }

    renderDeliveryView(item) {
        const { screenName, currency } = this.props;
        const currencySymbole = getCurrency(currency);
        const { show_delivery, name } = isValidElement(item) && item;
        let storeStatusDelivery = getStoreStatusDelivery(item);
        let deliveryCharge = isValidElement(item?.delivery) ? item.delivery : item?.charge;

        let isNashTA = isValidElement(item?.assign_driver_through) && isNashTakeaway(item?.assign_driver_through);
        //todo: if skipcart related changes needed, minimum order value may differ
        return isDeliveryAvailable(show_delivery, storeStatusDelivery) && !isNashTA && isValidElement(item.delivery) ? (
            <View style={styles.deliveryTAViewStyle}>
                {isDeliveryChargeAvailable(item.delivery) ? (
                    <T2SText screenName={screenName} id={item.name + '_' + VIEW_ID.DELIVERY_CHARGES_TEXT} style={styles.deliveryCharge}>
                        {LOCALIZATION_STRINGS.DELIVERY + ': '}
                        {currencyValue(deliveryCharge.charge, currencySymbole, 2)}
                        {this.renderMinOrder(deliveryCharge.minimum_order, name, currencySymbole, false)}
                    </T2SText>
                ) : isFreeDelivery(item.delivery) ? (
                    <T2SText screenName={screenName} id={item.name + '_' + VIEW_ID.DELIVERY_CHARGES_TEXT} style={styles.deliveryCharge}>
                        {LOCALIZATION_STRINGS.FREE_DELIVERY}
                        {this.renderMinOrder(deliveryCharge?.minimum_order, name, currencySymbole, true)}
                    </T2SText>
                ) : null}
            </View>
        ) : null;
    }

    renderCollectionView(item) {
        const { screenName } = this.props;
        return (
            <View style={styles.deliveryDetailsViewStyle}>
                <T2SText screenName={screenName} id={item.name + '_' + VIEW_ID.COLLECTION_MINS_TEXT} style={styles.deliveryCharge}>
                    {LOCALIZATION_STRINGS.READY_IN + item.collection_time + ' ' + LOCALIZATION_STRINGS.MINS}
                </T2SText>
            </View>
        );
    }

    renderBothCollectionAndDeliveryView(item) {
        const { countryId, featureGateResponse } = this.props;
        const { rating } = item;
        return isOrderTypeToggleEnabled(countryId, featureGateResponse) ? (
            <View style={styles.collectionDeliveryView}>
                {this.renderDeliveryView(item)}
                <View style={styles.dividerStyle} />
                {this.renderCollectionView(item)}
            </View>
        ) : (
            <View style={styles.collectionTADeliveryView}>
                {isValidElement(rating) && rating > 0 && this.renderReview(item)}
                {this.renderDeliveryView(item)}
            </View>
        );
    }

    renderReview(item) {
        const totalReviewCount = getTotalReviewsCount(item?.total_reviews);
        const { screenName, isTakeawayClosed } = this.props;
        const { rating } = item;
        const renderReviewCount = () => {
            return (
                <T2SText
                    screenName={screenName}
                    id={item.name + '_' + VIEW_ID.REVIEW_TEXT}
                    style={[
                        styles.ratingTAStyleText,
                        { color: Colors.rating_grey },
                        { backgroundColor: isTakeawayClosed ? Colors.whiteSmoke : Colors.white }
                    ]}>
                    {`(${kFormatter(totalReviewCount)} ${LOCALIZATION_STRINGS.REVIEWS})`}
                </T2SText>
            );
        };

        return (
            <T2SView screenName={screenName} id={VIEW_ID.RATINGS_STAR_VIEW} style={styles.reviewContainerViewStyle}>
                <View style={styles.reviewViewStyle}>
                    {isValidElement(rating) && rating > MINIMUM_REVIEW_COUNT && (
                        <RatingComponent rating={rating} itemName={'hi'} screenName={screenName} />
                    )}
                    {totalReviewCount > MINIMUM_REVIEW_COUNT && renderReviewCount()}
                </View>
            </T2SView>
        );
    }

    render() {
        const { item, screenName, selectedStoreID, cartItems, isTakeawayClosed } = this.props;
        return (
            <T2STouchableOpacity
                screenName={screenName}
                id={VIEW_ID.TAKEAWAY_DETAILED_PRESS}
                style={[
                    styles.takeawayListHeader,
                    isValidElement(isTakeawayClosed) && isTakeawayClosed && styles.currentlyClosedBackground
                ]}
                accessible={false}
                activeOpacity={0.9}
                onPress={this.onTakeawayClick.bind(this, item, selectedStoreID, cartItems)}>
                <View
                    {...setTestId(screenName, VIEW_ID.TAKEAWAY_DETAILED_PRESS)}
                    style={[
                        styles.takeawayListContainerStyle,
                        isValidElement(isTakeawayClosed) && isTakeawayClosed && styles.currentlyClosedBackground
                    ]}>
                    {this.renderTakeawayImage(item)}
                    <View style={styles.takeawayDetailsContainerStyle}>
                        {this.renderTakeawayDetailsComponent(item)}
                        {this.renderReviewAndRadioMilesView(item)}
                        {this.renderBottomView(item)}
                    </View>
                </View>
            </T2STouchableOpacity>
        );
    }

    renderTakeawayImage(item) {
        let sourceUrl = getTakeawayLogoUrl(item, this.props.viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST || isFranchiseApp());
        return (
            <TakeawayImageComponent
                screenName={this.props.screenName}
                itemName={item.name}
                isNewTakeaway={isNewTakeaway(item)}
                logoUrl={sourceUrl}
            />
        );
    }

    renderTakeawayDetailsComponent(item) {
        return (
            <TakeawayDetailsComponent
                screenName={this.props.screenName}
                itemName={item.name}
                discount={item.discount}
                cuisines={cuisinesList(item.cuisines)}
                cuisineNotEmpty={isArrayNonEmpty(item.cuisines)}
            />
        );
    }

    renderReviewAndRadioMilesView(item) {
        const { countryId, featureGateResponse } = this.props;
        let milesText = `${
            isValidElement(item.distanceInMiles) ? distanceValue(item.distanceInMiles) + getDistanceType(this.props.distanceType) : ''
        }`;
        let ratingValue = isValidElement(item) && item?.rating;
        const { show_delivery, show_collection } = item;

        return (
            <ReviewAndMilesComponent
                screenName={this.props.screenName}
                itemName={item.name}
                rating={ratingValue}
                selectedOrderType={this.props.filterByType}
                viewType={this.props.viewType}
                milesText={milesText}
                distanceInMiles={item.distanceInMiles}
                totalReviewCount={getTotalReviewsCount(item?.total_reviews)}
                deliveryWaitingTime={getDeliveryWaitingTime(item)}
                collectionWaitingTime={getCollectionWaitingTime(item)}
                isTakeawayClosed={this.props.isTakeawayClosed}
                isOrderTypeEnabled={isOrderTypeToggleEnabled(countryId, featureGateResponse)}
                show_delivery={show_delivery}
                show_collection={show_collection}
            />
        );
    }

    renderMinOrder = (minOrder, itemName, currency, freeDelivery) => {
        return (
            <MinimumOrder
                name={itemName}
                minOrder={minOrder}
                currency={currency}
                freeDelivery={freeDelivery}
                screenName={this.props.screenName}
            />
        );
    };
}
const mapStateToProps = (state) => ({
    currency: selectCurrencyFromS3Config(state),
    featureGateResponse: selectCountryBaseFeatureGateResponse(state)
});

export default connect(mapStateToProps, null)(TakeawayList);
