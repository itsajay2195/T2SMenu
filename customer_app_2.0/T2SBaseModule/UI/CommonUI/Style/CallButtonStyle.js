import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors } from '../../../Themes';
import { setFont } from '../../../Utils/ResponsiveFont';
let deviceWidth = Dimensions.get('window').width - 50;

export const CallButtonStyle = StyleSheet.create({
    buttonMainContainer: { alignSelf: 'flex-start' },
    buttonViewStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth / 2.1
    },
    buttonTextStyle: {
        color: Colors.primaryColor,
        paddingVertical: 10
    },
    btnBottomText: { textAlign: 'center', fontSize: setFont(10), padding: 5, color: Colors.suvaGrey },
    customBottomMargin: { marginBottom: Platform.OS === 'ios' ? 15 : 30 }
});
