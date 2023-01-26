import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { Dimensions } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
export default StyleSheet.create({
    mapContainer: {
        height: 270
    },
    mapContainerFullView: {
        height: Dimensions.get('window').height
    },
    pinLocationContainer: {
        position: 'absolute',
        alignItems: 'center',
        top: '40%',
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
        fontSize: setFont(10)
    },
    pinLocationTextDisplayStyle: {
        color: Colors.persianRed,
        fontSize: setFont(12),
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
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        paddingBottom: 2
    },
    currentLocationText: {
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    }
});
