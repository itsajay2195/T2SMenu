import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { addButtonHeight, addButtonWidth } from 't2sbasemodule/UI/CustomUI/ItemAddButton/AddButtonStyle';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    titleStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.shadowGrey,
        fontSize: setFont(16),
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontWeight: '700'
    },
    rowContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dividerStyle: {
        height: 5,
        backgroundColor: '#EEEEEE'
    },
    dividerStyle1: {
        height: 1,
        marginHorizontal: 12,
        backgroundColor: '#EEEEEE'
    },
    buttonTextStyle: {
        padding: 5,
        color: Colors.white,
        fontSize: setFont(12),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    buttonStyle: {
        marginRight: 2,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        width: addButtonWidth * 3.1,
        alignItems: 'center',
        borderRadius: 2,
        height: addButtonHeight
    },
    contentStyle: {
        height: 30
    },
    dateStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.shadowGrey,
        fontSize: setFont(14),
        fontWeight: '600'
    },
    previousOrderView: {
        backgroundColor: Colors.paleYellow,
        marginTop: 18
    }
});
