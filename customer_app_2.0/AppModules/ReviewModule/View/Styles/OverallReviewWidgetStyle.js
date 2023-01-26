import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const { text } = customerAppTheme.colors;
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    hexagon: {
        height: width * 0.15,
        width: width * 0.15,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewText: {
        color: Colors.white,
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 7
    },
    star: {
        margin: -2,
        color: Colors.white
    },
    starUnselected: {
        margin: -2,
        color: Colors.ratingGreen
    },
    avatarIcon: {
        fontSize: setFont(20)
    },
    reviewsContainer: {
        margin: 5
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    reviews: {
        fontSize: setFont(14),
        color: text,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    highlyRecommended: {
        marginLeft: 5,
        color: Colors.primaryColor,
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    viewReviewContainer: {
        flex: 1
    },
    headerText: {
        margin: 10,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(16),
        letterSpacing: 2,
        color: Colors.secondary_color
    }
});
