import { HOME_TYPE } from './HomeType';

const INITIAL_STATE = {
    recentTakeawayResponse: null,
    recentOrdersResponse: null,
    foodHubTotalSavings: null,
    autocompletePlaces: null,
    recentOrdersOfTakeaway: null,
    postcode: '',
    isAppOpen: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HOME_TYPE.GET_RECENT_TAKEAWAYS_SUCCESS:
            return {
                ...state,
                recentTakeawayResponse: action.payload
            };
        case HOME_TYPE.GET_FOODHUB_TOTALSAVINGS_SUCCESS:
            return {
                ...state,
                foodHubTotalSavings: action.payload
            };

        case HOME_TYPE.GET_RECENT_ORDERS_SUCCESS:
            return {
                ...state,
                recentOrdersResponse: action.payload
            };

        case HOME_TYPE.GET_AUTOCOMPLETE_PLACES_SUCCESS:
            return {
                ...state,
                autocompletePlaces: action.payload
            };
        case HOME_TYPE.RESET_AUTOCOMPLETE_PLACES:
            return {
                ...state,
                autocompletePlaces: null
            };
        case HOME_TYPE.MODIFY_RECENT_TAKEAWAY_RESPONSE: {
            return {
                ...state,
                recentOrdersOfTakeaway: action.payload
            };
        }
        case HOME_TYPE.RESET_RECENT_TAKEAWAY_RESPONSE: {
            return {
                ...state,
                recentOrdersOfTakeaway: null
            };
        }
        case HOME_TYPE.POSTCODE_INPUT: {
            return {
                ...state,
                postcode: action.payload
            };
        }
        case HOME_TYPE.RESET_POSTCODE_TEXT_INPUT: {
            return {
                ...state,
                postcode: ''
            };
        }
        case HOME_TYPE.SET_APP_CURRENT_STATE: {
            return {
                ...state,
                isAppOpen: action.payload
            };
        }
        default:
            return state;
    }
};
