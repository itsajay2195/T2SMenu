import { View } from 'react-native';
import React, { useCallback } from 'react';
import styles from './Styles/GetItByStyles';
import { RadioButton } from 'react-native-paper';
import { CHECKBOX_CONSTANTS, CONSTANTS, VIEW_ID } from '../Utils/QuickCheckoutConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SPreorderTiming from 't2sbasemodule/UI/CommonUI/T2SPreorderTiming/T2SPreorderTiming';
import Colors from 't2sbasemodule/Themes/Colors';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import { isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { setTestId } from 't2sbasemodule/Utils/AutomationHelper';

const TimeWidget = React.memo(({ screenName, preOrderDates, selectedType, itemClicked }) => {
    if (isValidElement(preOrderDates)) {
        return (
            <View>
                <Divider screenName={screenName} />
                <View style={styles.timeContainer}>
                    <T2SPreorderTiming initialTime={selectedType} screenName={screenName} dates={preOrderDates} onPress={itemClicked} />
                </View>
            </View>
        );
    } else {
        return <NoSlotText screenName={screenName} />;
    }
});

const NoSlotText = React.memo(({ screenName }) => {
    return (
        <View>
            <Divider screenName={screenName} />
            <T2SText
                style={[styles.immediateTextStyle, { color: Colors.middleGrey }]}
                screenName={screenName}
                id={VIEW_ID.NO_SLOTS_AVAILABLE}>
                {LOCALIZATION_STRINGS.NOSLOT}
            </T2SText>
        </View>
    );
});

const Divider = React.memo(({ screenName }) => {
    return (
        <View style={styles.timeDividerContainer}>
            <View style={styles.itemDividerStyle} />
            <T2SText id={VIEW_ID.QC_GET_IT_BY_DIVIDER} screenName={screenName} style={styles.dividerTextStyle}>
                {'( ' + LOCALIZATION_STRINGS.OR + ' )'}
            </T2SText>
            <View style={styles.itemDividerStyle} />
        </View>
    );
});

const ASAPComponent = React.memo(({ screenName, itemClicked, selectedType, isImmediateAvailable }) => {
    const onClicked = useCallback(() => {
        if (isValidElement(itemClicked)) {
            itemClicked(CONSTANTS.IMMEDIATELY);
        }
    }, [itemClicked]);

    return (
        <T2SView style={styles.RadioButtonContainer}>
            <RadioButton.Android
                color={Colors.primaryColor}
                status={
                    isImmediateAvailable && (!isValidString(selectedType) || selectedType === CONSTANTS.IMMEDIATELY)
                        ? CHECKBOX_CONSTANTS.CHECKED
                        : CHECKBOX_CONSTANTS.UNCHECKED
                }
                onPress={onClicked}
                disabled={!isImmediateAvailable}
                accessible={false}
                {...setTestId(screenName, VIEW_ID.ASAP_RADIO)}
            />
            <T2STouchableOpacity disabled={!isImmediateAvailable} onPress={onClicked} accessible={false}>
                <T2SText
                    style={[styles.immediateTextStyle, { color: !isImmediateAvailable ? Colors.greyHeaderText : Colors.darkBlack }]}
                    screenName={screenName}
                    id={VIEW_ID.ASAP_TEXT}>
                    {LOCALIZATION_STRINGS.ASAP}
                </T2SText>
            </T2STouchableOpacity>
        </T2SView>
    );
});

const GetItByComponent = ({ screenName, itemClicked, selectedType, isImmediateAvailable, preOrderDates }) => {
    return (
        <T2SView>
            <ASAPComponent
                screenName={screenName}
                itemClicked={itemClicked}
                isImmediateAvailable={isImmediateAvailable}
                selectedType={selectedType}
            />
            <TimeWidget screenName={screenName} itemClicked={itemClicked} preOrderDates={preOrderDates} selectedType={selectedType} />
        </T2SView>
    );
};

export default React.memo(GetItByComponent);
