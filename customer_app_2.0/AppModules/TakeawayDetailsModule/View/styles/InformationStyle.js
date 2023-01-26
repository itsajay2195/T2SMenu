import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    infoHeading: {
        color: Colors.secondary_color,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.MEDIUM,
        margin: 10,
        marginTop: 17,
        marginBottom: 0
    },
    headerShadowStyle: {
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.1
    },
    descriptionContainer: {
        margin: 8,
        marginBottom: 15
    },
    descriptionHeading: {
        margin: 2,
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(12),
        color: Colors.mongoose
    },
    description: {
        margin: 2,
        position: 'relative'
    },
    descriptionText: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12)
    },
    descriptionReadMore: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: Colors.white,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12)
    },
    descriptionReadMorefull: {
        textAlign: 'right',
        alignSelf: 'flex-end'
    },
    descriptionReadMoreText: {
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        padding: 3,
        paddingLeft: 5
    },
    sideHeading: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(12),
        margin: 10,
        color: Colors.black
    },
    viewMoreStyle: {
        paddingBottom: 15,
        paddingHorizontal: 5,
        marginTop: -5,
        color: Colors.lightBlue,
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(14)
    },
    viewMoreContainer: { width: '100%', alignItems: 'center', justifyContent: 'center' },
    address: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        margin: 10,
        marginTop: 0
    },
    phone: {
        fontFamily: FONT_FAMILY.REGULAR,
        fontSize: setFont(12),
        margin: 10,
        marginTop: -10,
        color: Colors.textBlue
    },
    mapView: {
        height: 200,
        marginBottom: 13,
        marginHorizontal: 10
    },
    divider: {
        height: 5
    },
    spacing: {
        marginTop: 25
    },
    spacing2: {
        height: 10
    },
    mapPin: {
        height: 45,
        shadowOpacity: 0.5,
        paddingVertical: 4,
        elevation: 3,
        shadowColor: Colors.suvaGrey,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5
    },
    dummyViewTextStyle: {
        opacity: 0,
        position: 'absolute',
        right: 500
    },
    headerCallIcon: {
        paddingHorizontal: 10,
        paddingVertical: 5
    }
});
