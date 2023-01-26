import { StyleSheet } from 'react-native';
import Colors from '../../../../Themes/Colors';
import { FONT_FAMILY } from '../../../../Utils/Constants';
import { CATEGORY_TEXT_HEIGHT } from 'appmodules/MenuModule/Utils/MenuConstants';
import { setFont } from '../../../../Utils/ResponsiveFont';

export default StyleSheet.create({
    listContainer: {
        borderRadius: 5,
        backgroundColor: Colors.white
    },
    categoryTextBg: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        height: CATEGORY_TEXT_HEIGHT,
        backgroundColor: Colors.white
    },
    categoryText: {
        width: '100%',
        alignSelf: 'flex-start',
        color: Colors.black,
        padding: 5,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'left',
        fontWeight: 'normal'
    },
    categoryActiveText: {
        width: '100%',
        alignSelf: 'flex-start',
        color: Colors.black,
        padding: 5,
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.MEDIUM,
        textAlign: 'left',
        fontWeight: 'bold'
    }
});
