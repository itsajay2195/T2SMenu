import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    sideMenuContainer: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center'
    },
    sideMenuViewStyle: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuItemTextStyle: {
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor,
        marginLeft: 10
    },
    menuSelectedTextStyle: {
        color: Colors.secondary_color,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    labelCount: {
        minWidth: 15,
        textAlign: 'center',
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        backgroundColor: Colors.notificationCountBgColor,
        paddingHorizontal: 4,
        paddingVertical: 2,
        marginBottom: 10,
        marginLeft: 5,
        color: Colors.white,
        borderRadius: 5,
        overflow: 'hidden'
    },
    iconStyle: {
        color: Colors.textGreyColor,
        marginLeft: 5
    },
    iconSelectedStyle: {
        color: Colors.secondary_color
    },
    verticalLine: {
        backgroundColor: 'transparent',
        width: 3,
        height: 25,
        alignSelf: 'center'
    },
    verticalLineSelected: {
        backgroundColor: Colors.secondary_color
    },
    trailingIconStyle: {
        paddingRight: 8
    },
    dividerContainerStyle: {
        height: 1,
        backgroundColor: Colors.gallery,
        marginHorizontal: 12,
        marginVertical: 10,
        marginTop: 16
    },
    flagStyle: {
        marginLeft: 5,
        height: 22,
        width: 22,
        alignSelf: 'center'
    },
    flagContainer: {
        paddingHorizontal: 1
    }
});
