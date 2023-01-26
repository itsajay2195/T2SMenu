import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const SizedBox = (props) => {
    const { width, height } = props;
    return <View style={{ width: width, height: height }} {...props} />;
};
SizedBox.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number
};
SizedBox.defaultProps = {
    height: 10
};
export default SizedBox;
