import { Platform, StyleSheet } from 'react-native';
import { setFont } from '../../../Utils/ResponsiveFont';

const styles = StyleSheet.create({
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 30,
        height: 16,
        marginRight: 8
    },
    underline: {
        backgroundColor: '#CCCCCC',
        width: 1,
        height: 25,
        marginRight: 10
    },
    textInputStyle: {
        fontSize: setFont(18),
        color: '#333333',
        flex: 1
    },
    tickStyle: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
        marginTop: Platform.OS === 'ios' ? 12 : 0
    },
    arrowStyle: {
        width: 12,
        height: 12,
        marginHorizontal: 6
    },
    buttonStyle: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingRight: 4
    }
});
export default styles;
