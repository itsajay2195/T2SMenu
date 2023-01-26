import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import {
    clearAllNotificationAction,
    deleteNotificationAction,
    getMoeNotificationAction,
    getNotificationsAction
} from '../Redux/NotificationAction';
import { getNextPage, isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { notificationStyle } from './Styles/NotificationStyle';
import { T2SAppBar } from 't2sbasemodule/UI';
import { SCREEN_NAME, VIEW_ID } from '../Utils/NotificationListConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import T2SDivider from 't2sbasemodule/UI/CommonUI/T2SDivider';
import T2SPaginatedFlatList from 't2sbasemodule/UI/CommonUI/T2SPaginatedFlatList';
import styles from '../../ProfileModule/Styles/DeliveryAddressStyles';
import T2SRefreshControl from '../../../T2SBaseModule/UI/CommonUI/T2SRefreshControl';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationListItem from './Components/NotificationListItem';
import { getAllNotificationList } from '../Utils/NotificationHelper';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { deleteThirdPartyNotification } from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotifiactionAction';

let timeout;
class NotificationsScreen extends Component {
    constructor(props) {
        super(props);
        this.onRefreshHandle = this.onRefreshHandle.bind(this);
        this.handleClearAllNotificationAction = this.handleClearAllNotificationAction.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.renderClearAllButtonView = this.renderClearAllButtonView.bind(this);
        this.onRefreshAction = this.onRefreshAction.bind(this);
        this.handleClearAllModalRequestClose = this.handleClearAllModalRequestClose.bind(this);
        this.state = {
            showBackButton: false,
            showClearAllModal: false,
            refreshState: false
        };
    }

    componentDidMount() {
        const { route } = this.props;
        Analytics.logScreen(ANALYTICS_SCREENS.NOTIFICATION);
        if (isValidElement(route.params) && isValidElement(route.params.showBackButton)) {
            this.setState({ showBackButton: route.params.showBackButton });
        }
        this.didFocus = this.props.navigation.addListener('focus', () => {
            this.makeAPICallToGetNotificationList(1);
            this.props.getMoeNotificationAction();
        });
    }
    componentWillUnmount() {
        if (isValidElement(this.didFocus)) {
            this.props.navigation.removeListener(this.didFocus);
        }
        if (isValidElement(timeout)) {
            clearTimeout(timeout);
        }
    }

    render() {
        const { notificationList, brazeNotificationList } = this.props;
        return (
            <SafeAreaView style={notificationStyle.rootContainer}>
                {this.renderHeader()}
                {this.renderClearAllModal()}
                <T2SDivider style={notificationStyle.topDividerStyle} />
                {isArrayNonEmpty(notificationList) || isArrayNonEmpty(brazeNotificationList)
                    ? this.renderNotificationList()
                    : this.renderErrorMessage()}
            </SafeAreaView>
        );
    }

    renderHeader() {
        return (
            <T2SAppBar
                title={LOCALIZATION_STRINGS.NOTIFICATIONS}
                navigation={this.props.navigation}
                actions={this.renderClearAllButtonView()}
                icon={!this.state.showBackButton ? FONT_ICON.HAMBURGER : FONT_ICON.BACK}
            />
        );
    }

    renderNotificationList() {
        let { notificationList, brazeNotificationList } = this.props;
        let { refreshState } = this.state;
        return (
            <T2SPaginatedFlatList
                id={VIEW_ID.NOTIFICATIONS_LIST_ITEM}
                screenName={SCREEN_NAME.NOTIFICATION_LIST}
                showsVerticalScrollIndicator={false}
                onRefresh={this.onRefreshHandle}
                useFlatList
                keyExtractor={(item) => item.id.toString()}
                data={getAllNotificationList(notificationList, brazeNotificationList)}
                renderItem={this.renderRowContentView}
                renderHiddenItem={(item) => this.renderHiddenContentView(item)}
                disableRightSwipe={true}
                rightOpenValue={-100}
                recalculateHiddenLayout={true}
                onPageEnd={this.loadNextPage}
                onEndReachedThreshold={0.01}
                swipeToOpenPercent={5}
                swipeToClosePercent={5}
                closeOnRowOpen={true}
                closeOnRowBeginSwipe={true}
                closeOnScroll={true}
                closeOnRowPress={true}
                refreshControl={
                    <T2SRefreshControl
                        refreshing={refreshState}
                        onRefresh={this.onRefreshAction}
                        id={VIEW_ID.REFRESH_CONTROL}
                        screenName={SCREEN_NAME.NOTIFICATION_LIST}
                    />
                }
            />
        );
    }

    renderErrorMessage() {
        return (
            <View style={notificationStyle.noNotificationContainer}>
                <Text style={notificationStyle.noNotificationText}>{LOCALIZATION_STRINGS.NO_NOTIFICATION_TEXT}</Text>
                <T2STouchableOpacity
                    style={notificationStyle.orderNowButton}
                    screenName={SCREEN_NAME.NOTIFICATION_LIST}
                    id={VIEW_ID.ORDER_NOW_TOUCHABLE}
                    onPress={() => {
                        handleNavigation(SCREEN_OPTIONS.HOME.route_name);
                    }}>
                    <T2SText screenName={SCREEN_NAME.NOTIFICATION_LIST} id={VIEW_ID.ORDER_NOW_TEXT} style={notificationStyle.orderNowText}>
                        {LOCALIZATION_STRINGS.ORDER_NOW.toUpperCase()}
                    </T2SText>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderRowContentView({ item }) {
        const { title, message, created_at } = item;
        return <NotificationListItem title={title} message={message} created_at={created_at} />;
    }

    renderHiddenContentView(item) {
        return (
            <View style={notificationStyle.deleteButtonViewStyle}>
                <T2STouchableOpacity
                    style={notificationStyle.deleteButtonStyle}
                    screenName={SCREEN_NAME.NOTIFICATION_LIST}
                    id={VIEW_ID.NOTIFICATIONS_LIST_ITEM}
                    onPress={this.deleteNotificationAction.bind(this, item)}>
                    <View style={styles.deleteView}>
                        <T2SText
                            style={notificationStyle.deleteTextStyle}
                            id={VIEW_ID.CLEAR_ALL_ITEM_BUTTON}
                            screenName={SCREEN_NAME.NOTIFICATION_LIST}>
                            {LOCALIZATION_STRINGS.APP_DELETE}
                        </T2SText>
                    </View>
                </T2STouchableOpacity>
            </View>
        );
    }

    renderClearAllButtonView() {
        let { notificationList, brazeNotificationList } = this.props;
        if (isArrayNonEmpty(notificationList) || isArrayNonEmpty(brazeNotificationList)) {
            return (
                <T2STouchableOpacity
                    style={notificationStyle.headerLeftContainerView}
                    screenName={SCREEN_NAME.NOTIFICATION_LIST}
                    id={VIEW_ID.CLEAR_ALL_ITEM}
                    onPress={() => this.setState({ showClearAllModal: true })}>
                    <Text style={notificationStyle.clearAllText}>{LOCALIZATION_STRINGS.CLEAR_ALL}</Text>
                </T2STouchableOpacity>
            );
        }
        return null;
    }
    handleClearAllModalRequestClose() {
        this.setState({ showClearAllModal: false });
    }
    renderClearAllModal() {
        return (
            <T2SModal
                isVisible={this.state.showClearAllModal}
                requestClose={this.handleClearAllModalRequestClose}
                title={LOCALIZATION_STRINGS.DELETE_ALL}
                description={LOCALIZATION_STRINGS.DELETE_ALL_CONFIRM_TEXT}
                positiveButtonText={LOCALIZATION_STRINGS.YES}
                negativeButtonText={LOCALIZATION_STRINGS.NO}
                positiveButtonClicked={this.handleClearAllNotificationAction}
                negativeButtonClicked={this.handleClearAllModalRequestClose}
            />
        );
    }

    makeAPICallToGetNotificationList(page) {
        const { deviceToken } = this.props;
        if (isValidElement(deviceToken)) {
            this.props.getNotificationsAction(this.getTakeawayHost(), deviceToken, page);
        }
    }

    onRefreshHandle() {
        this.makeAPICallToGetNotificationList(1);
        this.props.getMoeNotificationAction();
    }

    getTakeawayHost() {
        return this.props.storeConfigHost;
    }

    loadNextPage() {
        let nextPage = getNextPage(this.props.currentPageIndex, this.props.lastPage);
        if (nextPage !== -1) {
            this.makeAPICallToGetNotificationList(nextPage);
        }
    }

    onRefreshAction() {
        this.setState({ refreshState: true });
        this.makeAPICallToGetNotificationList(1);
        this.props.getMoeNotificationAction();
        Analytics.logAction(ANALYTICS_SCREENS.NOTIFICATION, ANALYTICS_EVENTS.SWIPE_TO_REFRESH);
        timeout = setTimeout(() => this.setState({ refreshState: false }), 2000);
    }

    deleteNotificationAction(item) {
        Analytics.logAction(ANALYTICS_SCREENS.NOTIFICATION, ANALYTICS_EVENTS.CLEAR_ONE_NOTIFICATION, { id: item.item.id });
        if (isValidElement(item) && item.item.status === 'BRAZE') {
            this.props.deleteThirdPartyNotification(item.item);
        } else {
            this.props.deleteNotificationAction(item.item.id, this.getTakeawayHost(), this.props.deviceToken);
        }
    }

    handleClearAllNotificationAction() {
        Analytics.logAction(ANALYTICS_SCREENS.NOTIFICATION, ANALYTICS_EVENTS.CLEAR_ALL_NOTIFICATION);
        this.setState({ showClearAllModal: false });
        this.props.clearAllNotificationAction(this.getTakeawayHost(), this.props.deviceToken);
    }
}

const mapStateToProps = (state) => ({
    deviceToken: state.pushNotificationState.deviceToken,
    storeConfigHost: state.appState.storeConfigResponse?.host,
    notificationList: state.notificationState.notificationsList,
    lastPage: state.notificationState.totalPage,
    currentPageIndex: state.notificationState.currentPage,
    brazeNotificationList: state.pushNotificationState.brazeNotificationList
});

const mapDispatchToProps = {
    getNotificationsAction,
    deleteNotificationAction,
    clearAllNotificationAction,
    deleteThirdPartyNotification,
    getMoeNotificationAction
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
