import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const TabNavigatorStyle = StyleSheet.create({
    labelStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        letterSpacing: 1,
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 7
    },
    bottomBorderStyleSortBy: {
        borderBottomWidth: 3,
        marginLeft: '14%',
        width: 55,
        borderBottomColor: Colors.secondary_color
    },
    bottomBorderStyleSCuisines: {
        borderBottomWidth: 3,
        marginLeft: '11%',
        width: 75,
        borderBottomColor: Colors.secondary_color
    },
    tickIconStyle: {
        marginRight: 5
    },
    resetButtonStyle: {
        right: 10,
        color: Colors.blue,
        fontFamily: FONT_FAMILY.MEDIUM,
        letterSpacing: 0.5,
        fontSize: setFont(16)
    },
    headerStyle: {
        top: 15
    },
    resetIconStyle: {
        fontSize: setFont(15),
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM,
        textTransform: 'capitalize',
        marginLeft: 15,
        marginRight: 12,
        textAlign: 'right'
    },
    cancelIconStyle: {
        fontSize: setFont(15),
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM,
        textTransform: 'capitalize',
        marginLeft: 15,
        textAlign: 'right'
    },
    titleViewStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    titleTextStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black
    },
    sortLabelStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        marginLeft: 8,
        marginTop: 5,
        marginBottom: 5,
        textTransform: 'capitalize',
        flex: 1,
        color: Colors.black
    },
    sortTypeText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        margin: 5,
        color: Colors.tabGrey,
        textTransform: 'capitalize',
        fontWeight: 'bold'
    },
    optionsTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    optionsIconStyle: {
        marginVertical: 5,
        paddingRight: 5
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 25,
        marginBottom: 25,
        backgroundColor: Colors.transparent
    },
    submitRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 11,
        marginTop: 22,
        backgroundColor: Colors.transparent
    },
    cancelButtonText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.primaryColor
    },
    submitButtonText: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white
    },
    buttonContentStyle: {
        padding: 0,
        height: 30,
        flex: 1,
        width: '49%'
    },
    buttonStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 4,
        width: '49%'
    },
    buttonTextStyle: {
        fontSize: setFont(12),
        color: Colors.primaryColor
    }
});
