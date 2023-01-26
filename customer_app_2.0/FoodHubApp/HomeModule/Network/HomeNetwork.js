import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { isCustomerApp, isValidString } from 't2sbasemodule/Utils/helpers';
import Config from 'react-native-config';
import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import DeviceInfo from 'react-native-device-info';
import { randomSessionToken } from '../Utils/Helper';

export const HomeNetwork = {
    getRecentTakeawayCall: () => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/recent/takeaway?app_name=' + Config.APP_TYPE,
        isAuthRequired: true
    }),
    getRecentOrders: (params) => {
        let headers = {};
        if (isCustomerApp() && isValidString(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.GET,
            url: '/consumer/menu/recent/order?canceled_orders=true&includes=review&app_name=' + Config.APP_TYPE,
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    getFoodHubTotalSavingsCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/foodhub/last_week_savings?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: false
    }),
    fuzzySearchAutoComplete: (params) => {
        var session_token = isValidString(params?.sessiontoken) ? params.sessiontoken : randomSessionToken();
        return {
            method: NETWORK_METHOD.POST,
            url: `${BASE_API_CONFIG.baseURL}/franchise/autocomplete?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${
                BASE_API_CONFIG.applicationName
            }&sessiontoken=${session_token}&platform_id=${BASE_PRODUCT_CONFIG.platform_id}&product_id=${
                BASE_PRODUCT_CONFIG.product_id
            }&uuid=${DeviceInfo.getUniqueId()}`,
            data: {
                search: params.text,
                sessiontoken: session_token
            },
            isAuthRequired: false
        };
    }
};
