import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const style = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        padding: 3
    },
    leftSideCardContainer: {
        margin: 3
    },
    rightSideCardContainer: {
        margin: 3
    },
    radio: {
        fontSize: setFont(30),
        margin: 3
    },
    cardTypeStyle: {
        margin: 2,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    },
    cardholderNameStyle: {
        margin: 2,
        fontFamily: FONT_FAMILY.THIN,
        fontSize: setFont(14)
    },
    cardNumberStyle: {
        margin: 2,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    },
    cardExpiryStyle: {
        margin: 2,
        fontFamily: FONT_FAMILY.THIN,
        fontSize: setFont(14)
    },
    flex: { flex: 1 }
});
