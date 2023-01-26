import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';

const styles = StyleSheet.create({
    buttonHeightStyle: {
        height: 52,
        backgroundColor: Colors.primaryColor,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4
    },
    rippleStyle: {
        flex: 1,
        height: '100%',
        justifyContent: 'center'
    },
    addItemStyle: {
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6
    },
    checkoutStyle: {
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6
    },
    rippleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        flex: 1,
        letterSpacing: 2.5,
        color: Colors.white
    },
    addItemTextStyle: {
        textAlign: 'left',
        paddingLeft: 8
    },
    checkoutTextStyle: {
        textAlign: 'right',
        paddingRight: 8
    },
    verticalDivider: {
        backgroundColor: Colors.white,
        height: '30%',
        width: 1
    },
    leftIconStyle: {
        paddingLeft: 8
    },
    rightIconStyle: {
        marginRight: 8,
        transform: [{ rotate: '180deg' }]
    }
});

export default styles;
