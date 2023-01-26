import React from 'react';
import { FlatList, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import style from './Styles/OurRecommedationsStyle';
import { VIEW_ID } from '../Utils/HomeConstants';
import QuantityButton from '../../MenuModule/View/Components/QuantityButton';
import OurRecommendationItem from './OurRecommendationItem';

const OurRecommendations = (props) => {
    const { screenName, response, currency } = props;
    return (
        <View>
            <FlatList
                contentContainerStyle={style.listStyle}
                data={response.slice(0, 5)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderListItem(screenName, item, currency)}
            />
        </View>
    );
};

function renderListItem(screenName, item, currency) {
    const { name, description, price, offer } = item;
    return (
        <View style={style.rowContainer}>
            <OurRecommendationItem name={name} description={description} offer={offer} screenName={screenName} />
            <View style={style.priceItemViewStyle}>
                <T2SText style={style.priceItemStyle} screenName={screenName} id={VIEW_ID.HOME_OUR_RECOMMENDATION_ITEM_PRICE + price}>
                    {price}
                </T2SText>
            </View>
            <View>
                <QuantityButton
                    item={item}
                    collectionType={item.collection}
                    deliveryType={item.delivery}
                    screenName={screenName}
                    fromHome={true}
                />
            </View>
        </View>
    );
}

export default OurRecommendations;
