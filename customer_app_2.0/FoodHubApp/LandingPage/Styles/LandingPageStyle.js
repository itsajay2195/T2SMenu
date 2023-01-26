import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import Colors from 't2sbasemodule/Themes/Colors';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';
export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    headerStyle: {
        height: 70,
        justifyContent: 'center'
    },
    headerIconStyle: {
        marginLeft: 10,
        marginTop: 30,
        padding: 10
    },
    imageContainer: { flex: 4 },
    countriesContainer: { flex: 6, marginTop: 30 },
    countriesListContainer: {
        backgroundColor: Colors.mildlightgrey
    },
    backgroundImage: { width: '100%', height: undefined, aspectRatio: 1 / 0.63066 },
    foodHubLogoImage: {
        position: 'absolute',
        width: '60%',
        height: undefined,
        aspectRatio: 1 / 0.176029,
        top: '48%',
        alignSelf: 'center'
    },
    splashImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    foodHubLogoStyle: {
        height: 50,
        margin: 20
    },
    countryDescContainer: {
        position: 'absolute',
        width: '80%',
        textAlign: 'center',
        top: '75%',
        alignSelf: 'center'
    },
    countryDesc: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        color: Colors.primaryTextColor,
        textAlign: 'center'
    },
    boldText: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: Colors.darkBlack,
        fontSize: setFont(16)
    },
    countryHeader: {
        color: Colors.lightOrange,
        paddingHorizontal: 24,
        fontSize: setFont(13),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    countryListStyle: { marginHorizontal: 20 },
    countryPickerItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 16,
        paddingHorizontal: 18,
        marginTop: 5
    },
    countryItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingEnd: 8
    },
    countryItemDivider: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.dividerGrey
    },
    countryItemIcon: {
        width: undefined,
        height: 15,
        aspectRatio: 1.8387,
        marginStart: 4,
        marginEnd: 10
    },
    countryItemTxt: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14),
        flex: 1,
        color: Colors.black
    },
    paddingTop32: {
        paddingTop: 32
    },
    paddingBottom32: {
        paddingBottom: 32
    },
    tickIconStyle: {
        paddingVertical: 5,
        paddingHorizontal: 10
    }
});
