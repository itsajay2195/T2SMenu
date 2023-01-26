import * as NavigationService from './NavigationService';
import { SCREEN_OPTIONS } from './ScreenOptions';
import { TYPES_SIDE_MENU } from '../Redux/Actions/Types';
import { isValidElement } from 't2sbasemodule/Utils/helpers';
import { showErrorMessage } from 't2sbasemodule/Network/NetworkHelpers';
import { store } from '../Redux/Store/ConfigureStore';

export const handleNavigation = (routeName, params = undefined, redirectScreen = undefined) => {
    let navigateTo = null;
    if (isValidElement(routeName)) {
        /**
         * Non side menu screens will handled here
         * We should pass only the route name when the view is not available in side menu
         */
        navigateTo = routeName;
    } else if (isValidElement(redirectScreen)) {
        if (redirectScreen === SCREEN_OPTIONS.SOCIAL_LOGIN.route_name) {
            /**
             * This condition for updating the side menu selection after login
             */
            navigateTo = SCREEN_OPTIONS.HOME.route_name;
        } else {
            store.dispatch({ type: TYPES_SIDE_MENU.SET_ACTIVE_SIDE_MENU, activeMenu: redirectScreen });
            navigateTo = redirectScreen;
        }
    } else {
        showErrorMessage('Route Name is not updated properly');
    }
    if (isValidElement(navigateTo)) {
        if (isValidElement(params)) {
            NavigationService.navigate(navigateTo, params);
        } else {
            NavigationService.navigate(navigateTo);
        }
    }
};

export const handleGoBack = () => {
    NavigationService.goBack();
};
