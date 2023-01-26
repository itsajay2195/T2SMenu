import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const CuisinesStyle = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.white,
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.lightGrey
    },
    dividerStyle: {
        borderColor: Colors.dividerGrey,
        borderBottomWidth: 1,
        marginHorizontal: 10
    },
    checkBoxStyle: {
        color: Colors.primaryColor,
        paddingRight: 3
    },
    unFillCheckBoxStyle: {
        paddingRight: 3
    },
    detailedContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center'
    },
    CuisineTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(15),
        color: Colors.primaryTextColor
    }
});
