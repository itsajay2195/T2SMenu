import { DATE_FORMAT, formatDateString } from 't2sbasemodule/Utils/DateUtil';
import { isValidElement, isValidNumber, isValidString, trimBlankSpacesInText } from 't2sbasemodule/Utils/helpers';
import { NO, ORDER_STATUS, YES } from '../../BaseModule/BaseConstants';

export const getReviewDateFormat = (string) => {
    return isValidString(string) ? formatDateString(string, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM_YYYY) : '';
};

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 150;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const getOverallDashboardReview = (reviews) => {
    if (isValidElement(reviews)) {
        let totalReviews = reviews.filter(
            (item) =>
                (isValidElement(item.value) &&
                    isValidElement(item.delivery) &&
                    isValidElement(item.food) &&
                    parseInt(item.value) + parseInt(item.delivery) + parseInt(item.food)) /
                    3 >
                2
        );
        return isValidElement(totalReviews) && totalReviews;
    } else return [];
};

export const getTrimmedReviewResponse = (review) => {
    if (isValidElement(review) && isValidString(review.response)) {
        return trimBlankSpacesInText(review.response);
    } else return '';
};

export const checkIsValidReviewResponse = (reviewResponse) => {
    let reviewResponseText = trimBlankSpacesInText(reviewResponse);
    return isValidElement(reviewResponseText) ? reviewResponseText.length > 0 : false;
};

export const getTotalReviewsCount = (storeConfigTotalReviews) => {
    return isValidNumber(storeConfigTotalReviews) ? storeConfigTotalReviews : 0;
};

export const getBestMatchCount = (obj) => {
    return isValidNumber(obj?.best_match) ? obj.best_match?.toFixed(2) : 0;
};

export const getCustomerRating = (obj) => {
    return isValidNumber(obj?.rating) ? obj.rating : 0;
};

export const getMinimumOrderValue = (obj) => {
    return isValidNumber(obj?.delivery?.minimum_order) ? Number(parseFloat(obj.delivery.minimum_order).toFixed(2)) : '';
};

export const getDeliveryFeeValue = (obj) => {
    return isValidNumber(obj?.delivery?.charge) ? Number(parseFloat(obj.delivery?.charge).toFixed(2)) : 0;
};

export const showReview = (data) => {
    return (
        data?.status >= parseFloat(ORDER_STATUS.HIDDEN) &&
        (data?.review === null ||
            (data?.review?.is_ignored === NO &&
                !isValidElement(data?.review?.value) &&
                !isValidElement(data?.review?.delivery) &&
                !isValidElement(data?.review?.food)))
    );
};

export const canGiveReview = (data) => {
    return data?.review === null || data?.review?.is_ignored === YES;
};
