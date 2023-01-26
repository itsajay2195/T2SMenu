import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';

export const getDescriptionText = (item, defaultLanguage) => {
    let isDefaultLanguage =
        isValidString(item?.name) && isValidElement(defaultLanguage) && isValidString(defaultLanguage?.name)
            ? defaultLanguage.name === item.name
            : false;
    let description =
        isValidElement(item?.name) && item?.name?.includes('(') && item?.name?.includes(')')
            ? item.name.split('(')[1].replace(')', '')
            : item?.name;
    return isValidString(description) ? description + ' ' + (isDefaultLanguage ? '(Default)' : '') : null;
};
