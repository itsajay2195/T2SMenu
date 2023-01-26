import React, { Component } from 'react';
import { Modal, View } from 'react-native';
import { SCREEN_NAME, VIEW_ID } from '../Utils/OrderManagementConstants';
import { style } from './Styles/LikedExperienceModalStyle';
import T2SAppBar from 't2sbasemodule/UI/CommonUI/T2SAppBar';
import { WebView } from 'react-native-webview';
import { AppConfig } from '../../../CustomerApp/Utils/AppConfig';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';

class LikedExperienceModal extends Component {
    render() {
        const { likedExperienceModalVisible, onHideModal } = this.props;
        return (
            <Modal visible={likedExperienceModalVisible} animationType={'slide'}>
                <View style={style.mainContainerStyle}>
                    <T2SAppBar
                        title={LOCALIZATION_STRINGS.RATE_US}
                        handleLeftActionPress={() => {
                            onHideModal();
                        }}
                    />
                    <WebView
                        useWebKit={true}
                        id={VIEW_ID.LIKED_EXP_WEBVIEW}
                        screenName={SCREEN_NAME.LIKED_EXPERIENCE}
                        style={style.innerContainer}
                        source={{ uri: AppConfig.FOOD_HUB_TRUST_PILOT_URL_UK }}
                        renderError={(e) => {
                            //LINT escape
                        }}
                        scalesPageToFit={false}
                    />
                </View>
            </Modal>
        );
    }
}

export default LikedExperienceModal;
