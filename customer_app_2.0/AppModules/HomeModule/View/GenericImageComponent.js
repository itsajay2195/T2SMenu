import { View } from 'react-native';
import React from 'react';
import style from './Styles/DefaultImageComponentStyle';
import { SCREEN_NAME, VIEW_ID } from '../Utils/HomeConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableWithoutFeedback from 't2sbasemodule/UI/CommonUI/T2STouchableWithoutFeedback';
import { isValidURL } from 't2sbasemodule/Utils/helpers';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';

const GenericImageComponent = (props) => {
    const { screenName, imageURL } = props;
    //TODO: replace this image with original image
    return (
        <View>
            <T2STouchableWithoutFeedback id={VIEW_ID.DEFAULT_IMAGE} screenName={SCREEN_NAME.HOME_SCREEN}>
                <T2SFastImage
                    style={style.cardStyle}
                    source={{
                        uri: imageURL
                    }}
                    defaultImage={require('t2sbasemodule/Images/common/defaultGalleryImg.png')}
                    id={VIEW_ID.DEFAULT_IMAGE_BANNER_COMPONET}
                    screenName={SCREEN_NAME.HOME_SCREEN}
                />
            </T2STouchableWithoutFeedback>
            {!isValidURL(imageURL) && (
                <View style={style.wishingTextContainer}>
                    <View style={style.container}>
                        <View style={style.imageTextViewStyle}>
                            <T2SText
                                style={style.wishingTitleStyle}
                                screenName={screenName}
                                id={VIEW_ID.DEFAULT_IMAGE_COMPONENT_TITLE_TEXT}>
                                {LOCALIZATION_STRINGS.TITLE_WISH}
                            </T2SText>
                        </View>
                        <View style={style.imageTextViewStyle}>
                            <T2SText
                                style={style.wishingDescriptionStyle}
                                screenName={screenName}
                                id={VIEW_ID.DEFAULT_IMAGE_COMPONENT_SUBTITLE_TEXT}>
                                {LOCALIZATION_STRINGS.DESCRIPTION_WISH}
                            </T2SText>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};
export default GenericImageComponent;
