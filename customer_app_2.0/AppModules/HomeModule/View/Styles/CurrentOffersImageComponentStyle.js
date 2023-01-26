import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { customerAppTheme } from '../../../../CustomerApp/Theme';

export default StyleSheet.create({
    paginationStyle: { position: 'absolute', bottom: 0, top: 0, right: 0, left: 0 },
    dotStyle: {
        backgroundColor: 'transparent',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
        borderColor: '#BBBBBB',
        borderWidth: 1,
        alignSelf: 'flex-end'
    },
    activeDotStyle: {
        backgroundColor: Colors.primaryColor,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
        alignSelf: 'flex-end'
    },
    cardStyle: { height: 180, elevation: 6, flex: 1, backgroundColor: customerAppTheme.colors.background }
});
