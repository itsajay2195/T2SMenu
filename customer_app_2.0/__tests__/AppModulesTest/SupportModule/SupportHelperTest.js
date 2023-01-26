import {
    deliverTimeRequestOrder,
    getChatBotDeliveryDuration,
    getDriverName,
    getDriverPhone,
    getOrderDeliveryTime,
    getOrderHelpViewType,
    getOrderTimeZone,
    getProfileResponse,
    getRefundByWalletOrder,
    getStorePhoneNumber,
    isCashOrder,
    isDeliveryTimeUpdateOrder,
    isNonCancelledOrder,
    isRefundByWalletInProgress,
    isRequestedUpdatedDeliveryTime,
    isSelectedItem
} from 'appmodules/SupportModule/Utils/SupportHelpers';
import { previousOrdersData, sampleCashOrder, sampleInprogressWalletOrder, sampleOrderWallet } from '../previousOrdersData';
import { ORDER_STATUS } from 'appmodules/BaseModule/BaseConstants';
let countryBaseFeatureGateResponse = { chat_bot_duration: { options: { duration: 10 } } };
let walletResponse = {
    id: 542409607,
    host: 'd-1337.t2scdn.com',
    order_no: 11,
    status: '4',
    customers_id: 72143544,
    delivery_time: '2021-11-11 08:55:16',
    wait: '7',
    total: '10.12',
    total_paid_by_card: '0.00',
    total_paid_by_wallet: '0.00',
    day: '11',
    month: '11',
    year: '2021',
    time: '08:48:16',
    order_placed_on: '2021-11-11 08:48:16',
    delivery_cost: '',
    sending: 'collection',
    payment: '0',
    cancel_reason_id: 0,
    cancel_reason_message: '',
    pre_order_time: '0000-00-00 00:00:00',
    points_used: 0,
    redeem_amount: '0.00',
    points_gained: 0,
    points_remaining: 0,
    online_discount_value: '1.35',
    created_at: '2021-11-12 05:59:39',
    address: '',
    houseno: '',
    flat: '',
    address1: '',
    address2: '',
    postcode: '',
    latitude: '53.061129',
    longitude: '-2.204682',
    consumer_request: 0,
    refund: 0,
    order_accepted_at: '2021-11-11 12:02:05',
    assigned_at: '',
    table_id: 0,
    time_zone: 'Europe/London',
    store: {
        id: 809282,
        host: 'd-1337.t2scdn.com',
        name: 'LIVE EARTH GATEWAY TESTING',
        currency: 1,
        phone: '07446411868',
        town: 'Stoke On Trent',
        slug_name: 'LIVE-EARTH-GATEWAY-TESTING',
        website_logo_url: 'https://public.touch2success.com/static/a94c2b489148a5c7c5f3e95099412859/img/phpskMjIM.png',
        portal_setting: {
            config_id: 809282,
            portal_version: '2.0',
            logo_url: 'https://assets.foodhub.com/static/81be24433d202fd2658ca9e12dbf818b/img/1622312848phpcx3dAh.jpg'
        }
    },
    review: null,
    table: null,
    refund_request_log: {
        id: 86,
        customer_id: 58,
        order_info_id: 20201246,
        product_id: null,
        platform_id: null,
        destination: 3,
        amount: '4.96',
        wallet_amount: '0.00',
        card_amount: '4.96',
        refund_source_id: 1,
        refund_status_id: 4,
        requested_by: null,
        device: '',
        reason: 'I placed an incorrect order',
        refunded_at: null,
        created_at: '2021-11-02 06:58:48',
        updated_at: '2021-11-02 06:58:48'
    }
};
describe('Support Testing', () => {
    describe('isRequestedUpdatedDeliveryTime Testing', () => {
        test('isRequestedUpdatedDeliveryTime', () => {
            expect(isRequestedUpdatedDeliveryTime('2021-11-11 10:17:05', 'Europe/London', 5)).toBe(true);
            expect(isRequestedUpdatedDeliveryTime('2021-11-11 11:34:05', 'Europe/London', 5)).toBe(true);
            expect(isRequestedUpdatedDeliveryTime('2021-11-11 13:50:05', 'Europe/London', 5)).toBe(true);
            expect(isRequestedUpdatedDeliveryTime('2021-11-11 11:50:05', null, 5)).toBe(false);
            expect(isRequestedUpdatedDeliveryTime('2021-11-11 11:50:05', null, null)).toBe(false);
            expect(isRequestedUpdatedDeliveryTime(null, null, null)).toBe(false);
        });
    });
    describe('getChatBotDeliveryDuration Testing', () => {
        test('getChatBotDeliveryDuration', () => {
            expect(getChatBotDeliveryDuration(null)).toBe(0);
            expect(getChatBotDeliveryDuration(countryBaseFeatureGateResponse)).toBe(10);
        });
    });
    describe('getRefundByWalletOrder Testing', () => {
        test('getRefundByWalletOrder', () => {
            expect(getRefundByWalletOrder(sampleOrderWallet, previousOrdersData)).toEqual(walletResponse);
            expect(getRefundByWalletOrder(sampleCashOrder, previousOrdersData)).toBe(null);
            expect(getRefundByWalletOrder(sampleCashOrder, null)).toBe(null);
            expect(getRefundByWalletOrder(null, null)).toBe(null);
            expect(getRefundByWalletOrder('', '')).toBe(null);
        });
    });
    describe('isRefundByWalletInProgress Testing', () => {
        test('isRefundByWalletInProgress', () => {
            expect(isRefundByWalletInProgress(sampleInprogressWalletOrder)).toBe(true);
            expect(isRefundByWalletInProgress({})).toBe(false);
            expect(isRefundByWalletInProgress('')).toBe(false);
            expect(isRefundByWalletInProgress(null)).toBe(false);
        });
    });
    describe('getStorePhoneNumber Testing', () => {
        test('getStorePhoneNumber', () => {
            expect(getStorePhoneNumber({ data: { store: { phone: '7446411868' } } })).toBe('7446411868');
            expect(getStorePhoneNumber({})).toBe(undefined);
            expect(getStorePhoneNumber({ data: {} })).toBe(undefined);
            expect(getStorePhoneNumber(null)).toBe(undefined);
            expect(getStorePhoneNumber(undefined)).toBe(undefined);
        });
    });

    describe('getDriverName Testing', () => {
        test('getDriverName', () => {
            expect(getDriverName({})).toBe('');
            expect(getDriverName(undefined)).toBe('');
            expect(getDriverName(null)).toBe('');
            expect(getDriverName({ driver: { name: 'ray' } })).toBe('ray');
        });
    });
    describe('getDriverPhone Testing', () => {
        test('getDriverPhone', () => {
            expect(getDriverPhone({})).toBe('');
            expect(getDriverPhone(undefined)).toBe('');
            expect(getDriverPhone(null)).toBe('');
            expect(getDriverPhone({ driver: { phone: '7446411868' } })).toBe('7446411868');
        });
    });
    describe('isSelectedItem Testing', () => {
        test('isSelectedItem', () => {
            expect(isSelectedItem({ id: '68' }, { id: '68' })).toBe(true);
            expect(isSelectedItem({}, {})).toBe(true);
            expect(isSelectedItem(undefined, undefined)).toBe(false);
            expect(isSelectedItem(null, null)).toBe(false);
            expect(isSelectedItem({ id: '68' }, { id: '60' })).toBe(false);
        });
    });
    describe('isCashOrder Testing', () => {
        test('isCashOrder', () => {
            expect(isCashOrder({ total_paid_by_card: 0.0, total_paid_by_wallet: 0.0 })).toBe(true);
            expect(isCashOrder({})).toBe(false);
            expect(isCashOrder(null)).toBe(false);
            expect(isCashOrder('')).toBe(false);
        });
    });
    describe('isNonCancelledOrder Testing', () => {
        test('isNonCancelledOrder', () => {
            expect(isNonCancelledOrder({ status: ORDER_STATUS.CANCEL_ORDER })).toBe(false);
            expect(isNonCancelledOrder({ status: ORDER_STATUS.MANAGER_DELETED })).toBe(true);
            expect(isNonCancelledOrder({})).toBe(false);
            expect(isNonCancelledOrder(null)).toBe(false);
            expect(isNonCancelledOrder('')).toBe(false);
        });
    });
    describe('getOrderTimeZone Testing', () => {
        test('getOrderTimeZone', () => {
            expect(getOrderTimeZone({ data: { time_zone: 'Europe/London' } }, 'America/Chicago')).toBe('Europe/London');
            expect(getOrderTimeZone({}, 'America/Chicago')).toBe('America/Chicago');
            expect(getOrderTimeZone({ data: {} }, 'America/Chicago')).toBe('America/Chicago');
            expect(getOrderTimeZone(null, 'America/Chicago')).toBe('America/Chicago');
            expect(getOrderTimeZone('', 'America/Chicago')).toBe('America/Chicago');
        });
    });
    describe('getOrderDeliveryTime Testing', () => {
        test('getOrderDeliveryTime', () => {
            expect(getOrderDeliveryTime({ data: { delivery_time: '2021-11-12 12:32:47' } })).toBe('2021-11-12 12:32:47');
            expect(getOrderDeliveryTime({})).toBe(false);
            expect(getOrderDeliveryTime(undefined)).toBe(false);
            expect(getOrderDeliveryTime(null)).toBe(false);
            expect(getOrderDeliveryTime('')).toBe(false);
        });
    });
    describe('getUserName Testing', () => {
        test('getUserName', () => {
            expect(getProfileResponse(null)).toStrictEqual({});
            expect(getProfileResponse(undefined)).toStrictEqual({});
            expect(getProfileResponse('')).toStrictEqual({});
            expect(
                getProfileResponse({ first_name: 'ray', last_name: 'banner', phone: '7446411868', email: 'ray.banner.gmail.com' })
            ).toStrictEqual({
                first_name: 'ray',
                last_name: 'banner',
                phone: '7446411868',
                email: 'ray.banner.gmail.com'
            });
            expect(
                getProfileResponse({ first_name: '', last_name: 'banner', phone: '7446411868', email: 'ray.banner.gmail.com' })
            ).toStrictEqual({
                last_name: 'banner',
                phone: '7446411868',
                email: 'ray.banner.gmail.com'
            });
            expect(
                getProfileResponse({ first_name: 'ray', last_name: '', phone: '7446411868', email: 'ray.banner.gmail.com' })
            ).toStrictEqual({
                first_name: 'ray',
                phone: '7446411868',
                email: 'ray.banner.gmail.com'
            });
            expect(getProfileResponse({ first_name: 'ray', last_name: 'banner', phone: '', email: 'ray.banner.gmail.com' })).toStrictEqual({
                first_name: 'ray',
                last_name: 'banner',
                email: 'ray.banner.gmail.com'
            });
            expect(getProfileResponse({ first_name: 'ray', last_name: 'banner', phone: '7446411868', email: '' })).toStrictEqual({
                first_name: 'ray',
                last_name: 'banner',
                phone: '7446411868'
            });
        });
    });
    describe('deliverTimeRequestOrder Testing', () => {
        test('deliverTimeRequestOrder', () => {
            expect(deliverTimeRequestOrder([{ orderId: 9879 }, { orderId: 98739 }], { data: { id: 9879 } })).toStrictEqual({
                orderId: 9879
            });
            expect(deliverTimeRequestOrder([], {})).toBe(null);
            expect(deliverTimeRequestOrder(undefined)).toBe(null);
            expect(deliverTimeRequestOrder('')).toBe(null);
        });
    });
    describe('isDeliveryTimeUpdateOrder Testing', () => {
        test('isDeliveryTimeUpdateOrder', () => {
            expect(isDeliveryTimeUpdateOrder([{ orderId: 9879 }, { orderId: 98739 }], { data: { id: 9879 } })).toStrictEqual(false);
            expect(isDeliveryTimeUpdateOrder([], {})).toBe(undefined);
            expect(isDeliveryTimeUpdateOrder(undefined)).toBe(undefined);
            expect(isDeliveryTimeUpdateOrder('')).toBe(undefined);
        });
    });

    describe('getOrderHelpViewType Testing', () => {
        test('getOrderHelpViewType', () => {
            expect(getOrderHelpViewType(0)).toBe('');
            expect(getOrderHelpViewType(2)).toBe('edit_order_instructions');
            expect(getOrderHelpViewType('')).toBe('');
            expect(getOrderHelpViewType('5')).toBe('some_things_else');
            expect(getOrderHelpViewType(3.5)).toBe('');
            expect(getOrderHelpViewType(null)).toBe('');
        });
    });
});
