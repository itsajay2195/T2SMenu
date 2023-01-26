import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from '../../../Network/ApiConfig';
import { NETWORK_METHOD } from '../../../Network/SessionManager/Network/SessionConst';

export const AppUpdate = {
    makeGetAppVersion: () => ({
        method: NETWORK_METHOD.GET,
        url: `/lookup/product/${BASE_PRODUCT_CONFIG.product_id}/platform/${BASE_PRODUCT_CONFIG.platform_id}/version?app_name=${BASE_API_CONFIG.applicationName}`,
        ignoreLog: true
    })
};
