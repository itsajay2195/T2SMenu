import React, { useCallback } from 'react';
import { View } from 'react-native';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/Constants';
import { SortByStyles } from '../../Style/SortByScreenStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { filterStyle } from '../Cuisines/Style/FilterCategoryListStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';

const FilterCategoryItem = ({ indexValue, itemKey, itemTitle, handleOnPress, checkStatus }) => {
    const handleClick = useCallback(() => {
        handleOnPress(itemKey);
    }, [itemKey, handleOnPress]);

    return (
        <T2SView style={[filterStyle.filterRowStyle, indexValue === 0 && { marginTop: 2 }]}>
            <T2STouchableOpacity
                id={VIEW_ID.FILTER_RADIOBUTTON + itemTitle}
                screenName={SCREEN_NAME.FILTER_SCREEN}
                onPress={handleClick}
                style={SortByStyles.detailedContainer}>
                <T2SText
                    id={itemTitle + '_' + VIEW_ID.FILTER_NAME_TEXT}
                    style={filterStyle.radioTextStyle}
                    screenName={SCREEN_NAME.FILTER_SCREEN}>
                    {itemTitle}
                </T2SText>
                <T2SIcon id={VIEW_ID.TICK_ICON} name={checkStatus ? FONT_ICON.TICK : null} size={25} style={filterStyle.iconStyle} />
            </T2STouchableOpacity>
            <View style={filterStyle.dividerStyle} />
        </T2SView>
    );
};

export default React.memo(FilterCategoryItem);
