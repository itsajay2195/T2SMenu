import React from 'react';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/BasketScreenStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { VIEW_ID } from '../../../Utils/BasketConstants';
import { LOCALIZATION_STRINGS } from '../../../../LocalizationModule/Utils/Strings';

const FreeGiftComponent = ({ screenName, handleGiftItemTapped }) => {
    return (
        <T2STouchableOpacity accessible={false} onPress={handleGiftItemTapped}>
            <T2SView style={styles.freeGiftContainerStyle}>
                <T2SText style={styles.freeGiftTextStyle} screenName={screenName} id={VIEW_ID.CLIMB_GIFT_ITEM}>
                    {LOCALIZATION_STRINGS.FREE_GIFT_MSG}
                </T2SText>
            </T2SView>
        </T2STouchableOpacity>
    );
};

export default React.memo(FreeGiftComponent, (prevProps, nextProps) => {
    return prevProps.screenName === nextProps.screenName;
});
