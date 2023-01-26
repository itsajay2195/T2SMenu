import { Dimensions, StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

let SCREEN_WIDTH = Dimensions.get('window').width;
let driverImageSize = SCREEN_WIDTH / 2;

export const Style = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 1,
        padding: 10
    },
    loaderMessageText: {
        marginTop: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        fontSize: setFont(17),
        color: Colors.black,
        padding: 5
    },
    contentMessageText: {
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'left',
        fontSize: setFont(18),
        color: Colors.black,
        marginHorizontal: 10
    },
    additionalContentMessageText: {
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'left',
        fontSize: setFont(18),
        color: Colors.black,
        marginHorizontal: 10,
        marginTop: 15
    },
    driverImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    driverImage: {
        resizeMode: 'contain',
        width: driverImageSize,
        height: driverImageSize,
        margin: 10
    },
    lottieView: {
        width: 80,
        height: 80,
        backgroundColor: Colors.white
    },
    textColorBlue: {
        color: Colors.textBlue
    },
    chatButtonView: { flexDirection: 'row', justifyContent: 'space-around' }
});
