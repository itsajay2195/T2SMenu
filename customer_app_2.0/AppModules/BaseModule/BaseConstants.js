import DeviceInfo from 'react-native-device-info';

export const SCREEN_NAME = {
    BASE_COMPONENT: 'base_component_screen'
};
export const VIEW_ID = {
    APP_BAR: 'app_bar',
    LEFT_BUTTON: 'left_action_button',
    NOTIFICATION_ICON: 'notification_icon',
    INFORMATION_ICON: 'information_icon',
    SEARCH_ICON: 'search_icon',
    CHAT_NOTIFICATION_COUNT_TEXT: 'chat_notification_count_text'
};

const DEVICE_DATA = {
    os: DeviceInfo.getModel(),
    version: DeviceInfo.getVersion()
};
export const CHECK_ORDER_TYPE = {
    ORDER_TYPE_COLLECTION: 'collection',
    ORDER_TYPE_DELIVERY: 'delivery',
    ORDER_TYPE_WAITING: 'waiting',
    ORDER_TYPE_TO: 'to'
};

export const ORDER_STATUS = {
    PENDING: '0',
    PLACED: '1',
    ACCEPTED: '2',
    COOKING: '2.5',
    SENT: '3',
    DELIVERED: '3.5',
    HIDDEN: '4',
    CANCEL_ORDER: '4.1',
    MANAGER_DELETED: '4.5',
    DELETED: '5',
    NOT_USED: '6',
    CARD_PROCESSING: 11
};

export const DEVICE = JSON.stringify(DEVICE_DATA);
export const OPT_IN = 'OPT-IN';
export const OPT_OUT = 'OPT-OUT';
export const YES = 'YES';
export const NO = 'NO';

export const APP_STORE_RATING_STATUS = {
    NOT_NOW: 'not_now',
    DONE: 'done'
};

export const COMPLETED_ORDER_STATUS = [
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.HIDDEN,
    ORDER_STATUS.MANAGER_DELETED,
    ORDER_STATUS.DELETED,
    ORDER_STATUS.NOT_USED,
    ORDER_STATUS.CANCEL_ORDER
];

export const ORDER_TYPE = {
    COLLECTION: 'collection',
    DELIVERY: 'delivery',
    BOTH: 'both',
    WAITING: 'waiting'
};

export const ORDER_TYPE_STATUS = {
    OPEN: 'open',
    CLOSED: 'closed'
};

export const ANALYTICS_EVENTS = {
    ZEN_DESK_MESSAGE_COUNT: 'zen_desk_message_count'
};

export const REPLACE_TEXT = {
    DISCOUNT: 'Discount',
    SALES_TAX: 'Sales tax'
};

export const TOGGLE_STATUS = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED'
};
