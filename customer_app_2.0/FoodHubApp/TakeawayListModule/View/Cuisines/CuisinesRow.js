import React, { Component } from 'react';
import { View } from 'react-native';
import { T2STouchableOpacity } from 't2sbasemodule/UI';
import styles from '../../Style/CuisinesStyles';
import { SCREEN_NAME, VIEW_ID } from 'appmodules/TakeawayDetailsModule/Utils/TakeawayDetailsConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { isValidString, isValidElement } from 't2sbasemodule/Utils/helpers';
import T2SImage from 't2sbasemodule/UI/CommonUI/T2SImage';
import T2SIcon from 't2sbasemodule/UI/CommonUI/T2SIcon';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';
import { getCuisineColorCode } from '../../Utils/Helper';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 't2sbasemodule/Themes';

const screenName = SCREEN_NAME.IMAGE_GALLERY_EXPANDING_MODEL;
class CuisinesRow extends Component {
    constructor(props) {
        super(props);
        this.image = null;
        this.onError = this.onError.bind(this);
        this.state = {
            errorImage: true,
            isFromTakeawayList: isValidElement(this.props.isFromTakeawayList) && this.props.isFromTakeawayList
        };
    }

    render() {
        const { handleCheckBox, itemName, isSelected, itemCount, showCuisineCount, index } = this.props;
        const { isFromTakeawayList } = this.state;
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
                style={isFromTakeawayList ? styles.takeawayMainContainer : styles.mainContainer}>
                <T2STouchableOpacity
                    id={VIEW_ID.CUISINE_SELECTED}
                    screenName={screenName}
                    style={{ flex: 1, alignItems: 'center' }}
                    onPress={() => handleCheckBox(itemName)}>
                    {this.renderCuisineImage()}

                    <T2SText
                        style={[
                            isSelected ? styles.cuisinesTypeText : styles.cuisinesTypeUnselected,
                            isFromTakeawayList ? styles.takeawayCuisinesTypeText : styles.cuisinesText
                        ]}
                        id={VIEW_ID.CUISINE_NAME + itemName}
                        screenName={screenName}
                        ellipsizeMode="tail">
                        {itemName}
                        {showCuisineCount && ' (' + itemCount + ')'}
                    </T2SText>
                </T2STouchableOpacity>
                {isSelected && (
                    <View style={styles.imageTickView}>
                        <T2SIcon
                            icon={FONT_ICON.NOTIFY_SUCCESS}
                            color={Colors.black}
                            size={22}
                            screenName={SCREEN_NAME.TAKEAWAY_LIST_SCREEN}
                            id={VIEW_ID.HEART_ICON}
                        />
                    </View>
                )}
            </LinearGradient>
        );
    }

    onError() {
        this.setState({ errorImage: false });
    }

    renderCuisineImage() {
        const { itemName, imageUrl } = this.props;
        const { isFromTakeawayList, errorImage } = this.state;
        if (isValidElement(imageUrl) && errorImage) {
            return (
                <T2SFastImage
                    source={{ uri: isValidString(imageUrl) && errorImage ? encodeURI(imageUrl) : null }}
                    style={isFromTakeawayList ? styles.takeawayImageGalleryStyle : styles.imageGalleryStyle}
                    resizeMode="contain"
                    id={VIEW_ID.SHOW_GALLERY_IMAGE + itemName}
                    onError={this.onError}
                    screenName={screenName}
                />
            );
        } else {
            return (
                <T2SImage
                    id={VIEW_ID.SHOW_GALLERY_IMAGE + itemName}
                    screenName={screenName}
                    source={require('t2sbasemodule/Images/common/no-image.png')}
                    resizeMode="contain"
                    style={isFromTakeawayList ? styles.takeawayImageGalleryStyle : styles.defaultImageStyle}
                />
            );
        }
    }
}

export default React.memo(CuisinesRow);
