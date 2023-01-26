import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const ReferralStyles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    childContainer: {
        flex: 1,
        padding: 14,
        flexDirection: 'column'
    },
    infoText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(18),
        marginVertical: 10,
        color: Colors.black,
        textAlign: 'center'
    },
    infoText1: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        color: Colors.black,
        textAlign: 'center'
    },
    childHeaderText: {
        marginTop: 20,
        paddingVertical: 10,
        color: Colors.black,
        fontFamily: FONT_FAMILY.BOLD,
        fontSize: setFont(18),
        fontWeight: 'bold'
    },
    copyView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    copyButton: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.primaryColor,
        marginHorizontal: 5,
        flex: 0.3,
        borderWidth: 1,
        borderRadius: 4,
        height: 45
    },
    copyButtonText: {
        color: Colors.white,
        fontFamily: FONT_FAMILY.BOLD,
        fontSize: setFont(20),
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    copyLinkTextView: {
        backgroundColor: Colors.white,
        borderColor: Colors.imageBorder,
        padding: 5,
        flex: 0.7,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 4,
        height: 45
    },
    copyLinkText: {
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16)
    },
    shareView: {
        marginTop: 10,
        flexDirection: 'column',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.imageBorder,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 4,
        width: 105,
        height: 105
    },
    shareIcon: {
        height: 35,
        width: 35,
        margin: 15
    },
    shareButtonText: {
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        fontWeight: 'normal'
    }
});
