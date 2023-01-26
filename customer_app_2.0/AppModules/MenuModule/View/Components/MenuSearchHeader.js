import React from 'react';
import { View } from 'react-native';
import Styles from '../Styles/MenuStyle';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import styles from '../Styles/MenuList';
import { VIEW_ID } from '../../Utils/MenuConstants';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import OrderTypeAction from '../../../HomeModule/View/components/OrderTypeAction';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { Colors } from 't2sbasemodule/Themes';

let screenName = SCREEN_OPTIONS.MENU_SCREEN.screen_title;

const MenuSearchHeader = ({
    goBackHandler,
    handleSearchIconClickAction,
    onOrderTypeActionPressed,
    selectedOrderType,
    showTakeAwayName,
    takeAwayName
}) => {
    return (
        <View style={[Styles.menuBackgroundStyle, { backgroundColor: showTakeAwayName ? Colors.white : Colors.whiteSmoke }]}>
            <View style={Styles.menuSubContainer}>
                <View style={Styles.flexRow}>
                    <T2SIcon
                        screenName={screenName}
                        id={VIEW_ID.BACK_ARROW}
                        name={FONT_ICON.BACK}
                        style={[styles.backIcon, Styles.alignCenter]}
                        onPress={goBackHandler}
                    />
                    {showTakeAwayName && isValidString(takeAwayName) && (
                        <T2SText
                            id={VIEW_ID.TAKEAWAY_NAME_TITLE_TEXT}
                            screenName={screenName}
                            numberOfLines={1}
                            style={Styles.takeAwayHeaderStyle}>
                            {takeAwayName}
                        </T2SText>
                    )}
                </View>
                <View style={Styles.searchIconFlexRow}>
                    <View style={Styles.searchIconAlignIcon}>
                        <T2STouchableOpacity screenName={screenName} id={VIEW_ID.SEARCH_ICON_VIEW} onPress={handleSearchIconClickAction}>
                            <T2SIcon
                                style={Styles.searchItemsIconStyle}
                                id={VIEW_ID.SEARCH_ICON}
                                screenName={screenName}
                                icon={FONT_ICON.SEARCH}
                                size={22}
                            />
                        </T2STouchableOpacity>
                    </View>
                    <OrderTypeAction
                        isFull={true}
                        isTransparent={true}
                        key={VIEW_ID.COLLECTION_DELIVERY_ICON}
                        orderType={selectedOrderType}
                        onPress={onOrderTypeActionPressed}
                        screenName={screenName}
                        showSearchFilter={true}
                        handleSearchIconClickAction={handleSearchIconClickAction}
                    />
                </View>
            </View>
        </View>
    );
};

export default React.memo(MenuSearchHeader);
