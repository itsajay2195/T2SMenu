import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { HELP_OPTIONS_TYPE } from './SupportConstants';
export const PreviousOrderHelpData = () => {
    return [
        {
            id: 1,
            isDropDownAvailable: true,
            isChatButtonAvailable: true,
            isTakeawayButtonAvailable: true,
            type: HELP_OPTIONS_TYPE.ORDER_NOT_DELIVERED,
            title: LOCALIZATION_STRINGS.ORDER_NOT_DELIVERED
        },
        {
            id: 2,
            isDropDownAvailable: false,
            isChatButtonAvailable: false,
            isTakeawayButtonAvailable: true,
            type: HELP_OPTIONS_TYPE.MISSING_ITEMS,
            title: LOCALIZATION_STRINGS.MISSING_ITEMS
        },
        {
            id: 3,
            type: HELP_OPTIONS_TYPE.DAMAGED_ITEMS,
            isChatButtonAvailable: true,
            isTakeawayButtonAvailable: true,
            isDropDownAvailable: true,
            title: LOCALIZATION_STRINGS.DAMAGED_ITEMS
        },
        {
            id: 4,
            isChatButtonAvailable: true,
            isTakeawayButtonAvailable: false,
            isDropDownAvailable: true,
            type: HELP_OPTIONS_TYPE.REFUND_DELAYS,
            title: LOCALIZATION_STRINGS.REFUND_DELAYS
        },
        {
            id: 5,
            isDropDownAvailable: false,
            type: HELP_OPTIONS_TYPE.SOME_THINGS_ELSE,
            title: LOCALIZATION_STRINGS.SOME_THINGS_ELSE_TEXT
        }
    ];
};

export const CancelOrderReasonsList = () => {
    return [
        {
            id: 1,
            title: LOCALIZATION_STRINGS.TA_NOT_ACCEPTS_ORDERS,
            reason: LOCALIZATION_STRINGS.TA_NOT_ACCEPTS_ORDERS_CANCEL_REASON,
            isTextFieldAvailable: false
        },
        {
            id: 2,
            title: LOCALIZATION_STRINGS.PLACED_IN_CORRECT_ORDER,
            reason: LOCALIZATION_STRINGS.PLACED_IN_CORRECT_ORDER_CANCEL_REASON,
            isTextFieldAvailable: false
        },
        {
            id: 3,
            title: LOCALIZATION_STRINGS.MY_REASONS_NOT_LISTED,
            reason: LOCALIZATION_STRINGS.MY_REASONS_NOT_LISTED_CANCEL_REASON,
            isTextFieldAvailable: true
        }
    ];
};

export const OnGoingOrderHelpData = () => {
    return [
        {
            id: 1,
            isDropDownAvailable: false,
            isChatButtonAvailable: true,
            isTakeawayButtonAvailable: true,
            type: HELP_OPTIONS_TYPE.WHERE_IS_MY_ORDER,
            title: LOCALIZATION_STRINGS.WHERE_IS_MY_ORDER
        },
        {
            id: 2,
            isDropDownAvailable: true,
            isChatButtonAvailable: false,
            isTakeawayButtonAvailable: true,
            type: HELP_OPTIONS_TYPE.EDIT_ORDER_INSTRUCTIONS,
            title: LOCALIZATION_STRINGS.EDIT_ORDER_INSTRUCTIONS_TEXT
        },
        {
            id: 3,
            isChatButtonAvailable: true,
            isTakeawayButtonAvailable: true,
            type: HELP_OPTIONS_TYPE.UNABLE_TO_REACH_TAKEAWAY,
            isDropDownAvailable: true,
            title: LOCALIZATION_STRINGS.UNABLE_REACH_TA_TEXT
        },
        {
            id: 4,
            isDropDownAvailable: true,
            isChatButtonAvailable: false,
            isTakeawayButtonAvailable: true,
            type: HELP_OPTIONS_TYPE.CANCEL_ORDER,
            title: LOCALIZATION_STRINGS.CANCEL_ORDER_TEXT
        },
        {
            id: 5,
            isChatButtonAvailable: true,
            isTakeawayButtonAvailable: true,
            isDropDownAvailable: false,
            type: HELP_OPTIONS_TYPE.SOME_THINGS_ELSE,
            title: LOCALIZATION_STRINGS.SOME_THINGS_ELSE_TEXT
        }
    ];
};
