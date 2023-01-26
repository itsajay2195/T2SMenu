import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    deleteButtonStyle: {
        backgroundColor: Colors.persianRed,
        height: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5
    },
    addressView: {
        flex: 1
    },
    addIconStyle: {
        paddingVertical: 10,
        paddingLeft: 8
    },
    rowBackGroundViewContainer: {
        paddingLeft: 5,
        flexDirection: 'row',
        shadowColor: Colors.shadowGrey,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 5,
        shadowOpacity: 0.2,
        backgroundColor: Colors.white,
        justifyContent: 'space-between'
    },
    rowContainerStyle: {
        height: 'auto'
    },
    textMarginStyle: {
        marginRight: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16)
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        flexWrap: 'wrap'
    },
    noAddressContentContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noInfoTextStyle: {
        textAlign: 'center',
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    },
    deleteView: {
        backgroundColor: Colors.persianRed,
        width: 100,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.white
    },
    DeliveryAddressMainView: {
        flex: 1
    },
    addressViewContainer: {
        flex: 1,
        marginVertical: 10
    },
    textPrimaryView: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: 10
    },
    textPrimaryStyle: {
        marginHorizontal: 8,
        marginVertical: 2,
        fontSize: 13,
        color: Colors.white,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textAlign: 'center'
    }
});
