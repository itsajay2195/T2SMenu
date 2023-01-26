import { SCREEN_NAME, VIEW_ID } from '../../../Utils/BasketConstants';
import { ADD_BUTTON_VIEW_ID } from 't2sbasemodule/UI/CustomUI/ItemAddButton/Utils/AddButtonConstant';
import { View } from 'react-native';
import styles from '../../Styles/FreeItemStyles';
import Styles from '../../../../MenuModule/View/Styles/MenuStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getName } from '../../../../MenuModule/Utils/MenuHelpers';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import { T2SDivider } from 't2sbasemodule/UI';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import React, { useCallback } from 'react';

const GiftItemsComponent = ({ itemId, itemName, itemSecondLanguageName, itemDescription, handleItemClicked }) => {
    const handleGiftItemClicked = useCallback(() => {
        handleItemClicked(itemId);
    }, [handleItemClicked, itemId]);
    return (
        <T2STouchableOpacity
            screenName={SCREEN_NAME.FREE_ITEM_LIST}
            id={ADD_BUTTON_VIEW_ID.ADD_BUTTON + '_' + itemId}
            onPress={handleGiftItemClicked}
            accessible={false}>
            <View style={styles.listContainerStyle}>
                <View style={Styles.itemContainer}>
                    <T2SView style={styles.itemNameContainer}>
                        <T2SText id={itemName + '_' + VIEW_ID.ITEM} screenName={SCREEN_NAME.FREE_ITEM_LIST} style={styles.itemStyle}>
                            {getName(itemName, itemSecondLanguageName)}
                        </T2SText>
                        {isValidString(itemDescription) && (
                            <T2SText
                                id={itemDescription + '_' + VIEW_ID.ITEM}
                                screenName={SCREEN_NAME.FREE_ITEM_LIST}
                                style={Styles.descriptionStyle}>
                                {itemDescription}
                            </T2SText>
                        )}
                    </T2SView>
                    <View style={styles.itemAddContainer}>
                        <T2SView style={styles.addButtonStyle}>
                            <T2SText
                                style={styles.addTextStyle}
                                screenName={SCREEN_NAME.FREE_ITEM_LIST}
                                id={itemName + '_' + VIEW_ID.ADD_BUTTON}>
                                {LOCALIZATION_STRINGS.ADD.toUpperCase()}
                            </T2SText>
                        </T2SView>
                    </View>
                </View>
                <T2SDivider style={styles.marginHorizontalStyle} />
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(GiftItemsComponent);
