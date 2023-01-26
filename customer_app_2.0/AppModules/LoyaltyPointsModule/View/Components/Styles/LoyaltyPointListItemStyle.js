import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    loyaltyListItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        shadowOffset: {
            width: 0,
            height: 1
        }
    },
    loyaltyListItem: {
        flex: 1,
        marginLeft: 5
    },
    loyaltyListItemText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        flexWrap: 'wrap',
        paddingHorizontal: 10
    },
    verticalDivider: {
        backgroundColor: Colors.backgroundGrey,
        width: 1,
        height: 50
    }
});
