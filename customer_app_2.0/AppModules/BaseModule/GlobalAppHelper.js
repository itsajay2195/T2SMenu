import { isArrayNonEmpty, isCustomerApp, isValidElement, isValidString, safeIntValue, validateRegex } from 't2sbasemodule/Utils/helpers';
import { ADDRESS_ATTRIBUTES, CONFIG_TYPE, CURRENCY, SEARCH_ATTRIBUTES, SEARCH_TYPE } from './GlobalAppConstants';
import { T2SConfig } from 't2sbasemodule/Utils/T2SConfig';
import { LOCALIZATION_STRINGS } from '../LocalizationModule/Utils/Strings';
import { ADDRESS_FIELDS, COUNTRY_NAME } from '../AddressModule/Utils/AddressConstants';
import { HOME_CONSTANTS } from '../../FoodHubApp/HomeModule/Utils/HomeConstants';
import { COUNTRY_CONFIG } from '../../FoodHubApp/LandingPage/Utils/LandingPageConstants';
import { convertMessageToAppLanguage } from 't2sbasemodule/Network/NetworkHelpers';
import { removeSpecialCharacters } from 't2sbasemodule/Utils/ValidationUtil';
import { TOGGLE_STATUS } from './BaseConstants';

export const getValidConfig = (config, configType, field, acceptEmpty = false) => {
    if (
        isValidElement(config) &&
        isValidElement(config[configType]) &&
        ((acceptEmpty && isValidElement(config[configType][field])) || (!acceptEmpty && isValidString(config[configType][field])))
    ) {
        return config;
    } else {
        if (isValidElement(config) && isValidElement(config.country) && isValidElement(config.country.flag)) {
            return isValidElement(COUNTRY_CONFIG[config.country.flag]) ? COUNTRY_CONFIG[config.country.flag] : COUNTRY_CONFIG.gb;
        }
        return COUNTRY_CONFIG.gb;
    }
};

export const addressLabel = (configuration, configType) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.NAME);
    if (isValidElement(config) && isValidElement(config[configType]) && isValidString(config[configType][ADDRESS_ATTRIBUTES.NAME]))
        return getLocalisedLabel(config[configType][ADDRESS_ATTRIBUTES.NAME]);
    if (isValidElement(config) && isValidElement(config.country) && isValidElement(config.country.name)) {
        return getLabelName(config.country.name, configType);
    }
};

const getLocalisedLabel = (value) => {
    switch (value.trim()) {
        case ADDRESS_FIELDS.HOUSE_NO1:
        case ADDRESS_FIELDS.HOUSE_NO: {
            return LOCALIZATION_STRINGS.HOUSE_NO;
        }
        case ADDRESS_FIELDS.FLAT: {
            return LOCALIZATION_STRINGS.FLAT;
        }
        case ADDRESS_FIELDS.APARTMENT: {
            return LOCALIZATION_STRINGS.APARTMENT;
        }
        case ADDRESS_FIELDS.STATE: {
            return LOCALIZATION_STRINGS.STATE;
        }
        case ADDRESS_FIELDS.STREET: {
            return LOCALIZATION_STRINGS.STREET;
        }
        case ADDRESS_FIELDS.POSTCODE: {
            return LOCALIZATION_STRINGS.POST_CODE;
        }
        case ADDRESS_FIELDS.POSTCODE1: {
            return LOCALIZATION_STRINGS.POST_CODE;
        }
        case ADDRESS_FIELDS.ZIPCODE: {
            return LOCALIZATION_STRINGS.ZIPCODE;
        }
        case ADDRESS_FIELDS.EIRCODE: {
            return LOCALIZATION_STRINGS.EIRCODE;
        }
        case ADDRESS_FIELDS.NEIGHBORHOOD: {
            return LOCALIZATION_STRINGS.NEIGHBORHOOD;
        }
        case ADDRESS_FIELDS.NEIGHBORHOOD_MUNICIPALITY: {
            return LOCALIZATION_STRINGS.NEIGHBORHOOD_MUNICIPALITY;
        }
        case ADDRESS_FIELDS.CITY: {
            return LOCALIZATION_STRINGS.CITY;
        }
        case ADDRESS_FIELDS.FLAT_APARTMENT: {
            return LOCALIZATION_STRINGS.FLAT_APARTMENT;
        }
        case ADDRESS_FIELDS.ADDRESS: {
            return LOCALIZATION_STRINGS.ADDRESS;
        }
        default: {
            return value;
        }
    }
};

export const getLabelName = (country, configType) => {
    if (country === COUNTRY_NAME.AUSTRALIA || country === COUNTRY_NAME.NEW_ZEALAND || country === COUNTRY_NAME.IRELAND) {
        if (configType === CONFIG_TYPE.HOUSE_NUMBER) return LOCALIZATION_STRINGS.HOUSE_DOOR_NO;
        if (configType === CONFIG_TYPE.FLAT) return LOCALIZATION_STRINGS.APARTMENT;
        if (configType === CONFIG_TYPE.POSTCODE) return LOCALIZATION_STRINGS.POST_CODE;
        if (configType === CONFIG_TYPE.ADDRESS_LINE1) return LOCALIZATION_STRINGS.STREET;
        if (configType === CONFIG_TYPE.ADDRESS_LINE2) return LOCALIZATION_STRINGS.CITY;
        if (configType === CONFIG_TYPE.AREA) return LOCALIZATION_STRINGS.STATE;
    } else if (country === COUNTRY_NAME.UNITED_STATES) {
        if (configType === CONFIG_TYPE.HOUSE_NUMBER) return LOCALIZATION_STRINGS.HOUSE_DOOR_NO;
        if (configType === CONFIG_TYPE.FLAT) return LOCALIZATION_STRINGS.APARTMENT;
        if (configType === CONFIG_TYPE.POSTCODE) return LOCALIZATION_STRINGS.ZIPCODE;
        if (configType === CONFIG_TYPE.ADDRESS_LINE1) return LOCALIZATION_STRINGS.STREET;
        if (configType === CONFIG_TYPE.ADDRESS_LINE2) return LOCALIZATION_STRINGS.CITY;
        if (configType === CONFIG_TYPE.AREA) return LOCALIZATION_STRINGS.STATE;
    } else {
        if (configType === CONFIG_TYPE.HOUSE_NUMBER) return LOCALIZATION_STRINGS.HOUSE_DOOR_NO;
        if (configType === CONFIG_TYPE.FLAT) return LOCALIZATION_STRINGS.STREET;
        if (configType === CONFIG_TYPE.POSTCODE) return LOCALIZATION_STRINGS.POST_CODE;
        if (configType === CONFIG_TYPE.ADDRESS_LINE1) return LOCALIZATION_STRINGS.ADDRESS;
        if (configType === CONFIG_TYPE.ADDRESS_LINE2) return LOCALIZATION_STRINGS.CITY;
    }
};

// TODO:: Add Localized strings
export const addressEmptyMessage = (configuration, configType) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.NAME);
    if (isValidElement(config) && isValidElement(config[configType]) && isValidString(config[configType][ADDRESS_ATTRIBUTES.NAME]))
        return LOCALIZATION_STRINGS.ADDRESS_EMPTY_ERROR + getLocalisedLabel(config[configType][ADDRESS_ATTRIBUTES.NAME]);
    else return LOCALIZATION_STRINGS.ADDRESS_ENTER_FIELD;
};

export const addressInvalidMessage = (configuration, configType, languageKey) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.MESSAGE);
    if (isValidElement(config) && isValidElement(config[configType]) && isValidString(config[configType][ADDRESS_ATTRIBUTES.MESSAGE])) {
        return convertMessageToAppLanguage(config[configType][ADDRESS_ATTRIBUTES.MESSAGE], languageKey).replace(
            ADDRESS_ATTRIBUTES.DELIMITER,
            getLocalisedLabel(config[configType][ADDRESS_ATTRIBUTES.NAME])
        );
    } else return LOCALIZATION_STRINGS.ADDRESS_INVALID_FIELD;
};

export const addressVisible = (configuration, configType) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.AVAILABLE);
    if (isValidElement(config) && isValidElement(config[configType]) && isValidElement(config[configType][ADDRESS_ATTRIBUTES.AVAILABLE])) {
        return config[configType][ADDRESS_ATTRIBUTES.AVAILABLE] === true;
    } else return false;
};

export const addressRequired = (configuration, configType) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.MIN_LENGTH);
    if (isValidElement(config) && isValidElement(config[configType]) && safeIntValue(config[configType][ADDRESS_ATTRIBUTES.MIN_LENGTH]) > 0)
        return safeIntValue(config[configType][ADDRESS_ATTRIBUTES.MIN_LENGTH]) > 0;
    else return false;
};

export const addressMaxLength = (configuration, configType) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.MAX_LENGTH);
    if (
        isValidElement(config) &&
        isValidElement(config[configType]) &&
        safeIntValue(config[configType][ADDRESS_ATTRIBUTES.MAX_LENGTH]) > 0
    ) {
        return safeIntValue(config[configType][ADDRESS_ATTRIBUTES.MAX_LENGTH]);
    } else {
        // 1000 for infinite length
        return 100;
    }
};

export const getSearchMaxLength = (searchLength, flag) => {
    let getDefaultConfig = isValidElement(flag) && isValidElement(COUNTRY_CONFIG[flag]) ? COUNTRY_CONFIG[flag] : COUNTRY_CONFIG.gb;
    let length = isValidString(searchLength) ? searchLength : getDefaultConfig?.search?.max_length;
    return safeIntValue(length) > 0 ? safeIntValue(length) : 100;
};

export const getPhoneMaxLength = (mobLength, countryFlag) => {
    let getDefaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let length = isValidString(mobLength) ? mobLength : getDefaultConfig?.mobile?.max_length;
    return safeIntValue(length) > 0 ? safeIntValue(length) - 1 : 99;
};

export const isValidField = (configuration, configType, text) => {
    let config = getValidConfig(configuration, configType, ADDRESS_ATTRIBUTES.REGEX, true);

    if (isCustomerApp()) return isValidString(text);
    if (isValidElement(config) && isValidElement(config[configType]) && isValidElement(config[configType][ADDRESS_ATTRIBUTES.REGEX])) {
        return isValidString(config[configType][ADDRESS_ATTRIBUTES.REGEX]) &&
            validateRegex(config[configType][ADDRESS_ATTRIBUTES.REGEX], text)
            ? true
            : isValidString(text);
    } else {
        return false;
    }
};

export const userCurrency = (symbol, countryFlag) => {
    let defaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let currencySymbol = isValidString(symbol) ? symbol : defaultConfig?.currency?.symbol;
    return isValidString(currencySymbol) ? currencySymbol : CURRENCY.POUNDS;
};

export const iso = (countryIso, countryFlag) => {
    let getDefaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let iso = isValidString(countryIso) ? countryIso : getDefaultConfig?.country?.iso;
    return isValidString(iso) ? iso : '';
};

export const isAutoCompleteFind = (searchType, clientType, countryFlag) => {
    return isAddressSearch(searchType, countryFlag) || isEatAppyClient(clientType, countryFlag);
};

export const isAutoCompletePickerArea = (configuration) => {
    let config = getValidConfig(configuration, CONFIG_TYPE.POSTCODE, SEARCH_ATTRIBUTES.TYPE);
    return (
        isValidElement(config) &&
        isValidElement(config[CONFIG_TYPE.POSTCODE]) &&
        isValidElement(config[CONFIG_TYPE.POSTCODE][SEARCH_ATTRIBUTES.TYPE]) &&
        config[CONFIG_TYPE.POSTCODE][SEARCH_ATTRIBUTES.TYPE] === SEARCH_TYPE.AUTOCOMPLETE
    );
};

export const getSearchType = (searchType, countryFlag) => {
    let defaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let type = isValidString(searchType) ? searchType : defaultConfig?.search?.type;
    if (isValidString(type)) {
        return type;
    }
};

export const isAddressSearch = (searchType, countryFlag) => {
    let defaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let type = isValidString(searchType) ? searchType : defaultConfig?.search?.type;
    return isValidString(type) && type === SEARCH_TYPE.ADDRESS;
};

export const isEatAppyClient = (clientType, countryFlag) => {
    return getClientType(clientType, countryFlag) === 'EAT-APPY';
};

export const getClientType = (clientType, countryFlag) => {
    let defaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let type = isValidString(clientType) ? clientType : defaultConfig?.config?.client_type;
    return isValidString(type) && type;
};

export const isPostCodeSearch = (searchType, countryFlag) => {
    let defaultConfig =
        isValidElement(countryFlag) && isValidElement(COUNTRY_CONFIG[countryFlag]) ? COUNTRY_CONFIG[countryFlag] : COUNTRY_CONFIG.gb;
    let type = isValidString(searchType) ? searchType : defaultConfig?.search?.type;
    return isValidString(type) && type === SEARCH_TYPE.POSTCODE;
};

export const countryId = (id) => {
    return isValidString(id) ? id : T2SConfig.country.UK;
};

export const getCurrency = (currency) => {
    return isValidElement(currency) ? currency : '';
};

/**
 * Takes country_id and return currency.
 * NOTE: This ensure that if u visit takeaway from different country, you will see currency based on takeaway origin country
 * @param basketItem
 * @param fallbackCurrency
 * @returns {string}
 */
export const getCurrencyFromBasketResponse = (currencyId, fallbackCurrency) => {
    if (isValidElement(currencyId)) {
        switch (currencyId) {
            case 0: {
                return CURRENCY.EURO;
            }
            case 1: {
                return CURRENCY.POUNDS;
            }
            case 3:
            case 5:
            case 6:
            case 7:
            case 9: {
                return CURRENCY.DOLLAR;
            }
            case 4: {
                return 'ع.د';
            }
            case 10: {
                return CURRENCY.QUETZAL;
            }
            case 173: {
                return CURRENCY.NAIRA;
            }
        }
    }
    return getCurrency(fallbackCurrency);
};

export const getCurrencyFromStore = (store) => {
    return isValidElement(store) && isValidElement(store.currency) ? getCurrency(store.currency) : '';
};

export const getISOFromStore = (store) => {
    return isValidElement(store) && isArrayNonEmpty(store.country) && isValidElement(store.country[0].iso) ? store.country[0].iso : '';
};

export const getCurrencyFromOrder = (order) => {
    return isValidElement(order) && isValidElement(order.store) && isValidElement(order.store.currency)
        ? getCurrency(order.store.currency)
        : CURRENCY.POUNDS;
};

export const getCountryFromDeepLinkPath = (path) => {
    switch (path) {
        case T2SConfig.website_url.UK:
            return T2SConfig.country.UK;
        case T2SConfig.website_url.IRE:
            return T2SConfig.country.IRE;
        case T2SConfig.website_url.AUS:
            return T2SConfig.country.AUS;
        case T2SConfig.website_url.NZ:
            return T2SConfig.country.NZ;
        case T2SConfig.website_url.US:
            return T2SConfig.country.US;
        default:
            return T2SConfig.country.UK;
    }
};

export const isUKApp = (id) => {
    return countryId(id) === T2SConfig.country.UK;
};

export const isUSApp = (id) => {
    return countryId(id) === T2SConfig.country.US;
};

export const isAUSApp = (id) => {
    return countryId(id) === T2SConfig.country.AUS;
};

export const isCanadaApp = (id) => {
    return countryId(id) === T2SConfig.country.CA;
};

export const isOrderTypeToggleEnabled = (id, configResponse) => {
    if (isValidString(configResponse?.order_type_toggle?.status)) {
        return configResponse.order_type_toggle.status === TOGGLE_STATUS.ENABLED;
    } else {
        return countryId(id) !== T2SConfig.country.AUS && countryId(id) !== T2SConfig.country.NZ;
    }
};

export const getPlaceholderText = (text, languageKey) => {
    return removeSpecialCharacters(text).toLowerCase() === HOME_CONSTANTS.ENTER_POSTCODE.toLowerCase()
        ? LOCALIZATION_STRINGS.ENTER_YOUR_POSTCODE
        : languageKey === 'en'
        ? text
        : LOCALIZATION_STRINGS.ENTER_YOUR_AREA;
};

//todo: can remove this later.Used for finding a takeaway closed issue
export const logStoreConfigObject = (response) => {
    let obj;
    if (isValidElement(response)) {
        const {
            id,
            store_status,
            next_open,
            online_closed_message,
            preorder,
            preorder_hours,
            opening_hours,
            delivery_next_open,
            delivery_next_open_message,
            collection_next_open,
            collection_next_open_message
        } = response;
        obj = {
            storeId: id,
            deliveryStatus: store_status?.delivery,
            collectionStatus: store_status?.collection,
            delivery_next_open: delivery_next_open,
            delivery_next_open_message: delivery_next_open_message,
            collection_next_open: collection_next_open,
            collection_next_open_message: collection_next_open_message,
            nextOpen: next_open,
            onlineClosedMessage: online_closed_message,
            preorder_status: preorder,
            preorder_hours: preorder_hours,
            openHours: opening_hours?.advanced
        };
        return obj;
    }
    return null;
};
