import { ImageBackground } from 'react-native';
import React from 'react';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import styles from '../../Styles/CarouselImageComponentStyle';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/HomeConstants';
import { T2SText } from 't2sbasemodule/UI';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';

const FoodSliderComponent = ({ language }) => {
    return (
        <T2SView
            style={styles.imageParentView}
            accessible={false}
            id={VIEW_ID.CUSTOM_DELIVERY_IMAGE_VIEW}
            screenName={SCREEN_NAME.HOME_SCREEN}>
            <ImageBackground style={styles.slideImage} source={require('../../../Images/order.png')} resizeMode="cover">
                <T2SText style={styles.imageTxt} id={VIEW_ID.CAROUSEL_IMAGE_TEXT} screenName={SCREEN_NAME.HOME_SCREEN}>
                    {LOCALIZATION_STRINGS.ORDER_ONLINE}
                </T2SText>
                <T2SText style={styles.imageTxt1} id={VIEW_ID.CAROUSEL_IMAGE_TEXT} screenName={SCREEN_NAME.HOME_SCREEN}>
                    {LOCALIZATION_STRINGS.IMAGE_COMPONENT_DISCOUNT_TEXT}
                </T2SText>
            </ImageBackground>
        </T2SView>
    );
};

export default FoodSliderComponent;
