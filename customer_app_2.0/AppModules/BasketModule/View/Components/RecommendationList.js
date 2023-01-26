import { connect } from 'react-redux';
import { View } from 'react-native';
import { T2SOutlineButton, T2SText } from 't2sbasemodule/UI';
import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import React from 'react';
import { selectBasketRecommendation, selectBasketRecommendationLoader } from '../../Redux/BasketSelectors';
import { addButtonTappedAction, recommendationAddedFromBasketAction } from '../../Redux/BasketAction';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import cartItemStyles from '../Styles/CartItemStyle';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import { isBOGOFItem, isBOGOHItem } from '../../Utils/BasketHelper';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import styles from '../Styles/RecommendationListStyle';
import BasketRecommendationShimmer from './BasketRecommendationShimmer';
import { debounce } from 'lodash';
import { makeHapticFeedback } from 't2sbasemodule/Utils/helpers';
import { HapticFrom } from 't2sbasemodule/Utils/Constants';
const RecommendationList = (props) => {
    const { recommendations, recommendationLoader, isOrderProcessing = false, selectedScreenIds } = props;
    if (recommendationLoader) {
        return <BasketRecommendationShimmer />;
    } else if (recommendations.length === 0) {
        return null;
    } else {
        return (
            <View style={recommendations.length === 1 ? [styles.containerStyle, { height: 90 }] : styles.containerStyle}>
                <T2SText
                    screenName={SCREEN_NAME.BASKET_SCREEN}
                    id={VIEW_ID.YOU_MAY_ALSO_LIKE_TEXT + '_' + selectedScreenIds}
                    style={styles.titleStyle}>
                    {LOCALIZATION_STRINGS.BASKET_RECOMMENDATION_TITLE}
                </T2SText>
                {recommendations.map((item, index) => {
                    const { name, price, offer, bogoFree } = item;
                    return (
                        <View key={index} style={styles.itemContainer}>
                            <View style={styles.nameContainer}>
                                {renderOfferItem(offer, bogoFree, name)}
                                <T2SText
                                    id={VIEW_ID.ADD_ON_ITEM_NAME + '_' + name + selectedScreenIds}
                                    screenName={SCREEN_NAME.BASKET_SCREEN}
                                    style={styles.nameStyle}>
                                    {name}
                                </T2SText>
                            </View>
                            <T2SOutlineButton
                                id={VIEW_ID.ADD_ITEM_BUTTON + '_' + index + selectedScreenIds}
                                screenName={SCREEN_NAME.BASKET_SCREEN}
                                style={styles.buttonStyle}
                                title={LOCALIZATION_STRINGS.ADD.toUpperCase()}
                                onPress={() => {
                                    if (!isOrderProcessing) {
                                        makeDebounceAction(props, item);
                                    }
                                }}
                                buttonTextStyle={styles.buttonTextStyle}
                                contentStyle={styles.buttonContentStyle}
                            />
                            <T2SText
                                id={VIEW_ID.ADD_ON_ITEM_PRICE + '-' + price + selectedScreenIds}
                                screenName={SCREEN_NAME.BASKET_SCREEN}
                                style={styles.priceTextStyle}>
                                {price}
                            </T2SText>
                        </View>
                    );
                })}
            </View>
        );
    }
};
const renderOfferItem = (offer, bogoFree, name) => {
    if (bogoFree) {
        return <BOGOFree name={name} offer={offer} />;
    } else if (isBOGOFItem(offer)) {
        return <BOGOFItem name={name} />;
    } else if (isBOGOHItem(offer)) {
        return <BOGOHItem />;
    } else {
        return null;
    }
};
const BOGOFree = React.memo(({ name, offer }) => {
    return (
        <T2SView style={cartItemStyles.foodHubOfferContainerStyle}>
            <T2SText
                style={cartItemStyles.offerStyle}
                screenName={SCREEN_NAME.BASKET_SCREEN}
                id={name + '_' + isBOGOFItem(offer) ? VIEW_ID.FREE : VIEW_ID.FIFTY_PERCENT_OFF}>
                {isBOGOFItem(offer) ? LOCALIZATION_STRINGS.FREE : LOCALIZATION_STRINGS.APP_FIFTY_PERCENT_OFF}
            </T2SText>
        </T2SView>
    );
});
const BOGOFItem = React.memo(({ name }) => {
    return (
        <View style={cartItemStyles.bogofContainer}>
            <T2SView style={cartItemStyles.offerContainerStyle}>
                <T2SText style={cartItemStyles.offerStyle} screenName={SCREEN_NAME.BASKET_SCREEN} id={name + '_' + VIEW_ID.BOGOF}>
                    {LOCALIZATION_STRINGS.BOGOF}
                </T2SText>
            </T2SView>
        </View>
    );
});

const BOGOHItem = React.memo(({ name }) => {
    return (
        <View style={cartItemStyles.bogofContainer}>
            <T2SView style={cartItemStyles.offerContainerStyle}>
                <T2SText style={cartItemStyles.offerStyle} screenName={SCREEN_NAME.BASKET_SCREEN} id={name + '_' + VIEW_ID.BOGOH}>
                    {LOCALIZATION_STRINGS.BOGOH}
                </T2SText>
            </T2SView>
        </View>
    );
});

const makeDebounceAction = debounce(
    (props, item) => {
        const { id } = item;
        if (props.isFromBasket) {
            props.recommendationAddedFromBasketAction(true);
        }
        props.addButtonTappedAction(id, item, 1, ADD_BUTTON_CONSTANT.ADD, false, false, false, true);
        makeHapticFeedback(props.featureGateResponse, HapticFrom.ITEM_ADDED);
    },
    450,
    { leading: true, trailing: false }
);
const mapStateToProps = (state) => ({
    recommendations: selectBasketRecommendation(state),
    recommendationLoader: selectBasketRecommendationLoader(state),
    featureGateResponse: state.appState.countryBaseFeatureGateResponse
});
const mapDispatchToProps = {
    addButtonTappedAction,
    recommendationAddedFromBasketAction
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(RecommendationList));
