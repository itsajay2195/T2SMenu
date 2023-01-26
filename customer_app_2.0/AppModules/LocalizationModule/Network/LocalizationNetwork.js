import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import moment from 'moment-timezone';
import { getLanguagesURL } from '../../../CustomerApp/Utils/AppConfig';

export const LocalizationNetwork = {
    makeGetLocalizationStrings: (params) => ({
        method: NETWORK_METHOD.GET,
        url: getLanguagesURL(params.config_env_type) + `${params.code}.json?date=${moment().toISOString()}`,
        isAuthRequired: false
    })
};
