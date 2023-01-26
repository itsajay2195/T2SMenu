import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const viewPropTypes = ViewPropTypes || View.propTypes;

const CardView = (props) => {
    return <View style={props.cardStyle}>{props.children}</View>;
};

CardView.propTypes = {
    children: PropTypes.any,
    cardStyle: viewPropTypes.style
};
export default CardView;
