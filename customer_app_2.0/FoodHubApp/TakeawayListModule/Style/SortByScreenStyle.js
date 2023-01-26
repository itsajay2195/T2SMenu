import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../T2SBaseModule/Utils/ResponsiveFont';

export const SortByStyles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.white,
        marginTop: 15
    },
    lastIndexContainer: {
        backgroundColor: Colors.white,
        marginHorizontal: 5,
        paddingVertical: 15
    },
    dividerStyle: {
        borderColor: Colors.dividerGrey,
        borderBottomWidth: 1,
        marginHorizontal: 10
    },
    topShadowContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        marginTop: 1
    },
    radioTextStyle: {
        marginLeft: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    dotStyle: {
        backgroundColor: Colors.primaryColor
    },
    radioButtonStyle: {
        borderWidth: 2,
        borderColor: Colors.primaryColor
    },
    radioButtonInActiveStyle: {
        borderWidth: 2,
        borderColor: Colors.tabGrey
    },
    detailedContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 30
    },
    filterTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    buttonViewStyle: {
        backgroundColor: Colors.primaryColor,
        height: 50,
        borderRadius: 6,
        margin: 10,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextView: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white
    },
    headerTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.black
    },
    emptyMenuContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 30
    },
    emptyMenuText: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.silver
    }
});
