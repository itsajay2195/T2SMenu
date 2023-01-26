import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootContainer: {
        margin: 0,
        marginTop: -80
    },
    marginContainer: {
        margin: 10
    },
    iconStyle: {
        paddingLeft: 20
    },
    horizontalContainer: {
        flexDirection: 'row',
        marginVertical: 5
    },
    leftItemsContainer: {
        flex: 1.2,
        marginRight: 20
    },
    flatTextInputContainer: {
        flex: 1.7
    },
    cityTextInputContainer: {
        marginVertical: 5
    },
    stateTextInputContainer: {
        marginVertical: 5
    },
    primaryAddressUpdateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 25
    },
    primaryAddressUpdateTextDisplayStyle: {
        marginTop: 7,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    saveButtonTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(14)
    },
    mainContainer: {
        flex: 1
    },
    permissionViewStyle: {
        padding: 10,
        backgroundColor: Colors.dark_grey
    },
    permissionTextStyle: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    appBarActionStyle: { flexDirection: 'row' },
    fuzzySearchViewStyle: {
        height: 180,
        position: 'absolute',
        left: 2,
        right: 4,
        bottom: 30,
        zIndex: 100,
        justifyContent: 'flex-end'
    },
    fussySearchFlatListStyle: { backgroundColor: '#F9F9F9', paddingTop: 8 },
    fussySearchItemStyle: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: Colors.lightGrey
    },
    instructionText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: 16,
        color: Colors.lightGreyText,
        marginTop: 5
    },
    buttonContainer: {
        alignSelf: 'center',
        width: '95%',
        marginBottom: 10
    },
    doorAndFlatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 10
    },
    doorViewStyle: { width: '40%', marginRight: 10, flexDirection: 'column' },
    flatView: { width: '60%' },
    buttonView: { flex: 1, justifyContent: 'flex-end' }
});
