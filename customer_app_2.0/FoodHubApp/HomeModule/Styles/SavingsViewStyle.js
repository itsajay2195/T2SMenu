import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    totalSavingsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
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
    amountViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    currencyStyle: {
        padding: 5,
        color: Colors.primaryColor,
        fontSize: setFont(18),
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    digitBgView: {
        width: 24,
        paddingVertical: 6,
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

    dotStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(30),
        marginHorizontal: 5,
        fontFamily: FONT_FAMILY.REGULAR
    }
});
