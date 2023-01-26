import React from 'react';
import { Switch } from 'react-native-paper';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2SSwitch = (props) => {
    const { screenName, id } = props;
    return <Switch value={props.value} onValueChange={props.onValueChange} color={props.color} {...props} {...setTestId(screenName, id)} />;
};
T2SSwitch.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    onValueChange: PropTypes.func.isRequired,
    color: PropTypes.string
};
export default T2SSwitch;
