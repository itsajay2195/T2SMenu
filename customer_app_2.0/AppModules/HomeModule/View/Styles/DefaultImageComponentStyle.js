import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    cardStyle: {
        flex: 1,
        height: 235
    },
    wishingTextContainer: {
        flexWrap: 'wrap',
        height: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        paddingTop: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 80
    },
    wishingTitleStyle: {
        fontSize: setFont(24),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.white,
        paddingTop: 20,
        alignSelf: 'center'
    },
    wishingDescriptionStyle: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white,
        paddingHorizontal: 16,
        alignSelf: 'center',
        textAlign: 'center'
    },
    imageTextViewStyle: {
        height: 60,
        paddingTop: 5
    }
});
