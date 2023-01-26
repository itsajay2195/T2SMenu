import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const SavedCardsNetwork = {
    makeDeleteAllSavedCardsCall: () => ({
        method: NETWORK_METHOD.DELETE,
        url: '/consumer/card?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    })
};
