import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

const { text, secondaryText } = customerAppTheme.colors;
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        paddingHorizontal: 6,
        width
    },
    divider: {
        height: 5
    },
    reviewContainer: {
        flex: 1,
        margin: 5,
        marginTop: 10
    },
    nameDateContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: setFont(14),
        color: text,
        fontFamily: FONT_FAMILY.REGULAR,
        width: '45%',
        marginLeft: 10,
        marginTop: 2
    },
    date: {
        fontSize: setFont(12),
        color: secondaryText,
        fontFamily: FONT_FAMILY.REGULAR,
        marginTop: 3
    },
    logo: {
        marginRight: 8
    },
    starContainer: {
        marginLeft: 2,
        flex: 0.7,
        flexDirection: 'row'
    },
    dateContainer: {
        flexDirection: 'row',
        marginBottom: 2,
        justifyContent: 'space-between'
    },
    star: {
        fontSize: setFont(20),
        marginLeft: -4,
        color: Colors.rating_color
    },
    starUnselected: {
        fontSize: setFont(20),
        marginLeft: -4,
        color: Colors.rating_grey
    },
    messageStyle: {
        fontSize: setFont(12),
        marginTop: 5,
        color: Colors.textGreyColor,
        fontFamily: FONT_FAMILY.REGULAR
    },
    homeScreenReviewTextStyle: {
        fontSize: setFont(13),
        marginTop: 5,
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR,
        marginBottom: 10
    },
    responseHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    response: {
        color: Colors.primaryColor,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR,
        width: '90%'
    },
    responseIcon: {
        fontSize: setFont(20),
        color: Colors.primaryColor
    },
    commentsContainer: {
        flex: 1,
        marginTop: 0
    },
    portalLogo: {
        aspectRatio: 5.68,
        height: 10,
        marginTop: 5
    },
    responseViewStyle: {
        paddingHorizontal: 8
    },
    homeScreenResponseHeadingStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 7,
        marginTop: -5
    },
    homeScreenResponseTextStyle: {
        fontSize: setFont(13),
        color: Colors.black,
        fontFamily: FONT_FAMILY.REGULAR,
        marginVertical: 5,
        marginLeft: 10
    },
    message: {
        fontSize: setFont(12),
        marginTop: 5,
        color: Colors.textGreyColor,
        fontFamily: FONT_FAMILY.REGULAR,
        marginLeft: 5
    },
    homeScreenResponseViewStyle: {
        backgroundColor: 'white'
    },
    reviewAllResponseViewStyle: {
        marginLeft: 5
    }
});
