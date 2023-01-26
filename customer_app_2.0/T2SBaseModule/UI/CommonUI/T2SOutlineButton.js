import React from 'react';
import { Text, View, ViewPropTypes } from 'react-native';
import styles from './Style/ButtonStyle';
import PropTypes from 'prop-types';
import { withTheme } from 'react-native-paper';
import { setTestId } from '../../Utils/AutomationHelper';
import T2SButton from './T2SButton';

const viewPropTypes = ViewPropTypes || View.propTypes;
const T2SOutlineButton = (props) => {
    const { outlineButtonStyle, textStyleBlack } = styles;
    return (
        <T2SButton
            {...props}
            {...setTestId(props.screenName, props.id)}
            buttonStyle={[outlineButtonStyle, props.buttonStyle]}
            color={props.color} //color applies to selector & icon
            buttonTextStyle={[textStyleBlack, props.buttonTextStyle]}
            onPress={props.onPress}
            title={props.title}
            mode={'outlined'}
            disabled={props.disabled}
            icon={props.icon}
            uppercase={props.uppercase}
        />
    );
};

T2SOutlineButton.propTypes = {
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
T2SOutlineButton.defaultProps = {
    textAllCaps: true,
    color: '#333333',
    screenName: '',
    id: '',
    buttonStyle: {},
    buttonTextStyle: {},
    onPress: () => {},
    title: '',
    disabled: false,
    icon: '',
    uppercase: false
};
export default withTheme(T2SOutlineButton);
