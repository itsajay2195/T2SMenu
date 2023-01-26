import * as NavigationService from '../../../CustomerApp/Navigation/NavigationService';
import { isFoodHubApp, isValidElement, isValidString } from 't2sbasemodule/Utils/helpers';
import { Constants } from 't2sbasemodule/Utils/Constants';

export const isSegmentEnabled = (featureGateResponse) => {
    return (
        isFoodHubApp() &&
        isValidElement(featureGateResponse) &&
        isValidElement(featureGateResponse.segment_enabled) &&
        isValidElement(featureGateResponse.segment_enabled.status) &&
        featureGateResponse.segment_enabled.status === Constants.ENABLED
    );
};

export const isTPAnalyticsEnabled = (featureGateResponse) => {
    // If moengage need to be disabled, we will do code push
    // As there are some cases where we might miss it
    return isFoodHubApp();
};

export const getCurrentPage = (object) => {
    let currentPage = '';
    if (isValidElement(object)) {
        if (isValidElement(object.source)) {
            currentPage = object.source;
        } else if (isValidString(getCurrentPageFromNavigation())) {
            currentPage = getCurrentPageFromNavigation();
        } else if (isValidElement(object.current_page)) {
            currentPage = object.current_page;
        }
    }
    return currentPage;
};

export const getCurrentPageFromNavigation = () => {
    return isValidElement(NavigationService) &&
        isValidElement(NavigationService.navigationRef) &&
        isValidElement(NavigationService.navigationRef.current) &&
        isValidElement(NavigationService.navigationRef.current.getCurrentRoute()) &&
        isValidElement(NavigationService.navigationRef.current.getCurrentRoute().name)
        ? NavigationService.navigationRef.current.getCurrentRoute().name
        : '';
};

export const isOrderAvailable = (pendingAndCompletedOrder, recentOrdersResponse) => {
    let order = [];
    if (isValidElement(pendingAndCompletedOrder) && pendingAndCompletedOrder.length > 0) {
        order = pendingAndCompletedOrder;
    } else if (isValidElement(recentOrdersResponse) && isValidElement(recentOrdersResponse.data) && recentOrdersResponse.data.length > 0) {
        order = recentOrdersResponse.data;
    }

    return order;
};
