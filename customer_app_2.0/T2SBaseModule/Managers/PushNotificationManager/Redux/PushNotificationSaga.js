import { all, put, select, takeLatest } from 'redux-saga/effects';
import { isFoodHubApp, isFranchiseApp, isValidElement } from '../../../Utils/helpers';
import { Constants as T2SBaseConstants } from '../../../Utils/Constants';
import { PUSH_NOTIFICATION_TYPE } from './PushNotificationTypes';
import { deviceRegistration } from '../PushNotificationNetwork';
import { selectHost } from '../../../Utils/AppSelectors';
import { apiCall } from '../../../Network/SessionManager/Network/SessionNetworkWrapper';
import { getFranchiseHost } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorHelper';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { getConfiguration } from '../../../Network/SessionManager/Utils/SessionManagerSelectors';

function* makePostDeviceRegistrationCall(action) {
    action.host = yield select(selectHost);
    if (isFranchiseApp()) {
        const configData = yield select(getConfiguration);
        action.host = getFranchiseHost(configData);
    }
    try {
        if (!isFoodHubApp() && !isValidString(action.host)) {
            yield put({ type: PUSH_NOTIFICATION_TYPE.DEVICE_REGISTRATION_FAILURE, payload: true });
            return;
        }
        const response = yield apiCall(deviceRegistration.makePostDeviceRegistrationCall, action);
        if (isValidElement(response) && isValidElement(response.outcome) && response.outcome === T2SBaseConstants.SUCCESS) {
            yield put({
                type: PUSH_NOTIFICATION_TYPE.DEVICE_REGISTRATION_SUCCESS,
                payload: {
                    data: response.outcome
                }
            });
        } else {
            yield put({ type: PUSH_NOTIFICATION_TYPE.DEVICE_REGISTRATION_FAILURE, payload: true });
        }
    } catch (e) {
        yield put({ type: PUSH_NOTIFICATION_TYPE.DEVICE_REGISTRATION_FAILURE, payload: true });
    }
}

function* pushNotificationSaga() {
    yield all([takeLatest(PUSH_NOTIFICATION_TYPE.POST_DEVICE_REGISTRATION, makePostDeviceRegistrationCall)]);
}

export default pushNotificationSaga;
