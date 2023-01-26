import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootStyle: {
        flex: 1
    },
    timeDividerContainer: {
        flexDirection: 'row'
    },
    RadioButtonContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    immediateTextStyle: {
        fontSize: setFont(15),
        paddingHorizontal: 10,
        fontFamily: FONT_FAMILY.REGULAR
    },
    radioButtonStyle: {
        fontSize: setFont(16),
        paddingVertical: 10,
        fontFamily: FONT_FAMILY.REGULAR
    },
    dividerTextStyle: {
        fontSize: setFont(10),
        paddingHorizontal: 10,
        fontFamily: FONT_FAMILY.MEDIUM,
        alignSelf: 'center'
    },
    itemDividerStyle: {
        height: 1,
        flex: 0.5,
        alignSelf: 'center',
        backgroundColor: Colors.dividerGrey
    },
    timeContainer: {
        paddingVertical: 10,
        paddingHorizontal: 12
    }
});
