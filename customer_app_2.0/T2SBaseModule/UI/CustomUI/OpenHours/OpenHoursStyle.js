import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    openHoursContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'column',
        margin: 10,
        marginTop: 5,
        marginBottom: 20
    },
    openHoursRowContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.lighterGrey,
        borderBottomWidth: 1,
        borderLeftColor: Colors.lighterGrey,
        borderLeftWidth: 1
    },
    openHoursCellContainer: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingVertical: 5,
        borderRightColor: Colors.lighterGrey,
        borderRightWidth: 1
    },
    headerBorderStyle: {
        borderTopColor: Colors.lightGrey,
        borderTopWidth: 1
    },
    headerTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black,
        paddingVertical: 5
    },
    cellTextStyle: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor,
        paddingVertical: 5
    },
    closedTextStyle: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.secondary_color,
        paddingVertical: 5
    },
    closedCellBgColor: {
        backgroundColor: Colors.lightRed
    },
    amPmTextStyle: {
        fontSize: setFont(9),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    cellTodayTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.black,
        paddingVertical: 5,
        fontWeight: '500'
    },
    amPmTodayTextStyle: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.black
    },
    closedTodayTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.secondary_color,
        paddingVertical: 5
    }
});
