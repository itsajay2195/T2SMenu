import React from 'react';
import T2STouchableOpacity from '../../../CommonUI/T2STouchableOpacity';
import { defaultTouchArea } from '../../../../Utils/helpers';
import { View } from 'react-native';
import CustomIcon from '../../CustomIcon';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import Colors from '../../../../Themes/Colors';
import styles from '../AddButtonStyle';

const QuantityAddAndMinusButton = ({ screenName, id, onPress, quantity, isMinus, disableAddButton }) => {
    return (
        <T2STouchableOpacity
            style={isMinus ? styles.buttonMinusContainer : styles.buttonAddContainer}
            screenName={screenName}
            id={id}
            onPress={onPress}
            hitSlop={defaultTouchArea()}>
            <View style={disableAddButton ? [styles.buttonBgView, styles.disableOpacityStyle] : styles.buttonBgView}>
                {isMinus ? (
                    quantity === 1 ? (
                        <CustomIcon name={FONT_ICON.DELETE} size={18} color={Colors.primaryTextColor} />
                    ) : (
                        <CustomIcon name={FONT_ICON.MINUS} size={13} color={Colors.primaryColor} />
                    )
                ) : (
                    <CustomIcon name={FONT_ICON.ADD} size={13} color={Colors.takeawayGreen} />
                )}
            </View>
        </T2STouchableOpacity>
    );
};
export default React.memo(QuantityAddAndMinusButton);
