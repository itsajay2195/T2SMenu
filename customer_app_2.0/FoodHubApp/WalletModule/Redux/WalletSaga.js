import { all, put, takeLatest } from 'redux-saga/effects';
import { WalletNetwork } from '../Networrk/WalletNetwork';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { WALLET_TYPE } from './WalletType';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { WALLET_CONSTANTS } from '../Utils/WalletConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

function* makePostWalletDetailsCall(action) {
    try {
        const response = yield apiCall(WalletNetwork.makePostWalletDetailsCall, action);
        if (isValidElement(response) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({
                type: WALLET_TYPE.GET_WALLET_DETAILS_SUCCESS,
                payload: response,
                isPullToRefresh: action.isPullToRefresh
            });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* makeGetWalletBalanceCall() {
    try {
        const response = yield apiCall(WalletNetwork.makeGetWalletBalanceCall);
        if (isValidElement(response) && response.outcome === T2SBaseConstants.SUCCESS && isValidElement(response.balance)) {
            yield put({
                type: WALLET_TYPE.GET_WALLET_BALANCE_SUCCESS,
                balance: response.balance
            });
            yield put({
                type: WALLET_TYPE.GET_WALLET_BANNED_CUSTOMER,
                payload: false
            });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        if (e.message.includes(WALLET_CONSTANTS.BAN_CUSTOMER)) {
            yield put({
                type: WALLET_TYPE.GET_WALLET_BANNED_CUSTOMER,
                payload: true
            });
            showErrorMessage(LOCALIZATION_STRINGS.BAN_CUSTOMER_DESCRIPTION);
        } else {
            showErrorMessage(e);
        }
    }
}
function* WalletSaga() {
    yield all([
        takeLatest(WALLET_TYPE.GET_WALLET_DETAILS, makePostWalletDetailsCall),
        takeLatest(WALLET_TYPE.GET_WALLET_BALANCE, makeGetWalletBalanceCall)
    ]);
}

export default WalletSaga;
