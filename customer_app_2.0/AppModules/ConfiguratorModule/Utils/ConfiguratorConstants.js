import { AppConfig, LIVE_CHAT_KEY, URL, ENV_TYPE } from '../../../CustomerApp/Utils/AppConfig';
import Config from 'react-native-config';
import { isFranchiseApp } from 't2sbasemodule/Utils/helpers';

export const CONFIG_KEYS = {
    config_filename: '@config_FH_v2022_05_05',
    config_base_url: 'config_base_url',
    config_live_chat_key: 'config_live_chat_key',
    config_store_id: 'config_store_id',
    config_api_version: 'config_api_version',
    config_franchise_host: 'config_franchise_host',
    config_franchise_id: 'config_franchise_id',
    config_env_type: 'config_env_type',
    config_bugsee_value: 'config_bugsee_value'
};

export const DEFAULT_CONFIGURATOR = {
    [CONFIG_KEYS.config_base_url]: URL.LIVE,
    [CONFIG_KEYS.config_live_chat_key]: LIVE_CHAT_KEY.LIVE,
    [CONFIG_KEYS.config_store_id]: AppConfig.STORE_ID,
    [CONFIG_KEYS.config_franchise_host]: null,
    [CONFIG_KEYS.config_api_version]: AppConfig.API_VERSION,
    [CONFIG_KEYS.config_env_type]: ENV_TYPE.LIVE,
    [CONFIG_KEYS.config_bugsee_value]: false
};
export const FOODHUB_DEFAULT_CONFIGURATOR = {
    [CONFIG_KEYS.config_base_url]: URL.LIVE,
    [CONFIG_KEYS.config_live_chat_key]: 'p40xGGf1nf4PqfoDPexGY2X5KdHx0tMX',
    [CONFIG_KEYS.config_store_id]: Config.STORE_ID,
    [CONFIG_KEYS.config_franchise_host]: null,
    [CONFIG_KEYS.config_api_version]: AppConfig.API_VERSION,
    [CONFIG_KEYS.config_env_type]: ENV_TYPE.LIVE,
    [CONFIG_KEYS.config_bugsee_value]: false
};

export const FRANCHISE_DEFAULT_CONFIGURATOR = {
    [CONFIG_KEYS.config_base_url]: URL.LIVE,
    [CONFIG_KEYS.config_live_chat_key]: 'p40xGGf1nf4PqfoDPexGY2X5KdHx0tMX',
    [CONFIG_KEYS.config_store_id]: Config.STORE_ID,
    [CONFIG_KEYS.config_franchise_host]: Config.FRANCHISE_HOST,
    [CONFIG_KEYS.config_api_version]: AppConfig.API_VERSION,
    [CONFIG_KEYS.config_franchise_id]: Config.FRANCHISE_ID,
    [CONFIG_KEYS.config_env_type]: ENV_TYPE.LIVE,
    [CONFIG_KEYS.config_bugsee_value]: false
};

export const ITEM_TYPE = {
    DROP_DOWN: 'drop_down',
    TEXT_INPUT: 'text_input',
    TEXT: 'text',
    TOGGLE: 'toggle'
};

export const CONFIGURATOR_KEY = {
    ENVIRONMENT: 'ENVIRONMENT',
    LIVE_CHAT_KEY: 'LIVE CHAT KEY',
    STORE_ID: 'STORE ID',
    API_VERSION: 'API VERSION',
    LOCALE: 'LOCALE',
    REGION: 'REGION',
    DEVICE_TOKEN: 'DEVICE TOKEN',
    FRANCHISE_ID: 'FRANCHISE ID',
    FRANCHISE_HOST: 'FRANCHISE HOST',
    ENVIRONMENT_TYPE: 'ENVIRONMENT TYPE',
    BUGSEE: 'BUGSEE'
};

export const CONFIGURATOR_DATA = [
    {
        key: CONFIGURATOR_KEY.ENVIRONMENT,
        itemType: ITEM_TYPE.DROP_DOWN,
        values: [
            { key: URL.LIVE, value: URL.LIVE },
            { key: URL.PRE_PROD_ONLINE, value: URL.PRE_PROD_ONLINE },
            { key: URL.PRE_PROD_NOCG_ONLINE, value: URL.PRE_PROD_NOCG_ONLINE },
            { key: URL.EAT_APPY_PRE_PROD, value: URL.EAT_APPY_PRE_PROD },
            { key: URL.QA, value: URL.QA },
            { key: URL.FOODHUB_SIT_URL, value: URL.FOODHUB_SIT_URL },
            { key: URL.EAT_APPY_PRE_PROD, value: URL.EAT_APPY_PRE_PROD },
            { key: URL.EAT_APPY, value: URL.EAT_APPY },
            { key: URL.API_SIT_STAGE_URL, value: URL.API_SIT_STAGE_URL },
            { key: URL.API_SIT_URL, value: URL.API_SIT_URL },
            { key: URL.MYT_APP, value: URL.MYT_APP },
            { key: URL.CUSTOMER_APP, value: URL.CUSTOMER_APP },
            { key: URL.API_DEV, value: URL.API_DEV },
            { key: URL.DEVELOPMENT, value: URL.DEVELOPMENT },
            { key: URL.PRE_PROD, value: URL.PRE_PROD },
            { key: URL.ALPHA, value: URL.ALPHA },
            { key: URL.BETA, value: URL.BETA },
            { key: URL.GAMMA, value: URL.GAMMA },
            { key: URL.AUS, value: URL.AUS },
            { key: URL.UTC, value: URL.UTC },
            { key: URL.OPTOMANY, value: URL.OPTOMANY },
            { key: URL.FH_API, value: URL.FH_API },
            { key: URL.EAT_APPY, value: URL.EAT_APPY },
            { key: URL.EAT_APPY1, value: URL.EAT_APPY1 },
            { key: URL.EAT_APPY2, value: URL.EAT_APPY2 },
            { key: URL.EAT_APPY3, value: URL.EAT_APPY3 },
            { key: URL.EAT_APPY4, value: URL.EAT_APPY4 },
            { key: URL.EAT_APPY5, value: URL.EAT_APPY5 }
        ]
    },
    {
        key: CONFIGURATOR_KEY.ENVIRONMENT_TYPE,
        itemType: ITEM_TYPE.DROP_DOWN,
        values: [
            { key: ENV_TYPE.LIVE, value: ENV_TYPE.LIVE },
            { key: ENV_TYPE.QA, value: ENV_TYPE.QA }
        ]
    },
    {
        key: CONFIGURATOR_KEY.LIVE_CHAT_KEY,
        itemType: ITEM_TYPE.DROP_DOWN,
        values: [
            { key: LIVE_CHAT_KEY.LIVE, value: LIVE_CHAT_KEY.LIVE },
            { key: LIVE_CHAT_KEY.TEST, value: LIVE_CHAT_KEY.TEST }
        ]
    },
    {
        key: isFranchiseApp() ? CONFIGURATOR_KEY.FRANCHISE_ID : CONFIGURATOR_KEY.STORE_ID,
        itemType: ITEM_TYPE.TEXT_INPUT
    },
    ...(isFranchiseApp()
        ? [
              {
                  key: CONFIGURATOR_KEY.FRANCHISE_HOST,
                  itemType: ITEM_TYPE.TEXT_INPUT
              }
          ]
        : []),
    {
        key: CONFIGURATOR_KEY.API_VERSION,
        itemType: ITEM_TYPE.TEXT_INPUT
    },
    {
        key: CONFIGURATOR_KEY.DEVICE_TOKEN,
        itemType: ITEM_TYPE.TEXT
    }
];

export const SCREEN_NAME = {
    CONFIGURATOR_SCREEN: 'configurator_screen'
};
export const VIEW_ID = {
    BACK_BUTTON: 'back_button',
    UPDATE_BUTTON: 'update_button'
};

export const STRING_CONSTANTS = {
    BRANCH_INFO: 'Branch Info',
    BUILD_TIME: 'Build Time'
};
