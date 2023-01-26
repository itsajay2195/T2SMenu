import { View } from 'react-native';
import styles from '../../Styles/BasketScreenStyles';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import React from 'react';

const ErrorTextComponent = ({ basketError, screenName }) => {
    return (
        <View style={styles.warningContainer}>
            <T2SIcon icon={FONT_ICON.ALERT} color={Colors.persianRed} size={24} />
            <T2SText screenName={screenName} id={VIEW_ID.ERROR_TEXT} style={styles.errorText}>
                {basketError}
            </T2SText>
        </View>
    );
};

export default React.memo(ErrorTextComponent);
