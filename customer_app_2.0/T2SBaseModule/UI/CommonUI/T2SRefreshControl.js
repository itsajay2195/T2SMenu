import React from 'react';
import { RefreshControl } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2SRefreshControl = (props) => {
    return (
        <RefreshControl style={props.style} {...setTestId(props.screenName, props.id)} {...props}>
            {props.children}
        </RefreshControl>
    );
};

T2SRefreshControl.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default T2SRefreshControl;
