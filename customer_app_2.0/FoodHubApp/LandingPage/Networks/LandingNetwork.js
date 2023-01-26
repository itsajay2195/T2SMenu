import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';

export const LandingNetwork = {
    getCountryListCall: () => ({
        method: NETWORK_METHOD.GET,
        url: '/foodhub/country/list?api_token=' + BASE_PRODUCT_CONFIG.OPEN_API_TOKEN,
        isAuthRequired: false
    })
};
