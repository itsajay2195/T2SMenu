import { BASE_API_CONFIG, BASE_PRODUCT_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { isBoolean, isNonCustomerApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';

export const OrderManagementNetwork = {
    makeGetOrderListCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/orders?includes=review&app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    }),
    makeViewAllOrdersCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/orders?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),
    makeViewOrderCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidString(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.GET,
            url: '/consumer/orders/' + params.orderId + '/receipt?includes=refundrequest&app_name=' + BASE_API_CONFIG.applicationName,
            data: {},
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    makeReOrderCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidElement(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.POST,
            url: '/consumer/reorder/' + params.orderId + '?app_name=' + BASE_API_CONFIG.applicationName + '&service_type=' + params.sending,
            data: {},
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    makeGetOrderDetailsCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidString(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.GET,
            url: '/consumer/orders/' + params.orderId + '?app_name=' + BASE_API_CONFIG.applicationName + '&includes=store,driver',
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    makeGetOrderTrackingDetailsCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidElement(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.GET,
            url: 'consumer/orders/track/' + params.action.orderId + '?delivery_location=10&app_name=' + BASE_API_CONFIG.applicationName,
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    makeGetRefundOptionsCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/order/' + params.orderId + '/refund/destination?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: true
    }),
    makeUpdateRefundMethodCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/order/' + params.orderId + '/refund/destination?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            platform_id: BASE_PRODUCT_CONFIG.platform_id,
            refund_source_id: '2',
            device: params.device,
            destination: params.refundMethod,
            requested_by: params.userName
        },
        isAuthRequired: true
    }),
    makeGetOrderDetailWithDriverInfoCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidString(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.GET,
            url: '/consumer/orders/' + params.orderId + '?app_name=' + BASE_API_CONFIG.applicationName + '&includes=store,driver',
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    cancelOrderCall: (params) => {
        let headers = {};
        if (isNonCustomerApp() && isValidString(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.POST,
            url: '/consumer/orders/' + params.orderId + '/help?app_name=' + BASE_API_CONFIG.applicationName,
            data: {
                type: params.orderUpdateType,
                reason_id: params.consumer_reason_id,
                reason: params.consumer_reason
            },
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    callRequestUpdateDeliveryTme: (params) => {
        let headers = { store: params.storeID };
        return {
            method: NETWORK_METHOD.POST,
            url: '/consumer/orders/' + params.orderId + '/chatbot/request',
            data: {
                duration: '5'
            },
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    callGetUpdatedDeliveryTime: (params) => {
        let headers = { store: params.storeID };
        let request_id = {};
        if (isValidElement(params.req_id) && !isBoolean(params.req_id)) {
            request_id = { request_id: params.req_id };
        }
        return {
            method: NETWORK_METHOD.POST,
            url: '/consumer/orders/' + params.orderId + '/chatbot/lookup',
            data: request_id,
            config: {
                headers: headers
            },
            isAuthRequired: true
        };
    },
    refundRequestCall: (params) => {
        return {
            method: NETWORK_METHOD.POST,
            url: '/consumer/orders/' + params.orderId + '/refund/request',
            data: params.missingItems,
            isAuthRequired: true
        };
    }
    //Todo currently not using this endpoint once use this we need to disscuss with API team for ApiToken
    // getCancelOrderReasons: (params) => ({
    //     method: NETWORK_METHOD.GET,
    //     url: '/client/orders/help/reasons?type=cancel&6020c8c2d25e2a8e4b'
    // })
};
