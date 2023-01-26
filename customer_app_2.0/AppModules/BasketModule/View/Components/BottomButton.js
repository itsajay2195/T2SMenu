import React from 'react';

import { Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import styles from '../Styles/BottomButtonStyles';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import T2STouchableRipple from 't2sbasemodule/UI/CommonUI/T2STouchableRipple';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import Colors from 't2sbasemodule/Themes/Colors';
import CheckOutButton from './MicroComoponent/CheckOutButton';
const BottomButton = ({ checkoutClicked, addItemClicked }) => {
    return (
        <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
            <View style={styles.buttonHeightStyle}>
                <T2STouchableRipple
                    id={VIEW_ID.ADD_ITEM_BUTTON}
                    screenName={SCREEN_NAME.BASKET_SCREEN}
                    style={[styles.rippleStyle, styles.addItemStyle]}
                    onPress={addItemClicked}>
                    <View style={styles.rippleContainer}>
                        <T2SIcon icon={FONT_ICON.BACK} color={Colors.white} size={25} style={styles.leftIconStyle} />
                        <Text style={[styles.textStyle, styles.addItemTextStyle]}>{LOCALIZATION_STRINGS.ADD_ITEM.toUpperCase()}</Text>
                    </View>
                </T2STouchableRipple>
                <View style={styles.verticalDivider} />
                <CheckOutButton checkoutClicked={checkoutClicked} isFromBasket={true} />
            </View>
        </ScrollView>
    );
};

BottomButton.propTypes = {
    addItemClicked: PropTypes.func,
    checkoutClicked: PropTypes.func
};
export default React.memo(BottomButton);
