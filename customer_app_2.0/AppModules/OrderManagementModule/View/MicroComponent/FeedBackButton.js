import React, { useCallback } from 'react';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/OrderManagementConstants';
import { View } from 'react-native';
import { styles } from '../Styles/OrderHistoryFoodHubItemStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { T2SIcon, T2STouchableOpacity } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { canGiveReview } from '../../../ReviewModule/Utils/ReviewHelper';

const FeedBackButton = ({ onPress, feedBackButton, data }) => {
    const handleFeedBackButton = useCallback(() => {
        isValidElement(onPress) && onPress(feedBackButton);
    }, [feedBackButton, onPress]);
    const { id, review } = data;
    return (
        <T2STouchableOpacity accessible={false} onPress={handleFeedBackButton}>
            <View style={styles.buttonParent}>
                <T2SText id={VIEW_ID.ORDER_FEEDBACK_TEXT + '_' + id} screenName={SCREEN_NAME.ORDER_HISTORY} style={styles.buttonText}>
                    {' ' + LOCALIZATION_STRINGS.APP_FEED_BACK + ' '}
                </T2SText>
                {!canGiveReview(data) && (
                    <T2SIcon
                        id={VIEW_ID.FEEDBACK_TICK_ICON + '_' + id}
                        screenName={SCREEN_NAME.ORDER_HISTORY}
                        icon={isValidString(review?.response) ? FONT_ICON.DOUBLE_TICK : FONT_ICON.TICK}
                        color={Colors.primaryColor}
                        size={isValidString(review?.response) ? 20 : 16}
                        style={styles.tickIconStyle}
                    />
                )}
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(FeedBackButton);
