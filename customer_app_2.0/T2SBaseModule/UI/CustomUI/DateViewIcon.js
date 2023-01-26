import React from 'react';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import CustomIcon from './/CustomIcon';
import T2STouchableOpacity from '../CommonUI/T2STouchableOpacity';
import Colors from '../../Themes/Colors';
import { Text, View } from 'react-native';
import { isValidString } from '../../Utils/helpers';
import styles from './styles/DateViewIconStyle';

const DateViewIcon = (props) => {
    const { screenName, id, onPress, icon, label, value, subItemValue } = props;
    return (
        <T2STouchableOpacity
            activeOpacity={0.7}
            screenName={screenName}
            id={id}
            style={styles.dateParentViewStyle}
            onPress={onPress}
            {...setTestId(screenName, id)}>
            <CustomIcon name={icon} size={40} style={{ color: Colors.textBlue }} />
            <View>
                <Text style={styles.dateTextDisplayStyle}>{label}</Text>
                <Text style={styles.datePlaceholderStyle}>{value}</Text>
                {isValidString(subItemValue) ? <Text style={styles.dateTextDisplayStyle}>{subItemValue}</Text> : null}
            </View>
        </T2STouchableOpacity>
    );
};

DateViewIcon.propType = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string
};
DateViewIcon.defaultProps = {
    icon: 'Calendar',
    label: 'Start date',
    value: 'DD-MM-YYYY',
    subItemValue: 'Starts at HH:MM'
};

export default DateViewIcon;
