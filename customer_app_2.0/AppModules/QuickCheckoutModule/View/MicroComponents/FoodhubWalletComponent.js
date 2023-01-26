import { VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import { Text, View } from 'react-native';
import styles from '../Styles/FullPagePaymentCheckoutStyles';
import React from 'react';
import T2SCheckBox from 't2sbasemodule/UI/CommonUI/T2SCheckBox';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';

const FoodhubWalletComponent = ({ screenName, walletDisabled, checkedState, currency, walletBalance, handleWalletSelection }) => {
    return (
        <View style={styles.foodhubWalletStyle}>
            <T2SCheckBox
                id={VIEW_ID.USE_FOODHUB_WALLET}
                screenName={screenName}
                label={LOCALIZATION_STRINGS.FOOD_HUB_WALLET}
                textstyle={styles.checkTextStyle}
                status={checkedState}
                disabled={walletDisabled}
                onPress={handleWalletSelection}
            />
            <Text style={styles.walletTextStyle}>
                {currency}
                {walletBalance}
            </Text>
        </View>
    );
};

export default React.memo(FoodhubWalletComponent);
