import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';

export const Style = StyleSheet.create({
    imageGalleryItemViewStyle: {
        flex: 1,
        flexDirection: 'column',
        padding: 5
    },
    fullScreenImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '40%',
        width: '100%',
        resizeMode: 'contain'
    },
    imageViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContainerViewStyle: {
        flex: 1,
        backgroundColor: Colors.white
    },
    galleryImageStyle: {
        padding: 3,
        justifyContent: 'space-between',
        height: 100
    }
});
