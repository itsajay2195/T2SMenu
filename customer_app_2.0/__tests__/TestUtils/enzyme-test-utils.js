// https://redux.js.org/recipes/writing-tests

import React from 'react';
import { createStore } from 'redux';
// Import your own reducer
import { shallow } from 'enzyme';
import rootReducer from '../../CustomerApp/Redux/Reducers';

function render(ui, { updateState, store = mockStore(updateState), ...renderOptions } = {}) {
    shallow(<ui.type {...ui.props} store={store} />, { ...renderOptions });
}

function mockStore(diffState = {}) {
    return createStore(rootReducer, updateStateOnInitialState(rootReducer, diffState));
}

function updateStateOnInitialState(reducer, diffState = {}) {
    let initialState = { ...reducer(undefined, {}) };
    let key;
    for (key of Object.keys(diffState)) {
        initialState = { ...initialState, [key]: { ...initialState[key], ...diffState[key] } };
    }
    return initialState;
}

function renderConnectedComponent(...args) {
    return render(...args)
        .dive()
        .dive();
}

// override render method
export { render, mockStore, renderConnectedComponent, updateStateOnInitialState };
