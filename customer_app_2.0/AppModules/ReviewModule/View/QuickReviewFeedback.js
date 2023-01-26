import React, { Component } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { T2SButton, T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import { connect } from 'react-redux';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { currentDateString, getDeviceInfo, isArrayNonEmpty, isCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import styles from './Styles/QuickReviewFeedbackStyle';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import _ from 'lodash';
import { ORDER_STATUS, YES } from '../../BaseModule/BaseConstants';
import { getOrderItemsWithQuantity, getTakeawayImage } from '../../../FoodHubApp/HomeModule/Utils/Helper';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { SCREEN_NAME, VIEW_ID } from '../../HomeModule/Utils/HomeConstants';
import { ignoreReviewAction, postReviewAction } from '../Redux/ReviewAction';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { getPlacedDateTime } from '../../HomeModule/Utils/HomeHelper';
import SwipableRating from 'react-native-swipeable-rating';
import { Colors } from 't2sbasemodule/Themes';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';

const screenName = SCREEN_NAME.QUICK_REVIEW_FEEDBACK;
const deviceWidth = Dimensions.get('window').width;
let checkIsCustomerApp = isCustomerApp();
class QuickReviewFeedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starRating: 0,
            recentOrdersResponse: null,
            currentReviewOrder: null,
            showRatingUI: true
        };
        this.handleRatingValue = this.handleRatingValue.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
        this.renderFilledIcon = this.renderFilledIcon.bind(this);
        this.renderEmptyIcon = this.renderEmptyIcon.bind(this);
        this.handleViewPress = this.handleViewPress.bind(this);
    }
    static getDerivedStateFromProps(props, state) {
        const { recentOrdersResponse } = props;
        let newState = {};
        if (
            isArrayNonEmpty(recentOrdersResponse?.data) &&
            recentOrdersResponse.data[0].status >= parseFloat(ORDER_STATUS.HIDDEN) &&
            state.recentOrdersResponse !== recentOrdersResponse.data
        ) {
            newState.recentOrdersResponse = recentOrdersResponse.data;
            newState.currentReviewOrder = recentOrdersResponse.data[0];
        }
        return _.isEmpty(newState) ? null : newState;
    }

    handleRatingValue(value) {
        this.setState({ starRating: value });
    }

    handleViewPress() {
        //nothing to handle as onPress should be empty as clicking outside should do nothing but handled with opacity touch
    }

    submitRating(value) {
        const { profileResponse } = this.props;
        const { currentReviewOrder } = this.state;
        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.RATING_SWIPED);
        const postReviewData = {
            name: profileResponse?.first_name,
            delivery: value,
            value: value,
            food: value,
            storeID: currentReviewOrder?.store?.id,
            device: JSON.stringify(getDeviceInfo()),
            order_info_id: currentReviewOrder?.id,
            date: currentDateString(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)
        };
        this.props.postReviewAction(postReviewData, currentReviewOrder?.store?.id);
        this.setState({ showRatingUI: false }, () => {
            setTimeout(() => {
                this.closePopUp();
            }, 1500);
        });
    }

    closePopUp() {
        this.setState({ showRatingUI: false });
        this.props.navigation.goBack();
    }

    handleCloseModal() {
        const { currentReviewOrder, starRating } = this.state;
        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.RATING_IGNORED);
        this.closePopUp();
        if (starRating <= 0) {
            const data = {
                storeID: currentReviewOrder?.store?.id,
                order_info_id: currentReviewOrder?.id,
                name: this.props.profileResponse?.first_name,
                is_ignored: YES
            };
            this.props.ignoreReviewAction(data);
        }
    }

    renderTakeawayLogo() {
        const { currentReviewOrder } = this.state;
        if (!checkIsCustomerApp && isValidElement(getTakeawayImage(currentReviewOrder))) {
            return (
                <View style={styles.logoContainer}>
                    <T2SFastImage
                        screenName={screenName}
                        id={VIEW_ID.ITEM_IMAGE}
                        source={{ uri: getTakeawayImage(currentReviewOrder) }}
                        style={styles.takeawayLogoStyle}
                        resizeMode="contain"
                    />
                </View>
            );
        }
    }

    renderOrderDetails() {
        const { currentReviewOrder } = this.state;
        let question = checkIsCustomerApp
            ? LOCALIZATION_STRINGS.QUICK_REVIEW_QUESTION1
            : LOCALIZATION_STRINGS.QUICK_REVIEW_QUESTION + '\n' + currentReviewOrder?.store?.name;
        return (
            <View style={[styles.detailsContainer, checkIsCustomerApp && styles.questionsPaddingStyle]}>
                <T2SText screenName={screenName} id={VIEW_ID.QUICK_REVIEW_QUESTION_TEXT} style={styles.questionTextStyle}>
                    {question + '?'}
                </T2SText>
                <T2SText screenName={screenName} id={VIEW_ID.QUICK_REVIEW_ITEM_TEXT} style={styles.itemsTextStyle} numberOfLines={1}>
                    {getOrderItemsWithQuantity(currentReviewOrder?.summary)}
                </T2SText>
            </View>
        );
    }

    renderRatingStar() {
        const offsetFromLeft = (deviceWidth - 5 * 50) / 2;
        const { starRating } = this.state;
        return (
            <T2SView
                screenName={screenName}
                id={VIEW_ID.QUICK_REVIEW_STAR_RATING_VIEW}
                style={[styles.ratingContainer, checkIsCustomerApp && styles.ratingBottomStyle]}>
                <SwipableRating
                    rating={starRating}
                    onPress={this.handleRatingValue}
                    xOffset={offsetFromLeft}
                    color={Colors.rating_yellow}
                    emptyColor={Colors.imageBorder}
                    minRating={0}
                    maxRating={5}
                    gap={5}
                    size={50}
                    filledIcon={this.renderFilledIcon}
                    emptyIcon={this.renderEmptyIcon}
                />
            </T2SView>
        );
    }

    renderSubmitButton() {
        const { starRating } = this.state;
        let enableButton = starRating > 0;
        return (
            <T2SButton
                buttonTextStyle={styles.submitTextStyle}
                buttonStyle={[styles.nextButtonContainer, enableButton && { backgroundColor: Colors.primaryColor }]}
                onPress={enableButton && this.submitRating.bind(this, starRating)}
                screenName={screenName}
                id={VIEW_ID.NEXT_BUTTON}
                title={LOCALIZATION_STRINGS.SUBMIT}
            />
        );
    }

    renderFilledIcon(size, gap, color, index) {
        return (
            <T2SIcon
                id={VIEW_ID.QUICK_REVIEW_FILLED_STARS + '_' + index}
                screenName={screenName}
                style={{ color: color, marginRight: gap }}
                name={FONT_ICON.STAR_FILL}
                size={size}
            />
        );
    }

    renderEmptyIcon(size, gap, color, emptyColor, index) {
        return (
            <T2SIcon
                id={VIEW_ID.QUICK_REVIEW_UNFILLED_STARS + '_' + index}
                screenName={screenName}
                style={{ color: emptyColor, marginRight: gap }}
                name={FONT_ICON.STAR_STROKE}
                size={size}
            />
        );
    }

    renderOrderPlacedTime() {
        const { currentReviewOrder } = this.state;
        return (
            <T2SText screenName={screenName} id={VIEW_ID.QUICK_REVIEW_ORDER_PLACED_TEXT} style={styles.orderPlacedTextStyle}>
                {getPlacedDateTime(currentReviewOrder?.order_placed_on)}
            </T2SText>
        );
    }

    renderReviewRatingUI() {
        return (
            <>
                <View style={styles.closeContainer}>
                    <T2SIcon
                        name={FONT_ICON.WRONG}
                        style={styles.closeIcon}
                        onPress={this.handleCloseModal}
                        screenName={screenName}
                        id={VIEW_ID.QUICK_REVIEW_CLOSE_ICON}
                        size={35}
                    />
                </View>
                <T2STouchableOpacity
                    accessible={false}
                    activeOpacity={1}
                    onPress={this.handleViewPress}
                    style={styles.quickCheckoutContentViewStyle}>
                    {this.renderTakeawayLogo()}
                    {this.renderOrderDetails()}
                    {this.renderRatingStar()}
                    {this.renderOrderPlacedTime()}
                    {this.renderSubmitButton()}
                </T2STouchableOpacity>
            </>
        );
    }

    renderThanksMessage() {
        return (
            <View style={styles.messageContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.QUICK_REVIEW_QUESTION_TEXT} style={styles.thanksTextStyle}>
                    {`${LOCALIZATION_STRINGS.QUICK_REVIEW_MESSAGE} ${this.props.profileResponse?.first_name}!`}
                </T2SText>
            </View>
        );
    }

    render() {
        const { showRatingUI } = this.state;
        return (
            <View style={styles.rootContainer}>
                <T2STouchableOpacity accessible={false} onPress={this.handleCloseModal} style={styles.quickCheckoutViewStyle}>
                    <Animated.View>{showRatingUI ? this.renderReviewRatingUI() : this.renderThanksMessage()}</Animated.View>
                </T2STouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    recentOrdersResponse: state.foodHubHomeState.recentOrdersResponse,
    profileResponse: state.profileState.profileResponse
});
const mapDispatchToProps = {
    postReviewAction,
    ignoreReviewAction
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickReviewFeedback);
