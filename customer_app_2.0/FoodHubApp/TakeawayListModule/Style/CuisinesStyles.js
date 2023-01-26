import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
    mainContainer: {
        marginTop: 15,
        borderRadius: 6,
        marginHorizontal: 6,
        height: 90,
        width: width * 0.29,
        justifyContent: 'center',
        alignItems: 'center'
    },
    takeawayMainContainer: {
        marginTop: 15,
        marginRight: 10,
        marginBottom: 5,
        borderRadius: 6,
        height: 95,
        width: width * 0.24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    suggestionListStyle: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.4,
        elevation: 6,
        marginHorizontal: 10,
        width: '90%'
    },
    cuisineContainer: {},
    sizeForCuisineContainer: {
        flex: 1,
        alignItems: 'center'
    },
    takeawaySizeForCuisineContainer: {
        borderRadius: 6
    },
    imageGalleryStyle: {
        marginTop: 3,
        width: 110,
        height: 65
    },
    defaultImageStyle: {
        width: 110,
        height: width / 6
    },
    takeawayImageGalleryStyle: {
        width: 90,
        height: 85
    },
    cuisinesTypeText: {
        fontSize: setFont(14),
        color: Colors.black,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textTransform: 'capitalize',
        textAlign: 'center',
        fontWeight: '500'
    },
    takeawayCuisinesTypeText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        width: 90,
        fontSize: setFont(13),
        textAlign: 'center',
        fontWeight: '500',
        color: Colors.black,
        position: 'absolute',
        bottom: 3
    },
    cuisinesText: {
        width: 95,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(13),
        fontWeight: '500',
        color: Colors.black,
        position: 'absolute',
        bottom: 3,
        textShadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    headerText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        paddingVertical: 5,
        textTransform: 'capitalize'
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 10
    },
    flatListShowLessView: {
        flex: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cuisineInnerViewStyle: {
        width: '96.5%'
    },
    charPopTickImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 21,
        width: 23
    },
    imageTickView: {
        position: 'absolute',
        left: 2,
        top: 2,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    showMoreText: {
        fontSize: setFont(14),
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM,
        textTransform: 'capitalize',
        margin: 5,
        textAlign: 'right'
    },
    topShadowContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        marginTop: 1
    },
    headerContainer: {
        flex: 1,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchIconStyle: {
        left: 2,
        bottom: 1,
        paddingRight: 5
    },
    searchViewStyle: {
        flexDirection: 'row',
        width: '94%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    searchAndResetContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBarStyle: {
        borderRadius: 5,
        backgroundColor: Colors.grey,
        height: 32,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchTextStyle: {
        color: Colors.primaryTextColor,
        fontSize: setFont(14),
        flex: 1,
        paddingLeft: 8,
        marginVertical: 2,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingBottom: 0,
        paddingTop: 0
    },
    cuisinesTypeUnselected: {
        fontSize: setFont(14),
        color: Colors.black,
        textTransform: 'capitalize',
        textAlign: 'center',
        fontFamily: FONT_FAMILY.MEDIUM
    }
});
