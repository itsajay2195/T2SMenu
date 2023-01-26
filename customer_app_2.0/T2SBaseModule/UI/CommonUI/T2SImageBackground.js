import React from 'react';
import { ImageBackground } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2SImageBackground = ({ screenName, id, style, source, children }) => {
    return (
        <ImageBackground style={style} source={source} {...setTestId(screenName, id)}>
            {children}
        </ImageBackground>
    );
};

T2SImageBackground.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

T2SImageBackground.defaultProps = {
    screenName: '',
    id: '',
    style: {},
    source: {}
};
export default T2SImageBackground;
