import _ from 'lodash';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

export const getCuisinesFlatListData = (data, start, end) => {
    let endValue = data.length >= end ? end : data.length;
    if (isValidElement(data) && data.length > start && start < end) {
        return _.slice(data, start, endValue);
    } else {
        return [];
    }
};
