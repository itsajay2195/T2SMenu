import { View } from 'react-native';
import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/HomeStyles';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import { T2SIcon, T2SText } from 't2sbasemodule/UI';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { Card } from 'react-native-paper';
import TakeawayBackgroundImage from 't2sbasemodule/UI/CustomUI/TakeawayBackgroundImage';
import { getModifiedName, getModifiedRating, getModifiedReviews } from '../../Utils/Helper';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { MINIMUM_REVIEW_COUNT } from 'appmodules/MenuModule/Utils/MenuConstants';
import { safeIntValue } from 't2sbasemodule/Utils/helpers';

const RecentTakeawayListComponent = ({ imageURL, name, rating, total_reviews, onRecentTakeawaySelected }) => {
    return (
        <T2STouchableOpacity onPress={onRecentTakeawaySelected}>
            <Card style={styles.recentTakeawayCard}>
                <T2SView style={styles.cardViewStyle} id={VIEW_ID.CARD_VIEW} screenName={SCREEN_NAME.HOME_SCREEN}>
                    <View style={styles.recentTakeawayImageContainer}>
                        <TakeawayBackgroundImage
                            screenName={SCREEN_NAME.HOME_SCREEN}
                            source={{ uri: imageURL }}
                            style={styles.imageStyle}
                            resizeMode={'contain'}
                        />
                    </View>
                    <T2SText
                        screenName={SCREEN_NAME.HOME_SCREEN}
                        id={VIEW_ID.CARD_TAKEAWAY_NAME}
                        style={styles.cardNameStyle}
                        numberOfLines={1}>
                        {getModifiedName(name)}
                    </T2SText>
                </T2SView>

                {safeIntValue(total_reviews) && total_reviews > MINIMUM_REVIEW_COUNT ? (
                    <T2SView style={styles.rowViewStyle} screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.RATING_ROW_VIEW}>
                        <T2SIcon name={FONT_ICON.STAR_FILL} size={25} color={Colors.lightRatingYellow} style={styles.cardIconStyle} />
                        <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.RATING_TEXT} style={styles.ratingText}>
                            {getModifiedRating(rating)}
                        </T2SText>
                        <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.REVIEWS_TEXT} style={styles.reviewsTextStyle}>
                            ({getModifiedReviews(total_reviews)}
                            {` ${LOCALIZATION_STRINGS.REVIEWS}`})
                        </T2SText>
                    </T2SView>
                ) : (
                    <T2SView style={styles.noRowViewStyle} screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.RATING_ROW_VIEW}>
                        <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.REVIEWS_TEXT} style={styles.reviewsTextStyle}>
                            {`(${LOCALIZATION_STRINGS.NO_RATING})`}
                        </T2SText>
                    </T2SView>
                )}
            </Card>
        </T2STouchableOpacity>
    );
};

function propCheck(prevProps, nextProps) {
    return (
        prevProps.imageURL !== nextProps.imageURL ||
        prevProps.name !== nextProps.name ||
        prevProps.rating !== nextProps.rating ||
        prevProps.total_reviews !== nextProps.total_reviews
    );
}

export default React.memo(RecentTakeawayListComponent, propCheck);
