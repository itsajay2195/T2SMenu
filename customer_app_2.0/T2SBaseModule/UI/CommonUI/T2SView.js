import React from 'react';
import { View } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2SView = (props) => {
    return (
        <View style={props.style} {...setTestId(props.screenName, props.id)} {...props}>
            {props.children}
        </View>
    );
};

T2SView.propType = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default T2SView;
