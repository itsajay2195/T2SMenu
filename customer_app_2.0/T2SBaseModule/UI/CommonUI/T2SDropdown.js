import React, { Component } from 'react';

import { Image, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import T2SPopupMenu from '../CustomUI/popupmenu/T2SPopupMenu';
import styles from './Style/T2SDropdownStyle';
import { setTestId } from '../../Utils/AutomationHelper';

const viewPropTypes = ViewPropTypes || View.propTypes;
class T2SDropdown extends Component {
    constructor(props) {
        super(props);
        this.dropDownRef = React.createRef();
    }

    render() {
        const {
            inputData,
            onSelected,
            underlineStyle,
            iconStyle,
            textStyle,
            icon,
            disabled,
            menuItemTextStyle,
            horizontalLineStyle,
            showUnderline = true
        } = this.props;
        return (
            <View>
                <T2SPopupMenu
                    menuItemTextStyle={menuItemTextStyle}
                    selector={true}
                    inputData={inputData}
                    ref={this.dropDownRef}
                    onSelected={(data) => onSelected(data)}
                    value={this.props.value}
                    {...setTestId(this.props.screenName, this.props.id)}
                    button={
                        <TouchableOpacity disabled={disabled} onPress={() => this.dropDownRef.current.show()}>
                            <View style={styles.subContainer}>
                                <Text style={disabled ? [styles.disableTextStyle, textStyle] : [styles.textStyle, textStyle]}>
                                    {this.props.value}
                                </Text>
                                {disabled ? null : (
                                    <View>
                                        <Image
                                            source={icon ? icon : require('../../Images/common/black_down_arrow.png')}
                                            style={[styles.arrowStyle, iconStyle]}
                                        />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    }
                />
                {showUnderline && (
                    <View style={[horizontalLineStyle ? styles.withOutHorizontalLine : styles.horizontalLine, underlineStyle]} />
                )}
            </View>
        );
    }
}
T2SDropdown.propTypes = {
    underlineStyle: viewPropTypes.style,
    iconStyle: viewPropTypes.style,
    textStyle: Text.propTypes.style,
    inputData: PropTypes.array.isRequired,
    onSelected: PropTypes.func.isRequired,
    value: PropTypes.string,
    icon: PropTypes.number,
    disabled: PropTypes.bool,
    menuItemTextStyle: Text.propTypes.style,
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
export default T2SDropdown;
