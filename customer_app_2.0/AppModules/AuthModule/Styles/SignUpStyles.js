import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

let SCREEN_HEIGHT = Dimensions.get('window').height;

export const SignUpStyle = StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    mainContainer: {
        flex: 1
    },
    imageStyle: {
        height: 65,
        width: '60%',
        padding: 2
    },
    textInput: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.silver
    },
    textInputContainer: {
        margin: 10
    },
    textStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(17)
    },
    checkTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        paddingHorizontal: 5
    },
    checkBoxView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 10,
        paddingLeft: 5
    },
    privacyPolicyView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
        marginStart: 5,
        top: SCREEN_HEIGHT / 133
    },
    textStylePrivacyPolicy: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(13),
        flexWrap: 'wrap'
    },
    textStylePrivacyPolicyTerms: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(13),
        color: Colors.blue,
        flexWrap: 'wrap'
    },
    privacyPolicyMainView: {
        marginLeft: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingLeft: 5
    },
    promotionsText: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR
    },
    promotionTextView: {
        marginLeft: 10,
        paddingVertical: 10
    },
    signUpButtonView: {
        borderRadius: 6,
        marginHorizontal: 10,
        marginTop: -2
    },
    signUpButtonText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.white
    },
    loginButtonView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 10,
        paddingVertical: 20
    },
    loginButton: {
        color: Colors.blue,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR
    },
    loginButtonText: {
        marginStart: 5,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR
    },
    promotionTextWrapView: {
        flex: 1,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    commonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    eyeIconViewStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingTop: 10
    },
    signUpTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    signUpContainer: {
        width: '90%',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    nextTextStyle: {
        width: '80%',
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        letterSpacing: 1
    },
    nextButtonContainer: {
        width: '100%',
        paddingVertical: 2,
        marginTop: 30,
        backgroundColor: Colors.primaryColor
    }
});
