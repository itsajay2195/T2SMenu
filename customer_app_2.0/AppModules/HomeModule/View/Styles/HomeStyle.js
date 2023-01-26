import { Platform, StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    searchStyle: {
        backgroundColor: Colors.dividerGrey,
        elevation: 0,
        height: 35
    },
    searchInputStyle: {
        paddingLeft: 0
    },
    primaryContainer: {
        backgroundColor: customerAppTheme.colors.backgroundSecondaryColor
    },
    previousOrderHeaderStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: customerAppTheme.colors.backgroundSecondaryColor
    },
    previousOrderReOrderContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    previousOrderHeaderTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        marginVertical: 15,
        fontSize: setFont(17),
        color: Colors.lightOrange
    },
    previousOrderHeaderDateStyle: {
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.MEDIUM,
        alignItems: 'flex-end'
    },
    previousOrderHeaderREOrderStyle: {
        borderColor: Colors.primaryColor,
        borderRadius: 4,
        marginLeft: 10,
        borderWidth: 1,
        backgroundColor: Colors.primaryColor
    },
    previousOrderHeaderREOrderContentStyle: {
        height: 30
    },
    previousOrderHeaderREOrderTextStyle: {
        color: Colors.white,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    previousOrderContainerStyle: {
        paddingHorizontal: 0,
        paddingVertical: 10,
        marginBottom: 5,
        backgroundColor: customerAppTheme.colors.background
    },
    ourRecommendationContainerStyle: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 5,
        backgroundColor: customerAppTheme.colors.background
    },
    ourRecommendationHeaderStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: setFont(17),
        color: Colors.lightOrange,
        backgroundColor: customerAppTheme.colors.background
    },
    defaultImageContainerStyle: {
        paddingHorizontal: 0,
        backgroundColor: customerAppTheme.colors.background
    },
    reviewRowContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: customerAppTheme.colors.background,
        paddingVertical: 8
    },
    headerTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingVertical: 10,
        fontSize: setFont(17),
        color: Colors.lightOrange
    },
    viewAllTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingVertical: 10,
        fontSize: setFont(15),
        color: Colors.lightBlue
    },
    reviewContainerStyle: {
        marginBottom: 60
    },
    orderStatusParentContainer: {
        flexDirection: 'column',
        borderRadius: 4,
        marginVertical: 20,
        marginHorizontal: 10,
        elevation: 8,
        backgroundColor: customerAppTheme.colors.background
    },
    orderStatusContainer: {
        flexDirection: 'column'
    },
    orderStatusTitleTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingHorizontal: 10,
        fontSize: setFont(14),
        marginLeft: 10,
        color: Colors.black
    },
    orderStatusTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    orderStatusTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 5
    },
    timerIconStyle: {
        alignSelf: 'center',
        margin: -3,
        color: Colors.secondaryTextColor
    },
    deliveryTextColor: {
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: Colors.secondaryTextColor,
        alignSelf: 'center',
        fontSize: setFont(14)
    },
    deliveryPriceTextColor: {
        fontFamily: FONT_FAMILY.REGULAR,
        paddingVertical: 5,
        color: Colors.suvaGrey,
        alignSelf: 'center',
        fontSize: setFont(13),
        marginRight: 3
    },
    deliveryTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    defaultContainerStyle: {
        paddingHorizontal: 0,
        backgroundColor: customerAppTheme.colors.background
    },
    singleBannerContainer: {
        backgroundColor: Colors.white
    },
    singleBannerImageStyle: {
        height: 200,
        resizeMode: 'contain'
    },
    takeawayCloseInfoMessageViewStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: '100%',
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
    },
    buttonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 2,
        padding: 5,
        marginLeft: 10,
        alignItems: 'center'
    },
    buttonTextStyle: {
        color: Colors.white,
        marginLeft: 5,
        marginRight: 5,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    cardStyle: {
        backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)'
    },
    customViewStyle: {
        flex: 1
    },
    contentStyle: {
        justifyContent: 'space-between',
        paddingLeft: 10,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: customerAppTheme.colors.text,
        fontSize: setFont(19)
    }
});
