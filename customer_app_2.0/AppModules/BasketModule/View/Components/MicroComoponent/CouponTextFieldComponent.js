import styles from '../../Styles/BasketScreenStyles';
import { T2STextInput } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import React from 'react';
import { View } from 'react-native';

const CouponTextFieldComponent = ({
    redeem,
    screenName,
    coupon,
    couponApplied,
    lookupCouponErrorResponse,
    couponRef,
    errorText,
    handleApplyCoupon,
    handleOnFocus,
    handleOnBlur,
    handleOnchangeText
}) => {
    return (
        <View style={styles.textInputContainer} accessible={false}>
            <T2STextInput
                disabled={redeem}
                inputRef={couponRef}
                maxLength={15}
                dense={true}
                blurOnSubmit={true}
                returnKeyType="done"
                label={LOCALIZATION_STRINGS.ENTER_COUPON_CODE}
                screenName={screenName}
                id={VIEW_ID.COUPON_CODE_TEXT_INPUT}
                onChangeText={handleOnchangeText}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                value={coupon}
                editable={!(isValidElement(couponApplied) || isValidElement(lookupCouponErrorResponse))}
                autoCapitalize={'characters'}
                onSubmitEditing={handleApplyCoupon}
                error={isValidElement(lookupCouponErrorResponse)}
                errorText={errorText}
                accessible={false}
            />
        </View>
    );
};

export default React.memo(CouponTextFieldComponent);
