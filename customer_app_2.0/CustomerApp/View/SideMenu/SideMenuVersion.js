import React from 'react';
import { View } from 'react-native';
import styles from './styles/SideMenuStyle';
import { isFoodHubApp, isNonCustomerApp } from 't2sbasemodule/Utils/helpers';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { SCREEN_NAME, VIEW_ID } from './SideMenuConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import VersionNumber from 'react-native-version-number';
import { CP_VERSION } from '../../Utils/AppConfig';
import FastImage from 'react-native-fast-image';
import { handleJoinBetaClick } from 'appmodules/OrderManagementModule/Utils/OrderManagementHelper';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { getFoodhubLogoStatus } from 'appmodules/BaseModule/Utils/FeatureGateHelper';

let isFoodHub = isFoodHubApp();

const renderCustomerAppLogo = (foodhub_logo) => {
    let path = isFoodHub ? getFoodhubLogoStatus(foodhub_logo) : require('../../../FranchiseApp/Images/side_menu_cp_logo.png');
    return <FastImage style={styles.copyright} source={path} />;
};

const renderBetaLink = () => {
    return (
        <View style={styles.joinBetaViewStyle}>
            <T2SText
                id={VIEW_ID.JOIN_BETA_TEXT}
                screenName={SCREEN_NAME.SIDE_MENU}
                style={styles.joinBetaTextStyle}
                onPress={() => handleJoinBetaClick()}>
                {LOCALIZATION_STRINGS.JOIN_BETA_TEXT}
            </T2SText>
        </View>
    );
};
const SideMenuVersion = ({ handleVersion, foodhub_logo }) => {
    return (
        <View accessilbe={false} style={styles.versionContainer}>
            {isFoodHub && renderBetaLink()}
            <T2STouchableOpacity
                screenName={SCREEN_NAME.SIDE_MENU}
                id={VIEW_ID.APP_VERSION_TEXT}
                accessilbe={false}
                onPress={handleVersion}>
                <View>
                    {isNonCustomerApp() && renderCustomerAppLogo(foodhub_logo)}
                    <T2SText style={styles.versionNameText}>
                        {VersionNumber.appVersion} - {VersionNumber.buildVersion} {CP_VERSION}
                    </T2SText>
                </View>
            </T2STouchableOpacity>
        </View>
    );
};

export default React.memo(SideMenuVersion);
