import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const AssuranceModalStyle = StyleSheet.create({
    modalStyle: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: 0,
        padding: 5,
        borderRadius: 15
    },
    closeIconContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        alignItems: 'flex-end',
        padding: 10
    },
    closeIconStyle: {
        color: 'white',
        fontSize: setFont(25)
    },
    titleStyle: {
        color: Colors.textBlue,
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        padding: 20
    },
    contentStyle: {
        color: Colors.black,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    textContainerStyle: {
        flexDirection: 'column',
        backgroundColor: Colors.white,
        width: '100%',
        height: '55%'
    }
});
