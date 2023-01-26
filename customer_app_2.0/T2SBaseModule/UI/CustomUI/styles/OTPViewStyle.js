import { StyleSheet } from 'react-native';
import Colors from '../../../Themes/Colors';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20
    },
    codeInput: {
        textAlign: 'center',
        padding: 0,
        fontSize: setFont(18),
        height: 50,
        backgroundColor: Colors.secondary_color,
        borderWidth: 1
    }
});
