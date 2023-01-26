import { View } from 'react-native';
import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Style/RecommenedTAStyle';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/Constants';
import { T2SIcon, T2SText } from 't2sbasemodule/UI';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import TakeawayBackgroundImage from 't2sbasemodule/UI/CustomUI/TakeawayBackgroundImage';
import { getModifiedRating } from '../../../HomeModule/Utils/Helper';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';

const RecommendedTakeaway = ({
    imageURL,
    name,
    rating,
    cuisines,
    onRecommendedTakeawaySelected,
    delivery_time,
    cuisineNotEmpty,
    orderType
}) => {
    const ratingValue = getModifiedRating(rating);
    return (
        <T2STouchableOpacity onPress={onRecommendedTakeawaySelected}>
            <T2SView style={styles.recentTakeawayCard}>
                <T2SView id={VIEW_ID.CARD_VIEW} screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN} style={styles.recentTakeawayImageContainer}>
                    <TakeawayBackgroundImage
                        screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                        source={{ uri: imageURL }}
                        style={styles.imageStyle}
                        resizeMode={'contain'}
                        id={VIEW_ID.TA_RECOMMENED_IMAGE}
                    />
                </T2SView>
                <T2SText
                    screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                    id={VIEW_ID.CARD_TAKEAWAY_NAME}
                    style={styles.cardNameStyle}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {name}
                </T2SText>
                <T2SText
                    screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                    id={VIEW_ID.CARD_TAKEAWAY_NAME}
                    style={cuisineNotEmpty ? styles.cuisinesNameStyle : styles.cuisinesEmptyStyle}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {cuisines}
                </T2SText>
                <T2SView
                    style={ratingValue > 0 ? styles.rowViewStyle : styles.rowStyle}
                    screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                    id={VIEW_ID.RATING_ROW_VIEW}>
                    {ratingValue > 0 && (
                        <View style={styles.innerRow}>
                            <T2SIcon name={FONT_ICON.STAR_FILL} size={16} color={Colors.lightRatingYellow} style={styles.cardIconStyle} />
                            <T2SText screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN} id={VIEW_ID.RATING_TEXT} style={styles.ratingText}>
                                {getModifiedRating(rating)}
                            </T2SText>
                            <View style={styles.verticalDivider} />
                        </View>
                    )}
                    <IconWithTextView
                        iconName={orderType === ORDER_TYPE.DELIVERY ? FONT_ICON.DELIVERY : FONT_ICON.COLLECTION}
                        screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                        textId={VIEW_ID.DELIVERY_RADIUS_TEXT}
                        text={delivery_time}
                    />
                </T2SView>
            </T2SView>
        </T2STouchableOpacity>
    );
};

const IconWithTextView = React.memo(({ iconName, screenName, text, textId, showDisabledStyle = false }) => {
    return (
        <View style={styles.milesViewStyle}>
            <T2SIcon icon={iconName} color={Colors.blackLight} size={18} />
            <T2SText screenName={screenName} id={textId} style={showDisabledStyle ? styles.milesStyleDisabled : styles.milesStyle}>
                {text}
            </T2SText>
        </View>
    );
});

export default React.memo(RecommendedTakeaway);
