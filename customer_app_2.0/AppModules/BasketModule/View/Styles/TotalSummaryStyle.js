import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootStyle: {
        flex: 1
    },
    priceSummaryContainer: {
        paddingVertical: 10
    },
    priceSummaryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 3,
        fontFamily: FONT_FAMILY.REGULAR
    },
    labelStyle: {
        color: Colors.secondaryTextColor,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12)
    },
    labelGreenStyle: {
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12)
    },
    paddingVerticalStyle: {
        paddingVertical: 10
    },
    totalStyle: {
        fontSize: setFont(17),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    subTotalStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    marginHorizontalStyle: {
        marginHorizontal: 16
    },
    paymentTypeTextStyle: {
        color: Colors.silver,
        fontSize: setFont(13),
        marginRight: 10,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    driverTips: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    closeIcon: {
        paddingLeft: 5
    }
});
