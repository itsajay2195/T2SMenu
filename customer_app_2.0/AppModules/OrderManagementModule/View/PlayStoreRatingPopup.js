import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './Styles/OrderStatusStyle';

const PlayStoreRatingPopup = (props) => {
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../Images/SmileGoodYellow.png')} style={{ width: 35, height: 35 }} />
            <Text style={styles.appRatingTitleText}>Enjoying Foodhub?</Text>
            <Text style={styles.appRatingDescriptionText}>Would you like to share your feedback by rating us on the play store?</Text>
        </View>
    );
};

export default PlayStoreRatingPopup;
