import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    closeContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    closeIcon: {
        color: Colors.white,
        padding: 5
    },
    quickCheckoutViewStyle: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    quickCheckoutContentViewStyle: {
        width: '100%',
        backgroundColor: Colors.white
    },
    questionTextStyle: {
        fontSize: setFont(20),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'center',
        width: '60%'
    },
    thanksTextStyle: {
        fontSize: setFont(20),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'center'
    },
    itemsTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightAsh,
        marginTop: 5,
        textAlign: 'center',
        width: '70%'
    },
    orderPlacedTextStyle: {
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightAsh,
        fontSize: setFont(13),
        marginBottom: -10
    },
    takeawayLogoStyle: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: Colors.imageBorder
    },
    messageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        padding: 15
    },
    logoContainer: {
        alignItems: 'center',
        padding: 20
    },
    detailsContainer: {
        alignItems: 'center'
    },
    ratingContainer: {
        height: '25%',
        alignItems: 'center'
    },
    questionsPaddingStyle: {
        padding: 20,
        paddingBottom: 10
    },
    ratingBottomStyle: {
        marginBottom: 10,
        height: '28%'
    },
    submitTextStyle: {
        width: '80%',
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(18),
        letterSpacing: 1
    },
    nextButtonContainer: {
        width: '90%',
        paddingVertical: 5,
        marginTop: 30,
        alignSelf: 'center',
        backgroundColor: Colors.suvaGrey
    }
});
