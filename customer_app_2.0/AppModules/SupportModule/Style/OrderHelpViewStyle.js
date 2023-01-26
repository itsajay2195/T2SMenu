import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const OrderHelpViewStyle = StyleSheet.create({
    itemViewStyle: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemTextStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16)
    },
    dividerStyle: {
        height: 2,
        width: '100%',
        borderColor: Colors.dividerGrey,
        borderBottomWidth: 1
    },
    expandViewStyle: {
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: -15
    },
    expandContentStyle: {
        color: Colors.suvaGrey,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    commonLinkTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightBlue
    },
    numberTextStyle: {
        padding: 15,
        color: Colors.textBlue,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    buttonMainContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 10
    },
    buttonViewStyle: {
        marginHorizontal: 20,
        paddingHorizontal: 20,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8
    },
    buttonTextStyle: {
        color: Colors.primaryColor,
        padding: 15
    },
    btnBottomText: {
        textAlign: 'center',
        fontSize: setFont(10),
        padding: 5,
        color: Colors.suvaGrey
    },
    buttonView: {
        flexDirection: 'row',
        paddingBottom: 10,
        marginTop: -3,
        width: '100%',
        justifyContent: 'space-evenly'
    },
    cancelTextStyle: {
        color: Colors.suvaGrey,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        paddingVertical: 10,
        textAlign: 'justify'
    },
    customButtonView: {
        marginLeft: 20,
        justifyContent: 'space-between'
    }
});
