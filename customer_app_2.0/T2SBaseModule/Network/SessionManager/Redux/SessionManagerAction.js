import { SESSION_MANAGER_TYPES } from '../Utils/SessionManagerTypes';

export const setSessionMigrated = () => {
    return {
        type: SESSION_MANAGER_TYPES.SET_SESSION_MIGRATED
    };
};
