import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { styles } from '../Styles/ReviewWidgetStyle';
import { object, string } from 'prop-types';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { T2SDivider } from 't2sbasemodule/UI';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/ReviewConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { checkIsValidReviewResponse, getReviewDateFormat, getTrimmedReviewResponse } from '../../Utils/ReviewHelper';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';

type prop = {};
export default class ReviewWidget extends Component<prop> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getIconStyle(nth_star) {
        const {
            review: { value, delivery, food }
        } = this.props;
        const reviewValue = Math.round((Number(value) + Number(delivery) + Number(food)) / 3.0);
        return nth_star <= reviewValue ? styles.star : styles.starUnselected;
    }

    getIconName(nth_star) {
        const {
            review: { value, delivery, food }
        } = this.props;
        const reviewValue = Math.round((Number(value) + Number(delivery) + Number(food)) / 3.0);
        return nth_star <= reviewValue ? FONT_ICON.STAR_FILL : FONT_ICON.STAR_STROKE;
    }

    foodhubImageView() {
        const defaultUrl = '../../../../FoodHubApp/Images/foodhub_logo.png';
        return (
            <View>
                <Image style={styles.portalLogo} source={require(defaultUrl)} />
            </View>
        );
    }

    render() {
        const { review, storeName, screenName, isFromHome } = this.props;
        const formattedDate = getReviewDateFormat(review.date);
        return (
            <View>
                <T2SView style={styles.container} screenName={screenName} id={VIEW_ID.REVIEW_VIEW}>
                    <View style={styles.reviewContainer}>
                        <View style={styles.nameDateContainer}>
                            <View style={styles.starContainer}>
                                <T2SIcon
                                    screenName={screenName}
                                    id={VIEW_ID.REVIEW_STAR_ONE + '_' + this.getIconName(1)}
                                    name={this.getIconName(1)}
                                    style={this.getIconStyle(1)}
                                />
                                <T2SIcon
                                    screenName={screenName}
                                    id={VIEW_ID.REVIEW_STAR_TWO + '_' + this.getIconName(2)}
                                    name={this.getIconName(2)}
                                    style={this.getIconStyle(2)}
                                />
                                <T2SIcon
                                    screenName={screenName}
                                    id={VIEW_ID.REVIEW_STAR_THREE + '_' + this.getIconName(3)}
                                    name={this.getIconName(3)}
                                    style={this.getIconStyle(3)}
                                />
                                <T2SIcon
                                    screenName={screenName}
                                    id={VIEW_ID.REVIEW_STAR_FOUR + '_' + this.getIconName(4)}
                                    name={this.getIconName(4)}
                                    style={this.getIconStyle(4)}
                                />
                                <T2SIcon
                                    screenName={screenName}
                                    id={VIEW_ID.REVIEW_STAR_FIVE + '_' + this.getIconName(5)}
                                    name={this.getIconName(5)}
                                    style={this.getIconStyle(5)}
                                />

                                <T2SText
                                    id={VIEW_ID.REVIEW_NAME}
                                    screenName={screenName}
                                    style={styles.name}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {review.name}
                                </T2SText>
                            </View>
                            <View style={styles.dateContainer}>
                                {review.product_id === 4 && (
                                    <T2SView id={VIEW_ID.PORTAL_LOGO} screenName={screenName} style={styles.logo}>
                                        {this.foodhubImageView()}
                                    </T2SView>
                                )}
                                <T2SText id={VIEW_ID.REVIEW_DATE} screenName={screenName} style={styles.date}>
                                    {formattedDate}
                                </T2SText>
                            </View>
                        </View>
                        {isValidElement(review) && isValidElement(review.message) && checkIsValidReviewResponse(review.message)
                            ? this.renderMessage(review.message, screenName, isFromHome)
                            : null}
                    </View>
                </T2SView>
                <View style={[styles.commentsContainer, isFromHome ? { margin: 0 } : { margin: 5 }]}>
                    {checkIsValidReviewResponse(review.response) && review.response && (
                        <View style={[isFromHome ? styles.homeScreenResponseViewStyle : styles.reviewAllResponseViewStyle]}>
                            <View style={[isFromHome ? styles.homeScreenResponseHeadingStyle : styles.responseHeading]}>
                                <CustomIcon name={FONT_ICON.BACKWARD} style={styles.responseIcon} />
                                <T2SText id={VIEW_ID.REVIEW_RESPONSE_STORE_HEADING} screenName={screenName} style={styles.response}>
                                    {LOCALIZATION_STRINGS.RESPONSE_FROM} {storeName}
                                </T2SText>
                            </View>
                            <T2SText
                                id={VIEW_ID.REVIEW_RESPONSE}
                                screenName={screenName}
                                style={[isFromHome ? styles.homeScreenResponseTextStyle : styles.message]}>
                                {getTrimmedReviewResponse(review)}
                            </T2SText>
                        </View>
                    )}
                </View>
                {!isFromHome ? <T2SDivider style={styles.divider} /> : null}
            </View>
        );
    }

    renderMessage(message, screenName, isFromHome) {
        return (
            <T2SText
                id={VIEW_ID.REVIEW_COMMENT}
                screenName={screenName}
                style={isFromHome ? styles.homeScreenReviewTextStyle : styles.messageStyle}>
                {message}
            </T2SText>
        );
    }
}

ReviewWidget.defaultProps = {
    review: {},
    storeName: '',
    screenName: ''
};
ReviewWidget.propTypes = {
    review: object,
    storeName: string,
    screenName: string.isRequired
};
