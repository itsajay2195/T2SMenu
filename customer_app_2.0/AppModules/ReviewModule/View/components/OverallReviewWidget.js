import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { HEXAGON } from '../assets';
import { styles } from '../Styles/OverallReviewWidgetStyle';
import CustomIcon from 't2sbasemodule/UI/CustomUI/CustomIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import propTypes from 'prop-types';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/ReviewConstants';

type Props = {};
export default class OverallReviewWidget extends Component<Props> {
    getIconStyle(nth_star) {
        const { ratingCount } = this.props;
        return nth_star <= ratingCount ? styles.star : styles.starUnselected;
    }
    render() {
        const { reviewCount, ratingCount, screenName } = this.props;
        const reviewText = reviewCount > 1 ? LOCALIZATION_STRINGS.REVIEWS : LOCALIZATION_STRINGS.REVIEW;
        return (
            <View style={styles.container}>
                <ImageBackground source={HEXAGON} style={styles.hexagon}>
                    <T2SText id={VIEW_ID.REVIEW} screenName={screenName} style={styles.reviewText}>
                        {ratingCount}
                    </T2SText>
                    <View style={styles.starContainer}>
                        <CustomIcon name={FONT_ICON.STAR_FILL} style={this.getIconStyle(1)} />
                        <CustomIcon name={FONT_ICON.STAR_FILL} style={this.getIconStyle(2)} />
                        <CustomIcon name={FONT_ICON.STAR_FILL} style={this.getIconStyle(3)} />
                        <CustomIcon name={FONT_ICON.STAR_FILL} style={this.getIconStyle(4)} />
                        <CustomIcon name={FONT_ICON.STAR_FILL} style={this.getIconStyle(5)} />
                    </View>
                </ImageBackground>
                <View style={styles.reviewsContainer}>
                    <View style={styles.reviewContainer}>
                        <CustomIcon name={FONT_ICON.AVATAR_FILL} style={styles.avatarIcon} />
                        <T2SText id={VIEW_ID.REVIEWS} screenName={screenName} style={styles.reviews}>
                            {reviewCount} ({reviewText})
                        </T2SText>
                    </View>
                    {ratingCount > 3 ? (
                        <T2SText id={VIEW_ID.HIGHLY_RECOMMENDED} screenName={screenName} style={styles.highlyRecommended}>
                            {LOCALIZATION_STRINGS.HIGHLY_RECOMMENDED}
                        </T2SText>
                    ) : null}
                </View>
            </View>
        );
    }
}

OverallReviewWidget.defaultProps = {
    reviewCount: 0,
    ratingCount: 0,
    screenName: ''
};
OverallReviewWidget.propTypes = {
    reviewCount: propTypes.number,
    ratingCount: propTypes.number,
    screenName: propTypes.string.isRequired
};
