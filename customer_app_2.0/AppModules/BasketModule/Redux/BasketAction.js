import { BASKET_TYPE } from './BasketType';

//TODO We should pass more info as object so construct the object and send as data object
// {
// 	"quantity": "1",
// 	"sequence": "1",
//  "addon": json string
// }

export const addOrRemoveItemToBasketAction = (
    id,
    quantity,
    quantityType,
    item,
    fromBasket,
    addOns = undefined,
    repeatAddOnType = undefined,
    fromFreeItems = false,
    fromBasketRecommendation = false
) => {
    return {
        type: BASKET_TYPE.ADD_REMOVE_ITEM_TO_BASKET,
        id,
        quantity,
        quantityType,
        item,
        fromBasket,
        addOns,
        repeatAddOnType,
        fromFreeItems,
        fromBasketRecommendation
    };
};

//TODO We should pass more info as object so construct the object and send as data object
// {
// 	"longitude": "-2.234739",
// 	"phone": "09876565788",
// 	"email": "deeban.s@touch2success.com",
// 	"redeem": "0",
// 	"firstname": "deeban",
// 	"device": "mobile",
// 	"houseno": "12",
// 	"lastname": "chakravarthi",
// 	"browser": "8.1",
// 	"address1": "Portland Street",
// 	"latitude": "53.480507",
// 	"notify_token": "fdR8K_Qqt98:APA91bH-XVOH4EeS8A1594cBgYW1dnMc_Ah90GVHao2J_1lLyrApW-I6lUe9CSRbyud9y5g07kURJe1ddKcKXM9F5jBnKrKOkFwXgYJ9JX8GS_3vdr4m9S6T4mnEU4iwQqSK6MCiqbiV",
// 	"address2": "Manchester",
// 	"customers_id": "70357027",
// 	"flat": "123",
// 	"coupon_code": "",
// 	"os": "Simulator 13.3",
// 	"postcode": "M1 3BE",
// 	"sending": "to"
// }
export const updateBasketAction = (updateType, allergyInfo, coupon, newBasketId = undefined) => {
    return {
        type: BASKET_TYPE.UPDATE_BASKET,
        updateType,
        allergyInfo,
        coupon,
        newBasketId
    };
};

export const lookupLoyaltyPointsAction = () => {
    return {
        type: BASKET_TYPE.LOOKUP_LOYALTY_POINTS
    };
};

export const lookupCouponAction = (coupon, storeID, isAdvanceCoupon) => {
    return {
        type: BASKET_TYPE.LOOKUP_COUPON,
        coupon,
        storeID,
        isAdvanceCoupon
    };
};
export const applyRedeemAction = (canRedeem) => {
    return {
        type: BASKET_TYPE.APPLY_REDEEM,
        canRedeem
    };
};
export const isRedeemAppliedStatus = (redeem) => {
    return {
        type: BASKET_TYPE.UPDATE_REDEEM,
        redeem
    };
};
export const deleteItemAction = (item) => {
    return {
        type: BASKET_TYPE.DELETE_ITEM_BASKET,
        item
    };
};
export const networkErrorBasketUpdateAction = (elements) => {
    return {
        type: BASKET_TYPE.HANDLE_NETWORK_UPDATE_BASKET,
        elements
    };
};
export const repeatAddOnAction = (isVisible) => {
    return {
        type: BASKET_TYPE.REPEAT_ADD_ON_DIALOG_VISIBILITY,
        isVisible
    };
};

export const updateLastAddOnItemAction = (quantity, id, addOnCatID, reOrderAddOns = undefined, reOrderMenuItem = undefined) => {
    return {
        type: BASKET_TYPE.UPDATE_LAST_ADD_ON_ITEM,
        quantity,
        id,
        addOnCatID,
        reOrderAddOns,
        reOrderMenuItem
    };
};

export const editFromBasketAction = (isVisible) => {
    return {
        type: BASKET_TYPE.EDIT_FROM_BASKET_ACTION,
        isVisible
    };
};

export const setContactFreeAction = (isContactFree) => {
    return {
        type: BASKET_TYPE.SET_CONTACT_FREE,
        isContactFree
    };
};

export const setOrderInstructionsAction = (instructions) => {
    return {
        type: BASKET_TYPE.SET_ORDER_INSTRUCTIONS,
        instructions
    };
};

export const deleteCartAction = (obj = {}) => {
    return {
        type: BASKET_TYPE.DELETE_CART,
        orderId: obj.orderId ?? undefined,
        storeID: obj.storeID ?? undefined,
        navigation: obj.navigation ?? undefined,
        sending: obj.sending ?? undefined,
        isFromReOrder: obj.isFromReOrder ?? undefined,
        basketStoreID: obj.basketStoreID ?? undefined
    };
};
export const fromReOrderScreenAction = (payload) => {
    return {
        type: BASKET_TYPE.FROM_RE_ORDER_ACTION,
        payload
    };
};

export const getPreOrderDates = () => {
    return {
        type: BASKET_TYPE.GET_PRE_ORDER_DATES
    };
};

export const setPreOrderDate = (preOrderDate, isPreOrderASAP = false) => {
    return {
        type: BASKET_TYPE.SET_PRE_ORDER_DATE,
        preOrderDate,
        isPreOrderASAP
    };
};

export const makeCashOrder = () => {
    return {
        type: BASKET_TYPE.MAKE_CASH_ORDER
    };
};
export const resetBasket = () => {
    return {
        type: BASKET_TYPE.RESET_BASKET
    };
};
export const setResetToHome = (payload) => {
    return {
        type: BASKET_TYPE.NAVIGATION_RESET_TO_HOME_FROM_BASKET,
        payload
    };
};

export const resetErrorResponseForCoupon = () => {
    return {
        type: BASKET_TYPE.LOOKUP_COUPON_RESET_ERROR_RESPONSE
    };
};
export const updateUserPaymentMode = (selectedPaymentMode) => {
    return {
        type: BASKET_TYPE.UPDATE_USER_PAYMENT_MODE,
        user_payment_mode: selectedPaymentMode
    };
};
export const removeCoupon = () => {
    return {
        type: BASKET_TYPE.REMOVE_COUPON
    };
};

export const updateUserSelectedCardId = (selectedCardId) => {
    return {
        type: BASKET_TYPE.UPDATE_USER_SELECTED_CARD_ID,
        user_selected_card_id: selectedCardId
    };
};
export const resetReOrderAddOnItemAction = () => {
    return {
        type: BASKET_TYPE.RESET_REORDER_ADD_ON_ACTION
    };
};

export const lookupAccountVerifyAction = (phone, navigation) => {
    return {
        type: BASKET_TYPE.LOOKUP_ACCOUNT_VERIFY,
        phone,
        navigation
    };
};
export const updateStoreIdIntoBasket = (storeID) => {
    return {
        type: BASKET_TYPE.UPDATE_STORE_ID_INTO_BASKET,
        payload: storeID
    };
};

export const addButtonTappedAction = (
    id,
    item,
    qty,
    incrementType,
    isFromBasketScreen,
    fromHome,
    isFromReOrder,
    fromBasketRecommendation = false,
    isFromNewMenu = false
) => {
    return {
        type: BASKET_TYPE.ADD_BUTTON_TAPPED_ACTION,
        id,
        item,
        qty,
        incrementType,
        isFromBasketScreen,
        fromHome,
        isFromReOrder,
        fromBasketRecommendation,
        isFromNewMenu
    };
};

export const paymentErrorMessageAction = (value) => {
    return {
        type: BASKET_TYPE.QC_AUTO_PAYMENT_NAVIGATION,
        value
    };
};

export const stopCartLoadingAction = () => {
    return {
        type: BASKET_TYPE.STOP_CART_LOADING
    };
};

export const fetchingBasketResponse = (isCartFetching) => {
    return {
        type: BASKET_TYPE.FETCHING_CART_RESPONSE,
        isCartFetching
    };
};
export const autoPresentQCAction = (showQC) => {
    return {
        type: BASKET_TYPE.QC_AUTO_PRESENT,
        autoPresentQC: showQC
    };
};

// Added new action to avoid multiple click on add on item.
export const addOnItemButtonTappedAction = (
    id,
    quantity,
    quantityType,
    item,
    fromBasket,
    addOns = undefined,
    repeatAddOnType = undefined,
    fromFreeItems = false,
    fromBasketRecommendation = false
) => {
    return {
        type: BASKET_TYPE.ADD_ON_ITEM_BUTTON_TAPPED_ACTION,
        id,
        quantity,
        quantityType,
        item,
        fromBasket,
        addOns,
        repeatAddOnType,
        fromFreeItems,
        fromBasketRecommendation
    };
};

export const getLoyaltyTransactions = () => {
    return {
        type: BASKET_TYPE.GET_LOYALTY_TRANSACTIONS
    };
};

export const updateFreeItemClickAction = (freeItemClicked = false) => {
    return {
        type: BASKET_TYPE.UPDATE_FREE_ITEM_CLICKED,
        freeItemClicked
    };
};
export const removeBasketRecommendationItem = (id) => {
    return {
        type: BASKET_TYPE.REMOVE_BASKET_RECOMMENDATION_ITEM,
        id
    };
};
export const recommendationAddedFromBasketAction = (fromBasket = false) => {
    return {
        type: BASKET_TYPE.BASKET_RECOMMENDATION_ADDED_FROM_BASKET,
        fromBasket
    };
};
export const makeChangeAction = (orderType, value = false) => {
    return {
        type: BASKET_TYPE.CHANGE_API_ACTION,
        orderType,
        value
    };
};

export const updateBasketId = (basketID) => {
    return {
        type: BASKET_TYPE.UPDATE_BASKET_ID,
        basketID
    };
};

export const resetNewBasketResponse = () => {
    return {
        type: BASKET_TYPE.RESET_BASKET_NEW_RESPONSE
    };
};

export const resetCardTransactionAction = () => {
    return {
        type: BASKET_TYPE.RESET_CARD_TRANSACTION_FAILURE
    };
};

export const showHideRetryPaymentLoader = (value) => {
    return {
        type: BASKET_TYPE.SHOW_HIDE_RETRY_PAYMENT_LOADER,
        payload: value
    };
};

export const updateCartOnFocusAction = () => {
    return {
        type: BASKET_TYPE.UPDATE_GIFT_ITEM_ACTION
    };
};

export const setOrderTypeLoader = (value) => {
    return {
        type: BASKET_TYPE.SET_ORDER_TYPE_CHANGE_LOADER,
        value: value
    };
};

export const updateDriverTips = (value, selectedPaymentMode = null) => {
    return {
        type: BASKET_TYPE.UPDATE_DRIVER_TIPS,
        driverTips: value,
        paymentMode: selectedPaymentMode
    };
};

export const selectedDriverTipsItem = (item, itemIndex) => {
    return {
        type: BASKET_TYPE.SELECTED_DRIVER_TIPS_ITEM,
        payload: { item: item, itemIndex: itemIndex }
    };
};
