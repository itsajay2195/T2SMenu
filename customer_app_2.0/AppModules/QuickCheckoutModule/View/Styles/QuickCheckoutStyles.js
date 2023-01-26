import { StyleSheet } from 'react-native';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    topContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end'
    },
    closeContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    closeIcon: {
        color: Colors.white,
        fontSize: setFont(25),
        padding: 22
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: customerAppTheme.colors.background,
        paddingLeft: 5
    },

    iconStyle: {
        color: Colors.white
    },
    bottomMenuContainer: {
        flex: 0.5,
        backgroundColor: Colors.dividerGrey,
        alignItems: 'center'
    },
    itemContainer: {
        flexDirection: 'row',
        paddingBottom: 8,
        paddingHorizontal: 10,
        paddingTop: 20,
        backgroundColor: customerAppTheme.colors.background
    },
    itemHeaderContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: customerAppTheme.colors.background
    },
    itemTitleStyle: {
        flex: 0.3,
        fontSize: setFont(14),
        alignItems: 'center',
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    itemDescContainer: {
        flex: 1,
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    itemDividerStyle: {
        height: 1,
        flexDirection: 'row',
        backgroundColor: Colors.dividerGrey,
        marginHorizontal: 16
    },
    headerTextColor: {
        fontSize: setFont(16),
        flex: 0.9,
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.secondary_color
    },
    headerDetailTextColor: {
        fontSize: setFont(16),
        flex: 0.9,
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.lightBlue
    },
    rightIconStyle: {
        flex: 0.1,
        alignSelf: 'center',
        marginHorizontal: 2
    },
    leftIconStyle: {
        flex: 0.1,
        color: Colors.blue,
        alignItems: 'center',
        alignSelf: 'center',
        marginHorizontal: 0
    },
    deliveryAddressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    deliveryAddressTextStyle: {
        fontSize: setFont(15),
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    radioButtonStyle: {
        alignSelf: 'center'
    },
    itemStyle: {
        flex: 1
    },
    dividerContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    orderButtonContainer: {
        justifyContent: 'flex-end',
        flex: 1,
        paddingBottom: 12
    },
    addAddressStyle: {
        width: '100%',
        height: 100,
        padding: 10,
        justifyContent: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0 //Here is the trick
    },
    addressTextStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        justifyContent: 'flex-start'
    },
    addressContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    addressIconstyle: {
        position: 'absolute',
        right: 0,
        paddingRight: 20
    },
    visibleTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        letterSpacing: 2,
        marginLeft: 10,
        textAlign: 'center'
    },
    flex: {
        flex: 1
    },
    contactFreeStyle: {
        marginHorizontal: 0,
        borderRadius: 0
    },
    quickCheckoutViewStyle: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    quickCheckoutAnimationStyle: {
        height: '80%'
    },
    fixSafeViewBottomBackground: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        height: 100,
        zIndex: -1000
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightRed,
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 11,
        paddingVertical: 8
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
    claimOfferText: {
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 8
    },
    loadingViewStyle: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0)',
        bottom: 12,
        width: '94%',
        left: 10,
        top: 8,
        justifyContent: 'center'
    },
    loadingWhiteViewStyle: {
        borderRadius: 4,
        marginLeft: 10
    },
    lottieViewStyle: {
        width: '94%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor
    },
    lottieAnimationViewStyle: {
        width: '100%',
        backgroundColor: Colors.white
    },
    placingYourOrderTextStyle: {
        position: 'absolute',
        color: Colors.white,
        letterSpacing: 1.5,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 8,
        fontSize: setFont(16)
    },
    quickCheckoutContentViewStyle: {
        width: '100%',
        backgroundColor: 'white'
    },
    contactFreeDeliveryContainerStyle: {
        width: '100%'
    },
    swipeOrderButtonContainerStyle: {
        marginVertical: 10,
        height: 70
    },
    quickCheckoutContainerStyle: {
        flex: 1
    },
    contactLessDeliveryContainerStyle: {
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkBoxTextStyle: {
        fontSize: setFont(14),
        color: Colors.black,
        left: 4,
        fontFamily: FONT_FAMILY.REGULAR
    },
    infoIconContariner: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        paddingBottom: 0
    },
    toolTipViewStyle: {
        // i'm putting this because disableShadow prop is not respecting in ios - ToolTip Component
        shadowOpacity: 0.0,
        shadowRadius: 0.0,
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 0
    },
    toolTipArrowStyle: {
        marginLeft: 0
    },
    toolTipContentStyle: {
        backgroundColor: Colors.tip_bg_Black
    },
    contactLessDeliveryText: {
        fontSize: setFont(12),
        backgroundColor: Colors.tip_bg_Black,
        color: Colors.white
    },
    toolTipArrowSize: {
        width: 16,
        height: 15
    },
    toolTipDisplayInsets: {
        top: 24,
        bottom: 24,
        left: 150,
        right: 5
    },
    transactionModalContentViewStyle: { width: '100%', backgroundColor: 'white', padding: 5 },
    transactionModalRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    transactionFailureHeaderText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(18),
        color: Colors.steelRed,
        margin: 8
    },
    transactionFailureMessageText: {
        color: Colors.suvaGrey,
        fontSize: setFont(14),
        margin: 10,
        fontFamily: FONT_FAMILY.REGULAR
    },
    cardText: {
        flex: 1,
        color: Colors.black,
        fontSize: setFont(16),
        margin: 10,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    amountText: {
        flex: 1,
        color: Colors.black,
        fontSize: setFont(20),
        margin: 10,
        textAlign: 'right',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    otherPaymentsButtonStyle: {
        flex: 1,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        margin: 10
    },
    otherPaymentsButtonTextStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1
    },
    retryButtonStyle: {
        flex: 1,
        backgroundColor: Colors.primaryColor,
        margin: 10
    },
    retryButtonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        letterSpacing: 1
    },
    buttonSpaceStyle: {
        width: 20
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    applePayButton: {
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 0,
        backgroundColor: Colors.shadowGrey,
        borderColor: Colors.shadowGrey,
        borderWidth: 1,
        height: 60,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkoutButton: {
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 0,
        backgroundColor: Colors.primaryColor,
        height: 60,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkoutButtonText: {
        fontSize: setFont(16),
        paddingHorizontal: 5,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        alignSelf: 'center',
        color: Colors.white,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    applePayButtonText: {
        fontSize: setFont(16),
        paddingHorizontal: 5,
        fontFamily: FONT_FAMILY.REGULAR,
        alignSelf: 'center',
        color: Colors.white
    },
    bottomButtonsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: Colors.white
    },
    rippleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardComponentStyle: {
        flex: 1
    },
    legalAgeDeclarationContainer: {
        marginHorizontal: 15,
        marginTop: 5
    },
    legalAgeText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    payButtonStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    InfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: -5,
        backgroundColor: Colors.lightYellow,
        borderWidth: 0.5,
        borderColor: Colors.rating_yellow,
        padding: 5
    },
    infoText: {
        flex: 1,
        fontSize: setFont(12),
        color: Colors.lightOrange,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontWeight: '500',
        paddingHorizontal: 5
    }
});
