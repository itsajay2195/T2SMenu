import React from 'react';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../Utils/Constants';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';

const T2SText = (props) => {
    return (
        <Text numberOfLines={props.numberOfLines} style={[style.style, props.style]} {...props} {...setTestId(props.screenName, props.id)}>
            {props.children}
        </Text>
    );
};

const style = StyleSheet.create({
    style: {
        fontFamily: FONT_FAMILY.REGULAR
    }
});

T2SText.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default T2SText;
