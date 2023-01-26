import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

const styles = StyleSheet.create({
    modalContentContainerStyle: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 8
    },
    modalHeaderStyle: {
        color: Colors.black,
        fontSize: setFont(18),
        paddingBottom: 12,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textAlign: 'center'
    },
    modalHeaderTitleCenter: {
        alignSelf: 'center'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 5
    },
    modalDescriptionStyle: {
        color: Colors.black,
        fontSize: setFont(14),
        marginBottom: 20,
        marginVertical: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center'
    },
    negativeButtonStyle: {
        flex: 1,
        borderColor: Colors.suvaGrey,
        borderWidth: 1
    },
    positiveButtonStyle: {
        flex: 1,
        backgroundColor: Colors.primaryColor
    },
    negativeButtonTextStyle: {
        color: Colors.textGreyColor,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1
    },
    buttonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        letterSpacing: 1
    },
    buttonSpaceStyle: {
        width: 20
    }
});

export default styles;
