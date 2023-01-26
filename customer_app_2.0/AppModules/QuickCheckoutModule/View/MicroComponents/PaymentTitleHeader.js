import { Text, View } from 'react-native';
import styles from '../Styles/FullPagePaymentCheckoutStyles';
import React from 'react';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isFranchiseApp } from 't2sbasemodule/Utils/helpers';

const PaymentTitleHeader = ({ screenName, sourceUrl, currency, total }) => {
    return (
        <View style={styles.bodyContainerView}>
            <T2SFastImage
                screenName={screenName}
                source={{ uri: sourceUrl }}
                defaultImageStyle={styles.defaultStyle}
                style={styles.imageStyle}
                resizeMode="contain"
                defaultImage={
                    isFranchiseApp()
                        ? require('../../../../FranchiseApp/Images/no_image_small_pattern.png')
                        : require('../../../../FoodHubApp/HomeModule/Utils/Images/no_image.png')
                }
            />
            <Text style={styles.textStyle}>
                Thanks for ordering. Pay
                <T2SText style={styles.totalTextStyle}>
                    {' '}
                    {currency}
                    {total}{' '}
                </T2SText>
                securely by using the below methods.
            </Text>
        </View>
    );
};

export default React.memo(PaymentTitleHeader);
