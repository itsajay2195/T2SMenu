import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../Reducers/index';
import { persistReducer, persistStore } from 'redux-persist';
import IndexSagas from '../../Saga/index-sagas';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import Reactotron, { sagaMonitor } from '../../../ReactotronConfig';

const sagaMiddleware = __DEV__ ? createSagaMiddleware({ sagaMonitor }) : createSagaMiddleware();

export const persistConfig = {
    key: 'root',
    keyPrefix: '',
    storage: FilesystemStorage,
    blacklist: [
        'foodHubHomeState',
        'takeawayDetailsState',
        'orderManagementState',
        'takeawayListReducer',
        'tableReservationState',
        'reviewState',
        'offlineNoticeManagerState'
    ] //blacklist the appstate -> initAPIStatus (Nested Key blacklist);
};

const pReducer = persistReducer(persistConfig, reducers);
export const store = createMYTStore();

function createMYTStore() {
    if (__DEV__) {
        const middleware = [sagaMiddleware];
        return createStore(pReducer, compose(applyMiddleware(...middleware), Reactotron.createEnhancer()));
    } else {
        const middleware = [sagaMiddleware];
        return createStore(pReducer, applyMiddleware(...middleware));
    }
}

sagaMiddleware.run(IndexSagas);
export const persistor = persistStore(store);

export default { store, persistor };
