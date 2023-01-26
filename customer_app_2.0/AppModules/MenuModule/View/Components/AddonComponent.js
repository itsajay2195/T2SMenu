import { isValidString, isValidElement } from 't2sbasemodule/Utils/helpers';
import { getReOrderAddOns } from '../../Utils/MenuHelpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../HomeModule/Utils/HomeConstants';
import style from '../../../HomeModule/View/Styles/PreviousOrderComponentStyle';
import React from 'react';

const AddonComponent = (props) => {
    const { item, screenName, isFromBestSelling } = props;
    let description = isFromBestSelling
        ? isValidElement(item) && isValidString(item.description)
            ? item.description
            : ''
        : getReOrderAddOns(item);
    if (isValidString(description)) {
        return (
            <T2SText
                id={isFromBestSelling ? VIEW_ID.ITEM_DESCRIPTION : VIEW_ID.ITEM}
                screenName={screenName}
                style={style.descriptionStyle}
                numberOfLines={2}>
                {description}
            </T2SText>
        );
    }
    return null;
};

function propCheck(prevProps, nextProps) {
    return (
        prevProps.isFromBestSelling !== nextProps.isFromBestSelling ||
        prevProps.item !== nextProps.item ||
        prevProps.screenName !== nextProps.screenName
    );
}

export default React.memo(AddonComponent, propCheck);
