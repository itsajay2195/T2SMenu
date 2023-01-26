import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rippleStyle: {
        paddingHorizontal: 4,
        borderRadius: 5
    },
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    contentStyle: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    arrowStyleDelivery: {
        color: Colors.white,
        marginRight: -5,
        paddingTop: 3
    },
    deliveryButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.shadowGrey,
        borderRadius: 6,
        opacity: 0.8,
        margin: 5,
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    deliveryButtonContainerWithoutBg: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    deliveryButtonText: {
        fontSize: setFont(15),
        color: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.MEDIUM,
        paddingLeft: 5
    },
    collectionIconStyle: {
        marginBottom: 2,
        padding: 2
    },
    deliveryIconStyle: {
        padding: 2
    }
});
