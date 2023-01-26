import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { Colors } from '../../../Themes';
import { setFont } from '../../../Utils/ResponsiveFont';

export const expandingStyle = StyleSheet.create({
    itemView: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
    itemText: { fontFamily: FONT_FAMILY.SEMI_BOLD, fontSize: setFont(16) },
    divider: {
        height: 2,
        width: '100%',
        borderColor: Colors.dividerGrey,
        borderBottomWidth: 1
    }
});
