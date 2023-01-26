import { StyleSheet } from 'react-native';
import { setFont } from '../../../Utils/ResponsiveFont';

const styles = StyleSheet.create({
    horizontalLine: {
        height: 1,
        backgroundColor: '#CCCCCC'
    },
    withOutHorizontalLine: {
        backgroundColor: '#CCCCCC'
    },
    textStyle: {
        flex: 1,
        color: '#333333',
        fontSize: setFont(16)
    },
    disableTextStyle: {
        flex: 1,
        color: '#CCCCCC',
        fontSize: setFont(16)
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10
    },
    arrowStyle: {
        width: 18,
        height: 18
    }
});
export default styles;
