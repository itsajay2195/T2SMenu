import React from 'react';
import { View } from 'react-native';
import styles from '../../Styles/BasketScreenStyles';
import { Text } from 'react-native-paper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';

const NotApplicableTextComponent = ({ screenName }) => {
    return (
        <View style={styles.asteriskContainer}>
            <Text style={styles.asteriskText}>**</Text>
            <T2SText screenName={screenName} id={VIEW_ID.COUPONS_NOT_APPLICABLE_ITEM} style={styles.asteriskMessage}>
                {LOCALIZATION_STRINGS.COUPON_NOT_APPLICABLE}
            </T2SText>
        </View>
    );
};

export default React.memo(NotApplicableTextComponent);
