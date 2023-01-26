import React, { Component } from 'react';
import { Dimensions, Linking, View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from './styles/HygenicRatingWidgetStyle';
import { Colors } from 't2sbasemodule/Themes';
import {
    AVG_RATING_VALUE,
    HYGIENE_RATING_STATUS_COMPLETED,
    MAX_RATING_VALUE,
    RATING_VALUES,
    SCHEME,
    SCREEN_NAME,
    VIEW_ID
} from '../../Utils/TakeawayDetailsConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { getDateOfInspection, getHygienicRatingValueAndId, getRatingText } from '../../Utils/TakeawayDetailsHelper';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { T2SIcon } from 't2sbasemodule/UI';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { isValidElement, isValidURL, safeIntValue } from 't2sbasemodule/Utils/helpers';
import FastImage from 'react-native-fast-image';
import { ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import { connect } from 'react-redux';
import { selectIsSpanishLanguage } from '../../../../T2SBaseModule/Utils/AppSelectors';

/**
 * To place a hygenic rating widget on any screen
 * <HygenicRatingWidget rating={0} dateOfInspection={new Date()} />
 * parameters:
 * rating: Hygenic rating value
 * dateOfInspection: Date of last inspection
 * color: The color of the widget
 * **/
const deviceWidth = Dimensions.get('window').width;

class HygienicRatingWidget extends Component {
    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.TAKEAWAY_DETAILS);
    }

    static defaultProps = {
        color: Colors.palegreen
    };
    renderLastInspection() {
        const { rating } = this.props;
        const dateOfInspection = getDateOfInspection(rating);
        if (isValidElement(dateOfInspection))
            return (
                <>
                    <T2SText
                        id={VIEW_ID.LAST_INSPECTION_HEADING_VIEW}
                        screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                        style={styles.dateHeaderTextDisplayStyle}>
                        {LOCALIZATION_STRINGS.LAST_INSPECTION}
                    </T2SText>
                    <T2SText
                        id={VIEW_ID.RATING_HEADING_VIEW + dateOfInspection}
                        screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                        style={styles.dateOfInspectionTextDisplayStyle}>
                        {dateOfInspection}
                    </T2SText>
                </>
            );
    }

    render() {
        const { rating, color, isSpanish } = this.props;
        return (
            <View style={styles.rootContainer}>
                <View style={{ backgroundColor: color, ...styles.headerContainer }}>
                    <View style={styles.headerPlaceholderStyle}>
                        <T2SText
                            id={VIEW_ID.FOOD_HYGENIC_HEADING_VIEW}
                            screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                            style={[styles.headerTextDisplayStyle, isSpanish && { fontSize: 11 }]}>
                            {LOCALIZATION_STRINGS.FOOD_HYGIENE_RATING}
                        </T2SText>
                    </View>
                    {this.renderLastInspection()}
                </View>
                <View style={{ backgroundColor: color }}>{this.renderRatingView(rating)}</View>
            </View>
        );
    }
    renderRatingView() {
        const { scheme_type, status, rating_value, image_url, url } = this.props.rating;

        if (isValidElement(scheme_type) && isValidElement(status) && isValidElement(rating_value)) {
            let isRatingStatusCompleted = status === HYGIENE_RATING_STATUS_COMPLETED;
            if (scheme_type === SCHEME.SCHEME_TYPE_FHIS && isValidURL(image_url) && isValidElement(rating_value)) {
                return this.renderRatingImageView();
            } else if (scheme_type === SCHEME.SCHEME_TYPE_FHRS) {
                if (isValidURL(image_url) && isValidElement(rating_value) && rating_value > 0) {
                    return this.renderRatingImageView();
                } else if (isValidElement(status) && isValidElement(rating_value) && rating_value > 0) {
                    return this.renderRatingStarView(safeIntValue(rating_value));
                } else if (isValidElement(status) && !isRatingStatusCompleted && rating_value > 0) {
                    return this.renderRatingStatusMessageView(status);
                }
            }
            return isValidURL(url) && this.renderRatingLinkView(url);
        }
    }

    renderRatingImageView() {
        const { scheme_type, rating_value, image_url } = this.props.rating;

        // Using device width because rating image should cover the entire screen and height should be based on width.
        const imageHeight = deviceWidth * 0.225;
        return (
            <View style={scheme_type === SCHEME.SCHEME_TYPE_FHIS ? styles.imageContainerWithPadding : styles.imageContainer}>
                <T2SFastImage
                    source={{ uri: image_url }}
                    style={[styles.ratingImageStyle, { width: deviceWidth, height: imageHeight }]}
                    resizeMode={FastImage.resizeMode.contain}
                    id={VIEW_ID.HYGENIC_RATING_IMAGE_ + getHygienicRatingValueAndId(safeIntValue(rating_value))}
                    screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                />
            </View>
        );
    }
    renderRatingLinkView(url) {
        return (
            <View style={styles.ratingContentContainer}>
                <T2SText
                    screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                    style={styles.ratingContentTextStyle}
                    id={VIEW_ID.HYGENIC_RATING_HOST_TEXT}>
                    {LOCALIZATION_STRINGS.FOODHUB_HYGIENE_RATING_PLEASE_VISIT}
                </T2SText>
                <T2SText
                    // Todo we will be change URL link in Feature
                    screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                    onPress={() => Linking.openURL(url)}
                    style={styles.ratingContentLinkTextStyle}
                    id={VIEW_ID.HYGENIC_RATING_HOST_LINK_TEXT}>
                    {url}
                </T2SText>
            </View>
        );
    }
    renderRatingStatusMessageView(ratingStatus) {
        return (
            <View style={styles.ratingMessageContentView}>
                <T2SText
                    style={styles.ratingContentStatusTextStyle}
                    screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                    id={VIEW_ID.HYGENIC_RATING_STATUS_TEXT}>
                    {ratingStatus}
                </T2SText>
            </View>
        );
    }
    renderRatingStarView(ratingValue) {
        return (
            <View>
                <View style={styles.ratingParentViewStyle}>{this.ratingViews(ratingValue)}</View>
                <View style={styles.ratingTextViewContainer}>
                    {this.getDummyViews(ratingValue < AVG_RATING_VALUE ? ratingValue - 1 : ratingValue)}
                    <View style={ratingValue < AVG_RATING_VALUE ? styles.ratingReviewContainerLarge : styles.ratingReviewContainerSmall}>
                        <T2SText
                            id={VIEW_ID.RATING_REVIEW_VIEW}
                            screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                            style={styles.ratingReviewTextDisplayStyle}>
                            {getRatingText(ratingValue)}
                        </T2SText>
                    </View>
                    {this.getDummyViews(MAX_RATING_VALUE - (ratingValue < AVG_RATING_VALUE ? ratingValue + 1 : ratingValue))}
                </View>
            </View>
        );
    }

    ratingViews = (ratingValue) =>
        RATING_VALUES().map((ratingInfo) =>
            ratingInfo.id === ratingValue ? (
                <View>
                    <View style={styles.ratingFillRoot}>
                        <T2SIcon name={FONT_ICON.Fill_Arrow_Down} size={20} style={styles.ratingArrowIconStyle} />
                        <View style={styles.ratingCircleContainer}>
                            <View style={styles.ratedRatingPlaceholderStyle}>
                                <T2SText
                                    id={VIEW_ID.RATED_PLACEHOLDER_VIEW}
                                    screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                                    style={styles.ratedRatingTextDisplayStyle}>
                                    {ratingInfo.id}
                                </T2SText>
                            </View>
                        </View>
                    </View>
                    {ratingInfo.id !== MAX_RATING_VALUE && <View style={styles.ratingDummyView} />}
                </View>
            ) : (
                <View>
                    <View style={styles.ratingCircleContainer}>
                        <View style={styles.ratingPlaceholderStyle}>
                            <T2SText
                                id={VIEW_ID.RATING_PLACEHOLDER_VIEW}
                                screenName={SCREEN_NAME.HYGENIC_RATING_WIDGET}
                                style={styles.ratingTextDisplayStyle}>
                                {ratingInfo.id}
                            </T2SText>
                        </View>
                    </View>
                    {ratingInfo.id !== MAX_RATING_VALUE && <View style={styles.ratingDummyView} />}
                </View>
            )
        );

    getDummyViews(noOfViews) {
        let dummyViews = [];
        for (let i = 0, j = noOfViews; i < j; i++) {
            dummyViews.push(<View style={styles.ratingTextDummyView} />);
        }
        return dummyViews;
    }
}

const mapStateToProps = (state) => ({
    rating: state.takeawayDetailsState.rating,
    isSpanish: selectIsSpanishLanguage(state)
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HygienicRatingWidget);
