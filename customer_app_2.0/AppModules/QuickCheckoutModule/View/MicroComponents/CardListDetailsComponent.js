import { VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import styles from '../Styles/FullPagePaymentCheckoutStyles';
import React from 'react';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';

const CardListDetailsComponent = ({ screenName, last_4_digits }) => {
    return (
        <T2SView style={styles.cardMainContainer}>
            <T2SView style={styles.cardDetailsContainer}>
                <T2SText screenName={screenName} id={VIEW_ID.CARD_NUMBER_TEXT} style={styles.cardNumberText}>
                    {LOCALIZATION_STRINGS.MASKED_CARD_NUMBER}
                    {LOCALIZATION_STRINGS.MASKED_CARD_NUMBER}
                    {LOCALIZATION_STRINGS.MASKED_CARD_NUMBER}
                    {last_4_digits}
                </T2SText>
            </T2SView>
        </T2SView>
    );
};

export default React.memo(CardListDetailsComponent);
