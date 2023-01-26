import { StyleSheet } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../T2SBaseModule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    imageContainer: { marginTop: 10, alignItems: 'center', justifyContent: 'center' },
    imageStyle: { height: 300, width: 300 },
    searchStyle: {
        borderRadius: 6,
        flexDirection: 'row',
        height: 45,
        borderWidth: 1,
        borderColor: Colors.silver,
        backgroundColor: Colors.white,
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
        paddingStart: 8,
        paddingEnd: 4,
        paddingVertical: 4
    },
    searchContainerStyle: {
        flex: 1
    },
    headerMainContainer: {
        flexDirection: 'column',
        elevation: 4
    },
    headerContentSearchBar: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    errorTextStyle: {
        fontSize: setFont(18),
        color: '#F7D823',
        fontFamily: FONT_FAMILY.REGULAR,
        textAlign: 'center',
        position: 'absolute',
        paddingBottom: 50
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 10,
        flex: 1
    },
    buttonContainer: {
        backgroundColor: Colors.secondary_color,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 10
    },
    buttonStyle: {
        color: Colors.white,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(15)
    }
});
