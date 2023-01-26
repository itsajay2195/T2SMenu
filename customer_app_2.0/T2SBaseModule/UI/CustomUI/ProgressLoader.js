import React from 'react';
import { ActivityIndicator, Modal, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../../Themes';

const ProgressLoader = ({ loading = false, color = '#F47925', size, opacity = 0.4, title = '' }) => {
    return (
        <Modal transparent animationType={'none'} visible={loading} onRequestClose={() => null}>
            {Platform.OS === 'android' ? (
                <View>
                    <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
                </View>
            ) : null}
            <View style={[styles.modalBackground, { backgroundColor: `rgba(0,0,0,${opacity})` }]}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator animating={loading} color={color} size={size} />
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

ProgressLoader.propTypes = {
    loading: PropTypes.bool.isRequired,
    color: PropTypes.string,
    size: PropTypes.string,
    opacity: PropTypes.number,
    title: PropTypes.string
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicatorWrapper: {
        backgroundColor: Colors.white,
        height: 100,
        width: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        position: 'absolute',
        paddingTop: 50
    }
});

export default ProgressLoader;
