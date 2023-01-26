import T2STouchableOpacity from './T2STouchableOpacity';
import { View } from 'react-native';
import { T2SText } from '../index';
import T2SIcon from './T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import React from 'react';
import { expandingStyle } from './Style/T2SExpandingStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { isCollectionOrderType } from '../../../AppModules/OrderManagementModule/Utils/OrderManagementHelper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

export const T2SExpandableView = ({ onPress, data, expandView, screenName, clickId, iconId, titleId, isExpanded, orderType }) => {
    let title =
        isCollectionOrderType(orderType) && data.title === LOCALIZATION_STRINGS.ORDER_NOT_DELIVERED
            ? LOCALIZATION_STRINGS.ORDER_NOT_COLLECTED
            : data.title;
    return (
        <T2SView>
            <T2STouchableOpacity
                id={clickId}
                screenName={screenName}
                onPress={() => {
                    onPress(data);
                }}>
                <View style={expandingStyle.itemView}>
                    <T2SText id={titleId} style={expandingStyle.itemText} screenName={screenName}>
                        {title}
                    </T2SText>
                    {data.isDropDownAvailable && (
                        <T2SIcon
                            id={iconId}
                            screenName={screenName}
                            icon={isExpanded ? FONT_ICON.ARROW_UP : FONT_ICON.ARROW_DOWN}
                            size={24}
                        />
                    )}
                </View>
            </T2STouchableOpacity>
            {data.isDropDownAvailable && isExpanded && expandView}
            <View style={expandingStyle.divider} />
        </T2SView>
    );
};
