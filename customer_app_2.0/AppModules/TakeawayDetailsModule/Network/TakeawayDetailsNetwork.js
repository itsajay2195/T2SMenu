import { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const TakeawayDetailsNetwork = {
    makeGetGalleryImageListCall: (params) => {
        return {
            method: NETWORK_METHOD.GET,
            url: `/consumer/gallery?app_name=${BASE_API_CONFIG.applicationName}`,
            isAuthRequired: false
        };
    },
    makeGetHygieneRatingCall: (params) => {
        return {
            method: NETWORK_METHOD.GET,
            url: `/consumer/takeaway/rating?app_name=${BASE_API_CONFIG.applicationName}`,
            isAuthRequired: false
        };
    }
};
