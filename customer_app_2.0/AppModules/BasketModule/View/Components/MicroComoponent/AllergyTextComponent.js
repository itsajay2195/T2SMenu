import React from 'react';
import styles from '../../Styles/BasketScreenStyles';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import { View } from 'react-native';

const AllergyTextComponent = ({ screenName, handleAllergyOnPress }) => {
    return (
        <View style={styles.allergyContainer}>
            <T2SIcon icon={FONT_ICON.WARNING} color={Colors.lightOrange} size={24} />
            <T2SText style={styles.allergyText} onPress={handleAllergyOnPress} id={VIEW_ID.ALLERGY_LINK} screenName={screenName}>
                {LOCALIZATION_STRINGS.DO_YOU_HAVE_AN_ALLERGY}
            </T2SText>
        </View>
    );
};

export default React.memo(AllergyTextComponent);
