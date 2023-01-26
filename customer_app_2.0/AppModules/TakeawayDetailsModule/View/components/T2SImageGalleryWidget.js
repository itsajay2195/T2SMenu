import React, { Component } from 'react';
import { FlatList, ImageBackground, View } from 'react-native';
import { style } from './styles/T2SImageGalleryWidgetStyles';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import FullScreenImageModalView from '../FullScreenImageModalView';
import GalleryModalView from '../GalleryModalView';
import { IMAGE_VALUES, SCREEN_NAME, VIEW_ID } from '../../Utils/TakeawayDetailsConstants';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { Text } from 'react-native-paper';

class T2SImageGalleryWidget extends Component {
    constructor() {
        super();
        this.state = {
            imageModalVisibleStatus: false,
            galleryModalVisibleStatus: false,
            tempImageURL: null,
            galleryImageModalVisibleStatus: false,
            index: null
        };
    }
    showModalView(visible, imageURL, index, data) {
        return this.setState({
            imageModalVisibleStatus: visible,
            tempImageURL: imageURL.image,
            index: index,
            images: data
        });
    }
    fullScreenImage(item, index, data) {
        return (
            <T2STouchableOpacity id={VIEW_ID.SHOW_IMAGE_MODEL_IMAGE_CLICK} onPress={this.showModalView.bind(this, true, item, index, data)}>
                <T2SFastImage
                    source={{ uri: item.image }}
                    style={style.imageGalleryStyle}
                    id={VIEW_ID.SHOW_GALLERY_IMAGE}
                    screenName={SCREEN_NAME.IMAGE_GALLERY_EXPANDING_MODEL}
                />
            </T2STouchableOpacity>
        );
    }
    showGalleryImageList(image) {
        return (
            <T2STouchableOpacity
                id={VIEW_ID.SHOW_IMAGE_GALLERY_MODEL_CLICK}
                onPress={() => this.setState({ galleryModalVisibleStatus: true })}>
                <ImageBackground source={{ uri: image }} style={style.imageBackgroundStyle}>
                    <View style={style.imageBackgroundOverlay}>
                        <T2SText
                            style={style.backgroundImageText}
                            id={VIEW_ID.BACKGROUND_IMAGE_TEXT}
                            screenName={SCREEN_NAME.IMAGE_GALLERY_EXPANDING_MODEL}>
                            {LOCALIZATION_STRINGS.GALLERY_IMAGE_COUNT}
                            {this.props.data.length - IMAGE_VALUES.IMAGE_COUNT}
                            {LOCALIZATION_STRINGS.GALLERY_BACKGROUND_IMAGE_STRING}
                        </T2SText>
                    </View>
                </ImageBackground>
            </T2STouchableOpacity>
        );
    }
    renderFlatList(data) {
        return (
            <FlatList
                data={data.slice(0, 4)}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                    isValidElement(data)
                        ? index === 3
                            ? this.showGalleryImageList(item.image)
                            : this.fullScreenImage(item, index, data)
                        : null
                }
                keyExtractor={(item, index) => index + ''}
            />
        );
    }

    renderImageFlatList(data) {
        return (
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => this.fullScreenImage(item, index, data)}
                keyExtractor={(item, index) => index + ''}
            />
        );
    }
    showImageModal() {
        return (
            <FullScreenImageModalView
                imageModalVisible={this.state.imageModalVisibleStatus}
                imageURL={this.state.tempImageURL}
                index={this.state.index}
                images={this.props.data}
                title={LOCALIZATION_STRINGS.GALLERY}
                isCuisine={false}
                onRequestClose={() => this.setState({ imageModalVisibleStatus: false })}
            />
        );
    }

    showGalleryModal(data) {
        return (
            <GalleryModalView
                galleryModalVisible={this.state.galleryModalVisibleStatus}
                images={data}
                onReqestClose={() => this.setState({ galleryModalVisibleStatus: false })}
            />
        );
    }

    render() {
        const { data } = this.props;
        return isValidElement(data) && data.length > 0 ? (
            <View style={style.mainContainer}>
                <Text style={style.imageGalleryTitleStyle}>{LOCALIZATION_STRINGS.GALLERY}</Text>
                {data.length > IMAGE_VALUES.IMAGE_COUNT ? this.renderFlatList(data) : this.renderImageFlatList(data)}
                {this.state.imageModalVisibleStatus && this.showImageModal()}
                {this.state.galleryModalVisibleStatus && this.showGalleryModal(data)}
            </View>
        ) : null;
    }
}

export default T2SImageGalleryWidget;
