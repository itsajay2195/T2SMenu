import { TOTAL_SAVING_TYPE } from './TotalSavingsType';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { takeLatest, all, put } from 'redux-saga/effects';
import { TotalSavingNetwork } from '../Network/TotalSavingsNetwork';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';

function* makeGetTotalSavingsCall(action) {
    try {
        const response = yield apiCall(TotalSavingNetwork.makeGetTotalSavingCall, action);
        if (isValidElement(response)) {
            yield put({ type: TOTAL_SAVING_TYPE.TOTAL_SAVING_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}
function* TotalSavingsSaga() {
    yield all([
        takeLatest(TOTAL_SAVING_TYPE.GET_TOTAL_SAVING, makeGetTotalSavingsCall),
        takeLatest(TOTAL_SAVING_TYPE.REFRESH_FH_HOME_SCREEN_USER_DATA, makeGetTotalSavingsCall)
    ]);
}

export default TotalSavingsSaga;
