import React from 'react';
import styles from '../../Styles/ViewCartButtonStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { View } from 'react-native';
import T2STouchableRipple from 't2sbasemodule/UI/CommonUI/T2STouchableRipple';

const CartButton = ({ buttonType, screenName, onPress }) => {
    return (
        <T2STouchableRipple hitSlop={styles.viewCardTouchableArea} onPress={onPress} id={VIEW_ID.VIEW_CART_BTN} screenName={screenName}>
            <View style={styles.rightContainer}>
                <T2SText style={styles.ViewCartTextStyle} id={VIEW_ID.VIEW_CART} screenName={screenName}>
                    {buttonType ? LOCALIZATION_STRINGS.CONTINUE.toUpperCase() : LOCALIZATION_STRINGS.BASKET.toUpperCase()}
                </T2SText>
                <T2SIcon icon={buttonType ? FONT_ICON.ARROW_RIGHT : FONT_ICON.CART} color={Colors.white} />
            </View>
        </T2STouchableRipple>
    );
};
export default React.memo(CartButton);
