import T2STouchableRipple from 't2sbasemodule/UI/CommonUI/T2STouchableRipple';
import { SCREEN_NAME, VIEW_ID } from '../../../Utils/BasketConstants';
import styles from '../../Styles/BottomButtonStyles';
import { Text, View } from 'react-native';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import React, { useCallback } from 'react';
import { selectBasketLoader, selectItemMissingModal } from '../../../Redux/BasketSelectors';
import { connect } from 'react-redux';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const CheckOutButton = ({ checkoutClicked, basketLoader, orderTypeLoader, showMissingItemModal, isFromBasket = false }) => {
    const handleOnPress = useCallback(() => {
        if (!isFromBasket && !basketLoader) {
            checkoutClicked();
        } else if (isFromBasket) checkoutClicked();
    }, [basketLoader, checkoutClicked, isFromBasket]);

    const shouldDisableButton = () => {
        return basketLoader || (isValidElement(showMissingItemModal) && orderTypeLoader);
    };

    return (
        <T2STouchableRipple
            id={VIEW_ID.CHECKOUT_BUTTON}
            screenName={SCREEN_NAME.BASKET_SCREEN}
            style={[styles.rippleStyle, styles.checkoutStyle, { opacity: shouldDisableButton() ? 0.5 : 1 }]}
            disabled={shouldDisableButton()}
            onPress={handleOnPress}>
            <View style={styles.rippleContainer}>
                <Text style={[styles.textStyle, styles.checkoutTextStyle]}>{LOCALIZATION_STRINGS.CHECKOUT.toUpperCase()}</Text>
                <T2SIcon icon={FONT_ICON.BACK} color={Colors.white} size={25} style={styles.rightIconStyle} />
            </View>
        </T2STouchableRipple>
    );
};

const mapStateToProps = (state) => ({
    basketLoader: selectBasketLoader(state),
    orderTypeLoader: state.basketState.orderTypeLoader,
    showMissingItemModal: selectItemMissingModal(state)
});

export default connect(mapStateToProps)(React.memo(CheckOutButton));
