import React, { Component } from 'react';
import { Linking, NativeModules, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { NETWORK_CONSTANTS } from '../../Utils/Constants';
import { boolValue, isValidElement, isValidString } from '../../Utils/helpers';
import T2SModal from '../../UI/CommonUI/T2SModal';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import {
    addOnPushNotificationReceived,
    deviceRegistrationAction,
    resetErrorAction,
    updateDeviceTokenAction
} from './Redux/PushNotifiactionAction';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import * as PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Config from 'react-native-config';
import Colors from '../../Themes/Colors';
import { ZohoSupport } from '../../../CustomerApp/NativeModules/ZohoDesk';
import { getOrderDetailsAction } from 'appmodules/OrderManagementModule/Redux/OrderManagementAction';
import * as Braze from 'appmodules/AnalyticsModule/Braze';
import { NOTIFICATION_TYPE } from './Utils/PushNotificationConstants';
import { isAndroid } from 'appmodules/BaseModule/Helper';
import { handleNavigation } from '../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { setAppCurrentStateAction } from '../../../FoodHubApp/HomeModule/Redux/HomeAction';
import { selectHasUserLoggedIn } from '../../Utils/AppSelectors';

let deviceRegistationtimerOut;
class PushNotificationManager extends Component {
    constructor(props) {
        super(props);
        this.handlePushNotificationPositiveButtonClicked = this.handlePushNotificationPositiveButtonClicked.bind(this);
        this.handlePushNotificationNegativeButtonClicked = this.handlePushNotificationNegativeButtonClicked.bind(this);
        this.state = {
            noPushNotificationPermissionModal: false
        };
    }

    async componentDidMount() {
        /**
         * Request only when device is not registered
         */
        await this.checkPermission();
        this.sendMessage();
        this.createNotificationListeners();
    }

    createNotificationListeners() {
        this.displayNotificationInKilled();
        this.handleNotificationOpened();
        this.handleForegroundNotificationTap();
        this.displayNotificationInForeground();
    }
    displayNotificationInForeground() {
        this.notificationForgroundListner = messaging().onMessage((remoteMessage) => {
            if (isValidElement(remoteMessage) && !this.isBrazeNotification(remoteMessage)) {
                const notificationData = this.parseDataFromRemoteMessage(remoteMessage, true);
                if (isValidElement(notificationData)) {
                    this.displayLocalNotification(notificationData);
                }
            }
        });
    }
    displayLocalNotification(notificationData) {
        if (isValidElement(notificationData)) {
            if (isAndroid()) {
                let notification;
                const { order_info_id } = notificationData.data;
                notification = {
                    channelId: 'orders_id',
                    largeIcon: 'ic_launcher',
                    smallIcon: 'ic_notification',
                    color: Colors.secondary_color,
                    ...notificationData,
                    order_info_id
                };
                PushNotification.localNotification(notification);
            } else {
                let formattedData = {
                    alertTitle: isValidElement(notificationData.title) && notificationData.title,
                    alertBody: isValidElement(notificationData.message) && notificationData.message,
                    userInfo: isValidElement(notificationData.userInfo) && notificationData.userInfo
                };
                PushNotificationIOS.presentLocalNotification(formattedData);
            }
        }
    }

    parseDataFromRemoteMessage(remoteMessage, isLocalNotification = false) {
        if (isValidElement(remoteMessage)) {
            const { notification, id, data } = remoteMessage;
            const notificationData = {
                id: '',
                title: '',
                message: '',
                data: null
            };
            if (isValidElement(remoteMessage.notification)) {
                notificationData.id = isValidElement(id) ? id : null;
                notificationData.title = isValidString(notification.title) ? notification.title : '';
                notificationData.message = isValidString(notification.body) ? notification.body : '';
            }
            if (isLocalNotification && Platform.OS === 'ios') {
                notificationData.userInfo = isValidElement(data) ? data : {};
            } else {
                notificationData.data = isValidElement(data) ? data : {};
            }
            return notificationData;
        }
    }
    handleForegroundNotificationTap() {
        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        PushNotification.configure({
            onNotification: (notificationData) => {
                if (
                    isValidElement(notificationData?.userInteraction) &&
                    notificationData.userInteraction &&
                    isValidElement(notificationData?.order_info_id)
                ) {
                    this.redirectFromNotification(notificationData);
                } else if (!isAndroid() && isValidElement(notificationData.data) && isValidElement(notificationData?.data?.order_info_id)) {
                    this.redirectFromNotification(notificationData.data);
                }
                //Todo need to check app kill state
                // else if (isValidElement(notificationData?.data?.basket)) {
                //     dispatch(
                //         CommonActions.reset({
                //             index: 2,
                //             routes: [
                //                 { name: SCREEN_OPTIONS.HOME.route_name },
                //                 {
                //                     name: SCREEN_OPTIONS.MENU_SCREEN.route_name,
                //                     params: { isFromReOrder: false, isFromCartIcon: true }
                //                 },
                //                 { name: SCREEN_OPTIONS.BASKET.route_name }
                //             ]
                //         })
                //     );
                // }
            }
        });
    }

    handleNotificationOpened() {
        messaging().onNotificationOpenedApp((remoteMessage) => {
            if (isValidElement(remoteMessage?.data)) this.redirectFromNotification(remoteMessage.data);
        });
    }
    displayNotificationInKilled() {
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (isValidElement(remoteMessage?.data)) this.redirectFromNotification(remoteMessage?.data);
            });
    }

    redirectFromNotification(notificationData) {
        if (this.props.isUserLoggedIn) {
            if (isValidElement(notificationData?.order_info_id) && notificationData?.type === 'Refund') {
                handleNavigation(SCREEN_OPTIONS.VIEW_ORDER.route_name, {
                    orderId: notificationData.order_info_id
                });
                this.props.setAppCurrentStateAction(true);
            } else if (isValidElement(notificationData?.order_info_id)) {
                handleNavigation(SCREEN_OPTIONS.ORDER_TRACKING.route_name, {
                    orderId: notificationData.order_info_id,
                    analyticsObj: { order_id: notificationData.order_info_id }
                });
                this.updateOrderDetails(notificationData?.order_info_id);
                this.props.setAppCurrentStateAction(true);
            }
        }
    }
    /* Android Only Properties */
    // id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    // ticker: 'My Notification Ticker', // (optional)
    //  autoCancel: true, // (optional) default: true
    // largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
    // smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
    // bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
    // subText: 'This is a subText', // (optional) default: none
    // color: Colors.secondary_color, // (optional) default: system default
    //vibrate: true, // (optional) default: true
    // vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    // tag: 'some_tag', // (optional) add tag to message
    // group: 'group', // (optional) add group to message
    // ongoing: false, // (optional) set whether this is an "ongoing" notification
    // actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
    // invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

    /* iOS only properties */
    // alertAction: 'view', // (optional) default: view
    // category: '', // (optional) default: empty string
    // userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)

    /* iOS and Android properties */
    // title: title, // (optional)
    // message: body // (required)
    // playSound: !!soundName, // (optional) default: true
    // soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    // number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)

    showLocalNotification(data) {
        if (isValidElement(data)) {
            const { title, body, type, order_info_id } = data;
            let notification = {
                title: title,
                message: body
            };
            if (this.isShowPromotionNotification() || this.isOrderNotification(type, order_info_id)) {
                if (isAndroid()) {
                    notification = {
                        channelId: 'orders_id',
                        largeIcon: 'ic_launcher',
                        smallIcon: 'ic_notification',
                        color: Colors.secondary_color
                    };
                    if (isValidElement(order_info_id)) {
                        notification = {
                            ...notification,
                            order_info_id
                        };
                    }
                    PushNotification.localNotification(notification);
                } else {
                    PushNotificationIOS.presentLocalNotification({
                        alertTitle: notification.title,
                        alertBody: notification.message
                    });
                }
            }
        }
    }

    sendMessage() {
        /**
         *
         */
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            if (!isValidElement(remoteMessage.data)) {
                const data = this.parseNotificationResponse(remoteMessage);
                this.showLocalNotification(data);
                // await this.props.refreshOnPushNotificationReceived(data);
            }
        });
    }

    async requestPermission() {
        await messaging()
            .hasPermission()
            .then(() => {
                /**
                 * Get FCM Token
                 */
                this.getDeviceToken();
            })
            .catch(() => {
                /**
                 * User didn't authorize, show modal
                 */
                this.setState({ noPushNotificationPermissionModal: true });
            });
    }

    async checkPermission() {
        await messaging()
            .requestPermission()
            .then((enabled) => {
                if (enabled) {
                    this.getDeviceToken();
                } else {
                    /**
                     * Request for push notification permission
                     */
                    this.requestPermission();
                }
            });
    }

    async getDeviceToken() {
        //TODO this is not required for register iOS device.
        // If we should use this manual register we should make the false for 'messaging_ios_auto_register_for_remote_messages' property in firsebase.json
        // await messaging().registerDeviceForRemoteMessages();
        const { fcmDeviceRegistrationResponse, deviceToken } = this.props;
        await messaging()
            .getToken()
            .then((fcmToken) => {
                if (isValidElement(fcmToken)) {
                    if (!isValidElement(fcmDeviceRegistrationResponse) || fcmToken !== deviceToken) {
                        this.props.updateDeviceTokenAction(fcmToken);
                    }
                    this.callDeviceRegistrationAction(fcmToken);
                    Braze.setAnalyticsPushNotification(fcmToken);
                    // if (isAndroid()) {
                    //     ReactAppboy.registerAndroidPushToken(fcmToken);
                    // }
                } else {
                    this.getDeviceToken();
                }
            });
    }
    handlePushNotificationPositiveButtonClicked() {
        this.positiveButtonTapped();
    }
    handlePushNotificationNegativeButtonClicked() {
        this.dismissModal();
    }
    render() {
        return (
            <View>
                <T2SModal
                    isVisible={this.state.noPushNotificationPermissionModal}
                    description={`${AppConfig.APP_NAME} ${LOCALIZATION_STRINGS.PERMISSION_DESCRIPTION}`}
                    positiveButtonText={LOCALIZATION_STRINGS.ALLOW}
                    negativeButtonText={LOCALIZATION_STRINGS.CANCEL}
                    positiveButtonClicked={this.handlePushNotificationPositiveButtonClicked}
                    negativeButtonClicked={this.handlePushNotificationNegativeButtonClicked}
                    requestClose={this.handlePushNotificationNegativeButtonClicked}
                />
                {this.handleDeviceRegistrationFailure()}
            </View>
        );
    }
    handleDeviceRegistrationFailure = () => {
        const { deviceRegistrationError, deviceToken } = this.props;
        if (isValidElement(deviceRegistrationError) && isValidElement(deviceToken)) {
            if (deviceRegistrationError.type === NETWORK_CONSTANTS.NETWORK_ERROR) {
                this.callDeviceRegistrationAction(deviceToken);
            }
        }
    };
    componentWillUnmount() {
        if (isValidElement(deviceRegistationtimerOut)) {
            clearTimeout(deviceRegistationtimerOut);
        }
        this.notificationForgroundListner();
    }

    callDeviceRegistrationAction(fcmToken) {
        deviceRegistationtimerOut = setTimeout(() => {
            this.props.updateDeviceTokenAction(fcmToken);
            this.props.resetErrorAction();
            this.props.deviceRegistrationAction(fcmToken);
            try {
                ZohoSupport.setPushNotificationToken(fcmToken);
            } catch (e) {
                // Nothing to handle
            }
        }, 12 * 1000);
    }

    positiveButtonTapped = () => {
        this.setState({ noPushNotificationPermissionModal: false });
        if (isAndroid()) {
            NativeModules.OpenNotification.open();
        } else {
            Linking.canOpenURL('app-settings:')
                .then((isOpened) => {
                    if (isOpened) {
                        return Linking.openURL('app-settings:');
                    }
                })
                .catch((_) => {});
        }
    };

    dismissModal = () => {
        this.setState({ noPushNotificationPermissionModal: false });
    };

    parseNotificationResponse = (remoteMessage) => {
        if (isValidElement(remoteMessage) && !this.isBrazeNotification(remoteMessage)) {
            const data = isValidElement(remoteMessage.data) ? remoteMessage.data : {};
            const notification = isValidElement(remoteMessage.notification) ? remoteMessage.notification : {};
            data.title = isValidString(data.title)
                ? data.title
                : isValidString(notification.title)
                ? notification.title
                : LOCALIZATION_STRINGS.DEFAULT_NOTIFICATION_BODY_MESSAGE;

            data.body = isValidString(data.message) ? data.message : isValidString(notification.body) ? notification.body : Config.APP_NAME;
            return data;
        }
    };
    /**
     * Here we have to show the promotional notification when the toggle is on
     * @returns {*|boolean}
     */
    isShowPromotionNotification = () => {
        const { profileResponse } = this.props;
        if (isValidElement(profileResponse)) {
            const { is_subscribed_notification } = profileResponse;
            return isValidString(is_subscribed_notification) && boolValue(is_subscribed_notification);
        }
        return false;
    };

    isOrderNotification = (type, id) => {
        if (isValidElement(id) && isValidString(type)) {
            return type === NOTIFICATION_TYPE.TRACKING;
        }
        return false;
    };

    isBrazeNotification = (remoteMessage) => {
        return remoteMessage?.data?.push_from === 'moengage' && this.isShowPromotionNotification();
    };

    updateOrderDetails = (id) => {
        if (isValidString(id)) {
            //TODO if Store id required in future for this API then it won't work. We need access last order store id here
            this.props.getOrderDetailsAction(id, false);
        }
    };
}

const mapStateToProps = (state) => {
    return {
        deviceToken: state.pushNotificationState.deviceToken,
        fcmDeviceRegistrationResponse: state.pushNotificationState.fcmDeviceRegistrationResponse,
        deviceRegistrationError: state.pushNotificationState.deviceRegistrationError,
        brazeNotificationList: state.pushNotificationState.brazeNotificationList,
        profileResponse: state.profileState.profileResponse,
        isUserLoggedIn: selectHasUserLoggedIn(state)
    };
};

const mapDispatchToProps = {
    deviceRegistrationAction,
    updateDeviceTokenAction,
    resetErrorAction,
    getOrderDetailsAction,
    addOnPushNotificationReceived,
    setAppCurrentStateAction
};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotificationManager);
