import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { getOfferText, isNoOfferItem } from '../../../BasketModule/Utils/BasketHelper';
import { Animated } from 'react-native';
import style from '../../../HomeModule/View/Styles/PreviousOrderComponentStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../HomeModule/Utils/HomeConstants';
import offerStyle from '../Styles/MenuStyle';
import React from 'react';

const OfferComponent = (props) => {
    const { offer, screenName } = props;
    if (isValidElement(offer) && !isNoOfferItem(offer)) {
        return (
            <Animated.View style={style.offerLabel}>
                <T2SText id={VIEW_ID.ITEM + offer} screenName={screenName} style={offerStyle.offerStyle}>
                    {getOfferText(offer)}
                </T2SText>
            </Animated.View>
        );
    }
    return null;
};
function propCheck(prevProps, nextProps) {
    return prevProps.offer !== nextProps.offer || prevProps.screenName !== nextProps.screenName;
}

export default React.memo(OfferComponent, propCheck);
