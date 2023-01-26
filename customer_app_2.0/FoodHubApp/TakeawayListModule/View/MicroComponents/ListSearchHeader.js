import React, { useCallback, useRef } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { styles } from '../../Style/TakeawaySearchListStyle';
import { T2SText, T2STouchableOpacity } from 't2sbasemodule/UI';
import { VIEW_ID } from '../../Utils/Constants';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { Badge } from 'react-native-paper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

export const FilterIconBadge = React.memo(
    ({ cuisineName = '', handleOnPress, showFilterCount, badgeCount, screenName, isFromTAList = false }) => {
        const filterOnPress = useCallback(() => {
            handleOnPress(cuisineName);
        }, [cuisineName, handleOnPress]);
        return (
            <T2STouchableOpacity
                style={isFromTAList && styles.filterIconStyle}
                onPress={filterOnPress}
                screenName={screenName}
                id={VIEW_ID.FILTER_ICON_VIEW}
                accessible={false}>
                <T2SIcon icon={FONT_ICON.FILTER_NEW} color={Colors.black} size={25} screenName={screenName} id={VIEW_ID.FILTER_ICON} />
                {showFilterCount && (
                    <Badge size={15} style={styles.cuisinesCount} {...setTestId(screenName, VIEW_ID.CUISINE_COUNT_TEXT)}>
                        {badgeCount}
                    </Badge>
                )}
            </T2STouchableOpacity>
        );
    }
);

export const TakeawayListSearchBar = React.memo(({ screenName, textInputValue, onChangeText, showClearIcon, clearIconPress }) => {
    const textInputRef = useRef(null);
    const endEditing = () => {
        Keyboard.dismiss();
    };

    const textInputFocus = useCallback(() => {
        if (isValidElement(textInputRef) && isValidElement(textInputRef.current)) {
            textInputRef.current.focus();
        }
    }, [textInputRef]);

    return (
        <T2SView style={styles.searchBarStyle} id={VIEW_ID.SEARCH_BAR_TEXT_INPUT_VIEW} screenName={screenName}>
            <TextInput
                {...setTestId(screenName, VIEW_ID.SEARCH_BAR_TEXT_INPUT)}
                style={styles.searchTextStyle}
                placeholderTextColor={Colors.tabGrey}
                ref={textInputRef}
                value={textInputValue}
                onChangeText={onChangeText}
                placeholder={LOCALIZATION_STRINGS.SEARCH_FOR_TAKEAWAY}
                onEndEditing={endEditing}
            />
            {showClearIcon ? (
                <T2SIcon
                    icon={FONT_ICON.WRONG}
                    color={Colors.suvaGrey}
                    style={styles.rightIconStyle}
                    size={25}
                    onPress={clearIconPress}
                    id={VIEW_ID.CLOSED_ICON}
                    screenName={screenName}
                />
            ) : (
                <T2SIcon
                    screenName={screenName}
                    id={VIEW_ID.SEARCH_ICON}
                    onPress={textInputFocus}
                    style={styles.searchIconStyle}
                    color={Colors.black}
                    icon={FONT_ICON.SEARCH}
                    size={25}
                />
            )}
        </T2SView>
    );
});

export const SelectOrderTypeView = React.memo(({ screenName, onPress, orderType }) => {
    return (
        <T2STouchableOpacity
            screenName={screenName}
            id={VIEW_ID.ORDER_TYPE_BUTTON}
            onPress={onPress}
            style={styles.orderTypeTouchableStyle}
            accessible={false}>
            <T2SView style={styles.orderTypeContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.ORDER_TYPE_TEXT} style={styles.orderTypeTextStyle}>
                    {orderType}
                </T2SText>
                <T2SIcon
                    style={styles.downArrowStyle}
                    icon={FONT_ICON.ARROW_DOWN}
                    color={Colors.black}
                    size={27}
                    screenName={screenName}
                    id={VIEW_ID.ARROW_DOWN_ICON}
                />
            </T2SView>
        </T2STouchableOpacity>
    );
});
