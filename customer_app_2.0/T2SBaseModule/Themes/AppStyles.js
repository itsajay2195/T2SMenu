import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    horizontalDivider: {
        marginBottom: 5,
        backgroundColor: Colors.dividerGrey,
        width: '100%',
        height: 1
    },
    verticalDivider: {
        marginBottom: 5,
        backgroundColor: Colors.dividerGrey,
        height: '100%',
        width: 1
    }
});
