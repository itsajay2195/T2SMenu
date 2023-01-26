import React from 'react';
import { View } from 'react-native';
import styles from '../../Styles/TotalSummaryStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import Colors from 't2sbasemodule/Themes/Colors';

const TotalValueComponent = ({ label, currency, showPaymentType, paymentType, value, selectedPaymentValue, screenName }) => {
    return (
        <View style={[styles.priceSummaryStyle, styles.paddingVerticalStyle]}>
            <T2SText screenName={screenName} id={VIEW_ID.TOTAL_LABEL + label} style={styles.totalStyle}>
                {label}
            </T2SText>
            <T2SText
                screenName={screenName}
                id={VIEW_ID.TOTAL_VALUE}
                style={[styles.totalStyle, showPaymentType ? { color: Colors.chipBlack } : { color: Colors.primaryTextColor }]}>
                {showPaymentType && (
                    <T2SText style={styles.paymentTypeTextStyle} screenName={screenName} id={paymentType}>
                        {`(${selectedPaymentValue}) `}
                    </T2SText>
                )}
                {currency}
                {value}
            </T2SText>
        </View>
    );
};

export default React.memo(TotalValueComponent);
