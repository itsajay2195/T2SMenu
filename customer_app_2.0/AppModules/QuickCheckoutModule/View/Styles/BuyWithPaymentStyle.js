import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';

export const BuyWithPaymentStyle = StyleSheet.create({
    containerStyle: { flex: 3, flexDirection: 'row' },
    applePayIconStyle: {
        height: 18,
        width: 45
    },
    BuyWithText: {
        color: Colors.darkBlack
    },
    iconStyle: {
        height: 20,
        width: 50
    }
});
