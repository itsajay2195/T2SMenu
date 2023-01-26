import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const NotificationNetwork = {
    makeGetNotificationsCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url:
            '/consumer/customer_notify_log?app_name=' +
            BASE_API_CONFIG.applicationName +
            '&host=' +
            params.host +
            '&token=' +
            params.token +
            '&page=' +
            params.page,
        isAuthRequired: false
    }),
    makeGetNotificationsCallForFoodhub: (params) => ({
        method: NETWORK_METHOD.GET,
        url:
            '/consumer/customer_notify_log?app_name=' + BASE_API_CONFIG.applicationName + '&token=' + params.token + '&page=' + params.page,
        isAuthRequired: false
    }),
    makeDeleteNotificationCall: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url:
            '/consumer/customer_notify_log/' +
            params.id +
            '?app_name=' +
            BASE_API_CONFIG.applicationName +
            '&host=' +
            params.host +
            '&token=' +
            params.token,
        isAuthRequired: false
    }),
    makeDeleteNotificationCallForFoodhub: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url: '/consumer/customer_notify_log/' + params.id + '?app_name=' + BASE_API_CONFIG.applicationName + '&token=' + params.token,
        isAuthRequired: false
    }),
    makeDeleteAllNotificationCall: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url:
            'customer_notify_log/delete/bulk' +
            '?app_name=' +
            BASE_API_CONFIG.applicationName +
            '&host=' +
            params.host +
            '&token=' +
            params.token,
        isAuthRequired: false
    }),
    makeDeleteAllNotificationCallForFoodhub: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url: 'customer_notify_log/delete/bulk' + '?app_name=' + BASE_API_CONFIG.applicationName + '&token=' + params.token,
        isAuthRequired: false
    })
};
