import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

let SCREEN_HEIGHT = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
//The widthOfSocialLogin button is 92% of screen width.
const socialLoginButtonFraction = 0.92;
const widthofView = width * socialLoginButtonFraction;

export const AuthStyle = StyleSheet.create({
    mainContainer: {
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: Colors.white
    },
    scrollView: {
        paddingTop: SCREEN_HEIGHT * 0.119
    },
    password: {
        paddingTop: SCREEN_HEIGHT * 0.018
    },
    buttonContainer: {
        alignItems: 'center',
        flex: 1
    },
    socialLoginButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    socialLoginButtonStyle: {
        width: '92%',
        height: 49,
        margin: 10,
        borderWidth: 1,
        borderColor: Colors.offGrey,
        borderRadius: 8
    },
    buttonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        width: '100%',
        textAlign: 'left'
    },
    createAccountButtonStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 0.5,
        alignSelf: 'center'
    },
    createAccount: {
        textAlign: 'center'
    },
    buttonIconStyle: {
        marginLeft: widthofView * 0.62,
        width: 20,
        height: 20
    },
    orViewStyle: {
        width: '80%',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 10
    },
    orTextStyle: {
        fontSize: setFont(12),
        margin: 10,
        alignItems: 'center',
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.mildYellow
    },
    orLineStyle: {
        height: 1,
        flex: 1,
        backgroundColor: Colors.dividerGrey
    },
    loginViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 30,
        bottom: 0
    },
    forgotPwdViewStyle: {
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 19
    },
    forgotPwdTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        marginEnd: 12.5
    },
    loginTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 8
    },
    alreadyTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.tabGrey,
        paddingVertical: 10
    },
    textInputViewStyle: {
        width: '92%',
        borderRadius: 6
    },
    formInputContainer: {
        marginHorizontal: 25,
        marginTop: 25,
        alignItems: 'center',
        flex: 1
    },
    emailInputContainer: {
        width: '100%',
        marginTop: 20
    },
    resendLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    didNotReceiveText: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.suvaGrey
    },
    resendButtonText: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textBlue,
        marginLeft: 5
    },
    tickIconViewStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingTop: 25
    },
    eyeIconViewStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingTop: 35
    },
    loadingViewStyle: {
        position: 'absolute',
        height: '120%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingWhiteViewStyle: {
        height: 70,
        width: 70,
        borderRadius: 10,
        backgroundColor: Colors.white,
        bottom: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityLoaderView: {
        right: 15
    },
    resendTextStyle: {
        marginTop: 8
    },
    phoneNumberContainer: {
        flexDirection: 'row'
    },
    prefixContainer: {
        top: 10,
        left: 10,
        right: 15,
        flex: 0.2,
        position: 'absolute'
    },
    phoneNumberFlexContainer: {
        flex: 0.8,
        left: 35
    },
    phoneNumberLongerDigitFlexContainer: {
        flex: 0.8,
        left: 40
    },
    moreInfoContentTextStyle: {
        color: Colors.black,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        width: '92%',
        margin: 10,
        paddingHorizontal: 10
    },
    moreInfoTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    foodHubLogoStyle: {
        height: 47,
        marginLeft: 7,
        marginBottom: 80
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
    },
    logoStyle: {
        height: 35,
        marginTop: 30
    }
});
