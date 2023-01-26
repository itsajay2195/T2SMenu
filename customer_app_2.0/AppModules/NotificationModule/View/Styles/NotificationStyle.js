import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export const notificationStyle = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: Colors.backgroundGrey
    },
    headerLeftContainerView: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    deleteButtonViewStyle: {
        height: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: Colors.persianRed
    },
    deleteView: {
        backgroundColor: Colors.persianRed,
        width: 100,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButtonStyle: {
        width: 100,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.persianRed
    },
    deleteTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.white,
        fontSize: setFont(14)
    },
    topDividerStyle: {
        paddingTop: 1,
        shadowColor: Colors.shadowGrey,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 5,
        shadowOpacity: 0.4
    },
    noNotificationContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundGrey
    },
    noNotificationText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.suvaGrey
    },
    swipeListViewStyle: {
        flex: 1
    },
    clearAllText: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightBlue,
        fontSize: setFont(14),
        padding: 5
    },
    orderNowText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    orderNowButton: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        marginTop: 15
    }
});
