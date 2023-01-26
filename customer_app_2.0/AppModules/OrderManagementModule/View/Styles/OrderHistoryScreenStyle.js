import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    sectionHeaderStyle: {
        backgroundColor: Colors.mildlightgrey,
        fontSize: setFont(14),
        padding: 12,
        paddingVertical: 16,
        color: Colors.secondary_color,
        fontFamily: FONT_FAMILY.MEDIUM,
        letterSpacing: 1
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.mildlightgrey
    },
    pendingOrderListItemStyle: {
        backgroundColor: Colors.suluGreen,
        marginBottom: 7,
        padding: 10
    },
    previousOrderListItemStyle: {
        backgroundColor: Colors.white,
        marginBottom: 7,
        padding: 10
    },
    orderListViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    orderTimeViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    buttonViewStyle: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    orderDetailsTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textBlue,
        fontSize: setFont(13)
    },
    orderTypeViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dividerLineStyle: {
        width: 1,
        height: 20,
        backgroundColor: Colors.ashColor,
        marginHorizontal: 15
    },
    orderTypeTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.textGreyColor,
        fontSize: setFont(14)
    },
    orderTypeFoodhubTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        fontSize: setFont(10),
        marginHorizontal: 2
    },
    orderTypeFoodhubBluredTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.tabGrey,
        fontSize: setFont(10),
        marginHorizontal: 2
    },
    dataAndTimeTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.primaryTextColor,
        fontSize: setFont(12)
    },
    totalSavingsViewStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: Colors.white
    },
    totalSavingsFoodhubViewStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: Colors.grey
    },
    totalSavingsTextStyle: {
        fontSize: setFont(16),
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    totalSavingsFoodhubTextStyle: {
        fontSize: setFont(14),
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    totalSavingsCurrencyTextStyle: {
        color: Colors.white,
        fontSize: setFont(16),
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    totalSavingsCurrencyViewStyle: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.secondary_color,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    totalSavingsCurrencyFoodhubViewStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderHeaderBackGroundStyle: {
        backgroundColor: Colors.dividerGrey
    },
    feedbackViewStyle: {
        flexDirection: 'row',
        height: 40,
        width: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: -10
    },

    feedbackStyle: {
        marginRight: 12
    },
    messageContainer: {
        flex: 1
    },
    messageView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10
    },
    errorMessageText: {
        fontSize: setFont(16),
        marginVertical: 10,
        color: Colors.suvaGrey
    },
    deliveryAddressContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0.9
    },
    addressTextStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        color: Colors.primaryTextColor
    },
    discountPriceTagViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: Colors.lightYellow,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 2,
        marginRight: -10
    },
    discountPriceTagTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.primaryColor,
        fontSize: setFont(12),
        padding: 4
    },
    orderStatusTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.freeOption,
        fontSize: setFont(10),
        textAlign: 'right',
        paddingRight: 2
    },
    cancelledOrderTextView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    leftButtonViewStyle: {
        flexDirection: 'row',
        flex: 0.35
    },
    rightButtonViewStyle: {
        flexDirection: 'row',
        flex: 1
    },
    leftButtonContainerStyle: {
        flexDirection: 'row',
        flex: 0.7
    },
    imageBackgroundStyle: { width: '100%', height: '100%', overflow: 'hidden' },
    imageStyle: {
        height: 90,
        width: 94,
        borderWidth: 1,
        borderColor: Colors.dividerGrey,
        borderRadius: 5,
        overflow: 'hidden'
    },
    logoImageContainer: {
        width: 94,
        height: 90,
        marginRight: 10,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    takeawayNameStyle: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.black
    },
    textStyle: {
        flex: 1,
        color: Colors.black,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    dividerLineFoodhubStyle: {
        width: 1,
        height: 15,
        marginHorizontal: 8
    },
    currencyTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.textGreyColor,
        fontSize: setFont(14),
        marginStart: 20
    },
    currencyFoodhubTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        marginStart: 5,
        marginEnd: 12
    },
    bluredDividerLineFoodhubStyle: {
        width: 1,
        height: 15,
        marginHorizontal: 8
    },
    tickIconStyle: {
        marginHorizontal: -3
    }
});
