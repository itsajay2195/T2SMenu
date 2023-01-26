import { WALLET_TYPE } from './WalletType';

export const getWalletDetailsAction = (page = 1, isPullToRefresh = false) => {
    return {
        type: WALLET_TYPE.GET_WALLET_DETAILS,
        page,
        isPullToRefresh
    };
};

export const getWalletBalanceAction = () => {
    return {
        type: WALLET_TYPE.GET_WALLET_BALANCE
    };
};
