import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../Styles/CardComponentStyle';
import { PAYMENT_TYPE, VIEW_ID } from '../../Utils/QuickCheckoutConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import React, { useCallback, useState } from 'react';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import * as Analytics from '../../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../../AnalyticsModule/AnalyticsConstants';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import Colors from 't2sbasemodule/Themes/Colors';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Platform, StatusBar, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';
import { CHECKBOX_STATUS } from '../../../HomeModule/Utils/HomeConstants';

const CashNotApplicableText = React.memo(({ screenName }) => {
    return (
        <T2SText style={styles.notApplicableText} screenName={screenName} id={VIEW_ID.QC_CASH_NOT_APPLICABLE_FOR_DELIVERY_TEXT}>
            {` (${LOCALIZATION_STRINGS.NOT_APPLICABLE_FOR_DELIVERY})`}
        </T2SText>
    );
});

const CashNotApplicableInfoIcon = React.memo(({ screenName, setToolTipVisiblity }) => {
    const onPressEvent = () => {
        Analytics.logEvent(screenName, ANALYTICS_SCREENS.QC, {
            cash_not_applicable_info_icon_pressed: true
        });
        setToolTipVisiblity(true);
    };

    return (
        <T2STouchableOpacity style={styles.infoIconStyle} onPress={onPressEvent} accessible={false}>
            <T2SIcon
                screenName={screenName}
                id={VIEW_ID.QC_CASH_NOT_APPLICABLE_FOR_DELIVERY_TEXT}
                color={Colors.black}
                icon={FONT_ICON.INFO_ICON_UNFILLED}
                size={25}
            />
        </T2STouchableOpacity>
    );
});

const ToolTipComponent = React.memo(({ screenName, isThirdPartyDriverEnabled }) => {
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const onCloseEvent = () => {
        setToolTipVisible(false);
    };
    return (
        <Tooltip
            topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
            isVisible={toolTipVisible}
            placement={'bottom'}
            arrowSize={styles.toolTipArrowSize}
            displayInsets={styles.toolTipDisplayInsets}
            disableShadow={true}
            showChildInTooltip={false}
            content={
                <T2SText
                    style={styles.notApplicableHintText}
                    id={VIEW_ID.QC_CASH_NOT_APPLICABLE_FOR_DELIVERY_HINT_TEXT}
                    screenName={screenName}>
                    {LOCALIZATION_STRINGS.NOT_APPLICABLE_FOR_DELIVERY_HINT}
                </T2SText>
            }
            contentStyle={styles.toolTipContentStyle}
            arrowStyle={styles.toolTipArrowStyle}
            tooltipStyle={styles.toolTipViewStyle}
            allowChildInteraction={false}
            onClose={onCloseEvent}>
            {isValidElement(isThirdPartyDriverEnabled) && isThirdPartyDriverEnabled && (
                <CashNotApplicableInfoIcon screenName={screenName} setToolTipVisiblity={setToolTipVisible} />
            )}
        </Tooltip>
    );
});

const CashComponent = ({ screenName, itemClicked, isCashOptionSelected, isThirdPartyDriverEnabled, disabled }) => {
    const cashClicked = useCallback(() => {
        itemClicked(ANALYTICS_EVENTS.PAYMENT_CASH_CLICK, PAYMENT_TYPE.CASH, null);
    }, [itemClicked]);

    return (
        <T2STouchableOpacity activeOpacity={0.9} onPress={cashClicked} disabled={isThirdPartyDriverEnabled} accessible={false}>
            <View style={styles.cashRootContainer}>
                <View style={styles.childContainer}>
                    <RadioButton.Android
                        color={Colors.primaryColor}
                        style={styles.radioButtonStyle}
                        {...setTestId(screenName, VIEW_ID.QC_CASH + VIEW_ID.RADIO_BUTTON)}
                        status={isCashOptionSelected ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED}
                        disabled={disabled}
                        onPress={cashClicked}
                        accessible={false}
                    />
                    <T2SText
                        style={[styles.cashTextStyle, { color: isThirdPartyDriverEnabled ? Colors.suvaGrey : Colors.black }]}
                        screenName={screenName}
                        id={VIEW_ID.QC_CASH}>
                        {LOCALIZATION_STRINGS.CASH}
                        {isValidElement(isThirdPartyDriverEnabled) && isThirdPartyDriverEnabled && (
                            <CashNotApplicableText screenName={screenName} />
                        )}
                    </T2SText>
                    <ToolTipComponent screenName={screenName} isThirdPartyDriverEnabled={isThirdPartyDriverEnabled} />
                </View>
            </View>
        </T2STouchableOpacity>
    );
};

export default React.memo(CashComponent);
