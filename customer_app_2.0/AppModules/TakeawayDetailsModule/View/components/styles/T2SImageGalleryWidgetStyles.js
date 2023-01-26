import { StyleSheet, Dimensions } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width / 5;
const imageHeight = dimensions.width / 7;

export const style = StyleSheet.create({
    mainContainer: {
        padding: 10
    },
    imageGalleryTitleStyle: {
        fontSize: setFont(12),
        color: Colors.black,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    imageGalleryStyle: {
        width: imageWidth,
        height: imageHeight,
        marginRight: 15,
        marginTop: 16
    },
    imageBackgroundStyle: {
        width: imageWidth,
        height: imageHeight,
        marginTop: 16,
        marginRight: 15,
        opacity: 1
    },
    backgroundImageText: {
        color: Colors.white,
        fontSize: setFont(11),
        fontFamily: FONT_FAMILY.REGULAR
    },
    imageBackgroundOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.shadowBlack
    }
});
