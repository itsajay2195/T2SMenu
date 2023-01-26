import { Clipboard, Dimensions, Linking, Platform, Share } from 'react-native';
import { OS_PLATFORM, RANDOM_STRING_ALPHA_NUMERIC } from './Constants';
import moment from 'moment-timezone';
import { formatPostcodeFormatUK, postcodeValidationFormatter } from './ValidationUtil';
import { T2SConfig } from './T2SConfig';
import { getModel, getVersion } from 'react-native-device-info';
import { getCurrentLoyaltyPoints } from 'appmodules/LoyaltyPointsModule/Utils/LoyaltyHelper';
import { LOYALTY_POINTS_ZERO } from 'appmodules/LoyaltyPointsModule/Utils/LoyaltyConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import Config from 'react-native-config';
import { PAYMENT_METHOD, ProfileConstants } from 'appmodules/ProfileModule/Utils/ProfileConstants';
import crashlytics from '@react-native-firebase/crashlytics';
import parsePhoneNumber, { formatIncompletePhoneNumber, getCountryCallingCode } from 'libphonenumber-js';
import { BASE_PRODUCT_CONFIG } from '../Network/ApiConfig';
import { getUserName, isAndroid } from 'appmodules/BaseModule/Helper';
import { showErrorMessage, showInfoMessage } from '../Network/NetworkHelpers';
import { countryId, isAutoCompletePickerArea, isUKApp, isUSApp } from 'appmodules/BaseModule/GlobalAppHelper';
import { AppConfig, CP_VERSION, ENV_TYPE, getEnvType, LANGUAGE } from '../../CustomerApp/Utils/AppConfig';
import { getPrefixedCountryCode } from 'appmodules/ProfileModule/Utils/ProfileHelper';
import { DATE_FORMAT, getCurrentMoment } from './DateUtil';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { getHapticFeedbackType } from 'appmodules/BaseModule/Utils/FeatureGateHelper';
import * as Segment from 'appmodules/AnalyticsModule/Segment';
import { SEGMENT_EVENTS } from 'appmodules/AnalyticsModule/SegmentConstants';
import { COUNTRY_DATA } from '../../FoodHubApp/LandingPage/Utils/Helper';
import { menu } from '../../CustomerApp/View/SideMenu/SideMenuConfig';
import { isFeatureVisible } from '../../CustomerApp/Saga/AppSaga';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { isValidStringCheck, isValidElementCheck } from 'appmodules/BaseModule/Helper';
import { BOOL_CONSTANT } from 'appmodules/AddressModule/Utils/AddressConstants';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import * as Analytics from '../../AppModules/AnalyticsModule/Analytics';
import { getEmail } from 'appmodules/BaseModule/Helper';
import { convertProfileResponseToAnalytics } from 'appmodules/AnalyticsModule/Braze';

export const isValidElement = (data) => {
    return isValidElementCheck(data);
};

export const isValidString = (data) => {
    return isValidStringCheck(data);
};

export const isValidNumber = (data) => {
    return data !== null && data !== undefined && data !== '' && !isNaN(data);
};
export const isValidNotEmptyString = (data) => {
    return isValidString(data) && data.trim().length > 0;
};

export const boolValue = (value) => {
    return (
        isValidElement(value) &&
        (value === 1 || value === '1' || value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'yes')
    );
};

export const safeStringValue = (value) => {
    if (isValidElement(value)) {
        try {
            return value.toString();
        } catch (e) {
            return '';
        }
    } else {
        return '';
    }
};

export function isFoodHubApp() {
    return Config.APP_TYPE === 'FOODHUB';
}

export function isNonCustomerApp() {
    return isFoodHubApp() || isFranchiseApp();
}

export function isCustomerApp() {
    return Config.APP_TYPE === 'CUSTOMER';
}

export function isFranchiseApp() {
    return Config.APP_TYPE === 'FRANCHISE';
}

/**
 * return safe Int Value
 * @param value
 * @param decimal
 * @returns {number}
 */
export const safeFloatValue = (value, decimal = 2) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value).toFixed(decimal);
        } catch (e) {
            return 0.0;
        }
    } else {
        return 0.0;
    }
};

export const convertFloat = (value) => {
    try {
        const result = parseFloat(value);
        if (!isNaN(result)) {
            return result;
        }
    } catch (e) {
        // nothing to do
    }
    return null;
};

export const safeFloatRoundedValue = (value) => {
    return Math.round(safeFloatValue(value) * 10000);
};

export const safeFloatValueWithoutDecimal = (value, defaultValue = 0.0) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value);
        } catch (e) {
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
};

/**
 * return safe Int Value
 * @param value
 * @returns {number}
 */
export const safeIntValue = (value) => {
    if (isValidElement(value)) {
        try {
            return parseInt(value);
        } catch (e) {
            return 0;
        }
    } else {
        return 0;
    }
};

export const trimDecimal = (text) => {
    if (isValidElement(text)) {
        let decimal = text
            .replace(' ', '')
            .replace('-', '')
            .replace(',', '')
            .replace(/[^0-9.]|\.(?=.*\.)/g, '');
        return decimal.split('.').length === 2 && decimal.split('.')[1].length > 2
            ? (Math.floor(parseFloat(decimal) * 100) / 100).toFixed(2).toString()
            : decimal;
    }
    return text;
};

export const trimInteger = (text) => {
    if (isValidString(text)) {
        text.replace(' ', '')
            .replace('.', '')
            .replace('-', '')
            .replace(',', '')
            .replace(/[^0-9.]|\.(?=.*\.)/g, '');
    } else {
        return text;
    }
};

export const capsWordCase = (str) => {
    if (isValidElement(str)) {
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }
    return str;
};

export const getDeviceOS = () => {
    if (Platform.OS === 'ios') {
        return OS_PLATFORM.iOS;
    } else {
        return OS_PLATFORM.ANDROID;
    }
};

export const isNewerVersion = (oldVer, newVer) => {
    const oldParts = oldVer.toString().split('.');
    const newParts = newVer.toString().split('.');
    for (let i = 0; i < newParts.length; i++) {
        const a = parseInt(newParts[i]) || 0;
        const b = parseInt(oldParts[i]) || 0;
        if (a > b) {
            return true;
        }
        if (a < b) {
            return false;
        }
    }
    return false;
};

export function getPlatformID() {
    return BASE_PRODUCT_CONFIG.platform_id;
}

export const callNumber = (url) => {
    Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                // Not support for Dial Pad
            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err) => {
            // Error
        });
};
export const callDialPad = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                // Not support for Dial Pad
            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err) => {
            // Error
        });
};
export const getNextPage = (currentPage, lastPage) => {
    if (currentPage !== lastPage && lastPage > 1) {
        return currentPage + 1;
    }
    return -1;
};
export const validateRegex = (pattern, data) => {
    //TODO not working properly
    let regex = new RegExp(pattern);
    return regex.test(data);
};

/**
 * is More than Zero
 * @param value
 * @returns {*|boolean|boolean}
 */
export const isNegativeValue = (value) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value) < 0.0;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};

/**
 * return safe Absolute Value
 * @param value
 * @returns {number}
 */
export const safeAbsoluteValue = (value) => {
    if (isValidElement(value)) {
        try {
            let values = parseFloat(value).toFixed(2);
            return Math.abs(values);
        } catch (e) {
            return 0;
        }
    } else {
        return 0;
    }
};

/**
 * is More than Zero
 * @param value
 * @returns {*|boolean|boolean}
 */
export const isMoreZero = (value) => {
    if (isValidElement(value)) {
        try {
            return parseFloat(value) > 0;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
};

export const isNonEmptyString = (data) => {
    return data !== null && data !== undefined && data.toString().length > 0;
};

export const checkAndAppend = (value, placeholder) => {
    return `${placeholder}  ${isValidString(value) ? ' - ' + value : ''}`;
};

export const prefixZero = (number, length = 2) => {
    let string = '' + number;
    while (string.length < length) {
        string = '0' + string;
    }
    return string;
};

/**
 *
 * @param length
 * @returns {string}
 * Genrate and return random string of Given length from available alpha numeric characters
 */
export const randomStringWithLength = (length) => {
    var randomStrArr = [];
    var ALPHANUMERIC = RANDOM_STRING_ALPHA_NUMERIC.ALPHANUMERIC;
    for (var i = 0; i < length; i++) {
        randomStrArr[i] = ALPHANUMERIC.substr(Math.floor(Math.random() * ALPHANUMERIC.length), 1);
    }
    return randomStrArr.join('').toUpperCase();
};

export const getDateStr = (date, format) => {
    return moment(date).format(format);
};

export const getTableReservationDate = (timeZone = undefined) => {
    return getCurrentMoment(timeZone).format(DATE_FORMAT.DD_MMM_YYYY);
};

export const firstCharacterUpperCased = (text) => {
    if (isValidString(text)) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    } else {
        return '';
    }
};

export const firstWordUpperCased = (text) => {
    let output = '';
    let words = isValidElement(text) ? text.trim().split(' ') : text;
    words.forEach((value) => {
        output = output + firstCharacterUpperCased(value) + ' ';
    });
    return output;
};

export const checkRegexPatternTest = (pattern, data) => {
    let testPattern = new RegExp(pattern);
    return testPattern.test(data);
};

export const isLessThan10MB = (bytes) => {
    let mb = bytes / 1000 / 1000;
    return mb < 10;
};

export const isDesiredFormat = (type) => {
    let desiredFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    return desiredFormats.indexOf(type) > -1;
};
export const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_PATTERN =
    '^(((\\+44\\s?\\d{4}|\\(?0\\d{4}\\)?)\\s?\\d{3}\\s?\\d{3})|((\\+44\\s?\\d{3}|\\(?0\\d{3}\\)?)\\s?\\d{3}\\s?\\d{4})|((\\+44\\s?\\d{2}|\\(?0\\d{2}\\)?)\\s?\\d{4}\\s?\\d{4}))(\\s?\\#(\\d{4}|\\d{3}))?$';

export const isValidURL = (str) => {
    if (isValidString(str)) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return regexp.test(str);
    } else {
        return false;
    }
};

export const isValidFormat = (regex, enteredString) => {
    if (regex.test(enteredString)) {
        return true;
    }
    return false;
};

export const priceValidationFormatter = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
        return text;
    }
};

export const isEmpty = (string) => {
    return !string || string.length === 0;
};

export const validatePostcode = (postCode, countryId) => {
    if (countryId === T2SConfig.country.UK) {
        return formatPostcodeFormatUK(postcodeValidationFormatter(postCode)).toUpperCase();
    } else {
        return postCode.toUpperCase();
    }
};

export const getPostCodeKeyboardType = (s3Response) => {
    if (isAutoCompletePickerArea(s3Response)) {
        return { keyboardType: 'default', autoCapitalize: 'words' };
    }

    switch (getTakeawayCountryId(s3Response?.country?.id)) {
        case T2SConfig.country.UK:
            return { keyboardType: Platform.OS === 'android' ? 'visible-password' : 'default' };

        case T2SConfig.country.IRE:
            return { keyboardType: 'default', autoCapitalize: 'words' };

        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return { keyboardType: 'numeric', autoCapitalize: 'none' };

        case T2SConfig.country.US:
            return { keyboardType: 'numeric', autoCapitalize: 'none' };
        default:
            return { keyboardType: Platform.OS === 'android' ? 'visible-password' : 'default' };
    }
};

export const getPostCodeMaxLength = (countryId) => {
    switch (countryId) {
        case T2SConfig.country.UK:
            return T2SConfig.maxPostCode.UK;
        case T2SConfig.country.IRE:
            return T2SConfig.maxPostCode.IRE;
        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return T2SConfig.maxPostCode.AUS_NZ;
        case T2SConfig.country.US:
            return T2SConfig.maxPostCode.US;
        default:
            return 10;
    }
};

export const getPostcodeDisplayLabel = (countryId) => {
    switch (countryId) {
        case T2SConfig.country.UK:
            return LOCALIZATION_STRINGS.POST_CODE;
        case T2SConfig.country.IRE:
            return LOCALIZATION_STRINGS.AREA;
        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return LOCALIZATION_STRINGS.AREA_POSTCODE;
        default:
            return LOCALIZATION_STRINGS.POST_CODE;
    }
};

export const getTakeawayCountryId = (countryId) => {
    return isValidString(countryId) ? countryId : T2SConfig.country.UK;
};

export const getCountryNameIso = (countryIso) => {
    return isValidString(countryIso) ? countryIso : COUNTRY_DATA.data[0].iso;
};

/**
 * If you want to get the exact policy id of GDPR consent, you should pass the policy_type_id from API config
 * @param policyLookupResponse
 * @param key
 * @returns {*}
 */
export const getPolicyId = (policyLookupResponse, key) => {
    let data = getPolicy(policyLookupResponse, key);
    return isValidElement(data) ? data.id : undefined;
};

export const getPolicy = (policyLookupResponse, key) => {
    const data =
        isValidElement(policyLookupResponse) &&
        isValidElement(policyLookupResponse.data) &&
        policyLookupResponse.data.length > 0 &&
        policyLookupResponse.data.find((item) => item.policy_type_id === key);
    return data ? data : undefined; // data can be false, so using normal check
};

export const secondsToTimer = (seconds) => {
    const duration = moment.duration({ seconds });
    return {
        second: prefixZero(duration.seconds()),
        minute: prefixZero(duration.minutes()),
        hour: prefixZero(duration.hours())
    };
};

export const isDisplayBanner = (loyaltyStatusMessage, loyaltyPoints) => {
    if (
        isValidElement(loyaltyPoints) &&
        getCurrentLoyaltyPoints(loyaltyPoints) > LOYALTY_POINTS_ZERO &&
        isValidString(loyaltyStatusMessage)
    ) {
        return true;
    }
    return false;
};

export const getCurrentDay = () => {
    return moment()
        .format('dddd')
        .toLowerCase();
};

export const calculateDate = (startDate, format, days) => {
    return moment(startDate, format)
        .add(days, 'days')
        .toDate();
};

export const currentDateString = (format) => moment().format(format);

export const getDeviceInfo = () => ({
    os: getModel(),
    version: getVersion()
});

export const isPriceZero = (price) => {
    if (isValidElement(price)) {
        return price === '0.00' || price === '0';
    }
    return false;
};
export const addPrefixZero = (number) => {
    let string = '' + number;
    if (isValidElement(string[0]) && !string[0].includes('0')) {
        string = '0' + string;
    }
    return string;
};
/**
 Trim white/blank spaces at the end and beginning of the text
 */
export const trimBlankSpacesInText = (text) => {
    if (isValidString(text)) {
        return text.replace(/^\s+|\s+$/gm, '');
    } else {
        return '';
    }
};

//trim blank space at the beginning&end of the text and remove comma at the end of the text
export const trimCommaAndSpace = (text) => {
    if (isValidString(text)) {
        return text.replace(/,\s$/, '');
    } else {
        return text;
    }
};

export const setUserDetailsForCrashlytics = (response) => {
    if (isValidElement(response)) {
        try {
            crashlytics()
                .setUserId(isValidString(response.id) ? response.id.toString() : '')
                .then();
            crashlytics()
                .setAttributes({
                    phone: isValidString(response.phone) ? response.phone.toString() : '',
                    email: isValidString(response.email) ? response.email : '',
                    name: getUserName(response),
                    app_type: Config.APP_TYPE,
                    cp_version: getCPVersionUserAttributes()
                })
                .then();
        } catch (err) {
            //Nothing to Handle
        }
    }
};

export const getTakeawayName = (takeawayName) => {
    return isValidString(takeawayName) ? takeawayName : '';
};

export const getTakeawayId = (object) => {
    return isValidElement(object) && isValidElement(object.id) ? object.id : isNonCustomerApp() ? null : AppConfig.STORE_ID;
};

export const getTakeawayNameFromRoute = (route) => {
    return isValidElement(route) &&
        isValidElement(route.params) &&
        isValidElement(route.params.store) &&
        isValidElement(route.params.store.name)
        ? route.params.store.name
        : '';
};

export const getAppName = (storeConfigName) => {
    if (isFoodHubApp()) {
        return Config.APP_NAME;
    } else if (isFranchiseApp()) {
        return Config.APP_NAME;
    } else if (isValidElement(storeConfigName)) {
        return storeConfigName;
    } else if (isCustomerApp()) {
        return Config.APP_NAME;
    } else {
        return 'App';
    }
};

export const isTakeawaySupportOptomany = (storeConfigPaymentProvider) => {
    return isValidElement(storeConfigPaymentProvider) && storeConfigPaymentProvider === PAYMENT_METHOD.OPTOMANY;
};

//TODO Feature Gate
export const getPaymentProvider = (storeConfigPaymentProvider) => {
    if (isCustomerApp() && isValidElement(storeConfigPaymentProvider)) {
        return storeConfigPaymentProvider;
    } else {
        return PAYMENT_METHOD.OPTOMANY;
    }
};

export const getMobileNumberLength = (object) => {
    if (isValidElement(object) && isValidElement(object.mobile) && isValidElement(object.mobile.max_length))
        return safeIntValue(object.mobile.max_length);
    else return 11;
};

export const formatPhoneNo = (phoneNo, countryIso, countryCode, isInterNational = false) => {
    if (!isValidString(phoneNo) || !isValidElement(countryIso)) return phoneNo;
    if (isValidString(countryIso)) {
        const result = isInterNational
            ? parsePhoneNumber(phoneNo, countryIso)?.formatInternational()
            : parsePhoneNumber(phoneNo, countryIso)?.formatNational();
        if (isValidElement(result)) {
            return result.startsWith('0') ? result.slice(1) : result;
        }
    }
    if (isValidElement(countryCode)) {
        return formatIncompletePhoneNumber(countryCode + phoneNo).trim();
    } else return phoneNo;
};
export const getCountryCode = (countryIso, needPlus = true) => {
    if (isValidElement(countryIso))
        return needPlus ? ProfileConstants.PLUS + getCountryCallingCode(countryIso) : getCountryCallingCode(countryIso);
};

export const normalizePhoneNo = (phoneNo) => {
    if (!isValidString(phoneNo)) return phoneNo;
    return phoneNo.replace(/\D/g, '');
};

export const currencyValue = (value, currency, number) => {
    let fixedValue = isFloat(Number(value)) ? safeFloatValue(value, number) : safeFloatValueWithoutDecimal(value);
    return `${currency}${fixedValue}`;
};

export const isFloat = (n) => {
    return Number(n) === n && Number(n) % 1 !== 0;
};

export const distanceValue = (value) => {
    if (isValidElement(value)) {
        return Number(parseFloat(value).toFixed(2));
    }
};

export const kFormatter = (num) => {
    return isValidNumber(num)
        ? Math.abs(num) > 999
            ? Math.sign(num) * (Math.floor(Math.abs(num) / 100) / 10) + 'k'
            : Math.sign(num) * Math.abs(num)
        : 0;
};

/**
 *
 * unit = the unit you desire for results                               :::
 where: 'M' is statute miles (default)                         :::
 'K' is kilometers                                      :::
 'N' is nautical miles
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @param unit
 * @returns {number}
 */
export function distance(lat1, lon1, lat2, lon2, unit = 'M') {
    if (!isValidElement(lat1) || !isValidElement(lon1) || !isValidElement(lat2) || !isValidElement(lon2)) return;
    if (lat1 === lat2 && lon1 === lon2) {
        return 0;
    } else {
        const radlat1 = (Math.PI * lat1) / 180;
        const radlat2 = (Math.PI * lat2) / 180;
        const theta = lon1 - lon2;
        const radtheta = (Math.PI * theta) / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === 'K') {
            dist = dist * 1.609344;
        }
        if (unit === 'N') {
            dist = dist * 0.8684;
        }
        return Math.abs(dist);
    }
}

export const isUKTakeaway = (countryId) => {
    return getTakeawayCountryId(countryId) === T2SConfig.country.UK;
};

export const isUSTakeaway = (countryId) => {
    return getTakeawayCountryId(countryId) === T2SConfig.country.US;
};

export const isIRETakeaway = (countryId) => {
    return getTakeawayCountryId(countryId) === T2SConfig.country.IRE;
};

export const getTakeawayCountryName = (countryName) => {
    return isValidString(countryName) ? countryName : COUNTRY_DATA.data[0].name;
};

export const getDefaultLanguageName = (defaultLanguage) => {
    return isValidString(defaultLanguage) ? defaultLanguage : LANGUAGE().default;
};

export const getSelectedLanguageName = (language, defaultLanguage) => {
    return isValidElement(language) && isValidString(language.name) ? language.name : getDefaultLanguageName(defaultLanguage).name;
};

export const getSelectedLanguage = (language, defaultLanguage) => {
    return isValidElement(language) ? language : getDefaultLanguageName(defaultLanguage);
};

/**
 *
 * Method to add default touch area for views.
 * @param size - touch area size to be increased all side equally
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
export const defaultTouchArea = (size = 16) => {
    return { left: size, top: size, right: size, bottom: size };
};

/**
 * Method to add touch area for views.
 * @param left - additional touch area for left side
 * @param top - additional touch area for top side
 * @param right - additional touch area for right side
 * @param bottom - additional touch area for bottom side
 * @returns {{top: *, left: *, bottom: *, right: *}}
 */
export const touchArea = (left, top, right, bottom) => {
    return { left, top, right, bottom };
};

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const { height, width } = Dimensions.get('window');

export const isIPhoneX = () =>
    Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
        ? (width === X_WIDTH && height === X_HEIGHT) || (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
        : false;

export const copyToClipboard = (value, msg = LOCALIZATION_STRINGS.COPIED) => {
    writeToClipboard(value).then(() => showInfoMessage(msg, null, true));
};

export const writeToClipboard = async (value) => {
    try {
        await Clipboard.setString(`${value}`);
    } catch (e) {
        showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
    }
};

export const handleReDirectToStoreReview = (
    countryBaseFeatureGateResponse,
    profileResponse,
    orderID,
    iosStoreLink,
    androidStoreLink,
    countryIso,
    isReview = true,
    fromThumbsUp = false
) => {
    if (isReview) {
        Analytics.logEvent(ANALYTICS_SCREENS.ORDER_STATUS, ANALYTICS_EVENTS.RATE_US, {
            name: getUserName(profileResponse),
            emailId: getEmail(profileResponse),
            orderID: isValidString(orderID) ? orderID.toString() : ''
        });
    }
    let iOSUrl =
        isReview && isValidString(iosStoreLink)
            ? iosStoreLink + '?mt=8&action=write-review'
            : iosStoreLink ?? `itms-apps://itunes.apple.com/app/id${AppConfig.APPLE_STORE_ID}?mt=8&action=write-review`;

    let url =
        Platform.OS === 'ios'
            ? isCustomerApp() && isValidString(iosStoreLink)
                ? iOSUrl
                : `itms-apps://itunes.apple.com/app/id${AppConfig.APPLE_STORE_ID}?mt=8&action=write-review`
            : isValidString(androidStoreLink)
            ? androidStoreLink
            : AppConfig.ANDROID_PLAY_STORE_URL;
    Linking.canOpenURL(url).then((supported) => {
        let eventObj = convertProfileResponseToAnalytics(profileResponse, countryIso);
        if (fromThumbsUp) eventObj.thumbs_up_clicked = true;
        if (supported) {
            Segment.trackEvent(countryBaseFeatureGateResponse, SEGMENT_EVENTS.RATE_APP, eventObj);
            return Linking.openURL(url);
        } else {
            showErrorMessage(LOCALIZATION_STRINGS.WENT_WRONG);
        }
    });
};

export const isDebugBuildType = () => {
    return AppConfig.buildConfig.buildType === 'debug';
};

export const separateCountryPrefix = (phone, countryIso) => {
    if (isValidElement(phone)) {
        let formattedPhone = formatPhoneNo(phone, countryIso);
        return removeCountryCode(formattedPhone, countryIso);
    } else {
        return phone;
    }
};

export const removeCountryCode = (phone, countryIso) => {
    let countryCode = getCountryCode(countryIso, false);
    if (phone.length > countryCode.length) {
        let countryCodePart = phone.substring(0, countryCode.length);
        if (countryCode === countryCodePart) {
            return phone.slice(countryCode.length);
        } else if (phone.startsWith('0')) {
            return phone.slice(1);
        } else {
            return phone;
        }
    } else {
        return phone;
    }
};

export const getFormattedTAPhoneNumber = (phone, countryIso, isInterNational = false) => {
    if (isValidElement(phone) && isValidElement(countryIso)) {
        return formatPhoneNo(phone, countryIso, null, isInterNational);
    }
    return phone;
};

export const getPhoneFromCountryNumber = (phone, countryId, countryIso) => {
    let normalisedPhone;
    if (isValidElement(phone)) {
        normalisedPhone = normalizePhoneNo(phone);
        if (isUKApp(countryId)) return getPrefixedCountryCode(countryId, normalisedPhone);
        else return getCountryCode(countryIso, false) + normalisedPhone;
    } else {
        return phone;
    }
};

export const getPhoneNumberNormalized = (phone, countryIso) => {
    if (isValidString(phone)) {
        let normalisedPhone = normalizePhoneNo(phone);
        let nationalPhone = removeCountryCode(normalisedPhone, countryIso);
        return getCountryCode(countryIso, true) + nationalPhone;
    } else {
        return '';
    }
};

export const removePrefixFromNumber = (phone, countryId) => {
    if (isValidElement(phone)) {
        if (isUSApp(countryId)) {
            if (isValidElement(phone[0]) && phone[0].includes('1')) return phone.slice(1);
            else return phone;
        } else {
            if (isValidElement(phone[0]) && phone[0].includes('0')) return phone.slice(1);
            else return phone;
        }
    }
};

//TODO need to fix in MYT. So, we have added temporary fix here.
export const getPhoneNoTableBooking = (phone, country_id, countryIso) => {
    let normalisedPhone;
    if (isValidElement(phone)) {
        normalisedPhone = normalizePhoneNo(phone);
        const countryCode = countryId(country_id);
        if (
            countryCode === T2SConfig.country.UK ||
            countryCode === T2SConfig.country.AUS ||
            countryCode === T2SConfig.country.NZ ||
            countryCode === T2SConfig.country.IRE
        )
            return addPrefixZero(normalisedPhone);
        else return getCountryCode(countryIso, false) + normalisedPhone;
    } else {
        return phone;
    }
};

const getCPVersionUserAttributes = () => {
    return isValidString(CP_VERSION) ? CP_VERSION : 'NA';
};

export const safeArray = (arrayValue) => {
    return safeValue(arrayValue, []);
};

export const safeValue = (a, defaultValue) => {
    return isValidElement(a) && Array.isArray(a) ? a : defaultValue;
};

export function makeHapticFeedback(featureGateResponse, fromWhere) {
    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: true
    };
    try {
        const type = getHapticFeedbackType(featureGateResponse, fromWhere);
        if (isValidElement(type)) {
            ReactNativeHapticFeedback.trigger(type, options);
        }
    } catch (e) {
        //Nothing
    }
}
export const getWebviewUrl = (item) => {
    let { id, name } = isValidElement(item) && item;
    id = (safeIntValue(id) * 5).toString();
    let baseUrl = getWebViewBaseUrl();
    return `${baseUrl}${name}/-/${id}`;
};

const getWebViewBaseUrl = () => {
    return isFoodHubApp() ? 'https://foodhub.co.uk/ordernow/' : 'https://order.eatappy.com.au/ordernow/';
};

export const isWebviewEnabled = (item) => {
    const { web_view } = isValidElement(item) && item;
    return isValidElement(web_view) && (web_view.toUpperCase() === 'YES' || web_view.toUpperCase() === 'ENABLED');
};

export const isArrayEmpty = (newOrderResponse) => {
    return !isValidElement(newOrderResponse) || (isValidElement(newOrderResponse.length) && newOrderResponse.length === 0);
};

export const isArrayNonEmpty = (newOrderResponse) => {
    return isValidElement(newOrderResponse) && isValidElement(newOrderResponse.length) && newOrderResponse.length > 0;
};

export const getRoundedAmount = (amount) => {
    return isValidElement(amount) && Number(amount).toFixed();
};

export const isBoolean = (val) => {
    return val === false || val === true;
};

export const getCarousellSavingsText = (isUserLoggedIn) => {
    return isUserLoggedIn
        ? LOCALIZATION_STRINGS.YOUR_SAVINGS_THROUGH + ' ' + getAppName()
        : LOCALIZATION_STRINGS.WEEKLY_SAVINGS + ' ' + getAppName();
};

export const isValidTotalSavings = (isUserLoggedIn, foodHubTotalSavings) => {
    return !isUserLoggedIn && isFoodHubApp() && safeIntValue(foodHubTotalSavings?.savings) > 0;
};

export const getCarousellSavingsAmountDetails = (isUserLoggedIn, currencySymbol, foodHubTotalSavings, totalSavings) => {
    let amount = '';
    let text = getCarousellSavingsText(isUserLoggedIn);
    if (currencySymbol != null) {
        if (isValidTotalSavings(isUserLoggedIn, foodHubTotalSavings)) {
            amount = foodHubTotalSavings.savings;
        } else if (isUserLoggedIn && isValidString(totalSavings) && safeFloatValueWithoutDecimal(totalSavings) > 0) {
            amount = totalSavings;
        } else {
            text = LOCALIZATION_STRINGS.NO_SAVINGS;
        }
    }
    return {
        amount,
        text
    };
};

export const getOrderTrackingOrdertype = (sending) => {
    return sending === ORDER_TYPE.DELIVERY || sending === 'to' ? ORDER_TYPE.DELIVERY : ORDER_TYPE.COLLECTION;
};

export const getDefaultVisibleSideMenuItems = () => {
    return menu().filter((value) => {
        return !value.is_more && isFeatureVisible(value);
    });
};

export const getDefaultHiddenSideMenuItems = () => {
    return menu().filter((value) => {
        return value.is_more && isFeatureVisible(value);
    });
};

export const isValidImageUrl = (imgUrl) => {
    return isValidURL(imgUrl) && (imgUrl.includes('.png') || imgUrl.includes('.jpg') || imgUrl.includes('.jpeg'));
};

export const isValidJson = (data) => {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
};

export const isSmsPromotionChecked = (sms) => {
    return sms === BOOL_CONSTANT.YES;
};

export const isEmailPromotionChecked = (email) => {
    return email === BOOL_CONSTANT.YES;
};

export const openShareOption = (message = '', link) => {
    Share.share({ message: `${message} ${link}` })
        .then((res) => {
            if (__DEV__) {
                console.log(res);
            }
        })
        .catch((err) => {
            if (__DEV__) {
                err && console.log(err);
            }
        });
};

export const shareMessageToMessageApp = (message = '', link) => {
    openDirectShare(isAndroid() ? `sms:?body=${message} ${link}` : `sms:&body=${message} ${link}`);
};
export const shareMessageToWhatsApp = (message = '', link) => {
    openDirectShare(`https://api.whatsapp.com/send?text=${message} ${link}`);
};
export const openDirectShare = (url) => {
    try {
        Linking.openURL(url);
    } catch (e) {
        if (__DEV__) {
            console.log(JSON.stringify(e));
        }
    }
};
export const checkIsValidEmail = (email) => {
    //trim and then check
    let trimEmail = isValidString(email) ? email.trim() : email;
    return checkRegexPatternTest(EMAIL_PATTERN, trimEmail);
};

export const ConTwoDecDigit = (digit) => {
    if (isValidString(digit)) {
        return digit.indexOf('.') >= 0
            ? digit.split('.').length >= 2
                ? digit.split('.')[0].substring(-1, 2) + '.' + digit.split('.')[1].substring(-1, 2)
                : digit
            : digit.length >= 2
            ? digit.slice(0, 2)
            : digit;
    }
};

export const isValidDateString = (date) => {
    return isValidString(date) && date.slice(0, 4) !== '0000';
};

export const removeAlphabets = (text) => {
    return isValidString(text) ? text.replace(/[^\d.-:-]/g, '') : '';
};

export const isForceUpdateAvailable = (forcedVersionNumber, showForceUpdateModal) => {
    let appVersion = getVersion();

    return isValidString(forcedVersionNumber) && isNewerVersion(appVersion, forcedVersionNumber) && !showForceUpdateModal;
};

export const isOptionalUpdateAvailable = (
    optionalVersionNumber,
    optionalUpdateDismissed,
    showOptionalUpdateModal,
    showForceUpdateModal
) => {
    let appVersion = getVersion();

    return (
        isValidString(optionalVersionNumber) &&
        isNewerVersion(appVersion, optionalVersionNumber) &&
        !optionalUpdateDismissed &&
        !showOptionalUpdateModal &&
        !showForceUpdateModal
    );
};

export const getHostBasedOnEnv = (countryId, config) => {
    let envType = getEnvType(config),
        hostKey,
        data;
    if (isValidElement(config)) {
        hostKey = envType === ENV_TYPE.QA ? 'sit_host' : 'host';
    } else hostKey = 'host';
    data = COUNTRY_DATA.data.filter((item) => item.id === countryId);
    if (isArrayNonEmpty(data) && isValidElement(data[0][hostKey])) {
        return { franchise: data[0][hostKey] };
    }
    return '';
};
