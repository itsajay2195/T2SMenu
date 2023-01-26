import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const CancelOrderScreenStyle = StyleSheet.create({
    mainContainer: { flex: 1 },
    radioButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 8,
        paddingLeft: 18
    },
    cancelOrderTitleText: {
        paddingVertical: 15,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dividerStyle: {
        height: 2,
        width: '100%',
        borderColor: Colors.dividerGrey,
        borderBottomWidth: 1
    },
    submitButtonContainer: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'flex-end'
    },
    textInputContainer: {
        backgroundColor: Colors.grey,
        marginHorizontal: 15,
        borderRadius: 5,
        margin: 5,
        padding: 15
    },
    cancelReasonListContainer: {
        paddingHorizontal: 5
    },
    buttonView: { flexDirection: 'row', justifyContent: 'space-around' },
    DontCancelButtonView: { borderColor: Colors.primaryColor, borderWidth: 1 },
    DontCancelButtonText: { color: Colors.primaryColor, fontFamily: FONT_FAMILY.REGULAR },
    CancelBtnContainer: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1
    }
});
