import { StyleSheet } from 'react-native';
import Colors from '../../../Themes/Colors';

export const style = StyleSheet.create({
    container: {
        width: '94%',
        alignSelf: 'center',
        backgroundColor: Colors.primaryColor,
        overflow: 'hidden'
    },
    successContainerStyle: {
        backgroundColor: Colors.ratingGreen,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    thumbContainerStyle: {
        backgroundColor: Colors.foodHubDarkGreen,
        justifyContent: 'center',
        alignItems: 'center'
    },
    visibleText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: Colors.white
    },
    flex: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    disabledOverlay: StyleSheet.absoluteFill
});
