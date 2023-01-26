import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import OverallReviewWidget from './components/OverallReviewWidget';
import { styles } from './Styles/ViewReviewScreenStyle';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import ReviewWidget from './components/ReviewWidget';
import { clearReviewsAction, getReviewsAction } from '../Redux/ReviewAction';
import { T2SAppBar, T2SDivider } from 't2sbasemodule/UI';
import { SCREEN_NAME, VIEW_ID } from '../Utils/ReviewConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { getTakeawayName, getTakeawayNameFromRoute, isValidElement, isValidString, safeIntValue } from 't2sbasemodule/Utils/helpers';
import { getOverallDashboardReview, getTotalReviewsCount } from '../Utils/ReviewHelper';
import T2SView from '../../../T2SBaseModule/UI/CommonUI/T2SView';
import BaseComponent from '../../BaseModule/BaseComponent';
import Config from 'react-native-config';
import { getRatings } from '../../../FoodHubApp/TakeawayListModule/Utils/Helper';

const screenName = SCREEN_NAME.VIEW_ALL_REVIEWS;

class ViewAllReviewsScreen extends Component {
    constructor() {
        super();
        this.onReachBottom = this.onReachBottom.bind(this);
    }
    componentDidMount() {
        const { storeConfigId } = this.props;
        this.props.clearReviewsAction();
        this.props.getReviewsAction(1, isValidElement(storeConfigId) ? storeConfigId : Config.STORE_ID);
    }

    render() {
        const { storeConfigTotalReviews, isFromHome, reviews } = this.props;
        const totalReviews = getTotalReviewsCount(storeConfigTotalReviews);
        return (
            <T2SView style={styles.container}>
                {!isFromHome ? (
                    <BaseComponent showHeader={false}>
                        <View style={styles.container}>
                            <T2SAppBar showElevation={false} title={this.getStoreName()} />
                            {totalReviews > 0 ? this.renderAllReviews() : this.renderEmptyView()}
                        </View>
                    </BaseComponent>
                ) : totalReviews > 0 &&
                  isValidElement(getOverallDashboardReview(reviews)) &&
                  getOverallDashboardReview(reviews).length > 0 ? (
                    this.renderDashboardReview()
                ) : (
                    this.renderEmptyView()
                )}
            </T2SView>
        );
    }
    renderItem = ({ item, index }) => {
        return <ReviewWidget screenName={screenName} review={item} storeName={this.getStoreName()} key={index} />;
    };

    renderAllReviews() {
        const { reviews, storeConfigTotalReviews, storeConfigRating } = this.props;
        return (
            <View style={styles.container}>
                <OverallReviewWidget
                    screenName={screenName}
                    ratingCount={getRatings(storeConfigRating)}
                    reviewCount={getTotalReviewsCount(storeConfigTotalReviews)}
                />
                <T2SDivider style={styles.divider} />
                <T2SText id={VIEW_ID.REVIEWS_TEXT} screenName={screenName} style={styles.reviewHeading}>
                    {LOCALIZATION_STRINGS.REVIEWS}
                </T2SText>
                <View style={styles.reviewListView}>
                    <FlatList
                        contentContainerStyle={styles.reviewContentContainer}
                        data={reviews}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.onReachBottom}
                    />
                </View>
            </View>
        );
    }

    renderEmptyView() {
        return (
            <View style={styles.noReviewContainer}>
                <T2SText id={VIEW_ID.NO_REVIEWS_TEXT} screenName={screenName} style={styles.noReview}>
                    {LOCALIZATION_STRINGS.APP_NO_REVIEWS}
                </T2SText>
            </View>
        );
    }

    renderDashboardReview() {
        const { reviews, isFromHome } = this.props;
        const dashboardReviews = getOverallDashboardReview(reviews);
        return isValidElement(dashboardReviews) ? (
            <View>
                {dashboardReviews.slice(0, 2).map((review, key) => (
                    <ReviewWidget
                        isFromHome={isFromHome}
                        screenName={screenName}
                        review={review}
                        storeName={this.getStoreName()}
                        key={key}
                    />
                ))}
            </View>
        ) : null;
    }

    getStoreName() {
        const { storeConfigName, route } = this.props;
        let storeName = getTakeawayNameFromRoute(route);
        return isValidString(storeName) ? storeName : getTakeawayName(storeConfigName);
    }

    onReachBottom({ nativeEvent }) {
        const { currentResponse, storeConfigId, isFetchingInProgress } = this.props;
        if (isValidElement(currentResponse)) {
            const { next_page_url } = currentResponse;
            if (isValidElement(next_page_url) && !isFetchingInProgress) {
                const nextPage = safeIntValue(currentResponse.current_page) + 1;
                this.props.getReviewsAction(nextPage, isValidElement(storeConfigId) ? storeConfigId : Config.STORE_ID);
            }
        }
    }
}

const mapStateToProps = ({ reviewState, appState }) => ({
    reviews: reviewState.reviewsList,
    currentResponse: reviewState.reviewResponse,
    isFetchingInProgress: reviewState.isFetching,
    storeConfigName: appState.storeConfigResponse?.name,
    storeConfigId: appState.storeConfigResponse?.id,
    storeConfigTotalReviews: appState.storeConfigResponse?.total_reviews,
    storeConfigRating: appState.storeConfigResponse?.rating
});

const mapDispatchToProps = {
    getReviewsAction,
    clearReviewsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllReviewsScreen);
