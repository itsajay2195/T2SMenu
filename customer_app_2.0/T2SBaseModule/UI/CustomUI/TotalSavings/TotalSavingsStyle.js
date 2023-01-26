import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    totalSavingsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingVertical: 15
    },
    totalSavingsContainerFoodhub: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingBottom: 15
    },
    walletImagContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    walletImage: {
        width: 335,
        height: 126
    },
    walletImageFoodhub: {
        width: 285,
        height: 120
    },
    amountViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
    currencyBgView: {
        padding: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },

    currencyStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(18)
    },
    digitBgView: {
        padding: 5,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        marginLeft: 2
    },
    textStyle: {
        color: Colors.white,
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.REGULAR
    },
    foodhubTextStyle: {
        color: Colors.white,
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 10
    },
    dotStyle: {
        fontSize: setFont(18),
        marginHorizontal: 5,
        fontFamily: FONT_FAMILY.REGULAR
    },
    digitBgViewFoodHUb: {
        padding: 5,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2,
        borderRadius: 6
    }
});
