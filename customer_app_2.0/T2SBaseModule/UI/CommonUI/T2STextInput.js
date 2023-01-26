import React, { Fragment } from 'react';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { Text, TextInput, withTheme } from 'react-native-paper';
import { customerAppTheme } from '../../../CustomerApp/Theme';
import { View, ViewPropTypes } from 'react-native';
import styles from './Style/T2STextInputStyle';
import { Colors } from 't2sbasemodule/Themes';
import { isValidElement } from '../../Utils/helpers';
const viewPropTypes = ViewPropTypes || View.propTypes;

const T2STextInput = (props) => {
    const {
        screenName,
        id,
        error,
        label,
        required,
        errorText,
        maxLength,
        style,
        blurOnSubmit,
        inputRef,
        keyboardType,
        autoCapitalize,
        returnKeyType,
        editable,
        secureTextEntry,
        autoFocus,
        textContentType,
        scrollEnabled,
        autoCorrect,
        onChangeText,
        onEndEditing,
        onFocus,
        multiline
    } = props;
    const setInputRef = (ref) => {
        if (typeof inputRef === 'function') {
            return inputRef(ref, id);
        }
        return inputRef;
    };
    const setOnFocus = () => {
        if (typeof onFocus === 'function') {
            return onFocus(id);
        }
        return onFocus;
    };

    const setOnEndEditing = () => {
        if (typeof onEndEditing === 'function') {
            return onEndEditing(id);
        }
        return onEndEditing;
    };

    return (
        <Fragment>
            <TextInput
                {...props}
                ref={setInputRef}
                onChangeText={(input) => onChangeText(input, id)}
                onEndEditing={setOnEndEditing}
                onFocus={setOnFocus}
                dense={true}
                selectionColor={Colors.tabGrey}
                blurOnSubmit={blurOnSubmit}
                maxLength={maxLength}
                autoCorrect={isValidElement(autoCorrect) ? props.autoCorrect : false}
                {...setTestId(screenName, id)}
                style={[style, styles.textInputStyle]}
                theme={{ colors: { primary: customerAppTheme.colors.divider } }}
                underlineColor={props.dontShowUnderLine ? Colors.transparent : Colors.dividerGrey}
                label={labelText(error, label, required)}
                multiline={isValidElement(multiline) ? multiline : false}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                returnKeyType={returnKeyType}
                editable={editable}
                secureTextEntry={secureTextEntry}
                autoFocus={autoFocus}
                textContentType={textContentType}
                scrollEnabled={scrollEnabled}
            />
            {error && isValidElement(errorText) ? (
                <Text style={styles.errorStyle} theme={{ colors: { text: customerAppTheme.colors.error } }}>
                    {errorText}
                </Text>
            ) : null}
        </Fragment>
    );
};
const labelText = (error, label, required) => {
    return (
        <Text
            style={styles.errorStyle}
            theme={{
                colors: {
                    text: error ? customerAppTheme.colors.error : Colors.mildYellow
                }
            }}>
            {label} {required ? <Text theme={{ colors: { text: customerAppTheme.colors.error } }}>*</Text> : null}
        </Text>
    );
};
//This default props values are getting from React native docs and react native paper
T2STextInput.defaultProps = {
    blurOnSubmit: false,
    multiline: false,
    keyboardType: 'default',
    autoCapitalize: 'sentences',
    returnKeyType: 'default',
    editable: true,
    secureTextEntry: false,
    autoFocus: false,
    textContentType: 'none',
    scrollEnabled: false,
    dontShowUnderLine: false
};

T2STextInput.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    style: viewPropTypes.style,
    required: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string,
    maxLength: PropTypes.number,
    blurOnSubmit: PropTypes.bool,
    dontShowUnderLine: PropTypes.bool,
    keyboardType: PropTypes.string,
    multiline: PropTypes.bool,
    editable: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    autoFocus: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    returnKeyType: PropTypes.string,
    textContentType: PropTypes.string
};
function propCheck(prevProps, nextProps) {
    return (
        prevProps.screenName === nextProps.screenName &&
        prevProps.id === nextProps.id &&
        prevProps.label === nextProps.label &&
        prevProps.value === nextProps.value &&
        prevProps.style === nextProps.style &&
        prevProps.required === nextProps.required &&
        prevProps.error === nextProps.error &&
        prevProps.errorText === nextProps.errorText &&
        prevProps.maxLength === nextProps.maxLength &&
        prevProps.dontShowUnderLine === nextProps.dontShowUnderLine &&
        prevProps.blurOnSubmit === nextProps.blurOnSubmit &&
        prevProps.autoCorrect === nextProps.autoCorrect &&
        prevProps.keyboardType === nextProps.keyboardType &&
        prevProps.multiline === nextProps.multiline &&
        prevProps.secureTextEntry === nextProps.secureTextEntry &&
        prevProps.autoCapitalize === nextProps.autoCapitalize &&
        prevProps.returnKeyType === nextProps.returnKeyType &&
        prevProps.editable === nextProps.editable &&
        prevProps.autoFocus === nextProps.autoFocus &&
        prevProps.textContentType === nextProps.textContentType &&
        prevProps.scrollEnabled === nextProps.scrollEnabled
    );
}
export default withTheme(React.memo(T2STextInput, propCheck));
