import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../Styles/QuickCheckoutStyles';
import { T2SCheckBox, T2SIcon } from 't2sbasemodule/UI';
import Colors from 't2sbasemodule/Themes/Colors';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import Tooltip from 'react-native-walkthrough-tooltip';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import React, { useState } from 'react';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';

const CheckBox = React.memo(({ contactFreeDelivery, handleContactFree }) => {
    return (
        <T2SCheckBox
            status={contactFreeDelivery}
            childrenWrapperStyle={{ backgroundColor: Colors.persianRed }}
            onPress={handleContactFree}
            textstyle={styles.checkBoxTextStyle}
            label={LOCALIZATION_STRINGS.CONTACT_FREE_DELIVERY_TITLE}
            screenName={SCREEN_NAME.BASKET_SCREEN}
            id={VIEW_ID.QC_CHECKBOX_FILL}
        />
    );
});

const ToolTipComponent = React.memo(({ screenName }) => {
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const onCloseEvent = () => {
        Analytics.logEvent(screenName, ANALYTICS_SCREENS.QC, {
            contact_free_info_icon_pressed: true
        });
        setToolTipVisible(false);
    };

    return (
        <Tooltip
            isVisible={toolTipVisible}
            placement={'top'}
            arrowSize={styles.toolTipArrowSize}
            displayInsets={styles.toolTipDisplayInsets}
            disableShadow={true}
            showChildInTooltip={false}
            content={
                <T2SText style={styles.contactLessDeliveryText} id={VIEW_ID.CONTACT_LESS_DELIVERY_TEXT} screenName={screenName}>
                    {LOCALIZATION_STRINGS.CONTACT_FREE_DELIVERY_DESCRIPTION}
                </T2SText>
            }
            contentStyle={styles.toolTipContentStyle}
            arrowStyle={styles.toolTipArrowStyle}
            tooltipStyle={styles.toolTipViewStyle}
            allowChildInteraction={false}
            onClose={onCloseEvent}>
            <ToolTipIcon setToolTipVisiblity={setToolTipVisible} screenName={screenName} />
        </Tooltip>
    );
});

const ToolTipIcon = React.memo(({ screenName, setToolTipVisiblity }) => {
    const onPressEvent = () => {
        Analytics.logEvent(screenName, ANALYTICS_SCREENS.QC, {
            contact_free_info_icon_pressed: true
        });
        setToolTipVisiblity(true);
    };
    return (
        <T2STouchableOpacity
            style={styles.infoIconContariner}
            accessible={false}
            screeName={screenName}
            id={VIEW_ID.INFO_ICON}
            onPress={onPressEvent}>
            <T2SIcon icon={FONT_ICON.INFO_ICON_UNFILLED} color={Colors.chipBlack} size={25} />
        </T2STouchableOpacity>
    );
});

const ContactLessFreeDelivery = ({ screenName, contactFreeDelivery, handleContactFree }) => {
    return (
        <T2SView style={styles.contactLessDeliveryContainerStyle}>
            <CheckBox contactFreeDelivery={contactFreeDelivery} handleContactFree={handleContactFree} />
            <ToolTipComponent screenName={screenName} />
        </T2SView>
    );
};

export default React.memo(ContactLessFreeDelivery);
