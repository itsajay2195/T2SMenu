import { Platform } from 'react-native';
import { styles } from '../../Style/TakeawayListWidgetStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/Constants';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { getDiscountAmount } from '../../Utils/Helper';
import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

const TakeawayDetailsComponent = ({ screenName, itemName, discount, cuisines, cuisineNotEmpty }) => {
    const renderDiscountLabelView = () => {
        let discountAmount = getDiscountAmount(discount);
        return isValidElement(discount) && discount > 0 ? (
            <T2SView
                screenName={screenName}
                id={VIEW_ID.DISCOUNT_OFFER_VIEW + discountAmount + '%'}
                style={styles.discountContainer}
                accessible={false}>
                <T2SText screenName={screenName} id={VIEW_ID.DISCOUNT_TEXT + discountAmount + '%'} style={styles.discountTextStyle}>
                    {discountAmount}
                    {LOCALIZATION_STRINGS.OFF}
                </T2SText>
            </T2SView>
        ) : null;
    };

    return (
        <>
            <T2SText
                screenName={screenName}
                id={itemName + '_' + VIEW_ID.TAKEAWAY_NAME_TEXT}
                style={[styles.takeawayTextStyle, Platform.OS === 'android' && styles.takeawayFontStyle]}>
                {itemName}
            </T2SText>
            {renderDiscountLabelView()}
            <T2SText
                screenName={screenName}
                id={itemName + '_' + VIEW_ID.CUISINE_NAME_TEXT}
                style={cuisineNotEmpty ? styles.cuisinesTextStyle : styles.cuisinesEmptyTextStyle}>
                {cuisines}
            </T2SText>
        </>
    );
};

export default React.memo(TakeawayDetailsComponent);
