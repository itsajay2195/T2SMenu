import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { DEVICE } from '../../BaseModule/BaseConstants';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { isValidString } from 't2sbasemodule/Utils/helpers';

export const ProfileNetwork = {
    makeGetProfileCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/profile?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    }),

    //TODO removed dob and gender for testing purpose
    makeUpdateProfileCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: `/consumer/profile?app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            email: params.action.email,
            phone: params.action.phone,
            first_name: params.action.first_name,
            last_name: params.action.last_name
        },
        isAuthRequired: true
    }),

    makeUpdateConsentCall: (params) =>
        //TODO based on action it will work [OPT_IN or OPT_OUT]
        ({
            method: NETWORK_METHOD.POST,
            url: `/user/consent?app_name=${BASE_API_CONFIG.applicationName}`,
            data: {
                customer_id: params.customer_id,
                policy_id: params.policy_id,
                store_id: params.store_id,
                action: params.action,
                platform_id: BASE_PRODUCT_CONFIG.platform_id,
                consent_by: BASE_PRODUCT_CONFIG.consent_by,
                product_id: BASE_PRODUCT_CONFIG.product_id,
                device: DEVICE
            },
            isAuthRequired: true
        }),

    makePostSendOTPCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/account/otp`,
        data: {
            phone: params.phone,
            type: params.otpType,
            deviceOS: BASE_PRODUCT_CONFIG.platform,
            app_name: BASE_API_CONFIG.applicationName
        },
        isAuthRequired: true
    }),

    makeVerifyOTPCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/account/otp/verify?app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            phone: params.phone,
            otp: params.otp
        },
        isAuthRequired: true
    }),

    makeExportDataCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/user/request?app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            email: params.email,
            user_consent_id: params.user_consent_id,
            device: params.device,
            type: params.actionType
        },
        isAuthRequired: true
    }),

    makeDeleteAccountCall: (params) =>
        //TODO it's same like ExportData but we should keep in separated because, from API the might change this one as delete request instead of post
        ({
            method: NETWORK_METHOD.POST,
            url: `/user/request?app_name=${BASE_API_CONFIG.applicationName}`,
            data: {
                email: params.email,
                user_consent_id: params.user_consent_id,
                device: params.device,
                type: params.actionType
            },
            isAuthRequired: true
        }),
    makeGetCardDetailsCall: (params) => {
        let query = '';
        if (isValidString(params?.store_id)) {
            query = `&store=${params.store_id}`;
        }
        if (isValidString(params?.fromScreen)) {
            query = `${query}&page=${params.fromScreen}`;
        }

        return {
            method: NETWORK_METHOD.GET,
            url: `/consumer/payment?app_name=${BASE_API_CONFIG.applicationName}&provider=${params.provider}${query}`,
            isAuthRequired: true
        };
    },
    makeDeleteCardDetailCall: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url: `/consumer/payment/${params.id}?app_name=${BASE_API_CONFIG.applicationName}`,
        config: {
            id: params.id
        },
        isAuthRequired: true
    }),
    makePostReferralCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/referral?app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            code: params.referralCode,
            order_info_id: params.order_info_id
        },
        isAuthRequired: true
    })
};
