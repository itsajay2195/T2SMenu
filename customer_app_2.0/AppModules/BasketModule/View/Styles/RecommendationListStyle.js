import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';
const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#F7F5EE',
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 140,
        justifyContent: 'center'
    },
    itemContainer: {
        flexDirection: 'row',
        marginVertical: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.mongoose
    },
    nameStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    buttonContentStyle: {
        padding: 0,
        height: 30,
        width: 90
    },
    buttonStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 4
    },
    buttonTextStyle: {
        fontSize: setFont(12),
        color: Colors.primaryColor
    },
    priceTextStyle: {
        flex: 0.3,
        fontSize: setFont(14),
        textAlign: 'right',
        color: Colors.primaryTextColor
    },
    nameContainer: {
        flex: 1,
        marginRight: 8
    }
});
export default styles;
