import { View } from 'react-native';
import styles from '../../../BasketModule/View/Styles/BasketScreenStyles';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../BasketModule/Utils/BasketConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import React from 'react';
import { isValidString } from 't2sbasemodule/Utils/helpers';

const InfoComponent = ({ screenName, handleOnPress, infoText }) => {
    let textMessage = isValidString(infoText) ? infoText : LOCALIZATION_STRINGS.TA_LIST_TOOLTIP_MSG;
    return (
        <View style={[styles.allergyContainer, styles.infoContainer]}>
            <T2SIcon
                screenName={screenName}
                id={VIEW_ID.UNFILLED_INFO_ICON}
                icon={FONT_ICON.INFO_ICON_UNFILLED}
                color={Colors.lightOrange}
                size={24}
            />
            <T2SText style={styles.inFoText} onPress={handleOnPress} id={VIEW_ID.ALLERGY_LINK} screenName={screenName}>
                {textMessage}
            </T2SText>
        </View>
    );
};

export default InfoComponent;
