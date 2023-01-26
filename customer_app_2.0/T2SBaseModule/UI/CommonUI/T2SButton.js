import React from 'react';
import { Text, View, ViewPropTypes } from 'react-native';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { Button, withTheme } from 'react-native-paper';
import { setTestId } from '../../Utils/AutomationHelper';
import { isValidElement } from '../../Utils/helpers';
import Colors from 't2sbasemodule/Themes/Colors';

const viewPropTypes = ViewPropTypes || View.propTypes;
/**
 * contentStyle - Styles of button's inner content. Use this prop to apply custom height and width.
 * buttonStyle - Actual style properties
 * @param props
 * @returns {*}
 * @constructor
 */
const T2SButton = ({
    icon,
    onPress,
    disabled,
    uppercase,
    buttonTextStyle,
    buttonStyle,
    contentStyle,
    color,
    id,
    title,
    screenName,
    style,
    mode,
    opacity
}) => {
    return (
        <Button
            icon={icon}
            onPress={onPress}
            disabled={disabled}
            uppercase={uppercase}
            mode={mode}
            opacity={opacity}
            labelStyle={[styles.textStyle, buttonTextStyle]}
            style={isValidElement(style) ? style : buttonStyle}
            contentStyle={[styles.contentStyle, contentStyle]}
            color={isValidElement(color) ? color : Colors.primaryColor}
            {...setTestId(screenName, id)}>
            {title}
        </Button>
    );
};
T2SButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.string,
    buttonStyle: viewPropTypes.style,
    contentStyle: viewPropTypes.style,
    buttonTextStyle: Text.propTypes.style,
    uppercase: PropTypes.bool,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string,
    title: PropTypes.string.isRequired
};
T2SButton.defaultProps = {
    icon: null,
    disabled: false,
    uppercase: true,
    buttonTextStyle: {},
    buttonStyle: {},
    contentStyle: {},
    color: Colors.primaryColor,
    id: '',
    title: '',
    screenName: '',
    style: null,
    mode: 'contained',
    opacity: 1,
    textAllCaps: true
};
export default withTheme(T2SButton);
