import { Image, ImageBackground } from 'react-native';
import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/CarouselImageComponentStyle';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import { T2SText } from 't2sbasemodule/UI';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import ShowTotalSavingsComponent from './ShowTotalSavingsComponent';

const SavingSliderComponent = ({ currencySymbol, amount, text }) => {
    return (
        <T2SView
            style={styles.imageParentView}
            accessible={false}
            id={VIEW_ID.CUSTOM_TOTALSAVINGS_IMAGE_VIEW}
            screenName={SCREEN_NAME.HOME_SCREEN}>
            <ImageBackground
                style={[styles.slideImage, { justifyContent: 'center' }]}
                resizeMode="cover"
                source={require('../../../Images/savings.png')}>
                <Image style={styles.walletImage} source={require('../../Utils/Images/wallet1.png')} resizeMode="contain" />
                {isValidString(amount) && <ShowTotalSavingsComponent currency={currencySymbol} amount={amount} />}
                <T2SText style={styles.savingsTxt} id={VIEW_ID.CAROUSEL_IMAGE_TEXT} screenName={SCREEN_NAME.HOME_SCREEN}>
                    {text}
                </T2SText>
            </ImageBackground>
        </T2SView>
    );
};

export default React.memo(SavingSliderComponent);
