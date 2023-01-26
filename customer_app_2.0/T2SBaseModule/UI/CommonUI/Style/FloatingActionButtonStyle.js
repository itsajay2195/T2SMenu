import Colors from '../../../Themes/Colors';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    floatingButtonStyle: {
        flex: 1,
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 5,
        position: 'absolute',
        margin: 8,
        right: 8,
        bottom: 10,
        backgroundColor: Colors.carrotOrange,
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    floatingButtonIconStyle: {
        color: Colors.white
    },
    floatingButtonTextStyle: {
        fontSize: setFont(12),
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR
    }
});
