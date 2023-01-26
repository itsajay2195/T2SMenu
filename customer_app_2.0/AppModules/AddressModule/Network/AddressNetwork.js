import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { randomSessionToken } from '../../../FoodHubApp/HomeModule/Utils/Helper';
import DeviceInfo from 'react-native-device-info';
export const AddressNetwork = {
    makeGetAddressCall: () => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/address?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),

    makePostcodeLookupCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/postcode?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: false,
        data: {
            postcode: params.postcode
        }
    }),

    makePostAddAddressCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/address?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true,
        data: params.addressObj
    }),

    makeUpdatePrimaryAddressCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: '/consumer/address/' + params.id + '/primary?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),

    makeUpdateAddressCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: '/consumer/address/' + params.id + '?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true,
        data: params.addressObj
    }),

    makeDeleteAddressCall: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url: '/consumer/address/' + params.id + '?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),

    makeDeliveryLookupCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/delivery_charge?app_name=' + BASE_API_CONFIG.applicationName,
        data: params.addressObj,
        isAuthRequired: false
    }),

    getLocationLookupCall: (params) => {
        let body = {};
        let session_token = '';
        let { addressObj, lat, lng } = params;
        if (isValidString(addressObj?.place_id)) {
            body.place_id = addressObj.place_id;
        } else if (isValidString(lat) && isValidString(lng)) {
            body.latlng = lat + ',' + lng;
        } else if (isValidString(addressObj?.value)) {
            body.address = addressObj.value;
        }
        if (isValidString(params?.sessiontoken)) {
            session_token = params.sessiontoken;
        } else {
            session_token = randomSessionToken();
        }

        return {
            method: NETWORK_METHOD.POST,
            url: `${BASE_API_CONFIG.baseURL}/location/lookup?api_token=${BASE_PRODUCT_CONFIG.OPEN_API_TOKEN}&app_name=${
                BASE_API_CONFIG.applicationName
            }&sessiontoken=${session_token}&platform_id=${BASE_PRODUCT_CONFIG.platform_id}&product_id=${
                BASE_PRODUCT_CONFIG.product_id
            }&uuid=${DeviceInfo.getUniqueId()}`,
            data: {
                sessiontoken: session_token,
                ...body
            },
            isAuthRequired: false
        };
    },

    //Todo we need to change hardcoded App name and header
    getAutocompletePlacesCall: (params) => {
        var session_token = isValidString(params?.sessiontoken) ? params.sessiontoken : randomSessionToken();
        return {
            method: NETWORK_METHOD.POST,
            url: `${BASE_API_CONFIG.baseURL}/location/autocomplete?api_token=${
                BASE_PRODUCT_CONFIG.OPEN_API_TOKEN
            }&app_name=FRANCHISE&sessiontoken=${session_token}&platform_id=${BASE_PRODUCT_CONFIG.platform_id}&product_id=${
                BASE_PRODUCT_CONFIG.product_id
            }&uuid=${DeviceInfo.getUniqueId()}`,
            data: {
                address: params.text,
                sessiontoken: session_token
            }
        };
    }
};
