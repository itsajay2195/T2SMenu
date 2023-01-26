import { StyleSheet, Dimensions } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../../T2SBaseModule/Utils/ResponsiveFont';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width / 4.5;
const imageHeight = dimensions.width / 7;

export const style = StyleSheet.create({
    mainContainer: {
        padding: 10
    },
    imageGalleryTitleStyle: {
        fontSize: setFont(12),
        color: Colors.black,
        fontFamily: FONT_FAMILY.MEDIUM,
        textTransform: 'capitalize',
        marginBottom: 8
    },
    imageGalleryStyle: {
        width: imageWidth,
        height: imageHeight,
        borderTopEndRadius: 4
    },
    cuisinesTypeText: {
        fontSize: setFont(10),
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR,
        textTransform: 'capitalize',
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 5
    },
    cuisineContainer: {
        backgroundColor: Colors.white,
        borderRadius: 4,
        borderWidth: 1,
        width: imageWidth,
        height: imageHeight + 20,
        borderColor: Colors.gallery,
        marginTop: 5,
        marginRight: 8,
        justifyContent: 'flex-end'
    },
    moreLessText: {
        fontSize: setFont(14),
        color: Colors.textBlue,
        fontFamily: FONT_FAMILY.REGULAR,
        marginTop: 10,
        textAlign: 'right',
        padding: 5
    }
});
