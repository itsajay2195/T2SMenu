import { StyleSheet, Dimensions, Platform } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { isFranchiseApp } from 't2sbasemodule/Utils/helpers';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const { height, width } = Dimensions.get('window');

const headerHeight = 0.45 * height;

export const menuMargin = width / 2 - 30;

export default StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    tabStyle: {
        paddingHorizontal: 12
    },
    backArrowContainer: {
        width: 75,
        height: 75
    },
    activeIndicatorStyle: {
        height: 3,
        backgroundColor: Colors.primaryColor,
        marginTop: 10,
        marginHorizontal: -6,
        borderRadius: 4
    },
    dividerStyle: {
        height: 5,
        backgroundColor: '#EEEEEE'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingEnd: 12,
        paddingTop: 12,
        position: 'absolute',
        left: 0,
        right: 0
    },
    lightBackIcon: {
        color: Colors.white,
        fontSize: setFont(25),
        padding: 12
    },
    lightSmallIcon: {
        color: Colors.white,
        fontSize: setFont(25),
        padding: 2,
        paddingHorizontal: 5
    },
    headerImage: {
        resizeMode: 'cover',
        width,
        height: headerHeight / 1.5,
        opacity: 0.7
    },
    defaultHeaderImage: {
        backgroundColor: Colors.secondary_color,
        resizeMode: 'cover',
        width,
        height: headerHeight / 1.5
    },
    largeHeaderSearchContainer: {
        width,
        marginTop: 20,
        marginVertical: 10,
        paddingHorizontal: 5,
        justifyContent: 'flex-end'
    },
    blackShade: {
        ...StyleSheet.absoluteFill,
        backgroundColor: Colors.shadowBlack
    },
    searchText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.tabGrey
    },
    searchBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5,
        marginHorizontal: 10,
        paddingRight: 5,
        borderColor: Colors.lighterGrey,
        borderBottomWidth: 1,
        opacity: 0.7
    },
    searchIcon: {
        fontSize: setFont(25),
        padding: 5,
        paddingHorizontal: 10,
        color: Colors.darkBlack
    },
    cardContainerStyle: {
        justifyContent: 'center',
        marginBottom: -5,
        backgroundColor: Colors.whiteSmoke,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.0,
        elevation: 1
    },
    backIcon: {
        fontSize: setFont(25),
        padding: 10
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    spaceStyle: {
        flex: 1
    },
    collapsedHeaderContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        overflow: 'hidden',
        paddingBottom: 4
    },
    shadowContainer: {
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 5,
        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.5,
        elevation: 7,
        width: '100%'
    },
    searchInputContainer: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 15
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
    headerStoreName: {
        flex: 1
    },
    headerBackButton: { marginRight: 10 },
    categoryTabContainer: { marginTop: 10 },
    emptyMenuContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    emptyMenuText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    deliveryDetailsViewStyle: {
        flexDirection: 'row',
        paddingTop: 3
    },
    deliveryCharge: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    freeRatingStyle: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.freeOption,
        paddingLeft: 2
    },
    ratingStyle: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor,
        marginTop: 4
    },
    minOrder: {
        fontSize: setFont(8),
        color: Colors.textGreyColor,
        fontFamily: FONT_FAMILY.REGULAR,
        marginLeft: 2,
        top: -3
    },
    categoryContainer: {
        marginHorizontal: 50,
        marginVertical: 130,
        flex: 1,
        justifyContent: 'flex-end'
    },
    floatingButtonBackgroundViewStyle: {
        backgroundColor: Colors.transparent,
        borderRadius: 50,
        zIndex: 1,
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        marginLeft: menuMargin
    },
    floatingButtonStyle: {
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 5,
        backgroundColor: Colors.black,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    floatingButtonIconStyle: {
        color: Colors.white
    },
    floatingButtonTextStyle: {
        fontSize: setFont(10),
        color: Colors.white,
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingTop: 3
    },
    headerIconBGView: {
        backgroundColor: Colors.white,
        borderRadius: 25,
        margin: 5
    },
    headerContainerView: { flexDirection: 'row' },
    orderTypeContainerView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 6,
        margin: 5,
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    infoIconView: {
        paddingVertical: 10
    },
    alignCenterStyle: { justifyContent: 'center', alignItems: 'center' },
    headerLogoImageStyle: {
        opacity: isFranchiseApp() ? 1 : 0.3,
        marginTop: isFranchiseApp() ? 40 : 30
    },
    menuListBottomPadding: {
        paddingBottom: 80
    }
});
