import { selectRefundStatus } from '../../Redux/OrderManagementSelectors';
import { connect } from 'react-redux';
import { T2SDivider, T2SText } from 't2sbasemodule/UI';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { View } from 'react-native';
import React from 'react';
import style from '../Styles/ViewOrderStyle';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { VIEW_ID } from '../../Utils/OrderManagementConstants';
import { DATE_FORMAT, formatDateString } from 't2sbasemodule/Utils/DateUtil';

const RefundStatus = ({ refundStatus, screenName }) => {
    let refundMessage, refundDate, refundAmount;
    refundAmount = isValidString(refundStatus?.amount) ? refundStatus.amount : '';
    refundMessage = isValidString(refundStatus?.data?.message) && refundStatus.data.message.replace('<amount>', refundAmount);
    refundDate =
        isValidString(refundStatus?.refund_date) &&
        formatDateString(refundStatus?.refund_date, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS, DATE_FORMAT.DD_MMM_HH_MM);
    return (
        <>
            <View style={style.refundContainer}>
                <View style={style.refundSubTextView}>
                    <T2SText style={style.refundTextStyle} screenName={screenName} id={VIEW_ID.REFUND_HEADER_TEXT}>
                        {LOCALIZATION_STRINGS.REFUND}
                    </T2SText>
                    <T2SText id={VIEW_ID.REFUND_DATE_TIME_TEXT} screenName={screenName} style={style.refundDateText}>
                        {refundDate}
                    </T2SText>
                </View>
                <T2SText style={style.refundMessageText} id={VIEW_ID.REFUND_MESSAGE_TEXT} screenName={screenName}>
                    {refundMessage}
                </T2SText>
            </View>
            <T2SDivider style={style.dividerLargeStyle} />
        </>
    );
};
const mapStateToProps = (state) => ({
    refundStatus: selectRefundStatus(state)
});

export default connect(mapStateToProps)(React.memo(RefundStatus));
