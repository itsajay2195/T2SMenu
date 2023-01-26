import { T2SConfig } from './T2SConfig';
import { isValidString, validateRegex } from './helpers';
import { UK_REGEX_PATTERN } from 'appmodules/BaseModule/GlobalAppConstants';

/**
 * POSTCODE VALIDATION FORMATTER
 * USE: Formatting entered postcode as mentioned below example
 * UK POSTCODES:
 1) AA9A 9AA
 2) A9A 9AA
 3) A9 9AA
 4) A99 9AA
 5) AA9 9AA
 6) AA99 9AA
 7) BFPO 01, BFPO 012.
 * */
export const formatPostcodeFormatUK = (postcode) => {
    if (isValidString(postcode)) {
        let replacedPostcodeString = postcode.toUpperCase();
        let postcodeFormat = /(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)/g;
        let enteredString = replacedPostcodeString.replace(/[ ]/g, '');
        let stringLength = enteredString.length;
        let bfpoPostcode = false;
        if (enteredString.length > 4) {
            if (enteredString.substring(0, 4) === 'BFPO') {
                bfpoPostcode = true;
            }
        }
        if (isValidFormat(postcodeFormat, enteredString) && !bfpoPostcode) {
            switch (stringLength) {
                case 5:
                    return enteredString.substring(0, 2) + ' ' + enteredString.substring(2, 5);
                case 6:
                    return enteredString.substring(0, 3) + ' ' + enteredString.substring(3, 6);
                case 7:
                    return enteredString.substring(0, 4) + ' ' + enteredString.substring(4, 7);
                default:
                    if (stringLength > 4) {
                        return enteredString.substring(0, 4) + ' ' + enteredString.substring(4, enteredString.length);
                    }
                    return replacedPostcodeString;
            }
        } else if (bfpoPostcode) {
            if (stringLength > 4) {
                return enteredString.substring(0, 4) + ' ' + enteredString.substring(4, enteredString.length);
            }
        }
        return replacedPostcodeString;
    } else return postcode;
};
export const isValidFormat = (regex, enteredString) => {
    if (isValidString(enteredString)) {
        return regex.test(enteredString);
    } else {
        return enteredString;
    }
};
export const removeSpecialCharacters = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^-a-zA-Z '‘’]/g, '');
    } else {
        return text;
    }
};
export const removePhoneSpecialCharacters = (val) => {
    if (isValidString(val)) {
        return val.replace(/^(\+)|\D/g, '$1');
    } else {
        return val;
    }
};
export const validAlphaNumericWithHyphenFixRegex = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^a-zA-Z 0-9-]/g, '');
    } else {
        return text;
    }
};

export const validAlphaNumericRegex = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^a-zA-Z0-9]/g, '');
    } else {
        return text;
    }
};

export const removePrefixZeroFixRegex = (text) => {
    if (isValidString(text)) {
        return text.replace(/^0+/, '');
    } else {
        return text;
    }
};
export const priceValidationFormatter = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
        return text;
    }
};
export const postcodeValidationFormatter = (text) => {
    if (isValidString(text)) {
        return text?.toString()?.replace(/[^a-zA-Z0-9\s]/g, '');
    } else {
        return text;
    }
};

export const validNumberFixRegex = (text) => {
    if (isValidString(text)) {
        return text.replace(/^0+/, '').replace(/[^0-9]/g, '');
    } else {
        return text;
    }
};

export const distanceValidationFormatter = (text) => {
    if (isValidString(text)) {
        return text
            .replace(/[^\d.]/g, '')
            .replace(new RegExp('(^[\\d]{2})[\\d]', 'g'), '$1')
            .replace(/(\..*)\./g, '$1')
            .replace(new RegExp('(\\.[\\d]).', 'g'), '$1');
    } else {
        return text;
    }
};

export const isValidPostCode = (postCode, countryId) => {
    switch (countryId) {
        case T2SConfig.country.UK:
            return validateRegex(UK_REGEX_PATTERN, postCode);
        case T2SConfig.country.IRE:
            return validateRegex(T2SConfig.default.postcodeRegex.IRE, postCode);
        case T2SConfig.country.AUS:
        case T2SConfig.country.NZ:
            return validateRegex(T2SConfig.default.postcodeRegex.AUS_NZ, postCode);
        default:
            return false;
    }
};

export const AtoZFormatter = (text) => {
    if (isValidString(text)) {
        return text.replace(/[^A-Za-z\s]/g, '');
    } else {
        return text;
    }
};

export const removeEmptySpaceFormStart = (text) => {
    if (isValidString(text)) {
        return text.replace(/^\s+/g, '');
    } else {
        return text;
    }
};
