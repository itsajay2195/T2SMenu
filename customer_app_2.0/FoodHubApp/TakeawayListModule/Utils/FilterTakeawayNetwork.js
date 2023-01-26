import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { isFoodHubApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { getTARecommendationURL } from '../../../CustomerApp/Utils/AppConfig';

export const FilterTakeawayNetwork = {
    makePostGetTakeawayListCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/foodhub/v1/takeaway/list?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            postcode: params.postCode,
            town: params.town
        }
    }),

    makePostGetTakeawayListCallInisFranchiseAppSearch: (params) => {
        let searchUrl = '';
        let customHeader = {};
        const { searchByAddress, lat, lng, postCode, franchise, addressObj } = params;
        if (searchByAddress) {
            searchUrl = `&lat=${lat}&lng=${lng}`;
        } else if (isValidString(postCode)) {
            searchUrl = `&postcode=${postCode}`;
        } else {
            let addressValue = isValidString(addressObj?.value) ? addressObj.value : addressObj.description;
            if (isValidString(addressValue)) searchUrl = `&${addressObj.type}=${addressValue}`;
        }
        if (isFoodHubApp() && isValidElement(franchise)) {
            customHeader = {
                headers: {
                    franchise: franchise
                }
            };
        }
        return {
            method: NETWORK_METHOD.GET,
            url: `/franchise/v2/takeaway/list?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=FRANCHISE${searchUrl}`,
            config: customHeader
        };
    },

    //work in progress
    makePostFavouriteTakeawayCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: '/consumer/stores/favourites?api_token=J6WDf0ttQKGfYhQkRCjwraBS11JYuIDx&app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            favourite: params.favourite,
            store_id: [params.storeId]
        }
    }),
    makeGetFavouriteTakeawayCall: () => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/stores/favourites?&app_name=' + BASE_API_CONFIG.applicationName
    }),

    makeGetFavouriteTakeawayListCall: () => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/wishlist?&app_name=' + BASE_API_CONFIG.applicationName
    }),

    makeAssociateTakeawayCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `consumer/stores/list?app_name=${BASE_API_CONFIG.applicationName}`
    }),
    makePostGetTakeawayListByGeocodeCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/foodhub/v1/takeaway/list/geocode?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            lat: params.lat,
            lng: params.lng
        }
    }),
    makeS3BestMatchWeightageCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/lang/foodhub/best_match_weightage_united_kingdom.json?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${BASE_API_CONFIG.applicationName}`
    }),
    //Todo we need to change hardcoded App name and header
    getTakeawayListByName: (params) => {
        return {
            method: NETWORK_METHOD.GET,
            url: `https://foodhub.com/api/franchise/v1/takeaway/list?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&name=${params?.addressObj?.description}&app_name=FRANCHISE`,
            config: {
                headers: {
                    host: 'foodhub.com',
                    franchise: 'foodhub.com'
                }
            }
        };
    },
    makeLiveTrackingCall: (action) => {
        return {
            method: NETWORK_METHOD.POST,
            url: `https://foodhub.co.uk/api/list_takeaway_tracking?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${BASE_API_CONFIG.applicationName}`,
            data: { ...action.body }
        };
    },
    getTakeawayRecommendation: (params) => {
        return {
            method: NETWORK_METHOD.GET,
            url: getTARecommendationURL(params.configType) + `?postcode=${params.postCode}&customer_id=${params.customer_id}`
        };
    }
};
