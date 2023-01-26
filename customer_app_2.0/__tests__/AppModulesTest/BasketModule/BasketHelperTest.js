import {
    handleItemsInTheCart,
    isResourceIDMatch,
    handleItemsFromReorder,
    isBOGOFItem,
    isBOGOHItem,
    getOfferText,
    isNoOfferItem,
    removeResourceID,
    getPriceSummary,
    formAPIData,
    manipulateBasketResponse,
    getDefaultPaymentMode,
    handleAddOnItem,
    filterFreeItem,
    getDataForRepeatAddOn,
    containsItemWithCouponNotApplied,
    extractPreOrderInfofromStoreResponse,
    isWalletPaymentApplicableForBasket,
    isSavedCardAvailable,
    formatReceiptDetails,
    translateWarnErrors,
    getTopTwoRecommendations,
    formBasketRecommendation,
    handleBestSellingAsRecommendations,
    isAdvancedDiscount,
    isOnlineDiscountApplied,
    isNotSameStore,
    isSameStore,
    isThirdPartyDriverEnabled,
    getReplaceTextForOtherLanguages,
    translateLabels,
    formatTipValue,
    getTACloseMessage,
    getCouponType
} from 'appmodules/BasketModule/Utils/BasketHelper';
import {
    cartItem,
    cartItemsArray,
    newCartItem,
    resourceIDs,
    orderPayload,
    reorderResponse,
    reOrderHandleItem,
    remove_resource_id,
    delivery_props,
    empty_props,
    props,
    formApiDataObject,
    formApiAction,
    updateCouponAction,
    basketResponse,
    handleAddonPayload,
    menuResponseWithFree,
    repeatAddonData,
    recommendationArray
} from './BasketHelperData';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { featureGateResponse, menuResponse, orderResponse, savedCardDetails, storeConfig } from '../data';
import { CONSTANTS, PAYMENT_TYPE } from 'appmodules/QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { ORDER_TYPE, REPLACE_TEXT } from 'appmodules/BaseModule/BaseConstants';
import { DATE_FORMAT } from 't2sbasemodule/Utils/DateUtil';
import { isExpiredBasket } from 'appmodules/BaseModule/Helper';
import { BasketConstants } from 'appmodules/BasketModule/Utils/BasketConstants';

describe('BasketHelper Testing', () => {
    test('handleItemsInTheCart Testing', () => {
        expect(handleItemsInTheCart(null, null, null)).toEqual([]);
        expect(handleItemsInTheCart(undefined, undefined, undefined)).toEqual([]);
        expect(handleItemsInTheCart([], {}, [])).toEqual([]);
        expect(handleItemsInTheCart(null, cartItem, [])).toHaveLength(1);
        expect(handleItemsInTheCart(undefined, cartItem, [])).toHaveLength(1);
        expect(handleItemsInTheCart([], cartItem, null)).toHaveLength(1);
        expect(handleItemsInTheCart([], cartItem, undefined)).toHaveLength(1);
        expect(handleItemsInTheCart([], cartItem, [])).toHaveLength(1);
        expect(handleItemsInTheCart(cartItemsArray, cartItem, null)).toHaveLength(4);
        expect(handleItemsInTheCart(cartItemsArray, cartItem, undefined)).toHaveLength(4);
        expect(handleItemsInTheCart(cartItemsArray, newCartItem, null)).toHaveLength(5);
        expect(handleItemsInTheCart(cartItemsArray, newCartItem, undefined)).toHaveLength(5);
        expect(handleItemsInTheCart(null, newCartItem, resourceIDs)).toHaveLength(1);
        expect(handleItemsInTheCart(undefined, newCartItem, resourceIDs)).toHaveLength(1);
        expect(handleItemsInTheCart(cartItemsArray, cartItem, [])).toHaveLength(4);
        expect(handleItemsInTheCart(cartItemsArray, cartItem, resourceIDs)).toHaveLength(4);
        expect(handleItemsInTheCart(cartItemsArray, newCartItem, resourceIDs)).toHaveLength(5);
    });

    test('getTACloseMessage', () => {
        //We're using localization string below test case will be fail
        function createStore(delivery, collection, openTime = undefined) {
            return {
                takeaway_closed: delivery.toLowerCase() === 'closed' && collection.toLowerCase() === 'closed' ? 'closed' : 'open',
                next_open: '2022-09-26 08:04:00',
                online_closed_message: "Sorry, We're currently closed and will open Tomorrow at 08:04 AM",
                show_delivery: 1,
                show_collection: 1,
                store_status: { collection: collection, delivery: delivery },
                delivery_next_open: openTime ?? '2022-09-26 08:08:00',
                delivery_next_open_message: "Sorry, We're currently closed and will open Tomorrow at 08:08 AM",
                collection_next_open: openTime ?? '2022-09-26 08:08:00',
                collection_next_open_message: "Sorry, We're currently closed and will open Tomorrow at 08:08 AM"
            };
        }

        expect(getTACloseMessage(createStore('closed', 'closed'), 'delivery')).toEqual(
            "Sorry, We're currently closed and will open Tomorrow at 08:04 AM"
        );

        expect(getTACloseMessage(createStore('closed', 'open'), 'delivery')).toEqual(
            "Sorry, We're currently closed for Delivery until September 26, 2022 08:08 AM. Collection is available"
        );
        expect(getTACloseMessage(createStore('closed', 'open'), 'collection')).toEqual(undefined);

        expect(getTACloseMessage(createStore('open', 'open'), 'collection')).toEqual(undefined);

        expect(getTACloseMessage(createStore('closed', 'open', '2022-04-07 08:08:00'), 'delivery')).toEqual(
            "Sorry, We're currently closed for Delivery until Tomorrow, 08:08 AM. Collection is available"
        );

        expect(getTACloseMessage(createStore('closed', 'open', ''), 'delivery')).toEqual(
            "Sorry, We're currently closed for Delivery. Collection is available"
        );
        expect(getTACloseMessage(createStore('CLOSED', 'open', ''), 'delivery')).toEqual(
            "Sorry, We're currently closed for Delivery. Collection is available"
        );
        expect(getTACloseMessage(createStore('OPEN', 'CLOSED', ''), 'delivery')).toEqual(undefined);
        expect(getTACloseMessage(createStore('OPEN', 'CLOSED', ''), 'collection', false, 'Europe/London')).toEqual(
            "Sorry, We're currently closed for Collection. Delivery is available"
        );
        expect(getTACloseMessage(createStore('OPEN', 'CLOSED', ''), 'collection', true, 'Europe/London')).toEqual(
            `Sorry, We're currently closed for Collection. Delivery is available`
        );
        expect(getTACloseMessage(createStore('CLOSED', 'OPEN', ''), 'delivery', true, 'Europe/London')).toEqual(
            `Sorry, We're currently closed and will open Tomorrow at 08:04 AM`
        );
        expect(getTACloseMessage(createStore('OPEN', 'OPEN', ''), 'delivery')).toEqual(undefined);
        expect(getTACloseMessage(null)).toBe(null);
        expect(getTACloseMessage(undefined)).toBe(null);
    });

    describe('isResourceIDMatch Testing', () => {
        test('isResourceIDMatch', () => {
            expect(isResourceIDMatch(cartItem, resourceIDs)).toBe(true);
            expect(isResourceIDMatch(newCartItem, resourceIDs)).toBe(false);
            expect(isResourceIDMatch(newCartItem, null)).toBe(true);
            expect(isResourceIDMatch(null, null)).toBe(true);
            expect(isResourceIDMatch(undefined, undefined)).toBe(true);
            expect(isResourceIDMatch('', '')).toBe(true);
        });
    });

    describe('handleItemsFromReorder Testing', () => {
        test('handleItemsFromReorder', () => {
            expect(handleItemsFromReorder(orderPayload, reorderResponse)).toEqual(reOrderHandleItem);
            expect(handleItemsFromReorder(null, reorderResponse)).toEqual(null);
            expect(handleItemsFromReorder(orderPayload, null)).toEqual(null);
            expect(handleItemsFromReorder(undefined, undefined)).toEqual(null);
            expect(handleItemsFromReorder(null, null)).toEqual(null);
            expect(handleItemsFromReorder('', '')).toEqual(null);
        });
    });

    describe('isBOGOFItem Testing', () => {
        test('isBOGOFItem', () => {
            expect(isBOGOFItem(newCartItem.item.offer)).toEqual(false);
            expect(isBOGOFItem(cartItem.item.offer)).toEqual(true);
            expect(isBOGOFItem(null)).toEqual(false);
            expect(isBOGOFItem(undefined)).toEqual(false);
            expect(isBOGOFItem(cartItem.item.offer.toLowerCase())).toEqual(true);
            expect(isBOGOFItem('')).toEqual(false);
        });
    });

    describe('isBOGOHItem Testing', () => {
        test('isBOGOHItem', () => {
            expect(isBOGOHItem(newCartItem.item.offer)).toEqual(true);
            expect(isBOGOHItem(cartItem.item.offer)).toEqual(false);
            expect(isBOGOHItem(null)).toEqual(false);
            expect(isBOGOHItem(undefined)).toEqual(false);
            expect(isBOGOHItem(newCartItem.item.offer.toLowerCase())).toEqual(true);
            expect(isBOGOHItem('')).toEqual(false);
        });
    });

    describe('getOfferText Testing', () => {
        test('getOfferText', () => {
            expect(getOfferText(BasketConstants.BOGOH)).toEqual(LOCALIZATION_STRINGS.BOGOH);
            expect(getOfferText(BasketConstants.BOGOF)).toEqual(LOCALIZATION_STRINGS.BOGOF);
            expect(getOfferText(null)).toEqual(null);
            expect(getOfferText(undefined)).toEqual(null);
            expect(getOfferText(BasketConstants.BOGOH.toLowerCase())).toEqual(LOCALIZATION_STRINGS.BOGOH);
            expect(getOfferText(BasketConstants.BOGOF.toLowerCase())).toEqual(LOCALIZATION_STRINGS.BOGOF);
            expect(getOfferText('')).toEqual(null);
            expect(getOfferText(BasketConstants.NONE)).toEqual(null);
            expect(getOfferText(BasketConstants.FREE)).toEqual(null);
        });
    });

    describe('isNoOfferItem Testing', () => {
        test('isNoOfferItem', () => {
            expect(isNoOfferItem(BasketConstants.BOGOH)).toEqual(false);
            expect(isNoOfferItem(BasketConstants.BOGOF)).toEqual(false);
            expect(isNoOfferItem(BasketConstants.NONE)).toEqual(true);
            expect(isNoOfferItem(BasketConstants.FREE)).toEqual(false);
            expect(isNoOfferItem('')).toEqual(false);
            expect(isNoOfferItem(BasketConstants.NONE.toLowerCase())).toEqual(true);
            expect(isNoOfferItem(null)).toEqual(false);
            expect(isNoOfferItem(undefined)).toEqual(false);
        });
    });

    describe('removeResourceID Testing', () => {
        test('removeResourceID', () => {
            expect(removeResourceID(resourceIDs, remove_resource_id)).toHaveLength(4);
            expect(removeResourceID(null, remove_resource_id)).toEqual(null);
            expect(removeResourceID(resourceIDs, null)).toEqual(null);
            expect(removeResourceID(undefined, undefined)).toEqual(null);
        });
    });

    describe('getPriceSummary Testing', () => {
        test('getPriceSummary', () => {
            expect(getPriceSummary(delivery_props)).toHaveLength(6);
            expect(getPriceSummary(empty_props)).toHaveLength(0);
            expect(getPriceSummary(props)).toHaveLength(4);
            expect(getPriceSummary({})).toHaveLength(0);
            expect(getPriceSummary([])).toHaveLength(0);
        });
    });

    describe('formAPIData Testing', () => {
        test('formAPIData', () => {
            expect(formAPIData({ getBasket: formApiDataObject, action: formApiAction, object: formApiDataObject })).not.toEqual(null);
            expect(formAPIData({ getBasket: formApiDataObject, action: updateCouponAction, object: formApiDataObject })).not.toEqual(null);
        });
    });
    describe('manipulateBasketResponse Testing', () => {
        test('manipulateBasketResponse', () => {
            expect(manipulateBasketResponse({ basket: basketResponse })).toEqual(basketResponse);
            expect(manipulateBasketResponse({ basket: undefined })).toEqual(undefined);
            expect(manipulateBasketResponse([])).toEqual(undefined);
            expect(manipulateBasketResponse('')).toEqual(undefined);
            expect(manipulateBasketResponse(null)).toEqual(undefined);
            expect(manipulateBasketResponse({ basket: [] })).toEqual(undefined);
            expect(manipulateBasketResponse({ basket: [{ item: [] }] })).toEqual(undefined);
            expect(manipulateBasketResponse({ basket: [{ item: null }] })).toEqual(undefined);
            expect(manipulateBasketResponse({ basket: [{ item: '' }] })).toEqual(undefined);
            expect(manipulateBasketResponse({ basket: [{ item: undefined }] })).toEqual(undefined);
        });
    });

    describe('getDefaultPaymentMode Testing', () => {
        test('getDefaultPaymentMode', () => {
            expect(
                getDefaultPaymentMode({
                    storeResponse: storeConfig,
                    walletBalance: 12.23,
                    totalAmount: 12.0,
                    userPaymentMode: PAYMENT_TYPE.WALLET,
                    countryBaseFeatureGateResponse: featureGateResponse,
                    basketData: basketResponse
                })
            ).toEqual(PAYMENT_TYPE.CARD);
            expect(
                getDefaultPaymentMode({
                    storeResponse: storeConfig,
                    walletBalance: 12.23,
                    totalAmount: 12.0,
                    userPaymentMode: PAYMENT_TYPE.CASH,
                    countryBaseFeatureGateResponse: featureGateResponse
                })
            ).toEqual(PAYMENT_TYPE.CASH);
            expect(
                getDefaultPaymentMode({
                    storeResponse: storeConfig,
                    walletBalance: 12.23,
                    totalAmount: 12.0,
                    userPaymentMode: PAYMENT_TYPE.CARD,
                    countryBaseFeatureGateResponse: featureGateResponse
                })
            ).toEqual(PAYMENT_TYPE.CARD);
            expect(
                getDefaultPaymentMode({
                    storeResponse: storeConfig,
                    walletBalance: 0.0,
                    totalAmount: 12.0,
                    countryBaseFeatureGateResponse: featureGateResponse,
                    savedCardDetails: savedCardDetails,
                    selectedOrderType: ORDER_TYPE.DELIVERY
                })
            ).toEqual(PAYMENT_TYPE.CARD_FROM_LIST);
            expect(
                getDefaultPaymentMode({
                    storeResponse: storeConfig,
                    walletBalance: 0.0,
                    totalAmount: 12.0,
                    countryBaseFeatureGateResponse: featureGateResponse
                })
            ).toEqual(PAYMENT_TYPE.CARD);
            expect(
                getDefaultPaymentMode({
                    storeResponse: null,
                    walletBalance: 0.0,
                    totalAmount: 12.0,
                    countryBaseFeatureGateResponse: featureGateResponse
                })
            ).toEqual(PAYMENT_TYPE.CASH);
        });
    });

    describe('handleAddOnItem Testing', () => {
        test('handleAddOnItem', () => {
            expect(handleAddOnItem(handleAddonPayload, { item: { id: 27244861 } })).toHaveLength(1);
            expect(handleAddOnItem(handleAddonPayload, { item: { id: 23623822 } })).toHaveLength(2);
        });
    });

    describe('filterFreeItem Testing', () => {
        test('filterFreeItem', () => {
            expect(filterFreeItem('holeinthewallkidsgrove.co.uk', menuResponse)).toHaveLength(0);
            expect(filterFreeItem('qa4.t2scdn.com', menuResponseWithFree)).toHaveLength(1);
            expect(filterFreeItem('', menuResponseWithFree)).toHaveLength(0);
            expect(filterFreeItem(undefined, menuResponseWithFree)).toHaveLength(0);
            expect(filterFreeItem(undefined, [])).toHaveLength(0);
        });
    });

    describe('getDataForRepeatAddOn Testing', () => {
        test('getDataForRepeatAddOn', () => {
            expect(getDataForRepeatAddOn(repeatAddonData, 28175865)).toEqual(repeatAddonData[0]);
            expect(getDataForRepeatAddOn([], 28175865)).toEqual(null);
            expect(getDataForRepeatAddOn([], '')).toEqual(null);
        });
    });

    describe('containsItemWithCouponNotApplied Testing', () => {
        test('containsItemWithCouponNotApplied', () => {
            expect(containsItemWithCouponNotApplied(cartItem)).toBe(false);
            expect(containsItemWithCouponNotApplied(newCartItem)).toBe(false);
            expect(containsItemWithCouponNotApplied(cartItemsArray)).toBe(true);
            expect(containsItemWithCouponNotApplied([])).toBe(false);
            expect(containsItemWithCouponNotApplied(undefined)).toBe(false);
        });
    });

    describe('extractPreOrderInfofromStoreResponse Testing', () => {
        test('extractPreOrderInfofromStoreResponse', () => {
            expect(extractPreOrderInfofromStoreResponse(storeConfig)).toEqual(storeConfig.preorder_hours);
            expect(extractPreOrderInfofromStoreResponse([])).toEqual(null);
            expect(extractPreOrderInfofromStoreResponse(undefined)).toEqual(null);
        });
    });

    describe('isWalletPaymentApplicableForBasket Testing', () => {
        test('isWalletPaymentApplicableForBasket', () => {
            expect(isWalletPaymentApplicableForBasket(basketResponse)).toEqual(false);
            expect(isWalletPaymentApplicableForBasket([])).toEqual(true);
            expect(isWalletPaymentApplicableForBasket(undefined)).toEqual(true);
        });
    });

    describe('isSavedCardAvailable', () => {
        test('isSavedCardAvailable', () => {
            expect(
                isSavedCardAvailable({
                    storeConfigCardPayment: storeConfig?.card_payment,
                    savedCardDetails: savedCardDetails,
                    selectedOrderType: ORDER_TYPE.DELIVERY
                })
            ).toBe(true);
            expect(
                isSavedCardAvailable({
                    storeConfigCardPayment: storeConfig?.card_payment,
                    savedCardDetails: [],
                    selectedOrderType: ORDER_TYPE.DELIVERY
                })
            ).toBe(false);
            expect(
                isSavedCardAvailable({
                    storeConfigCardPayment: storeConfig?.card_payment,
                    savedCardDetails: savedCardDetails,
                    selectedOrderType: ORDER_TYPE.COLLECTION
                })
            ).toBe(false);
            expect(
                isSavedCardAvailable({
                    storeConfigCardPayment: [],
                    savedCardDetails: savedCardDetails,
                    selectedOrderType: ORDER_TYPE.COLLECTION
                })
            ).toBe(false);
            expect(
                isSavedCardAvailable({
                    storeConfigCardPayment: [],
                    savedCardDetails: [],
                    selectedOrderType: ''
                })
            ).toBe(false);
            expect(
                isSavedCardAvailable({
                    storeConfigCardPayment: []
                })
            ).toBe(false);
        });
    });

    describe('formatReceiptDetails Testing', () => {
        test('formatReceiptDetails', () => {
            expect(
                formatReceiptDetails('<message_value>% Descuento en línea"\n', {
                    message_value: 20,
                    placeholder: undefined,
                    errorValue: undefined
                })
            ).toEqual('20% Descuento en línea"\n');
            expect(
                formatReceiptDetails('Ordene <errorValue> más para paga', {
                    message_value: undefined,
                    placeholder: undefined,
                    errorValue: '£6.50'
                })
            ).toEqual('Ordene £6.50 más para paga');
            expect(
                formatReceiptDetails('Ordene <errorValue> más para paga', {
                    message_value: undefined,
                    placeholder: undefined,
                    errorValue: undefined
                })
            ).toEqual('Ordene <errorValue> más para paga');
            expect(
                formatReceiptDetails('Ordene <errorValue> más para paga', {
                    message_value: undefined,
                    placeholder: '£6.50',
                    errorValue: undefined
                })
            ).toEqual('Ordene <errorValue> más para paga');
            expect(
                formatReceiptDetails('', {
                    message_value: undefined,
                    placeholder: undefined,
                    errorValue: undefined
                })
            ).toEqual('');
        });
    });

    describe('translateLabels Testing', () => {
        test('translateLabels', () => {
            expect(
                translateLabels(
                    {
                        label: '10% Discount (Collection)',
                        value: '1.35',
                        message: '<message_value>% Discount (Collection)',
                        message_value: '10'
                    },
                    'en',
                    '<message_value>% Descuento (Cobrar)'
                )
            ).toEqual({
                label: '10% Discount (Collection)',
                value: '1.35',
                message: '<message_value>% Discount (Collection)',
                message_value: '10'
            });
            expect(
                translateLabels(
                    {
                        label: 'Sub Total',
                        value: '13.50'
                    },
                    'zh',
                    'Total parcial'
                )
            ).toEqual({ label: 'Total parcial', value: '13.50' });
            expect(
                translateLabels(
                    {
                        label: 'Sub Total',
                        value: '13.50'
                    },
                    '',
                    'Total parcial'
                )
            ).toEqual({
                label: 'Sub Total',
                value: '13.50'
            });
            expect(
                translateLabels(
                    {
                        label: '10% Discount (Collection)',
                        value: '1.35',
                        message: '<message_value>% Discount (Collection)',
                        message_value: '10'
                    },
                    'zh',
                    '<message_value>% Descuento (Cobrar)'
                )
            ).toEqual({
                label: '10% Descuento (Cobrar)',
                value: '1.35',
                message: '<message_value>% Discount (Collection)',
                message_value: '10'
            });
            expect(translateLabels(undefined, undefined, undefined)).toEqual(undefined);
            expect(translateLabels(null, null, null)).toEqual(null);
            expect(translateLabels('', '', '')).toEqual('');
        });
    });

    describe('translateWarnErrors Testing', () => {
        test('translateWarnErrors', () => {
            expect(
                translateWarnErrors(
                    [
                        {
                            errorCode: '4000',
                            errorMessage: 'Order <errorValue> more to checkout',
                            errorValue: '£6.50'
                        }
                    ],
                    false
                )
            ).toEqual('Ordene £6.50 más para paga');
            expect(
                translateWarnErrors(
                    [
                        {
                            errorCode: '4000',
                            errorMessage: 'Order <errorValue> more to checkout',
                            errorValue: '£6.50'
                        }
                    ],
                    true
                )
            ).toEqual('');
            expect(translateWarnErrors([], false)).toEqual('');
            expect(translateWarnErrors([], true)).toEqual('');
            expect(translateWarnErrors(null, null)).toEqual('');
            expect(translateWarnErrors({}, {})).toEqual('');
            expect(translateWarnErrors(undefined, undefined)).toEqual('');
        });
    });

    describe('getTopTwoRecommendations Testing', () => {
        test('getTopTwoRecommendations', () => {
            expect(getTopTwoRecommendations(menuResponse)).toHaveLength(1);
            expect(getTopTwoRecommendations(cartItemsArray)).toHaveLength(2);
            expect(getTopTwoRecommendations([])).toEqual([]);
            expect(getTopTwoRecommendations(undefined)).toEqual([]);
            expect(getTopTwoRecommendations(null)).toEqual([]);
        });
    });

    describe('formBasketRecommendation Testing', () => {
        test('formBasketRecommendation', () => {
            expect(formBasketRecommendation([], [])).toEqual([]);
            expect(formBasketRecommendation(null, null)).toEqual(null);
            expect(formBasketRecommendation(undefined, undefined)).toEqual(null);
            expect(formBasketRecommendation([], cartItemsArray)).toEqual([]);
            expect(formBasketRecommendation(cartItemsArray, [])).toEqual([]);
            expect(formBasketRecommendation(menuResponse, cartItemsArray)).toEqual([]);
            expect(formBasketRecommendation(recommendationArray, cartItemsArray)).toHaveLength(2);
        });
    });

    describe('handleBestSellingAsRecommendations Testing', () => {
        test('handleBestSellingAsRecommendations', () => {
            expect(handleBestSellingAsRecommendations(undefined, undefined)).toEqual([]);
            expect(handleBestSellingAsRecommendations(null, null)).toEqual([]);
            expect(handleBestSellingAsRecommendations([], [])).toEqual([]);
            expect(handleBestSellingAsRecommendations([], cartItemsArray)).toEqual([]);
            expect(handleBestSellingAsRecommendations(recommendationArray, [])).toHaveLength(2);
            expect(handleBestSellingAsRecommendations(recommendationArray, cartItemsArray)).toHaveLength(2);
        });
    });

    describe('isExpiredBasket Testing', () => {
        test('isExpiredBasket', () => {
            expect(isExpiredBasket('', DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(false);
            expect(isExpiredBasket(null, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(true);
            expect(isExpiredBasket(undefined, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(true);
            expect(isExpiredBasket('2022-04-01 12:07:27', DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(true);
            expect(isExpiredBasket('2022-04-04 12:07:27', DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(true);
            expect(isExpiredBasket('2022-04-06 12:07:27', DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(false);
            expect(isExpiredBasket('2022-04-07 12:07:27', DATE_FORMAT.YYYY_MM_DD_HH_MM_SS)).toBe(false);
        });
    });

    describe('customDriverTips Testing', () => {
        test('customDriverTips', () => {
            expect(formatTipValue('23.00')).toEqual('23.00');
            expect(formatTipValue('0.00')).toEqual('0.00');
            expect(formatTipValue('2333')).toEqual('23');
            expect(formatTipValue('.888')).toEqual('0.88');
            expect(formatTipValue('dd')).toEqual(undefined);
            expect(formatTipValue(null)).toEqual('');
            expect(formatTipValue(undefined)).toEqual('');
            expect(formatTipValue('')).toEqual('');
        });
    });

    describe('isAdvancedDiscount Testing', () => {
        test('isAdvancedDiscount', () => {
            expect(isAdvancedDiscount(CONSTANTS.ENABLED)).toBe(false);
            expect(isAdvancedDiscount('')).toBe(false);
            expect(isAdvancedDiscount(undefined)).toBe(false);
            expect(isAdvancedDiscount(null)).toBe(false);
            expect(isAdvancedDiscount(CONSTANTS.ADVANCED)).toBe(true);
        });
    });

    describe('isOnlineDiscountApplied Testing', () => {
        test('isOnlineDiscountApplied', () => {
            expect(isOnlineDiscountApplied({})).toBe(false);
            expect(isOnlineDiscountApplied(orderResponse)).toBe(true);
        });
    });

    describe('isNotSameStore Testing', () => {
        test('isNotSameStore', () => {
            expect(isNotSameStore({}, {})).toBe(true);
            expect(isNotSameStore('', '')).toBe(false);
            expect(isNotSameStore(undefined, undefined)).toBe(false);
            expect(isNotSameStore(null, null)).toBe(false);
            expect(isNotSameStore(storeConfig.id, storeConfig.id)).toBe(false);
            expect(isNotSameStore(storeConfig.id, '8743893')).toBe(true);
        });
    });

    describe('isSameStore Testing', () => {
        test('isSameStore', () => {
            expect(isSameStore(storeConfig.id, storeConfig.id)).toBe(true);
            expect(isSameStore(storeConfig.id, '8997947')).toBe(false);
            expect(isSameStore({})).toBe(false);
            expect(isAdvancedDiscount(undefined)).toBe(false);
            expect(isAdvancedDiscount(null)).toBe(false);
            expect(isAdvancedDiscount('')).toBe(false);
        });
    });

    describe('isThirdPartyDriverEnabled Testing', () => {
        test('isThirdPartyDriverEnabled', () => {
            expect(isThirdPartyDriverEnabled(ORDER_TYPE.DELIVERY, CONSTANTS.SKIP_CART)).toBe(true);
            expect(isThirdPartyDriverEnabled(ORDER_TYPE.DELIVERY, 'T2SDRIVER')).toBe(false);
            expect(isThirdPartyDriverEnabled(ORDER_TYPE.COLLECTION, CONSTANTS.SKIP_CART)).toBe(false);
            expect(isThirdPartyDriverEnabled('', '')).toBe(false);
            expect(isThirdPartyDriverEnabled(undefined, undefined)).toBe(false);
            expect(isThirdPartyDriverEnabled(null, null)).toBe(false);
        });
    });

    describe('getReplaceTextForOtherLanguages Testing', () => {
        test('getReplaceTextForOtherLanguages', () => {
            expect(getReplaceTextForOtherLanguages('')).toBe('');
            expect(getReplaceTextForOtherLanguages(REPLACE_TEXT.DISCOUNT)).toBe(LOCALIZATION_STRINGS.DISCOUNT);
            expect(getReplaceTextForOtherLanguages(REPLACE_TEXT.SALES_TAX)).toBe(LOCALIZATION_STRINGS.SALES_TAX);
            expect(getReplaceTextForOtherLanguages(ORDER_TYPE.COLLECTION)).toBe('');
            expect(getReplaceTextForOtherLanguages(undefined)).toBe('');
            expect(getReplaceTextForOtherLanguages(null)).toBe('');
        });
    });

    describe('getCouponType Testing', () => {
        test('getCouponType', () => {
            expect(getCouponType()).toBe(null);
            expect(getCouponType(null)).toBe(null);
            expect(getCouponType('')).toBe(null);
            expect(getCouponType('5 % online discount')).toBe('PERCENT');
            expect(getCouponType('hi %')).toBe('PERCENT');
            expect(getCouponType('05.00')).toBe('AMOUNT');
            expect(getCouponType(10)).toBe('AMOUNT');
        });
    });
});
