import { Dimensions, StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';
import { menuMargin } from '../../../MenuModule/View/Styles/MenuList';

const bottomBarHeight = 58;
export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'center',
        height: '100%'
    },
    itemTextStyle: {
        paddingHorizontal: 10,
        color: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR
    },
    totalTextStyle: {
        paddingHorizontal: 10,
        color: Colors.white,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR
    },
    ViewCartTextStyle: {
        color: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 2.5
    },
    priceLoadingStyle: {
        padding: 3
    },
    viewCardTouchableArea: {
        top: 30,
        bottom: 30,
        left: 80,
        right: 60
    },
    bottomBarContainer: {
        position: 'absolute',
        bottom: 0
    },
    bottomBarStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    bottomBarSideStyle: {
        width: menuMargin - 10,
        backgroundColor: Colors.bottomBar,
        height: bottomBarHeight
    },
    imageStyle: {
        flex: 1,
        height: bottomBarHeight
    }
});
