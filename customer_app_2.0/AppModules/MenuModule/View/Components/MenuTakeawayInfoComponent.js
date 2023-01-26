import React, { Component } from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import Styles from '../Styles/MenuStyle';
import { Animated, Platform, View } from 'react-native';
import { T2SText } from 't2sbasemodule/UI';
import { MINIMUM_REVIEW_COUNT, VIEW_ID, SCREEN_NAME } from '../../Utils/MenuConstants';
import {
    boolValue,
    currencyValue,
    distanceValue,
    getTakeawayName,
    isMoreZero,
    isValidElement,
    isValidString
} from 't2sbasemodule/Utils/helpers';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import styles from '../Styles/MenuList';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import {
    getDistanceType,
    isDeliveryChargeAvailable,
    isFreeDelivery,
    isFullCollectionClosed,
    isFullDeliveryClosed,
    isNashTakeaway
} from '../../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import { getTotalReviewsCount } from '../../../ReviewModule/Utils/ReviewHelper';
import { isThirdPartyDriverAvailable } from '../../../BasketModule/Utils/BasketHelper';
import MinimumOrder from '../../../../FoodHubApp/TakeawayListModule/View/Components/MinimumOrder';

const screenName = SCREEN_NAME.MENU_SEARCH_SCREEN;

class MenuTakeawayInfoComponent extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (
            this.props.storeFromListResponse !== nextProps.storeFromListResponse ||
            this.props.screenName !== nextProps.screenName ||
            this.props.distanceType !== nextProps.distanceType ||
            this.props.isFavorite !== nextProps.isFavorite ||
            this.props.collection_wait !== nextProps.collection_wait ||
            this.props.delivery_wait !== nextProps.delivery_wait ||
            this.props.springValue !== nextProps.springValue ||
            this.props.storeConfigName !== nextProps.storeConfigName ||
            this.props.storeConfigTotalReviews !== nextProps.storeConfigTotalReviews ||
            this.props.storeConfigId !== nextProps.storeConfigId ||
            this.props.assignDriverThrough !== nextProps.assignDriverThrough ||
            this.props.storeStatusCollection !== nextProps.storeStatusCollection ||
            this.props.storeConfigDistanceInMiles !== nextProps.storeConfigDistanceInMiles ||
            this.props.storeConfigShowCollection !== nextProps.storeConfigShowCollection ||
            this.props.storeConfigShowDelivery !== nextProps.storeConfigShowDelivery ||
            this.props.storeStatusDelivery !== nextProps.storeStatusDelivery ||
            this.props.storeConfigCharge !== nextProps.storeConfigCharge ||
            this.props.storeConfigPreOrderCollection !== nextProps.storeConfigPreOrderCollection ||
            this.props.storeConfigPreOrderDelivery !== nextProps.storeConfigPreOrderDelivery ||
            this.props.storeConfigDeliveryCharge !== nextProps.storeConfigDeliveryCharge ||
            this.props.deliveryChargeFromList !== nextProps.deliveryChargeFromList
        );
    }
    render() {
        return (
            <T2SView>
                {this.renderFirstRowContainer()}
                {this.renderSecondRowContainer()}
                {this.renderThirdRowContainer()}
            </T2SView>
        );
    }
    renderFirstRowContainer() {
        return (
            <T2SView style={Styles.detailsMenuCartContainer}>
                <View style={Styles.takeawayLabelContainer}>{this.renderTakeawayName()}</View>
                <View style={Styles.heartIconContainer}>{this.renderFavorite()}</View>
            </T2SView>
        );
    }

    renderTakeawayName() {
        const { storeConfigName } = this.props;
        return (
            isValidString(storeConfigName) && (
                <T2SText id={VIEW_ID.TAKEAWAY_NAME_TITLE_TEXT} screenName={screenName} style={Styles.detailsMenuCartTitleText}>
                    {storeConfigName}
                    {this.renderInfo()}{' '}
                </T2SText>
            )
        );
    }

    renderInfo() {
        const { handleViewInfoClick, springValue } = this.props;
        return (
            <T2STouchableOpacity accessible={false} onPress={handleViewInfoClick} style={Platform.OS === 'ios' ? Styles.infoButton : ''}>
                <Animated.View style={[springValue, Styles.flexDirectionRow]}>
                    <T2SIcon
                        id={VIEW_ID.INFO_CON}
                        screenName={screenName}
                        icon={FONT_ICON.INFO_ICON_UNFILLED}
                        color={Colors.lightBlue}
                        size={22}
                    />
                    <T2SText
                        id={VIEW_ID.VIEW_INFO_TEXT}
                        screenName={screenName}
                        style={[Styles.detailsMenuCartBottomText, Styles.infoText]}>
                        {LOCALIZATION_STRINGS.ABOUT}
                    </T2SText>
                </Animated.View>
            </T2STouchableOpacity>
        );
    }

    renderFavorite() {
        const { storeConfigId, isFavorite, springValue } = this.props;
        return (
            <View style={Styles.infoFavoriteView}>
                {isValidElement(storeConfigId) && (
                    <T2STouchableOpacity
                        accessible={false}
                        style={Styles.infoButton}
                        hitSlop={{ top: 25, bottom: 25 }}
                        onPress={this.handleFavoriteClick.bind(this)}>
                        <Animated.View accessible={false} style={springValue}>
                            <T2SIcon
                                id={isFavorite ? VIEW_ID.HEART_FILL_ICON : VIEW_ID.HEART_STOKE_ICON}
                                screenName={screenName}
                                icon={isFavorite ? FONT_ICON.HEART_FILL : FONT_ICON.HEART_STROKE}
                                color={isFavorite ? Colors.rating_color : Colors.primaryTextColor}
                                style={{ padding: 5 }}
                                size={24}
                                onPress={this.handleFavoriteClick.bind(this)}
                            />
                        </Animated.View>
                    </T2STouchableOpacity>
                )}
            </View>
        );
    }

    handleFavoriteClick() {
        const { storeConfigId, handleFavouriteTakeaway, storeConfigName } = this.props;
        if (isValidElement(storeConfigName) && isValidElement(storeConfigId)) {
            handleFavouriteTakeaway(storeConfigId, getTakeawayName(storeConfigName));
        }
    }

    renderSecondRowContainer() {
        const { storeFromListResponse } = this.props;
        const { distanceInMiles } = isValidElement(storeFromListResponse) && storeFromListResponse;
        let distance = distanceValue(distanceInMiles);
        let isDistanceAvailable = isMoreZero(distance);
        return (
            <T2SView style={[Styles.detailsSubLevelMenuCartContainer, !isDistanceAvailable && { justifyContent: 'space-around' }]}>
                {isDistanceAvailable && this.renderDistance(distance)}
                {isDistanceAvailable && <View style={Styles.verticalDivider} />}
                {this.renderCollection()}
                <View style={Styles.verticalDivider} />
                {this.renderDelivery()}
                {!isDistanceAvailable && <View style={Styles.verticalDivider} />}
                {!isDistanceAvailable && <View style={Styles.reviewLabelContainer}>{this.renderReview()}</View>}
            </T2SView>
        );
    }

    renderDistance(distance) {
        const { distanceType } = this.props;
        return (
            <View style={Styles.rowContainer}>
                <T2SIcon id={VIEW_ID.MAP_ICON} screenName={screenName} icon={FONT_ICON.MAP} color={Colors.black} size={22} />
                <T2SText id={VIEW_ID.MILES_VALUE_TEXT} screenName={screenName} style={Styles.detailsMenuCartText}>
                    {distance}
                    {getDistanceType(distanceType)}
                    {/*TODO uncomment once api gets implemented*/}
                    {/*<T2SText style={Styles.liveTrackingText} id={VIEW_ID.LIVE_TRACKING_TEXT} screenName={screenName}>*/}
                    {/*{LOCALIZATION_STRINGS.LIVE_TRACKING}*/}
                    {/*</T2SText>*/}
                </T2SText>
            </View>
        );
    }

    renderCollection() {
        const { collection_wait, storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection } = this.props;
        return (
            <View style={Styles.rowContainer}>
                <T2SIcon
                    id={VIEW_ID.COLLECTION_ICON}
                    screenName={screenName}
                    icon={FONT_ICON.COLLECTION}
                    color={
                        isFullCollectionClosed(storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection)
                            ? Colors.ashColor
                            : Colors.black
                    }
                    size={22}
                />
                <T2SText
                    id={VIEW_ID.COLLECTION_VALUE_TEXT}
                    screenName={screenName}
                    style={[
                        Styles.detailsMenuCartText,
                        isFullCollectionClosed(storeConfigShowCollection, storeStatusCollection, storeConfigPreOrderCollection)
                            ? { color: Colors.ashColor }
                            : { color: Colors.black }
                    ]}>
                    {collection_wait}
                </T2SText>
            </View>
        );
    }

    renderDelivery() {
        const { delivery_wait, storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery } = this.props;
        return (
            <View style={Styles.deliveryRowContainer}>
                <T2SIcon
                    id={VIEW_ID.DELIVERY_ICON}
                    screenName={screenName}
                    icon={FONT_ICON.DELIVERY}
                    color={
                        isFullDeliveryClosed(storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery)
                            ? Colors.ashColor
                            : Colors.black
                    }
                    size={22}
                    style={Styles.deliveryIconStyle}
                />
                <T2SText
                    id={VIEW_ID.COLLECTION_VALUE_TEXT}
                    screenName={screenName}
                    style={[
                        Styles.detailsMenuCartText,
                        isFullDeliveryClosed(storeConfigShowDelivery, storeStatusDelivery, storeConfigPreOrderDelivery)
                            ? { color: Colors.ashColor }
                            : { color: Colors.black }
                    ]}>
                    {delivery_wait}
                </T2SText>
            </View>
        );
    }

    renderThirdRowContainer() {
        const { storeFromListResponse, storeConfigShowDelivery, assignDriverThrough } = this.props;
        const { distanceInMiles } = isValidElement(storeFromListResponse) && storeFromListResponse;
        let distance = distanceValue(distanceInMiles);
        let isDistanceAvailable = isMoreZero(distance);
        return (
            <T2SView style={Styles.reviewContainer}>
                {isDistanceAvailable && this.renderReview()}
                {boolValue(storeConfigShowDelivery) && !isNashTakeaway(assignDriverThrough) && (
                    <>
                        {isDistanceAvailable && <View style={[Styles.verticalDivider, Styles.dividerContainer]} />}
                        <T2SView style={Styles.deliveryChargeContainer}>{this.renderDeliveryCharge()}</T2SView>
                    </>
                )}
            </T2SView>
        );
    }

    renderReview() {
        let { storeConfigTotalReviews, handleReviewsClick } = this.props;
        let reviewCount = getTotalReviewsCount(storeConfigTotalReviews);
        return (
            <T2STouchableOpacity accessible={false} onPress={handleReviewsClick} disabled={reviewCount === MINIMUM_REVIEW_COUNT}>
                <View style={Styles.menuCartBottomViewStyle}>
                    <T2SIcon
                        style={Styles.starIconStyle}
                        id={VIEW_ID.STAR_FILL_ICON}
                        screenName={screenName}
                        icon={reviewCount > MINIMUM_REVIEW_COUNT ? FONT_ICON.STAR_FILL : FONT_ICON.STAR_STROKE}
                        color={Colors.black}
                        size={22}
                    />
                    <View>
                        {reviewCount > MINIMUM_REVIEW_COUNT ? (
                            <T2SText id={VIEW_ID.REVIEW_TEXT} screenName={screenName} style={Styles.detailsMenuCartBottomText}>
                                {` ${LOCALIZATION_STRINGS.REVIEWS} `}
                                <T2SText style={Styles.reviewTextStyle} id={VIEW_ID.REVIEWS_COUNT_TEXT} screenName={screenName}>
                                    ({reviewCount})
                                </T2SText>
                            </T2SText>
                        ) : (
                            <T2SText id={VIEW_ID.REVIEW_TEXT} screenName={screenName} style={Styles.detailsMenuCartBottomText}>
                                {LOCALIZATION_STRINGS.NO_RATING}
                            </T2SText>
                        )}
                    </View>
                </View>
            </T2STouchableOpacity>
        );
    }

    renderDeliveryCharge() {
        let {
            currency,
            storeFromListResponse,
            assignDriverThrough,
            storeConfigName,
            storeConfigCharge,
            storeConfigDeliveryCharge,
            deliveryChargeFromList
        } = this.props;
        const { min_order } = isValidElement(storeFromListResponse) && storeFromListResponse;
        let takeawayName = isValidElement(storeConfigName) ? storeConfigName : LOCALIZATION_STRINGS.MENU;
        let deliveryCharge = isValidElement(storeConfigCharge) ? storeConfigCharge : storeConfigDeliveryCharge;
        let isThirdPartyAvailable = isThirdPartyDriverAvailable(assignDriverThrough);
        if (isValidElement(deliveryCharge))
            return (
                <View style={styles.deliveryDetailsViewStyle}>
                    {isDeliveryChargeAvailable(deliveryCharge?.charge) ? (
                        <T2SText
                            screenName={screenName}
                            id={takeawayName + '_' + VIEW_ID.DELIVERY_CHARGES_TEXT}
                            style={styles.deliveryCharge}>
                            {LOCALIZATION_STRINGS.DELIVERY + ' : '} {currencyValue(deliveryCharge.charge, currency, 2)}
                            {isThirdPartyAvailable && ' ' + LOCALIZATION_STRINGS.APPROX}
                            {isThirdPartyAvailable
                                ? this.renderMinOrder(min_order, takeawayName, currency, false)
                                : this.renderMinOrder(deliveryCharge?.minimum_order, takeawayName, currency, false)}
                        </T2SText>
                    ) : isFreeDelivery(deliveryCharge) ? (
                        <T2SText
                            screenName={screenName}
                            id={takeawayName + '_' + VIEW_ID.DELIVERY_CHARGES_TEXT}
                            style={[styles.freeRatingStyle, { color: Colors.black }]}>
                            {LOCALIZATION_STRINGS.FREE_DELIVERY}
                            {isThirdPartyDriverAvailable(assignDriverThrough)
                                ? this.renderMinOrder(min_order, takeawayName, currency, true)
                                : this.renderMinOrder(deliveryCharge?.minimum_order, takeawayName, currency, true)}
                        </T2SText>
                    ) : null}
                </View>
            );
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
}
export default MenuTakeawayInfoComponent;
