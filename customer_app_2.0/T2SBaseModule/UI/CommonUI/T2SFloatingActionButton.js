import React from 'react';
import PropTypes from 'prop-types';
import styles from './Style/FloatingActionButtonStyle';
import CustomIcon from '../CustomUI/CustomIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import { isValidString } from '../../Utils/helpers';
import { setTestId } from '../../Utils/AutomationHelper';

const T2SFloatingActionButton = ({
    screenName,
    id,
    onPress,
    icon,
    iconSize,
    floatingButtonStyle,
    floatingButtonIconStyle,
    floatingButtonTextStyle,
    name
}) => {
    return (
        <TouchableOpacity activeOpacity={0.7} style={floatingButtonStyle} onPress={onPress} {...setTestId(screenName, id)}>
            <CustomIcon size={iconSize} name={icon} style={floatingButtonIconStyle} />
            {isValidString(name) ? <Text style={floatingButtonTextStyle}>{name}</Text> : null}
        </TouchableOpacity>
    );
};

T2SFloatingActionButton.propType = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    iconSize: PropTypes.number,
    name: PropTypes.string
};
T2SFloatingActionButton.defaultProps = {
    icon: 'Plus',
    iconSize: 30,
    floatingButtonStyle: styles.floatingButtonStyle,
    floatingButtonIconStyle: styles.floatingButtonIconStyle,
    floatingButtonTextStyle: styles.floatingButtonTextStyle,
    name: ''
};

export default T2SFloatingActionButton;
