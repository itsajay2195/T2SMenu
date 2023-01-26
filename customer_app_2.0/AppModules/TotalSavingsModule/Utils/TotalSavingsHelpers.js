import { isValidElement } from 't2sbasemodule/Utils/helpers';
export const getTotalSavingsContent = (content, takeAwayName) => {
    if (isValidElement(takeAwayName) && isValidElement(content) && content.includes('TakeawayName')) {
        return content.replace(/TakeawayName/g, takeAwayName);
    }
    if (isValidElement(takeAwayName) && isValidElement(content) && content.includes('RestaurantName')) {
        return content.replace(/RestaurantName/g, takeAwayName);
    }
};
