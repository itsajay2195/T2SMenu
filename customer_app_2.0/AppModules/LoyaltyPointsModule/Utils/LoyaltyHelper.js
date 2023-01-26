import { isValidElement, safeIntValue } from 't2sbasemodule/Utils/helpers';
import _ from 'lodash';

export const getCurrentLoyaltyPoints = (response) => {
    return isValidElement(response) ? safeIntValue(response.point_available) : 0;
};

export const getOrderValuePointsTransactions = (loyaltyTransaction, currency, categoryInfo) => {
    if (isValidElement(loyaltyTransaction) && isValidElement(categoryInfo) && categoryInfo.length > 0) {
        if (isValidElement(loyaltyTransaction.total)) {
            return isValidElement(currency) ? currency + loyaltyTransaction.total : loyaltyTransaction.total;
        }
        if (isValidElement(loyaltyTransaction.category_id) && isValidElement(loyaltyTransaction.comments))
            return getLoyaltyTransactionText(loyaltyTransaction.category_id, categoryInfo);
    } else return '';
};

export const getLoyaltyTransactionText = (categoryId, categoryInfo) => {
    if (isValidElement(categoryId) && isValidElement(categoryInfo) && categoryInfo.length > 0) {
        const category_text = _.find(categoryInfo, function(data) {
            if (data.id === categoryId) return data.name;
        });
        return category_text.name;
    }
};
