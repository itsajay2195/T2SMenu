import { HOME_TYPE } from './HomeType';
import { TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';

const INITIAL_STATE = {
    currentOrderSResponse: null,
    previousOrdersResponse: null,
    ourRecommendationsResponse: [],
    filteredOurRecommendation: null,
    chatNotificationCount: 0,
    previousOrderId: [],
    currentOffersResponse: [],
    ourRecommendationsLoading: true,
    previousOrdersLoader: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HOME_TYPE.GET_CURRENT_ORDER_SUCCESS:
            return {
                ...state,
                currentOrderSResponse: action.payload
            };
        case HOME_TYPE.GET_PREVIOUS_ORDER_SUCCESS:
            return {
                ...state,
                previousOrdersResponse: action.payload,
                previousOrdersLoader: false
            };
        case HOME_TYPE.GET_OUR_RECOMMENDATIONS_SUCCESS:
            return {
                ...state,
                ourRecommendationsResponse: !action.payload ? [] : action.payload,
                ourRecommendationsLoading: false
            };
        case HOME_TYPE.FILTER_OUR_RECOMMENDATIONS:
            return {
                ...state,
                filteredOurRecommendation: action.payload,
                ourRecommendationsLoading: false
            };
        case HOME_TYPE.NO_RECOMMENDATIONS:
            return {
                ...state,
                ourRecommendationsResponse: action.payload,
                filteredOurRecommendation: action.payload,
                ourRecommendationsLoading: false
            };
        case HOME_TYPE.ZEN_DESK_MESSAGE_COUNT:
            return {
                ...state,
                chatNotificationCount: action.payload
            };
        case HOME_TYPE.CLOSE_RATING_STATUS_SUCCESS:
            return {
                ...state,
                previousOrderId: [...state.previousOrderId, action.payload]
            };
        case HOME_TYPE.CURRENT_OFFERS_SUCCESS:
            return {
                ...state,
                currentOffersResponse: action.payload
            };
        case HOME_TYPE.SET_PREVIOUS_ORDER_LOADER:
            return {
                ...state,
                previousOrdersLoader: action.value
            };
        case TYPES_CONFIG.UPDATE_STORE_CONFIG_RESPONSE_FOR_VIEW_SUCCESS:
            return {
                ...state,
                ourRecommendationsResponse: null,
                filteredOurRecommendation: null,
                ourRecommendationsLoading: false
            };
        default:
            return state;
    }
};
