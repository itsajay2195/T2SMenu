import React from 'react';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { View } from 'react-native';
import { T2SSwipeList } from 't2sbasemodule/UI/CommonUI/T2SSwipeListView';
import CartItem from './CartItem';
import { T2SDivider } from 't2sbasemodule/UI';
import styles from '../Styles/BasketScreenStyles';
import { SCREEN_NAME } from '../../Utils/BasketConstants';
import { connect } from 'react-redux';
import { selectCurrencyFromStore } from 't2sbasemodule/Utils/AppSelectors';
import { selectBasketViewItems } from '../../Redux/BasketSelectors';

import RecommendationList from './RecommendationList';
const screenName = SCREEN_NAME.BASKET_LIST;
const BasketList = ({ cartItems, currency }) => {
    const renderItem = ({ item, index }) => {
        return <CartItem data={item} currency={currency} index={index} />;
    };
    if (isValidElement(cartItems)) {
        return (
            <View>
                <T2SSwipeList
                    keyboardShouldPersistTaps="handled"
                    data={cartItems}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <T2SDivider style={styles.paddingHorizontalStyle} />}
                    useFlatList
                    ListFooterComponent={<RecommendationList selectedScreenIds={'_' + screenName} isFromBasket={true} />}
                />
            </View>
        );
    }
    return null;
};

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromStore(state),
    cartItems: selectBasketViewItems(state)
});

export default connect(mapStateToProps, null)(React.memo(BasketList));
