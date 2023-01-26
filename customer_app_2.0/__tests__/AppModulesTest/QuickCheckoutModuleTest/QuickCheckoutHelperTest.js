import {
    addressStringFromAddressObj,
    getAddressForQCFlow,
    getCardDetails,
    getCardItem,
    getDeliveryAddressForQCFlow,
    getPrimaryCardId,
    getSelectedPaymentTypeValue,
    hasDeliveryAddress,
    isCardPaymentEnabled,
    isCollectionOpened,
    isCollectionOrder,
    isDeliveryOpened,
    isImmediateOptionAvailable,
    isPreOrderEnabled,
    isWalletPaymentEnabled,
    preOrderFormatedDate,
    isApplePayEnabled,
    shouldShowContactFreeDelivery,
    isCashPaymentEnabled,
    getBasketTotal,
    isExpressPayment
} from 'appmodules/QuickCheckoutModule/Utils/Helper';
import { storeConfig, featureGateResponse, delivery_address, savedCardDetails } from '../data';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { CONSTANTS, PAYMENT_TYPE } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
// import { SCREEN_OPTIONS } from '../../../CustomerApp/Navigation/ScreenOptions';
import { props, delivery_props, empty_props } from './QuickCheckoutData';
import { resetAppType, setAppType } from '../../TestUtils/DateTestUtils';

describe('Quick Checkout Testing', () => {
    describe('isCardPaymentEnabled Testing', () => {
        test('isCardPaymentEnabled', () => {
            expect(isCardPaymentEnabled(storeConfig.card_payment)).toBe(true);
            expect(isCardPaymentEnabled(null)).toBe(false);
            expect(isCardPaymentEnabled(undefined)).toBe(false);
            expect(isCardPaymentEnabled('')).toBe(false);
            expect(isCardPaymentEnabled('ENABLED')).toBe(true);
            expect(isCardPaymentEnabled('enabled')).toBe(true);
            expect(isCardPaymentEnabled('NO')).toBe(false);
        });
    });

    describe('isWalletPaymentEnabled Testing', () => {
        test('isWalletPaymentEnabled', () => {
            expect(isWalletPaymentEnabled(storeConfig.wallet_payment, featureGateResponse.data)).toBe(true);
            expect(isWalletPaymentEnabled(null, featureGateResponse)).toBe(false);
            expect(isWalletPaymentEnabled(storeConfig, null)).toBe(false);
            expect(isWalletPaymentEnabled(undefined, undefined)).toBe(false);
            setAppType('CUSTOMER');
            expect(isWalletPaymentEnabled(storeConfig.wallet_payment, { foodhub_wallet: { status: 'ENABLED' } })).toBe(false);
            expect(isWalletPaymentEnabled(storeConfig.wallet_payment, { foodhub_wallet: { status: 'enabled' } })).toBe(false);
            expect(isWalletPaymentEnabled('NO', {})).toBe(false);
            expect(isWalletPaymentEnabled('', { foodhub_wallet: { status: 'ENABLED' } })).toBe(false);
            resetAppType();
            expect(isWalletPaymentEnabled(storeConfig.wallet_payment, { foodhub_wallet: { status: 'ENABLED' } })).toBe(true);
            expect(isWalletPaymentEnabled(storeConfig.wallet_payment, { foodhub_wallet: { status: 'enabled' } })).toBe(true);
            expect(isWalletPaymentEnabled('YES', featureGateResponse.data)).toBe(true);
            expect(isWalletPaymentEnabled('yes', featureGateResponse.data)).toBe(true);
            expect(isWalletPaymentEnabled('yes', { foodhub_wallet: { status: 'DISABLED' } })).toBe(false);
            expect(isWalletPaymentEnabled('true', { foodhub_wallet: { status: 'no' } })).toBe(false);
            expect(isWalletPaymentEnabled('disabled', featureGateResponse.data)).toBe(false);
            expect(isWalletPaymentEnabled(1, featureGateResponse.data)).toBe(true);
            expect(isWalletPaymentEnabled(0, featureGateResponse.data)).toBe(false);
        });
    });

    describe('isDeliveryOpened Testing', () => {
        test('isDeliveryOpened', () => {
            expect(isDeliveryOpened(storeConfig)).toBe(true);
            expect(isDeliveryOpened(null)).toBe(false);
            expect(isDeliveryOpened(undefined)).toBe(false);
            expect(isDeliveryOpened('')).toBe(false);
            expect(isDeliveryOpened({})).toBe(false);
            expect(isDeliveryOpened({ store_status: '', show_delivery: 1 })).toBe(false);
            expect(isDeliveryOpened({ store_status: { delivery: 'open' }, show_delivery: 0 })).toBe(false);
            expect(isDeliveryOpened({ store_status: { delivery: 'open', collection: 'closed' }, show_delivery: 1 })).toBe(true);
            expect(isDeliveryOpened({ store_status: { delivery: 'closed', collection: 'open' }, show_delivery: 1 })).toBe(false);
            expect(isDeliveryOpened({ store_status: { delivery: 'closed' }, show_delivery: 0 })).toBe(false);
            expect(isDeliveryOpened({ store_status: { delivery: null }, show_delivery: 0 })).toBe(false);
            expect(isDeliveryOpened({ store_status: { delivery: '' }, show_delivery: 1 })).toBe(false);
            expect(isDeliveryOpened({ store_status: { delivery: 'OPEN' }, show_delivery: 1 })).toBe(true);
        });
    });

    describe('isCollectionOpened Testing', () => {
        test('isCollectionOpened', () => {
            expect(isCollectionOpened(storeConfig)).toBe(true);
            expect(isCollectionOpened(null)).toBe(false);
            expect(isCollectionOpened(undefined)).toBe(false);
            expect(isCollectionOpened('')).toBe(false);
            expect(isCollectionOpened({})).toBe(false);
            expect(isCollectionOpened({ store_status: { collection: '' }, show_collection: 1 })).toBe(false);
            expect(isCollectionOpened({ store_status: { collection: 'open' }, show_collection: 1 })).toBe(true);
            expect(isCollectionOpened({ store_status: { collection: 'OPEN' }, show_collection: 1 })).toBe(true);
            expect(isCollectionOpened({ store_status: { collection: 'CLOSED' }, show_collection: 1 })).toBe(false);
            expect(isCollectionOpened({ store_status: { collection: 'closed' }, show_collection: 0 })).toBe(false);
            expect(isCollectionOpened({ store_status: { collection: 'open' }, show_collection: 0 })).toBe(false);
            expect(isCollectionOpened({ store_status: { collection: '' }, show_collection: 0 })).toBe(false);
            expect(isCollectionOpened({ store_status: '', show_collection: 0 })).toBe(false);
        });
    });

    describe('isCashPaymentEnabled Testing', () => {
        test('isCashPaymentEnabled', () => {
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 3, 0)).toBe(false);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 3, null)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.NO, 3, 0)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 3, 3)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 3, 2)).toBe(false);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, null, 1)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.DISABLED, CONSTANTS.YES, 1, 2)).toBe(false);
            expect(isCashPaymentEnabled(null, CONSTANTS.YES, 1, null)).toBe(false);
            expect(isCashPaymentEnabled(CONSTANTS.DISABLED, null, 1, 2)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.DISABLED, CONSTANTS.NO, null, 2)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.DISABLED, CONSTANTS.NO)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.DISABLED, CONSTANTS.YES)).toBe(false);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, '3', '129')).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, '3', 129)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 3, '129')).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 3, 129)).toBe(true);
            expect(isCashPaymentEnabled(CONSTANTS.ENABLED, CONSTANTS.YES, 0, null)).toBe(true);
        });
    });

    describe('isPreOrderEnabled Testing', () => {
        test('isPreOrderEnabled', () => {
            expect(isPreOrderEnabled(storeConfig.previous_order)).toBe(true);
            expect(isPreOrderEnabled(null)).toBe(false);
            expect(isPreOrderEnabled(undefined)).toBe(false);
            expect(isPreOrderEnabled('')).toBe(false);
            expect(isPreOrderEnabled('DISABLED')).toBe(false);
            expect(isPreOrderEnabled('enabled')).toBe(true);
            expect(isPreOrderEnabled('yes')).toBe(false);
            expect(isPreOrderEnabled()).toBe(false);
        });
    });

    describe('isCollectionOrder Testing', () => {
        test('isCollectionOrder', () => {
            expect(isCollectionOrder(props)).toBe(true);
            expect(isCollectionOrder(delivery_props)).toBe(false);
            expect(isCollectionOrder({})).toBe(false);
            expect(isCollectionOrder(null)).toBe(false);
            expect(isCollectionOrder(undefined)).toBe(false);
            expect(isCollectionOrder('')).toBe(false);
            expect(isCollectionOrder({ orderType: 'collection' })).toBe(true);
            expect(isCollectionOrder({ orderType: 'COLLECTION' })).toBe(true);
            expect(isCollectionOrder({ orderType: 'DELIVERY' })).toBe(false);
            expect(isCollectionOrder({ orderType: 'delivery' })).toBe(false);
            expect(isCollectionOrder({ orderType: 'waiting' })).toBe(false);
        });
    });

    describe('getAddressForQCFlow Testing', () => {
        test('getAddressForQCFlow', () => {
            expect(getAddressForQCFlow(props)).toBe(props.takeAwayAddress);
            expect(getAddressForQCFlow(delivery_props)).toBe(delivery_props.takeAwayAddress);
            expect(getAddressForQCFlow(empty_props)).toBe('');
        });
    });

    describe('getDeliveryAddressForQCFlow Testing', () => {
        test('getDeliveryAddressForQCFlow', () => {
            expect(getDeliveryAddressForQCFlow(delivery_props)).toBe(delivery_props.deliveryAddress);
            expect(getDeliveryAddressForQCFlow(props)).toBe('');
            expect(getDeliveryAddressForQCFlow(empty_props)).toBe('');
        });
    });

    describe('addressStringFromAddressObj Testing', () => {
        test('addressStringFromAddressObj', () => {
            expect(addressStringFromAddressObj(delivery_address)).toBe('16  12B,  Moorland Road,  Stoke-on-Trent,  ST6 1DT');
            expect(addressStringFromAddressObj(null)).toBe('');
            expect(addressStringFromAddressObj(undefined)).toBe('');
            expect(addressStringFromAddressObj(delivery_address, true)).toBe('16  12B,  Moorland Road,  Paris,  Stoke-on-Trent,  ST6 1DT');
        });
    });

    describe('hasDeliveryAddress Testing', () => {
        test('hasDeliveryAddress', () => {
            expect(hasDeliveryAddress(delivery_props)).toBe(true);
            expect(hasDeliveryAddress(empty_props)).toBe(false);
            expect(hasDeliveryAddress({})).toBe(false);
            expect(hasDeliveryAddress(null)).toBe(false);
            expect(hasDeliveryAddress(undefined)).toBe(false);
            expect(hasDeliveryAddress({ data: null })).toBe(false);
            expect(hasDeliveryAddress({ data: [{ id: 1 }, { id: 2 }] })).toBe(false);
            expect(hasDeliveryAddress({ addressResponse: { data: [{ id: 1 }, { id: 2 }] } })).toBe(true);
            expect(hasDeliveryAddress({ addressResponse: null })).toBe(false);
            expect(hasDeliveryAddress({ addressResponse: { data: {} } })).toBe(false);
            expect(hasDeliveryAddress({ data: {} })).toBe(false);
            expect(hasDeliveryAddress()).toBe(false);
        });
    });

    describe('getSelectedPaymentTypeValue Testing', () => {
        test('getSelectedPaymentTypeValue', () => {
            expect(getSelectedPaymentTypeValue(null)).toEqual(LOCALIZATION_STRINGS.CASH);
            expect(getSelectedPaymentTypeValue(undefined, null)).toEqual(LOCALIZATION_STRINGS.CASH);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.GOOGLE_PAY, {})).toEqual(LOCALIZATION_STRINGS.GOOGLE_PAY);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.WALLET, { currency: null, walletBalance: 1.5 })).toEqual(
                'Foodhub Wallet (1.5)'
            );
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.WALLET, { walletBalance: 2.5 })).toEqual('Foodhub Wallet (2.5)');
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.WALLET, delivery_props)).toEqual(
                `${LOCALIZATION_STRINGS.FOOD_HUB_WALLET} (${delivery_props.currency}${delivery_props.walletBalance})`
            );
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.NEW_CARD, delivery_props)).toEqual(LOCALIZATION_STRINGS.NEW_CARD);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.CARD, delivery_props)).toEqual(LOCALIZATION_STRINGS.CARD);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.APPLE_PAY, delivery_props)).toEqual(LOCALIZATION_STRINGS.APPLE_PAY);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.GOOGLE_PAY, delivery_props)).toEqual(LOCALIZATION_STRINGS.GOOGLE_PAY);
            expect(getSelectedPaymentTypeValue('', delivery_props)).toEqual(LOCALIZATION_STRINGS.CASH);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.CASH, delivery_props)).toEqual(LOCALIZATION_STRINGS.CASH);
            expect(getSelectedPaymentTypeValue('', delivery_props)).toEqual(LOCALIZATION_STRINGS.CASH);
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.CARD_FROM_LIST, delivery_props)).toEqual('VISA DEBIT   **** 0001');
            expect(getSelectedPaymentTypeValue(PAYMENT_TYPE.PARTIAL_PAYMENT, delivery_props)).toEqual(
                `${LOCALIZATION_STRINGS.FOOD_HUB_WALLET} (${delivery_props.currency}${delivery_props.walletBalance})\n${getCardDetails(
                    delivery_props.savedCardDetails,
                    delivery_props.user_selected_card_id
                )}`
            );
        });
    });

    describe('getCardItem Testing', () => {
        test('getCardItem', () => {
            expect(getCardItem(delivery_props.savedCardDetails, delivery_props.user_selected_card_id)).toEqual(savedCardDetails[0]);
        });
    });

    describe('getCardDetails Testing', () => {
        test('getCardDetails', () => {
            expect(getCardDetails(delivery_props.savedCardDetails, delivery_props.user_selected_card_id)).toEqual('VISA DEBIT   **** 0001');
            expect(getCardDetails(delivery_props.savedCardDetails, null)).toEqual('');
            expect(getCardDetails(null, delivery_props.user_selected_card_id)).toEqual('');
            expect(getCardDetails(undefined, undefined)).toEqual('');
        });
    });

    describe('getPrimaryCardId Testing', () => {
        test('getPrimaryCardId', () => {
            expect(getPrimaryCardId(savedCardDetails)).toEqual(savedCardDetails[0].id);
            expect(getPrimaryCardId(savedCardDetails)).toEqual(savedCardDetails[0].id);
            expect(getPrimaryCardId(null)).toEqual(null);
            expect(getPrimaryCardId(undefined)).toEqual(null);
        });
    });

    describe('isImmediateOptionAvailable Testing', () => {
        test('isImmediateOptionAvailable', () => {
            expect(
                isImmediateOptionAvailable(
                    delivery_props.isCollectionAvailable,
                    delivery_props.isDeliveryAvailable,
                    delivery_props.selectedOrderType
                )
            ).toBe(true);
            expect(isImmediateOptionAvailable(props)).toBe();
            expect(isImmediateOptionAvailable()).toBe();
            expect(isImmediateOptionAvailable(true)).toBe(undefined);
            expect(isImmediateOptionAvailable(null)).toBe(undefined);
            expect(isImmediateOptionAvailable(true, false, null)).toBe(false);
            expect(isImmediateOptionAvailable(true, false, 'COLLECTION')).toBe(true);
            expect(isImmediateOptionAvailable(true, false, 'collection')).toBe(true);
            expect(isImmediateOptionAvailable(true, false, '')).toBe(false);
            expect(isImmediateOptionAvailable(false, false, 'DELIVERY')).toBe(false);
            expect(isImmediateOptionAvailable(false, true, null)).toBe(true);
            expect(isImmediateOptionAvailable(false, false, 'COLLECTION')).toBe(false);
            expect(isImmediateOptionAvailable(true, true, 'collection')).toBe(true);
            expect(isImmediateOptionAvailable(false, true, 'collection')).toBe(false);
        });
    });

    describe('preOrderFormatedDate Testing', () => {
        test('preOrderFormatedDate', () => {
            expect(
                preOrderFormatedDate(
                    delivery_props.preOrderCollectionDates,
                    delivery_props.preOrderDeliveryDates,
                    delivery_props.selectedOrderType
                )
            ).toBe('2021-08-04 07:50');
            expect(
                preOrderFormatedDate(
                    delivery_props.preOrderCollectionDates,
                    delivery_props.preOrderDeliveryDates,
                    delivery_props.selectedOrderType
                )
            ).toBe('2021-08-04 07:50');
            expect(preOrderFormatedDate(empty_props)).toBe('');
        });
    });

    describe('isApplePayEnabled Testing', () => {
        test('isApplePayEnabled', () => {
            expect(isApplePayEnabled(storeConfig.setting.apple_pay, storeConfig.apple_pay, featureGateResponse.data)).toBe(true);
            expect(isApplePayEnabled(storeConfig, null)).toBe(false);
            expect(isApplePayEnabled(null, featureGateResponse.data)).toBe(false);
            expect(isApplePayEnabled(undefined, undefined)).toBe(false);
        });
    });

    describe('shouldShowContactFreeDelivery', () => {
        test('shouldShowContactFreeDelivery', () => {
            expect(shouldShowContactFreeDelivery(ORDER_TYPE.DELIVERY, PAYMENT_TYPE.CARD, featureGateResponse.data)).toBe(true);
            expect(shouldShowContactFreeDelivery(ORDER_TYPE.DELIVERY, PAYMENT_TYPE.CASH, featureGateResponse.data)).toBe(false);
            expect(shouldShowContactFreeDelivery(ORDER_TYPE.DELIVERY, PAYMENT_TYPE.PARTIAL_PAYMENT, featureGateResponse.data)).toBe(true);
            expect(shouldShowContactFreeDelivery(ORDER_TYPE.DELIVERY, PAYMENT_TYPE.APPLE_PAY, featureGateResponse.data)).toBe(true);
            expect(shouldShowContactFreeDelivery(ORDER_TYPE.COLLECTION, PAYMENT_TYPE.CARD, featureGateResponse.data)).toBe(false);
            expect(shouldShowContactFreeDelivery(null, PAYMENT_TYPE.CARD, featureGateResponse.data)).toBe(false);
            expect(shouldShowContactFreeDelivery(ORDER_TYPE.DELIVERY, null, featureGateResponse.data)).toBe(false);
        });
    });

    describe('getBasketTotal', () => {
        expect(getBasketTotal({ total: { value: '0.23' } })).toBe(0.23);
        expect(getBasketTotal({ total: { value: 2.5 } })).toBe(2.5);
        expect(getBasketTotal({ total: { value: -2.5 } })).toBe(-2.5);
        expect(getBasketTotal({ total: { value: '' } })).toBe(0);
        expect(getBasketTotal({ total: { value: null } })).toBe(0);
        expect(getBasketTotal({ total: null })).toBe(0);
        expect(getBasketTotal({})).toBe(0);
        expect(getBasketTotal(undefined)).toBe(0);
        expect(getBasketTotal(null)).toBe(0);
        expect(getBasketTotal('')).toBe(0);
    });

    describe('isExpressPayment', () => {
        expect(isExpressPayment('')).toBe(false);
        expect(isExpressPayment(null)).toBe(false);
        expect(isExpressPayment('WALLET')).toBe(true);
        expect(isExpressPayment('wallet')).toBe(true);
        expect(isExpressPayment('Card_FROm_list')).toBe(true);
        expect(isExpressPayment(PAYMENT_TYPE.CARD_FROM_LIST)).toBe(true);
        expect(isExpressPayment('CARD')).toBe(false);
        expect(isExpressPayment('PARTIAL_payment')).toBe(true);
        expect(isExpressPayment('payment')).toBe(false);
        expect(isExpressPayment()).toBe(false);
    });
});
