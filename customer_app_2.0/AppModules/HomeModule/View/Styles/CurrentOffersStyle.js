import { StyleSheet, Dimensions } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
const { width } = Dimensions.get('window');
const heightOfCard = 160;

export default StyleSheet.create({
    cardStyle: { height: heightOfCard, width: width - 20, elevation: 6, marginHorizontal: 10, marginVertical: 10, flex: 1 },
    offerTextStyle: {
        borderRadius: 4,
        marginTop: 20,
        textAlign: 'center',
        marginHorizontal: 10,
        width: 100,
        fontSize: setFont(13),
        paddingVertical: 10,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        backgroundColor: Colors.lightYellowShade
    },
    pageIndicatorOverlayView: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    pageIndicatorView: {
        height: 25,
        width: 25,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainerStyle: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        flex: 1
    },
    imageStyle: {
        flex: 1,
        borderRadius: 5
    },
    contentContainerStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
        flex: 0.3
    },
    titleStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(17),
        marginTop: 5,
        color: Colors.black,
        textAlign: 'left'
    },
    descriptionStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(13),
        textAlign: 'left',
        color: Colors.black,
        marginVertical: 5
    }
});

// export let randomHex = () => {
//     let letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// };
