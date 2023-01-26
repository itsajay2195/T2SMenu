import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { VIEW_ID } from '../Utils/ProfileConstants';
import { Text, View } from 'react-native';
import styles from '../Styles/ProfileStyles';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import React, { useCallback } from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

let screenName = SCREEN_OPTIONS.PROFILE.route_name;
const ProfileTextRow = ({ viewId, title, onRowClicked }) => {
    const handleOnPress = useCallback(() => {
        if (isValidElement(onRowClicked)) {
            onRowClicked(viewId);
        }
    }, [viewId, onRowClicked]);
    return (
        <T2STouchableOpacity id={viewId} screenName={screenName} onPress={handleOnPress}>
            <View style={styles.rowStyle}>
                <Text style={styles.optionsTextStyle}>{title}</Text>
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
export default React.memo(ProfileTextRow);
