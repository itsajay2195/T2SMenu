import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';

export default StyleSheet.create({
    viewMenuButtonStyle: {
        flex: 1,
        marginHorizontal: 12,
        marginVertical: 8,
        backgroundColor: Colors.primaryColor
    },
    viewMenuTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 2.5
    },
    viewButtonContainer: { flexDirection: 'row' }
});
