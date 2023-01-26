import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    takeawayListContainerStyle: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: Colors.white
    },
    divider: {
        height: 5
    },
    newTakeawayLabel: {
        borderRadius: 2,
        paddingHorizontal: 4,
        paddingVertical: 1,
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'flex-start',
        backgroundColor: Colors.takeawayGreen
    },
    deliveryIconStyle: {
        paddingLeft: 5,
        paddingRight: 3
    },
    collectionIconStyle: {
        marginBottom: 1
    },
    imageStyle: {
        height: 90,
        width: 90,
        borderWidth: 1,
        borderColor: Colors.dividerGrey,
        borderRadius: 6
    },
    imageBackgroundStyle: {
        borderWidth: 1,
        borderColor: Colors.dividerGrey,
        borderRadius: 5,
        width: '100%',
        height: '100%'
    },
    takeawayDetailsContainerStyle: {
        flexDirection: 'column',
        flex: 1,
        marginStart: 5
    },
    takeawayTextStyle: {
        fontSize: setFont(16),
        color: Colors.primaryTextColor,
        flex: 1,
        width: '80%',
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: '600'
    },
    takeawayFontStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    cuisinesTextStyle: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.secondaryTextColor,
        flex: 1,
        fontWeight: '400'
    },
    cuisinesEmptyTextStyle: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.tabGrey,
        flex: 1,
        fontWeight: '400'
    },
    deliveryCharge: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    ratingStyle: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textGreyColor
    },
    milesStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    ratingText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        paddingHorizontal: 3,
        marginTop: 2
    },
    ratingViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ratingStyleText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        paddingHorizontal: 3,
        marginTop: 2,
        flex: 1
    },
    ratingOrderTAStyleText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        marginTop: 2
    },
    ratingTAStyleText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        marginTop: 2
    },
    ratingStyleDisabled: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.rating_grey
    },
    milesStyleDisabled: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.rating_grey
    },
    freeRatingStyle: {
        fontSize: setFont(12),
        paddingTop: 2,
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.freeOption
    },
    takeawayReviewViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%'
    },
    reviewContainerViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    milesContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '40%'
    },
    dotStyle: {
        height: 5,
        width: 5,
        borderRadius: 5,
        backgroundColor: Colors.mongoose,
        marginRight: 8,
        marginLeft: 15
    },
    deliveryTAViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    deliveryDetailsViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    collectionDeliveryView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    collectionTADeliveryView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    takeawayOrderTypeDetailsContainer: {
        flex: 1,
        paddingBottom: 3,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 3
    },
    orderTypeDetailsViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },
    verticalDivider: {
        height: 15,
        width: 1,
        backgroundColor: Colors.dividerGrey
    },
    leftContent: {
        flex: 4,
        justifyContent: 'flex-start',
        left: 6
    },
    centerContent: {
        flex: 4
    },
    onlineCloseMsgContainer: {
        flex: 8,
        paddingHorizontal: 5
    },
    rightContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderTypeTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.MEDIUM,
        marginLeft: 2
    },
    orderTimeTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        marginLeft: 2
    },
    heartIconStyle: {
        color: Colors.rating_color,
        paddingRight: 10
    },
    reviewViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    milesViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    openTakeawaysHeaderStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.secondary_color,
        padding: 10,
        top: 1,
        paddingLeft: 15,
        paddingBottom: 6,
        backgroundColor: Colors.white,
        letterSpacing: 1,
        fontWeight: '500'
    },
    closedTakeawaysHeaderStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: '700',
        color: Colors.black,
        paddingHorizontal: 10,
        paddingVertical: 10,
        paddingBottom: 4,
        backgroundColor: Colors.white,
        letterSpacing: 1
    },
    discountNameMainContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    nameContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    outerContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%'
    },
    innerContainer: {
        flexDirection: 'column',
        flex: 1
    },
    cuisinesContainer: {
        alignItems: 'flex-start',
        paddingVertical: 5
    },
    discountContainer: {
        position: 'absolute',
        right: 3,
        top: 0,
        backgroundColor: Colors.discountColor,
        borderTopStartRadius: 4,
        borderBottomLeftRadius: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginRight: -10,
        flexDirection: 'row'
    },
    discountTextStyle: {
        padding: 2,
        paddingLeft: 3,
        fontSize: setFont(13),
        textAlign: 'right',
        color: Colors.white,
        textAlignVertical: 'center',
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: 'bold'
    },
    uptoTextStyle: {
        padding: 2,
        fontSize: setFont(10),
        textAlign: 'right',
        color: Colors.white,
        textAlignVertical: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    closedMessageStyle: {
        fontSize: setFont(13),
        color: Colors.BittersweetRed,
        fontFamily: FONT_FAMILY.REGULAR
    },
    openingTimeTextStyle: {
        fontSize: setFont(13),
        color: Colors.BittersweetRed,
        fontFamily: FONT_FAMILY.REGULAR
    },
    takeawayListHeader: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.white
    },
    noFavouriteTextStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.secondary_color,
        paddingHorizontal: 10,
        top: 5,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        marginLeft: 5,
        letterSpacing: 1
    },
    activeStarStyle: {
        color: Colors.lightRatingYellow
    },
    inactiveStarStyle: {
        color: Colors.lightRatingGrey
    },
    newTakeawayText: {
        color: Colors.white,
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    dividerStyle: {
        backgroundColor: Colors.dividerGrey,
        width: 1,
        height: 10,
        justifyContent: 'center',
        marginHorizontal: 8
    },
    divideStyle: {
        height: 0.5,
        backgroundColor: Colors.dividerGrey,
        marginHorizontal: 10
    },
    currentlyClosedBackground: {
        backgroundColor: Colors.whiteSmoke
    },
    closedTakeawayMarginTop: {
        paddingTop: 15,
        marginTop: 10
    },
    takeawayReviewStyle: {
        flexDirection: 'row'
    },
    deliveryIcon: {
        marginBottom: -2
    },
    taDeliveryDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    taDeliveryTimeStyle: {
        width: '50%',
        justifyContent: 'space-between'
    },
    auDeliveryTimeStyle: {
        width: '60%',
        justifyContent: 'space-between'
    },
    taDeliveryNonTimeStyle: {
        width: '100%',
        justifyContent: 'space-between'
    },
    taTimeStyle: {
        width: '50%'
    }
});
