import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { isValidElement, isFoodHubApp } from 't2sbasemodule/Utils/helpers';
import { getItemRecommendationURL } from '../../../CustomerApp/Utils/AppConfig';
import moment from 'moment-timezone';

export const HomeNetWork = {
    makeGetOurRecommendationsCall: (params) => {
        if (isValidElement(params?.takeawayId) && isValidElement(params?.customerId) && isFoodHubApp()) {
            //As pee discuss with API team app name no need to add below recommendation Curl
            return {
                method: NETWORK_METHOD.GET,
                url:
                    getItemRecommendationURL(params.configType) +
                    `?customer_id=${params.customerId}&takeaway_id=${params.takeawayId}&date=${moment().toISOString()}`,
                isAuthRequired: false
            };
        } else
            return {
                method: NETWORK_METHOD.GET,
                url: `/consumer/menu/popular?app_name=${BASE_API_CONFIG.applicationName}&date=${moment().toISOString()}`,
                isAuthRequired: false
            };
    },
    makeGetPreviousOrdersCall: () => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/menu/recent/order?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),
    makeGetCurrentOffersCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/offer/banner_original?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&version=mobile`,
        isAuthRequired: false
    })
    //TODO as of now hardcoded the api_token we should change it back once get the new key from API team
};
