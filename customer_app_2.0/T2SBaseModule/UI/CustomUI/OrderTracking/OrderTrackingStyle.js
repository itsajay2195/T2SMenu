import { StyleSheet } from 'react-native';

import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    orderTrackingContainer: {
        paddingTop: 8,
        paddingBottom: 15,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    statusPointContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 23
    },
    dummyView: {
        flex: 1,
        height: 2,
        alignSelf: 'center'
    },
    statusPoint: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 2,
        alignSelf: 'center'
    },
    lineViewHorizontal: {
        height: 2,
        flex: 1,
        marginHorizontal: 5
    },
    statusTextContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginTop: 0
    },
    statusTextView: {
        width: 84,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        letterSpacing: 0
    },
    statusTextViewHorizontal: {
        flex: 1,
        marginHorizontal: 5
    },
    statusIcon: {
        paddingHorizontal: 5,
        alignSelf: 'center'
    },
    statusText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    lottieAnimationStyle: {
        width: 43,
        height: 43
    }
});
