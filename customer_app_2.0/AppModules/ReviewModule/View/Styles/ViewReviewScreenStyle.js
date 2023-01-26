import { StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { customerAppTheme } from '../../../../CustomerApp/Theme';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { setFont } from 't2sbasemodule/Utils/ResponsiveFont';

const { secondaryText } = customerAppTheme.colors;

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    divider: {
        height: 5
    },
    noReviewContainer: {
        flex: 1,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: customerAppTheme.colors.background
    },
    noReview: {
        color: secondaryText,
        fontSize: setFont(18),
        fontFamily: FONT_FAMILY.REGULAR
    },
    reviewHeading: {
        textTransform: 'uppercase',
        backgroundColor: Colors.white,
        color: Colors.secondary_color,
        paddingLeft: 15,
        paddingTop: 20,
        paddingBottom: 5,
        letterSpacing: 2,
        fontSize: setFont(16),
        fontFamily: FONT_FAMILY.SEMI_BOLD
    },
    reviewContainer: { flexGrow: 1, paddingBottom: 4 },
    reviewListView: { flex: 1 },
    reviewContentContainer: { paddingBottom: 80 }
});
