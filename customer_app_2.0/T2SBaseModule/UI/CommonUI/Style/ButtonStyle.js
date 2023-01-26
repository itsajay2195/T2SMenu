import { StyleSheet } from 'react-native';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    textStyle: {
        color: customerAppTheme.colors.primaryButtonTextColor,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR
    },
    textStyleBlack: {
        color: customerAppTheme.colors.text,
        fontSize: setFont(16)
    },
    contentStyle: {
        height: 48
    },
    outlineButtonStyle: {
        // borderColor: '#EEEEEE',
    },
    flatButtonTextStyle: {
        color: customerAppTheme.colors.link
    }
});
