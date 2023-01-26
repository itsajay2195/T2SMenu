import { View } from 'react-native';
import React from 'react';
import styles from '../../Styles/CarouselImageComponentStyle';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import { T2SText } from 't2sbasemodule/UI';
import { getRoundedAmount } from 't2sbasemodule/Utils/helpers';

const ShowTotalSavingsComponent = ({ currency, amount }) => {
    return (
        <View style={styles.totalSavingsContainer}>
            <T2SText screenName={SCREEN_NAME.HOME_SCREEN} id={VIEW_ID.TOTAL_SAVING_AMOUNT} style={styles.totalSavingsTextStyle}>
                {`${currency} ${getRoundedAmount(amount)}`}
            </T2SText>
        </View>
    );
};

export default React.memo(ShowTotalSavingsComponent);
