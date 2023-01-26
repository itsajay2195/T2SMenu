import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootStyle: {
        flex: 1
    },
    divider: {
        height: 1
    },
    rootContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    cashRootContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    childContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cashTextStyle: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        alignSelf: 'center',
        color: Colors.black
    },
    checkBoxStyle: {
        paddingVertical: 10,
        alignSelf: 'center'
    },
    radioButtonStyle: {
        paddingVertical: 10,
        alignSelf: 'center'
    },
    cardMainContainer: {
        paddingVertical: 5,
        flex: 1,
        flexDirection: 'row'
    },
    cardDetailsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 0.3
    },
    cardTypeText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black,
        flex: 0.7
    },
    cardExpiryDateText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.suvaGrey
    },
    cardNumberText: {
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontWeight: 'bold',
        color: Colors.black
    },
    notApplicableText: {
        fontSize: setFont(12),
        paddingHorizontal: 5,
        fontFamily: FONT_FAMILY.MEDIUM,
        alignSelf: 'center',
        color: Colors.suvaGrey
    },
    notApplicableHintText: {
        fontSize: setFont(12),
        backgroundColor: Colors.tip_bg_Black,
        color: Colors.white
    },
    toolTipContentStyle: {
        backgroundColor: Colors.tip_bg_Black
    },
    toolTipArrowStyle: {
        marginLeft: 0
    },
    toolTipViewStyle: {
        // i'm putting this because disableShadow prop is not respecting in ios - ToolTip Component
        shadowOpacity: 0.0,
        shadowRadius: 0.0,
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 0
    },
    toolTipArrowSize: {
        width: 16,
        height: 15
    },
    toolTipDisplayInsets: {
        top: 24,
        bottom: 24,
        left: 24,
        right: 5
    },
    infoIconStyle: {
        paddingHorizontal: 8
    }
});
