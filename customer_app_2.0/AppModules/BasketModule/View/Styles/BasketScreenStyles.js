import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    bottomContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.secondary_color,
        fontSize: setFont(14),
        letterSpacing: 1,
        paddingTop: 8,
        paddingHorizontal: 16
    },
    priceSummaryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 4,
        fontFamily: FONT_FAMILY.REGULAR
    },
    allergyInfoContainer: {
        paddingHorizontal: 16
    },
    couponRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    couponContainer: {
        position: 'absolute',
        right: 16,
        bottom: 0
    },
    labelStyle: {
        color: customerAppTheme.colors.secondaryText,
        fontFamily: FONT_FAMILY.REGULAR
    },
    totalStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    sizedBoxStyle: {
        backgroundColor: customerAppTheme.colors.divider,
        height: 5
    },
    textInputContainer: {
        flex: 1
    },
    buttonStyle: {
        alignSelf: 'flex-start',
        paddingRight: 10
    },
    contentButtonStyle: {
        padding: 0
    },
    priceSummaryContainer: {
        paddingVertical: 8
    },
    marginHorizontalStyle: {
        marginHorizontal: 16
    },
    paddingHorizontalStyle: {
        marginHorizontal: 16
    },
    paddingVerticalStyle: {
        paddingVertical: 14
    },
    hiddenItemContainerStyle: {
        flex: 1,
        backgroundColor: Colors.persianRed,
        alignItems: 'flex-end',
        marginLeft: 20
    },
    deleteButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    deleteTextStyle: {
        color: Colors.white,
        paddingHorizontal: 8,
        fontFamily: FONT_FAMILY.MEDIUM,
        letterSpacing: 2
    },
    couponApplyStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1
    },
    couponButtonStyle: {
        paddingLeft: 20,
        paddingTop: 10
    },
    couponRemoveStyle: {
        fontSize: setFont(12),
        color: Colors.secondary_color,
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.orangeBg,
        padding: 8,
        paddingRight: 12
    },
    errorText: {
        color: Colors.persianRed,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 8
    },
    warningText: {
        color: Colors.orange,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 8
    },
    couponErrorContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16
    },
    redeemMessageStyle: {
        marginLeft: 42,
        color: customerAppTheme.colors.secondaryText
    },
    freeGiftTextStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        color: Colors.primaryColor
    },
    freeGiftContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        padding: 5,
        backgroundColor: Colors.orangeBg,
        borderRadius: 7
    },
    bodyContainer: {
        flex: 1
    },
    asteriskContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        marginLeft: -5
    },
    asteriskText: {
        color: Colors.persianRed,
        paddingHorizontal: 4
    },
    asteriskMessage: {
        color: customerAppTheme.colors.secondaryText,
        fontFamily: FONT_FAMILY.REGULAR
    },
    staticHeight: {
        height: 25
    },
    allergyModalTitle: {
        color: Colors.secondary_color,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        letterSpacing: 2
    },
    allergyDescription: {
        marginVertical: 5,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    claimTextStyle: {
        color: Colors.textGreyColor,
        fontFamily: FONT_FAMILY.REGULAR
    },
    descriptionStyle: {
        color: Colors.primaryTextColor,
        fontSize: setFont(14),
        marginVertical: 10
    },
    contactFreeContainer: {
        marginTop: 10
    },
    allergyText: {
        flex: 1,
        fontSize: setFont(12),
        color: Colors.lightOrange,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontWeight: '500',
        paddingHorizontal: 5
    },
    invisibleContainer: {
        position: 'absolute',
        height: '120%',
        width: '100%'
    },
    allergyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: -5,
        backgroundColor: Colors.lightYellow,
        borderWidth: 0.5,
        borderColor: Colors.rating_yellow,
        padding: 5
    },
    allergyTextContainer: {
        textAlign: 'center'
    },
    taPhoneStyle: {
        color: customerAppTheme.colors.link,
        fontFamily: FONT_FAMILY.BOLD
    },
    infoContainer: {
        marginHorizontal: 10,
        backgroundColor: Colors.lightYellow,
        borderWidth: 0.5,
        marginVertical: 10,
        borderColor: Colors.rating_yellow,
        borderRadius: 10
    },
    inFoText: {
        flex: 1,
        fontSize: setFont(14),
        color: Colors.lightOrange,
        fontFamily: FONT_FAMILY.REGULAR,
        fontWeight: '500',
        paddingHorizontal: 5
    },
    takeawayCloseInfoMessageViewStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary_color,
        marginBottom: 2,
        shadowColor: Colors.shadowGrey,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 5,
        shadowOpacity: 0.6
    },
    takeawayCloseInfoMessageTextStyle: {
        fontSize: setFont(16),
        color: Colors.white,
        fontWeight: 'bold',
        marginRight: 5,
        flexWrap: 'wrap',
        width: '80%',
        marginLeft: 5,
        marginVertical: 6
    },
    sheildIconStyle: {
        marginHorizontal: 5,
        color: Colors.white
    }
});

export default styles;
