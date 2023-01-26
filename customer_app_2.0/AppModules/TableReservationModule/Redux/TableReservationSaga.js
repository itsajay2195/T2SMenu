import { TABLE_RESERVATION_TYPE } from './TableReservationType';
import { TableReservationNetwork } from '../Network/TableReservationNetwork';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage, showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { all, put, takeLatest } from 'redux-saga/effects';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { apiCall } from 't2sbasemodule/Network/SessionManager/Network/SessionNetworkWrapper';

function* makeGetTableReservationSlotsCall(action) {
    try {
        const response = yield apiCall(TableReservationNetwork.makeGetTableReservationSlotsCall, action);
        if (isValidElement(response)) {
            yield put({ type: TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS_SUCCESS, payload: response });
        } else {
            yield put({
                type: TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS_FAILURE,
                errorMsg: LOCALIZATION_STRINGS.TABLE_BOOKING_SLOTS_ERROR_MSG
            });
        }
    } catch (e) {
        yield put({
            type: TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS_FAILURE,
            errorMsg: LOCALIZATION_STRINGS.TABLE_BOOKING_SLOTS_ERROR_MSG
        });
    }
}

function* makePostTableReservationCall(action) {
    try {
        const response = yield apiCall(TableReservationNetwork.makePostTableReservationCall, action);
        if (isValidElement(response)) {
            yield put({ type: TABLE_RESERVATION_TYPE.POST_TABLE_RESERVATION_SUCCESS, tableReserved: true });
            showInfoMessage(LOCALIZATION_STRINGS.TABLE_RESERVATION_SUCCESS_MSG);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    } catch (e) {
        showErrorMessage(e);
    }
}

function* TableReservationSaga() {
    yield all([
        takeLatest(TABLE_RESERVATION_TYPE.GET_TABLE_RESERVATION_SLOTS, makeGetTableReservationSlotsCall),
        takeLatest(TABLE_RESERVATION_TYPE.POST_TABLE_RESERVATION, makePostTableReservationCall)
    ]);
}

export default TableReservationSaga;
