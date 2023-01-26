import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const MyTicketStyle = StyleSheet.create({
    rootContainer: {
        flex: 1
    },
    loaderView: {
        right: 15
    },
    submitTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    textInputView: {
        marginVertical: 10,
        marginHorizontal: 20
    }
});
