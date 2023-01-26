import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const SavedCardStyles = StyleSheet.create({
    noCardView: {
        flex: 1,
        backgroundColor: Colors.white
    },
    noCardText: {
        position: 'absolute',
        flex: 1,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    mainContainer: {
        borderBottomWidth: 5,
        borderBottomColor: Colors.whiteSmoke,
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.white
    },
    primaryTextContainer: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    deleteIcon: {
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    primaryTextStyle: {
        marginHorizontal: 8,
        marginVertical: 2,
        fontSize: setFont(13),
        color: Colors.white,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        textAlign: 'center'
    },
    cardDetailsContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        flex: 1
    },
    cardDetailText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    containerStyle: {
        flex: 1
    },
    deleteButtonViewStyle: {
        backgroundColor: Colors.persianRed,
        height: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5
    },
    deleteButtonStyle: {
        backgroundColor: Colors.persianRed,
        width: 100,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        color: Colors.white
    }
});
