import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const walletStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    transactionsMainContainer: {
        flex: 0.9
    },
    transactionHeaderText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        color: Colors.secondary_color,
        letterSpacing: 2,
        marginTop: 10,
        marginBottom: 10,
        marginStart: 16
    },
    noTransactionsText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        padding: 13,
        color: Colors.tabGrey,
        alignSelf: 'center'
    },
    detailsHeaderText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        letterSpacing: 2,
        color: Colors.secondary_color,
        paddingTop: 20
    },
    infoTextStyle: {
        paddingTop: 20,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    },
    rowBackGroundViewContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dividerGrey
    },
    transactionNameView: {
        flex: 0.75
    },
    transactionAmountView: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    transactionNameText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    transactionTimeText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        paddingVertical: 5,
        color: Colors.tabGrey
    },
    amountTextAdded: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryColor,
        letterSpacing: 0.5
    },
    amountText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.secondary_color,
        letterSpacing: 0.5
    },
    backgroundImageView: {
        height: 140,
        margin: 15
    },
    backgroundImage: {
        borderRadius: 4
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginStart: 15,
        marginTop: 15
    },
    balanceTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white,
        fontSize: setFont(14)
    },

    row: {
        flexDirection: 'row'
    },

    balanceView: {
        justifyContent: 'center',
        marginStart: 14
    },
    currencyText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.white,
        fontSize: setFont(35)
    },
    userNameStyle: {
        bottom: 15,
        position: 'absolute',
        left: 22,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.white
    },
    viewSubContainer: {
        width: '45%'
    },
    logoStyle: {
        width: 100,
        height: 22,
        margin: 15
    },
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
