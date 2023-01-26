import React, { useState } from 'react';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { styles } from '../../Style/TakeawaySearchListStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { VIEW_ID } from 'appmodules/AddressModule/Utils/AddressConstants';
import { ORDER_TYPE } from 'appmodules/BaseModule/BaseConstants';
import { T2STouchableOpacity } from 't2sbasemodule/UI';

export const SelectOrderTypeView = React.memo(({ screenName, onPress, orderType }) => {
    const [toggle, setToggle] = useState(orderType);
    const onPressToggle = (value) => {
        if (isValidElement(value)) {
            setToggle(value);
            onPress(value);
        }
    };
    return (
        <T2SView style={styles.orderTypeView}>
            <T2STouchableOpacity
                id={VIEW_ID.DELIVERY_TOGGLE_BUTTON}
                screenName={screenName}
                style={toggle === ORDER_TYPE.DELIVERY ? styles.orderTypeSelected : styles.orderTypeNotSelected}
                onPress={() => {
                    onPressToggle(ORDER_TYPE.DELIVERY);
                }}>
                <T2SText
                    id={VIEW_ID.DELIVERY_TEXT}
                    screenName={screenName}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={toggle === ORDER_TYPE.DELIVERY ? styles.orderTypeSelectedText : styles.orderTypeUnSelectedText}>
                    {LOCALIZATION_STRINGS.DELIVERY}
                </T2SText>
            </T2STouchableOpacity>
            <T2STouchableOpacity
                id={VIEW_ID.COLLECTION_TOGGLE_BUTTON}
                screenName={screenName}
                style={toggle === ORDER_TYPE.COLLECTION ? styles.orderTypeSelected : styles.orderTypeNotSelected}
                onPress={() => {
                    onPressToggle(ORDER_TYPE.COLLECTION);
                }}>
                <T2SText
                    id={VIEW_ID.COLLECTION_TEXT}
                    screenName={screenName}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                    style={toggle === ORDER_TYPE.COLLECTION ? styles.orderTypeSelectedText : styles.orderTypeUnSelectedText}>
                    {LOCALIZATION_STRINGS.COLLECTION}
                </T2SText>
            </T2STouchableOpacity>
        </T2SView>
    );
});
