import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

const styles = StyleSheet.create({
    textStyle: {
        fontSize: setFont(22),
        color: '#3E4A59',
        fontFamily: FONT_FAMILY.REGULAR
    },
    underline: {
        maxWidth: 40,
        borderBottomWidth: 3,
        borderBottomColor: '#F7D823'
    }
});
export default styles;
