import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginTop: 20,
        margin: 16,
        justifyContent: 'space-between',
        height: 180
    },
    slide1: {
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: setFont(15),
        color: Colors.black
    },
    leftIconStyle: {
        paddingLeft: 8
    },
    lottieAnimationStyle: {
        width: '100%',
        flexGrow: 1,
        alignSelf: 'center'
    },
    progressStyle: {
        backgroundColor: Colors.lightGrayShade,
        height: 8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    successContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.lightGrayShade,
        alignItems: 'center',
        justifyContent: 'center'
    },
    successText: {
        fontSize: setFont(16),
        color: Colors.black
    }
});
