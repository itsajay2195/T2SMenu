import { isFoodHubApp, isValidElement, isValidString, safeStringValue } from 't2sbasemodule/Utils/helpers';
import { CommonActions } from '@react-navigation/native';
import { SCREEN_OPTIONS } from '../../CustomerApp/Navigation/ScreenOptions';
import { LOCALIZATION_STRINGS } from '../LocalizationModule/Utils/Strings';
import { Platform } from 'react-native';
import { isMoreThanOneDay } from 't2sbasemodule/Utils/DateUtil';
import { handleNavigation } from '../../CustomerApp/Navigation/Helper';
import { ZohoSalesIQ } from 'react-native-zohosalesiq-mobilisten';
import { AppConfig } from '../../CustomerApp/Utils/AppConfig';
import { showInfoMessage } from 't2sbasemodule/Network/NetworkHelpers';
import base64 from 'base-64';
import { getProfileResponse } from '../SupportModule/Utils/SupportHelpers';
import * as Segment from '../AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from '../AnalyticsModule/SegmentConstants';
import DeviceInfo from 'react-native-device-info';

//duplicate function added here as this file seems to import first than t2sbasemodule/helper. issue only in customer app
export function isValidStringCheck(data) {
    return data !== null && data !== undefined && data !== '' && data !== 'null';
}

export function isValidElementCheck(data) {
    return data !== null && data !== undefined;
}

export const getUserName = (profileResponse) => {
    let name = '';
    if (isValidElement(profileResponse)) {
        const { first_name, last_name } = profileResponse;
        if (isValidString(first_name) && isValidString(last_name)) {
            name = `${first_name} ${last_name}`;
        } else if (isValidString(first_name)) {
            name = `${first_name}`;
        } else if (isValidString(last_name)) {
            name = `${last_name}`;
        }
    }
    return name;
};

export const getAPIAccessToken = (profileResponse) => {
    let name = '';
    if (isValidElement(profileResponse)) {
        const { api_token } = profileResponse;
        if (isValidString(api_token)) {
            return api_token;
        }
    }
    return name;
};

export const getEmail = (profileResponse) => {
    let name = '';
    if (isValidElement(profileResponse)) {
        const { email } = profileResponse;
        if (isValidString(email)) {
            return email;
        }
    }
    return name;
};

export const getPhoneNumber = (profileResponse) => {
    let name = '';
    if (isValidElement(profileResponse)) {
        const { phone } = profileResponse;
        if (isValidString(phone)) {
            return phone;
        }
    }
    return name;
};

export const startLiveChat = (profileResponse, language, featureGateResponse, orderID = undefined, data, enablePreChatForms = false) => {
    if (isFoodHubApp()) {
        Segment.trackEvent(featureGateResponse, SEGMENT_EVENTS.HELP_CLICKED, {
            method: 'live_chat'
        });
        //TODO here we should not init all the time instead of we need to move this in App.js and handle one time initialisation
        let accessKey = isAndroid() ? AppConfig.zohoSupport.AndroidAccessKey : AppConfig.zohoSupport.iOSAccessKey;
        let appKey = isAndroid() ? AppConfig.zohoSupport.AndroidAppKey : AppConfig.zohoSupport.iOSAppKey;
        ZohoSalesIQ.initWithCallback(appKey, accessKey, (success) => {
            if (success) {
                ZohoSalesIQ.setVisitorName(getUserName(profileResponse));
                ZohoSalesIQ.setVisitorContactNumber(getPhoneNumber(profileResponse));
                ZohoSalesIQ.setVisitorEmail(getEmail(profileResponse));
                ZohoSalesIQ.enableInAppNotification();
                if (isValidElement(orderID)) {
                    ZohoSalesIQ.setVisitorAddInfo('orderid', safeStringValue(orderID));
                    ZohoSalesIQ.setVisitorAddInfo('Order ID', safeStringValue(orderID));
                }
                if (enablePreChatForms) {
                    ZohoSalesIQ.enablePreChatForms();
                } else {
                    ZohoSalesIQ.disablePreChatForms();
                }
                ZohoSalesIQ.setQuestion(safeStringValue(data));
                if (isValidElement(data)) {
                    ZohoSalesIQ.startChat(safeStringValue(data));
                } else {
                    ZohoSalesIQ.openChat();
                }
            } else {
                showInfoMessage('Sorry unable to start Chat');
            }
        });
    } else {
        let obj = { ...getProfileResponse(profileResponse) };
        if (isValidElement(orderID)) {
            obj.order_id = safeStringValue(orderID);
        }
        if (isValidElement(data)) {
            obj.item_details = safeStringValue(data);
        }
        handleNavigation(SCREEN_OPTIONS.HELP_WEBVIEW_SCREEN.route_name, {
            url: `${AppConfig.CHAT_WEB_VIEW_URL}${base64.encode(JSON.stringify(obj))}`
        });
    }
};

export const startHelp = (profileResponse, storeID, language, featureGateResponse, orderID = undefined) => {
    handleNavigation(SCREEN_OPTIONS.ORDER_HELP_VIEW.route_name, {
        orderId: orderID,
        storeID: storeID
    });
};

export const showInformationAlert = (title, message, actionText = LOCALIZATION_STRINGS.OK) => {
    return CommonActions.navigate(SCREEN_OPTIONS.ALERT.route_name, {
        title: title,
        description: message,
        positiveButtonText: actionText
    });
};

function hexToRgb(hex) {
    if (isValidStringCheck(hex)) {
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1)
            .match(/.{2}/g)
            .map((x) => parseInt(x, 16));
    }
    return hex;
}

const rgbToHex = (lightModeColor) => {
    return '#' + lightModeColor.map((x) => x.toString(16).padStart(2, '0')).join('');
};

const getValidColor = (lightModeColor) => {
    return lightModeColor > 0 ? lightModeColor : 0;
};

export function getDarkColor(color) {
    const lightModeColor = hexToRgb(color);
    if (isValidElementCheck(lightModeColor)) {
        const darkModeColor = [
            getValidColor(lightModeColor[0] - 45),
            getValidColor(lightModeColor[1] - 60),
            getValidColor(lightModeColor[2] - 70)
        ];
        return rgbToHex(darkModeColor);
    }
    return color;
}

export const getFeatureGateDataByCountry = (countryId, data) => {
    return data[countryId];
};

export const getSplashTimeout = () => {
    if (isFoodHubApp() && !isAndroid()) {
        return 1200;
    } else {
        return 100;
    }
};

export const isAndroid = () => {
    return Platform.OS === 'android';
};

export const isIOS = () => {
    return Platform.OS === 'ios';
};

export const isExpiredBasket = (basketCreatedAt) => {
    return !isValidElement(basketCreatedAt) || (isValidElement(basketCreatedAt) && isMoreThanOneDay(basketCreatedAt));
};

export const getDeviceIpAddress = async () => {
    let deviceIp = await DeviceInfo.getIpAddress().then((ip) => {
        return ip;
    });
    return deviceIp;
};
