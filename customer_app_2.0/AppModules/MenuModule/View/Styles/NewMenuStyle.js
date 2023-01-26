import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
export const NewMenuStyle = {
    flex1: {
        flex: 1
    },
    container: { flex: 1, marginHorizontal: 5 },
    listViewWrapper: { flex: 1, paddingTop: 10, justifyContent: 'center' },
    takeAwayNameWrapper: {
        flex: 0.75,
        marginVertical: 10
    },
    takeawayNameStyle: {
        fontWeight: 'bold',
        fontSize: 24
    },
    headerContainerStyle: { display: 'flex', flexDirection: 'row', marginVertical: 10 },
    headerGridWrpperStyle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 10 },
    switchStyle: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
    backIcon: {
        fontSize: 25,
        padding: 10
    },
    listViewItem: {
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: Colors.white
    },
    gridViewItem: {
        flex: 1,
        height: 135,
        padding: 5
    },
    gridViewimageStyle: { borderRadius: 10, height: '90%', width: '95%' },
    listViewimageStyle: { borderRadius: 10, height: 80, width: 80, justifyContent: 'center' },
    gridViewImageWrapper: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.25,
        borderRadius: 10,
        borderColor: 'grey'
    },
    gridViewItemTitleStyle: { marginTop: 10, fontWeight: '700', fontSize: 12, textAlign: 'center' },
    listViewItemTitleStyle: { fontWeight: 'bold', padding: 10 },
    itemInvisible: { backgroundColor: 'transparent' },
    gridTiltleWapper: { padding: 5 },
    listTitleWrapper: { paddingHorizontal: 10, color: 'grey' },
    listItemSeparator: { marginHorizontal: 10, backgroundColor: 'grey', height: 0.5, opacity: 0.4 },
    headerComponentStyle: { display: 'flex', paddingHorizontal: 5 },
    headerComponentSecondRowWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
    topBarComponentStyle: { flexDirection: 'row' },
    listViewItemContentWrapper: { flex: 1, flexDirection: 'row' },
    listViewItemRigtArrowIconWrapper: {
        width: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    prevOrderActivityIndicatorStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' }
};

export const NewMenuSubCategoryStyle = {
    flex1: {
        flex: 1
    },
    container: { flex: 1, marginHorizontal: 5 },
    subCatItemStyle: {
        flex: 1,
        // flexDirection: 'row',
        marginVertical: 10,
        paddingHorizontal: 10
        // alignItems: 'center'
        // height: 150
    },
    listViewItemTitleStyle: { fontWeight: 'bold', paddingHorizontal: 10 },
    listViewItemImageWrapper: { flex: 1 },
    listViewItemWrapper: { display: 'flex', flex: 1, alignContent: 'center', justifyContent: 'center' },
    itemSeparator: { marginHorizontal: 10, backgroundColor: 'grey', height: 0.5, opacity: 0.4 },
    flatListContentContainerStyle: { paddingBottom: 40 },
    listViewItemRigtArrowIconWrapper: {
        height: 20,
        width: 20,
        borderRadius: 10,
        alignSelf: 'center',
        margin: 10
    },
    subCatItemImageWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        left: 10,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        width: '100%',
        height: 60
    },
    categoryHeaderContainer: {
        justifyContent: 'center',
        padding: 10
    }
};

export const MenuCategoryItemsStyle = {
    activityIndicatorWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flex1: {
        flex: 1
    },
    container: { flex: 1, marginHorizontal: 5 },
    gridContainer: {
        paddingHorizontal: 10
    },
    takeAwayNameWrapper: {
        flex: 1,
        marginVertical: 10,
        justifyContent: 'center',
        paddingVertical: 10
    },
    takeawayNameStyle: {
        fontWeight: 'bold',
        fontSize: setFont(24)
    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerGridWrpperStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10
    },
    leftViewItemDescriptionStyle: {
        flex: 1,
        color: Colors.suvaGrey,
        paddingVertical: 6,
        paddingBottom: 8,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    leftViewImageWrapper: { justifyContent: 'flex-end' },
    leftItemWrapperContentStyle: { flex: 1, flexDirection: 'row' },
    switchStyle: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
    backIcon: {
        fontSize: 25,
        padding: 10
    },
    subCatItemStyle: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10
    },
    subCatHeaderContainer: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    itemImageStyle: {
        borderRadius: 6,
        height: 90,
        width: 90
    },
    lefttViewItemTitleStyle: {
        fontWeight: '800',
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.blackLight
    },
    subCategoryListComponentWrapper: { flex: 1 },
    subCatSectionTextStyle: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: '900',
        color: Colors.secondaryTextColor,
        paddingVertical: 10
    },
    subCatHeaderText: {
        marginTop: 15,
        fontSize: setFont(19),
        fontWeight: '900',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    leftViewItemWrapper: {
        // paddingLeft: 13,
        flex: 1,
        alignContent: 'center'
        // justifyContent: 'center'
    },
    itemSeparator: {
        marginHorizontal: 8,
        backgroundColor: Colors.suvaGrey,
        height: 0.5,
        opacity: 0.4,
        marginBottom: 15
    },
    priceTextStyle: {
        fontSize: setFont(16),
        fontWeight: '500',
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.blackLight
    },
    bottomContainerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    priceAndBogofContainer: { flex: 1 },
    priceAndBogofWrapper: { flexDirection: 'row' },
    priceItemWrapper: { height: 30, justifyContent: 'center', marginRight: 10 },
    menuItemOfferWrapper: {
        justifyContent: 'center',
        borderRadius: 10,
        maxWidth: '70%'
    },
    rightViewWrapper: { flexDirection: 'row' },
    rightViewImageWrapper: { marginHorizontal: 3.5 },
    subcatImageStyle: {
        borderRadius: 6,
        width: '100%',
        height: 120,
        justifyContent: 'center'
    },
    subcatDescriptionText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.secondaryTextColor,
        marginBottom: 10
    },
    offerLabel: {
        color: Colors.lightBlack,
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: '700',
        padding: 4,
        backgroundColor: Colors.paleRed,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: Colors.labelRed
    }
};

export const TopBarComponentStyle = {
    container: { flexDirection: 'row', marginHorizontal: 5 },
    iconWrapper: { flex: 0.17, justifyContent: 'center', alignItems: 'center' },
    searchBarWrapper: { flex: 1, justifyContent: 'center' },
    orderTypeWrapper: { flex: 0.6 },
    searchHeaderContainer: {
        marginHorizontal: 5,
        backgroundColor: Colors.grey,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row'
    },
    textInputStyle: {
        width: '90%',
        borderRadius: 25,
        borderColor: '#333',
        backgroundColor: Colors.grey
    }
};

export const TakeAwayNameInfoComponentStyle = {
    headerContainerStyle: { flexDirection: 'row', alignItems: 'center' },
    takeawayNameStyle: {
        fontWeight: '700',
        fontSize: 24
    },
    takeAwayNameInforComponentContainer: { flexDirection: 'row', flex: 1 },
    leftContainerStyle: { display: 'flex', flex: 0.8 },
    rightContainerStyle: { flex: 0.3, height: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cuisinesTextStyle: { color: Colors.suvaGrey, paddingVertical: 5, paddingLeft: 1 },
    ratingComponentWrapper: { alignSelf: 'center' },
    infoAndRatingWrapper: { flexDirection: 'row', alignItems: 'center' },
    infoTextStyle: { color: Colors.lightBlue }
};
