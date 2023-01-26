import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../../../Utils/Constants';
import Colors from '../../../../Themes/Colors';
import { setFont } from '../../../../Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    fillContainer: {
        flex: 1
    },
    container: {
        ...StyleSheet.absoluteFillObject
    },
    containerDetailed: {
        ...StyleSheet.absoluteFillObject,
        top: 35,
        marginTop: 20
    },
    title: {
        padding: 15,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.secondary_color,
        fontSize: setFont(16)
    },
    listItem: {
        flexDirection: 'row',
        padding: 15
    },
    listTitle: {
        flex: 1,
        fontSize: setFont(14),
        alignSelf: 'center',
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    animatedText: {
        fontSize: setFont(14),
        alignItems: 'center',
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    listDescription: {
        flex: 3,
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.MEDIUM,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    iconStyle: {
        height: 18,
        width: 40
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dividerGrey,
        marginLeft: 10
    },
    subTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3
    },
    backButton: {
        color: Colors.lightBlue,
        fontSize: setFont(22),
        padding: 10,
        paddingLeft: 15,
        paddingRight: 5
    },
    arrowRight: {
        fontSize: setFont(20),
        textAlignVertical: 'center'
    },
    preOrderViewStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.lightBlue,
        marginRight: 8,
        paddingHorizontal: 5,
        borderRadius: 2
    },
    preOrderTextStyle: {
        color: Colors.white,
        fontSize: setFont(8),
        fontFamily: FONT_FAMILY.REGULAR,
        margin: 2
    },
    valueStyle: {
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.REGULAR,
        marginTop: -2
    },
    totalValueStyle: {
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.MEDIUM,
        marginTop: -2
    },
    preOrderContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    takeawayNameLabelStyle: {
        color: Colors.darkBlack,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    applePayIconStyle: {
        height: 18,
        width: 40
    },
    GPayIconStyle: {
        height: 25,
        width: 60
    }
});
