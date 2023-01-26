import React from 'react';
import { Image } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';

const T2SImage = ({ screenName, id, style, resizeMode, source }) => {
    return <Image style={style} resizeMode={resizeMode} source={source} {...setTestId(screenName, id)} />;
};

T2SImage.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

T2SImage.defaultProps = {
    screenName: '',
    id: '',
    style: {},
    source: {},
    resizeMode: 'cover'
};
export default T2SImage;
