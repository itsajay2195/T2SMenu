import React from 'react';
import FastImage from 'react-native-fast-image';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { isFoodHubApp, isFranchiseApp, isValidImageUrl } from '../../Utils/helpers';
import { Image } from 'react-native';

const TakeawayBackgroundImage = (props) => {
    const { screenName, id, source, style } = props;
    if (isValidImageUrl(source.uri)) {
        return <FastImage {...props} {...setTestId(screenName, id)} />;
    } else if (isFoodHubApp()) {
        return <Image resizeMode="contain" source={require('../../../FoodHubApp/HomeModule/Utils/Images/no_image.png')} style={style} />;
    } else if (isFranchiseApp()) {
        return <Image resizeMode="contain" source={require('../../../FranchiseApp/Images/no_image_small_pattern.png')} style={style} />;
    }
};
TakeawayBackgroundImage.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
export default TakeawayBackgroundImage;
