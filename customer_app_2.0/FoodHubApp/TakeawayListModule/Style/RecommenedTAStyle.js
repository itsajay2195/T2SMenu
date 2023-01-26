import { Dimensions, StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    ratingText: {
        paddingRight: 2,
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    rowViewStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 4,
        paddingLeft: 4,
        width: '100%'
        // borderWidth: 1
    },
    rowStyle: {
        flexDirection: 'row',
        paddingBottom: 4,
        paddingHorizontal: 4,
        width: '100%'
    },
    innerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cardIconStyle: {
        padding: 1
    },
    cardNameStyle: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: '600',
        paddingLeft: 7,
        width: '100%',
        paddingVertical: 2,
        paddingTop: 5,
        color: Colors.black
    },
    cuisinesNameStyle: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        fontWeight: '400',
        paddingLeft: 7,
        paddingVertical: 1,
        width: '100%',
        color: Colors.rating_grey
    },
    cuisinesEmptyStyle: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        fontWeight: '400',
        paddingLeft: 7,
        paddingVertical: 1,
        width: '100%',
        color: Colors.tabGrey
    },
    reviewsTextStyle: {
        marginLeft: 3,
        fontSize: setFont(12),
        color: Colors.suvaGrey
    },
    cardIcon: {
        padding: 5
    },
    cardTitle: {
        fontSize: setFont(14),
        marginTop: 5,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 4
    },
    recentTakeawayCard: {
        marginHorizontal: 5,
        marginBottom: 10,
        marginTop: 10,
        borderColor: Colors.imageBorder,
        borderRadius: 6,
        borderWidth: 1,
        width: SCREEN_WIDTH * 0.3,
        alignItems: 'center'
    },
    recentTakeawayImageContainer: {
        width: SCREEN_WIDTH * 0.3,
        height: 85,
        paddingHorizontal: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderColor: Colors.imageBorder
    },
    imageStyle: {
        width: SCREEN_WIDTH * 0.25,
        height: 65
    },
    milesStyle: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black
    },
    milesStyleDisabled: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.rating_grey
    },
    milesViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    verticalDivider: {
        alignSelf: 'center',
        backgroundColor: Colors.imageBorder,
        width: 1,
        height: 15,
        marginHorizontal: 3
    }
});
