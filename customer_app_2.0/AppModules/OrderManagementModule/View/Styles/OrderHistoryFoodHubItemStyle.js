import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: Colors.dividerGrey
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.suluGreen,
        marginBottom: 7,
        alignItems: 'center',
        padding: 12,
        paddingEnd: 0
    },
    colorWhite: {
        backgroundColor: Colors.white
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
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        marginStart: 12
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        flex: 1,
        color: Colors.black,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingEnd: 8
    },
    dateStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        fontSize: setFont(10),
        marginEnd: 12
    },
    dateColorBlurred: {
        color: Colors.tabGrey
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    priceText: { fontFamily: FONT_FAMILY.REGULAR, fontSize: setFont(14), marginStart: 5, marginEnd: 12 },
    orderTypeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    verticalDivider: {
        width: 1,
        height: 15,
        marginHorizontal: 8
    },
    savingsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.lightYellow,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 2
    },
    savingsIcon: {
        marginTop: 2
    },
    savingsText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.primaryColor,
        fontSize: setFont(12),
        padding: 4
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 8
    },
    buttonParent: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    buttonText: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.textBlue,
        fontSize: setFont(14),
        marginStart: -2
    },
    marginEnd_16: { marginEnd: 16 },
    cancelOrderContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    cancelOrderText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.freeOption,
        fontSize: setFont(10),
        textAlign: 'right',
        marginEnd: 6
    },
    joinBetaImageBackGroundStyle: {
        padding: 6,
        width: '100%',
        resizeMode: 'contain'
    },
    joinBetaViewStyle: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 5 },
    joinBetaText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(13),
        color: Colors.secondaryTextColor
    },
    joinBetaImageTouchStyle: {
        flex: 1
    },
    waitingViewStyle: { backgroundColor: Colors.persianRed, marginRight: 5, borderRadius: 4 },
    waitingTextStyle: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        color: Colors.white,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    }
});
