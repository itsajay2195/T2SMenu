import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { AssuranceModalStyle } from '../Styles/AssuranceModalStyle';
import { Platform, ScrollView } from 'react-native';
import T2SView from 't2sbasemodule/UI/CommonUI/T2SView';
import { T2SIcon } from 't2sbasemodule/UI';
import { FONT_ICON } from '../../../CustomerApp/Fonts/FontIcon';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS, ANALYTICS_SCREENS } from '../../AnalyticsModule/AnalyticsConstants';
import { SCREEN_NAME, VIEW_ID } from '../Utils/AuthConstants';
import T2SText from 't2sbasemodule/UI/CommonUI/T2SText';
import { isFranchiseApp } from 't2sbasemodule/Utils/helpers';
import Config from 'react-native-config';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';

const screenName = SCREEN_NAME.ASSURANCE_MODAL;
class AssuranceModal extends Component {
    constructor(props) {
        super(props);
        this.handleCloseIconAction = this.handleCloseIconAction.bind(this);
    }

    state = {
        keyboardSpace: 0
    };

    render() {
        return (
            <Modal
                style={[AssuranceModalStyle.modalStyle]}
                isVisible
                onModalShow={() => {}}
                onBackdropPress={() => this.props.onModalClose(false)}
                animationInTiming={250}
                backdropTransitionInTiming={0}
                animationOutTiming={250}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating={true}
                useNativeDriver={false}>
                {this.renderCloseIcon()}
                {this.showAssuranceContent()}
            </Modal>
        );
    }

    renderCloseIcon() {
        return (
            <T2SView style={AssuranceModalStyle.closeIconContainer}>
                <T2SIcon
                    name={FONT_ICON.CLOSE}
                    style={AssuranceModalStyle.closeIconStyle}
                    onPress={this.handleCloseIconAction}
                    id={VIEW_ID.CLOSE_ICON}
                />
            </T2SView>
        );
    }

    showAssuranceContent() {
        return (
            <T2SView screenName={screenName} id={VIEW_ID.MORE_CONTENT_CONTAINER} style={AssuranceModalStyle.textContainerStyle}>
                <T2SText screenName={screenName} id={VIEW_ID.MORE_CONTENT_TITLE} style={AssuranceModalStyle.titleStyle}>
                    {Platform.OS === 'ios' ? LOCALIZATION_STRINGS.SOCIAL_ASSURANCE_TITLE_IOS : LOCALIZATION_STRINGS.SOCIAL_ASSURANCE_TITLE}
                </T2SText>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <T2SText screenName={screenName} id={VIEW_ID.MORE_CONTENT_INFO} style={AssuranceModalStyle.contentStyle}>
                        {Platform.OS === 'ios'
                            ? LOCALIZATION_STRINGS.formatString(
                                  LOCALIZATION_STRINGS.SOCIAL_ASSURANCE_MESSAGE_IOS,
                                  isFranchiseApp() ? Config.APP_NAME : LOCALIZATION_STRINGS.FOODHUB
                              )
                            : LOCALIZATION_STRINGS.formatString(
                                  LOCALIZATION_STRINGS.SOCIAL_ASSURANCE_MESSAGE,
                                  isFranchiseApp() ? Config.APP_NAME : LOCALIZATION_STRINGS.FOODHUB
                              )}
                    </T2SText>
                </ScrollView>
            </T2SView>
        );
    }

    handleCloseIconAction() {
        Analytics.logAction(ANALYTICS_SCREENS.ORDER_TYPE, ANALYTICS_EVENTS.ICON_CLOSE);
        this.props.onModalClose();
    }
}

export default AssuranceModal;
