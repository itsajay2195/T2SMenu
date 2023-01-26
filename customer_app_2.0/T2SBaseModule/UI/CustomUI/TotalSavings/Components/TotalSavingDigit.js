import React from 'react';
import { View } from 'react-native';

import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../Utils/TotalSavingsConstant';
import styles from '../TotalSavingsStyle';

const TotalSavingDigit = (props) => {
    return (
        <View style={[styles.digitBgView, props.style]}>
            <T2SText screenName={props.screenName} id={VIEW_ID.TOTAL_SAVINGS_DIGIT + '_' + props.itemIndex} style={styles.textStyle}>
                {props.digitValue}
            </T2SText>
        </View>
    );
};

export default TotalSavingDigit;
