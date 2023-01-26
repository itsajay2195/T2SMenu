import { REVIEW_TYPE } from './ReviewType';

export const getReviewsAction = (page, storeId) => {
    return {
        type: REVIEW_TYPE.GET_REVIEWS,
        page,
        storeId
    };
};
export const clearReviewsAction = () => {
    return {
        type: REVIEW_TYPE.CLEAR_REVIEWS
    };
};

export const postReviewAction = (data, storeID = undefined) => {
    return {
        type: REVIEW_TYPE.POST_REVIEW,
        data,
        storeID
    };
};

export const ignoreReviewAction = (data) => {
    return {
        type: REVIEW_TYPE.IGNORE_REVIEW,
        data
    };
};
