import API, { BASE_API_CONFIG } from 't2sbasemodule/Network/ApiConfig';
import { isBOGOFItem, isBOGOHItem } from '../Utils/BasketHelper';
import { isNonCustomerApp, isValidElement } from 't2sbasemodule/Utils/helpers';
import { NETWORK_METHOD } from 't2sbasemodule/Network/SessionManager/Network/SessionConst';
import { getBasketRecommendationURL, getFHLogsAPIKey, getFHLogsURL } from '../../../CustomerApp/Utils/AppConfig';

export const BasketNetwork = {
    makeCreateBasketCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/cart`,
        data: {
            app_name: BASE_API_CONFIG.applicationName,
            online_offline: 'online',
            service_type: params?.orderType
        },
        isAuthRequired: false
    }),
    makeAddOrRemoveItemToBasketCall: (params) => {
        const recommendation_id = params.recommendation_id;
        const recommendation_ref_id = params.recommendation_ref_id;
        const isOffer = isBOGOFItem(params.item.offer) || isBOGOHItem(params.item.offer) || isValidElement(params.addOns);
        return {
            method: NETWORK_METHOD.POST,
            url: `/consumer/cart/${params.cartID}/item/${params.id}?app_name=${BASE_API_CONFIG.applicationName}`,
            data: {
                quantity: isOffer ? '1' : params.quantity.toString(),
                sequence: params.sequence.toString(),
                addons: isValidElement(params.addOns) ? params.addOns : [],
                recommendation_id,
                recommendation_ref_id,
                ...params.getBasket
            },
            isAuthRequired: false
        };
    },
    bulkRemoveItem: (params) => ({
        method: NETWORK_METHOD.DELETE,
        url: `/consumer/cart/${params.cartID}/bulk/item?basket=true&app_name=` + BASE_API_CONFIG.applicationName,
        config: {
            data: {
                item_ids: params.item_ids
            },
            headers: {
                store: params.storeID
            }
        },
        isAuthRequired: false
    }),
    updateQuantity: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: `/consumer/cart/${params.cartID}/item/${params.resourceID}?app_name=${BASE_API_CONFIG.applicationName}`,
        data: {
            quantity: params.quantity.toString(),
            ...params.getBasket
        },
        isAuthRequired: false
    }),
    makeDeleteItem: (params) => {
        let headers = {};

        if (isNonCustomerApp() && isValidElement(params.storeID)) {
            headers = {
                store: params.storeID
            };
        }
        return {
            method: NETWORK_METHOD.DELETE,
            url: `/consumer/cart/${params.cartID}/item/${params.id}?app_name=${BASE_API_CONFIG.applicationName}`,
            config: {
                data: {
                    ...params.getBasket
                },
                headers: headers
            },
            isAuthRequired: false
        };
    },

    makeViewBasketCall: (cartID) => ({
        method: NETWORK_METHOD.GET,
        url: '/consumer/cart/' + cartID + '/view?app_name=' + BASE_API_CONFIG.applicationName,
        isAuthRequired: false
    }),
    makeUpdateBasketCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: `/consumer/cart/${params.cartID}?app_name=${BASE_API_CONFIG.applicationName}`,
        data: params.data,
        isAuthRequired: false
    }),
    makeLookupLoyaltyPointsCall: () => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/lookup/loyalty_points?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    }),
    makeLookupLoyaltyTransactionsCall: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/loyalty_transactions?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    }),
    makeLookupCouponCall: (params) => ({
        // TODO have to pass order_type/service_type once it's available in API and MYT --> order_type: params.order_type
        method: NETWORK_METHOD.POST,
        url: `/consumer/user/lookup/coupon`,
        data: {
            app_name: BASE_API_CONFIG.applicationName,
            coupon: params.coupon,
            payment_mode: params.payment_mode,
            platform: params.platform,
            service_type: params.service_type,
            discount: params.discount,
            total: params.subTotal?.value
        },
        config: {
            headers: {
                store: params.storeID
            }
        },
        isAuthRequired: false
    }),
    makePaymentLinkCall: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/v1/cart/' + params.cartId + '/payment?app_name=' + BASE_API_CONFIG.applicationName + '&host=' + params.host,
        data: {
            payment: 'CARD'
        },
        isAuthRequired: true
    }),
    makeCardPayment: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/optomany/order/${params.cartId}/payment?app_name=${BASE_API_CONFIG.applicationName}&cvv_challenge=${true}`,
        data: {
            customer_payment_id: params.customer_payment_id,
            cvv: params.cvv
        },
        isAuthRequired: true
    }),
    makeWalletFullPayment: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/wallet/order/' + params.cartId + '/payment?app_name=' + BASE_API_CONFIG.applicationName,
        data: {
            wallet_amount: params.totalAmount,
            card_amount: '0.00'
        },
        isAuthRequired: true
    }),
    makeWalletPartialPayment: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/wallet/order/${params.cartId}/payment?app_name=${BASE_API_CONFIG.applicationName}&cvv_challenge=${true}`,
        data: {
            wallet_amount: params.wallet_amount,
            customer_payment_id: params.customer_payment_id,
            card_amount: params.card_amount,
            cvv: params.cvv
        },
        isAuthRequired: true
    }),
    makeConfirmOrderCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: '/consumer/cart/' + params.cartId + '/confirm?app_name=' + BASE_API_CONFIG.applicationName + '&host=' + params.host,
        data: {
            payment: params.payment
        },
        isAuthRequired: true
    }),
    makeCheckoutGatewayPayment: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `/consumer/checkout/order/${params.order_id}/payment?app_name=` + BASE_API_CONFIG.applicationName,
        data: {
            type: params.type,
            token_data: params.token_data
        },
        isAuthRequired: true
    }),
    makeRedeemCall: (params) => ({
        method: NETWORK_METHOD.PUT,
        url: `/consumer/cart/${params.cartID}`,
        data: {
            app_name: BASE_API_CONFIG.applicationName,
            redeem: params.action.canRedeem ? '1' : '0',
            basket: true
        },
        isAuthRequired: false
    }),
    getPreOrderDates: () => ({
        method: NETWORK_METHOD.GET,
        url: `/consumer/store/lookup/preorder?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: false
    }),
    makeLookupAccountVerify: (params) => ({
        method: NETWORK_METHOD.POST,
        url: '/consumer/lookup/account/verify',
        data: { app_name: BASE_API_CONFIG.applicationName, phone: params.phone },
        isAuthRequired: true
    }),
    makeBasketRecommendations: (params) =>
        API.post(getBasketRecommendationURL(params.configType), {
            host: params.host,
            items: params.items
        }),
    makeOrderChange: (params) => ({
        method: NETWORK_METHOD.POST,
        url: `consumer/order/change/${params.cartID}`,
        data: { app_name: BASE_API_CONFIG.applicationName, service_type: params.serviceType },
        isAuthRequired: true
    }),
    makeFHLogs: (params) => ({
        method: NETWORK_METHOD.POST,
        url: getFHLogsURL(params.configType),
        data: params.data,
        config: {
            headers: {
                'x-api-key': getFHLogsAPIKey(params.configType)
            }
        },
        isAuthRequired: false
    }),
    makeServiceChargeCall: (params) => ({
        method: NETWORK_METHOD.GET,
        url: `consumer/order/${params.cartId}/fee/split?app_name=${BASE_API_CONFIG.applicationName}`,
        isAuthRequired: true
    })
};
