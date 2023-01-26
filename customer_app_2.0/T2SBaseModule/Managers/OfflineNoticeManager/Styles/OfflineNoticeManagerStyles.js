import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { setFont } from '../../../Utils/ResponsiveFont';

const { width } = Dimensions.get('window').width;

export default StyleSheet.create({
    offlineContainer: {
        backgroundColor: Colors.persianRed,
        height: 40,
        flexDirection: 'row',
        width,
        justifyContent: 'center'
    },
    offlineContainerFullScreen: {
        backgroundColor: Colors.persianRed,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        width,
        marginTop: Platform.OS === 'ios' ? 40 : 0
    },
    offlineText: {
        color: Colors.white,
        fontSize: setFont(16),
        alignSelf: 'center'
    }
});
