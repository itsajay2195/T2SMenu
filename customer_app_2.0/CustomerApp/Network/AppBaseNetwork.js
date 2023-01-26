import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { getFeatureGateURL } from '../Utils/AppConfig';
import moment from 'moment-timezone';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

export const appBase = {
    makeAppAliveCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: `/app/alive?api_token=${params.licenseKey}`,
        data: {
            app_name: BASE_API_CONFIG.applicationName
        },
        isAuthRequired: false
    }),
    featureGateAPICall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: getFeatureGateURL(params.configType) + `${params.portal}.json?date=` + moment().toISOString(),
        isAuthRequired: false
    }),

    makeStoreConfigCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/store?app_name=${BASE_API_CONFIG.applicationName}?date=` + moment().toISOString(),
        isAuthRequired: false
    }),

    makePolicyLookupCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/lookup/product/${BASE_PRODUCT_CONFIG.product_id}/policy?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: false
    }),

    makePostFcmRegistrationCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/customer_fcm_registration?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            server_key: BASE_PRODUCT_CONFIG.server_key,
            sender_id: BASE_PRODUCT_CONFIG.sender_id,
            platform: BASE_PRODUCT_CONFIG.platform.toUpperCase(),
            host: params.host
        },
        isAuthRequired: false,
        ignoreLog: true
    }),
    makeLocationInitialConfig: (params) => ({
        method: NETWORK_METHOD.GET,
        url: `location/initial?app_name=${BASE_API_CONFIG.applicationName}${isValidElement(params.host) ? `&host=${params.host}` : ''}`,
        isAuthRequired: false,
        params
    }),
    makeFeatureGateAPICall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/product/${BASE_PRODUCT_CONFIG.product_id}/platform/${BASE_PRODUCT_CONFIG.gdpr_Platform_id}/features/options?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: false
    }),

    makeStoreDetailsFromSlagAPICall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `foodhub/takeaway/details?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}`,
        data: {
            slug_name: params.slug_name,
            town: params.town
        },
        isAuthRequired: false
    })
};
