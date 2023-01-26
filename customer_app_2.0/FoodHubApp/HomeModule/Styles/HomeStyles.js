import { Dimensions, StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { customerAppTheme } from '../../../CustomerApp/Theme';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    cardContainer: {
        marginVertical: 16,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 4,
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        width: '22%',
        elevation: 4,
        alignItems: 'center'
    },
    cardViewStyle: {
        alignItems: 'center'
    },
    imageStyle: {
        width: 65,
        height: 65,
        borderRadius: 2
    },
    ratingText: {
        marginTop: 7,
        paddingRight: 2,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    rowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35
    },
    noRowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35
    },
    searchBarView: {
        flexDirection: 'row',
        borderRadius: 6,
        height: 54,
        borderWidth: 1,
        borderColor: Colors.silver,
        backgroundColor: Colors.white,
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        paddingStart: 8,
        paddingEnd: 4,
        paddingVertical: 4
    },
    iconSpaceStyle: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    loaderSpaceStyle: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingRight: 17
    },
    searchIconStyle: {
        padding: 5
    },
    gpsIconStyle: {
        marginHorizontal: 0,
        padding: 5
    },
    inputStyle: {
        height: 46,
        backgroundColor: 'transparent',
        flex: 1,
        marginStart: 4,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor
    },
    findTextStyle: {
        color: Colors.white,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(13)
    },
    findButtonStyle: {
        backgroundColor: Colors.secondary_color,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderColor: Colors.secondary_color,
        paddingHorizontal: 1,
        width: 85,
        borderWidth: 1,
        borderRadius: 4
    },
    findFullButtonStyle: {
        backgroundColor: Colors.secondary_color,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.secondary_color,
        borderWidth: 1,
        borderRadius: 6,
        margin: 20,
        marginTop: 0,
        flexDirection: 'row'
    },
    cardIconStyle: {
        marginTop: 2,
        padding: 2
    },
    cardNameStyle: {
        fontSize: setFont(17),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    reviewsTextStyle: {
        marginTop: 7,
        fontSize: setFont(12),
        color: Colors.suvaGrey
    },
    noreviewsTextStyle: {
        marginTop: 7,
        fontSize: setFont(12),
        color: Colors.suvaGrey,
        marginLeft: -20,
        padding: 5
    },
    stepNoText: {
        marginTop: 5,
        color: Colors.secondary_color,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    cardIcon: {
        padding: 5
    },
    cardTitle: {
        fontSize: setFont(14),
        marginTop: 5,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    recentTakeawayText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        color: Colors.secondary_color,
        margin: 5,
        letterSpacing: 1
    },
    recentOrdersStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        color: Colors.secondary_color,
        marginLeft: 5,
        marginBottom: 10,
        letterSpacing: 1,
        alignSelf: 'center'
    },
    viewAllTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(14),
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 4
    },
    recentOrderRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 5
    },
    enjoyFoodView: {
        marginTop: 20
    },
    enjoyFoodTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        marginHorizontal: 16,
        color: Colors.secondary_color
    },
    recentTakeawayCard: {
        marginHorizontal: 5,
        marginBottom: 30,
        marginTop: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 4,
        width: 135,
        elevation: 8,
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.3,
        alignItems: 'center'
    },
    recentTakeawayImageContainer: {
        width: 85,
        height: 85,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.dividerGrey
    },
    orderStatusContainer: {
        flexDirection: 'column',
        borderRadius: 4,
        marginVertical: 20,
        marginHorizontal: 10,
        elevation: 8,
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        backgroundColor: customerAppTheme.colors.background
    },
    deliveryPriceTextColor: {
        fontFamily: FONT_FAMILY.REGULAR,
        paddingVertical: 5,
        color: Colors.black,
        alignSelf: 'center',
        fontSize: setFont(14),
        fontWeight: 'bold',
        marginRight: 5
    },
    deliveryTextColor: {
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: Colors.secondaryTextColor,
        alignSelf: 'center',
        fontSize: setFont(16)
    },
    orderStatusTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    deliveryTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    timerIconStyle: {
        alignSelf: 'center',
        margin: -3,
        color: Colors.secondaryTextColor
    },
    orderStatusTitleTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingHorizontal: 10,
        fontSize: setFont(16),
        fontWeight: 'bold',
        marginLeft: 10
    },
    orderStatusTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    baseMarginViewStyle: {
        marginHorizontal: 10
    },
    marginTop: {
        marginTop: 12
    },
    viewAllButtonStyle: {
        alignItems: 'flex-end'
    },
    storeNameAndTimerViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    storeNameTextStyle: {
        flex: 0.75,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.black
    },
    timerViewStyle: {
        flex: 0.25,
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        textAlign: 'right',
        marginEnd: -5
    },
    itemTotalViewStyle: {
        alignSelf: 'flex-end'
    },
    itemTotalTextStyle: {
        color: Colors.silver,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR
    },
    recentReOrderContainerStyle: {
        flex: 1,
        paddingVertical: 10
    },
    recentReOrderMainRowViewStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    takeawayImageBorderStyle: {
        borderColor: Colors.lighterGrey,
        borderWidth: 1,
        borderRadius: 5,
        padding: 5
    },
    takeawayImageStyle: {
        height: 70,
        width: 70
    },
    reOrderContentViewStyle: {
        flex: 1,
        marginLeft: 10
    },
    takeAwayNameAndTimerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    takeawayNameTextStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.black,
        flex: 0.95
    },
    dayTextStyle: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.suvaGrey,
        top: 1
    },
    summaryItemTextStyle: {
        flex: 0.5,
        fontSize: setFont(13),
        marginTop: 4,
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.suvaGrey
    },
    reOrderBottomViewStyle: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    orderTypeViewStyle: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 0.9,
        marginBottom: 6
    },
    orderTypeReOrderViewStyle: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    deliveryViewStyle: {
        bottom: 1,
        justifyContent: 'flex-end'
    },
    orderTypeTextStyle: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightBlue,
        bottom: 2,
        flex: 1,
        marginStart: 4
    },
    orderTypeSpanishTextStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightBlue,
        bottom: 4,
        flex: 1,
        marginStart: 4
    },
    reOrderItemTotalTextStyle: {
        marginRight: 8,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        alignSelf: 'center'
    },
    reOrderViewStyle: {
        justifyContent: 'flex-start',
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 3
    },
    reOrderTextStyle: {
        color: Colors.white,
        letterSpacing: 0.5,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.SEMI_BOLD
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
    absoluteStyle: {
        flexDirection: 'column',
        display: 'flex',
        zIndex: 1,
        position: 'absolute',
        left: 0,
        right: 0
    },
    countStyle: {
        width: 15,
        height: 15,
        textAlign: 'center',
        fontSize: setFont(10),
        backgroundColor: Colors.secondary_color,
        fontFamily: FONT_FAMILY.MEDIUM,
        padding: 2,
        color: Colors.white,
        borderRadius: 15 / 2,
        position: 'absolute',
        right: 13,
        top: 8,
        overflow: 'hidden',
        zIndex: 5
    },
    cancelledOrderTextView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    orderStatusTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.freeOption,
        fontSize: setFont(10),
        textAlign: 'right',
        paddingRight: 2
    },
    cardStyle: {
        padding: 10
    },
    sizeBoxStyle: { backgroundColor: Colors.dividerGrey },
    headerView: {
        marginTop: -48,
        height: Dimensions.get('window').height * 0.1
    }
});
