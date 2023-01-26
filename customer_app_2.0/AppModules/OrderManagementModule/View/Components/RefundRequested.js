import { View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import React from 'react';
import { selectRefundRequested, selectRefundStatus } from '../../Redux/OrderManagementSelectors';
import { connect } from 'react-redux';
import { isArrayNonEmpty, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { DATE_FORMAT, formatDateString } from 't2sbasemodule/Utils/DateUtil';
import style from '../Styles/ViewOrderStyle';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { MISSING_ITEM, VIEW_ID } from '../../Utils/OrderManagementConstants';
import { getRefundAmount } from '../../Utils/OrderManagementHelper';

const RefundRequested = ({ refundRequestedData, refundStatus, currency, screenName }) => {
    let dateAndTime =
        isValidString(refundStatus?.requested_date) &&
        formatDateString(refundStatus?.requested_date, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM_HH_MM);
    let refundAmount = isValidElement(refundStatus?.amount) && getRefundAmount(refundStatus?.amount);
    return (
        <View style={style.refundContainer}>
            <View style={style.refundSubTextView}>
                <T2SText id={VIEW_ID.REFUND_HEADER_TEXT} screenName={screenName} style={style.refundTextStyle}>
                    {LOCALIZATION_STRINGS.REFUND_REQUESTED}
                </T2SText>
                <T2SText id={VIEW_ID.REFUND_DATE_TIME_TEXT} screenName={screenName} style={style.refundDateText}>
                    {dateAndTime}
                </T2SText>
            </View>
            <T2SText id={VIEW_ID.REFUND_MISSING_ITEM_TEXT} screenName={screenName} style={style.refundSubText}>
                {LOCALIZATION_STRINGS.REFUND_MISSING_ITEM}
            </T2SText>
            <View style={style.refundSubTextView}>
                <View style={[style.refundItemsView, isValidString(refundAmount) && style.refundAmountView]}>
                    <T2SText id={VIEW_ID.REFUND_REQUESTED_ITEMS_TEXT} screenName={screenName} style={style.refundItemText}>
                        {getMissingItemsName(refundRequestedData)}
                    </T2SText>
                </View>
                <T2SText screenName={screenName} id={VIEW_ID.REFUND_REQUESTED_AMOUNT_TEXT} style={style.refundPriceText}>
                    {refundAmount}
                </T2SText>
            </View>
        </View>
    );
};

const getMissingItemsName = (items) => {
    let comma,
        addonComma,
        missingItem,
        addonItem = '';
    missingItem = '';
    items.forEach((item, index) => {
        comma = index !== 0 && isValidString(missingItem) ? ', ' : '';
        if (isValidElement(item)) {
            if (item?.type !== MISSING_ITEM && isArrayNonEmpty(item.order_item_addon_refund_log)) {
                item.order_item_addon_refund_log.forEach((addon, addonIndex) => {
                    if (addon.type === MISSING_ITEM) {
                        addonComma = addonIndex !== 0 && isValidString(addonItem) ? ', ' : '';
                        addonItem = addonItem + (isValidString(addon?.name) ? `${addonComma}${addon.name} ` : '');
                    }
                });
            }
            missingItem =
                missingItem +
                (isValidString(item.name) && `${comma}${item.name} `) +
                (isValidString(addonItem) ? '-' + '(' + addonItem + ')' : '');
        }
    });
    return missingItem;
};

const mapStateToProps = (state) => ({
    refundRequestedData: selectRefundRequested(state),
    refundStatus: selectRefundStatus(state)
});

export default connect(mapStateToProps)(React.memo(RefundRequested));
