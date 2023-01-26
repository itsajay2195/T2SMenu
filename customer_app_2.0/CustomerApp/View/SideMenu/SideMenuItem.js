import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles/SideMenuItemStyle';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { T2SIcon } from 't2sbasemodule/UI';
import T2STouchableRipple from 't2sbasemodule/UI/CommonUI/T2STouchableRipple';
import { VIEW_SELECTED } from 't2sbasemodule/Utils/AutomationHelper';
import { SCREEN_NAME } from './SideMenuConstants';
import { SCREEN_OPTIONS } from '../../Navigation/ScreenOptions';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import Flag from 'react-native-flags';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { VIEW_ID } from './SideMenuConstants';

const SideMenuItem = ({
    labelCount,
    screenDisplayName,
    selectedItem,
    screenName,
    handleNavigateClickProp,
    ImageName,
    trailingIcon = undefined,
    selection = true
}) => {
    let checkValidElementHandleNavigateClickProp = isValidElement(handleNavigateClickProp) && handleNavigateClickProp;
    return (
        <T2STouchableRipple
            onPress={() => checkValidElementHandleNavigateClickProp(screenName)}
            id={`${screenName}${selectedItem === screenName ? VIEW_SELECTED : ''}`}
            screenName={SCREEN_NAME.SIDE_MENU}
            accessible={false}>
            <View>
                <View style={styles.sideMenuContainer}>
                    <View
                        style={
                            selectedItem === screenName && selection
                                ? [styles.verticalLine, styles.verticalLineSelected]
                                : styles.verticalLine
                        }
                    />
                    <View style={styles.sideMenuViewStyle}>
                        {screenName === SCREEN_OPTIONS.COUNTRY_PICKER.route_name ? (
                            <View style={styles.flagContainer}>
                                <Flag style={styles.flagStyle} code={ImageName} size={32} />
                            </View>
                        ) : (
                            <T2SIcon
                                size={24}
                                icon={ImageName}
                                style={
                                    selectedItem === screenName && selection
                                        ? [styles.iconStyle, styles.iconSelectedStyle]
                                        : styles.iconStyle
                                }
                            />
                        )}
                        <T2SText
                            id={screenDisplayName + '_' + VIEW_ID.SIDE_MENU_TEXT}
                            screenName={SCREEN_NAME.SIDE_MENU}
                            style={[
                                styles.menuItemTextStyle,
                                selectedItem === screenName && selection ? styles.menuSelectedTextStyle : {}
                            ]}>
                            {screenDisplayName}
                        </T2SText>
                        {isValidElement(labelCount) && <Text style={styles.labelCount}>{labelCount}</Text>}
                    </View>
                    {isValidElement(trailingIcon) ? (
                        <View style={styles.trailingIconStyle}>
                            <T2SIcon icon={trailingIcon} size={25} />
                        </View>
                    ) : null}
                </View>
                <View style={[screenDisplayName === LOCALIZATION_STRINGS.NOTIFICATIONS ? styles.dividerContainerStyle : {}]} />
            </View>
        </T2STouchableRipple>
    );
};

function propCheck(prevProps, nextProps) {
    return (
        (prevProps.selectedItem === prevProps.screenName || prevProps.screenName !== nextProps.selectedItem) &&
        (prevProps.selectedItem !== prevProps.screenName || prevProps.screenName === nextProps.selectedItem) &&
        prevProps.labelCount === nextProps.labelCount &&
        prevProps.screenDisplayName === nextProps.screenDisplayName &&
        prevProps.ImageName === nextProps.ImageName &&
        prevProps.trailingIcon === nextProps.trailingIcon &&
        prevProps.selection === nextProps.selection
    );
}

export default React.memo(SideMenuItem, propCheck);
