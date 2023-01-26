import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootStyle: {
        flex: 1
    },
    addressText: {
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.REGULAR
    },
    radioButtonStyle: {
        alignSelf: 'center'
    },

    primaryViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        position: 'absolute',
        right: 0
    },
    radioButtonContainerView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2
    },
    radioButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    rootContainerStyle: {
        paddingVertical: 5
    },
    itemDividerStyle: {
        width: '100%',
        height: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: Colors.lighterGrey
    },

    addAddressStyle: {
        width: '100%',
        height: 50,
        justifyContent: 'center'
    },
    addressTextStyle: {
        fontSize: setFont(16),
        paddingLeft: 20,
        fontFamily: FONT_FAMILY.REGULAR,
        justifyContent: 'flex-start'
    },
    addressContainer: {
        flexDirection: 'row',
        bottom: 0 //Here is the trick
    },
    addressIconstyle: {
        position: 'absolute',
        right: 0,
        paddingRight: 20
    },
    primaryTextStyle: {
        backgroundColor: Colors.primaryColor,
        color: 'white',
        fontSize: setFont(10),
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        textAlign: 'center',
        width: 60,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
        alignSelf: 'flex-end'
    }
});
