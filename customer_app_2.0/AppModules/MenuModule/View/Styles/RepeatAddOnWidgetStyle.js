import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export const RepeatAddOnWidgetStyle = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    modalView: {
        width: '100%',
        backgroundColor: Colors.persianRed,
        borderRadius: 6
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    newAddOnButton: {
        backgroundColor: Colors.white,
        flex: 0.5,
        marginRight: 8
    },

    repeatLastButton: {
        backgroundColor: Colors.primaryColor,
        flex: 0.5
    },
    newAddOnText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.primaryColor
    },
    repeatLastText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.white
    },
    itemNameText: {
        color: Colors.whiteSmoke,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(18),
        paddingLeft: 15,
        paddingVertical: 10
    },
    addOnText: {
        color: Colors.white,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    addOnView: {
        paddingHorizontal: 15
    },
    addOnHeaderText: {
        color: Colors.whiteSmoke,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        paddingLeft: 15,
        paddingBottom: 8
    },
    buttonContentStyle: {
        height: 48
    }
});
