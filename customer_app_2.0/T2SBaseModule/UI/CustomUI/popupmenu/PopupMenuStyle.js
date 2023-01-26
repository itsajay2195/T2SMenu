import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';

const styles = StyleSheet.create({
    shadowMenuContainer: {
        position: 'absolute',
        backgroundColor: Colors.white,
        borderRadius: 4,
        opacity: 0,

        // Shadow
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.14,
                shadowRadius: 2
            },
            android: {
                elevation: 8
            }
        })
    },
    menuContainer: {
        overflow: 'hidden'
    }
});
export default styles;
