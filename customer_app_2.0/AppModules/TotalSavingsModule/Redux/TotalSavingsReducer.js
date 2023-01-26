import { TOTAL_SAVING_TYPE } from './TotalSavingsType';

const INITIAL_STATE = {
    totalSavingsResponse: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOTAL_SAVING_TYPE.TOTAL_SAVING_SUCCESS:
            return {
                ...state,
                totalSavingsResponse: action.payload
            };
        default:
            return state;
    }
};
