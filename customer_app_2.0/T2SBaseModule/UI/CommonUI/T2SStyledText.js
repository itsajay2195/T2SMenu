import React from 'react';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../Utils/Constants';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import StyledText from 'react-native-styled-text';
import { TextColorStyle } from './Style/TextColorStyle';

const T2SStyledText = (props) => {
    return (
        <StyledText
            textStyles={TextColorStyle}
            numberOfLines={props.numberOfLines}
            style={[style.style, props.style]}
            {...props}
            {...setTestId(props.screenName, props.id)}>
            {props.children}
        </StyledText>
    );
};

const style = StyleSheet.create({
    style: {
        fontFamily: FONT_FAMILY.REGULAR
    }
});

T2SStyledText.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default T2SStyledText;
