import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

const foodHubHeader = { store: AppConfig.FOOD_HUB_STORE_ID };

export const WalletNetwork = {
    //TODO we should remove the hardcoded store id once this FDHB-177 fixed

    makePostWalletDetailsCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/wallet/history?page=${params.page}`,
        config: { headers: foodHubHeader },
        isAuthRequired: true
    }),
    makeGetWalletBalanceCall: () => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/wallet/balance`,
        config: { headers: foodHubHeader },
        isAuthRequired: true
    })
};
