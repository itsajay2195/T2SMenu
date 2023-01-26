import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    loyaltyViewParent: {
        backgroundColor: Colors.aliceBlue
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.mildlightgrey
    },
    pointsBannerView: {
        height: 90,
        marginVertical: 15,
        marginHorizontal: 18,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        padding: 20
    },
    pointsBannerImageStyle: {
        borderRadius: 12
    },
    pointsView: {
        justifyContent: 'space-between'
    },
    pointsTitle: {
        marginTop: 5,
        fontSize: setFont(10),
        color: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR
    },
    pointsText: {
        fontSize: setFont(34),
        color: Colors.white,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    pointsIcon: {
        marginTop: -5,
        opacity: 0.5
    },
    loyaltyListHeaderViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundGrey,
        alignItems: 'center',
        height: 40
    },
    loyaltyListHeader: {
        flex: 1
    },
    loyaltyListHeaderTextStyle: {
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        marginHorizontal: 1
    },
    loyaltyOddRowViewStyle: {
        backgroundColor: Colors.backgroundGrey,
        shadowColor: Colors.shadowGrey,
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 5
    },
    loyaltyListItem: {
        flex: 1,
        marginLeft: 5
    },
    loyaltyInfoMessageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        backgroundColor: Colors.white
    },
    infoMessageViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoMessageTextStyle: {
        fontSize: setFont(16),
        marginHorizontal: 15,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    bannerViewStyle: {
        height: '10%',
        backgroundColor: Colors.textGreyColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bannerTextStyle: {
        color: Colors.white,
        marginHorizontal: 10
    },
    loyaltyPonitsDetailsContainer: {
        flex: 1
    }
});
