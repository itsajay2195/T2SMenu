import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../T2SBaseModule/Utils/ResponsiveFont';

export const FavouriteTakeawayStyle = StyleSheet.create({
    headersBottomViewStyle: {
        borderTopColor: Colors.dividerGrey,
        borderTopWidth: 2
    },
    alternateHeaderSearchBarStyle: {
        borderRadius: 8,
        backgroundColor: Colors.lighterGrey,
        height: 35,
        width: '85%',
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    searchBarStyle: {
        borderRadius: 5,
        backgroundColor: Colors.grey,
        height: 32,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchTextStyle: {
        color: Colors.primaryTextColor,
        fontSize: setFont(14),
        flex: 1,
        paddingLeft: 8,
        marginVertical: 2,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingBottom: 0,
        paddingTop: 0
    },
    headerContainer: {
        flex: 1,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchIconStyle: {
        left: 2,
        bottom: 1,
        paddingRight: 12
    },
    headerHeartIconStyle: {
        alignItems: 'center',
        marginHorizontal: 5,
        paddingLeft: 3
    },
    headerHeight: {
        height: 100
    },
    fullFlex: {
        flex: 1
    }
});
