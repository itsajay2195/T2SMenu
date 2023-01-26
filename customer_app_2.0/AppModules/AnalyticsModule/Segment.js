import * as Braze from './Braze';

export const trackEvent = (featureGateResponse, event, object = {}, value = null) => {
    Braze.trackEvent(featureGateResponse, event, object);
};

export const trackEventNonInteractiveEvent = (featureGateResponse, event, object = {}, value = null) => {
    Braze.trackEvent(featureGateResponse, event, object, false);
};
