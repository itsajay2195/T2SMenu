import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import styles from '../Styles/CartItemStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { boolValue, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import QuantityButton from '../../../MenuModule/View/Components/QuantityButton';
import { addOrRemoveItemToBasketAction, deleteItemAction } from '../../Redux/BasketAction';
import { connect } from 'react-redux';
import { ADD_BUTTON_CONSTANT } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import { isBOGOFItem, isBOGOHItem } from '../../Utils/BasketHelper';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { T2SCheckBox } from 't2sbasemodule/UI';
import T2STouchableWithoutFeedback from '../../../../T2SBaseModule/UI/CommonUI/T2STouchableWithoutFeedback';
import AddonsItem from './MicroComoponent/AddonsItem';

const CartItem = (props) => {
    const { name, addons, offer, bogoFree, id, totalPrice, quantity, second_language_name, free, coupon_allowed, isSelected } = props.data;
    const { currency, viewMode, isMissItems = false, onPress, addonOnPress } = props;

    return (
        <View accessible={false} style={styles.foodHubContainer}>
            {renderOfferItem(offer, bogoFree, viewMode, free, name)}
            <T2STouchableWithoutFeedback accessible={false} onPress={() => isMissItems && onPress()}>
                <View style={styles.nameContainer}>
                    {viewMode ? (
                        <T2SText
                            screenName={SCREEN_NAME.BASKET_SCREEN}
                            id={VIEW_ID.ITEM_QUANTITY}
                            style={[{ paddingRight: 8 }, isMissItems && styles.missingItemsText]}>
                            {`${quantity} x`}
                        </T2SText>
                    ) : null}
                    <View style={styles.nameContainerBox}>
                        <T2SText
                            style={[styles.foodHubNameStyle, isMissItems && styles.missingItemsText]}
                            screenName={SCREEN_NAME.BASKET_SCREEN}
                            id={isValidString(second_language_name) ? `${name} ${second_language_name}` : name + '_' + VIEW_ID.ITEM_NAME}>
                            {isValidString(second_language_name) ? `${name} ${second_language_name}` : name}
                        </T2SText>
                        {!viewMode && !boolValue(coupon_allowed) && <Text style={styles.asteriskTextStyle}>**</Text>}
                    </View>
                    {viewMode ? null : renderQuantityButton(props, bogoFree, id, free)}
                    {isMissItems ? (
                        <T2SCheckBox
                            unFillCheckBoxStyle={styles.checkboxUnFill}
                            id={VIEW_ID.ADD_ON_CHECKBOX}
                            status={isSelected}
                            onPress={() => onPress()}
                        />
                    ) : (
                        <T2SText
                            style={styles.foodHubTotalPriceStyle}
                            screenName={SCREEN_NAME.BASKET_SCREEN}
                            id={name + '_' + VIEW_ID.TOTAL_PRICE_ITEM}>
                            {`${totalPrice}`}
                        </T2SText>
                    )}
                </View>
            </T2STouchableWithoutFeedback>

            {renderAddOns(addons, currency, quantity, viewMode, isMissItems, addonOnPress, id)}
        </View>
    );
};
const renderAddOns = (addOns, currency, quantity, viewMode, isMissItems, addonOnPress, itemId) => {
    if (isValidElement(addOns) && addOns.length > 0) {
        return addOns.map((addOn) => {
            const { id, name, second_language_name, price, isSelected = false } = addOn;
            const handleAddonsCheckBox = useCallback(() => {
                if (isValidElement(addonOnPress)) {
                    isMissItems ? isMissItems && addonOnPress(addOn, itemId) : addonOnPress(addOn, itemId);
                }
            }, [addOn]);
            return (
                <AddonsItem
                    id={id}
                    key={id.toString()}
                    viewMode={viewMode}
                    onPress={handleAddonsCheckBox}
                    isMissItems={isMissItems}
                    addonOnPress={addonOnPress}
                    name={name}
                    second_language_name={second_language_name}
                    price={price}
                    isSelected={isSelected}
                    quantity={quantity}
                    itemId={itemId}
                    checkBoxOnPress={handleAddonsCheckBox}
                />
            );
        });
    }
};
const renderOfferItem = (offer, bogoFree, viewMode, giftFree, name) => {
    if (bogoFree) {
        return (
            <T2SView style={viewMode ? [styles.foodHubOfferContainerStyle, styles.viewModeStyle] : styles.foodHubOfferContainerStyle}>
                <T2SText
                    style={styles.offerStyle}
                    screenName={SCREEN_NAME.BASKET_SCREEN}
                    id={name + '_' + isBOGOFItem(offer) ? VIEW_ID.FREE : VIEW_ID.FIFTY_PERCENT_OFF}>
                    {isBOGOFItem(offer) ? LOCALIZATION_STRINGS.FREE : LOCALIZATION_STRINGS.APP_FIFTY_PERCENT_OFF}
                </T2SText>
            </T2SView>
        );
    } else if (isBOGOFItem(offer)) {
        return (
            <View style={styles.bogofContainer}>
                <T2SView style={viewMode ? [styles.offerContainerStyle, styles.viewModeStyle] : styles.offerContainerStyle}>
                    <T2SText style={styles.offerStyle} screenName={SCREEN_NAME.BASKET_SCREEN} id={name + '_' + VIEW_ID.BOGOF}>
                        {LOCALIZATION_STRINGS.BOGOF}
                    </T2SText>
                </T2SView>
                {!viewMode && <Text style={styles.asteriskTextStyle}>*</Text>}
            </View>
        );
    } else if (isBOGOHItem(offer)) {
        return (
            <View style={styles.bogofContainer}>
                <T2SView style={viewMode ? [styles.offerContainerStyle, styles.viewModeStyle] : styles.offerContainerStyle}>
                    <T2SText style={styles.offerStyle} screenName={SCREEN_NAME.BASKET_SCREEN} id={name + '_' + VIEW_ID.BOGOH}>
                        {LOCALIZATION_STRINGS.BOGOH}
                    </T2SText>
                </T2SView>
                {!viewMode && <Text style={styles.asteriskTextStyle}>*</Text>}
            </View>
        );
    } else if (giftFree) {
        return (
            <T2SView style={styles.offerContainerStyle}>
                <T2SText style={styles.offerStyle} screenName={SCREEN_NAME.BASKET_SCREEN} id={name + '_' + VIEW_ID.GIFT}>
                    {LOCALIZATION_STRINGS.GIFT}
                </T2SText>
            </T2SView>
        );
    }
};

const renderQuantityButton = (props, bogoFree, id, free) => {
    if (bogoFree || free) {
        return (
            <T2STouchableOpacity
                screenName={SCREEN_NAME.BASKET_SCREEN}
                id={VIEW_ID.FREE_ITEM}
                onPress={() => {
                    if (free) {
                        props.deleteItemAction(props.data);
                    } else {
                        props.addOrRemoveItemToBasketAction(id, 1, ADD_BUTTON_CONSTANT.MINUS, props.data, true);
                    }
                }}>
                <T2SText screenName={SCREEN_NAME.BASKET_SCREEN} id={VIEW_ID.FREE_ITEM} style={styles.removeStyle}>
                    {LOCALIZATION_STRINGS.REMOVE}
                </T2SText>
            </T2STouchableOpacity>
        );
    } else {
        return (
            <QuantityButton
                item={props.data}
                collectionType={props.data.collection}
                deliveryType={props.data.delivery}
                isFromBasketScreen={true}
                screenName={SCREEN_NAME.BASKET_SCREEN}
            />
        );
    }
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
    addOrRemoveItemToBasketAction,
    deleteItemAction
};
CartItem.defaultProps = {
    viewMode: false
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
