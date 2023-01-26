import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    addOnContainer: {
        flexDirection: 'row'
    },
    wrapText: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center'
    },
    plus: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.suvaGrey,
        margin: 3,
        alignSelf: 'center'
    },
    addOn: {
        color: Colors.suvaGrey,
        borderWidth: 1,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(13),
        padding: 3,
        marginVertical: 3,
        borderRadius: 4,
        borderColor: Colors.suvaGrey
    }
});
