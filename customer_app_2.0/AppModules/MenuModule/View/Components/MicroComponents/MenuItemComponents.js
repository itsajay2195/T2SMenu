import { VIEW_ID } from '../../../Utils/MenuConstants';
import Styles from '../../Styles/MenuStyle';
import { T2SText } from 't2sbasemodule/UI';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import React, { useCallback } from 'react';
import { isValidString, isMoreZero } from 't2sbasemodule/Utils/helpers';
import { getName } from '../../../Utils/MenuHelpers';
import { getOfferText } from 'appmodules/BasketModule/Utils/BasketHelper';
import { View } from 'react-native';

export const MenuItemImage = React.memo(({ image, onPress, screenName, isFullView, id, isFromReOrderItem }) => {
    const onImagePress = useCallback(() => onPress(id, isFromReOrderItem), [id, isFromReOrderItem, onPress]);
    return (
        <T2STouchableOpacity style={Styles.imageContainer} onPress={onImagePress}>
            <T2SFastImage
                screenName={screenName}
                id={VIEW_ID.ITEM_IMAGE}
                source={{ uri: image }}
                style={isFullView ? Styles.fullImageStyle : Styles.imageStyle}
            />
        </T2STouchableOpacity>
    );
});

export const MenuItemName = React.memo(({ screenName, isWithImage, name, description, secondLanguage }) => {
    return (
        <T2SText
            id={VIEW_ID.ITEM + name}
            screenName={screenName}
            numberOfLines={isWithImage && isValidString(description) ? 1 : 0}
            style={[Styles.itemStyle, !isWithImage && Styles.itemMargin]}>
            {getName(name, secondLanguage)}
        </T2SText>
    );
});

export const MenuItemDescription = React.memo(({ screenName, isWithImage, description }) => {
    return (
        <T2SText
            id={VIEW_ID.ITEM + description}
            screenName={screenName}
            numberOfLines={isWithImage ? 2 : 0}
            style={Styles.descriptionStyle}>
            {description}
        </T2SText>
    );
});

export const MenuItemOffer = React.memo(({ offer, screenName }) => {
    return (
        <View style={Styles.offerContainer}>
            <T2SText id={VIEW_ID.ITEM + offer} screenName={screenName} style={Styles.offerStyle}>
                {getOfferText(offer)}
            </T2SText>
        </View>
    );
});

export const MenuItemPrice = React.memo(({ price, screenName }) => {
    return (
        <View style={Styles.priceContainer}>
            {isMoreZero(price) && (
                <T2SText id={VIEW_ID.ITEM + price} screenName={screenName} style={Styles.priceStyle}>
                    {price}
                </T2SText>
            )}
        </View>
    );
});
