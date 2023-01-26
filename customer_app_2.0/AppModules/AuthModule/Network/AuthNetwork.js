import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { getMd5Hash } from '../../../CustomerApp/Utils/AppConfig';
import { DEVICE } from '../../BaseModule/BaseConstants';
import { isNonCustomerApp } from 't2sbasemodule/Utils/helpers';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { BOOL_CONSTANT } from '../../AddressModule/Utils/AddressConstants';

export const AuthNetwork = {
    //TODO we should pass the hash value true as String not boolean
    makePostRegisterCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/register?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            password: getMd5Hash(params.password),
            email: params.email,
            phone: params.phone,
            hash: 'true',
            first_name: params.first_name,
            last_name: params.last_name,
            user_click_sms: params.smsChecked ? BOOL_CONSTANT.YES : BOOL_CONSTANT.NO,
            user_click_email: params.emailChecked ? BOOL_CONSTANT.YES : BOOL_CONSTANT.NO
        },
        isAuthRequired: false
    }),
    makePostLoginCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/login?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            password: getMd5Hash(params.password),
            email: params.email,
            hash: 'true'
        },
        isAuthRequired: false
    }),

    makePostSocialLoginCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/social/login?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            type: params.loginType,
            token: params.token,
            first_name: params.first_name,
            last_name: params.last_name
        },
        isAuthRequired: false
    }),

    makePostForgotPasswordCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/forgotpassword?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            email: params.email
        },
        isAuthRequired: false
    }),
    makeGetProfileCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/profile?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    }),
    makeConsentLookupCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/consent?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            policy_id: params.policy_id,
            product_id: BASE_PRODUCT_CONFIG.product_id,
            platform_id: BASE_PRODUCT_CONFIG.platform_id,
            consent_by: BASE_PRODUCT_CONFIG.consent_by
        },
        isAuthRequired: true
    }),
    makeBulkUpdateConsentCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/user/consent/bulk?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            customer_id: params.customer_id,
            store_id: [params.store_id],
            policy_id: params.policy_id,
            action: params.action,
            product_id: BASE_PRODUCT_CONFIG.product_id,
            platform_id: BASE_PRODUCT_CONFIG.platform_id,
            consent_by: BASE_PRODUCT_CONFIG.consent_by,
            type: BASE_PRODUCT_CONFIG.consent_type,
            device: DEVICE,
            user_click_sms: params.user_click_sms,
            user_click_email: params.user_click_email
        },
        isAuthRequired: true
    }),
    makeUpdateConsentCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/user/consent?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            customer_id: params.customer_id,
            store_id: isNonCustomerApp() ? undefined : params.store_id,
            policy_id: params.policy_id,
            action: params.action,
            product_id: BASE_PRODUCT_CONFIG.product_id,
            platform_id: BASE_PRODUCT_CONFIG.platform_id,
            consent_by: BASE_PRODUCT_CONFIG.consent_by,
            type: BASE_PRODUCT_CONFIG.consent_type,
            device: DEVICE,
            user_click_sms: params.user_click_sms,
            user_click_email: params.user_click_email
        },
        isAuthRequired: true
    }),
    makeUpdateNotificationCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/user/consent?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            customer_id: params.customer_id,
            store_id: isNonCustomerApp() ? undefined : params.store_id,
            policy_id: params.policy_id,
            action: params.action,
            product_id: BASE_PRODUCT_CONFIG.product_id,
            platform_id: BASE_PRODUCT_CONFIG.platform_id,
            consent_by: BASE_PRODUCT_CONFIG.consent_by,
            type: BASE_PRODUCT_CONFIG.consent_type,
            device: DEVICE
        },
        isAuthRequired: true
    }),
    makeGetConsumerPromotionCall: () => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/promotion?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),
    makeGetEmailLookUpCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/email?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            email: params.email_id
        },
        isAuthRequired: false
    })
};
