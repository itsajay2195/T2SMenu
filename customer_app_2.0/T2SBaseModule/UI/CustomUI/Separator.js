import React from 'react';
import { View } from 'react-native';

import styles from './styles/DividerStyle';
import PropTypes from 'prop-types';

const Separator = ({ color }) => {
    return <View style={[styles.divider, { borderBottomColor: color }]} />;
};

Separator.defaultProps = {
    color: '#EEEEEE'
};

Separator.propTypes = {
    color: PropTypes.string
};

export default Separator;
