import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    textInputStyle: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    errorStyle: {
        fontFamily: FONT_FAMILY.REGULAR
    }
});
