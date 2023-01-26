import { StyleSheet, Platform } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';

export default StyleSheet.create({
    animatedViewContainer: {
        margin: 6,
        flexDirection: 'column'
    },
    orderDetailsMinimalHeadLayout: {
        padding: Platform.OS !== 'ios' ? 5 : 0,
        alignItems: 'center',
        flexDirection: 'row'
    },

    iconStyle: { marginRight: 10 },

    arrowStyle: { marginTop: 5 },

    foodHubCardStyle: {
        marginBottom: 10,
        backgroundColor: '#F8F5EE',
        borderBottomWidth: 0
    },

    orderDetailsMinimalLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardStyle: {
        marginBottom: 10
    },
    iconAndNameStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    collectionHeaderStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 8,
        backgroundColor: '#F8F5EE'
    },
    waitingViewStyle: {
        backgroundColor: Colors.persianRed,
        marginRight: 20,
        borderRadius: 4
    },
    waitingTextStyle: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        color: Colors.white,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    orderIDContainer: {
        padding: 8
    }
});
