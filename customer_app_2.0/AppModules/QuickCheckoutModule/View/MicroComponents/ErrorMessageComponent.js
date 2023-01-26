import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../Styles/QuickCheckoutStyles';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import React from 'react';

const ErrorMessageComponent = ({ screenName, error }) => {
    return (
        <T2SView style={styles.warningContainer}>
            <T2SIcon icon={FONT_ICON.ALERT} color={Colors.persianRed} size={24} />
            <T2SText screenName={screenName} id={VIEW_ID.ERROR_TEXT} style={styles.errorText}>
                {error}
            </T2SText>
        </T2SView>
    );
};

export default React.memo(ErrorMessageComponent);
