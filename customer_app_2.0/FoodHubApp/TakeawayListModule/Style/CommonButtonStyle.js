import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';

export const CommonButtonStyle = StyleSheet.create({
    buttonViewStyle: {
        backgroundColor: Colors.primaryColor,
        height: 50,
        borderRadius: 6,
        margin: 10,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextView: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white
    }
});
