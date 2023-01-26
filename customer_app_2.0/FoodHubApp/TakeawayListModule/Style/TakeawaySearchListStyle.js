import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
import { TOOL_TIP_LENGTH_VALUE } from '../Utils/Constants';
const width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    mainContainer: { flex: 1, flexDirection: 'column' },
    headersBottomViewStyle: {
        borderTopColor: Colors.dividerGrey,
        borderTopWidth: 1
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    headerContentSearchBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerContentAlign: {
        left: -5
    },
    searchBarStyle: {
        marginHorizontal: 10,
        backgroundColor: Colors.grey,
        height: 40,
        flex: 1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerIconsContainer: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    searchTextStyle: {
        color: Colors.primaryTextColor,
        fontSize: setFont(14),
        flex: 1,
        paddingLeft: 8,
        marginVertical: 2,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingBottom: 0,
        paddingTop: 0,
        paddingRight: 2
    },
    searchIconStyle: {
        alignSelf: 'center',
        marginHorizontal: 2,
        paddingRight: 10
    },
    headerTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.black
    },
    postcodeHeaderView: {
        flex: 1
    },
    headerPostcodeText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.mongoose,
        fontSize: setFont(13)
    },
    changeLocationText: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightBlue,
        fontSize: setFont(12),
        paddingEnd: 12
    },
    heartIconOpacity: {
        marginLeft: 5
    },
    filterIconStyle: {
        marginLeft: 15
    },
    filterDotStyle: {
        height: 10,
        width: 10,
        borderRadius: 10,
        backgroundColor: Colors.secondary_color,
        position: 'absolute',
        paddingHorizontal: 1,
        paddingVertical: 1,
        top: 2,
        left: 20,
        right: 0
    },
    headerMainContainer: {
        flexDirection: 'column',
        elevation: 4
    },
    headerIconView: {},
    labelCount: {
        backgroundColor: Colors.secondary_color,
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.white,
        position: 'absolute',
        left: 15,
        bottom: 15,
        fontSize: setFont(8)
    },
    cuisinesCount: {
        backgroundColor: Colors.secondary_color,
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.white,
        position: 'absolute',
        left: 12,
        bottom: 15,
        fontSize: setFont(8)
    },
    headerHeight: {
        elevation: 0
    },
    rightIconStyle: {
        alignSelf: 'center',
        marginHorizontal: 2
    },
    postcodeTextStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.mongoose,
        fontSize: setFont(14),
        flex: 1,
        left: 12
    },
    takeawayCountHeader: {
        flex: 1,
        flexDirection: 'row'
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
    orderTypeTouchableStyle: {
        flex: 0.28,
        alignItems: 'center',
        paddingLeft: 10
    },
    orderTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    downArrowStyle: {
        paddingLeft: 2,
        paddingTop: 2
    },
    headerAppStyle: {
        fontSize: setFont(16),
        color: Colors.black
    },
    menuTextStyle: {
        paddingTop: 10,
        paddingBottom: 12,
        paddingLeft: 10,
        fontFamily: FONT_FAMILY.BOLD,
        color: Colors.black,
        fontSize: setFont(16),
        fontWeight: '700'
    },
    headerContentTop: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 5,
        justifyContent: 'space-between'
    },
    orderTypeTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.black
    },
    offerBannerList: {
        flexDirection: 'row',
        flex: 1,
        marginLeft: 9,
        marginVertical: 15
    },
    likeIconStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5
    },
    offerBannerItem: {
        padding: 15,
        marginLeft: 6,
        marginRight: 12,
        borderRadius: 6,
        flex: 1
    },
    offerTitleText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(18),
        color: Colors.white,
        fontWeight: '600'
    },
    customOfferText: {
        color: '#FFEA43'
    },
    seeMoreView: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    seeMoreText: {
        fontSize: setFont(13),
        color: Colors.black,
        fontFamily: FONT_FAMILY.MEDIUM,
        textTransform: 'capitalize',
        textAlign: 'center',
        fontWeight: '500',
        position: 'absolute',
        bottom: 0
    },
    seeMoreContainer: {
        marginTop: 15,
        marginRight: 20,
        backgroundColor: Colors.rating_grey,
        borderRadius: 6,
        height: 95,
        width: width * 0.24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderTypeView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 2,
        width: 143,
        borderRadius: 4
    },
    orderTypeSelectedText: {
        color: Colors.white,
        alignSelf: 'center',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    orderTypeUnSelectedText: {
        color: Colors.black,
        alignSelf: 'center',
        alignItems: 'center',
        fontSize: setFont(14),
        fontWeight: '600',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    orderTypeSelected: {
        flex: 0.5,
        backgroundColor: Colors.takeawayGreen,
        flexDirection: 'row',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    orderTypeNotSelected: {
        flexDirection: 'row',
        borderRadius: 4,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    toolTipText: { color: 'white', fontSize: setFont(12), padding: 5 },
    iconStyle: { left: -5 },
    toolTipView: { left: TOOL_TIP_LENGTH_VALUE.LEFT },
    tooTipArrow: { marginLeft: -20 }
});
