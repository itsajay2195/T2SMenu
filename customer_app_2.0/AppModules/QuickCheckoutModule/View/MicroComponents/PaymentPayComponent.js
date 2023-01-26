import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import { View } from 'react-native';
import styles from '../Styles/CardComponentStyle';
import { RadioButton } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import { CHECKBOX_STATUS } from '../../../HomeModule/Utils/HomeConstants';
import { BuyWithPayComponent } from '../BuyWithGpayComponent';
import React, { useCallback } from 'react';

const PaymentPayComponent = ({
    screenName,
    isPayComponentSelected,
    itemClicked,
    isApplePay = false,
    paymentType,
    analytics,
    viewId,
    disabled
}) => {
    const onPressEvent = useCallback(() => {
        itemClicked(analytics, paymentType, null);
    }, [itemClicked, analytics, paymentType]);
    return (
        <T2STouchableOpacity screenName={screenName} id={viewId} activeOpacity={0.9} onPress={onPressEvent}>
            <View style={styles.rootContainer}>
                <RadioButton.Android
                    color={Colors.primaryColor}
                    style={styles.radioButtonStyle}
                    screenName={SCREEN_NAME.QUICK_CHECKOUT_DETAIL_SCREEN}
                    id={VIEW_ID.QC_APPLE_PAY_RADIO}
                    status={isPayComponentSelected ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                    disabled={disabled}
                    onPress={onPressEvent}
                />
                <BuyWithPayComponent screenName={SCREEN_NAME.QUICK_CHECKOUT_DETAIL_SCREEN} isApplePay={isApplePay} />
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(PaymentPayComponent);
