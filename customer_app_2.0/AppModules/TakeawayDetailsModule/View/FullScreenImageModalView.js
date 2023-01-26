import React, { Component } from 'react';
import { Modal, View } from 'react-native';
import { SCREEN_NAME as SCREEN_ID, VIEW_ID } from '../Utils/TakeawayDetailsConstants';
import { style } from './styles/ImageModalStyle';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import Swiper from 'react-native-swiper';
import T2SFastImage from 't2sbasemodule/UI/CommonUI/T2SFastImage';

class FullScreenImageModalView extends Component {
    render() {
        const { imageModalVisible, index, images, title, isCuisine } = this.props;
        return (
            <Modal visible={imageModalVisible}>
                <View style={style.mainContainerStyle}>
                    <T2SAppBar
                        title={title}
                        handleLeftActionPress={() => {
                            this.props.onRequestClose();
                        }}
                    />
                    <View style={style.imageViewStyle}>
                        <Swiper index={index} loop={false} dot={<View />} activeDot={<View />}>
                            {images.map((item) => (
                                <T2SFastImage
                                    key={item.id}
                                    style={style.imageStyle}
                                    source={{ uri: isCuisine ? item.image_url : item.image }}
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
}

export default FullScreenImageModalView;
