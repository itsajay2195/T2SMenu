import { TYPES_CONFIG } from '../Actions/Types';

const INITIAL_STATE = {
    envConfigData: null,
    bugseeLaunch: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TYPES_CONFIG.SET_CONFIG_FILE_NAME: {
            return {
                ...state,
                envConfigData: action.payload
            };
        }
        case TYPES_CONFIG.SET_BUGSEE_LAUNCH: {
            return {
                ...state,
                bugseeLaunch: action.payload
            };
        }
        default:
            return state;
    }
};
