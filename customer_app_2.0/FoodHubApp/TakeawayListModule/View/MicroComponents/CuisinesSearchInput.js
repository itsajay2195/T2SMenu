import React from 'react';
import { TextInput, View } from 'react-native';
import CuisinesStyle from '../../Style/CuisinesStyles';
import { T2SIcon, T2SText } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { LIMIT_DISCOUNT_VALUE_TO_DISPLAY, SCREEN_NAME, VIEW_ID } from '../../Utils/Constants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { FavouriteTakeawayStyle } from '../../Style/FavouriteTakeawayListStyle';
import { isEmpty } from '../../../../T2SBaseModule/Utils/helpers';
import styles from '../../Style/CuisinesStyles';
import { TabNavigatorStyle } from '../../Style/TabNavigatoreStyle';

export const CuisinesHeaderTitle = React.memo(({ listDataLength, handleOnPress }) => {
    return (
        <View style={CuisinesStyle.rowStyle}>
            <T2SText screenName={SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST} id={VIEW_ID.CUISINES_TEXT} style={CuisinesStyle.headerText}>
                {LOCALIZATION_STRINGS.CUISINES}
            </T2SText>
            {listDataLength > LIMIT_DISCOUNT_VALUE_TO_DISPLAY && (
                <T2STouchableOpacity screenName={SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST} id={VIEW_ID.SHOW_MORE_TEXT} onPress={handleOnPress}>
                    <T2SText style={CuisinesStyle.showMoreText}>{LOCALIZATION_STRINGS.SHOW_MORE}</T2SText>
                </T2STouchableOpacity>
            )}
        </View>
    );
});

export const CuisineSearchInput = ({
    handleTextChange,
    textValue,
    placeholderText,
    handleClose,
    isFromFavTAList = false,
    autoFocus = false,
    showClose = false
}) => {
    let showCloseIcon = showClose ? !isEmpty(textValue) : false;
    return (
        <View style={isFromFavTAList ? FavouriteTakeawayStyle.headerContainer : CuisinesStyle.headerContainer}>
            <T2SView style={isFromFavTAList ? FavouriteTakeawayStyle.searchBarStyle : CuisinesStyle.searchBarStyle}>
                <TextInput
                    {...setTestId(SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST, VIEW_ID.FAVOURITE_COUNT_TEXT)}
                    style={CuisinesStyle.searchTextStyle}
                    placeholderTextColor={Colors.tabGrey}
                    value={textValue}
                    onChangeText={handleTextChange}
                    placeholder={placeholderText}
                    autoFocus={autoFocus}
                />
                {!showCloseIcon ? (
                    <T2SIcon
                        screenName={SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST}
                        id={VIEW_ID.SEARCH_ICON}
                        style={CuisinesStyle.searchIconStyle}
                        icon={FONT_ICON.SEARCH}
                        size={24}
                    />
                ) : (
                    <T2SIcon
                        screenName={SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST}
                        id={VIEW_ID.SEARCH_ICON}
                        style={CuisinesStyle.searchIconStyle}
                        icon={FONT_ICON.CLOSE}
                        size={20}
                        onPress={handleClose}
                    />
                )}
            </T2SView>
        </View>
    );
};

export const CuisinesSearchAndResetHeader = ({ showReset, handleResetAction, handleSearchButtonAction }) => {
    return (
        <View style={styles.searchAndResetContainer}>
            <T2STouchableOpacity onPress={handleSearchButtonAction}>
                <T2SIcon
                    screenName={SCREEN_NAME.FAVOURITE_TAKEAWAY_LIST}
                    id={VIEW_ID.SEARCH_ICON}
                    style={styles.searchIconStyle}
                    icon={FONT_ICON.SEARCH}
                    size={24}
                />
            </T2STouchableOpacity>
            {showReset && (
                <T2STouchableOpacity onPress={handleResetAction}>
                    <T2SText id={VIEW_ID.RESET_BUTTON} style={TabNavigatorStyle.resetIconStyle}>
                        {LOCALIZATION_STRINGS.RESET}
                    </T2SText>
                </T2STouchableOpacity>
            )}
        </View>
    );
};
