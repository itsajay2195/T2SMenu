import React from 'react';
import { Text, View, ViewPropTypes } from 'react-native';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { setTestId } from '../../Utils/AutomationHelper';
import T2SButton from './T2SButton';
import Colors from '../../Themes/Colors';
import { customerAppTheme } from '../../../CustomerApp/Theme';

const viewPropTypes = ViewPropTypes || View.propTypes;
const T2SFlatButton = ({
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
    opacity,
    accessible,
    compact
}) => {
    return (
        <T2SButton
            theme={customerAppTheme.colors.primaryButton}
            icon={icon}
            accessible={accessible}
            disabled={disabled}
            uppercase={uppercase}
            contentStyle={contentStyle}
            style={style}
            opacity={opacity}
            {...setTestId(screenName, id)}
            buttonStyle={buttonStyle}
            color={color}
            buttonTextStyle={[styles.flatButtonTextStyle, buttonTextStyle]}
            onPress={onPress}
            title={title}
            mode={mode}
            compact={compact}
        />
    );
};

T2SFlatButton.propTypes = {
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
T2SFlatButton.defaultProps = {
    icon: null,
    disabled: false,
    uppercase: false,
    buttonTextStyle: {},
    buttonStyle: {},
    contentStyle: {},
    color: Colors.primaryColor,
    id: '',
    title: '',
    screenName: '',
    style: null,
    mode: 'text',
    opacity: 1,
    textAllCaps: true,
    compact: true
};
export default T2SFlatButton;
