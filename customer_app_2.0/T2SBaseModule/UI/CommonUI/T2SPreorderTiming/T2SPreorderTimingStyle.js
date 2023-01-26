import { StyleSheet } from 'react-native';
import Colors from '../../../Themes/Colors';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const style = StyleSheet.create({
    container: {
        margin: 5
    },
    timeContainer: {
        padding: 4,
        borderRadius: 5,
        backgroundColor: Colors.white,
        margin: 5,
        width: 85,
        borderColor: Colors.lightGrey,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM
    },
    dateTextStyle: {
        fontSize: setFont(8),
        color: Colors.bigFoodieOrange
    },
    selectedTimeContainer: {
        backgroundColor: Colors.bigFoodieOrange
    },
    selectedTimeText: {
        color: Colors.white
    },
    asapTextStyle: {
        fontSize: setFont(10)
    },
    selectedAsapText: {
        color: Colors.white
    }
});
