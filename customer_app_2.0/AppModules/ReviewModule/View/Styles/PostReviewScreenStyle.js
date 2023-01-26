import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from '../../../../T2SBaseModule/Utils/ResponsiveFont';

const { secondaryText } = customerAppTheme.colors;

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    divider: {
        height: 5
    },
    activityLoaderView: {
        right: 15
    },
    giveUsFeedbackContainer: {
        marginTop: 5,
        backgroundColor: Colors.white,
        padding: 5
    },
    giveUsFeedbackHeading: {
        color: Colors.secondary_color,
        letterSpacing: 2,
        fontSize: setFont(14),
        margin: 5,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    giveUsFeedback: {
        color: secondaryText,
        fontSize: setFont(12),
        margin: 5,
        marginVertical: 10,
        fontFamily: FONT_FAMILY.REGULAR
    },
    ratingContainer: {
        backgroundColor: Colors.white,
        margin: 5
    },
    ratingHeading: {
        marginLeft: 10,
        fontSize: setFont(12),
        paddingTop: 10,
        color: Colors.mongoose,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    starContainer: {
        margin: 5,
        flexDirection: 'row',
        marginBottom: 20
    },
    starContainerStyle: {
        flexDirection: 'row'
    },
    commentsContainer: {
        marginTop: 5,
        backgroundColor: Colors.white,
        flex: 1,
        paddingHorizontal: 15,
        padding: 5
    },
    comments: {
        margin: 5,
        fontFamily: FONT_FAMILY.REGULAR
    },

    activeStarRatingColor: {
        color: Colors.rating_yellow
    },
    inActiveStarRatingColor: {
        color: Colors.rating_grey
    }
});
