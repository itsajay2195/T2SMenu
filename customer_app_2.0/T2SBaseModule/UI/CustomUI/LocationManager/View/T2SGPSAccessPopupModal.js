import React, { Component } from 'react';
import T2SModal from '../../../CommonUI/T2SModal';
import { LOCALIZATION_STRINGS } from 'appmodules/LocalizationModule/Utils/Strings';
import { openSettings } from 'react-native-permissions';
import { showErrorMessage } from '../../../../Network/NetworkHelpers';
import { isValidElement } from '../../../../Utils/helpers';

export default class T2SGPSAccessPopupModal extends Component {
    render() {
        const {
            isVisible,
            onPresentModal,
            onDismissModal,
            requestClose,
            negativeButtonClicked,
            positiveButtonClicked,
            dialogCancelable,
            title,
            description,
            positiveButtonText,
            negativeButtonText
        } = this.props;
        return (
            <T2SModal
                dialogCancelable={dialogCancelable}
                title={title}
                description={description}
                isVisible={isVisible}
                requestClose={() => {
                    requestClose();
                }}
                negativeButtonText={negativeButtonText}
                negativeButtonClicked={() => {
                    negativeButtonClicked();
                }}
                positiveButtonText={positiveButtonText}
                positiveButtonClicked={() => {
                    try {
                        openSettings();
                    } catch (error) {
                        showErrorMessage(isValidElement(error) ? error.message : LOCALIZATION_STRINGS.COULD_NOT_OPEN_SETTING);
                    }

                    positiveButtonClicked();
                }}
                onPresent={() => onPresentModal()}
                onDismiss={() => onDismissModal()}
            />
        );
    }
}
T2SModal.defaultProps = {
    title: LOCALIZATION_STRINGS.REQUITED_GPS_ACCESS,
    description: LOCALIZATION_STRINGS.NO_GPS_MESSAGE,
    negativeButtonText: LOCALIZATION_STRINGS.CANCEL,
    positiveButtonText: LOCALIZATION_STRINGS.GO_TO_SETTINGS,
    dialogCancelable: true,
    titleCenter: false,
    textAllCaps: true,
    negativeButtonId: 'negativeButton',
    positiveButtonId: 'positiveButton',
    screenName: 'Modal'
};
