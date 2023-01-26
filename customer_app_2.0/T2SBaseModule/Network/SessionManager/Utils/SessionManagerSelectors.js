import { isFoodHubApp, isFranchiseApp, isValidElement, isValidString } from '../../../Utils/helpers';
import {
    DEFAULT_CONFIGURATOR,
    FOODHUB_DEFAULT_CONFIGURATOR,
    FRANCHISE_DEFAULT_CONFIGURATOR
} from 'appmodules/ConfiguratorModule/Utils/ConfiguratorConstants';
export const selectRefreshToken = (state) => state.userSessionState.refresh_token;
export const selectUserAccessToken = (state) => state.userSessionState.access_token;
export const selectUserAccessTokenExpires = (state) => state.userSessionState.access_token_expires_in;
export const selectUserRefreshTokenExpires = (state) => state.userSessionState.refresh_token_expires_in;
export const selectUserTokenFetchingStatus = (state) => state.userSessionState.isFetchingRefreshToken;
export const selectAccessTokenExpiredTime = (state) => state.userSessionState.access_expires_in;
export const selectRefreshTokenExpiredTime = (state) => state.userSessionState.refresh_expires_in;
export const getAccessToken = (state) => {
    return `${state.userSessionState.tokenType} ${state.userSessionState.access_token}`;
};
export const getAccessTokenFromSessionData = (sessionData) => {
    return `${sessionData.tokenType} ${sessionData.access_token}`;
};
export const getUserSessionStatus = (state) => {
    return state.userSessionState.isUserLoginSuccess || isValidString(state.userSessionState.refresh_token);
};
export const getConfiguration = (state) => {
    let dataStr = state.envConfigState.envConfigData;
    if (isValidElement(dataStr)) {
        return typeof dataStr === 'string' && dataStr !== '' ? JSON.parse(dataStr) : dataStr;
    }
    if (isFoodHubApp()) {
        return FOODHUB_DEFAULT_CONFIGURATOR;
    } else if (isFranchiseApp()) {
        return FRANCHISE_DEFAULT_CONFIGURATOR;
    }
    return DEFAULT_CONFIGURATOR;
};
