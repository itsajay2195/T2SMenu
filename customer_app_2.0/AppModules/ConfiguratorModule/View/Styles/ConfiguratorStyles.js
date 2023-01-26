import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    headerMenuStyle: {
        height: '100%',
        flexDirection: 'column',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerMenuTextStyle: {
        fontSize: setFont(16),
        color: Colors.blue,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    containerStyle: {
        width: 300
    },
    dropdownContainer: {
        paddingVertical: 12,
        flexDirection: 'column'
    },
    dropdownNameStyle: {
        flex: 1,
        fontSize: setFont(16),
        color: Colors.black,
        fontFamily: FONT_FAMILY.MEDIUM,
        marginStart: 12
    },
    dropDownViewStyle: {
        padding: 10
    },
    dropdownValueStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.middleGrey,
        fontSize: setFont(16),
        marginHorizontal: 12
    },
    valueTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black,
        fontSize: setFont(16)
    },
    labelTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.suvaGrey,
        fontSize: setFont(14)
    },
    arrowStyle: {
        width: 18,
        height: 18,
        position: 'absolute',
        right: 10,
        bottom: 20
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }
});
