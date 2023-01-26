import { BASKET_TYPE } from './BasketType';
import {
    extractPreOrderInfofromStoreResponse,
    getDefaultPaymentMode,
    handleAddOnItem,
    handleItemsFromReorder,
    handleItemsInTheCart,
    handleNetworkErrorItems,
    handleSwipeToDeleteItem,
    removeResourceID
} from '../Utils/BasketHelper';
import { ORDER_MANAGEMENT_TYPE } from '../../OrderManagementModule/Redux/OrderManagementType';
import { CONSTANTS, PAYMENT_TYPE } from '../../QuickCheckoutModule/Utils/QuickCheckoutConstants';
import { APP_ACTION_TYPE, TYPES_CONFIG } from '../../../CustomerApp/Redux/Actions/Types';

import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { QC_ACTION_TYPE } from '../../QuickCheckoutModule/Redux/QuickCheckoutType';
import { getCartItemsFromBasketResponse } from '../../MenuModule/Utils/MenuHelpers';
import { getCurrentDateTime } from 't2sbasemodule/Utils/DateUtil';

const INITIAL_STATE = {
    createBasketResponse: null,
    viewBasketResponse: null,
    lookupLoyaltyPointsResponse: null,
    loyaltyTransactions: null,
    lookupCouponResponse: null,
    isLookupCouponErrorResponse: false,
    paymentLinkResponse: null,
    resourceIDs: [],
    cartItems: [],
    sequence: 0,
    networkErrorItems: [],
    payment_mode: PAYMENT_TYPE.CASH,
    user_payment_mode: null,
    user_selected_card_id: null,
    contactFreeDelivery: false,
    orderInstructions: '',
    basketIDProgress: false,
    repeatAddOn: {
        visibility: false,
        items: [],
        selectedID: null,
        editFromBasketPopup: false,
        reOrderAddons: [],
        reOrderMenuItem: null
    },
    fromReOrderScreen: false,
    preOrderDates: null,
    restart: false,
    isPreOrder: CONSTANTS.IMMEDIATELY,
    resetToHome: false,
    lookupCouponErrorResponse: null,
    couponApplied: null,
    storeID: null,
    showVerifyCVV: false,
    showMissingItem: false,
    inValidCvvErrorMsg: null,
    CVV: undefined,
    showOrderProcessingLoader: false,
    basketLoader: false,
    isRedeemApplied: false,
    paymentErrorMessage: null,
    paymentNavigation: false,
    isCartFetching: false,
    autoPresentQC: false,
    isBasketLoading: false,
    missingItemArray: null,
    freeItemClicked: false,
    recommendation_ref_id: null,
    basketRecommendations: [],
    basketRecommendationLoader: false,
    recommendationAddedFromBasket: false,
    basketRecommendationType: null,
    changeOrderResponse: null,
    cardTransactionFailed: false,
    cardTransactionFailureMessage: '',
    showRetryPaymentLoader: false,
    isPreOrderASAP: false,
    basketCreatedAt: null,
    lastCouponValue: null,
    orderTypeLoader: false, //kept so as to wait for order type change to reflect in basket screen
    driverTips: null,
    paymentType: PAYMENT_TYPE.WALLET,
    user_selected_card: null,
    selectedDriverTips: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BASKET_TYPE.CREATE_BASKET_SUCCESS:
            return {
                ...state,
                createBasketResponse: action.payload,
                storeID: action?.storeResponse?.id,
                user_payment_mode: null,
                user_selected_card_id: null,
                showVerifyCVV: false,
                inValidCvvErrorMsg: null,
                basketCreatedAt: getCurrentDateTime()
            };
        case BASKET_TYPE.VIEW_BASKET_SUCCESS:
            return {
                ...state,
                viewBasketResponse: action.payload,
                isBasketLoading: false
            };
        case BASKET_TYPE.START_CART_LOADING:
        case BASKET_TYPE.ADD_BUTTON_TAPPED_ACTION:
            return {
                ...state,
                isBasketLoading: true
            };
        case BASKET_TYPE.STOP_CART_LOADING:
            return {
                ...state,
                isBasketLoading: false
            };
        case BASKET_TYPE.LOOKUP_LOYALTY_POINTS_SUCCESS:
            return {
                ...state,
                lookupLoyaltyPointsResponse: action.payload
            };
        case BASKET_TYPE.RESTART_AGAIN:
            return {
                ...state,
                restart: action.payload,
                showOrderProcessingLoader: false
            };
        case BASKET_TYPE.LOOKUP_COUPON_SUCCESS:
            return {
                ...state,
                lookupCouponResponse: action.payload,
                isLookupCouponErrorResponse: false,
                lookupCouponErrorResponse: null,
                couponApplied: action.payload.coupon,
                lastCouponValue: action.payload.coupon
            };
        case BASKET_TYPE.REMOVE_COUPON_CART:
            return {
                ...state,
                lastCouponValue: null
            };
        case BASKET_TYPE.LOOKUP_COUPON_FAILED:
            return {
                ...state,
                lookupCouponResponse: action.payload,
                isLookupCouponErrorResponse: true,
                lookupCouponErrorResponse: action.payload.message,
                couponApplied: null
            };
        case BASKET_TYPE.PAYMENT_LINK_SUCCESS:
            return {
                ...state,
                paymentLinkResponse: action.payload
            };
        case BASKET_TYPE.ADD_REMOVE_ITEM_TO_BASKET_SUCCESS:
            return {
                ...state,
                resourceIDs: [...state.resourceIDs, action.payload]
            };
        case BASKET_TYPE.ADD_REMOVE_ITEM_TO_BASKET:
        case BASKET_TYPE.ADD_ON_ITEM_BUTTON_TAPPED_ACTION_ADD_TO_BASKET:
            return {
                ...state,
                cartItems: handleItemsInTheCart(state.cartItems, action, state.resourceIDs)
            };
        case BASKET_TYPE.UPDATE_SEQUENCE:
            return {
                ...state,
                sequence: action.payload
            };
        case BASKET_TYPE.REMOVE_RESOURCE_ID_ACTION:
            return {
                ...state,
                resourceIDs: removeResourceID(state.resourceIDs, action)
            };
        case BASKET_TYPE.DELETE_ITEM_BASKET_SUCCESS: {
            return {
                ...state,
                cartItems: handleSwipeToDeleteItem(state.cartItems, action.payload),
                resourceIDs: state.resourceIDs.filter((item) => item.resourceID !== action.payload.id)
            };
        }
        case BASKET_TYPE.DELETE_BULK_ITEM_BASKET_SUCCESS: {
            return {
                ...state,
                cartItems: action.payload.cartItems,
                resourceIDs: action.payload.resIds
            };
        }
        case BASKET_TYPE.HANDLE_NETWORK_ERROR: {
            return {
                ...state,
                networkErrorItems: handleNetworkErrorItems(state.networkErrorItems, action.payload)
            };
        }
        case BASKET_TYPE.DELETE_NETWORK_ITEMS: {
            return {
                ...state,
                networkErrorItems: []
            };
        }
        case BASKET_TYPE.SET_CONTACT_FREE: {
            return {
                ...state,
                contactFreeDelivery: action.isContactFree
            };
        }

        case BASKET_TYPE.SET_ORDER_INSTRUCTIONS: {
            return {
                ...state,
                orderInstructions: action.instructions
            };
        }
        case BASKET_TYPE.CREATE_BASKET_PROGRESS: {
            return {
                ...state,
                basketIDProgress: action.payload
            };
        }
        case BASKET_TYPE.REPEAT_ADD_ON_DIALOG_VISIBILITY: {
            return {
                ...state,
                repeatAddOn: {
                    ...state.repeatAddOn,
                    visibility: action.isVisible
                }
            };
        }
        case BASKET_TYPE.UPDATE_LAST_ADD_ON_ITEM: {
            return {
                ...state,
                repeatAddOn: {
                    ...state.repeatAddOn,
                    selectedID: action.id,
                    quantity: action.quantity,
                    addOnCatID: action.addOnCatID,
                    reOrderAddons: isValidElement(action.reOrderAddOns) ? action.reOrderAddOns : [],
                    reOrderMenuItem: isValidElement(action.reOrderMenuItem) ? action.reOrderMenuItem : null
                }
            };
        }
        case BASKET_TYPE.ADD_LAST_ADD_ON_TO_ARRAY: {
            return {
                ...state,
                repeatAddOn: {
                    ...state.repeatAddOn,
                    items: handleAddOnItem(state.repeatAddOn.items, action.payload)
                }
            };
        }
        case BASKET_TYPE.EDIT_FROM_BASKET_ACTION: {
            return {
                ...state,
                repeatAddOn: {
                    ...state.repeatAddOn,
                    editFromBasketPopup: action.isVisible
                }
            };
        }
        case BASKET_TYPE.RESET_BASKET: {
            return INITIAL_STATE;
        }
        case ORDER_MANAGEMENT_TYPE.RE_ORDER_SUCCESS:
        case ORDER_MANAGEMENT_TYPE.UPDATE_CREATE_BASKET_RESPONSE:
            return {
                ...state,
                createBasketResponse: action.payload,
                basketCreatedAt: getCurrentDateTime()
            };

        case BASKET_TYPE.FROM_RE_ORDER_ACTION: {
            return {
                ...state,
                fromReOrderScreen: action.payload
            };
        }
        case BASKET_TYPE.UPDATE_BASKET_ITEM_WITH_NEW_RESPONSE:
        case BASKET_TYPE.UPDATE_CART_FROM_RE_ORDER: {
            let data = handleItemsFromReorder(action.payload, action.addOns);
            return {
                ...state,
                cartItems: data.cart,
                resourceIDs: data.resourceIDs,
                isCartFetching: false,
                sequence: data.sequence,
                repeatAddOn: {
                    ...state.repeatAddOn,
                    items: data.addOnItems
                }
            };
        }
        case BASKET_TYPE.REMOVE_ITEM_INSTANTLY_FROM_BASKET: {
            return {
                ...state,
                viewBasketResponse: {
                    ...state.viewBasketResponse,
                    item:
                        isValidElement(state.viewBasketResponse) && isValidElement(state.viewBasketResponse.item)
                            ? state.viewBasketResponse.item.filter((item) => item.id !== action.payload)
                            : []
                }
            };
        }
        case BASKET_TYPE.GET_PRE_ORDER_DATES_SUCCESS: {
            return {
                ...state,
                preOrderDates: action.payload
            };
        }
        case BASKET_TYPE.SET_PRE_ORDER_DATE: {
            return {
                ...state,
                isPreOrder: action.preOrderDate,
                isPreOrderASAP: action.isPreOrderASAP
            };
        }
        case BASKET_TYPE.NAVIGATION_RESET_TO_HOME_FROM_BASKET: {
            return {
                ...state,
                resetToHome: action.payload
            };
        }
        case BASKET_TYPE.LOOKUP_COUPON_RESET_ERROR_RESPONSE: {
            return {
                ...state,
                lookupCouponResponse: null,
                isLookupCouponErrorResponse: false,
                lookupCouponErrorResponse: null
            };
        }
        case BASKET_TYPE.REMOVE_COUPON: {
            return {
                ...state,
                couponApplied: null,
                lastCouponValue: null,
                lookupCouponErrorResponse: null
            };
        }
        case BASKET_TYPE.UPDATE_PAYMENT_MODE: {
            return {
                ...state,
                payment_mode: getDefaultPaymentMode(action)
            };
        }
        case BASKET_TYPE.UPDATE_USER_PAYMENT_MODE: {
            return {
                ...state,
                user_payment_mode: action.user_payment_mode,
                payment_mode: action.user_payment_mode
            };
        }
        case BASKET_TYPE.UPDATE_USER_SELECTED_CARD_ID: {
            return {
                ...state,
                user_selected_card_id: action.user_selected_card_id
            };
        }
        case BASKET_TYPE.SHOW_VERIFY_CVV: {
            return {
                ...state,
                showVerifyCVV: action.payload
            };
        }
        case BASKET_TYPE.SHOW_MISSING_ITEM_BASKET: {
            return {
                ...state,
                showMissingItem: action.payload.missing,
                missingItemArray: action.payload.missingItemArray
            };
        }
        case BASKET_TYPE.RESET_VERIFY_CVV: {
            return {
                ...state,
                showVerifyCVV: false,
                inValidCvvErrorMsg: null
            };
        }
        case BASKET_TYPE.CVV: {
            return {
                ...state,
                CVV: action.payload
            };
        }
        case BASKET_TYPE.UPDATE_STORE_ID_INTO_BASKET:
            return {
                ...state,
                storeID: action.payload
            };
        case TYPES_CONFIG.RESET_STORE_AND_ORDER_DETAILS_CONFIG:
        case TYPES_CONFIG.STORE_CONFIG_SUCCESS:
        case BASKET_TYPE.UPDATE_PREORDER_DATE:
            return {
                ...state,
                preOrderDates: extractPreOrderInfofromStoreResponse(action.payload)
            };
        case BASKET_TYPE.RESET_REORDER_ADD_ON_ACTION: {
            return {
                ...state,
                repeatAddOn: {
                    visibility: false,
                    items: [],
                    selectedID: null,
                    editFromBasketPopup: false,
                    reOrderAddons: [],
                    reOrderMenuItem: null
                }
            };
        }
        case QC_ACTION_TYPE.PROCEED_CHECKOUT_ACTION_TYPE: {
            return {
                ...state,
                showOrderProcessingLoader: true
            };
        }
        case BASKET_TYPE.BASKET_LOADER: {
            return {
                ...state,
                basketLoader: action.payload
            };
        }
        case BASKET_TYPE.UPDATE_REDEEM: {
            return {
                ...state,
                isRedeemApplied: action.redeem
            };
        }
        case BASKET_TYPE.QC_AUTO_PAYMENT_NAVIGATION: {
            return {
                ...state,
                paymentErrorMessage: action.value
            };
        }
        case BASKET_TYPE.FETCHING_CART_RESPONSE:
            return {
                ...state,
                isCartFetching: action.isCartFetching
            };
        case BASKET_TYPE.QC_AUTO_PRESENT: {
            return {
                ...state,
                autoPresentQC: action.autoPresentQC
            };
        }
        case BASKET_TYPE.CLEAR_CART_ITEMS: {
            return {
                ...state,
                cartItems: []
            };
        }
        case BASKET_TYPE.UPDATE_CART_ITEMS: {
            return {
                ...state,
                cartItems: getCartItemsFromBasketResponse(action.basketItems)
            };
        }
        case BASKET_TYPE.UPDATE_CART_ITEMS_ON_FOCUS: {
            return {
                ...state,
                cartItems: action.basketItems
            };
        }
        case BASKET_TYPE.GET_LOYALTY_TRANSACTIONS_SUCCESS:
            return {
                ...state,
                loyaltyTransactions: action.payload
            };

        case BASKET_TYPE.RESET_MISSING_ITEM_BASKET:
            return {
                ...state,
                missingItemArray: null,
                showMissingItem: false
            };

        case BASKET_TYPE.UPDATE_FREE_ITEM_CLICKED:
            return {
                ...state,
                freeItemClicked: isValidElement(action.freeItemClicked) ? action.freeItemClicked : false
            };
        case BASKET_TYPE.BASKET_RECOMMENDATION_SUCCESS:
            return {
                ...state,
                basketRecommendations: action.payload.recommendation,
                basketRecommendationType: action.payload.type,
                basketRecommendationLoader: false
            };
        case BASKET_TYPE.SET_RECOMENDATION_REF_ID:
            return {
                ...state,
                recommendation_ref_id: action.payload
            };
        case BASKET_TYPE.REMOVE_BASKET_RECOMMENDATION_ITEM:
            return {
                ...state,
                basketRecommendations: state.basketRecommendations.filter((item) => item.id !== action.id)
            };
        case BASKET_TYPE.BASKET_RECOMMENDATION_LOADING:
            return {
                ...state,
                basketRecommendationLoader: action.payload
            };
        case BASKET_TYPE.BASKET_RECOMMENDATION_ADDED_FROM_BASKET:
            return {
                ...state,
                recommendationAddedFromBasket: action.fromBasket
            };
        case BASKET_TYPE.UPDATE_BASKET_ID:
            return {
                ...state,
                createBasketResponse: {
                    ...state.createBasketResponse,
                    resource_id: action.basketID
                }
            };
        case BASKET_TYPE.CHANGE_API_ACTION_SUCCESS:
            return {
                ...state,
                changeOrderResponse: action.payload
            };
        case BASKET_TYPE.RESET_BASKET_NEW_RESPONSE:
            return {
                ...state,
                changeOrderResponse: null,
                orderTypeLoader: false
            };
        case BASKET_TYPE.CARD_TRANSACTION_FAILURE_MESSAGE: {
            return {
                ...state,
                showRetryPaymentLoader: false,
                cardTransactionFailed: true,
                cardTransactionFailureMessage: action.payload
            };
        }
        case BASKET_TYPE.RESET_CARD_TRANSACTION_FAILURE: {
            return {
                ...state,
                cardTransactionFailed: false
            };
        }
        case BASKET_TYPE.SHOW_HIDE_RETRY_PAYMENT_LOADER: {
            return {
                ...state,
                showRetryPaymentLoader: action.payload
            };
        }
        case TYPES_CONFIG.RESET_EXPIRED_BASKET: {
            return INITIAL_STATE;
        }
        case APP_ACTION_TYPE.APP_INITIAL_SETUP_ACTION: {
            //TODO Here we can reset the the required state values for retain basket flow
            return {
                ...state,
                lookupCouponResponse: null,
                isLookupCouponErrorResponse: false,
                lookupCouponErrorResponse: null,
                showOrderProcessingLoader: false
            };
        }
        case BASKET_TYPE.CHANGE_API_ACTION:
        case BASKET_TYPE.SET_ORDER_TYPE_CHANGE_LOADER: {
            return {
                ...state,
                orderTypeLoader: action.value
            };
        }
        case QC_ACTION_TYPE.CHECK_PAYMENT_STATUS: {
            return {
                ...state,
                paymentStatus: action.payload
            };
        }
        case BASKET_TYPE.SELECTED_DRIVER_TIPS_ITEM: {
            return {
                ...state,
                selectedDriverTips: action.payload
            };
        }
        case BASKET_TYPE.UPDATE_LINK_DEFAULT_PAYMENT_MODE: {
            return {
                ...state,
                paymentType: getDefaultPaymentMode(action)
            };
        }
        case BASKET_TYPE.UPDATE_PAYBY_LINK_USER_SELECTED_CARD_ID: {
            return {
                ...state,
                user_selected_card: action.user_selected_card
            };
        }
        case BASKET_TYPE.PROCEED_TO_PAYMENT_FLOW: {
            return {
                ...state,
                showOrderProcessingLoader: true
            };
        }
        default:
            return state;
    }
};
