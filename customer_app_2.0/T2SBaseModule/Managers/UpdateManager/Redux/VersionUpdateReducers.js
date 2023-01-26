import { VERSION_UPDATE_API } from './VersionUpdateTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case VERSION_UPDATE_API.GET_UPDATE:
            return state;
        case VERSION_UPDATE_API.GET_VERSION_UPDATE_SUCCESS:
            return {
                ...state,
                forcedVersionNumber: action.payload?.data?.last_forced_version,
                optionalVersionNumber: action.payload?.data?.name
            };
        default:
            return state;
    }
};
