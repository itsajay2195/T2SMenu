import { UPDATE_CONNECTION_STATUS } from './OfflineNoticeManagerTypes';

export const updateConnectionStatusAction = (connectionStatus, oldConnectionStatus, from) => {
    return {
        type: UPDATE_CONNECTION_STATUS,
        connectionStatus,
        oldConnectionStatus,
        from
    };
};
