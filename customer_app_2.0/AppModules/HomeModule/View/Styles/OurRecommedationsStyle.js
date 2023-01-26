import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rowContainer: {
        flex: 1,
        marginVertical: 6,
        flexDirection: 'row'
    },
    firstRowContainer: {
        flex: 1.6
    },
    nameItemStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        flex: 1,
        paddingRight: 6
    },
    priceItemStyle: {
        fontSize: setFont(14),
        paddingRight: 4,
        marginHorizontal: 5,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    addButtonStyle: {
        borderColor: Colors.primaryColor,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: Colors.white
    },
    addButtonContentStyle: {
        height: 30
    },
    addButtonTextStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    descriptionStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        flex: 0.7,
        fontSize: setFont(12),
        flexDirection: 'row',
        color: Colors.secondaryTextColor,
        flexWrap: 'wrap'
    },
    searchInputStyle: {
        paddingLeft: 0
    },
    priceItemViewStyle: { alignItems: 'center', paddingVertical: 5 }
});
