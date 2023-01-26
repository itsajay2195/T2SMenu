import { StyleSheet, Platform } from 'react-native';
import { FONT_FAMILY } from 't2sbasemodule/Utils/Constants';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from '../../../../../T2SBaseModule/Utils/ResponsiveFont';

export default StyleSheet.create({
    rootContainer: {
        borderColor: Colors.white,
        width: '100%'
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 10
    },
    headerPlaceholderStyle: {
        flexGrow: 1
    },
    headerTextDisplayStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black,
        fontSize: setFont(14)
    },
    dateHeaderTextDisplayStyle: {
        fontSize: setFont(10),
        fontFamily: FONT_FAMILY.REGULAR,
        alignSelf: 'center',
        color: Colors.textGreyColor
    },
    ratingBarRoot: { paddingHorizontal: 10 },
    ratingParentViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        paddingHorizontal: 40
    },
    ratingFillRoot: { paddingBottom: 5 },

    ratedRatingPlaceholderStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: Colors.darkBlack
    },
    ratingPlaceholderStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 30,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: Colors.white,
        marginTop: Platform.OS === 'ios' ? 15 : 16
    },
    ratingCircleContainer: {
        padding: 5
    },
    ratedRatingTextDisplayStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.white,
        fontSize: setFont(28)
    },
    ratingTextDisplayStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        color: Colors.black,
        fontSize: setFont(18)
    },
    ratingReviewContainerSmall: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.palegreen,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        width: 94
    },
    ratingReviewContainerLarge: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.palegreen,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        width: 176
    },
    ratingReviewTextDisplayStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(10),
        paddingHorizontal: 2,
        paddingVertical: 5,
        color: Colors.black,
        textAlign: 'center'
    },
    ratingArrowIconStyle: {
        alignSelf: 'center',
        margin: Platform.OS === 'ios' ? -5 : -3
    },
    dateOfInspectionTextDisplayStyle: {
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        fontSize: setFont(12),
        marginLeft: 5,
        alignSelf: 'center',
        color: Colors.black
    },
    imageContainer: {
        backgroundColor: Colors.white,
        paddingBottom: 10
    },
    imageContainerWithPadding: {
        backgroundColor: Colors.white,
        paddingVertical: 10
    },
    ratingImageStyle: {
        resizeMode: 'contain',
        backgroundColor: Colors.white
    },
    ratingContentContainer: {
        height: 70,
        justifyContent: 'center',
        borderTopWidth: 1,
        marginBottom: 10,
        flexWrap: 'wrap',
        paddingHorizontal: 10
    },
    ratingContentTextStyle: {
        fontSize: setFont(15),
        color: Colors.black,
        fontFamily: FONT_FAMILY.MEDIUM
    },
    ratingContentLinkTextStyle: {
        textDecorationLine: 'underline',
        color: Colors.textBlue,
        fontSize: setFont(15),
        fontFamily: FONT_FAMILY.MEDIUM
    },
    ratingContentStatusTextStyle: {
        fontSize: setFont(20)
    },
    ratingMessageContentView: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        marginBottom: 10
    },
    ratingDummyView: {
        flex: 1
    },
    ratingTextViewContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        justifyContent: 'space-between'
    },
    ratingTextDummyView: {
        width: 42,
        paddingVertical: 5
    }
});
