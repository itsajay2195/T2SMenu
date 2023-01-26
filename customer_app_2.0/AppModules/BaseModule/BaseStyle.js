import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    labelCount: {
        minWidth: 10,
        maxWidth: 20,
        height: 15,
        textAlign: 'center',
        fontSize: setFont(10),
        backgroundColor: Colors.secondary_color,
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingHorizontal: 1,
        paddingVertical: 1,
        color: Colors.white,
        borderRadius: 4,
        position: 'absolute',
        top: 8,
        left: 20,
        right: 0,
        overflow: 'hidden'
    },
    container: {
        flex: 1
    },
    notificationIconStyle: {
        width: 40,
        height: 50,
        borderRadius: 0,
        paddingTop: 9,
        paddingLeft: 7
    },
    zendeskChatIconStyle: {
        paddingHorizontal: 8,
        paddingVertical: 10
    }
});
