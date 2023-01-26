import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
    buttonStyle: {
        margin: 0,
        paddingTop: Platform.OS === 'ios' ? 0 : 4
    }
});
