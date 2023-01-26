import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { VIEW_ID } from '../Utils/ProfileConstants';
import { View } from 'react-native';
import styles from '../Styles/ProfileStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import React, { useCallback } from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
let screenName = SCREEN_OPTIONS.PROFILE.route_name;
const T2STextWithCustomIcon = ({ viewId, title, handlePromotionOnPress }) => {
    const handleOnPress = useCallback(() => {
        handlePromotionOnPress(viewId);
    }, [viewId, handlePromotionOnPress]);
    return (
        <T2STouchableOpacity id={viewId} screenName={screenName} onPress={handleOnPress}>
            <View style={styles.rowStyle}>
                <T2SText id={viewId} screenName={screenName} style={styles.optionsTextStyle}>
                    {title}
                </T2SText>
                <CustomIcon
                    {...setTestId(screenName, VIEW_ID.RIGHT_ARROW_ICON)}
                    name={
                        viewId === VIEW_ID.EXPORT_DATA
                            ? FONT_ICON.EMAIL
                            : viewId === VIEW_ID.DELETE_ACCOUNT
                            ? FONT_ICON.DELETE
                            : FONT_ICON.RIGHT_ARROW_2
                    }
                    style={(viewId === VIEW_ID.EXPORT_DATA || viewId === VIEW_ID.DELETE_ACCOUNT) && styles.optionsIconStyle}
                    size={25}
                />
            </View>
        </T2STouchableOpacity>
    );
};
export default React.memo(T2STextWithCustomIcon);
