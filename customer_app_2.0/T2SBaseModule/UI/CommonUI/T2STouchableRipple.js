import React from 'react';
import PropTypes from 'prop-types';
import { setTestId } from '../../Utils/AutomationHelper';
import { TouchableRipple } from 'react-native-paper';

const T2STouchableRipple = (props) => {
    return (
        <TouchableRipple {...props} {...setTestId(props.screenName, props.id)} onPress={props.onPress} underlayColor={'rgba(0, 0, 0, 0)'}>
            {props.children}
        </TouchableRipple>
    );
};
T2STouchableRipple.propTypes = {
    onPress: PropTypes.func.isRequired,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
export default T2STouchableRipple;
