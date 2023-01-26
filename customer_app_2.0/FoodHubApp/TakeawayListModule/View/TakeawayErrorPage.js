import React, { useEffect } from 'react';
import { styles } from '../Style/TakeawayErrorPageStyle';
import { SCREEN_NAME, VIEW_ID } from '../../HomeModule/Utils/HomeConstants';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from 'appmodules/AnalyticsModule/AnalyticsConstants';
import { T2SText } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { Image, View } from 'react-native';

const TakeawayErrorPage = () => {
    useEffect(() => {
        Analytics.logScreen(ANALYTICS_SCREENS.TAKEAWAY_ERROR);
    }, []);

    return (
        <View style={styles.modalContainer}>
            <Image
                style={styles.imageStyle}
                screenName={SCREEN_NAME.HOME_SCREEN}
                id={VIEW_ID.NO_TAKEAWAY_IMAGE}
                source={require('../../Images/no_takeaway.png')}
            />
            <T2SText style={styles.errorTextStyle}>{LOCALIZATION_STRINGS.SORRY_NO_TAKEAWAY_FOUND}</T2SText>
        </View>
    );
};

export default React.memo(TakeawayErrorPage);
