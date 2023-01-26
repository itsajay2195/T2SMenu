import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    textContainer: {
        flex: 1,
        margin: 10
    },
    titleStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.secondary_color,
        fontSize: setFont(16),
        letterSpacing: 2
    },
    titleStyleFoodHub: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.secondary_color,
        fontSize: setFont(14),
        letterSpacing: 2,
        paddingTop: 10
    },
    contentStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor,
        fontSize: setFont(14)
    },
    bottomContentStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor,
        fontSize: setFont(12)
    },
    foodhubHeaderStyle: {
        top: 10,
        left: 10,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.primaryColor,
        letterSpacing: 1
    },
    foodHubSubHeaderText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(18),
        color: Colors.textGreyColor,
        alignSelf: 'center',
        paddingBottom: 25
    }
});
