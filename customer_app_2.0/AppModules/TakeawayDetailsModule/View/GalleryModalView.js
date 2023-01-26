import React, { Component } from 'react';
import { FlatList, Modal, View } from 'react-native';
import T2STouchableOpacity from 't2sbasemodule/UI/CommonUI/T2STouchableOpacity';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { SCREEN_NAME as SCREEN_ID, VIEW_ID } from '../Utils/TakeawayDetailsConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { Style } from './styles/GalleryModalStyle';
import { style } from './styles/ImageModalStyle';
import Swiper from 'react-native-swiper';
import { T2SIcon } from 't2sbasemodule/UI';

class GalleryModalView extends Component {
    constructor() {
        super();
        this.state = {
            imageModalVisibleStatus: false,
            tempImageURL: null,
            index: null
        };
    }

    imageModalStatus(visible, imageURL, index) {
        return this.setState({ imageModalVisibleStatus: visible, tempImageURL: imageURL, index: index });
    }

    imageRenderItem(image, index) {
        return (
            <View style={Style.imageGalleryItemViewStyle}>
                <T2STouchableOpacity
                    id={VIEW_ID.SHOW_IMAGE_GALLERY_MODEL_CLICK}
                    onPress={this.imageModalStatus.bind(this, true, image, index)}>
                    <T2SFastImage
                        style={Style.galleryImageStyle}
                        source={{ uri: image }}
                        id={VIEW_ID.SHOW_MODAL_GALLERY_IMAGE}
                        screenName={SCREEN_ID.GALLERY_MODAL_VIEW}
                    />
                </T2STouchableOpacity>
            </View>
        );
    }

    renderFlatList(images) {
        return (
            <FlatList
                data={images}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => this.imageRenderItem(item.image, index)}
                numColumns={2}
                keyExtractor={(item, index) => index + ''}
            />
        );
    }

    showImageModal() {
        const { images } = this.props;
        return (
            <Modal visible={this.state.imageModalVisibleStatus}>
                <View style={Style.mainContainerViewStyle}>
                    <T2SAppBar
                        title={LOCALIZATION_STRINGS.GALLERY}
                        handleLeftActionPress={() => {
                            this.setState({ imageModalVisibleStatus: false });
                        }}
                    />
                    <View style={style.imageViewStyle}>
                        <Swiper loop={false} index={this.state.index} dot={<View />} activeDot={<View />}>
                            {images.map((item) => (
                                <T2SFastImage
                                    key={item.id}
                                    style={style.imageStyle}
                                    source={{ uri: item.image }}
                                    id={VIEW_ID.SHOW_MODAL_IMAGE}
                                    screenName={SCREEN_ID.IMAGE_MODAL_VIEW}
                                />
                            ))}
                        </Swiper>
                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        const { galleryModalVisible, images } = this.props;
        return (
            <View>
                <Modal visible={galleryModalVisible}>
                    <View style={Style.mainContainerViewStyle}>
                        <T2SAppBar
                            title={LOCALIZATION_STRINGS.GALLERY}
                            handleLeftActionPress={() => {
                                this.props.onReqestClose();
                            }}
                            actions={
                                <T2STouchableOpacity
                                    id={VIEW_ID.CLOSE_IMAGE_GALLERY_MODEL_CLICK}
                                    onPress={() => {
                                        this.props.onReqestClose();
                                    }}
                                    screenName={SCREEN_ID.GALLERY_MODAL_VIEW}>
                                    <T2SIcon icon={FONT_ICON.CLOSE} />
                                </T2STouchableOpacity>
                            }
                        />
                        {this.renderFlatList(images)}
                    </View>
                    {this.state.imageModalVisibleStatus && this.showImageModal()}
                </Modal>
            </View>
        );
    }
}

export default GalleryModalView;
