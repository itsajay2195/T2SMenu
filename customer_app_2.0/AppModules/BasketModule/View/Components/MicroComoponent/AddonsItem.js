import React from 'react';
import T2STouchableWithoutFeedback from 't2sbasemodule/UI/CommonUI/T2STouchableWithoutFeedback';
import { View } from 'react-native';
import styles from '../../Styles/CartItemStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { SCREEN_NAME, VIEW_ID } from '../../../Utils/BasketConstants';
import { isPriceZero, isValidString, safeFloatValue } from 't2sbasemodule/Utils/helpers';
import { T2SCheckBox } from 't2sbasemodule/UI';

const AddonsItem = ({ id, viewMode, onPress, name, second_language_name, isMissItems, isSelected, quantity, price, checkBoxOnPress }) => {
    return (
        <T2STouchableWithoutFeedback key={id} onPress={onPress}>
            <View key={id} style={viewMode ? [styles.addOnStyle, styles.viewModeStyle] : styles.addOnStyle}>
                <T2SText
                    screenName={SCREEN_NAME.BASKET_SCREEN}
                    id={name + '_' + VIEW_ID.ADD_ON_ITEM}
                    style={[styles.addOnTextStyle, isMissItems && styles.missingAddonText]}>
                    {isValidString(second_language_name) ? `${name} ${second_language_name}` : name}
                </T2SText>

                {isMissItems ? (
                    <T2SCheckBox
                        unFillCheckBoxStyle={styles.checkboxUnFill}
                        id={VIEW_ID.ADD_ON_CHECKBOX}
                        status={isSelected}
                        onPress={checkBoxOnPress}
                    />
                ) : isPriceZero(price) ? null : (
                    <T2SText screenName={SCREEN_NAME.BASKET_SCREEN} id={name + '_' + VIEW_ID.ADD_ON_PRICE} style={styles.addOnPriceStyle}>
                        {(quantity * safeFloatValue(price)).toFixed(2)}
                    </T2SText>
                )}
            </View>
        </T2STouchableWithoutFeedback>
    );
};
export default React.memo(AddonsItem, (prevProps, nextProps) => {
    return (
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.name === nextProps.name &&
        prevProps.id === nextProps.id &&
        prevProps.second_language_name === nextProps.second_language_name &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isMissItems === nextProps.isMissItems &&
        prevProps.quantity === nextProps.quantity &&
        prevProps.price === nextProps.price
    );
});
