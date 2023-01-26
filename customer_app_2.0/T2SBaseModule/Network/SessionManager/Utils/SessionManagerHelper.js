import { getDeviceId, getModel, getUniqueId } from 'react-native-device-info';
import { DEFAULT_TOKEN_TYPE, SESSION_AUTH_TYPE } from './SessionManagerConstants';
import { isValidElement, isValidString } from '../../../Utils/helpers';
import { BASE_PRODUCT_CONFIG } from '../../ApiConfig';
import { addTimeDeviceMoment } from '../../../Utils/DateUtil';

export const getJWTDeviceDetail = () => {
    const modal = getModel();
    return {
        name: isValidString(modal) ? modal : isValidString(getDeviceId()) ? getDeviceId() : '',
        platform_id: BASE_PRODUCT_CONFIG.platform_id,
        product_id: BASE_PRODUCT_CONFIG.product_id,
        auth_type: SESSION_AUTH_TYPE.CONSUMER,
        uuid: getUniqueId() + makeid(3)
    };
};

export const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Reducer Methods
export const extractSessionInfo = (payload) => {
    return {
        tokenType: isValidElement(payload.token_type) ? payload.token_type : DEFAULT_TOKEN_TYPE,
        access_token: isValidElement(payload.access_token) ? payload.access_token : null,
        access_expires_in: isValidElement(payload.access_expires_in) ? payload.access_expires_in : 0,
        access_token_expires_in: isValidElement(payload.access_expires_in) ? addTimeDeviceMoment(payload.access_expires_in) : 0,
        refresh_token: isValidElement(payload.refresh_token) ? payload.refresh_token : null,
        refresh_expires_in: isValidElement(payload.refresh_expires_in) ? payload.refresh_expires_in : 0,
        refresh_token_expires_in: isValidElement(payload.refresh_expires_in) ? addTimeDeviceMoment(payload.refresh_expires_in) : 0,
        isFetchingRefreshToken: false
    };
};

export const getFHLanguage = (s3Config) => {
    return isValidElement(s3Config) &&
        isValidElement(s3Config.language) &&
        isValidElement(s3Config.language.default) &&
        isValidString(s3Config.language.default.code)
        ? s3Config.language.default.code
        : 'en-gb';
};
