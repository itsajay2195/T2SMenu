import { all, select, takeEvery, call } from 'redux-saga/effects';
import { selectEnvConfig } from 't2sbasemodule/Utils/AppSelectors';
import { BasketNetwork } from '../../BasketModule/Network/BasketNetwork';
import { FH_LOG_TYPE } from '../Utils/FhLogsConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

export function* makeFHLogApiCall(action) {
    const graphqlQuery = action?.graphqlQuery;
    const configEnvType = yield select(selectEnvConfig);
    try {
        if (isValidElement(graphqlQuery)) {
            yield call(BasketNetwork.makeFHLogs, {
                data: JSON.stringify(graphqlQuery),
                configType: configEnvType
            });
        }
    } catch (e) {
        //
    }
}
function* FhLogsSaga() {
    yield all([takeEvery(FH_LOG_TYPE.CAPTURE_ERROR_LOG, makeFHLogApiCall)]);
}
export default FhLogsSaga;
