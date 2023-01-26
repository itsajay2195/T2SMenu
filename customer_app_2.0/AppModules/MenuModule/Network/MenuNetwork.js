import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { getCurrentDay } from 't2sbasemodule/Utils/helpers';
import moment from 'moment-timezone';

export const MenuNetwork = {
    makeGetMenuCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/store/${params.store_id}/menu/foodhub/${getCurrentDay()}.json?date=` + moment().toISOString(),
        isAuthRequired: false
    }),
    makeGetMenuAddOnCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/store/${params.store_id}/addons/all.json?date=` + moment().toISOString(),
        isAuthRequired: false
    }),
    makeGetFallbackMenuCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/menu?app_name=${BASE_API_CONFIG.applicationName}&sref=${params.store_id}&day=${getCurrentDay()}`,
        isAuthRequired: false
    }),
    makeGetFallbackMenuAddOnCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/menu/addons?app_name=${BASE_API_CONFIG.applicationName}&sref=${params.store_id}&day=${getCurrentDay()}`,
        isAuthRequired: false
    })
    /**
     * Keep these for future purpose
     */
    // makeGetMenuAddOnGroupCall: () => ({
    //     method: NETWORK_METHOD.GET,
    //     url: '/consumer/menu/option_groups?app_name=' + BASE_API_CONFIG.applicationName,
    //     isAuthRequired: false
    // })
    // makeGetMenuAddOnsCall: () => ({
    //     method: NETWORK_METHOD.GET,
    //     url: '/consumer/menu/options?app_name=' + BASE_API_CONFIG.applicationName,
    //     isAuthRequired: false
    // })
};
