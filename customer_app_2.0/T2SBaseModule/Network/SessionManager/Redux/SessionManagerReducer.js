import { SESSION_MANAGER_TYPES } from '../Utils/SessionManagerTypes';
import { AUTH_TYPE } from 'appmodules/AuthModule/Redux/AuthType';
import { extractSessionInfo } from '../Utils/SessionManagerHelper';
import { APP_ACTION_TYPE } from '../../../../CustomerApp/Redux/Actions/Types';

const INITIAL_STATE = {
    tokenType: '',
    access_token: '',
    access_token_expires_in: 0,
    refresh_token: '',
    refresh_token_expires_in: 0,
    isFetchingRefreshToken: false,
    isUserLoginSuccess: false,
    access_expires_in: 0,
    refresh_expires_in: 0
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                isFetchingRefreshToken: false,
                ...extractSessionInfo(action.payload)
            };
        case AUTH_TYPE.PROFILE_SUCCESS_WITHOUT_CONSENT:
            return { ...state, ...extractSessionInfo(action.payload), isFetchingRefreshToken: false, isUserLoginSuccess: true };
        case SESSION_MANAGER_TYPES.SESSION_RESET_REFRESH_TOKEN_RESET:
        case AUTH_TYPE.SET_LOGOUT_ACTION:
        case AUTH_TYPE.INVALID_SESSION:
            return INITIAL_STATE;
        case SESSION_MANAGER_TYPES.UPDATE_REFRESH_TOKEN_STATUS:
            return {
                ...state,
                isFetchingRefreshToken: action.payload
            };
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION:
            return {
                ...state,
                isFetchingRefreshToken: false
            };
        default:
            return state;
    }
};
