import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const orderTypeSelectionStyle = StyleSheet.create({
    modalStyle: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 0,
        borderRadius: 15
    },
    modalView: {
        backgroundColor: Colors.white,
        width: '100%',
        padding: 10
    },
    closeIconContainer: {
        backgroundColor: 'transparent',
        height: 40,
        width: '100%',
        alignItems: 'flex-end',
        right: 5
    },
    closeIconStyle: {
        color: 'white',
        fontSize: setFont(25)
    },
    unAvailDeliveryHeaderText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginLeft: 5,
        color: Colors.black
    },
    locationFindViewUserLoggedIn: {
        marginVertical: 5,
        flexDirection: 'row'
    },
    locationTouchableView: {
        flex: 0.75,
        flexDirection: 'column',
        marginLeft: 5
    },
    locationText: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.lightOrange,
        marginTop: 2
    },
    currentLocationStyle: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.primaryTextColor,
        marginTop: 2
    },
    addEditTextContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 0.25,
        paddingVertical: 5,
        marginRight: 5
    },
    addEditTextStyle: {
        color: Colors.lightBlue,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingVertical: 10
    },
    addEditTextDisableStyle: {
        color: Colors.lightBlue,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingVertical: 10,
        opacity: 0.6
    },
    iconStyle: {
        alignSelf: 'center',
        marginStart: 2
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dividerGrey
    },

    addressFlatListView: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center'
    },
    addressText: {
        flex: 1,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        marginRight: 14
    },
    addressTextDisable: {
        flex: 1,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        opacity: 0.6,
        marginRight: 14
    },
    primaryTextContainer: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 3,
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    PrimaryTextView: {
        flex: 2,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    primaryText: {
        fontSize: setFont(12),
        color: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        marginHorizontal: 5,
        marginTop: 2,
        marginBottom: 2,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    primaryTextDisable: {
        fontSize: setFont(8),
        color: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        marginHorizontal: 5,
        marginTop: 2,
        marginBottom: 2,
        justifyContent: 'center',
        alignSelf: 'center',
        opacity: 0.6
    },
    noAddressText: {
        color: Colors.suvaGrey,
        alignSelf: 'center',
        padding: 20,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(13)
    },
    searchBarView: {
        borderRadius: 6,
        backgroundColor: Colors.whiteSmoke,
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        height: 40,
        marginBottom: 20
    },
    searchIconContainer: {
        position: 'absolute',
        right: 0,
        top: 5
    },
    textInputStyle: {
        paddingVertical: 10,
        width: 250
    },
    column_style: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 8,
        marginEnd: 8
    },
    addressMainContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    nonServiceablePostCode: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.persianRed,
        marginBottom: 5,
        marginStart: 35
    },
    nonServiceableAddress: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.persianRed,
        marginBottom: 5,
        marginStart: 35,
        marginTop: -10
    },
    radioButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    radioButtonText: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioButtonTextDisable: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        opacity: 0.6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addressListViewStyle: {
        minHeight: 60,
        maxHeight: 180
    }
});
