import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    cardStyle: {
        height: 152,
        width: 170,
        borderRadius: 6,
        marginHorizontal: 10,
        marginVertical: 10,
        backgroundColor: Colors.whiteSmoke,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.0,
        elevation: 1
    },
    containerStyle: {
        flex: 1,
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 10
    },
    nameContentStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black
    },
    bottomContainerStyle: {
        paddingHorizontal: 14,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    priceItemStyle: {
        fontSize: setFont(14),
        justifyContent: 'center',
        alignSelf: 'center',
        marginRight: 12,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    addButtonStyle: {
        borderColor: Colors.primaryColor,
        borderRadius: 2,
        marginLeft: 10,
        borderWidth: 1,
        backgroundColor: Colors.white
    },
    addButtonContentStyle: { height: 30 },
    addButtonTextStyle: {
        color: Colors.primaryColor,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    descriptionStyle: {
        color: Colors.secondaryTextColor,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        textAlignVertical: 'center',
        marginVertical: 5
    },
    offerLabel: {
        backgroundColor: Colors.secondary_color,
        borderRadius: 2,
        alignSelf: 'flex-start',
        paddingHorizontal: 5,
        paddingVertical: 3,
        left: -1,
        marginBottom: 3
    }
});
