import { StyleSheet } from 'react-native';
import { isFranchiseApp } from 't2sbasemodule/Utils/helpers';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        margin: 5
    },
    imageViewContainer: {
        flex: 1,
        marginLeft: 15,
        marginBottom: 20
    },
    imageView: {
        aspectRatio: isFranchiseApp() ? 5 : 5.68,
        height: 25
    }
});
