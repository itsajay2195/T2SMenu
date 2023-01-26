import { Constants, FONT_FAMILY, MESSAGE_ICON, NETWORK_CONSTANTS } from '../Utils/Constants';
import { Colors } from '../Themes';
import { StyleSheet } from 'react-native';
import { getDeviceInfo, isArrayNonEmpty, isValidElement, isValidString } from '../Utils/helpers';
import { logError } from 'appmodules/AnalyticsModule/Analytics';
import React from 'react';
import T2SIcon from '../UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../CustomerApp/Fonts/FontIcon';
import { showMessage } from '../UI/CustomUI/FlashMessageComponent';
import { ANALYTICS_EVENTS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import SessionSkipError from './SessionManager/Network/SessionSkipError';
import { store } from '../../CustomerApp/Redux/Store/ConfigureStore';
import { APIErrorMessages } from 'appmodules/LocalizationModule/Utils/APIErrorMessages';
import _ from 'lodash';
import { setFont } from '../Utils/ResponsiveFont';
import { getUserName } from 'appmodules/BaseModule/Helper';
import { GRAPH_QL_QUERY } from 'appmodules/BaseModule/GlobalAppConstants';
import { BASE_API_CONFIG } from './ApiConfig';

let lastMessageTime = 0;
let lastErrorMessage = '';
const showErrorMessage = (error, flashMessageComponent, color = undefined) => {
    if (!isValidElement(error) || error instanceof SessionSkipError) {
        return;
    }
    let message = '';
    let backgroundColor = Colors.warning;
    let icon = MESSAGE_ICON.WARNING;
    if (isValidElement(error)) {
        lastErrorMessage = error.type;
        if (isValidElement(error.type) && error.type === NETWORK_CONSTANTS.NETWORK_ERROR) {
            message = LOCALIZATION_STRINGS.GENERIC_ERROR_MSG;
            backgroundColor = Colors.persianRed;
            icon = MESSAGE_ICON.DANGER;
        } else if (isValidElement(error.type) && error.type === NETWORK_CONSTANTS.API_ERROR) {
            message = isArrayNonEmpty(error.message) ? error.message : LOCALIZATION_STRINGS.WENT_WRONG;
            backgroundColor = Colors.warning;
        } else {
            message = isArrayNonEmpty(error) ? error : isArrayNonEmpty(error.message) ? error.message : LOCALIZATION_STRINGS.WENT_WRONG;
            if (color) {
                backgroundColor = color;
            } else {
                backgroundColor = Colors.warning;
            }
        }
    }
    if (isValidString(message)) {
        let flashMessageObject = {
            message: convertMessageToAppLanguage(message),
            backgroundColor: backgroundColor,
            color: Colors.white,
            duration: 2000,
            titleStyle: styles.welcomeTextStyle,
            icon: { icon: icon }
        };
        let currentTime = new Date().getTime();
        if (currentTime - lastMessageTime > 4000 || (isValidElement(error.type) && error.type !== lastErrorMessage)) {
            lastMessageTime = new Date().getTime();
            if (isValidElement(flashMessageComponent)) {
                flashMessageComponent.showMessage(flashMessageObject);
            } else {
                showMessage(flashMessageObject);
            }
        }
    }
};
const showInfoMessage = (message, flashMessageComponent, toast = false) => {
    if (!isValidElement(message) || message instanceof SessionSkipError || message === Constants.SESSION_SKIPPED) {
        return;
    }
    let flashMessageObject = {
        message: convertMessageToAppLanguage(message),
        backgroundColor: toast ? Colors.black : Colors.primaryColor,
        color: Colors.white,
        duration: 2000,
        titleStyle: styles.welcomeTextStyle,
        icon: { icon: !toast ? MESSAGE_ICON.SUCCESS : MESSAGE_ICON.WARNING }
    };
    if (isValidElement(flashMessageComponent)) {
        flashMessageComponent.showMessage(flashMessageObject);
    } else {
        showMessage(flashMessageObject);
    }
};

export const convertMessageToAppLanguage = (message, languageKey = undefined) => {
    if (!isValidString(message)) return;
    let language = '';
    if (
        !isValidElement(languageKey) &&
        isValidElement(store) &&
        isValidElement(store.getState()) &&
        isValidElement(store.getState().appState) &&
        isValidElement(store.getState().appState.language) &&
        isValidElement(store.getState().appState.language.code)
    ) {
        language = store.getState().appState.language.code;
    } else {
        language = languageKey;
    }
    let convertedMessage = '';
    if (language === 'es') {
        let obj = _.filter(APIErrorMessages(), function(o) {
            return o.key.toLowerCase() === message.toLowerCase() || message.toLowerCase().includes(o.key.toLowerCase());
        });
        if (isValidElement(obj) && obj.length > 0) {
            if (obj.length === 1) {
                convertedMessage = message.toLowerCase().replace(obj[0].key.toLowerCase(), obj[0].value_es);
            } else {
                convertedMessage = message;
                obj.map((item) => {
                    convertedMessage = convertedMessage.toLowerCase().replace(item.key.toLowerCase(), item.value_es);
                });
            }
        }
    }
    if (isValidString(convertedMessage)) {
        return convertedMessage;
    } else {
        return message;
    }
};

const styles = StyleSheet.create({
    welcomeTextStyle: {
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: setFont(16),
        textAlign: 'left',
        textAlignVertical: 'center',
        paddingRight: 15
    }
});
const logAPIErrorEvent = (error) => {
    logError(ANALYTICS_EVENTS.API_ERROR, error);
};
export { showErrorMessage, showInfoMessage, logAPIErrorEvent };

export const parseAPIEndPoint = (url) => {
    return 'E + ' + url;
};

/*
    This method returns true, only for requests which need Access token
 */
export const renderFlashMessageIcon = (icon = 'success', style = {}, customProps = {}) => {
    const flashIconStyle = {
        color: Colors.white,
        margin: -5
    };
    switch (icon) {
        case 'success':
            return <T2SIcon name={FONT_ICON.NOTIFY_SUCCESS} size={30} style={[flashIconStyle, style]} />;
        case 'info':
            return <T2SIcon name={FONT_ICON.INFO_ICON_FILLED} size={30} style={[flashIconStyle, style]} />;
        case 'warning':
            return <T2SIcon name={FONT_ICON.SHEILD} size={30} style={[flashIconStyle, style]} />;
        case 'danger':
            return <T2SIcon name={FONT_ICON.SHEILD} size={30} style={[flashIconStyle, style]} />;
        default:
            return null;
    }
};

export const constructErrorObject = (data) => {
    let obj = {};
    if (isValidElement(data) && JSON.stringify(data) !== '{}') {
        let { error, networkConfig, profile, store_id } = data;
        obj.message = error?.message;
        obj.type = error?.type;
        obj.store_id = store_id;
        if (isValidElement(networkConfig)) {
            let { method, url, config } = networkConfig;
            obj.url = url;
            obj.method = method;
            if (isValidElement(config?.headers)) obj.requestHeader = config.headers;
            if (isValidString(config?.data)) obj.data = config.data;
        }
        if (isValidElement(profile)) {
            obj.phone = profile.phone;
            obj.customerId = profile.id;
            obj.name = getUserName(profile);
        }
    }

    return obj;
};

export const getGraphQlQuery = (type, errorObject, errorCode, errorSource = 'APP') => {
    return {
        query: GRAPH_QL_QUERY,
        variables: {
            input: {
                actionType: type,
                customerId: errorObject?.customerId,
                deviceInfo: JSON.stringify(getDeviceInfo()),
                errorCode: errorCode,
                errorObject: `${JSON.stringify(errorObject)}`,
                errorSource: errorSource,
                product: BASE_API_CONFIG.applicationName,
                token: ''
            }
        }
    };
};
