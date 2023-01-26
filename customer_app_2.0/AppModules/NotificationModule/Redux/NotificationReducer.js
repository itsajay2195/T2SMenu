import { NOTIFICATION_TYPE } from './NotificationType';
import { getNotificationList, deleteFilterNotificationList } from '../Utils/NotificationHelper';

const INITIAL_STATE = {
    notificationsList: null,
    currentPage: 1,
    totalPage: 0,
    moeNotificationId: '' //store latest id from moe notifications
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NOTIFICATION_TYPE.GET_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notificationsList: getNotificationList(state.notificationsList, action.payload.data, action.payload.current_page),
                currentPage: action.payload.current_page,
                totalPage: action.payload.last_page
            };
        case NOTIFICATION_TYPE.GET_NOTIFICATION_FAILURE:
            return {
                ...state,
                notificationsList: [],
                currentPage: 1,
                totalPage: 0
            };
        case NOTIFICATION_TYPE.DELETE_NOTIFICATION:
            return {
                ...state,
                notificationsList: deleteFilterNotificationList(state.notificationsList, action.id)
            };
        case NOTIFICATION_TYPE.DELETE_ALL_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notificationsList: [],
                currentPage: 1,
                totalPage: 0
            };
        case NOTIFICATION_TYPE.UPDATE_LATEST_CAMPAIGN_ID:
            return {
                ...state,
                moeNotificationId: action.id
            };
        default:
            return state;
    }
};
