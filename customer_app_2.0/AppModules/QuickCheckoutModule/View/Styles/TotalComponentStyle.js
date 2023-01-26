import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootStyle: {
        flex: 1
    },
    itemContainerStyle: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    itemStyle: {
        flex: 0.5,
        fontSize: setFont(16),
        color: customerAppTheme.colors.secondaryText,
        fontFamily: FONT_FAMILY.REGULAR,
        alignSelf: 'center'
    },
    valueStyle: {
        flex: 0.5,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        fontSize: setFont(16),
        textAlign: 'right',
        fontFamily: FONT_FAMILY.REGULAR
    },
    itemDividerStyle: {
        height: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: Colors.dividerGrey
    },
    grandTotalStyle: {
        flex: 0.5,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        fontSize: setFont(18),
        textAlign: 'left',
        fontFamily: FONT_FAMILY.MEDIUM
    },
    grandTotalValueStyle: {
        flex: 0.5,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        fontSize: setFont(18),
        textAlign: 'right',
        fontFamily: FONT_FAMILY.MEDIUM
    },
    priceSummaryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 4,
        fontFamily: FONT_FAMILY.REGULAR
    },
    labelStyle: {
        color: customerAppTheme.colors.secondaryText,
        fontFamily: FONT_FAMILY.REGULAR
    },
    labelGreenStyle: {
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.REGULAR
    },
    paddingVerticalStyle: {
        paddingVertical: 16
    },
    totalStyle: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.MEDIUM
    }
});
