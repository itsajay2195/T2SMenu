import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    textInputContainer: {
        marginHorizontal: 20
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.mildlightgrey
    },
    saveButtonTextStyle: {
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    },
    scrollViewStyle: {
        paddingBottom: 30
    },
    promotionsContainer: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20
    },
    promotionsHeader: {
        marginBottom: 10,
        marginTop: 10,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.lightOrange
    },
    promotionsRow: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    deleteButtonStyle: {
        backgroundColor: Colors.persianRed,
        marginBottom: 10
    },
    negativeButtonStyle: {
        marginBottom: 10
    },
    positiveButtonStyle: {
        marginBottom: 10
    },
    titleTextStyle: {
        marginHorizontal: 20,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center'
    },
    deleteTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.chipBlack
    },
    promotionsTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    optionsTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    advancedOptions: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.secondary_color
    },
    textInputStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        borderColor: 'transparent',
        textAlign: 'center',
        color: Colors.primaryTextColor
    },
    deleteTextInputStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        borderColor: 'transparent',
        textAlign: 'center',
        color: Colors.primaryTextColor,
        marginTop: -20
    },
    textInputViewStyle: {
        marginBottom: 20
    },
    switchStyle: {
        marginTop: -5,
        padding: 5
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
        alignItems: 'center'
    },
    optionsIconStyle: {
        marginTop: -1
    },
    deleteAccountStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 20
    },
    modelTitleStyle: {
        color: Colors.secondary_color,
        paddingBottom: 12,
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'center'
    },
    modalContentContainerStyle: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 8
    },
    modelDescriptionStyle: {
        color: Colors.black,
        fontSize: setFont(16),
        textAlign: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    bold: {
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: setFont(20)
    },
    otpInput: {
        marginBottom: 60
    },
    otpCellStyle: {
        borderColor: Colors.transparent,
        borderBottomColor: Colors.dark_grey,
        borderRadius: 0
    },
    tickIconStyle: {
        padding: 8
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        marginHorizontal: 5
    },
    prefixContainer: {
        top: 15,
        left: 15,
        right: 15,
        flex: 0.2,
        position: 'absolute'
    },
    phoneNumberFlexContainer: {
        flex: 0.8,
        left: 30
    },
    prefixContainerForModal: {
        left: 15,
        right: 15,
        flex: 0.2,
        position: 'absolute'
    },
    activityLoaderView: {
        right: 8
    },
    emailMargintopActive: {
        marginTop: 15
    },
    emailMargintopDeactive: {
        marginTop: 0
    }
});
