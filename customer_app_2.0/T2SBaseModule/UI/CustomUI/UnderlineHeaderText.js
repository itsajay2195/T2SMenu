import React from 'react';
import { Text, View, ViewPropTypes } from 'react-native';
import styles from './styles/UnderlineHeaderTextStyle';
import PropTypes from 'prop-types';
// if ViewPropTypes is not defined fall back to View.propType (to support RN < 0.44)
const viewPropTypes = ViewPropTypes || View.propTypes;
const UnderlineHeaderText = (props) => {
    return (
        <View style={[props.containerStyle]}>
            <Text style={[styles.textStyle, props.textStyle]}>{props.text}</Text>
            {props.children}
            <View style={[styles.underline, props.underlineStyle]} />
        </View>
    );
};
UnderlineHeaderText.propTypes = {
    text: PropTypes.string.isRequired,
    textStyle: Text.propTypes.style,
    underlineStyle: viewPropTypes.style,
    containerStyle: viewPropTypes.style
};

export default UnderlineHeaderText;
