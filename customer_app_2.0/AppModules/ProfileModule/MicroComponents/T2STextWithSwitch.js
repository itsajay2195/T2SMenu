import { View } from 'react-native';
import styles from '../Styles/ProfileStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SSwitch from 't2sbasemodule/UI/CommonUI/T2SSwitch';
import Colors from 't2sbasemodule/Themes/Colors';
import React, { useCallback } from 'react';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
let screenName = SCREEN_OPTIONS.PROFILE.route_name;
const T2STextWithSwitch = ({ viewId, title, toggleId, toggleValue, toggleChange }) => {
    const handleOnToggleChange = useCallback(() => {
        toggleChange(toggleId);
    }, [toggleId, toggleChange]);
    return (
        <View style={styles.promotionsRow}>
            <T2SText id={viewId} screenName={screenName} style={styles.promotionsTextStyle}>
                {title}
            </T2SText>
            <T2SSwitch
                screenName={screenName}
                id={toggleId}
                style={styles.switchStyle}
                color={Colors.primaryColor}
                onValueChange={handleOnToggleChange}
                value={toggleValue}
            />
        </View>
    );
};
export default React.memo(T2STextWithSwitch);
