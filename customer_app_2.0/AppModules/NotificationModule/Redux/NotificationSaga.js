import { NOTIFICATION_TYPE } from './NotificationType';
import { NotificationNetwork } from '../Network/NotificationNetwork';
import { isArrayNonEmpty, isCustomerApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { put, all, takeLatest, select } from 'redux-saga/effects';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { API_ERROR_MESSAGE } from '../Utils/NotificationListConstants';
import MoEReactInbox from 'react-native-moengage-inbox';
import { selectBrazeNotificationList, selectLatestMoeNotificationId } from 't2sbasemodule/Utils/AppSelectors';
import { convertArrayToObject, saveCampaignNotificationPayload } from '../Utils/NotificationHelper';
import { addOnPushNotificationReceived } from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotifiactionAction';
import { PUSH_NOTIFICATION_TYPE } from 't2sbasemodule/Managers/PushNotificationManager/Redux/PushNotificationTypes';

function* makeGetNotificationsCall(action) {
    try {
        const response = yield apiCall(
            isCustomerApp() ? NotificationNetwork.makeGetNotificationsCall : NotificationNetwork.makeGetNotificationsCallForFoodhub,
            action
        );
        if (isValidElement(response)) {
            yield put({ type: NOTIFICATION_TYPE.GET_NOTIFICATION_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        if (isValidElement(e) && e.message === API_ERROR_MESSAGE.SELECTED_TOKEN_INVALID) {
            yield put({ type: NOTIFICATION_TYPE.GET_NOTIFICATION_FAILURE, payload: {} });
        } else {
            showErrorMessage(e);
        }
    }
}

function* makeDeleteNotificationCall(action) {
    try {
        const response = yield apiCall(
            isCustomerApp() ? NotificationNetwork.makeDeleteNotificationCall : NotificationNetwork.makeDeleteNotificationCallForFoodhub,
            action
        );
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            showInfoMessage(LOCALIZATION_STRINGS.DELETE_SUCCESS);
            yield makeGetNotificationsCall(action);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeDeleteAllNotificationCall(action) {
    try {
        const response = yield apiCall(
            isCustomerApp()
                ? NotificationNetwork.makeDeleteAllNotificationCall
                : NotificationNetwork.makeDeleteAllNotificationCallForFoodhub,
            action
        );
        yield makeDeleteAllThirdPartyNotifications();
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: NOTIFICATION_TYPE.DELETE_ALL_NOTIFICATION_SUCCESS });
            showInfoMessage(LOCALIZATION_STRINGS.DELETED_ALL_NOTIFICATION);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeGetMoeNotificationsCall() {
    try {
        const response = yield MoEReactInbox.fetchAllMessages();

        const thirdPartyNotifications = yield select(selectBrazeNotificationList);
        let notificationsObject = convertArrayToObject(thirdPartyNotifications);
        const moeLatestNotificationId = yield select(selectLatestMoeNotificationId);

        if (isArrayNonEmpty(response?.messages)) {
            let { messages } = response;
            if (isValidString(messages[0]?.campaignId) && moeLatestNotificationId?.toString() !== messages[0].campaignId.toString()) {
                yield all(
                    response.messages.map((item) => {
                        let payload = saveCampaignNotificationPayload(notificationsObject, item);
                        if (isValidElement(payload)) {
                            return put(addOnPushNotificationReceived(payload));
                        }
                    })
                );
                yield put({ type: NOTIFICATION_TYPE.UPDATE_LATEST_CAMPAIGN_ID, id: messages[0].campaignId });
            } else {
                return;
            }
        }
    } catch (e) {
        //
    }
}

function* makeDeleteThirdPartyNotification(action) {
    try {
        const moeLatestNotificationId = yield select(selectLatestMoeNotificationId);
        if (isValidElement(action?.payload?.moengageData)) {
            if (action.id?.toString() === moeLatestNotificationId?.toString()) {
                yield put({ type: NOTIFICATION_TYPE.UPDATE_LATEST_CAMPAIGN_ID, id: '' });
            }
            yield MoEReactInbox.deleteMessage(action.payload.moengageData);
            showInfoMessage(LOCALIZATION_STRINGS.DELETE_SUCCESS);
        }
    } catch (e) {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
}

function* makeDeleteAllThirdPartyNotifications() {
    try {
        const thirdPartyNotifications = yield select(selectBrazeNotificationList);
        if (isArrayNonEmpty(thirdPartyNotifications)) {
            yield put({ type: PUSH_NOTIFICATION_TYPE.DELETE_ALL_BRAZE_NOTIFICATION });
            for (let i = 0; i < thirdPartyNotifications.length; i++) {
                if (isValidElement(thirdPartyNotifications[i].moengageData)) {
                    yield MoEReactInbox.deleteMessage(thirdPartyNotifications[i].moengageData);
                }
            }
            yield put({ type: NOTIFICATION_TYPE.UPDATE_LATEST_CAMPAIGN_ID, id: '' });
            showInfoMessage(LOCALIZATION_STRINGS.DELETED_ALL_NOTIFICATION);
        }
    } catch (e) {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
}

function* NotificationSaga() {
    yield all([
        takeLatest(NOTIFICATION_TYPE.GET_NOTIFICATION, makeGetNotificationsCall),
        takeLatest(NOTIFICATION_TYPE.DELETE_NOTIFICATION, makeDeleteNotificationCall),
        takeLatest(NOTIFICATION_TYPE.DELETE_ALL_NOTIFICATION, makeDeleteAllNotificationCall),
        takeLatest(NOTIFICATION_TYPE.GET_MOE_NOTIFICATION, makeGetMoeNotificationsCall),
        takeLatest(PUSH_NOTIFICATION_TYPE.DELETE_BRAZE_NOTIFICATION, makeDeleteThirdPartyNotification)
    ]);
}

export default NotificationSaga;
