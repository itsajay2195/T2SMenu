import React, { useEffect, useState, useCallback } from 'react';
import { selectedDriverTipsItem, updateDriverTips } from '../../Redux/BasketAction';
import { connect } from 'react-redux';
import styles from '../Styles/DriverTipsStyle';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { MAX_TIP_VALUE, SCREEN_NAME, VIEW_ID } from '../../Utils/BasketConstants';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2STextInput from 't2sbasemodule/UI/CommonUI/T2STextInput';
import { formatTipValue } from '../../Utils/BasketHelper';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { isValidElement, isValidString, safeFloatRoundedValue, safeIntValue, safeStringValue } from 't2sbasemodule/Utils/helpers';
import { Keyboard, View } from 'react-native';
import { selectCurrencyFromBasket } from 't2sbasemodule/Utils/AppSelectors';

let screenName = SCREEN_NAME.BASKET_SCREEN;

const DriverTips = (props) => {
    const [tips, setTip] = useState('');
    const [customTip, setCustomTip] = useState(null);
    const [driverTipsList] = useState([...props?.driverTipsList, ...[LOCALIZATION_STRINGS.OTHER_TEXT]]);
    const [showCustomTips, setShowCustomTips] = useState(props?.selectedDriverTips?.item === LOCALIZATION_STRINGS.OTHER_TEXT);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const onTipPress = useCallback(
        (value, index, isOtherClick) => {
            if (tips?.toString() === value?.toString()) {
                setTip('');
                props.updateDriverTips(0.0);
                props.selectedDriverTipsItem(null, null);
            } else if (value === LOCALIZATION_STRINGS.OTHER_TEXT) {
                if (!showCustomTips) {
                    setShowKeyboard(true);
                    props.selectedDriverTipsItem(value, index);
                }
                setTip('');
                setShowCustomTips(!showCustomTips);
                setCustomTip('');
                props.updateDriverTips(0.0);
                if (isOtherClick) {
                    props.selectedDriverTipsItem(null, null);
                } else {
                    props.selectedDriverTipsItem(value, index);
                }
            } else {
                setTip(value + '');
                if (isValidString(customTip)) {
                    setCustomTip('');
                }
                props.selectedDriverTipsItem(value, index);
                props.updateDriverTips(value + '%');
                setShowCustomTips(false);
            }
            Keyboard.dismiss();
        },
        [customTip, props, tips, showCustomTips]
    );
    const onChangeTip = (value) => {
        updateTip(value);
        setCustomTip(value);
        props.updateDriverTips(value);
    };
    useEffect(() => {
        const { driverTips } = props;
        if (isValidElement(tips) && !isValidElement(driverTips)) {
            setCustomTip('');
            setTip('');
        }
        /* eslint-disable-next-line */
    }, [props?.driverTips]);

    const updateTip = (tip) => {
        tip = safeFloatRoundedValue(tip) / 10000;
        if (tip <= MAX_TIP_VALUE && !safeStringValue(tip)?.includes('.')) {
            setTip(safeIntValue(tip));
        } else {
            setTip('');
        }
    };
    const DriverListUI = () => {
        return driverTipsList?.map((item, index) => {
            return (
                <TipAmount
                    key={item.id}
                    item={item}
                    itemIndex={index}
                    selectedItem={tips}
                    onTipPress={onTipPress}
                    currency={props.currency}
                    showCustomTips={showCustomTips}
                    selectedDriverTips={props.selectedDriverTips}
                />
            );
        });
    };

    useEffect(() => {
        const { driverTips } = props;
        let tip = isValidElement(driverTips) ? driverTips : 0;
        //TODO we have to check when the tip value have gap between each item like 1/5/7
        // When the decimal points given as input like 1.00/2.00/3.00 we have to set the tip as selected while coming back to basket screen
        // If required we will enable this one
        // if (tip > maxTip || safeStringValue(tip)?.includes('.')) {
        //     setCustomTip(tip);
        // }
        if (showCustomTips) {
            setCustomTip(driverTips);
        }
        updateTip(tip);
        /* eslint-disable-next-line */
    }, []);
    return (
        <T2SView onLayout={props.onLayout} style={styles.container} screenName={screenName} id={VIEW_ID.DRIVER_TIPS_VIEW}>
            <T2SView style={styles.titleContainer} screenName={screenName} id={VIEW_ID.DRIVER_TIPS_VIEW}>
                <View style={styles.addTipTitleText}>
                    <T2SIcon
                        name={FONT_ICON.CASH}
                        size={30}
                        style={styles.iconStyle}
                        screenName={screenName}
                        id={VIEW_ID.DRIVER_TIPS_ICON}
                    />
                    <T2SText screenName={screenName} id={VIEW_ID.DRIVER_TIPS} style={styles.titleStyle}>
                        {LOCALIZATION_STRINGS.ADD_TIP_TEXT}
                    </T2SText>
                </View>
                <T2SText screenName={screenName} id={VIEW_ID.DRIVER_TIPS_VALUE} style={styles.tipsValueText}>{`${props.currency} ${
                    isValidElement(props.driverTips) ? props.driverTips : '0'
                }`}</T2SText>
            </T2SView>
            <View style={styles.priceContainer} screenName={screenName} id={VIEW_ID.DRIVER_TIPS_LIST_VIEW}>
                {DriverListUI()}
            </View>
            {showCustomTips && (
                <CustomTip
                    customTip={customTip}
                    onChangeTip={onChangeTip}
                    showKeyboard={showKeyboard}
                    currency={props.currency}
                    onFocus={props.onFocus}
                />
            )}
        </T2SView>
    );
};

const CustomTip = ({ customTip, onChangeTip, currency, onFocus, showKeyboard }) => {
    return (
        <View style={styles.customView}>
            <T2SText style={styles.customInput} id={VIEW_ID.CURRENCY_SYMBOL} screenName={screenName}>
                {currency}
            </T2SText>
            <T2STextInput
                autoFocus={showKeyboard ? showKeyboard : !isValidString(customTip)}
                returnKeyType="done"
                placeholder={LOCALIZATION_STRINGS.ENTER_TIP_AMOUNT}
                style={styles.customTip}
                screenName={screenName}
                id={VIEW_ID.DRIVER_TIPS_CUSTOM_TEXTBOX}
                maxLength={5}
                onChangeText={(value) => onChangeTip(formatTipValue(value))}
                multiline={false}
                value={customTip}
                blurOnSubmit={true}
                onFocus={onFocus}
                keyboardType={'numeric'}
            />
        </View>
    );
};

const TipAmount = ({ item, selectedItem, onTipPress, showCustomTips, itemIndex, selectedDriverTips }) => {
    let isOtherText = item === LOCALIZATION_STRINGS.OTHER_TEXT;
    let isActiveItem =
        selectedItem === item?.toString() || selectedDriverTips?.item?.toString() === item?.toString() || (showCustomTips && isOtherText);
    return (
        <>
            <T2STouchableOpacity
                style={styles.tipContainer}
                onPress={() => onTipPress(item, itemIndex, isActiveItem && isOtherText)}
                screenName={screenName}
                id={VIEW_ID.DRIVER_TIPS_TOUCH}>
                <T2SView
                    style={isActiveItem ? styles.activeTip : styles.inActiveTip}
                    screenName={screenName}
                    id={VIEW_ID.DRIVER_TIPS_VALUE}>
                    <T2SText
                        style={isActiveItem ? styles.activeTextStyle : styles.inActiveTextStyle}
                        screenName={screenName}
                        id={VIEW_ID.DRIVER_TIPS_AMOUNT_VALUE}>
                        {' ' + item}
                        {!isOtherText ? '%' : ''}
                    </T2SText>
                </T2SView>
            </T2STouchableOpacity>
            {!isActiveItem && !isOtherText && selectedDriverTips?.itemIndex - 1 !== itemIndex && <View style={styles.tipsDivider} />}
        </>
    );
};

const mapStateToProps = (state) => ({
    currency: selectCurrencyFromBasket(state),
    driverTips: state.basketState.viewBasketResponse?.driver_tip?.value,
    driverTipsList: state.appState.s3ConfigResponse?.driver_tip,
    selectedDriverTips: state.basketState.selectedDriverTips
});
const mapDispatchToProps = {
    updateDriverTips,
    selectedDriverTipsItem
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverTips);
