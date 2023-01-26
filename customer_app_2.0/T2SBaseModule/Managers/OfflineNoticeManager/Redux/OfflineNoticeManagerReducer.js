import { UPDATE_CONNECTION_STATUS } from './OfflineNoticeManagerTypes';

const INITIAL_STATE = {
    connectionStatus: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_CONNECTION_STATUS: {
            return {
                ...state,
                connectionStatus: action.connectionStatus
            };
        }
        default:
            return state;
    }
};
