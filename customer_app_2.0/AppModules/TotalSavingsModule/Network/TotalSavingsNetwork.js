import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const TotalSavingNetwork = {
    makeGetTotalSavingCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/orders/total_savings?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    })
};
