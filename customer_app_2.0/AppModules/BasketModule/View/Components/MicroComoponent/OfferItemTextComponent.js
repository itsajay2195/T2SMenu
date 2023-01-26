import { View } from 'react-native';
import styles from '../../Styles/BasketScreenStyles';
import { Text } from 'react-native-paper';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import React from 'react';

const OfferItemTextComponent = ({ screenName }) => {
    return (
        <View style={styles.asteriskContainer}>
            <Text style={styles.asteriskText}>*</Text>
            <T2SText screenName={screenName} id={VIEW_ID.ASTERISK_MSG} style={styles.asteriskMessage}>
                {LOCALIZATION_STRINGS.ASTERISK_MSG}
            </T2SText>
        </View>
    );
};

export default React.memo(OfferItemTextComponent);
