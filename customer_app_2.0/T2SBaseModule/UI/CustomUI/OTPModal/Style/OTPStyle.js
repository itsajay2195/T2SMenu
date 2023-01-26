import { StyleSheet } from 'react-native';
import Colors from '../../../../Themes/Colors';
import { FONT_FAMILY } from '../../../../Utils/Constants';
import { setFont } from '../../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    containerStyle: {
        backgroundColor: Colors.white,
        padding: 20,
        paddingBottom: 10,
        borderRadius: 8,
        justifyContent: 'flex-end'
    },
    modelTitleStyle: {
        color: Colors.black,
        paddingBottom: 14,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'center'
    },
    modelDescriptionStyle: {
        color: Colors.black,
        fontSize: setFont(14),
        textAlign: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    errorTextStyle: {
        color: Colors.secondary_color,
        fontSize: setFont(12),
        textAlign: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    otpSpace: {
        flex: 13
    },
    otpInput: {
        marginHorizontal: 30,
        textAlign: 'center',
        color: Colors.black,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(20),
        borderBottomWidth: 1,
        borderBottomColor: Colors.textBlue,
        paddingHorizontal: 12,
        paddingBottom: 8,
        marginBottom: 6,
        letterSpacing: 3
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    buttonIconStyle: {
        fontSize: setFont(22),
        color: Colors.mediumGray
    },
    buttonTitle: {
        marginLeft: 4,
        fontFamily: FONT_FAMILY.REGULAR
    },
    buttonTimer: {
        flex: 1,
        textAlign: 'right'
    },
    resendContainerViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    resendViewStyle: {
        flex: 0.5,
        alignItems: 'center',
        paddingTop: 5,
        padding: 10
    },
    dividerLineStyle: {
        width: 1,
        height: 20,
        backgroundColor: Colors.ashColor,
        marginHorizontal: 16,
        marginTop: 5
    },
    keyboardViewStyle: {
        justifyContent: 'center'
    },
    containerParent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    verifyTextViesStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeIconStyle: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 12
    },
    padding15: {
        padding: 15
    },
    emptyErrorTextView: {
        height: 15
    }
});
