import React, { useEffect, useState } from 'react';

import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';
import { FONT_ICON } from '../../../../CustomerApp/Fonts/FontIcon';

export const createAnimationData = (language) => {
    //for data to update when language changes
    return [
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_PROCESS, image: FONT_ICON.ORDER_STATUS_PROCESS },
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_RECEIVING, image: FONT_ICON.ORDER_STATUS_PROCESS },
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_DID_YOU, image: FONT_ICON.ORDER_STATUS_PERSONAL_DETAILS },
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_MANUALLY, image: FONT_ICON.ORDER_STATUS_PICK_UP_TIME },
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_HOLD_ON, image: FONT_ICON.ORDER_STATUS_PROCESS },
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_NOTIFICATION, image: FONT_ICON.ORDER_STATUS_NOTIFICATION },
        { text: LOCALIZATION_STRINGS.ORDER_STATUS_CROWD, image: FONT_ICON.ORDER_STATUS_CROWDED }
    ];
};

export let animationData = createAnimationData();

const AnimationTimerComponent = ({ seconds, updateData, languageKey }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [details, setDetails] = useState(animationData[0]);

    useEffect(() => {
        animationData = createAnimationData(languageKey);
    }, [languageKey]);

    useEffect(() => {
        setTimeLeft(seconds);
    }, [seconds]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft + 1);
        }, 1000);
        if (timeLeft >= 1 && timeLeft <= 10) {
            setDetails(animationData[0]);
        } else if (timeLeft >= 11 && timeLeft <= 20) {
            setDetails(animationData[1]);
        } else if (timeLeft >= 21 && timeLeft <= 25) {
            setDetails(animationData[2]);
        } else if (timeLeft >= 26 && timeLeft <= 35) {
            setDetails(animationData[3]);
        } else if (timeLeft >= 36 && timeLeft <= 45) {
            setDetails(animationData[4]);
        } else if (timeLeft >= 45 && timeLeft <= 60) {
            setDetails(animationData[5]);
        }
        if (timeLeft >= 60) {
            setDetails(animationData[animationData.length - 1]);
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [timeLeft]);
    useEffect(() => {
        updateData(details);
    }, [details, updateData]);
    return null;
};

export default React.memo(AnimationTimerComponent);
