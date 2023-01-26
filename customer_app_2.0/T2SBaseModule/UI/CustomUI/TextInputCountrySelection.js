import React, { useRef, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import T2SPopupMenu from './popupmenu/T2SPopupMenu';
import styles from './styles/TextInputCountrySelection';
import { setTestId } from '../../Utils/AutomationHelper';

const viewPropTypes = ViewPropTypes || View.propTypes;

const TextInputCountrySelection = (props) => {
    const {
        inputData,
        onSelected,
        textInputStyle,
        placeholder,
        maxLength,
        onChangeText,
        value,
        isValidNumber,
        underlineStyle,
        placeholderTextColor,
        menuItemContainerStyle,
        menuItemTextStyle,
        imageStyle,
        selectorImageStyle
    } = props;
    const menuRef = useRef();
    const [image, setImage] = useState(inputData[0].image);

    this.handleSelection = function(data) {
        inputData.map((item) => (item.key === data.key ? setImage(data.image) : null));
        onSelected(data);
    };
    return (
        <View>
            <View style={styles.horizontalContainer}>
                <T2SPopupMenu
                    menuItemContainerStyle={menuItemContainerStyle}
                    menuItemTextStyle={menuItemTextStyle}
                    imageStyle={imageStyle}
                    selectorImageStyle={selectorImageStyle}
                    selector={true}
                    showImage={true}
                    inputData={inputData}
                    ref={menuRef}
                    onSelected={(data) => this.handleSelection(data)}
                    {...setTestId(props.screenName, props.id)}
                    button={
                        <TouchableOpacity onPress={() => menuRef.current.show()}>
                            <View style={styles.buttonStyle}>
                                <Image source={image} style={styles.image} />
                                <View style={{ justifyContent: 'center' }}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={require('../../Images/common/grey_down_arrow.png')}
                                        style={styles.arrowStyle}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
                <View style={styles.underline} />
                <TextInput
                    placeholderTextColor={placeholderTextColor}
                    underlineColorAndroid="transparent"
                    selectionColor={'grey'}
                    style={[styles.textInputStyle, textInputStyle]}
                    onChangeText={(inputText) => onChangeText(inputText)}
                    value={value}
                    keyboardType="phone-pad"
                    maxLength={maxLength}
                    placeholder={placeholder}
                    {...setTestId(props.screenName, props.id)}
                />
                {isValidNumber ? <Image source={require('../../Images/common/checkMark.png')} style={styles.tickStyle} /> : null}
            </View>
            <View style={[styles.horizontalLine, underlineStyle]} />
        </View>
    );
};
TextInputCountrySelection.propTypes = {
    textInputStyle: Text.propTypes.style,
    underlineStyle: viewPropTypes.style,
    inputData: PropTypes.array.isRequired,
    onSelected: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    isValidNumber: PropTypes.bool,
    placeholderTextColor: PropTypes.string,
    menuItemContainerStyle: viewPropTypes.style,
    menuItemTextStyle: Text.propTypes.style,
    imageStyle: viewPropTypes.style,
    selectorImageStyle: viewPropTypes.style,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
TextInputCountrySelection.defaultProps = {
    placeholder: 'Enter Mobile Number',
    maxLength: 11,
    isValidNumber: false,
    placeholderTextColor: '#CCCCCC'
};
export default TextInputCountrySelection;
