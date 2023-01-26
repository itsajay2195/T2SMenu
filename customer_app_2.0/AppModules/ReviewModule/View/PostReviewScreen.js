import React, { Component } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { styles } from './Styles/PostReviewScreenStyle';
import { connect } from 'react-redux';
import { T2SAppBar, T2SDivider } from 't2sbasemodule/UI';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { SCREEN_NAME, VIEW_ID } from '../Utils/ReviewConstants';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import {
    currentDateString,
    firstCharacterUpperCased,
    getDeviceInfo,
    getTakeawayName,
    getTakeawayNameFromRoute,
    isValidElement,
    isValidString
} from 't2sbasemodule/Utils/helpers';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ignoreReviewAction, postReviewAction } from '../Redux/ReviewAction';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import Stars from 't2sbasemodule/UI/CommonUI/ratings/Stars';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import { getUserName } from '../../BaseModule/Helper';
import { Text } from 'react-native-paper';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import Colors from '../../../T2SBaseModule/Themes/Colors';
import { setFont } from '../../../T2SBaseModule/Utils/ResponsiveFont';

const screenName = SCREEN_NAME.POST_REVIEWS;
let navigationTimeout;
class PostReviewScreen extends Component {
    constructor(props) {
        super(props);
        this.handleSendFeedbackAction = this.handleSendFeedbackAction.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
        this.state = {
            value: 0,
            delivery: 0,
            food: 0,
            comments: '',
            storeID: null,
            loader: false,
            commentsInputHeight: 0
        };
    }

    componentDidMount() {
        Analytics.logScreen(ANALYTICS_SCREENS.POST_REVIEW);
        const { route } = this.props;
        let rating = isValidElement(route.params) && isValidElement(route.params.rating) ? route.params.rating : 0;
        this.setState({
            value: rating,
            delivery: rating,
            food: rating,
            loader: false,
            storeID: isValidElement(route.params) && isValidElement(route.params.storeID) ? route.params.storeID : null
        });
    }

    componentWillUnmount() {
        if (isValidElement(navigationTimeout)) {
            clearTimeout(navigationTimeout);
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    enabled
                    behavior="padding"
                    keyboardSouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    {...setTestId(screenName, VIEW_ID.POST_SCROLL_VIEW)}>
                    {this.renderFeedback()}
                    <T2SDivider style={styles.divider} />
                    {this.renderRating()}
                    <T2SDivider style={styles.divider} />
                    {this.renderComment()}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }

    renderHeader() {
        const { storeConfigName, route } = this.props;
        const { loader } = this.state;
        let storeName = getTakeawayNameFromRoute(route);
        return (
            <T2SAppBar
                id={VIEW_ID.APP_BAR}
                screenName={screenName}
                showElevation={true}
                handleLeftActionPress={this.handleGoBack}
                actions={
                    <View>
                        {loader ? (
                            <View style={styles.activityLoaderView}>
                                <ActivityIndicator color={Colors.secondary_color} size={'small'} />
                            </View>
                        ) : (
                            <T2STouchableOpacity
                                screenName={screenName}
                                id={VIEW_ID.REVIEW_POST_BUTTON}
                                onPress={this.handleSendFeedbackAction}>
                                <T2SIcon icon={FONT_ICON.TICK} size={25} />
                            </T2STouchableOpacity>
                        )}
                    </View>
                }
                title={isValidString(storeName) ? storeName : getTakeawayName(storeConfigName)}
            />
        );
    }

    renderFeedback() {
        return (
            <View style={styles.giveUsFeedbackContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.GIVE_US_FEEDBACK} style={styles.giveUsFeedbackHeading}>
                    {LOCALIZATION_STRINGS.GIVE_US_FEEDBACK}
                </T2SText>
                <T2SText screenName={screenName} id={VIEW_ID.GIVE_US_FEEDBACK_DESCRIPTION} style={styles.giveUsFeedback}>
                    {LOCALIZATION_STRINGS.GIVE_US_FEEDBACK_TEXT}
                </T2SText>
            </View>
        );
    }

    renderRating() {
        return (
            <View style={styles.ratingContainer}>
                <T2SText id={VIEW_ID.VALUE_RATING_TEXT} screenName={screenName} style={styles.ratingHeading}>
                    {LOCALIZATION_STRINGS.VALUE_FOR_MONEY}
                </T2SText>
                <Stars
                    screenName={screenName}
                    id={VIEW_ID.VALUE_RATING}
                    starValue={this.state.value}
                    starContainerStyle={styles.starContainerStyle}
                    activeStarColor={styles.activeStarRatingColor}
                    inActiveStarColor={styles.inActiveStarRatingColor}
                    size={40}
                    offsetFromLeft={5}
                    onPress={this.rateValueAction.bind(this)}
                />

                <T2SText id={VIEW_ID.DELIVERY_RATING_TEXT} screenName={screenName} style={styles.ratingHeading}>
                    {LOCALIZATION_STRINGS.SERVICE_SPEED}
                </T2SText>
                <Stars
                    screenName={screenName}
                    id={VIEW_ID.DELIVERY_RATING}
                    starContainerStyle={styles.starContainerStyle}
                    starValue={this.state.delivery}
                    activeStarColor={styles.activeStarRatingColor}
                    inActiveStarColor={styles.inActiveStarRatingColor}
                    size={40}
                    offsetFromLeft={5}
                    onPress={this.rateDeliveryAction.bind(this)}
                />
                <T2SText id={VIEW_ID.FOOD_RATING_TEXT} screenName={screenName} style={styles.ratingHeading}>
                    {LOCALIZATION_STRINGS.PRODUCT_QUALITY}
                </T2SText>
                <Stars
                    screenName={screenName}
                    id={VIEW_ID.FOOD_RATING}
                    starContainerStyle={styles.starContainerStyle}
                    starValue={this.state.food}
                    activeStarColor={styles.activeStarRatingColor}
                    inActiveStarColor={styles.inActiveStarRatingColor}
                    size={40}
                    offsetFromLeft={5}
                    onPress={this.rateFoodAction.bind(this)}
                />
            </View>
        );
    }

    renderComment() {
        return (
            <View style={styles.commentsContainer}>
                <T2STextInput
                    screenName={screenName}
                    id={VIEW_ID.COMMENTS_TEXT_INPUT}
                    label={<Text style={[styles.ratingHeading, { fontSize: setFont(10) }]}>{LOCALIZATION_STRINGS.COMMENTS}</Text>}
                    value={firstCharacterUpperCased(this.state.comments)}
                    autoCapitalize="sentences"
                    multiline={true}
                    keyboardType={Platform.OS === 'android' ? 'visible-password' : 'default'}
                    onChangeText={(comments) => this.setState({ comments })}
                    autoCorrect={true}
                    minHeight={Platform.OS === 'android' ? this.state.commentsInputHeight : null}
                    onContentSizeChange={(event) => {
                        this.setState({ commentsInputHeight: event.nativeEvent.contentSize.height });
                    }}
                />
            </View>
        );
    }

    rateValueAction(value) {
        this.setState({ value });
        Analytics.logEvent(ANALYTICS_SCREENS.POST_REVIEW, ANALYTICS_EVENTS.RATED_VALUE);
    }

    rateDeliveryAction(delivery) {
        this.setState({ delivery });
        Analytics.logEvent(ANALYTICS_SCREENS.POST_REVIEW, ANALYTICS_EVENTS.RATED_DELIVERY);
    }

    rateFoodAction(food) {
        this.setState({ food });
        Analytics.logEvent(ANALYTICS_SCREENS.POST_REVIEW, ANALYTICS_EVENTS.RATED_FOOD);
    }

    handleSendFeedbackAction = debounce(
        () => {
            const { profileResponse, storeConfigHost } = this.props;
            let name = getUserName(profileResponse);
            if (!this.state.loader && this.state.value > 0 && this.state.delivery > 0 && this.state.food > 0) {
                const postReviewData = {
                    name: name,
                    delivery: this.state.delivery,
                    value: this.state.value,
                    food: this.state.food,
                    message: isValidString(this.state.comments) ? this.state.comments : undefined,
                    host: isValidElement(storeConfigHost) && storeConfigHost,
                    device: JSON.stringify(getDeviceInfo()),
                    order_info_id: this.props.route.params.order_id,
                    date: currentDateString(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)
                };
                this.setState({ loader: true });
                this.props.postReviewAction(postReviewData, this.state.storeID);
                navigationTimeout = setTimeout(() => {
                    this.props.navigation.goBack();
                }, 220);
                Analytics.logEvent(ANALYTICS_SCREENS.POST_REVIEW, ANALYTICS_EVENTS.ICON_SUBMIT);
            } else {
                showErrorMessage(LOCALIZATION_STRINGS.KINDLY_UPDATE_RATING_DETAILS);
            }
        },
        300,
        { leading: true, trailing: false }
    );

    handleGoBack() {
        this.props.navigation.goBack();
        const data = {
            storeID: this.props.route?.params?.storeID,
            order_info_id: this.props.route?.params?.order_id,
            name: this.props.profileResponse?.first_name,
            is_ignored: 'YES'
        };
        this.props.ignoreReviewAction(data);
    }
}

const mapStateToProps = (state) => ({
    profileResponse: state.profileState.profileResponse,
    storeConfigName: state.appState.storeConfigResponse?.name,
    storeConfigHost: state.appState.storeConfigResponse?.host
});

const mapDispatchToProps = {
    postReviewAction,
    ignoreReviewAction
};

export default connect(mapStateToProps, mapDispatchToProps)(PostReviewScreen);
