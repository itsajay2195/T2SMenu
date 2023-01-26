import { DeliveryAddressConstants, SCREEN_NAME, VIEW_ID } from '../Utils/ProfileConstants';
import styles from '../Styles/DeliveryAddressStyles';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { View } from 'react-native';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import React from 'react';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

const renderPrimaryView = (address) => {
    return (
        <View style={styles.textPrimaryView}>
            <T2SText
                style={styles.textPrimaryStyle}
                id={address + '_' + VIEW_ID.PRIMARY_ADDRESS_TEXT}
                screenName={SCREEN_NAME.DELIVERY_ADDRESS}>
                {LOCALIZATION_STRINGS.PRIMARY}
            </T2SText>
        </View>
    );
};
const DeliveryAddressItem = ({ address, handleAddressClickedAction, itemPrimary, itemId }) => {
    return (
        <T2STouchableOpacity
            id={VIEW_ID.EDIT_ADDRESS}
            screenName={SCREEN_NAME.DELIVERY_ADDRESS}
            onPress={() => {
                if (isValidElement(handleAddressClickedAction)) {
                    handleAddressClickedAction(itemId);
                }
            }}
            activeOpacity={1}
            style={styles.rowContainerStyle}
            closeOnRowPress={true}
            accessible={false}>
            <T2SView id={VIEW_ID.BACKGROUND_VIEW} screenName={SCREEN_NAME.DELIVERY_ADDRESS} style={styles.rowBackGroundViewContainer}>
                <View style={styles.addressViewContainer}>
                    <T2SView style={styles.rowContainer}>
                        <T2SText
                            id={address + VIEW_ID.ADDRESS_TEXT}
                            screenName={SCREEN_NAME.DELIVERY_ADDRESS}
                            style={styles.textMarginStyle}>
                            {address}
                        </T2SText>
                    </T2SView>
                </View>
                {itemPrimary === DeliveryAddressConstants.YES && renderPrimaryView(address)}
            </T2SView>
        </T2STouchableOpacity>
    );
};

export default React.memo(DeliveryAddressItem);
