import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import SagaTester from 'redux-saga-tester';
import rootReducer from '../../CustomerApp/Redux/Reducers';
import IndexSaga from '../../CustomerApp/Saga/index-sagas';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import RootStack from '../../CustomerApp/Navigation/AppNavigation';
import { createDynamicValue } from './DynamicTesting';

const UPDATE_STATE_TYPE = '@@UPDATE_TESTER_STATE';

const TestRunner = function({ initialState = {} }) {
    this.sagaTester = new SagaTester({
        reducers: updateReducer,
        initialState: { ...updateStateOnInitialState(rootReducer, initialState) }
    });
    this.sagaTester.start(IndexSaga);

    let _runner = {};

    // Saga Tester
    _runner = Object.assign(_runner, this.sagaTester);
    _runner.sagaTester = this.sagaTester;
    _runner.store = this.sagaTester.store;
    _runner.dispatch = function(...args) {
        return _runner.sagaTester.dispatch(...args);
    };
    _runner.waitFor = function(...args) {
        return _runner.sagaTester.waitFor(...args);
    };
    _runner.getState = function(...args) {
        return _runner.sagaTester.getState(...args);
    };
    _runner.getCalledActions = function(...args) {
        return _runner.sagaTester.getCalledActions(...args);
    };
    _runner.resetAction = function(...args) {
        _runner.sagaTester.calledActions = [];
        _runner.sagaTester.actionLookups = {};
    };
    _runner.getLatestCalledAction = function(...args) {
        return _runner.sagaTester.getLatestCalledAction(...args);
    };
    _runner.updateState = function(newState) {
        return _runner.dispatch({
            type: UPDATE_STATE_TYPE,
            payload: newState
        });
    };

    // Enzyme
    _runner.render = function(ui, { store = _runner.store, ...renderOptions } = {}) {
        return shallow(<ui.type {...ui.props} store={store} />, { ...renderOptions });
    };
    _runner.renderConnectedComponent = function(...args) {
        return _runner
            .render(...args)
            .dive()
            .dive();
    };

    // Navigation
    _runner.navigationTest = function(callback) {
        const AppContainer = RootStack;
        let navRefs = null;
        let navData = null;
        const wrapper = renderer.create(
            <Provider store={_runner.store}>
                <AppContainer
                    ref={(navigatorRef) => {
                        navRefs = navigatorRef;
                    }}
                    onNavigationStateChange={(data) => {
                        navData = data;
                    }}
                />
            </Provider>
        );
        callback({ navigation: navRefs._navigation, navData, render: render(wrapper) });
    };

    _runner.navigate = function(...args) {
        let value = false;
        _runner.navigationTest(({ navigation }) => {
            value = navigation.navigate(...args);
        });
        return value;
    };

    // Dynamic testing
    _runner.generateDynamicResult = createDynamicValue;

    return _runner;
};

const updateReducer = (state, action) => {
    if (action.type === UPDATE_STATE_TYPE) {
        if (typeof action.payload === 'object') {
            return { ...patchState(state, action.payload) };
        }
    }
    return rootReducer(state, action);
};

function updateStateOnInitialState(reducer, diffState = {}) {
    let initialState = { ...reducer(undefined, {}) };
    return patchState(initialState, diffState);
}

function patchState(state, newState) {
    let initialState = { ...state };
    let newPatchState = {};
    let key;
    for (key of Object.keys(newState)) {
        newPatchState = { ...patchState, [key]: { ...initialState[key], ...newState[key] } };
    }
    initialState = { ...initialState, ...newPatchState };
    return initialState;
}

function render(rootWrapper) {
    return {
        getWrapperForConnectedComponent: (connectedComponent) => {
            return rootWrapper.root.findByType(connectedComponent.WrappedComponent);
        }
    };
}

export default TestRunner;
