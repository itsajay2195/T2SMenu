import { View } from 'react-native';
import React from 'react';
import styles from './Styles/TotalComponentStyle';
import { SCREEN_NAME } from '../Utils/QuickCheckoutConstants';
import TotalSummary from '../../BasketModule/View/Components/TotalSummary';

const TotalComponent = ({ paymentType, showPaymentType = false }) => {
    return (
        <View style={styles.rootStyle}>
            <TotalSummary
                screenName={SCREEN_NAME.QUICK_CHECKOUT_DETAIL_SCREEN}
                paymentType={paymentType}
                showPaymentType={showPaymentType}
            />
        </View>
    );
};

export default React.memo(TotalComponent);
