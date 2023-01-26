import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_FAMILY } from '../../Utils/Constants';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';
import { Colors } from '../../Themes';
import { setFont } from '../../Utils/ResponsiveFont';

const HyperlinkText = (props) => {
    return (
        <TouchableOpacity {...props} {...setTestId(props.screenName, props.id)}>
            <Text {...props} style={[style.style, props.style]}>
                {props.name}
            </Text>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    style: {
        color: Colors.textBlue,
        fontSize: setFont(14),
        fontFamily: FONT_FAMILY.REGULAR
    }
});

HyperlinkText.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export default HyperlinkText;
