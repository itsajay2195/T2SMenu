import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    checkBoxTextStyle: {
        fontSize: setFont(16),
        color: Colors.carrotOrange,
        left: 4,
        fontFamily: FONT_FAMILY.REGULAR
    },
    container: {
        marginHorizontal: 16,
        backgroundColor: Colors.orangeBg,
        padding: 10,
        borderRadius: 6
    },
    contentStyle: {
        marginLeft: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    }
});
