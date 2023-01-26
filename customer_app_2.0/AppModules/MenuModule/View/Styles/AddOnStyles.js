import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    parentContainer: {
        flex: 1
    },
    clearTextStyle: {
        color: Colors.lightBlue,
        fontSize: setFont(13),
        paddingVertical: 8,
        paddingHorizontal: 5,
        fontFamily: FONT_FAMILY.REGULAR
    },
    selectTextContainer: {
        margin: 10,
        marginTop: 0
    },
    selectTextStyle: {
        marginTop: 16,
        color: Colors.lightOrange,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    divider: {
        borderRadius: 6,
        borderColor: Colors.dividerGrey,
        shadowColor: Colors.dividerGrey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 7,
        height: 5
    },
    modifierAddOnParentContainer: {
        flexDirection: 'row'
    },
    modifierAddOnContainer: {
        margin: 10,
        marginBottom: 20
    },
    defaultModifierStyle: {
        flex: 1,
        borderRadius: 2,
        borderWidth: 1,
        alignItems: 'center',
        margin: 5,
        padding: 5,
        justifyContent: 'center'
    },
    modifierFont: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    },
    modifierAddOnStyle: {
        borderColor: Colors.modifier
    },
    selectedModifierAddOnStyle: {
        backgroundColor: Colors.modifier,
        borderColor: Colors.modifier
    },
    noModifierAddOnStyle: {
        borderColor: Colors.BittersweetRed
    },
    noSelectedModifierAddOnStyle: {
        backgroundColor: Colors.BittersweetRed,
        borderColor: Colors.BittersweetRed
    },
    scrollContainer: {
        marginBottom: 70,
        marginHorizontal: 10
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingVertical: 10,
        flex: 3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dividerGrey
    },
    itemFontStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(16),
        color: Colors.black
    },
    itemStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        marginEnd: 8
    },
    modifierTextStyle: {
        color: Colors.modifier
    },
    modifierNoTextStyle: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.BittersweetRed,
        color: Colors.BittersweetRed
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    amountText: {
        marginEnd: 6
    },
    bottomButtonContainer: {
        height: 52,
        backgroundColor: Colors.primaryColor,
        borderRadius: 4,
        // paddingStart: 12,
        margin: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2
    },
    bottomButtonStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonTextStyle: {
        color: Colors.white,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 10
    },
    addOnTotalText: {
        color: Colors.white,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        paddingHorizontal: 10
    },
    addOnTotalAmtText: {
        color: Colors.white,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.REGULAR
    },
    addOnListContainer: { flex: 1 },
    continueButtonStyle: {
        height: '100%',
        justifyContent: 'center',
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6
    },
    addOnTouchableArea: {
        left: 100
    },
    addonLoaderView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
