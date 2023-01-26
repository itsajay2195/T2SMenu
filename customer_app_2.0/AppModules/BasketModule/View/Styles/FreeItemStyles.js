import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';
const styles = StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    contentContainerStyle: { paddingHorizontal: 10 },
    titleContainerStyle: {
        height: 30,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleTextStyle: {
        color: Colors.secondary_color,
        fontFamily: FONT_FAMILY.REGULAR,
        marginHorizontal: 10,
        fontSize: setFont(16)
    },
    listContainerStyle: {
        marginHorizontal: 10
    },
    addTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryColor,
        margin: 1,
        backgroundColor: Colors.white
    },
    marginHorizontalStyle: {
        marginHorizontal: 0
    },
    addButtonStyle: {
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 4,
        backgroundColor: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(10),
        color: Colors.primaryColor,
        margin: 1,
        paddingHorizontal: 15,
        paddingVertical: 2
    },
    itemStyle: {
        textAlignVertical: 'center',
        fontSize: setFont(16),
        color: Colors.primaryTextColor,
        fontFamily: FONT_FAMILY.REGULAR
    },
    itemNameContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 3
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginTop: 5
    },
    warningText: {
        color: Colors.orange,
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 8
    }
});
export default styles;
