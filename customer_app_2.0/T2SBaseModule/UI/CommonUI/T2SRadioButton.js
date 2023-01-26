import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { setFont } from '../../Utils/ResponsiveFont';

export default class RadioButton extends Component {
    render() {
        const { label, onPress, status, style, radioDotStyle } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.radioText}>{label}</Text>
                <TouchableOpacity style={[status ? styles.radioCircleSelected : styles.radioCircle, style]} onPress={onPress}>
                    {status && <View style={[styles.selectedRb, radioDotStyle]} />}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    radioText: {
        fontSize: setFont(15)
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.silver,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioCircleSelected: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primaryColor
    }
});
