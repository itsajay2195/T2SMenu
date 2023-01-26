import md5 from 'md5';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import { isCustomerApp, isFranchiseApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { Platform } from 'react-native';

/**
 * Configuration used for views
 */
export const URL = {
    LIVE: 'https://foodhub-api.t2sonline.com',
    LIVE_ONLINE: 'https://api.t2sonline.com',
    LIVE_T2S: 'https://api.touch2success.com',
    QA: 'https://qa-api.t2scdn.com',
    API_SIT_STAGE_URL: 'https://sit-api.stage.t2sonline.com',
    API_SIT_URL: 'https://sit-api.t2scdn.com',
    PRE_PROD_NOCG_ONLINE: 'https://api-preprod-nocg.t2sonline.com',
    PRE_PROD_ONLINE: 'https://api-preprod.t2sonline.com',
    FOODHUB_SIT_URL: 'https://sit-foodapi.t2scdn.com',
    PRE_PROD: 'https://api-preprod.t2scdn.com',
    ALPHA: 'https://api-alpha.t2scdn.com',
    BETA: 'https://api-beta.t2scdn.com',
    GAMMA: 'https://api-gamma.t2scdn.com',
    AUS: 'https://api-aus.t2scdn.com',
    UTC: 'https://api-utc.t2scdn.com',
    DEVELOPMENT: 'https://dev-api.t2scdn.com/',
    OPTOMANY: 'https://api-optomany.t2scdn.com',
    API_DEV: 'https://apidev1.t2scdn.com',
    CUSTOMER_APP: 'https://customer-api.t2scdn.com',
    MYT_APP: 'https://myt-api.t2scdn.com',
    FH_API: 'https://foodhub-api.t2scdn.com',
    EAT_APPY: 'https://eatappy-api.t2scdn.com',
    EAT_APPY1: 'https://eatappy1-api.t2scdn.com',
    EAT_APPY2: 'https://eatappy2-api.t2scdn.com',
    EAT_APPY3: 'https://eatappy3-api.t2scdn.com',
    EAT_APPY4: 'https://eatappy4-api.t2scdn.com',
    EAT_APPY5: 'https://eatappy5-api.t2scdn.com',
    EAT_APPY_PRE_PROD: 'https://api-preprod-eatappy.t2sonline.com'
};

export const LIVE_CHAT_KEY = {
    LIVE: '31fYjIWofUwQW05byDgna9MNu13qgAqz',
    TEST: '5nV5FxhkIbyBnWb2jrWhAc3c1G685dfS'
};

export const ENV_TYPE = {
    LIVE: 'LIVE',
    QA: 'QA'
};

export const SEGMENT_KEY = {
    LIVE: '4qeRDhYF5W2e5c2JoQMucLtVj4FMKi1F',
    SIT: 'Imb6ASDgxRnTAbLpswh2x6eCQQsypfSK'
};

export const BUGSEE_KEY = {
    ANDROID: {
        CUSTOMER: '4e50a83e-7094-47fd-969e-2a40d02ad80f',
        FOODHUB: 'd932b3da-f535-41ca-b5bd-9f41f9f91f09',
        FRANCHISE: '71f0feb7-3324-4f60-b3d0-3b51803d9ebe'
    },
    IOS: {
        CUSTOMER: '5fb33b21-29a2-4ea0-9af4-9a685514d093',
        FRANCHISE: '7ea070ca-43ef-41fa-b91c-3407765927aa',
        FOODHUB: '4b917687-2dbb-4d9a-9222-60fb2c6d6f4c'
    }
};

export const getBugseeKey = () => {
    let { ANDROID, IOS } = BUGSEE_KEY;
    let isFranchise = isFranchiseApp();
    let checkIsCustomerApp = isCustomerApp();
    if (Platform.OS === 'ios') {
        return isFranchise ? IOS.FRANCHISE : checkIsCustomerApp ? IOS.CUSTOMER : IOS.FOODHUB;
    } else {
        return isFranchise ? ANDROID.FRANCHISE : checkIsCustomerApp ? ANDROID.CUSTOMER : ANDROID.FOODHUB;
    }
};

export const AppConfig = {
    buildConfig: {
        buildType: 'release'
    },
    featureGate: {
        QA: 'https://falcon-qa.stage.t2sonline.com/lang/mobile/featuregate/',
        PROD: 'https://api.t2sonline.com/lang/mobile/featuregate/'
    },
    languages: {
        QA: 'https://falcon-qa.stage.t2sonline.com/lang/foodhub/',
        PROD: 'https://api.t2sonline.com/lang/foodhub/'
    },
    fhLogsUrl: {
        QA: 'https://zmpjapgiejgj3hokmnmv3bcrl4.appsync-api.us-east-1.amazonaws.com/graphql',
        PROD: 'https://mfhgw2cfe5bx7g7lxaiy2dx524.appsync-api.eu-west-2.amazonaws.com/graphql'
    },
    fhLogsKey: {
        QA: 'da2-gqy2zguabrgxlbiww5ezfi4r5u',
        PROD: 'da2-6joz7zlvizhqllx5qbfopixcsi'
    },
    recommendationUrl: {
        QA: 'https://yaqitj6kaynr4xyxfovm6zu5ke0cxjcq.lambda-url.us-east-1.on.aws/',
        PROD: 'https://foodhub-takeaway-recommendation.t2sonline.com/'
    },
    itemRecommendationUrl: {
        QA: 'https://45t7zzy23mqmorvgatx5bh7uwm0yqhdf.lambda-url.us-east-1.on.aws/',
        PROD: 'https://item-recommendations.foodhub.com/'
    },
    isSwipeToCheck: false,
    SAVED_CARD_PAYMENT_FAILURE_RETRY: false,
    SEGMENT_EVENTS_ENABLED: true,
    BRAZE_EVENTS_ENABLED: true,
    STORE_ID: Config.STORE_ID, //'804954', // 795404
    FRANCHISE_HOST: Config.FRANCHISE_HOST,
    FRANCHISE_ID: Config.FRANCHISE_ID,
    POWERED_BY_BRANDING: Config.POWERED_BY_BRANDING,
    FOOD_HUB_STORE_ID: '794891', // required only for wallet related API's & consent API
    API_VERSION: 'v2022_05_05',
    API_TOKEN: 'J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx',
    APPLE_STORE_ID: Config.APPLE_STORE_ID, //TODO We should update store id once we create an app id in iTunes
    PACKAGE_NAME: Config.PACKAGE_NAME,
    APP_NAME: DeviceInfo.getApplicationName(),
    ANDROID_PLAY_STORE_URL: Config.ANDROID_PLAY_STORE_URL,
    IOS_APP_STORE_URL: Config.IOS_APP_STORE_URL,
    FOOD_HUB_TRUST_PILOT_URL_UK: Config.FOODHUB_APP_TRUST_PILOT_URL_UK,
    ANDROID_JOIN_BETA_URL: Config.ANDROID_BETA_LINK,
    IOS_JOIN_BETA_URL: Config.IOS_BETA_LINK,
    //TODO we should update zendesk key in feature development and we are currently using foodhub zendesk key
    zendesk: {
        chatApiDevelopmentKey: '5bZygngcKnAou9S7kz38OIA3Gn8b5E1J',
        chatApiKey: 'p40xGGf1nf4PqfoDPexGY2X5KdHx0tMX',
        department: 'Customer App'
    },
    zendeskSupport: {
        zendeskUrl: 'https://support.foodhub.co.uk',
        stagingZendeskUrl: 'https://support.foodhub.co.uk',
        liveAppId: '73125c6770c6734e583efed49706da4cccc5420324774183',
        liveClientId: 'mobile_sdk_client_bff839e368d122fdbaae',
        stagingAppId: '0d0a828ed69d99711b309b2e9d82ea69d27dd66248f033bf',
        stagingClientId: 'mobile_sdk_client_cb1a0c04ff0031067af5'
    },
    Instabug: {
        BETA_KEY: '66089e32dc64bc9d868f7dce8fd1a7b7',
        LIVE_KEY: 'cbb2b35123162d8b755035acf1c2ccd3'
    },
    zohoSupport: {
        orgId: '681446553',
        appID: 'edbsn602a46be6142c7b79747b49d0d8d66a13a7ea23f25aa371c9839eee0f44753d0',
        dataCenter: 'US',
        departmentID: '354176000027122023',
        iOSAppKey: 'ze52X0f0iz%2BD7iDBuxKgbmzQsGdWJCX5IfHuszLUF%2F2LnCngo1TrCqALcqXcUnHQezxSsg0I9S8%3D',
        AndroidAppKey: 'ze52X0f0iz%2BD7iDBuxKgbmzQsGdWJCX5IfHuszLUF%2F2LnCngo1TrCqALcqXcUnHQezxSsg0I9S8%3D',
        iOSAccessKey:
            'COcH4D2v%2B5fUkzJ4JN13j4BrQxvW9c0sOONzbBzQ%2BK20MOLWldN2b%2BBo7e04zkfpxJ91wEB5vC24vwoCoNxRSqcm5cQM16Sp4My8tD1PA06a3FaYF7Y3%2F12CrtL%2FPgT9hJhltDR4S%2BCm5ZXtkHjTPxPCANC9LnQa',
        AndroidAccessKey:
            'COcH4D2v%2B5fUkzJ4JN13j4BrQxvW9c0sOONzbBzQ%2BK20MOLWldN2b%2BBo7e04zkfp32dIx9cnxcb4elnUQLQY6%2FbO2Ip3HOGq94iNtCs2jtia3FaYF7Y3%2F12CrtL%2FPgT9hJhltDR4S%2BCm5ZXtkHjTPxPCANC9LnQa'
    },
    JudoKit: {
        key: 'judo_pay',
        isSandBox: false,
        merchantId: 'merchant.com.foodhub',
        token: 'PB5AirRc8L7UahgG',
        sandbox_token: 'pT0uDz4d83SFk7x0',
        secret: '9427ad232248c1133ca2d824990c26897d7f85f0ad9e8ae3bc6b9316758bfb1d',
        sandbox_secret: '5ab244e4c41cd7877febbdb2ca5c1a5cfd35d8a2daf23909609b00b090612773',
        judoId: '100177-237',
        googleJudoId: '100177237'
    },
    CheckoutGateway: {
        key: 'checkout',
        isSandBox: false,
        merchantId: 'merchant.com.foodhub.checkout',
        sandbox_merchantId: 'merchant.com.foodhub.sandbox',
        type: 'PAYMENT_GATEWAY',
        gateway: 'checkoutltd',
        gatewayMerchantId: 'pk_yxda2co3fvfazmbpmobhzcf6uaj',
        gatewaySandboxMerchantId: 'pk_sbox_qpravplcrp3k75nth65diubfiim'
    },
    BASKET_RECOMMENDATION_URL_STAGING: 'https://ovrq6chwle.execute-api.us-east-1.amazonaws.com/staging_beta',
    BASKET_RECOMMENDATION_URL_LIVE: 'https://o0xr1ow3o1.execute-api.eu-west-2.amazonaws.com/beta',
    CHAT_WEB_VIEW_URL: 'https://foodhub.co.uk/chat?data=',
    HELP_CENTER_WEB_VIEW_URL: 'https://helpcenter.foodhub.com/portal/en/kb/queries?data=', // Todo need to updated once fix web env
    COUNTRY_LIST_CG_ENABLE: false,
    BUGSEE: {
        ANDROID: getBugseeKey(),
        IOS: getBugseeKey()
    }
};

export const getMd5Hash = (input) => {
    return md5(input).toString();
};

//TODO we have to avoid the JSON parsing in future
export const getEnvType = (envType) => {
    let type = ENV_TYPE.LIVE;
    try {
        const data = JSON.parse(envType).config_env_type;
        type = isValidElement(data) ? data : ENV_TYPE.LIVE;
    } catch (e) {
        //TODO nothing to handle
    }
    return type;
};

export const getFeatureGateURL = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.featureGate.QA : AppConfig.featureGate.PROD;
};

export const getLanguagesURL = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.languages.QA : AppConfig.languages.PROD;
};

export const getFHLogsURL = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.fhLogsUrl.QA : AppConfig.fhLogsUrl.PROD;
};

export const getFHLogsAPIKey = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.fhLogsKey.QA : AppConfig.fhLogsKey.PROD;
};

export const getTARecommendationURL = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.recommendationUrl.QA : AppConfig.recommendationUrl.PROD;
};

export const getItemRecommendationURL = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.itemRecommendationUrl.QA : AppConfig.itemRecommendationUrl.PROD;
};

export const getWebhookURL = (order_id, order_total) => {
    return `https://api-webhook.touch2success.com/hook/confirm?id=${order_id}&amount=${order_total}`;
};

export const LANGUAGE = () => {
    return {
        default: {
            name: 'English (UK)',
            code: 'en-gb'
        },
        options: [
            {
                name: 'English (US)',
                code: 'en-us'
            },
            {
                name: '普通话 (Mandarin)',
                code: 'zh'
            },
            {
                name: '繁體中文 (Traditional Chinese)',
                code: 'zh-hant'
            },
            {
                name: 'Espanol (Spanish)',
                code: 'es'
            }
        ]
    };
};

export const getLanguage = (defaultLanguage, languageOptions) => {
    if (isValidElement(defaultLanguage)) {
        return [defaultLanguage, ...languageOptions];
    } else {
        return [LANGUAGE().default, ...LANGUAGE().options];
    }
};

export const getBasketRecommendationURL = (envType) => {
    return getEnvType(envType) === ENV_TYPE.QA ? AppConfig.BASKET_RECOMMENDATION_URL_STAGING : AppConfig.BASKET_RECOMMENDATION_URL_LIVE;
};

//Change Code Push version here. Eg: CP 2.0 QA 3. Keep it as empty string if it's not a code push build
export const CP_VERSION = '';
