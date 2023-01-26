import React from 'react';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { IconButton } from 'react-native-paper';
import styles from './Style/IconStyle';
import { customerAppTheme } from '../../../CustomerApp/Theme';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';

const T2SIconButton = ({ style, icon, onPress, screenName, id }) => {
    return <IconButton style={[styles.iconButtonStyle, style]} icon={icon} onPress={onPress} {...setTestId(screenName, id)} />;
};

T2SIconButton.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    disabled: PropTypes.bool,
    animated: PropTypes.bool,
    onPress: PropTypes.func.isRequired
};
T2SIconButton.defaultProps = {
    color: customerAppTheme.colors.text,
    style: {},
    icon: FONT_ICON.ADD,
    screenName: '',
    id: ''
};

export default T2SIconButton;
