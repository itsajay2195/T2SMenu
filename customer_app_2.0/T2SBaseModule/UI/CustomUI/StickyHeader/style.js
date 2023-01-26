import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from '../../../Utils/ResponsiveFont';

const { StyleSheet } = require('react-native');

export const styles = StyleSheet.create({
    headingStyle: {
        padding: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.lightOrange,
        paddingHorizontal: 15
    },
    underLineStyle: {
        height: 6,
        width: '100%',
        backgroundColor: Colors.primaryColor,
        alignSelf: 'center'
    }
});
