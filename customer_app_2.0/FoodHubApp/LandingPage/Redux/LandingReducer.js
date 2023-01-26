import { LANDING_TYPE } from './LandingType';
const INITIAL_STATE = {
    countryList: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LANDING_TYPE.GET_COUNTRY_LIST_SUCCESS:
            return {
                ...state,
                countryList: action.payload
            };
        default:
            return state;
    }
};
