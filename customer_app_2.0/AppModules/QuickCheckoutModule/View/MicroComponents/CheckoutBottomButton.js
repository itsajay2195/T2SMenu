import { View } from 'react-native';
import styles from '../Styles/QuickCheckoutStyles';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import Colors from 't2sbasemodule/Themes/Colors';
import { PAYMENT_TYPE, SCREEN_NAME, VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import React, { useCallback } from 'react';
import { BuyWithPayComponent } from '../BuyWithGpayComponent';
import { isAndroid } from '../../../BaseModule/Helper';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const CheckoutBottomButton = ({ screenName, isSwipeDisable, showBuyWithButton, onBuyWithClicked, onCheckoutClicked, isExpressPay }) => {
    return (
        <View style={styles.bottomButtonsContainer}>
            {isValidElement(showBuyWithButton) && showBuyWithButton && (
                <BuyWithButton isSwipeDisable={isSwipeDisable} screenName={screenName} onBuyWithClicked={onBuyWithClicked} />
            )}
            <View style={styles.buttonView}>
                <T2STouchableOpacity
                    style={[
                        styles.checkoutButton,
                        {
                            opacity: isSwipeDisable ? 0.5 : 1,
                            backgroundColor: isExpressPay ? Colors.express_light : Colors.primaryColor
                        }
                    ]}
                    id={VIEW_ID.ASAP_TEXT}
                    disabled={isSwipeDisable}
                    onPress={onCheckoutClicked}>
                    <View style={styles.rippleContainer}>
                        <T2SText screenName={screenName} style={styles.checkoutButtonText} id={VIEW_ID.QC_PAY}>
                            {LOCALIZATION_STRINGS.CHECKOUT}
                        </T2SText>
                    </View>
                </T2STouchableOpacity>
            </View>
        </View>
    );
};

const BuyWithButton = React.memo(({ isSwipeDisable, screenName, onBuyWithClicked }) => {
    const paymentType = isAndroid() ? PAYMENT_TYPE.GOOGLE_PAY : PAYMENT_TYPE.APPLE_PAY;

    const onPressEvent = useCallback(() => {
        if (isValidElement(onBuyWithClicked)) {
            onBuyWithClicked(paymentType);
        }
    }, [onBuyWithClicked, paymentType]);

    return (
        <View style={styles.buttonView}>
            <T2STouchableOpacity
                screenName={screenName}
                style={[styles.applePayButton, { opacity: isSwipeDisable ? 0.5 : 1 }]}
                id={VIEW_ID.QC_APPLE_PAY}
                disabled={isSwipeDisable}
                onPress={onPressEvent}>
                <BuyWithPayComponent
                    isApplePay={paymentType === PAYMENT_TYPE.APPLE_PAY}
                    screenName={SCREEN_NAME.QUICK_CHECKOUT_SCREEN}
                    showWithImage={true}
                    alignmentStyle={styles.payButtonStyle}
                    textStyle={styles.applePayButtonText}
                />
            </T2STouchableOpacity>
        </View>
    );
});

export default React.memo(CheckoutBottomButton);
