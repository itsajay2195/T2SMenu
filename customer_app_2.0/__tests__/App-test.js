/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../CustomerApp/App';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    renderer.create(<App />);
});

describe('Sample test', () => {
    /**
     * We are using below tools that you can refer always if writing unit test
     *
     * Jest-Except : https://jestjs.io/docs/en/expect
     * Enzyme : https://enzymejs.github.io/enzyme/docs/api/shallow.html
     * API test: https://github.com/nock/nock
     * SAGA Tester: https://github.com/wix/redux-saga-tester
     */
});


// TODO
// 1. Localisation strings
// 2. isBetween
// 3. length

