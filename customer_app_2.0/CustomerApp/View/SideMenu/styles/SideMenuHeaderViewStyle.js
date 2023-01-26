import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';

export default StyleSheet.create({
    rootContainer: { flexDirection: 'row', alignItems: 'center', height: 125, backgroundColor: Colors.white },
    imageDrawable: {
        backgroundColor: Colors.backgroundGrey,
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        justifyContent: 'center',
        marginLeft: 25
    },
    imageStyle: { width: 70, height: 70, borderRadius: 70 / 2, position: 'absolute', alignSelf: 'center' },
    arrowStyle: { color: Colors.black, marginRight: 20 },
    marginEndArrowStyle: { color: Colors.black },
    midContainerStyle: { flex: 1, marginLeft: 10 }
});
