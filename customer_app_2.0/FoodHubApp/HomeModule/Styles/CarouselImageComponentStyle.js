import { Dimensions, StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { carousalHeight } from '../Utils/HomeConstants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    paginationStyle: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        left: 0
    },
    dotStyle: {
        backgroundColor: Colors.dividerGrey,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 30,
        marginHorizontal: 5,
        alignSelf: 'flex-end'
    },
    activeDotStyle: {
        backgroundColor: Colors.tabGrey,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginBottom: 30,
        marginHorizontal: 5,
        alignSelf: 'flex-end'
    },
    imageParentView: {
        height: carousalHeight,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    slideImage: {
        width: width,
        height: carousalHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageTxt: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textAlign: 'center',
        color: Colors.black,
        paddingTop: (carousalHeight * 1.75) / 6,
        fontWeight: '500'
    },
    imageTxt1: {
        fontSize: setFont(20),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textAlign: 'center',
        color: Colors.black,
        fontWeight: '500'
    },
    walletImage: {
        height: 65,
        width: 170,
        alignSelf: 'center'
    },
    savingsTxt: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        color: Colors.black,
        marginTop: 20
    },
    totalSavingsContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginTop: 10
    },
    totalSavingsTextStyle: {
        color: Colors.white,
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.REGULAR
    },
    animatedStyle: {
        padding: 0,
        width: width,
        position: 'absolute'
    }
});
