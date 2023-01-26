import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';

export const style = StyleSheet.create({
    imageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        width: '100%',
        resizeMode: 'contain'
    },
    imageViewStyle: {
        flex: 1,
        marginTop: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContainerStyle: {
        flex: 1,
        backgroundColor: Colors.white
    }
});
