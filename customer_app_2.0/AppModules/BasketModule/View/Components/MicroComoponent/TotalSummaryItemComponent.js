import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/TotalSummaryStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { BasketConstants, VIEW_ID } from '../../../Utils/BasketConstants';
import { defaultTouchArea, safeFloatValue } from 't2sbasemodule/Utils/helpers';
import React from 'react';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';

const TotalSummaryItemComponent = ({ label, type, value, key, subTotal, screenName, driverTips }) => {
    return (
        <T2SView key={key} style={styles.priceSummaryStyle}>
            <T2STouchableOpacity
                activeOpacity={1}
                hitSlop={defaultTouchArea(14)}
                onPress={label === LOCALIZATION_STRINGS.TIP ? driverTips : null}
                style={styles.driverTips}>
                <T2SText
                    screenName={screenName}
                    id={VIEW_ID.PRICE_LABEL + label}
                    style={subTotal ? styles.subTotalStyle : styles.labelStyle}>
                    {label}
                </T2SText>
                {label === LOCALIZATION_STRINGS.TIP && (
                    <T2STouchableOpacity
                        style={{ paddingHorizontal: 5 }}
                        onPress={driverTips}
                        screenName={screenName}
                        id={VIEW_ID.CANCEL_DRIVER_TIPS_ICON + label}>
                        <T2SIcon
                            name={FONT_ICON.WRONG}
                            size={17}
                            color={Colors.persianRed}
                            style={styles.closeIcon}
                            screenName={screenName}
                        />
                    </T2STouchableOpacity>
                )}
            </T2STouchableOpacity>
            <T2SText
                screenName={screenName}
                id={VIEW_ID.PRICE_VALUE + label}
                style={subTotal ? styles.subTotalStyle : type === BasketConstants.DISCOUNT ? styles.labelGreenStyle : styles.labelStyle}>
                {type === BasketConstants.DISCOUNT ? `-${safeFloatValue(value, 2)}` : ` ${safeFloatValue(value, 2)}`}
            </T2SText>
        </T2SView>
    );
};

export default React.memo(TotalSummaryItemComponent);
