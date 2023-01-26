import React, { useCallback } from 'react';
import T2SModal from 't2sbasemodule/UI/CommonUI/T2SModal';
import * as Analytics from '../../AnalyticsModule/Analytics';
import { ANALYTICS_EVENTS } from '../../AnalyticsModule/AnalyticsConstants';
import { LOCALIZATION_STRINGS } from '../../LocalizationModule/Utils/Strings';
import { isValidElement } from 't2sbasemodule/Utils/helpers';

export default function DiscardChangesModal(props) {
    const {
        isVisible,
        title,
        screenName,
        analyticsScreenName,
        requestClose,
        handleNegativeButtonClicked,
        handlePositiveButtonClicked,
        positiveButtonText,
        negativeButtonText,
        description,
        onModalHide
    } = props;
    const handleDiscardChangesPositiveButtonClicked = useCallback(() => {
        Analytics.logEvent(analyticsScreenName, ANALYTICS_EVENTS.POSITIVE_BUTTON_CLICKED);
        handlePositiveButtonClicked();
    }, [analyticsScreenName, handlePositiveButtonClicked]);

    const handleDiscardChangesNegativeButtonClicked = useCallback(() => {
        Analytics.logEvent(analyticsScreenName, ANALYTICS_EVENTS.NEGATIVE_BUTTON_CLICKED);
        handleNegativeButtonClicked();
    }, [analyticsScreenName, handleNegativeButtonClicked]);
    const handleDiscardChangesHide = useCallback(() => {
        isValidElement(onModalHide) ? onModalHide() : null;
    }, [onModalHide]);
    return (
        <T2SModal
            isVisible={isVisible}
            screenName={screenName}
            isTitleVisible={false}
            title={isValidElement(title) ? title : LOCALIZATION_STRINGS.ATTENTION}
            description={isValidElement(description) ? description : LOCALIZATION_STRINGS.UNSAVED_DIALOG_DESCRIPTION}
            positiveButtonText={isValidElement(positiveButtonText) ? positiveButtonText : LOCALIZATION_STRINGS.SAVE}
            negativeButtonText={isValidElement(negativeButtonText) ? negativeButtonText : LOCALIZATION_STRINGS.DISCARD}
            positiveButtonClicked={handleDiscardChangesPositiveButtonClicked}
            negativeButtonClicked={handleDiscardChangesNegativeButtonClicked}
            requestClose={requestClose}
            onModalHide={handleDiscardChangesHide}
        />
    );
}
