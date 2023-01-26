import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { Colors } from '../../../Themes';

export default StyleSheet.create({
    headerStyle: {
        paddingHorizontal: 10,
        elevation: 0,
        height: 55,
        zIndex: 10,
        backgroundColor: Colors.white
    },
    headerIconStyle: {
        // increased zIndex for icon to make sure it stays on top, so that touch area will work
        zIndex: 16
    },
    headerLeftIconStyle: {
        padding: 6
    },
    androidElevation: {
        elevation: 4
    },
    iosElevation: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.62
    },
    noElevation: {
        paddingHorizontal: 10,
        elevation: 0,
        height: 60,
        backgroundColor: Colors.white
    },
    contentStyle: {
        alignItems: 'flex-start',
        paddingLeft: 10,
        marginLeft: 0
    },
    titleStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: customerAppTheme.colors.text
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    customViewStyle: {
        alignItems: 'flex-start',
        paddingLeft: 10,
        flex: 1
    }
});
