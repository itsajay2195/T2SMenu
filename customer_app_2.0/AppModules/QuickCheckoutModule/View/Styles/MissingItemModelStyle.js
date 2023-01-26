import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    containerStyle: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 8,
        justifyContent: 'flex-end'
    },
    modelTitleStyle: {
        color: Colors.BittersweetRed,
        paddingBottom: 16,
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'center'
    },
    modelDescriptionStyle: {
        color: Colors.black,
        fontSize: setFont(14),
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    errorTextStyle: {
        color: Colors.secondary_color,
        fontSize: setFont(12),
        textAlign: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    otpInput: {
        marginBottom: 50
    },
    otpCellStyle: {
        borderColor: Colors.transparent,
        borderBottomColor: Colors.dark_grey,
        borderRadius: 0
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: setFont(20)
    },
    missingItemContainer: {
        marginTop: 10
    },
    missingItemTextStyle: {
        color: Colors.black,
        fontSize: setFont(12),
        marginTop: 3,
        paddingLeft: 10,
        fontFamily: FONT_FAMILY.REGULAR
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    buttonIconStyle: {
        fontSize: setFont(30),
        color: Colors.mediumGray
    },
    buttonTitle: {
        fontFamily: FONT_FAMILY.REGULAR
    },
    buttonTimer: {
        flex: 1,
        textAlign: 'right'
    },
    resendContainerViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    resendViewStyle: {
        flex: 0.5,
        alignItems: 'center'
    },
    dividerLineStyle: {
        width: 1,
        height: 20,
        backgroundColor: Colors.ashColor,
        marginHorizontal: 5
    },
    keyboardViewStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    containerParent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20
    },
    payBtnStyle: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        margin: 5
    },
    cancelBtnStyle: {
        flex: 1,
        backgroundColor: Colors.suvaGrey,
        margin: 5
    },
    btnTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    }
});
