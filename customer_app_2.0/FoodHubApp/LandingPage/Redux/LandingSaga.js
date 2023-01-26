import { all, put, takeLatest } from 'redux-saga/effects';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { LANDING_TYPE } from './LandingType';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';
import { LandingNetwork } from '../Networks/LandingNetwork';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

export function* makeCountryListCall(action) {
    try {
        const response = yield apiCall(LandingNetwork.getCountryListCall);
        if (isValidElement(response)) {
            yield put({ type: LANDING_TYPE.GET_COUNTRY_LIST_SUCCESS, payload: response });
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* LandingSaga() {
    yield all([takeLatest(LANDING_TYPE.GET_COUNTRY_LIST, makeCountryListCall)]);
}

export default LandingSaga;
