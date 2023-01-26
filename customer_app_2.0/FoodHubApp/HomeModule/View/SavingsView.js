import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../Styles/SavingsViewStyle';
import { VIEW_ID } from '../../../T2SBaseModule/UI/CustomUI/TotalSavings/Utils/TotalSavingsConstant';
import * as TotalSavingsHelper from '../../../T2SBaseModule/UI/CustomUI/TotalSavings/Utils/TotalSavingsHelper';

const SavingsView = (props) => {
    const { color, amount, currency, screenName } = props;
    let modifiedAmount = Math.round(parseFloat(amount)).toString();
    return (
        <View style={styles.totalSavingsContainer}>
            <View style={styles.amountViewContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.CURRENCY_SYMBOL} style={[styles.currencyStyle, { color: color }]}>
                    {currency}
                </T2SText>
                {TotalSavingsHelper.getDigitArrFromCurrencyString(modifiedAmount).map((item, _) => {
                    if (item !== '.') {
                        return (
                            <View style={[styles.digitBgView, props.style, { backgroundColor: color }]}>
                                <T2SText
                                    screenName={props.screenName}
                                    id={VIEW_ID.TOTAL_SAVINGS_DIGIT + '_' + props.itemIndex}
                                    style={styles.textStyle}>
                                    {item}
                                </T2SText>
                            </View>
                        );
                    } else {
                        return <T2SText style={[styles.dotStyle, { color: color }]}>.</T2SText>;
                    }
                })}
            </View>
        </View>
    );
};

SavingsView.propType = {
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    screenName: PropTypes.string.isRequired,
    color: PropTypes.any.isRequired
};

export default SavingsView;
