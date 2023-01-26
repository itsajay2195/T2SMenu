import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { isNonCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const ReviewsNetwork = {
    makeGetReviewsCall: (params) => {
        return {
            method: NETWORK_METHOD.GET,
            url: `/consumer/reviews?app_name=${BASE_API_CONFIG.applicationName}&page=${params.page}`,
            isAuthRequired: false
        };
    },

    makeGetFranchiseReviewsCall: (params) => {
        return {
            method: NETWORK_METHOD.POST,
            url: `/franchise/reviews?app_name=${BASE_API_CONFIG.applicationName}&page=${params.page}&api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}`,
            data: {
                store_id: params.storeId
            },
            isAuthRequired: false
        };
    },

    makePostReviewCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidElement(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.POST,
            url: `/consumer/review?app_name=${BASE_API_CONFIG.applicationName}&api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}`,
            data: params.data,
            config: {
                headers: headers
            },
            isAuthRequired: false
        };
    },

    makeIgnoreReviewCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidElement(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.POST,
            url: `/consumer/review?app_name=${BASE_API_CONFIG.applicationName}&api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}`,
            data: params,
            config: {
                headers: headers
            },
            isAuthRequired: false
        };
    }
};
