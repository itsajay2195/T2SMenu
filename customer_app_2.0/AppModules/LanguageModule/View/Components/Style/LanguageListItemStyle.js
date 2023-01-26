import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../../T2SBaseModule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    flatListTouchable: {
        flex: 1,
        backgroundColor: Colors.white
    },
    languageListItemText: {
        textAlign: 'left',
        paddingTop: 15,
        paddingBottom: 3,
        color: Colors.black,
        marginHorizontal: 15,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(15)
    },
    descriptionText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(15),
        marginHorizontal: 15,
        paddingBottom: 15,
        color: Colors.suvaGrey
    },
    flexDirectionRowContainer: {
        flex: 1,
        elevation: 10,
        flexDirection: 'row'
    },
    flexDirectionColumnContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    tick: {
        paddingRight: 15,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});
