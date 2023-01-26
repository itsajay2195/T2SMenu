import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import Colors from '../../../Themes/Colors';
import { setFont } from '../../../Utils/ResponsiveFont';

const timerComponentStyle = StyleSheet.create({
    timerTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingStart: 5,
        paddingEnd: 4,
        color: Colors.primaryColor,
        fontSize: setFont(14),
        letterSpacing: 2
    }
});
export default timerComponentStyle;
