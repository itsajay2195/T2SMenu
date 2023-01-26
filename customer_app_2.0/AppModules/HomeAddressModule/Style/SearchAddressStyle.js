import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey,
        flexDirection: 'column'
    },
    header: {
        paddingHorizontal: 10,
        elevation: 0,
        height: 55,
        zIndex: 10,
        backgroundColor: Colors.white
    },
    searchHeaderContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 56,
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    iosElevation: {
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.62,
        paddingHorizontal: 10,
        elevation: 0,
        height: 55,
        zIndex: 10,
        backgroundColor: Colors.white
    },
    androidElevation: {
        elevation: 4
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.white
    },
    suggestionItemContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 14,
        alignItems: 'center'
    },
    addManualContainer: {
        flexDirection: 'row',
        padding: 14,
        alignItems: 'center'
    },
    suggestionItemText: {
        flex: 1,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        paddingVertical: 14,
        paddingStart: 4
    },
    suggestionItemTextHighlight: {
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    suggestionDivider: {
        height: 1,
        backgroundColor: Colors.dividerGrey,
        marginHorizontal: 12
    },
    noSuggestionItem: {
        alignSelf: 'center',
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        paddingVertical: 12
    },
    searchIcon: {
        marginStart: 12
    },
    searchInput: {
        flex: 1,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.black,
        paddingHorizontal: 8
    },
    clearIcon: {
        paddingHorizontal: 8
    },
    cancelButtonContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    cancelButton: {
        paddingHorizontal: 12,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.lightBlue
    },
    suggestionLocationIcon: {
        color: Colors.gunmetal
    },
    currentLocationTxt: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: 14,
        color: Colors.black,
        marginStart: 12
    },
    addManualIcon: {
        color: Colors.textBlue
    },
    manualText: {
        color: Colors.textBlue,
        marginHorizontal: 5
    },
    currentLocationContainer: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    currLocationErrorTxt: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: 12,
        color: Colors.lightBrown,
        marginStart: 12
    },
    currentLocationHeader: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: '800'
    },
    savedAddressHeader: {
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.BOLD,
        fontWeight: '800',
        padding: 5,
        paddingHorizontal: 12
    },
    locationContainer: { flexDirection: 'row', alignItems: 'center' },
    currentLocationView: { paddingTop: 20 },
    GPSContainer: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationDisabledText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.textBlue
    },
    editIcon: { padding: 10 }
});
