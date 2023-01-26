import { LENGTH } from './AuthConstants';
import { isFoodHubApp, isValidElement, isValidNotEmptyString } from 't2sbasemodule/Utils/helpers';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';

export const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&._()-+=;:,?{}[]|)(?=.{8,})';
export const REMOVE_MULTIPLE_SPACE = /\s\s+/g;

export const checkConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};

export const validName = (name) => {
    if (isValidElement(name)) return name.length >= LENGTH.NAME_MIN_LENGTH;
};

export const formatName = (name) => {
    if (isValidNotEmptyString(name)) {
        return name.replace(/[^-a-zA-ZÀ-ÿ '‘’]/g, '').replace(REMOVE_MULTIPLE_SPACE, ' ');
    } else {
        return '';
    }
};

export const getStoreIDForConsent = (s3Response) => {
    if (isFoodHubApp()) {
        return AppConfig.FOOD_HUB_STORE_ID;
    } else {
        if (
            isValidElement(s3Response) &&
            isValidElement(s3Response.config) &&
            isValidElement(s3Response.config.franchise) &&
            isValidElement(s3Response.config.franchise.store_id)
        ) {
            return s3Response.config.franchise.store_id;
        }
    }
};
