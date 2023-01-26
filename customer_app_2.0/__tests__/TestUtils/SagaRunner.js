/**
 * Usage:
 * const output = await SagaRunner.runSagaWithDefaultState(testSaga, {});
 *
 * You can check for changes in action and store.
 *
 * 1. To get updated store information after saga run completes, use `output.store`
 * 2. To get list of all actions send by saga, use `output.actions.all`
 * 3. To check if a particular action was called, use `output.actions.hasCalled(type, data)`
 */
import { runSaga } from 'redux-saga';
import rootReducer from '../../CustomerApp/Redux/Reducers';

const runSagaWithState = async (initialState, saga, ...args) => {
    return _runSagaWithState(initialState, saga, ...args);
};

const runSagaWithDefaultState = async (saga, ...args) => {
    let store = { ...rootReducer(undefined, {}) };
    return _runSagaWithState(store, saga, ...args);
};

const runSagaByApplyingState = async (diffState, saga, ...args) => {
    let initialState = { ...rootReducer(undefined, {}) };
    let key;
    for (key of Object.keys(diffState)) {
        initialState = { ...initialState, [key]: { ...initialState[key], ...diffState[key] } };
    }
    return _runSagaWithState(initialState, saga, ...args);
};

const _runSagaWithState = async (initialState, saga, ...args) => {
    const dispatched = [];

    let store = initialState;

    await runSaga(
        {
            dispatch: (action) => {
                store = rootReducer(store, action);
                dispatched.push(action);
            },
            getState: () => store
        },
        saga,
        ...args
    ).toPromise();

    return {
        actions: _actions(dispatched),
        store
    };
};

const _actions = (dispatched) => {
    return {
        all: dispatched,
        hasCalled: (type, payload = undefined) => {
            let action = { type };
            if (payload) {
                action = { ...action, ...payload };
            }
            expect(dispatched).toContainObject(action);
        }
    };
};

export default {
    runSagaWithDefaultState,
    runSagaWithState,
    runSagaByApplyingState
};
