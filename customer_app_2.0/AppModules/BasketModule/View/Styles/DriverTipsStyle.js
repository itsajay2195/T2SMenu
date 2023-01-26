import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    container: {
        paddingHorizontal: 8
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: 'bold'
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        alignContent: 'center',
        backgroundColor: Colors.grey,
        marginBottom: 10,
        borderRadius: 5
    },
    tipContainer: {
        flex: 1
    },
    inActiveTip: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 5
    },
    activeTip: {
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.dividerGrey
    },
    customTip: {
        flex: 1,
        bottom: 13
    },
    inActiveTextStyle: {
        color: Colors.black,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.BOLD
    },
    activeTextStyle: {
        color: Colors.textBlue,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.BOLD
    },
    iconStyle: {
        margin: 2
    },
    customView: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    customInput: {
        fontSize: setFont(14),
        textAlign: 'center',
        justifyContent: 'flex-end',
        top: 10,
        fontFamily: FONT_FAMILY.BOLD,
        padding: 5
    },
    tipsDivider: { width: 1, backgroundColor: Colors.ashColor, height: 20 },
    tipsValueText: { fontSize: setFont(14), padding: 10, textAlign: 'center', fontFamily: FONT_FAMILY.SEMI_BOLD, fontWeight: '600' },
    addTipTitleText: { flexDirection: 'row', alignItems: 'center', padding: 5 }
});
