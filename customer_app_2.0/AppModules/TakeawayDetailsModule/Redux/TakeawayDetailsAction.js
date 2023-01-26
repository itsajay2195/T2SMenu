import { TAKEAWAY_DETAILS_TYPE } from './TakeawayDetailsType';
import { BASKET_TYPE } from '../../BasketModule/Redux/BasketType';

export const getTakeawayImageListAction = () => {
    return {
        type: TAKEAWAY_DETAILS_TYPE.IMAGE_GALLERY
    };
};

export const getHygieneRatingAction = () => {
    return {
        type: TAKEAWAY_DETAILS_TYPE.HYGIENE_RATING
    };
};

export const getStoreConfigAction = () => {
    return {
        type: TAKEAWAY_DETAILS_TYPE.GET_STORE_CONFIG
    };
};
export const getBasketRecommendations = () => {
    return {
        type: BASKET_TYPE.GET_BASKET_RECOMMENDATION
    };
};
