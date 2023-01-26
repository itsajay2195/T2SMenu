import { HOME_TYPE } from './HomeType';

export const dashboardSync = () => {
    return {
        type: HOME_TYPE.DASHBOARD_SYNC
    };
};
export const zenDeskMessageCountAction = (messageCount) => {
    return {
        type: HOME_TYPE.ZEN_DESK_MESSAGE_COUNT,
        payload: messageCount
    };
};

export const hideRatingAction = (previousOrderId) => {
    return {
        type: HOME_TYPE.CLOSE_RATING_STATUS,
        payload: previousOrderId
    };
};

export const resetRecommendationAction = () => {
    return {
        type: HOME_TYPE.NO_RECOMMENDATIONS,
        payload: null
    };
};

export const refreshRecommendation = (ourRecommendations) => {
    return {
        type: HOME_TYPE.GET_FILTER_MENU_RECOMMENDATION,
        ourRecommendations
    };
};
