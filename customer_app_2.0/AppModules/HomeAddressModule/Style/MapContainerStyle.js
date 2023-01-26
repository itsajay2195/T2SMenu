import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';

export default StyleSheet.create({
    header: {
        height: 60,
        alignItems: 'flex-end',
        elevation: 0,
        paddingHorizontal: 10,
        zIndex: 10,
        backgroundColor: Colors.white
    },
    pinLocationContainer: {
        position: 'absolute',
        alignItems: 'center',
        top: '45%',
        alignSelf: 'center'
    },
    pinLocationIconStyle: {
        color: Colors.persianRed
    },
    pinLocationTextContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: 5,
        borderRadius: 3
    },
    pinLocationPostcodeTextDisplayStyle: {
        color: Colors.persianRed,
        fontSize: 10
    },
    pinLocationTextDisplayStyle: {
        color: Colors.persianRed,
        fontSize: 12,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    handlePinLocationIconContainerStyle: {
        position: 'absolute',
        right: 0,
        height: 50,
        width: 50,
        margin: 15,
        borderRadius: 25,
        backgroundColor: Colors.white,
        borderColor: Colors.mildGrey,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0
    },
    mapMainContainer: {
        flex: 1
    },
    currentLocationTextContainer: {
        paddingLeft: 10,
        paddingBottom: 15
    },
    currentLocationHeaderText: {
        fontSize: 12,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingBottom: 2
    },
    currentLocationText: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    buttonContainer: {
        backgroundColor: Colors.primaryColor,
        width: '95%',
        height: 50,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    buttonTextStyle: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: FONT_FAMILY.REGULAR,
        letterSpacing: 1
    },
    mapContainer: {
        flex: 8
    },
    noSuggestionItem: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: 14,
        color: Colors.black,
        paddingVertical: 12,
        alignSelf: 'center'
    },
    suggestionItemContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 14,
        alignItems: 'center'
    },
    suggestionLocationIcon: {
        color: Colors.gunmetal
    },
    suggestionItemText: {
        flex: 1,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: 14,
        color: Colors.black,
        paddingVertical: 14,
        paddingStart: 4
    },
    suggestionDivider: {
        height: 1,
        backgroundColor: Colors.dividerGrey,
        marginHorizontal: 12
    },
    mapTypeContainer: {
        position: 'absolute',
        left: 7,
        bottom: 7
    },
    mapTypeImageStyle: {
        height: 65,
        width: 65,
        borderRadius: 10
    },
    suggestionContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: Colors.white
    },
    iosElevation: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.62,
        paddingHorizontal: 10,
        elevation: 0,
        height: 55,
        zIndex: 10,
        backgroundColor: Colors.white
    },
    androidElevation: {
        elevation: 4
    },
    safeAreaFlex: {
        flex: 1
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    mapView: {
        flex: 7
    },
    iOSCurrentLocationBtnStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        backgroundColor: 'transparent',
        right: 10,
        bottom: 10
    },
    aOSCurrentLocationBtnStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        backgroundColor: 'transparent',
        right: 10,
        top: 70
    }
});
