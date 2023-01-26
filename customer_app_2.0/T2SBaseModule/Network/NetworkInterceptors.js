import { NETWORK_CONSTANTS } from '../Utils/Constants';
import { isValidElement } from '../Utils/helpers';
import { logAPIErrorEvent, parseAPIEndPoint } from './NetworkHelpers';

import { getApiVersion, getBaseURL } from 'appmodules/ConfiguratorModule/Utils/ConfiguratorHelper';
import axios from 'axios';
import { ERROR_CODE } from './SessionManager/Utils/SessionManagerConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { store } from '../../CustomerApp/Redux/Store/ConfigureStore';
import { getConfiguration } from './SessionManager/Utils/SessionManagerSelectors';
//TODO we should pass these headers in all the endpoints except s3 config call
// api-version:v2019_08_27
// api_token:J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx
// Accept:Application/JSON
// locale:united kingdom
// store:3049
// region:1
// If user logged in we should add user_token: 7ae2a7ad71e6a9754941be0bcae9b580

// Create CancelToken Source.
const CancelToken = axios.CancelToken;
export const source = CancelToken.source();
const getConfigurationState = () => {
    const state = store.getState();
    return getConfiguration(state);
};
export const requestHandler = (request) => {
    const configurationData = getConfigurationState();
    request.baseURL = getBaseURL(configurationData);
    const api_version = getApiVersion(configurationData);
    if (isValidElement(api_version)) {
        request.headers['api-version'] = api_version;
    }

    if (__DEV__) {
        console.log('Request Data:', request.data);
        console.log('Request Headers:', request.headers);
        console.log('Request Config:', request);
    }
    //Append cancelToken to all Request header
    request.headers.cancelToken = source.token;
    return request;
};
export const successHandler = (response) => {
    return response.data;
};
export const errorHandler = (error) => {
    let errorObject = {
        type: '',
        message: '',
        code: ''
    };
    if (isValidElement(error?.response?.data)) {
        const data = error.response.data;
        if (__DEV__) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', data);
            console.log('Response Headers:', error.response.headers);
            console.log('Response Config:', error.config);
        }
        let errorParams = {
            u: '',
            m: ''
        };
        //TODO need to return errorCode here for handling
        if (isValidElement(error.config?.url) || isValidElement(error.config?.method)) {
            errorParams.u = parseAPIEndPoint(error.config.url);
            errorParams.m = error.config.method;
            logAPIErrorEvent(errorParams);
        }
        if (
            isValidElement(data.error?.code) &&
            (data.error.code === ERROR_CODE.UNAUTHORIZED_ACCESS ||
                data.error.code === ERROR_CODE.UNAUTHORIZED_CLIENT ||
                data.error.code === ERROR_CODE.CUSTOMER_NOT_REGISTERED ||
                data.error.code === ERROR_CODE.REQUEST_PARAM_MISSING)
        ) {
            return error;
        } else if (isValidElement(error.response.status) && error.response.status >= 500 && error.response.status < 599) {
            errorObject.type = NETWORK_CONSTANTS.API_ERROR;
            errorObject.message = LOCALIZATION_STRINGS.SERVER_ERROR;
            errorObject.code = isValidElement(data.error) ? data.error.code : '';
            return Promise.reject(errorObject);
        } else {
            if (isValidElement(data) && Object.prototype.hasOwnProperty.call(data, 'errors')) {
                let code = isValidElement(data.error?.code) && data.error.code;
                let errors = '';
                for (var key in data.errors) {
                    errors += data.errors[key];
                }
                errorObject.type = NETWORK_CONSTANTS.API_ERROR;
                errorObject.message = errors;
                errorObject.code = isValidElement(code) ? code : '';
                return Promise.reject(errorObject);
            } else {
                if (isValidElement(data) && Object.prototype.hasOwnProperty.call(data, 'error') && isValidElement(data.error.message)) {
                    errorObject.type = NETWORK_CONSTANTS.API_ERROR;
                    errorObject.message = data.error.message;
                    errorObject.status =
                        isValidElement(error) && isValidElement(error.response) && isValidElement(error.response.status)
                            ? error.response.status
                            : '';
                    errorObject.code = isValidElement(data.error?.code) ? data.error.code : '';
                    return Promise.reject(errorObject);
                } else {
                    errorObject.type = NETWORK_CONSTANTS.API_ERROR;
                    errorObject.message = LOCALIZATION_STRINGS.WENT_WRONG;
                    errorObject.code = '';
                    return Promise.reject(errorObject);
                }
            }
        }
    } else {
        // Something else happened while setting up the request
        if (__DEV__) {
            console.log('Error Message:', error.message);
        }
        logAPIErrorEvent({ error_config: JSON.stringify(error?.config) });
        if (isValidElement(error?.message)) {
            let message = error.message;
            if (message.includes('timeout')) {
                message = LOCALIZATION_STRINGS.TIMEOUT_ERROR;
            }
            errorObject.type = NETWORK_CONSTANTS.NETWORK_ERROR;
            errorObject.message = message;
            errorObject.code = isValidElement(error?.code) ? error.code : '';
            return Promise.reject(errorObject);
        } else {
            errorObject.type = NETWORK_CONSTANTS.NETWORK_ERROR;
            errorObject.message = LOCALIZATION_STRINGS.WENT_WRONG;
            errorObject.code = '';
            return Promise.reject(errorObject);
        }
    }
};
