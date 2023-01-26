import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';

export const CHECKOUT_PAYMENT_TYPE = {
    GOOGLE_PAY: 'googlepay',
    APPLE_PAY: 'applepay'
};

export const CHECKOUT_STATUS = {
    AUTHORIZED: 'Authorized',
    APPROVED: 'Approved',
    PENDING: 'Pending',
    DECLINED: 'Declined'
};

export const SCREEN_NAME = {
    QUICK_CHECKOUT_SCREEN: 'QuickCheckout',
    QUICK_CHECKOUT_DETAIL_SCREEN: 'QuickCheckout_Details',
    QC_DETAILS_DELIVERY_ADDRESS_SCREEN: 'QuickCheckout_delivery_address_screen',
    PBL_PAGE_PAYMENT: 'PayByLink'
};
export const CONSTANTS = {
    YES: 'YES',
    NO: 'NO',
    ENABLED: 'ENABLED',
    IMMEDIATELY: 'IMMEDIATELY',
    PRE_ORDER: 'PRE ORDER',
    SKIP_CART: 'SKIPCART',
    ADVANCED: 'ADVANCED',
    FALCON_DELIVERY: 'FALCON_DELIVERY',
    TRUE: 'TRUE',
    DISABLED: 'DISABLED'
};
export const VIEW_ID = {
    QC_DELIVERY: 'Add_address',
    QC_DETAILS_DELIVERY_ADDRESS: 'QCDetails_Delivery_Address',
    QC_GET_IT: 'Get_it_by',
    QC_GET_IT_RADIO: 'Radio_get_it_by',
    QC_WALLET_CHECKBOX: 'Payment_wallet_checkbox',
    QC_WALLET: 'Payment_wallet,',
    QC_CARD_RADIO: 'Payment_card_radio',
    QC_NEW_CARD_RADIO: 'Payment_new_card_radio',
    QC_LIST_CARD_ITEM_RADIO: 'Payment_list_card_item_radio',
    QC_CARD: 'Payment_card,',
    QC_NEW_CARD: 'Payment_new_card,',
    QC_LIST_CARD_ITEM: 'Payment_list_card_item,',
    QC_CASH_RADIO: 'Payment_card_radio',
    QC_APPLE_PAY_RADIO: 'Payment_apple_pay_radio',
    QC_GOOGLE_PAY_RADIO: 'Payment_google_pay_radio',
    QC_CASH: 'Payment_cash',
    QC_APPLE_PAY: 'Payment_apple_pay',
    QC_GOOGLE_PAY: 'Payment_google_pay',
    QC_APPLE_ICON: 'apple_icon',
    QC_GOOGLE_ICON: 'g_icon',
    QC_PAY: 'pay',
    QC_SUBTOTAL: 'sub_total',
    QC_VAT: 'vat',
    QC_DISCOUNT: 'discount',
    QC_DELIVERY_CHARGE: 'delivery_charge',
    QC_SUBTOTAL_VALUE: 'sub_total_value',
    QC_VAT_VALUE: 'vat_value',
    QC_DISCOUNT_VALUE: 'discount_value',
    QC_DELIVERY_CHARGE_VALUE: 'delivery_charge_value',
    QC_GET_IT_TITLE: 'get_it_by_title',
    QC_GET_IT_BY_VALUE: 'get_it_by_value',
    QC_GET_IT_BY_DIVIDER: 'get_it_by_divider',
    QC_COMPONENT_CONTAINER: 'qc_component_container',
    QC_DELIVERY_PRIMARY: 'qc_delivery_primary_address',
    QC_DETAILS_HEADER: 'qc_detail_header',
    QC_DETAILS_CLOSE: 'qc_detail_close',
    QC_DETAILS_BACK: 'qc_detail_back',
    QC_COMP_TOTAL_CONTAINER: 'qc_comp_total_container',
    QC_COMP_TOTAL: 'qc_comp_total',
    QC_COMP_TOTAL_VALUE: 'qc_comp_total_value',
    QC_ORDER: 'qc_order',
    QC_PAYMENT_CONTAINER: 'qc_payment_container',
    QC_PAYMENT_TITLE: 'qc_payment',
    QC_PAYMENT_VALUE: 'qc_payment_value',
    QC_DELIVERY_CONTAINER: 'qc_delivery_container',
    QC_DELIVERY_TITLE: 'qc_delivery_title',
    QC_DELIVERY_VALUE: 'qc_delivery_value',
    QC_COMP_TITLE: 'qc_title',
    QC_DELIVERY_ITEM_CONTAINER: 'delivery_item_conatiner',
    QC_ADD_ADDRESS_CONATAINER: 'add_address_conatiner',
    QC_ICON_VIEW: 'icon_view',
    QC_BUTTON_TEXT: 'button_text',
    QC_BUTTON_CONTAINER: 'button_container',
    QC_ADDRESS_RADIO_BUTTON: 'QC_ADDRESS_RADIO_BUTTON',
    SAVED_CARDS_FLAT_LIST: 'saved_card_flat_list',
    PRIMARY_CARD_TEXT: 'primary_card_text',
    CARD_DETAILS_TEXT: 'card_details_text',
    CARD_NUMBER_TEXT: 'card_number_text',
    EXPIRY_DATE_TEXT: 'expiry_date_text',
    CLOSE_ICON: 'close_icon',
    ERROR_TEXT: 'error_text',
    PRIMARY_TEXT: 'primary_text',
    ASAP_TEXT: 'asap_text',
    ASAP_RADIO: 'asap_radio',
    RADIO_BUTTON: 'radio_button',
    NEW_CARD_RADIO: 'new_card_radio',
    NO_SLOTS_AVAILABLE: 'no_slots_available',
    INFO_ICON: 'info_icon',
    CONTACT_LESS_DELIVERY_TEXT: 'contact_less_delivery_text',
    WARNING_TEXT: 'warning_text',
    CLAIM_OFFER_VIEW: 'claim_offer_view',
    CLAIM_OFFER_TEXT: 'claim_offer_text',
    TRANSACTION_FAILURE_HEADER_TEXT: 'transaction_failure_header_text',
    TRANSACTION_FAILURE_MESSAGE_TEXT: 'transaction_failure_message_text',
    SELECTED_CARD_TEXT: 'selected_card_text',
    TOTAL_AMOUNT_TEXT: 'total_amount_text',
    OTHER_PAYMENTS_BUTTON: 'other_payments_button',
    RETRY_BUTTON: 'retry_button',
    QC_CASH_NOT_APPLICABLE_FOR_DELIVERY_TEXT: 'qc_cash_not_applicable_for_delivery_text',
    QC_CASH_NOT_APPLICABLE_FOR_DELIVERY_HINT_TEXT: 'qc_cash_not_applicable_for_delivery_hint_text',
    LEGAL_AGE_DECLARATION: 'legal_age_declaration',
    UNSERVICEABLE_POSTCODE_TEXT: 'unserviceable_postcode_text'
};

export const ANALYTICS_EVENTS = {
    QC_DELIVERY_ADDRESS_SELECT: 'QuickCheckout_DeliveryAddress_select',
    DELIVERY_ADDRESS_CLICK: 'delivery_address_click',
    PAYMENT_WALLET_CLICK: 'payment_wallet_click',
    PAYMENT_CASH_CLICK: 'payment_cash_click',
    PAYMENT_APPLE_PAY_CLICK: 'payment_apple_pay_click',
    PAYMENT_CARD_CLICK: 'payment_card_click',
    DELIVERY_PAYMENT_SELECTION_CLICK: 'delivery_payment_selection_click',
    DELIVERY_ADD_ADDRESS_CLICK: 'delivery_add_address_click',
    DELIVERY_CLICK: 'delivery_click',
    PAYMENT_CLICK: 'payment_click',
    GETITBY_CLICK: 'getitby_click',
    TOATL_CLICK: 'total_click',
    PLACE_ORDER_CLICK: 'place_order_click',
    PLACE_ORDER_COMPLETE: 'place_order_complete'
};

export const QUICK_CHECKOUT_SCREEN_KEYS = {
    QC_ADDRESS: 'QC_ADDRESS',
    PAYMENT: 'PAYMENT',
    DELIVERY_TIME: 'DELIVERY_TIME',
    AMOUNT: 'AMOUNT'
};

export const QuickCheckoutScreenConfig = (
    { address, selectedDeliveryAddressIndex, payment, getItBy, getItByText, currency, total },
    renderComponent
) => [
    {
        title: LOCALIZATION_STRINGS.DELIVERY,
        selectedValue: address,
        component: renderComponent(LOCALIZATION_STRINGS.ADDRESS_LIST_MODAL_DELIVERY_ADDRESS, selectedDeliveryAddressIndex)
    },
    {
        title: LOCALIZATION_STRINGS.PAYMENT,
        selectedValue: payment,
        component: renderComponent(LOCALIZATION_STRINGS.PAYMENT, payment)
    },
    {
        title: LOCALIZATION_STRINGS.GET_IT_BY,
        selectedValue: getItByText,
        component: renderComponent(LOCALIZATION_STRINGS.WHEN_DO_WANT, getItBy)
    },
    {
        title: LOCALIZATION_STRINGS.TOTAL,
        selectedValue: currency + total,
        component: renderComponent(LOCALIZATION_STRINGS.TOTAL)
    }
];

export const PAYMENT_TYPE = {
    WALLET: 'WALLET',
    CARD_FROM_LIST: 'CARD_FROM_LIST',
    NEW_CARD: 'NEW_CARD',
    CARD: 'CARD',
    CASH: 'CASH',
    APPLE_PAY: 'APPLE_PAY',
    PARTIAL_PAYMENT: 'PARTIAL_PAYMENT',
    GOOGLE_PAY: 'GOOGLE_PAY'
};

export const CHECKBOX_CONSTANTS = {
    CHECKED: 'checked',
    UNCHECKED: 'unchecked'
};

export const LEGAL_AGE_CUISINES = {
    ALCOHOL: 'alcohol',
    TOBACCO: 'tobacco',
    CIGARETTE: 'cigarette'
};

export const LEGAL_AGE_CUISINES_ARRAY = [LEGAL_AGE_CUISINES.ALCOHOL, LEGAL_AGE_CUISINES.TOBACCO, LEGAL_AGE_CUISINES.CIGARETTE];

export const TRANSACTION_FAILURE_CODE = {
    AVS_MISSING: 1005,
    EXCEEDS_AMOUNT: 1006,
    REDIRECT_NEW_CARD: 1010
};

export const CARD_PAYMENT_FAILED = 'CARD_PAYMENT_FAILED';
