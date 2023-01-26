import React from 'react';
import { Animated } from 'react-native';
import style from './Styles/PreviousOrderComponentStyle';
import { VIEW_ID } from '../Utils/HomeConstants';
import QuantityButton from '../../MenuModule/View/Components/QuantityButton';
import OfferComponent from '../../MenuModule/View/Components/OfferComponent';
import AddonComponent from '../../MenuModule/View/Components/AddonComponent';
import { isItemAvailableForSelectedOrderType } from '../../MenuModule/Utils/MenuHelpers';

let screenNameOuterScope, isFromBestSellingOuterScope, selectedOrderTypeOuterScope, isFromMenuBestSellingOuterScope;
const PreviousOrderComponent = (props) => {
    const { screenName, previousOrderResponse, isNewMenuBestSelling, selectedOrderType = null, isFromBestSelling = false } = props;
    screenNameOuterScope = screenName;
    // previousOrderResponseOuterScope = previousOrderResponse;
    // currencyOuterScope = currency;
    selectedOrderTypeOuterScope = selectedOrderType;
    isFromBestSellingOuterScope = isFromBestSelling;
    isFromMenuBestSellingOuterScope = isNewMenuBestSelling;
    return (
        <Animated.View>
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={previousOrderResponse}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderListItem}
            />
        </Animated.View>
    );
};
function renderListItem({ item }) {
    const { name, price, offer } = item;
    const isItemAvailable = isFromBestSellingOuterScope
        ? isItemAvailableForSelectedOrderType(selectedOrderTypeOuterScope, item.collection, item.delivery)
        : true;
    return (
        isItemAvailable && (
            <Animated.View style={style.cardStyle}>
                <Animated.View style={style.containerStyle}>
                    <OfferComponent offer={offer} screenName={screenNameOuterScope} />
                    <Animated.Text
                        style={style.nameContentStyle}
                        screenName={screenNameOuterScope}
                        id={VIEW_ID.PREVIOUS_ORDER_ITEM_NAME}
                        numberOfLines={2}>
                        {name}
                    </Animated.Text>
                    <AddonComponent item={item} screenName={screenNameOuterScope} isFromBestSelling={isFromBestSellingOuterScope} />
                </Animated.View>
                {/*TODO: add currency  with price*/}
                <Animated.View style={style.bottomContainerStyle}>
                    <Animated.Text style={style.priceItemStyle} screenName={screenNameOuterScope} id={VIEW_ID.PREVIOUS_ORDER_ITEM_PRICE}>
                        {price}
                    </Animated.Text>
                    <Animated.View>
                        <QuantityButton
                            item={item}
                            collectionType={item.collection}
                            deliveryType={item.delivery}
                            screenName={screenNameOuterScope}
                            isFromPreviousOrder={true}
                            isNewMenuBestSelling={isFromMenuBestSellingOuterScope}
                        />
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        )
    );
}
export default PreviousOrderComponent;
