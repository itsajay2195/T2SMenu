import React, { useCallback } from 'react';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { CuisinesStyle } from './Style/CuisineSearchRowStyle';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/Constants';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';

const CuisineSearchRow = ({ itemName, itemCount, handleCheckBox }) => {
    const handleOnClick = useCallback(() => {
        handleCheckBox(itemName);
    }, [itemName, handleCheckBox]);

    return (
        <T2SView style={CuisinesStyle.mainContainer}>
            <T2STouchableOpacity style={CuisinesStyle.detailedContainer} onPress={handleOnClick}>
                <T2SText
                    id={itemName + '_' + VIEW_ID.CUISINE_NAME_TEXT}
                    screenName={SCREEN_NAME.CUISINES_SCREEN}
                    style={CuisinesStyle.CuisineTextStyle}>
                    {itemName} {' (' + itemCount + ')'}
                </T2SText>
            </T2STouchableOpacity>
        </T2SView>
    );
};

export default React.memo(CuisineSearchRow);
