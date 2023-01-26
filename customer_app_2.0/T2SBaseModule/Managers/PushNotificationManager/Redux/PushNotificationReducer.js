import { PUSH_NOTIFICATION_TYPE } from './PushNotificationTypes';

const INITIAL_STATE = {
    deviceRegistrationResponse: null,
    fcmDeviceRegistrationResponse: null,
    deviceRegistrationError: null,
    deviceToken: null,
    brazeNotificationList: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PUSH_NOTIFICATION_TYPE.DEVICE_REGISTRATION_SUCCESS:
            return {
                ...state,
                fcmDeviceRegistrationResponse: action.payload,
                deviceRegistrationError: null
            };
        case PUSH_NOTIFICATION_TYPE.DEVICE_REGISTRATION_FAILURE:
            return {
                ...state,
                deviceRegistrationError: action.payload,
                fcmDeviceRegistrationResponse: null
            };
        case PUSH_NOTIFICATION_TYPE.RESET_DEVICE_REGISTRATION_ERROR:
            return {
                ...state,
                deviceRegistrationError: null,
                fcmDeviceRegistrationResponse: null
            };
        case PUSH_NOTIFICATION_TYPE.UPDATE_DEVICE_TOKEN:
            return {
                ...state,
                deviceToken: action.token
            };
        case PUSH_NOTIFICATION_TYPE.SAVE_BRAZE_NOTIFICATION: {
            return {
                ...state,
                brazeNotificationList: action.payload
            };
        }
        case PUSH_NOTIFICATION_TYPE.ADD_BRAZE_NOTIFICATION: {
            return {
                ...state,
                brazeNotificationList: [action.payload, ...state.brazeNotificationList]
            };
        }
        case PUSH_NOTIFICATION_TYPE.DELETE_BRAZE_NOTIFICATION: {
            return {
                ...state,
                brazeNotificationList: state.brazeNotificationList.filter((obj) => obj.id !== action.id)
            };
        }
        case PUSH_NOTIFICATION_TYPE.DELETE_ALL_BRAZE_NOTIFICATION: {
            return {
                ...state,
                brazeNotificationList: []
            };
        }

        default:
            return state;
    }
};
