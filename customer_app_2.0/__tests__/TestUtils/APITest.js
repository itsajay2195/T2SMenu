/***
 * API Mock:
 * You can do mock API request and response and validate if right API call was made with required parameter from the app.
 *
 * By default, test does not hit API and all the API call have to be mentioned with individual test for better understanding.
 * If you provide wrong mock or mock is not satisfied you will receive `Could not find mock for XXXXXXXs`
 *
 * Usage:
 * APIMock.onPost('/foo', { pass: true }).reply(200, { success: true });, read 'axios-mock-adapter' for more detail.
 */

import nock from 'nock';
import API, { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';

nock.disableNetConnect();

API.defaults.adapter = require('axios/lib/adapters/http');
const APITest = nock(BASE_API_CONFIG.baseURL);

export const APIBaseTest = (baseUrl) => nock(baseUrl);

export default APITest;
