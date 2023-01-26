import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from '../../../../../T2SBaseModule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    rowBackGroundViewContainer: {
        paddingTop: 5,
        flexDirection: 'row',
        shadowColor: Colors.shadowGrey,
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: 5,
        shadowOpacity: 0.1,
        backgroundColor: Colors.white
    },
    rowTitleContentView: {
        marginLeft: 10,
        paddingLeft: 7,
        flex: 1
    },
    rowTitleText: {
        width: '70%',
        fontSize: setFont(16),
        marginBottom: 5,
        color: Colors.black,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    description: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.black,
        marginBottom: 10
    },
    dateContentView: {
        padding: 5,
        paddingRight: 12
    },
    dateText: {
        color: Colors.suvaGrey,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10)
    }
});
