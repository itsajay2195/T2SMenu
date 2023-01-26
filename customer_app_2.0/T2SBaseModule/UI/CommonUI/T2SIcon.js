import React from 'react';
import CustomIcon from '../CustomUI/CustomIcon';
import PropTypes from 'prop-types';
import { customerAppTheme } from '../../../CustomerApp/Theme';
import { setTestId } from '../../Utils/AutomationHelper';
import { isValidElement } from '../../Utils/helpers';

const T2SIcon = ({ icon, name, style, size, onPress, id, screenName, color }) => {
    const iconName = isValidElement(icon) ? icon : name;
    return <CustomIcon name={iconName} style={style} size={size} color={color} onPress={onPress} {...setTestId(screenName, id)} />;
};

T2SIcon.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    icon: PropTypes.string
};
T2SIcon.defaultProps = {
    size: 30,
    color: customerAppTheme.colors.text,
    icon: null,
    name: '',
    id: '',
    screenName: ''
};

export default T2SIcon;
