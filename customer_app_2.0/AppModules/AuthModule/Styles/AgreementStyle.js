import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const AgreementStyle = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    checkBoxView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginRight: 12
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 6
    },
    privacyPolicyView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
        marginTop: 10,
        marginStart: 10,
        marginBottom: 5
    },
    privacyPolicyMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5
    },
    promotionsText: {
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    promotionTextViewStyle: {
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    termsAndConditionView: {
        padding: 10
    },
    termsAndConditionContentText: {
        marginTop: 10,
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.REGULAR
    },
    contactPermissionView: {
        marginLeft: 10
    },
    commonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryTextColor
    },
    headerTextStyle: {
        fontSize: setFont(18),
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY.REGULAR
    },
    buttonStyle: {
        width: '80%',
        height: 50,
        marginTop: 30,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'center'
    },
    buttonTextStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.white,
        width: '100%',
        textAlign: 'center'
    }
});
