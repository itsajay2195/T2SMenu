import React from 'react';
import { TouchableOpacity } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2STouchableOpacity = (props) => {
    return (
        <TouchableOpacity {...props} {...setTestId(props.screenName, props.id)}>
            {props.children}
        </TouchableOpacity>
    );
};

T2STouchableOpacity.propType = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
T2STouchableOpacity.defaultProps = {
    activeOpacity: 0.7
};

export default T2STouchableOpacity;
