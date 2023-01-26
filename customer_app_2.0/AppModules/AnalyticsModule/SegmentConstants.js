export const SEGMENT_EVENTS = {
    // login
    APP_OPEN: 'app_open',
    LOGIN_SUCCESS: 'login',
    SIGN_OUT: 'sign_out',
    SIGN_UP_STARTED: 'signup_started',
    SIGN_UP_SUCCESS: 'sign_up',
    SIGN_UP_FAIL: 'signup_fail',
    // takeaway list
    ADDRESS_SEARCHED: 'search_takeaway',
    ADDRESS_SEARCH_FAILED: 'search_takeaway_failed',
    ADDRESS_SEARCH_SUCCESS: 'search_takeaway_success',
    ADDED_TO_FAVOURITES: 'added_to_favourites',
    REMOVED_FROM_FAVOURITES: 'removed_from_favourites',
    TAKEAWAY_SELECT: 'takeaway_select',

    BEGIN_CHECKOUT: 'begin_checkout',
    REMOVE_ITEM: 'remove_from_cart',
    ADD_ITEM: 'add_to_cart',
    TA_SEARCH: 'restaurant_searched',
    SCREEN_VIEW: 'selected_screen_view',
    COUPON_APPLIED: 'coupon_applied',
    ORDER_PLACED: 'purchase',
    HOME_ADDRESS_CHANGE: 'home_address_changed',
    NEW_COUPON_ADDED: 'new_coupon_added',
    RATE_APP: 'rate_app_clicked',
    VIEW_INFO: 'view_info_visited',
    REVIEW_PAGE_VIEWED: 'view_reviews_visited',
    TA_CALLED: 'restaurant_called',
    TA_REVIEWED: 'restaurant_reviewed',
    CASH_ORDER_CONFIRMATION_FAIL: 'cash_order_confirmation_fail',
    CARD_ORDER_CONFIRMATION_FAIL: 'card_order_confirmation_fail',
    WALLET_ORDER_CONFIRMATION_FAIL: 'wallet_order_confirmation_fail',
    PARTIAL_ORDER_CONFIRMATION_FAIL: 'partial_order_confirmation_fail',
    NEW_CARD_PAYMENT_ORDER_CONFIRMATION_FAIL: 'new_payment_order_confirmation_fail',
    CARD_ORDER_FAILED_INVALID_CCV_NUMBER: 'card_order_failed_invalid_ccv_number',
    CARD_ORDER_FAILED: 'card_order_failed',
    APPLE_PAY_ORDER_FAILED: 'apple_pay_order_failed',
    ANDROID_PAY_ORDER_FAILED: 'android_pay_order_failed',
    ANDROID_PAY_CARD_DECLINED: 'android_pay_order_card_declined',
    APPLE_PAY_CARD_DECLINED: 'apple_pay_order_card_declined',
    DISLIKE_TAKEAWAY_ORDER: 'dislike_takeaway_order',
    THUMBS_DOWN_CLICKED: 'thumbs_down_clicked',

    UPDATED_PROFILE_DETAILS: 'updated_profile_details',
    HELP_CLICKED: 'help_clicked',
    COUPON_REMOVED: 'coupon_removed',
    COUPON_NOT_APPLIED: 'coupon_not_applied',
    EMAIL_OPT_IN_UPDATED: 'email_opt_in_changed',
    SMS_OPT_IN_UPDATED: 'sms_opt_in_changed',
    PUSH_PREFERENCE_CHANGED: 'push_preference_changed',
    //attributes
    PREVIOUS_ORDER: 'previous_orders',
    FAVOURITE_LIST: 'favourite_list',
    SAVED_CARDS: 'saved_cards',

    LAST_ORDER_DATE: 'date_of_last_order',

    //extra
    BASKET_CREATION: 'basket_creation',
    EXISTING_USER_MIGRATION: 'existing_user_migration',
    DELETE_ACCOUNT: 'delete_account',
    UPDATE_PAYMENT_MODE: 'update_payment_mode',
    PAYMENT_PAGE: 'payment_page'
};

export const SEGMENT_CONSTANTS = {
    MOBILE: 'Mobile',
    EMAIL: 'email',
    COLLECTION: 'collection',
    LOGIN: 'login',
    SIGNUP: 'signup',
    EXISTING_USER: 'existing_user',
    NONE: 'NONE',
    ADD: 'add',
    REMOVE: 'remove',
    EMAIL_UNSUBSCRIBE: 'moe_unsubscribe',
    EMAIL_OPT: 'email_opt_in',
    PUSH_NOTIFICATION_SUBSCRIBE: 'push_preference',
    SMS_OPT: 'sms_opt_in',
    HOME_CITY: 'locality',
    COUNTRY: 'country_code',
    LANGUAGE: 'language',
    CREATED_TIME: 'created_time',
    POSTCODE: 'postcode',
    LOCATION: 'location',
    AREA: 'area'
};

export const SEGMENT_STRINGS = {
    TAKEAWAY_LIST: 'Takeaway List',
    RECENT_TAKEAWAY: 'Recent Takeaway',
    INVALID_POSTCODE: 'not valid postcode',
    INVALID_AREA: 'not valid area',
    NO_TAKEAWAY_FOUND_POSTCODE: 'No Takeaway for the postcode',
    NO_TAKEAWAY_FOUND_AREA: 'No Takeaway for the area',
    QUICK_CHECKOUT: 'Quick Checkout',
    USER_CANCEL: 'User declined from payment gateway',
    PLACED: 'Placed',
    SUCCESSFUL: 'Successful',
    DECLINE: 'Declined',
    SUCCESS: 'success',
    FAILED: 'failed',
    MANUAL: 'manual',
    API: 'API',
    DELETE: 'DELETE',
    REORDER: 'Reorder'
};

export const SEGMENT_SCREEN_NAME = {
    TA_LIST: 'takeaway list',
    MENU: 'menu',
    REVIEW: 'review',
    TOTAL_SAVINGS: 'total_savings',
    BASKET: 'basket_view',
    APPLIED: 'applied',
    DENIED: 'denied',
    REMOVED: 'removed'
};
