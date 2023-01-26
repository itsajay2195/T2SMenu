import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    listStyle: {
        flex: 1,
        padding: 16
    },
    headerIconContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    commonLinkTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.lightBlue
    },
    headerIcon: {
        marginHorizontal: 5
    },
    foodHubListStyle: {
        flex: 1,
        paddingVertical: 16
    },

    bottomContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'flex-end'
    },
    priceSummaryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },

    cancelOrderView: { marginBottom: 20 },

    cancelOrderRow: {
        flexDirection: 'row',
        paddingLeft: 10
    },

    subTotalStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },

    backIconStyle: { marginRight: 10 },

    cancelledMessage: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        marginLeft: 46
    },

    cancelTextStyle: {
        color: Colors.mongoose,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(10),
        marginTop: 5
    },

    foodHubPriceSummaryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        paddingHorizontal: 16
    },

    totalLabelContainer: {
        flexDirection: 'row'
    },
    totalLabelStyle: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    totalPaymentStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        marginLeft: 5,
        marginTop: 3
    },

    foodHubTotalPaymentStyle: {
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.MEDIUM,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 4,
        color: Colors.tabGrey
    },

    totalValueStyle: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'right'
    },

    foodHubTotalValueStyle: {
        fontSize: setFont(16),
        color: Colors.chipBlack,
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'right'
    },

    modalTitleStyle: {
        color: Colors.persianRed,
        letterSpacing: 0.5
    },

    row: {
        flexDirection: 'row'
    },

    dividerLargeStyle: {
        borderTopWidth: 5,
        borderColor: Colors.dividerGrey
    },
    priceSummaryContainer: {
        marginVertical: 10
    },
    basketTextStyle: {
        color: Colors.secondary_color,
        fontSize: setFont(14),
        letterSpacing: 1,
        paddingLeft: 16,
        fontFamily: FONT_FAMILY.MEDIUM,
        marginVertical: 10
    },

    reorderButtonStyle: {
        fontSize: setFont(14),
        letterSpacing: 2,
        fontFamily: FONT_FAMILY.REGULAR
    },

    labelStyle: {
        color: customerAppTheme.colors.secondaryText,
        fontFamily: FONT_FAMILY.REGULAR
    },

    foodHubLabelStyle: {
        color: customerAppTheme.colors.secondaryText,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(13)
    },

    labelGreenStyle: {
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.REGULAR
    },

    foodHubLabelGreenStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR
    },

    preOrderText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(10),
        borderWidth: 0,
        borderRadius: 4,
        borderColor: Colors.white,
        overflow: 'hidden',
        backgroundColor: Colors.lightBlue,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.white,
        paddingTop: 1,
        marginLeft: 16,
        paddingBottom: 1,
        paddingLeft: 5,
        paddingRight: 5,
        marginHorizontal: 4,
        letterSpacing: 0.8,
        marginBottom: 4
    },
    instructionContainerStyle: {
        marginTop: 15,
        marginHorizontal: 15
    },
    instructionTitleStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.mongoose
    },
    instructionDescriptionStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        marginVertical: 2
    },
    helpText: { color: Colors.textBlue, padding: 10 },
    ChatView: { height: 30, width: 30 },
    refundContainer: { margin: 10 },
    refundTextStyle: { fontSize: setFont(16), fontFamily: FONT_FAMILY.BOLD, fontWeight: 'bold' },
    refundMessageText: { fontSize: setFont(12), paddingVertical: 5, color: Colors.black },
    refundSubTextView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    refundSubText: { fontSize: setFont(13), paddingVertical: 5 },
    refundItemText: { fontSize: setFont(10), color: Colors.suvaGrey },
    refundDateText: { fontSize: setFont(10), color: Colors.tabGrey },
    refundItemsView: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    refundPriceText: { fontSize: setFont(14) },
    refundAmountView: { flex: 0.8 },
    refundInfoText: { fontSize: setFont(12), fontFamily: FONT_FAMILY.BOLD, fontWeight: '800', marginTop: 3 }
});
