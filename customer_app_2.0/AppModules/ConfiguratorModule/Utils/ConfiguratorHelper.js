import { CONFIG_KEYS } from './ConfiguratorConstants';
import { isDebugBuildType, isFoodHubApp, isFranchiseApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { AppConfig, ENV_TYPE, LIVE_CHAT_KEY, URL } from '../../../CustomerApp/Utils/AppConfig';
import { store } from '../../../CustomerApp/Redux/Store/ConfigureStore';
import {
    CUSTOMER_FEATURE_GATE_CONFIG,
    FOODHUB_FEATURE_GATE_CONFIG,
    FRANCHISE_FEATURE_GATE_CONFIG
} from '../../BaseModule/Utils/FeatureGateConfig';

export const getBaseURL = (data) => {
    try {
        return isValidElement(data) && data[CONFIG_KEYS.config_base_url];
    } catch (e) {
        return URL.LIVE;
    }
};

export const getEnvType = (data) => {
    try {
        const type = isValidElement(data) && data[CONFIG_KEYS.config_env_type];
        return isValidElement(type) ? type : ENV_TYPE.LIVE;
    } catch (e) {
        return ENV_TYPE.LIVE;
    }
};

export const getBugseeValue = (data) => {
    try {
        return isValidElement(data) && data[CONFIG_KEYS.config_bugsee_value];
    } catch (e) {
        return false;
    }
};

export const getLiveChatKey = (data) => {
    try {
        return isValidElement(data) && data[CONFIG_KEYS.config_live_chat_key];
    } catch (e) {
        return LIVE_CHAT_KEY.LIVE;
    }
};

export const getStoreId = (data) => {
    try {
        return isValidElement(data) && data[CONFIG_KEYS.config_store_id];
    } catch (e) {
        return AppConfig.STORE_ID;
    }
};

export const getApiVersion = (data) => {
    try {
        return isDebugBuildType() ? isValidElement(data) && data[CONFIG_KEYS.config_api_version] : AppConfig.API_VERSION;
    } catch (e) {
        return AppConfig.API_VERSION;
    }
};
/*
  This method returns Authorization token (access_token) with prefix of token type
  Ex: "Bearer <token>"
 */
export const getAccessToken = () => {
    let state = store.getState();
    return `${state.userSessionState.tokenType} ${state.userSessionState.access_token}`;
};
/*
  This method returns Passport Value as '1' Which will be used to handle access_token at backend.
 */
export const getPassport = () => {
    return '1';
};

export const getFranchiseId = (data) => {
    try {
        return isValidElement(data) && data[CONFIG_KEYS.config_franchise_id];
    } catch (e) {
        return AppConfig.FRANCHISE_ID;
    }
};

export const getFranchiseHost = (data) => {
    try {
        return isValidElement(data) && data[CONFIG_KEYS.config_franchise_host];
    } catch (e) {
        return AppConfig.FRANCHISE_HOST;
    }
};

export const constructBuildInfo = (info) => {
    try {
        if (isValidElement(info)) {
            return JSON.parse(info);
        }
        return '';
    } catch (e) {
        return '';
    }
};

export const getLocalFeatureConfigData = () => {
    if (isFoodHubApp()) {
        return FOODHUB_FEATURE_GATE_CONFIG;
    } else if (isFranchiseApp()) {
        return FRANCHISE_FEATURE_GATE_CONFIG;
    } else {
        return CUSTOMER_FEATURE_GATE_CONFIG;
    }
};
