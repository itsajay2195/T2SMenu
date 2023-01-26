import { VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import { View } from 'react-native';
import styles from '../Styles/FullPagePaymentCheckoutStyles';
import React, { useCallback } from 'react';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { RadioButton } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { isCardPaymentEnabled } from '../../Utils/Helper';
import CardListDetailsComponent from './CardListDetailsComponent';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const CardListItemComponent = ({ screenName, storeConfigCardPayment, checkedStatus, id, last_4_digits, handleCardItemSelection }) => {
    const onPressEvent = useCallback(() => {
        if (isValidElement(handleCardItemSelection)) {
            handleCardItemSelection(id);
        }
    }, [handleCardItemSelection, id]);

    return (
        <T2STouchableOpacity activeOpacity={0.9} onPress={onPressEvent} accessible={false}>
            <View style={styles.cardRootContainer}>
                <RadioButton.Android
                    color={Colors.primaryColor}
                    style={styles.radioButtonStyle}
                    screenName={screenName}
                    id={VIEW_ID.QC_LIST_CARD_ITEM_RADIO}
                    {...setTestId(screenName, VIEW_ID.QC_LIST_CARD_ITEM + VIEW_ID.RADIO_BUTTON)}
                    disabled={!isCardPaymentEnabled(storeConfigCardPayment)}
                    status={checkedStatus}
                    onPress={onPressEvent}
                />
                <CardListDetailsComponent screenName={screenName} last_4_digits={last_4_digits} />
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(CardListItemComponent);
