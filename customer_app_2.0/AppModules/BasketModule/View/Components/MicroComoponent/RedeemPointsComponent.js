import React from 'react';
import { View } from 'react-native';
import { SizedBox, T2SCheckBox } from 't2sbasemodule/UI';
import styles from '../../Styles/BasketScreenStyles';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';

const RedeemPointsComponent = ({ redeemPointsMessage, screenName, isRedeemApplied, redeemPointsClicked }) => {
    return (
        <View>
            <SizedBox style={styles.sizedBoxStyle} height={5} />
            <View style={styles.marginHorizontalStyle}>
                <T2SCheckBox status={isRedeemApplied} onPress={redeemPointsClicked} label={LOCALIZATION_STRINGS.REDEEM_POINTS} />
                <T2SText screenName={screenName} id={VIEW_ID.REDEEM_POINTS_TEXT} style={styles.redeemMessageStyle}>
                    {redeemPointsMessage}
                </T2SText>
            </View>
        </View>
    );
};

export default React.memo(RedeemPointsComponent);
