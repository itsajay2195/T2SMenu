import { PUSH_NOTIFICATION_TYPE } from './PushNotificationTypes';

export const deviceRegistrationAction = (token, retry) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.POST_DEVICE_REGISTRATION,
        token
    };
};

export const updateDeviceTokenAction = (token) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.UPDATE_DEVICE_TOKEN,
        token
    };
};

export const resetErrorAction = () => {
    return {
        type: PUSH_NOTIFICATION_TYPE.RESET_DEVICE_REGISTRATION_ERROR
    };
};

export const refreshOnPushNotificationReceived = (payload) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.REFRESH_ON_PUSH_NOTIFICATION_RECEIVED,
        payload
    };
};

export const saveOnPushNotificationReceived = (payload) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.SAVE_BRAZE_NOTIFICATION,
        payload
    };
};

export const deleteAllPushNotificationReceived = (notifications) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.DELETE_ALL_BRAZE_NOTIFICATION,
        notifications
    };
};

export const addOnPushNotificationReceived = (payload) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.ADD_BRAZE_NOTIFICATION,
        payload
    };
};

export const deleteThirdPartyNotification = (item) => {
    return {
        type: PUSH_NOTIFICATION_TYPE.DELETE_BRAZE_NOTIFICATION,
        id: item?.id,
        payload: item
    };
};
