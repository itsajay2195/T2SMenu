export const COUNTRY_ID = {
    UK: 1,
    IRE: 2,
    AUS: 3,
    NZ: 4,
    US: 7,
    MEX: 8,
    GUA: 9
};

export const CURRENCY = {
    DOLLAR: '$',
    EURO: '€',
    POUNDS: '£',
    RUPEES: '₹',
    QUETZAL: 'Q',
    NAIRA: '₦'
};

export const CONFIG_TYPE = {
    API_VERSION: 'api_version',
    COUNTRY: 'country',
    CURRENCY: 'currency',
    POSTCODE: 'post_code',
    MOBILE: 'mobile',
    PHONE: 'phone',
    SEARCH: 'search',
    CONFIG: 'config',
    HOUSE_NUMBER: 'house_number',
    FLAT: 'flat',
    ADDRESS_LINE1: 'address_line1',
    ADDRESS_LINE2: 'address_line2',
    AREA: 'area',
    MAP: 'map',
    ANALYTICS: 'analytics',
    SOCIAL_MEDIA: 'social_media'
};

export const ADDRESS_ATTRIBUTES = {
    REGEX: 'reg_ex',
    MIN_LENGTH: 'min_length',
    MAX_LENGTH: 'max_length',
    MESSAGE: 'message',
    AVAILABLE: 'available',
    NAME: 'name',
    DELIMITER: ':attribute'
};
export const SEARCH_ATTRIBUTES = {
    ...ADDRESS_ATTRIBUTES,
    TYPE: 'type'
};
export const COUNTRY_ATTRIBUTES = {
    ID: 'id',
    NAME: 'name',
    CODE: 'code',
    ISO: 'iso',
    SYNC_INITIAL_CONFIG: 'syncInitialConfig',
    ALIAS: 'alias'
};
export const CURRENCY_ATTRIBUTES = {
    ID: 'id',
    VALUE: 'value',
    NAME: 'name',
    SYMBOL: 'symbol',
    ISO: 'iso'
};
export const MAP_ATTRIBUTES = {
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
    ZOOM_LEVEL: 'zoom_level',
    AVAILABLE: 'available'
};
export const SOCIAL_MEDIA_ATTRIBUTES = {
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    YOUTUBE: 'youtube',
    INSTAGRAM: 'instagram'
};

export const SEARCH_TYPE = {
    POSTCODE: 'postcode',
    ADDRESS: 'address',
    AUTOCOMPLETE: 'autocomplete',
    FUZZY_SEARCH: 'fuzzySearch',
    CLIENT_TYPE: 'client_type',
    NAME: 'name'
};

export const UK_REGEX_PATTERN =
    '([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\\s?[0-9][A-Za-z]{2})';

export const GRAPH_QL_QUERY = `mutation MyMutation($input: FhlogInput!) {  createFhlog(input: $input) {    actionType    createdAt    deviceInfo    customerId    errorCode    errorSource    errorObject    token    product }}`;
