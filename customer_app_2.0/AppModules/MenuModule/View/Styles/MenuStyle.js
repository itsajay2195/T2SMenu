import { Platform, StyleSheet, Dimensions } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { isCustomerApp, isIPhoneX } from 't2sbasemodule/Utils/helpers';
import { addButtonHeight, addButtonWidth } from 't2sbasemodule/UI/CustomUI/ItemAddButton/AddButtonStyle';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    parentContainer: {
        flex: 1
    },
    searchStyle: {
        backgroundColor: Colors.dividerGrey,
        elevation: 0,
        height: 35
    },
    menuSubContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    dynamicHeightContainer: {
        backgroundColor: Colors.white,
        zIndex: 100
    },
    dynamicHeightFoodHubAnimation: {
        position: 'absolute',
        left: 0,
        right: 0
    },
    noMenuStyle: {
        flex: 1,
        backgroundColor: Colors.white
    },
    searchMainContainer: {
        flex: 1,
        height: '100%'
    },
    searchBackgroundStyle: {
        backgroundColor: Colors.transparent
    },
    searchMainView: {
        height: SCREEN_HEIGHT / 12,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.silver,
        borderBottomWidth: 0.5
    },
    searchSubView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchCloseIconStyle: {
        padding: 5,
        marginRight: 5,
        paddingLeft: 15
    },
    searchTextInputContainer: {
        marginLeft: 10,
        width: '80%'
    },
    searchSecondaryView: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center'
    },
    menuBackgroundStyle: {
        backgroundColor: Colors.whiteSmoke,
        marginTop: Platform.OS === 'ios' ? (isIPhoneX() ? 40 : 25) : isCustomerApp() ? 0 : 30
    },
    backArrowContainer: {
        padding: 10,
        position: 'absolute',
        top: Platform.OS === 'ios' ? (isIPhoneX() ? 40 : 25) : 25,
        zIndex: 1000
    },
    dividerStyle: {
        height: 2,
        backgroundColor: Colors.lighterGrey
    },
    alignCenter: {
        alignSelf: 'center'
    },
    categoryContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.white
    },
    categoryStyle: {
        fontSize: setFont(16),
        color: Colors.shadowGrey,
        textAlignVertical: 'center',
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: '700'
    },
    subCategoryContainer: {
        backgroundColor: Colors.white,
        marginBottom: 5,
        paddingTop: 10,
        paddingHorizontal: 12
    },
    deliveryIconStyle: {
        marginTop: 2,
        marginRight: 2
    },
    subCategoryStyle: {
        color: Colors.DarkOrange,
        fontSize: setFont(14),
        textAlignVertical: 'center',
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: '700'
    },
    descriptionStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.secondaryTextColor,
        fontSize: setFont(13),
        textAlignVertical: 'center',
        marginVertical: 5
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12
    },
    fullViewItemContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 12
    },
    imageStyle: {
        height: 90,
        width: 90,
        borderRadius: 6,
        marginRight: 5,
        borderWidth: 0.5,
        borderColor: Colors.imageBorder
    },
    fullImageStyle: {
        width: SCREEN_WIDTH - 24,
        height: 215,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        marginTop: 10
    },
    itemNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemStyle: {
        fontSize: setFont(15),
        color: Colors.primaryTextColor,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: '600'
    },
    offerContainer: {
        backgroundColor: Colors.secondary_color,
        borderRadius: 2,
        paddingHorizontal: 5,
        paddingVertical: 3,
        maxWidth: 90,
        marginRight: 5
    },
    offerStyle: {
        color: Colors.white,
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR
    },
    priceStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.primaryTextColor,
        fontSize: setFont(14)
    },
    searchBarContainer: {
        flexDirection: 'row',
        borderRadius: 6,
        borderColor: Colors.grey,
        height: 40,
        backgroundColor: Colors.grey,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginHorizontal: 5,
        width: '70%'
    },
    subContainer: {
        flex: 1
    },
    emptyMenuContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyMenuText: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR
    },
    activeHeaderTextStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    headerTextStyle: {
        fontSize: setFont(16),
        color: '#AF9E80',
        fontFamily: FONT_FAMILY.MEDIUM
    },
    detailsMenuCartText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    horizontalDivider: {
        marginVertical: 5,
        height: 1,
        marginHorizontal: 10,
        backgroundColor: Colors.dividerGrey
    },
    verticalDivider: {
        alignSelf: 'center',
        backgroundColor: Colors.suvaGrey,
        width: 1,
        height: 16
    },
    detailsMenuCartBottomText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.blackLight
    },
    reviewTextStyle: {
        color: Colors.blackLight
    },
    detailsMenuCartTitleText: {
        fontFamily: FONT_FAMILY.BOLD,
        color: Colors.thinBlack,
        fontSize: setFont(30),
        marginLeft: 12,
        fontWeight: 'bold'
    },
    addressMenuCartTitleText: {
        fontFamily: FONT_FAMILY.BOLD,
        color: Colors.thinBlack,
        fontSize: setFont(14),
        marginLeft: 12
    },
    detailsMenuCartContainer: {
        flex: 10,
        flexDirection: 'row'
    },
    takeawayLabelContainer: {
        flex: 7.5
    },
    heartIconContainer: {
        flex: 1,
        marginRight: 5
    },
    reviewLabelContainer: {
        justifyContent: 'space-between'
    },
    detailsSubLevelMenuCartContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 25,
        paddingBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailsMenuCartDiscountView: {
        alignItems: 'flex-end',
        marginRight: 12,
        marginTop: 2
    },
    detailsMenuCartOfferView: {
        paddingVertical: 2,
        marginBottom: 5,
        paddingHorizontal: 5,
        backgroundColor: Colors.secondary_color,
        borderRadius: 2
    },
    detailsMenuCartOfferText: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: '#FFFFFF',
        fontSize: setFont(8)
    },
    menuCartBottomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    menuCartBottomViewStyle: {
        flexDirection: 'row',
        paddingRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 2
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
    takeawayName: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    deliveryRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
    deliveryDetailsViewStyle: {
        flexDirection: 'row',
        top: 8
    },
    deliveryChargeContainer: {
        marginLeft: 15,
        paddingTop: 1.5
    },
    starIconStyle: {
        bottom: 1
    },
    searchTextStyle: {
        flex: 1
    },
    searchIconStyle: {
        color: Colors.suvaGrey,
        marginEnd: 5
    },
    searchViewStyle: {
        flex: 1,
        backgroundColor: Colors.grey,
        marginLeft: 10,
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5
    },
    searchItemsTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.suvaGrey,
        fontSize: setFont(16),
        textAlign: 'center',
        flexShrink: 1
    },
    searchItemsIconStyle: {
        padding: 3,
        left: 9,
        alignSelf: 'center',
        color: Colors.blackLight
    },
    mainHeaderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainHeaderContainerAnimated: {
        width: '100%',
        padding: 10,
        position: 'absolute',
        top: Platform.OS === 'ios' ? (isIPhoneX() ? 40 : 18) : 18
    },
    addButtonContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        width: addButtonWidth * 3,
        height: addButtonHeight
    },
    addButtonImage: {
        position: 'absolute',
        right: 9,
        left: 9,
        top: 74
    },
    addButtonWithoutImage: {},
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    itemDivider: {
        marginHorizontal: 15,
        height: 0.75,
        backgroundColor: Colors.dividerGrey
    },
    takeawayNameContainer: {
        flexDirection: 'row'
    },
    infoText: {
        color: Colors.textBlue,
        alignSelf: 'center',
        textTransform: 'capitalize'
    },
    liveTrackingText: {
        fontSize: setFont(12),
        color: Colors.tabGrey
    },
    reviewContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: 5,
        marginBottom: 10
    },
    dividerContainer: {
        alignSelf: 'flex-start',
        marginVertical: 4,
        marginLeft: 8
    },
    nameContainer: {
        paddingRight: 5,
        justifyContent: 'space-between'
    },
    bestSellingHeaderText: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.BOLD,
        color: Colors.black,
        fontWeight: 'bold'
    },
    bestSellingAlignment: {
        paddingLeft: 3,
        marginTop: 5
    },
    viewInfoAlignment: {
        top: 4
    },
    contentContainer: {
        flex: 10,
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        paddingRight: 10
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row'
    },
    searchIconFlexRow: {
        flexDirection: 'row'
    },
    searchIconAlignIcon: {
        justifyContent: 'space-evenly'
    },
    rowReverse: {
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    infoButton: {
        paddingBottom: 2
    },
    flexDirectionRow: {
        flexDirection: 'row'
    },
    infoFavoriteView: {
        flexDirection: 'row',
        marginTop: 3
    },
    itemMargin: {
        marginRight: 10
    },
    priceContainer: {
        paddingRight: 5,
        width: 55,
        alignItems: 'flex-end'
    },
    imageContainer: {
        alignItems: 'center'
    },
    subCatImage: {
        // width: SCREEN_WIDTH - 24,
        height: 105,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        marginBottom: 5
    },
    subCatShadowView: {
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        width: SCREEN_WIDTH - 24,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        marginBottom: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    shbCatShadowViewText: {
        paddingHorizontal: 10,
        width: '80%',
        fontSize: setFont(20),
        color: Colors.white,
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: 'bold',
        padding: 5
    },
    takeAwayHeaderStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.thinBlack,
        fontSize: setFont(22),
        alignSelf: 'center',
        flex: 1
    },
    safeAreaPadding: {
        paddingTop: 12
    },
    likeIconStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 7,
        paddingTop: 10
    },
    recommendIconStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 7,
        paddingVertical: 5,
        marginTop: 10
    },
    safeAreaViewStyle: {
        flex: 1,
        backgroundColor: Colors.white
    }
});
