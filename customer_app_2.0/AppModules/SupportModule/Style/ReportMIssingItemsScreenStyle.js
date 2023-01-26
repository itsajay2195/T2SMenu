import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const ReportMissingItemsStyle = StyleSheet.create({
    missingItemsTitleText: {
        padding: 15,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    allItemsTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        padding: 10
    },
    allItemsText: { fontSize: setFont(16), fontFamily: FONT_FAMILY.REGULAR },
    checkboxUnFill: { color: Colors.primaryColor },
    submitButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'flex-end'
    },
    foodHubContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 16
    },
    nameContainer: {
        flexDirection: 'row'
    },
    nameStyle: {
        flex: 1,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    foodHubNameStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.primaryTextColor
    },
    nameContainerBox: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10
    },
    asteriskTextStyle: {
        color: Colors.persianRed,
        marginLeft: 3
    },
    priceStyle: {
        flex: 1,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.secondaryTextColor
    },
    btnStyle: {
        flex: 0.2
    },
    totalPriceStyle: {
        flex: 0.3,
        textAlign: 'right',
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16)
    },
    foodHubTotalPriceStyle: {
        flex: 0.3,
        textAlign: 'right',
        color: Colors.primaryTextColor,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        marginTop: 4
    },
    addOnStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
        alignItems: 'center'
    },
    offerContainerStyle: {
        backgroundColor: Colors.carrotOrange,
        borderRadius: 2,
        alignSelf: 'flex-start'
    },

    foodHubOfferContainerStyle: {
        backgroundColor: Colors.freeOption,
        borderRadius: 2,
        alignSelf: 'flex-start',
        marginBottom: 2
    },

    offerStyle: {
        color: Colors.white,
        padding: 3,
        fontSize: setFont(8),
        fontFamily: FONT_FAMILY.REGULAR
    },
    addOnTextStyle: {
        fontSize: setFont(10),
        color: Colors.tabGrey,
        fontFamily: FONT_FAMILY.REGULAR,
        marginRight: 16,
        flex: 0.7
    },
    addOnPriceStyle: {
        fontSize: setFont(10),
        color: Colors.tabGrey,
        fontFamily: FONT_FAMILY.REGULAR
    },
    viewModeStyle: {
        marginLeft: 26
    },
    bogofContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    alignSelfStartStyle: {
        alignSelf: 'flex-start'
    },
    removeStyle: {
        fontSize: setFont(13),
        color: Colors.secondary_color,
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1,
        paddingHorizontal: 10,
        paddingVertical: 2
    }
});

export default ReportMissingItemsStyle;
