import DeviceInfo from 'react-native-device-info';

export const SCREEN_NAME = {
    PROFILE: 'Profile',
    DELIVERY_ADDRESS: 'Delivery Address',
    SAVED_CARD_DETAILS: 'Saved card details',
    REFERRAL_SCREEN: 'Referral Screen'
};

export const VIEW_ID = {
    FIRST_NAME_TEXT: 'first_name_text',
    FIRST_NAME_VIEW: 'first_name_view',
    LAST_NAME_TEXT: 'last_name_text',
    PHONE_NUMBER_TEXT: 'phone_number_text',
    PHONE_NUMBER_VIEW: 'phone_number_view',
    PHONE_NUMBER_PREFIX_TEXT: 'phone_number_prefix_text',
    EMAIL_ID_TEXT: 'email_id_text',
    SMS_TOGGLE: 'sms_toggle',
    EMAIL_TOGGLE: 'email_toggle',
    NOTIFICATIONS_TOGGLE: 'notifications_toggle',
    DELETE_ADDRESS: 'delete_address',
    DELETE_TEXT: 'delete_text',
    ADDRESS_VIEW: 'address_view',
    EDIT_ADDRESS: 'edit_address',
    NO_ADDRESS_AVAILABLE_VIEW: 'no_address_available_view',
    DELETE_ADDRESS_MODAL: 'delete_address_modal',
    DELETE_ACCOUNT_MODAL: 'delete_modal',
    OTP_TEXT_INPUT: 'otp_text_input',
    OTP_ERROR_MSG_TEXT: 'otp_error_msg_text',
    EXPORT_DATA: 'export_data',
    DELETE_ACCOUNT: 'delete_account',
    DELIVERY_ADDRESS: 'delivery_address',
    SAVED_CARD_DETAILS: 'saved_card_details',
    ADVANCED_OPTIONS: 'advanced_options',
    EXPORT_MAIL_TEXT: 'export_mail_text',
    TICK_ICON: 'tick_icon',
    DOWN_ARROW_ICON: 'down_arrow_icon',
    RIGHT_ARROW_ICON: 'right_arrow_icon',
    DELETE_ICON: 'delete_icon',
    PROMOTIONS_HEADER_TEXT: 'promotion_header_text',
    ADVANCE_OPTIONS_TEXT: 'advanced_option_header_text',
    EMAIL_TEXT: 'email_text',
    SMS_TEXT: 'sms_text',
    VERIFY_NUMBER_TEXT: 'verify_number_text',
    BACKGROUND_VIEW: 'background_view',
    ADDRESS_TEXT: 'address_text',
    DELETE_ACCOUNT_TEXT: 'delete_account_text',
    PRIMARY_CARD_TEXT: 'primary_card_text',
    CARD_DETAILS_TEXT: 'card_details_text',
    EXPIRY_DATE_TEXT: 'expiry_date_text',
    NO_CARD_TEXT: 'no_card_text',
    SAVED_CARDS_HEADER: 'saved_cards_header',
    SAVED_CARDS_FLAT_LIST: 'saved_card_flat_list',
    PLUS: 'plus',
    APP_NOTIFICATION_TEXT: 'app Notification',
    PRIMARY_ADDRESS_TEXT: 'primary_address_text',
    REFERRAL_LINK_VIEW: 'referral_link_view',
    NO_REFERRAL_VIEW: 'no_referral_view',
    REFERRAL_LINK_VIEW_HEADER: 'referral_link_view_header',
    COPY_BUTTON: 'copy_button',
    COPY_TEXT: 'copy_text',
    REFERRAL_INFO_TEXT: 'referral_info_text',
    SHARE_LINK_TEXT: 'share_link_text',
    MORE_WAYS_TO_SHARE_TEXT: 'more_ways_to_share_text',
    SHARE_MESSAGE_BUTTON: 'share_message_button',
    SHARE_WHATSAPP_BUTTON: 'share_whatsapp_button',
    SHARE_OPTION_BUTTON: 'share_option_button',
    SHARE_MESSAGE_TEXT: 'share_message_text',
    SHARE_WHATSAPP_TEXT: 'share_whatsapp_text',
    SHARE_OPTION_TEXT: 'share_option_text',
    SHARE_MESSAGE_IMAGE: 'share_message_image',
    SHARE_WHATSAPP_IMAGE: 'share_whatsapp_image',
    SHARE_OPTION_IMAGE: 'share_option_image',
    NOTIFICATIONS_LIST_ITEM: 'notifications_list_item'
};

const deviceInfo = {
    os_Info: DeviceInfo.getVersion(),
    platform: DeviceInfo.getModel()
};
``;
const deviceData = {
    os: DeviceInfo.getModel(),
    version: DeviceInfo.getVersion()
};

export const ProfileConstants = {
    EMAIL: 'Email',
    SMS: 'SMS',
    DEVICE: JSON.stringify(deviceData),
    DEVICE_INFO: JSON.stringify(deviceInfo),
    EXPORT: 'EXPORT',
    DELETE: 'DELETE',
    SMS_POLICY_KEY: 'is_subscribed_sms',
    EMAIL_POLICY_KEY: 'is_subscribed_email',
    TOGGLE_SUBSCRIPTION_YES: 'YES',
    TOGGLE_SUBSCRIPTION_NO: 'NO',
    PLUS: '+',
    APP_NOTIFICATION: 'App_notifiation',
    NOTIFICATION_POLICY_KEY: 'is_subscribed_notification',
    NONAME: 'NoName'
};

export const DeliveryAddressConstants = {
    YES: 'YES'
};

export const PAYMENT_METHOD = {
    OPTOMANY: 'OPTOMANY'
};

export const SAVED_CARD_FROM_SCREEN = {
    PROFILE: 'profile',
    CART: 'cart'
};
