import React from 'react';
import { Dimensions, View } from 'react-native';
import { carousalHeight } from '../../Utils/HomeConstants';
import Swiper from 'react-native-swiper';
import styles from '../../Styles/CarouselImageComponentStyle';
import FoodSliderComponent from '../MicroComponents/FoodSliderComponent';
import { isUKApp } from 'appmodules/BaseModule/GlobalAppHelper';
import { isFoodHubApp, isFranchiseApp } from 't2sbasemodule/Utils/helpers';
import SavingSliderComponent from '../MicroComponents/SavingSliderComponent';

const { width } = Dimensions.get('window');

const CarouselImagesComponent = ({ countryId, currencySymbol, amount, text, language }) => {
    return (isFoodHubApp() && isUKApp(countryId)) || isFranchiseApp() ? (
        <Swiper
            index={0}
            width={width}
            height={carousalHeight}
            autoplay
            autoplayTimeout={5}
            showsVerticalScrollIndicator={false}
            paginationStyle={styles.paginationStyle}
            dot={<View style={styles.dotStyle} />}
            activeDot={<View style={styles.activeDotStyle} />}>
            <FoodSliderComponent language={language} />
            {isFranchiseApp() && <SavingSliderComponent currencySymbol={currencySymbol} amount={amount} text={text} language={language} />}
        </Swiper>
    ) : (
        <FoodSliderComponent language={language} />
    );
};

export default React.memo(CarouselImagesComponent);
