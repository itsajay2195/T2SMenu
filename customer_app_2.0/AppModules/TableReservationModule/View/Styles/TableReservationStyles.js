import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        marginTop: 10
    },

    keyboardView: { flexGrow: 1 },

    textInputView: {
        marginVertical: 10
    },

    selectDateTimeContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.ashColor
    },
    selectDateTimeErrorContainer: {
        borderBottomColor: Colors.white
    },
    calendarIconStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        color: Colors.textBlue
    },
    downArrowIconStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingVertical: 7,
        paddingHorizontal: 10
    },
    confirmButtonStyles: {
        color: Colors.textBlue,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        marginTop: 5
    },
    textInputContainerIconStyle: {
        justifyContent: 'center'
    },
    tickButtonStyle: {
        marginLeft: 5,
        marginBottom: 2,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    textInputStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        borderColor: 'transparent',
        textAlign: 'center',
        color: Colors.primaryTextColor
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        marginVertical: 10
    },
    prefixContainer: {
        left: 0,
        right: 0,
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
    }
});
