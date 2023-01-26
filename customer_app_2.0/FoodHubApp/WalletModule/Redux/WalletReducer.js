import { WALLET_TYPE } from './WalletType';
import _ from 'lodash/array';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const INITIAL_STATE = {
    walletTransactionList: [],
    walletBalance: '0.00',
    current_page: 1,
    has_more: false,
    bannedCustomer: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case WALLET_TYPE.GET_WALLET_DETAILS_SUCCESS:
            return {
                ...state,
                walletTransactionList: action.isPullToRefresh
                    ? action.payload.data
                    : _.concat(state.walletTransactionList, action.payload.data),
                walletBalance: isValidElement(action.payload.balance) && action.payload.balance,
                current_page: isValidElement(action.payload.current_page) && action.payload.current_page,
                has_more: isValidElement(action.payload.has_more) && action.payload.has_more
            };
        case WALLET_TYPE.GET_WALLET_BALANCE_SUCCESS:
            return {
                ...state,
                walletBalance: action.balance
            };
        case WALLET_TYPE.GET_WALLET_BANNED_CUSTOMER:
            return {
                ...state,
                bannedCustomer: action.payload
            };
        default:
            return state;
    }
};
