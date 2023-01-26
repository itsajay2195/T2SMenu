import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export default StyleSheet.create({
    bgStyle: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    rootContainerStyle: {
        flex: 1,
        backgroundColor: 'rgba(35,35,35,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainerStyle: {
        backgroundColor: Colors.white,
        width: '70%',
        maxWidth: 215,
        maxHeight: 270,
        flexDirection: 'column',
        padding: 20,
        borderRadius: 5
    },
    headerViewStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 5
    },
    headerTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        alignSelf: 'center',
        color: Colors.black
    },
    listItemStyle: {
        padding: 10,
        justifyContent: 'center'
    },
    listItemText: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black
    },
    itemSeparator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.gallery
    },
    roundedCornerStyle: {
        borderRadius: 10,
        borderWidth: 1
    },
    dynamicHeightStyle: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    closeIconStyle: {
        padding: 5
    },
    textStyle: {
        fontFamily: FONT_FAMILY.REGULAR,
        color: Colors.lightBlue,
        fontSize: setFont(8),
        textAlign: 'right'
    },
    innerListItemStyle: {
        flexDirection: 'column',
        alignSelf: 'baseline'
    }
});
