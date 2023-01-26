import React from 'react';
import { currencyValue, isValidElement } from '../../../../T2SBaseModule/Utils/helpers';
import T2SText from '../../../../T2SBaseModule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/Constants';
import { styles } from '../../Style/TakeawayListWidgetStyle';
import Colors from '../../../../T2SBaseModule/Themes/Colors';
import { LOCALIZATION_STRINGS } from '../../../../AppModules/LocalizationModule/Utils/Strings';

const MinimumOrder = ({ minOrder, name, currency, freeDelivery, screenName }) => {
    if (isValidElement(minOrder) && minOrder > 0) {
        return (
            <T2SText
                screenName={screenName}
                id={name + '_' + VIEW_ID.DELIVERY_CHARGES_TEXT}
                style={freeDelivery ? [styles.ratingStyle, { color: Colors.black }] : [styles.deliveryCharge, { color: Colors.black }]}>
                {` (${freeDelivery ? LOCALIZATION_STRINGS.FOR_ORDER_ABOVE : LOCALIZATION_STRINGS.MIN_ORDER} `}
                {currencyValue(minOrder, currency, 2)}
                {`)`}
            </T2SText>
        );
    }
    return null;
};

export default React.memo(MinimumOrder);
