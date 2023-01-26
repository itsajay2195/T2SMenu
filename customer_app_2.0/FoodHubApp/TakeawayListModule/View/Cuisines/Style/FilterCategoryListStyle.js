import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../../T2SBaseModule/Utils/ResponsiveFont';

export const filterStyle = StyleSheet.create({
    mainContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    iconStyle: {
        marginRight: 10
    },
    detailedContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioTextStyle: {
        marginLeft: 10,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        marginTop: 5
    },
    dividerStyle: {
        borderColor: Colors.dividerGrey,
        borderBottomWidth: 1,
        marginHorizontal: 10,
        marginTop: 10
    },
    filterRowStyle: {
        backgroundColor: Colors.white,
        paddingVertical: 14,
        height: 60,
        marginTop: 0,
        flexDirection: 'column'
    }
});
