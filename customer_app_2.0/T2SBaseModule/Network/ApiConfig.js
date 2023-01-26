import axios from 'axios';
import { errorHandler, requestHandler, successHandler } from './NetworkInterceptors';
import { AppConfig, URL } from '../../CustomerApp/Utils/AppConfig';
import { Platform } from 'react-native';
import Config from 'react-native-config';

export const BASE_API_CONFIG = {
    baseURL: URL.LIVE,
    applicationName: Config.APP_TYPE,
    requestTimeOut: 40000
};
/**
 *  Product id for Customer App - 1 Foodhub - 3
 * @type {{consent_by: string, product_id: number, platform_id: number, server_key: string, sender_id: string, platform: (string), consent_type: string, policy_type_id: {terms_and_conditions: number, privacy_policy: number, sms: number, terms_of_use: number, all_promo: number, email: number, allergy_information: number}}}
 */
export const BASE_PRODUCT_CONFIG = {
    platform_id: Platform.OS === 'ios' ? 2 : 3,
    product_id: Config.PRODUCT_ID,
    gdpr_Platform_id: Config.GDPR_PLATFORM_ID,
    consent_by: 'CUSTOMER',
    consent_type: 'CUSTOM',
    server_key: Config.SERVER_KEY,
    sender_id: Config.SENDER_ID,
    platform: Platform.OS,
    policy_type_id: {
        terms_and_conditions: 1,
        terms_of_use: 5,
        privacy_policy: 4,
        allergy_information: 2,
        sms: 7,
        pushNotification: 9,
        email: 8,
        all_promo: 3,
        about_us: 6
    },
    OPEN_API_TOKEN: '99b8ad5d2f9e80889efcd73bc31f7e7b'
};

const axiosInstance = axios.create({
    baseURL: BASE_API_CONFIG.baseURL,
    timeout: BASE_API_CONFIG.requestTimeOut,
    headers: { 'api-token': AppConfig.API_TOKEN }
});

// Add interceptors
axiosInstance.interceptors.request.use((request) => requestHandler(request));
axiosInstance.interceptors.response.use(
    (response) => successHandler(response),
    (error) => errorHandler(error)
);

export default axiosInstance;
