import React from 'react';
import T2SImageBackground from 't2sbasemodule/UI/CommonUI/T2SImageBackground';
import styles from '../Styles/LandingPageStyle';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';

const FHSplashComponent = () => {
    return (
        <T2SImageBackground style={styles.splashImage} source={require('../Utils/Images/fh_splash_bg.png')}>
            <T2SImage style={styles.foodHubLogoStyle} resizeMode={'contain'} source={require('../Utils/Images/logo.png')} />
        </T2SImageBackground>
    );
};

export default FHSplashComponent;
