import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import { View } from 'react-native';
import styles from '../Styles/CardComponentStyle';
import { RadioButton } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { CHECKBOX_STATUS } from '../../../HomeModule/Utils/HomeConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import React, { useCallback } from 'react';

const PaymentCardComponent = ({ screenName, itemClicked, paymentType, analytics, disabled, isCardOptionSelected, labelName, viewId }) => {
    const onPressEvent = useCallback(() => {
        itemClicked(analytics, paymentType, null);
    }, [itemClicked, analytics, paymentType]);
    return (
        <T2STouchableOpacity activeOpacity={0.9} onPress={onPressEvent} accessible={false}>
            <View style={styles.rootContainer}>
                <RadioButton.Android
                    color={Colors.primaryColor}
                    style={styles.radioButtonStyle}
                    {...setTestId(screenName, viewId + VIEW_ID.RADIO_BUTTON)}
                    disabled={disabled}
                    status={isCardOptionSelected ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                    onPress={onPressEvent}
                />
                <T2SText style={styles.cashTextStyle} screenName={screenName} id={viewId}>
                    {labelName}
                </T2SText>
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(PaymentCardComponent);
