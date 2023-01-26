import { TouchableHighlight } from 'react-native';
import Colors from 't2sbasemodule/Themes/Colors';
import { AutocompleteStyle } from '../../Styles/AutocompleteStyle';
import { Text } from 'react-native-paper';
import React from 'react';

const TopComponentItem = ({ onPress, addressText, item }) => {
    const handleOnPress = () => {
        onPress(item);
    };
    return (
        <TouchableHighlight onPress={handleOnPress} underlayColor={Colors.lighterGrey} style={AutocompleteStyle.listItemStyle}>
            <Text numberOfLines={2} ellipsizeMode="tail">
                {addressText}
            </Text>
        </TouchableHighlight>
    );
};
const propsAreEqual = (prevProps, nextProps) => {
    return prevProps.addressText === nextProps.addressText;
};
export default React.memo(TopComponentItem, propsAreEqual);
