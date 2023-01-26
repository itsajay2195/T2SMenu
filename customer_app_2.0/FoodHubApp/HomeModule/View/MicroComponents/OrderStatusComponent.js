import React from 'react';
import { View } from 'react-native';
import styles from '../../Styles/HomeStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/HomeConstants';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';

const OrderStatusComponent = ({ screenName, text }) => {
    return (
        <View style={styles.cancelledOrderTextView}>
            <T2SText style={styles.orderStatusTextStyle} id={VIEW_ID.ORDER_STATUS_TEXT} screenName={screenName}>
                {text}
            </T2SText>
            <T2SIcon id={VIEW_ID.ORDER_STATUS_IMAGE} screenName={screenName} icon={FONT_ICON.WRONG} color={Colors.freeOption} size={17} />
        </View>
    );
};

export default React.memo(OrderStatusComponent);
