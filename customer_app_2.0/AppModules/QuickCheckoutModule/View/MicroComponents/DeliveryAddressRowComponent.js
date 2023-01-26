import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { Platform, View } from 'react-native';
import styles from '../Styles/DeliveryComponentStyle';
import { BOOL_CONSTANT } from '../../../AddressModule/Utils/AddressConstants';
import T2STouchableWithoutFeedback from 't2sbasemodule/UI/CommonUI/T2STouchableWithoutFeedback';
import { VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import { RadioButton } from 'react-native-paper';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import React, { useCallback } from 'react';

const DeliveryAddressRowComponent = ({ screenName, checkBoxStatus, item, itemClicked, displayAddress, numberOfLinesOfAddress }) => {
    const addressSelected = useCallback(() => {
        itemClicked(item);
    }, [itemClicked, item]);

    return (
        <T2STouchableOpacity accessible={false} onPress={addressSelected}>
            <View style={styles.radioButtonContainerView}>
                <View style={[styles.radioButtonView, { marginTop: item.is_primary === BOOL_CONSTANT.YES ? 0 : 5 }]}>
                    <T2STouchableWithoutFeedback screenName={screenName} id={VIEW_ID.QC_ADDRESS_RADIO_BUTTON + item.id}>
                        <RadioButton.Android
                            color={Colors.primaryColor}
                            style={styles.radioButtonStyle}
                            status={checkBoxStatus}
                            screenName={screenName}
                            id={VIEW_ID.QC_ADDRESS_RADIO_BUTTON + item.id}
                            onPress={addressSelected}
                        />
                    </T2STouchableWithoutFeedback>
                    <T2SText
                        id={VIEW_ID.QC_DETAILS_DELIVERY_ADDRESS + item.id}
                        screenName={screenName}
                        style={[
                            styles.addressText,
                            { width: item.is_primary === BOOL_CONSTANT.YES ? (Platform.OS === 'ios' ? '80%' : '75%') : '90%' }
                        ]}
                        numberOfLines={numberOfLinesOfAddress}
                        ellipsizeMode="tail">
                        {displayAddress}
                    </T2SText>
                </View>

                {item.is_primary === BOOL_CONSTANT.YES && (
                    <View style={styles.primaryViewStyle}>
                        <T2SText style={styles.primaryTextStyle} screenName={screenName} id={VIEW_ID.PRIMARY_TEXT}>
                            {LOCALIZATION_STRINGS.PRIMARY}
                        </T2SText>
                    </View>
                )}
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(DeliveryAddressRowComponent);
