import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const CurrentLocationMapViewStyle = StyleSheet.create({
    tickIconStyle: {
        paddingRight: 5
    },
    currentLocationText: {
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.REGULAR
    },
    locationText: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    currentLocationContainer: {
        paddingVertical: 5,
        paddingLeft: 10
    },
    permissionViewStyle: {
        padding: 10,
        backgroundColor: Colors.dark_grey
    },
    permissionTextStyle: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    }
});
