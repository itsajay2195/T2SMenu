import { StyleSheet, Dimensions } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../T2SBaseModule/Utils/ResponsiveFont';

export const SupportStyle = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    imageAndTextContainerView: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    imageAndTextView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: Dimensions.get('window').height / 4 + 20
    },
    imageStyle: {
        height: 50,
        width: 50,
        resizeMode: 'contain'
    },
    imageView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleTextStyle: {
        padding: 12,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black
    },
    mainVerticalDividerLine: {
        width: 1,
        backgroundColor: Colors.dividerGrey
    },
    horizontalDividerLineContainer: {
        flexDirection: 'row',
        marginHorizontal: 5
    },
    horizontalDividerLine: {
        height: 1,
        flex: 1,
        backgroundColor: Colors.dividerGrey,
        marginTop: 5,
        marginHorizontal: 15
    }
});
