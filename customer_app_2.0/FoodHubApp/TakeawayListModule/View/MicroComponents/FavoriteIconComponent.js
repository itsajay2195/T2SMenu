import { styles } from '../../Style/TakeawaySearchListStyle';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/Constants';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { Badge } from 'react-native-paper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import React from 'react';

const FavoriteIcon = ({ onPress, favouriteTakeawaysCount }) => {
    return (
        <T2STouchableOpacity
            screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
            id={VIEW_ID.HEART_ICON_VIEW}
            onPress={onPress}
            style={styles.heartIconOpacity}
            accessible={false}>
            <T2SIcon
                icon={FONT_ICON.HEART_STROKE}
                color={Colors.black}
                size={25}
                screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                id={VIEW_ID.HEART_ICON}
            />
            {favouriteTakeawaysCount > 0 && (
                <Badge size={15} style={styles.labelCount} {...setTestId(SCREEN_NAME.TAKEAWAY_LIST_SCREEN, VIEW_ID.FAVOURITE_COUNT_TEXT)}>
                    {favouriteTakeawaysCount}
                </Badge>
            )}
        </T2STouchableOpacity>
    );
};

export default React.memo(FavoriteIcon);
