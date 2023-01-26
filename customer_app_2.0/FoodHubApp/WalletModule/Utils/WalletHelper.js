import { DATE_FORMAT, formatDateString } from 't2sbasemodule/Utils/DateUtil';
import { WALLET_TYPE } from './WalletConstants';
import { isValidElement, safeIntValue } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

export const getWalletFormattedDate = (string) => {
    return formatDateString(string, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM_HH_MM);
};

export const getTransactionName = (item) => {
    if (isValidElement(item)) {
        const { type, order_id } = item;
        const orderId = safeIntValue(order_id) > 0 ? ` ${LOCALIZATION_STRINGS.FOR_ORDER_ID} ${order_id}` : '';
        switch (type) {
            case WALLET_TYPE.DEPOSIT: {
                return `${LOCALIZATION_STRINGS.DEPOSITED_BY} ${LOCALIZATION_STRINGS.FH}${orderId}`;
            }
            case WALLET_TYPE.REFUND:
                return `${LOCALIZATION_STRINGS.REFUNDED}${orderId}`;
            case WALLET_TYPE.PAYMENT:
                return `${LOCALIZATION_STRINGS.PAID}${orderId}`;
            case WALLET_TYPE.WALLET_TOPUP_REFERREE:
            case WALLET_TYPE.WALLET_REVERSE_REFERRER:
            case WALLET_TYPE.WALLET_TOPUP_REFERRER:
            case WALLET_TYPE.WALLET_REVERSE_REFERREE:
                return `${LOCALIZATION_STRINGS.REFERRAL_SCHEME}`;
        }
        return type;
    } else return '';
};
