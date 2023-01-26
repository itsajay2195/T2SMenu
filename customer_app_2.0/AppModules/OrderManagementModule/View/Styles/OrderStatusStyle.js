import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';
import { isIOS } from '../../../BaseModule/Helper';

export default StyleSheet.create({
    mainContainer: {
        height: '100%',
        backgroundColor: Colors.white
    },
    callSupportIcon: {
        paddingLeft: 8,
        paddingRight: 10,
        paddingVertical: 10,
        marginBottom: 2
    },
    shadowHideContainer: {
        overflow: 'hidden',
        paddingBottom: 5
    },
    orderDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 3,
        elevation: 5,
        shadowOpacity: 0.4,
        backgroundColor: '#FFFFFF',
        paddingVertical: 15
    },
    detailsChildView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderIdText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.black,
        letterSpacing: 2
    },
    waitingTimeText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.primaryColor,
        letterSpacing: 2
    },
    orderStatusContainer: {
        flexDirection: 'column',
        marginTop: 15,
        margin: 5
    },
    paymentDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    paymentTypeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    paymentTypeText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        color: Colors.tabGrey
    },
    paymentByAmtText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        color: Colors.neroGrey
    },
    orderNoLabelStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontWeight: '600',
        fontSize: setFont(14),
        color: Colors.black
    },
    orderIdLabelStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    orderIdStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.lightBlue
    },
    orderNoStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.lightBlue
    },
    totalAmtContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    totalText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        color: Colors.textGreyColor,
        paddingRight: 5
    },
    totalAmtText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.black
    },
    bottomButtonsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: Colors.white
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    liveChatButton: {
        width: '100%',
        backgroundColor: Colors.white,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 6,
        height: 50,
        justifyContent: 'center'
    },
    liveChatButtonText: {
        color: Colors.primaryColor,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1,
        textAlign: 'center'
    },
    cancelButton: {
        width: '100%',
        backgroundColor: Colors.white,
        borderColor: Colors.rating_color,
        borderWidth: 1,
        borderRadius: 6,
        height: 50,
        justifyContent: 'center'
    },
    cancelButtonText: {
        color: Colors.rating_color,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1,
        textAlign: 'center'
    },
    viewOrderButton: {
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 0,
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1
    },
    cancelledStatusContainer: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    refundImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40
    },
    refundImage: {
        width: 242,
        height: 98
    },
    cancelledOrderIdText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14),
        color: Colors.secondary_color,
        letterSpacing: 1
    },
    descriptionContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15
    },
    cancelledOrderDescText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.textGreyColor,
        textAlign: 'center'
    },
    viewOrderButtonText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.WhiteSmoke,
        letterSpacing: 1
    },
    refundContainer: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
        width: '100%'
    },
    refundSuccessContainer: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        backgroundColor: Colors.WhiteSmoke
    },
    wantRefundText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.textGreyColor
    },
    wantRefundAdditionalText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        margin: 10,
        textAlign: 'center',
        color: Colors.textGreyColor
    },
    refundButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15
    },
    refundButton: {
        width: '100%',
        backgroundColor: Colors.primaryColor
    },
    buttonHeight: {
        height: 36
    },
    refundButtonText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.WhiteSmoke
    },
    refundCardButton: {
        width: '100%',
        backgroundColor: Colors.white,
        borderColor: Colors.primaryColor,
        borderWidth: 1
    },
    refundCardButtonText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.primaryColor
    },
    refundMessageText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        color: Colors.textGreyColor,
        textAlign: 'center',
        paddingHorizontal: 10,
        marginTop: 10
    },
    refundNoteText: {
        marginTop: 15,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        color: Colors.suvaGrey,
        textAlign: 'center',
        paddingHorizontal: 10
    },
    refundNoteStarText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        color: Colors.secondary_color,
        textAlign: 'center'
    },
    receiveOfferText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(20),
        color: Colors.secondary_color,
        letterSpacing: 2,
        textAlign: 'center'
    },
    receiveOfferDescriptionText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.black,
        textAlign: 'center'
    },
    appRatingTitleText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(20),
        color: Colors.secondary_color,
        letterSpacing: 2,
        textAlign: 'center',
        paddingVertical: 15
    },
    appRatingDescriptionText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.black,
        textAlign: 'center',
        paddingBottom: 15
    },
    mapViewContainer: {
        flex: 1
    },
    liveTrackingMap: {
        flex: 1
    },
    markerStyle: {
        width: 40,
        height: 40
    },
    resetLocationView: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.white,
        position: 'absolute',
        bottom: 100,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    driverInfoContainer: {
        marginHorizontal: 20,
        padding: 10,
        position: 'absolute',
        bottom: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    driverInfoText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    boldText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: 'bold',
        fontSize: setFont(14),
        color: Colors.black
    },
    waitingTimeHeaderText: {
        width: 60,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(18),
        color: Colors.black,
        paddingHorizontal: 5
    },
    liveChatIcon: {
        paddingRight: 7,
        paddingLeft: 15,
        paddingVertical: 10
    },
    navBarRightActionsView: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    driverMessageContainer: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    driverImageView: {
        width: 40,
        height: 40
    },
    loadMapErrorMessage: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(18),
        color: Colors.black,
        alignSelf: 'center',
        top: 50
    },
    lastUpdatedInfoContainer: {
        padding: 10,
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 5,
        justifyContent: 'center'
    },
    lastUpdatedInfoText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    headerTimerStyle: {
        color: Colors.black,
        marginRight: 5
    },
    supportViewStyle: {
        backgroundColor: Colors.backgroundGrey,
        margin: 10,
        padding: 10
    },
    commonTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        lineHeight: 18
    },
    commonLinkTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.lightBlue
    },
    clearTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.transparent
    },
    experienceView: {
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    reviewViewStyle: {
        marginLeft: 10,
        flexDirection: 'row'
    },
    disLikeViewStyle: {
        marginLeft: 20,
        paddingHorizontal: 7,
        paddingVertical: 5
    },
    orderStatusParent: {
        flex: 1
    },
    cardStyle: {
        marginTop: 15,
        marginHorizontal: 10,
        backgroundColor: Colors.paleYellow
    },
    offersView: {
        marginTop: 5,
        paddingLeft: 5
    },
    checkBoxView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    checkTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        paddingHorizontal: 5,
        color: Colors.primaryTextColor
    },
    acceptButtonView: {
        flex: 1,
        alignItems: 'flex-end',
        marginBottom: 10,
        marginRight: 10
    },
    acceptButtonText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white
    },
    acceptButton: {
        height: 30,
        justifyContent: 'center'
    },
    successMessage: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        paddingLeft: 10,
        paddingBottom: 10
    },
    gpsIconStyle: {
        padding: 5
    },
    likeViewStyle: {
        paddingHorizontal: 7,
        paddingVertical: 5
    },
    chatView: {
        height: 28,
        width: 28
    },
    chatButtonContainer: {
        paddingLeft: 8,
        paddingRight: 10,
        paddingVertical: 8
    },
    viewWrapStayle: {
        flexDirection: 'row',
        marginTop: -3
    },
    mapViewStyle: {
        height: 230,
        marginBottom: 10,
        marginHorizontal: 10
    },
    mapMarkerStyle: {
        height: 45,
        elevation: 3,
        top: isIOS() ? -20 : 0
    },
    addressContainerStyle: {
        backgroundColor: Colors.backgroundGrey,
        margin: 10,
        padding: 10,
        flexDirection: 'row'
    },
    addressAddressContainerStyle: { flex: 1 },
    takeawayParentView: { flexDirection: 'row' },
    takeawayNameStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.black
    },
    takeawayAddressStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        marginTop: 8
    },
    distanceStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    directionTextStyle: {
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white,
        paddingLeft: 8
    },
    directionViewStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 8
    }
});
