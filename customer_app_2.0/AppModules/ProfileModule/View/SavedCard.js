import React, { useCallback } from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { DeliveryAddressConstants, SCREEN_NAME, VIEW_ID } from '../Utils/ProfileConstants';
import { SavedCardStyles } from '../Styles/SavedCardDetailsStyle';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { getExpiryDateForCardDetails } from '../Utils/ProfileHelper';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { T2STouchableOpacity } from 't2sbasemodule/UI';

const CustomerCardDetails = ({ lastDigits, cardType, isPrimary, expiryDate, id, onDeletePressed }) => {
    const onPress = useCallback(() => {
        onDeletePressed(id);
    }, [id, onDeletePressed]);

    return (
        <T2SView style={SavedCardStyles.mainContainer}>
            <T2SView style={SavedCardStyles.cardDetailsContainer}>
                <T2SText screenName={SCREEN_NAME.SAVED_CARD_DETAILS} id={VIEW_ID.CARD_DETAILS_TEXT} style={SavedCardStyles.cardDetailText}>
                    {cardType} {LOCALIZATION_STRINGS.MASKED_CARD_NUMBER}
                    {lastDigits}
                </T2SText>
                <T2SText screenName={SCREEN_NAME.SAVED_CARD_DETAILS} id={VIEW_ID.EXPIRY_DATE_TEXT} style={SavedCardStyles.cardDetailText}>
                    {getExpiryDateForCardDetails(expiryDate)}
                </T2SText>
            </T2SView>
            {isPrimary === DeliveryAddressConstants.YES && (
                <T2SView style={SavedCardStyles.primaryTextContainer}>
                    <T2SText
                        screenName={SCREEN_NAME.SAVED_CARD_DETAILS}
                        id={VIEW_ID.PRIMARY_CARD_TEXT}
                        style={SavedCardStyles.primaryTextStyle}>
                        {LOCALIZATION_STRINGS.PRIMARY}
                    </T2SText>
                </T2SView>
            )}
            <T2STouchableOpacity style={SavedCardStyles.deleteIcon} onPress={onPress}>
                <T2SIcon icon={FONT_ICON.DELETE} color={Colors.black} size={24} />
            </T2STouchableOpacity>
        </T2SView>
    );
};
export default React.memo(CustomerCardDetails);
