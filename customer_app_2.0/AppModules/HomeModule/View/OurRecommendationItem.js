import style from './Styles/OurRecommedationsStyle';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { getOfferText, isNoOfferItem } from '../../BasketModule/Utils/BasketHelper';
import { View } from 'react-native';
import offerStyle from '../../MenuModule/View/Styles/MenuStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../Utils/HomeConstants';
import React from 'react';
const OurRecommendationItem = ({ name, description, offer, screenName }) => {
    return (
        <View style={style.firstRowContainer}>
            {isValidString(offer) && !isNoOfferItem(offer) && (
                <View style={offerStyle.offerContainer}>
                    <T2SText id={VIEW_ID.ITEM + offer} screenName={screenName} style={offerStyle.offerStyle}>
                        {getOfferText(offer)}
                    </T2SText>
                </View>
            )}
            <View>
                <T2SText style={style.nameItemStyle} screenName={screenName} id={VIEW_ID.HOME_OUR_RECOMMENDATION_ITEM_NAME + name}>
                    {name}
                </T2SText>
                <T2SText
                    style={style.descriptionStyle}
                    screenName={screenName}
                    id={VIEW_ID.HOME_OUR_RECOMMENDATION_ITEM_DESC + description}>
                    {description}
                </T2SText>
            </View>
        </View>
    );
};
export default React.memo(OurRecommendationItem);
