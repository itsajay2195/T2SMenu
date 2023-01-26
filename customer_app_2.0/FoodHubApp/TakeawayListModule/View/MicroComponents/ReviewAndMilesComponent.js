import { styles } from '../../Style/TakeawayListWidgetStyle';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { FILTER_TAKEAWAY_CONSTANTS, VIEW_ID } from '../../Utils/Constants';
import { View } from 'react-native';
import React from 'react';
import { isValidElement, isValidString, kFormatter } from 't2sbasemodule/Utils/helpers';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { LOCALIZATION_STRINGS } from '../../../../AppModules/LocalizationModule/Utils/Strings';
import { MINIMUM_REVIEW_COUNT } from 'appmodules/MenuModule/Utils/MenuConstants';

const IconWithTextView = React.memo(({ iconName, screenName, text, textId, showDisabledStyle = false }) => {
    return (
        <View style={styles.milesViewStyle}>
            <T2SIcon icon={iconName} color={Colors.blackLight} size={18} id={text + '-' + VIEW_ID.MILES_ICON} screenName={screenName} />
            <T2SText
                screenName={screenName}
                id={text + '-' + VIEW_ID.MILES_TEXT}
                style={showDisabledStyle ? styles.milesStyleDisabled : styles.milesStyle}>
                {text}
            </T2SText>
        </View>
    );
});

export const RatingComponent = React.memo(({ itemName, rating, screenName }) => {
    return (
        <View style={styles.ratingViewStyle}>
            <T2SIcon
                screenName={screenName}
                id={rating + '_' + VIEW_ID.RATING_STARS_ICON}
                icon={FONT_ICON.STAR_FILL}
                color={rating > MINIMUM_REVIEW_COUNT ? Colors.lightRatingYellow : Colors.lighterGrey}
                size={18}
            />
            {rating > MINIMUM_REVIEW_COUNT && (
                <T2SText screenName={screenName} id={rating + '-' + VIEW_ID.RATING_STARS_TEXT} style={styles.ratingText}>
                    {rating}
                </T2SText>
            )}
        </View>
    );
});

const ReviewAndMilesComponent = ({
    screenName,
    itemName,
    rating,
    isTakeawayClosed,
    selectedOrderType,
    viewType,
    milesText,
    totalReviewCount,
    distanceInMiles,
    deliveryWaitingTime,
    collectionWaitingTime,
    isOrderTypeEnabled,
    show_delivery,
    show_collection
}) => {
    const renderReviewCount = () => {
        return (
            <T2SText
                screenName={screenName}
                id={itemName + '_' + VIEW_ID.REVIEW_TEXT}
                style={[
                    styles.ratingStyleText,
                    { color: Colors.rating_grey },
                    { backgroundColor: isTakeawayClosed ? Colors.whiteSmoke : Colors.white }
                ]}>
                {`(${kFormatter(totalReviewCount)} ${LOCALIZATION_STRINGS.REVIEWS})`}
            </T2SText>
        );
    };

    const renderMiles = () => {
        if (
            isValidElement(viewType) &&
            viewType === FILTER_TAKEAWAY_CONSTANTS.TAKEAWAY_LIST &&
            (isValidElement(distanceInMiles) || isValidString(milesText))
        ) {
            return (
                <IconWithTextView
                    iconName={FONT_ICON.MAP_STOKE}
                    screenName={screenName}
                    textId={itemName + '_' + VIEW_ID.DELIVERY_RADIUS_TEXT}
                    text={milesText}
                    showDisabledStyle={!isValidElement(distanceInMiles)}
                />
            );
        }
    };

    return isOrderTypeEnabled ? (
        <View style={styles.taDeliveryDetails}>
            {isValidElement(rating) && rating > MINIMUM_REVIEW_COUNT && isOrderTypeEnabled && (
                <T2SView screenName={screenName} id={VIEW_ID.RATINGS_STAR_VIEW} style={styles.takeawayReviewViewStyle}>
                    <View style={styles.reviewViewStyle}>
                        {isValidElement(rating) && rating > MINIMUM_REVIEW_COUNT && (
                            <RatingComponent rating={rating} itemName={itemName} screenName={screenName} />
                        )}
                        {totalReviewCount > MINIMUM_REVIEW_COUNT && renderReviewCount()}
                    </View>
                </T2SView>
            )}
            <View style={[styles.taDeliveryDetails, styles.taDeliveryTimeStyle]}>
                {renderMiles()}
                {selectedOrderType === ORDER_TYPE.DELIVERY && (
                    <T2SView screenName={screenName} id={VIEW_ID.WAITING_TIME + '_' + itemName}>
                        <IconWithTextView
                            iconName={FONT_ICON.DELIVERY}
                            screenName={screenName}
                            textId={itemName + '_' + VIEW_ID.DELIVERY_RADIUS_TEXT}
                            text={deliveryWaitingTime}
                        />
                    </T2SView>
                )}
            </View>
        </View>
    ) : (
        <View style={styles.taDeliveryDetails}>
            <View style={[styles.taDeliveryDetails, styles.taDeliveryNonTimeStyle]}>
                <T2SView screenName={screenName} id={VIEW_ID.RATINGS_STAR_VIEW} style={styles.milesContainerStyle}>
                    {renderMiles()}
                </T2SView>
                <View style={[styles.taDeliveryDetails, styles.auDeliveryTimeStyle]}>
                    {isValidElement(show_delivery) && show_delivery === 1 && (
                        <T2SView screenName={screenName} id={VIEW_ID.WAITING_TIME + '_' + itemName}>
                            <IconWithTextView
                                iconName={FONT_ICON.DELIVERY}
                                screenName={screenName}
                                textId={itemName + '_' + VIEW_ID.DELIVERY_RADIUS_TEXT}
                                text={deliveryWaitingTime}
                            />
                        </T2SView>
                    )}
                    {isValidElement(show_collection) && show_collection === 1 && (
                        <T2SView screenName={screenName} id={VIEW_ID.WAITING_TIME + '_' + itemName}>
                            <IconWithTextView
                                iconName={FONT_ICON.COLLECTION}
                                screenName={screenName}
                                textId={itemName + '_' + VIEW_ID.DELIVERY_RADIUS_TEXT}
                                text={collectionWaitingTime}
                            />
                        </T2SView>
                    )}
                </View>
            </View>
        </View>
    );
};

export default React.memo(ReviewAndMilesComponent);
