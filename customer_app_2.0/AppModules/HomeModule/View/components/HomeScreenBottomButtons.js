import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { handleNavigation } from '../../../../CustomerApp/Navigation/Helper';
import { SCREEN_OPTIONS } from '../../../../CustomerApp/Navigation/ScreenOptions';
import { selectCartItems } from '../../../BasketModule/Redux/BasketSelectors';
import T2SButton from 't2sbasemodule/UI/CommonUI/T2SButton';
import { VIEW_ID } from '../../Utils/HomeConstants';
import styles from '../Styles/HomeBottomButtonStyle';
import * as Analytics from 'appmodules/AnalyticsModule/Analytics';
import { NO } from '../../../MenuModule/Utils/MenuConstants';
import RepeatAddOnContainer from '../../../MenuModule/View/Components/RepeatAddOnContainer';
import { ANALYTICS_SCREENS, ANALYTICS_EVENTS } from '../../../AnalyticsModule/AnalyticsConstants';
import { selectHasUserLoggedIn } from 't2sbasemodule/Utils/AppSelectors';
import { isArrayNonEmpty, isValidElement } from 't2sbasemodule/Utils/helpers';
import { redirectRouteAction } from '../../../../CustomerApp/Redux/Actions';
import { CommonActions } from '@react-navigation/native';
import { LOCALIZATION_STRINGS } from '../../../LocalizationModule/Utils/Strings';

const HomeScreenBottomButtons = (props) => {
    const handleBasketClick = () => {
        const { isUserLoggedIn, navigation } = props;
        if (isUserLoggedIn) {
            handleNavigationForLoggedInUser();
        } else {
            props.redirectRouteAction(SCREEN_OPTIONS.BASKET.route_name);
            navigation.navigate(SCREEN_OPTIONS.SOCIAL_LOGIN.route_name);
        }
    };
    const handleNavigationForLoggedInUser = () => {
        const { basketStoreID, navigation } = props;
        if (isValidElement(basketStoreID)) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 2,
                    routes: [
                        { name: SCREEN_OPTIONS.HOME.route_name },
                        {
                            name: SCREEN_OPTIONS.MENU_SCREEN.route_name,
                            params: { isFromReOrder: false, isFromCartIcon: true }
                        },
                        { name: SCREEN_OPTIONS.BASKET.route_name }
                    ]
                })
            );
        }
    };
    return (
        <View>
            <RepeatAddOnContainer fromHome={true} />
            <View style={styles.viewButtonContainer}>
                <T2SButton
                    title={props.title}
                    onPress={() => {
                        handleNavigation(SCREEN_OPTIONS.MENU_SCREEN.route_name, {
                            keyboardFocus: NO
                        });
                        Analytics.logEvent(ANALYTICS_SCREENS.HOME_SCREEN, ANALYTICS_EVENTS.VIEW_MENU_CLICKED);
                    }}
                    id={VIEW_ID.VIEW_MENU_BTN}
                    screenName={SCREEN_OPTIONS.HOME.route_name}
                    buttonStyle={styles.viewMenuButtonStyle}
                    buttonTextStyle={styles.viewMenuTextStyle}
                />
                {isArrayNonEmpty(props.cartItems) && (
                    <T2SButton
                        title={LOCALIZATION_STRINGS.VIEW_CART}
                        onPress={handleBasketClick}
                        id={VIEW_ID.VIEW_CART_BTN}
                        screenName={SCREEN_OPTIONS.HOME.route_name}
                        buttonStyle={styles.viewMenuButtonStyle}
                        buttonTextStyle={styles.viewMenuTextStyle}
                    />
                )}
            </View>
        </View>
    );
};

const mapStateToProps = (state) => ({
    cartItems: selectCartItems(state),
    isUserLoggedIn: selectHasUserLoggedIn(state),
    storeConfigResponse: state.appState.storeConfigResponse,
    basketStoreID: state.appState.prevStoreConfigResponse?.id
});

const mapDispatchToProps = {
    redirectRouteAction
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenBottomButtons);
