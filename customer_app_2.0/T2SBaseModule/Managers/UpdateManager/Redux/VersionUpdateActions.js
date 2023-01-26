import { VERSION_UPDATE_API } from './VersionUpdateTypes';

export const versionUpdateAction = () => {
    return {
        type: VERSION_UPDATE_API.GET_UPDATE
    };
};
