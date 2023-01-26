import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';
import { FONT_FAMILY } from '../../../Utils/Constants';
import { setFont } from '../../../Utils/ResponsiveFont';

export const ratingStyle = StyleSheet.create({
    container: {
        elevation: 2,
        backgroundColor: 'white',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 5,
        position: 'relative',
        padding: 10
    },
    textStyle: {
        fontSize: setFont(18),
        textAlign: 'center',
        color: Colors.tundora,
        fontFamily: FONT_FAMILY.REGULAR,
        marginVertical: 10,
        marginHorizontal: 36
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        marginTop: 10,
        padding: 2,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    starContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between'
    },
    star: {
        fontSize: setFont(50),
        color: Colors.rating_yellow
    },
    starUnselected: {
        fontSize: setFont(50),
        color: Colors.rating_grey
    },
    activeStarRatingColor: {
        color: Colors.rating_yellow
    },
    inActiveStarRatingColor: {
        color: Colors.rating_grey
    },
    starContainerStyle: { alignItems: 'center' }
});
