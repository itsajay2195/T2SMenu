import { SAVED_CARDS_TYPE } from './SavedCardsType';
import { SavedCardsNetwork } from '../Network/SavedCardsNetwork';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { Constants as T2SBaseConstants } from 't2sbasemodule/Utils/Constants';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { put, all, takeLatest } from 'redux-saga/effects';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';

function* makeDeleteAllSavedCardsCall(action) {
    try {
        const response = yield apiCall(SavedCardsNetwork.makeDeleteAllSavedCardsCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({ type: SAVED_CARDS_TYPE.DELETE_ALL_SAVED_CARDS_SUCCESS, allCardsDeleted: true });
            showInfoMessage(LOCALIZATION_STRINGS.DELETE_ALL_SAVED_CARDS_SUCCESS_MSG);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* SavedCardsSaga() {
    yield all([takeLatest(SAVED_CARDS_TYPE.DELETE_ALL_SAVED_CARDS, makeDeleteAllSavedCardsCall)]);
}

export default SavedCardsSaga;
