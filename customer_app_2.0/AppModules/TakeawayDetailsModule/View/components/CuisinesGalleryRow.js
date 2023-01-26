import React, { Component } from 'react';
import { SCREEN_NAME, VIEW_ID } from '../../Utils/TakeawayDetailsConstants';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import styles from '../../../../FoodHubApp/TakeawayListModule/Style/CuisinesStyles';
import { View } from 'react-native';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import { getCuisineColorCode } from '../../../../FoodHubApp/TakeawayListModule/Utils/Helper';
import LinearGradient from 'react-native-linear-gradient';

const screenName = SCREEN_NAME.INFORMATION;
class CuisinesGalleryRow extends Component {
    constructor(props) {
        super(props);
        this.image = null;
        this.state = {
            errorImage: false
        };
        this.onError = this.onError.bind(this);
    }

    render() {
        const { item, index } = this.props;
        return (
            <LinearGradient
                colors={getCuisineColorCode(index)}
                start={{
                    x: 0,
                    y: 0.5
                }}
                end={{
                    x: 0,
                    y: 1
                }}
                style={styles.mainContainer}>
                <View style={styles.sizeForCuisineContainer}>{this.renderCuisineImage(item)}</View>
                <T2SText
                    style={[styles.cuisinesTypeUnselected, styles.cuisinesText]}
                    id={VIEW_ID.CUISINE_NAME + item?.name}
                    screenName={screenName}>
                    {item?.name}
                </T2SText>
            </LinearGradient>
        );
    }

    renderCuisineImage(item) {
        const { errorImage } = this.state;
        if (errorImage === false && isValidElement(item?.image_url)) {
            return (
                <T2SFastImage
                    source={{ uri: encodeURI(item?.image_url) }}
                    style={styles.imageGalleryStyle}
                    resizeMode="contain"
                    id={VIEW_ID.SHOW_GALLERY_IMAGE + item?.name}
                    onError={this.onError}
                    screenName={screenName}
                />
            );
        } else {
            return (
                <T2SImage
                    id={VIEW_ID.SHOW_GALLERY_IMAGE + item?.name}
                    screenName={screenName}
                    source={require('t2sbasemodule/Images/common/no-image.png')}
                    resizeMode="contain"
                    style={styles.defaultImageStyle}
                />
            );
        }
    }

    onError() {
        this.setState({ errorImage: true });
    }
}

export default CuisinesGalleryRow;
