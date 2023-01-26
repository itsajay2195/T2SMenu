import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    buttonContainerStyle: {
        marginHorizontal: 5,
        marginVertical: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 15
    },
    textViewStyle: {
        color: 'white',
        fontSize: setFont(10),
        textAlign: 'center',
        fontFamily: FONT_FAMILY.REGULAR
    },
    imageStyle: {
        flex: 1,
        marginHorizontal: 0,
        marginVertical: 0,
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        aspectRatio: 1
    },
    dayButtonStyles: {
        flex: 1,
        width: '10%'
    },
    dayTextStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
