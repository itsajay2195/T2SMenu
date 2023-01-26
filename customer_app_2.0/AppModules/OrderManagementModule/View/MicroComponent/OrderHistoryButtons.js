import React, { useCallback } from 'react';
import { SCREEN_NAME } from '../../Utils/OrderManagementConstants';
import { Text, View } from 'react-native';
import { styles } from '../Styles/OrderHistoryFoodHubItemStyle';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const OrderHistoryButtons = ({ onPress, buttonPressed, id, text, isViewOrder }) => {
    const handleOrderButtonsOnPress = useCallback(() => {
        isValidElement(onPress) && onPress(buttonPressed);
    }, [buttonPressed, onPress]);
    return (
        <T2STouchableOpacity
            id={id}
            screenName={SCREEN_NAME.ORDER_HISTORY}
            style={isViewOrder ? styles.feedbackViewStyle : null}
            onPress={handleOrderButtonsOnPress}>
            <View style={styles.buttonParent}>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </T2STouchableOpacity>
    );
};
export default React.memo(OrderHistoryButtons);
