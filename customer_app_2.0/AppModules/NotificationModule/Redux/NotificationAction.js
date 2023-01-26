import { NOTIFICATION_TYPE } from './NotificationType';

export const getNotificationsAction = (host, token, page) => {
    return {
        type: NOTIFICATION_TYPE.GET_NOTIFICATION,
        host,
        token,
        page
    };
};

export const deleteNotificationAction = (id, host, token) => {
    return {
        type: NOTIFICATION_TYPE.DELETE_NOTIFICATION,
        id,
        host,
        token
    };
};

export const clearAllNotificationAction = (host, token) => {
    return {
        type: NOTIFICATION_TYPE.DELETE_ALL_NOTIFICATION,
        host,
        token
    };
};

export const getMoeNotificationAction = () => {
    return {
        type: NOTIFICATION_TYPE.GET_MOE_NOTIFICATION
    };
};
